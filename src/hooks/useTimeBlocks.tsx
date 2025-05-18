import { useState, useEffect } from 'react';
import { TimeBlock, TimeBlockFormData, DailySummary } from '../types/types';
import { saveTimeBlocks, getTimeBlocks, saveDailySummary } from '../utils/storage';
import { isBlockCurrentlyActive, getTodayDateString, calculateDuration } from '../utils/time';

export const useTimeBlocks = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(getTimeBlocks());
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [dailySummary, setDailySummary] = useState<DailySummary>({
    date: getTodayDateString(),
    completedBlocks: 0,
    missedBlocks: 0,
    totalTimeInSeconds: 0
  });

  // Load time blocks from storage on mount
  useEffect(() => {
    const loadedBlocks = getTimeBlocks();
    
    // Check for currently active blocks based on time
    const updatedBlocks = loadedBlocks.map(block => {
      const shouldBeActive = isBlockCurrentlyActive(block.startTime, block.endTime);
      
      // If a block should be active, set it as the active block
      if (shouldBeActive && !activeBlockId) {
        setActiveBlockId(block.id);
      }
      
      return {
        ...block,
        isActive: block.isActive || shouldBeActive
      };
    });
    
    setTimeBlocks(updatedBlocks);
  }, []);

  // Save time blocks to storage whenever they change
  useEffect(() => {
    saveTimeBlocks(timeBlocks);
  }, [timeBlocks]);

  // Add a new time block
  const addTimeBlock = (blockData: TimeBlockFormData): void => {
    const newBlock: TimeBlock = {
      ...blockData,
      id: crypto.randomUUID(),
      isComplete: false,
      isActive: false,
      elapsedSeconds: 0
    };
    
    setTimeBlocks(prev => [...prev, newBlock]);
  };

  // Update an existing time block
  const updateTimeBlock = (id: string, blockData: Partial<TimeBlock>): void => {
    setTimeBlocks(prev => 
      prev.map(block => 
        block.id === id ? { ...block, ...blockData } : block
      )
    );
  };

  // Delete a time block
  const deleteTimeBlock = (id: string): void => {
    // If deleting the active block, exit focus mode
    if (id === activeBlockId) {
      setActiveBlockId(null);
      setFocusMode(false);
    }
    
    setTimeBlocks(prev => prev.filter(block => block.id !== id));
  };

  // Start a time block
  const startTimeBlock = (id: string): void => {
    // First, ensure no other blocks are active
    setTimeBlocks(prev => 
      prev.map(block => ({
        ...block,
        isActive: block.id === id
      }))
    );
    
    setActiveBlockId(id);
  };

  // Complete a time block
  const completeTimeBlock = (id: string): void => {
    setTimeBlocks(prev => 
      prev.map(block => 
        block.id === id 
          ? { ...block, isComplete: true, isActive: false } 
          : block
      )
    );
    
    if (id === activeBlockId) {
      setActiveBlockId(null);
      setFocusMode(false);
    }
    
    // Update daily summary
    updateDailySummary();
  };

  // Update the elapsed time for a block
  const updateElapsedTime = (id: string, seconds: number): void => {
    setTimeBlocks(prev => 
      prev.map(block => 
        block.id === id 
          ? { ...block, elapsedSeconds: seconds } 
          : block
      )
    );
  };

  // Toggle focus mode
  const toggleFocusMode = (): void => {
    setFocusMode(prev => !prev);
  };

  // Generate daily summary
  const updateDailySummary = (): void => {
    const completed = timeBlocks.filter(block => block.isComplete).length;
    const missed = timeBlocks.filter(block => 
      !block.isComplete && 
      !isBlockCurrentlyActive(block.startTime, block.endTime)
    ).length;
    
    const totalSeconds = timeBlocks.reduce((sum, block) => sum + block.elapsedSeconds, 0);
    
    const summary: DailySummary = {
      date: getTodayDateString(),
      completedBlocks: completed,
      missedBlocks: missed,
      totalTimeInSeconds: totalSeconds
    };
    
    setDailySummary(summary);
    saveDailySummary(summary);
    
    return summary;
  };

  return {
    timeBlocks,
    activeBlockId,
    focusMode,
    dailySummary,
    addTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    startTimeBlock,
    completeTimeBlock,
    updateElapsedTime,
    toggleFocusMode,
    updateDailySummary
  };
};