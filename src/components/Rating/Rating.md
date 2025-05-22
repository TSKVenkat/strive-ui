# Rating Component

The Rating component provides an intuitive interface for users to provide ratings or to display rating values using star icons or custom icons.

## Import

```jsx
import { Rating } from 'strive-ui';
```

## Usage

```jsx
const [rating, setRating] = useState(3);

<Rating 
  value={rating} 
  onChange={setRating} 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | Required | The rating value (0-5) |
| `onChange` | `(value: number) => void` | - | Callback fired when the rating changes |
| `max` | `number` | `5` | The maximum rating value |
| `readOnly` | `boolean` | `false` | Whether the rating is read-only |
| `disabled` | `boolean` | `false` | Whether the rating is disabled |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the rating icons |
| `allowHalf` | `boolean` | `false` | Whether to allow half-star ratings |
| `showValue` | `boolean` | `false` | Whether to show the rating value |
| `filledIcon` | `React.ReactNode` | - | Custom icon for filled state |
| `emptyIcon` | `React.ReactNode` | - | Custom icon for empty state |
| `halfFilledIcon` | `React.ReactNode` | - | Custom icon for half-filled state |
| `filledColor` | `string` | - | Color of the filled icons |
| `emptyColor` | `string` | - | Color of the empty icons |
| `className` | `string` | - | Additional className for the container |
| `style` | `React.CSSProperties` | - | Optional style overrides for the container |
| `ariaLabel` | `string` | `'Rating'` | Aria label for the rating component |

## Examples

### Basic Usage

```jsx
const [rating, setRating] = useState(3);

<Rating 
  value={rating} 
  onChange={setRating} 
/>
```

### Read-only Rating

```jsx
<Rating 
  value={4.5} 
  readOnly 
/>
```

### Half-star Ratings

```jsx
const [rating, setRating] = useState(3.5);

<Rating 
  value={rating} 
  onChange={setRating} 
  allowHalf 
/>
```

### Different Sizes

```jsx
<Rating value={3} size="sm" />
<Rating value={3} size="md" />
<Rating value={3} size="lg" />
```

### Custom Colors

```jsx
<Rating 
  value={4} 
  filledColor="#e91e63" 
  emptyColor="#eeeeee" 
/>
```

### Custom Icons

```jsx
// Heart icons instead of stars
<Rating 
  value={3} 
  filledIcon={
    <svg viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  }
  emptyIcon={
    <svg viewBox="0 0 24 24">
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
    </svg>
  }
  filledColor="#e91e63"
/>
```

### Show Value

```jsx
<Rating 
  value={4.5} 
  showValue 
  allowHalf 
/>
```

### More Stars

```jsx
<Rating 
  value={7} 
  max={10} 
  showValue 
/>
```

### Disabled Rating

```jsx
<Rating 
  value={3} 
  disabled 
/>
```

## Accessibility

The Rating component follows accessibility best practices:

- Uses appropriate ARIA attributes (`role="radiogroup"` for the container, `role="radio"` for each star)
- Supports keyboard navigation (Enter and Space keys)
- Provides visual feedback on interaction
- Maintains proper focus management

## Animation

The Rating component uses Framer Motion for smooth animations:

- Scale animation on hover and tap for the stars
- Smooth transitions for all interactive elements
