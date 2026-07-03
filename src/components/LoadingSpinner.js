import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col justify-center items-center min-h-[400px]">
      <div className={`${spinnerSize} relative`}>
        <div className={`${spinnerSize} rounded-full border-4 border-gray-200`}></div>
        <div className={`${spinnerSize} rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0 left-0`}></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;