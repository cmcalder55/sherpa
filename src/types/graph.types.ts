export interface Node {
  id: string;
  x: number;
  y: number;
  data?: Record<string, unknown>;
}

export interface Edge {
  source: string;
  target: string;
  weight?: number;
}

export interface GraphData {
  level: string;
  nodes: Node[];
  edges: Edge[];
}
