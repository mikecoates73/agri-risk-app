'use client';

import React, { useState, useEffect } from 'react';
import { FAOSTATFilterRequest } from '@/types';

interface FAOSTATFilterProps {
  onFilterChange: (filters: FAOSTATFilterRequest) => void;
  loading: boolean;
}

export default function FAOSTATFilter({ onFilterChange, loading }: FAOSTATFilterProps) {
  const [areas, setAreas] = useState<string[]>([]);
  const [items, setItems] = useState<Array<{ id: number; "Item Code (FAO)": number; "Item": string }>>([]);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    fetchAreas();
    fetchItems();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await fetch('/api/faostat-areas');
      const data = await response.json();
      
      if (response.ok) {
        setAreas(data.areas);
      } else {
        console.error('Failed to fetch areas:', data.error);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoadingAreas(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/faostat');
      const data = await response.json();
      
      if (response.ok) {
        setItems(data.items);
      } else {
        console.error('Failed to fetch items:', data.error);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleAreaChange = (area: string) => {
    setSelectedArea(area);
    if (selectedItem) {
      onFilterChange({ area, item: selectedItem });
    }
  };

  const handleItemChange = (item: string) => {
    setSelectedItem(item);
    if (selectedArea) {
      onFilterChange({ area: selectedArea, item });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">FAOSTAT Data Filter</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="area-select" className="block text-sm font-medium text-gray-700 mb-2">
            Country/Area
          </label>
          <select
            id="area-select"
            value={selectedArea}
            onChange={(e) => handleAreaChange(e.target.value)}
            disabled={loadingAreas || loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select a country/area</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          {loadingAreas && (
            <p className="text-sm text-gray-500 mt-1">Loading areas...</p>
          )}
        </div>

        <div>
          <label htmlFor="item-select" className="block text-sm font-medium text-gray-700 mb-2">
            Item
          </label>
          <select
            id="item-select"
            value={selectedItem}
            onChange={(e) => handleItemChange(e.target.value)}
            disabled={loadingItems || loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select an item</option>
            {items.map((item) => (
              <option key={item.id} value={item.Item}>
                {item.Item}
              </option>
            ))}
          </select>
          {loadingItems && (
            <p className="text-sm text-gray-500 mt-1">Loading items...</p>
          )}
        </div>
      </div>

      {selectedArea && selectedItem && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong> {selectedArea} - {selectedItem}
          </p>
        </div>
      )}
    </div>
  );
} 