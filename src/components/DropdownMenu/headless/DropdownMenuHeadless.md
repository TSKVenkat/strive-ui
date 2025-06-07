# DropdownMenuHeadless

A headless component for creating customizable dropdown menus with extensive flexibility for developers. Dropdown menus display a list of options when triggered, perfect for navigation, selection, and actions.

## Usage

```jsx
import { DropdownMenuHeadless } from 'pulseui';

function MyDropdownMenu() {
  const items = [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit clicked') },
    { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
    { id: 'archive', label: 'Archive', onClick: () => console.log('Archive clicked') },
    { id: 'divider1', isDivider: true },
    { id: 'delete', label: 'Delete', onClick: () => console.log('Delete clicked') }
  ];

  return (
    <DropdownMenuHeadless.Root
      items={items}
      placement="bottom-start"
      closeOnSelect={true}
      enableKeyboardNavigation={true}
    >
      <DropdownMenuHeadless.Trigger>
        Actions ▾
      </DropdownMenuHeadless.Trigger>
      
      <DropdownMenuHeadless.Portal>
        <DropdownMenuHeadless.Content
          style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            minWidth: '180px',
            padding: '4px 0'
          }}
        >
          {items.map((item, index) => (
            item.isDivider ? (
              <DropdownMenuHeadless.Divider
                key={item.id}
                style={{
                  margin: '4px 0',
                  border: 'none',
                  borderTop: '1px solid #eee'
                }}
              />
            ) : (
              <DropdownMenuHeadless.Item
                key={item.id}
                item={item}
                index={index}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  ':hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                {item.label}
              </DropdownMenuHeadless.Item>
            )
          ))}
        </DropdownMenuHeadless.Content>
      </DropdownMenuHeadless.Portal>
    </DropdownMenuHeadless.Root>
  );
}
```

## Creating a Reusable Dropdown Menu Component

```jsx
import { DropdownMenuHeadless } from 'pulseui';

function DropdownMenu({ 
  trigger, 
  items, 
  placement = 'bottom-start',
  onSelect
}) {
  return (
    <DropdownMenuHeadless.Root
      items={items}
      placement={placement}
      onSelect={onSelect}
      closeOnSelect={true}
      enableKeyboardNavigation={true}
    >
      <DropdownMenuHeadless.Trigger as="div" style={{ display: 'inline-block' }}>
        {trigger}
      </DropdownMenuHeadless.Trigger>
      
      <DropdownMenuHeadless.Portal>
        <DropdownMenuHeadless.Content
          style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            minWidth: '180px',
            padding: '4px 0'
          }}
        >
          {items.map((item, index) => {
            if (item.isDivider) {
              return (
                <DropdownMenuHeadless.Divider
                  key={item.id}
                  style={{
                    margin: '4px 0',
                    border: 'none',
                    borderTop: '1px solid #eee'
                  }}
                />
              );
            }
            
            if (item.isHeader) {
              return (
                <DropdownMenuHeadless.Header
                  key={item.id}
                  style={{
                    padding: '8px 12px',
                    fontWeight: 'bold',
                    color: '#666',
                    fontSize: '0.8em',
                    textTransform: 'uppercase'
                  }}
                >
                  {item.label}
                </DropdownMenuHeadless.Header>
              );
            }
            
            return (
              <DropdownMenuHeadless.Item
                key={item.id}
                item={item}
                index={index}
                style={{
                  padding: '8px 12px',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </DropdownMenuHeadless.Item>
            );
          })}
        </DropdownMenuHeadless.Content>
      </DropdownMenuHeadless.Portal>
    </DropdownMenuHeadless.Root>
  );
}

// Usage
function App() {
  const menuItems = [
    { id: 'header1', label: 'File Operations', isHeader: true },
    { id: 'new', label: 'New File', icon: '📄', onClick: () => console.log('New clicked') },
    { id: 'open', label: 'Open...', icon: '📂', onClick: () => console.log('Open clicked') },
    { id: 'save', label: 'Save', icon: '💾', onClick: () => console.log('Save clicked') },
    { id: 'divider1', isDivider: true },
    { id: 'header2', label: 'Edit Operations', isHeader: true },
    { id: 'cut', label: 'Cut', icon: '✂️', onClick: () => console.log('Cut clicked') },
    { id: 'copy', label: 'Copy', icon: '📋', onClick: () => console.log('Copy clicked') },
    { id: 'paste', label: 'Paste', icon: '📌', onClick: () => console.log('Paste clicked') },
    { id: 'divider2', isDivider: true },
    { id: 'delete', label: 'Delete', icon: '🗑️', onClick: () => console.log('Delete clicked') }
  ];
  
  return (
    <div>
      <DropdownMenu
        trigger={<button>Menu ▾</button>}
        items={menuItems}
        onSelect={(item) => console.log(`Selected: ${item.label}`)}
      />
    </div>
  );
}
```

## Creating a Multi-Select Dropdown

```jsx
import { DropdownMenuHeadless } from 'pulseui';
import { useState } from 'react';

function MultiSelectDropdown({ 
  options, 
  placeholder = 'Select options',
  onChange
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  
  const items = options.map(option => ({
    id: option.value,
    label: option.label,
    disabled: option.disabled
  }));
  
  const handleSelectionChange = (newSelectedIds) => {
    setSelectedIds(newSelectedIds);
    onChange?.(newSelectedIds);
  };
  
  const selectedLabels = options
    .filter(option => selectedIds.includes(option.value))
    .map(option => option.label)
    .join(', ');
  
  return (
    <DropdownMenuHeadless.Root
      items={items}
      selectedIds={selectedIds}
      onSelectionChange={handleSelectionChange}
      multiSelect={true}
      showCheckboxes={true}
      enableSearch={true}
    >
      <DropdownMenuHeadless.Trigger
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          minWidth: '200px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{selectedLabels || placeholder}</span>
        <span>▾</span>
      </DropdownMenuHeadless.Trigger>
      
      <DropdownMenuHeadless.Portal>
        <DropdownMenuHeadless.Content
          style={{
            background: 'white',
            border: '1px solid #eee',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            minWidth: '200px'
          }}
        >
          <div style={{ padding: '8px' }}>
            <DropdownMenuHeadless.Search
              placeholder="Search options..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ maxHeight: '200px', overflow: 'auto', padding: '4px 0' }}>
            <DropdownMenuHeadless.Empty
              style={{
                padding: '8px 12px',
                color: '#999',
                textAlign: 'center'
              }}
            >
              No options found
            </DropdownMenuHeadless.Empty>
            
            {items.map((item, index) => (
              <DropdownMenuHeadless.Item
                key={item.id}
                item={item}
                index={index}
                style={{
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <DropdownMenuHeadless.Checkbox
                  itemId={item.id}
                  style={{
                    margin: 0
                  }}
                />
                {item.label}
              </DropdownMenuHeadless.Item>
            ))}
          </div>
        </DropdownMenuHeadless.Content>
      </DropdownMenuHeadless.Portal>
    </DropdownMenuHeadless.Root>
  );
}

// Usage
function App() {
  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'kiwi', label: 'Kiwi' },
    { value: 'mango', label: 'Mango' },
    { value: 'pineapple', label: 'Pineapple' },
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <MultiSelectDropdown
        options={options}
        placeholder="Select fruits"
        onChange={(selectedValues) => console.log('Selected:', selectedValues)}
      />
    </div>
  );
}
```

## API

### DropdownMenuHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultOpen` | `boolean` | `false` | Whether the dropdown menu is initially open |
| `open` | `boolean` | - | Controlled open state |
| `onOpen` | `() => void` | - | Callback when the dropdown menu opens |
| `onClose` | `() => void` | - | Callback when the dropdown menu closes |
| `placement` | `PopoverPlacement` | `'bottom-start'` | Placement of the dropdown menu relative to the trigger |
| `offset` | `number` | `8` | Offset from the trigger element in pixels |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the dropdown menu when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the dropdown menu when pressing Escape key |
| `closeOnSelect` | `boolean` | `true` | Whether to close the dropdown menu when an item is selected |
| `enableKeyboardNavigation` | `boolean` | `true` | Whether to enable keyboard navigation |
| `enableSearch` | `boolean` | `false` | Whether to enable search filtering |
| `highlightFirstItem` | `boolean` | `true` | Whether to highlight the first item by default |
| `loopNavigation` | `boolean` | `true` | Whether to loop through items when navigating with keyboard |
| `showCheckboxes` | `boolean` | `false` | Whether to show a checkbox for selected items |
| `multiSelect` | `boolean` | `false` | Whether to allow multiple selections |
| `selectedIds` | `string[]` | - | Selected item IDs for controlled selection |
| `defaultSelectedIds` | `string[]` | `[]` | Default selected item IDs for uncontrolled selection |
| `onSelectionChange` | `(selectedIds: string[]) => void` | - | Callback when selection changes |
| `items` | `DropdownMenuItem[]` | `[]` | List of items in the dropdown menu |
| `onSelect` | `(item: DropdownMenuItem) => void` | - | Callback when an item is selected |
| `usePortal` | `boolean` | `true` | Whether to render the dropdown menu in a portal |
| `portalId` | `string` | `'dropdown-menu-root'` | ID of the element to render the portal into |

### DropdownMenuItem Type

```typescript
interface DropdownMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
  isDivider?: boolean;
  isHeader?: boolean;
  onClick?: () => void;
  items?: DropdownMenuItem[];
}
```

### Other Components

- `DropdownMenuHeadless.Trigger`: Element that triggers the dropdown menu
- `DropdownMenuHeadless.Portal`: Portal container for the dropdown menu
- `DropdownMenuHeadless.Content`: Content container for the dropdown menu
- `DropdownMenuHeadless.Arrow`: Arrow pointing to the trigger
- `DropdownMenuHeadless.Item`: Individual item in the dropdown menu
- `DropdownMenuHeadless.Divider`: Horizontal divider between items
- `DropdownMenuHeadless.Header`: Header for a group of items
- `DropdownMenuHeadless.Group`: Group of related items
- `DropdownMenuHeadless.Search`: Search input for filtering items
- `DropdownMenuHeadless.Empty`: Content to display when no items match the search
- `DropdownMenuHeadless.Checkbox`: Checkbox for multi-select functionality

### useDropdownMenu Hook

For even more control, you can use the `useDropdownMenu` hook directly:

```jsx
import { useDropdownMenu } from 'pulseui';

function MyCustomDropdownMenu() {
  const {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
    contentRef,
    highlightedIndex,
    selectedIds,
    toggleSelection,
    selectItem,
    deselectItem,
    clearSelection,
    selectAll,
    searchQuery,
    setSearchQuery,
    filteredItems,
    getTriggerProps,
    getContentProps,
    getItemProps,
    getSearchInputProps,
  } = useDropdownMenu({
    items: [
      { id: 'item1', label: 'Item 1' },
      { id: 'item2', label: 'Item 2' },
    ],
    placement: 'bottom-start',
    multiSelect: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Dropdown Menu component follows WAI-ARIA best practices:

- The menu has `role="menu"` and appropriate ARIA attributes
- Menu items have `role="menuitem"` and appropriate ARIA attributes
- Dividers have `role="separator"`
- Headers have `role="presentation"`
- Groups have `role="group"` with proper labeling
- Keyboard navigation is supported with arrow keys, Enter, Space, Home, End, and Escape
- Focus is trapped within the menu when open
- Screen reader announcements for state changes
