# Pulse UI

A production-ready, headless React component library offering maximum styling flexibility with robust TypeScript support and comprehensive accessibility features.

![npm](https://img.shields.io/npm/v/@pulseui/core?style=flat-square&color=blue)
![license](https://img.shields.io/npm/l/@pulseui/core?style=flat-square&color=green)
![build](https://img.shields.io/github/actions/workflow/status/TSKVenkat/pulseui/ci.yml?branch=main&style=flat-square)
![downloads](https://img.shields.io/npm/dt/@pulseui/core?style=flat-square&color=orange)
![bundle size](https://img.shields.io/bundlephobia/minzip/@pulseui/core?style=flat-square&color=purple)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square)
![accessibility](https://img.shields.io/badge/a11y-WCAG%202.1%20AA-green?style=flat-square)

## ✨ Why Pulse UI?

Pulse UI is designed for modern React applications that demand **flexibility**, **accessibility**, and **performance**. Built with a headless-first approach, it separates logic from presentation, giving you complete control over styling while maintaining robust functionality.

### 🎯 Key Features

- **🧠 Headless Architecture** - Logic separated from presentation for ultimate styling freedom
- **🎨 Framework Agnostic** - Works with any styling solution (Tailwind, styled-components, CSS modules, emotion)
- **♿ Accessibility First** - WCAG 2.1 AA compliant with comprehensive ARIA support
- **📘 TypeScript Native** - Built with TypeScript for exceptional developer experience
- **⚡ Performance Optimized** - Tree-shakeable, lightweight, and optimized for production
- **🌙 Dark Mode Ready** - Advanced theming system with built-in dark mode support
- **📱 Mobile First** - Touch-friendly, responsive components that work everywhere
- **🔧 Developer Friendly** - Comprehensive documentation, examples, and tooling

## 🏗️ Architecture Patterns

Pulse UI implements three powerful component patterns for maximum flexibility:

### 1. **Headless Components**
Pure logic and behavior without styling constraints
```jsx
import { useButton } from '@pulseui/core';

function CustomButton(props) {
  const { buttonProps } = useButton(props);
  return <button {...buttonProps} className="my-custom-styles" />;
}
```

### 2. **Compound Components**
Flexible composition with context-based state sharing
```jsx
<Modal>
  <Modal.Trigger>Open Modal</Modal.Trigger>
  <Modal.Content>
    <Modal.Header>Title</Modal.Header>
    <Modal.Body>Content</Modal.Body>
    <Modal.Footer>Actions</Modal.Footer>
  </Modal.Content>
</Modal>
```

### 3. **Polymorphic Components**
Render as any HTML element while maintaining functionality
```jsx
<Button as="a" href="/link">Link Button</Button>
<Button as={Link} to="/route">Router Link</Button>
```

## 🚀 Quick Start

### Installation

```bash
# npm
npm install @pulseui/core

# yarn
yarn add @pulseui/core

# pnpm
pnpm add @pulseui/core
```

### Basic Usage

```jsx
import { Button, Modal, ThemeProvider } from '@pulseui/core';
import '@pulseui/core/style.css';

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary" size="lg">
        Get Started with Pulse UI
      </Button>
      
      <Modal>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        <Modal.Content>
          <Modal.Header>Welcome to Pulse UI</Modal.Header>
          <Modal.Body>
            Build beautiful, accessible interfaces with ease.
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </ThemeProvider>
  );
}
```

### Framework Integration

<details>
<summary><strong>Next.js</strong></summary>

```jsx
// pages/_app.js
import { ThemeProvider } from '@pulseui/core';
import '@pulseui/core/style.css';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```
</details>

<details>
<summary><strong>Vite</strong></summary>

```jsx
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@pulseui/core';
import '@pulseui/core/style.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```
</details>

<details>
<summary><strong>Create React App</strong></summary>

```jsx
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@pulseui/core';
import '@pulseui/core/style.css';
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
</details>

<details>
<summary><strong>Remix</strong></summary>

```jsx
// app/root.tsx
import { ThemeProvider } from '@pulseui/core';
import '@pulseui/core/style.css';

export default function App() {
  return (
    <html>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
```
</details>

<details>
<summary><strong>Gatsby</strong></summary>

```jsx
// gatsby-browser.js
import { ThemeProvider } from '@pulseui/core';
import '@pulseui/core/style.css';

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>{element}</ThemeProvider>
);
```
</details>

## 📚 Documentation

| Section | Description |
|---------|-------------|
| [🚀 Getting Started](docs/getting-started/) | Installation, setup, and first steps |
| [🎨 Theming Guide](docs/getting-started/theming.md) | Customization and theme creation |
| [📖 Component API](docs/components/) | Complete component reference |
| [♿ Accessibility](docs/guides/accessibility.md) | WCAG compliance and best practices |
| [🏗️ Architecture](docs/guides/architecture.md) | Design patterns and principles |
| [🤝 Contributing](CONTRIBUTING.md) | Development workflow and guidelines |

## 🧩 Component Library

### Layout & Structure
- **Container** - Responsive layout container
- **Grid** - Flexible grid system
- **Stack** - Vertical and horizontal stacking
- **Sidebar** - Collapsible navigation sidebar

### Navigation
- **Navbar** - Application navigation bar
- **Breadcrumbs** - Hierarchical navigation
- **Pagination** - Data pagination controls
- **Tabs** - Tabbed interface component

### Forms & Input
- **Button** - Interactive button component
- **Input** - Text input with validation
- **Select** - Dropdown selection
- **Checkbox** - Boolean input control
- **Radio** - Single selection input
- **Switch** - Toggle switch control
- **Slider** - Range input control

### Feedback & Overlay
- **Modal** - Dialog and modal windows
- **Toast** - Notification messages
- **Tooltip** - Contextual information
- **Popover** - Rich contextual overlays
- **Alert** - Status and alert messages

### Data Display
- **Table** - Data table with sorting/filtering
- **Card** - Content container
- **Avatar** - User profile images
- **Badge** - Status indicators
- **Progress** - Progress indicators

### Advanced Components
- **Accordion** - Collapsible content sections
- **Carousel** - Image and content carousel
- **DatePicker** - Date selection interface
- **FileUpload** - File upload with drag & drop
- **DataGrid** - Advanced data table

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | ≥ 91 |
| Firefox | ≥ 90 |
| Safari | ≥ 14 |
| Edge | ≥ 91 |

## 📦 Bundle Size

| Format | Size (gzipped) |
|--------|----------------|
| ESM | ~45KB |
| CJS | ~48KB |
| UMD | ~52KB |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Venkatarama T S K](https://github.com/TSKVenkat)

---

<div align="center">
  <strong>Built with ❤️ for the React community</strong>
</div>