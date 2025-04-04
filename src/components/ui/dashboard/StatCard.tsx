import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  isLoading?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBgColor,
  iconColor,
  trend,
  isLoading = false,
}: StatCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <div className={`${iconBgColor} p-3 rounded-full`}>
          <Icon size={24} className={iconColor} />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {isLoading ? (
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
      ) : (
        <p className="text-3xl font-bold">{value}</p>
      )}

      {trend && !isLoading && (
        <p
          className={`${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} text-sm mt-2 flex items-center gap-1`}
        >
          <span>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            {trend.label}
          </span>
        </p>
      )}
    </div>
  );
};
