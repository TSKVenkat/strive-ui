import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface InfiniteScrollProps {
  /** Function to load more data when the user scrolls to the bottom */
  loadMore: () => Promise<void>;
  /** Whether there is more data to load */
  hasMore: boolean;
  /** Whether data is currently being loaded */
  isLoading?: boolean;
  /** Distance from the bottom of the container to trigger loading more data (in pixels) */
  threshold?: number;
  /** Component to display while loading more data */
  loadingComponent?: React.ReactNode;
  /** Component to display when there is no more data */
  endComponent?: React.ReactNode;
  /** Component to display when there is an error loading data */
  errorComponent?: React.ReactNode;
  /** Whether to use window scroll instead of container scroll */
  useWindowScroll?: boolean;
  /** Children to render */
  children: React.ReactNode;
  /** Height of the container (only used when useWindowScroll is false) */
  height?: string;
  /** Additional className for the container */
  className?: string;
}

const Container = styled.div<{ height?: string }>`
  ${({ height }) => height && `height: ${height};`}
  overflow-y: ${({ height }) => (height ? 'auto' : 'visible')};
  width: 100%;
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  width: 100%;
`;

const EndMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.neutral[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

export const InfiniteScroll = ({
  loadMore,
  hasMore,
  isLoading = false,
  threshold = 200,
  loadingComponent,
  endComponent,
  errorComponent,
  useWindowScroll = false,
  children,
  height,
  className,
}: InfiniteScrollProps) => {
  const [error, setError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Reset error state when hasMore changes
  useEffect(() => {
    setError(false);
  }, [hasMore]);

  useEffect(() => {
    // If we're already loading, or there's no more data, don't do anything
    if (isLoading || !hasMore) return;

    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    const handleObserver = async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        try {
          await loadMore();
        } catch (err) {
          setError(true);
        }
      }
    };

    // Create a new observer
    observer.current = new IntersectionObserver(handleObserver, {
      root: useWindowScroll ? null : containerRef.current,
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0.1,
    });

    // Observe the loading element
    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isLoading, threshold, useWindowScroll]);

  return (
    <Container ref={containerRef} height={height} className={className}>
      {children}
      
      <LoadingContainer ref={loadingRef} aria-live="polite">
        {isLoading && (
          loadingComponent || (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              role="status"
              aria-label="Loading more content"
            >
              Loading...
            </motion.div>
          )
        )}
        
        {error && (
          errorComponent || (
            <ErrorMessage role="alert">
              Error loading data. Please try again.
            </ErrorMessage>
          )
        )}
        
        {!hasMore && !isLoading && (
          endComponent || (
            <EndMessage aria-live="polite">
              No more items to load
            </EndMessage>
          )
        )}
      </LoadingContainer>
    </Container>
  );
};

InfiniteScroll.displayName = 'InfiniteScroll';
