import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Card } from './Card';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Card', () => {
  // Basic rendering tests
  test('renders correctly with children', () => {
    renderWithTheme(
      <Card data-testid="card">Card content</Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent('Card content');
  });

  // Variant tests
  test('renders with different variants', () => {
    const { rerender } = renderWithTheme(
      <Card variant="elevated" data-testid="card">
        Elevated Card
      </Card>
    );
    
    let card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card variant="outlined" data-testid="card">
          Outlined Card
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card variant="filled" data-testid="card">
          Filled Card
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
  });

  // Size tests
  test('renders with different sizes', () => {
    const { rerender } = renderWithTheme(
      <Card size="sm" data-testid="card">
        Small Card
      </Card>
    );
    
    let card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card size="md" data-testid="card">
          Medium Card
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card size="lg" data-testid="card">
          Large Card
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
  });

  // Border radius tests
  test('renders with different border radius', () => {
    const { rerender } = renderWithTheme(
      <Card borderRadius="none" data-testid="card">
        No Border Radius
      </Card>
    );
    
    let card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card borderRadius="sm" data-testid="card">
          Small Border Radius
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card borderRadius="md" data-testid="card">
          Medium Border Radius
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card borderRadius="lg" data-testid="card">
          Large Border Radius
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card borderRadius="xl" data-testid="card">
          Extra Large Border Radius
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
  });

  // Interactive card tests
  test('handles click events when interactive', () => {
    const handleClick = jest.fn();
    
    renderWithTheme(
      <Card interactive onClick={handleClick} data-testid="card">
        Interactive Card
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('has correct cursor style when interactive', () => {
    renderWithTheme(
      <Card interactive data-testid="card">
        Interactive Card
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('cursor: pointer');
  });

  // Elevation tests
  test('renders with different elevation levels', () => {
    const { rerender } = renderWithTheme(
      <Card elevation="none" data-testid="card">
        No Elevation
      </Card>
    );
    
    let card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card elevation="sm" data-testid="card">
          Small Elevation
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card elevation="md" data-testid="card">
          Medium Elevation
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card elevation="lg" data-testid="card">
          Large Elevation
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Card elevation="xl" data-testid="card">
          Extra Large Elevation
        </Card>
      </ThemeProvider>
    );
    
    card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
  });

  // Background color tests
  test('applies custom background color', () => {
    renderWithTheme(
      <Card backgroundColor="primary.100" data-testid="card">
        Colored Card
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('background-color: var(--colors-primary-100)');
  });

  // Border color tests
  test('applies custom border color', () => {
    renderWithTheme(
      <Card borderColor="primary.500" data-testid="card">
        Bordered Card
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveStyle('border-color: var(--colors-primary-500)');
  });

  // Hover effect tests
  test('applies hover effect when hoverEffect is true', () => {
    renderWithTheme(
      <Card hoverEffect data-testid="card">
        Card with Hover Effect
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    // Note: Testing hover effects would require more complex testing
  });

  // Card sections tests
  test('renders with Card.Header, Card.Body, and Card.Footer', () => {
    renderWithTheme(
      <Card data-testid="card">
        <Card.Header data-testid="card-header">Header Content</Card.Header>
        <Card.Body data-testid="card-body">Body Content</Card.Body>
        <Card.Footer data-testid="card-footer">Footer Content</Card.Footer>
      </Card>
    );
    
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-body')).toBeInTheDocument();
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    
    expect(screen.getByTestId('card-header')).toHaveTextContent('Header Content');
    expect(screen.getByTestId('card-body')).toHaveTextContent('Body Content');
    expect(screen.getByTestId('card-footer')).toHaveTextContent('Footer Content');
  });

  // Ref forwarding tests
  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    renderWithTheme(
      <Card ref={ref} data-testid="card">
        Card content
      </Card>
    );
    
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('card'));
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Card data-testid="card">
        Card content
      </Card>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has appropriate ARIA attributes for interactive cards', () => {
    renderWithTheme(
      <Card 
        interactive 
        aria-label="Interactive card" 
        data-testid="card"
      >
        Interactive Card
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', 'Interactive card');
  });

  // Keyboard interaction tests for interactive cards
  test('supports keyboard interaction for interactive cards', () => {
    const handleClick = jest.fn();
    
    renderWithTheme(
      <Card interactive onClick={handleClick} data-testid="card">
        Interactive Card
      </Card>
    );
    
    const card = screen.getByTestId('card');
    
    // Focus the card
    card.focus();
    
    // Press Enter
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Press Space
    fireEvent.keyDown(card, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  // Edge cases
  test('handles empty children', () => {
    renderWithTheme(
      <Card data-testid="card"></Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toBeEmptyDOMElement();
  });

  test('applies className correctly', () => {
    renderWithTheme(
      <Card className="custom-card" data-testid="card">
        Card content
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-card');
  });
});
