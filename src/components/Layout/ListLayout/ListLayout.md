# List Layout

The `ListLayout` and `ListItem` components provide a flexible way to create various list-based layouts. They support different styles, sizes, and arrangements, making them ideal for displaying collections of items like navigation menus, feature lists, or content summaries.

## Features

- **Multiple Variants**: Default, compact, divided, bordered, card, and grid layouts
- **Customizable Sizing**: Different size options for list items
- **Horizontal or Vertical**: Display lists in either direction
- **Ordered or Unordered**: Support for both ordered and unordered lists
- **Grid Support**: Display list items in a grid layout
- **Gap Control**: Manage spacing between list items
- **Active and Disabled States**: Built-in support for active and disabled items
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { ListLayout, ListItem } from '@strive-ui/layout';

function BasicList() {
  return (
    <ListLayout>
      <ListItem>Item 1</ListItem>
      <ListItem>Item 2</ListItem>
      <ListItem>Item 3</ListItem>
      <ListItem>Item 4</ListItem>
      <ListItem>Item 5</ListItem>
    </ListLayout>
  );
}
```

## Examples

### Different Variants

```tsx
import { ListLayout, ListItem } from '@strive-ui/layout';
import { useState } from 'react';

function VariantsExample() {
  const [variant, setVariant] = useState<'default' | 'compact' | 'divided' | 'bordered' | 'card' | 'grid'>('default');
  
  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setVariant('default')}>Default</button>
        <button onClick={() => setVariant('compact')}>Compact</button>
        <button onClick={() => setVariant('divided')}>Divided</button>
        <button onClick={() => setVariant('bordered')}>Bordered</button>
        <button onClick={() => setVariant('card')}>Card</button>
        <button onClick={() => setVariant('grid')}>Grid</button>
      </div>
      
      <ListLayout variant={variant} columns={3}>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
        <ListItem>Item 3</ListItem>
        <ListItem>Item 4</ListItem>
        <ListItem>Item 5</ListItem>
        <ListItem>Item 6</ListItem>
      </ListLayout>
    </div>
  );
}
```

### Different Sizes

```tsx
import { ListLayout, ListItem } from '@strive-ui/layout';

function SizesExample() {
  return (
    <div>
      <h3>Extra Small</h3>
      <ListLayout size="xs" variant="bordered">
        <ListItem>Extra Small Item</ListItem>
        <ListItem>Extra Small Item</ListItem>
        <ListItem>Extra Small Item</ListItem>
      </ListLayout>
      
      <h3>Small</h3>
      <ListLayout size="sm" variant="bordered">
        <ListItem>Small Item</ListItem>
        <ListItem>Small Item</ListItem>
        <ListItem>Small Item</ListItem>
      </ListLayout>
      
      <h3>Medium (Default)</h3>
      <ListLayout size="md" variant="bordered">
        <ListItem>Medium Item</ListItem>
        <ListItem>Medium Item</ListItem>
        <ListItem>Medium Item</ListItem>
      </ListLayout>
      
      <h3>Large</h3>
      <ListLayout size="lg" variant="bordered">
        <ListItem>Large Item</ListItem>
        <ListItem>Large Item</ListItem>
        <ListItem>Large Item</ListItem>
      </ListLayout>
      
      <h3>Extra Large</h3>
      <ListLayout size="xl" variant="bordered">
        <ListItem>Extra Large Item</ListItem>
        <ListItem>Extra Large Item</ListItem>
        <ListItem>Extra Large Item</ListItem>
      </ListLayout>
    </div>
  );
}
```

### Horizontal List

```tsx
import { ListLayout, ListItem } from '@strive-ui/layout';

function HorizontalListExample() {
  return (
    <ListLayout horizontal gap="md" variant="bordered">
      <ListItem>Home</ListItem>
      <ListItem>Products</ListItem>
      <ListItem>Services</ListItem>
      <ListItem>About</ListItem>
      <ListItem>Contact</ListItem>
    </ListLayout>
  );
}
```

### Ordered List

```tsx
import { ListLayout, ListItem } from '@strive-ui/layout';

function OrderedListExample() {
  return (
    <ListLayout ordered variant="default">
      <ListItem>First step</ListItem>
      <ListItem>Second step</ListItem>
      <ListItem>Third step</ListItem>
      <ListItem>Fourth step</ListItem>
      <ListItem>Fifth step</ListItem>
    </ListLayout>
  );
}
```

### Active and Disabled Items

```tsx
import { ListLayout, ListItem } from '@strive-ui/layout';

function StateExample() {
  return (
    <ListLayout variant="card">
      <ListItem>Regular Item</ListItem>
      <ListItem active>Active Item</ListItem>
      <ListItem disabled>Disabled Item</ListItem>
      <ListItem>Regular Item</ListItem>
      <ListItem active>Active Item</ListItem>
    </ListLayout>
  );
}
```

### Feature List

```tsx
import { ListLayout, ListItem } from '@strive-ui/layout';

function FeatureListExample() {
  const features = [
    { id: 1, title: 'Responsive Design', description: 'Layouts that adapt to any screen size' },
    { id: 2, title: 'Customizable Themes', description: 'Easily change colors, fonts, and styles' },
    { id: 3, title: 'Accessibility Built-in', description: 'ARIA attributes and keyboard navigation' },
    { id: 4, title: 'Performance Optimized', description: 'Fast loading and smooth interactions' },
    { id: 5, title: 'Cross-browser Support', description: 'Works in all modern browsers' },
    { id: 6, title: 'Comprehensive Documentation', description: 'Detailed guides and examples' },
  ];

  return (
    <ListLayout variant="card" columns={2} gap="md">
      {features.map((feature) => (
        <ListItem key={feature.id}>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </ListItem>
      ))}
    </ListLayout>
  );
}
```

## API Reference

### ListLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The list items to render |
| `variant` | `'default' \| 'compact' \| 'divided' \| 'bordered' \| 'card' \| 'grid'` | `'default'` | Layout variant |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the list items |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Gap between list items |
| `fullWidth` | `boolean` | `true` | Whether to fill the container width |
| `ordered` | `boolean` | `false` | Whether to render as an ordered list |
| `horizontal` | `boolean` | `false` | Whether to render as a horizontal list |
| `columns` | `number` | `2` | Number of columns when variant is 'grid' |
| `as` | `React.ElementType` | based on ordered prop | The component used for the root node |
| `className` | `string` | `''` | Custom class name |
| `responsive` | `object` | - | Responsive configuration for different breakpoints |

Additionally, the ListLayout component accepts all standard HTML ul/ol attributes except for `size`.

### ListItem Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the list item |
| `active` | `boolean` | `false` | Whether the item is active |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `className` | `string` | `''` | Custom class name |

Additionally, the ListItem component accepts all standard HTML li attributes.

## Layout Variants

| Variant | Description |
|---------|-------------|
| `default` | Basic list with minimal styling |
| `compact` | Reduced padding for a more condensed list |
| `divided` | Items separated by borders |
| `bordered` | Each item has a border around it |
| `card` | Each item is styled as a card with shadow |
| `grid` | Items arranged in a grid layout |

## Size Reference

| Size | Padding |
|------|---------|
| `xs` | 0.25rem (4px) |
| `sm` | 0.5rem (8px) |
| `md` | 0.75rem (12px) |
| `lg` | 1rem (16px) |
| `xl` | 1.25rem (20px) |

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

The ListLayout component uses semantic HTML elements (`ul`, `ol`, `li`) by default, which provides good accessibility. Additionally:

- The `disabled` prop on ListItem adds the `aria-disabled` attribute
- When using the component for navigation, consider adding appropriate ARIA roles

## Browser Support

The ListLayout component is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
