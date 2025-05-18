import React from 'react';
import { Play, Pause, CheckCircle, Edit, Trash2, Clock } from 'lucide-react';
import { TimeBlock } from '../types/types';
import { formatTime, calculateDuration } from '../utils/time';

interface TimeBlockItemProps {
  timeBlock: TimeBlock;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected: boolean;
}

export const TimeBlockItem: React.FC<TimeBlockItemProps> = ({
  timeBlock,
  onStart,
  onPause,
  onComplete,
  onEdit,
  onDelete,
  isSelected
}) => {
  const { title, startTime, endTime, description, isComplete, isActive, elapsedSeconds } = timeBlock;
  
  // Calculate total duration of the time block in seconds
  const totalDuration = calculateDuration(startTime, endTime);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(Math.round((elapsedSeconds / totalDuration) * 100), 100);
  
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-3 border-l-4 transition-all 
        ${isComplete ? 'border-green-500 dark:border-green-600' : 
          isActive ? 'border-amber-500 dark:border-amber-600' : 
          'border-indigo-500 dark:border-indigo-600'}
        ${isSelected ? 'ring-2 ring-indigo-300 dark:ring-indigo-700' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center space-x-1">
          <button 
            onClick={onEdit} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
            aria-label="Edit time block"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete} 
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1"
            aria-label="Delete time block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
        <Clock className="w-4 h-4 mr-1" />
        <span>{startTime} - {endTime}</span>
      </div>
      
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {description}
        </p>
      )}
      
      {!isComplete && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-3">
          <div 
            className={`h-2.5 rounded-full ${isActive ? 'bg-amber-500 dark:bg-amber-600' : 'bg-indigo-500 dark:bg-indigo-600'}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {isComplete ? (
            <span className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </span>
          ) : (
            <span>
              {formatTime(elapsedSeconds)} / {formatTime(totalDuration)}
            </span>
          )}
        </div>
        
        {!isComplete && (
          <div className="flex space-x-2">
            {isActive ? (
              <button
                onClick={onPause}
                className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm"
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </button>
            ) : (
              <button
                onClick={onStart}
                className="flex items-center px-3 py-1 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900 dark:hover:bg-indigo-800 text-indigo-800 dark:text-indigo-200 rounded-md text-sm"
              >
                <Play className="w-4 h-4 mr-1" />
                Start
              </button>
            )}
            
            <button
              onClick={onComplete}
              className="flex items-center px-3 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-800 dark:text-green-200 rounded-md text-sm"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};