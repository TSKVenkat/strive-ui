# InfiniteScroll Component

The InfiniteScroll component automatically loads more content as the user scrolls down, providing a seamless browsing experience without pagination.

## Import

```jsx
import { InfiniteScroll } from 'pulseui';
```

## Usage

```jsx
<InfiniteScroll
  loadMore={fetchMoreData}
  hasMore={hasMoreItems}
  isLoading={isLoading}
>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</InfiniteScroll>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loadMore` | `() => Promise<void>` | Required | Function to load more data when the user scrolls to the bottom |
| `hasMore` | `boolean` | Required | Whether there is more data to load |
| `isLoading` | `boolean` | `false` | Whether data is currently being loaded |
| `threshold` | `number` | `200` | Distance from the bottom of the container to trigger loading more data (in pixels) |
| `loadingComponent` | `React.ReactNode` | - | Component to display while loading more data |
| `endComponent` | `React.ReactNode` | - | Component to display when there is no more data |
| `errorComponent` | `React.ReactNode` | - | Component to display when there is an error loading data |
| `useWindowScroll` | `boolean` | `false` | Whether to use window scroll instead of container scroll |
| `height` | `string` | - | Height of the container (only used when useWindowScroll is false) |
| `className` | `string` | - | Additional className for the container |
| `children` | `React.ReactNode` | Required | Children to render |

## Examples

### Basic Usage

```jsx
const [items, setItems] = useState([]);
const [hasMore, setHasMore] = useState(true);
const [isLoading, setIsLoading] = useState(false);

const loadMoreItems = async () => {
  setIsLoading(true);
  
  try {
    // Fetch more data from your API
    const newItems = await fetchMoreItems(items.length);
    
    setItems(prevItems => [...prevItems, ...newItems]);
    
    // Check if there are more items to load
    if (newItems.length < 10) {
      setHasMore(false);
    }
  } catch (error) {
    console.error('Error loading more items:', error);
  } finally {
    setIsLoading(false);
  }
};

return (
  <InfiniteScroll
    loadMore={loadMoreItems}
    hasMore={hasMore}
    isLoading={isLoading}
    height="500px"
  >
    {items.map(item => (
      <Card key={item.id}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </Card>
    ))}
  </InfiniteScroll>
);
```

### With Custom Loading and End Components

```jsx
<InfiniteScroll
  loadMore={loadMoreItems}
  hasMore={hasMore}
  isLoading={isLoading}
  loadingComponent={
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Spinner size="md" />
      <p>Loading more awesome content...</p>
    </div>
  }
  endComponent={
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>You've seen it all! Check back later for more content.</p>
    </div>
  }
>
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</InfiniteScroll>
```

### Using Window Scroll

```jsx
<InfiniteScroll
  loadMore={loadMoreItems}
  hasMore={hasMore}
  isLoading={isLoading}
  useWindowScroll
>
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</InfiniteScroll>
```

## Accessibility

The InfiniteScroll component follows accessibility best practices:

- Uses appropriate ARIA attributes for loading states
- Provides feedback to screen readers when new content is loaded
- Maintains proper focus management when new content is added
