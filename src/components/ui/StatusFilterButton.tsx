interface StatusFilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: 'default' | 'green' | 'amber' | 'red';
}

const StatusFilterButton = ({
  label,
  active,
  onClick,
  color = 'default',
}: StatusFilterButtonProps) => {
  const baseClasses =
    'px-3 py-1 text-sm rounded-full transition-colors font-medium';

  const colorClasses = {
    default: active
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    green: active
      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    amber: active
      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    red: active
      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  };

  return (
    <button
      className={`${baseClasses} ${colorClasses[color]}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default StatusFilterButton;
