import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Icon } from './Icon';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Icon', () => {
  // Basic rendering tests
  test('renders correctly with default props', () => {
    renderWithTheme(
      <Icon name="check" data-testid="icon" />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe('SVG');
  });

  test('renders custom icon when children are provided', () => {
    renderWithTheme(
      <Icon data-testid="icon">
        <path d="M10 10" />
      </Icon>
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon.querySelector('path')).toBeInTheDocument();
  });

  // Size tests
  test('renders with different sizes', () => {
    const { rerender } = renderWithTheme(
      <Icon name="check" size="sm" data-testid="icon" />
    );
    
    let icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveAttribute('height', '16');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" size="md" data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" size="lg" data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" size="xl" data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('width', '40');
    expect(icon).toHaveAttribute('height', '40');
  });

  test('renders with custom size', () => {
    renderWithTheme(
      <Icon name="check" size={48} data-testid="icon" />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('width', '48');
    expect(icon).toHaveAttribute('height', '48');
  });

  test('renders with different width and height', () => {
    renderWithTheme(
      <Icon name="check" width={50} height={30} data-testid="icon" />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('width', '50');
    expect(icon).toHaveAttribute('height', '30');
  });

  // Color tests
  test('renders with different colors', () => {
    const { rerender } = renderWithTheme(
      <Icon name="check" color="primary.500" data-testid="icon" />
    );
    
    let icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('color: var(--colors-primary-500)');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" color="red" data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('color: red');
  });

  // Stroke width tests
  test('renders with different stroke widths', () => {
    const { rerender } = renderWithTheme(
      <Icon name="check" strokeWidth={1} data-testid="icon" />
    );
    
    let icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('stroke-width', '1');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" strokeWidth={2} data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('stroke-width', '2');
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Icon name="check" aria-label="Check icon" data-testid="icon" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has appropriate ARIA attributes', () => {
    renderWithTheme(
      <Icon 
        name="check" 
        aria-label="Check icon" 
        role="img" 
        data-testid="icon" 
      />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('aria-label', 'Check icon');
    expect(icon).toHaveAttribute('role', 'img');
  });

  test('is hidden from screen readers when decorative', () => {
    renderWithTheme(
      <Icon name="check" aria-hidden={true} data-testid="icon" />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  // Rotation and flip tests
  test('renders with rotation', () => {
    const { rerender } = renderWithTheme(
      <Icon name="check" rotate={90} data-testid="icon" />
    );
    
    let icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('transform: rotate(90deg)');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" rotate={180} data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('transform: rotate(180deg)');
  });

  test('renders with flip', () => {
    const { rerender } = renderWithTheme(
      <Icon name="check" flip="horizontal" data-testid="icon" />
    );
    
    let icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('transform: scaleX(-1)');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" flip="vertical" data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('transform: scaleY(-1)');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" flip="both" data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('transform: scale(-1, -1)');
  });

  test('combines rotation and flip transformations', () => {
    renderWithTheme(
      <Icon 
        name="check" 
        rotate={45} 
        flip="horizontal" 
        data-testid="icon" 
      />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('transform: rotate(45deg) scaleX(-1)');
  });

  // Animation tests
  test('renders with animation', () => {
    const { rerender } = renderWithTheme(
      <Icon name="check" animation="spin" data-testid="icon" />
    );
    
    let icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('animation: spin 2s linear infinite');
    
    rerender(
      <ThemeProvider>
        <Icon name="check" animation="pulse" data-testid="icon" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle('animation: pulse 2s ease-in-out infinite');
  });

  // Edge cases
  test('applies className correctly', () => {
    renderWithTheme(
      <Icon name="check" className="custom-icon" data-testid="icon" />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('custom-icon');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<SVGSVGElement>();
    
    renderWithTheme(
      <Icon name="check" ref={ref} data-testid="icon" />
    );
    
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('icon'));
  });

  test('handles invalid icon name gracefully', () => {
    renderWithTheme(
      <Icon name="invalid-icon-name" data-testid="icon" />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    // Should render a fallback or empty icon
  });

  test('passes additional props to SVG element', () => {
    renderWithTheme(
      <Icon 
        name="check" 
        viewBox="0 0 24 24" 
        preserveAspectRatio="xMidYMid meet" 
        data-testid="icon" 
      />
    );
    
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet');
  });
});
