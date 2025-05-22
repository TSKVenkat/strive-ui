# ColorPicker Component

The ColorPicker component provides an intuitive interface for selecting colors, with support for various color formats and preset color options.

## Import

```jsx
import { ColorPicker } from 'strive-ui';
```

## Usage

```jsx
const [color, setColor] = useState('#3f51b5');

<ColorPicker 
  value={color} 
  onChange={setColor} 
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | The current color value |
| `onChange` | `(color: string) => void` | Required | Callback fired when the color changes |
| `disabled` | `boolean` | `false` | Whether the color picker is disabled |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the color picker |
| `showValue` | `boolean` | `true` | Whether to show the color value |
| `format` | `'hex' \| 'rgb' \| 'hsl'` | `'hex'` | Format of the color value display |
| `presetColors` | `string[]` | Material Design colors | Predefined color options |
| `placeholder` | `string` | `'Select color'` | Placeholder text for the color input |
| `className` | `string` | - | Additional className for the container |
| `style` | `React.CSSProperties` | - | Optional style overrides for the container |
| `ariaLabel` | `string` | `'Color picker'` | Aria label for the color picker |

## Examples

### Basic Usage

```jsx
const [color, setColor] = useState('#3f51b5');

<ColorPicker 
  value={color} 
  onChange={setColor} 
/>
```

### Different Sizes

```jsx
<ColorPicker 
  value="#e91e63" 
  onChange={handleChange} 
  size="sm" 
/>

<ColorPicker 
  value="#3f51b5" 
  onChange={handleChange} 
  size="md" 
/>

<ColorPicker 
  value="#4caf50" 
  onChange={handleChange} 
  size="lg" 
/>
```

### Different Color Formats

```jsx
// HEX format (default)
<ColorPicker 
  value="#3f51b5" 
  onChange={handleChange} 
  format="hex" 
/>

// RGB format
<ColorPicker 
  value="#3f51b5" 
  onChange={handleChange} 
  format="rgb" 
/>

// HSL format
<ColorPicker 
  value="#3f51b5" 
  onChange={handleChange} 
  format="hsl" 
/>
```

### Custom Preset Colors

```jsx
<ColorPicker 
  value="#3f51b5" 
  onChange={handleChange} 
  presetColors={[
    '#FF5252', '#FF4081', '#E040FB', '#7C4DFF', 
    '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', 
    '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41'
  ]} 
/>
```

### Without Value Display

```jsx
<ColorPicker 
  value="#3f51b5" 
  onChange={handleChange} 
  showValue={false} 
/>
```

### Disabled State

```jsx
<ColorPicker 
  value="#3f51b5" 
  onChange={handleChange} 
  disabled 
/>
```

## Accessibility

The ColorPicker component follows accessibility best practices:

- Uses appropriate ARIA attributes
- Supports keyboard navigation
- Provides visual feedback on interaction
- Maintains proper focus management

## Animation

The ColorPicker uses Framer Motion for smooth animations:

- Fade in/out when the popover appears/disappears
- Scale animation on hover and tap for the color button
- Smooth transitions for all interactive elements
