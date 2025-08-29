import React from 'react';
import { useGraphData } from './hooks/useGraphData';
import { useAutoRefresh } from './hooks/useAutoRefresh';
import { RefreshTimer } from './components/RefreshTimer';
import { GraphControls } from './components/GraphControls';
import { GraphVisualization } from './components/GraphVisualization';

export const Graph: React.FC = () => {
  const { 
    data,
    selectedGraph,
    loading,
    error,
    selectGraph,
    getScales
  } = useGraphData();

  const {
    timeUntilRefresh,
    lastModified,
    setLastModified
  } = useAutoRefresh();

  if (loading) {
    return <div>Loading graph data...</div>;
  }

  if (error) {
    return <div>Error loading graph: {error.message}</div>;
  }

  if (!selectedGraph) {
    return <div>No graph data available</div>;
  }

  const { xScale, yScale } = getScales();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <RefreshTimer
        timeUntilRefresh={timeUntilRefresh}
        lastModified={lastModified}
      />
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
