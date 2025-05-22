# Installation

## Using npm

```bash
npm install strive-ui
```

## Using yarn

```bash
yarn add strive-ui
```

## Setup

Wrap your application with the ThemeProvider:

```jsx
import { ThemeProvider } from 'strive-ui';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Peer Dependencies

StriveUI has the following peer dependencies:

- React (>=16.8.0)
- React DOM (>=16.8.0)
- styled-components (>=5.0.0)

Make sure these are installed in your project.

## TypeScript Support

StriveUI is built with TypeScript and includes type definitions. No additional installation steps are required to use StriveUI with TypeScript.
