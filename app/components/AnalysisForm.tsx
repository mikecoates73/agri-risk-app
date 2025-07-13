'use client';

import { useState } from 'react';
import { AnalysisRequest, AnalysisResponse, WorldBankStats, WeatherData, TradingEconomicsStats, NASAImagery } from '../../types';
import AnalysisResult from './AnalysisResult';

export default function AnalysisForm() {
  const [formData, setFormData] = useState<AnalysisRequest>({
    country: '',
    crop: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear previous errors when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.country.trim()) {
      setError('Please enter a country name');
      return false;
    }
    if (!formData.crop.trim()) {
      setError('Please enter a crop name');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: AnalysisResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderWorldBankStats = (stats: WorldBankStats) => (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center mb-3">
        <div className="mr-3">
          <img 
            src="/images/icons/world-bank-logo.png" 
            alt="World Bank Logo" 
            className="w-8 h-8 object-contain"
          />
        </div>
        <h3 className="text-sm font-medium text-blue-900">Agricultural Statistics</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-blue-700 font-medium">Agricultural Land:</span>
          <span className="ml-2 text-blue-600">{stats.agriculturalLand}</span>
        </div>
        <div>
          <span className="text-blue-700 font-medium">Cereal Yield:</span>
          <span className="ml-2 text-blue-600">{stats.cerealYield}</span>
        </div>
        <div>
          <span className="text-blue-700 font-medium">Rural Population:</span>
          <span className="ml-2 text-blue-600">{stats.ruralPopulation}</span>
        </div>
        <div>
          <span className="text-blue-700 font-medium">Agriculture GDP:</span>
          <span className="ml-2 text-blue-600">{stats.agriculturalValueAdded}</span>
        </div>
      </div>
    </div>
  );

  const renderWeatherData = (weather: WeatherData) => (
    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center mb-3">
        <div className="mr-3">
          <img 
            src="/images/icons/open-weather-logo.png" 
            alt="OpenWeather Logo" 
            className="w-8 h-8 object-contain"
          />
        </div>
        <h3 className="text-sm font-medium text-green-900">Current Weather in {weather.location}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-green-700 font-medium">Temperature:</span>
          <span className="ml-2 text-green-600">{weather.temperature}</span>
        </div>
        <div>
          <span className="text-green-700 font-medium">Conditions:</span>
          <span className="ml-2 text-green-600 capitalize">{weather.description}</span>
        </div>
        <div>
          <span className="text-green-700 font-medium">Humidity:</span>
          <span className="ml-2 text-green-600">{weather.humidity}</span>
        </div>
        <div>
          <span className="text-green-700 font-medium">Wind Speed:</span>
          <span className="ml-2 text-green-600">{weather.windSpeed}</span>
        </div>
      </div>
    </div>
  );



  const renderTradingEconomicsStats = (tradingStats: TradingEconomicsStats) => (
    <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
      <div className="flex items-center mb-3">
        <div className="mr-3 w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">TE</span>
        </div>
        <h3 className="text-sm font-medium text-purple-900">Trading Economics Data</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-purple-700 font-medium">Commodity Price:</span>
          <span className="ml-2 text-purple-600">{tradingStats.commodityPrice}</span>
        </div>
        <div>
          <span className="text-purple-700 font-medium">Inflation Rate:</span>
          <span className="ml-2 text-purple-600">{tradingStats.inflationRate}</span>
        </div>
        <div>
          <span className="text-purple-700 font-medium">GDP Growth:</span>
          <span className="ml-2 text-purple-600">{tradingStats.gdpGrowth}</span>
        </div>
        <div>
          <span className="text-purple-700 font-medium">Exchange Rate:</span>
          <span className="ml-2 text-purple-600">{tradingStats.exchangeRate}</span>
        </div>
        <div>
          <span className="text-purple-700 font-medium">Interest Rate:</span>
          <span className="ml-2 text-purple-600">{tradingStats.interestRate}</span>
        </div>
      </div>
    </div>
  );

  const renderNASAImagery = (nasaData: NASAImagery) => (
    <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
      <div className="flex items-center mb-3">
        <div className="mr-3 w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">NASA</span>
        </div>
        <h3 className="text-sm font-medium text-teal-900">NASA Satellite Imagery</h3>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <div className="w-full h-48 bg-teal-100 border border-teal-200 rounded-lg flex items-center justify-center overflow-hidden">
            {nasaData.imageUrl ? (
              <img 
                src={nasaData.imageUrl} 
                alt="NASA Satellite Image" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image and show placeholder text if it fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
                onLoad={(e) => {
                  // Hide loading placeholder when image loads successfully
                  e.currentTarget.nextElementSibling?.classList.add('hidden');
                }}
              />
            ) : null}
            <div className={`text-center ${nasaData.imageUrl ? '' : ''}`}>
              <div className="text-teal-600 text-lg font-medium mb-2">🛰️</div>
              <div className="text-teal-700 text-sm">NASA Satellite Image</div>
              <div className="text-teal-600 text-xs mt-1">
                {nasaData.imageUrl ? 'Loading...' : 'No image available'}
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-2 py-1 rounded">
            {nasaData.resolution}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-teal-700 font-medium">Layer:</span>
            <span className="ml-2 text-teal-600">{nasaData.layer}</span>
          </div>
          <div>
            <span className="text-teal-700 font-medium">Acquisition Date:</span>
            <span className="ml-2 text-teal-600">{nasaData.acquisitionDate}</span>
          </div>
          <div>
            <span className="text-teal-700 font-medium">Coverage:</span>
            <span className="ml-2 text-teal-600">{nasaData.coverage}</span>
          </div>
        </div>
        
        <div className="text-sm text-teal-600 bg-teal-100 p-2 rounded">
          {nasaData.description}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="Enter country name (e.g., United States, India, Brazil)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={loading}
            />
            {result?.worldBankStats && renderWorldBankStats(result.worldBankStats)}

            {result?.tradingEconomicsStats && renderTradingEconomicsStats(result.tradingEconomicsStats)}
            {result?.nasaImagery && renderNASAImagery(result.nasaImagery)}
            {result?.weatherData && renderWeatherData(result.weatherData)}
          </div>

          <div>
            <label htmlFor="crop" className="block text-sm font-medium text-gray-700 mb-2">
              Crop
            </label>
            <input
              type="text"
              id="crop"
              name="crop"
              value={formData.crop}
              onChange={handleInputChange}
              placeholder="Enter crop name (e.g., Corn, Rice, Wheat)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing...
            </div>
          ) : (
            'Generate SWOT Analysis'
          )}
        </button>
      </form>

      {result && <AnalysisResult result={result} country={formData.country} crop={formData.crop} />}
    </div>
  );
} 