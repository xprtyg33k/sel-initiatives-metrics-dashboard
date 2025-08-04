'use client';

import React from 'react';
import { MetricResult } from '@/types';

interface MetricCardProps {
  title: string;
  metric: MetricResult;
}

export function MetricCard({ title, metric }: MetricCardProps) {
  const getChangeColorClass = (changeType?: string) => {
    switch (changeType) {
      case 'positive':
        return 'bg-green-100 text-green-700';
      case 'negative':
        return 'bg-red-100 text-red-700';
      case 'neutral':
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="metric-card bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl border-l-4 border-primary-500">
      <h3 className="text-primary-600 mb-4 font-medium text-lg">{title}</h3>
      
      <div className="metric-value text-4xl font-bold text-gray-800 mb-3">
        {metric.value}
      </div>
      
      {metric.change && (
        <div className={`metric-change inline-block px-3 py-1 rounded-full text-sm font-medium ${getChangeColorClass(metric.changeType)}`}>
          {metric.change}
        </div>
      )}
      
      {metric.description && (
        <div className="text-sm text-gray-600 mt-3 leading-relaxed">
          {metric.description}
        </div>
      )}
    </div>
  );
}
