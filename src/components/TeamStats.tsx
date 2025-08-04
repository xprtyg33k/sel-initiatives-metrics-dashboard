'use client';

import React from 'react';
import { TeamStats as TeamStatsType } from '@/types';

interface TeamStatsProps {
  teamStats: TeamStatsType[];
}

export function TeamStats({ teamStats }: TeamStatsProps) {
  if (teamStats.length === 0) {
    return null;
  }

  return (
    <div className="team-breakdown grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
      {teamStats.map((team) => (
        <div key={team.name} className="team-card bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-primary-700 font-semibold text-lg mb-4">{team.name}</h4>
          
          <div className="team-stats flex justify-around">
            <div className="team-stat text-center">
              <div className="number text-2xl font-bold text-gray-800">{team.total}</div>
              <div className="label text-xs text-gray-600 uppercase tracking-wide">Total</div>
            </div>
            
            <div className="team-stat text-center">
              <div className="number text-2xl font-bold text-gray-800">{team.blocked}</div>
              <div className="label text-xs text-gray-600 uppercase tracking-wide">Blocked</div>
            </div>
            
            <div className="team-stat text-center">
              <div className="number text-2xl font-bold text-gray-800">{team.avgDays}</div>
              <div className="label text-xs text-gray-600 uppercase tracking-wide">Avg Days</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
