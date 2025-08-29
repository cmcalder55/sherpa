import { useState, useEffect } from 'react';
import { GraphData } from '../types/graph.types';
import * as d3 from 'd3';
import { config } from '../../../../main/config/app.config';

export const useGraphData = () => {
  const [data, setData] = useState<GraphData[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [globalExtents, setGlobalExtents] = useState({
    xExtent: [0, 1] as [number, number],
    yExtent: [0, 1] as [number, number]
  });

  const loadData = async () => {
    try {
      const result = window.api.loadData();
      if (!result || !result.data) {
        throw new Error('Invalid data format received');
      }
      
      if (result.data.length > 0) {
        setData(result.data);
        setSelectedGraph(result.data[0]);

        const allNodes = result.data.flatMap(graph => graph.nodes || []);
        if (allNodes.length > 0) {
          const xExtent = d3.extent(allNodes, d => +d.x || 0) as [number, number];
          const yExtent = d3.extent(allNodes, d => +d.y || 0) as [number, number];
          setGlobalExtents({ xExtent, yExtent });
        }
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'));
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectGraph = (graph: GraphData) => {
    setSelectedGraph(graph);
  };

  const getScales = () => {
    const { width, height, margin } = config.graph.dimensions;
    
    const xScale = d3
      .scaleLinear()
      .domain(globalExtents.xExtent)
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(globalExtents.yExtent)
      .range([margin.top, height - margin.bottom]);

    return { xScale, yScale };
  };

  return {
    data,
    selectedGraph,
    loading,
    error,
    selectGraph,
    getScales
  };
};
