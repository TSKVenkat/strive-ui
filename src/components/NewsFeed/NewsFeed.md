# News Feed

A flexible and customizable headless component for displaying news articles with filtering, searching, sorting, and pagination capabilities.

## Features

- **Headless Architecture**: Separation of logic from presentation for maximum styling flexibility
- **Compound Component Pattern**: Intuitive API with nested components for complex UIs
- **Filtering & Searching**: Filter news by source, category, or search terms
- **Sorting Options**: Sort by newest, oldest, popular, or trending
- **Pagination**: Support for both traditional pagination and infinite scrolling
- **Grouping**: Group news items by date, category, or any custom criteria
- **Interaction**: Built-in support for likes, bookmarks, comments, and shares
- **Responsive Design**: Adapts to different screen sizes and devices
- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard navigation
- **Performance Optimized**: Efficient rendering with React hooks and memoization

## Installation

```bash
npm install @pulseui/news-feed
```

## Usage

### Basic Usage

```jsx
import { NewsFeed } from '@pulseui/news-feed';

const newsItems = [
  {
    id: '1',
    title: 'New Technology Breakthrough',
    content: 'Scientists have discovered a revolutionary new technology...',
    date: '2025-05-20T10:30:00Z',
    source: 'Tech News',
    author: 'Jane Smith',
    categories: ['Technology', 'Science'],
    imageUrl: 'https://example.com/image1.jpg',
    imageAlt: 'Laboratory equipment',
    url: 'https://example.com/news/1'
  },
  // More news items...
];

function App() {
  return (
    <NewsFeed.Root initialItems={newsItems}>
      <div className="news-feed-header">
        <NewsFeed.Search placeholder="Search news..." />
        <NewsFeed.Sort />
      </div>
      
      <div className="news-feed-sidebar">
        <h3>Categories</h3>
        <NewsFeed.Categories />
      </div>
      
      <div className="news-feed-content">
        <NewsFeed.List />
        <NewsFeed.Empty />
        <NewsFeed.Loading />
        <NewsFeed.LoadMore />
      </div>
    </NewsFeed.Root>
  );
}
```

### Custom Styling with Styled Components

```jsx
import { NewsFeed } from '@pulseui/news-feed';
import styled from 'styled-components';

// Custom styled components
const StyledNewsItem = styled(NewsFeed.Item)`
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &.featured {
    border-left: 4px solid #e63946;
  }
  
  &.breaking {
    border-top: 4px solid #e63946;
  }
`;

const StyledItemTitle = styled(NewsFeed.ItemTitle)`
  font-family: 'Georgia', serif;
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #1d3557;
`;

const StyledItemImage = styled(NewsFeed.ItemImage)`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const StyledItemContent = styled(NewsFeed.ItemContent)`
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
`;

const StyledItemTag = styled(NewsFeed.ItemTag)`
  background-color: #f1faee;
  color: #1d3557;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-right: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #a8dadc;
  }
`;

function App() {
  return (
    <NewsFeed.Root initialItems={newsItems}>
      {/* Header and filters */}
      
      <NewsFeed.List>
        {({ filteredItems }) => (
          <>
            {filteredItems.map(item => (
              <StyledNewsItem key={item.id} item={item}>
                <StyledItemImage src={item.imageUrl} alt={item.imageAlt} />
                <div className="item-content-wrapper">
                  <StyledItemTitle>{item.title}</StyledItemTitle>
                  <StyledItemContent>{item.content}</StyledItemContent>
                  
                  <NewsFeed.ItemMeta>
                    <NewsFeed.ItemSource>{item.source}</NewsFeed.ItemSource>
                    <NewsFeed.ItemDate format="relative">{item.date}</NewsFeed.ItemDate>
                    
                    <NewsFeed.ItemTags>
                      {item.categories?.map(tag => (
                        <StyledItemTag key={tag} tag={tag} />
                      ))}
                    </NewsFeed.ItemTags>
                  </NewsFeed.ItemMeta>
                  
                  <NewsFeed.ItemActions>
                    {/* Custom action buttons */}
                  </NewsFeed.ItemActions>
                </div>
              </StyledNewsItem>
            ))}
          </>
        )}
      </NewsFeed.List>
      
      {/* Load more button */}
    </NewsFeed.Root>
  );
}
```

### Grouping News by Date

```jsx
import { NewsFeed } from '@pulseui/news-feed';

function App() {
  // Group news items by date
  const groupByDate = (item) => {
    const date = new Date(item.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    }
  };
  
  return (
    <NewsFeed.Root 
      initialItems={newsItems} 
      groupBy={groupByDate}
      initialSortOrder="newest"
    >
      {/* Filters and search */}
      
      <NewsFeed.List />
    </NewsFeed.Root>
  );
}
```

### Infinite Scrolling

```jsx
import { NewsFeed } from '@pulseui/news-feed';
import { useEffect, useRef, useCallback } from 'react';

function App() {
  const loadMoreRef = useRef(null);
  
  const loadMoreNews = async (page, filter, search, categories, sortOrder) => {
    // Fetch more news from your API
    const response = await fetch(`/api/news?page=${page}&filter=${filter}&search=${search}&categories=${categories.join(',')}&sort=${sortOrder}`);
    const data = await response.json();
    return data.items;
  };
  
  return (
    <NewsFeed.Root 
      initialItems={newsItems}
      infiniteScroll={true}
      onLoadMore={loadMoreNews}
    >
      {/* Filters and search */}
      
      <NewsFeed.List />
      
      <NewsFeed.Consumer>
        {({ loadMore, hasMore, isLoading }) => (
          <div ref={loadMoreRef}>
            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : hasMore ? (
              <button onClick={loadMore}>Load More</button>
            ) : (
              <div className="end-message">No more news</div>
            )}
          </div>
        )}
      </NewsFeed.Consumer>
    </NewsFeed.Root>
  );
}
```

## API Reference

### NewsFeed.Root

The main container component that provides context to all child components.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialItems` | `NewsItem[]` | `[]` | Initial list of news items |
| `initialFilter` | `string` | `''` | Initial filter value |
| `initialSearch` | `string` | `''` | Initial search query |
| `initialCategories` | `string[]` | `[]` | Initial category filters |
| `initialSortOrder` | `'newest' \| 'oldest' \| 'popular' \| 'trending'` | `'newest'` | Initial sort order |
| `initialPageSize` | `number` | `10` | Initial page size |
| `infiniteScroll` | `boolean` | `false` | Whether to enable infinite scrolling |
| `onItemClick` | `(item: NewsItem) => void` | - | Callback when a news item is clicked |
| `onLike` | `(item: NewsItem) => void` | - | Callback when a news item is liked |
| `onBookmark` | `(item: NewsItem) => void` | - | Callback when a news item is bookmarked |
| `onShare` | `(item: NewsItem) => void` | - | Callback when a news item is shared |
| `onComment` | `(item: NewsItem) => void` | - | Callback when a news item is commented on |
| `onLoadMore` | `(page: number, filter: string, search: string, categories: string[], sortOrder: string) => Promise<NewsItem[]>` | - | Callback when more items are loaded |
| `groupBy` | `(item: NewsItem) => string` | - | Function to group news items |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |

### NewsItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string \| number` | Yes | Unique identifier for the news item |
| `title` | `string` | Yes | The title of the news item |
| `content` | `string` | Yes | The content or summary of the news item |
| `fullContent` | `string` | No | The full content of the news item |
| `source` | `string` | No | The source of the news item |
| `author` | `string` | No | The author of the news item |
| `date` | `Date \| string` | Yes | The publication date of the news item |
| `imageUrl` | `string` | No | The URL of the news item image |
| `imageAlt` | `string` | No | Alt text for the news item image |
| `url` | `string` | No | The URL to the full news article |
| `categories` | `string[]` | No | Categories or tags for the news item |
| `featured` | `boolean` | No | Whether the news item is featured |
| `breaking` | `boolean` | No | Whether the news item is breaking news |
| `readingTime` | `number` | No | The estimated reading time in minutes |
| `commentCount` | `number` | No | The number of comments on the news item |
| `shareCount` | `number` | No | The number of shares of the news item |
| `likeCount` | `number` | No | The number of likes for the news item |
| `isLiked` | `boolean` | No | Whether the current user has liked the news item |
| `isBookmarked` | `boolean` | No | Whether the current user has bookmarked the news item |
| `metadata` | `Record<string, any>` | No | Custom metadata for the news item |

### Compound Components

| Component | Description |
|-----------|-------------|
| `NewsFeed.Filter` | Container for filter controls |
| `NewsFeed.Search` | Search input for filtering news items |
| `NewsFeed.Categories` | Container for category filters |
| `NewsFeed.Category` | Individual category filter button |
| `NewsFeed.Sort` | Dropdown for sorting news items |
| `NewsFeed.List` | Container for the list of news items |
| `NewsFeed.Group` | Container for a group of news items |
| `NewsFeed.GroupLabel` | Label for a group of news items |
| `NewsFeed.Item` | Individual news item |
| `NewsFeed.ItemTitle` | Title of a news item |
| `NewsFeed.ItemContent` | Content of a news item |
| `NewsFeed.ItemImage` | Image for a news item |
| `NewsFeed.ItemMeta` | Container for news item metadata |
| `NewsFeed.ItemSource` | Source of a news item |
| `NewsFeed.ItemDate` | Publication date of a news item |
| `NewsFeed.ItemTags` | Container for news item tags |
| `NewsFeed.ItemTag` | Individual tag for a news item |
| `NewsFeed.ItemActions` | Container for news item actions |
| `NewsFeed.ItemAction` | Individual action button for a news item |
| `NewsFeed.LoadMore` | Button to load more news items |
| `NewsFeed.Empty` | Empty state when no news items are found |
| `NewsFeed.Loading` | Loading state when news items are being loaded |
| `NewsFeed.Consumer` | Access the news feed context with render props |

## Accessibility

The NewsFeed component is built with accessibility in mind:

- Proper semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly content
- Color contrast considerations

## Best Practices

1. **Performance**: For large news feeds, use pagination or infinite scrolling to load items in batches.
2. **Responsive Design**: Adjust the layout and number of visible items based on screen size.
3. **Error Handling**: Implement proper error states when loading news fails.
4. **Loading States**: Show loading indicators during data fetching to improve user experience.
5. **Caching**: Consider implementing client-side caching for previously loaded news items.
6. **Sorting Options**: Provide relevant sorting options based on your content type.
7. **Filtering**: Allow users to filter news by categories that are relevant to your domain.
8. **Grouping**: Group news items in a way that makes sense for your content (by date, category, etc.).

## Browser Support

The NewsFeed component works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with appropriate polyfills)

## License

MIT
