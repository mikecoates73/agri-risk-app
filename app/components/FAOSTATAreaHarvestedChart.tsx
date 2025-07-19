'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FAOSTATChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FAOSTATAreaHarvestedChartProps {
  data: FAOSTATChartData | null;
  loading: boolean;
  error: string | null;
}

export default function FAOSTATAreaHarvestedChart({ data, loading, error }: FAOSTATAreaHarvestedChartProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Loading Area Harvested data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-gray-500">No Area Harvested data available for the selected filters</div>
      </div>
    );
  }

  const chartData = {
    labels: data.data.map(point => point.year.toString()),
    datasets: [
      {
        label: `Area Harvested (${data.unit})`,
        data: data.data.map(point => point.value),
        borderColor: 'rgb(34, 197, 94)', // Green color for area harvested
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Area Harvested - ${data.item} (${data.area})`,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: data.unit,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(tickValue: string | number) {
            if (typeof tickValue === 'number') {
              return tickValue.toLocaleString();
            }
            return tickValue;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-96 bg-white rounded-lg shadow-md p-6">
      <Line data={chartData} options={options} />
    </div>
  );
} 