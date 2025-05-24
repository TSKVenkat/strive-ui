# ContextMenuHeadless

A headless component for creating customizable context menus with extensive flexibility for developers. Context menus appear when right-clicking on an element, providing contextual actions for that element.

## Usage

```jsx
import { ContextMenuHeadless } from 'strive-ui';

function MyContextMenu() {
  const items = [
    { id: 'edit', label: 'Edit', onClick: () => console.log('Edit clicked') },
    { id: 'duplicate', label: 'Duplicate', onClick: () => console.log('Duplicate clicked') },
    { id: 'archive', label: 'Archive', onClick: () => console.log('Archive clicked') },
    { id: 'divider1', isDivider: true },
    { id: 'delete', label: 'Delete', onClick: () => console.log('Delete clicked') }
  ];

  return (
    <ContextMenuHeadless.Root
      items={items}
      closeOnSelect={true}
      enableKeyboardNavigation={true}
    >
      <ContextMenuHeadless.Target
        style={{
          padding: '20px',
          border: '1px dashed #ccc',
          display: 'inline-block'
        }}
      >
        Right-click me to open the context menu
      </ContextMenuHeadless.Target>
      
      <ContextMenuHeadless.Portal>
        <ContextMenuHeadless.Content
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
              <ContextMenuHeadless.Divider
                key={item.id}
                style={{
                  margin: '4px 0',
                  border: 'none',
                  borderTop: '1px solid #eee'
                }}
              />
            ) : (
              <ContextMenuHeadless.Item
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
              </ContextMenuHeadless.Item>
            )
          ))}
        </ContextMenuHeadless.Content>
      </ContextMenuHeadless.Portal>
    </ContextMenuHeadless.Root>
  );
}
```

## Creating a Reusable Context Menu Component

```jsx
import { ContextMenuHeadless } from 'strive-ui';

function ContextMenu({ 
  children, 
  items, 
  onSelect
}) {
  return (
    <ContextMenuHeadless.Root
      items={items}
      onSelect={onSelect}
      closeOnSelect={true}
      enableKeyboardNavigation={true}
    >
      <ContextMenuHeadless.Target>
        {children}
      </ContextMenuHeadless.Target>
      
      <ContextMenuHeadless.Portal>
        <ContextMenuHeadless.Content
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
                <ContextMenuHeadless.Divider
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
                <ContextMenuHeadless.Header
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
                </ContextMenuHeadless.Header>
              );
            }
            
            return (
              <ContextMenuHeadless.Item
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
              </ContextMenuHeadless.Item>
            );
          })}
        </ContextMenuHeadless.Content>
      </ContextMenuHeadless.Portal>
    </ContextMenuHeadless.Root>
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
    <div style={{ padding: '20px' }}>
      <ContextMenu
        items={menuItems}
        onSelect={(item) => console.log(`Selected: ${item.label}`)}
      >
        <div style={{ 
          width: '300px', 
          height: '200px', 
          border: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Right-click anywhere in this area
        </div>
      </ContextMenu>
    </div>
  );
}
```

## Creating a File Explorer with Context Menu

```jsx
import { ContextMenuHeadless } from 'strive-ui';
import { useState } from 'react';

function FileExplorer() {
  const [files, setFiles] = useState([
    { id: 'file1', name: 'document.txt', type: 'text' },
    { id: 'file2', name: 'image.jpg', type: 'image' },
    { id: 'file3', name: 'spreadsheet.xlsx', type: 'spreadsheet' },
    { id: 'file4', name: 'presentation.pptx', type: 'presentation' },
  ]);
  
  const getMenuItems = (file) => [
    { 
      id: 'open', 
      label: 'Open', 
      icon: '📂', 
      onClick: () => console.log(`Opening ${file.name}`) 
    },
    { 
      id: 'rename', 
      label: 'Rename', 
      icon: '✏️', 
      onClick: () => console.log(`Renaming ${file.name}`) 
    },
    { 
      id: 'download', 
      label: 'Download', 
      icon: '⬇️', 
      onClick: () => console.log(`Downloading ${file.name}`) 
    },
    { id: 'divider1', isDivider: true },
    { 
      id: 'delete', 
      label: 'Delete', 
      icon: '🗑️', 
      onClick: () => {
        console.log(`Deleting ${file.name}`);
        setFiles(files.filter(f => f.id !== file.id));
      } 
    },
  ];
  
  const getFileIcon = (type) => {
    switch (type) {
      case 'text': return '📄';
      case 'image': return '🖼️';
      case 'spreadsheet': return '📊';
      case 'presentation': return '📑';
      default: return '📁';
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>File Explorer</h2>
      <div style={{ 
        border: '1px solid #eee', 
        borderRadius: '4px',
        padding: '10px'
      }}>
        {files.map(file => (
          <ContextMenuHeadless.Root
            key={file.id}
            items={getMenuItems(file)}
          >
            <ContextMenuHeadless.Target>
              <div style={{ 
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                borderRadius: '4px',
                ':hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}>
                <span>{getFileIcon(file.type)}</span>
                <span>{file.name}</span>
              </div>
            </ContextMenuHeadless.Target>
            
            <ContextMenuHeadless.Portal>
              <ContextMenuHeadless.Content
                style={{
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  minWidth: '180px',
                  padding: '4px 0'
                }}
              >
                {getMenuItems(file).map((item, index) => (
                  item.isDivider ? (
                    <ContextMenuHeadless.Divider
                      key={item.id}
                      style={{
                        margin: '4px 0',
                        border: 'none',
                        borderTop: '1px solid #eee'
                      }}
                    />
                  ) : (
                    <ContextMenuHeadless.Item
                      key={item.id}
                      item={item}
                      index={index}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        ':hover': {
                          backgroundColor: '#f5f5f5'
                        }
                      }}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      {item.label}
                    </ContextMenuHeadless.Item>
                  )
                ))}
              </ContextMenuHeadless.Content>
            </ContextMenuHeadless.Portal>
          </ContextMenuHeadless.Root>
        ))}
      </div>
    </div>
  );
}
```

## API

### ContextMenuHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `DropdownMenuItem[]` | `[]` | List of items in the context menu |
| `onSelect` | `(item: DropdownMenuItem) => void` | - | Callback when an item is selected |
| `closeOnSelect` | `boolean` | `true` | Whether to close the context menu when an item is selected |
| `enableKeyboardNavigation` | `boolean` | `true` | Whether to enable keyboard navigation |
| `enableSearch` | `boolean` | `false` | Whether to enable search filtering |
| `highlightFirstItem` | `boolean` | `true` | Whether to highlight the first item by default |
| `loopNavigation` | `boolean` | `true` | Whether to loop through items when navigating with keyboard |
| `showCheckboxes` | `boolean` | `false` | Whether to show a checkbox for selected items |
| `multiSelect` | `boolean` | `false` | Whether to allow multiple selections |
| `selectedIds` | `string[]` | - | Selected item IDs for controlled selection |
| `defaultSelectedIds` | `string[]` | `[]` | Default selected item IDs for uncontrolled selection |
| `onSelectionChange` | `(selectedIds: string[]) => void` | - | Callback when selection changes |
| `onOpen` | `(x: number, y: number) => void` | - | Callback when the context menu opens |
| `onClose` | `() => void` | - | Callback when the context menu closes |
| `usePortal` | `boolean` | `true` | Whether to render the context menu in a portal |
| `portalId` | `string` | `'context-menu-root'` | ID of the element to render the portal into |
| `preventDefaultContextMenu` | `boolean` | `true` | Whether to prevent the default context menu |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the context menu when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the context menu when pressing Escape key |
| `trapFocus` | `boolean` | `true` | Whether to trap focus within the context menu |

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

- `ContextMenuHeadless.Target`: Element that triggers the context menu on right-click
- `ContextMenuHeadless.Portal`: Portal container for the context menu
- `ContextMenuHeadless.Content`: Content container for the context menu
- `ContextMenuHeadless.Item`: Individual item in the context menu
- `ContextMenuHeadless.Divider`: Horizontal divider between items
- `ContextMenuHeadless.Header`: Header for a group of items
- `ContextMenuHeadless.Group`: Group of related items
- `ContextMenuHeadless.Search`: Search input for filtering items
- `ContextMenuHeadless.Empty`: Content to display when no items match the search
- `ContextMenuHeadless.Checkbox`: Checkbox for multi-select functionality

### useContextMenu Hook

For even more control, you can use the `useContextMenu` hook directly:

```jsx
import { useContextMenu } from 'strive-ui';

function MyCustomContextMenu() {
  const {
    isOpen,
    open,
    close,
    x,
    y,
    contentRef,
    targetRef,
    highlightedIndex,
    selectedIds,
    toggleSelection,
    filteredItems,
    getTargetProps,
    getContentProps,
    getItemProps,
  } = useContextMenu({
    items: [
      { id: 'item1', label: 'Item 1' },
      { id: 'item2', label: 'Item 2' },
    ],
    preventDefaultContextMenu: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Context Menu component follows WAI-ARIA best practices:

- The menu has `role="menu"` and appropriate ARIA attributes
- Menu items have `role="menuitem"` and appropriate ARIA attributes
- Dividers have `role="separator"`
- Headers have `role="presentation"`
- Groups have `role="group"` with proper labeling
- Keyboard navigation is supported with arrow keys, Enter, Space, Home, End, and Escape
- Focus is trapped within the menu when open
- Screen reader announcements for state changes
