# Sherpa Project Documentation

## Directory Structure

This project follows a modular architecture with clear separation of concerns:

```
src/
├── components/
│   ├── Graph/                    # Graph visualization feature
│   │   ├── components/           # Graph sub-components
│   │   │   ├── Visualization.tsx # D3 visualization
│   │   │   └── RefreshTimer.tsx  # Auto-refresh timer
│   │   ├── hooks/               # Graph-specific hooks
│   │   │   ├── useGraphData.ts  # Data loading logic
│   │   │   └── useAutoRefresh.ts # Auto-refresh logic
│   │   ├── types/               # Graph-specific types
│   │   │   └── graph.types.ts   # Graph data interfaces
│   │   └── index.tsx            # Main Graph component
│   └── common/                  # Reusable components
├── hooks/                       # Global hooks
├── types/                       # Global type definitions
├── utils/                       # Utility functions
├── styles/                      # Global styles
└── config/                      # App configuration
```

## Architecture Benefits

1. **Feature-based organization**: Graph functionality is self-contained
2. **Clear boundaries**: Each folder has a specific purpose
3. **Reusability**: Common components can be shared
4. **Maintainability**: Easy to locate and modify code
5. **Scalability**: Easy to add new features following the same pattern

## Development Guidelines

- Keep components focused on a single responsibility
- Use TypeScript for type safety
- Group related functionality together
- Follow naming conventions (PascalCase for components, camelCase for functions)
- Write tests alongside your code
