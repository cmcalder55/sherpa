// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const Graph = () => {
  const svgRef = useRef()
  const [dimensions] = useState({ width: 400, height: 200 })
  const [graphDataOptions, setGraphDataOptions] = useState([]) // State to store the loaded data
  const [selectedGraph, setSelectedGraph] = useState(null) // State for the selected graph
  const [globalExtents, setGlobalExtents] = useState({ xExtent: [0, 1], yExtent: [0, 1] }) // Global extents for scaling
  const [timeUntilRefresh, setTimeUntilRefresh] = useState('')
  const [lastModified, setLastModified] = useState(null)

  // Function to calculate next refresh time (12 PM GMT+12)
  const getNextRefreshTime = () => {
    const now = new Date()
    const nzTime = new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Auckland' }))
    let nextRefresh = new Date(nzTime)
    nextRefresh.setHours(12, 0, 0, 0)

    if (nzTime.getHours() >= 12) {
      nextRefresh.setDate(nextRefresh.getDate() + 1)
    }

    return nextRefresh
  }

  // Function to load data
  const loadData = () => {
    try {
      const result = window.api.loadData()
      if (!result || !result.data) {
        console.error('Invalid data format received:', result)
        return
      }

      if (result.data.length > 0) {
        setGraphDataOptions(result.data)
        setSelectedGraph(result.data[0])
        setLastModified(result.lastModified)

        const allNodes = result.data.flatMap((graph) => graph.nodes || [])
        if (allNodes.length > 0) {
          const xExtent = d3.extent(allNodes, (d) => +d.x || 0)
          const yExtent = d3.extent(allNodes, (d) => +d.y || 0)
          setGlobalExtents({ xExtent, yExtent })
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  // Initial data load
  useEffect(() => {
    loadData()
  }, [])

  // Set up refresh timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const nextRefresh = getNextRefreshTime()
      const diff = nextRefresh - now

      // Format the time difference
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeUntilRefresh(`${hours}h ${minutes}m ${seconds}s`)

      // Check if it's time to refresh (within the last minute of the hour)
      const nzTime = new Date(now.toLocaleString('en-US', { timeZone: 'Pacific/Auckland' }))
      if (nzTime.getHours() === 12 && nzTime.getMinutes() === 0) {
        loadData()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle graph rendering when selectedGraph changes
  useEffect(() => {
    if (!selectedGraph || !selectedGraph.nodes || !selectedGraph.edges || !svgRef.current) return

    try {
      const margin = { top: 20, right: 10, bottom: 10, left: 20 }
      const width = dimensions.width - margin.left - margin.right
      const height = dimensions.height - margin.top - margin.bottom

      // Select the SVG element and set dimensions
      const svg = d3
        .select(svgRef.current)
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
        .style('border', '1px solid black')

      const { nodes, edges } = selectedGraph

      // Clear previous content from the SVG
      svg.selectAll('*').remove()

      // Create scaling functions to fit nodes inside the viewBox based on global extents
      const xScale = d3
        .scaleLinear()
        .domain(globalExtents.xExtent) // Use global extents for consistent scaling
        .range([margin.left, width - margin.right])

      const yScale = d3
        .scaleLinear()
        .domain(globalExtents.yExtent)
        .range([margin.top, height - margin.bottom]) // Inverted Y for SVG (top-left origin)

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
        .attr('y2', (d) => yScale(nodes.find((n) => n.id === d.target).y))

      // Create nodes (circles) with labels
      const node = svg
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', (d) => `translate(${xScale(d.x)}, ${yScale(d.y)})`)

      node.append('circle').attr('r', 8).style('fill', '#69b3a2')

      // Add labels to the nodes
      node
        .append('text')
        .attr('dy', '.35em') // Vertical alignment
        .attr('x', 12) // Position label to the right of the circle
        .style('fill', 'black')
        .text((d) => d.id)
    } catch (error) {
      console.error('Error rendering graph:', error)
      // Could add error state handling here if needed
    }
  }, [selectedGraph, dimensions, globalExtents])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          backgroundColor: '#f0f0f0',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '10px',
          fontSize: '14px'
        }}
      >
        Next data refresh in: {timeUntilRefresh}
        {lastModified && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Last updated: {new Date(lastModified).toLocaleString()}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', marginTop: '20px' }}>
        {/* Render buttons horizontally */}
        {graphDataOptions.length > 0 ? (
          graphDataOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedGraph(option)}
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                backgroundColor: selectedGraph?.level === option.level ? '#69b3a2' : '#ccc',
                color: '#fff',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              {option.level || `Graph ${index + 1}`}
            </button>
          ))
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>Loading graph data...</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              If this persists, check if the data file exists and is valid.
            </p>
          </div>
        )}
      </div>
      <div style={{ width: dimensions.width, height: dimensions.height, position: 'relative' }}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  )
}

export default Graph
