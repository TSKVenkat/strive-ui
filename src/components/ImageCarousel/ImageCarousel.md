# Image Carousel

A specialized carousel component for displaying images with captions, navigation controls, and lightbox functionality.

## Features

- **Image Display**: Showcase images in a responsive, touch-friendly carousel
- **Captions**: Optional captions for each image
- **Navigation Controls**: Customizable arrows and dots for navigation
- **Lightbox Support**: Optional lightbox mode for enlarged image viewing
- **Lazy Loading**: Optimize performance with lazy loading of images
- **Counter Display**: Optional image counter showing current position
- **Accessibility**: Fully accessible with keyboard navigation and ARIA attributes
- **Customization**: Easily customizable styling and behavior

## Installation

```bash
npm install @pulseui/image-carousel
```

## Usage

### Basic Usage

```jsx
import { ImageCarousel } from '@pulseui/image-carousel';

const images = [
  {
    src: 'https://example.com/image1.jpg',
    alt: 'Image 1 description',
    caption: 'Beautiful landscape'
  },
  {
    src: 'https://example.com/image2.jpg',
    alt: 'Image 2 description',
    caption: 'City skyline'
  },
  {
    src: 'https://example.com/image3.jpg',
    alt: 'Image 3 description',
    caption: 'Mountain view'
  }
];

function App() {
  return (
    <ImageCarousel 
      images={images}
      autoplay={true}
      autoplayInterval={5000}
    />
  );
}
```

### With Lightbox and Custom Navigation

```jsx
import { ImageCarousel } from '@pulseui/image-carousel';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function App() {
  return (
    <ImageCarousel 
      images={images}
      lightbox={true}
      showCounter={true}
      renderPrevButton={({ onClick, disabled }) => (
        <button 
          onClick={onClick} 
          disabled={disabled}
          style={{ background: 'blue', color: 'white' }}
        >
          <FaArrowLeft />
        </button>
      )}
      renderNextButton={({ onClick, disabled }) => (
        <button 
          onClick={onClick} 
          disabled={disabled}
          style={{ background: 'blue', color: 'white' }}
        >
          <FaArrowRight />
        </button>
      )}
    />
  );
}
```

### Styled with Styled Components

```jsx
import { ImageCarousel } from '@pulseui/image-carousel';
import styled from 'styled-components';

const StyledCarousel = styled(ImageCarousel)`
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  .strive-carousel-slide {
    height: 400px;
  }
  
  .strive-carousel-caption {
    font-family: 'Georgia', serif;
    font-style: italic;
  }
`;

function App() {
  return (
    <StyledCarousel 
      images={images}
      infinite={true}
      slidesToShow={1}
    />
  );
}
```

## API Reference

### ImageCarousel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `ImageItem[]` | Required | Array of image items to display |
| `showCaptions` | `boolean` | `true` | Whether to show captions |
| `showArrows` | `boolean` | `true` | Whether to show navigation arrows |
| `showDots` | `boolean` | `true` | Whether to show navigation dots |
| `lightbox` | `boolean` | `false` | Whether to enable lightbox mode on image click |
| `lazyLoad` | `boolean` | `true` | Whether to enable lazy loading of images |
| `showCounter` | `boolean` | `false` | Whether to show image counter |
| `className` | `string` | `''` | Custom class name for the component |
| `infinite` | `boolean` | `false` | Whether to enable infinite looping |
| `autoplay` | `boolean` | `false` | Whether to enable autoplay |
| `autoplayInterval` | `number` | `3000` | The interval for autoplay in milliseconds |
| `pauseOnHover` | `boolean` | `true` | Whether to pause autoplay on hover |
| `pauseOnFocus` | `boolean` | `true` | Whether to pause autoplay on focus |
| `slidesToShow` | `number` | `1` | The number of items to show at once |
| `slidesToScroll` | `number` | `1` | The number of items to scroll at once |
| `centerMode` | `boolean` | `false` | Whether to center the active slide |
| `draggable` | `boolean` | `true` | Whether to enable dragging/swiping |
| `swipeThreshold` | `number` | `50` | The threshold for swipe distance (in px) |
| `onChange` | `(index: number) => void` | - | Callback when the active index changes |
| `keyboardNavigation` | `boolean` | `true` | Whether to enable keyboard navigation |

### ImageItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `src` | `string` | Yes | The source URL of the image |
| `alt` | `string` | Yes | Alt text for the image (for accessibility) |
| `caption` | `string` | No | Optional caption for the image |
| `href` | `string` | No | Optional link for the image |

## Accessibility

The ImageCarousel component is built with accessibility in mind:

- All images require alt text for screen readers
- Keyboard navigation is supported (arrow keys)
- ARIA attributes are properly set for screen readers
- Focus management for keyboard users
- Pause autoplay on focus for keyboard users

## Browser Support

The ImageCarousel component works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with appropriate polyfills)

## License

MIT
