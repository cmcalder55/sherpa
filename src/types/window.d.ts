import type { GraphData } from '../components/Graph/types/graph.types';
import { electronAPI } from '@electron-toolkit/preload';

export interface WindowAPI {
  loadData: () => {
    data: GraphData[];
    lastModified: number | null;
  }
}

interface Window {
  electron: typeof electronAPI;
  api: WindowAPI;
}
