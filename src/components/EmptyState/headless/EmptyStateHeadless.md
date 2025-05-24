# EmptyStateHeadless

A headless component for creating customizable empty state displays with extensive flexibility for developers. Empty states provide meaningful feedback when there is no content to display, helping users understand why content is missing and what actions they can take.

## Usage

```jsx
import { EmptyStateHeadless } from 'strive-ui';

function MyEmptyState() {
  return (
    <EmptyStateHeadless.Root
      type="empty"
      title="No Items Found"
      description="There are no items to display at this time."
      actionText="Create New Item"
      onAction={() => console.log('Action clicked!')}
      showAction={true}
    >
      <EmptyStateHeadless.Empty />
    </EmptyStateHeadless.Root>
  );
}
```

## Different Empty State Types

```jsx
import { EmptyStateHeadless } from 'strive-ui';
import { useState } from 'react';

function EmptyStateExample() {
  const [stateType, setStateType] = useState('empty');
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setStateType('empty')} style={{ marginRight: '8px' }}>Empty</button>
        <button onClick={() => setStateType('noData')} style={{ marginRight: '8px' }}>No Data</button>
        <button onClick={() => setStateType('noResults')} style={{ marginRight: '8px' }}>No Results</button>
        <button onClick={() => setStateType('offline')} style={{ marginRight: '8px' }}>Offline</button>
        <button onClick={() => setStateType('error')} style={{ marginRight: '8px' }}>Error</button>
      </div>
      
      <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px' }}>
        {stateType === 'empty' && (
          <EmptyStateHeadless.Root type="empty" onAction={() => console.log('Action clicked!')}>
            <EmptyStateHeadless.Empty />
          </EmptyStateHeadless.Root>
        )}
        
        {stateType === 'noData' && (
          <EmptyStateHeadless.Root type="noData" onAction={() => console.log('Action clicked!')}>
            <EmptyStateHeadless.NoData />
          </EmptyStateHeadless.Root>
        )}
        
        {stateType === 'noResults' && (
          <EmptyStateHeadless.Root type="noResults" onAction={() => console.log('Action clicked!')}>
            <EmptyStateHeadless.NoResults />
          </EmptyStateHeadless.Root>
        )}
        
        {stateType === 'offline' && (
          <EmptyStateHeadless.Root type="offline" onAction={() => console.log('Action clicked!')}>
            <EmptyStateHeadless.Offline />
          </EmptyStateHeadless.Root>
        )}
        
        {stateType === 'error' && (
          <EmptyStateHeadless.Root type="error" onAction={() => console.log('Action clicked!')}>
            <EmptyStateHeadless.Error />
          </EmptyStateHeadless.Root>
        )}
      </div>
    </div>
  );
}
```

## Custom Empty State

```jsx
import { EmptyStateHeadless } from 'strive-ui';

function CustomEmptyState() {
  return (
    <EmptyStateHeadless.Root
      type="custom"
      onAction={() => console.log('Action clicked!')}
    >
      <EmptyStateHeadless.Container>
        <EmptyStateHeadless.Icon>
          🚀
        </EmptyStateHeadless.Icon>
        <EmptyStateHeadless.Title>
          Ready for Takeoff!
        </EmptyStateHeadless.Title>
        <EmptyStateHeadless.Description>
          Your dashboard is set up, but you haven't added any projects yet.
        </EmptyStateHeadless.Description>
        <EmptyStateHeadless.Action>
          Create Your First Project
        </EmptyStateHeadless.Action>
        <EmptyStateHeadless.Content>
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#666' }}>
            Need help? Check out our <a href="#" style={{ color: '#2196f3' }}>getting started guide</a>.
          </div>
        </EmptyStateHeadless.Content>
      </EmptyStateHeadless.Container>
    </EmptyStateHeadless.Root>
  );
}
```

## Styled Empty State

```jsx
import { EmptyStateHeadless } from 'strive-ui';
import styled from 'styled-components';

// Styled components
const StyledContainer = styled(EmptyStateHeadless.Container)`
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  margin: 0 auto;
`;

const StyledIcon = styled(EmptyStateHeadless.Icon)`
  color: #5c6bc0;
  font-size: 64px;
`;

const StyledTitle = styled(EmptyStateHeadless.Title)`
  color: #3f51b5;
  font-size: 24px;
  margin-bottom: 12px;
`;

const StyledDescription = styled(EmptyStateHeadless.Description)`
  color: #546e7a;
  font-size: 16px;
  line-height: 1.5;
  max-width: 400px;
  margin: 0 auto 24px;
`;

const StyledAction = styled(EmptyStateHeadless.Action)`
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #303f9f;
  }
`;

function StyledEmptyState() {
  return (
    <EmptyStateHeadless.Root
      type="noData"
      title="No Data Available"
      description="There is no data to display for this time period. Try adjusting your filters or adding new data."
      actionText="Add Data"
      onAction={() => console.log('Add data clicked!')}
    >
      <StyledContainer>
        <StyledIcon />
        <StyledTitle />
        <StyledDescription />
        <StyledAction />
      </StyledContainer>
    </EmptyStateHeadless.Root>
  );
}
```

## Empty State in a Data Table

```jsx
import { EmptyStateHeadless } from 'strive-ui';
import { useState } from 'react';

function DataTableWithEmptyState() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  const handleAddData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setData([
        { id: 1, name: 'Product A', category: 'Electronics', price: 299 },
        { id: 2, name: 'Product B', category: 'Clothing', price: 59 },
        { id: 3, name: 'Product C', category: 'Home', price: 129 },
      ]);
      setIsLoading(false);
    }, 1000);
  };
  
  // Filter data based on search term
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Products</h2>
      
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          style={{ flex: 1, padding: '8px', marginRight: '8px' }}
        />
        
        <button
          onClick={handleAddData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Add Sample Data
        </button>
      </div>
      
      {isLoading ? (
        <div style={{ padding: '32px', textAlign: 'center' }}>Loading...</div>
      ) : (
        <div style={{ border: '1px solid #eee', borderRadius: '4px' }}>
          {data.length === 0 ? (
            <EmptyStateHeadless.Root
              type="noData"
              actionText="Add Sample Data"
              onAction={handleAddData}
            >
              <EmptyStateHeadless.NoData />
            </EmptyStateHeadless.Root>
          ) : filteredData.length === 0 ? (
            <EmptyStateHeadless.Root
              type="noResults"
              actionText="Clear Search"
              onAction={handleClearSearch}
            >
              <EmptyStateHeadless.NoResults />
            </EmptyStateHeadless.Root>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{item.id}</td>
                    <td style={{ padding: '12px' }}>{item.name}</td>
                    <td style={{ padding: '12px' }}>{item.category}</td>
                    <td style={{ padding: '12px' }}>${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
```

## Offline State with Network Detection

```jsx
import { EmptyStateHeadless } from 'strive-ui';
import { useState, useEffect } from 'react';

function OfflineStateExample() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleRetry = () => {
    // Attempt to refresh data or reconnect
    console.log('Retrying connection...');
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2>Network Status</h2>
      
      {!isOnline ? (
        <EmptyStateHeadless.Root
          type="offline"
          actionText="Retry Connection"
          onAction={handleRetry}
        >
          <EmptyStateHeadless.Offline />
        </EmptyStateHeadless.Root>
      ) : (
        <div style={{ padding: '32px', textAlign: 'center', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h3 style={{ margin: '0 0 8px 0' }}>You're Online</h3>
          <p style={{ margin: '0', color: '#388e3c' }}>Your internet connection is working properly.</p>
        </div>
      )}
      
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button
          onClick={() => setIsOnline(!isOnline)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9e9e9e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}
        >
          Toggle Online Status (Demo)
        </button>
      </div>
    </div>
  );
}
```

## API

### EmptyStateHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'empty' \| 'noData' \| 'noResults' \| 'offline' \| 'error' \| 'custom'` | `'empty'` | Type of empty state |
| `title` | `string` | - | Title text for the empty state (defaults based on type) |
| `description` | `string` | - | Description text for the empty state (defaults based on type) |
| `icon` | `React.ReactNode` | - | Icon to display in the empty state |
| `actionText` | `string` | - | Action button text (defaults based on type) |
| `onAction` | `() => void` | `() => {}` | Action button callback |
| `showAction` | `boolean` | `true` | Whether to show the action button |
| `content` | `React.ReactNode` | - | Additional content to display in the empty state |
| `visible` | `boolean` | `true` | Whether the empty state is visible |

### Other Components

- `EmptyStateHeadless.Container`: Container for the empty state
- `EmptyStateHeadless.Icon`: Icon component for the empty state
- `EmptyStateHeadless.Title`: Title component for the empty state
- `EmptyStateHeadless.Description`: Description component for the empty state
- `EmptyStateHeadless.Action`: Action button component for the empty state
- `EmptyStateHeadless.Content`: Additional content component for the empty state
- `EmptyStateHeadless.Empty`: Pre-configured empty state component
- `EmptyStateHeadless.NoData`: Pre-configured no data state component
- `EmptyStateHeadless.NoResults`: Pre-configured no results state component
- `EmptyStateHeadless.Offline`: Pre-configured offline state component
- `EmptyStateHeadless.Error`: Pre-configured error state component

### useEmptyState Hook

For even more control, you can use the `useEmptyState` hook directly:

```jsx
import { useEmptyState } from 'strive-ui';

function MyCustomEmptyState() {
  const {
    type,
    title,
    description,
    icon,
    actionText,
    onAction,
    showAction,
    content,
    visible,
    setVisible,
    setType,
    setTitle,
    setDescription,
    setIcon,
    setActionText,
    setOnAction,
    setShowAction,
    setContent,
    getDefaultTitle,
    getDefaultDescription,
    getDefaultActionText,
    getContainerProps,
    getActionProps,
  } = useEmptyState({
    type: 'empty',
    title: 'No Content',
    description: 'There is no content to display at this time.',
    actionText: 'Create New',
    onAction: () => console.log('Action clicked!'),
    showAction: true,
    visible: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Empty State component follows accessibility best practices:

- The empty state container has `role="region"` to define it as a distinct section
- The empty state has `aria-live="polite"` to announce changes in a non-intrusive way
- The action button has appropriate ARIA attributes for better screen reader support
