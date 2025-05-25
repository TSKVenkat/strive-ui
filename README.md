# Strive UI

A professional, headless React component library offering maximum styling flexibility with robust TypeScript support.

![npm](https://img.shields.io/npm/v/@strive-ui/core)
![license](https://img.shields.io/npm/l/@strive-ui/core)
![build](https://img.shields.io/github/actions/workflow/status/TSKVenkat/strive-ui/ci.yml?branch=main)

## Key Features

- **Headless architecture** - Logic separated from presentation for ultimate styling freedom
- **Framework agnostic** - Works with any styling approach (Tailwind, styled-components, CSS modules)
- **Accessibility built-in** - ARIA attributes and keyboard navigation included
- **TypeScript-first** - Complete type definitions for excellent developer experience
- **Lightweight & tree-shakeable** - Import only what you need

## Quick Install

```bash
npm install @strive-ui/core
```

## Basic Usage

```jsx
import { ThemeProvider, Button } from '@strive-ui/core';

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Get Started</Button>
    </ThemeProvider>
  );
}
```

## Component Architecture

Strive UI implements three powerful component patterns:

1. **Headless Components** - Logic and behavior without styling constraints
2. **Compound Components** - Flexible composition with context-based state sharing
3. **Polymorphic Components** - Render as any HTML element while maintaining functionality

## Documentation

- [Installation Guide](docs/getting-started/installation.md)
- [Theming](docs/getting-started/theming.md)
- [Usage Examples](docs/getting-started/usage.md)
- [Component API Reference](docs/components/)
- [Accessibility Guidelines](docs/guides/accessibility.md)

## Available Components

Strive UI includes a comprehensive set of components:

- **Layout:** Box, Grid, Stack
- **Inputs:** Button, Checkbox, Input, Select, Slider, RichTextEditor
- **Display:** Accordion, Alert, Avatar, Badge, Card, Modal, Tooltip
- **Navigation:** Tabs, Drawer, AdaptiveNavigation, ProgressiveNavigation
- **Feedback:** Toast, Spinner, Progress, ErrorBoundary
- **Visualization:** Various chart components

## Contributing

Contributions are welcome! Please see our [Contributing Guide](docs/guides/contributing.md) for details.

## License

MIT © [Venkataraman T S K](https://github.com/TSKVenkat)

MIT
