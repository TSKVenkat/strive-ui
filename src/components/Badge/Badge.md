# Badge Component

The Badge component is used to highlight and display counts, status indicators, or small pieces of information.

## Import

```jsx
import { Badge } from 'pulseui';
```

## Features

- Multiple variants for different contexts (primary, secondary, success, warning, error)
- Various size options
- Support for different shapes (rounded, square, pill)
- Can be used standalone or as an overlay on other components
- Customizable appearance with different styles (outlined, filled)
- Support for custom content and icons

## Usage

```jsx
import { Badge, Avatar, Icon } from 'pulseui';

// Basic usage
<Badge>New</Badge>

// With different variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>

// With different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// With different shapes
<Badge shape="rounded">Rounded</Badge>
<Badge shape="square">Square</Badge>
<Badge shape="pill">Pill</Badge>

// Outlined style
<Badge variant="primary" outlined>Outlined</Badge>

// As a counter
<Badge>42</Badge>

// With an icon
<Badge>
  <Icon name="check" /> Done
</Badge>

// As an overlay on another component
<div style={{ position: 'relative', display: 'inline-block' }}>
  <Avatar src="/path/to/image.jpg" />
  <Badge 
    position="top-right" 
    variant="error" 
    size="sm"
    standalone
  >
    3
  </Badge>
</div>

// Dot badge
<Badge variant="success" dot />

// Max count
<Badge max={99}>100</Badge>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'neutral' | 'primary' | The variant of the badge |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' | 'md' | The size of the badge |
| `shape` | 'rounded' \| 'square' \| 'pill' | 'rounded' | The shape of the badge |
| `outlined` | boolean | false | Whether the badge is outlined |
| `filled` | boolean | true | Whether the badge is filled |
| `standalone` | boolean | false | Whether the badge is used as a standalone element or as an overlay |
| `position` | 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | 'top-right' | The position of the badge when used as an overlay |
| `dot` | boolean | false | Whether to display the badge as a dot |
| `max` | number | - | Maximum count to display before showing a "+" suffix |
| `invisible` | boolean | false | Whether the badge is hidden |
| `overlap` | boolean | false | Whether the badge should overlap its parent |
| `offset` | [number, number] | [0, 0] | Offset of the badge [horizontal, vertical] |
| `children` | ReactNode | - | The content of the badge |

## Accessibility

The Badge component follows accessibility best practices:
- Ensures adequate color contrast for all variants
- Uses appropriate ARIA attributes for screen readers
- Maintains proper focus management when interactive
- Provides semantic meaning through appropriate use of colors and variants
