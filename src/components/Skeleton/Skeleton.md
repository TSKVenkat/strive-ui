# Skeleton Component

The Skeleton component is used to display a placeholder preview of content before the data gets loaded to reduce load-time frustration.

## Import

```jsx
import { Skeleton } from 'pulseui';
```

## Usage

```jsx
<Skeleton variant="text" width="100%" height="20px" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `string \| number` | `'100%'` | Width of the skeleton |
| `height` | `string \| number` | `'1.2em'` | Height of the skeleton |
| `borderRadius` | `string` | `'4px'` | Border radius of the skeleton |
| `animate` | `boolean` | `true` | Whether to animate the skeleton |
| `lines` | `number` | `1` | Number of lines to display (for text skeletons) |
| `lineGap` | `string` | `'0.5em'` | Gap between lines (for text skeletons) |
| `variant` | `'text' \| 'circular' \| 'rectangular'` | `'text'` | Variant of the skeleton |

## Examples

### Text Skeleton

```jsx
// Single line text skeleton
<Skeleton variant="text" width="100%" />

// Multi-line text skeleton
<Skeleton variant="text" lines={3} />
```

### Circular Skeleton

Useful for avatars or icons:

```jsx
<Skeleton variant="circular" width="40px" height="40px" />
```

### Rectangular Skeleton

Useful for images or cards:

```jsx
<Skeleton variant="rectangular" width="100%" height="200px" />
```

### Complex UI Skeleton

You can combine multiple skeleton components to create complex loading states:

```jsx
// Card skeleton
<div style={{ padding: '16px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
  <Skeleton variant="rectangular" height="200px" />
  <div style={{ marginTop: '16px' }}>
    <Skeleton variant="text" width="70%" />
  </div>
  <div style={{ marginTop: '8px' }}>
    <Skeleton variant="text" width="100%" lines={2} />
  </div>
</div>

// Profile skeleton
<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  <Skeleton variant="circular" width="80px" height="80px" />
  <div style={{ flex: 1 }}>
    <Skeleton variant="text" width="50%" />
    <Skeleton variant="text" width="80%" />
  </div>
</div>
```

## Accessibility

The Skeleton component includes appropriate ARIA attributes:
- `role="status"` to indicate that it represents a loading state
- `aria-label="Loading"` to provide a descriptive label for screen readers

## Animation

By default, the Skeleton component has a subtle pulse animation to indicate loading. You can disable this animation by setting the `animate` prop to `false`.
