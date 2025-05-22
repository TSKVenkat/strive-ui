# Spinner Component

The Spinner component provides a visual indicator of loading or processing state. It helps users understand that an action is in progress and the system is working.

## Import

```jsx
import { Spinner } from 'strive-ui';
```

## Features

- Multiple size options
- Various visual variants
- Customizable colors
- Accessibility support
- Optional text label
- Responsive design

## Usage

```jsx
import { Spinner } from 'strive-ui';

// Basic usage
<Spinner />

// Different sizes
<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />

// Different variants
<Spinner variant="border" />
<Spinner variant="grow" />
<Spinner variant="dots" />
<Spinner variant="ring" />

// Custom colors
<Spinner color="primary.500" />
<Spinner color="secondary.500" />
<Spinner color="success.500" />
<Spinner color="error.500" />

// With label
<Spinner label="Loading..." />

// Center on page
<Spinner centered />

// Within a container (e.g., button)
<Button disabled>
  <Spinner size="sm" color="white" />
  <span style={{ marginLeft: '0.5rem' }}>Loading</span>
</Button>

// Full page overlay
<Spinner.Overlay>
  <Spinner size="lg" label="Loading content..." />
</Spinner.Overlay>
```

## Props

### Spinner Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Size of the spinner |
| `variant` | 'border' \| 'grow' \| 'dots' \| 'ring' | 'border' | Visual variant of the spinner |
| `color` | string | 'primary.500' | Color of the spinner |
| `thickness` | string \| number | '2px' | Thickness of the spinner (for border and ring variants) |
| `speed` | 'slow' \| 'normal' \| 'fast' | 'normal' | Speed of the animation |
| `label` | string | - | Accessible label for the spinner |
| `labelPosition` | 'top' \| 'right' \| 'bottom' \| 'left' | 'bottom' | Position of the label relative to the spinner |
| `centered` | boolean | false | Whether to center the spinner in its container |
| `fullWidth` | boolean | false | Whether the spinner should take the full width of its container |

### Spinner.Overlay Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to display in the overlay (typically a Spinner) |
| `isOpen` | boolean | true | Whether the overlay is visible |
| `background` | string | 'rgba(255, 255, 255, 0.8)' | Background color of the overlay |
| `zIndex` | number | 1000 | Z-index of the overlay |
| `onClick` | (event: React.MouseEvent) => void | - | Click event handler for the overlay |

## Spinner Variants

The Spinner component supports four visual variants:

1. **Border**: A circular spinner with a rotating border
2. **Grow**: A spinner that grows and fades in a pulsating animation
3. **Dots**: Three dots that pulse in sequence
4. **Ring**: A circular ring with a gap that rotates

```jsx
<Spinner variant="border" />
<Spinner variant="grow" />
<Spinner variant="dots" />
<Spinner variant="ring" />
```

## Sizes

Spinners are available in five sizes:

```jsx
<Spinner size="xs" /> // Extra small
<Spinner size="sm" /> // Small
<Spinner size="md" /> // Medium (default)
<Spinner size="lg" /> // Large
<Spinner size="xl" /> // Extra large
```

## Animation Speed

You can control the speed of the spinner animation:

```jsx
<Spinner speed="slow" />
<Spinner speed="normal" /> // Default
<Spinner speed="fast" />
```

## Accessibility

The Spinner component follows accessibility best practices:
- Includes an appropriate ARIA role (`role="status"`)
- Provides a text label for screen readers via `aria-label` or `aria-labelledby`
- Ensures the animation does not cause issues for users with vestibular disorders by using appropriate animation speeds
- Maintains adequate color contrast for visibility
