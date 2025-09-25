import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'positive' | 'negative' | 'neutral';
    period?: string;
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'indigo';
  subtitle?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    text: 'text-blue-900',
    border: 'border-blue-100'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    text: 'text-green-900',
    border: 'border-green-100'
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    text: 'text-amber-900',
    border: 'border-amber-100'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    text: 'text-red-900',
    border: 'border-red-100'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    text: 'text-purple-900',
    border: 'border-purple-100'
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    text: 'text-indigo-900',
    border: 'border-indigo-100'
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  subtitle 
}) => {
  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {change && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                change.type === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : change.type === 'negative' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {change.type === 'positive' && '+'}
                {change.value}
                {change.type !== 'neutral' && (change.type === 'positive' ? '↗' : '↘')}
              </span>
            )}
          </div>
          
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          </div>
          
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          
          {change?.period && (
            <p className="text-xs text-gray-400 mt-1">vs {change.period}</p>
          )}
        </div>
        
        <div className={`${colors.bg} ${colors.border} border p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
};