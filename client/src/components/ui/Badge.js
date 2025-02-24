import React from 'react';

const variants = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
};

const sizes = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-0.5',
  lg: 'text-base px-2.5 py-1',
};

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  className = '',
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-medium
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        rounded-${rounded}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;