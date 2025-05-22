import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { InfiniteScroll } from './InfiniteScroll';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;
  
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.root = options?.root || null;
    this.rootMargin = options?.rootMargin || '0px';
    this.thresholds = Array.isArray(options?.threshold) ? options.threshold : [options?.threshold || 0];
    
    // Store the callback to trigger it manually in tests
    (this as any).callback = callback;
  }
  
  observe(target: Element): void {
    (this as any).target = target;
  }
  
  unobserve(): void {}
  
  disconnect(): void {}
  
  // Helper method to simulate intersection
  triggerIntersection(isIntersecting: boolean): void {
    const entry = {
      isIntersecting,
      target: (this as any).target,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: {} as DOMRectReadOnly,
      time: Date.now(),
    };
    
    (this as any).callback([entry]);
  }
}

// Replace the global IntersectionObserver with our mock
global.IntersectionObserver = MockIntersectionObserver as any;

describe('InfiniteScroll', () => {
  // Basic rendering tests
  it('renders children correctly', () => {
    renderWithTheme(
      <InfiniteScroll loadMore={jest.fn()} hasMore={true}>
        <div data-testid="child">Test Child</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders loading component when isLoading is true', () => {
    renderWithTheme(
      <InfiniteScroll loadMore={jest.fn()} hasMore={true} isLoading={true}>
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom loading component when provided', () => {
    renderWithTheme(
      <InfiniteScroll 
        loadMore={jest.fn()} 
        hasMore={true} 
        isLoading={true}
        loadingComponent={<div>Custom Loading...</div>}
      >
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
  });

  it('renders end component when hasMore is false', () => {
    renderWithTheme(
      <InfiniteScroll loadMore={jest.fn()} hasMore={false} isLoading={false}>
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByText('No more items to load')).toBeInTheDocument();
  });

  it('renders custom end component when provided', () => {
    renderWithTheme(
      <InfiniteScroll 
        loadMore={jest.fn()} 
        hasMore={false} 
        isLoading={false}
        endComponent={<div>End of content</div>}
      >
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    expect(screen.getByText('End of content')).toBeInTheDocument();
  });

  // Functionality tests
  it('calls loadMore when intersection is triggered', async () => {
    const loadMoreMock = jest.fn().mockResolvedValue(undefined);
    
    renderWithTheme(
      <InfiniteScroll loadMore={loadMoreMock} hasMore={true}>
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    // Get the observer instance
    const observer = (global.IntersectionObserver as any).instances?.[0] || 
                     (IntersectionObserver as any).__instance;
    
    // Simulate intersection
    act(() => {
      observer.triggerIntersection(true);
    });
    
    await waitFor(() => {
      expect(loadMoreMock).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call loadMore when hasMore is false', async () => {
    const loadMoreMock = jest.fn().mockResolvedValue(undefined);
    
    renderWithTheme(
      <InfiniteScroll loadMore={loadMoreMock} hasMore={false}>
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    // Get the observer instance
    const observer = (global.IntersectionObserver as any).instances?.[0] || 
                     (IntersectionObserver as any).__instance;
    
    // Simulate intersection
    act(() => {
      observer.triggerIntersection(true);
    });
    
    // Wait a bit to ensure loadMore isn't called
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(loadMoreMock).not.toHaveBeenCalled();
  });

  it('does not call loadMore when isLoading is true', async () => {
    const loadMoreMock = jest.fn().mockResolvedValue(undefined);
    
    renderWithTheme(
      <InfiniteScroll loadMore={loadMoreMock} hasMore={true} isLoading={true}>
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    // Get the observer instance
    const observer = (global.IntersectionObserver as any).instances?.[0] || 
                     (IntersectionObserver as any).__instance;
    
    // Simulate intersection
    act(() => {
      observer.triggerIntersection(true);
    });
    
    // Wait a bit to ensure loadMore isn't called
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(loadMoreMock).not.toHaveBeenCalled();
  });

  it('renders error component when loadMore fails', async () => {
    const loadMoreMock = jest.fn().mockRejectedValue(new Error('Failed to load'));
    
    renderWithTheme(
      <InfiniteScroll loadMore={loadMoreMock} hasMore={true}>
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    // Get the observer instance
    const observer = (global.IntersectionObserver as any).instances?.[0] || 
                     (IntersectionObserver as any).__instance;
    
    // Simulate intersection
    act(() => {
      observer.triggerIntersection(true);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Error loading data. Please try again.')).toBeInTheDocument();
    });
  });

  it('renders custom error component when provided', async () => {
    const loadMoreMock = jest.fn().mockRejectedValue(new Error('Failed to load'));
    
    renderWithTheme(
      <InfiniteScroll 
        loadMore={loadMoreMock} 
        hasMore={true}
        errorComponent={<div>Custom error message</div>}
      >
        <div>Test Child</div>
      </InfiniteScroll>
    );
    
    // Get the observer instance
    const observer = (global.IntersectionObserver as any).instances?.[0] || 
                     (IntersectionObserver as any).__instance;
    
    // Simulate intersection
    act(() => {
      observer.triggerIntersection(true);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });
});
