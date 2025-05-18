export interface TimeBlock {
  id: string;
  title: string;
  startTime: string; // Format: HH:MM
  endTime: string; // Format: HH:MM
  description?: string;
  isComplete: boolean;
  isActive: boolean;
  elapsedSeconds: number;
}

export type TimeBlockFormData = Omit<TimeBlock, 'id' | 'isComplete' | 'isActive' | 'elapsedSeconds'>;

export interface DailySummary {
  date: string;
  completedBlocks: number;
  missedBlocks: number;
  totalTimeInSeconds: number;
}