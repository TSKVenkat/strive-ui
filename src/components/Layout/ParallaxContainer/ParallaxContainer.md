# Parallax Container

The `ParallaxContainer` component creates visually engaging parallax scrolling effects for backgrounds and content. It's perfect for creating immersive landing pages, hero sections, and interactive backgrounds.

## Features

- **Scroll-Based Parallax**: Elements move at different speeds when scrolling
- **Mouse-Based Parallax**: Elements react to mouse movement
- **Multiple Directions**: Support for up, down, left, and right parallax effects
- **Customizable Speed**: Control the intensity of the parallax effect
- **Background Support**: Easy background image and color configuration
- **Overlay Option**: Add a color overlay for better text readability
- **Multiple Layers**: Create complex parallax scenes with multiple layers
- **Responsive Design**: Works on all screen sizes
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { ParallaxContainer } from '@pulseui/layout';

function BasicParallax() {
  return (
    <ParallaxContainer 
      backgroundImage="https://source.unsplash.com/random/1920x1080?nature"
      height="500px"
      overlay
    >
      <div style={{ color: 'white', textAlign: 'center', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Parallax Effect</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Scroll down to see the parallax effect in action. The background moves at a different speed than the content.
        </p>
      </div>
    </ParallaxContainer>
  );
}
```

## Examples

### Hero Section with Parallax

```tsx
import { ParallaxContainer } from '@pulseui/layout';

function ParallaxHero() {
  return (
    <ParallaxContainer 
      backgroundImage="https://source.unsplash.com/random/1920x1080?mountains"
      height="100vh"
      speed={0.7}
      overlay
      overlayColor="rgba(0, 0, 0, 0.4)"
    >
      <div style={{ 
        color: 'white', 
        textAlign: 'center', 
        padding: '0 2rem',
        maxWidth: '800px'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
          marginBottom: '1rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Adventure Awaits
        </h1>
        <p style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.25rem)', 
          marginBottom: '2rem',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Discover the beauty of nature with our guided tours and unforgettable experiences.
        </p>
        <button style={{ 
          padding: '0.75rem 1.5rem', 
          backgroundColor: '#ffffff', 
          color: '#333333', 
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Explore Now
        </button>
      </div>
    </ParallaxContainer>
  );
}
```

### Mouse Movement Parallax

```tsx
import { ParallaxContainer } from '@pulseui/layout';

function MouseParallax() {
  return (
    <ParallaxContainer 
      backgroundImage="https://source.unsplash.com/random/1920x1080?space"
      height="500px"
      effect="mouse"
      speed={0.3}
      overlay
      overlayColor="rgba(0, 0, 0, 0.6)"
    >
      <div style={{ 
        color: 'white', 
        textAlign: 'center', 
        padding: '0 2rem',
        maxWidth: '600px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Interactive Background</h1>
        <p style={{ fontSize: '1.25rem' }}>
          Move your mouse around to see the background react to your movements.
          This creates an immersive 3D-like effect without any WebGL.
        </p>
      </div>
    </ParallaxContainer>
  );
}
```

### Multi-Layer Parallax

```tsx
import { ParallaxContainer, ParallaxLayer } from '@pulseui/layout';

function MultiLayerParallax() {
  return (
    <div style={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Base layer - Sky */}
      <ParallaxContainer 
        backgroundColor="#87CEEB"
        height="100%"
        speed={0.1}
      >
        {/* Sun */}
        <ParallaxLayer 
          speed={0.2} 
          style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'flex-start',
            paddingTop: '50px'
          }}
        >
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#FFD700',
            boxShadow: '0 0 50px 20px rgba(255, 215, 0, 0.7)'
          }} />
        </ParallaxLayer>
        
        {/* Clouds - Far */}
        <ParallaxLayer speed={0.3}>
          <img 
            src="https://freepngimg.com/download/cloud/7-cloud-png-image.png" 
            alt="Cloud" 
            style={{ 
              position: 'absolute', 
              top: '15%', 
              left: '10%', 
              width: '150px', 
              opacity: 0.8 
            }} 
          />
          <img 
            src="https://freepngimg.com/download/cloud/7-cloud-png-image.png" 
            alt="Cloud" 
            style={{ 
              position: 'absolute', 
              top: '10%', 
              right: '15%', 
              width: '200px', 
              opacity: 0.9 
            }} 
          />
        </ParallaxLayer>
        
        {/* Mountains - Background */}
        <ParallaxLayer speed={0.4}>
          <div style={{ 
            position: 'absolute', 
            bottom: '20%', 
            left: 0, 
            right: 0, 
            height: '200px',
            background: 'linear-gradient(135deg, #6a85b6 0%, #5a7db6 100%)',
            clipPath: 'polygon(0% 100%, 15% 65%, 30% 90%, 45% 55%, 60% 80%, 75% 45%, 90% 70%, 100% 50%, 100% 100%)'
          }} />
        </ParallaxLayer>
        
        {/* Mountains - Foreground */}
        <ParallaxLayer speed={0.6}>
          <div style={{ 
            position: 'absolute', 
            bottom: '0', 
            left: 0, 
            right: 0, 
            height: '250px',
            background: 'linear-gradient(135deg, #3f4c6b 0%, #3f4c6b 100%)',
            clipPath: 'polygon(0% 100%, 10% 60%, 20% 80%, 30% 50%, 40% 70%, 50% 30%, 60% 60%, 70% 40%, 80% 65%, 90% 45%, 100% 70%, 100% 100%)'
          }} />
        </ParallaxLayer>
        
        {/* Content */}
        <ParallaxLayer speed={0}>
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            color: 'white', 
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            zIndex: 10
          }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Multi-Layer Parallax</h1>
            <p style={{ fontSize: '1.25rem' }}>
              Each element moves at a different speed, creating depth.
            </p>
          </div>
        </ParallaxLayer>
      </ParallaxContainer>
    </div>
  );
}
```

### Horizontal Parallax

```tsx
import { ParallaxContainer } from '@pulseui/layout';

function HorizontalParallax() {
  return (
    <ParallaxContainer 
      backgroundImage="https://source.unsplash.com/random/1920x1080?city"
      height="500px"
      direction="left"
      speed={0.5}
      overlay
    >
      <div style={{ 
        color: 'white', 
        textAlign: 'center', 
        padding: '0 2rem',
        maxWidth: '600px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Horizontal Parallax</h1>
        <p style={{ fontSize: '1.25rem' }}>
          This parallax effect moves horizontally as you scroll vertically.
          It creates an interesting side-scrolling effect.
        </p>
      </div>
    </ParallaxContainer>
  );
}
```

### Product Showcase with Parallax

```tsx
import { ParallaxContainer } from '@pulseui/layout';

function ProductShowcase() {
  return (
    <div>
      <ParallaxContainer 
        backgroundColor="#f5f5f5"
        height="600px"
        effect="both"
        speed={0.3}
      >
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Premium Headphones</h2>
            <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
              Experience crystal clear sound with our premium noise-cancelling headphones.
              Designed for comfort and durability, perfect for music lovers and professionals.
            </p>
            <ul style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Active noise cancellation</li>
              <li style={{ marginBottom: '0.5rem' }}>40-hour battery life</li>
              <li style={{ marginBottom: '0.5rem' }}>Bluetooth 5.0 connectivity</li>
              <li>Premium memory foam ear cushions</li>
            </ul>
            <button style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#1976d2', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Shop Now
            </button>
          </div>
          
          <div style={{ 
            flex: '1 1 400px', 
            minWidth: '300px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Headphones" 
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))',
                transform: 'rotate(-15deg)'
              }} 
            />
          </div>
        </div>
      </ParallaxContainer>
    </div>
  );
}
```

## API Reference

### ParallaxContainer Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the parallax container |
| `backgroundImage` | `string` | - | The background image URL |
| `backgroundColor` | `string` | `'transparent'` | The background color |
| `speed` | `number` | `0.5` | The speed of the parallax effect |
| `direction` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | The direction of the parallax effect |
| `effect` | `'scroll' \| 'mouse' \| 'both'` | `'scroll'` | The type of parallax effect |
| `disabled` | `boolean` | `false` | Whether to disable the parallax effect |
| `overlay` | `boolean` | `false` | Whether to add an overlay |
| `overlayColor` | `string` | `'rgba(0, 0, 0, 0.3)'` | The overlay color |
| `height` | `string \| number` | `'400px'` | The height of the container |
| `fullScreen` | `boolean` | `false` | Whether to make the container full screen |
| `centerContent` | `boolean` | `true` | Whether to center the content |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the ParallaxContainer component accepts all standard HTML div attributes.

### ParallaxLayer Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the parallax layer |
| `speed` | `number` | `0.5` | The speed of the parallax effect |
| `offsetX` | `number` | `0` | The horizontal offset of the layer |
| `offsetY` | `number` | `0` | The vertical offset of the layer |
| `zIndex` | `number \| 'auto'` | `'auto'` | The z-index of the layer |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the ParallaxLayer component accepts all standard HTML div attributes.

## Implementation Details

The ParallaxContainer component works by:

1. Creating a background element that moves at a different speed than the content
2. Tracking scroll position and/or mouse movement to calculate the parallax effect
3. Using CSS transforms for smooth, hardware-accelerated animations
4. Supporting multiple layers with different speeds for complex scenes

## Performance Considerations

- The parallax effect is implemented using CSS transforms, which are hardware-accelerated for better performance
- Mouse-based parallax is throttled to prevent excessive calculations
- The component only updates when necessary to minimize re-renders
- For complex scenes with many layers, consider using the `disabled` prop on mobile devices

## Browser Support

The ParallaxContainer component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
