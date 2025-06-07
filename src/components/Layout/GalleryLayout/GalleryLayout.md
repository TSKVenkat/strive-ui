# Gallery Layout

The `GalleryLayout` component provides a flexible way to create various image gallery layouts. It supports different display styles, aspect ratios, and includes a built-in lightbox feature, making it ideal for showcasing images, photos, or other media content.

## Features

- **Multiple Layout Variants**: Grid, masonry, carousel, filmstrip, and mosaic layouts
- **Responsive Columns**: Adjust the number of columns based on screen size
- **Aspect Ratio Control**: Maintain consistent image proportions
- **Gap Control**: Manage spacing between gallery items
- **Built-in Lightbox**: Optional lightbox for full-screen image viewing
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { GalleryLayout } from '@pulseui/layout';

function BasicGallery() {
  const images = [
    { id: 1, src: '/images/image1.jpg', alt: 'Image 1' },
    { id: 2, src: '/images/image2.jpg', alt: 'Image 2' },
    { id: 3, src: '/images/image3.jpg', alt: 'Image 3' },
    { id: 4, src: '/images/image4.jpg', alt: 'Image 4' },
    { id: 5, src: '/images/image5.jpg', alt: 'Image 5' },
    { id: 6, src: '/images/image6.jpg', alt: 'Image 6' },
  ];

  return (
    <GalleryLayout columns={3} gap="md" lightbox>
      {images.map((image) => (
        <img key={image.id} src={image.src} alt={image.alt} />
      ))}
    </GalleryLayout>
  );
}
```

## Examples

### Different Layout Variants

```tsx
import { GalleryLayout } from '@pulseui/layout';
import { useState } from 'react';

function LayoutVariantsExample() {
  const [variant, setVariant] = useState<'grid' | 'masonry' | 'carousel' | 'filmstrip' | 'mosaic'>('grid');
  
  const images = [
    { id: 1, src: '/images/image1.jpg', alt: 'Image 1' },
    { id: 2, src: '/images/image2.jpg', alt: 'Image 2' },
    { id: 3, src: '/images/image3.jpg', alt: 'Image 3' },
    { id: 4, src: '/images/image4.jpg', alt: 'Image 4' },
    { id: 5, src: '/images/image5.jpg', alt: 'Image 5' },
    { id: 6, src: '/images/image6.jpg', alt: 'Image 6' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setVariant('grid')}>Grid</button>
        <button onClick={() => setVariant('masonry')}>Masonry</button>
        <button onClick={() => setVariant('carousel')}>Carousel</button>
        <button onClick={() => setVariant('filmstrip')}>Filmstrip</button>
        <button onClick={() => setVariant('mosaic')}>Mosaic</button>
      </div>
      
      <GalleryLayout variant={variant} columns={3} gap="md" lightbox>
        {images.map((image) => (
          <img key={image.id} src={image.src} alt={image.alt} />
        ))}
      </GalleryLayout>
    </div>
  );
}
```

### Different Aspect Ratios

```tsx
import { GalleryLayout } from '@pulseui/layout';
import { useState } from 'react';

function AspectRatioExample() {
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:3' | '16:9' | '3:2' | '2:3' | 'auto'>('1:1');
  
  const images = [
    { id: 1, src: '/images/image1.jpg', alt: 'Image 1' },
    { id: 2, src: '/images/image2.jpg', alt: 'Image 2' },
    { id: 3, src: '/images/image3.jpg', alt: 'Image 3' },
    { id: 4, src: '/images/image4.jpg', alt: 'Image 4' },
    { id: 5, src: '/images/image5.jpg', alt: 'Image 5' },
    { id: 6, src: '/images/image6.jpg', alt: 'Image 6' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setAspectRatio('1:1')}>1:1 (Square)</button>
        <button onClick={() => setAspectRatio('4:3')}>4:3</button>
        <button onClick={() => setAspectRatio('16:9')}>16:9</button>
        <button onClick={() => setAspectRatio('3:2')}>3:2</button>
        <button onClick={() => setAspectRatio('2:3')}>2:3 (Portrait)</button>
        <button onClick={() => setAspectRatio('auto')}>Auto</button>
      </div>
      
      <GalleryLayout aspectRatio={aspectRatio} columns={3} gap="md" lightbox>
        {images.map((image) => (
          <img key={image.id} src={image.src} alt={image.alt} />
        ))}
      </GalleryLayout>
    </div>
  );
}
```

### Responsive Gallery

```tsx
import { GalleryLayout } from '@pulseui/layout';

function ResponsiveGalleryExample() {
  const images = [
    { id: 1, src: '/images/image1.jpg', alt: 'Image 1' },
    { id: 2, src: '/images/image2.jpg', alt: 'Image 2' },
    { id: 3, src: '/images/image3.jpg', alt: 'Image 3' },
    { id: 4, src: '/images/image4.jpg', alt: 'Image 4' },
    { id: 5, src: '/images/image5.jpg', alt: 'Image 5' },
    { id: 6, src: '/images/image6.jpg', alt: 'Image 6' },
    { id: 7, src: '/images/image7.jpg', alt: 'Image 7' },
    { id: 8, src: '/images/image8.jpg', alt: 'Image 8' },
  ];

  return (
    <GalleryLayout
      columns={4}
      gap="md"
      lightbox
      responsive={{
        sm: { columns: 1 },
        md: { columns: 2 },
        lg: { columns: 3 },
        xl: { columns: 4 },
      }}
    >
      {images.map((image) => (
        <img key={image.id} src={image.src} alt={image.alt} />
      ))}
    </GalleryLayout>
  );
}
```

### Carousel Gallery

```tsx
import { GalleryLayout } from '@pulseui/layout';

function CarouselGalleryExample() {
  const images = [
    { id: 1, src: '/images/image1.jpg', alt: 'Image 1' },
    { id: 2, src: '/images/image2.jpg', alt: 'Image 2' },
    { id: 3, src: '/images/image3.jpg', alt: 'Image 3' },
    { id: 4, src: '/images/image4.jpg', alt: 'Image 4' },
    { id: 5, src: '/images/image5.jpg', alt: 'Image 5' },
    { id: 6, src: '/images/image6.jpg', alt: 'Image 6' },
  ];

  return (
    <GalleryLayout
      variant="carousel"
      aspectRatio="16:9"
      gap="md"
      lightbox
    >
      {images.map((image) => (
        <img key={image.id} src={image.src} alt={image.alt} />
      ))}
    </GalleryLayout>
  );
}
```

### Mosaic Gallery

```tsx
import { GalleryLayout } from '@pulseui/layout';

function MosaicGalleryExample() {
  const images = [
    { id: 1, src: '/images/image1.jpg', alt: 'Image 1' },
    { id: 2, src: '/images/image2.jpg', alt: 'Image 2' },
    { id: 3, src: '/images/image3.jpg', alt: 'Image 3' },
    { id: 4, src: '/images/image4.jpg', alt: 'Image 4' },
    { id: 5, src: '/images/image5.jpg', alt: 'Image 5' },
    { id: 6, src: '/images/image6.jpg', alt: 'Image 6' },
    { id: 7, src: '/images/image7.jpg', alt: 'Image 7' },
    { id: 8, src: '/images/image8.jpg', alt: 'Image 8' },
    { id: 9, src: '/images/image9.jpg', alt: 'Image 9' },
    { id: 10, src: '/images/image10.jpg', alt: 'Image 10' },
  ];

  return (
    <GalleryLayout
      variant="mosaic"
      gap="md"
      lightbox
    >
      {images.map((image) => (
        <img key={image.id} src={image.src} alt={image.alt} />
      ))}
    </GalleryLayout>
  );
}
```

## API Reference

### GalleryLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode[]` | - | The gallery items to render |
| `variant` | `'grid' \| 'masonry' \| 'carousel' \| 'filmstrip' \| 'mosaic'` | `'grid'` | Layout variant |
| `columns` | `number` | `3` | Number of columns in grid or masonry variant |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Gap between gallery items |
| `aspectRatio` | `'1:1' \| '4:3' \| '16:9' \| '3:2' \| '2:3' \| 'auto'` | `'1:1'` | Aspect ratio of gallery items |
| `fullWidth` | `boolean` | `true` | Whether to fill the container width |
| `lightbox` | `boolean` | `false` | Whether to enable lightbox on click |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |
| `responsive` | `object` | - | Responsive configuration for different breakpoints |

Additionally, the GalleryLayout component accepts all standard HTML div attributes.

## Layout Variants

| Variant | Description |
|---------|-------------|
| `grid` | Items arranged in a uniform grid |
| `masonry` | Pinterest-like layout with items of varying heights |
| `carousel` | Horizontally scrollable layout |
| `filmstrip` | Main image with thumbnails below |
| `mosaic` | Dynamic grid with varying item sizes for visual interest |

## Aspect Ratio Reference

| Ratio | Description |
|-------|-------------|
| `1:1` | Square (1:1 ratio) |
| `4:3` | Standard TV/monitor (4:3 ratio) |
| `16:9` | Widescreen (16:9 ratio) |
| `3:2` | Standard photo (3:2 ratio) |
| `2:3` | Portrait photo (2:3 ratio) |
| `auto` | Natural aspect ratio of the image |

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

The GalleryLayout component includes several accessibility features:

- Images should include proper `alt` attributes
- The lightbox includes keyboard navigation support
- Close button in the lightbox for easy dismissal
- Focus management when opening and closing the lightbox

## Browser Support

The GalleryLayout component is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
