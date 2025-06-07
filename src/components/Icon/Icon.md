# Icon Component

The Icon component provides a consistent way to display vector icons throughout your application. It supports various icon libraries and offers customization options for size, color, and accessibility.

## Import

```jsx
import { Icon } from 'pulseui';
```

## Features

- Support for multiple icon libraries
- Customizable size and color
- Accessibility features
- Responsive sizing
- Animation capabilities
- Rotation and flipping options

## Usage

```jsx
import { Icon } from 'pulseui';

// Basic usage with icon name
<Icon name="check" />

// With custom size
<Icon name="star" size="lg" />

// With custom color
<Icon name="warning" color="warning.500" />

// With rotation
<Icon name="arrow-right" rotate={90} />

// With animation
<Icon name="spinner" spin />

// With custom library
<Icon name="github" library="fa" />

// As a button icon
<button>
  <Icon name="settings" aria-hidden="true" />
  Settings
</button>

// With aria-label for standalone icon
<Icon name="close" aria-label="Close dialog" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | string | - | Name of the icon to display |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number | 'md' | Size of the icon |
| `color` | string | 'currentColor' | Color of the icon |
| `library` | 'default' \| 'fa' \| 'material' \| 'feather' \| 'custom' | 'default' | Icon library to use |
| `rotate` | 0 \| 90 \| 180 \| 270 | 0 | Rotation angle in degrees |
| `flip` | 'horizontal' \| 'vertical' \| 'both' | - | Flip the icon |
| `spin` | boolean | false | Whether the icon should spin |
| `pulse` | boolean | false | Whether the icon should pulse |
| `strokeWidth` | number | - | Stroke width for stroke-based icons |
| `focusable` | boolean | false | Whether the icon should be focusable |
| `role` | string | 'img' | ARIA role |
| `aria-label` | string | - | Accessible label for the icon |
| `aria-hidden` | boolean | - | Whether to hide the icon from screen readers |

## Icon Libraries

The Icon component supports multiple icon libraries:

1. **Default**: The built-in icon set
2. **Font Awesome**: Use with `library="fa"`
3. **Material Icons**: Use with `library="material"`
4. **Feather Icons**: Use with `library="feather"`
5. **Custom**: Use with `library="custom"` (requires configuration)

## Sizes

Icons are available in predefined sizes:

```jsx
<Icon name="info" size="xs" /> // Extra small
<Icon name="info" size="sm" /> // Small
<Icon name="info" size="md" /> // Medium (default)
<Icon name="info" size="lg" /> // Large
<Icon name="info" size="xl" /> // Extra large
```

You can also specify a custom size as a number (in pixels):

```jsx
<Icon name="info" size={24} />
```

## Colors

Icons inherit their color from the parent element by default (`currentColor`), but you can specify a custom color:

```jsx
<Icon name="heart" color="red.500" />
<Icon name="check" color="green.500" />
<Icon name="info" color="#0066ff" />
```

## Accessibility

When using icons, follow these accessibility guidelines:

1. **Decorative Icons**: If the icon is purely decorative or is accompanied by text, use `aria-hidden="true"`:

```jsx
<button>
  <Icon name="settings" aria-hidden="true" />
  Settings
</button>
```

2. **Standalone Icons**: If the icon conveys meaning on its own, provide an `aria-label`:

```jsx
<Icon name="close" aria-label="Close dialog" />
```

3. **Interactive Icons**: If the icon is interactive, ensure it has proper focus and keyboard support:

```jsx
<Icon 
  name="search" 
  aria-label="Search" 
  focusable={true}
  onClick={handleSearch}
  tabIndex={0}
  role="button"
/>
```

The Icon component follows accessibility best practices by default:
- Uses appropriate semantic elements
- Provides proper ARIA attributes
- Ensures adequate color contrast
- Supports keyboard navigation when interactive
