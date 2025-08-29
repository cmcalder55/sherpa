import React from 'react';
import { GraphData } from '../types/graph.types';

interface Props {
  options: GraphData[];
  selectedGraph: GraphData | null;
  onSelect: (graph: GraphData) => void;
}

export const GraphControls: React.FC<Props> = ({ 
  options, 
  selectedGraph, 
  onSelect 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      marginBottom: '20px', 
      marginTop: '20px'
    }}>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
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
      ))}
    </div>
  );
};
