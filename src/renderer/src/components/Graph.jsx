// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const Graph = () => {
  const svgRef = useRef();
  const [dimensions] = useState({ width: 400, height: 200 });
  const [graphDataOptions, setGraphDataOptions] = useState([]); // State to store the loaded data
  const [selectedGraph, setSelectedGraph] = useState(null); // State for the selected graph
  const [globalExtents, setGlobalExtents] = useState({ xExtent: [0, 1], yExtent: [0, 1] }); // Global extents for scaling

  // Load data from the preload script using window.api.loadData()
  useEffect(() => {
    const loadedData = window.api.loadData(); // Load data from preload
    if (loadedData && loadedData.length > 0) {
      setGraphDataOptions(loadedData); // Set graph data options
      setSelectedGraph(loadedData[0]); // Set the default selected graph to the first one

      // Calculate global extents (min and max values for x and y across all graphs)
      const allNodes = loadedData.flatMap(graph => graph.nodes);
      const xExtent = d3.extent(allNodes, d => +d.x); // Convert strings to numbers
      const yExtent = d3.extent(allNodes, d => +d.y);
      setGlobalExtents({ xExtent, yExtent });
    }
  }, []);

  // Handle graph rendering when selectedGraph changes
  useEffect(() => {
    if (!selectedGraph || !selectedGraph.nodes || !selectedGraph.edges) return;

    const margin = { top: 20, right: 10, bottom: 10, left: 20 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Select the SVG element and set dimensions
    const svg = d3
      .select(svgRef.current)
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .style('border', '1px solid black');

    const { nodes, edges } = selectedGraph;

    // Clear previous content from the SVG
    svg.selectAll('*').remove();

    // Create scaling functions to fit nodes inside the viewBox based on global extents
    const xScale = d3
      .scaleLinear()
      .domain(globalExtents.xExtent) // Use global extents for consistent scaling
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain(globalExtents.yExtent)
      .range([margin.top, height - margin.bottom]); // Inverted Y for SVG (top-left origin)

    // Create links (edges) between nodes
    svg
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', 1.5)
      .attr('x1', (d) => xScale(nodes.find((n) => n.id === d.source).x))
      .attr('y1', (d) => yScale(nodes.find((n) => n.id === d.source).y))
      .attr('x2', (d) => xScale(nodes.find((n) => n.id === d.target).x))
      .attr('y2', (d) => yScale(nodes.find((n) => n.id === d.target).y));

    // Create nodes (circles) with labels
    const node = svg
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

    node.append('circle').attr('r', 8).style('fill', '#69b3a2');

    // Add labels to the nodes
    node
      .append('text')
      .attr('dy', '.35em') // Vertical alignment
      .attr('x', 12) // Position label to the right of the circle
      .style('fill', 'black')
      .text((d) => d.id);
  }, [selectedGraph, dimensions, globalExtents]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '20px'}}>
        {/* Render buttons horizontally */}
        {graphDataOptions.length > 0 ? (
          graphDataOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedGraph(option)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: selectedGraph === option ? '#69b3a2' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              {option.level}
            </button>
          ))
        ) : (
          <p>Loading graph data...</p> // Show loading message if data is not yet loaded
        )}
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default Graph;
