import { useState, useEffect, useRef } from 'react';

export const useAutoRefresh = () => {
  const [lastModified, setLastModified] = useState<string>(new Date().toISOString());
  const [timeUntilRefresh, setTimeUntilRefresh] = useState<string>('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      
      // Get current time in New Zealand timezone
      const nzTime = new Date(now.toLocaleString("en-US", {timeZone: "Pacific/Auckland"}));
      
      // Create next 12:00:30 PM NZ time (12:00 PM + 30 seconds)
      const nextRefresh = new Date(nzTime);
      nextRefresh.setHours(12, 0, 30, 0); // 12:00:30 PM
      
      // If we've already passed 12:00:30 PM today, set for tomorrow
      if (nzTime.getHours() > 12 || (nzTime.getHours() === 12 && nzTime.getMinutes() > 0) || (nzTime.getHours() === 12 && nzTime.getMinutes() === 0 && nzTime.getSeconds() >= 30)) {
        nextRefresh.setDate(nextRefresh.getDate() + 1);
      }
      
      // Convert back to local time for comparison
      const nextRefreshLocal = new Date(nextRefresh.getTime() - (nzTime.getTimezoneOffset() - now.getTimezoneOffset()) * 60000);
      
      const timeUntilNext = nextRefreshLocal.getTime() - now.getTime();

      if (timeUntilNext <= 0) {
        setTimeUntilRefresh('Refreshing...');
        setLastModified(new Date().toISOString());
      } else {
        const totalSeconds = Math.ceil(timeUntilNext / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
          setTimeUntilRefresh(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeUntilRefresh(`${minutes}m ${seconds}s`);
        } else {
          setTimeUntilRefresh(`${seconds}s`);
        }
      }
    };

    // Update immediately
    updateTimer();
    
    // Set up interval to update every second
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return {
    timeUntilRefresh,
    lastModified,
    setLastModified
  };
};
