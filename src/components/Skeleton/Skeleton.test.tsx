import React from 'react';
import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Skeleton', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    renderWithTheme(<Skeleton />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-label', 'Loading');
  });

  it('renders with custom width and height', () => {
    renderWithTheme(<Skeleton width="200px" height="100px" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle('width: 200px');
    expect(skeleton).toHaveStyle('height: 100px');
  });

  it('renders with numeric width and height', () => {
    renderWithTheme(<Skeleton width={200} height={100} />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle('width: 200px');
    expect(skeleton).toHaveStyle('height: 100px');
  });

  it('renders with custom border radius', () => {
    renderWithTheme(<Skeleton borderRadius="8px" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle('border-radius: 8px');
  });

  // Variant tests
  it('renders text variant correctly', () => {
    renderWithTheme(<Skeleton variant="text" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    // Text variant has default border-radius of 4px
    expect(skeleton).toHaveStyle('border-radius: 4px');
  });

  it('renders circular variant correctly', () => {
    renderWithTheme(<Skeleton variant="circular" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle('border-radius: 50%');
  });

  it('renders rectangular variant correctly', () => {
    renderWithTheme(<Skeleton variant="rectangular" />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle('height: 100px');
  });

  // Multi-line tests
  it('renders multiple lines for text variant when lines > 1', () => {
    renderWithTheme(<Skeleton variant="text" lines={3} />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBe(1); // Container has role="status"
    
    // Check that we have 3 skeleton elements (the container + 3 lines)
    const container = skeletons[0];
    expect(container.children.length).toBe(3);
  });

  it('renders with custom line gap', () => {
    renderWithTheme(<Skeleton variant="text" lines={2} lineGap="10px" />);
    const container = screen.getByRole('status');
    expect(container).toHaveStyle('gap: 10px');
  });

  it('renders last line with 80% width when width is not specified and lines > 1', () => {
    renderWithTheme(<Skeleton variant="text" lines={3} />);
    const container = screen.getByRole('status');
    const lastLine = container.children[2];
    expect(lastLine).toHaveStyle('width: 80%');
  });

  // Animation tests
  it('has animation when animate is true', () => {
    renderWithTheme(<Skeleton animate={true} />);
    const skeleton = screen.getByRole('status');
    // We can't directly test for animation, but we can check that animation property is not 'none'
    expect(skeleton).not.toHaveStyle('animation: none');
  });

  it('has no animation when animate is false', () => {
    renderWithTheme(<Skeleton animate={false} />);
    const skeleton = screen.getByRole('status');
    expect(skeleton).toHaveStyle('animation: none');
  });
});
