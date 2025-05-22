import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Drawer } from './Drawer';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Drawer', () => {
  // Basic rendering tests
  test('renders correctly when open', () => {
    renderWithTheme(
      <Drawer isOpen onClose={() => {}} data-testid="drawer">
        Drawer content
      </Drawer>
    );
    
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveTextContent('Drawer content');
  });

  test('does not render when closed', () => {
    renderWithTheme(
      <Drawer isOpen={false} onClose={() => {}} data-testid="drawer">
        Drawer content
      </Drawer>
    );
    
    const drawer = screen.queryByTestId('drawer');
    expect(drawer).not.toBeInTheDocument();
  });

  // Placement tests
  test('renders with different placements', () => {
    const placements = ['left', 'right', 'top', 'bottom'];
    
    placements.forEach(placement => {
      const { unmount } = renderWithTheme(
        <Drawer 
          isOpen 
          placement={placement as 'left' | 'right' | 'top' | 'bottom'} 
          onClose={() => {}} 
          data-testid={`drawer-${placement}`}
        >
          {placement} drawer
        </Drawer>
      );
      
      const drawer = screen.getByTestId(`drawer-${placement}`);
      expect(drawer).toBeInTheDocument();
      
      unmount();
    });
  });

  // Size tests
  test('renders with different sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    
    sizes.forEach(size => {
      const { unmount } = renderWithTheme(
        <Drawer 
          isOpen 
          size={size as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'} 
          onClose={() => {}} 
          data-testid={`drawer-${size}`}
        >
          {size} drawer
        </Drawer>
      );
      
      const drawer = screen.getByTestId(`drawer-${size}`);
      expect(drawer).toBeInTheDocument();
      
      unmount();
    });
  });

  // Close functionality tests
  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    
    renderWithTheme(
      <Drawer isOpen onClose={handleClose} data-testid="drawer">
        Drawer content
      </Drawer>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when backdrop is clicked if closeOnOverlayClick is true', () => {
    const handleClose = jest.fn();
    
    renderWithTheme(
      <Drawer 
        isOpen 
        onClose={handleClose} 
        closeOnOverlayClick={true} 
        data-testid="drawer"
      >
        Drawer content
      </Drawer>
    );
    
    const overlay = screen.getByTestId('drawer-overlay');
    fireEvent.click(overlay);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when backdrop is clicked if closeOnOverlayClick is false', () => {
    const handleClose = jest.fn();
    
    renderWithTheme(
      <Drawer 
        isOpen 
        onClose={handleClose} 
        closeOnOverlayClick={false} 
        data-testid="drawer"
      >
        Drawer content
      </Drawer>
    );
    
    const overlay = screen.getByTestId('drawer-overlay');
    fireEvent.click(overlay);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  // Escape key functionality tests
  test('calls onClose when Escape key is pressed if closeOnEsc is true', () => {
    const handleClose = jest.fn();
    
    renderWithTheme(
      <Drawer 
        isOpen 
        onClose={handleClose} 
        closeOnEsc={true} 
        data-testid="drawer"
      >
        Drawer content
      </Drawer>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when Escape key is pressed if closeOnEsc is false', () => {
    const handleClose = jest.fn();
    
    renderWithTheme(
      <Drawer 
        isOpen 
        onClose={handleClose} 
        closeOnEsc={false} 
        data-testid="drawer"
      >
        Drawer content
      </Drawer>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  // Drawer header, body, footer tests
  test('renders with Drawer.Header, Drawer.Body, and Drawer.Footer', () => {
    renderWithTheme(
      <Drawer isOpen onClose={() => {}} data-testid="drawer">
        <Drawer.Header data-testid="drawer-header">Header Content</Drawer.Header>
        <Drawer.Body data-testid="drawer-body">Body Content</Drawer.Body>
        <Drawer.Footer data-testid="drawer-footer">Footer Content</Drawer.Footer>
      </Drawer>
    );
    
    expect(screen.getByTestId('drawer-header')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-body')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-footer')).toBeInTheDocument();
    
    expect(screen.getByTestId('drawer-header')).toHaveTextContent('Header Content');
    expect(screen.getByTestId('drawer-body')).toHaveTextContent('Body Content');
    expect(screen.getByTestId('drawer-footer')).toHaveTextContent('Footer Content');
  });

  // Animation tests
  test('applies animation when opening and closing', () => {
    jest.useFakeTimers();
    
    const { rerender } = renderWithTheme(
      <Drawer isOpen={false} onClose={() => {}} data-testid="drawer">
        Drawer content
      </Drawer>
    );
    
    // Open the drawer
    rerender(
      <ThemeProvider>
        <Drawer isOpen={true} onClose={() => {}} data-testid="drawer">
          Drawer content
        </Drawer>
      </ThemeProvider>
    );
    
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toBeInTheDocument();
    
    // Close the drawer
    rerender(
      <ThemeProvider>
        <Drawer isOpen={false} onClose={() => {}} data-testid="drawer">
          Drawer content
        </Drawer>
      </ThemeProvider>
    );
    
    // Fast-forward past the animation
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    
    jest.useRealTimers();
  });

  // Focus management tests
  test('traps focus within the drawer when open', () => {
    renderWithTheme(
      <Drawer isOpen onClose={() => {}} data-testid="drawer">
        <button>First Button</button>
        <button>Second Button</button>
        <button>Third Button</button>
      </Drawer>
    );
    
    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    const lastButton = buttons[buttons.length - 1];
    
    // Focus should be on the first focusable element initially
    expect(document.activeElement).toBe(firstButton);
    
    // Tab to the last button
    for (let i = 0; i < buttons.length; i++) {
      fireEvent.keyDown(document.activeElement || document.body, { key: 'Tab' });
    }
    
    // Focus should be on the last button
    expect(document.activeElement).toBe(lastButton);
    
    // Tab again should cycle back to the first button (focus trap)
    fireEvent.keyDown(document.activeElement || document.body, { key: 'Tab' });
    expect(document.activeElement).toBe(firstButton);
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Drawer isOpen onClose={() => {}} data-testid="drawer">
        Drawer content
      </Drawer>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has appropriate ARIA attributes', () => {
    renderWithTheme(
      <Drawer 
        isOpen 
        onClose={() => {}} 
        aria-label="Test Drawer" 
        data-testid="drawer"
      >
        Drawer content
      </Drawer>
    );
    
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveAttribute('role', 'dialog');
    expect(drawer).toHaveAttribute('aria-modal', 'true');
    expect(drawer).toHaveAttribute('aria-label', 'Test Drawer');
  });

  // Custom props tests
  test('applies custom styles via style prop', () => {
    renderWithTheme(
      <Drawer 
        isOpen 
        onClose={() => {}} 
        style={{ backgroundColor: 'red' }} 
        data-testid="drawer"
      >
        Drawer content
      </Drawer>
    );
    
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveStyle('background-color: red');
  });

  test('applies className correctly', () => {
    renderWithTheme(
      <Drawer 
        isOpen 
        onClose={() => {}} 
        className="custom-drawer" 
        data-testid="drawer"
      >
        Drawer content
      </Drawer>
    );
    
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toHaveClass('custom-drawer');
  });

  // Edge cases
  test('handles empty children gracefully', () => {
    renderWithTheme(
      <Drawer isOpen onClose={() => {}} data-testid="drawer"></Drawer>
    );
    
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toBeInTheDocument();
  });
});
