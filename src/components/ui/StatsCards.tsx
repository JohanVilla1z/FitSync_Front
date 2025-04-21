import React from 'react';

export interface StatItem {
  title: string;
  value: number | string;
  color?: 'default' | 'green' | 'amber' | 'red' | 'blue';
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

interface StatsCardsProps {
  stats: StatItem[];
  isLoading?: boolean;
}

const StatsCards = ({ stats, isLoading = false }: StatsCardsProps) => {
  const getColorClass = (color: StatItem['color']) => {
    switch (color) {
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'amber':
        return 'text-amber-600 dark:text-amber-400';
      case 'red':
        return 'text-red-600 dark:text-red-400';
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      default:
        return '';
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {isLoading
        ? Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="animate-pulse">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))
        : stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {stat.title}
                </h3>
                {stat.icon && <div>{stat.icon}</div>}
              </div>
              <p className={`text-2xl font-bold ${getColorClass(stat.color)}`}>
                {stat.value}
              </p>
              {stat.footer && <div className="mt-2 text-sm">{stat.footer}</div>}
            </div>
          ))}
    </section>
  );
};

export default StatsCards;
