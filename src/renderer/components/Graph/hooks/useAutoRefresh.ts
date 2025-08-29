import { useState, useEffect } from 'react';
import { config } from '../../../../main/config/app.config';

export const useAutoRefresh = () => {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('');
  const [lastModified, setLastModified] = useState<number | null>(null);

  const getNextRefreshTime = () => {
    const now = new Date();
    const nzTime = new Date(now.toLocaleString('en-US', { 
      timeZone: config.refresh.timezone 
    }));
    let nextRefresh = new Date(nzTime);
    nextRefresh.setHours(
      config.refresh.hour,
      config.refresh.minute,
      0,
      0
    );
    
    if (nzTime.getHours() >= config.refresh.hour) {
      nextRefresh.setDate(nextRefresh.getDate() + 1);
    }
    
    return nextRefresh;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextRefresh = getNextRefreshTime();
      const diff = nextRefresh - now;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilRefresh(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    timeUntilRefresh,
    lastModified,
    setLastModified
  };
};
