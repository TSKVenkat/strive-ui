# Tabs Component

The Tabs component provides a way to organize content into separate views that can be accessed by selecting the corresponding tab.

## Import

```jsx
import { Tabs } from 'strive-ui';
```

## Usage

```jsx
<Tabs defaultTab="tab1">
  <Tabs.List>
    <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
    <Tabs.Tab id="tab3">Tab 3</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panels>
    <Tabs.Panel id="tab1">Content for Tab 1</Tabs.Panel>
    <Tabs.Panel id="tab2">Content for Tab 2</Tabs.Panel>
    <Tabs.Panel id="tab3">Content for Tab 3</Tabs.Panel>
  </Tabs.Panels>
</Tabs>
```

## Props

### Tabs Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultTab` | `string` | - | The ID of the initially active tab |
| `activeTab` | `string` | - | The ID of the controlled active tab |
| `onChange` | `(tabId: string) => void` | - | Callback when active tab changes |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the tabs |
| `variant` | `'default' \| 'contained' \| 'pills'` | `'default'` | The visual variant of the tabs |
| `fullWidth` | `boolean` | `false` | Whether the tabs should take up the full width |
| `centered` | `boolean` | `false` | Whether the tabs should be centered |

### Tabs.List Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS class name |

### Tabs.Tab Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | The ID of the tab (must be unique) |
| `disabled` | `boolean` | `false` | Whether the tab is disabled |
| `className` | `string` | - | Additional CSS class name |
| `icon` | `React.ReactNode` | - | Icon to display before the tab label |

### Tabs.Panels Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS class name |

### Tabs.Panel Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | - | The ID of the tab panel (must match a tab ID) |
| `className` | `string` | - | Additional CSS class name |

## Variants

The Tabs component supports three visual variants:

1. **Default**: Standard tabs with an underline indicator
2. **Contained**: Tabs with a contained background and elevated active tab
3. **Pills**: Tabs with pill-shaped buttons

```jsx
// Default variant
<Tabs variant="default">...</Tabs>

// Contained variant
<Tabs variant="contained">...</Tabs>

// Pills variant
<Tabs variant="pills">...</Tabs>
```

## Orientation

Tabs can be displayed horizontally or vertically:

```jsx
// Horizontal orientation (default)
<Tabs orientation="horizontal">...</Tabs>

// Vertical orientation
<Tabs orientation="vertical">...</Tabs>
```

## Controlled vs Uncontrolled

The Tabs component can be used in both controlled and uncontrolled modes:

### Uncontrolled (with defaultTab)

```jsx
<Tabs defaultTab="tab1">...</Tabs>
```

### Controlled (with activeTab and onChange)

```jsx
const [activeTab, setActiveTab] = useState('tab1');

<Tabs 
  activeTab={activeTab} 
  onChange={(tabId) => setActiveTab(tabId)}
>
  ...
</Tabs>
```

## Accessibility

- The Tabs component follows WAI-ARIA guidelines for tab interfaces
- Proper ARIA roles and attributes are applied (tablist, tab, tabpanel)
- Keyboard navigation is supported (Tab, Arrow keys)
- Focus management is handled appropriately
