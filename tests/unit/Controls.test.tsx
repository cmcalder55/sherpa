import { render, screen, fireEvent } from '@testing-library/react';
import { Controls } from '../../src/components/Graph/components/Controls';
import { GraphData } from '../../src/components/Graph/types/graph.types';

const mockData: GraphData[] = [
  {
    level: 'Test Level 1',
    nodes: [],
    edges: []
  },
  {
    level: 'Test Level 2', 
    nodes: [],
    edges: []
  }
];

describe('Graph Controls', () => {
  it('renders control buttons for each graph option', () => {
    const mockOnSelect = jest.fn();
    
    render(
      <Controls 
        options={mockData}
        selectedGraph={mockData[0]}
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByText('Test Level 1')).toBeInTheDocument();
    expect(screen.getByText('Test Level 2')).toBeInTheDocument();
  });

  it('calls onSelect when a button is clicked', () => {
    const mockOnSelect = jest.fn();
    
    render(
      <Controls 
        options={mockData}
        selectedGraph={mockData[0]}
        onSelect={mockOnSelect}
      />
    );

    fireEvent.click(screen.getByText('Test Level 2'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockData[1]);
  });
});
