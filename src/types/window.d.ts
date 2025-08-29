interface Window {
  api: {
    loadData: () => {
      data: import('./renderer/components/Graph/types/graph.types').GraphData[];
      lastModified: number;
    };
  };
}
