'use client';

import React, { useState, useEffect } from 'react';
import FAOSTATChart from './FAOSTATChart';
import { FAOSTATChartData } from '@/types';

interface FAOSTATChartCollapsibleProps {
  country: string;
  item: string;
  isVisible: boolean;
}

export default function FAOSTATChartCollapsible({ country, item, isVisible }: FAOSTATChartCollapsibleProps) {
  const [chartData, setChartData] = useState<FAOSTATChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isVisible && country && item && isExpanded) {
      fetchChartData();
    }
  }, [country, item, isVisible, isExpanded]);

  const fetchChartData = async () => {
    if (!country || !item) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/faostat-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ area: country, item }),
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

  if (!isVisible) return null;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">FAOSTAT Historical Data</h3>
            <p className="text-sm text-gray-600">
              {country && item ? `${country} - ${item}` : 'Select country and item to view data'}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6">
          {!country || !item ? (
            <div className="text-center py-8 text-gray-500">
              Please select both country and item to view FAOSTAT data
            </div>
          ) : (
            <>
              <FAOSTATChart data={chartData} loading={loading} error={error} />
              
              {chartData && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500">Data Points</p>
                    <p className="text-xl font-bold text-blue-600">{chartData.data.length}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500">Year Range</p>
                    <p className="text-xl font-bold text-blue-600">
                      {chartData.data[0]?.year} - {chartData.data[chartData.data.length - 1]?.year}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500">Unit</p>
                    <p className="text-xl font-bold text-blue-600">{chartData.unit}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 