import React from 'react';

const Loading = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div 
        className={`${sizeClasses[size] || sizeClasses.md} border-teal/10 border-t-teal rounded-full animate-spin`}
      />
      {fullPage && (
        <span className="text-navy/60 font-medium tracking-wide text-sm">
          Loading ClinicFlow...
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 w-full">
      {spinner}
    </div>
  );
};

export default Loading;
