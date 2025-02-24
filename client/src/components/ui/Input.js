import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  fullWidth = true,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label className="block text-secondary-700 text-sm font-medium mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-2.5 text-secondary-900 bg-white border
            ${error ? 'border-danger' : 'border-secondary-300'}
            rounded-lg focus:outline-none focus:ring-2
            ${error ? 'focus:ring-danger/20 focus:border-danger' : 'focus:ring-primary-500/20 focus:border-primary-500'}
            transition-colors duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;