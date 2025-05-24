# InfiniteScrollHeadless

A headless implementation of infinite scrolling that provides all the functionality without any styling. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Intersection Observer**: Uses modern browser APIs for efficient scroll detection
- **Error handling**: Built-in error handling with retry functionality
- **Window or container scrolling**: Supports both window and container-based scrolling

## Basic Usage

```jsx
import { InfiniteScroll } from 'strive-ui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(InfiniteScroll)`
  height: 400px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
`;

const Item = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
`;

const LoadingIndicator = styled(InfiniteScroll.Loading)`
  padding: 1rem;
  text-align: center;
  color: #4a5568;
`;

const ErrorMessage = styled(InfiniteScroll.Error)`
  padding: 1rem;
  text-align: center;
  color: #e53e3e;
  cursor: pointer;
`;

const EndMessage = styled(InfiniteScroll.End)`
  padding: 1rem;
  text-align: center;
  color: #718096;
`;

function MyInfiniteScroll() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => ({ id: i, name: `Item ${i}` })));
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadMore = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newItems = Array.from(
      { length: 10 }, 
      (_, i) => ({ id: items.length + i, name: `Item ${items.length + i}` })
    );
    
    setItems(prev => [...prev, ...newItems]);
    setIsLoading(false);
    
    // Stop loading after 50 items
    if (items.length + newItems.length >= 50) {
      setHasMore(false);
    }
  };
  
  return (
    <Container
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      threshold={300}
    >
      {items.map(item => (
        <Item key={item.id}>{item.name}</Item>
      ))}
      
      <InfiniteScroll.Sentinel />
      
      {isLoading && (
        <LoadingIndicator>
          Loading more items...
        </LoadingIndicator>
      )}
      
      {!hasMore && (
        <EndMessage>
          You've reached the end!
        </EndMessage>
      )}
    </Container>
  );
}
```

## Window Scrolling

```jsx
import { InfiniteScroll } from 'strive-ui';
import { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ItemsContainer = styled(InfiniteScroll)`
  width: 100%;
`;

const Item = styled.div`
  padding: 1.5rem;
  margin-bottom: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LoadingIndicator = styled(InfiniteScroll.Loading)`
  padding: 2rem;
  text-align: center;
`;

const Spinner = styled.div`
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function WindowScrollExample() {
  const [items, setItems] = useState(Array.from({ length: 10 }, (_, i) => ({ id: i, content: `Item ${i} content` })));
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadMore = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newItems = Array.from(
      { length: 5 }, 
      (_, i) => ({ id: items.length + i, content: `Item ${items.length + i} content` })
    );
    
    setItems(prev => [...prev, ...newItems]);
    setIsLoading(false);
    
    // Stop loading after 30 items
    if (items.length + newItems.length >= 30) {
      setHasMore(false);
    }
  };
  
  return (
    <PageContainer>
      <h1>Window Scrolling Example</h1>
      
      <ItemsContainer
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        useWindowScroll
      >
        {items.map(item => (
          <Item key={item.id}>
            <h2>Item {item.id}</h2>
            <p>{item.content}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Item>
        ))}
        
        <InfiniteScroll.Sentinel />
        
        {isLoading && (
          <LoadingIndicator>
            <Spinner />
          </LoadingIndicator>
        )}
        
        {!hasMore && (
          <InfiniteScroll.End>
            No more items to load
          </InfiniteScroll.End>
        )}
      </ItemsContainer>
    </PageContainer>
  );
}
```

## Error Handling

```jsx
import { InfiniteScroll } from 'strive-ui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(InfiniteScroll)`
  height: 500px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
`;

const ErrorMessage = styled(InfiniteScroll.Error)`
  padding: 1.5rem;
  margin: 1rem;
  text-align: center;
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #feb2b2;
  border-radius: 0.375rem;
  
  button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #c53030;
    color: white;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    
    &:hover {
      background-color: #9b2c2c;
    }
  }
`;

function ErrorHandlingExample() {
  const [items, setItems] = useState(Array.from({ length: 15 }, (_, i) => ({ id: i, name: `Item ${i}` })));
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFail, setShouldFail] = useState(true);
  
  const loadMore = async () => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate an error on the first load
    if (shouldFail) {
      setIsLoading(false);
      setShouldFail(false);
      throw new Error('Failed to load more items');
    }
    
    const newItems = Array.from(
      { length: 10 }, 
      (_, i) => ({ id: items.length + i, name: `Item ${items.length + i}` })
    );
    
    setItems(prev => [...prev, ...newItems]);
    setIsLoading(false);
    
    if (items.length + newItems.length >= 45) {
      setHasMore(false);
    }
  };
  
  const handleRetry = () => {
    // The Error component will call triggerLoadMore internally
    console.log('Retrying...');
  };
  
  return (
    <Container
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      onError={(error) => console.error('Error loading data:', error.message)}
    >
      {items.map(item => (
        <div key={item.id} style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
          {item.name}
        </div>
      ))}
      
      <InfiniteScroll.Sentinel />
      
      {isLoading && (
        <InfiniteScroll.Loading>
          Loading more items...
        </InfiniteScroll.Loading>
      )}
      
      <ErrorMessage onRetry={handleRetry}>
        <div>Failed to load more items</div>
        <button>Retry</button>
      </ErrorMessage>
      
      {!hasMore && (
        <InfiniteScroll.End>
          You've reached the end!
        </InfiniteScroll.End>
      )}
    </Container>
  );
}
```

## Advanced Customization

```jsx
import { InfiniteScroll } from 'strive-ui';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Create a custom hook for data fetching
function useInfiniteData(url, pageSize = 10) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Reset data when URL changes
  useEffect(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [url]);
  
  const loadMore = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(url, {
        params: { page, limit: pageSize }
      });
      
      const newItems = response.data.items;
      setData(prev => [...prev, ...newItems]);
      
      if (newItems.length < pageSize) {
        setHasMore(false);
      }
      
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { data, hasMore, isLoading, error, loadMore };
}

// Custom styled components
const CustomInfiniteScroll = styled(InfiniteScroll)`
  height: 600px;
  overflow-y: auto;
  background-color: #f7fafc;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const LoadingContainer = styled(InfiniteScroll.Loading)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

function AdvancedExample() {
  const { 
    data: products, 
    hasMore, 
    isLoading, 
    error, 
    loadMore 
  } = useInfiniteData('https://api.example.com/products', 12);
  
  return (
    <CustomInfiniteScroll
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      threshold={400}
      disabled={!!error}
      onError={(err) => console.error('Failed to load products:', err)}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {products.map(product => (
          <Card key={product.id}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
          </Card>
        ))}
      </div>
      
      <InfiniteScroll.Sentinel />
      
      {isLoading && (
        <LoadingContainer>
          <div className="loader">Loading...</div>
        </LoadingContainer>
      )}
      
      {error && (
        <InfiniteScroll.Error>
          <div>Failed to load products. Please try again.</div>
        </InfiniteScroll.Error>
      )}
      
      {!hasMore && !isLoading && (
        <InfiniteScroll.End>
          No more products to load
        </InfiniteScroll.End>
      )}
    </CustomInfiniteScroll>
  );
}
```

## Props

### InfiniteScroll

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| loadMore | () => Promise<void> | - | Function to load more data when the user scrolls to the bottom |
| hasMore | boolean | - | Whether there is more data to load |
| isLoading | boolean | false | Whether data is currently being loaded |
| threshold | number | 200 | Distance from the bottom of the container to trigger loading more data (in pixels) |
| useWindowScroll | boolean | false | Whether to use window scroll instead of container scroll |
| onError | (error: Error) => void | - | Callback when an error occurs during loading |
| disabled | boolean | false | Whether to disable the infinite scroll |
| resetErrorOnHasMoreChange | boolean | true | Whether to reset the error state when hasMore changes |
| as | React.ElementType | 'div' | The element type to render as |

### InfiniteScroll.Sentinel

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

### InfiniteScroll.Loading

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| ariaLabel | string | 'Loading more content' | Custom aria-label for the loading indicator |
| as | React.ElementType | 'div' | The element type to render as |

### InfiniteScroll.Error

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onRetry | () => void | triggerLoadMore | Function to retry loading data |
| as | React.ElementType | 'div' | The element type to render as |

### InfiniteScroll.End

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | React.ElementType | 'div' | The element type to render as |

## Accessibility

- Proper ARIA roles and attributes
- `role="region"` for the container
- `aria-busy` for the loading state
- `role="status"` and `aria-live="polite"` for the loading indicator
- `role="alert"` and `aria-live="assertive"` for error messages
- `aria-live="polite"` for end messages
