import { useEffect, useRef, useState, useCallback } from 'react';

export interface UseInfiniteScrollProps {
  /**
   * Function to load more data when the user scrolls to the bottom
   */
  loadMore: () => Promise<void>;
  /**
   * Whether there is more data to load
   */
  hasMore: boolean;
  /**
   * Whether data is currently being loaded
   */
  isLoading?: boolean;
  /**
   * Distance from the bottom of the container to trigger loading more data (in pixels)
   */
  threshold?: number;
  /**
   * Whether to use window scroll instead of container scroll
   */
  useWindowScroll?: boolean;
  /**
   * Callback when an error occurs during loading
   */
  onError?: (error: Error) => void;
  /**
   * Whether to disable the infinite scroll
   */
  disabled?: boolean;
  /**
   * Whether to reset the error state when hasMore changes
   */
  resetErrorOnHasMoreChange?: boolean;
}

export interface UseInfiniteScrollReturn {
  /**
   * Reference to the container element
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Reference to the sentinel element that triggers loading more data
   */
  sentinelRef: React.RefObject<HTMLElement>;
  /**
   * Whether there is an error loading data
   */
  error: boolean;
  /**
   * Function to manually reset the error state
   */
  resetError: () => void;
  /**
   * Function to manually trigger loading more data
   */
  triggerLoadMore: () => Promise<void>;
  /**
   * Get props for the container element
   */
  getContainerProps: <T extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<T>) => {
    ref: React.RefObject<HTMLElement>;
    style?: React.CSSProperties;
    role?: string;
    'aria-busy'?: boolean;
  };
  /**
   * Get props for the sentinel element
   */
  getSentinelProps: <T extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<T>) => {
    ref: React.RefObject<HTMLElement>;
    'aria-hidden': boolean;
    style?: React.CSSProperties;
  };
  /**
   * Get props for the loading indicator element
   */
  getLoadingProps: <T extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<T>) => {
    role: string;
    'aria-live': 'polite' | 'assertive' | 'off';
    'aria-label'?: string;
    style?: React.CSSProperties;
  };
  /**
   * Get props for the error message element
   */
  getErrorProps: <T extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<T>) => {
    role: string;
    'aria-live': 'polite' | 'assertive' | 'off';
    style?: React.CSSProperties;
  };
  /**
   * Get props for the end message element
   */
  getEndMessageProps: <T extends HTMLElement = HTMLDivElement>(props?: React.HTMLProps<T>) => {
    'aria-live': 'polite' | 'assertive' | 'off';
    style?: React.CSSProperties;
  };
}

/**
 * Hook for creating infinite scroll functionality.
 * 
 * @example
 * ```jsx
 * const MyInfiniteScroll = ({ loadMore, hasMore, isLoading, items }) => {
 *   const { 
 *     containerRef,
 *     sentinelRef,
 *     error,
 *     getContainerProps,
 *     getSentinelProps,
 *     getLoadingProps,
 *     getErrorProps,
 *     getEndMessageProps
 *   } = useInfiniteScroll({
 *     loadMore,
 *     hasMore,
 *     isLoading
 *   });
 *   
 *   return (
 *     <div {...getContainerProps({ style: { height: '400px', overflow: 'auto' } })}>
 *       {items.map(item => (
 *         <div key={item.id}>{item.name}</div>
 *       ))}
 *       
 *       <div {...getSentinelProps()} />
 *       
 *       {isLoading && <div {...getLoadingProps()}>Loading...</div>}
 *       {error && <div {...getErrorProps()}>Error loading data</div>}
 *       {!hasMore && !isLoading && <div {...getEndMessageProps()}>No more items</div>}
 *     </div>
 *   );
 * };
 * ```
 */
export function useInfiniteScroll({
  loadMore,
  hasMore,
  isLoading = false,
  threshold = 200,
  useWindowScroll = false,
  onError,
  disabled = false,
  resetErrorOnHasMoreChange = true,
}: UseInfiniteScrollProps): UseInfiniteScrollReturn {
  const [error, setError] = useState<boolean>(false);
  const containerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const resetError = useCallback(() => {
    setError(false);
  }, []);

  // Reset error state when hasMore changes if enabled
  useEffect(() => {
    if (resetErrorOnHasMoreChange) {
      resetError();
    }
  }, [hasMore, resetError, resetErrorOnHasMoreChange]);

  const triggerLoadMore = useCallback(async () => {
    if (isLoading || !hasMore || disabled) return;
    
    try {
      await loadMore();
      resetError();
    } catch (err) {
      setError(true);
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  }, [loadMore, hasMore, isLoading, disabled, onError, resetError]);

  useEffect(() => {
    // If disabled, don't set up the observer
    if (disabled) return;

    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        triggerLoadMore();
      }
    };

    // Create a new observer
    observer.current = new IntersectionObserver(handleObserver, {
      root: useWindowScroll ? null : containerRef.current,
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0.1,
    });

    // Observe the sentinel element
    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [triggerLoadMore, hasMore, isLoading, threshold, useWindowScroll, disabled]);

  const getContainerProps = useCallback(<T extends HTMLElement = HTMLDivElement>(
    props: React.HTMLProps<T> = {}
  ) => {
    return {
      ...props,
      ref: containerRef as React.RefObject<T>,
      role: 'region',
      'aria-busy': isLoading,
    };
  }, [isLoading]);

  const getSentinelProps = useCallback(<T extends HTMLElement = HTMLDivElement>(
    props: React.HTMLProps<T> = {}
  ) => {
    return {
      ...props,
      ref: sentinelRef as React.RefObject<T>,
      'aria-hidden': true,
      style: {
        height: '1px',
        width: '100%',
        visibility: 'hidden',
        ...props.style,
      },
    };
  }, []);

  const getLoadingProps = useCallback(<T extends HTMLElement = HTMLDivElement>(
    props: React.HTMLProps<T> = {}
  ) => {
    return {
      ...props,
      role: 'status',
      'aria-live': 'polite' as const,
      'aria-label': 'Loading more content',
    };
  }, []);

  const getErrorProps = useCallback(<T extends HTMLElement = HTMLDivElement>(
    props: React.HTMLProps<T> = {}
  ) => {
    return {
      ...props,
      role: 'alert',
      'aria-live': 'assertive' as const,
    };
  }, []);

  const getEndMessageProps = useCallback(<T extends HTMLElement = HTMLDivElement>(
    props: React.HTMLProps<T> = {}
  ) => {
    return {
      ...props,
      'aria-live': 'polite' as const,
    };
  }, []);

  return {
    containerRef,
    sentinelRef,
    error,
    resetError,
    triggerLoadMore,
    getContainerProps,
    getSentinelProps,
    getLoadingProps,
    getErrorProps,
    getEndMessageProps,
  };
}
