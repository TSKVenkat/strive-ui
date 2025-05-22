import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Alert } from './Alert';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Alert', () => {
  // Basic rendering tests
  test('renders correctly with default props', () => {
    renderWithTheme(<Alert data-testid="alert">Alert content</Alert>);
    
    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Alert content');
  });

  test('renders with title', () => {
    renderWithTheme(
      <Alert title="Alert Title" data-testid="alert">
        Alert content
      </Alert>
    );
    
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
    expect(screen.getByText('Alert content')).toBeInTheDocument();
  });

  // Variant tests
  test('renders with different variants', () => {
    const { rerender } = renderWithTheme(
      <Alert variant="info" data-testid="alert">Alert content</Alert>
    );
    
    let alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test success variant
    rerender(
      <ThemeProvider>
        <Alert variant="success" data-testid="alert">Alert content</Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test warning variant
    rerender(
      <ThemeProvider>
        <Alert variant="warning" data-testid="alert">Alert content</Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test error variant
    rerender(
      <ThemeProvider>
        <Alert variant="error" data-testid="alert">Alert content</Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test neutral variant
    rerender(
      <ThemeProvider>
        <Alert variant="neutral" data-testid="alert">Alert content</Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
  });

  // Size tests
  test('renders with different sizes', () => {
    const { rerender } = renderWithTheme(
      <Alert size="sm" data-testid="alert">Alert content</Alert>
    );
    
    let alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test medium size
    rerender(
      <ThemeProvider>
        <Alert size="md" data-testid="alert">Alert content</Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test large size
    rerender(
      <ThemeProvider>
        <Alert size="lg" data-testid="alert">Alert content</Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
  });

  // Close functionality tests
  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    renderWithTheme(
      <Alert closable onClose={handleClose} data-testid="alert">
        Alert content
      </Alert>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test('does not render close button when closable is false', () => {
    renderWithTheme(
      <Alert closable={false} data-testid="alert">
        Alert content
      </Alert>
    );
    
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
  });

  // Auto-close functionality tests
  test('auto closes after specified duration', () => {
    jest.useFakeTimers();
    const handleClose = jest.fn();
    
    renderWithTheme(
      <Alert 
        autoClose 
        autoCloseDuration={2000} 
        onClose={handleClose} 
        data-testid="alert"
      >
        Alert content
      </Alert>
    );
    
    expect(handleClose).not.toHaveBeenCalled();
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(handleClose).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers();
  });

  // Icon tests
  test('renders with icon when hasIcon is true', () => {
    renderWithTheme(
      <Alert hasIcon data-testid="alert">
        Alert content
      </Alert>
    );
    
    const alert = screen.getByTestId('alert');
    expect(alert.querySelector('svg')).toBeInTheDocument();
  });

  test('does not render icon when hasIcon is false', () => {
    renderWithTheme(
      <Alert hasIcon={false} data-testid="alert">
        Alert content
      </Alert>
    );
    
    const alert = screen.getByTestId('alert');
    expect(alert.querySelector('svg')).not.toBeInTheDocument();
  });

  test('renders custom icon when provided', () => {
    renderWithTheme(
      <Alert 
        icon={<span data-testid="custom-icon">🔔</span>} 
        data-testid="alert"
      >
        Alert content
      </Alert>
    );
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  // Style variant tests
  test('renders with outlined style', () => {
    renderWithTheme(
      <Alert outlined data-testid="alert">
        Alert content
      </Alert>
    );
    
    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    // Additional style checks could be added here
  });

  test('renders with filled style', () => {
    renderWithTheme(
      <Alert filled data-testid="alert">
        Alert content
      </Alert>
    );
    
    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    // Additional style checks could be added here
  });

  // Border tests
  test('renders with different border positions', () => {
    const { rerender } = renderWithTheme(
      <Alert borderPosition="left" data-testid="alert">
        Alert content
      </Alert>
    );
    
    let alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test right border
    rerender(
      <ThemeProvider>
        <Alert borderPosition="right" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test top border
    rerender(
      <ThemeProvider>
        <Alert borderPosition="top" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test bottom border
    rerender(
      <ThemeProvider>
        <Alert borderPosition="bottom" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test all borders
    rerender(
      <ThemeProvider>
        <Alert borderPosition="all" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
  });

  // Elevation tests
  test('renders with elevation', () => {
    const { rerender } = renderWithTheme(
      <Alert elevated elevation="sm" data-testid="alert">
        Alert content
      </Alert>
    );
    
    let alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test medium elevation
    rerender(
      <ThemeProvider>
        <Alert elevated elevation="md" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test large elevation
    rerender(
      <ThemeProvider>
        <Alert elevated elevation="lg" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
  });

  // Radius tests
  test('renders with different border radius', () => {
    const { rerender } = renderWithTheme(
      <Alert radius="sm" data-testid="alert">
        Alert content
      </Alert>
    );
    
    let alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test medium radius
    rerender(
      <ThemeProvider>
        <Alert radius="md" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test large radius
    rerender(
      <ThemeProvider>
        <Alert radius="lg" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    
    // Test full radius
    rerender(
      <ThemeProvider>
        <Alert radius="full" data-testid="alert">
          Alert content
        </Alert>
      </ThemeProvider>
    );
    alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
  });

  // Actions tests
  test('renders with actions', () => {
    renderWithTheme(
      <Alert 
        actions={<button data-testid="action-button">Action</button>} 
        data-testid="alert"
      >
        Alert content
      </Alert>
    );
    
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
  });

  // Expandable tests
  test('expands and collapses when expandable', () => {
    renderWithTheme(
      <Alert 
        expandable
        expandedContent={<div data-testid="expanded-content">Extra details</div>}
        data-testid="alert"
      >
        Alert content
      </Alert>
    );
    
    // Initially expanded content should not be visible
    expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
    
    // Find and click the expand button
    const expandButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(expandButton);
    
    // Now expanded content should be visible
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(expandButton);
    
    // Expanded content should be hidden again
    expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
  });

  test('respects defaultExpanded prop', () => {
    renderWithTheme(
      <Alert 
        expandable
        defaultExpanded
        expandedContent={<div data-testid="expanded-content">Extra details</div>}
        data-testid="alert"
      >
        Alert content
      </Alert>
    );
    
    // Expanded content should be visible by default
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
  });

  test('functions as controlled component with expanded prop', () => {
    const handleExpandedChange = jest.fn();
    const { rerender } = renderWithTheme(
      <Alert 
        expandable
        expanded={false}
        onExpandedChange={handleExpandedChange}
        expandedContent={<div data-testid="expanded-content">Extra details</div>}
        data-testid="alert"
      >
        Alert content
      </Alert>
    );
    
    // Expanded content should not be visible initially
    expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
    
    // Find and click the expand button
    const expandButton = screen.getByRole('button', { name: /expand/i });
    fireEvent.click(expandButton);
    
    // onExpandedChange should be called
    expect(handleExpandedChange).toHaveBeenCalledWith(true);
    
    // But content should not change until props change (controlled component)
    expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
    
    // Update props to show expanded content
    rerender(
      <ThemeProvider>
        <Alert 
          expandable
          expanded={true}
          onExpandedChange={handleExpandedChange}
          expandedContent={<div data-testid="expanded-content">Extra details</div>}
          data-testid="alert"
        >
          Alert content
        </Alert>
      </ThemeProvider>
    );
    
    // Now expanded content should be visible
    expect(screen.getByTestId('expanded-content')).toBeInTheDocument();
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Alert data-testid="alert">
        Alert content
      </Alert>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has correct ARIA role and attributes', () => {
    renderWithTheme(
      <Alert data-testid="alert">
        Alert content
      </Alert>
    );
    
    const alert = screen.getByTestId('alert');
    expect(alert).toHaveAttribute('role', 'alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });
});
