import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../utils/time';

interface UseTimerProps {
  initialSeconds: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export const useTimer = ({ initialSeconds, autoStart = false, onComplete }: UseTimerProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [displayTime, setDisplayTime] = useState(formatTime(initialSeconds));
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          setDisplayTime(formatTime(newSeconds));
          return newSeconds;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    // Reset display time if initialSeconds changes
    setDisplayTime(formatTime(initialSeconds));
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(initialSeconds);
    setDisplayTime(formatTime(initialSeconds));
  };

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  return {
    seconds,
    isRunning,
    displayTime,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleTimer
  };
};