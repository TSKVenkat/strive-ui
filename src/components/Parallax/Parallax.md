# Parallax Component

The Parallax component creates a scrolling effect where background content moves at a different speed than the foreground content, creating an illusion of depth and adding visual interest to your UI.

## Import

```jsx
import { Parallax } from 'strive-ui';
```

## Usage

```jsx
<Parallax speed={0.5} direction="vertical">
  <img src="background-image.jpg" alt="Parallax background" />
</Parallax>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | Required | The content to display with parallax effect |
| `speed` | `number` | `0.5` | The speed of the parallax effect (negative values move in opposite direction) |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | The direction of the parallax effect |
| `enabled` | `boolean` | `true` | Whether to enable the parallax effect |
| `zIndex` | `number` | - | The z-index of the parallax container |
| `className` | `string` | - | Additional className for the container |
| `useViewport` | `boolean` | `true` | Whether to use the viewport as the scroll container |
| `easing` | `string` | `'linear'` | Easing function for the parallax effect |
| `style` | `React.CSSProperties` | - | Optional style overrides for the container |

## Examples

### Basic Vertical Parallax

```jsx
<Parallax speed={0.5} direction="vertical">
  <div style={{
    height: '500px',
    backgroundImage: 'url(background-image.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
    <h1>Parallax Background</h1>
  </div>
</Parallax>
```

### Horizontal Parallax

```jsx
<Parallax speed={0.3} direction="horizontal">
  <div style={{
    height: '400px',
    backgroundImage: 'url(background-image.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
    <h1>Horizontal Parallax Effect</h1>
  </div>
</Parallax>
```

### Reverse Parallax

Using a negative speed value creates a reverse parallax effect where the content moves in the opposite direction:

```jsx
<Parallax speed={-0.5} direction="vertical">
  <div style={{
    height: '400px',
    backgroundImage: 'url(background-image.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
    <h1>Reverse Parallax Effect</h1>
  </div>
</Parallax>
```

### Multiple Parallax Layers

You can combine multiple parallax components with different speeds to create a layered effect:

```jsx
<div style={{ position: 'relative', height: '600px', overflow: 'hidden' }}>
  {/* Background layer - slower speed */}
  <Parallax speed={0.2} direction="vertical">
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: 'url(mountains.jpg)',
      backgroundSize: 'cover',
    }} />
  </Parallax>
  
  {/* Middle layer - medium speed */}
  <Parallax speed={0.5} direction="vertical">
    <div style={{
      position: 'absolute',
      top: '30%',
      left: '10%',
      width: '80%',
      zIndex: 1,
    }}>
      <h1>Parallax Layers</h1>
    </div>
  </Parallax>
  
  {/* Foreground layer - faster speed */}
  <Parallax speed={0.8} direction="vertical">
    <div style={{
      position: 'absolute',
      bottom: '10%',
      right: '10%',
      zIndex: 2,
    }}>
      <button>Learn More</button>
    </div>
  </Parallax>
</div>
```

## Performance Considerations

Parallax effects can impact performance, especially on mobile devices. Consider the following best practices:

1. Use the `enabled` prop to disable parallax on low-performance devices
2. Keep the number of parallax elements to a minimum
3. Optimize images and other content used in parallax sections
4. Consider using CSS `will-change` property for better performance (applied automatically by Framer Motion)

## Accessibility

When using parallax effects, ensure that:

1. The content remains readable and accessible
2. Users with motion sensitivity can disable animations (consider respecting the `prefers-reduced-motion` media query)
3. The parallax effect doesn't interfere with keyboard navigation
