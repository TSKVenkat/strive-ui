# Flexbox Layout

The `Flex` and `FlexItem` components provide a powerful and intuitive way to create flexible layouts using CSS Flexbox. These components make it easy to build responsive layouts with proper alignment and spacing.

## Features

- **Flexbox Implementation**: Leverages the power of CSS Flexbox for flexible layouts
- **Direction Control**: Easily switch between row and column layouts
- **Alignment Options**: Comprehensive control over item alignment and justification
- **Gap Control**: Manage spacing between flex items
- **Responsive Design**: Create layouts that adapt to different screen sizes
- **Shorthand Props**: Convenient props like `center` for common layout patterns
- **Polymorphic Components**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { Flex, FlexItem } from '@pulseui/layout';

function BasicFlex() {
  return (
    <Flex gap="md">
      <FlexItem>Item 1</FlexItem>
      <FlexItem>Item 2</FlexItem>
      <FlexItem>Item 3</FlexItem>
    </Flex>
  );
}
```

## Examples

### Different Directions

```tsx
import { Flex, FlexItem } from '@pulseui/layout';

function DirectionExample() {
  return (
    <>
      <Flex direction="row" gap="md">
        <FlexItem>Row Item 1</FlexItem>
        <FlexItem>Row Item 2</FlexItem>
        <FlexItem>Row Item 3</FlexItem>
      </Flex>
      
      <Flex direction="column" gap="md">
        <FlexItem>Column Item 1</FlexItem>
        <FlexItem>Column Item 2</FlexItem>
        <FlexItem>Column Item 3</FlexItem>
      </Flex>
      
      <Flex direction="row-reverse" gap="md">
        <FlexItem>Reversed Row Item 1</FlexItem>
        <FlexItem>Reversed Row Item 2</FlexItem>
        <FlexItem>Reversed Row Item 3</FlexItem>
      </Flex>
    </>
  );
}
```

### Alignment and Justification

```tsx
import { Flex, FlexItem } from '@pulseui/layout';

function AlignmentExample() {
  const boxStyle = {
    padding: '1rem',
    background: '#f0f0f0',
    border: '1px solid #ccc',
  };
  
  return (
    <>
      <h3>Justify Content</h3>
      <Flex justify="flex-start" gap="md" style={{ marginBottom: '1rem' }}>
        <FlexItem style={boxStyle}>Start</FlexItem>
        <FlexItem style={boxStyle}>Start</FlexItem>
        <FlexItem style={boxStyle}>Start</FlexItem>
      </Flex>
      
      <Flex justify="center" gap="md" style={{ marginBottom: '1rem' }}>
        <FlexItem style={boxStyle}>Center</FlexItem>
        <FlexItem style={boxStyle}>Center</FlexItem>
        <FlexItem style={boxStyle}>Center</FlexItem>
      </Flex>
      
      <Flex justify="flex-end" gap="md" style={{ marginBottom: '1rem' }}>
        <FlexItem style={boxStyle}>End</FlexItem>
        <FlexItem style={boxStyle}>End</FlexItem>
        <FlexItem style={boxStyle}>End</FlexItem>
      </Flex>
      
      <Flex justify="space-between" gap="md" style={{ marginBottom: '1rem' }}>
        <FlexItem style={boxStyle}>Space Between</FlexItem>
        <FlexItem style={boxStyle}>Space Between</FlexItem>
        <FlexItem style={boxStyle}>Space Between</FlexItem>
      </Flex>
      
      <h3>Align Items</h3>
      <Flex align="flex-start" gap="md" style={{ height: '100px', marginBottom: '1rem' }}>
        <FlexItem style={{ ...boxStyle, height: '30px' }}>Top</FlexItem>
        <FlexItem style={{ ...boxStyle, height: '50px' }}>Top</FlexItem>
        <FlexItem style={{ ...boxStyle, height: '70px' }}>Top</FlexItem>
      </Flex>
      
      <Flex align="center" gap="md" style={{ height: '100px', marginBottom: '1rem' }}>
        <FlexItem style={{ ...boxStyle, height: '30px' }}>Center</FlexItem>
        <FlexItem style={{ ...boxStyle, height: '50px' }}>Center</FlexItem>
        <FlexItem style={{ ...boxStyle, height: '70px' }}>Center</FlexItem>
      </Flex>
      
      <Flex align="flex-end" gap="md" style={{ height: '100px', marginBottom: '1rem' }}>
        <FlexItem style={{ ...boxStyle, height: '30px' }}>Bottom</FlexItem>
        <FlexItem style={{ ...boxStyle, height: '50px' }}>Bottom</FlexItem>
        <FlexItem style={{ ...boxStyle, height: '70px' }}>Bottom</FlexItem>
      </Flex>
    </>
  );
}
```

### Flex Item Properties

```tsx
import { Flex, FlexItem } from '@pulseui/layout';

function FlexItemExample() {
  return (
    <Flex gap="md">
      <FlexItem grow={1} style={{ background: '#f0f0f0', padding: '1rem' }}>
        Grow 1 (will expand)
      </FlexItem>
      <FlexItem style={{ background: '#e0e0e0', padding: '1rem' }}>
        Default (won't grow)
      </FlexItem>
      <FlexItem grow={2} style={{ background: '#d0d0d0', padding: '1rem' }}>
        Grow 2 (will expand twice as much as Grow 1)
      </FlexItem>
    </Flex>
  );
}
```

### Centering Content

```tsx
import { Flex } from '@pulseui/layout';

function CenteringExample() {
  return (
    <Flex
      center
      style={{
        height: '200px',
        background: '#f0f0f0',
        border: '1px solid #ccc',
      }}
    >
      <div>Perfectly Centered Content</div>
    </Flex>
  );
}
```

### Responsive Layout

```tsx
import { Flex, FlexItem } from '@pulseui/layout';
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
    <Flex
      direction={isMobile ? 'column' : 'row'}
      gap="md"
    >
      <FlexItem style={{ background: '#f0f0f0', padding: '1rem' }}>
        Item 1
      </FlexItem>
      <FlexItem style={{ background: '#e0e0e0', padding: '1rem' }}>
        Item 2
      </FlexItem>
      <FlexItem style={{ background: '#d0d0d0', padding: '1rem' }}>
        Item 3
      </FlexItem>
    </Flex>
  );
}
```

## API Reference

### Flex Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the flex container |
| `direction` | `'row' \| 'row-reverse' \| 'column' \| 'column-reverse'` | `'row'` | Direction of the flex items |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | `'nowrap'` | Whether flex items should wrap |
| `justify` | `'flex-start' \| 'flex-end' \| 'center' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `'flex-start'` | Alignment of flex items along the main axis |
| `align` | `'flex-start' \| 'flex-end' \| 'center' \| 'baseline' \| 'stretch'` | `'stretch'` | Alignment of flex items along the cross axis |
| `alignContent` | `'flex-start' \| 'flex-end' \| 'center' \| 'baseline' \| 'stretch' \| 'space-between' \| 'space-around' \| 'space-evenly'` | - | Alignment of flex lines when there is extra space in the cross-axis |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'none'` | Gap between flex items |
| `columnGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Horizontal gap between flex items |
| `rowGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Vertical gap between flex items |
| `fullWidth` | `boolean` | `false` | Whether to fill the container width |
| `fullHeight` | `boolean` | `false` | Whether to fill the container height |
| `center` | `boolean` | `false` | Whether to center items both horizontally and vertically |
| `inline` | `boolean` | `false` | Whether to make the flex container inline |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the Flex component accepts all standard HTML div attributes.

### FlexItem Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the flex item |
| `grow` | `number` | `0` | Flex grow factor |
| `shrink` | `number` | `1` | Flex shrink factor |
| `basis` | `string \| number` | `'auto'` | Flex basis |
| `flex` | `string \| number` | - | Shorthand for flex property (grow, shrink, basis) |
| `alignSelf` | `'auto' \| 'flex-start' \| 'flex-end' \| 'center' \| 'baseline' \| 'stretch'` | - | Alignment of the item along the cross axis |
| `order` | `number` | - | Order of the item |
| `fullWidth` | `boolean` | `false` | Whether to fill the container width |
| `fullHeight` | `boolean` | `false` | Whether to fill the container height |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the FlexItem component accepts all standard HTML div attributes.

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

The Flex component doesn't introduce any specific accessibility concerns. It's a layout component that doesn't affect the accessibility of its children.

## Browser Support

The Flex component is compatible with all modern browsers that support CSS Flexbox:

- Chrome 29+ (August 2013)
- Firefox 22+ (June 2013)
- Safari 6.1+ (October 2013)
- Edge 12+ (July 2015)

For older browsers, consider providing a fallback layout or using a CSS Flexbox polyfill.

## License

MIT
