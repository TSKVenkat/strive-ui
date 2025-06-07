# Masonry Layout

The `Masonry` component creates a Pinterest-like grid layout where items are arranged optimally based on available vertical space. Unlike traditional grid layouts, masonry layouts allow items of varying heights to be placed efficiently without leaving large gaps.

## Features

- **Dynamic Column Distribution**: Automatically distributes items across columns
- **Responsive Design**: Adjusts the number of columns based on screen size
- **Custom Gap Control**: Manage spacing between masonry items
- **Flexible Item Sizing**: Accommodates items of varying heights
- **Optimized Layout**: Minimizes empty space in the layout
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { Masonry } from '@pulseui/layout';

function BasicMasonry() {
  // Create an array of items with varying heights
  const items = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      style={{
        height: `${Math.floor(Math.random() * 200) + 100}px`,
        background: '#f0f0f0',
        padding: '1rem',
        borderRadius: '4px',
      }}
    >
      Item {i + 1}
    </div>
  ));

  return (
    <Masonry columns={3} gap="1rem">
      {items}
    </Masonry>
  );
}
```

## Examples

### Responsive Columns

```tsx
import { Masonry } from '@pulseui/layout';

function ResponsiveMasonry() {
  const items = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      style={{
        height: `${Math.floor(Math.random() * 200) + 100}px`,
        background: '#f0f0f0',
        padding: '1rem',
        borderRadius: '4px',
      }}
    >
      Item {i + 1}
    </div>
  ));

  return (
    <Masonry
      breakpoints={{
        default: 1, // 1 column on mobile
        sm: 2,      // 2 columns on small screens (640px+)
        md: 3,      // 3 columns on medium screens (768px+)
        lg: 4,      // 4 columns on large screens (1024px+)
        xl: 5       // 5 columns on extra large screens (1280px+)
      }}
      gap="1rem"
    >
      {items}
    </Masonry>
  );
}
```

### Custom Gap Spacing

```tsx
import { Masonry } from '@pulseui/layout';

function CustomGapMasonry() {
  const items = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      style={{
        height: `${Math.floor(Math.random() * 200) + 100}px`,
        background: '#f0f0f0',
        padding: '1rem',
        borderRadius: '4px',
      }}
    >
      Item {i + 1}
    </div>
  ));

  return (
    <Masonry
      columns={3}
      columnGap="2rem"
      rowGap="1rem"
    >
      {items}
    </Masonry>
  );
}
```

### Image Gallery

```tsx
import { Masonry } from '@pulseui/layout';
import { useState, useEffect } from 'react';

function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching images from an API
    const fetchImages = async () => {
      // In a real app, this would be an API call
      const mockImages = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        url: `https://source.unsplash.com/random/300x${Math.floor(Math.random() * 300) + 200}?sig=${i}`,
        alt: `Random image ${i + 1}`,
      }));
      
      setImages(mockImages);
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (loading) {
    return <div>Loading images...</div>;
  }

  return (
    <Masonry
      columns={4}
      gap="0.5rem"
      breakpoints={{
        default: 1,
        sm: 2,
        md: 3,
        lg: 4
      }}
    >
      {images.map((image) => (
        <div
          key={image.id}
          style={{
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <img
            src={image.url}
            alt={image.alt}
            style={{
              width: '100%',
              display: 'block',
            }}
          />
        </div>
      ))}
    </Masonry>
  );
}
```

### With Card Components

```tsx
import { Masonry } from '@pulseui/layout';

function CardMasonry() {
  // Sample card data
  const cards = [
    { id: 1, title: 'Card 1', content: 'Short content', color: '#f8d7da' },
    { id: 2, title: 'Card 2', content: 'This card has more content than the others, making it taller in the layout.', color: '#d1ecf1' },
    { id: 3, title: 'Card 3', content: 'Medium length content that spans a couple of lines in the card.', color: '#d4edda' },
    { id: 4, title: 'Card 4', content: 'Short content', color: '#fff3cd' },
    { id: 5, title: 'Card 5', content: 'This is another card with a lot of content. It demonstrates how the masonry layout handles varying heights efficiently without leaving large gaps.', color: '#cce5ff' },
    { id: 6, title: 'Card 6', content: 'Short content', color: '#f8d7da' },
    { id: 7, title: 'Card 7', content: 'Medium length content that spans a couple of lines in the card.', color: '#d1ecf1' },
    { id: 8, title: 'Card 8', content: 'Short content', color: '#d4edda' },
  ];

  return (
    <Masonry
      columns={3}
      gap="1rem"
      breakpoints={{
        default: 1,
        md: 2,
        lg: 3
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          style={{
            background: card.color,
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginTop: 0 }}>{card.title}</h3>
          <p>{card.content}</p>
        </div>
      ))}
    </Masonry>
  );
}
```

## API Reference

### Masonry Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode[]` | - | The items to render in the masonry layout |
| `columns` | `number` | `3` | Number of columns in the masonry layout |
| `breakpoints` | `MasonryBreakpoints` | - | Responsive column configuration for different breakpoints |
| `gap` | `string \| number` | `'1rem'` | Gap between masonry items |
| `columnGap` | `string \| number` | - | Horizontal gap between masonry items |
| `rowGap` | `string \| number` | - | Vertical gap between masonry items |
| `fullWidth` | `boolean` | `true` | Whether to fill the container width |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the Masonry component accepts all standard HTML div attributes except for `children`.

### MasonryBreakpoints Type

| Name | Type | Description |
|------|------|-------------|
| `default` | `number` | Default number of columns |
| `sm` | `number` (optional) | Number of columns at small breakpoint (640px+) |
| `md` | `number` (optional) | Number of columns at medium breakpoint (768px+) |
| `lg` | `number` (optional) | Number of columns at large breakpoint (1024px+) |
| `xl` | `number` (optional) | Number of columns at extra large breakpoint (1280px+) |
| `2xl` | `number` (optional) | Number of columns at 2x extra large breakpoint (1536px+) |

## Implementation Details

The Masonry component uses a column-first distribution approach, where items are distributed evenly across columns. This approach is simpler than calculating optimal item placement based on height, but still provides a visually appealing masonry layout.

For more complex masonry layouts with optimal item placement based on height, consider using a library like `react-masonry-css` or implementing a more sophisticated algorithm.

## Accessibility

The Masonry component doesn't introduce any specific accessibility concerns. It's a layout component that doesn't affect the accessibility of its children.

## Browser Support

The Masonry component is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
