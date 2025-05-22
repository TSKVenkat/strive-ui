# Input Component

The Input component is a form control that allows users to enter and edit text. It provides various customization options and supports different input types and states.

## Import

```jsx
import { Input } from 'strive-ui';
```

## Features

- Support for all HTML input types
- Various sizes and variants
- Prefix and suffix elements
- Validation states
- Controlled and uncontrolled usage
- Accessibility features
- Responsive design

## Usage

```jsx
import { Input } from 'strive-ui';

// Basic usage
<Input placeholder="Enter your name" />

// Different input types
<Input type="email" placeholder="Email address" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Age" />
<Input type="date" />

// Different sizes
<Input size="sm" placeholder="Small input" />
<Input size="md" placeholder="Medium input" />
<Input size="lg" placeholder="Large input" />

// Different variants
<Input variant="outline" placeholder="Outline variant" />
<Input variant="filled" placeholder="Filled variant" />
<Input variant="flushed" placeholder="Flushed variant" />

// With prefix and suffix
<Input
  prefix={<Icon name="search" />}
  placeholder="Search"
/>

<Input
  suffix={<Icon name="calendar" />}
  placeholder="Select date"
/>

<Input
  prefix="$"
  suffix=".00"
  placeholder="Amount"
/>

// Validation states
<Input isInvalid errorMessage="This field is required" />
<Input isValid />
<Input isDisabled />
<Input isReadOnly value="Read-only value" />

// Controlled input
const [value, setValue] = useState('');
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
  placeholder="Controlled input"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | 'text' | HTML input type attribute |
| `value` | string \| number | - | Input value (controlled) |
| `defaultValue` | string \| number | - | Default input value (uncontrolled) |
| `placeholder` | string | - | Input placeholder text |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size of the input |
| `variant` | 'outline' \| 'filled' \| 'flushed' | 'outline' | Visual variant of the input |
| `isDisabled` | boolean | false | Whether the input is disabled |
| `isReadOnly` | boolean | false | Whether the input is read-only |
| `isRequired` | boolean | false | Whether the input is required |
| `isInvalid` | boolean | false | Whether the input has an error |
| `isValid` | boolean | false | Whether the input is valid |
| `errorMessage` | string | - | Error message to display when isInvalid is true |
| `prefix` | ReactNode | - | Element to display before the input |
| `suffix` | ReactNode | - | Element to display after the input |
| `onChange` | (event: React.ChangeEvent<HTMLInputElement>) => void | - | Change event handler |
| `onFocus` | (event: React.FocusEvent<HTMLInputElement>) => void | - | Focus event handler |
| `onBlur` | (event: React.FocusEvent<HTMLInputElement>) => void | - | Blur event handler |
| `width` | string \| number | '100%' | Width of the input |
| `id` | string | - | HTML ID attribute |
| `name` | string | - | HTML name attribute |
| `autoComplete` | string | - | HTML autocomplete attribute |
| `autoFocus` | boolean | false | Whether the input should be focused on mount |
| `min` | number \| string | - | Minimum value (for number inputs) |
| `max` | number \| string | - | Maximum value (for number inputs) |
| `step` | number \| string | - | Step value (for number inputs) |
| `pattern` | string | - | Validation pattern (for text inputs) |

## Input Types

The Input component supports all standard HTML input types:

- `text` (default)
- `password`
- `email`
- `number`
- `tel`
- `url`
- `search`
- `date`
- `time`
- `datetime-local`
- `month`
- `week`
- `color`

## Variants

The Input component supports three visual variants:

1. **Outline**: Input with a border (default)
2. **Filled**: Input with a background color
3. **Flushed**: Input with only a bottom border

```jsx
<Input variant="outline" placeholder="Outline variant" />
<Input variant="filled" placeholder="Filled variant" />
<Input variant="flushed" placeholder="Flushed variant" />
```

## Accessibility

The Input component follows accessibility best practices:
- Uses native HTML `<input>` element for maximum accessibility
- Supports keyboard navigation
- Implements proper labeling through associated Form.Label component
- Provides appropriate ARIA attributes for validation states
- Ensures adequate color contrast for all states
- Includes focus indicators for keyboard users
