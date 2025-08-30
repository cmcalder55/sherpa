import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controls } from '../Controls';
import { GraphData } from '../../types/graph.types';

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

  it('calls onSelect when a button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnSelect = jest.fn();
    
    render(
      <Controls 
        options={mockData}
        selectedGraph={mockData[0]}
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByText('Test Level 2'));
    expect(mockOnSelect).toHaveBeenCalledWith(mockData[1]);
  });
});
