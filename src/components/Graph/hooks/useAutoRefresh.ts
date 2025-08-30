import { useState, useEffect } from 'react';

export const useAutoRefresh = () => {
  const [lastModified, setLastModified] = useState<string>('');
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [interval, setInterval] = useState(30000); // 30 seconds default

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isRefreshing) {
      const updateTimer = () => {
        const now = new Date().getTime();
        const lastMod = lastModified ? new Date(lastModified).getTime() : now;
        const diff = now - lastMod;
        const nextRefresh = interval - diff;

        if (nextRefresh <= 0) {
          setTimeUntilRefresh('Refreshing...');
          // Trigger refresh logic here
        } else {
          setTimeUntilRefresh(`${Math.ceil(nextRefresh / 1000)}s`);
        }
      };

      updateTimer();
      timer = setTimeout(updateTimer, 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isRefreshing, lastModified, interval]);

  const toggleRefresh = () => {
    setIsRefreshing(prev => !prev);
  };

  return {
    timeUntilRefresh,
    lastModified,
    setLastModified,
    isRefreshing,
    interval,
    setInterval,
    toggleRefresh
  };
};
