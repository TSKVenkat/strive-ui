# AutocompleteHeadless

A headless autocomplete component that provides all the functionality for searching and selecting options from a dropdown list without enforcing any specific styling.

## Features

- Search and filter options as you type
- Keyboard navigation
- Accessible by default
- Customizable rendering
- Support for asynchronous loading of options
- Support for custom values
- Debounced input for performance

## Usage

### Basic Usage

```jsx
import { Autocomplete } from '@strive-ui/autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function MyComponent() {
  return (
    <Autocomplete 
      options={options} 
      placeholder="Search fruits..."
      onChange={(value) => console.log('Selected:', value)}
    />
  );
}
```

### Controlled Autocomplete

```jsx
import { useState } from 'react';
import { Autocomplete } from '@strive-ui/autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function ControlledAutocomplete() {
  const [selectedValue, setSelectedValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  return (
    <div>
      <Autocomplete 
        options={options} 
        value={selectedValue}
        inputValue={inputValue}
        onChange={setSelectedValue}
        onInputChange={setInputValue}
        placeholder="Search fruits..."
      />
      <div>
        <p>Selected value: {selectedValue}</p>
        <p>Input value: {inputValue}</p>
      </div>
    </div>
  );
}
```

### With Custom Values

```jsx
import { Autocomplete } from '@strive-ui/autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function CustomValueAutocomplete() {
  return (
    <Autocomplete 
      options={options} 
      placeholder="Search or enter a custom fruit..."
      allowCustomValue
      onChange={(value) => console.log('Selected or entered:', value)}
    />
  );
}
```

### With Asynchronous Loading

```jsx
import { Autocomplete } from '@strive-ui/autocomplete';

function AsyncAutocomplete() {
  // Function to load options asynchronously
  const loadOptions = async (inputValue) => {
    // Simulate API call
    const response = await fetch(`/api/search?q=${inputValue}`);
    const data = await response.json();
    
    // Convert API response to options format
    return data.map(item => ({
      value: item.id,
      label: item.name,
    }));
  };
  
  return (
    <Autocomplete 
      options={[]} // Initial options can be empty
      placeholder="Search users..."
      loadOptions={loadOptions}
      debounceTime={300} // Wait 300ms before making API call
      minChars={2} // Only search when at least 2 characters are typed
    />
  );
}
```

### With Minimum Characters

```jsx
import { Autocomplete } from '@strive-ui/autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'mango', label: 'Mango' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'watermelon', label: 'Watermelon' },
];

function MinCharsAutocomplete() {
  return (
    <Autocomplete 
      options={options} 
      placeholder="Type at least 2 characters to search..."
      minChars={2}
    />
  );
}
```

### With Auto-Select First Option

```jsx
import { Autocomplete } from '@strive-ui/autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function AutoSelectFirstAutocomplete() {
  return (
    <Autocomplete 
      options={options} 
      placeholder="Search fruits..."
      autoSelectFirst
    />
  );
}
```

### Disabled State

```jsx
import { Autocomplete } from '@strive-ui/autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape', disabled: true },
  { value: 'kiwi', label: 'Kiwi' },
];

function DisabledAutocomplete() {
  return (
    <Autocomplete 
      options={options} 
      placeholder="Search fruits..."
      defaultValue="apple"
      disabled
    />
  );
}
```

### Custom Styling

```jsx
import { Autocomplete } from '@strive-ui/autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function CustomStyledAutocomplete() {
  return (
    <Autocomplete
      options={options}
      placeholder="Search fruits..."
      style={{ 
        position: 'relative',
        width: '300px',
      }}
    >
      <div style={{ position: 'relative' }}>
        <Autocomplete.Input
          style={{ 
            width: '100%',
            padding: '8px 12px',
            paddingRight: '32px',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            outline: 'none',
            '[data-focused]': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 1px #3b82f6',
            },
            '[data-disabled]': {
              backgroundColor: '#f1f5f9',
              cursor: 'not-allowed',
            },
          }}
        />
        
        <Autocomplete.ClearButton
          style={{ 
            position: 'absolute',
            top: '50%',
            right: '8px',
            transform: 'translateY(-50%)',
            padding: '4px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            ':hover': {
              color: '#64748b',
            },
          }}
        />
      </div>
      
      <Autocomplete.Dropdown
        style={{ 
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          marginTop: '4px',
          backgroundColor: 'white',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: 10,
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        <Autocomplete.Loading
          style={{ 
            padding: '8px 12px',
            textAlign: 'center',
            color: '#64748b',
          }}
        />
        
        <Autocomplete.Empty
          style={{ 
            padding: '8px 12px',
            textAlign: 'center',
            color: '#94a3b8',
          }}
        />
        
        <Autocomplete.Options>
          {(context) => 
            context.filteredOptions.map((option) => (
              <Autocomplete.Option
                key={option.value}
                option={option}
                style={{ 
                  padding: '8px 12px',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  backgroundColor: 'transparent',
                  opacity: option.disabled ? 0.5 : 1,
                  '[data-highlighted]': {
                    backgroundColor: '#f1f5f9',
                  },
                  '[data-selected]': {
                    backgroundColor: '#e0f2fe',
                  },
                }}
              >
                {option.label}
              </Autocomplete.Option>
            ))
          }
        </Autocomplete.Options>
      </Autocomplete.Dropdown>
    </Autocomplete>
  );
}
```

### Using the Hook Directly

```jsx
import { useAutocomplete } from '@strive-ui/autocomplete';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function CustomAutocomplete() {
  const {
    selectedValue,
    selectedOption,
    inputValue,
    isOpen,
    filteredOptions,
    loading,
    toggle,
    selectOption,
    clearSelection,
    getInputProps,
    getDropdownProps,
    getOptionProps,
    getClearButtonProps,
  } = useAutocomplete({
    options,
    defaultValue: 'apple',
    placeholder: 'Search fruits...',
  });
  
  return (
    <div className="custom-autocomplete">
      <div className="input-wrapper">
        <input {...getInputProps({ className: 'input' })} />
        {selectedValue && (
          <button {...getClearButtonProps({ className: 'clear-button' })}>
            ×
          </button>
        )}
      </div>
      
      {isOpen && (
        <div {...getDropdownProps({ className: 'dropdown' })}>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="empty">No results found</div>
          ) : (
            <div className="options">
              {filteredOptions.map(option => (
                <div
                  key={option.value}
                  {...getOptionProps(option, { className: 'option' })}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## API Reference

### Autocomplete (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | AutocompleteOption[] | [] | Array of options to select from |
| defaultValue | string | '' | Default selected value (uncontrolled) |
| value | string | - | Controlled selected value |
| defaultInputValue | string | '' | Default input value (uncontrolled) |
| inputValue | string | - | Controlled input value |
| onChange | (value: string) => void | - | Callback when selection changes |
| onInputChange | (value: string) => void | - | Callback when input value changes |
| disabled | boolean | false | Whether the autocomplete is disabled |
| readOnly | boolean | false | Whether the autocomplete is read-only |
| required | boolean | false | Whether the autocomplete is required |
| id | string | auto-generated | ID for the autocomplete element |
| name | string | - | Name attribute for the autocomplete |
| placeholder | string | 'Search...' | Placeholder text |
| allowCustomValue | boolean | false | Whether to allow custom values not in the options |
| openOnFocus | boolean | true | Whether to open the dropdown when the input is focused |
| clearOnSelect | boolean | false | Whether to clear the input value when an option is selected |
| selectOnFocus | boolean | false | Whether to select all text when the input is focused |
| filterOptions | boolean | true | Whether to filter options based on input value |
| filterFunction | (option: AutocompleteOption, inputValue: string) => boolean | - | Custom filter function |
| minChars | number | 1 | Minimum number of characters to start showing suggestions |
| maxSuggestions | number | - | Maximum number of suggestions to show |
| debounceTime | number | 200 | Debounce time in milliseconds for input changes |
| autoSelectFirst | boolean | false | Whether to auto-select the first option |
| onOpen | () => void | - | Callback when dropdown opens |
| onClose | () => void | - | Callback when dropdown closes |
| onHighlight | (option: AutocompleteOption \| null) => void | - | Callback when an option is highlighted |
| onFocus | (event: React.FocusEvent) => void | - | Callback when the input is focused |
| onBlur | (event: React.FocusEvent) => void | - | Callback when the input is blurred |
| loadOptions | (inputValue: string) => Promise<AutocompleteOption[]> | - | Callback to load options asynchronously |

### AutocompleteOption Interface

| Property | Type | Description |
|----------|------|-------------|
| value | string | Unique value for the option |
| label | string | Display label for the option |
| disabled | boolean | Whether the option is disabled |
| group | string | Optional group the option belongs to |
| [key: string] | any | Additional data |

### Compound Components

The Autocomplete component uses a compound component pattern, providing the following sub-components:

- `Autocomplete.Input` - Input element for entering search text
- `Autocomplete.Dropdown` - Container for the dropdown content
- `Autocomplete.Options` - Container for the options
- `Autocomplete.Option` - Individual option element
- `Autocomplete.ClearButton` - Button to clear the selection
- `Autocomplete.Loading` - Loading indicator for async options
- `Autocomplete.Empty` - Empty state when no options match

### Data Attributes

The Autocomplete component and its sub-components expose several data attributes that can be used for styling:

- `data-disabled`: Present when the autocomplete is disabled
- `data-readonly`: Present when the autocomplete is read-only
- `data-required`: Present when the autocomplete is required
- `data-focused`: Present when the input is focused
- `data-loading`: Present when options are being loaded
- `data-open`: Present when the dropdown is open
- `data-empty`: Present when there are no filtered options
- `data-selected`: Present on the selected option
- `data-highlighted`: Present on the highlighted option

### Hooks

#### useAutocomplete

```jsx
import { useAutocomplete } from '@strive-ui/autocomplete';

function MyCustomAutocomplete() {
  const {
    selectedValue,
    selectedOption,
    inputValue,
    isOpen,
    highlightedOption,
    filteredOptions,
    loading,
    disabled,
    readOnly,
    required,
    focused,
    id,
    name,
    placeholder,
    inputRef,
    dropdownRef,
    open,
    close,
    toggle,
    selectOption,
    clearSelection,
    highlightOption,
    highlightNextOption,
    highlightPrevOption,
    setInputValue,
    focus,
    blur,
    getInputProps,
    getDropdownProps,
    getOptionProps,
    getClearButtonProps,
  } = useAutocomplete({
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
    placeholder: 'Search fruits...',
  });
  
  // Build your custom autocomplete UI
}
```
