# Aspect Ratio Box

The `AspectRatioBox` component helps maintain consistent aspect ratios for content like images, videos, maps, or charts. It ensures that your content maintains its proportions regardless of the container's width.

## Features

- **Consistent Aspect Ratios**: Maintain width-to-height proportions
- **Multiple Ratio Formats**: Support for numeric (e.g., 1.78) or string format (e.g., "16/9")
- **Responsive Design**: Automatically adapts to container width
- **Content Positioning**: Center content or use object-fit for media elements
- **Styling Options**: Border, rounded corners, and custom styling
- **Size Constraints**: Set maximum width and height
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { AspectRatioBox } from '@pulseui/layout';

function BasicAspectRatio() {
  return (
    <AspectRatioBox ratio="16/9" maxWidth="600px">
      <img 
        src="https://source.unsplash.com/random/800x450?nature" 
        alt="Nature" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </AspectRatioBox>
  );
}
```

## Examples

### Image Gallery with Different Aspect Ratios

```tsx
import { AspectRatioBox } from '@pulseui/layout';

function ImageGallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
      <AspectRatioBox ratio="1/1" bordered rounded>
        <img 
          src="https://source.unsplash.com/random/800x800?portrait" 
          alt="Square" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AspectRatioBox>
      
      <AspectRatioBox ratio="4/3" bordered rounded>
        <img 
          src="https://source.unsplash.com/random/800x600?landscape" 
          alt="4:3" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AspectRatioBox>
      
      <AspectRatioBox ratio="16/9" bordered rounded>
        <img 
          src="https://source.unsplash.com/random/800x450?cityscape" 
          alt="16:9" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AspectRatioBox>
      
      <AspectRatioBox ratio="2/3" bordered rounded>
        <img 
          src="https://source.unsplash.com/random/600x900?portrait" 
          alt="2:3" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AspectRatioBox>
    </div>
  );
}
```

### Video Player

```tsx
import { AspectRatioBox } from '@pulseui/layout';

function VideoPlayer() {
  return (
    <AspectRatioBox 
      ratio="16/9" 
      maxWidth="800px" 
      bordered 
      rounded 
      objectFit="contain"
    >
      <video 
        controls
        src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
        poster="https://sample-videos.com/img/Sample-jpg-image-500kb.jpg"
        style={{ width: '100%', height: '100%' }}
      />
    </AspectRatioBox>
  );
}
```

### Embedded Map

```tsx
import { AspectRatioBox } from '@pulseui/layout';

function EmbeddedMap() {
  return (
    <AspectRatioBox 
      ratio="4/3" 
      maxWidth="600px" 
      bordered 
      rounded
    >
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596552044!2d-74.25986548248684!3d40.69714941680757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1622109869404!5m2!1sen!2sin" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen 
        loading="lazy"
      />
    </AspectRatioBox>
  );
}
```

### Card with Image and Content

```tsx
import { AspectRatioBox } from '@pulseui/layout';

function CardWithImage() {
  return (
    <div style={{ 
      maxWidth: '350px', 
      border: '1px solid #e0e0e0', 
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <AspectRatioBox ratio="16/9">
        <img 
          src="https://source.unsplash.com/random/800x450?food" 
          alt="Food" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AspectRatioBox>
      
      <div style={{ padding: '1rem' }}>
        <h3>Delicious Recipe</h3>
        <p>This is a description of the delicious recipe shown in the image above.</p>
        <button style={{ 
          padding: '0.5rem 1rem', 
          background: '#1976d2', 
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          View Recipe
        </button>
      </div>
    </div>
  );
}
```

### Responsive Chart

```tsx
import { AspectRatioBox } from '@pulseui/layout';
import { Chart } from 'react-chartjs-2';

function ResponsiveChart() {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <AspectRatioBox 
      ratio="16/9" 
      maxWidth="800px" 
      bordered 
      rounded
      style={{ padding: '1rem' }}
    >
      <Chart type="bar" data={data} />
    </AspectRatioBox>
  );
}
```

### Background Image with Content Overlay

```tsx
import { AspectRatioBox } from '@pulseui/layout';

function BackgroundWithOverlay() {
  return (
    <AspectRatioBox 
      ratio="21/9" 
      maxWidth="1000px" 
      rounded
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(https://source.unsplash.com/random/1200x600?mountain)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>Adventure Awaits</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px' }}>
          Discover the beauty of nature with our guided mountain tours.
        </p>
        <button style={{ 
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem', 
          background: '#ffffff', 
          color: '#333333', 
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Book Now
        </button>
      </div>
    </AspectRatioBox>
  );
}
```

### Placeholder with Loading Indicator

```tsx
import { AspectRatioBox } from '@pulseui/layout';
import { useState, useEffect } from 'react';

function ImageWithPlaceholder() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AspectRatioBox 
      ratio="4/3" 
      maxWidth="400px" 
      bordered 
      rounded
    >
      {loading ? (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e0e0e0',
            borderTopColor: '#1976d2',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : (
        <img 
          src="https://source.unsplash.com/random/800x600?nature" 
          alt="Nature" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </AspectRatioBox>
  );
}
```

## API Reference

### AspectRatioBox Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render inside the aspect ratio box |
| `ratio` | `number \| string` | `1` | The aspect ratio to maintain. Can be a number (e.g., 16/9 = 1.7778) or a string in the format "width/height" (e.g., "16/9") |
| `maxWidth` | `string \| number` | - | The maximum width of the box |
| `maxHeight` | `string \| number` | - | The maximum height of the box |
| `bordered` | `boolean` | `false` | Whether to add a border to the box |
| `borderColor` | `string` | `'#e0e0e0'` | The border color |
| `rounded` | `boolean \| string` | `false` | Whether to add rounded corners to the box |
| `centered` | `boolean` | `true` | Whether the content should be centered within the box |
| `objectFit` | `'contain' \| 'cover' \| 'fill' \| 'none' \| 'scale-down'` | - | How the content should fit within the box (for media elements) |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the AspectRatioBox component accepts all standard HTML div attributes.

## Common Aspect Ratios

| Name | Ratio | Description |
|------|-------|-------------|
| Square | 1/1 | Perfect square, commonly used for profile pictures or thumbnails |
| 4:3 | 4/3 | Traditional TV and computer monitor ratio |
| 16:9 | 16/9 | Widescreen TV, modern computer monitors, and HD videos |
| 21:9 | 21/9 | Ultrawide monitors and cinematic format |
| 3:2 | 3/2 | Common DSLR photo ratio |
| 2:3 | 2/3 | Portrait orientation of 3:2 |
| 1:2 | 1/2 | Mobile device screens in portrait orientation |
| 9:16 | 9/16 | Vertical video format (e.g., mobile stories) |

## Accessibility

The AspectRatioBox component includes several accessibility considerations:

- Preserves aspect ratio for better visual consistency
- Works with semantic HTML elements
- Supports proper image rendering with alt text

## Browser Support

The AspectRatioBox component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
