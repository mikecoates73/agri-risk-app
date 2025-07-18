'use client';

import React, { useState } from 'react';
import FAOSTATFilter from './FAOSTATFilter';
import FAOSTATChart from './FAOSTATChart';
import { FAOSTATFilterRequest, FAOSTATChartData } from '@/types';

export default function FAOSTATDataViewer() {
  const [chartData, setChartData] = useState<FAOSTATChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = async (filters: FAOSTATFilterRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/faostat-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      const data = await response.json();

      if (response.ok) {
        setChartData(data);
      } else {
        setError(data.error || 'Failed to fetch chart data');
        setChartData(null);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError('An unexpected error occurred');
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          FAOSTAT Data Visualization
        </h1>
        <p className="text-gray-600">
          Explore agricultural data trends by selecting a country and item to view historical data.
        </p>
      </div>

      <FAOSTATFilter onFilterChange={handleFilterChange} loading={loading} />
      
      <FAOSTATChart data={chartData} loading={loading} error={error} />

      {chartData && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Data Points</p>
              <p className="text-2xl font-bold text-blue-600">{chartData.data.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Year Range</p>
              <p className="text-2xl font-bold text-blue-600">
                {chartData.data[0]?.year} - {chartData.data[chartData.data.length - 1]?.year}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Unit</p>
              <p className="text-2xl font-bold text-blue-600">{chartData.unit}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 