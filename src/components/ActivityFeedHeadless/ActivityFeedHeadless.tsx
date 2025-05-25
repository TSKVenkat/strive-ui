import React, { createContext, useContext, forwardRef } from 'react';
import useActivityFeed, { 
  UseActivityFeedOptions, 
  UseActivityFeedReturn,
  ActivityItem,
  ActivityItemType,
  DateGroup
} from './useActivityFeed';

// Create context for the activity feed
export const ActivityFeedContext = createContext<UseActivityFeedReturn | null>(null);

// Hook to use activity feed context
export const useActivityFeedContext = () => {
  const context = useContext(ActivityFeedContext);
  if (!context) {
    throw new Error('useActivityFeedContext must be used within an ActivityFeedHeadless.Root component');
  }
  return context;
};

// Types for the compound components
export interface ActivityFeedRootProps extends React.HTMLAttributes<HTMLDivElement>, UseActivityFeedOptions {
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The date group to render
   */
  group: DateGroup;
  
  /**
   * The component used for the group node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The date group to render the label for
   */
  group: DateGroup;
  
  /**
   * The component used for the label node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The activity item to render
   */
  item: ActivityItem;
  
  /**
   * The component used for the item node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedItemContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The activity item to render the content for
   */
  item: ActivityItem;
  
  /**
   * The component used for the content node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedItemActorProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The activity item to render the actor for
   */
  item: ActivityItem;
  
  /**
   * The component used for the actor node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedItemTimeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The activity item to render the time for
   */
  item: ActivityItem;
  
  /**
   * Whether to use relative time (e.g., "2 hours ago")
   * @default true
   */
  relative?: boolean;
  
  /**
   * Custom time formatter
   */
  formatter?: (date: Date) => string;
  
  /**
   * The component used for the time node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The activity item to render the actions for
   */
  item: ActivityItem;
  
  /**
   * The component used for the actions node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The available filter types
   * @default ['all', 'default', 'info', 'success', 'warning', 'error', 'system', 'user']
   */
  types?: Array<ActivityItemType | 'all'>;
  
  /**
   * The component used for the filter node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedSearchProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Placeholder text for the search input
   * @default 'Search activities...'
   */
  placeholder?: string;
  
  /**
   * The component used for the search node
   * @default 'div'
   */
  as?: React.ElementType;
}

export interface ActivityFeedLoadMoreProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The component used for the load more node
   * @default 'button'
   */
  as?: React.ElementType;
}

export interface ActivityFeedEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The component used for the empty node
   * @default 'div'
   */
  as?: React.ElementType;
}

// Root component
const Root = forwardRef<HTMLDivElement, ActivityFeedRootProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    // Extract activity feed options from props
    const {
      initialItems,
      groupByDate,
      dateGroupFormat,
      customDateFormatter,
      newestFirst,
      maxItems,
      showLoadMore,
      itemsPerPage,
      markAsReadOnView,
      allowFiltering,
      allowSearch,
      onItemClick,
      onItemRead,
      onLoadMore,
      ...restProps
    } = props;
    
    // Use the activity feed hook
    const activityFeedState = useActivityFeed({
      initialItems,
      groupByDate,
      dateGroupFormat,
      customDateFormatter,
      newestFirst,
      maxItems,
      showLoadMore,
      itemsPerPage,
      markAsReadOnView,
      allowFiltering,
      allowSearch,
      onItemClick,
      onItemRead,
      onLoadMore,
    });
    
    // Get feed props from the hook
    const feedProps = activityFeedState.getFeedProps();
    
    return (
      <ActivityFeedContext.Provider value={activityFeedState}>
        <Component
          ref={ref}
          className={`strive-activity-feed ${className}`}
          {...feedProps}
          {...restProps}
        >
          {children}
        </Component>
      </ActivityFeedContext.Provider>
    );
  }
);

Root.displayName = 'ActivityFeedHeadless.Root';

// Group component
const Group = forwardRef<HTMLDivElement, ActivityFeedGroupProps>(
  ({ as: Component = 'div', group, children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-group ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Group.displayName = 'ActivityFeedHeadless.Group';

// Group label component
const GroupLabel = forwardRef<HTMLDivElement, ActivityFeedGroupLabelProps>(
  ({ as: Component = 'div', group, children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-group-label ${className}`}
        {...props}
      >
        {children || group.label}
      </Component>
    );
  }
);

GroupLabel.displayName = 'ActivityFeedHeadless.GroupLabel';

// Item component
const Item = forwardRef<HTMLDivElement, ActivityFeedItemProps>(
  ({ as: Component = 'div', item, children, className = '', ...props }, ref) => {
    const activityFeed = useActivityFeedContext();
    const itemProps = activityFeed.getItemProps(item);
    
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-item ${item.type || 'default'} ${item.read ? 'read' : 'unread'} ${item.pinned ? 'pinned' : ''} ${className}`}
        data-type={item.type || 'default'}
        data-read={item.read}
        data-pinned={item.pinned}
        {...itemProps}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Item.displayName = 'ActivityFeedHeadless.Item';

// Item content component
const ItemContent = forwardRef<HTMLDivElement, ActivityFeedItemContentProps>(
  ({ as: Component = 'div', item, children, className = '', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-item-content ${className}`}
        id={`activity-item-${item.id}-content`}
        {...props}
      >
        {children || (
          <>
            {item.title && <div className="strive-activity-feed-item-title">{item.title}</div>}
            <div className="strive-activity-feed-item-description">{item.content}</div>
          </>
        )}
      </Component>
    );
  }
);

ItemContent.displayName = 'ActivityFeedHeadless.ItemContent';

// Item actor component
const ItemActor = forwardRef<HTMLDivElement, ActivityFeedItemActorProps>(
  ({ as: Component = 'div', item, children, className = '', ...props }, ref) => {
    if (!item.actor) return null;
    
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-item-actor ${className}`}
        {...props}
      >
        {children || (
          <>
            {item.actor.avatar && (
              <div className="strive-activity-feed-item-avatar">
                <img src={item.actor.avatar} alt={item.actor.name} />
              </div>
            )}
            <div className="strive-activity-feed-item-actor-name">
              {item.actor.url ? (
                <a href={item.actor.url}>{item.actor.name}</a>
              ) : (
                item.actor.name
              )}
            </div>
          </>
        )}
      </Component>
    );
  }
);

ItemActor.displayName = 'ActivityFeedHeadless.ItemActor';

// Item time component
const ItemTime = forwardRef<HTMLDivElement, ActivityFeedItemTimeProps>(
  ({ as: Component = 'div', item, relative = true, formatter, children, className = '', ...props }, ref) => {
    const formatTime = () => {
      if (children) return children;
      
      const date = new Date(item.timestamp);
      
      if (formatter) {
        return formatter(date);
      }
      
      if (relative) {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);
        
        if (diffSec < 60) {
          return 'just now';
        } else if (diffMin < 60) {
          return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffHour < 24) {
          return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffDay < 7) {
          return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
        } else {
          return date.toLocaleDateString();
        }
      } else {
        return date.toLocaleString();
      }
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-item-time ${className}`}
        title={new Date(item.timestamp).toLocaleString()}
        {...props}
      >
        {formatTime()}
      </Component>
    );
  }
);

ItemTime.displayName = 'ActivityFeedHeadless.ItemTime';

// Item actions component
const ItemActions = forwardRef<HTMLDivElement, ActivityFeedItemActionsProps>(
  ({ as: Component = 'div', item, children, className = '', ...props }, ref) => {
    const activityFeed = useActivityFeedContext();
    
    if (!item.actions && !children) return null;
    
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-item-actions ${className}`}
        {...props}
      >
        {children || (
          <>
            {item.actions?.map((action) => (
              <button
                key={action.id}
                className="strive-activity-feed-item-action"
                onClick={(e) => {
                  e.stopPropagation();
                  if (action.onClick) {
                    action.onClick(item);
                  }
                }}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </>
        )}
      </Component>
    );
  }
);

ItemActions.displayName = 'ActivityFeedHeadless.ItemActions';

// Filter component
const Filter = forwardRef<HTMLDivElement, ActivityFeedFilterProps>(
  ({ 
    as: Component = 'div', 
    types = ['all', 'default', 'info', 'success', 'warning', 'error', 'system', 'user'], 
    children, 
    className = '', 
    ...props 
  }, ref) => {
    const activityFeed = useActivityFeedContext();
    
    if (!activityFeed.items.length) return null;
    
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-filter ${className}`}
        role="tablist"
        aria-label="Filter activities"
        {...props}
      >
        {children || (
          <>
            {types.map((type) => (
              <button
                key={type}
                role="tab"
                aria-selected={activityFeed.filterType === type}
                className={`strive-activity-feed-filter-item ${activityFeed.filterType === type ? 'active' : ''}`}
                onClick={() => activityFeed.setFilterType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </>
        )}
      </Component>
    );
  }
);

Filter.displayName = 'ActivityFeedHeadless.Filter';

// Search component
const Search = forwardRef<HTMLDivElement, ActivityFeedSearchProps>(
  ({ as: Component = 'div', placeholder = 'Search activities...', children, className = '', ...props }, ref) => {
    const activityFeed = useActivityFeedContext();
    
    if (!activityFeed.items.length) return null;
    
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-search ${className}`}
        {...props}
      >
        {children || (
          <input
            type="text"
            placeholder={placeholder}
            value={activityFeed.searchQuery}
            onChange={(e) => activityFeed.setSearchQuery(e.target.value)}
            aria-label="Search activities"
          />
        )}
      </Component>
    );
  }
);

Search.displayName = 'ActivityFeedHeadless.Search';

// Load more component
const LoadMore = forwardRef<HTMLButtonElement, ActivityFeedLoadMoreProps>(
  ({ as: Component = 'button', children, className = '', ...props }, ref) => {
    const activityFeed = useActivityFeedContext();
    
    if (!activityFeed.hasMore || activityFeed.items.length === 0) return null;
    
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-load-more ${className}`}
        onClick={() => activityFeed.loadMore()}
        disabled={activityFeed.isLoading}
        type="button"
        {...props}
      >
        {children || (activityFeed.isLoading ? 'Loading...' : 'Load more')}
      </Component>
    );
  }
);

LoadMore.displayName = 'ActivityFeedHeadless.LoadMore';

// Empty component
const Empty = forwardRef<HTMLDivElement, ActivityFeedEmptyProps>(
  ({ as: Component = 'div', children, className = '', ...props }, ref) => {
    const activityFeed = useActivityFeedContext();
    
    if (activityFeed.filteredItems.length > 0) return null;
    
    return (
      <Component
        ref={ref}
        className={`strive-activity-feed-empty ${className}`}
        {...props}
      >
        {children || <p>No activities found.</p>}
      </Component>
    );
  }
);

Empty.displayName = 'ActivityFeedHeadless.Empty';

// Assemble the compound component
export const ActivityFeedHeadless = {
  Root,
  Group,
  GroupLabel,
  Item,
  ItemContent,
  ItemActor,
  ItemTime,
  ItemActions,
  Filter,
  Search,
  LoadMore,
  Empty,
  useActivityFeed,
};

export default ActivityFeedHeadless;
