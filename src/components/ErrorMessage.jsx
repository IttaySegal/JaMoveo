import React from 'react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-md animate-slide-down">
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <p className="flex-1 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 text-sm text-red-700 hover:text-red-900 underline"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
