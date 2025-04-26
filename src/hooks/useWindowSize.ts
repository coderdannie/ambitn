'use client';

import { useEffect, useState } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number;
    height: number;
    isMobile: boolean;
  }>({
    width: 0,
    height: 0,
    isMobile: false,
  });

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      const isMobile = window.innerWidth < 899;
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile,
      });
    };

    // Set initial values immediately
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect is only run on mount and unmount

  return windowSize;
}
