# Dashboard Layout

The `DashboardLayout` component and its related subcomponents provide a flexible way to create dashboard interfaces for admin panels, analytics dashboards, and data visualization applications. They leverage CSS Grid to create complex layouts with header, sidebar, content, and footer sections.

## Features

- **CSS Grid Implementation**: Leverages the power of CSS Grid for advanced layouts
- **Named Areas**: Support for named grid areas for semantic layouts
- **Flexible Configuration**: Control columns, rows, and spacing
- **Specialized Components**: Header, Sidebar, Content, and Footer components
- **Responsive Design**: Create layouts that adapt to different screen sizes
- **Customizable Styling**: Control colors, borders, shadows, and more
- **Sticky Positioning**: Optional sticky headers, sidebars, and footers
- **Collapsible Sidebar**: Support for collapsed and expanded sidebar states
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { 
  DashboardLayout, 
  DashboardHeader, 
  DashboardSidebar, 
  DashboardContent, 
  DashboardFooter 
} from '@pulseui/layout';

function BasicDashboard() {
  return (
    <DashboardLayout
      areas={`
        "header header"
        "sidebar content"
        "footer footer"
      `}
      columns="250px 1fr"
      rows="auto 1fr auto"
      style={{ height: '100vh' }}
    >
      <DashboardHeader title="Admin Dashboard" />
      
      <DashboardSidebar>
        {/* Navigation links go here */}
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>Dashboard</li>
            <li style={{ padding: '0.5rem 0' }}>Users</li>
            <li style={{ padding: '0.5rem 0' }}>Products</li>
            <li style={{ padding: '0.5rem 0' }}>Analytics</li>
            <li style={{ padding: '0.5rem 0' }}>Settings</li>
          </ul>
        </nav>
      </DashboardSidebar>
      
      <DashboardContent>
        <h2>Welcome to the Dashboard</h2>
        <p>This is the main content area of your dashboard.</p>
      </DashboardContent>
      
      <DashboardFooter copyright="© 2023 My Company" />
    </DashboardLayout>
  );
}
```

## Examples

### Collapsible Sidebar

```tsx
import { 
  DashboardLayout, 
  DashboardHeader, 
  DashboardSidebar, 
  DashboardContent, 
  DashboardFooter 
} from '@pulseui/layout';
import { useState } from 'react';

function CollapsibleSidebarDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <DashboardLayout
      areas={`
        "header header"
        "sidebar content"
        "footer footer"
      `}
      columns={`${collapsed ? '64px' : '250px'} 1fr`}
      rows="auto 1fr auto"
      style={{ height: '100vh' }}
    >
      <DashboardHeader 
        title="Admin Dashboard" 
        actions={
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? 'Expand' : 'Collapse'} Sidebar
          </button>
        }
      />
      
      <DashboardSidebar collapsed={collapsed}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0', whiteSpace: 'nowrap' }}>
              <span style={{ marginRight: '0.5rem' }}>📊</span>
              {!collapsed && 'Dashboard'}
            </li>
            <li style={{ padding: '0.5rem 0', whiteSpace: 'nowrap' }}>
              <span style={{ marginRight: '0.5rem' }}>👥</span>
              {!collapsed && 'Users'}
            </li>
            <li style={{ padding: '0.5rem 0', whiteSpace: 'nowrap' }}>
              <span style={{ marginRight: '0.5rem' }}>🛒</span>
              {!collapsed && 'Products'}
            </li>
            <li style={{ padding: '0.5rem 0', whiteSpace: 'nowrap' }}>
              <span style={{ marginRight: '0.5rem' }}>📈</span>
              {!collapsed && 'Analytics'}
            </li>
            <li style={{ padding: '0.5rem 0', whiteSpace: 'nowrap' }}>
              <span style={{ marginRight: '0.5rem' }}>⚙️</span>
              {!collapsed && 'Settings'}
            </li>
          </ul>
        </nav>
      </DashboardSidebar>
      
      <DashboardContent>
        <h2>Welcome to the Dashboard</h2>
        <p>This is the main content area of your dashboard.</p>
      </DashboardContent>
      
      <DashboardFooter copyright="© 2023 My Company" />
    </DashboardLayout>
  );
}
```

### Dashboard with Cards

```tsx
import { 
  DashboardLayout, 
  DashboardHeader, 
  DashboardSidebar, 
  DashboardContent, 
  DashboardFooter,
  DashboardItem
} from '@pulseui/layout';

function DashboardWithCards() {
  return (
    <DashboardLayout
      areas={`
        "header header header"
        "sidebar content content"
        "footer footer footer"
      `}
      columns="250px 1fr 1fr"
      rows="auto 1fr auto"
      style={{ height: '100vh' }}
    >
      <DashboardHeader title="Analytics Dashboard" />
      
      <DashboardSidebar>
        {/* Navigation links go here */}
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>Dashboard</li>
            <li style={{ padding: '0.5rem 0' }}>Reports</li>
            <li style={{ padding: '0.5rem 0' }}>Users</li>
            <li style={{ padding: '0.5rem 0' }}>Settings</li>
          </ul>
        </nav>
      </DashboardSidebar>
      
      <DashboardContent>
        <h2>Analytics Overview</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <DashboardItem bordered shadowed rounded>
            <h3>Total Users</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>12,345</p>
            <p style={{ color: 'green' }}>↑ 12% from last month</p>
          </DashboardItem>
          
          <DashboardItem bordered shadowed rounded>
            <h3>Revenue</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>$45,678</p>
            <p style={{ color: 'green' }}>↑ 8% from last month</p>
          </DashboardItem>
          
          <DashboardItem bordered shadowed rounded>
            <h3>Active Sessions</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>1,234</p>
            <p style={{ color: 'red' }}>↓ 3% from last month</p>
          </DashboardItem>
          
          <DashboardItem bordered shadowed rounded>
            <h3>Conversion Rate</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>3.45%</p>
            <p style={{ color: 'green' }}>↑ 0.5% from last month</p>
          </DashboardItem>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
          <DashboardItem bordered shadowed rounded>
            <h3>Sales Over Time</h3>
            <div style={{ height: '300px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Chart Placeholder
            </div>
          </DashboardItem>
          
          <DashboardItem bordered shadowed rounded>
            <h3>Top Products</h3>
            <ul>
              <li>Product A - $12,345</li>
              <li>Product B - $8,765</li>
              <li>Product C - $6,543</li>
              <li>Product D - $4,321</li>
              <li>Product E - $2,109</li>
            </ul>
          </DashboardItem>
        </div>
      </DashboardContent>
      
      <DashboardFooter copyright="© 2023 Analytics Inc." />
    </DashboardLayout>
  );
}
```

### Complex Dashboard Layout

```tsx
import { 
  DashboardLayout, 
  DashboardHeader, 
  DashboardSidebar, 
  DashboardContent, 
  DashboardFooter,
  DashboardItem
} from '@pulseui/layout';

function ComplexDashboard() {
  return (
    <DashboardLayout
      areas={`
        "header header header header"
        "sidebar content-main content-main content-side"
        "sidebar content-bottom content-bottom content-bottom"
        "footer footer footer footer"
      `}
      columns="250px 1fr 1fr 300px"
      rows="auto 1fr auto auto"
      gap="md"
      style={{ height: '100vh' }}
    >
      <DashboardHeader 
        title="Enterprise Dashboard" 
        logo={<div style={{ width: '32px', height: '32px', background: '#1976d2', borderRadius: '4px' }}></div>}
        userInfo={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>John Doe</span>
            <div style={{ width: '32px', height: '32px', background: '#e0e0e0', borderRadius: '50%' }}></div>
          </div>
        }
      />
      
      <DashboardSidebar>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>Dashboard</li>
            <li style={{ padding: '0.5rem 0' }}>Analytics</li>
            <li style={{ padding: '0.5rem 0' }}>Reports</li>
            <li style={{ padding: '0.5rem 0' }}>Users</li>
            <li style={{ padding: '0.5rem 0' }}>Products</li>
            <li style={{ padding: '0.5rem 0' }}>Orders</li>
            <li style={{ padding: '0.5rem 0' }}>Settings</li>
          </ul>
        </nav>
      </DashboardSidebar>
      
      <DashboardItem 
        area="content-main" 
        bordered 
        shadowed 
        rounded
      >
        <h2>Main Content</h2>
        <div style={{ height: '300px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Main Chart Placeholder
        </div>
      </DashboardItem>
      
      <DashboardItem 
        area="content-side" 
        bordered 
        shadowed 
        rounded
      >
        <h3>Recent Activity</h3>
        <ul>
          <li>User John signed up</li>
          <li>Order #12345 completed</li>
          <li>New product added</li>
          <li>Payment received</li>
        </ul>
      </DashboardItem>
      
      <DashboardItem 
        area="content-bottom" 
        bordered 
        shadowed 
        rounded
      >
        <h3>Key Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div>
            <h4>Users</h4>
            <p>12,345</p>
          </div>
          <div>
            <h4>Revenue</h4>
            <p>$45,678</p>
          </div>
          <div>
            <h4>Orders</h4>
            <p>1,234</p>
          </div>
          <div>
            <h4>Products</h4>
            <p>567</p>
          </div>
        </div>
      </DashboardItem>
      
      <DashboardFooter 
        copyright="© 2023 Enterprise Inc." 
        links={
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        }
      />
    </DashboardLayout>
  );
}
```

## API Reference

### DashboardLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The dashboard items to render |
| `areas` | `string` | - | CSS grid template areas for the dashboard layout |
| `columns` | `string` | `'1fr'` | CSS grid template columns for the dashboard layout |
| `rows` | `string` | `'auto'` | CSS grid template rows for the dashboard layout |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Gap between dashboard items |
| `columnGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Horizontal gap between dashboard items |
| `rowGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | Vertical gap between dashboard items |
| `fullWidth` | `boolean` | `true` | Whether to fill the container width |
| `fullHeight` | `boolean` | `true` | Whether to fill the container height |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the DashboardLayout component accepts all standard HTML div attributes.

### DashboardItem Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the dashboard item |
| `area` | `string` | - | CSS grid area for the dashboard item |
| `column` | `string` | - | CSS grid column for the dashboard item |
| `row` | `string` | - | CSS grid row for the dashboard item |
| `backgroundColor` | `string` | - | Background color of the dashboard item |
| `bordered` | `boolean` | `false` | Whether to add a border to the dashboard item |
| `shadowed` | `boolean` | `false` | Whether to add a shadow to the dashboard item |
| `padding` | `boolean \| string` | `true` | Whether to add padding to the dashboard item |
| `rounded` | `boolean \| string` | `false` | Whether to add rounded corners to the dashboard item |
| `className` | `string` | `''` | Custom class name |

Additionally, the DashboardItem component accepts all standard HTML div attributes.

### DashboardHeader Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the dashboard header |
| `title` | `React.ReactNode` | - | Title to display in the header |
| `actions` | `React.ReactNode` | - | Actions to display in the header (typically buttons or menus) |
| `logo` | `React.ReactNode` | - | Logo to display in the header |
| `userInfo` | `React.ReactNode` | - | User information to display in the header |
| `sticky` | `boolean` | `false` | Whether to make the header sticky |
| `area` | `string` | `'header'` | CSS grid area for the dashboard header |
| `column` | `string` | `'1 / -1'` | CSS grid column for the dashboard header |
| `backgroundColor` | `string` | `'#ffffff'` | Background color of the dashboard header |
| `bordered` | `boolean` | `true` | Whether to add a border to the dashboard header |
| `shadowed` | `boolean` | `true` | Whether to add a shadow to the dashboard header |
| `padding` | `boolean \| string` | `'0.5rem 1rem'` | Whether to add padding to the dashboard header |
| `className` | `string` | `''` | Custom class name |

Additionally, the DashboardHeader component accepts all DashboardItem props.

### DashboardSidebar Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the dashboard sidebar |
| `collapsed` | `boolean` | `false` | Whether the sidebar is collapsed |
| `width` | `string \| number` | `'250px'` | Width of the sidebar when expanded |
| `collapsedWidth` | `string \| number` | `'64px'` | Width of the sidebar when collapsed |
| `sticky` | `boolean` | `true` | Whether to make the sidebar sticky |
| `area` | `string` | `'sidebar'` | CSS grid area for the dashboard sidebar |
| `backgroundColor` | `string` | `'#f5f5f5'` | Background color of the dashboard sidebar |
| `bordered` | `boolean` | `true` | Whether to add a border to the dashboard sidebar |
| `shadowed` | `boolean` | `true` | Whether to add a shadow to the dashboard sidebar |
| `padding` | `boolean \| string` | `true` | Whether to add padding to the dashboard sidebar |
| `className` | `string` | `''` | Custom class name |

Additionally, the DashboardSidebar component accepts all DashboardItem props.

### DashboardContent Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the dashboard content |
| `scrollable` | `boolean` | `true` | Whether to add a scrollable container for the content |
| `area` | `string` | `'content'` | CSS grid area for the dashboard content |
| `backgroundColor` | `string` | `'#ffffff'` | Background color of the dashboard content |
| `bordered` | `boolean` | `false` | Whether to add a border to the dashboard content |
| `shadowed` | `boolean` | `false` | Whether to add a shadow to the dashboard content |
| `padding` | `boolean \| string` | `true` | Whether to add padding to the dashboard content |
| `className` | `string` | `''` | Custom class name |

Additionally, the DashboardContent component accepts all DashboardItem props.

### DashboardFooter Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the dashboard footer |
| `copyright` | `React.ReactNode` | - | Copyright text to display in the footer |
| `links` | `React.ReactNode` | - | Links to display in the footer |
| `sticky` | `boolean` | `false` | Whether to make the footer sticky |
| `area` | `string` | `'footer'` | CSS grid area for the dashboard footer |
| `column` | `string` | `'1 / -1'` | CSS grid column for the dashboard footer |
| `backgroundColor` | `string` | `'#f5f5f5'` | Background color of the dashboard footer |
| `bordered` | `boolean` | `true` | Whether to add a border to the dashboard footer |
| `shadowed` | `boolean` | `false` | Whether to add a shadow to the dashboard footer |
| `padding` | `boolean \| string` | `'0.5rem 1rem'` | Whether to add padding to the dashboard footer |
| `className` | `string` | `''` | Custom class name |

Additionally, the DashboardFooter component accepts all DashboardItem props.

## Gap Reference

| Size | Value |
|------|-------|
| `none` | 0 |
| `xs` | 0.25rem (4px) |
| `sm` | 0.5rem (8px) |
| `md` | 1rem (16px) |
| `lg` | 1.5rem (24px) |
| `xl` | 2rem (32px) |

## CSS Grid Areas

The `areas` prop in DashboardLayout uses CSS Grid's `grid-template-areas` property to define named areas for the dashboard layout. This allows for semantic placement of dashboard items.

Example:
```
"header header header"
"sidebar content content"
"footer footer footer"
```

In this example:
- The header spans all three columns in the first row
- The sidebar takes the first column in the second row
- The content spans the second and third columns in the second row
- The footer spans all three columns in the third row

You can then place items in these areas using the `area` prop:
```tsx
<DashboardHeader area="header" />
<DashboardSidebar area="sidebar" />
<DashboardContent area="content" />
<DashboardFooter area="footer" />
```

## Accessibility

The DashboardLayout component includes several accessibility considerations:

- Semantic structure for better screen reader navigation
- Proper heading hierarchy
- Keyboard navigation support
- Sufficient color contrast

## Browser Support

The DashboardLayout component is compatible with all modern browsers that support CSS Grid:

- Chrome 57+ (March 2017)
- Firefox 52+ (March 2017)
- Safari 10.1+ (March 2017)
- Edge 16+ (October 2017)

For older browsers, consider providing a fallback layout or using a CSS Grid polyfill.

## License

MIT
