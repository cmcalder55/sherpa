import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { Node, Edge } from '../types/graph.types';
import { config } from '../../../config/app.config';

interface Props {
  nodes: Node[];
  edges: Edge[];
  xScale: d3.ScaleLinear<number, number>;
  yScale: d3.ScaleLinear<number, number>;
}

export const Visualization: React.FC<Props> = ({
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

    // Add labels with smart positioning accounting for all connection types
    node
      .append('text')
      .attr('dy', '.35em')
      .style('fill', '#666')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('text-anchor', 'middle')
      .text((d) => d.id)
      .attr('x', (d) => {
        // Analyze all connected edges to determine optimal label position
        const connectedEdges = edges.filter(e => e.source === d.id || e.target === d.id);
        
        if (connectedEdges.length === 0) {
          return nodeRadius + 5; // Default to right for isolated nodes
        }
        
        // Calculate connection vectors and determine occupied directions
        const occupiedDirections = {
          top: false,
          bottom: false,
          left: false,
          right: false,
          topLeft: false,
          topRight: false,
          bottomLeft: false,
          bottomRight: false
        };
        
        connectedEdges.forEach(e => {
          const otherNodeId = e.source === d.id ? e.target : e.source;
          const otherNode = nodes.find(n => n.id === otherNodeId);
          if (!otherNode) return;
          
          const dx = otherNode.x - d.x;
          const dy = otherNode.y - d.y;
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          // Classify direction based on angle
          if (angle >= -22.5 && angle < 22.5) occupiedDirections.right = true;
          else if (angle >= 22.5 && angle < 67.5) occupiedDirections.bottomRight = true;
          else if (angle >= 67.5 && angle < 112.5) occupiedDirections.bottom = true;
          else if (angle >= 112.5 && angle < 157.5) occupiedDirections.bottomLeft = true;
          else if (angle >= 157.5 || angle < -157.5) occupiedDirections.left = true;
          else if (angle >= -157.5 && angle < -112.5) occupiedDirections.topLeft = true;
          else if (angle >= -112.5 && angle < -67.5) occupiedDirections.top = true;
          else if (angle >= -67.5 && angle < -22.5) occupiedDirections.topRight = true;
        });
        
        // Choose position based on available space (prefer cardinal directions)
        if (!occupiedDirections.top && !occupiedDirections.topLeft && !occupiedDirections.topRight) {
          return 0; // Center horizontally for top placement
        } else if (!occupiedDirections.bottom && !occupiedDirections.bottomLeft && !occupiedDirections.bottomRight) {
          return 0; // Center horizontally for bottom placement
        } else if (!occupiedDirections.right && !occupiedDirections.topRight && !occupiedDirections.bottomRight) {
          return nodeRadius + 8; // Right side
        } else if (!occupiedDirections.left && !occupiedDirections.topLeft && !occupiedDirections.bottomLeft) {
          return -(nodeRadius + 8); // Left side
        } else {
          // Find the least crowded area
          const topClear = !occupiedDirections.top;
          const bottomClear = !occupiedDirections.bottom;
          const rightClear = !occupiedDirections.right;
          const leftClear = !occupiedDirections.left;
          
          if (topClear || bottomClear) return 0;
          if (rightClear) return nodeRadius + 8;
          if (leftClear) return -(nodeRadius + 8);
          return nodeRadius + 8; // Fallback to right
        }
      })
      .attr('y', (d) => {
        // Same analysis for Y positioning
        const connectedEdges = edges.filter(e => e.source === d.id || e.target === d.id);
        
        if (connectedEdges.length === 0) {
          return 0; // Center for isolated nodes
        }
        
        // Calculate occupied directions (same as above)
        const occupiedDirections = {
          top: false,
          bottom: false,
          left: false,
          right: false,
          topLeft: false,
          topRight: false,
          bottomLeft: false,
          bottomRight: false
        };
        
        connectedEdges.forEach(e => {
          const otherNodeId = e.source === d.id ? e.target : e.source;
          const otherNode = nodes.find(n => n.id === otherNodeId);
          if (!otherNode) return;
          
          const dx = otherNode.x - d.x;
          const dy = otherNode.y - d.y;
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          
          if (angle >= -22.5 && angle < 22.5) occupiedDirections.right = true;
          else if (angle >= 22.5 && angle < 67.5) occupiedDirections.bottomRight = true;
          else if (angle >= 67.5 && angle < 112.5) occupiedDirections.bottom = true;
          else if (angle >= 112.5 && angle < 157.5) occupiedDirections.bottomLeft = true;
          else if (angle >= 157.5 || angle < -157.5) occupiedDirections.left = true;
          else if (angle >= -157.5 && angle < -112.5) occupiedDirections.topLeft = true;
          else if (angle >= -112.5 && angle < -67.5) occupiedDirections.top = true;
          else if (angle >= -67.5 && angle < -22.5) occupiedDirections.topRight = true;
        });
        
        // Choose Y position based on available space
        if (!occupiedDirections.top && !occupiedDirections.topLeft && !occupiedDirections.topRight) {
          return -(nodeRadius + 12); // Above the node
        } else if (!occupiedDirections.bottom && !occupiedDirections.bottomLeft && !occupiedDirections.bottomRight) {
          return nodeRadius + 15; // Below the node
        } else if (!occupiedDirections.right && !occupiedDirections.topRight && !occupiedDirections.bottomRight) {
          return 0; // Center vertically for right placement
        } else if (!occupiedDirections.left && !occupiedDirections.topLeft && !occupiedDirections.bottomLeft) {
          return 0; // Center vertically for left placement
        } else {
          // Find the least crowded area
          const topClear = !occupiedDirections.top;
          const bottomClear = !occupiedDirections.bottom;
          const rightClear = !occupiedDirections.right;
          const leftClear = !occupiedDirections.left;
          
          if (topClear) return -(nodeRadius + 12);
          if (bottomClear) return nodeRadius + 15;
          if (rightClear || leftClear) return 0;
          return -(nodeRadius + 12); // Fallback to top
        }
      });
  }, [nodes, edges, xScale, yScale]);

  return <svg ref={svgRef}></svg>;
};
