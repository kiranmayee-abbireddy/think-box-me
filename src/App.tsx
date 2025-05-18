import React, { useState, useEffect } from 'react';
import { useTimeBlocks } from './hooks/useTimeBlocks';
import { useTimer } from './hooks/useTimer';
import { ThemeToggle } from './components/ThemeToggle';
import { TimeBlockList } from './components/TimeBlockList';
import { FocusMode } from './components/FocusMode';
import { DailySummary } from './components/DailySummary';
import { AlarmClock, BarChart, PenTool } from 'lucide-react';

function App() {
  const {
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
  } = useTimeBlocks();
  
  const [showSummary, setShowSummary] = useState(false);
  
  // Find the active time block
  const activeBlock = timeBlocks.find(block => block.id === activeBlockId);
  
  // Set up timer for active block
  const { 
    seconds, 
    isRunning, 
    displayTime, 
    startTimer, 
    pauseTimer, 
    toggleTimer 
  } = useTimer({ 
    initialSeconds: activeBlock?.elapsedSeconds || 0,
    autoStart: !!activeBlock?.isActive
  });
  
  // Update elapsed time in the active block
  useEffect(() => {
    if (activeBlockId && seconds > 0) {
      updateElapsedTime(activeBlockId, seconds);
    }
  }, [seconds, activeBlockId]);
  
  // Handlers for time block actions
  const handleStartBlock = (id: string) => {
    startTimeBlock(id);
    startTimer();
  };
  
  const handlePauseBlock = (id: string) => {
    updateTimeBlock(id, { isActive: false });
    pauseTimer();
  };
  
  const handleShowSummary = () => {
    const summary = updateDailySummary();
    setShowSummary(true);
  };

  // Determine which screen to show
  const renderContent = () => {
    if (focusMode && activeBlock) {
      return (
        <FocusMode
          timeBlock={activeBlock}
          onPause={() => handlePauseBlock(activeBlock.id)}
          onComplete={() => completeTimeBlock(activeBlock.id)}
          onExit={toggleFocusMode}
          elapsedTime={displayTime}
          isRunning={isRunning}
          toggleTimer={toggleTimer}
        />
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <AlarmClock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-xl font-bold">TimeBoxMe</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShowSummary}
                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="Show daily summary"
              >
                <BarChart className="w-5 h-5" />
              </button>
              {activeBlock && (
                <button
                  onClick={toggleFocusMode}
                  className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 transition-colors"
                  aria-label="Enter focus mode"
                >
                  <PenTool className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">Focus Mode</span>
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>
        
        <main className="container mx-auto p-4 md:p-6 max-w-4xl">
          <div className="p-4 mb-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-2">Welcome to TimeBoxMe</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Plan your day with time blocks, focus on one task at a time, and track your productivity.
            </p>
          </div>
          
          <TimeBlockList
            timeBlocks={timeBlocks}
            onStartBlock={handleStartBlock}
            onPauseBlock={handlePauseBlock}
            onCompleteBlock={completeTimeBlock}
            onAddBlock={addTimeBlock}
            onUpdateBlock={updateTimeBlock}
            onDeleteBlock={deleteTimeBlock}
            activeBlockId={activeBlockId}
          />
        </main>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
      {showSummary && (
        <DailySummary summary={dailySummary} onClose={() => setShowSummary(false)} />
      )}
    </>
  );
}

export default App;