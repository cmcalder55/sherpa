import React from 'react';

interface Props {
  timeUntilRefresh: string;
  lastModified: string;
}

export const RefreshTimer: React.FC<Props> = ({ timeUntilRefresh, lastModified }) => {
  return (
    <div style={{ 
      backgroundColor: '#f0f0f0', 
      padding: '10px', 
      borderRadius: '5px', 
      marginBottom: '10px', 
      fontSize: '14px' 
    }}>
      Next data refresh in: {timeUntilRefresh}
      {lastModified && (
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Last updated: {new Date(lastModified).toLocaleString()}
        </div>
      )}
    </div>
  );
};
