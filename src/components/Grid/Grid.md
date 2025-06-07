# Grid Component

The Grid component provides a flexible and responsive layout system based on CSS Grid. It allows for creating complex layouts with precise control over item placement and spacing.

## Import

```jsx
import { Grid } from 'pulseui';
```

## Features

- Responsive grid layouts
- Customizable columns and rows
- Control over item placement
- Adjustable gap between items
- Support for different breakpoints
- Auto-placement capabilities
- Named template areas

## Usage

```jsx
import { Grid } from 'pulseui';

// Basic grid with equal columns
<Grid columns={3} gap="1rem">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
  <div>Item 6</div>
</Grid>

// Responsive grid with different column counts at different breakpoints
<Grid
  columns={{
    base: 1,
    sm: 2,
    md: 3,
    lg: 4
  }}
  gap="1rem"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Grid>

// Grid with custom column sizes
<Grid
  templateColumns="1fr 2fr 1fr"
  gap="1rem"
>
  <div>Narrow</div>
  <div>Wide</div>
  <div>Narrow</div>
</Grid>

// Grid with named template areas
<Grid
  templateAreas={`
    "header header header"
    "sidebar main main"
    "footer footer footer"
  `}
  gridTemplateRows="auto 1fr auto"
  gridTemplateColumns="200px 1fr 1fr"
  height="100vh"
  gap="1rem"
>
  <Grid.Item area="header" background="primary.100">Header</Grid.Item>
  <Grid.Item area="sidebar" background="secondary.100">Sidebar</Grid.Item>
  <Grid.Item area="main" background="neutral.100">Main Content</Grid.Item>
  <Grid.Item area="footer" background="primary.100">Footer</Grid.Item>
</Grid>

// Grid with specific item placement
<Grid
  templateColumns="repeat(3, 1fr)"
  templateRows="repeat(3, 100px)"
  gap="1rem"
>
  <Grid.Item colSpan={2} rowSpan={2} background="primary.100">
    Item spanning 2x2
  </Grid.Item>
  <Grid.Item colStart={3} colEnd={4} rowStart={1} rowEnd={2} background="secondary.100">
    Item at specific position
  </Grid.Item>
  <Grid.Item colStart={3} colEnd={4} rowStart={2} rowEnd={4} background="success.100">
    Item spanning multiple rows
  </Grid.Item>
  <Grid.Item colStart={1} colEnd={3} rowStart={3} rowEnd={4} background="warning.100">
    Item spanning multiple columns
  </Grid.Item>
</Grid>
```

## Props

### Grid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | number \| object | - | Number of columns (can be responsive object) |
| `rows` | number \| object | - | Number of rows (can be responsive object) |
| `gap` | string \| number \| object | '0' | Gap between grid items |
| `columnGap` | string \| number \| object | - | Gap between columns |
| `rowGap` | string \| number \| object | - | Gap between rows |
| `templateColumns` | string | - | CSS grid-template-columns value |
| `templateRows` | string | - | CSS grid-template-rows value |
| `templateAreas` | string | - | CSS grid-template-areas value |
| `autoColumns` | string | - | CSS grid-auto-columns value |
| `autoRows` | string | - | CSS grid-auto-rows value |
| `autoFlow` | 'row' \| 'column' \| 'dense' \| 'row dense' \| 'column dense' | - | CSS grid-auto-flow value |
| `justifyItems` | 'start' \| 'end' \| 'center' \| 'stretch' | - | CSS justify-items value |
| `alignItems` | 'start' \| 'end' \| 'center' \| 'stretch' | - | CSS align-items value |
| `justifyContent` | 'start' \| 'end' \| 'center' \| 'stretch' \| 'space-around' \| 'space-between' \| 'space-evenly' | - | CSS justify-content value |
| `alignContent` | 'start' \| 'end' \| 'center' \| 'stretch' \| 'space-around' \| 'space-between' \| 'space-evenly' | - | CSS align-content value |
| `width` | string \| number | - | Width of the grid container |
| `height` | string \| number | - | Height of the grid container |
| `minWidth` | string \| number | - | Minimum width of the grid container |
| `minHeight` | string \| number | - | Minimum height of the grid container |
| `maxWidth` | string \| number | - | Maximum width of the grid container |
| `maxHeight` | string \| number | - | Maximum height of the grid container |
| `padding` | string \| number \| object | - | Padding of the grid container |

### Grid.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `area` | string | - | Grid area name (corresponds to grid-template-areas) |
| `colStart` | number \| string | - | Grid column start line |
| `colEnd` | number \| string | - | Grid column end line |
| `rowStart` | number \| string | - | Grid row start line |
| `rowEnd` | number \| string | - | Grid row end line |
| `colSpan` | number | - | Number of columns to span |
| `rowSpan` | number | - | Number of rows to span |
| `justifySelf` | 'start' \| 'end' \| 'center' \| 'stretch' | - | CSS justify-self value |
| `alignSelf` | 'start' \| 'end' \| 'center' \| 'stretch' | - | CSS align-self value |
| `background` | string | - | Background color of the grid item |
| `padding` | string \| number \| object | - | Padding of the grid item |

## Responsive Props

Many Grid props accept responsive values in the form of objects with breakpoint keys:

```jsx
<Grid
  columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
  gap={{ base: '0.5rem', md: '1rem' }}
>
  {/* Grid items */}
</Grid>
```

The available breakpoint keys are:
- `base`: 0px and up
- `sm`: 576px and up
- `md`: 768px and up
- `lg`: 992px and up
- `xl`: 1200px and up
- `2xl`: 1400px and up

## Accessibility

The Grid component follows accessibility best practices:
- Uses semantic HTML structure
- Maintains a logical tab order for keyboard navigation
- Preserves content readability at different viewport sizes
- Ensures proper focus management
- Supports responsive layouts for different devices and screen sizes
