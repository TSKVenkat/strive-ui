import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Rating } from './Rating';
import { ThemeProvider } from '../../styles/ThemeProvider';

// Mock framer-motion's motion component
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: any) => (
        <div data-testid="motion-div" {...props}>
          {children}
        </div>
      ),
    },
  };
});

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Rating', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    renderWithTheme(<Rating value={3} />);
    
    // Should render 5 stars by default
    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(5);
    
    // 3 stars should be filled
    expect(stars[0]).toHaveAttribute('aria-checked', 'true');
    expect(stars[1]).toHaveAttribute('aria-checked', 'true');
    expect(stars[2]).toHaveAttribute('aria-checked', 'true');
    expect(stars[3]).toHaveAttribute('aria-checked', 'false');
    expect(stars[4]).toHaveAttribute('aria-checked', 'false');
  });

  it('renders with custom max value', () => {
    renderWithTheme(<Rating value={3} max={10} />);
    
    // Should render 10 stars
    const stars = screen.getAllByRole('radio');
    expect(stars).toHaveLength(10);
  });

  it('renders with the correct size', () => {
    renderWithTheme(<Rating value={3} size="lg" />);
    
    // Check that the container has the correct font size for large size
    const container = screen.getByRole('radiogroup');
    expect(container).toHaveStyle('font-size: 32px');
  });

  it('renders as disabled when disabled prop is true', () => {
    renderWithTheme(<Rating value={3} disabled />);
    
    // Container should have reduced opacity
    const container = screen.getByRole('radiogroup');
    expect(container).toHaveStyle('opacity: 0.6');
    
    // Stars should have tabIndex -1
    const stars = screen.getAllByRole('radio');
    stars.forEach(star => {
      expect(star).toHaveAttribute('tabIndex', '-1');
    });
  });

  it('renders as read-only when readOnly prop is true', () => {
    renderWithTheme(<Rating value={3} readOnly />);
    
    // Stars should have tabIndex -1
    const stars = screen.getAllByRole('radio');
    stars.forEach(star => {
      expect(star).toHaveAttribute('tabIndex', '-1');
    });
  });

  it('shows value when showValue is true', () => {
    renderWithTheme(<Rating value={3} showValue />);
    
    // Value should be visible
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders half stars when allowHalf is true and value has decimal', () => {
    renderWithTheme(<Rating value={3.5} allowHalf />);
    
    // 3 stars should be filled, 1 half-filled, and 1 empty
    const stars = screen.getAllByRole('radio');
    expect(stars[0]).toHaveAttribute('aria-checked', 'true');
    expect(stars[1]).toHaveAttribute('aria-checked', 'true');
    expect(stars[2]).toHaveAttribute('aria-checked', 'true');
    expect(stars[3]).toHaveAttribute('aria-checked', 'false'); // Half-filled star is still aria-checked false
    expect(stars[4]).toHaveAttribute('aria-checked', 'false');
  });

  it('applies custom aria-label', () => {
    renderWithTheme(<Rating value={3} ariaLabel="Product rating" />);
    
    const container = screen.getByRole('radiogroup');
    expect(container).toHaveAttribute('aria-label', 'Product rating');
  });

  // Interaction tests
  it('calls onChange when a star is clicked', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Rating value={3} onChange={handleChange} />);
    
    // Click the fourth star
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[3]);
    
    // The onChange handler should be called with the new value
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('does not call onChange when read-only', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Rating value={3} onChange={handleChange} readOnly />);
    
    // Click the fourth star
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[3]);
    
    // The onChange handler should not be called
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when disabled', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Rating value={3} onChange={handleChange} disabled />);
    
    // Click the fourth star
    const stars = screen.getAllByRole('radio');
    fireEvent.click(stars[3]);
    
    // The onChange handler should not be called
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('supports keyboard navigation with Enter key', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Rating value={3} onChange={handleChange} />);
    
    // Press Enter on the fourth star
    const stars = screen.getAllByRole('radio');
    fireEvent.keyDown(stars[3], { key: 'Enter' });
    
    // The onChange handler should be called with the new value
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('supports keyboard navigation with Space key', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Rating value={3} onChange={handleChange} />);
    
    // Press Space on the fourth star
    const stars = screen.getAllByRole('radio');
    fireEvent.keyDown(stars[3], { key: ' ' });
    
    // The onChange handler should be called with the new value
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('updates visual state on hover', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Rating value={3} onChange={handleChange} />);
    
    // Hover over the fourth star
    const stars = screen.getAllByRole('radio');
    fireEvent.mouseMove(stars[3], { clientX: 100 });
    
    // The visual state should update, but onChange should not be called yet
    expect(handleChange).not.toHaveBeenCalled();
    
    // Now click to confirm the selection
    fireEvent.click(stars[3]);
    
    // The onChange handler should be called with the new value
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('resets hover state on mouse leave', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Rating value={3} onChange={handleChange} />);
    
    // Hover over the fourth star
    const stars = screen.getAllByRole('radio');
    fireEvent.mouseMove(stars[3], { clientX: 100 });
    
    // Now leave the rating component
    const container = screen.getByRole('radiogroup');
    fireEvent.mouseLeave(container);
    
    // The visual state should reset, and onChange should not be called
    expect(handleChange).not.toHaveBeenCalled();
  });
});
