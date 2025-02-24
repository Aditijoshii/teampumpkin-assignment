import React from 'react';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white',
  secondary: 'bg-secondary-200 hover:bg-secondary-300 focus:ring-secondary-500 text-secondary-900',
  success: 'bg-success hover:bg-green-700 focus:ring-green-500 text-white',
  danger: 'bg-danger hover:bg-red-700 focus:ring-red-500 text-white',
  ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-700',
};

const sizes = {
  sm: 'py-1.5 px-3 text-xs',
  md: 'py-2 px-4 text-sm',
  lg: 'py-2.5 px-5 text-base',
  xl: 'py-3 px-6 text-lg',
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  rounded = 'md',
  disabled = false,
  isLoading = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${`rounded-${rounded}`}
        font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-colors duration-200 ease-in-out
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span>{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </button>
  );
};

export default Button;