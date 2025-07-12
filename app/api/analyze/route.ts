import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AnalysisRequest, AnalysisResponse, WorldBankStats } from '../../../types';

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
      const countries = data[1];
      const country = countries.find((c: any) => 
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
    } catch (error: any) {
      // Check if it's a 529 overload error or other retryable error
      const isRetryable = error.status === 529 || 
                         error.status === 429 || 
                         error.status >= 500;
      
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
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    // Provide more specific error messages
    if (error.status === 529) {
      errorMessage = 'Anthropic API is currently overloaded. Please try again in a few moments.';
    } else if (error.status === 429) {
      errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid API key. Please check your configuration.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    const response: AnalysisResponse = {
      analysis: '',
      success: false,
      error: errorMessage,
    };

    return NextResponse.json(response, { status: 500 });
  }
} 