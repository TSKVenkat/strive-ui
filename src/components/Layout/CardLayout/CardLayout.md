# Card Layout

The `CardLayout` component provides a flexible way to create card-based layouts with different arrangements and styles. It supports grid, list, compact, and featured layouts, making it ideal for displaying collections of content like products, articles, or media.

## Features

- **Multiple Layout Variants**: Grid, list, compact, and featured layouts
- **Responsive Columns**: Adjust the number of columns based on screen size
- **Gap Control**: Manage spacing between cards
- **Equal Height Option**: Force all cards to have the same height
- **Featured Item Support**: Highlight the first item in featured layout
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { CardLayout } from '@strive-ui/layout';

function BasicCardLayout() {
  return (
    <CardLayout columns={3} gap="md">
      <div className="card">Card 1</div>
      <div className="card">Card 2</div>
      <div className="card">Card 3</div>
      <div className="card">Card 4</div>
      <div className="card">Card 5</div>
      <div className="card">Card 6</div>
    </CardLayout>
  );
}
```

## Examples

### Different Layout Variants

```tsx
import { CardLayout } from '@strive-ui/layout';
import { useState } from 'react';

function LayoutVariantsExample() {
  const [variant, setVariant] = useState<'grid' | 'list' | 'compact' | 'featured'>('grid');
  
  const cards = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      style={{
        padding: '1.5rem',
        background: '#f0f0f0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h3>Card {i + 1}</h3>
      <p>This is a sample card with some content.</p>
    </div>
  ));

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setVariant('grid')}>Grid</button>
        <button onClick={() => setVariant('list')}>List</button>
        <button onClick={() => setVariant('compact')}>Compact</button>
        <button onClick={() => setVariant('featured')}>Featured</button>
      </div>
      
      <CardLayout variant={variant} columns={3} gap="md">
        {cards}
      </CardLayout>
    </div>
  );
}
```

### Equal Height Cards

```tsx
import { CardLayout } from '@strive-ui/layout';

function EqualHeightExample() {
  const cards = [
    { id: 1, title: 'Card 1', content: 'Short content' },
    { id: 2, title: 'Card 2', content: 'This card has more content than the others, making it taller in the layout. With equal height enabled, all cards will have the same height.' },
    { id: 3, title: 'Card 3', content: 'Medium length content that spans a couple of lines in the card.' },
    { id: 4, title: 'Card 4', content: 'Short content' },
    { id: 5, title: 'Card 5', content: 'Another card with medium length content.' },
    { id: 6, title: 'Card 6', content: 'Short content' },
  ];

  return (
    <CardLayout columns={3} gap="md" equalHeight>
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            padding: '1.5rem',
            background: '#f0f0f0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3>{card.title}</h3>
          <p style={{ flex: 1 }}>{card.content}</p>
          <button style={{ marginTop: 'auto' }}>Read More</button>
        </div>
      ))}
    </CardLayout>
  );
}
```

### Featured Layout

```tsx
import { CardLayout } from '@strive-ui/layout';

function FeaturedLayoutExample() {
  const articles = [
    { id: 1, title: 'Featured Article', content: 'This is the featured article that will be displayed prominently at the top of the layout.', image: 'featured.jpg' },
    { id: 2, title: 'Article 2', content: 'Regular article content.', image: 'article2.jpg' },
    { id: 3, title: 'Article 3', content: 'Regular article content.', image: 'article3.jpg' },
    { id: 4, title: 'Article 4', content: 'Regular article content.', image: 'article4.jpg' },
    { id: 5, title: 'Article 5', content: 'Regular article content.', image: 'article5.jpg' },
  ];

  return (
    <CardLayout variant="featured" columns={3} gap="md">
      {articles.map((article) => (
        <div
          key={article.id}
          style={{
            padding: '1.5rem',
            background: '#f0f0f0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              height: '150px',
              background: '#ddd',
              marginBottom: '1rem',
              backgroundImage: `url(${article.image})`,
              backgroundSize: 'cover',
              borderRadius: '4px',
            }}
          />
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </CardLayout>
  );
}
```

### Product Grid

```tsx
import { CardLayout } from '@strive-ui/layout';

function ProductGridExample() {
  const products = [
    { id: 1, name: 'Product 1', price: '$19.99', image: 'product1.jpg' },
    { id: 2, name: 'Product 2', price: '$29.99', image: 'product2.jpg' },
    { id: 3, name: 'Product 3', price: '$39.99', image: 'product3.jpg' },
    { id: 4, name: 'Product 4', price: '$49.99', image: 'product4.jpg' },
    { id: 5, name: 'Product 5', price: '$59.99', image: 'product5.jpg' },
    { id: 6, name: 'Product 6', price: '$69.99', image: 'product6.jpg' },
    { id: 7, name: 'Product 7', price: '$79.99', image: 'product7.jpg' },
    { id: 8, name: 'Product 8', price: '$89.99', image: 'product8.jpg' },
  ];

  return (
    <CardLayout
      columns={4}
      gap="md"
      equalHeight
      responsive={{
        sm: { columns: 2 },
        md: { columns: 3 },
        lg: { columns: 4 },
      }}
    >
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            padding: '1rem',
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              height: '200px',
              background: '#f0f0f0',
              marginBottom: '1rem',
              backgroundImage: `url(${product.image})`,
              backgroundSize: 'cover',
              borderRadius: '4px',
            }}
          />
          <h3>{product.name}</h3>
          <p style={{ fontWeight: 'bold' }}>{product.price}</p>
          <button style={{ marginTop: 'auto' }}>Add to Cart</button>
        </div>
      ))}
    </CardLayout>
  );
}
```

## API Reference

### CardLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The cards to render in the layout |
| `variant` | `'grid' \| 'list' \| 'compact' \| 'featured'` | `'grid'` | Layout variant |
| `columns` | `number` | `3` | Number of columns in grid variant |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Gap between cards |
| `columnGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Horizontal gap between cards |
| `rowGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Vertical gap between cards |
| `fullWidth` | `boolean` | `true` | Whether to fill the container width |
| `equalHeight` | `boolean` | `false` | Whether cards should have equal height |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |
| `responsive` | `object` | - | Responsive configuration for different breakpoints |

Additionally, the CardLayout component accepts all standard HTML div attributes.

## Layout Variants

| Variant | Description |
|---------|-------------|
| `grid` | Cards are arranged in a grid with the specified number of columns |
| `list` | Cards are stacked vertically in a single column |
| `compact` | Similar to list but with reduced padding and spacing |
| `featured` | First card spans multiple columns to highlight it |

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

The CardLayout component doesn't introduce any specific accessibility concerns. It's a layout component that doesn't affect the accessibility of its children.

## Browser Support

The CardLayout component is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
