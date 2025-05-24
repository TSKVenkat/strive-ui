# BreadcrumbsHeadless

A headless implementation of breadcrumbs navigation that provides all the functionality without any styling. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining accessibility and proper navigation patterns.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Collapsible**: Support for collapsing long breadcrumb trails
- **Controlled or uncontrolled**: Works in both modes

## Basic Usage

```jsx
import { Breadcrumbs } from 'strive-ui';
import styled from 'styled-components';

// Create your own styled components
const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 1rem 0;
`;

const StyledList = styled(Breadcrumbs.List)`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledItem = styled(Breadcrumbs.Item)`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Breadcrumbs.Link)`
  color: ${props => props['data-current'] ? '#1a202c' : '#4a5568'};
  text-decoration: ${props => props['data-current'] ? 'none' : 'underline'};
  font-weight: ${props => props['data-current'] ? 'bold' : 'normal'};
  cursor: ${props => props['data-current'] ? 'default' : 'pointer'};
  
  &:hover:not([data-current="true"]) {
    color: #3182ce;
  }
`;

const StyledSeparator = styled(Breadcrumbs.Separator)`
  margin: 0 0.5rem;
  color: #a0aec0;
`;

function MyBreadcrumbs() {
  const items = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
    { id: 'laptops', label: 'Laptops', href: '/products/electronics/laptops', isCurrent: true },
  ];

  return (
    <StyledBreadcrumbs 
      items={items}
      onItemClick={(item) => console.log(`Navigating to ${item.href}`)}
    >
      <StyledList>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <StyledSeparator>/</StyledSeparator>}
            <StyledItem item={item}>
              <StyledLink item={item}>{item.label}</StyledLink>
            </StyledItem>
          </React.Fragment>
        ))}
      </StyledList>
    </StyledBreadcrumbs>
  );
}
```

## Collapsible Breadcrumbs

```jsx
import { Breadcrumbs } from 'strive-ui';
import styled from 'styled-components';

const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 1rem 0;
`;

const StyledList = styled(Breadcrumbs.List)`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledItem = styled(Breadcrumbs.Item)`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Breadcrumbs.Link)`
  color: ${props => props['data-current'] ? '#1a202c' : '#4a5568'};
  text-decoration: ${props => props['data-current'] ? 'none' : 'underline'};
  font-weight: ${props => props['data-current'] ? 'bold' : 'normal'};
  cursor: ${props => props['data-current'] ? 'default' : 'pointer'};
  
  &:hover:not([data-current="true"]) {
    color: #3182ce;
  }
`;

const StyledSeparator = styled(Breadcrumbs.Separator)`
  margin: 0 0.5rem;
  color: #a0aec0;
`;

const StyledCollapsed = styled(Breadcrumbs.Collapsed)`
  margin: 0 0.5rem;
  color: #a0aec0;
  cursor: pointer;
  
  &:hover {
    color: #3182ce;
  }
`;

function CollapsibleBreadcrumbs() {
  const [showAll, setShowAll] = useState(false);
  
  const items = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'electronics', label: 'Electronics', href: '/products/electronics' },
    { id: 'computers', label: 'Computers', href: '/products/electronics/computers' },
    { id: 'laptops', label: 'Laptops', href: '/products/electronics/computers/laptops' },
    { id: 'gaming', label: 'Gaming', href: '/products/electronics/computers/laptops/gaming' },
    { id: 'asus', label: 'Asus ROG', href: '/products/electronics/computers/laptops/gaming/asus-rog', isCurrent: true },
  ];

  return (
    <StyledBreadcrumbs 
      items={items}
      maxItems={showAll ? undefined : 4}
      itemsBeforeCollapse={1}
      itemsAfterCollapse={2}
      onItemClick={(item) => console.log(`Navigating to ${item.href}`)}
    >
      <StyledList>
        {({ items: visibleItems, isCollapsed, collapsedItems }) => (
          <>
            {visibleItems.map((item, index, array) => (
              <React.Fragment key={item.id}>
                {index > 0 && index === 1 && isCollapsed && (
                  <>
                    <StyledSeparator>/</StyledSeparator>
                    <StyledCollapsed onClick={() => setShowAll(true)}>
                      ...{collapsedItems.length} more
                    </StyledCollapsed>
                  </>
                )}
                {index > 0 && (index > 1 || !isCollapsed) && <StyledSeparator>/</StyledSeparator>}
                <StyledItem item={item}>
                  <StyledLink item={item}>{item.label}</StyledLink>
                </StyledItem>
              </React.Fragment>
            ))}
          </>
        )}
      </StyledList>
    </StyledBreadcrumbs>
  );
}
```

## With Icons

```jsx
import { Breadcrumbs } from 'strive-ui';
import styled from 'styled-components';
import { FaHome, FaBox, FaLaptop, FaMicrochip } from 'react-icons/fa';

const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding: 1rem 0;
`;

const StyledList = styled(Breadcrumbs.List)`
  display: flex;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledItem = styled(Breadcrumbs.Item)`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Breadcrumbs.Link)`
  display: flex;
  align-items: center;
  color: ${props => props['data-current'] ? '#1a202c' : '#4a5568'};
  text-decoration: ${props => props['data-current'] ? 'none' : 'underline'};
  font-weight: ${props => props['data-current'] ? 'bold' : 'normal'};
  cursor: ${props => props['data-current'] ? 'default' : 'pointer'};
  
  .icon {
    margin-right: 0.25rem;
  }
  
  &:hover:not([data-current="true"]) {
    color: #3182ce;
  }
`;

const StyledSeparator = styled(Breadcrumbs.Separator)`
  margin: 0 0.5rem;
  color: #a0aec0;
`;

function IconBreadcrumbs() {
  const items = [
    { id: 'home', label: 'Home', href: '/', icon: <FaHome className="icon" /> },
    { id: 'products', label: 'Products', href: '/products', icon: <FaBox className="icon" /> },
    { id: 'electronics', label: 'Electronics', href: '/products/electronics', icon: <FaMicrochip className="icon" /> },
    { id: 'laptops', label: 'Laptops', href: '/products/electronics/laptops', isCurrent: true, icon: <FaLaptop className="icon" /> },
  ];

  return (
    <StyledBreadcrumbs items={items}>
      <StyledList>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <StyledSeparator>/</StyledSeparator>}
            <StyledItem item={item}>
              <StyledLink item={item}>
                {item.icon}
                {item.label}
              </StyledLink>
            </StyledItem>
          </React.Fragment>
        ))}
      </StyledList>
    </StyledBreadcrumbs>
  );
}
```

## Dynamic Breadcrumbs

```jsx
import { useLocation } from 'react-router-dom';
import { Breadcrumbs } from 'strive-ui';

function DynamicBreadcrumbs() {
  const location = useLocation();
  
  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    // Always include home
    const breadcrumbs = [
      { id: 'home', label: 'Home', href: '/' }
    ];
    
    // Add breadcrumbs for each path segment
    let currentPath = '';
    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;
      
      // Format the label (capitalize, replace hyphens with spaces)
      const label = name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        id: name,
        label,
        href: currentPath,
        isCurrent: index === pathnames.length - 1
      });
    });
    
    return breadcrumbs;
  };
  
  const items = generateBreadcrumbs();
  
  return (
    <Breadcrumbs items={items}>
      {/* Your styled components here */}
    </Breadcrumbs>
  );
}
```

## Props

### Breadcrumbs

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | BreadcrumbItem[] | [] | Array of breadcrumb items |
| onItemClick | (item: BreadcrumbItem) => void | - | Callback when a breadcrumb item is clicked |
| maxItems | number | - | Maximum number of items to display before collapsing |
| itemsBeforeCollapse | number | 1 | Number of items to show at the beginning when collapsed |
| itemsAfterCollapse | number | 1 | Number of items to show at the end when collapsed |
| separator | React.ReactNode | '/' | Custom separator between breadcrumb items |
| as | React.ElementType | 'nav' | The element type to render as |

### BreadcrumbItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| id | string | - | Unique identifier for the breadcrumb item |
| label | React.ReactNode | - | Label to display for the breadcrumb item |
| href | string | - | URL for the breadcrumb item |
| isCurrent | boolean | false | Whether the breadcrumb item is the current page |
| disabled | boolean | false | Whether the breadcrumb item is disabled |
| icon | React.ReactNode | - | Optional icon to display before the label |
| data | any | - | Optional data to associate with the breadcrumb item |

### Breadcrumbs.List

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'ol' | The element type to render as |

### Breadcrumbs.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | BreadcrumbItem | - | Breadcrumb item data |
| as | React.ElementType | 'li' | The element type to render as |

### Breadcrumbs.Separator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'li' | The element type to render as |

### Breadcrumbs.Collapsed

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onClick | (event: React.MouseEvent) => void | - | Callback when the collapsed indicator is clicked |
| as | React.ElementType | 'li' | The element type to render as |

### Breadcrumbs.Link

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| item | BreadcrumbItem | - | Breadcrumb item data |
| as | React.ElementType | 'a' | The element type to render as |

## Accessibility

- Follows WAI-ARIA Breadcrumb Pattern
- Proper ARIA roles and attributes
- `aria-current="page"` for the current page
- `aria-disabled` for disabled items
- `aria-hidden` for separators
- Proper keyboard navigation
