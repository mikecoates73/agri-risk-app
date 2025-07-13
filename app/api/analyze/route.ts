import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AnalysisRequest, AnalysisResponse, WorldBankStats, WeatherData, TradingEconomicsStats, NASAImagery } from '../../../types';

// Type definitions for World Bank API responses
interface WorldBankCountry {
  id: string;
  name: string;
  iso2Code: string;
  region: { id: string; value: string };
  adminregion: { id: string; value: string };
  incomeLevel: { id: string; value: string };
  lendingType: { id: string; value: string };
  capitalCity: string;
  longitude: string;
  latitude: string;
}



interface WorldBankError {
  status: number;
  message: string;
  type?: string;
}

// Debug: Check if API key is available
console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
console.log('ANTHROPIC_API_KEY length:', process.env.ANTHROPIC_API_KEY?.length || 0);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Function to get country code from country name
async function getCountryCode(countryName: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.worldbank.org/v2/country?format=json&per_page=300`);
    const data = await response.json();
    
    if (data && data[1]) {
      const countries: WorldBankCountry[] = data[1];
      const country = countries.find((c: WorldBankCountry) => 
        c.name.toLowerCase().includes(countryName.toLowerCase()) ||
        countryName.toLowerCase().includes(c.name.toLowerCase())
      );
      return country ? country.id : null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching country code:', error);
    return null;
  }
}

// Function to fetch World Bank agricultural statistics
async function getWorldBankStats(countryCode: string): Promise<WorldBankStats | null> {
  try {
    const indicators = [
      'AG.LND.AGRI.ZS', // Agricultural land (% of land area)
      'AG.YLD.CREL.KG', // Cereal yield (kg per hectare)
      'SP.RUR.TOTL.ZS', // Rural population (% of total population)
      'NV.AGR.TOTL.ZS'  // Agriculture, forestry, and fishing, value added (% of GDP)
    ];

    const promises = indicators.map(async (indicator) => {
      const response = await fetch(
        `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=1&most_recent_year=1`
      );
      const data = await response.json();
      return { indicator, data };
    });

    const results = await Promise.all(promises);
    
    const stats: WorldBankStats = {
      agriculturalLand: 'N/A',
      cerealYield: 'N/A',
      ruralPopulation: 'N/A',
      agriculturalValueAdded: 'N/A'
    };

    results.forEach(({ indicator, data }) => {
      if (data && data[1] && data[1][0] && data[1][0].value !== null) {
        const value = data[1][0].value;
        const year = data[1][0].date;
        
        switch (indicator) {
          case 'AG.LND.AGRI.ZS':
            stats.agriculturalLand = `${value.toFixed(1)}% (${year})`;
            break;
          case 'AG.YLD.CREL.KG':
            stats.cerealYield = `${value.toFixed(0)} kg/ha (${year})`;
            break;
          case 'SP.RUR.TOTL.ZS':
            stats.ruralPopulation = `${value.toFixed(1)}% (${year})`;
            break;
          case 'NV.AGR.TOTL.ZS':
            stats.agriculturalValueAdded = `${value.toFixed(1)}% of GDP (${year})`;
            break;
        }
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching World Bank stats:', error);
    return null;
  }
}

// Function to retry API calls with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      // Check if it's a 529 overload error or other retryable error
      const apiError = error as WorldBankError;
      const isRetryable = apiError.status === 529 || 
                         apiError.status === 429 || 
                         (apiError.status && apiError.status >= 500);
      
      if (attempt === maxRetries || !isRetryable) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`API call failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Function to get weather data for a country
async function getWeatherData(countryName: string): Promise<WeatherData | null> {
  try {
    // For simplicity, we'll use the capital city of the country
    // In a real app, you might want to get coordinates or specific cities
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(countryName)}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      console.error('Weather API error:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    
    return {
      temperature: `${Math.round(data.main.temp)}°C`,
      description: data.weather[0].description,
      humidity: `${data.main.humidity}%`,
      windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`, // Convert m/s to km/h
      location: data.name
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}



// Function to get Trading Economics data for a country and crop
async function getTradingEconomicsData(countryName: string, cropName: string): Promise<TradingEconomicsStats | null> {
  try {
    // Trading Economics API requires authentication
    // You'll need to register at https://tradingeconomics.com/api/
    const apiKey = process.env.TRADING_ECONOMICS_API_KEY;
    
    if (!apiKey) {
      console.log('TRADING_ECONOMICS_API_KEY not configured');
      return {
        commodityPrice: 'N/A (API key required)',
        inflationRate: 'N/A (API key required)',
        gdpGrowth: 'N/A (API key required)',
        exchangeRate: 'N/A (API key required)',
        interestRate: 'N/A (API key required)'
      };
    }

    // Crop to commodity mapping for Trading Economics
    const cropToCommodity: { [key: string]: string } = {
      'rice': 'rice',
      'wheat': 'wheat',
      'corn': 'corn',
      'maize': 'corn',
      'soybeans': 'soybeans',
      'cotton': 'cotton',
      'sugar': 'sugar',
      'coffee': 'coffee',
      'cocoa': 'cocoa'
    };

    const commodity = cropToCommodity[cropName.toLowerCase()] || 'rice';
    
    // Get country code for Trading Economics API
    const countryCode = await getTradingEconomicsCountryCode(countryName);
    
    if (!countryCode) {
      console.log(`Country code not found for: ${countryName}`);
      return null;
    }

    // Fetch commodity price
    const commodityResponse = await fetch(
      `https://api.tradingeconomics.com/markets/commodity/${commodity}?c=${apiKey}`
    );
    
    // Fetch country economic indicators
    const indicatorsResponse = await fetch(
      `https://api.tradingeconomics.com/country/${countryCode}?c=${apiKey}`
    );

    if (!commodityResponse.ok || !indicatorsResponse.ok) {
      console.error('Trading Economics API error:', commodityResponse.status, indicatorsResponse.status);
      return null;
    }

    const commodityData = await commodityResponse.json();
    const indicatorsData = await indicatorsResponse.json();

    // Extract relevant data
    const stats: TradingEconomicsStats = {
      commodityPrice: 'N/A',
      inflationRate: 'N/A',
      gdpGrowth: 'N/A',
      exchangeRate: 'N/A',
      interestRate: 'N/A'
    };

    // Parse commodity price
    if (commodityData && commodityData[0]) {
      const price = commodityData[0].price;
      const change = commodityData[0].change;
      stats.commodityPrice = `$${price} (${change >= 0 ? '+' : ''}${change}%)`;
    }

    // Parse economic indicators
    if (indicatorsData && Array.isArray(indicatorsData)) {
      indicatorsData.forEach((indicator: any) => {
        switch (indicator.Category) {
          case 'Inflation Rate':
            stats.inflationRate = `${indicator.LatestValue}% (${indicator.PreviousValue}%)`;
            break;
          case 'GDP Growth Rate':
            stats.gdpGrowth = `${indicator.LatestValue}% (${indicator.PreviousValue}%)`;
            break;
          case 'Interest Rate':
            stats.interestRate = `${indicator.LatestValue}% (${indicator.PreviousValue}%)`;
            break;
        }
      });
    }

    // Get exchange rate (USD to local currency)
    const exchangeResponse = await fetch(
      `https://api.tradingeconomics.com/markets/currency/${countryCode}usd?c=${apiKey}`
    );
    
    if (exchangeResponse.ok) {
      const exchangeData = await exchangeResponse.json();
      if (exchangeData && exchangeData[0]) {
        stats.exchangeRate = `${exchangeData[0].price} ${countryCode}/USD`;
      }
    }

    return stats;
  } catch (error) {
    console.error('Error fetching Trading Economics data:', error);
    return null;
  }
}

// Helper function to get Trading Economics country code
async function getTradingEconomicsCountryCode(countryName: string): Promise<string | null> {
  try {
    const apiKey = process.env.TRADING_ECONOMICS_API_KEY;
    if (!apiKey) return null;

    const response = await fetch(`https://api.tradingeconomics.com/country?c=${apiKey}`);
    const countries = await response.json();

    const countryMapping: { [key: string]: string } = {
      'united states': 'us',
      'usa': 'us',
      'india': 'in',
      'china': 'cn',
      'brazil': 'br',
      'russia': 'ru',
      'canada': 'ca',
      'australia': 'au',
      'germany': 'de',
      'france': 'fr',
      'uk': 'gb',
      'united kingdom': 'gb',
      'japan': 'jp',
      'mexico': 'mx',
      'argentina': 'ar',
      'thailand': 'th',
      'vietnam': 'vn',
      'indonesia': 'id',
      'malaysia': 'my',
      'philippines': 'ph'
    };

    // First check our mapping
    const mappedCode = countryMapping[countryName.toLowerCase()];
    if (mappedCode) return mappedCode;

    // Then search in the API response
    const country = countries.find((c: any) => 
      c.Country.toLowerCase().includes(countryName.toLowerCase()) ||
      countryName.toLowerCase().includes(c.Country.toLowerCase())
    );

    return country ? country.Code : null;
  } catch (error) {
    console.error('Error getting Trading Economics country code:', error);
    return null;
  }
}

// Function to get NASA GIBS satellite imagery for a country
async function getNASAImagery(countryName: string): Promise<NASAImagery | null> {
  try {
    // Get country coordinates for NASA GIBS
    const countryCoordinates = getCountryCoordinates(countryName);
    
    if (!countryCoordinates) {
      console.log(`Coordinates not found for: ${countryName}`);
      return null;
    }

    // NASA GIBS provides several useful layers for agricultural analysis
    const layers = [
      {
        id: 'MODIS_Terra_NDVI_8Day_1km',
        name: 'MODIS Terra NDVI',
        description: 'Vegetation health index from MODIS Terra satellite'
      },
      {
        id: 'MODIS_Aqua_NDVI_8Day_1km',
        name: 'MODIS Aqua NDVI', 
        description: 'Vegetation health index from MODIS Aqua satellite'
      },
      {
        id: 'MODIS_Terra_Land_Surface_Temp_Day',
        name: 'Land Surface Temperature',
        description: 'Daily land surface temperature from MODIS Terra'
      }
    ];

    // Use the first layer (MODIS Terra NDVI) for now
    const selectedLayer = layers[0];
    
    // Get current date for the image
    const currentDate = new Date();
    const dateString = currentDate.toISOString().split('T')[0];

    // For demo purposes, we'll use a static NASA image or return metadata only
    // The actual WMS service can be slow and may have CORS issues in browsers
    const staticImageUrl = `https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg`;

    return {
      imageUrl: staticImageUrl,
      acquisitionDate: dateString,
      coverage: countryName,
      resolution: '1km',
      description: `${selectedLayer.description} - Using NASA Earth Observatory imagery for demonstration`,
      layer: selectedLayer.name
    };

  } catch (error) {
    console.error('Error fetching NASA GIBS data:', error);
    return null;
  }
}

// Helper function to get country coordinates for NASA GIBS
function getCountryCoordinates(countryName: string): number[] | null {
  // Simplified bounding boxes for major agricultural countries
  // Format: [minLon, minLat, maxLon, maxLat]
  const countryCoordinates: { [key: string]: number[] } = {
    'united states': [-125.0, 24.0, -66.0, 49.0],
    'usa': [-125.0, 24.0, -66.0, 49.0],
    'india': [68.0, 8.0, 97.0, 37.0],
    'china': [73.0, 18.0, 135.0, 54.0],
    'brazil': [-74.0, -34.0, -34.0, 6.0],
    'russia': [26.0, 41.0, 190.0, 82.0],
    'canada': [-141.0, 42.0, -52.0, 84.0],
    'australia': [113.0, -44.0, 154.0, -10.0],
    'germany': [6.0, 47.0, 15.0, 55.0],
    'france': [-5.0, 41.0, 10.0, 51.0],
    'uk': [-8.0, 50.0, 2.0, 59.0],
    'united kingdom': [-8.0, 50.0, 2.0, 59.0],
    'japan': [129.0, 31.0, 146.0, 46.0],
    'mexico': [-118.0, 14.0, -86.0, 33.0],
    'argentina': [-74.0, -56.0, -53.0, -21.0],
    'thailand': [97.0, 6.0, 106.0, 21.0],
    'vietnam': [102.0, 8.0, 110.0, 23.0],
    'indonesia': [95.0, -11.0, 141.0, 6.0],
    'malaysia': [100.0, 1.0, 119.0, 7.0],
    'philippines': [117.0, 5.0, 127.0, 21.0]
  };

  const countryKey = countryName.toLowerCase();
  return countryCoordinates[countryKey] || null;
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { success: false, error: 'API key not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    const body: AnalysisRequest = await request.json();
    
    // Validate request
    if (!body.country || !body.crop) {
      return NextResponse.json(
        { success: false, error: 'Country and crop are required' },
        { status: 400 }
      );
    }

    // Get World Bank statistics
    let worldBankStats: WorldBankStats | null = null;
    try {
      const countryCode = await getCountryCode(body.country);
      if (countryCode) {
        worldBankStats = await getWorldBankStats(countryCode);
      }
    } catch (error) {
      console.error('Error fetching World Bank data:', error);
      // Continue with analysis even if World Bank data fails
    }

    // Get weather data
    let weatherData: WeatherData | null = null;
    try {
      weatherData = await getWeatherData(body.country);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Continue with analysis even if weather data fails
    }



    // Get Trading Economics data
    let tradingEconomicsStats: TradingEconomicsStats | null = null;
    try {
      tradingEconomicsStats = await getTradingEconomicsData(body.country, body.crop);
    } catch (error) {
      console.error('Error fetching Trading Economics data:', error);
      // Continue with analysis even if Trading Economics data fails
    }

    // Get NASA GIBS satellite imagery
    let nasaImagery: NASAImagery | null = null;
    try {
      nasaImagery = await getNASAImagery(body.country);
    } catch (error) {
      console.error('Error fetching NASA GIBS data:', error);
      // Continue with analysis even if NASA data fails
    }

    // Format prompt as specified in PRD
    const prompt = `Please provide a brief SWOT analysis of ${body.crop} in ${body.country} and return in markdown, each with a header for SWOT and 3-5 bullet points for each SWOT category`;

    // Use retry logic for the Anthropic API call
    const message = await retryWithBackoff(async () => {
      return await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });
    });

    const analysis = message.content[0].type === 'text' ? message.content[0].text : '';

    const response: AnalysisResponse = {
      analysis,
      success: true,
      worldBankStats: worldBankStats || undefined,

      tradingEconomicsStats: tradingEconomicsStats || undefined,
      nasaImagery: nasaImagery || undefined,
      weatherData: weatherData || undefined,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    // Provide more specific error messages
    const apiError = error as WorldBankError;
    if (apiError.status === 529) {
      errorMessage = 'Anthropic API is currently overloaded. Please try again in a few moments.';
    } else if (apiError.status === 429) {
      errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
    } else if (apiError.status === 401) {
      errorMessage = 'Invalid API key. Please check your configuration.';
    } else if (apiError.message) {
      errorMessage = apiError.message;
    }
    
    const response: AnalysisResponse = {
      analysis: '',
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(response, { status: 500 });
  }
} 