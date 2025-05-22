import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { Checkbox } from './Checkbox';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Checkbox', () => {
  test('renders correctly with label', () => {
    renderWithTheme(<Checkbox label="Test Checkbox" data-testid="checkbox" />);
    
    const checkbox = screen.getByTestId('checkbox');
    const label = screen.getByText('Test Checkbox');
    
    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test('handles checked state correctly', () => {
    const handleChange = jest.fn();
    
    renderWithTheme(
      <Checkbox 
        label="Test Checkbox" 
        checked={false} 
        onChange={handleChange} 
        data-testid="checkbox" 
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('handles disabled state correctly', () => {
    const handleChange = jest.fn();
    
    renderWithTheme(
      <Checkbox 
        label="Disabled Checkbox" 
        isDisabled={true} 
        onChange={handleChange} 
        data-testid="checkbox" 
      />
    );
    
    const checkbox = screen.getByTestId('checkbox');
    
    expect(checkbox).toBeDisabled();
    
    fireEvent.click(checkbox);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  test('renders with error state', () => {
    renderWithTheme(
      <Checkbox 
        label="Error Checkbox" 
        isError={true} 
        errorText="This is an error" 
        data-testid="checkbox" 
      />
    );
    
    const errorText = screen.getByText('This is an error');
    
    expect(errorText).toBeInTheDocument();
  });

  test('renders with helper text', () => {
    renderWithTheme(
      <Checkbox 
        label="Checkbox with Helper" 
        helperText="This is helper text" 
        data-testid="checkbox" 
      />
    );
    
    const helperText = screen.getByText('This is helper text');
    
    expect(helperText).toBeInTheDocument();
  });

  test('renders with different sizes', () => {
    const { rerender } = renderWithTheme(
      <Checkbox 
        label="Small Checkbox" 
        size="sm" 
        data-testid="checkbox" 
      />
    );
    
    let checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Checkbox 
          label="Medium Checkbox" 
          size="md" 
          data-testid="checkbox" 
        />
      </ThemeProvider>
    );
    
    checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Checkbox 
          label="Large Checkbox" 
          size="lg" 
          data-testid="checkbox" 
        />
      </ThemeProvider>
    );
    
    checkbox = screen.getByTestId('checkbox');
    expect(checkbox).toBeInTheDocument();
  });
});
