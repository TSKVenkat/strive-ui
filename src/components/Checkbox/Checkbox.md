# Checkbox Component

The Checkbox component allows users to select one or multiple items from a set of options. It provides a visual indication of selection state and supports various customization options.

## Import

```jsx
import { Checkbox } from 'pulseui';
```

## Features

- Multiple states: checked, unchecked, indeterminate
- Various sizes and variants
- Support for disabled state
- Customizable label placement
- Group functionality for managing multiple checkboxes
- Accessible implementation with keyboard navigation
- Form integration

## Usage

```jsx
import { Checkbox } from 'pulseui';

// Basic usage
<Checkbox>Accept terms and conditions</Checkbox>

// Controlled component
const [checked, setChecked] = useState(false);
<Checkbox 
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
>
  Subscribe to newsletter
</Checkbox>

// Different sizes
<Checkbox size="sm">Small checkbox</Checkbox>
<Checkbox size="md">Medium checkbox</Checkbox>
<Checkbox size="lg">Large checkbox</Checkbox>

// Disabled state
<Checkbox disabled>Disabled checkbox</Checkbox>

// Indeterminate state
<Checkbox indeterminate>Some options selected</Checkbox>

// Label placement
<Checkbox labelPlacement="start">Label before checkbox</Checkbox>
<Checkbox labelPlacement="end">Label after checkbox</Checkbox>

// Custom color
<Checkbox colorScheme="secondary">Custom color checkbox</Checkbox>

// Checkbox group
<Checkbox.Group 
  defaultValue={['apple', 'orange']}
  onChange={(values) => console.log(values)}
>
  <Checkbox value="apple">Apple</Checkbox>
  <Checkbox value="orange">Orange</Checkbox>
  <Checkbox value="banana">Banana</Checkbox>
</Checkbox.Group>
```

## Props

### Checkbox Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | boolean | - | Whether the checkbox is checked (controlled) |
| `defaultChecked` | boolean | false | Whether the checkbox is initially checked (uncontrolled) |
| `onChange` | (event: React.ChangeEvent<HTMLInputElement>) => void | - | Callback when the checkbox state changes |
| `indeterminate` | boolean | false | Whether the checkbox is in an indeterminate state |
| `disabled` | boolean | false | Whether the checkbox is disabled |
| `required` | boolean | false | Whether the checkbox is required |
| `name` | string | - | Name attribute of the input element |
| `value` | string | - | Value attribute of the input element |
| `id` | string | - | ID attribute of the input element |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size of the checkbox |
| `colorScheme` | 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' | 'primary' | Color scheme of the checkbox |
| `labelPlacement` | 'start' \| 'end' | 'end' | Placement of the label relative to the checkbox |
| `children` | ReactNode | - | Label content |
| `error` | boolean | false | Whether the checkbox has an error state |
| `errorMessage` | string | - | Error message to display |

### Checkbox.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string[] | - | Selected values (controlled) |
| `defaultValue` | string[] | [] | Initially selected values (uncontrolled) |
| `onChange` | (values: string[]) => void | - | Callback when selected values change |
| `disabled` | boolean | false | Whether all checkboxes in the group are disabled |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size applied to all checkboxes in the group |
| `colorScheme` | 'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' | 'primary' | Color scheme applied to all checkboxes in the group |
| `children` | ReactNode | - | Checkbox components to render in the group |
| `name` | string | - | Name attribute applied to all checkboxes in the group |
| `inline` | boolean | false | Whether to display checkboxes inline or stacked |
| `spacing` | number \| string | '0.5rem' | Spacing between checkboxes |

## Accessibility

The Checkbox component follows WAI-ARIA guidelines:
- Uses native HTML `<input type="checkbox">` for maximum accessibility
- Supports keyboard navigation (Tab to focus, Space to toggle)
- Implements proper labeling and associations
- Provides appropriate ARIA attributes for indeterminate state
- Ensures adequate color contrast for all states
- Includes focus indicators for keyboard users
