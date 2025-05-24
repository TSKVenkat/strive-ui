# Container

The `Container` component is a fundamental layout element that provides consistent width constraints and horizontal centering for your content. It's designed to be responsive and customizable, making it a versatile foundation for various page layouts.

## Features

- **Responsive Width Control**: Predefined width constraints that adapt to different screen sizes
- **Horizontal Centering**: Automatically centers content within the viewport
- **Customizable Padding**: Control the inner spacing of your container
- **Polymorphic Component**: Can be rendered as any HTML element or React component
- **Fluid Option**: Can expand to full width when needed

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { Container } from '@strive-ui/layout';

function MyPage() {
  return (
    <Container>
      <h1>My Content</h1>
      <p>This content will be constrained to a reasonable width and centered.</p>
    </Container>
  );
}
```

## Examples

### Different Max Widths

```tsx
import { Container } from '@strive-ui/layout';

function WidthExamples() {
  return (
    <>
      <Container maxWidth="sm">
        <div style={{ background: '#f0f0f0', padding: '1rem' }}>
          Small Container
        </div>
      </Container>
      
      <Container maxWidth="md">
        <div style={{ background: '#e0e0e0', padding: '1rem' }}>
          Medium Container
        </div>
      </Container>
      
      <Container maxWidth="lg">
        <div style={{ background: '#d0d0d0', padding: '1rem' }}>
          Large Container (Default)
        </div>
      </Container>
      
      <Container maxWidth="xl">
        <div style={{ background: '#c0c0c0', padding: '1rem' }}>
          Extra Large Container
        </div>
      </Container>
      
      <Container maxWidth="full">
        <div style={{ background: '#b0b0b0', padding: '1rem' }}>
          Full Width Container
        </div>
      </Container>
    </>
  );
}
```

### Custom Padding

```tsx
import { Container } from '@strive-ui/layout';

function PaddingExamples() {
  return (
    <>
      <Container padding={false}>
        <div style={{ background: '#f0f0f0' }}>
          No Padding
        </div>
      </Container>
      
      <Container padding="2rem">
        <div style={{ background: '#e0e0e0' }}>
          Custom Padding (2rem)
        </div>
      </Container>
      
      <Container padding="0.5rem 2rem">
        <div style={{ background: '#d0d0d0' }}>
          Custom Horizontal/Vertical Padding
        </div>
      </Container>
    </>
  );
}
```

### Fluid Container

```tsx
import { Container } from '@strive-ui/layout';

function FluidExample() {
  return (
    <Container fluid>
      <div style={{ background: '#f0f0f0', padding: '1rem' }}>
        This container takes up 100% of the available width
      </div>
    </Container>
  );
}
```

### As Different Element

```tsx
import { Container } from '@strive-ui/layout';

function AsExample() {
  return (
    <Container as="section" aria-label="Main content">
      <h2>Section Container</h2>
      <p>This container is rendered as a section element.</p>
    </Container>
  );
}
```

## API Reference

### Container Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the container |
| `maxWidth` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl' \| '5xl' \| '6xl' \| '7xl' \| 'full' \| 'none'` | `'lg'` | Maximum width of the container |
| `centered` | `boolean` | `true` | Center the container horizontally |
| `padding` | `boolean \| string` | `true` | Add padding to the container. When `true`, adds default padding of 1rem. Can be a string like '2rem' or '1rem 2rem' |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |
| `fluid` | `boolean` | `false` | Fluid container that takes up 100% of the width |

Additionally, the Container component accepts all standard HTML div attributes.

## Width Reference

| Size | Max Width |
|------|-----------|
| `xs` | 320px |
| `sm` | 384px |
| `md` | 448px |
| `lg` | 512px (default) |
| `xl` | 576px |
| `2xl` | 672px |
| `3xl` | 768px |
| `4xl` | 896px |
| `5xl` | 1024px |
| `6xl` | 1152px |
| `7xl` | 1280px |
| `full` | 100% |
| `none` | none |

## Accessibility

The Container component doesn't introduce any specific accessibility concerns. It's a layout component that doesn't affect the accessibility of its children.

## Browser Support

The Container component is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
