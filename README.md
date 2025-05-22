# StriveUI

A professional, accessible, and customizable React UI component library built with TypeScript and styled-components.

## Features

- Themeable design system with consistent tokens
- Fully accessible components following WAI-ARIA guidelines
- Tree-shakeable exports for optimized bundle size
- Written in TypeScript with complete type definitions
- Responsive and mobile-friendly components
- Thoroughly tested with Jest and React Testing Library
- Comprehensive documentation with examples

## Installation

```bash
npm install strive-ui
```

or

```bash
yarn add strive-ui
```

## Quick Start

```jsx
import { ThemeProvider, Button } from 'strive-ui';

function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Get Started</Button>
    </ThemeProvider>
  );
}
```

## Components

StriveUI provides a set of essential UI components for building modern user interfaces. Detailed documentation for each component can be found in the component directories and in the docs section.

For a complete list of available components and their usage, please refer to the documentation in the `docs` directory.

## Theming

StriveUI comes with a default theme, but you can customize it to match your brand:

```jsx
import { ThemeProvider, theme } from 'strive-ui';

// Create a custom theme by extending the default theme
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: {
      ...theme.colors.primary,
      500: '#0066ff', // Change primary color
    },
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Project Structure

```
strive-ui/
├── src/                    # Source code
│   ├── components/         # UI components
│   ├── hooks/              # Custom React hooks
│   ├── styles/             # Theme and global styles
│   ├── utils/              # Utility functions
│   └── index.ts            # Entry point
├── docs/                   # Documentation
│   ├── getting-started/    # Installation and usage guides
│   ├── components/         # Component documentation
│   ├── guides/             # Usage guides and best practices
│   └── api/                # API reference
├── .storybook/            # Storybook configuration
├── examples/              # Example applications
└── dist/                  # Built distribution files
```

## Documentation

StriveUI comes with comprehensive documentation to help you get started and make the most of the library:

1. **Getting Started**: Installation instructions, basic usage guides, and theming information.

2. **Component Documentation**: Detailed documentation for each component, including props, examples, and design guidelines.

3. **Guides**: Best practices, accessibility guidelines, and advanced usage patterns.

4. **API Reference**: Complete API documentation for all components and utilities.

All documentation is available in the `docs` directory and is organized by topic for easy navigation.

## Architecture

StriveUI is built with a modular architecture that focuses on:

1. **Component-Based Design**: Each UI element is a self-contained component with its own directory containing the component, tests, and stories.

2. **Design Token System**: All visual properties (colors, spacing, typography, etc.) are defined as tokens in a centralized system.

3. **Styled-Components**: We use styled-components for styling, which allows for dynamic theming and style customization.

4. **TypeScript**: The entire library is written in TypeScript, providing type safety and better developer experience. All components have complete type definitions and proper theme typing.

5. **Accessibility**: Components are designed with accessibility in mind, following WAI-ARIA guidelines.

## Development Workflow

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/strive-ui.git
cd strive-ui

# Install dependencies
npm install

# Start Storybook for development
npm run storybook
```

### Building the Library

```bash
# Build the library
npm run build
```

### Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Linting and Formatting

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Contributing

We welcome contributions to StriveUI! Here's how you can help:

1. **Report bugs**: If you find a bug, please create an issue describing the problem.

2. **Suggest features**: If you have ideas for new features, create an issue with the enhancement tag.

3. **Submit pull requests**: If you'd like to fix a bug or implement a feature, submit a pull request.

4. **Improve documentation**: Help us improve our documentation by fixing errors or adding examples.

### Development Process

Please refer to our [Contributing Guide](docs/guides/contributing.md) for detailed information on our development process, coding standards, and how to submit contributions.

### Documentation Process

We follow these documentation standards:

1. **Component Documentation**: Each component has its own documentation file in its respective component directory.

2. **JSDoc Comments**: All components and functions have JSDoc comments with descriptions and examples.

3. **TypeScript Types**: All props and return types are properly documented with TypeScript interfaces.

4. **Examples**: Documentation includes practical examples for different use cases of each component.

5. **Accessibility Notes**: Documentation includes accessibility features and considerations for each component.

## Recent Updates

Please refer to our changelog for detailed information about recent updates and improvements to the library.

## License

MIT
