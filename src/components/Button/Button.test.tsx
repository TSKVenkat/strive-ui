import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Button', () => {
  // Basic rendering tests
  it('renders correctly', () => {
    renderWithTheme(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  // Event handler tests
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button disabled onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when in loading state', () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button isLoading onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Style tests
  it('applies full width when fullWidth is true', () => {
    renderWithTheme(<Button fullWidth>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveStyle('width: 100%');
  });

  // Variant tests
  it('renders with different variants', () => {
    const { rerender } = renderWithTheme(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button', { name: /primary/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider><Button variant="secondary">Secondary</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /secondary/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider><Button variant="tertiary">Tertiary</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /tertiary/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider><Button variant="danger">Danger</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /danger/i })).toBeInTheDocument();
  });

  // Size tests
  it('renders with different sizes', () => {
    const { rerender } = renderWithTheme(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button', { name: /small/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider><Button size="md">Medium</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();
    
    rerender(<ThemeProvider><Button size="lg">Large</Button></ThemeProvider>);
    expect(screen.getByRole('button', { name: /large/i })).toBeInTheDocument();
  });

  // Loading state tests
  it('displays loading state correctly', () => {
    renderWithTheme(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toHaveAttribute('disabled');
    expect(button).toHaveStyle('color: transparent');
  });

  // Keyboard interaction tests
  it('can be triggered with keyboard', async () => {
    const handleClick = jest.fn();
    renderWithTheme(<Button onClick={handleClick}>Keyboard</Button>);
    
    const button = screen.getByRole('button', { name: /keyboard/i });
    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    await userEvent.keyboard(' '); // Space key
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  // Basic accessibility tests
  it('has appropriate accessibility attributes', () => {
    renderWithTheme(
      <Button aria-label="Accessible Button" disabled>
        Accessible Button
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /accessible button/i });
    expect(button).toHaveAttribute('aria-label', 'Accessible Button');
    expect(button).toHaveAttribute('disabled');
  });

  // Ref forwarding test
  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    renderWithTheme(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('BUTTON');
    expect(ref.current?.textContent).toBe('Ref Button');
  });

  // Custom props test
  it('passes additional props to the button element', () => {
    renderWithTheme(
      <Button data-testid="custom-button" aria-label="Custom Button">
        Custom Props
      </Button>
    );
    
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });
});
