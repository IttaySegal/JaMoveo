import React, { useState, useEffect, useCallback } from 'react';

export default function ScrollToggle({ scrollSpeed = 1 }) {
  const [isScrolling, setIsScrolling] = useState(false);

  const scroll = useCallback(() => {
    if (isScrolling) {
      window.scrollBy({ top: 1, behavior: 'auto' });
    }
  }, [isScrolling]);

  useEffect(() => {
    let intervalId;
    if (isScrolling) {
      intervalId = setInterval(scroll, 50 / scrollSpeed);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isScrolling, scroll, scrollSpeed]);

  const toggleScroll = () => setIsScrolling((prev) => !prev);

  return (
    <button
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg text-sm font-medium transition-colors
        ${isScrolling
          ? 'bg-blue-600 text-white hover:bg-blue-700'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}
      `}
      onClick={toggleScroll}
      aria-label={isScrolling ? 'Stop Auto-scroll' : 'Start Auto-scroll'}
    >
      {isScrolling ? '⏸️' : '▶️'}
    </button>
  );
}
