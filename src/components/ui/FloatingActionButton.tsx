import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  disabled?: boolean;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
  position = 'bottom-right',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} z-40 flex items-center justify-center p-4 text-white ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-primary hover:bg-primary-dark'
      } rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      {icon || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default FloatingActionButton;
