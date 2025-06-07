# Sticky Element

The `StickyElement` component creates elements that stick to a specific position when scrolling. It's perfect for creating sticky headers, footers, sidebars, or any element that needs to remain visible as the user scrolls.

## Features

- **Position Control**: Stick to top or bottom of the viewport or container
- **Offset Support**: Add distance from the sticky position
- **Visual Enhancements**: Add shadows, borders, or background colors when sticky
- **Transition Effects**: Smooth transitions between normal and sticky states
- **Container Boundaries**: Optionally constrain sticky behavior within a container
- **Event Callbacks**: React to sticky state changes
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { StickyElement } from '@pulseui/layout';

function BasicStickyHeader() {
  return (
    <div style={{ height: '200vh' }}>
      <StickyElement 
        stickyOnShadow 
        stickyOnBackground
      >
        <header style={{ padding: '1rem', backgroundColor: 'white' }}>
          <h1>Sticky Header</h1>
          <nav>
            <a href="#" style={{ marginRight: '1rem' }}>Home</a>
            <a href="#" style={{ marginRight: '1rem' }}>About</a>
            <a href="#" style={{ marginRight: '1rem' }}>Services</a>
            <a href="#">Contact</a>
          </nav>
        </header>
      </StickyElement>
      
      <div style={{ padding: '1rem', marginTop: '1rem' }}>
        <h2>Page Content</h2>
        <p>Scroll down to see the header stick to the top.</p>
        {/* Add more content to enable scrolling */}
      </div>
    </div>
  );
}
```

## Examples

### Sticky Header with Visual Changes

```tsx
import { StickyElement } from '@pulseui/layout';
import { useState } from 'react';

function EnhancedStickyHeader() {
  const [isSticky, setIsSticky] = useState(false);
  
  return (
    <div style={{ height: '200vh' }}>
      <StickyElement 
        stickyOnShadow 
        stickyOnBackground
        stickyOnBorder
        onStick={setIsSticky}
      >
        <header style={{ 
          padding: '1rem', 
          backgroundColor: 'white',
          transition: 'padding 0.2s ease'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <h1 style={{ 
              fontSize: isSticky ? '1.5rem' : '2rem',
              margin: 0,
              transition: 'font-size 0.2s ease'
            }}>
              Company Name
            </h1>
            
            <nav>
              <a href="#" style={{ marginRight: '1rem' }}>Home</a>
              <a href="#" style={{ marginRight: '1rem' }}>About</a>
              <a href="#" style={{ marginRight: '1rem' }}>Services</a>
              <a href="#">Contact</a>
            </nav>
          </div>
        </header>
      </StickyElement>
      
      <div style={{ padding: '1rem', marginTop: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Welcome to Our Website</h2>
        <p>Scroll down to see the header stick to the top and change its appearance.</p>
        {/* Add more content to enable scrolling */}
      </div>
    </div>
  );
}
```

### Sticky Footer

```tsx
import { StickyElement } from '@pulseui/layout';

function StickyCookieConsent() {
  return (
    <div style={{ height: '200vh', position: 'relative' }}>
      <div style={{ padding: '1rem' }}>
        <h1>Website Content</h1>
        <p>Scroll down to see the cookie consent banner stick to the bottom.</p>
        {/* Add more content to enable scrolling */}
      </div>
      
      <StickyElement 
        position="bottom" 
        stickyOnShadow 
        stickyOnBackground
        stickyOnBorder
        zIndex={1000}
      >
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f5f5f5', 
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 1rem 0' }}>
            This website uses cookies to ensure you get the best experience on our website.
          </p>
          <div>
            <button 
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#1976d2', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                marginRight: '1rem'
              }}
            >
              Accept All
            </button>
            <button 
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: 'transparent', 
                border: '1px solid #1976d2',
                borderRadius: '4px',
                color: '#1976d2'
              }}
            >
              Customize
            </button>
          </div>
        </div>
      </StickyElement>
    </div>
  );
}
```

### Sticky Sidebar

```tsx
import { StickyElement } from '@pulseui/layout';
import { useRef } from 'react';

function StickySidebar() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div style={{ display: 'flex', minHeight: '200vh' }}>
      <aside style={{ width: '250px', flexShrink: 0 }}>
        <StickyElement 
          offset={20} 
          stickyOnBackground
          containerRef={containerRef}
        >
          <div style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
            <h3>Navigation</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#">Home</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#">About</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#">Services</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#">Portfolio</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#">Blog</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </StickyElement>
      </aside>
      
      <main ref={containerRef} style={{ flex: 1, padding: '1rem' }}>
        <h1>Main Content</h1>
        <p>Scroll down to see the sidebar stick to the top with an offset of 20px.</p>
        {/* Add more content to enable scrolling */}
      </main>
    </div>
  );
}
```

### Table of Contents

```tsx
import { StickyElement } from '@pulseui/layout';

function TableOfContents() {
  return (
    <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', minHeight: '200vh' }}>
      <main style={{ flex: '1 1 70%', padding: '1rem' }}>
        <h1>Long Article Title</h1>
        <p>This is the introduction to a long article with multiple sections...</p>
        
        <section id="section1" style={{ marginTop: '2rem' }}>
          <h2>Section 1</h2>
          <p>Content for section 1...</p>
          {/* More content */}
        </section>
        
        <section id="section2" style={{ marginTop: '2rem' }}>
          <h2>Section 2</h2>
          <p>Content for section 2...</p>
          {/* More content */}
        </section>
        
        <section id="section3" style={{ marginTop: '2rem' }}>
          <h2>Section 3</h2>
          <p>Content for section 3...</p>
          {/* More content */}
        </section>
        
        <section id="section4" style={{ marginTop: '2rem' }}>
          <h2>Section 4</h2>
          <p>Content for section 4...</p>
          {/* More content */}
        </section>
      </main>
      
      <aside style={{ flex: '1 1 30%', maxWidth: '300px' }}>
        <StickyElement offset={20}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9f9f9', 
            border: '1px solid #e0e0e0',
            borderRadius: '4px'
          }}>
            <h3>Table of Contents</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#section1">Section 1</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#section2">Section 2</a>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <a href="#section3">Section 3</a>
              </li>
              <li>
                <a href="#section4">Section 4</a>
              </li>
            </ul>
          </div>
        </StickyElement>
      </aside>
    </div>
  );
}
```

### Product Details with Sticky Add to Cart

```tsx
import { StickyElement } from '@pulseui/layout';

function ProductPage() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '200vh' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <div style={{ flex: '1 1 500px' }}>
          <img 
            src="https://source.unsplash.com/random/600x600?product" 
            alt="Product" 
            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
        
        <div style={{ flex: '1 1 500px' }}>
          <h1>Premium Product</h1>
          <p style={{ color: '#1976d2', fontSize: '1.5rem', fontWeight: 'bold' }}>$99.99</p>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#f57c00' }}>★★★★</span>★ (4.2/5)
          </div>
          
          <p>
            This is a premium product with high-quality materials and excellent craftsmanship.
            It's designed to last and provide the best experience for our customers.
          </p>
          
          <h3>Features</h3>
          <ul>
            <li>High-quality materials</li>
            <li>Durable construction</li>
            <li>Elegant design</li>
            <li>Versatile functionality</li>
          </ul>
          
          <h3>Specifications</h3>
          <ul>
            <li>Dimensions: 10" x 8" x 2"</li>
            <li>Weight: 2.5 lbs</li>
            <li>Color: Midnight Blue</li>
            <li>Material: Premium Aluminum</li>
          </ul>
          
          <StickyElement 
            position="bottom" 
            offset={0} 
            stickyOnShadow 
            stickyOnBackground
            stickyOnBorder
          >
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'white', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e0e0e0'
            }}>
              <div>
                <p style={{ margin: '0', fontWeight: 'bold' }}>$99.99</p>
                <p style={{ margin: '0', color: '#4caf50' }}>In Stock</p>
              </div>
              
              <div>
                <button 
                  style={{ 
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#1976d2', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </StickyElement>
        </div>
      </div>
    </div>
  );
}
```

## API Reference

### StickyElement Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the sticky element |
| `enabled` | `boolean` | `true` | Whether the element should be sticky |
| `position` | `'top' \| 'bottom'` | `'top'` | The position to stick to |
| `offset` | `number \| string` | `0` | The offset from the position |
| `zIndex` | `number` | `100` | The z-index of the sticky element |
| `stickyOnShadow` | `boolean` | `false` | Whether to add a shadow when the element is sticky |
| `shadowColor` | `string` | `'rgba(0, 0, 0, 0.1)'` | The shadow color |
| `stickyOnBorder` | `boolean` | `false` | Whether to add a border when the element is sticky |
| `borderColor` | `string` | `'#e0e0e0'` | The border color |
| `stickyOnBackground` | `boolean` | `false` | Whether to add a background color when the element is sticky |
| `backgroundColor` | `string` | `'#ffffff'` | The background color |
| `transition` | `boolean` | `true` | Whether to add a transition effect |
| `transitionDuration` | `number` | `200` | The transition duration in milliseconds |
| `containerRef` | `React.RefObject<HTMLElement>` | - | The container element to use as the boundary for the sticky behavior |
| `onStick` | `(isSticky: boolean) => void` | - | Callback when the element becomes sticky |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the StickyElement component accepts all standard HTML div attributes.

## Implementation Details

The StickyElement component works by:

1. Creating a placeholder element that maintains the original space in the document flow
2. Monitoring scroll position to determine when to apply sticky positioning
3. Applying fixed positioning with appropriate offsets when the element should be sticky
4. Maintaining the original width of the element when it becomes sticky
5. Adding visual enhancements (shadow, border, background) when sticky

## Accessibility

The StickyElement component maintains accessibility by:

- Preserving the document flow with a placeholder element
- Maintaining the original semantic structure of the content
- Not interfering with keyboard navigation or focus management

## Browser Support

The StickyElement component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
