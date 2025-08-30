import type { GraphData } from './graph.types';
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
