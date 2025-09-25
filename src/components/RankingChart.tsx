import React from 'react';
import { Keyword } from '../types';

interface RankingChartProps {
  keyword: Keyword;
}

export const RankingChart: React.FC<RankingChartProps> = ({ keyword }) => {
  const maxRank = Math.max(...keyword.history.map(h => h.rank || 0), 50);
  const chartHeight = 200;
  const chartWidth = 400;
  
  const points = keyword.history.map((entry, index) => {
    const x = (index / (keyword.history.length - 1)) * (chartWidth - 40) + 20;
    const y = entry.rank 
      ? chartHeight - 20 - ((chartHeight - 40) * (maxRank - entry.rank) / maxRank)
      : chartHeight / 2;
    return { x, y, rank: entry.rank, date: entry.date };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Ranking Trend</h3>
        <span className="text-sm text-gray-500">{keyword.keyword}</span>
      </div>
      
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[10, 20, 30, 40, 50].map((rank) => {
            const y = chartHeight - 20 - ((chartHeight - 40) * (maxRank - rank) / maxRank);
            return (
              <g key={rank}>
                <line
                  x1={20}
                  y1={y}
                  x2={chartWidth - 20}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth={1}
                />
                <text
                  x={10}
                  y={y + 4}
                  className="text-xs fill-gray-400"
                  textAnchor="end"
                >
                  {rank}
                </text>
              </g>
            );
          })}
          
          {/* Chart line */}
          <path
            d={pathData}
            fill="none"
            stroke="#2563eb"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={4}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={2}
                className="hover:r-6 transition-all duration-200 cursor-pointer"
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={8}
                fill="transparent"
                className="cursor-pointer"
              >
                <title>{`Rank ${point.rank} on ${new Date(point.date).toLocaleDateString()}`}</title>
              </circle>
            </g>
          ))}
        </svg>
        
        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 transform -rotate-90 -translate-y-1/2 text-xs text-gray-500">
          Google Rank
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-5 text-xs text-gray-500">
          <span>{new Date(keyword.history[0]?.date).toLocaleDateString()}</span>
          <span>{new Date(keyword.history[keyword.history.length - 1]?.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};