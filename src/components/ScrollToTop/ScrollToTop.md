# ScrollToTop Component

The ScrollToTop component provides a button that appears when the user scrolls down the page, allowing them to quickly navigate back to the top with a single click.

## Import

```jsx
import { ScrollToTop } from 'strive-ui';
```

## Usage

```jsx
<ScrollToTop position="bottom-right" size="md" smooth />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showAtPosition` | `number` | `300` | Distance from the top to show the button (in pixels) |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Position of the button |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the button |
| `icon` | `React.ReactNode` | - | Custom icon to display |
| `smooth` | `boolean` | `true` | Whether to smooth scroll to top |
| `style` | `React.CSSProperties` | - | Custom styles for the button |
| `className` | `string` | - | Additional className for the button |
| `ariaLabel` | `string` | `'Scroll to top'` | Aria label for the button |
| `scrollElement` | `HTMLElement` | - | Whether to use a different element to scroll to top |

## Examples

### Basic Usage

```jsx
<ScrollToTop />
```

### Custom Position and Size

```jsx
<ScrollToTop position="bottom-left" size="lg" />
```

### Custom Icon

```jsx
<ScrollToTop 
  icon={
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 15h14l-7-8-7 8z" fill="currentColor" />
    </svg>
  }
/>
```

### With Custom Scroll Element

For scrollable containers other than the window:

```jsx
const ScrollableContainer = () => {
  const containerRef = useRef(null);

  return (
    <div 
      ref={containerRef} 
      style={{ height: '500px', overflow: 'auto' }}
    >
      {/* Content */}
      <ScrollToTop scrollElement={containerRef.current} />
    </div>
  );
};
```

### Instant Scroll (Without Animation)

```jsx
<ScrollToTop smooth={false} />
```

## Animation

The ScrollToTop component uses Framer Motion for smooth animations:

- Fade in/out when appearing/disappearing
- Scale animation on hover and tap
- Smooth scrolling animation when clicked (if `smooth` is true)

## Accessibility

The ScrollToTop component follows accessibility best practices:

- Uses appropriate ARIA attributes
- Supports keyboard navigation
- Has appropriate focus styles
- Provides visual feedback on interaction
