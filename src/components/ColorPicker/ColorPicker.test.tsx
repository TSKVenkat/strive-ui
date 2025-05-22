import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ColorPicker } from './ColorPicker';
import { ThemeProvider } from '../../styles/ThemeProvider';

// Mock framer-motion's AnimatePresence and motion components
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

describe('ColorPicker', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} />);
    
    // The color button should be visible
    const colorButton = screen.getByRole('button');
    expect(colorButton).toBeInTheDocument();
    expect(colorButton).toHaveStyle('background-color: #ff0000');
  });

  it('renders with the correct size', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} size="lg" />);
    
    const colorButton = screen.getByRole('button');
    expect(colorButton).toHaveStyle('width: 48px');
    expect(colorButton).toHaveStyle('height: 48px');
  });

  it('renders as disabled when disabled prop is true', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} disabled />);
    
    const colorButton = screen.getByRole('button');
    expect(colorButton).toBeDisabled();
    expect(colorButton).toHaveStyle('opacity: 0.6');
    expect(colorButton).toHaveStyle('cursor: not-allowed');
  });

  it('applies custom aria-label', () => {
    const handleChange = jest.fn();
    renderWithTheme(
      <ColorPicker value="#ff0000" onChange={handleChange} ariaLabel="Custom color picker" />
    );
    
    const colorButton = screen.getByRole('button');
    expect(colorButton).toHaveAttribute('aria-label', 'Custom color picker');
  });

  // Interaction tests
  it('opens the popover when clicked', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} />);
    
    // Initially, the popover should not be visible
    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
    
    // Click the color button
    fireEvent.click(screen.getByRole('button'));
    
    // The popover should now be visible
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
    expect(screen.getByLabelText('Select color')).toBeInTheDocument();
  });

  it('does not open the popover when clicked if disabled', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} disabled />);
    
    // Click the color button
    fireEvent.click(screen.getByRole('button'));
    
    // The popover should still not be visible
    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
  });

  it('calls onChange when color input changes', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} />);
    
    // Open the popover
    fireEvent.click(screen.getByRole('button'));
    
    // Change the color input value
    const colorInput = screen.getByLabelText('Select color');
    fireEvent.change(colorInput, { target: { value: '#00ff00' } });
    
    // The onChange handler should be called with the new color
    expect(handleChange).toHaveBeenCalledWith('#00ff00');
  });

  it('shows value input when showValue is true', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} showValue />);
    
    // Open the popover
    fireEvent.click(screen.getByRole('button'));
    
    // The value input should be visible
    expect(screen.getByText('Color:')).toBeInTheDocument();
    expect(screen.getByDisplayValue('#ff0000')).toBeInTheDocument();
  });

  it('does not show value input when showValue is false', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} showValue={false} />);
    
    // Open the popover
    fireEvent.click(screen.getByRole('button'));
    
    // The value input should not be visible
    expect(screen.queryByText('Color:')).not.toBeInTheDocument();
  });

  it('displays color in the correct format', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} format="rgb" />);
    
    // Open the popover
    fireEvent.click(screen.getByRole('button'));
    
    // The value input should show the color in RGB format
    // Note: The exact RGB value might vary slightly depending on browser implementation
    // so we'll just check that it contains "rgb"
    const valueInput = screen.getByDisplayValue(/rgb/i);
    expect(valueInput).toBeInTheDocument();
  });

  it('updates the color when a preset color is clicked', () => {
    const handleChange = jest.fn();
    renderWithTheme(
      <ColorPicker 
        value="#ff0000" 
        onChange={handleChange} 
        presetColors={['#00ff00', '#0000ff']} 
      />
    );
    
    // Open the popover
    fireEvent.click(screen.getByRole('button'));
    
    // Click a preset color
    const presetColors = screen.getAllByLabelText(/Select color #/);
    fireEvent.click(presetColors[0]); // Click the first preset color (#00ff00)
    
    // The onChange handler should be called with the preset color
    expect(handleChange).toHaveBeenCalledWith('#00ff00');
  });

  it('updates the color when the value input is changed and blurred', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} />);
    
    // Open the popover
    fireEvent.click(screen.getByRole('button'));
    
    // Change the value input
    const valueInput = screen.getByDisplayValue('#ff0000');
    fireEvent.change(valueInput, { target: { value: '#00ff00' } });
    fireEvent.blur(valueInput);
    
    // The onChange handler should be called with the new color
    expect(handleChange).toHaveBeenCalledWith('#00ff00');
  });

  it('resets to the current value if an invalid color is entered', () => {
    const handleChange = jest.fn();
    renderWithTheme(<ColorPicker value="#ff0000" onChange={handleChange} />);
    
    // Open the popover
    fireEvent.click(screen.getByRole('button'));
    
    // Change the value input to an invalid color
    const valueInput = screen.getByDisplayValue('#ff0000');
    fireEvent.change(valueInput, { target: { value: 'not-a-color' } });
    fireEvent.blur(valueInput);
    
    // The onChange handler should not be called
    expect(handleChange).not.toHaveBeenCalledWith('not-a-color');
    
    // The input should reset to the current value
    expect(valueInput).toHaveValue('#ff0000');
  });
});
