import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Form } from './Form';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Form', () => {
  // Basic rendering tests
  test('renders correctly with children', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group data-testid="form-group">
          <Form.Label htmlFor="test-input">Test Label</Form.Label>
          <Form.Input id="test-input" placeholder="Test Input" />
          <Form.HelperText>Helper text</Form.HelperText>
        </Form.Group>
      </Form>
    );
    
    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('form-group')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test Input')).toBeInTheDocument();
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  // Form submission tests
  test('calls onSubmit when form is submitted', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());
    
    renderWithTheme(
      <Form onSubmit={handleSubmit} data-testid="form">
        <Form.Group>
          <Form.Input id="test-input" />
        </Form.Group>
        <button type="submit">Submit</button>
      </Form>
    );
    
    fireEvent.submit(screen.getByTestId('form'));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  // Form.Group tests
  test('renders Form.Group with different spacing', () => {
    const { rerender } = renderWithTheme(
      <Form data-testid="form">
        <Form.Group spacing="sm" data-testid="form-group">
          <Form.Label>Label</Form.Label>
          <Form.Input />
        </Form.Group>
      </Form>
    );
    
    let formGroup = screen.getByTestId('form-group');
    expect(formGroup).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Form data-testid="form">
          <Form.Group spacing="md" data-testid="form-group">
            <Form.Label>Label</Form.Label>
            <Form.Input />
          </Form.Group>
        </Form>
      </ThemeProvider>
    );
    
    formGroup = screen.getByTestId('form-group');
    expect(formGroup).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Form data-testid="form">
          <Form.Group spacing="lg" data-testid="form-group">
            <Form.Label>Label</Form.Label>
            <Form.Input />
          </Form.Group>
        </Form>
      </ThemeProvider>
    );
    
    formGroup = screen.getByTestId('form-group');
    expect(formGroup).toBeInTheDocument();
  });

  // Form.Label tests
  test('renders Form.Label with required indicator', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Label htmlFor="test-input" required>Required Field</Form.Label>
          <Form.Input id="test-input" />
        </Form.Group>
      </Form>
    );
    
    const label = screen.getByText(/Required Field/);
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('*');
  });

  test('renders Form.Label with custom required indicator', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Label 
            htmlFor="test-input" 
            required 
            requiredIndicator={<span data-testid="custom-indicator">(!)</span>}
          >
            Required Field
          </Form.Label>
          <Form.Input id="test-input" />
        </Form.Group>
      </Form>
    );
    
    expect(screen.getByTestId('custom-indicator')).toBeInTheDocument();
  });

  // Form.Input tests
  test('renders Form.Input with different sizes', () => {
    const { rerender } = renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Input size="sm" data-testid="input" />
        </Form.Group>
      </Form>
    );
    
    let input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Form data-testid="form">
          <Form.Group>
            <Form.Input size="md" data-testid="input" />
          </Form.Group>
        </Form>
      </ThemeProvider>
    );
    
    input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Form data-testid="form">
          <Form.Group>
            <Form.Input size="lg" data-testid="input" />
          </Form.Group>
        </Form>
      </ThemeProvider>
    );
    
    input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
  });

  test('renders Form.Input with error state', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Input isInvalid data-testid="input" />
          <Form.ErrorMessage>Error message</Form.ErrorMessage>
        </Form.Group>
      </Form>
    );
    
    const input = screen.getByTestId('input');
    const errorMessage = screen.getByText('Error message');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(errorMessage).toBeInTheDocument();
  });

  test('handles Form.Input change events', () => {
    const handleChange = jest.fn();
    
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Input onChange={handleChange} data-testid="input" />
        </Form.Group>
      </Form>
    );
    
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  // Form.Textarea tests
  test('renders Form.Textarea correctly', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Label htmlFor="test-textarea">Textarea Label</Form.Label>
          <Form.Textarea id="test-textarea" placeholder="Enter text here" data-testid="textarea" />
        </Form.Group>
      </Form>
    );
    
    const textarea = screen.getByTestId('textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text here');
  });

  // Form.Select tests
  test('renders Form.Select correctly', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Label htmlFor="test-select">Select Label</Form.Label>
          <Form.Select id="test-select" data-testid="select">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
          </Form.Select>
        </Form.Group>
      </Form>
    );
    
    const select = screen.getByTestId('select');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  // Form.Checkbox tests
  test('renders Form.Checkbox correctly', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Checkbox id="test-checkbox" data-testid="checkbox">
            Checkbox Label
          </Form.Checkbox>
        </Form.Group>
      </Form>
    );
    
    const checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox).toHaveAttribute('type', 'checkbox');
    expect(screen.getByText('Checkbox Label')).toBeInTheDocument();
  });

  // Form.Radio tests
  test('renders Form.Radio correctly', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Radio id="test-radio" name="radio-group" data-testid="radio">
            Radio Label
          </Form.Radio>
        </Form.Group>
      </Form>
    );
    
    const radio = screen.getByTestId('radio');
    expect(radio).toBeInTheDocument();
    expect(radio.tagName).toBe('INPUT');
    expect(radio).toHaveAttribute('type', 'radio');
    expect(screen.getByText('Radio Label')).toBeInTheDocument();
  });

  // Form validation tests
  test('handles form validation', () => {
    const handleSubmit = jest.fn(e => e.preventDefault());
    
    renderWithTheme(
      <Form onSubmit={handleSubmit} data-testid="form">
        <Form.Group>
          <Form.Label htmlFor="test-input" required>Required Field</Form.Label>
          <Form.Input id="test-input" required data-testid="input" />
          <Form.ErrorMessage>This field is required</Form.ErrorMessage>
        </Form.Group>
        <button type="submit">Submit</button>
      </Form>
    );
    
    const form = screen.getByTestId('form');
    const input = screen.getByTestId('input');
    
    // Try to submit with empty input
    fireEvent.submit(form);
    
    // Input should be marked as invalid
    expect(input).toHaveAttribute('aria-invalid', 'true');
    
    // Fill the input and submit again
    fireEvent.change(input, { target: { value: 'test value' } });
    fireEvent.submit(form);
    
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Label htmlFor="test-input">Test Label</Form.Label>
          <Form.Input id="test-input" />
          <Form.HelperText>Helper text</Form.HelperText>
        </Form.Group>
      </Form>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has appropriate ARIA attributes', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Label htmlFor="test-input">Test Label</Form.Label>
          <Form.Input 
            id="test-input" 
            aria-describedby="helper-text error-message" 
            data-testid="input" 
          />
          <Form.HelperText id="helper-text">Helper text</Form.HelperText>
          <Form.ErrorMessage id="error-message">Error message</Form.ErrorMessage>
        </Form.Group>
      </Form>
    );
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('aria-describedby', 'helper-text error-message');
  });

  // Edge cases
  test('handles disabled state correctly', () => {
    renderWithTheme(
      <Form data-testid="form">
        <Form.Group>
          <Form.Input disabled data-testid="input" />
        </Form.Group>
      </Form>
    );
    
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
  });

  test('applies className correctly', () => {
    renderWithTheme(
      <Form className="custom-form" data-testid="form">
        <Form.Group className="custom-group" data-testid="form-group">
          <Form.Input className="custom-input" data-testid="input" />
        </Form.Group>
      </Form>
    );
    
    expect(screen.getByTestId('form')).toHaveClass('custom-form');
    expect(screen.getByTestId('form-group')).toHaveClass('custom-group');
    expect(screen.getByTestId('input')).toHaveClass('custom-input');
  });
});
