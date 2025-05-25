import { useState, useCallback, useEffect } from 'react';

export type ActivityItemType = 
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'system'
  | 'user'
  | 'custom';

export interface ActivityItem {
  /**
   * Unique identifier for the activity item
   */
  id: string | number;
  
  /**
   * The type of activity
   */
  type?: ActivityItemType;
  
  /**
   * The title or heading of the activity
   */
  title?: string;
  
  /**
   * The content or description of the activity
   */
  content: string;
  
  /**
   * The timestamp of the activity
   */
  timestamp: Date | string | number;
  
  /**
   * The actor who performed the activity
   */
  actor?: {
    id: string | number;
    name: string;
    avatar?: string;
    url?: string;
  };
  
  /**
   * The target of the activity
   */
  target?: {
    id: string | number;
    name: string;
    url?: string;
  };
  
  /**
   * Whether the activity has been read
   */
  read?: boolean;
  
  /**
   * Whether the activity is pinned
   */
  pinned?: boolean;
  
  /**
   * Custom metadata for the activity
   */
  metadata?: Record<string, any>;
  
  /**
   * Actions that can be performed on the activity
   */
  actions?: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: (item: ActivityItem) => void;
  }>;
}

export interface UseActivityFeedOptions {
  /**
   * Initial activity items
   */
  initialItems?: ActivityItem[];
  
  /**
   * Whether to group items by date
   * @default true
   */
  groupByDate?: boolean;
  
  /**
   * The format for date groups
   * @default 'date' ('today', 'yesterday', or date string)
   */
  dateGroupFormat?: 'date' | 'relative' | 'custom';
  
  /**
   * Custom date formatter for groups
   */
  customDateFormatter?: (date: Date) => string;
  
  /**
   * Whether to show the newest items first
   * @default true
   */
  newestFirst?: boolean;
  
  /**
   * The maximum number of items to display
   */
  maxItems?: number;
  
  /**
   * Whether to show a load more button
   * @default true
   */
  showLoadMore?: boolean;
  
  /**
   * The number of items to load per page
   * @default 10
   */
  itemsPerPage?: number;
  
  /**
   * Whether to mark items as read when they are viewed
   * @default true
   */
  markAsReadOnView?: boolean;
  
  /**
   * Whether to allow filtering by type
   * @default true
   */
  allowFiltering?: boolean;
  
  /**
   * Whether to allow searching
   * @default true
   */
  allowSearch?: boolean;
  
  /**
   * Callback when an item is clicked
   */
  onItemClick?: (item: ActivityItem) => void;
  
  /**
   * Callback when an item is marked as read
   */
  onItemRead?: (item: ActivityItem) => void;
  
  /**
   * Callback when new items are loaded
   */
  onLoadMore?: (page: number) => Promise<ActivityItem[]>;
}

export interface DateGroup {
  /**
   * The date for the group
   */
  date: Date;
  
  /**
   * The formatted date string
   */
  label: string;
  
  /**
   * The items in the group
   */
  items: ActivityItem[];
}

export interface UseActivityFeedReturn {
  /**
   * All activity items
   */
  items: ActivityItem[];
  
  /**
   * Filtered activity items
   */
  filteredItems: ActivityItem[];
  
  /**
   * Activity items grouped by date
   */
  groupedItems: DateGroup[];
  
  /**
   * The current page
   */
  currentPage: number;
  
  /**
   * Whether there are more items to load
   */
  hasMore: boolean;
  
  /**
   * Whether items are currently loading
   */
  isLoading: boolean;
  
  /**
   * The current filter type
   */
  filterType: ActivityItemType | 'all';
  
  /**
   * The current search query
   */
  searchQuery: string;
  
  /**
   * Add a new activity item
   */
  addItem: (item: ActivityItem) => void;
  
  /**
   * Remove an activity item
   */
  removeItem: (id: string | number) => void;
  
  /**
   * Mark an activity item as read
   */
  markAsRead: (id: string | number) => void;
  
  /**
   * Mark all activity items as read
   */
  markAllAsRead: () => void;
  
  /**
   * Pin an activity item
   */
  pinItem: (id: string | number) => void;
  
  /**
   * Unpin an activity item
   */
  unpinItem: (id: string | number) => void;
  
  /**
   * Load more activity items
   */
  loadMore: () => Promise<void>;
  
  /**
   * Set the filter type
   */
  setFilterType: (type: ActivityItemType | 'all') => void;
  
  /**
   * Set the search query
   */
  setSearchQuery: (query: string) => void;
  
  /**
   * Get props for the activity feed container
   */
  getFeedProps: () => {
    role: string;
    'aria-live': string;
    'aria-atomic': string;
    'aria-relevant': string;
  };
  
  /**
   * Get props for an activity item
   */
  getItemProps: (item: ActivityItem) => {
    id: string;
    role: string;
    tabIndex: number;
    'aria-describedby': string;
    onClick: () => void;
  };
}

/**
 * Hook for creating an activity feed with filtering, grouping, and pagination
 */
export function useActivityFeed(options: UseActivityFeedOptions = {}): UseActivityFeedReturn {
  const {
    initialItems = [],
    groupByDate = true,
    dateGroupFormat = 'date',
    customDateFormatter,
    newestFirst = true,
    maxItems,
    showLoadMore = true,
    itemsPerPage = 10,
    markAsReadOnView = true,
    allowFiltering = true,
    allowSearch = true,
    onItemClick,
    onItemRead,
    onLoadMore,
  } = options;
  
  // State
  const [items, setItems] = useState<ActivityItem[]>(initialItems);
  const [filterType, setFilterType] = useState<ActivityItemType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Filter items based on type and search query
  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = !searchQuery || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });
  
  // Apply sorting and pagination
  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return newestFirst ? dateB - dateA : dateA - dateB;
  });
  
  const paginatedItems = maxItems ? sortedItems.slice(0, maxItems) : sortedItems;
  
  // Group items by date
  const groupedItems: DateGroup[] = groupByDate
    ? paginatedItems.reduce((groups: DateGroup[], item) => {
        const date = new Date(item.timestamp);
        date.setHours(0, 0, 0, 0);
        
        // Format the date label
        let label = '';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (dateGroupFormat === 'date') {
          if (date.getTime() === today.getTime()) {
            label = 'Today';
          } else if (date.getTime() === yesterday.getTime()) {
            label = 'Yesterday';
          } else {
            label = date.toLocaleDateString();
          }
        } else if (dateGroupFormat === 'relative') {
          const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) {
            label = 'Today';
          } else if (diffDays === 1) {
            label = 'Yesterday';
          } else if (diffDays < 7) {
            label = `${diffDays} days ago`;
          } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            label = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
          } else {
            label = date.toLocaleDateString();
          }
        } else if (dateGroupFormat === 'custom' && customDateFormatter) {
          label = customDateFormatter(date);
        }
        
        // Find or create the group
        const existingGroup = groups.find((group) => group.date.getTime() === date.getTime());
        
        if (existingGroup) {
          existingGroup.items.push(item);
        } else {
          groups.push({
            date,
            label,
            items: [item],
          });
        }
        
        return groups;
      }, [])
    : [{ date: new Date(), label: '', items: paginatedItems }];
  
  // Add a new activity item
  const addItem = useCallback((item: ActivityItem) => {
    setItems((prevItems) => [item, ...prevItems]);
  }, []);
  
  // Remove an activity item
  const removeItem = useCallback((id: string | number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);
  
  // Mark an activity item as read
  const markAsRead = useCallback((id: string | number) => {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, read: true } : item
      )
    );
    
    const item = items.find((item) => item.id === id);
    if (item && onItemRead) {
      onItemRead({ ...item, read: true });
    }
  }, [items, onItemRead]);
  
  // Mark all activity items as read
  const markAllAsRead = useCallback(() => {
    setItems((prevItems) => 
      prevItems.map((item) => ({ ...item, read: true }))
    );
    
    items.forEach((item) => {
      if (!item.read && onItemRead) {
        onItemRead({ ...item, read: true });
      }
    });
  }, [items, onItemRead]);
  
  // Pin an activity item
  const pinItem = useCallback((id: string | number) => {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, pinned: true } : item
      )
    );
  }, []);
  
  // Unpin an activity item
  const unpinItem = useCallback((id: string | number) => {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, pinned: false } : item
      )
    );
  }, []);
  
  // Load more activity items
  const loadMore = useCallback(async () => {
    if (!onLoadMore || isLoading || !hasMore) return;
    
    setIsLoading(true);
    
    try {
      const nextPage = currentPage + 1;
      const newItems = await onLoadMore(nextPage);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => [...prevItems, ...newItems]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, hasMore, isLoading, onLoadMore]);
  
  // Get props for the activity feed container
  const getFeedProps = useCallback(() => ({
    role: 'log',
    'aria-live': 'polite',
    'aria-atomic': 'false',
    'aria-relevant': 'additions',
  }), []);
  
  // Get props for an activity item
  const getItemProps = useCallback((item: ActivityItem) => ({
    id: `activity-item-${item.id}`,
    role: 'article',
    tabIndex: 0,
    'aria-describedby': `activity-item-${item.id}-content`,
    onClick: () => {
      if (markAsReadOnView && !item.read) {
        markAsRead(item.id);
      }
      
      if (onItemClick) {
        onItemClick(item);
      }
    },
  }), [markAsRead, markAsReadOnView, onItemClick]);
  
  // Effect to limit the number of items
  useEffect(() => {
    if (maxItems && items.length > maxItems) {
      setItems((prevItems) => prevItems.slice(0, maxItems));
    }
  }, [maxItems, items.length]);
  
  return {
    items,
    filteredItems: paginatedItems,
    groupedItems,
    currentPage,
    hasMore,
    isLoading,
    filterType,
    searchQuery,
    addItem,
    removeItem,
    markAsRead,
    markAllAsRead,
    pinItem,
    unpinItem,
    loadMore,
    setFilterType,
    setSearchQuery,
    getFeedProps,
    getItemProps,
  };
}

export default useActivityFeed;
