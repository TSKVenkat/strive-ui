# Installation Guide

## Quick Start

### Package Installation

```bash
# npm
npm install @pulse-ui/core

# yarn
yarn add @pulse-ui/core

# pnpm
pnpm add @pulse-ui/core
```

### Basic Setup

```jsx
import { ThemeProvider } from '@pulse-ui/core';
import '@pulse-ui/core/style.css';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Framework Integration

### Next.js

#### App Router (Next.js 13+)

```jsx
// app/layout.tsx
import { ThemeProvider } from '@pulse-ui/core';
import '@pulse-ui/core/style.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### Pages Router (Next.js 12 and below)

```jsx
// pages/_app.js
import { ThemeProvider } from '@pulse-ui/core';
import '@pulse-ui/core/style.css';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

### Vite

```jsx
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@pulse-ui/core';
import '@pulse-ui/core/style.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### Create React App

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@pulse-ui/core';
import '@pulse-ui/core/style.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### Remix

```jsx
// app/root.tsx
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ThemeProvider } from '@pulse-ui/core';
import styles from '@pulse-ui/core/style.css';

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

### Gatsby

```jsx
// gatsby-browser.js
import { ThemeProvider } from '@pulse-ui/core';
import '@pulse-ui/core/style.css';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);
```

```jsx
// gatsby-ssr.js
import { ThemeProvider } from '@pulse-ui/core';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);
```

## TypeScript Setup

Pulse UI is built with TypeScript and provides comprehensive type definitions out of the box. No additional setup is required for TypeScript projects.

### Custom Theme Types

If you're extending the default theme, you can augment the theme types:

```typescript
// types/pulse-ui.d.ts
import '@pulse-ui/core';

declare module '@pulse-ui/core' {
  interface Theme {
    customProperty?: string;
  }
}
```

## Styling Options

### Using with Tailwind CSS

Pulse UI works seamlessly with Tailwind CSS. You can use Tailwind classes alongside Pulse UI components:

```jsx
import { Button } from '@pulse-ui/core';

function MyComponent() {
  return (
    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
      Styled with Tailwind
    </Button>
  );
}
```

### Using with styled-components

```jsx
import styled from 'styled-components';
import { Button } from '@pulse-ui/core';

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%);
  border: 0;
  border-radius: 3px;
  box-shadow: 0 3px 5px 2px rgba(255, 105, 135, 0.3);
  color: white;
  height: 48px;
  padding: 0 30px;
`;
```

### Using with CSS Modules

```jsx
import { Button } from '@pulse-ui/core';
import styles from './MyComponent.module.css';

function MyComponent() {
  return (
    <Button className={styles.customButton}>
      Styled with CSS Modules
    </Button>
  );
}
```

## Bundle Optimization

### Tree Shaking

Pulse UI supports tree shaking out of the box. Import only the components you need:

```jsx
// ✅ Good - only imports Button
import { Button } from '@pulse-ui/core';

// ❌ Avoid - imports everything
import * as PulseUI from '@pulse-ui/core';
```

### Code Splitting

For better performance, you can use dynamic imports with React.lazy:

```jsx
import { lazy, Suspense } from 'react';

const DataGrid = lazy(() => 
  import('@pulse-ui/core').then(module => ({ default: module.DataGrid }))
);

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DataGrid />
    </Suspense>
  );
}
```

## CDN Usage

For quick prototyping or simple projects, you can use Pulse UI via CDN:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@pulse-ui/core/dist/css/style.css">
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@pulse-ui/core/dist/umd/pulse-ui.min.js"></script>
  <script>
    const { Button, ThemeProvider } = PulseUI;
    
    ReactDOM.render(
      React.createElement(ThemeProvider, null,
        React.createElement(Button, { variant: 'primary' }, 'Hello Pulse UI')
      ),
      document.getElementById('root')
    );
  </script>
</body>
</html>
```

## Troubleshooting

### Common Issues

#### CSS Not Loading

Make sure you're importing the CSS file:

```jsx
import '@pulse-ui/core/style.css';
```

#### TypeScript Errors

Ensure you have the latest version of TypeScript and that your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true
  }
}
```

#### Build Errors with Next.js

If you encounter build errors with Next.js, add this to your `next.config.js`:

```javascript
module.exports = {
  transpilePackages: ['@pulse-ui/core'],
};
```

### Getting Help

If you encounter any issues during installation:

1. Check our [GitHub Issues](https://github.com/TSKVenkat/pulse-ui/issues)
2. Join our [Discord Community](https://discord.gg/pulse-ui)
3. Email us at [support@pulse-ui.dev](mailto:support@pulse-ui.dev)

## What's Next?

- [Theming Guide](./theming.md) - Learn how to customize Pulse UI
- [Usage Examples](./usage.md) - See Pulse UI in action
- [Component API](../components/) - Explore all available components
