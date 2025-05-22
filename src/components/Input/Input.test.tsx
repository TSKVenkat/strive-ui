import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Input } from './Input';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Input', () => {
  // Basic rendering tests
  test('renders correctly with default props', () => {
    renderWithTheme(
      <Input data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  test('renders with placeholder text', () => {
    renderWithTheme(
      <Input placeholder="Enter text" data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  test('renders with default value', () => {
    renderWithTheme(
      <Input defaultValue="Default text" data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveValue('Default text');
  });

  // Size tests
  test('renders with different sizes', () => {
    const { rerender } = renderWithTheme(
      <Input size="sm" data-testid="input" />
    );
    
    let input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Input size="md" data-testid="input" />
      </ThemeProvider>
    );
    
    input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Input size="lg" data-testid="input" />
      </ThemeProvider>
    );
    
    input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
  });

  // Variant tests
  test('renders with different variants', () => {
    const { rerender } = renderWithTheme(
      <Input variant="outline" data-testid="input" />
    );
    
    let input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Input variant="filled" data-testid="input" />
      </ThemeProvider>
    );
    
    input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Input variant="flushed" data-testid="input" />
      </ThemeProvider>
    );
    
    input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Input variant="unstyled" data-testid="input" />
      </ThemeProvider>
    );
    
    input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
  });

  // State tests
  test('renders in disabled state', () => {
    renderWithTheme(
      <Input isDisabled data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
  });

  test('renders in readonly state', () => {
    renderWithTheme(
      <Input isReadOnly data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('readonly');
  });

  test('renders in invalid state', () => {
    renderWithTheme(
      <Input isInvalid data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('renders in required state', () => {
    renderWithTheme(
      <Input isRequired data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('required');
  });

  // Event handling tests
  test('calls onChange handler when input value changes', () => {
    const handleChange = jest.fn();
    
    renderWithTheme(
      <Input onChange={handleChange} data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('calls onFocus handler when input is focused', () => {
    const handleFocus = jest.fn();
    
    renderWithTheme(
      <Input onFocus={handleFocus} data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    fireEvent.focus(input);
    
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  test('calls onBlur handler when input loses focus', () => {
    const handleBlur = jest.fn();
    
    renderWithTheme(
      <Input onBlur={handleBlur} data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    fireEvent.focus(input);
    fireEvent.blur(input);
    
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('calls onKeyDown handler when key is pressed', () => {
    const handleKeyDown = jest.fn();
    
    renderWithTheme(
      <Input onKeyDown={handleKeyDown} data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  // Controlled input tests
  test('functions as a controlled component', () => {
    const handleChange = jest.fn();
    
    const { rerender } = renderWithTheme(
      <Input value="initial value" onChange={handleChange} data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveValue('initial value');
    
    // Simulate user typing
    fireEvent.change(input, { target: { value: 'new value' } });
    
    // Input value should not change (it's controlled)
    expect(input).toHaveValue('initial value');
    expect(handleChange).toHaveBeenCalledTimes(1);
    
    // Update the value prop
    rerender(
      <ThemeProvider>
        <Input value="new value" onChange={handleChange} data-testid="input" />
      </ThemeProvider>
    );
    
    // Now the input should show the new value
    expect(input).toHaveValue('new value');
  });

  // Input type tests
  test('renders with different input types', () => {
    const types = ['text', 'password', 'email', 'number', 'tel', 'url', 'search', 'date'];
    
    types.forEach(type => {
      const { unmount } = renderWithTheme(
        <Input type={type} data-testid={`input-${type}`} />
      );
      
      const input = screen.getByTestId(`input-${type}`);
      expect(input).toHaveAttribute('type', type);
      
      unmount();
    });
  });

  // Input with addons tests
  test('renders with left addon', () => {
    renderWithTheme(
      <Input.Group>
        <Input.LeftAddon data-testid="left-addon">$</Input.LeftAddon>
        <Input data-testid="input" />
      </Input.Group>
    );
    
    expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    expect(screen.getByTestId('left-addon')).toHaveTextContent('$');
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  test('renders with right addon', () => {
    renderWithTheme(
      <Input.Group>
        <Input data-testid="input" />
        <Input.RightAddon data-testid="right-addon">.com</Input.RightAddon>
      </Input.Group>
    );
    
    expect(screen.getByTestId('right-addon')).toBeInTheDocument();
    expect(screen.getByTestId('right-addon')).toHaveTextContent('.com');
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  test('renders with left and right addons', () => {
    renderWithTheme(
      <Input.Group>
        <Input.LeftAddon data-testid="left-addon">https://</Input.LeftAddon>
        <Input data-testid="input" />
        <Input.RightAddon data-testid="right-addon">.com</Input.RightAddon>
      </Input.Group>
    );
    
    expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    expect(screen.getByTestId('right-addon')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  // Input with elements tests
  test('renders with left element', () => {
    renderWithTheme(
      <Input.Group>
        <Input.LeftElement data-testid="left-element">
          <span>@</span>
        </Input.LeftElement>
        <Input data-testid="input" />
      </Input.Group>
    );
    
    expect(screen.getByTestId('left-element')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  test('renders with right element', () => {
    renderWithTheme(
      <Input.Group>
        <Input data-testid="input" />
        <Input.RightElement data-testid="right-element">
          <button>Clear</button>
        </Input.RightElement>
      </Input.Group>
    );
    
    expect(screen.getByTestId('right-element')).toBeInTheDocument();
    expect(screen.getByTestId('input')).toBeInTheDocument();
  });

  // Password input tests
  test('toggles password visibility', async () => {
    renderWithTheme(
      <Input.Group>
        <Input type="password" data-testid="input" />
        <Input.RightElement>
          <button data-testid="toggle-button">Show</button>
        </Input.RightElement>
      </Input.Group>
    );
    
    const input = screen.getByTestId('input');
    const toggleButton = screen.getByTestId('toggle-button');
    
    // Initially password should be hidden
    expect(input).toHaveAttribute('type', 'password');
    
    // Click the toggle button
    fireEvent.click(toggleButton);
    
    // Now the input type should be text
    expect(input).toHaveAttribute('type', 'text');
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Input aria-label="Test input" data-testid="input" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has appropriate ARIA attributes', () => {
    renderWithTheme(
      <Input 
        aria-label="Test input" 
        aria-describedby="helper-text" 
        data-testid="input" 
      />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-label', 'Test input');
    expect(input).toHaveAttribute('aria-describedby', 'helper-text');
  });

  // Edge cases
  test('handles autoFocus prop', () => {
    renderWithTheme(
      <Input autoFocus data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(document.activeElement).toBe(input);
  });

  test('applies className correctly', () => {
    renderWithTheme(
      <Input className="custom-input" data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-input');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    
    renderWithTheme(
      <Input ref={ref} data-testid="input" />
    );
    
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('input'));
  });

  test('handles maxLength prop', async () => {
    renderWithTheme(
      <Input maxLength={5} data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('maxlength', '5');
    
    // Try typing more than maxLength
    await userEvent.type(input, '123456');
    
    // Input should only contain the first 5 characters
    expect(input).toHaveValue('12345');
  });

  test('handles min and max props for number inputs', () => {
    renderWithTheme(
      <Input type="number" min={1} max={10} data-testid="input" />
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '10');
  });
});
