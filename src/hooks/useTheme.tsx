import { useState, useEffect } from 'react';
import { saveThemePreference, getThemePreference } from '../utils/storage';

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(getThemePreference());

  useEffect(() => {
    // Apply theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference to localStorage
    saveThemePreference(darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  return { darkMode, toggleTheme };
};