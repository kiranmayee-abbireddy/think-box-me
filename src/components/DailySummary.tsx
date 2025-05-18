import React from 'react';
import { CheckCircle, XCircle, Clock, Award, X } from 'lucide-react';
import { DailySummary as DailySummaryType } from '../types/types';
import { formatTime } from '../utils/time';

interface DailySummaryProps {
  summary: DailySummaryType;
  onClose: () => void;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ summary, onClose }) => {
  const { completedBlocks, missedBlocks, totalTimeInSeconds } = summary;
  const totalBlocks = completedBlocks + missedBlocks;
  const completionRate = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;
  
  // Determine achievement level based on completion rate
  let achievementLevel = 'Beginner';
  let achievementColor = 'text-blue-500';
  
  if (completionRate >= 90) {
    achievementLevel = 'Master';
    achievementColor = 'text-purple-500';
  } else if (completionRate >= 75) {
    achievementLevel = 'Expert';
    achievementColor = 'text-indigo-500';
  } else if (completionRate >= 50) {
    achievementLevel = 'Intermediate';
    achievementColor = 'text-teal-500';
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold dark:text-white">Daily Summary</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center relative">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{completionRate}%</div>
            <svg className="absolute inset-0" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#e5e7eb" 
                strokeWidth="6"
                className="dark:stroke-gray-600"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#6366F1" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeDasharray={`${completionRate * 2.83} 283`} 
                transform="rotate(-90 50 50)" 
                className="dark:stroke-indigo-500"
              />
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <div className="flex items-center text-green-600 dark:text-green-400 mb-1">
              <CheckCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Completed</h3>
            </div>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{completedBlocks}</p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
            <div className="flex items-center text-red-600 dark:text-red-400 mb-1">
              <XCircle className="w-5 h-5 mr-2" />
              <h3 className="font-medium">Missed</h3>
            </div>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{missedBlocks}</p>
          </div>
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-6">
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-1">
            <Clock className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Total Focus Time</h3>
          </div>
          <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {formatTime(totalTimeInSeconds)}
          </p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex items-center justify-center">
          <div className="flex items-center">
            <Award className={`w-6 h-6 mr-2 ${achievementColor}`} />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              Achievement: <span className={achievementColor}>{achievementLevel}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};