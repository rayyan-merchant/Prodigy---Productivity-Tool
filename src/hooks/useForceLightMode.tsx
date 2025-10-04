
import { useEffect } from 'react';

/**
 * Hook to force light mode on specific pages regardless of site-wide theme setting
 * Used for public pages like landing, authentication, privacy policy, etc.
 */
export const useForceLightMode = () => {
  useEffect(() => {
    // Store the current theme preference
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    
    // Force light mode
    document.documentElement.classList.remove('dark');
    
    // Store original theme in a data attribute for restoration
    document.documentElement.setAttribute('data-original-theme', currentTheme);
    
    // Restore theme preference when component unmounts
    return () => {
      const originalTheme = document.documentElement.getAttribute('data-original-theme');
      if (originalTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      document.documentElement.removeAttribute('data-original-theme');
    };
  }, []);
};

export default useForceLightMode;
