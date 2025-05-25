# Carousel Headless

The `CarouselHeadless` component provides a flexible and accessible foundation for building various types of carousels, including image galleries, product showcases, and testimonial sliders.

## Features

- **Compound Component Pattern**: Flexible and customizable structure
- **Headless Architecture**: Separation of logic and presentation
- **Accessibility**: ARIA attributes and keyboard navigation
- **Touch Support**: Swipe gestures for mobile devices
- **Autoplay**: Optional automatic slide advancement with pause on hover/focus
- **Infinite Loop**: Optional infinite scrolling
- **Multiple Slides**: Support for showing and scrolling multiple slides at once
- **Center Mode**: Option to center the active slide
- **Responsive**: Works on all screen sizes

## Installation

```bash
npm install @strive-ui/carousel
```

## Basic Usage

```tsx
import { CarouselHeadless } from '@strive-ui/carousel';
import { styled } from 'styled-components';

// Styled components for the carousel
const StyledTrack = styled(CarouselHeadless.Track)`
  display: flex;
  overflow: hidden;
  position: relative;
`;

const StyledSlide = styled(CarouselHeadless.Slide)`
  flex: 0 0 100%;
  transition: transform 0.3s ease;
  
  &.active {
    opacity: 1;
  }
  
  &:not(.active) {
    opacity: 0.5;
  }
`;

const StyledButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StyledNextButton = styled(StyledButton)`
  right: 10px;
`;

const StyledPrevButton = styled(StyledButton)`
  left: 10px;
`;

const StyledDots = styled(CarouselHeadless.Dots)`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const StyledDot = styled(CarouselHeadless.Dot)`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  border: none;
  padding: 0;
  cursor: pointer;
  
  &.active {
    background: #333;
  }
`;

// Basic image carousel
function BasicImageCarousel() {
  const images = [
    { id: 1, src: 'https://source.unsplash.com/random/800x400?nature', alt: 'Nature' },
    { id: 2, src: 'https://source.unsplash.com/random/800x400?city', alt: 'City' },
    { id: 3, src: 'https://source.unsplash.com/random/800x400?people', alt: 'People' },
    { id: 4, src: 'https://source.unsplash.com/random/800x400?architecture', alt: 'Architecture' },
  ];

  return (
    <CarouselHeadless.Root 
      itemCount={images.length}
      infinite
      autoplay
      autoplayInterval={5000}
      pauseOnHover
    >
      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        <StyledTrack>
          {images.map((image, index) => (
            <StyledSlide key={image.id} index={index}>
              <img 
                src={image.src} 
                alt={image.alt} 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </StyledSlide>
          ))}
        </StyledTrack>
        
        <CarouselHeadless.PrevButton as={StyledPrevButton}>
          ←
        </CarouselHeadless.PrevButton>
        
        <CarouselHeadless.NextButton as={StyledNextButton}>
          →
        </CarouselHeadless.NextButton>
        
        <StyledDots />
      </div>
    </CarouselHeadless.Root>
  );
}
```

## Examples

### Product Carousel

```tsx
import { CarouselHeadless } from '@strive-ui/carousel';
import { styled } from 'styled-components';

// Styled components (reusing from previous example)
// ...

// Product carousel with multiple items per slide
function ProductCarousel() {
  const products = [
    { id: 1, name: 'Product 1', price: '$99.99', image: 'https://source.unsplash.com/random/300x300?product' },
    { id: 2, name: 'Product 2', price: '$149.99', image: 'https://source.unsplash.com/random/300x300?product' },
    { id: 3, name: 'Product 3', price: '$79.99', image: 'https://source.unsplash.com/random/300x300?product' },
    { id: 4, name: 'Product 4', price: '$199.99', image: 'https://source.unsplash.com/random/300x300?product' },
    { id: 5, name: 'Product 5', price: '$129.99', image: 'https://source.unsplash.com/random/300x300?product' },
    { id: 6, name: 'Product 6', price: '$89.99', image: 'https://source.unsplash.com/random/300x300?product' },
  ];

  // Responsive configuration
  const slidesToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  return (
    <CarouselHeadless.Root 
      itemCount={products.length}
      slidesToShow={slidesToShow}
      slidesToScroll={1}
      infinite
    >
      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Featured Products</h2>
        
        <StyledTrack style={{ gap: '20px' }}>
          {products.map((product, index) => (
            <StyledSlide 
              key={product.id} 
              index={index}
              style={{ 
                flex: `0 0 calc(${100 / slidesToShow}% - ${(slidesToShow - 1) * 20 / slidesToShow}px)`,
                padding: '20px',
                boxSizing: 'border-box',
                border: '1px solid #eee',
                borderRadius: '8px'
              }}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: 'auto', marginBottom: '12px' }}
              />
              <h3 style={{ margin: '0 0 8px 0' }}>{product.name}</h3>
              <p style={{ fontWeight: 'bold', margin: '0' }}>{product.price}</p>
              <button 
                style={{ 
                  marginTop: '12px', 
                  padding: '8px 16px', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>
            </StyledSlide>
          ))}
        </StyledTrack>
        
        <CarouselHeadless.PrevButton as={StyledPrevButton}>
          ←
        </CarouselHeadless.PrevButton>
        
        <CarouselHeadless.NextButton as={StyledNextButton}>
          →
        </CarouselHeadless.NextButton>
        
        <StyledDots />
      </div>
    </CarouselHeadless.Root>
  );
}
```

### Testimonial Carousel

```tsx
import { CarouselHeadless } from '@strive-ui/carousel';
import { styled } from 'styled-components';

// Styled components (reusing from previous example)
// ...

// Testimonial carousel with fade transition
function TestimonialCarousel() {
  const testimonials = [
    { 
      id: 1, 
      text: "This product has completely transformed our workflow. The efficiency gains are remarkable!", 
      author: "Jane Doe", 
      role: "CEO, Company A",
      avatar: "https://source.unsplash.com/random/100x100?portrait"
    },
    { 
      id: 2, 
      text: "The customer support team went above and beyond to help us implement the solution.", 
      author: "John Smith", 
      role: "CTO, Company B",
      avatar: "https://source.unsplash.com/random/100x100?portrait"
    },
    { 
      id: 3, 
      text: "We've seen a 40% increase in productivity since adopting this platform.", 
      author: "Emily Johnson", 
      role: "Operations Manager, Company C",
      avatar: "https://source.unsplash.com/random/100x100?portrait"
    },
  ];

  // Custom styled components for testimonials
  const TestimonialSlide = styled(StyledSlide)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 40px;
    box-sizing: border-box;
    
    &.active {
      opacity: 1;
      z-index: 1;
    }
  `;

  return (
    <CarouselHeadless.Root 
      itemCount={testimonials.length}
      autoplay
      autoplayInterval={8000}
      pauseOnHover
    >
      <div style={{ 
        position: 'relative', 
        maxWidth: '800px', 
        height: '400px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {testimonials.map((testimonial, index) => (
            <TestimonialSlide key={testimonial.id} index={index}>
              <div style={{ 
                fontSize: '24px', 
                fontStyle: 'italic',
                marginBottom: '24px',
                maxWidth: '80%',
                color: '#333'
              }}>
                "{testimonial.text}"
              </div>
              
              <img 
                src={testimonial.avatar} 
                alt={testimonial.author}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%',
                  marginBottom: '12px',
                  objectFit: 'cover'
                }}
              />
              
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                {testimonial.author}
              </div>
              
              <div style={{ color: '#666' }}>
                {testimonial.role}
              </div>
            </TestimonialSlide>
          ))}
        </div>
        
        <CarouselHeadless.PrevButton as={StyledPrevButton}>
          ←
        </CarouselHeadless.PrevButton>
        
        <CarouselHeadless.NextButton as={StyledNextButton}>
          →
        </CarouselHeadless.NextButton>
        
        <StyledDots style={{ position: 'absolute', bottom: '20px', left: 0, right: 0 }} />
      </div>
    </CarouselHeadless.Root>
  );
}
```

## API Reference

### useCarousel Hook

The `useCarousel` hook provides the core functionality for the carousel.

#### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `itemCount` | `number` | - | The total number of items in the carousel |
| `initialIndex` | `number` | `0` | The initial active index |
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

#### Return Value

| Name | Type | Description |
|------|------|-------------|
| `activeIndex` | `number` | The current active index |
| `next` | `() => void` | Go to the next slide |
| `prev` | `() => void` | Go to the previous slide |
| `goTo` | `(index: number) => void` | Go to a specific slide |
| `startAutoplay` | `() => void` | Start autoplay |
| `stopAutoplay` | `() => void` | Stop autoplay |
| `isBeginning` | `boolean` | Whether the carousel is at the beginning |
| `isEnd` | `boolean` | Whether the carousel is at the end |
| `getContainerProps` | `() => object` | Props for the carousel container |
| `getTrackProps` | `() => object` | Props for the carousel track |
| `getSlideProps` | `(index: number) => object` | Props for a carousel slide |
| `getNextButtonProps` | `() => object` | Props for the next button |
| `getPrevButtonProps` | `() => object` | Props for the previous button |
| `getDotProps` | `(index: number) => object` | Props for a dot indicator |
| `getVisibleSlides` | `() => number[]` | Get the visible slide indexes |
| `itemCount` | `number` | The total number of items |
| `pageCount` | `number` | The total number of pages |
| `isDragging` | `boolean` | Whether the carousel is being dragged |
| `isAutoPlaying` | `boolean` | Whether the carousel is in autoplay mode |

### CarouselHeadless Components

#### CarouselHeadless.Root

The main container component that provides context for all other components.

```tsx
<CarouselHeadless.Root 
  itemCount={5}
  infinite
  autoplay
>
  {/* Other carousel components */}
</CarouselHeadless.Root>
```

#### CarouselHeadless.Track

The track component that contains the slides.

```tsx
<CarouselHeadless.Track>
  {/* Slides */}
</CarouselHeadless.Track>
```

#### CarouselHeadless.Slide

The individual slide component.

```tsx
<CarouselHeadless.Slide index={0}>
  {/* Slide content */}
</CarouselHeadless.Slide>
```

#### CarouselHeadless.NextButton

The button to go to the next slide.

```tsx
<CarouselHeadless.NextButton>
  Next
</CarouselHeadless.NextButton>
```

#### CarouselHeadless.PrevButton

The button to go to the previous slide.

```tsx
<CarouselHeadless.PrevButton>
  Previous
</CarouselHeadless.PrevButton>
```

#### CarouselHeadless.Dots

The container for the dot indicators.

```tsx
<CarouselHeadless.Dots />
```

#### CarouselHeadless.Dot

An individual dot indicator.

```tsx
<CarouselHeadless.Dot index={0} />
```

## Accessibility

The CarouselHeadless component follows accessibility best practices:

- Proper ARIA attributes for carousel, slides, and controls
- Keyboard navigation support (arrow keys)
- Focus management
- Screen reader announcements
- Autoplay pauses on hover and focus

## Browser Support

The CarouselHeadless component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
