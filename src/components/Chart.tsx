'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { ChartData } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  title: string;
  data: ChartData;
  type: 'bar' | 'doughnut' | 'horizontalBar';
  height?: number;
}

export function Chart({ title, data, type, height = 300 }: ChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: type === 'doughnut' ? 'bottom' : 'top',
        display: type === 'doughnut' || (data.datasets[0]?.label ? true : false),
      } as const,
      title: {
        display: false,
      },
    },
    ...(type === 'horizontalBar' && {
      indexAxis: 'y' as const,
    }),
    scales: type !== 'doughnut' ? {
      x: {
        beginAtZero: true,
        ...(type === 'horizontalBar' && {
          title: {
            display: true,
            text: data.datasets[0]?.label || 'Value'
          }
        })
      },
      y: {
        beginAtZero: true,
        ...(type !== 'horizontalBar' && {
          title: {
            display: true,
            text: data.datasets[0]?.label || 'Value'
          }
        })
      },
    } : undefined,
  };

  const renderChart = () => {
    switch (type) {
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      case 'bar':
      case 'horizontalBar':
        return <Bar data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  return (
    <div className="chart-container bg-white rounded-2xl p-6 shadow-lg">
      <div className="chart-title text-xl font-semibold text-gray-800 mb-6 text-center">
        {title}
      </div>
      <div style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
    </div>
  );
}
