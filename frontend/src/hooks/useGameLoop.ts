import { useEffect, useRef, useCallback } from 'react';

interface GameLoopConfig {
  intervalMs?: number;
  enablePerformanceMonitoring?: boolean;
  maxFrameSkip?: number;
}

export const useGameLoop = (
  updateCallback: (deltaTime: number) => void,
  config: GameLoopConfig = {}
) => {
  const {
    intervalMs = 1000,
    enablePerformanceMonitoring = false,
    maxFrameSkip = 5
  } = config;

  const intervalRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(Date.now());
  const performanceRef = useRef<number[]>([]);

  const gameUpdate = useCallback(() => {
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateRef.current;

    // Performance monitoring
    if (enablePerformanceMonitoring) {
      performanceRef.current.push(deltaTime);
      if (performanceRef.current.length > 100) {
        performanceRef.current.shift();
      }
    }

    // Skip frames if performance is poor
    if (deltaTime > intervalMs * maxFrameSkip) {
      console.warn(`Game loop: Skipping ${Math.floor(deltaTime / intervalMs)} frames`);
      lastUpdateRef.current = currentTime;
      return;
    }

    updateCallback(deltaTime);
    lastUpdateRef.current = currentTime;
  }, [updateCallback, intervalMs, enablePerformanceMonitoring, maxFrameSkip]);

  useEffect(() => {
    lastUpdateRef.current = Date.now();
    intervalRef.current = setInterval(gameUpdate, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameUpdate, intervalMs]);

  const getPerformanceStats = useCallback(() => {
    if (!enablePerformanceMonitoring || performanceRef.current.length === 0) {
      return null;
    }

    const times = performanceRef.current;
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return { averageMs: avg, minMs: min, maxMs: max, sampleSize: times.length };
  }, [enablePerformanceMonitoring]);

  return { getPerformanceStats };
};