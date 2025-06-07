# Fullscreen Layout

The `FullscreenLayout` component provides a flexible way to display content in fullscreen mode. It's perfect for creating immersive experiences, galleries, presentations, and modal dialogs.

## Features

- **Multiple Trigger Methods**: Enter fullscreen via manual control, hover, click, or double-click
- **Flexible Exit Options**: Exit via button, escape key, or both
- **Customizable Exit Button**: Position and style the exit button as needed
- **Scroll Locking**: Prevent background scrolling when in fullscreen mode
- **Smooth Transitions**: Animate between normal and fullscreen states
- **Event Callbacks**: React to fullscreen state changes
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { FullscreenLayout } from '@pulseui/layout';
import { useState } from 'react';

function BasicFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  return (
    <div style={{ padding: '2rem' }}>
      <button 
        onClick={() => setIsFullscreen(true)}
        style={{ 
          padding: '0.5rem 1rem', 
          backgroundColor: '#1976d2', 
          color: 'white', 
          border: 'none',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}
      >
        Enter Fullscreen
      </button>
      
      <FullscreenLayout 
        fullscreen={isFullscreen} 
        onExitFullscreen={() => setIsFullscreen(false)}
      >
        <div style={{ 
          padding: '2rem', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1>Fullscreen Content</h1>
          <p>This content will be displayed in fullscreen mode.</p>
          <p>Click the X button or press ESC to exit.</p>
        </div>
      </FullscreenLayout>
    </div>
  );
}
```

## Examples

### Image Gallery with Click Trigger

```tsx
import { FullscreenLayout } from '@pulseui/layout';

function ImageGallery() {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
      gap: '1rem',
      padding: '1rem'
    }}>
      {[1, 2, 3, 4, 5, 6].map((id) => (
        <FullscreenLayout 
          key={id}
          trigger="click"
          backgroundColor="#000000"
        >
          <img 
            src={`https://source.unsplash.com/random/600x400?nature,${id}`} 
            alt={`Gallery item ${id}`}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '4px',
              cursor: 'pointer'
            }} 
          />
        </FullscreenLayout>
      ))}
    </div>
  );
}
```

### Video Player with Custom Exit Button

```tsx
import { FullscreenLayout } from '@pulseui/layout';
import { useState } from 'react';

function VideoPlayer() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Custom exit button icon
  const customExitIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 14 10 14 10 20"></polyline>
      <polyline points="20 10 14 10 14 4"></polyline>
      <line x1="14" y1="10" x2="21" y2="3"></line>
      <line x1="3" y1="21" x2="10" y2="14"></line>
    </svg>
  );
  
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ position: 'relative' }}>
        <FullscreenLayout 
          fullscreen={isFullscreen} 
          onExitFullscreen={() => setIsFullscreen(false)}
          exitButtonIcon={customExitIcon}
          exitButtonPosition="bottom-right"
          backgroundColor="#000000"
        >
          <video 
            controls
            style={{ 
              width: '100%', 
              height: isFullscreen ? '100%' : 'auto',
              objectFit: isFullscreen ? 'contain' : 'cover'
            }}
          >
            <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {!isFullscreen && (
            <button 
              onClick={() => setIsFullscreen(true)}
              style={{ 
                position: 'absolute', 
                bottom: '1rem', 
                right: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            </button>
          )}
        </FullscreenLayout>
      </div>
    </div>
  );
}
```

### Presentation Slides with Double-Click

```tsx
import { FullscreenLayout } from '@pulseui/layout';
import { useState } from 'react';

function PresentationSlides() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: 'Introduction',
      content: 'Welcome to our presentation. Double-click anywhere to enter fullscreen mode.'
    },
    {
      title: 'Key Features',
      content: 'Our product offers innovative solutions for modern problems.'
    },
    {
      title: 'Benefits',
      content: 'Save time, reduce costs, and improve efficiency with our services.'
    },
    {
      title: 'Conclusion',
      content: 'Thank you for your attention. Questions?'
    }
  ];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  return (
    <div style={{ padding: '2rem' }}>
      <FullscreenLayout 
        trigger="doubleClick"
        backgroundColor="#f8f9fa"
      >
        <div style={{ 
          padding: '2rem', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            backgroundColor: '#4a5568', 
            color: 'white', 
            padding: '1rem 2rem',
            borderRadius: '4px 4px 0 0',
            marginBottom: '2rem'
          }}>
            <h2>Company Presentation</h2>
          </div>
          
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
              {slides[currentSlide].title}
            </h1>
            <p style={{ fontSize: '1.5rem', maxWidth: '800px' }}>
              {slides[currentSlide].content}
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: currentSlide === 0 ? '#e2e8f0' : '#4a5568', 
                color: currentSlide === 0 ? '#a0aec0' : 'white', 
                border: 'none',
                borderRadius: '4px',
                cursor: currentSlide === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            
            <div>
              Slide {currentSlide + 1} of {slides.length}
            </div>
            
            <button 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: currentSlide === slides.length - 1 ? '#e2e8f0' : '#4a5568', 
                color: currentSlide === slides.length - 1 ? '#a0aec0' : 'white', 
                border: 'none',
                borderRadius: '4px',
                cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </FullscreenLayout>
    </div>
  );
}
```

### Product Detail Modal

```tsx
import { FullscreenLayout } from '@pulseui/layout';
import { useState } from 'react';

function ProductDetailModal() {
  const [showDetail, setShowDetail] = useState(false);
  
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '1rem'
      }}>
        <div style={{ 
          padding: '1rem', 
          border: '1px solid #e2e8f0',
          borderRadius: '8px'
        }}>
          <img 
            src="https://source.unsplash.com/random/300x300?product" 
            alt="Product" 
            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
          />
          <h3 style={{ marginTop: '1rem' }}>Premium Product</h3>
          <p style={{ color: '#4a5568' }}>$99.99</p>
          <button 
            onClick={() => setShowDetail(true)}
            style={{ 
              width: '100%',
              padding: '0.5rem', 
              backgroundColor: '#1976d2', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              marginTop: '1rem',
              cursor: 'pointer'
            }}
          >
            View Details
          </button>
        </div>
      </div>
      
      <FullscreenLayout 
        fullscreen={showDetail} 
        onExitFullscreen={() => setShowDetail(false)}
        backgroundColor="rgba(0, 0, 0, 0.8)"
        transition={true}
        transitionDuration={400}
      >
        <div style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '2rem'
        }}>
          <div style={{ 
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Premium Product</h2>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '2rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ flex: '1 1 300px' }}>
                  <img 
                    src="https://source.unsplash.com/random/600x600?product" 
                    alt="Product" 
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                </div>
                
                <div style={{ flex: '1 1 300px' }}>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>$99.99</p>
                  <p style={{ color: '#4caf50', marginBottom: '1rem' }}>In Stock</p>
                  
                  <p style={{ marginBottom: '1rem' }}>
                    This premium product is designed to provide exceptional performance and durability.
                    Made with high-quality materials and meticulous craftsmanship.
                  </p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Features:</h4>
                    <ul style={{ paddingLeft: '1.5rem' }}>
                      <li>High-quality construction</li>
                      <li>Durable materials</li>
                      <li>Elegant design</li>
                      <li>Versatile functionality</li>
                    </ul>
                  </div>
                  
                  <button 
                    style={{ 
                      width: '100%',
                      padding: '0.75rem', 
                      backgroundColor: '#1976d2', 
                      color: 'white', 
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>Product Description</h3>
                <p style={{ marginBottom: '1rem' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
                  nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl 
                  nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl 
                  aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                <p>
                  Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, 
                  eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies 
                  tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
              </div>
            </div>
          </div>
        </div>
      </FullscreenLayout>
    </div>
  );
}
```

### Map Viewer with Hover Trigger

```tsx
import { FullscreenLayout } from '@pulseui/layout';

function MapViewer() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Interactive Map</h2>
      <p style={{ marginBottom: '1rem' }}>Hover over the map to view it in fullscreen mode.</p>
      
      <FullscreenLayout 
        trigger="hover"
        exitButtonPosition="bottom-left"
      >
        <div style={{ 
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '300px'
        }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304605!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1621863699213!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy"
            title="Google Map"
          ></iframe>
        </div>
      </FullscreenLayout>
    </div>
  );
}
```

## API Reference

### FullscreenLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the fullscreen layout |
| `fullscreen` | `boolean` | `false` | Whether the component is in fullscreen mode |
| `trigger` | `'manual' \| 'hover' \| 'click' \| 'doubleClick'` | `'manual'` | The method to trigger fullscreen mode |
| `exitMethod` | `'button' \| 'escape' \| 'both'` | `'both'` | The method to exit fullscreen mode |
| `showExitButton` | `boolean` | `true` | Whether to show the exit button |
| `exitButtonPosition` | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | The position of the exit button |
| `exitButtonIcon` | `React.ReactNode` | - | Custom icon for the exit button |
| `backgroundColor` | `string` | `'#ffffff'` | The background color in fullscreen mode |
| `zIndex` | `number` | `9999` | The z-index in fullscreen mode |
| `lockScroll` | `boolean` | `true` | Whether to lock scroll when in fullscreen mode |
| `transition` | `boolean` | `true` | Whether to add a transition effect |
| `transitionDuration` | `number` | `300` | The transition duration in milliseconds |
| `onEnterFullscreen` | `() => void` | - | Callback when entering fullscreen mode |
| `onExitFullscreen` | `() => void` | - | Callback when exiting fullscreen mode |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the FullscreenLayout component accepts all standard HTML div attributes.

## Implementation Details

The FullscreenLayout component works by:

1. Using fixed positioning to cover the entire viewport when in fullscreen mode
2. Supporting both controlled and uncontrolled modes for flexibility
3. Providing multiple trigger methods for entering fullscreen mode
4. Offering different exit methods for better user experience
5. Locking scroll to prevent background content from scrolling
6. Using smooth transitions for a polished user experience

## Accessibility

The FullscreenLayout component maintains accessibility by:

- Supporting keyboard navigation with escape key exit
- Providing a visible and accessible exit button
- Maintaining focus management when entering and exiting fullscreen mode
- Using appropriate ARIA attributes for better screen reader support

## Browser Support

The FullscreenLayout component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
