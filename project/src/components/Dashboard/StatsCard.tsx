import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    text: 'text-blue-600',
    iconText: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    text: 'text-green-600',
    iconText: 'text-green-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    iconBg: 'bg-yellow-100',
    text: 'text-yellow-600',
    iconText: 'text-yellow-600',
  },
  red: {
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    text: 'text-red-600',
    iconText: 'text-red-600',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    
    text: 'text-purple-600',
    iconText: 'text-purple-600',
  },
};

export default function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  const styles = colorStyles[color];

  return (
    <div className={`${styles.bg} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`${styles.iconBg} p-3 rounded-lg`}>
            <Icon className={`h-6 w-6 ${styles.iconText}`} />
          </div>
        </div>
        <div className="mr-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold ${styles.text}`}>{value}</p>
          {trend && (
            <p className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}