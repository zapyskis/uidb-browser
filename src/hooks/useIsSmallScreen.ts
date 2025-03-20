import { useState, useEffect } from 'react';

const DEFAULT_SMALL_SCREEN_BREAKPOINT = 640;

export const useIsSmallScreen = (breakpoint = DEFAULT_SMALL_SCREEN_BREAKPOINT): boolean => {
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(
    typeof window !== 'undefined' && window.innerWidth <= breakpoint,
  );

  useEffect(() => {
    const checkIfSmallScreen = () => {
      setIsSmallScreen(window.innerWidth <= breakpoint);
    };

    checkIfSmallScreen();
    window.addEventListener('resize', checkIfSmallScreen);

    return () => window.removeEventListener('resize', checkIfSmallScreen);
  }, [breakpoint]);

  return isSmallScreen;
};
