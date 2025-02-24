import React from 'react';
import Image from 'next/image';

const sizeMap = {
  xs: { container: 'w-6 h-6', status: 'w-1.5 h-1.5' },
  sm: { container: 'w-8 h-8', status: 'w-2 h-2' },
  md: { container: 'w-10 h-10', status: 'w-2.5 h-2.5' },
  lg: { container: 'w-12 h-12', status: 'w-3 h-3' },
  xl: { container: 'w-16 h-16', status: 'w-4 h-4' },
  '2xl': { container: 'w-20 h-20', status: 'w-5 h-5' },
};

const Avatar = ({
  src,
  alt,
  size = 'md',
  online = false,
  className = '',
  ...props
}) => {
  const { container, status } = sizeMap[size] || sizeMap.md;
  
  return (
    <div className={`relative inline-block ${container} ${className}`} {...props}>
      <div className={`${container} overflow-hidden rounded-full bg-secondary-200`}>
        {src ? (
          <Image
            src={src}
            alt={alt || 'Avatar'}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary-500 text-white">
            {alt ? alt.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </div>
      
      {online !== undefined && (
        <span 
          className={`absolute bottom-0 right-0 block ${status} rounded-full ring-2 ring-white ${
            online ? 'bg-success' : 'bg-secondary-400'
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;