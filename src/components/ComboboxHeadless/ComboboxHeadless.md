# ComboboxHeadless

A headless combobox component that combines the functionality of a dropdown select and an autocomplete input, providing a flexible and accessible solution for selecting from a list of options.

## Features

- Autocomplete with filtering
- Free text input option
- Keyboard navigation
- Controlled and uncontrolled modes
- Option grouping
- Custom filtering
- Fully accessible

## Usage

### Basic Usage

```jsx
import { Combobox } from '@pulseui/combobox';

function MyComponent() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'grape', label: 'Grape' },
  ];

  return (
    <Combobox 
      options={options} 
      placeholder="Select a fruit"
    />
  );
}
```

### Controlled Combobox

```jsx
import { useState } from 'react';
import { Combobox } from '@pulseui/combobox';

function ControlledCombobox() {
  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'grape', label: 'Grape' },
  ];
  
  return (
    <div>
      <Combobox 
        options={options}
        value={value}
        inputValue={inputValue}
        onChange={(newValue, option) => {
          setValue(newValue);
          console.log('Selected option:', option);
        }}
        onInputChange={setInputValue}
        placeholder="Select a fruit"
      />
      <p>Selected value: {value}</p>
      <p>Input value: {inputValue}</p>
    </div>
  );
}
```

### With Custom Values

```jsx
import { Combobox } from '@pulseui/combobox';

function ComboboxWithCustomValues() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ];
  
  return (
    <Combobox 
      options={options}
      allowCustomValue
      placeholder="Enter or select a fruit"
    />
  );
}
```

### With Option Groups

```jsx
import { Combobox } from '@pulseui/combobox';

function ComboboxWithGroups() {
  const options = [
    { value: 'apple', label: 'Apple', group: 'Fruits' },
    { value: 'banana', label: 'Banana', group: 'Fruits' },
    { value: 'orange', label: 'Orange', group: 'Fruits' },
    { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
    { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
    { value: 'spinach', label: 'Spinach', group: 'Vegetables' },
  ];
  
  return (
    <Combobox options={options} placeholder="Select an item">
      <Combobox.Input />
      <Combobox.ToggleButton />
      <Combobox.ClearButton />
      <Combobox.Listbox>
        {Object.entries(
          options.reduce((groups, option) => {
            const group = option.group || 'Other';
            return {
              ...groups,
              [group]: [...(groups[group] || []), option],
            };
          }, {})
        ).map(([group, groupOptions]) => (
          <Combobox.Group key={group} label={group}>
            {groupOptions.map((option) => (
              <Combobox.Option key={option.value} option={option} />
            ))}
          </Combobox.Group>
        ))}
      </Combobox.Listbox>
    </Combobox>
  );
}
```

### With Custom Filtering

```jsx
import { Combobox } from '@pulseui/combobox';

function ComboboxWithCustomFiltering() {
  const options = [
    { value: 'apple', label: 'Apple', tags: ['fruit', 'red', 'sweet'] },
    { value: 'banana', label: 'Banana', tags: ['fruit', 'yellow', 'sweet'] },
    { value: 'orange', label: 'Orange', tags: ['fruit', 'orange', 'citrus'] },
    { value: 'lemon', label: 'Lemon', tags: ['fruit', 'yellow', 'citrus', 'sour'] },
    { value: 'lime', label: 'Lime', tags: ['fruit', 'green', 'citrus', 'sour'] },
  ];
  
  // Custom filter function that searches in both label and tags
  const customFilterFunction = (option, inputValue) => {
    const searchTerm = inputValue.toLowerCase();
    return (
      option.label.toLowerCase().includes(searchTerm) ||
      option.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  };
  
  return (
    <Combobox 
      options={options}
      filterFunction={customFilterFunction}
      placeholder="Search by name or tag (e.g., 'citrus')"
    />
  );
}
```

### Disabled State

```jsx
import { Combobox } from '@pulseui/combobox';

function DisabledCombobox() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ];
  
  return (
    <Combobox 
      options={options}
      disabled
      placeholder="Select a fruit"
    />
  );
}
```

### With Disabled Options

```jsx
import { Combobox } from '@pulseui/combobox';

function ComboboxWithDisabledOptions() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana', disabled: true },
    { value: 'orange', label: 'Orange' },
    { value: 'strawberry', label: 'Strawberry', disabled: true },
    { value: 'grape', label: 'Grape' },
  ];
  
  return (
    <Combobox 
      options={options}
      placeholder="Select a fruit"
    />
  );
}
```

### Custom Styling

```jsx
import { Combobox } from '@pulseui/combobox';

function CustomStyledCombobox() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'grape', label: 'Grape' },
  ];
  
  return (
    <Combobox 
      options={options}
      placeholder="Select a fruit"
      style={{ 
        position: 'relative',
        width: '300px',
      }}
    >
      <div style={{ 
        display: 'flex',
        position: 'relative',
        width: '100%',
      }}>
        <Combobox.Input 
          style={{ 
            width: '100%',
            padding: '8px 32px 8px 12px',
            borderRadius: '4px',
            border: '1px solid #cbd5e1',
            fontSize: '14px',
            outline: 'none',
            ':focus': {
              borderColor: '#3b82f6',
              boxShadow: '0 0 0 1px #3b82f6',
            },
          }}
        />
        <Combobox.ToggleButton 
          style={{ 
            position: 'absolute',
            right: '0',
            top: '0',
            height: '100%',
            padding: '0 8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
          }}
        />
        <Combobox.ClearButton 
          style={{ 
            position: 'absolute',
            right: '28px',
            top: '0',
            height: '100%',
            padding: '0 4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            display: 'var(--clear-button-display, none)',
            '[data-visible]': {
              '--clear-button-display': 'block',
            },
          }}
        />
      </div>
      
      <Combobox.Listbox 
        style={{ 
          position: 'absolute',
          top: '100%',
          left: '0',
          width: '100%',
          maxHeight: '200px',
          overflowY: 'auto',
          margin: '4px 0 0',
          padding: '4px 0',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          background: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          zIndex: '10',
          listStyle: 'none',
        }}
      >
        {(context) => (
          <>
            {context.filteredOptions.map((option) => (
              <Combobox.Option 
                key={option.value} 
                option={option}
                style={{ 
                  padding: '8px 12px',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  backgroundColor: 'var(--option-bg, transparent)',
                  color: option.disabled ? '#a0aec0' : 'inherit',
                  '--option-selected-bg': '#ebf5ff',
                  '--option-highlighted-bg': '#f1f5f9',
                  '[data-selected]': {
                    '--option-bg': 'var(--option-selected-bg)',
                  },
                  '[data-highlighted]': {
                    '--option-bg': 'var(--option-highlighted-bg)',
                  },
                  '[data-selected][data-highlighted]': {
                    '--option-bg': 'var(--option-selected-bg)',
                  },
                }}
              />
            ))}
            
            <Combobox.Empty 
              style={{ 
                padding: '8px 12px',
                color: '#a0aec0',
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              No options found
            </Combobox.Empty>
          </>
        )}
      </Combobox.Listbox>
    </Combobox>
  );
}
```

### Using the Hook Directly

```jsx
import { useCombobox } from '@pulseui/combobox';

function CustomCombobox() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ];
  
  const {
    inputValue,
    selectedOption,
    filteredOptions,
    isOpen,
    getComboboxProps,
    getInputProps,
    getToggleButtonProps,
    getClearButtonProps,
    getListboxProps,
    getOptionProps,
    clear,
  } = useCombobox({
    options,
    placeholder: 'Select a fruit',
    allowCustomValue: true,
  });
  
  return (
    <div {...getComboboxProps({ className: 'custom-combobox' })}>
      <div className="input-container">
        <input {...getInputProps({ className: 'combobox-input' })} />
        <button {...getToggleButtonProps({ className: 'toggle-button' })}>
          ▼
        </button>
        <button {...getClearButtonProps({ className: 'clear-button' })}>
          ✕
        </button>
      </div>
      
      {isOpen && (
        <ul {...getListboxProps({ className: 'options-list' })}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                {...getOptionProps(option, {
                  className: `option ${selectedOption?.value === option.value ? 'selected' : ''}`,
                })}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="no-options">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
}
```

## API Reference

### Combobox (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | ComboboxOption[] | [] | Options for the combobox |
| defaultValue | string | '' | Default value (uncontrolled) |
| defaultInputValue | string | '' | Default input value (uncontrolled) |
| value | string | - | Controlled value |
| inputValue | string | - | Controlled input value |
| onChange | (value: string, option: ComboboxOption \| null) => void | - | Callback when value changes |
| onInputChange | (value: string) => void | - | Callback when input value changes |
| disabled | boolean | false | Whether the combobox is disabled |
| readOnly | boolean | false | Whether the combobox is read-only |
| required | boolean | false | Whether the combobox is required |
| id | string | auto-generated | ID for the combobox element |
| name | string | - | Name attribute for the combobox |
| placeholder | string | 'Select an option' | Placeholder text |
| allowCustomValue | boolean | false | Whether to allow free text input |
| openOnFocus | boolean | true | Whether to open the dropdown on focus |
| clearOnSelect | boolean | false | Whether to clear the input when an option is selected |
| selectOnFocus | boolean | false | Whether to select the first option when the dropdown is opened |
| filterOptions | boolean | true | Whether to filter options based on input value |
| filterFunction | (option: ComboboxOption, inputValue: string) => boolean | - | Custom filter function |
| onOpen | () => void | - | Callback when dropdown is opened |
| onClose | () => void | - | Callback when dropdown is closed |
| onHighlight | (option: ComboboxOption \| null) => void | - | Callback when an option is highlighted |
| onFocus | (event: React.FocusEvent) => void | - | Callback when the input is focused |
| onBlur | (event: React.FocusEvent) => void | - | Callback when the input is blurred |

### ComboboxOption Interface

| Property | Type | Description |
|----------|------|-------------|
| value | string | Option value |
| label | string | Option label |
| disabled | boolean | Whether the option is disabled |
| group | string | Option group |
| [key: string] | any | Additional data |

### Compound Components

The Combobox component uses a compound component pattern, providing the following sub-components:

- `Combobox.Input` - Input element for the combobox
- `Combobox.ToggleButton` - Button to toggle the dropdown
- `Combobox.ClearButton` - Button to clear the input
- `Combobox.Listbox` - Container for the options
- `Combobox.Option` - Individual option item
- `Combobox.Group` - Group container for options
- `Combobox.Empty` - Component to display when no options are found

### Data Attributes

The Combobox component and its sub-components expose several data attributes that can be used for styling:

- `data-disabled`: Present when the combobox is disabled
- `data-readonly`: Present when the combobox is read-only
- `data-required`: Present when the combobox is required
- `data-open`: Present when the dropdown is open
- `data-has-value`: Present when the combobox has a value
- `data-selected`: Present on the selected option
- `data-highlighted`: Present on the highlighted option
- `data-visible`: Present on the clear button when it should be visible

### Hooks

#### useCombobox

```jsx
import { useCombobox } from '@pulseui/combobox';

function MyCustomCombobox() {
  const {
    value,
    inputValue,
    selectedOption,
    highlightedOption,
    filteredOptions,
    isOpen,
    disabled,
    readOnly,
    required,
    focused,
    id,
    inputId,
    listboxId,
    name,
    placeholder,
    inputRef,
    listboxRef,
    open,
    close,
    toggle,
    setValue,
    setInputValue,
    selectOption,
    highlightOption,
    highlightNextOption,
    highlightPrevOption,
    focus,
    blur,
    clear,
    getComboboxProps,
    getInputProps,
    getToggleButtonProps,
    getClearButtonProps,
    getListboxProps,
    getOptionProps,
    getGroupProps,
  } = useCombobox({
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
    ],
    placeholder: 'Select a fruit',
  });
  
  // Build your custom combobox UI
}
```
