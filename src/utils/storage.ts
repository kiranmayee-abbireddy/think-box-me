import { TimeBlock, DailySummary } from '../types/types';

const TIME_BLOCKS_KEY = 'timeboxme-blocks';
const SUMMARY_KEY = 'timeboxme-summary';
const THEME_KEY = 'timeboxme-theme';

export const saveTimeBlocks = (timeBlocks: TimeBlock[]): void => {
  localStorage.setItem(TIME_BLOCKS_KEY, JSON.stringify(timeBlocks));
};

export const getTimeBlocks = (): TimeBlock[] => {
  const storedBlocks = localStorage.getItem(TIME_BLOCKS_KEY);
  return storedBlocks ? JSON.parse(storedBlocks) : [];
};

export const saveDailySummary = (summary: DailySummary): void => {
  localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
};

export const getDailySummary = (): DailySummary | null => {
  const storedSummary = localStorage.getItem(SUMMARY_KEY);
  return storedSummary ? JSON.parse(storedSummary) : null;
};

export const saveThemePreference = (isDark: boolean): void => {
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
};

export const getThemePreference = (): boolean => {
  const theme = localStorage.getItem(THEME_KEY);
  // If no preference is stored, default to system preference
  if (!theme) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return theme === 'dark';
};