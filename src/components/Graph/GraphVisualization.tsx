import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { Node, Edge } from '@/types/graph.types';
import { config } from '../../config/app.config';

interface Props {
  nodes: Node[];
  edges: Edge[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export const GraphVisualization: React.FC<Props> = ({
  nodes,
  edges,
  xScale,
  yScale
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const { nodeRadius, edgeWidth } = config.graph;
    const svg = d3
      .select(svgRef.current)
      .attr('width', config.graph.width)
      .attr('height', config.graph.height)
      .style('border', '1px solid black');

    // Clear previous content
    svg.selectAll('*').remove();

    // Create edges
    svg
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-width', edgeWidth)
      .attr('x1', (d) => xScale(nodes.find((n) => n.id === d.source)?.x || 0))
      .attr('y1', (d) => yScale(nodes.find((n) => n.id === d.source)?.y || 0))
      .attr('x2', (d) => xScale(nodes.find((n) => n.id === d.target)?.x || 0))
      .attr('y2', (d) => yScale(nodes.find((n) => n.id === d.target)?.y || 0));

    // Create nodes
    const node = svg
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

    node
      .append('circle')
      .attr('r', nodeRadius)
      .style('fill', '#1f77b4');

    // Add labels
    node
      .append('text')
      .attr('dy', '.35em')
      .attr('x', nodeRadius + 2)
      .style('fill', '#666')
      .text((d) => d.id);
  }, [nodes, edges, xScale, yScale]);

  return <svg ref={svgRef}></svg>;
};
