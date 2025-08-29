export const config = {
  refresh: {
    timezone: 'Pacific/Auckland',
    hour: 12,
    minute: 0,
  },
  data: {
    path: './data/compass.json',
    encoding: 'utf-8',
  },
  graph: {
    dimensions: {
      width: 800,
      height: 600,
      margin: {
        top: 20,
        right: 10,
        bottom: 10,
        left: 20
      }
    },
    style: {
      nodes: {
        radius: 8,
        fill: '#69b3a2'
      },
      edges: {
        stroke: '#999',
        strokeWidth: 1.5
      },
      labels: {
        offset: 12,
        fill: 'black'
      }
    }
  }
};
