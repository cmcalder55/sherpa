import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { GraphData, Node } from '../types/graph.types';

const emptyGraph: GraphData = {
  level: '',
  nodes: [],
  edges: []
};

export const useGraphData = () => {
  const [data, setData] = useState<GraphData[]>([]);
  const [selectedGraph, setSelectedGraph] = useState<GraphData>(emptyGraph);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/compass.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setSelectedGraph(result[0]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectGraph = (graph: GraphData) => {
    setSelectedGraph(graph);
  };

  const getScales = (nodes: Node[]) => {
    const xExtent = d3.extent(nodes, d => d.x) as [number, number];
    const yExtent = d3.extent(nodes, d => d.y) as [number, number];

    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([50, 750]);

    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([50, 550]);

    return { xScale, yScale };
  };

  return {
    data,
    selectedGraph: selectedGraph || { nodes: [], edges: [] },
    loading,
    error,
    selectGraph,
    getScales
  };
};
