import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('dashboard-theme', 'bright');

  useEffect(() => {
    if (theme === 'dull') {
      document.documentElement.setAttribute('data-theme', 'dull');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'bright' ? 'dull' : 'bright');
  };

  return { theme, toggleTheme };
}
