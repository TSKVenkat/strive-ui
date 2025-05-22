import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Spinner } from './Spinner';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Spinner', () => {
  test('renders correctly', () => {
    renderWithTheme(<Spinner data-testid="spinner" />);
    
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('renders with label when withLabel is true', () => {
    renderWithTheme(
      <Spinner 
        withLabel 
        label="Loading..." 
        data-testid="spinner" 
      />
    );
    
    const label = screen.getByText('Loading...');
    expect(label).toBeInTheDocument();
  });

  test('does not render label when withLabel is false', () => {
    renderWithTheme(
      <Spinner 
        withLabel={false} 
        label="Loading..." 
        data-testid="spinner" 
      />
    );
    
    const label = screen.queryByText('Loading...');
    expect(label).not.toBeInTheDocument();
  });

  test('renders with custom label text', () => {
    renderWithTheme(
      <Spinner 
        withLabel 
        label="Please wait..." 
        data-testid="spinner" 
      />
    );
    
    const label = screen.getByText('Please wait...');
    expect(label).toBeInTheDocument();
  });

  test('applies className correctly', () => {
    renderWithTheme(
      <Spinner 
        className="custom-spinner" 
        data-testid="spinner-container" 
      />
    );
    
    const spinnerContainer = screen.getByTestId('spinner-container');
    expect(spinnerContainer).toHaveClass('custom-spinner');
  });

  test('renders with different sizes', () => {
    const { rerender } = renderWithTheme(
      <Spinner 
        size="xs" 
        data-testid="spinner" 
      />
    );
    
    let spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Spinner 
          size="sm" 
          data-testid="spinner" 
        />
      </ThemeProvider>
    );
    
    spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Spinner 
          size="md" 
          data-testid="spinner" 
        />
      </ThemeProvider>
    );
    
    spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Spinner 
          size="lg" 
          data-testid="spinner" 
        />
      </ThemeProvider>
    );
    
    spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Spinner 
          size="xl" 
          data-testid="spinner" 
        />
      </ThemeProvider>
    );
    
    spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
  });
});
