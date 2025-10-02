import React from 'react';
import { Divide as LucideIcon } from 'lucide-react';

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

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  subtitle 
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {change && (
          <span className={`text-xs font-medium ${
            change.type === 'positive' 
              ? 'text-green-600' 
              : change.type === 'negative' 
                ? 'text-red-600' 
                : 'text-gray-600'
          }`}>
            {change.type === 'positive' && '+'}
            {change.value}
          </span>
        )}
      </div>
      
      <div className="mb-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      
      <div className="mt-auto">
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        
        {change?.period && (
          <p className="text-xs text-gray-400">vs {change.period}</p>
        )}
      </div>
    </div>
  );
};