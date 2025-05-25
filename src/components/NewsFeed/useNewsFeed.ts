import { useState, useCallback, useMemo } from 'react';

export interface NewsItem {
  /**
   * Unique identifier for the news item
   */
  id: string | number;
  
  /**
   * The title of the news item
   */
  title: string;
  
  /**
   * The content or summary of the news item
   */
  content: string;
  
  /**
   * The full content of the news item (optional)
   */
  fullContent?: string;
  
  /**
   * The source of the news item
   */
  source?: string;
  
  /**
   * The author of the news item
   */
  author?: string;
  
  /**
   * The publication date of the news item
   */
  date: Date | string;
  
  /**
   * The URL of the news item image
   */
  imageUrl?: string;
  
  /**
   * Alt text for the news item image
   */
  imageAlt?: string;
  
  /**
   * The URL to the full news article
   */
  url?: string;
  
  /**
   * Categories or tags for the news item
   */
  categories?: string[];
  
  /**
   * Whether the news item is featured
   */
  featured?: boolean;
  
  /**
   * Whether the news item is breaking news
   */
  breaking?: boolean;
  
  /**
   * The estimated reading time in minutes
   */
  readingTime?: number;
  
  /**
   * The number of comments on the news item
   */
  commentCount?: number;
  
  /**
   * The number of shares of the news item
   */
  shareCount?: number;
  
  /**
   * The number of likes for the news item
   */
  likeCount?: number;
  
  /**
   * Whether the current user has liked the news item
   */
  isLiked?: boolean;
  
  /**
   * Whether the current user has bookmarked the news item
   */
  isBookmarked?: boolean;
  
  /**
   * Custom metadata for the news item
   */
  metadata?: Record<string, any>;
}

export interface UseNewsFeedOptions {
  /**
   * Initial list of news items
   * @default []
   */
  initialItems?: NewsItem[];
  
  /**
   * Initial filter value
   * @default ''
   */
  initialFilter?: string;
  
  /**
   * Initial search query
   * @default ''
   */
  initialSearch?: string;
  
  /**
   * Initial category filter
   * @default []
   */
  initialCategories?: string[];
  
  /**
   * Initial sort order
   * @default 'newest'
   */
  initialSortOrder?: 'newest' | 'oldest' | 'popular' | 'trending';
  
  /**
   * Initial page size
   * @default 10
   */
  initialPageSize?: number;
  
  /**
   * Whether to enable infinite scrolling
   * @default false
   */
  infiniteScroll?: boolean;
  
  /**
   * Callback when a news item is clicked
   */
  onItemClick?: (item: NewsItem) => void;
  
  /**
   * Callback when a news item is liked
   */
  onLike?: (item: NewsItem) => void;
  
  /**
   * Callback when a news item is bookmarked
   */
  onBookmark?: (item: NewsItem) => void;
  
  /**
   * Callback when a news item is shared
   */
  onShare?: (item: NewsItem) => void;
  
  /**
   * Callback when a news item is commented on
   */
  onComment?: (item: NewsItem) => void;
  
  /**
   * Callback when more items are loaded
   */
  onLoadMore?: (page: number, filter: string, search: string, categories: string[], sortOrder: string) => Promise<NewsItem[]>;
  
  /**
   * Function to group news items
   */
  groupBy?: (item: NewsItem) => string;
}

export interface UseNewsFeedReturn {
  /**
   * The current list of news items
   */
  items: NewsItem[];
  
  /**
   * The filtered and sorted list of news items
   */
  filteredItems: NewsItem[];
  
  /**
   * The current filter value
   */
  filter: string;
  
  /**
   * Set the filter value
   */
  setFilter: (filter: string) => void;
  
  /**
   * The current search query
   */
  search: string;
  
  /**
   * Set the search query
   */
  setSearch: (search: string) => void;
  
  /**
   * The current category filters
   */
  categories: string[];
  
  /**
   * Add a category filter
   */
  addCategory: (category: string) => void;
  
  /**
   * Remove a category filter
   */
  removeCategory: (category: string) => void;
  
  /**
   * Clear all category filters
   */
  clearCategories: () => void;
  
  /**
   * The current sort order
   */
  sortOrder: 'newest' | 'oldest' | 'popular' | 'trending';
  
  /**
   * Set the sort order
   */
  setSortOrder: (sortOrder: 'newest' | 'oldest' | 'popular' | 'trending') => void;
  
  /**
   * The current page
   */
  page: number;
  
  /**
   * The current page size
   */
  pageSize: number;
  
  /**
   * Whether there are more items to load
   */
  hasMore: boolean;
  
  /**
   * Whether items are currently loading
   */
  isLoading: boolean;
  
  /**
   * Load more items
   */
  loadMore: () => Promise<void>;
  
  /**
   * Refresh the news feed
   */
  refresh: () => Promise<void>;
  
  /**
   * Handle a news item click
   */
  handleItemClick: (item: NewsItem) => void;
  
  /**
   * Toggle like for a news item
   */
  toggleLike: (item: NewsItem) => void;
  
  /**
   * Toggle bookmark for a news item
   */
  toggleBookmark: (item: NewsItem) => void;
  
  /**
   * Share a news item
   */
  shareItem: (item: NewsItem) => void;
  
  /**
   * Comment on a news item
   */
  commentItem: (item: NewsItem) => void;
  
  /**
   * Grouped news items (if groupBy is provided)
   */
  groupedItems: Record<string, NewsItem[]> | null;
  
  /**
   * All available categories from the news items
   */
  availableCategories: string[];
}

/**
 * Hook for managing a news feed with filtering, searching, sorting, and pagination
 */
export function useNewsFeed(options: UseNewsFeedOptions = {}): UseNewsFeedReturn {
  const {
    initialItems = [],
    initialFilter = '',
    initialSearch = '',
    initialCategories = [],
    initialSortOrder = 'newest',
    initialPageSize = 10,
    infiniteScroll = false,
    onItemClick,
    onLike,
    onBookmark,
    onShare,
    onComment,
    onLoadMore,
    groupBy
  } = options;
  
  // State
  const [items, setItems] = useState<NewsItem[]>(initialItems);
  const [filter, setFilter] = useState<string>(initialFilter);
  const [search, setSearch] = useState<string>(initialSearch);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'popular' | 'trending'>(initialSortOrder);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(initialPageSize);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get all available categories from items
  const availableCategories = useMemo(() => {
    const allCategories = new Set<string>();
    
    items.forEach(item => {
      if (item.categories && item.categories.length > 0) {
        item.categories.forEach(category => {
          allCategories.add(category);
        });
      }
    });
    
    return Array.from(allCategories).sort();
  }, [items]);
  
  // Filter and sort items
  const filteredItems = useMemo(() => {
    // Start with all items
    let result = [...items];
    
    // Apply filter
    if (filter) {
      result = result.filter(item => {
        // Filter logic depends on what the filter is for
        // This is just an example
        return item.source === filter;
      });
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(item => {
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.content.toLowerCase().includes(searchLower) ||
          (item.author && item.author.toLowerCase().includes(searchLower)) ||
          (item.source && item.source.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Apply category filters
    if (categories.length > 0) {
      result = result.filter(item => {
        if (!item.categories || item.categories.length === 0) {
          return false;
        }
        
        return categories.some(category => item.categories!.includes(category));
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'popular':
          const aPopularity = (a.likeCount || 0) + (a.commentCount || 0) + (a.shareCount || 0);
          const bPopularity = (b.likeCount || 0) + (b.commentCount || 0) + (b.shareCount || 0);
          return bPopularity - aPopularity;
        case 'trending':
          // Trending could be a more complex algorithm, but for simplicity:
          const aRecency = new Date(a.date).getTime();
          const bRecency = new Date(b.date).getTime();
          const aEngagement = (a.likeCount || 0) + (a.commentCount || 0) + (a.shareCount || 0);
          const bEngagement = (b.likeCount || 0) + (b.commentCount || 0) + (b.shareCount || 0);
          
          // Combine recency and engagement
          const aTrending = aRecency * 0.7 + aEngagement * 0.3;
          const bTrending = bRecency * 0.7 + bEngagement * 0.3;
          
          return bTrending - aTrending;
        default:
          return 0;
      }
    });
    
    return result;
  }, [items, filter, search, categories, sortOrder]);
  
  // Group items if groupBy function is provided
  const groupedItems = useMemo(() => {
    if (!groupBy) {
      return null;
    }
    
    const groups: Record<string, NewsItem[]> = {};
    
    filteredItems.forEach(item => {
      const groupKey = groupBy(item);
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(item);
    });
    
    return groups;
  }, [filteredItems, groupBy]);
  
  // Add a category filter
  const addCategory = useCallback((category: string) => {
    setCategories(prev => {
      if (prev.includes(category)) {
        return prev;
      }
      return [...prev, category];
    });
  }, []);
  
  // Remove a category filter
  const removeCategory = useCallback((category: string) => {
    setCategories(prev => prev.filter(c => c !== category));
  }, []);
  
  // Clear all category filters
  const clearCategories = useCallback(() => {
    setCategories([]);
  }, []);
  
  // Load more items
  const loadMore = useCallback(async () => {
    if (!onLoadMore || isLoading || !hasMore) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const nextPage = page + 1;
      const newItems = await onLoadMore(nextPage, filter, search, categories, sortOrder);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems(prev => [...prev, ...newItems]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more news items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onLoadMore, isLoading, hasMore, page, filter, search, categories, sortOrder]);
  
  // Refresh the news feed
  const refresh = useCallback(async () => {
    if (!onLoadMore) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newItems = await onLoadMore(1, filter, search, categories, sortOrder);
      setItems(newItems);
      setPage(1);
      setHasMore(newItems.length >= pageSize);
    } catch (error) {
      console.error('Error refreshing news feed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onLoadMore, filter, search, categories, sortOrder, pageSize]);
  
  // Handle a news item click
  const handleItemClick = useCallback((item: NewsItem) => {
    if (onItemClick) {
      onItemClick(item);
    }
  }, [onItemClick]);
  
  // Toggle like for a news item
  const toggleLike = useCallback((item: NewsItem) => {
    setItems(prev => {
      return prev.map(i => {
        if (i.id === item.id) {
          const isLiked = !i.isLiked;
          const likeCount = (i.likeCount || 0) + (isLiked ? 1 : -1);
          
          return {
            ...i,
            isLiked,
            likeCount
          };
        }
        return i;
      });
    });
    
    if (onLike) {
      onLike(item);
    }
  }, [onLike]);
  
  // Toggle bookmark for a news item
  const toggleBookmark = useCallback((item: NewsItem) => {
    setItems(prev => {
      return prev.map(i => {
        if (i.id === item.id) {
          return {
            ...i,
            isBookmarked: !i.isBookmarked
          };
        }
        return i;
      });
    });
    
    if (onBookmark) {
      onBookmark(item);
    }
  }, [onBookmark]);
  
  // Share a news item
  const shareItem = useCallback((item: NewsItem) => {
    setItems(prev => {
      return prev.map(i => {
        if (i.id === item.id) {
          return {
            ...i,
            shareCount: (i.shareCount || 0) + 1
          };
        }
        return i;
      });
    });
    
    if (onShare) {
      onShare(item);
    }
  }, [onShare]);
  
  // Comment on a news item
  const commentItem = useCallback((item: NewsItem) => {
    if (onComment) {
      onComment(item);
    }
  }, [onComment]);
  
  return {
    items,
    filteredItems,
    filter,
    setFilter,
    search,
    setSearch,
    categories,
    addCategory,
    removeCategory,
    clearCategories,
    sortOrder,
    setSortOrder,
    page,
    pageSize,
    hasMore,
    isLoading,
    loadMore,
    refresh,
    handleItemClick,
    toggleLike,
    toggleBookmark,
    shareItem,
    commentItem,
    groupedItems,
    availableCategories
  };
}

export default useNewsFeed;
