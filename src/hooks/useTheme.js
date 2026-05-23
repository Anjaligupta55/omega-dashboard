import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import themeConfig from '../theme-config.json';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('dashboard-theme', themeConfig.theme || 'bright');
  const [color, setColor] = useLocalStorage('dashboard-color', themeConfig.color || 'blue');

  // Watch theme-config.json changes (Vite HMR updates)
  useEffect(() => {
    if (themeConfig.theme) {
      setTheme(themeConfig.theme);
    }
    if (themeConfig.color) {
      setColor(themeConfig.color);
    }
  }, [setTheme, setColor]);

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
