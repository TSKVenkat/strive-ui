# Accordion Component

The Accordion component is a collapsible content container that allows users to expand and collapse sections of content, helping to organize and present information in a compact, navigable format.

## Import

```jsx
import { Accordion } from 'pulseui';
```

## Features

- Single or multiple expansion modes
- Customizable styling options
- Animated transitions
- Keyboard accessible
- Screen reader friendly
- Custom icons support
- Controlled and uncontrolled usage

## Usage

```jsx
import { Accordion } from 'pulseui';

// Basic usage with single item
<Accordion title="Section Title">
  This is the content of the accordion section.
</Accordion>

// Multiple items with default expanded
<Accordion.Group>
  <Accordion title="Section 1" defaultExpanded>
    Content for section 1
  </Accordion>
  <Accordion title="Section 2">
    Content for section 2
  </Accordion>
  <Accordion title="Section 3">
    Content for section 3
  </Accordion>
</Accordion.Group>

// Allow multiple sections to be expanded simultaneously
<Accordion.Group allowMultiple>
  <Accordion title="Section 1">
    Content for section 1
  </Accordion>
  <Accordion title="Section 2">
    Content for section 2
  </Accordion>
</Accordion.Group>

// With custom icon
<Accordion 
  title="Custom Icon Example"
  expandIcon={<CustomIcon />}
  collapseIcon={<CustomCollapseIcon />}
>
  Content with custom expand/collapse icons
</Accordion>
```

## Props

### Accordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | ReactNode | - | The title displayed in the accordion header |
| `children` | ReactNode | - | The content displayed when the accordion is expanded |
| `defaultExpanded` | boolean | false | Whether the accordion is expanded by default |
| `expanded` | boolean | - | Controls the expanded state (controlled component) |
| `onChange` | (expanded: boolean) => void | - | Callback fired when the expanded state changes |
| `disabled` | boolean | false | If true, the accordion will be disabled |
| `expandIcon` | ReactNode | - | Custom icon for the expanded state |
| `collapseIcon` | ReactNode | - | Custom icon for the collapsed state |
| `iconPosition` | 'start' \| 'end' | 'end' | Position of the expand/collapse icon |
| `variant` | 'default' \| 'outlined' \| 'filled' | 'default' | Visual variant of the accordion |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size of the accordion |

### Accordion.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Accordion components to be rendered in the group |
| `allowMultiple` | boolean | false | If true, multiple accordions can be expanded simultaneously |
| `defaultExpandedItems` | string[] | [] | Array of accordion IDs that should be expanded by default |
| `expandedItems` | string[] | - | Controls which accordions are expanded (controlled component) |
| `onChange` | (expandedItems: string[]) => void | - | Callback fired when the expanded items change |
| `variant` | 'default' \| 'outlined' \| 'filled' | 'default' | Visual variant applied to all accordions in the group |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size applied to all accordions in the group |

## Accessibility

The Accordion component follows WAI-ARIA guidelines:
- Uses `aria-expanded` to indicate the expanded/collapsed state
- Implements keyboard navigation (Tab to focus, Enter/Space to toggle)
- Associates headers with their content using `aria-controls`
- Provides appropriate ARIA roles for screen readers
- Supports focus management for keyboard users
