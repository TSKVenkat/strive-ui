# QuickActionsHeadless

A headless implementation of a quick actions menu that provides a command palette or action menu interface. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Keyboard shortcuts**: Support for custom keyboard shortcuts
- **Keyboard navigation**: Full keyboard support for navigation and selection
- **Search functionality**: Built-in filtering of actions
- **Grouping**: Support for categorizing actions into groups
- **Controlled & uncontrolled modes**: Flexible state management

## Basic Usage

```jsx
import { QuickActions } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Modal = styled(QuickActions)`
  width: 500px;
  max-width: 90%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const SearchInput = styled(QuickActions.Search)`
  width: 100%;
  padding: 16px;
  border: none;
  border-bottom: 1px solid #eaeaea;
  font-size: 16px;
  outline: none;
  
  &::placeholder {
    color: #999;
  }
`;

const List = styled(QuickActions.List)`
  max-height: 300px;
  overflow-y: auto;
`;

const Item = styled(QuickActions.Item)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  
  &:hover, &[aria-selected="true"] {
    background-color: #f5f5f5;
  }
  
  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Icon = styled(QuickActions.Icon)`
  margin-right: 12px;
  color: #666;
`;

const Content = styled.div`
  flex: 1;
`;

const Label = styled(QuickActions.Label)`
  font-weight: 500;
`;

const Description = styled(QuickActions.Description)`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const Shortcut = styled(QuickActions.Shortcut)`
  margin-left: 12px;
  color: #999;
  font-size: 12px;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
`;

const Empty = styled(QuickActions.Empty)`
  padding: 16px;
  text-align: center;
  color: #999;
`;

function MyQuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  
  const actions = [
    {
      id: 'new-file',
      label: 'New File',
      icon: '📄',
      shortcut: 'Ctrl+N',
      description: 'Create a new file',
      onAction: () => console.log('Creating new file'),
    },
    {
      id: 'open-file',
      label: 'Open File',
      icon: '📂',
      shortcut: 'Ctrl+O',
      description: 'Open an existing file',
      onAction: () => console.log('Opening file'),
    },
    {
      id: 'save-file',
      label: 'Save File',
      icon: '💾',
      shortcut: 'Ctrl+S',
      description: 'Save the current file',
      onAction: () => console.log('Saving file'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      description: 'Open settings',
      onAction: () => console.log('Opening settings'),
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      shortcut: 'F1',
      description: 'Get help',
      onAction: () => console.log('Opening help'),
    },
    {
      id: 'exit',
      label: 'Exit',
      icon: '🚪',
      shortcut: 'Alt+F4',
      description: 'Exit the application',
      disabled: true,
      onAction: () => console.log('Exiting application'),
    },
  ];
  
  const toggleQuickActions = () => {
    setIsOpen(!isOpen);
  };
  
  // Register global keyboard shortcut to open quick actions
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        toggleQuickActions();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <>
      <button onClick={toggleQuickActions}>
        Open Quick Actions (Ctrl+K)
      </button>
      
      {isOpen && (
        <Container onClick={() => setIsOpen(false)}>
          <Modal
            actions={actions}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            closeOnAction={true}
            enableSearch={true}
            onClick={(e) => e.stopPropagation()}
          >
            <SearchInput placeholder="Search actions..." />
            
            <List>
              <QuickActions.Empty>
                No actions found
              </QuickActions.Empty>
              
              {actions.map(action => (
                <Item key={action.id} action={action}>
                  <Icon action={action} />
                  <Content>
                    <Label action={action} />
                    <Description action={action} />
                  </Content>
                  <Shortcut action={action} />
                </Item>
              ))}
            </List>
          </Modal>
        </Container>
      )}
    </>
  );
}
```

## Grouped Actions Example

```jsx
import { QuickActions } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Modal = styled(QuickActions)`
  width: 600px;
  max-width: 90%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const SearchInput = styled(QuickActions.Search)`
  width: 100%;
  padding: 16px;
  border: none;
  border-bottom: 1px solid #eaeaea;
  font-size: 16px;
  outline: none;
`;

const List = styled(QuickActions.List)`
  max-height: 400px;
  overflow-y: auto;
`;

const Group = styled(QuickActions.Group)`
  margin-bottom: 8px;
`;

const GroupLabel = styled(QuickActions.GroupLabel)`
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  background-color: #f5f5f5;
`;

const Item = styled(QuickActions.Item)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  
  &:hover, &[aria-selected="true"] {
    background-color: #f0f7ff;
  }
`;

const Icon = styled(QuickActions.Icon)`
  margin-right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Label = styled(QuickActions.Label)`
  flex: 1;
`;

const Shortcut = styled(QuickActions.Shortcut)`
  color: #999;
  font-size: 12px;
`;

function GroupedQuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  
  const actions = [
    {
      id: 'new-file',
      label: 'New File',
      icon: '📄',
      shortcut: 'Ctrl+N',
      group: 'File',
      onAction: () => console.log('Creating new file'),
    },
    {
      id: 'open-file',
      label: 'Open File',
      icon: '📂',
      shortcut: 'Ctrl+O',
      group: 'File',
      onAction: () => console.log('Opening file'),
    },
    {
      id: 'save-file',
      label: 'Save File',
      icon: '💾',
      shortcut: 'Ctrl+S',
      group: 'File',
      onAction: () => console.log('Saving file'),
    },
    {
      id: 'cut',
      label: 'Cut',
      icon: '✂️',
      shortcut: 'Ctrl+X',
      group: 'Edit',
      onAction: () => console.log('Cut'),
    },
    {
      id: 'copy',
      label: 'Copy',
      icon: '📋',
      shortcut: 'Ctrl+C',
      group: 'Edit',
      onAction: () => console.log('Copy'),
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: '📌',
      shortcut: 'Ctrl+V',
      group: 'Edit',
      onAction: () => console.log('Paste'),
    },
    {
      id: 'zoom-in',
      label: 'Zoom In',
      icon: '🔍',
      shortcut: 'Ctrl++',
      group: 'View',
      onAction: () => console.log('Zoom in'),
    },
    {
      id: 'zoom-out',
      label: 'Zoom Out',
      icon: '🔍',
      shortcut: 'Ctrl+-',
      group: 'View',
      onAction: () => console.log('Zoom out'),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      group: 'Preferences',
      onAction: () => console.log('Opening settings'),
    },
    {
      id: 'help',
      label: 'Help',
      icon: '❓',
      shortcut: 'F1',
      group: 'Help',
      onAction: () => console.log('Opening help'),
    },
  ];
  
  // Group the actions
  const groups = [...new Set(actions.map(action => action.group))];
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Quick Actions
      </button>
      
      <Modal
        actions={actions}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        closeOnAction={true}
        enableSearch={true}
      >
        <SearchInput placeholder="Search actions..." />
        
        <List>
          <QuickActions.Empty>
            No actions found
          </QuickActions.Empty>
          
          {groups.map(groupName => (
            <Group key={groupName} name={groupName}>
              <GroupLabel name={groupName} />
              
              {actions
                .filter(action => action.group === groupName)
                .map(action => (
                  <Item key={action.id} action={action}>
                    <Icon action={action} />
                    <Label action={action} />
                    <Shortcut action={action} />
                  </Item>
                ))
              }
            </Group>
          ))}
        </List>
      </Modal>
    </>
  );
}
```

## Command Palette Example

```jsx
import { QuickActions } from 'pulseui';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding-top: 100px;
`;

const CommandPalette = styled(QuickActions)`
  width: 550px;
  max-width: 90%;
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const SearchInput = styled(QuickActions.Search)`
  width: 100%;
  padding: 16px;
  background-color: #2d2d2d;
  border: none;
  color: #e0e0e0;
  font-size: 16px;
  outline: none;
  
  &::placeholder {
    color: #999;
  }
`;

const List = styled(QuickActions.List)`
  max-height: 350px;
  overflow-y: auto;
`;

const Group = styled(QuickActions.Group)`
  margin-bottom: 4px;
`;

const GroupLabel = styled(QuickActions.GroupLabel)`
  padding: 8px 16px;
  font-size: 12px;
  color: #999;
  background-color: #252525;
`;

const Item = styled(QuickActions.Item)`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  cursor: pointer;
  
  &:hover, &[aria-selected="true"] {
    background-color: #2a2d2e;
  }
`;

const Icon = styled(QuickActions.Icon)`
  margin-right: 12px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;

const Label = styled(QuickActions.Label)`
  flex: 1;
`;

const Shortcut = styled(QuickActions.Shortcut)`
  color: #999;
  font-size: 12px;
  display: flex;
  gap: 4px;
`;

const KeyboardKey = styled.span`
  background-color: #333;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 11px;
  min-width: 14px;
  text-align: center;
`;

const Empty = styled(QuickActions.Empty)`
  padding: 16px;
  text-align: center;
  color: #999;
`;

function CommandPaletteExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Format shortcut keys for display
  const formatShortcut = (shortcut) => {
    if (!shortcut) return null;
    
    return shortcut.split('+').map((key, index) => (
      <KeyboardKey key={index}>
        {key === 'Ctrl' ? '⌃' : 
         key === 'Alt' ? '⌥' : 
         key === 'Shift' ? '⇧' : 
         key === 'Meta' || key === 'Cmd' ? '⌘' : key}
      </KeyboardKey>
    ));
  };
  
  const actions = [
    // File commands
    {
      id: 'new-file',
      label: 'New File',
      icon: '📄',
      shortcut: 'Ctrl+N',
      group: 'File',
      onAction: () => console.log('Creating new file'),
    },
    {
      id: 'open-file',
      label: 'Open File',
      icon: '📂',
      shortcut: 'Ctrl+O',
      group: 'File',
      onAction: () => console.log('Opening file'),
    },
    {
      id: 'save-file',
      label: 'Save File',
      icon: '💾',
      shortcut: 'Ctrl+S',
      group: 'File',
      onAction: () => console.log('Saving file'),
    },
    
    // Edit commands
    {
      id: 'undo',
      label: 'Undo',
      icon: '↩️',
      shortcut: 'Ctrl+Z',
      group: 'Edit',
      onAction: () => console.log('Undo'),
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: '↪️',
      shortcut: 'Ctrl+Y',
      group: 'Edit',
      onAction: () => console.log('Redo'),
    },
    {
      id: 'find',
      label: 'Find',
      icon: '🔍',
      shortcut: 'Ctrl+F',
      group: 'Edit',
      onAction: () => console.log('Find'),
    },
    {
      id: 'replace',
      label: 'Replace',
      icon: '🔄',
      shortcut: 'Ctrl+H',
      group: 'Edit',
      onAction: () => console.log('Replace'),
    },
    
    // View commands
    {
      id: 'toggle-sidebar',
      label: 'Toggle Sidebar',
      icon: '◀️',
      shortcut: 'Ctrl+B',
      group: 'View',
      onAction: () => console.log('Toggle sidebar'),
    },
    {
      id: 'toggle-terminal',
      label: 'Toggle Terminal',
      icon: '💻',
      shortcut: 'Ctrl+`',
      group: 'View',
      onAction: () => console.log('Toggle terminal'),
    },
    
    // Go commands
    {
      id: 'go-to-line',
      label: 'Go to Line',
      icon: '↕️',
      shortcut: 'Ctrl+G',
      group: 'Go',
      onAction: () => console.log('Go to line'),
    },
    {
      id: 'go-to-file',
      label: 'Go to File',
      icon: '📋',
      shortcut: 'Ctrl+P',
      group: 'Go',
      onAction: () => console.log('Go to file'),
    },
    
    // Help commands
    {
      id: 'keyboard-shortcuts',
      label: 'Keyboard Shortcuts',
      icon: '⌨️',
      shortcut: 'Ctrl+K Ctrl+S',
      group: 'Help',
      onAction: () => console.log('Keyboard shortcuts'),
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: '📚',
      group: 'Help',
      onAction: () => console.log('Documentation'),
    },
  ];
  
  // Group the actions
  const groups = [...new Set(actions.map(action => action.group))];
  
  // Register global keyboard shortcut to open command palette
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'p' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Command Palette (Ctrl+P)
      </button>
      
      {isOpen && (
        <Container onClick={() => setIsOpen(false)}>
          <CommandPalette
            actions={actions}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            closeOnAction={true}
            enableSearch={true}
            onClick={(e) => e.stopPropagation()}
          >
            <SearchInput placeholder="Type a command or search..." />
            
            <List>
              <Empty>No commands found</Empty>
              
              {groups.map(groupName => (
                <Group key={groupName} name={groupName}>
                  <GroupLabel name={groupName} />
                  
                  {actions
                    .filter(action => action.group === groupName)
                    .map(action => (
                      <Item key={action.id} action={action}>
                        <Icon action={action} />
                        <Label action={action} />
                        <Shortcut action={action}>
                          {formatShortcut(action.shortcut)}
                        </Shortcut>
                      </Item>
                    ))
                  }
                </Group>
              ))}
            </List>
          </CommandPalette>
        </Container>
      )}
    </>
  );
}
```

## Props

### QuickActions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| actions | QuickAction[] | - | Array of quick actions to render |
| isOpen | boolean | - | Whether the quick actions menu is open (controlled) |
| onOpenChange | (isOpen: boolean) => void | - | Callback when the open state changes |
| closeOnAction | boolean | true | Whether to close the menu after an action is triggered |
| enableShortcuts | boolean | true | Whether to enable keyboard shortcuts |
| enableKeyboardNavigation | boolean | true | Whether to enable keyboard navigation |
| enableSearch | boolean | true | Whether to enable search filtering |
| initialSearchQuery | string | '' | Initial search query |
| onActionTriggered | (action: QuickAction) => void | - | Callback when an action is triggered |
| ariaLabel | string | 'Quick actions' | Aria label for the menu |
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.Search

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placeholder | string | 'Search...' | Placeholder text for the search input |
| autoFocus | boolean | true | Whether to auto focus the search input |
| as | React.ElementType | 'input' | The element type to render as |

### QuickActions.List

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| action | QuickAction | - | The quick action data |
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| action | QuickAction | - | The quick action data |
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| action | QuickAction | - | The quick action data |
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.Shortcut

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| action | QuickAction | - | The quick action data |
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.Description

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| action | QuickAction | - | The quick action data |
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.Empty

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.Group

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | - | Group name |
| as | React.ElementType | 'div' | The element type to render as |

### QuickActions.GroupLabel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | - | Group name |
| as | React.ElementType | 'div' | The element type to render as |

### QuickAction Interface

```typescript
interface QuickAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  description?: string;
  group?: string;
  disabled?: boolean;
  onAction: () => void;
  data?: any;
}
```

## Accessibility

The QuickActionsHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="menu"` for the container
- `role="menuitem"` for each action
- `role="searchbox"` for the search input
- `role="group"` for groups
- `aria-selected` to indicate the active action
- `aria-disabled` to indicate disabled actions
- Full keyboard navigation:
  - Arrow keys for navigation
  - Enter to trigger an action
  - Escape to close the menu
  - Home/End to jump to first/last action
