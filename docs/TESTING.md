# Testing Guide

## Test Structure

Tests are located alongside the components they test in `__tests__` folders:

```
src/
├── components/
│   └── Graph/
│       └── components/
│           ├── Controls.tsx
│           └── __tests__/
│               └── Controls.test.tsx
```

## Running Tests

```bash
# Run all tests
npm test

# Run a specific test file
npm test -- --testNamePattern="Graph Controls"

# Run tests without watch mode
npm test -- --watchAll=false
```

## Test Setup

- **Jest DOM**: Automatically loaded via `src/setupTests.ts`
- **User Event**: For realistic user interactions
- **React Testing Library**: For component rendering and queries

## Example Test

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controls } from '../Controls';

describe('Component Name', () => {
  it('should test behavior', async () => {
    const user = userEvent.setup();
    const mockFn = jest.fn();
    
    render(<Controls onSelect={mockFn} />);
    
    await user.click(screen.getByText('Button Text'));
    expect(mockFn).toHaveBeenCalled();
  });
});
```
