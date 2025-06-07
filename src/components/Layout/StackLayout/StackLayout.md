# Stack Layout

The `StackLayout` component provides a simple way to stack elements vertically or horizontally with consistent spacing. It's perfect for creating forms, lists, navigation menus, and other UI elements that require consistent spacing between items.

## Features

- **Vertical or Horizontal Stacking**: Stack elements in either direction
- **Consistent Spacing**: Apply uniform spacing between elements
- **Optional Dividers**: Add dividers between stack items
- **Flexible Alignment**: Control alignment along both axes
- **Responsive Control**: Options for wrapping, growing, and shrinking
- **Order Control**: Change the visual order of stack items
- **Reverse Direction**: Reverse the order of elements
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

### Vertical Stack (Default)

```tsx
import { StackLayout } from '@pulseui/layout';

function VerticalStack() {
  return (
    <StackLayout spacing="md">
      <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 1</div>
      <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 2</div>
      <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 3</div>
    </StackLayout>
  );
}
```

### Horizontal Stack

```tsx
import { StackLayout } from '@pulseui/layout';

function HorizontalStack() {
  return (
    <StackLayout direction="horizontal" spacing="md">
      <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 1</div>
      <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 2</div>
      <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 3</div>
    </StackLayout>
  );
}
```

## Examples

### Stack with Dividers

```tsx
import { StackLayout } from '@pulseui/layout';

function StackWithDividers() {
  return (
    <StackLayout spacing="lg" dividers dividerColor="#e0e0e0">
      <div style={{ padding: '1rem', background: '#f5f5f5' }}>
        <h3>Section 1</h3>
        <p>This is the content for section 1.</p>
      </div>
      <div style={{ padding: '1rem', background: '#f5f5f5' }}>
        <h3>Section 2</h3>
        <p>This is the content for section 2.</p>
      </div>
      <div style={{ padding: '1rem', background: '#f5f5f5' }}>
        <h3>Section 3</h3>
        <p>This is the content for section 3.</p>
      </div>
    </StackLayout>
  );
}
```

### Form Layout

```tsx
import { StackLayout, StackItem } from '@pulseui/layout';

function FormLayout() {
  return (
    <StackLayout spacing="md" style={{ maxWidth: '500px' }}>
      <h2>Contact Form</h2>
      
      <StackLayout spacing="xs">
        <label htmlFor="name">Name</label>
        <input 
          id="name" 
          type="text" 
          style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }} 
        />
      </StackLayout>
      
      <StackLayout spacing="xs">
        <label htmlFor="email">Email</label>
        <input 
          id="email" 
          type="email" 
          style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }} 
        />
      </StackLayout>
      
      <StackLayout spacing="xs">
        <label htmlFor="message">Message</label>
        <textarea 
          id="message" 
          rows={4} 
          style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }} 
        />
      </StackLayout>
      
      <StackLayout direction="horizontal" justify="end" spacing="sm">
        <button style={{ padding: '0.5rem 1rem' }}>Cancel</button>
        <button style={{ padding: '0.5rem 1rem', background: '#1976d2', color: 'white', border: 'none' }}>Submit</button>
      </StackLayout>
    </StackLayout>
  );
}
```

### Card with Header, Content, and Footer

```tsx
import { StackLayout } from '@pulseui/layout';

function CardLayout() {
  return (
    <StackLayout 
      spacing="none" 
      style={{ 
        maxWidth: '350px', 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0', background: '#f5f5f5' }}>
        <h3 style={{ margin: 0 }}>Card Title</h3>
      </div>
      
      <div style={{ padding: '1rem' }}>
        <p>This is the main content area of the card. You can put any content here.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.</p>
      </div>
      
      <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0', background: '#f5f5f5' }}>
        <StackLayout direction="horizontal" justify="end" spacing="sm">
          <button style={{ padding: '0.5rem 1rem' }}>Cancel</button>
          <button style={{ padding: '0.5rem 1rem', background: '#1976d2', color: 'white', border: 'none' }}>OK</button>
        </StackLayout>
      </div>
    </StackLayout>
  );
}
```

### Navigation Menu

```tsx
import { StackLayout } from '@pulseui/layout';

function NavigationMenu() {
  return (
    <StackLayout 
      spacing="none" 
      style={{ 
        width: '250px', 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0', background: '#f5f5f5' }}>
        <h3 style={{ margin: 0 }}>Navigation</h3>
      </div>
      
      <StackLayout spacing="none">
        <a 
          href="#" 
          style={{ 
            padding: '0.75rem 1rem', 
            borderBottom: '1px solid #e0e0e0',
            textDecoration: 'none',
            color: '#333',
            display: 'block'
          }}
        >
          Dashboard
        </a>
        <a 
          href="#" 
          style={{ 
            padding: '0.75rem 1rem', 
            borderBottom: '1px solid #e0e0e0',
            textDecoration: 'none',
            color: '#333',
            display: 'block',
            background: '#e3f2fd'
          }}
        >
          Profile
        </a>
        <a 
          href="#" 
          style={{ 
            padding: '0.75rem 1rem', 
            borderBottom: '1px solid #e0e0e0',
            textDecoration: 'none',
            color: '#333',
            display: 'block'
          }}
        >
          Settings
        </a>
        <a 
          href="#" 
          style={{ 
            padding: '0.75rem 1rem', 
            textDecoration: 'none',
            color: '#333',
            display: 'block'
          }}
        >
          Logout
        </a>
      </StackLayout>
    </StackLayout>
  );
}
```

### Complex Layout with StackItems

```tsx
import { StackLayout, StackItem } from '@pulseui/layout';

function ComplexStackLayout() {
  return (
    <StackLayout 
      direction="horizontal" 
      spacing="md" 
      align="stretch" 
      style={{ height: '400px', border: '1px solid #e0e0e0', padding: '1rem' }}
    >
      <StackItem basis="250px" shrink={false}>
        <div style={{ 
          background: '#f5f5f5', 
          height: '100%', 
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <h3>Sidebar</h3>
          <p>This sidebar has a fixed width of 250px and doesn't shrink.</p>
        </div>
      </StackItem>
      
      <StackItem grow>
        <StackLayout spacing="md" style={{ height: '100%' }}>
          <div style={{ 
            background: '#e3f2fd', 
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <h3>Main Content Header</h3>
            <p>This section takes up 30% of the remaining height.</p>
          </div>
          
          <StackItem grow>
            <div style={{ 
              background: '#bbdefb', 
              height: '100%',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto'
            }}>
              <h3>Main Content</h3>
              <p>This section grows to fill the remaining space.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
            </div>
          </StackItem>
        </StackLayout>
      </StackItem>
      
      <StackItem basis="200px" shrink={false}>
        <div style={{ 
          background: '#f5f5f5', 
          height: '100%', 
          padding: '1rem',
          borderRadius: '8px'
        }}>
          <h3>Right Sidebar</h3>
          <p>This sidebar has a fixed width of 200px and doesn't shrink.</p>
        </div>
      </StackItem>
    </StackLayout>
  );
}
```

### Responsive Stack

```tsx
import { StackLayout } from '@pulseui/layout';
import { useState, useEffect } from 'react';

function ResponsiveStack() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <StackLayout 
      direction={isMobile ? 'vertical' : 'horizontal'} 
      spacing="md"
      wrap={isMobile ? 'nowrap' : 'wrap'}
      align={isMobile ? 'stretch' : 'center'}
    >
      <div style={{ 
        padding: '1rem', 
        background: '#e3f2fd', 
        minWidth: '200px',
        flex: isMobile ? '1 0 auto' : '1 0 30%'
      }}>
        <h3>Item 1</h3>
        <p>This item adapts to mobile layout.</p>
      </div>
      
      <div style={{ 
        padding: '1rem', 
        background: '#bbdefb', 
        minWidth: '200px',
        flex: isMobile ? '1 0 auto' : '1 0 30%'
      }}>
        <h3>Item 2</h3>
        <p>This item adapts to mobile layout.</p>
      </div>
      
      <div style={{ 
        padding: '1rem', 
        background: '#90caf9', 
        minWidth: '200px',
        flex: isMobile ? '1 0 auto' : '1 0 30%'
      }}>
        <h3>Item 3</h3>
        <p>This item adapts to mobile layout.</p>
      </div>
    </StackLayout>
  );
}
```

## API Reference

### StackLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the stack |
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | The direction of the stack |
| `spacing` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | The spacing between stack items |
| `dividers` | `boolean` | `false` | Whether to add dividers between stack items |
| `dividerColor` | `string` | `'#e0e0e0'` | The color of the dividers |
| `align` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | The alignment of stack items along the cross axis |
| `justify` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | The justification of stack items along the main axis |
| `wrap` | `'nowrap' \| 'wrap' \| 'wrap-reverse'` | `'nowrap'` | Whether to wrap stack items |
| `fullWidth` | `boolean` | `false` | Whether the stack should take up the full width |
| `fullHeight` | `boolean` | `false` | Whether the stack should take up the full height |
| `reverse` | `boolean` | `false` | Whether to reverse the order of stack items |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the StackLayout component accepts all standard HTML div attributes.

### StackItem Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the stack item |
| `grow` | `boolean` | `false` | Whether the item should grow to fill available space |
| `shrink` | `boolean` | `true` | Whether the item should shrink if needed |
| `basis` | `string` | `'auto'` | The basis (initial size) of the item |
| `order` | `number` | - | The order of the item |
| `align` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | The alignment of the item |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the StackItem component accepts all standard HTML div attributes.

## Spacing Reference

| Size | Value |
|------|-------|
| `none` | 0 |
| `xs` | 0.25rem (4px) |
| `sm` | 0.5rem (8px) |
| `md` | 1rem (16px) |
| `lg` | 1.5rem (24px) |
| `xl` | 2rem (32px) |

## Accessibility

The StackLayout component includes several accessibility considerations:

- Semantic HTML structure
- Proper spacing for readability
- Flexible alignment options for better visual hierarchy

## Browser Support

The StackLayout component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
