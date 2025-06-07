# Button Component

The Button component is a customizable button element that supports various styles, sizes, and states.

## Import

```jsx
import { Button } from 'pulseui';
```

## Usage

```jsx
<Button variant="primary" size="md">Click Me</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'danger'` | `'primary'` | The button variant that determines the button's style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the button |
| `fullWidth` | `boolean` | `false` | Whether the button takes up the full width of its container |
| `isLoading` | `boolean` | `false` | Whether the button is in a loading state |
| `disabled` | `boolean` | `false` | Whether the button is disabled |

Additionally, the Button component accepts all standard HTML button attributes.

## Variants

The Button component supports four visual variants:

1. **Primary**: Main call-to-action button with high emphasis
2. **Secondary**: Alternative button with medium emphasis
3. **Tertiary**: Low emphasis button, often used for secondary actions
4. **Danger**: Used for destructive actions

```jsx
// Primary variant (default)
<Button variant="primary">Primary Button</Button>

// Secondary variant
<Button variant="secondary">Secondary Button</Button>

// Tertiary variant
<Button variant="tertiary">Tertiary Button</Button>

// Danger variant
<Button variant="danger">Danger Button</Button>
```

## Sizes

Buttons are available in three sizes:

```jsx
// Small size
<Button size="sm">Small Button</Button>

// Medium size (default)
<Button size="md">Medium Button</Button>

// Large size
<Button size="lg">Large Button</Button>
```

## Full Width

Buttons can take up the full width of their container:

```jsx
<Button fullWidth>Full Width Button</Button>
```

## States

### Loading State

When `isLoading` is true, the button displays a spinner and is automatically disabled:

```jsx
<Button isLoading>Loading</Button>
```

### Disabled State

Buttons can be disabled to indicate that they are not interactive:

```jsx
<Button disabled>Disabled Button</Button>
```

## Accessibility

- The Button component uses the native HTML `<button>` element, ensuring proper keyboard navigation and focus management
- Disabled buttons have appropriate visual styling and the `disabled` attribute
- Loading buttons are automatically disabled to prevent multiple submissions
- Focus styles are visible for keyboard navigation
