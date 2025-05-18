export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const pad = (num: number): string => num.toString().padStart(2, '0');
  
  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
};

export const parseTimeToSeconds = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours * 3600) + (minutes * 60);
};

export const getTimeOfDay = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const formatDateForDisplay = (date: Date = new Date()): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
};

export const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = parseTimeToSeconds(startTime);
  const end = parseTimeToSeconds(endTime);
  
  // Handle cases where end time is on the next day
  return end >= start ? end - start : (24 * 3600) - start + end;
};

export const isBlockCurrentlyActive = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTimeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  
  const current = parseTimeToSeconds(currentTimeString);
  const start = parseTimeToSeconds(startTime);
  const end = parseTimeToSeconds(endTime);
  
  if (start < end) {
    return current >= start && current < end;
  } else {
    // Handle blocks that span midnight
    return current >= start || current < end;
  }
};