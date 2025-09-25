import React from 'react';
import { RankDistribution } from '../types';

interface RankDistributionChartProps {
  data: RankDistribution;
}

export const RankDistributionChart: React.FC<RankDistributionChartProps> = ({ data }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  
  const segments = [
    { label: 'Top 3', value: data.topThree, color: 'bg-green-500', textColor: 'text-green-700' },
    { label: '4-10', value: data.fourToTen, color: 'bg-blue-500', textColor: 'text-blue-700' },
    { label: '11-20', value: data.elevenToTwenty, color: 'bg-amber-500', textColor: 'text-amber-700' },
    { label: '21-50', value: data.twentyOneToFifty, color: 'bg-orange-500', textColor: 'text-orange-700' },
    { label: '51-100', value: data.fiftyOneToHundred, color: 'bg-red-500', textColor: 'text-red-700' },
    { label: 'Niet Gerangschikt', value: data.notRanking, color: 'bg-gray-400', textColor: 'text-gray-700' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Ranking Verdeling</h3>
      
      {/* Progress Bar */}
      <div className="flex rounded-lg overflow-hidden mb-6 h-3">
        {segments.map((segment, index) => {
          const percentage = total > 0 ? (segment.value / total) * 100 : 0;
          return (
            <div
              key={index}
              className={segment.color}
              style={{ width: `${percentage}%` }}
              title={`${segment.label}: ${segment.value} keywords (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4">
        {segments.map((segment, index) => {
          const percentage = total > 0 ? (segment.value / total) * 100 : 0;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${segment.color}`} />
                <span className="text-sm text-gray-600">{segment.label}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{segment.value}</div>
                <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};