import React from 'react';
import { Keyword } from '../types';

interface VisibilityChartProps {
  keywords: Keyword[];
}

export const VisibilityChart: React.FC<VisibilityChartProps> = ({ keywords }) => {
  // Calculate visibility trend over time
  const dates = keywords[0]?.history.map(h => h.date) || [];
  const visibilityData = dates.map(date => {
    const totalVisibility = keywords.reduce((sum, keyword) => {
      const historyEntry = keyword.history.find(h => h.date === date);
      return sum + (historyEntry?.visibility || 0);
    }, 0);
    return {
      date,
      visibility: totalVisibility / keywords.length
    };
  });

  const maxVisibility = Math.max(...visibilityData.map(d => d.visibility), 50);
  const chartHeight = 200;
  const chartWidth = 600;
  
  const points = visibilityData.map((entry, index) => {
    const x = (index / (visibilityData.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - 20 - ((chartHeight - 40) * entry.visibility / maxVisibility);
    return { x, y, visibility: entry.visibility, date: entry.date };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaData = `${pathData} L ${points[points.length - 1]?.x || 0} ${chartHeight - 20} L 20 ${chartHeight - 20} Z`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Zichtbaarheid Trend</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Gemiddelde Zichtbaarheid</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <svg width={chartWidth} height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => {
            const y = chartHeight - 20 - ((chartHeight - 40) * value / maxVisibility);
            return (
              <g key={value}>
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
                  {value}%
                </text>
              </g>
            );
          })}
          
          {/* Area fill */}
          <path
            d={areaData}
            fill="url(#visibilityGradient)"
            opacity={0.3}
          />
          
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
                <title>{`${point.visibility.toFixed(1)}% visibility on ${new Date(point.date).toLocaleDateString()}`}</title>
              </circle>
            </g>
          ))}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="visibilityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Y-axis label */}
        <div className="absolute left-0 top-1/2 transform -rotate-90 -translate-y-1/2 text-xs text-gray-500">
          Zichtbaarheid %
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-5 text-xs text-gray-500">
          <span>{new Date(visibilityData[0]?.date).toLocaleDateString()}</span>
          <span>{new Date(visibilityData[visibilityData.length - 1]?.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};