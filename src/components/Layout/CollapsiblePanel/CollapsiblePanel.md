# Collapsible Panel

The `CollapsiblePanel` component provides an expandable and collapsible content section with a persistent header. It's perfect for creating accordions, FAQs, settings panels, and other UI elements that need to show or hide content.

## Features

- **Expandable Content**: Toggle content visibility with smooth animations
- **Persistent Header**: Always visible header with customizable content
- **Multiple Animation Types**: Slide, fade, or both animation options
- **Vertical or Horizontal**: Collapse in either direction
- **Controlled & Uncontrolled**: Use as controlled or uncontrolled component
- **Customizable Icons**: Change the expand/collapse icons
- **Grouping Support**: Group panels with single or multiple expansion
- **Styling Options**: Border, shadow, and rounded corners
- **Accessibility**: Keyboard navigation and ARIA attributes
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { CollapsiblePanel } from '@strive-ui/layout';

function BasicCollapsiblePanel() {
  return (
    <CollapsiblePanel 
      header="Click to expand"
      bordered
      rounded
    >
      <p>This is the collapsible content that can be shown or hidden.</p>
      <p>You can put any content here, including other components.</p>
    </CollapsiblePanel>
  );
}
```

## Examples

### Accordion Group

```tsx
import { CollapsiblePanel, CollapsibleGroup } from '@strive-ui/layout';

function AccordionExample() {
  return (
    <CollapsibleGroup defaultExpandedIndex={0}>
      <CollapsiblePanel 
        header="Section 1"
        bordered
        shadowed
        rounded
      >
        <p>Content for section 1.</p>
        <p>This section is expanded by default.</p>
      </CollapsiblePanel>
      
      <CollapsiblePanel 
        header="Section 2"
        bordered
        shadowed
        rounded
      >
        <p>Content for section 2.</p>
      </CollapsiblePanel>
      
      <CollapsiblePanel 
        header="Section 3"
        bordered
        shadowed
        rounded
      >
        <p>Content for section 3.</p>
      </CollapsiblePanel>
    </CollapsibleGroup>
  );
}
```

### FAQ Section

```tsx
import { CollapsiblePanel, CollapsibleGroup } from '@strive-ui/layout';

function FAQExample() {
  return (
    <div style={{ maxWidth: '600px' }}>
      <h2>Frequently Asked Questions</h2>
      
      <CollapsibleGroup allowMultiple>
        <CollapsiblePanel 
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>What is Strive UI?</h3>}
          bordered
          rounded
          animation="both"
        >
          <p>Strive UI is a React component library that provides a set of accessible, customizable, and reusable components for building modern user interfaces.</p>
        </CollapsiblePanel>
        
        <CollapsiblePanel 
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>How do I install Strive UI?</h3>}
          bordered
          rounded
          animation="both"
        >
          <p>You can install Strive UI using npm or yarn:</p>
          <pre>npm install @strive-ui/core</pre>
          <p>or</p>
          <pre>yarn add @strive-ui/core</pre>
        </CollapsiblePanel>
        
        <CollapsiblePanel 
          header={<h3 style={{ margin: 0, fontSize: '1rem' }}>Is Strive UI accessible?</h3>}
          bordered
          rounded
          animation="both"
        >
          <p>Yes, Strive UI is designed with accessibility in mind. All components follow WAI-ARIA guidelines and are tested with screen readers.</p>
        </CollapsiblePanel>
      </CollapsibleGroup>
    </div>
  );
}
```

### Settings Panel

```tsx
import { CollapsiblePanel } from '@strive-ui/layout';
import { useState } from 'react';

function SettingsPanelExample() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  
  return (
    <div style={{ maxWidth: '500px' }}>
      <CollapsiblePanel 
        header={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>🔔</span>
            <span>Notification Settings</span>
          </div>
        }
        defaultExpanded
        bordered
        shadowed
        rounded
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label htmlFor="notifications">Enable notifications</label>
          <input 
            id="notifications" 
            type="checkbox" 
            checked={notifications} 
            onChange={(e) => setNotifications(e.target.checked)} 
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ marginTop: 0 }}>Notification types:</p>
          <div style={{ marginLeft: '1rem' }}>
            <div>
              <input type="checkbox" id="email-notif" disabled={!notifications} />
              <label htmlFor="email-notif">Email notifications</label>
            </div>
            <div>
              <input type="checkbox" id="push-notif" disabled={!notifications} />
              <label htmlFor="push-notif">Push notifications</label>
            </div>
          </div>
        </div>
      </CollapsiblePanel>
      
      <CollapsiblePanel 
        header={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>🎨</span>
            <span>Appearance Settings</span>
          </div>
        }
        bordered
        shadowed
        rounded
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <label htmlFor="dark-mode">Dark mode</label>
          <input 
            id="dark-mode" 
            type="checkbox" 
            checked={darkMode} 
            onChange={(e) => setDarkMode(e.target.checked)} 
          />
        </div>
        
        <div>
          <label htmlFor="font-size">Font size:</label>
          <select 
            id="font-size" 
            value={fontSize} 
            onChange={(e) => setFontSize(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </CollapsiblePanel>
    </div>
  );
}
```

### Horizontal Collapsible Panel

```tsx
import { CollapsiblePanel } from '@strive-ui/layout';

function HorizontalPanelExample() {
  return (
    <div style={{ height: '300px', display: 'flex' }}>
      <div style={{ width: '200px', backgroundColor: '#f5f5f5', padding: '1rem' }}>
        <h3>Main Content</h3>
        <p>This is the main content area that's always visible.</p>
      </div>
      
      <CollapsiblePanel 
        header={
          <div style={{ 
            transform: 'rotate(-90deg)', 
            whiteSpace: 'nowrap',
            marginLeft: '-2rem'
          }}>
            Details Panel
          </div>
        }
        direction="horizontal"
        bordered
        style={{ height: '100%' }}
      >
        <div style={{ width: '250px' }}>
          <h3>Details</h3>
          <p>This panel can be expanded or collapsed horizontally.</p>
          <p>It's useful for side panels, details views, or property panels.</p>
        </div>
      </CollapsiblePanel>
    </div>
  );
}
```

### Custom Animation and Icons

```tsx
import { CollapsiblePanel } from '@strive-ui/layout';

function CustomAnimationExample() {
  return (
    <CollapsiblePanel 
      header="Custom Animation and Icons"
      animation="both"
      animationDuration={500}
      expandedIcon={
        <span style={{ fontSize: '1.5rem' }}>-</span>
      }
      collapsedIcon={
        <span style={{ fontSize: '1.5rem' }}>+</span>
      }
      bordered
      rounded
    >
      <p>This panel uses a custom animation with both slide and fade effects.</p>
      <p>It also uses custom icons for the expanded and collapsed states.</p>
    </CollapsiblePanel>
  );
}
```

### Controlled Component

```tsx
import { CollapsiblePanel } from '@strive-ui/layout';
import { useState } from 'react';

function ControlledPanelExample() {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div>
      <button 
        onClick={() => setExpanded(!expanded)}
        style={{ marginBottom: '1rem' }}
      >
        {expanded ? 'Collapse' : 'Expand'} Panel
      </button>
      
      <CollapsiblePanel 
        header="Controlled Panel"
        expanded={expanded}
        onToggle={(newExpanded) => setExpanded(newExpanded)}
        bordered
        shadowed
        rounded
      >
        <p>This is a controlled panel that can be expanded or collapsed using the button above.</p>
      </CollapsiblePanel>
    </div>
  );
}
```

## API Reference

### CollapsiblePanel Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the collapsible panel |
| `header` | `React.ReactNode` | - | The header content that will always be visible |
| `expanded` | `boolean` | - | Whether the panel is expanded (controlled mode) |
| `defaultExpanded` | `boolean` | `false` | The default expanded state (uncontrolled mode) |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | The direction of the collapse |
| `animation` | `'slide' \| 'fade' \| 'both' \| 'none'` | `'slide'` | The animation type |
| `animationDuration` | `number` | `300` | The duration of the animation in milliseconds |
| `disabled` | `boolean` | `false` | Whether to disable the panel |
| `bordered` | `boolean` | `false` | Whether to show a border around the panel |
| `borderColor` | `string` | `'#e0e0e0'` | The border color |
| `shadowed` | `boolean` | `false` | Whether to add a shadow to the panel |
| `rounded` | `boolean \| string` | `false` | Whether to add rounded corners to the panel |
| `showIcon` | `boolean` | `true` | Whether to show an icon in the header |
| `expandedIcon` | `React.ReactNode` | - | Custom icon for the expanded state |
| `collapsedIcon` | `React.ReactNode` | - | Custom icon for the collapsed state |
| `onToggle` | `(expanded: boolean) => void` | - | Callback when the panel is expanded or collapsed |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the CollapsiblePanel component accepts all standard HTML div attributes.

### CollapsibleGroup Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The collapsible panels to render |
| `allowMultiple` | `boolean` | `false` | Whether to allow multiple panels to be expanded at once |
| `defaultExpandedIndex` | `number` | `-1` | The index of the panel that should be expanded by default |
| `defaultExpandedIndexes` | `number[]` | `[]` | The indexes of the panels that should be expanded by default (when allowMultiple is true) |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the CollapsibleGroup component accepts all standard HTML div attributes.

## Accessibility

The CollapsiblePanel component includes several accessibility features:

- Keyboard navigation (Enter and Space keys to toggle)
- ARIA attributes (`aria-expanded`)
- Focus management
- Screen reader support

## Browser Support

The CollapsiblePanel component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
