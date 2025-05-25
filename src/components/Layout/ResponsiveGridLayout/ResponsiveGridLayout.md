# Responsive Grid Layout

The `ResponsiveGridLayout` component provides a powerful and flexible grid system with responsive breakpoints, similar to popular CSS frameworks but with React component-based control.

## Features

- **12-Column Grid System**: Standard 12-column layout for easy alignment
- **Responsive Breakpoints**: Support for xs, sm, md, lg, xl, and xxl screen sizes
- **Multiple Layout Options**: CSS Grid and Flexbox implementations
- **Automatic Responsiveness**: Components adapt to different screen sizes
- **Column Spanning**: Control how many columns an item spans at each breakpoint
- **Ordering**: Change the visual order of items at different breakpoints
- **Offsetting**: Add space before items at different breakpoints
- **Visibility Control**: Show or hide items at different breakpoints
- **Flexible Containers**: Fixed-width or fluid containers
- **Customizable Gaps**: Control spacing between grid items
- **Polymorphic Components**: Each component can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

### CSS Grid Layout

```tsx
import { 
  ResponsiveGridLayout, 
  GridItem 
} from '@strive-ui/layout';

function BasicGridLayout() {
  return (
    <ResponsiveGridLayout gap="md">
      <GridItem span={6} md={4} lg={3}>
        <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 1</div>
      </GridItem>
      <GridItem span={6} md={4} lg={3}>
        <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 2</div>
      </GridItem>
      <GridItem span={6} md={4} lg={3}>
        <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 3</div>
      </GridItem>
      <GridItem span={6} md={4} lg={3}>
        <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 4</div>
      </GridItem>
    </ResponsiveGridLayout>
  );
}
```

### Flexbox Layout with Rows and Columns

```tsx
import { 
  GridContainer, 
  GridRow, 
  GridCol 
} from '@strive-ui/layout';

function FlexboxGridLayout() {
  return (
    <GridContainer>
      <GridRow gap="md">
        <GridCol span={6} md={4} lg={3}>
          <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 1</div>
        </GridCol>
        <GridCol span={6} md={4} lg={3}>
          <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 2</div>
        </GridCol>
        <GridCol span={6} md={4} lg={3}>
          <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 3</div>
        </GridCol>
        <GridCol span={6} md={4} lg={3}>
          <div style={{ padding: '1rem', background: '#f0f0f0' }}>Item 4</div>
        </GridCol>
      </GridRow>
    </GridContainer>
  );
}
```

## Examples

### Responsive Layout with Different Column Spans

```tsx
import { 
  GridContainer, 
  GridRow, 
  GridCol 
} from '@strive-ui/layout';

function ResponsiveColumnsLayout() {
  return (
    <GridContainer>
      <h2>Responsive Columns</h2>
      <p>Resize the browser window to see the layout change:</p>
      
      <GridRow gap="md">
        <GridCol xs={12} sm={6} md={4} lg={3}>
          <div style={{ padding: '1rem', background: '#e3f2fd', height: '100%' }}>
            <h3>Column 1</h3>
            <p>xs=12 sm=6 md=4 lg=3</p>
          </div>
        </GridCol>
        
        <GridCol xs={12} sm={6} md={4} lg={3}>
          <div style={{ padding: '1rem', background: '#bbdefb', height: '100%' }}>
            <h3>Column 2</h3>
            <p>xs=12 sm=6 md=4 lg=3</p>
          </div>
        </GridCol>
        
        <GridCol xs={12} sm={6} md={4} lg={3}>
          <div style={{ padding: '1rem', background: '#90caf9', height: '100%' }}>
            <h3>Column 3</h3>
            <p>xs=12 sm=6 md=4 lg=3</p>
          </div>
        </GridCol>
        
        <GridCol xs={12} sm={6} md={12} lg={3}>
          <div style={{ padding: '1rem', background: '#64b5f6', height: '100%' }}>
            <h3>Column 4</h3>
            <p>xs=12 sm=6 md=12 lg=3</p>
          </div>
        </GridCol>
      </GridRow>
    </GridContainer>
  );
}
```

### Column Offsets

```tsx
import { 
  GridContainer, 
  GridRow, 
  GridCol 
} from '@strive-ui/layout';

function ColumnOffsetsLayout() {
  return (
    <GridContainer>
      <h2>Column Offsets</h2>
      
      <GridRow gap="md" style={{ marginBottom: '1rem' }}>
        <GridCol span={4}>
          <div style={{ padding: '1rem', background: '#e3f2fd' }}>
            <h3>Column 1</h3>
            <p>span=4</p>
          </div>
        </GridCol>
        
        <GridCol span={4} offset={4}>
          <div style={{ padding: '1rem', background: '#bbdefb' }}>
            <h3>Column 2</h3>
            <p>span=4 offset=4</p>
          </div>
        </GridCol>
      </GridRow>
      
      <GridRow gap="md" style={{ marginBottom: '1rem' }}>
        <GridCol span={3} offset={3}>
          <div style={{ padding: '1rem', background: '#90caf9' }}>
            <h3>Column 3</h3>
            <p>span=3 offset=3</p>
          </div>
        </GridCol>
        
        <GridCol span={3} offset={3}>
          <div style={{ padding: '1rem', background: '#64b5f6' }}>
            <h3>Column 4</h3>
            <p>span=3 offset=3</p>
          </div>
        </GridCol>
      </GridRow>
      
      <GridRow gap="md">
        <GridCol xs={12} sm={6} md={4} offsetMd={2} lg={3} offsetLg={3}>
          <div style={{ padding: '1rem', background: '#42a5f5' }}>
            <h3>Column 5</h3>
            <p>Responsive offsets</p>
          </div>
        </GridCol>
      </GridRow>
    </GridContainer>
  );
}
```

### Column Ordering

```tsx
import { 
  GridContainer, 
  GridRow, 
  GridCol 
} from '@strive-ui/layout';

function ColumnOrderingLayout() {
  return (
    <GridContainer>
      <h2>Column Ordering</h2>
      <p>These columns are visually reordered regardless of their order in the DOM:</p>
      
      <GridRow gap="md">
        <GridCol span={4} order={3}>
          <div style={{ padding: '1rem', background: '#e3f2fd' }}>
            <h3>First in DOM</h3>
            <p>order=3</p>
          </div>
        </GridCol>
        
        <GridCol span={4} order={1}>
          <div style={{ padding: '1rem', background: '#bbdefb' }}>
            <h3>Second in DOM</h3>
            <p>order=1</p>
          </div>
        </GridCol>
        
        <GridCol span={4} order={2}>
          <div style={{ padding: '1rem', background: '#90caf9' }}>
            <h3>Third in DOM</h3>
            <p>order=2</p>
          </div>
        </GridCol>
      </GridRow>
      
      <h3 style={{ marginTop: '2rem' }}>Responsive Ordering</h3>
      <p>The order changes at different breakpoints:</p>
      
      <GridRow gap="md">
        <GridCol span={4} orderXs={3} orderMd={1} orderLg={2}>
          <div style={{ padding: '1rem', background: '#64b5f6' }}>
            <h3>Column 1</h3>
            <p>orderXs=3 orderMd=1 orderLg=2</p>
          </div>
        </GridCol>
        
        <GridCol span={4} orderXs={1} orderMd={3} orderLg={3}>
          <div style={{ padding: '1rem', background: '#42a5f5' }}>
            <h3>Column 2</h3>
            <p>orderXs=1 orderMd=3 orderLg=3</p>
          </div>
        </GridCol>
        
        <GridCol span={4} orderXs={2} orderMd={2} orderLg={1}>
          <div style={{ padding: '1rem', background: '#2196f3' }}>
            <h3>Column 3</h3>
            <p>orderXs=2 orderMd=2 orderLg=1</p>
          </div>
        </GridCol>
      </GridRow>
    </GridContainer>
  );
}
```

### Responsive Visibility

```tsx
import { 
  GridContainer, 
  GridRow, 
  GridCol 
} from '@strive-ui/layout';

function ResponsiveVisibilityLayout() {
  return (
    <GridContainer>
      <h2>Responsive Visibility</h2>
      <p>Resize the browser window to see elements appear and disappear:</p>
      
      <GridRow gap="md">
        <GridCol span={12} hiddenMd={true}>
          <div style={{ padding: '1rem', background: '#e3f2fd' }}>
            <h3>Mobile Only</h3>
            <p>This is visible on small screens (xs, sm) but hidden on md and up.</p>
          </div>
        </GridCol>
        
        <GridCol span={12} hiddenXs={true} hiddenSm={true} hiddenLg={true} hiddenXl={true} hiddenXxl={true}>
          <div style={{ padding: '1rem', background: '#bbdefb' }}>
            <h3>Tablet Only</h3>
            <p>This is visible only on medium screens (md).</p>
          </div>
        </GridCol>
        
        <GridCol span={12} hiddenXs={true} hiddenSm={true} hiddenMd={true}>
          <div style={{ padding: '1rem', background: '#90caf9' }}>
            <h3>Desktop Only</h3>
            <p>This is visible on large screens (lg, xl, xxl) but hidden on smaller screens.</p>
          </div>
        </GridCol>
      </GridRow>
    </GridContainer>
  );
}
```

### Auto and Equal Width Columns

```tsx
import { 
  GridContainer, 
  GridRow, 
  GridCol 
} from '@strive-ui/layout';

function AutoEqualWidthLayout() {
  return (
    <GridContainer>
      <h2>Auto Width Columns</h2>
      
      <GridRow gap="md" style={{ marginBottom: '1rem' }}>
        <GridCol span="auto">
          <div style={{ padding: '1rem', background: '#e3f2fd' }}>
            <p>Auto width based on content</p>
          </div>
        </GridCol>
        
        <GridCol span={6}>
          <div style={{ padding: '1rem', background: '#bbdefb' }}>
            <p>Fixed width (6 columns)</p>
          </div>
        </GridCol>
        
        <GridCol span="auto">
          <div style={{ padding: '1rem', background: '#90caf9' }}>
            <p>Auto width based on content</p>
          </div>
        </GridCol>
      </GridRow>
      
      <h2>Equal Width Columns</h2>
      
      <GridRow gap="md">
        <GridCol span="equal">
          <div style={{ padding: '1rem', background: '#64b5f6' }}>
            <p>Equal width</p>
          </div>
        </GridCol>
        
        <GridCol span="equal">
          <div style={{ padding: '1rem', background: '#42a5f5' }}>
            <p>Equal width</p>
          </div>
        </GridCol>
        
        <GridCol span="equal">
          <div style={{ padding: '1rem', background: '#2196f3' }}>
            <p>Equal width</p>
          </div>
        </GridCol>
        
        <GridCol span="equal">
          <div style={{ padding: '1rem', background: '#1e88e5' }}>
            <p>Equal width</p>
          </div>
        </GridCol>
      </GridRow>
    </GridContainer>
  );
}
```

### Nested Grids

```tsx
import { 
  GridContainer, 
  GridRow, 
  GridCol 
} from '@strive-ui/layout';

function NestedGridLayout() {
  return (
    <GridContainer>
      <h2>Nested Grids</h2>
      
      <GridRow gap="md">
        <GridCol span={6}>
          <div style={{ padding: '1rem', background: '#e3f2fd' }}>
            <h3>Column 1</h3>
            <p>This is a 6-column wide parent.</p>
            
            <GridRow gap="sm">
              <GridCol span={6}>
                <div style={{ padding: '0.5rem', background: '#bbdefb', marginTop: '0.5rem' }}>
                  <p>Nested Col (6)</p>
                </div>
              </GridCol>
              <GridCol span={6}>
                <div style={{ padding: '0.5rem', background: '#bbdefb', marginTop: '0.5rem' }}>
                  <p>Nested Col (6)</p>
                </div>
              </GridCol>
            </GridRow>
          </div>
        </GridCol>
        
        <GridCol span={6}>
          <div style={{ padding: '1rem', background: '#90caf9' }}>
            <h3>Column 2</h3>
            <p>This is a 6-column wide parent.</p>
            
            <GridRow gap="sm">
              <GridCol span={4}>
                <div style={{ padding: '0.5rem', background: '#64b5f6', marginTop: '0.5rem' }}>
                  <p>Nested Col (4)</p>
                </div>
              </GridCol>
              <GridCol span={4}>
                <div style={{ padding: '0.5rem', background: '#64b5f6', marginTop: '0.5rem' }}>
                  <p>Nested Col (4)</p>
                </div>
              </GridCol>
              <GridCol span={4}>
                <div style={{ padding: '0.5rem', background: '#64b5f6', marginTop: '0.5rem' }}>
                  <p>Nested Col (4)</p>
                </div>
              </GridCol>
            </GridRow>
          </div>
        </GridCol>
      </GridRow>
    </GridContainer>
  );
}
```

### CSS Grid Layout with Areas

```tsx
import { 
  ResponsiveGridLayout, 
  GridItem 
} from '@strive-ui/layout';

function CSSGridAreasLayout() {
  // Define a custom grid with named areas
  const gridStyle = {
    gridTemplateAreas: `
      "header header header"
      "sidebar content content"
      "footer footer footer"
    `,
    gridTemplateColumns: '250px 1fr 1fr',
    gridTemplateRows: 'auto 1fr auto',
    height: '500px',
  };

  return (
    <ResponsiveGridLayout style={gridStyle} gap="md">
      <GridItem style={{ gridArea: 'header', background: '#bbdefb', padding: '1rem' }}>
        <h2>Header</h2>
        <p>This spans the entire top row</p>
      </GridItem>
      
      <GridItem style={{ gridArea: 'sidebar', background: '#90caf9', padding: '1rem' }}>
        <h3>Sidebar</h3>
        <p>This is the left sidebar</p>
        <ul>
          <li>Link 1</li>
          <li>Link 2</li>
          <li>Link 3</li>
        </ul>
      </GridItem>
      
      <GridItem style={{ gridArea: 'content', background: '#64b5f6', padding: '1rem' }}>
        <h3>Main Content</h3>
        <p>This is the main content area that spans 2/3 of the middle row</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      </GridItem>
      
      <GridItem style={{ gridArea: 'footer', background: '#42a5f5', padding: '1rem' }}>
        <h3>Footer</h3>
        <p>This spans the entire bottom row</p>
      </GridItem>
    </ResponsiveGridLayout>
  );
}
```

## API Reference

### ResponsiveGridLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the grid |
| `columns` | `number` | `12` | The number of columns in the grid |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | The gap between grid items |
| `columnGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | The horizontal gap between grid items |
| `rowGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | The vertical gap between grid items |
| `justifyContent` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | Horizontal justification of grid items |
| `alignItems` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | Vertical alignment of grid items |
| `fullWidth` | `boolean` | `true` | Whether the grid should take up the full width |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the ResponsiveGridLayout component accepts all standard HTML div attributes.

### GridItem Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the grid item |
| `span` | `1-12 \| 'auto' \| 'equal'` | `12` | The number of columns the item spans |
| `xs` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on extra small screens |
| `sm` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on small screens |
| `md` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on medium screens |
| `lg` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on large screens |
| `xl` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on extra large screens |
| `xxl` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on extra extra large screens |
| `offset` | `number` | - | The number of columns to offset the item |
| `offsetXs` | `number` | - | The number of columns to offset the item on extra small screens |
| `offsetSm` | `number` | - | The number of columns to offset the item on small screens |
| `offsetMd` | `number` | - | The number of columns to offset the item on medium screens |
| `offsetLg` | `number` | - | The number of columns to offset the item on large screens |
| `offsetXl` | `number` | - | The number of columns to offset the item on extra large screens |
| `offsetXxl` | `number` | - | The number of columns to offset the item on extra extra large screens |
| `order` | `number` | - | The order of the item |
| `orderXs` | `number` | - | The order of the item on extra small screens |
| `orderSm` | `number` | - | The order of the item on small screens |
| `orderMd` | `number` | - | The order of the item on medium screens |
| `orderLg` | `number` | - | The order of the item on large screens |
| `orderXl` | `number` | - | The order of the item on extra large screens |
| `orderXxl` | `number` | - | The order of the item on extra extra large screens |
| `hidden` | `boolean` | - | Whether to hide the item |
| `hiddenXs` | `boolean` | - | Whether to hide the item on extra small screens |
| `hiddenSm` | `boolean` | - | Whether to hide the item on small screens |
| `hiddenMd` | `boolean` | - | Whether to hide the item on medium screens |
| `hiddenLg` | `boolean` | - | Whether to hide the item on large screens |
| `hiddenXl` | `boolean` | - | Whether to hide the item on extra large screens |
| `hiddenXxl` | `boolean` | - | Whether to hide the item on extra extra large screens |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the GridItem component accepts all standard HTML div attributes.

### GridRow Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the row |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | The gap between grid items |
| `columnGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | The horizontal gap between grid items |
| `rowGap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | - | The vertical gap between grid items |
| `justifyContent` | `'start' \| 'end' \| 'center' \| 'between' \| 'around' \| 'evenly'` | - | Horizontal justification of grid items |
| `alignItems` | `'start' \| 'end' \| 'center' \| 'stretch' \| 'baseline'` | - | Vertical alignment of grid items |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the GridRow component accepts all standard HTML div attributes.

### GridCol Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the column |
| `span` | `1-12 \| 'auto' \| 'equal'` | `12` | The number of columns the item spans |
| `xs` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on extra small screens |
| `sm` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on small screens |
| `md` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on medium screens |
| `lg` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on large screens |
| `xl` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on extra large screens |
| `xxl` | `1-12 \| 'auto' \| 'equal'` | - | The number of columns the item spans on extra extra large screens |
| `offset` | `number` | - | The number of columns to offset the item |
| `offsetXs` | `number` | - | The number of columns to offset the item on extra small screens |
| `offsetSm` | `number` | - | The number of columns to offset the item on small screens |
| `offsetMd` | `number` | - | The number of columns to offset the item on medium screens |
| `offsetLg` | `number` | - | The number of columns to offset the item on large screens |
| `offsetXl` | `number` | - | The number of columns to offset the item on extra large screens |
| `offsetXxl` | `number` | - | The number of columns to offset the item on extra extra large screens |
| `order` | `number` | - | The order of the item |
| `orderXs` | `number` | - | The order of the item on extra small screens |
| `orderSm` | `number` | - | The order of the item on small screens |
| `orderMd` | `number` | - | The order of the item on medium screens |
| `orderLg` | `number` | - | The order of the item on large screens |
| `orderXl` | `number` | - | The order of the item on extra large screens |
| `orderXxl` | `number` | - | The order of the item on extra extra large screens |
| `hidden` | `boolean` | - | Whether to hide the item |
| `hiddenXs` | `boolean` | - | Whether to hide the item on extra small screens |
| `hiddenSm` | `boolean` | - | Whether to hide the item on small screens |
| `hiddenMd` | `boolean` | - | Whether to hide the item on medium screens |
| `hiddenLg` | `boolean` | - | Whether to hide the item on large screens |
| `hiddenXl` | `boolean` | - | Whether to hide the item on extra large screens |
| `hiddenXxl` | `boolean` | - | Whether to hide the item on extra extra large screens |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the GridCol component accepts all standard HTML div attributes.

### GridContainer Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the container |
| `fluid` | `boolean` | `false` | Whether the container should be fluid (full width) |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl' \| string` | `'lg'` | The maximum width of the container |
| `padding` | `boolean \| string` | `true` | Whether to add padding to the container |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the GridContainer component accepts all standard HTML div attributes.

## Breakpoints

The responsive grid system uses the following breakpoints:

| Breakpoint | Width |
|------------|-------|
| xs | 0px and up |
| sm | 576px and up |
| md | 768px and up |
| lg | 992px and up |
| xl | 1200px and up |
| xxl | 1400px and up |

## Gap Reference

| Size | Value |
|------|-------|
| `none` | 0 |
| `xs` | 0.25rem (4px) |
| `sm` | 0.5rem (8px) |
| `md` | 1rem (16px) |
| `lg` | 1.5rem (24px) |
| `xl` | 2rem (32px) |

## Container Max Widths

| Size | Max Width |
|------|-----------|
| `sm` | 540px |
| `md` | 720px |
| `lg` | 960px |
| `xl` | 1140px |
| `xxl` | 1320px |

## Accessibility

The ResponsiveGridLayout component includes several accessibility considerations:

- Semantic HTML structure
- Proper keyboard navigation
- Responsive design for various devices and screen sizes

## Browser Support

The ResponsiveGridLayout component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
