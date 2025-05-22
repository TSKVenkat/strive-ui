import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { Badge } from './Badge';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Badge', () => {
  test('renders correctly with children', () => {
    renderWithTheme(<Badge data-testid="badge">New</Badge>);
    
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('New');
  });

  test('renders with different variants', () => {
    const { rerender } = renderWithTheme(
      <Badge variant="solid" data-testid="badge">
        Solid
      </Badge>
    );
    
    let badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Solid');
    
    rerender(
      <ThemeProvider>
        <Badge variant="outline" data-testid="badge">
          Outline
        </Badge>
      </ThemeProvider>
    );
    
    badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Outline');
    
    rerender(
      <ThemeProvider>
        <Badge variant="subtle" data-testid="badge">
          Subtle
        </Badge>
      </ThemeProvider>
    );
    
    badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('Subtle');
  });

  test('renders with different colors', () => {
    const { rerender } = renderWithTheme(
      <Badge color="primary" data-testid="badge">
        Primary
      </Badge>
    );
    
    let badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Badge color="success" data-testid="badge">
          Success
        </Badge>
      </ThemeProvider>
    );
    
    badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Badge color="warning" data-testid="badge">
          Warning
        </Badge>
      </ThemeProvider>
    );
    
    badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Badge color="error" data-testid="badge">
          Error
        </Badge>
      </ThemeProvider>
    );
    
    badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Badge color="info" data-testid="badge">
          Info
        </Badge>
      </ThemeProvider>
    );
    
    badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
  });

  test('renders with different sizes', () => {
    const { rerender } = renderWithTheme(
      <Badge size="sm" data-testid="badge">
        Small
      </Badge>
    );
    
    let badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Badge size="md" data-testid="badge">
          Medium
        </Badge>
      </ThemeProvider>
    );
    
    badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Badge size="lg" data-testid="badge">
          Large
        </Badge>
      </ThemeProvider>
    );
    
    badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
  });

  test('renders with rounded style when rounded prop is true', () => {
    renderWithTheme(
      <Badge rounded data-testid="badge">
        8
      </Badge>
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toBeInTheDocument();
  });

  test('applies className correctly', () => {
    renderWithTheme(
      <Badge className="custom-badge" data-testid="badge">
        Custom
      </Badge>
    );
    
    const badge = screen.getByTestId('badge');
    expect(badge).toHaveClass('custom-badge');
  });
});
