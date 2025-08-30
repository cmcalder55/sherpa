import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import type { GraphData, Node } from '../types/graph.types';
import { config } from '../../../config/app.config';

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
        
        // Parse string coordinates to numbers
        const parsedData = result.map((graph: any) => ({
          ...graph,
          nodes: graph.nodes.map((node: any) => ({
            ...node,
            x: parseFloat(node.x),
            y: parseFloat(node.y)
          }))
        }));
        
        setData(parsedData);
        setSelectedGraph(parsedData[0]);
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

    // Account for node radius in the range to ensure nodes stay within bounds
    const { nodeRadius, width, height } = config.graph;
    const padding = 40; // Increased padding from the edges for more breathing room
    
    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([nodeRadius + padding, width - nodeRadius - padding]);

    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([nodeRadius + padding, height - nodeRadius - padding]);

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
