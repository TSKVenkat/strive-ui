# MultiSelectHeadless

A headless multi-select component that provides all the functionality for selecting multiple options from a dropdown list without enforcing any specific styling.

## Features

- Select multiple options from a dropdown
- Searchable options with filtering
- Keyboard navigation
- Accessible by default
- Customizable rendering
- Support for option groups
- Maximum selection limit

## Usage

### Basic Usage

```jsx
import { MultiSelect } from '@pulseui/multi-select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function MyComponent() {
  return (
    <MultiSelect 
      options={options} 
      placeholder="Select fruits..."
      onChange={(values) => console.log('Selected:', values)}
    />
  );
}
```

### Controlled MultiSelect

```jsx
import { useState } from 'react';
import { MultiSelect } from '@pulseui/multi-select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function ControlledMultiSelect() {
  const [selectedValues, setSelectedValues] = useState(['apple', 'banana']);
  
  return (
    <div>
      <MultiSelect 
        options={options} 
        value={selectedValues} 
        onChange={setSelectedValues}
        placeholder="Select fruits..."
      />
      <div>
        <h3>Selected Fruits:</h3>
        <ul>
          {options
            .filter(option => selectedValues.includes(option.value))
            .map(option => (
              <li key={option.value}>{option.label}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}
```

### With Search

```jsx
import { MultiSelect } from '@pulseui/multi-select';

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

function SearchableMultiSelect() {
  return (
    <MultiSelect 
      options={options} 
      placeholder="Search and select fruits..."
      searchable
    />
  );
}
```

### With Option Groups

```jsx
import { MultiSelect } from '@pulseui/multi-select';

const options = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'banana', label: 'Banana', group: 'Fruits' },
  { value: 'orange', label: 'Orange', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
  { value: 'spinach', label: 'Spinach', group: 'Vegetables' },
  { value: 'chocolate', label: 'Chocolate', group: 'Sweets' },
  { value: 'candy', label: 'Candy', group: 'Sweets' },
];

function GroupedMultiSelect() {
  return (
    <MultiSelect 
      options={options} 
      placeholder="Select items..."
    >
      {({ filteredOptions, getOptionProps }) => {
        // Group the options
        const groups = filteredOptions.reduce((acc, option) => {
          const group = option.group || 'Other';
          if (!acc[group]) {
            acc[group] = [];
          }
          acc[group].push(option);
          return acc;
        }, {});
        
        return (
          <MultiSelect.Dropdown>
            <MultiSelect.Input />
            <MultiSelect.Options>
              {Object.entries(groups).map(([groupName, groupOptions]) => (
                <div key={groupName}>
                  <div style={{ fontWeight: 'bold', padding: '8px' }}>{groupName}</div>
                  {groupOptions.map(option => (
                    <MultiSelect.Option key={option.value} option={option}>
                      {option.label}
                    </MultiSelect.Option>
                  ))}
                </div>
              ))}
            </MultiSelect.Options>
          </MultiSelect.Dropdown>
        );
      }}
    </MultiSelect>
  );
}
```

### With Maximum Selection Limit

```jsx
import { MultiSelect } from '@pulseui/multi-select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function LimitedMultiSelect() {
  return (
    <MultiSelect 
      options={options} 
      placeholder="Select up to 3 fruits..."
      maxSelectedItems={3}
    />
  );
}
```

### Disabled State

```jsx
import { MultiSelect } from '@pulseui/multi-select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape', disabled: true },
  { value: 'kiwi', label: 'Kiwi' },
];

function DisabledMultiSelect() {
  return (
    <MultiSelect 
      options={options} 
      placeholder="Select fruits..."
      defaultValue={['apple', 'banana']}
      disabled
    />
  );
}
```

### Custom Styling

```jsx
import { MultiSelect } from '@pulseui/multi-select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function CustomStyledMultiSelect() {
  return (
    <MultiSelect
      options={options}
      placeholder="Select fruits..."
      style={{ 
        position: 'relative',
        width: '300px',
      }}
    >
      <MultiSelect.Trigger
        style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '100%',
          minHeight: '40px',
          padding: '8px 12px',
          backgroundColor: 'white',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          cursor: 'pointer',
          outline: 'none',
          '[data-open]': {
            borderColor: '#3b82f6',
            boxShadow: '0 0 0 1px #3b82f6',
          },
          '[data-disabled]': {
            backgroundColor: '#f1f5f9',
            cursor: 'not-allowed',
          },
        }}
      >
        <MultiSelect.SelectedItems
          style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          {(context) => 
            context.selectedOptions.map((option) => (
              <MultiSelect.SelectedItem
                key={option.value}
                option={option}
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                {option.label}
                <MultiSelect.SelectedItemRemove
                  option={option}
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    opacity: 0.7,
                    ':hover': {
                      opacity: 1,
                    },
                  }}
                />
              </MultiSelect.SelectedItem>
            ))
          }
        </MultiSelect.SelectedItems>
      </MultiSelect.Trigger>
      
      <MultiSelect.Dropdown
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
        }}
      >
        <MultiSelect.Input
          style={{ 
            width: '100%',
            padding: '8px 12px',
            border: 'none',
            borderBottom: '1px solid #e2e8f0',
            outline: 'none',
          }}
          placeholder="Search..."
        />
        
        <MultiSelect.Options
          style={{ 
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {(context) => 
            context.filteredOptions.map((option) => (
              <MultiSelect.Option
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
              </MultiSelect.Option>
            ))
          }
        </MultiSelect.Options>
      </MultiSelect.Dropdown>
    </MultiSelect>
  );
}
```

### Using the Hook Directly

```jsx
import { useMultiSelect } from '@pulseui/multi-select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'kiwi', label: 'Kiwi' },
];

function CustomMultiSelect() {
  const {
    selectedValues,
    selectedOptions,
    isOpen,
    filteredOptions,
    toggle,
    selectOption,
    deselectOption,
    clearSelection,
    getTriggerProps,
    getDropdownProps,
    getOptionProps,
    getSelectedItemProps,
    getSelectedItemRemoveProps,
  } = useMultiSelect({
    options,
    defaultValue: ['apple'],
    placeholder: 'Select fruits...',
  });
  
  return (
    <div className="custom-multi-select">
      <button {...getTriggerProps({ className: 'custom-trigger' })}>
        {selectedOptions.length > 0 ? (
          <div className="selected-items">
            {selectedOptions.map(option => (
              <div
                key={option.value}
                {...getSelectedItemProps(option, { className: 'selected-item' })}
              >
                {option.label}
                <button
                  {...getSelectedItemRemoveProps(option, { className: 'remove-button' })}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <span>Select fruits...</span>
        )}
      </button>
      
      {isOpen && (
        <div {...getDropdownProps({ className: 'dropdown' })}>
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
          
          {selectedValues.length > 0 && (
            <button
              className="clear-button"
              onClick={clearSelection}
            >
              Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
```

## API Reference

### MultiSelect (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | SelectOption[] | [] | Array of options to select from |
| defaultValue | string[] | [] | Default selected values (uncontrolled) |
| value | string[] | - | Controlled selected values |
| onChange | (value: string[]) => void | - | Callback when selection changes |
| disabled | boolean | false | Whether the select is disabled |
| readOnly | boolean | false | Whether the select is read-only |
| required | boolean | false | Whether the select is required |
| id | string | auto-generated | ID for the select element |
| name | string | - | Name attribute for the select |
| placeholder | string | 'Select options...' | Placeholder text when no option is selected |
| closeOnSelect | boolean | false | Whether to close the dropdown when an option is selected |
| filterOptions | boolean | true | Whether to filter options based on input value |
| filterFunction | (option: SelectOption, inputValue: string) => boolean | - | Custom filter function |
| maxSelectedItems | number | - | Maximum number of items that can be selected |
| searchable | boolean | false | Whether to show a search input |
| defaultInputValue | string | '' | Default input value for search (uncontrolled) |
| inputValue | string | - | Controlled input value for search |
| onInputChange | (value: string) => void | - | Callback when input value changes |
| onOpen | () => void | - | Callback when dropdown opens |
| onClose | () => void | - | Callback when dropdown closes |
| onHighlight | (option: SelectOption \| null) => void | - | Callback when an option is highlighted |
| onFocus | (event: React.FocusEvent) => void | - | Callback when the select is focused |
| onBlur | (event: React.FocusEvent) => void | - | Callback when the select is blurred |

### SelectOption Interface

| Property | Type | Description |
|----------|------|-------------|
| value | string | Unique value for the option |
| label | string | Display label for the option |
| disabled | boolean | Whether the option is disabled |
| group | string | Optional group the option belongs to |
| [key: string] | any | Additional data |

### Compound Components

The MultiSelect component uses a compound component pattern, providing the following sub-components:

- `MultiSelect.Trigger` - Button that opens the dropdown
- `MultiSelect.Dropdown` - Container for the dropdown content
- `MultiSelect.Options` - Container for the options
- `MultiSelect.Option` - Individual option element
- `MultiSelect.Input` - Search input for filtering options
- `MultiSelect.ClearButton` - Button to clear all selected options
- `MultiSelect.SelectedItems` - Container for selected items
- `MultiSelect.SelectedItem` - Individual selected item element
- `MultiSelect.SelectedItemRemove` - Button to remove a selected item

### Data Attributes

The MultiSelect component and its sub-components expose several data attributes that can be used for styling:

- `data-disabled`: Present when the select is disabled
- `data-readonly`: Present when the select is read-only
- `data-required`: Present when the select is required
- `data-open`: Present when the dropdown is open
- `data-focused`: Present when the select is focused
- `data-empty`: Present when there are no selected options
- `data-selected`: Present on selected options
- `data-highlighted`: Present on the highlighted option

### Hooks

#### useMultiSelect

```jsx
import { useMultiSelect } from '@pulseui/multi-select';

function MyCustomMultiSelect() {
  const {
    selectedValues,
    selectedOptions,
    isOpen,
    highlightedOption,
    inputValue,
    filteredOptions,
    disabled,
    readOnly,
    required,
    focused,
    id,
    name,
    placeholder,
    triggerRef,
    dropdownRef,
    inputRef,
    open,
    close,
    toggle,
    selectOption,
    deselectOption,
    toggleOption,
    clearSelection,
    highlightOption,
    highlightNextOption,
    highlightPrevOption,
    setInputValue,
    focus,
    blur,
    getTriggerProps,
    getDropdownProps,
    getOptionProps,
    getInputProps,
    getClearButtonProps,
    getSelectedItemProps,
    getSelectedItemRemoveProps,
  } = useMultiSelect({
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ],
    placeholder: 'Select fruits...',
  });
  
  // Build your custom multi-select UI
}
```
