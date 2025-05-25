import React, { createContext, useContext, forwardRef } from 'react';
import styled from 'styled-components';
import useNewsFeed, { UseNewsFeedOptions, UseNewsFeedReturn, NewsItem } from './useNewsFeed';

// Create context for the news feed
export const NewsFeedContext = createContext<UseNewsFeedReturn | null>(null);

// Hook to use news feed context
export const useNewsFeedContext = () => {
  const context = useContext(NewsFeedContext);
  if (!context) {
    throw new Error('useNewsFeedContext must be used within a NewsFeed.Root component');
  }
  return context;
};

// Types for the compound components
export interface NewsFeedRootProps extends React.HTMLAttributes<HTMLDivElement>, UseNewsFeedOptions {
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the filter container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedSearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /**
   * The component used for the search input
   * @default 'input'
   */
  as?: React.ElementType;
  
  /**
   * Placeholder text for the search input
   * @default 'Search news...'
   */
  placeholder?: string;
  
  /**
   * Whether to enable auto search (search as you type)
   * @default true
   */
  autoSearch?: boolean;
  
  /**
   * Delay in milliseconds for auto search
   * @default 300
   */
  autoSearchDelay?: number;
}

export interface NewsFeedCategoriesProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the categories container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedCategoryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the category button
   * @default 'button'
   */
  as?: React.ElementType;
  
  /**
   * The category name
   */
  category: string;
}

export interface NewsFeedSortProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * The component used for the sort select
   * @default 'select'
   */
  as?: React.ElementType;
}

export interface NewsFeedListProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the list container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the group container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The group name
   */
  groupName: string;
}

export interface NewsFeedGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the group label
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the item container
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * The news item
   */
  item: NewsItem;
}

export interface NewsFeedItemTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * The component used for the item title
   * @default 'h3'
   */
  as?: React.ElementType;
}

export interface NewsFeedItemContentProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * The component used for the item content
   * @default 'p'
   */
  as?: React.ElementType;
  
  /**
   * Whether to truncate the content
   * @default true
   */
  truncate?: boolean;
  
  /**
   * Maximum number of lines to show when truncated
   * @default 3
   */
  maxLines?: number;
}

export interface NewsFeedItemImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * The component used for the item image
   * @default 'img'
   */
  as?: React.ElementType;
}

export interface NewsFeedItemMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the item meta container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedItemSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the item source
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedItemDateProps extends React.HTMLAttributes<HTMLTimeElement> {
  /**
   * The component used for the item date
   * @default 'time'
   */
  as?: React.ElementType;
  
  /**
   * Date format
   * @default 'relative'
   */
  format?: 'relative' | 'full' | 'short';
}

export interface NewsFeedItemTagsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the item tags container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedItemTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The component used for the item tag
   * @default 'span'
   */
  as?: React.ElementType;
  
  /**
   * The tag name
   */
  tag: string;
}

export interface NewsFeedItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the item actions container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedItemActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the item action button
   * @default 'button'
   */
  as?: React.ElementType;
  
  /**
   * The action type
   */
  action: 'like' | 'bookmark' | 'share' | 'comment';
  
  /**
   * The news item
   */
  item: NewsItem;
}

export interface NewsFeedLoadMoreProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the load more button
   * @default 'button'
   */
  as?: React.ElementType;
}

export interface NewsFeedEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the empty state container
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface NewsFeedLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the loading state container
   * @default 'div'
   */
  as?: React.ElementType;
}

// Root component
const Root = forwardRef<HTMLDivElement, NewsFeedRootProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    // Extract news feed options from props
    const {
      initialItems,
      initialFilter,
      initialSearch,
      initialCategories,
      initialSortOrder,
      initialPageSize,
      infiniteScroll,
      onItemClick,
      onLike,
      onBookmark,
      onShare,
      onComment,
      onLoadMore,
      groupBy,
      ...restProps
    } = props;
    
    // Use the news feed hook
    const newsFeedState = useNewsFeed({
      initialItems,
      initialFilter,
      initialSearch,
      initialCategories,
      initialSortOrder,
      initialPageSize,
      infiniteScroll,
      onItemClick,
      onLike,
      onBookmark,
      onShare,
      onComment,
      onLoadMore,
      groupBy,
    });
    
    return (
      <NewsFeedContext.Provider value={newsFeedState}>
        <Component
          ref={ref}
          className={`strive-news-feed ${className}`}
          {...restProps}
        >
          {children}
        </Component>
      </NewsFeedContext.Provider>
    );
  }
);

Root.displayName = 'NewsFeed.Root';

// Filter component
const Filter = forwardRef<HTMLDivElement, NewsFeedFilterProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-filter ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Filter.displayName = 'NewsFeed.Filter';

// Search component
const Search = forwardRef<HTMLInputElement, NewsFeedSearchProps>(
  ({ 
    as: Component = 'input', 
    className = '', 
    placeholder = 'Search news...', 
    autoSearch = true, 
    autoSearchDelay = 300,
    ...props 
  }, ref) => {
    const { search, setSearch } = useNewsFeedContext();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (autoSearch) {
        // Debounce search
        const timeoutId = setTimeout(() => {
          setSearch(e.target.value);
        }, autoSearchDelay);
        
        return () => clearTimeout(timeoutId);
      } else {
        setSearch(e.target.value);
      }
    };
    
    return (
      <Component
        ref={ref}
        type="search"
        className={`strive-news-feed-search ${className}`}
        placeholder={placeholder}
        value={search}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

Search.displayName = 'NewsFeed.Search';

// Categories component
const Categories = forwardRef<HTMLDivElement, NewsFeedCategoriesProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { availableCategories } = useNewsFeedContext();
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-categories ${className}`}
        {...props}
      >
        {children || (
          <>
            {availableCategories.map((category) => (
              <Category key={category} category={category} />
            ))}
          </>
        )}
      </Component>
    );
  }
);

Categories.displayName = 'NewsFeed.Categories';

// Category component
const Category = forwardRef<HTMLButtonElement, NewsFeedCategoryProps>(
  ({ as: Component = 'button', category, className = '', ...props }, ref) => {
    const { categories, addCategory, removeCategory } = useNewsFeedContext();
    const isActive = categories.includes(category);
    
    const handleClick = () => {
      if (isActive) {
        removeCategory(category);
      } else {
        addCategory(category);
      }
    };
    
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-news-feed-category ${isActive ? 'active' : ''} ${className}`}
        onClick={handleClick}
        aria-pressed={isActive}
        {...props}
      >
        {category}
      </Component>
    );
  }
);

Category.displayName = 'NewsFeed.Category';

// Sort component
const Sort = forwardRef<HTMLSelectElement, NewsFeedSortProps>(
  ({ as: Component = 'select', children, className = '', ...props }, ref) => {
    const { sortOrder, setSortOrder } = useNewsFeedContext();
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSortOrder(e.target.value as any);
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-sort ${className}`}
        value={sortOrder}
        onChange={handleChange}
        {...props}
      >
        {children || (
          <>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Popular</option>
            <option value="trending">Trending</option>
          </>
        )}
      </Component>
    );
  }
);

Sort.displayName = 'NewsFeed.Sort';

// List component
const List = forwardRef<HTMLDivElement, NewsFeedListProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { filteredItems, groupedItems } = useNewsFeedContext();
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-list ${className}`}
        {...props}
      >
        {children || (
          <>
            {groupedItems ? (
              // Render grouped items
              Object.entries(groupedItems).map(([groupName, items]) => (
                <Group key={groupName} groupName={groupName}>
                  <GroupLabel>{groupName}</GroupLabel>
                  {items.map((item) => (
                    <Item key={item.id} item={item} />
                  ))}
                </Group>
              ))
            ) : (
              // Render flat list
              filteredItems.map((item) => (
                <Item key={item.id} item={item} />
              ))
            )}
          </>
        )}
      </Component>
    );
  }
);

List.displayName = 'NewsFeed.List';

// Group component
const Group = forwardRef<HTMLDivElement, NewsFeedGroupProps>(
  ({ as: Component = 'div', groupName, children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-group ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Group.displayName = 'NewsFeed.Group';

// Group label component
const GroupLabel = forwardRef<HTMLDivElement, NewsFeedGroupLabelProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-group-label ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

GroupLabel.displayName = 'NewsFeed.GroupLabel';

// Item component
const Item = forwardRef<HTMLDivElement, NewsFeedItemProps>(
  ({ as: Component = 'div', item, children, className = '', ...props }, ref) => {
    const { handleItemClick } = useNewsFeedContext();
    
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      // Only trigger if the click wasn't on an action button or link
      if (
        e.target instanceof Element && 
        !e.target.closest('button') && 
        !e.target.closest('a')
      ) {
        handleItemClick(item);
        
        // If there's a URL, navigate to it
        if (item.url) {
          window.open(item.url, '_blank', 'noopener,noreferrer');
        }
      }
      
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item ${item.featured ? 'featured' : ''} ${item.breaking ? 'breaking' : ''} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children || (
          <>
            {item.imageUrl && (
              <ItemImage src={item.imageUrl} alt={item.imageAlt || ''} />
            )}
            
            <div className="strive-news-feed-item-body">
              <ItemTitle>{item.title}</ItemTitle>
              <ItemContent>{item.content}</ItemContent>
              
              <ItemMeta>
                {item.source && <ItemSource>{item.source}</ItemSource>}
                {item.date && <ItemDate>{item.date}</ItemDate>}
                
                {item.categories && item.categories.length > 0 && (
                  <ItemTags>
                    {item.categories.map((tag) => (
                      <ItemTag key={tag} tag={tag} />
                    ))}
                  </ItemTags>
                )}
              </ItemMeta>
              
              <ItemActions>
                <ItemAction action="like" item={item}>
                  {item.isLiked ? 'Liked' : 'Like'} {item.likeCount ? `(${item.likeCount})` : ''}
                </ItemAction>
                
                <ItemAction action="comment" item={item}>
                  Comment {item.commentCount ? `(${item.commentCount})` : ''}
                </ItemAction>
                
                <ItemAction action="share" item={item}>
                  Share {item.shareCount ? `(${item.shareCount})` : ''}
                </ItemAction>
                
                <ItemAction action="bookmark" item={item}>
                  {item.isBookmarked ? 'Saved' : 'Save'}
                </ItemAction>
              </ItemActions>
            </div>
          </>
        )}
      </Component>
    );
  }
);

Item.displayName = 'NewsFeed.Item';

// Item title component
const ItemTitle = forwardRef<HTMLHeadingElement, NewsFeedItemTitleProps>(
  ({ as: Component = 'h3', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-title ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ItemTitle.displayName = 'NewsFeed.ItemTitle';

// Item content component
const ItemContent = forwardRef<HTMLParagraphElement, NewsFeedItemContentProps>(
  ({ as: Component = 'p', children, className = '', truncate = true, maxLines = 3, ...props }, ref) => {
    const style = truncate ? {
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    } : {};
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-content ${className}`}
        style={style}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ItemContent.displayName = 'NewsFeed.ItemContent';

// Item image component
const ItemImage = forwardRef<HTMLImageElement, NewsFeedItemImageProps>(
  ({ as: Component = 'img', className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-image ${className}`}
        loading="lazy"
        {...props}
      />
    );
  }
);

ItemImage.displayName = 'NewsFeed.ItemImage';

// Item meta component
const ItemMeta = forwardRef<HTMLDivElement, NewsFeedItemMetaProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-meta ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ItemMeta.displayName = 'NewsFeed.ItemMeta';

// Item source component
const ItemSource = forwardRef<HTMLDivElement, NewsFeedItemSourceProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-source ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ItemSource.displayName = 'NewsFeed.ItemSource';

// Item date component
const ItemDate = forwardRef<HTMLTimeElement, NewsFeedItemDateProps>(
  ({ as: Component = 'time', children, className = '', format = 'relative', ...props }, ref) => {
    // Format date based on the format prop
    const formatDate = (date: string | Date) => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      switch (format) {
        case 'relative':
          // Simple relative time formatting
          const now = new Date();
          const diffMs = now.getTime() - dateObj.getTime();
          const diffSec = Math.floor(diffMs / 1000);
          const diffMin = Math.floor(diffSec / 60);
          const diffHour = Math.floor(diffMin / 60);
          const diffDay = Math.floor(diffHour / 24);
          
          if (diffSec < 60) return 'just now';
          if (diffMin < 60) return `${diffMin}m ago`;
          if (diffHour < 24) return `${diffHour}h ago`;
          if (diffDay < 7) return `${diffDay}d ago`;
          
          return dateObj.toLocaleDateString();
          
        case 'full':
          return dateObj.toLocaleString();
          
        case 'short':
          return dateObj.toLocaleDateString();
          
        default:
          return String(date);
      }
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-date ${className}`}
        dateTime={typeof children === 'string' ? children : undefined}
        {...props}
      >
        {typeof children === 'string' || children instanceof Date 
          ? formatDate(children) 
          : children}
      </Component>
    );
  }
);

ItemDate.displayName = 'NewsFeed.ItemDate';

// Item tags component
const ItemTags = forwardRef<HTMLDivElement, NewsFeedItemTagsProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-tags ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ItemTags.displayName = 'NewsFeed.ItemTags';

// Item tag component
const ItemTag = forwardRef<HTMLSpanElement, NewsFeedItemTagProps>(
  ({ as: Component = 'span', tag, className = '', ...props }, ref) => {
    const { addCategory } = useNewsFeedContext();
    
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      addCategory(tag);
      
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-tag ${className}`}
        onClick={handleClick}
        {...props}
      >
        {tag}
      </Component>
    );
  }
);

ItemTag.displayName = 'NewsFeed.ItemTag';

// Item actions component
const ItemActions = forwardRef<HTMLDivElement, NewsFeedItemActionsProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-item-actions ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ItemActions.displayName = 'NewsFeed.ItemActions';

// Item action component
const ItemAction = forwardRef<HTMLButtonElement, NewsFeedItemActionProps>(
  ({ as: Component = 'button', action, item, children, className = '', ...props }, ref) => {
    const { toggleLike, toggleBookmark, shareItem, commentItem } = useNewsFeedContext();
    
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      
      switch (action) {
        case 'like':
          toggleLike(item);
          break;
        case 'bookmark':
          toggleBookmark(item);
          break;
        case 'share':
          shareItem(item);
          break;
        case 'comment':
          commentItem(item);
          break;
      }
      
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    // Determine if the action is active
    const isActive = action === 'like' ? item.isLiked : action === 'bookmark' ? item.isBookmarked : false;
    
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-news-feed-item-action strive-news-feed-item-action-${action} ${isActive ? 'active' : ''} ${className}`}
        onClick={handleClick}
        aria-pressed={isActive}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ItemAction.displayName = 'NewsFeed.ItemAction';

// Load more component
const LoadMore = forwardRef<HTMLButtonElement, NewsFeedLoadMoreProps>(
  ({ as: Component = 'button', children, className = '', ...props }, ref) => {
    const { loadMore, hasMore, isLoading } = useNewsFeedContext();
    
    return (
      <Component
        ref={ref}
        type="button"
        className={`strive-news-feed-load-more ${className}`}
        onClick={loadMore}
        disabled={!hasMore || isLoading}
        {...props}
      >
        {children || (isLoading ? 'Loading...' : hasMore ? 'Load More' : 'No More News')}
      </Component>
    );
  }
);

LoadMore.displayName = 'NewsFeed.LoadMore';

// Empty component
const Empty = forwardRef<HTMLDivElement, NewsFeedEmptyProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { filteredItems } = useNewsFeedContext();
    
    if (filteredItems.length > 0) {
      return null;
    }
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-empty ${className}`}
        {...props}
      >
        {children || 'No news found.'}
      </Component>
    );
  }
);

Empty.displayName = 'NewsFeed.Empty';

// Loading component
const Loading = forwardRef<HTMLDivElement, NewsFeedLoadingProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const { isLoading } = useNewsFeedContext();
    
    if (!isLoading) {
      return null;
    }
    
    return (
      <Component
        ref={ref}
        className={`strive-news-feed-loading ${className}`}
        {...props}
      >
        {children || 'Loading news...'}
      </Component>
    );
  }
);

Loading.displayName = 'NewsFeed.Loading';

// Consumer component for accessing the context in render props pattern
const Consumer = ({ children }: { children: (context: UseNewsFeedReturn) => React.ReactNode }) => {
  const context = useNewsFeedContext();
  return <>{children(context)}</>;
};

Consumer.displayName = 'NewsFeed.Consumer';

// Assemble the compound component
export const NewsFeed = {
  Root,
  Filter,
  Search,
  Categories,
  Category,
  Sort,
  List,
  Group,
  GroupLabel,
  Item,
  ItemTitle,
  ItemContent,
  ItemImage,
  ItemMeta,
  ItemSource,
  ItemDate,
  ItemTags,
  ItemTag,
  ItemActions,
  ItemAction,
  LoadMore,
  Empty,
  Loading,
  Consumer,
  useNewsFeed,
};

export default NewsFeed;
