# Grid System

The `Grid` and `GridItem` components provide a powerful and flexible grid system based on CSS Grid. These components allow you to create complex layouts with precise control over item placement, alignment, and responsiveness.

## Features

- **CSS Grid Implementation**: Leverages the power of modern CSS Grid for advanced layouts
- **Flexible Column System**: Supports 1-12 column grids with customizable spans
- **Gap Control**: Easily manage spacing between grid items
- **Item Placement**: Precise control over where items are placed in the grid
- **Alignment Options**: Control alignment of items and content in both axes
- **Named Areas**: Support for named grid areas for semantic layouts
- **Auto Flow Control**: Manage how items are automatically placed in the grid
- **Responsive Design**: Built-in support for different layouts at different breakpoints
- **Polymorphic Components**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { Grid, GridItem } from '@strive-ui/layout';

function BasicGrid() {
  return (
    <Grid columns={3} gap="md">
      <GridItem>Item 1</GridItem>
      <GridItem>Item 2</GridItem>
      <GridItem>Item 3</GridItem>
      <GridItem>Item 4</GridItem>
      <GridItem>Item 5</GridItem>
      <GridItem>Item 6</GridItem>
    </Grid>
  );
}
```

## Examples

### Different Column Spans

```tsx
import { Grid, GridItem } from '@strive-ui/layout';

function SpanExample() {
  return (
    <Grid columns={12} gap="md">
      <GridItem span={12}>Full Width (12 columns)</GridItem>
      <GridItem span={6}>Half Width (6 columns)</GridItem>
      <GridItem span={6}>Half Width (6 columns)</GridItem>
      <GridItem span={4}>One Third (4 columns)</GridItem>
      <GridItem span={4}>One Third (4 columns)</GridItem>
      <GridItem span={4}>One Third (4 columns)</GridItem>
      <GridItem span={3}>One Quarter (3 columns)</GridItem>
      <GridItem span={9}>Three Quarters (9 columns)</GridItem>
    </Grid>
  );
}
```

### Precise Item Placement

```tsx
import { Grid, GridItem } from '@strive-ui/layout';

function PlacementExample() {
  return (
    <Grid columns={3} gap="md" style={{ height: '300px' }}>
      <GridItem colStart={1} colEnd={3} rowStart={1} rowEnd={2}>
        Top left spanning 2 columns
      </GridItem>
      <GridItem colStart={3} rowStart={1} rowEnd={3}>
        Right side spanning 2 rows
      </GridItem>
      <GridItem colStart={1} colEnd={3} rowStart={2}>
        Bottom left spanning 2 columns
      </GridItem>
    </Grid>
  );
}
```

### Named Grid Areas

```tsx
import { Grid, GridItem } from '@strive-ui/layout';

function NamedAreasExample() {
  return (
    <Grid
      gridAreas={`
        "header header header"
        "sidebar content content"
        "footer footer footer"
      `}
      gap="md"
      style={{ height: '500px' }}
    >
      <GridItem area="header" style={{ background: '#f0f0f0' }}>
        Header
      </GridItem>
      <GridItem area="sidebar" style={{ background: '#e0e0e0' }}>
        Sidebar
      </GridItem>
      <GridItem area="content" style={{ background: '#d0d0d0' }}>
        Main Content
      </GridItem>
      <GridItem area="footer" style={{ background: '#c0c0c0' }}>
        Footer
      </GridItem>
    </Grid>
  );
}
```

### Custom Template Columns

```tsx
import { Grid, GridItem } from '@strive-ui/layout';

function CustomColumnsExample() {
  return (
    <Grid templateColumns="1fr 2fr 1fr" gap="md">
      <GridItem>Sidebar Left</GridItem>
      <GridItem>Main Content (2x width)</GridItem>
      <GridItem>Sidebar Right</GridItem>
    </Grid>
  );
}
```

### Alignment Control

```tsx
import { Grid, GridItem } from '@strive-ui/layout';

function AlignmentExample() {
  return (
    <Grid
      columns={3}
      gap="md"
      alignItems="center"
      justifyItems="center"
      style={{ height: '300px' }}
    >
      <GridItem style={{ height: '50px', width: '50px', background: '#f0f0f0' }}>
        Centered Item
      </GridItem>
      <GridItem
        style={{ height: '50px', width: '50px', background: '#e0e0e0' }}
        alignSelf="start"
        justifySelf="start"
      >
        Top Left
      </GridItem>
      <GridItem
        style={{ height: '50px', width: '50px', background: '#d0d0d0' }}
        alignSelf="end"
        justifySelf="end"
      >
        Bottom Right
      </GridItem>
    </Grid>
  );
}
```

### Auto Flow Control

```tsx
import { Grid, GridItem } from '@strive-ui/layout';

function AutoFlowExample() {
  return (
    <Grid
      columns={4}
      gap="md"
      autoFlow="dense"
      style={{ height: '300px' }}
    >
      <GridItem span={2}>Item 1 (span 2)</GridItem>
      <GridItem span={2}>Item 2 (span 2)</GridItem>
      <GridItem span={1}>Item 3 (span 1)</GridItem>
      <GridItem span={3}>Item 4 (span 3)</GridItem>
      <GridItem span={2}>Item 5 (span 2)</GridItem>
      <GridItem span={1}>Item 6 (span 1)</GridItem>
    </Grid>
  );
}
```

## API Reference

### Grid Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the grid |
| `columns` | `1-12 \| 'auto' \| 'none'` | `12` | Number of columns in the grid |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Gap between grid items |
| `columnGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Horizontal gap between grid items |
| `rowGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Vertical gap between grid items |
| `alignItems` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | Alignment of grid items along the vertical axis |
| `justifyItems` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | Alignment of grid items along the horizontal axis |
| `alignContent` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | Alignment of the entire grid along the vertical axis |
| `justifyContent` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | Alignment of the entire grid along the horizontal axis |
| `gridFlow` | `'row' \| 'column' \| 'row-dense' \| 'column-dense'` | - | Direction in which grid items are placed |
| `gridAreas` | `string` | - | Named grid areas |
| `autoFlow` | `'row' \| 'column' \| 'dense' \| 'row dense' \| 'column dense'` | - | Controls how auto-placed items are flowed into the grid |
| `autoRows` | `'auto' \| 'min' \| 'max' \| 'fr' \| string` | - | Size of implicitly created rows |
| `autoColumns` | `'auto' \| 'min' \| 'max' \| 'fr' \| string` | - | Size of implicitly created columns |
| `templateRows` | `string` | - | Defines the size of rows in the grid |
| `templateColumns` | `string` | - | Defines the size of columns in the grid |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |
| `responsive` | `object` | - | Responsive configuration for different breakpoints |

Additionally, the Grid component accepts all standard HTML div attributes.

### GridItem Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the grid item |
| `span` | `number` | `1` | Number of columns the item spans |
| `colStart` | `number \| 'auto'` | - | Starting column of the item |
| `colEnd` | `number \| 'auto'` | - | Ending column of the item |
| `rowStart` | `number \| 'auto'` | - | Starting row of the item |
| `rowEnd` | `number \| 'auto'` | - | Ending row of the item |
| `area` | `string` | - | Grid area for the item |
| `alignSelf` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | Alignment of the item along the vertical axis |
| `justifySelf` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | Alignment of the item along the horizontal axis |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |
| `responsive` | `object` | - | Responsive configuration for different breakpoints |

Additionally, the GridItem component accepts all standard HTML div attributes.

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

The Grid component doesn't introduce any specific accessibility concerns. It's a layout component that doesn't affect the accessibility of its children.

## Browser Support

The Grid component is compatible with all modern browsers that support CSS Grid:

- Chrome 57+ (March 2017)
- Firefox 52+ (March 2017)
- Safari 10.1+ (March 2017)
- Edge 16+ (October 2017)

For older browsers, consider providing a fallback layout or using a CSS Grid polyfill.

## License

MIT
