import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ScrollToTop } from './ScrollToTop';
import { ThemeProvider } from '../../styles/ThemeProvider';

// Mock framer-motion's AnimatePresence and motion components
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      button: ({ children, onClick, ...props }: any) => (
        <button onClick={onClick} data-testid="scroll-button" {...props}>
          {children}
        </button>
      ),
    },
  };
});

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ScrollToTop', () => {
  // Mock window.scrollTo and window.pageYOffset
  const originalScrollTo = window.scrollTo;
  const originalScrollTop = Object.getOwnPropertyDescriptor(
    window.HTMLElement.prototype, 'scrollTop'
  );
  
  beforeEach(() => {
    window.scrollTo = jest.fn();
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 0,
    });
  });
  
  afterEach(() => {
    window.scrollTo = originalScrollTo;
    if (originalScrollTop) {
      Object.defineProperty(
        window.HTMLElement.prototype,
        'scrollTop',
        originalScrollTop
      );
    }
  });

  // Basic rendering tests
  it('does not render the button when scroll position is less than showAtPosition', () => {
    renderWithTheme(<ScrollToTop showAtPosition={300} />);
    
    expect(screen.queryByTestId('scroll-button')).not.toBeInTheDocument();
  });

  it('renders the button when scroll position is greater than showAtPosition', () => {
    // Set scroll position
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 400,
    });
    
    renderWithTheme(<ScrollToTop showAtPosition={300} />);
    
    // Trigger scroll event
    act(() => {
      fireEvent.scroll(window);
    });
    
    expect(screen.getByTestId('scroll-button')).toBeInTheDocument();
  });

  it('renders with the correct aria-label', () => {
    // Set scroll position
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 400,
    });
    
    renderWithTheme(<ScrollToTop showAtPosition={300} ariaLabel="Back to top" />);
    
    // Trigger scroll event
    act(() => {
      fireEvent.scroll(window);
    });
    
    expect(screen.getByTestId('scroll-button')).toHaveAttribute('aria-label', 'Back to top');
  });

  it('renders with custom icon when provided', () => {
    // Set scroll position
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 400,
    });
    
    const customIcon = <span data-testid="custom-icon">↑</span>;
    
    renderWithTheme(<ScrollToTop showAtPosition={300} icon={customIcon} />);
    
    // Trigger scroll event
    act(() => {
      fireEvent.scroll(window);
    });
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // Functionality tests
  it('calls window.scrollTo with smooth behavior when clicked and smooth is true', () => {
    // Set scroll position
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 400,
    });
    
    renderWithTheme(<ScrollToTop showAtPosition={300} smooth={true} />);
    
    // Trigger scroll event
    act(() => {
      fireEvent.scroll(window);
    });
    
    // Click the button
    fireEvent.click(screen.getByTestId('scroll-button'));
    
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('calls window.scrollTo without smooth behavior when clicked and smooth is false', () => {
    // Set scroll position
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 400,
    });
    
    renderWithTheme(<ScrollToTop showAtPosition={300} smooth={false} />);
    
    // Trigger scroll event
    act(() => {
      fireEvent.scroll(window);
    });
    
    // Click the button
    fireEvent.click(screen.getByTestId('scroll-button'));
    
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('uses scrollElement when provided', () => {
    // Create a mock scroll element
    const scrollElement = document.createElement('div');
    Object.defineProperty(scrollElement, 'scrollTop', {
      configurable: true,
      value: 400,
      writable: true,
    });
    scrollElement.scrollTo = jest.fn();
    
    renderWithTheme(<ScrollToTop showAtPosition={300} scrollElement={scrollElement} />);
    
    // Trigger scroll event
    act(() => {
      const event = new Event('scroll');
      scrollElement.dispatchEvent(event);
    });
    
    // The button should be visible
    expect(screen.getByTestId('scroll-button')).toBeInTheDocument();
    
    // Click the button
    fireEvent.click(screen.getByTestId('scroll-button'));
    
    // scrollElement.scrollTo should be called
    expect(scrollElement.scrollTo).toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    // Mock addEventListener and removeEventListener
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = renderWithTheme(<ScrollToTop showAtPosition={300} />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    
    // Clean up spies
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
