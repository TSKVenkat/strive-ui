# Installation

## Quick Install

```bash
# npm
npm install @strive-ui/core

# yarn
yarn add @strive-ui/core

# pnpm
pnpm add @strive-ui/core
```

## Peer Dependencies

Strive UI requires the following peer dependencies:

```bash
# npm
npm install react@>=16.8.0 react-dom@>=16.8.0 styled-components@>=5.0.0

# yarn
yarn add react@>=16.8.0 react-dom@>=16.8.0 styled-components@>=5.0.0

# pnpm
pnpm add react@>=16.8.0 react-dom@>=16.8.0 styled-components@>=5.0.0
```

## Basic Setup

Wrap your application with the `ThemeProvider` to enable theming:

```jsx
import { ThemeProvider } from '@strive-ui/core';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## TypeScript Support

Strive UI is built with TypeScript and includes comprehensive type definitions. No additional configuration is required for TypeScript projects.

## Next Steps

- [Explore the component library](../README.md)
- [Learn about theming](./theming.md)
- [View usage examples](./usage.md)
