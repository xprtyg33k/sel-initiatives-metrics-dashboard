'use client';

import React from 'react';
import { Insight } from '@/types';

interface InsightsProps {
  insights: Insight[];
}

export function Insights({ insights }: InsightsProps) {
  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="insights-section bg-white rounded-2xl p-8 shadow-lg mt-8">
      <h2 className="text-primary-600 text-2xl font-bold mb-6">Key Insights & Observations</h2>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div 
            key={index} 
            className="insight-item p-4 border-l-4 border-primary-500 bg-gradient-to-r from-primary-50 to-transparent rounded-r-xl"
          >
            <h4 className="text-gray-800 font-medium mb-2 text-lg">{insight.title}</h4>
            <p className="text-gray-600 leading-relaxed">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
