# Holy Grail Layout

The `HolyGrailLayout` component provides a classic web layout pattern with header, footer, main content, and optional sidebars. This layout is widely used in web applications and is perfect for creating traditional website structures.

## Features

- **Classic Layout Structure**: Header, footer, main content, and optional sidebars
- **Multiple Variants**: Fixed-width, fluid, and responsive options
- **Configurable Sidebars**: Include left and/or right sidebars as needed
- **Sticky Sections**: Make header, footer, or sidebars sticky
- **Responsive Design**: Automatically adapts to different screen sizes
- **Semantic HTML**: Uses appropriate HTML5 elements for each section
- **Flexible Configuration**: Control widths, heights, and spacing
- **Polymorphic Components**: Each section can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { 
  HolyGrailLayout, 
  HolyGrailHeader, 
  HolyGrailLeftSidebar, 
  HolyGrailContent, 
  HolyGrailFooter 
} from '@strive-ui/layout';

function BasicLayout() {
  return (
    <HolyGrailLayout>
      <HolyGrailHeader>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <h1>Website Title</h1>
          <nav>
            <a href="#" style={{ marginRight: '1rem' }}>Home</a>
            <a href="#" style={{ marginRight: '1rem' }}>About</a>
            <a href="#" style={{ marginRight: '1rem' }}>Services</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </HolyGrailHeader>
      
      <HolyGrailLeftSidebar>
        <div style={{ padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h2>Navigation</h2>
          <ul>
            <li>Link 1</li>
            <li>Link 2</li>
            <li>Link 3</li>
            <li>Link 4</li>
          </ul>
        </div>
      </HolyGrailLeftSidebar>
      
      <HolyGrailContent>
        <div style={{ padding: '1rem' }}>
          <h2>Main Content</h2>
          <p>This is the main content area of the layout.</p>
        </div>
      </HolyGrailContent>
      
      <HolyGrailFooter>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <p>© 2023 My Website. All rights reserved.</p>
        </div>
      </HolyGrailFooter>
    </HolyGrailLayout>
  );
}
```

## Examples

### Fixed-Width Layout

```tsx
import { 
  HolyGrailLayout, 
  HolyGrailHeader, 
  HolyGrailLeftSidebar, 
  HolyGrailContent, 
  HolyGrailFooter 
} from '@strive-ui/layout';

function FixedWidthLayout() {
  return (
    <HolyGrailLayout variant="fixed">
      <HolyGrailHeader>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <h1>Fixed-Width Layout</h1>
        </div>
      </HolyGrailHeader>
      
      <HolyGrailLeftSidebar>
        <div style={{ padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h2>Sidebar</h2>
          <ul>
            <li>Link 1</li>
            <li>Link 2</li>
            <li>Link 3</li>
          </ul>
        </div>
      </HolyGrailLeftSidebar>
      
      <HolyGrailContent>
        <div style={{ padding: '1rem' }}>
          <h2>Main Content</h2>
          <p>This layout has a fixed maximum width of 1200px and is centered on the page.</p>
        </div>
      </HolyGrailContent>
      
      <HolyGrailFooter>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <p>© 2023 My Website</p>
        </div>
      </HolyGrailFooter>
    </HolyGrailLayout>
  );
}
```

### Layout with Both Sidebars

```tsx
import { 
  HolyGrailLayout, 
  HolyGrailHeader, 
  HolyGrailLeftSidebar, 
  HolyGrailContent, 
  HolyGrailRightSidebar, 
  HolyGrailFooter 
} from '@strive-ui/layout';

function DualSidebarLayout() {
  return (
    <HolyGrailLayout hasRightSidebar={true}>
      <HolyGrailHeader>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <h1>Dual Sidebar Layout</h1>
        </div>
      </HolyGrailHeader>
      
      <HolyGrailLeftSidebar>
        <div style={{ padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h2>Left Sidebar</h2>
          <ul>
            <li>Navigation 1</li>
            <li>Navigation 2</li>
            <li>Navigation 3</li>
          </ul>
        </div>
      </HolyGrailLeftSidebar>
      
      <HolyGrailContent>
        <div style={{ padding: '1rem' }}>
          <h2>Main Content</h2>
          <p>This layout has both left and right sidebars.</p>
        </div>
      </HolyGrailContent>
      
      <HolyGrailRightSidebar>
        <div style={{ padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h2>Right Sidebar</h2>
          <div>
            <h3>Recent Posts</h3>
            <ul>
              <li>Post 1</li>
              <li>Post 2</li>
              <li>Post 3</li>
            </ul>
          </div>
        </div>
      </HolyGrailRightSidebar>
      
      <HolyGrailFooter>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <p>© 2023 My Website</p>
        </div>
      </HolyGrailFooter>
    </HolyGrailLayout>
  );
}
```

### Sticky Header and Sidebar

```tsx
import { 
  HolyGrailLayout, 
  HolyGrailHeader, 
  HolyGrailLeftSidebar, 
  HolyGrailContent, 
  HolyGrailFooter 
} from '@strive-ui/layout';

function StickyLayout() {
  return (
    <HolyGrailLayout>
      <HolyGrailHeader sticky>
        <div style={{ padding: '1rem', backgroundColor: '#2196f3', color: 'white' }}>
          <h1>Sticky Header</h1>
          <nav>
            <a href="#" style={{ marginRight: '1rem', color: 'white' }}>Home</a>
            <a href="#" style={{ marginRight: '1rem', color: 'white' }}>About</a>
            <a href="#" style={{ marginRight: '1rem', color: 'white' }}>Services</a>
            <a href="#" style={{ color: 'white' }}>Contact</a>
          </nav>
        </div>
      </HolyGrailHeader>
      
      <HolyGrailLeftSidebar sticky>
        <div style={{ padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <h2>Sticky Sidebar</h2>
          <p>This sidebar will stick to the top as you scroll.</p>
          <ul>
            <li>Link 1</li>
            <li>Link 2</li>
            <li>Link 3</li>
            <li>Link 4</li>
            <li>Link 5</li>
          </ul>
        </div>
      </HolyGrailLeftSidebar>
      
      <HolyGrailContent>
        <div style={{ padding: '1rem' }}>
          <h2>Main Content</h2>
          <p>This layout has a sticky header and sidebar.</p>
          
          {/* Add some content to enable scrolling */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <h3>Section {i + 1}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
            </div>
          ))}
        </div>
      </HolyGrailContent>
      
      <HolyGrailFooter>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <p>© 2023 My Website</p>
        </div>
      </HolyGrailFooter>
    </HolyGrailLayout>
  );
}
```

### Blog Layout

```tsx
import { 
  HolyGrailLayout, 
  HolyGrailHeader, 
  HolyGrailLeftSidebar, 
  HolyGrailContent, 
  HolyGrailRightSidebar, 
  HolyGrailFooter 
} from '@strive-ui/layout';

function BlogLayout() {
  return (
    <HolyGrailLayout 
      variant="fixed" 
      hasRightSidebar={true} 
      leftSidebarWidth="200px" 
      rightSidebarWidth="300px"
    >
      <HolyGrailHeader sticky>
        <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ margin: 0 }}>My Blog</h1>
            <nav>
              <a href="#" style={{ marginRight: '1rem' }}>Home</a>
              <a href="#" style={{ marginRight: '1rem' }}>Categories</a>
              <a href="#" style={{ marginRight: '1rem' }}>About</a>
              <a href="#">Contact</a>
            </nav>
          </div>
        </div>
      </HolyGrailHeader>
      
      <HolyGrailLeftSidebar>
        <div style={{ padding: '1rem' }}>
          <h2>Categories</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>Technology</li>
            <li style={{ padding: '0.5rem 0' }}>Design</li>
            <li style={{ padding: '0.5rem 0' }}>Development</li>
            <li style={{ padding: '0.5rem 0' }}>Business</li>
            <li style={{ padding: '0.5rem 0' }}>Lifestyle</li>
          </ul>
          
          <h2>Archives</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>May 2023</li>
            <li style={{ padding: '0.5rem 0' }}>April 2023</li>
            <li style={{ padding: '0.5rem 0' }}>March 2023</li>
            <li style={{ padding: '0.5rem 0' }}>February 2023</li>
            <li style={{ padding: '0.5rem 0' }}>January 2023</li>
          </ul>
        </div>
      </HolyGrailLeftSidebar>
      
      <HolyGrailContent>
        <div style={{ padding: '1rem' }}>
          <article style={{ marginBottom: '2rem' }}>
            <h2>Getting Started with React</h2>
            <div style={{ color: '#666', marginBottom: '1rem' }}>
              Posted on May 15, 2023 by John Doe
            </div>
            <p>
              React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.
            </p>
            <a href="#">Read More →</a>
          </article>
          
          <article style={{ marginBottom: '2rem' }}>
            <h2>CSS Grid vs Flexbox</h2>
            <div style={{ color: '#666', marginBottom: '1rem' }}>
              Posted on May 10, 2023 by Jane Smith
            </div>
            <p>
              CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay content out in rows and columns, and has many features that make building complex layouts straightforward. Flexbox is a one-dimensional layout method for laying out items in rows or columns.
            </p>
            <a href="#">Read More →</a>
          </article>
          
          <article>
            <h2>TypeScript Best Practices</h2>
            <div style={{ color: '#666', marginBottom: '1rem' }}>
              Posted on May 5, 2023 by Bob Johnson
            </div>
            <p>
              TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It offers classes, modules, and interfaces to help you build robust components. In this article, we'll explore some best practices for using TypeScript in your projects.
            </p>
            <a href="#">Read More →</a>
          </article>
        </div>
      </HolyGrailContent>
      
      <HolyGrailRightSidebar sticky>
        <div style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2>About</h2>
            <p>A blog about web development, design, and technology.</p>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2>Recent Posts</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ padding: '0.5rem 0' }}>Getting Started with React</li>
              <li style={{ padding: '0.5rem 0' }}>CSS Grid vs Flexbox</li>
              <li style={{ padding: '0.5rem 0' }}>TypeScript Best Practices</li>
              <li style={{ padding: '0.5rem 0' }}>Introduction to Web Components</li>
              <li style={{ padding: '0.5rem 0' }}>JavaScript Performance Tips</li>
            </ul>
          </div>
          
          <div>
            <h2>Follow Us</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href="#" style={{ display: 'inline-block', padding: '0.5rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>Twitter</a>
              <a href="#" style={{ display: 'inline-block', padding: '0.5rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>Facebook</a>
              <a href="#" style={{ display: 'inline-block', padding: '0.5rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>GitHub</a>
            </div>
          </div>
        </div>
      </HolyGrailRightSidebar>
      
      <HolyGrailFooter>
        <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <p>© 2023 My Blog. All rights reserved.</p>
          <div>
            <a href="#" style={{ marginRight: '1rem' }}>Privacy Policy</a>
            <a href="#" style={{ marginRight: '1rem' }}>Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </HolyGrailFooter>
    </HolyGrailLayout>
  );
}
```

## API Reference

### HolyGrailLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the layout |
| `variant` | `'fixed' \| 'fluid' \| 'responsive'` | `'responsive'` | The variant of the layout |
| `hasLeftSidebar` | `boolean` | `true` | Whether to include the left sidebar |
| `hasRightSidebar` | `boolean` | `false` | Whether to include the right sidebar |
| `leftSidebarWidth` | `string` | `'250px'` | The width of the left sidebar |
| `rightSidebarWidth` | `string` | `'250px'` | The width of the right sidebar |
| `headerHeight` | `string` | `'auto'` | The height of the header |
| `footerHeight` | `string` | `'auto'` | The height of the footer |
| `gap` | `string` | `'1rem'` | The gap between the sections |
| `fullHeight` | `boolean` | `true` | Whether the layout should take up the full height of the viewport |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the HolyGrailLayout component accepts all standard HTML div attributes.

### HolyGrailHeader Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the header |
| `sticky` | `boolean` | `false` | Whether the header is sticky |
| `as` | `React.ElementType` | `'header'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the HolyGrailHeader component accepts all standard HTML header attributes.

### HolyGrailLeftSidebar Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the left sidebar |
| `sticky` | `boolean` | `false` | Whether the sidebar is sticky |
| `as` | `React.ElementType` | `'aside'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the HolyGrailLeftSidebar component accepts all standard HTML aside attributes.

### HolyGrailContent Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the main content area |
| `as` | `React.ElementType` | `'main'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the HolyGrailContent component accepts all standard HTML main attributes.

### HolyGrailRightSidebar Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the right sidebar |
| `sticky` | `boolean` | `false` | Whether the sidebar is sticky |
| `as` | `React.ElementType` | `'aside'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the HolyGrailRightSidebar component accepts all standard HTML aside attributes.

### HolyGrailFooter Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the footer |
| `sticky` | `boolean` | `false` | Whether the footer is sticky |
| `as` | `React.ElementType` | `'footer'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the HolyGrailFooter component accepts all standard HTML footer attributes.

## Layout Variants

### Fixed

The fixed variant has a maximum width (default: 1200px) and is centered on the page. This is useful for creating traditional websites with a consistent width across different screen sizes.

### Fluid

The fluid variant takes up the full width of the viewport. This is useful for creating applications that need to use all available space.

### Responsive

The responsive variant adapts to different screen sizes:
- On small screens (< 768px), the layout stacks vertically: header, left sidebar, content, right sidebar, footer.
- On larger screens (≥ 768px), the layout uses a traditional holy grail pattern with sidebars next to the content.

## Accessibility

The HolyGrailLayout component includes several accessibility considerations:

- Semantic HTML structure with appropriate elements (header, main, aside, footer)
- Proper heading hierarchy
- Keyboard navigation support

## Browser Support

The HolyGrailLayout component is compatible with all modern browsers that support CSS Grid:

- Chrome 57+ (March 2017)
- Firefox 52+ (March 2017)
- Safari 10.1+ (March 2017)
- Edge 16+ (October 2017)

For older browsers, consider providing a fallback layout or using a CSS Grid polyfill.

## License

MIT
