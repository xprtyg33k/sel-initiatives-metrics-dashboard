'use client';

import React from 'react';
import { AnalysisResults } from '@/types';
import { MetricCard } from './MetricCard';
import { Chart } from './Chart';
import { TeamStats } from './TeamStats';
import { Insights } from './Insights';
import { formatDate } from '@/lib/utils';

interface DashboardProps {
  results: AnalysisResults | null;
}

export function Dashboard({ results }: DashboardProps) {
  if (!results) {
    return (
      <div className="dashboard-container max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
        <div className="header text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
            Initiative Metrics Dashboard
          </h1>
          <div className="subtitle text-xl text-gray-600 mb-4">
            Upload a CSV file to get started
          </div>
          <div className="text-sm text-gray-500">
            Ready to analyze your initiative data
          </div>
        </div>

        <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            'Initiative Throughput (Monthly)',
            'Average Days in Progress',
            'Initiative Aging (Stale Items)',
            'Cross-Team Dependencies',
            'Say/Do Ratio',
            'Strategic Coverage',
            'Initiative Lead Time'
          ].map((title) => (
            <div key={title} className="metric-card bg-white rounded-2xl p-6 shadow-lg border-l-4 border-gray-300">
              <h3 className="text-gray-400 mb-4 font-medium text-lg">{title}</h3>
              <div className="metric-value text-4xl font-bold text-gray-300 mb-3">--</div>
              <div className="text-sm text-gray-400">Waiting for data</div>
            </div>
          ))}
        </div>

        <div className="charts-grid grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[
            'Initiative Status Distribution',
            'Strategic Area Allocation',
            'Team Workload Distribution',
            'Days in Progress by Initiative'
          ].map((title) => (
            <div key={title} className="chart-container bg-white rounded-2xl p-6 shadow-lg">
              <div className="chart-title text-xl font-semibold text-gray-400 mb-6 text-center">
                {title}
              </div>
              <div className="h-64 flex items-center justify-center text-gray-400">
                Chart will appear here after data upload
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
      <div className="header text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
          Initiative Metrics Dashboard
        </h1>
        <div className="subtitle text-xl text-gray-600 mb-4">
          Analysis Results
        </div>
        <div className="text-sm text-gray-500">
          Data from {results.sourceFile} • {formatDate(new Date(results.timestamp))}
        </div>
      </div>

      <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <MetricCard 
          title="Initiative Throughput (Monthly)" 
          metric={results.metrics.throughput} 
        />
        <MetricCard 
          title="Average Days in Progress" 
          metric={results.metrics.avgDaysInProgress} 
        />
        <MetricCard 
          title="Initiative Aging (Stale Items)" 
          metric={results.metrics.initiativeAging} 
        />
        <MetricCard 
          title="Cross-Team Dependencies" 
          metric={results.metrics.crossTeamDependencies} 
        />
        <MetricCard 
          title="Say/Do Ratio" 
          metric={results.metrics.sayDoRatio} 
        />
        <MetricCard 
          title="Strategic Coverage" 
          metric={results.metrics.strategicCoverage} 
        />
        <MetricCard 
          title="Initiative Lead Time" 
          metric={results.metrics.leadTime} 
        />
      </div>

      <div className="charts-grid grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Chart
          title="Initiative Status Distribution"
          data={results.charts.statusDistribution}
          type="doughnut"
          height={300}
        />
        <Chart
          title="Strategic Area Allocation"
          data={results.charts.strategicArea}
          type="bar"
          height={300}
        />
        <Chart
          title="Team Workload Distribution"
          data={results.charts.teamWorkload}
          type="horizontalBar"
          height={300}
        />
        <Chart
          title="Days in Progress by Initiative"
          data={results.charts.daysInProgress}
          type="bar"
          height={300}
        />
      </div>

      <TeamStats teamStats={results.teamStats} />
      <Insights insights={results.insights} />
    </div>
  );
}
