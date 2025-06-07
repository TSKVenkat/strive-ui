# CSS Grid Layout

The `CSSGrid` and `GridCell` components provide a powerful and intuitive way to create modern grid layouts using CSS Grid. These components offer complete control over grid template areas, columns, rows, and cell placement.

## Features

- **CSS Grid Implementation**: Leverages the full power of modern CSS Grid
- **Template Areas**: Create semantic grid layouts with named areas
- **Explicit Control**: Define exact column and row templates
- **Cell Placement**: Precise control over where cells are placed
- **Alignment Options**: Comprehensive control over grid and cell alignment
- **Gap Control**: Manage spacing between grid items
- **Responsive Design**: Create layouts that adapt to different screen sizes
- **Polymorphic Components**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { CSSGrid, GridCell } from '@pulseui/layout';

function BasicCSSGrid() {
  return (
    <CSSGrid columns="repeat(3, 1fr)" gap="md">
      <GridCell>Cell 1</GridCell>
      <GridCell>Cell 2</GridCell>
      <GridCell>Cell 3</GridCell>
      <GridCell>Cell 4</GridCell>
      <GridCell>Cell 5</GridCell>
      <GridCell>Cell 6</GridCell>
    </CSSGrid>
  );
}
```

## Examples

### Template Areas

```tsx
import { CSSGrid, GridCell } from '@pulseui/layout';

function TemplateAreasExample() {
  return (
    <CSSGrid
      areas={`
        "header header header"
        "sidebar content content"
        "footer footer footer"
      `}
      columns="200px 1fr 1fr"
      rows="auto 1fr auto"
      gap="md"
      style={{ height: '500px' }}
    >
      <GridCell area="header" style={{ background: '#f0f0f0', padding: '1rem' }}>
        Header
      </GridCell>
      <GridCell area="sidebar" style={{ background: '#e0e0e0', padding: '1rem' }}>
        Sidebar
      </GridCell>
      <GridCell area="content" style={{ background: '#d0d0d0', padding: '1rem' }}>
        Main Content
      </GridCell>
      <GridCell area="footer" style={{ background: '#c0c0c0', padding: '1rem' }}>
        Footer
      </GridCell>
    </CSSGrid>
  );
}
```

### Cell Spanning

```tsx
import { CSSGrid, GridCell } from '@pulseui/layout';

function CellSpanningExample() {
  return (
    <CSSGrid columns="repeat(4, 1fr)" gap="md">
      <GridCell column="span 4" style={{ background: '#f0f0f0', padding: '1rem' }}>
        Full Width (span 4)
      </GridCell>
      <GridCell column="span 2" style={{ background: '#e0e0e0', padding: '1rem' }}>
        Half Width (span 2)
      </GridCell>
      <GridCell column="span 2" style={{ background: '#d0d0d0', padding: '1rem' }}>
        Half Width (span 2)
      </GridCell>
      <GridCell column="1 / 3" style={{ background: '#c0c0c0', padding: '1rem' }}>
        Columns 1-2
      </GridCell>
      <GridCell column="3 / 5" style={{ background: '#b0b0b0', padding: '1rem' }}>
        Columns 3-4
      </GridCell>
    </CSSGrid>
  );
}
```

### Complex Layout

```tsx
import { CSSGrid, GridCell } from '@pulseui/layout';

function ComplexLayoutExample() {
  return (
    <CSSGrid
      columns="repeat(6, 1fr)"
      rows="auto auto 1fr auto"
      gap="md"
      style={{ height: '600px' }}
    >
      {/* Header spanning all columns */}
      <GridCell column="1 / -1" style={{ background: '#f0f0f0', padding: '1rem' }}>
        Header
      </GridCell>
      
      {/* Navigation spanning all columns */}
      <GridCell column="1 / -1" style={{ background: '#e0e0e0', padding: '1rem' }}>
        Navigation
      </GridCell>
      
      {/* Sidebar */}
      <GridCell column="1 / 3" row="3 / 4" style={{ background: '#d0d0d0', padding: '1rem' }}>
        Sidebar
      </GridCell>
      
      {/* Main content */}
      <GridCell column="3 / -1" row="3 / 4" style={{ background: '#c0c0c0', padding: '1rem' }}>
        Main Content
      </GridCell>
      
      {/* Footer spanning all columns */}
      <GridCell column="1 / -1" style={{ background: '#b0b0b0', padding: '1rem' }}>
        Footer
      </GridCell>
    </CSSGrid>
  );
}
```

### Alignment Control

```tsx
import { CSSGrid, GridCell } from '@pulseui/layout';

function AlignmentExample() {
  const cellStyle = {
    background: '#f0f0f0',
    border: '1px solid #ccc',
    padding: '1rem',
    height: '50px',
    width: '50px',
  };
  
  return (
    <>
      <h3>Grid Alignment</h3>
      <CSSGrid
        columns="repeat(3, 100px)"
        gap="md"
        justifyContent="center"
        alignItems="center"
        style={{ height: '300px', background: '#eee', marginBottom: '2rem' }}
      >
        <GridCell style={cellStyle}>1</GridCell>
        <GridCell style={cellStyle}>2</GridCell>
        <GridCell style={cellStyle}>3</GridCell>
        <GridCell style={cellStyle}>4</GridCell>
        <GridCell style={cellStyle}>5</GridCell>
        <GridCell style={cellStyle}>6</GridCell>
      </CSSGrid>
      
      <h3>Cell Self-Alignment</h3>
      <CSSGrid
        columns="repeat(3, 100px)"
        gap="md"
        style={{ height: '300px', background: '#eee' }}
      >
        <GridCell style={cellStyle}>Default</GridCell>
        <GridCell style={cellStyle} justifySelf="start" alignSelf="start">
          Top Left
        </GridCell>
        <GridCell style={cellStyle} justifySelf="end" alignSelf="start">
          Top Right
        </GridCell>
        <GridCell style={cellStyle} justifySelf="start" alignSelf="end">
          Bottom Left
        </GridCell>
        <GridCell style={cellStyle} justifySelf="end" alignSelf="end">
          Bottom Right
        </GridCell>
        <GridCell style={cellStyle} justifySelf="center" alignSelf="center">
          Center
        </GridCell>
      </CSSGrid>
    </>
  );
}
```

### Responsive Layout

```tsx
import { CSSGrid, GridCell } from '@pulseui/layout';
import { useState, useEffect } from 'react';

function ResponsiveExample() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  return (
    <CSSGrid
      columns={isMobile ? "1fr" : "repeat(3, 1fr)"}
      gap="md"
    >
      <GridCell style={{ background: '#f0f0f0', padding: '1rem' }}>
        Item 1
      </GridCell>
      <GridCell style={{ background: '#e0e0e0', padding: '1rem' }}>
        Item 2
      </GridCell>
      <GridCell style={{ background: '#d0d0d0', padding: '1rem' }}>
        Item 3
      </GridCell>
    </CSSGrid>
  );
}
```

## API Reference

### CSSGrid Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the grid |
| `columns` | `string` | - | CSS grid-template-columns property |
| `rows` | `string` | - | CSS grid-template-rows property |
| `areas` | `string` | - | CSS grid-template-areas property |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'none'` | Gap between grid items |
| `columnGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Horizontal gap between grid items |
| `rowGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Vertical gap between grid items |
| `alignItems` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | CSS align-items property |
| `justifyItems` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | CSS justify-items property |
| `alignContent` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | CSS align-content property |
| `justifyContent` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | CSS justify-content property |
| `autoFlow` | `'row' \| 'column' \| 'dense' \| 'row dense' \| 'column dense'` | - | CSS grid-auto-flow property |
| `autoRows` | `string` | - | CSS grid-auto-rows property |
| `autoColumns` | `string` | - | CSS grid-auto-columns property |
| `fullWidth` | `boolean` | `false` | Whether to fill the container width |
| `fullHeight` | `boolean` | `false` | Whether to fill the container height |
| `inline` | `boolean` | `false` | Inline grid display |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |
| `responsive` | `object` | - | Responsive props for different breakpoints |

Additionally, the CSSGrid component accepts all standard HTML div attributes.

### GridCell Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the grid cell |
| `column` | `string` | - | CSS grid-column property |
| `row` | `string` | - | CSS grid-row property |
| `area` | `string` | - | CSS grid-area property |
| `justifySelf` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | CSS justify-self property |
| `alignSelf` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | CSS align-self property |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |
| `responsive` | `object` | - | Responsive props for different breakpoints |

Additionally, the GridCell component accepts all standard HTML div attributes.

## Gap Reference

| Size | Value |
|------|-------|
| `none` | 0 |
| `xs` | 0.25rem (4px) |
| `sm` | 0.5rem (8px) |
| `md` | 1rem (16px) |
| `lg` | 1.5rem (24px) |
| `xl` | 2rem (32px) |

## Accessibility

The CSSGrid component doesn't introduce any specific accessibility concerns. It's a layout component that doesn't affect the accessibility of its children.

## Browser Support

The CSSGrid component is compatible with all modern browsers that support CSS Grid:

- Chrome 57+ (March 2017)
- Firefox 52+ (March 2017)
- Safari 10.1+ (March 2017)
- Edge 16+ (October 2017)

For older browsers, consider providing a fallback layout or using a CSS Grid polyfill.

## License

MIT
