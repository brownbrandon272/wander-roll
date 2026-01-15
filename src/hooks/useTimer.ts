import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  duration: number; // in seconds
  onComplete?: () => void;
}

interface UseTimerReturn {
  timeRemaining: number;
  progress: number; // 0 to 1
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useTimer({ duration, onComplete }: UseTimerOptions): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(duration);
  const completedRef = useRef(false);

  const progress = timeRemaining / duration;

  const start = useCallback(() => {
    if (completedRef.current) return;
    startTimeRef.current = Date.now();
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (startTimeRef.current !== null) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      pausedTimeRef.current = Math.max(0, pausedTimeRef.current - elapsed);
    }
    startTimeRef.current = null;
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    pausedTimeRef.current = duration;
    completedRef.current = false;
    setTimeRemaining(duration);
    setIsRunning(false);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (startTimeRef.current === null) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, pausedTimeRef.current - elapsed);
      setTimeRemaining(remaining);

      if (remaining <= 0 && !completedRef.current) {
        completedRef.current = true;
        setIsRunning(false);
        onComplete?.();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, onComplete]);

  // Auto-start on mount
  useEffect(() => {
    start();
  }, [start]);

  return {
    timeRemaining,
    progress,
    isRunning,
    start,
    pause,
    reset,
  };
}
