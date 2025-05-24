import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

export interface UseVirtualScrollProps<T> {
  /**
   * Array of items to virtualize
   */
  items: T[];
  /**
   * Height of each item in pixels
   * Can be a fixed number or a function that returns the height for a specific item
   */
  itemHeight: number | ((item: T, index: number) => number);
  /**
   * Height of the viewport in pixels
   */
  height: number;
  /**
   * Width of the viewport in pixels
   */
  width?: number;
  /**
   * Number of items to render above and below the visible area
   */
  overscan?: number;
  /**
   * Initial scroll offset in pixels
   */
  initialScrollOffset?: number;
  /**
   * Callback when the scroll position changes
   */
  onScroll?: (scrollTop: number) => void;
  /**
   * Callback when an item becomes visible
   */
  onItemsRendered?: (params: {
    overscanStartIndex: number;
    overscanEndIndex: number;
    visibleStartIndex: number;
    visibleEndIndex: number;
  }) => void;
  /**
   * Whether to enable horizontal scrolling
   */
  horizontal?: boolean;
  /**
   * Whether to enable smooth scrolling
   */
  smoothScroll?: boolean;
  /**
   * Unique key to identify items
   */
  itemKey?: (item: T, index: number) => string | number;
}

export interface VirtualItem<T> {
  /**
   * The item data
   */
  item: T;
  /**
   * The index of the item in the original array
   */
  index: number;
  /**
   * The calculated position of the item (top/left)
   */
  offset: number;
  /**
   * The calculated size of the item (height/width)
   */
  size: number;
  /**
   * The unique key for the item
   */
  key: string | number;
}

export interface UseVirtualScrollReturn<T> {
  /**
   * Reference to the outer container element
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Reference to the inner content element
   */
  contentRef: React.RefObject<HTMLElement>;
  /**
   * Array of virtual items to render
   */
  virtualItems: VirtualItem<T>[];
  /**
   * Total size of all items (height/width)
   */
  totalSize: number;
  /**
   * Current scroll offset
   */
  scrollOffset: number;
  /**
   * Scroll to a specific offset
   */
  scrollTo: (offset: number, options?: { behavior?: ScrollBehavior }) => void;
  /**
   * Scroll to a specific item
   */
  scrollToItem: (index: number, options?: { align?: 'start' | 'center' | 'end'; behavior?: ScrollBehavior }) => void;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLElement>;
    style: React.CSSProperties;
    onScroll: (event: React.UIEvent<HTMLElement>) => void;
    role: string;
    'aria-label'?: string;
    tabIndex: number;
  };
  /**
   * Get props for the content element
   */
  getContentProps: <E extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<E>) => {
    ref: React.RefObject<HTMLElement>;
    style: React.CSSProperties;
    role: string;
  };
  /**
   * Get props for a virtual item
   */
  getItemProps: <E extends HTMLElement = HTMLDivElement>(
    virtualItem: VirtualItem<T>,
    props?: React.HTMLProps<E>
  ) => {
    style: React.CSSProperties;
    'data-index': number;
    role: string;
    'aria-rowindex'?: number;
  };
}

/**
 * Hook for creating virtualized scrolling functionality.
 * 
 * @example
 * ```jsx
 * const MyVirtualScroll = ({ items }) => {
 *   const { 
 *     virtualItems,
 *     totalSize,
 *     getContainerProps,
 *     getContentProps,
 *     getItemProps
 *   } = useVirtualScroll({
 *     items,
 *     height: 400,
 *     itemHeight: 50,
 *   });
 *   
 *   return (
 *     <div {...getContainerProps()}>
 *       <div {...getContentProps()}>
 *         {virtualItems.map(virtualItem => (
 *           <div
 *             key={virtualItem.key}
 *             {...getItemProps(virtualItem)}
 *           >
 *             {items[virtualItem.index].name}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
export function useVirtualScroll<T>({
  items,
  itemHeight,
  height,
  width,
  overscan = 3,
  initialScrollOffset = 0,
  onScroll,
  onItemsRendered,
  horizontal = false,
  smoothScroll = false,
  itemKey = (_, index) => index,
}: UseVirtualScrollProps<T>): UseVirtualScrollReturn<T> {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const [scrollOffset, setScrollOffset] = useState(initialScrollOffset);
  const scrollOffsetRef = useRef(initialScrollOffset);
  const sizeKey = horizontal ? 'width' : 'height';
  const offsetKey = horizontal ? 'left' : 'top';
  const scrollKey = horizontal ? 'scrollLeft' : 'scrollTop';

  // Calculate item positions and sizes
  const { itemSizeAndOffsetMap, totalSize } = useMemo(() => {
    const map = new Map<number, { size: number; offset: number }>();
    let offset = 0;

    for (let i = 0; i < items.length; i++) {
      const size = typeof itemHeight === 'function' ? itemHeight(items[i], i) : itemHeight;
      map.set(i, { size, offset });
      offset += size;
    }

    return {
      itemSizeAndOffsetMap: map,
      totalSize: offset,
    };
  }, [items, itemHeight]);

  // Find the range of visible items
  const { virtualItems, range } = useMemo(() => {
    const start = scrollOffsetRef.current;
    const end = scrollOffsetRef.current + height;

    let startIndex = -1;
    let endIndex = -1;

    // Find the first visible item
    for (let i = 0; i < items.length; i++) {
      const { offset, size } = itemSizeAndOffsetMap.get(i) || { offset: 0, size: 0 };
      if (offset + size > start && startIndex === -1) {
        startIndex = i;
      }
      if (offset > end && endIndex === -1) {
        endIndex = i - 1;
        break;
      }
    }

    // If we haven't found an endIndex, it means all remaining items are visible
    if (endIndex === -1) {
      endIndex = items.length - 1;
    }

    // Apply overscan
    startIndex = Math.max(0, startIndex - overscan);
    endIndex = Math.min(items.length - 1, endIndex + overscan);

    const visibleStartIndex = Math.max(0, startIndex);
    const visibleEndIndex = Math.min(items.length - 1, endIndex);

    // Create virtual items
    const virtualItems = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const { offset, size } = itemSizeAndOffsetMap.get(i) || { offset: 0, size: 0 };
      virtualItems.push({
        item: items[i],
        index: i,
        offset,
        size,
        key: itemKey(items[i], i),
      });
    }

    return {
      virtualItems,
      range: {
        startIndex,
        endIndex,
        visibleStartIndex,
        visibleEndIndex,
      },
    };
  }, [items, height, itemSizeAndOffsetMap, overscan, itemKey, scrollOffsetRef.current]);

  // Call onItemsRendered callback
  useEffect(() => {
    if (onItemsRendered) {
      onItemsRendered({
        overscanStartIndex: range.startIndex,
        overscanEndIndex: range.endIndex,
        visibleStartIndex: range.visibleStartIndex,
        visibleEndIndex: range.visibleEndIndex,
      });
    }
  }, [
    range.startIndex,
    range.endIndex,
    range.visibleStartIndex,
    range.visibleEndIndex,
    onItemsRendered,
  ]);

  // Handle scroll events
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const newOffset = event.currentTarget[scrollKey];
      scrollOffsetRef.current = newOffset;
      setScrollOffset(newOffset);
      
      if (onScroll) {
        onScroll(newOffset);
      }
    },
    [scrollKey, onScroll]
  );

  // Scroll to a specific offset
  const scrollTo = useCallback(
    (offset: number, options?: { behavior?: ScrollBehavior }) => {
      if (containerRef.current) {
        containerRef.current.scrollTo({
          [horizontal ? 'left' : 'top']: offset,
          behavior: options?.behavior || (smoothScroll ? 'smooth' : 'auto'),
        });
      }
    },
    [horizontal, smoothScroll]
  );

  // Scroll to a specific item
  const scrollToItem = useCallback(
    (index: number, options?: { align?: 'start' | 'center' | 'end'; behavior?: ScrollBehavior }) => {
      if (index < 0 || index >= items.length || !containerRef.current) return;

      const { offset, size } = itemSizeAndOffsetMap.get(index) || { offset: 0, size: 0 };
      const containerSize = height;
      const align = options?.align || 'start';

      let scrollOffset = offset;
      if (align === 'center') {
        scrollOffset = offset - containerSize / 2 + size / 2;
      } else if (align === 'end') {
        scrollOffset = offset - containerSize + size;
      }

      scrollTo(Math.max(0, scrollOffset), options);
    },
    [items.length, itemSizeAndOffsetMap, height, scrollTo]
  );

  // Get props for the container element
  const getContainerProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(props: React.HTMLProps<E> = {}) => {
      return {
        ...props,
        ref: containerRef as React.RefObject<E>,
        style: {
          ...props.style,
          position: 'relative',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          [sizeKey]: height,
          ...(width ? { width } : {}),
        },
        onScroll: handleScroll as any,
        role: 'list',
        'aria-label': props['aria-label'] || 'Virtualized list',
        tabIndex: 0,
      };
    },
    [height, width, sizeKey, handleScroll]
  );

  // Get props for the content element
  const getContentProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(props: React.HTMLProps<E> = {}) => {
      return {
        ...props,
        ref: contentRef as React.RefObject<E>,
        style: {
          ...props.style,
          height: horizontal ? '100%' : totalSize,
          width: horizontal ? totalSize : '100%',
          position: 'relative',
        },
        role: 'presentation',
      };
    },
    [totalSize, horizontal]
  );

  // Get props for a virtual item
  const getItemProps = useCallback(
    <E extends HTMLElement = HTMLDivElement>(
      virtualItem: VirtualItem<T>,
      props: React.HTMLProps<E> = {}
    ) => {
      return {
        ...props,
        style: {
          ...props.style,
          position: 'absolute',
          [offsetKey]: virtualItem.offset,
          [sizeKey]: virtualItem.size,
          ...(horizontal ? { height: '100%' } : { width: '100%' }),
        },
        'data-index': virtualItem.index,
        role: 'listitem',
        'aria-rowindex': virtualItem.index + 1,
      };
    },
    [offsetKey, sizeKey, horizontal]
  );

  // Set initial scroll position
  useEffect(() => {
    if (initialScrollOffset > 0 && containerRef.current) {
      containerRef.current[scrollKey] = initialScrollOffset;
    }
  }, [initialScrollOffset, scrollKey]);

  return {
    containerRef,
    contentRef,
    virtualItems,
    totalSize,
    scrollOffset,
    scrollTo,
    scrollToItem,
    getContainerProps,
    getContentProps,
    getItemProps,
  };
}
