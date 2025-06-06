import { useCallback } from 'react';

export interface BreadcrumbItem {
  /**
   * Unique identifier for the breadcrumb item
   */
  id: string;
  /**
   * Label to display for the breadcrumb item
   */
  label: React.ReactNode;
  /**
   * URL for the breadcrumb item
   */
  href?: string;
  /**
   * Whether the breadcrumb item is the current page
   */
  isCurrent?: boolean;
  /**
   * Whether the breadcrumb item is disabled
   */
  disabled?: boolean;
  /**
   * Optional icon to display before the label
   */
  icon?: React.ReactNode;
  /**
   * Optional data to associate with the breadcrumb item
   */
  data?: any;
}

export interface UseBreadcrumbsProps {
  /**
   * Array of breadcrumb items
   */
  items: BreadcrumbItem[];
  /**
   * Callback when a breadcrumb item is clicked
   */
  onItemClick?: (item: BreadcrumbItem) => void;
  /**
   * Maximum number of items to display before collapsing
   */
  maxItems?: number;
  /**
   * Number of items to show at the beginning when collapsed
   */
  itemsBeforeCollapse?: number;
  /**
   * Number of items to show at the end when collapsed
   */
  itemsAfterCollapse?: number;
  /**
   * Custom separator between breadcrumb items
   */
  separator?: React.ReactNode;
}

export interface UseBreadcrumbsReturn {
  /**
   * Array of breadcrumb items to render
   */
  items: BreadcrumbItem[];
  /**
   * Whether the breadcrumbs are collapsed
   */
  isCollapsed: boolean;
  /**
   * Array of collapsed items (only present when maxItems is set)
   */
  collapsedItems: BreadcrumbItem[];
  /**
   * The separator element to use between breadcrumb items
   */
  separator: React.ReactNode;
  /**
   * Get props for the breadcrumbs container
   */
  getBreadcrumbsProps: () => {
    role: string;
    'aria-label': string;
  };
  /**
   * Get props for a breadcrumb item
   */
  getItemProps: (item: BreadcrumbItem) => {
    role: string;
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time';
    'aria-disabled'?: boolean;
    onClick: (event: React.MouseEvent) => void;
    href?: string;
    tabIndex: number;
    'data-current': boolean;
    'data-disabled': boolean;
  };
  /**
   * Get props for the separator
   */
  getSeparatorProps: () => {
    'aria-hidden': boolean;
    role: string;
  };
  /**
   * Get props for the collapsed indicator
   */
  getCollapsedProps: () => {
    role: string;
    'aria-label': string;
    tabIndex: number;
  };
}

/**
 * Hook for creating accessible breadcrumb components.
 * Provides all the necessary props and state for creating a breadcrumb component.
 * 
 * @example
 * ```jsx
 * const MyBreadcrumbs = ({ items, onItemClick }) => {
 *   const { 
 *     items: visibleItems, 
 *     collapsedItems,
 *     isCollapsed,
 *     getBreadcrumbsProps, 
 *     getItemProps,
 *     getSeparatorProps
 *   } = useBreadcrumbs({ items, onItemClick });
 *   
 *   return (
 *     <nav {...getBreadcrumbsProps()}>
 *       <ol>
 *         {visibleItems.map((item, index) => (
 *           <React.Fragment key={item.id}>
 *             {index > 0 && <li {...getSeparatorProps()}>/</li>}
 *             <li>
 *               <a {...getItemProps(item)}>{item.label}</a>
 *             </li>
 *           </React.Fragment>
 *         ))}
 *       </ol>
 *     </nav>
 *   );
 * };
 * ```
 */
export function useBreadcrumbs({
  items,
  onItemClick,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  separator = '/',
}: UseBreadcrumbsProps): UseBreadcrumbsReturn {
  const isCollapsed = maxItems !== undefined && items.length > maxItems;
  
  // Calculate which items to show when collapsed
  const visibleItems = isCollapsed
    ? [
        ...items.slice(0, itemsBeforeCollapse),
        ...items.slice(items.length - itemsAfterCollapse),
      ]
    : items;
  
  // Calculate which items are collapsed
  const collapsedItems = isCollapsed
    ? items.slice(itemsBeforeCollapse, items.length - itemsAfterCollapse)
    : [];

  const getBreadcrumbsProps = useCallback(() => {
    return {
      role: 'navigation',
      'aria-label': 'Breadcrumbs',
    };
  }, []);

  const getItemProps = useCallback((item: BreadcrumbItem) => {
    const handleClick = (event: React.MouseEvent) => {
      if (item.disabled || item.isCurrent) {
        event.preventDefault();
        return;
      }
      
      onItemClick?.(item);
    };

    return {
      role: 'link',
      ...(item.isCurrent ? { 'aria-current': 'page' as const } : {}),
      ...(item.disabled ? { 'aria-disabled': true } : {}),
      onClick: handleClick,
      href: item.disabled || item.isCurrent ? undefined : item.href,
      tabIndex: item.disabled ? -1 : 0,
      'data-current': !!item.isCurrent,
      'data-disabled': !!item.disabled,
    };
  }, [onItemClick]);

  const getSeparatorProps = useCallback(() => {
    return {
      'aria-hidden': true,
      role: 'presentation',
    };
  }, []);

  const getCollapsedProps = useCallback(() => {
    return {
      role: 'button',
      'aria-label': `Show ${collapsedItems.length} more breadcrumb items`,
      tabIndex: 0,
    };
  }, [collapsedItems.length]);

  return {
    items: visibleItems,
    isCollapsed,
    collapsedItems,
    separator,
    getBreadcrumbsProps,
    getItemProps,
    getSeparatorProps,
    getCollapsedProps,
  };
}
