'use client';

import React, { useState, useEffect, useCallback } from 'react';
import FAOSTATAreaHarvestedChart from './FAOSTATAreaHarvestedChart';
import { FAOSTATChartData } from '@/types';

interface FAOSTATAreaHarvestedCollapsibleProps {
  country: string;
  item: string;
  isVisible: boolean;
}

export default function FAOSTATAreaHarvestedCollapsible({ country, item, isVisible }: FAOSTATAreaHarvestedCollapsibleProps) {
  const [chartData, setChartData] = useState<FAOSTATChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchChartData = useCallback(async () => {
    if (!country || !item) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/faostat-area-harvested', {
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
        setError(data.error || 'Failed to fetch Area Harvested data');
        setChartData(null);
      }
    } catch (error) {
      console.error('Error fetching Area Harvested data:', error);
      setError('An unexpected error occurred');
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [country, item]);

  useEffect(() => {
    if (isVisible && country && item && isExpanded) {
      fetchChartData();
    }
  }, [country, item, isVisible, isExpanded, fetchChartData]);

  if (!isVisible) return null;

  return (
    <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
      >
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold text-gray-900">Area Harvested Data</h3>
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
              Please select both country and item to view Area Harvested data
            </div>
          ) : (
            <>
              <FAOSTATAreaHarvestedChart data={chartData} loading={loading} error={error} />
              
              {chartData && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-500">Data Points</p>
                    <p className="text-xl font-bold text-green-600">{chartData.data.length}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-500">Year Range</p>
                    <p className="text-xl font-bold text-green-600">
                      {chartData.data[0]?.year} - {chartData.data[chartData.data.length - 1]?.year}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-500">Unit</p>
                    <p className="text-xl font-bold text-green-600">{chartData.unit}</p>
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