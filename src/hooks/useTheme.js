import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import themeConfig from '../theme-config.json';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('dashboard-theme', themeConfig.theme || 'bright');
  const [color, setColor] = useLocalStorage('dashboard-color', themeConfig.color || 'blue');

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

// Watch theme-config.json changes via Vite HMR
if (import.meta.hot) {
  import.meta.hot.accept('../theme-config.json', (newModule) => {
    if (!newModule) return;
    const config = newModule.default || newModule;
    
    if (config.theme) {
      window.localStorage.setItem('dashboard-theme', JSON.stringify(config.theme));
      if (config.theme === 'dull') {
        document.documentElement.setAttribute('data-theme', 'dull');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      window.dispatchEvent(new CustomEvent('local-storage', {
        detail: { key: 'dashboard-theme', value: config.theme }
      }));
    }
    
    if (config.color) {
      window.localStorage.setItem('dashboard-color', JSON.stringify(config.color));
      document.documentElement.setAttribute('data-color', config.color);
      window.dispatchEvent(new CustomEvent('local-storage', {
        detail: { key: 'dashboard-color', value: config.color }
      }));
    }
  });
}
