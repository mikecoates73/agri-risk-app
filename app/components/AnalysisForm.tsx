'use client';

import { useState } from 'react';
import { AnalysisRequest, AnalysisResponse } from '../../types';
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

      {result && <AnalysisResult result={result} />}
    </div>
  );
} 