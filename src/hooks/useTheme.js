import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('dashboard-theme', 'bright');
  const [color, setColor] = useLocalStorage('dashboard-color', 'blue');

  useEffect(() => {
    if (theme === 'dull') {
      document.documentElement.setAttribute('data-theme', 'dull');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-color', color);
  }, [color]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'bright' ? 'dull' : 'bright');
  };

  const changeColor = (newColor) => {
    setColor(newColor);
  };

  return { theme, toggleTheme, color, changeColor };
}
