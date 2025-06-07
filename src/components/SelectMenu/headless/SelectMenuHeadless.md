# SelectMenuHeadless

A headless component for creating customizable select menus with extensive flexibility for developers. Select menus allow users to choose one or more options from a dropdown list, with support for searching, grouping, and more.

## Usage

```jsx
import { SelectMenuHeadless } from 'pulseui';

function MySelectMenu() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'kiwi', label: 'Kiwi' },
  ];

  const [value, setValue] = useState('');

  return (
    <SelectMenuHeadless.Root
      options={options}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      placeholder="Select a fruit"
      searchable={true}
    >
      <SelectMenuHeadless.Container
        style={{
          position: 'relative',
          width: '300px'
        }}
      >
        <SelectMenuHeadless.Trigger
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <SelectMenuHeadless.Value />
          <span>▼</span>
        </SelectMenuHeadless.Trigger>
        
        <SelectMenuHeadless.Portal>
          <SelectMenuHeadless.Menu
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000
            }}
          >
            <div style={{ padding: '8px' }}>
              <SelectMenuHeadless.Search
                placeholder="Search fruits..."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              <SelectMenuHeadless.NoOptions
                style={{
                  padding: '8px 12px',
                  color: '#999',
                  textAlign: 'center'
                }}
              />
              
              <SelectMenuHeadless.Loading
                style={{
                  padding: '8px 12px',
                  color: '#999',
                  textAlign: 'center'
                }}
              />
              
              {options.map((option, index) => (
                <SelectMenuHeadless.Option
                  key={option.value}
                  option={option}
                  index={index}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    backgroundColor: ({ isHighlighted, isSelected }) =>
                      isSelected ? '#e6f7ff' : isHighlighted ? '#f5f5f5' : 'transparent'
                  }}
                />
              ))}
            </div>
          </SelectMenuHeadless.Menu>
        </SelectMenuHeadless.Portal>
      </SelectMenuHeadless.Container>
      
      <SelectMenuHeadless.Error
        style={{
          color: 'red',
          fontSize: '14px',
          marginTop: '4px'
        }}
      />
    </SelectMenuHeadless.Root>
  );
}
```

## Creating a Multi-Select Menu

```jsx
import { SelectMenuHeadless } from 'pulseui';

function MultiSelectMenu() {
  const options = [
    { value: 'apple', label: 'Apple', group: 'Fruits' },
    { value: 'banana', label: 'Banana', group: 'Fruits' },
    { value: 'orange', label: 'Orange', group: 'Fruits' },
    { value: 'carrot', label: 'Carrot', group: 'Vegetables' },
    { value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
    { value: 'potato', label: 'Potato', group: 'Vegetables' },
  ];

  const [value, setValue] = useState([]);

  return (
    <SelectMenuHeadless.Root
      options={options}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      placeholder="Select items"
      multiple={true}
      searchable={true}
      clearable={true}
      groupOptions={true}
      showCheckboxes={true}
      showSelectAll={true}
    >
      <SelectMenuHeadless.Container
        style={{
          position: 'relative',
          width: '300px'
        }}
      >
        <SelectMenuHeadless.Trigger
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <SelectMenuHeadless.Value />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SelectMenuHeadless.ClearButton
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                marginRight: '8px',
                display: value.length > 0 ? 'block' : 'none'
              }}
            />
            <span>▼</span>
          </div>
        </SelectMenuHeadless.Trigger>
        
        <SelectMenuHeadless.Portal>
          <SelectMenuHeadless.Menu
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000
            }}
          >
            <div style={{ padding: '8px' }}>
              <SelectMenuHeadless.Search
                placeholder="Search..."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              <SelectMenuHeadless.SelectAll
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #eee',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              />
              
              <SelectMenuHeadless.NoOptions
                style={{
                  padding: '8px 12px',
                  color: '#999',
                  textAlign: 'center'
                }}
              />
              
              {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
                <SelectMenuHeadless.Group
                  key={groupName}
                  name={groupName}
                  style={{
                    marginTop: '8px'
                  }}
                >
                  <SelectMenuHeadless.GroupLabel
                    name={groupName}
                    style={{
                      padding: '4px 12px',
                      fontWeight: 'bold',
                      color: '#666',
                      fontSize: '0.8em',
                      textTransform: 'uppercase'
                    }}
                  />
                  
                  {groupOptions.map((option, index) => (
                    <SelectMenuHeadless.Option
                      key={option.value}
                      option={option}
                      index={index}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={value.includes(option.value)} 
                        readOnly 
                      />
                      {option.label}
                    </SelectMenuHeadless.Option>
                  ))}
                </SelectMenuHeadless.Group>
              ))}
            </div>
          </SelectMenuHeadless.Menu>
        </SelectMenuHeadless.Portal>
      </SelectMenuHeadless.Container>
    </SelectMenuHeadless.Root>
  );
}
```

## Creating a Creatable Select

```jsx
import { SelectMenuHeadless } from 'pulseui';
import { useState } from 'react';

function CreatableSelect() {
  const [options, setOptions] = useState([
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
  ]);
  
  const [value, setValue] = useState('');
  
  const handleChange = (newValue, selectedOption) => {
    setValue(newValue);
  };
  
  const createOption = (inputValue) => {
    const newOption = { value: inputValue.toLowerCase(), label: inputValue };
    setOptions([...options, newOption]);
    return newOption;
  };

  return (
    <SelectMenuHeadless.Root
      options={options}
      value={value}
      onChange={handleChange}
      placeholder="Select or create a fruit"
      searchable={true}
      creatable={true}
      createOption={createOption}
      createText="Create option"
    >
      <SelectMenuHeadless.Container
        style={{
          position: 'relative',
          width: '300px'
        }}
      >
        <SelectMenuHeadless.Trigger
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <SelectMenuHeadless.Value />
          <span>▼</span>
        </SelectMenuHeadless.Trigger>
        
        <SelectMenuHeadless.Portal>
          <SelectMenuHeadless.Menu
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginTop: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000
            }}
          >
            <div style={{ padding: '8px' }}>
              <SelectMenuHeadless.Search
                placeholder="Search or create..."
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ maxHeight: '200px', overflow: 'auto' }}>
              <SelectMenuHeadless.NoOptions
                style={{
                  padding: '8px 12px',
                  color: '#999',
                  textAlign: 'center'
                }}
              />
              
              <SelectMenuHeadless.CreateOption
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  color: '#0066cc',
                  fontStyle: 'italic'
                }}
              />
              
              {options.map((option, index) => (
                <SelectMenuHeadless.Option
                  key={option.value}
                  option={option}
                  index={index}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </SelectMenuHeadless.Menu>
        </SelectMenuHeadless.Portal>
      </SelectMenuHeadless.Container>
    </SelectMenuHeadless.Root>
  );
}
```

## API

### SelectMenuHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `SelectOption[]` | `[]` | List of options |
| `value` | `string \| string[]` | - | Selected value(s) for controlled selection |
| `defaultValue` | `string \| string[]` | `''` | Default selected value(s) for uncontrolled selection |
| `onChange` | `(value: string \| string[], option?: SelectOption \| SelectOption[]) => void` | - | Callback when selection changes |
| `multiple` | `boolean` | `false` | Whether to allow multiple selections |
| `searchable` | `boolean` | `false` | Whether to enable search filtering |
| `placeholder` | `string` | `'Select...'` | Placeholder text when no option is selected |
| `searchPlaceholder` | `string` | `'Search...'` | Placeholder text for the search input |
| `clearSearchOnSelect` | `boolean` | `true` | Whether to clear the search input when an option is selected |
| `closeOnSelect` | `boolean` | `!multiple` | Whether to close the menu when an option is selected |
| `clearable` | `boolean` | `false` | Whether to show a clear button to remove all selections |
| `creatable` | `boolean` | `false` | Whether to create a new option when the search query doesn't match any options |
| `createOption` | `(inputValue: string) => SelectOption` | - | Function to create a new option from search query |
| `createText` | `string` | `'Create'` | Text to display for creating a new option |
| `groupOptions` | `boolean` | `false` | Whether to group options |
| `showCheckboxes` | `boolean` | `multiple` | Whether to show checkboxes for options in multiple mode |
| `maxDisplayValues` | `number` | `3` | Maximum number of items to display as selected in the trigger |
| `overflowText` | `string` | `'more selected'` | Text to display when more items are selected than maxDisplayValues |
| `showSelectAll` | `boolean` | `false` | Whether to show a select all option in multiple mode |
| `selectAllText` | `string` | `'Select All'` | Text for the select all option |
| `filterOption` | `(option: SelectOption, inputValue: string) => boolean` | - | Function to filter options based on search query |
| `sortOptions` | `(a: SelectOption, b: SelectOption) => number` | - | Function to sort options |
| `disabled` | `boolean` | `false` | Whether the select is disabled |
| `required` | `boolean` | `false` | Whether the select is required |
| `error` | `string` | `''` | Error message to display |
| `loading` | `boolean` | `false` | Whether the select is loading |
| `loadingText` | `string` | `'Loading...'` | Text to display when loading |
| `noOptionsText` | `string` | `'No options available'` | Text to display when no options are available |
| `noResultsText` | `string` | `'No results found'` | Text to display when no options match the search query |

### SelectOption Type

```typescript
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
  data?: any;
}
```

### Other Components

- `SelectMenuHeadless.Container`: Container for the select menu
- `SelectMenuHeadless.Trigger`: Trigger button for the select menu
- `SelectMenuHeadless.Portal`: Portal container for the select menu
- `SelectMenuHeadless.Menu`: Menu container for the options
- `SelectMenuHeadless.Search`: Search input for filtering options
- `SelectMenuHeadless.Option`: Individual option in the select menu
- `SelectMenuHeadless.Group`: Group of related options
- `SelectMenuHeadless.GroupLabel`: Label for a group of options
- `SelectMenuHeadless.SelectAll`: Option to select all options
- `SelectMenuHeadless.ClearButton`: Button to clear all selections
- `SelectMenuHeadless.CreateOption`: Option to create a new option
- `SelectMenuHeadless.NoOptions`: Content to display when no options match the search
- `SelectMenuHeadless.Loading`: Content to display when loading
- `SelectMenuHeadless.Error`: Content to display error messages
- `SelectMenuHeadless.Value`: Display for the selected value(s)

### useSelectMenu Hook

For even more control, you can use the `useSelectMenu` hook directly:

```jsx
import { useSelectMenu } from 'pulseui';

function MyCustomSelectMenu() {
  const {
    isOpen,
    open,
    close,
    toggle,
    value,
    setValue,
    selectedOption,
    clearValue,
    searchValue,
    setSearchValue,
    filteredOptions,
    groupedOptions,
    containerRef,
    triggerRef,
    menuRef,
    searchInputRef,
    highlightedIndex,
    setHighlightedIndex,
    createNewOption,
    selectAll,
    deselectAll,
    disabled,
    loading,
    hasError,
    error,
    getContainerProps,
    getTriggerProps,
    getMenuProps,
    getOptionProps,
    getSearchInputProps,
    getClearButtonProps,
    getSelectAllProps,
    getGroupProps,
    getGroupLabelProps,
    getDisplayValue,
  } = useSelectMenu({
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
    multiple: true,
    searchable: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Select Menu component follows WAI-ARIA best practices:

- The trigger has appropriate ARIA attributes (`aria-haspopup`, `aria-expanded`, etc.)
- The menu has `role="listbox"` and appropriate ARIA attributes
- Options have `role="option"` and appropriate ARIA attributes
- Groups have `role="group"` with proper labeling
- Keyboard navigation is supported with arrow keys, Enter, Space, Home, End, and Escape
- Focus is trapped within the menu when open
- Screen reader announcements for state changes
