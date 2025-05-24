# SelectHeadless

A headless select component that provides all the functionality without any styling. This component can be used as a base for creating custom styled select/dropdown implementations.

## Features

- Supports both controlled and uncontrolled modes
- Searchable options
- Option grouping
- Keyboard navigation
- Clearable selection
- Compound component API for flexible customization
- Polymorphic components (can render as any HTML element or React component)
- Fully accessible with proper ARIA attributes
- Focus management

## Installation

```bash
npm install @strive-ui/select
```

## Usage

### Basic Usage

```jsx
import { Select } from '@strive-ui/select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

function MyComponent() {
  return (
    <Select options={options}>
      <Select.Label>Favorite Fruit</Select.Label>
      <Select.Trigger />
      <Select.Dropdown>
        {options.map((option) => (
          <Select.Option key={option.value} option={option} />
        ))}
      </Select.Dropdown>
    </Select>
  );
}
```

### Controlled Select

```jsx
import { useState } from 'react';
import { Select } from '@strive-ui/select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

function ControlledSelect() {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <p>Selected fruit: {value || 'None'}</p>
      <Select 
        options={options} 
        value={value} 
        onChange={(newValue) => setValue(newValue)}
      >
        <Select.Label>Favorite Fruit</Select.Label>
        <Select.Trigger />
        <Select.Dropdown>
          {options.map((option) => (
            <Select.Option key={option.value} option={option} />
          ))}
        </Select.Dropdown>
      </Select>
    </div>
  );
}
```

### Searchable Select

```jsx
import { Select } from '@strive-ui/select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'blueberry', label: 'Blueberry' },
];

function SearchableSelect() {
  return (
    <Select options={options} searchable>
      <Select.Label>Favorite Fruit</Select.Label>
      <Select.Trigger />
      <Select.Dropdown>
        <div style={{ padding: '8px' }}>
          <Select.Search placeholder="Search fruits..." />
        </div>
        {({ filteredOptions }) => (
          filteredOptions.map((option) => (
            <Select.Option key={option.value} option={option} />
          ))
        )}
      </Select.Dropdown>
    </Select>
  );
}
```

### Option Groups

```jsx
import { Select } from '@strive-ui/select';

const options = [
  { value: 'apple', label: 'Apple', group: 'fruits' },
  { value: 'banana', label: 'Banana', group: 'fruits' },
  { value: 'orange', label: 'Orange', group: 'fruits' },
  { value: 'carrot', label: 'Carrot', group: 'vegetables' },
  { value: 'broccoli', label: 'Broccoli', group: 'vegetables' },
  { value: 'spinach', label: 'Spinach', group: 'vegetables' },
];

const groups = {
  fruits: { label: 'Fruits' },
  vegetables: { label: 'Vegetables' },
};

function GroupedSelect() {
  return (
    <Select options={options} groups={groups}>
      <Select.Label>Food</Select.Label>
      <Select.Trigger />
      <Select.Dropdown>
        <Select.Group name="fruits" label="Fruits">
          {options
            .filter(option => option.group === 'fruits')
            .map(option => (
              <Select.Option key={option.value} option={option} />
            ))
          }
        </Select.Group>
        <Select.Group name="vegetables" label="Vegetables">
          {options
            .filter(option => option.group === 'vegetables')
            .map(option => (
              <Select.Option key={option.value} option={option} />
            ))
          }
        </Select.Group>
      </Select.Dropdown>
    </Select>
  );
}
```

### Clearable Select

```jsx
import { Select } from '@strive-ui/select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

function ClearableSelect() {
  return (
    <Select options={options} clearable>
      <Select.Label>Favorite Fruit</Select.Label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select.Trigger style={{ flexGrow: 1 }} />
        <Select.ClearButton />
      </div>
      <Select.Dropdown>
        {options.map((option) => (
          <Select.Option key={option.value} option={option} />
        ))}
      </Select.Dropdown>
    </Select>
  );
}
```

### Custom Styling with Compound Components

```jsx
import { Select } from '@strive-ui/select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

function CustomSelect() {
  return (
    <Select options={options}>
      <Select.Label style={{ 
        display: 'block', 
        marginBottom: '4px', 
        fontWeight: 500 
      }}>
        Favorite Fruit
      </Select.Label>
      
      <Select.Trigger style={{ 
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #D1D5DB',
        borderRadius: '4px',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
      }}>
        {({ selectedOption, placeholder }) => (
          <>
            <span>{selectedOption?.label || placeholder}</span>
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </>
        )}
      </Select.Trigger>
      
      <Select.Dropdown style={{ 
        marginTop: '4px',
        border: '1px solid #D1D5DB',
        borderRadius: '4px',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'auto',
      }}>
        {options.map((option) => (
          <Select.Option 
            key={option.value} 
            option={option}
            style={{ 
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            {({ isSelected, isHighlighted }) => (
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                backgroundColor: isHighlighted ? '#F3F4F6' : 'transparent',
                color: isSelected ? '#4F46E5' : 'inherit',
                fontWeight: isSelected ? 500 : 'normal',
              }}>
                {option.label}
                {isSelected && (
                  <svg style={{ marginLeft: 'auto' }} viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            )}
          </Select.Option>
        ))}
      </Select.Dropdown>
    </Select>
  );
}
```

### Styling with Tailwind CSS

```jsx
import { Select } from '@strive-ui/select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

function TailwindSelect() {
  return (
    <Select options={options} searchable clearable>
      <Select.Label className="block text-sm font-medium text-gray-700 mb-1">
        Favorite Fruit
      </Select.Label>
      
      <div className="relative">
        <Select.Trigger className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
          {({ selectedOption, placeholder, isOpen }) => (
            <>
              <span className="block truncate">
                {selectedOption?.label || placeholder}
              </span>
              <span className="ml-2 pointer-events-none">
                <svg className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </>
          )}
        </Select.Trigger>
        
        <Select.ClearButton className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </Select.ClearButton>
      </div>
      
      <Select.Dropdown className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
        <div className="px-3 py-2">
          <Select.Search className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" placeholder="Search..." />
        </div>
        
        {options.map((option) => (
          <Select.Option 
            key={option.value} 
            option={option}
            className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
          >
            {({ isSelected, isHighlighted }) => (
              <>
                <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
                  {option.label}
                </span>
                
                {isSelected && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </>
            )}
          </Select.Option>
        ))}
      </Select.Dropdown>
    </Select>
  );
}
```

### Styling with Styled Components

```jsx
import styled from 'styled-components';
import { Select } from '@strive-ui/select';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
];

const StyledLabel = styled(Select.Label)`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #374151;
`;

const StyledTrigger = styled(Select.Trigger)`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #6366F1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledDropdown = styled(Select.Dropdown)`
  margin-top: 4px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: auto;
`;

const StyledSearch = styled(Select.Search)`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: #6366F1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const StyledOption = styled(Select.Option)`
  padding: 8px 12px;
  cursor: pointer;
  
  &[data-highlighted] {
    background-color: #F3F4F6;
  }
  
  &[data-selected] {
    color: #4F46E5;
    font-weight: 500;
  }
  
  &[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledClearButton = styled(Select.ClearButton)`
  background: none;
  border: none;
  color: #9CA3AF;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  
  &:hover {
    color: #6B7280;
  }
`;

function StyledComponentsSelect() {
  return (
    <Select options={options} searchable clearable>
      <StyledLabel>Favorite Fruit</StyledLabel>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledTrigger />
        <StyledClearButton />
      </div>
      
      <StyledDropdown>
        <div style={{ padding: '8px' }}>
          <StyledSearch placeholder="Search fruits..." />
        </div>
        
        {options.map((option) => (
          <StyledOption key={option.value} option={option} />
        ))}
      </StyledDropdown>
    </Select>
  );
}
```

## API Reference

### Select (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | SelectOption[] | [] | Options for the select |
| groups | Record<string, SelectGroup> | - | Optional groups for the options |
| defaultValue | string | '' | Default value (uncontrolled) |
| value | string | - | Controlled value |
| onChange | (value: string, option: SelectOption) => void | - | Callback when value changes |
| onOpen | () => void | - | Callback when the select is opened |
| onClose | () => void | - | Callback when the select is closed |
| disabled | boolean | false | Whether the select is disabled |
| required | boolean | false | Whether the select is required |
| name | string | - | Name attribute for the select |
| id | string | auto-generated | ID for the select element |
| placeholder | string | 'Select an option' | Placeholder text when no option is selected |
| clearable | boolean | false | Whether the select is clearable |
| searchable | boolean | false | Whether the select is searchable |
| maxHeight | number | 300 | Maximum height of the dropdown in pixels |
| placement | 'top' \| 'bottom' \| 'auto' | 'bottom' | Placement of the dropdown |
| matchWidth | boolean | true | Whether the dropdown should match the width of the trigger |
| closeOnSelect | boolean | true | Whether to close the dropdown when an option is selected |
| focusOnSelect | boolean | true | Whether to focus the trigger when an option is selected |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |

### Select.Trigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode \| RenderFunction | - | Children to render inside the trigger |
| as | ElementType | 'button' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | ButtonHTMLAttributes | - | All other props are passed to the underlying button element |

### Select.Dropdown

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Children to render inside the dropdown |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

### Select.Search

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placeholder | string | 'Search...' | Placeholder for the search input |
| as | ElementType | 'input' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | InputHTMLAttributes | - | All other props are passed to the underlying input element |

### Select.Option

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| option | SelectOption | - | The option data |
| children | ReactNode \| RenderFunction | - | Children to render inside the option |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

### Select.Group

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | The group label |
| name | string | - | The group name (key) |
| children | ReactNode | - | Children to render inside the group |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

### Select.ClearButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Children to render inside the clear button |
| as | ElementType | 'button' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | ButtonHTMLAttributes | - | All other props are passed to the underlying button element |

### Select.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Children to render inside the label |
| as | ElementType | 'label' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | LabelHTMLAttributes | - | All other props are passed to the underlying label element |

## Types

### SelectOption

| Property | Type | Description |
|----------|------|-------------|
| value | string | The value of the option |
| label | string | The label to display for the option |
| disabled | boolean | Whether the option is disabled |
| group | string | Optional group that the option belongs to |
| prefix | ReactNode | Optional icon or element to display before the label |
| suffix | ReactNode | Optional icon or element to display after the label |
| description | string | Optional description or hint text |

### SelectGroup

| Property | Type | Description |
|----------|------|-------------|
| label | string | The label of the group |
| description | string | Optional description for the group |

## Accessibility

The SelectHeadless component follows the WAI-ARIA combobox pattern and includes the following accessibility features:

- Proper ARIA roles and attributes (`role="combobox"`, `role="listbox"`, `aria-expanded`, `aria-haspopup`, etc.)
- Keyboard navigation (Arrow keys to navigate options, Enter to select, Escape to close)
- Focus management
- Label association with the select element

## Hooks

### useSelect

If you need more control, you can use the `useSelect` hook directly:

```jsx
import { useSelect } from '@strive-ui/select';

function MyCustomSelect() {
  const { 
    value,
    selectedOption,
    isOpen,
    filteredOptions,
    highlightedIndex,
    open,
    close,
    toggle,
    selectOption,
    clearSelection,
    setSearchQuery,
    getTriggerProps,
    getDropdownProps,
    getSearchInputProps,
    getOptionProps,
    getClearButtonProps,
  } = useSelect({
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
    ],
    searchable: true,
    clearable: true,
  });
  
  return (
    <div>
      <button {...getTriggerProps()}>
        {selectedOption?.label || 'Select an option'}
      </button>
      {isOpen && (
        <div {...getDropdownProps()}>
          <input {...getSearchInputProps()} placeholder="Search..." />
          {filteredOptions.map((option, index) => (
            <div key={option.value} {...getOptionProps(option, index)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```
