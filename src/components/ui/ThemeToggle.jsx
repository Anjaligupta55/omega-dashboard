import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDull = theme === 'dull';

  return (
    <Button variant="ghost" onClick={toggleTheme} className="theme-toggle">
      {isDull ? <Moon size={18} /> : <Sun size={18} />}
      <span>{isDull ? 'Dull Mode' : 'Bright Mode'}</span>
    </Button>
  );
};
