import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from './Icons';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  trend?: 'up' | 'down' | 'flat';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, prefix = '', trend }) => {
  const trendColor = trend === 'up' ? 'text-pine' : trend === 'down' ? 'text-love' : 'text-muted';
  const trendIcon = trend === 'up' ? <ArrowUpIcon className="w-5 h-5" /> : trend === 'down' ? <ArrowDownIcon className="w-5 h-5" /> : null;
  
  return (
    <div className="bg-surface p-4 rounded-lg shadow-md border border-overlay">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-muted">{title}</h3>
        {trend && trend !== 'flat' && <div className={trendColor}>{trendIcon}</div>}
      </div>
      <p className={`text-2xl font-semibold mt-2 ${trendColor}`}>
        {prefix}{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export default StatCard;
