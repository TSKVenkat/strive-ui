# Select Component

The Select component allows users to choose one option from a dropdown list. It provides a user-friendly interface for selecting from multiple options while taking up minimal space.

## Import

```jsx
import { Select } from 'strive-ui';
```

## Features

- Single and multiple selection modes
- Various sizes and variants
- Customizable appearance
- Support for option groups
- Searchable options
- Disabled states
- Validation states
- Accessible implementation

## Usage

```jsx
import { Select } from 'strive-ui';

// Basic usage
<Select
  placeholder="Select an option"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]}
  onChange={(value) => console.log('Selected:', value)}
/>

// With default value
<Select
  defaultValue="option2"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]}
  onChange={(value) => console.log('Selected:', value)}
/>

// Controlled component
const [value, setValue] = useState('option1');
<Select
  value={value}
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]}
  onChange={(newValue) => setValue(newValue)}
/>

// Different sizes
<Select
  size="sm"
  placeholder="Small"
  options={/* options */}
/>
<Select
  size="md"
  placeholder="Medium"
  options={/* options */}
/>
<Select
  size="lg"
  placeholder="Large"
  options={/* options */}
/>

// Different variants
<Select
  variant="outline"
  placeholder="Outline variant"
  options={/* options */}
/>
<Select
  variant="filled"
  placeholder="Filled variant"
  options={/* options */}
/>
<Select
  variant="flushed"
  placeholder="Flushed variant"
  options={/* options */}
/>

// With option groups
<Select
  placeholder="Select a country"
  options={[
    {
      label: 'North America',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'mx', label: 'Mexico' }
      ]
    },
    {
      label: 'Europe',
      options: [
        { value: 'uk', label: 'United Kingdom' },
        { value: 'fr', label: 'France' },
        { value: 'de', label: 'Germany' }
      ]
    }
  ]}
/>

// Multiple selection
<Select
  isMulti
  placeholder="Select multiple options"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]}
  onChange={(values) => console.log('Selected:', values)}
/>

// Searchable select
<Select
  isSearchable
  placeholder="Search options"
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ]}
/>

// Disabled select
<Select
  isDisabled
  placeholder="Disabled select"
  options={/* options */}
/>

// With validation state
<Select
  isInvalid
  errorMessage="Please select an option"
  placeholder="Invalid select"
  options={/* options */}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | Array<{ value: string, label: string }> \| Array<{ label: string, options: Array<{ value: string, label: string }> }> | [] | Options to display in the dropdown |
| `value` | string \| string[] | - | Selected value(s) (controlled) |
| `defaultValue` | string \| string[] | - | Default selected value(s) (uncontrolled) |
| `onChange` | (value: string \| string[]) => void | - | Callback when selection changes |
| `placeholder` | string | 'Select...' | Placeholder text |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size of the select |
| `variant` | 'outline' \| 'filled' \| 'flushed' | 'outline' | Visual variant of the select |
| `isMulti` | boolean | false | Whether multiple options can be selected |
| `isSearchable` | boolean | false | Whether the options are searchable |
| `isClearable` | boolean | false | Whether the selection can be cleared |
| `isDisabled` | boolean | false | Whether the select is disabled |
| `isRequired` | boolean | false | Whether the select is required |
| `isInvalid` | boolean | false | Whether the select has an error |
| `errorMessage` | string | - | Error message to display when isInvalid is true |
| `maxMenuHeight` | number | 300 | Maximum height of the dropdown menu |
| `menuPlacement` | 'auto' \| 'top' \| 'bottom' | 'auto' | Placement of the dropdown menu |
| `noOptionsMessage` | string \| () => string | 'No options' | Message to display when no options are available |
| `loadingMessage` | string \| () => string | 'Loading...' | Message to display when options are loading |
| `isLoading` | boolean | false | Whether options are being loaded |
| `closeMenuOnSelect` | boolean | true | Whether to close the menu when an option is selected |
| `width` | string \| number | '100%' | Width of the select |
| `id` | string | - | HTML ID attribute |
| `name` | string | - | HTML name attribute |
| `autoFocus` | boolean | false | Whether the select should be focused on mount |

## Option Object

Each option in the `options` array should have the following structure:

```typescript
interface Option {
  value: string;        // The value of the option
  label: string;        // The display text for the option
  isDisabled?: boolean; // Whether the option is disabled
}
```

For grouped options:

```typescript
interface OptionGroup {
  label: string;        // The group label
  options: Option[];    // Array of options in this group
}
```

## Accessibility

The Select component follows accessibility best practices:
- Uses appropriate ARIA roles and attributes
- Supports keyboard navigation (Arrow keys, Enter, Escape)
- Implements proper focus management
- Provides appropriate labels for screen readers
- Ensures adequate color contrast for all states
- Includes focus indicators for keyboard users
