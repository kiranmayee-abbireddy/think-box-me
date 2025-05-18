import React, { useEffect } from 'react';
import { Pause, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { TimeBlock } from '../types/types';
import { formatTime, calculateDuration } from '../utils/time';

interface FocusModeProps {
  timeBlock: TimeBlock;
  onPause: () => void;
  onComplete: () => void;
  onExit: () => void;
  elapsedTime: string;
  isRunning: boolean;
  toggleTimer: () => void;
}

export const FocusMode: React.FC<FocusModeProps> = ({
  timeBlock,
  onPause,
  onComplete,
  onExit,
  elapsedTime,
  isRunning,
  toggleTimer
}) => {
  const { title, startTime, endTime, description } = timeBlock;
  
  // Calculate total duration of the time block in seconds
  const totalDuration = calculateDuration(startTime, endTime);
  const totalDurationFormatted = formatTime(totalDuration);
  
  // Calculate percentage of time elapsed
  const elapsedSeconds = timeBlock.elapsedSeconds;
  const progressPercentage = Math.min(Math.round((elapsedSeconds / totalDuration) * 100), 100);
  
  // Update the document title to show the current focus session
  useEffect(() => {
    const originalTitle = document.title;
    document.title = `${elapsedTime} - ${title} | TimeBoxMe`;
    
    return () => {
      document.title = originalTitle;
    };
  }, [elapsedTime, title]);
  
  // Use pseudo-random index based on title for background gradient
  const gradientIndex = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5;
  const gradients = [
    'bg-gradient-to-br from-indigo-800 to-purple-700',
    'bg-gradient-to-br from-blue-800 to-indigo-700',
    'bg-gradient-to-br from-teal-800 to-blue-700',
    'bg-gradient-to-br from-emerald-800 to-teal-700',
    'bg-gradient-to-br from-violet-800 to-indigo-700'
  ];
  
  return (
    <div className={`min-h-screen ${gradients[gradientIndex]} text-white flex flex-col items-center justify-center p-6 animate-fade-in`}>
      <button 
        onClick={onExit}
        className="absolute top-4 left-4 flex items-center text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Exit Focus Mode
      </button>
      
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold mb-2 text-center">{title}</h1>
        
        {description && (
          <p className="text-white/80 text-center mb-8 max-w-md mx-auto">
            {description}
          </p>
        )}
        
        <div className="flex justify-center items-center space-x-3 mb-6">
          <Clock className="w-5 h-5" />
          <span>{startTime} - {endTime}</span>
        </div>
        
        <div className="mb-12 text-center">
          <div className="text-6xl font-bold mb-2 tabular-nums">
            {elapsedTime}
          </div>
          <div className="text-white/80">
            of {totalDurationFormatted}
          </div>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-4 mb-8">
          <div 
            className="h-4 rounded-full bg-white transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg flex items-center transition-colors"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 mr-2" />
                Resume
              </>
            )}
          </button>
          
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg flex items-center transition-colors"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};