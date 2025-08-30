import React from 'react';
import { GraphVisualization } from './GraphVisualization';
import { GraphControls } from './GraphControls';
import { RefreshTimer } from './RefreshTimer';
import { useGraphData, useAutoRefresh } from '../../hooks';

export const Graph: React.FC = () => {
  const { data, selectedGraph, loading, error, selectGraph, getScales } = useGraphData();
  const { timeUntilRefresh, lastModified, isRefreshing, toggleRefresh } = useAutoRefresh();

  if (loading) {
    return <div>Loading graph data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!selectedGraph || !selectedGraph.nodes || !selectedGraph.edges) {
    return <div>No graph data available</div>;
  }

  const { xScale, yScale } = getScales(selectedGraph.nodes);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginBottom: '1rem' }}>
        <RefreshTimer
          timeUntilRefresh={timeUntilRefresh}
          lastModified={lastModified}
        />
        <button 
          onClick={toggleRefresh}
          style={{
            padding: '0.5rem 1rem',
            marginLeft: '1rem',
            backgroundColor: isRefreshing ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isRefreshing ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
        </button>
      </div>
      <GraphControls
        options={data}
        selectedGraph={selectedGraph}
        onSelect={selectGraph}
      />
      <GraphVisualization
        nodes={selectedGraph.nodes}
        edges={selectedGraph.edges}
        xScale={xScale}
        yScale={yScale}
      />
    </div>
  );
};
