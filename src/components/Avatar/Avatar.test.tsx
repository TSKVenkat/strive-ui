import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Avatar } from './Avatar';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Avatar', () => {
  // Basic rendering tests
  test('renders correctly with image src', () => {
    renderWithTheme(
      <Avatar 
        src="https://example.com/avatar.jpg" 
        alt="User avatar" 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    const img = avatar.querySelector('img');
    
    expect(avatar).toBeInTheDocument();
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(img).toHaveAttribute('alt', 'User avatar');
  });

  test('renders initials when name is provided and no src', () => {
    renderWithTheme(
      <Avatar 
        name="John Doe" 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent('JD');
  });

  test('renders first letter of name when single name is provided', () => {
    renderWithTheme(
      <Avatar 
        name="John" 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent('J');
  });

  test('renders fallback icon when no src or name is provided', () => {
    renderWithTheme(
      <Avatar 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    // Check for fallback icon (this might need adjustment based on actual implementation)
    expect(avatar.querySelector('svg')).toBeInTheDocument();
  });

  test('renders children over src and name when provided', () => {
    renderWithTheme(
      <Avatar 
        src="https://example.com/avatar.jpg"
        name="John Doe"
        data-testid="avatar"
      >
        <span data-testid="custom-content">Custom</span>
      </Avatar>
    );
    
    const avatar = screen.getByTestId('avatar');
    const customContent = screen.getByTestId('custom-content');
    
    expect(avatar).toBeInTheDocument();
    expect(customContent).toBeInTheDocument();
    expect(avatar.querySelector('img')).not.toBeInTheDocument();
    expect(avatar).not.toHaveTextContent('JD');
  });

  // Size tests
  test('renders with different sizes', () => {
    const sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'> = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    
    const { rerender } = renderWithTheme(
      <Avatar 
        name="John Doe" 
        size="md" 
        data-testid="avatar" 
      />
    );
    
    // Test each size
    sizes.forEach(size => {
      rerender(
        <ThemeProvider>
          <Avatar 
            name="John Doe" 
            size={size} 
            data-testid="avatar" 
          />
        </ThemeProvider>
      );
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  // Variant tests
  test('renders with different variants', () => {
    const variants: Array<'circle' | 'square' | 'rounded'> = ['circle', 'square', 'rounded'];
    
    const { rerender } = renderWithTheme(
      <Avatar 
        name="John Doe" 
        variant="circle" 
        data-testid="avatar" 
      />
    );
    
    // Test each variant
    variants.forEach(variant => {
      rerender(
        <ThemeProvider>
          <Avatar 
            name="John Doe" 
            variant={variant} 
            data-testid="avatar" 
          />
        </ThemeProvider>
      );
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
    });
  });

  // Status tests
  test('renders with different status indicators', () => {
    const statuses: Array<'online' | 'offline' | 'away' | 'busy' | 'none'> = ['online', 'offline', 'away', 'busy', 'none'];
    
    const { rerender } = renderWithTheme(
      <Avatar 
        name="John Doe" 
        status="online" 
        data-testid="avatar" 
      />
    );
    
    // Test each status
    statuses.forEach(status => {
      rerender(
        <ThemeProvider>
          <Avatar 
            name="John Doe" 
            status={status} 
            data-testid="avatar" 
          />
        </ThemeProvider>
      );
      
      const avatar = screen.getByTestId('avatar');
      expect(avatar).toBeInTheDocument();
      
      if (status !== 'none') {
        const statusIndicator = avatar.querySelector('[data-status]');
        expect(statusIndicator).toBeInTheDocument();
        expect(statusIndicator).toHaveAttribute('data-status', status);
      } else {
        const statusIndicator = avatar.querySelector('[data-status]');
        expect(statusIndicator).not.toBeInTheDocument();
      }
    });
  });

  // Background color test
  test('applies custom background color', () => {
    renderWithTheme(
      <Avatar 
        name="John Doe" 
        bgColor="#FF5733" 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveStyle('background-color: #FF5733');
  });

  // Click handler test
  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    
    renderWithTheme(
      <Avatar 
        name="John Doe" 
        onClick={handleClick} 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    fireEvent.click(avatar);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Image error handling test
  test('falls back to initials when image fails to load', () => {
    renderWithTheme(
      <Avatar 
        src="https://example.com/invalid.jpg" 
        name="John Doe" 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    const img = avatar.querySelector('img');
    
    expect(img).toBeInTheDocument();
    
    // Simulate image load error
    fireEvent.error(img!);
    
    // Should now show initials instead
    expect(avatar).toHaveTextContent('JD');
    expect(avatar.querySelector('img')).not.toBeInTheDocument();
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Avatar 
        src="https://example.com/avatar.jpg" 
        alt="User avatar" 
        data-testid="avatar" 
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has appropriate ARIA attributes', () => {
    renderWithTheme(
      <Avatar 
        src="https://example.com/avatar.jpg" 
        alt="User avatar" 
        name="John Doe"
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    const img = avatar.querySelector('img');
    
    expect(img).toHaveAttribute('alt', 'User avatar');
    
    // If avatar is interactive (has onClick), it should have appropriate ARIA attributes
    const { rerender } = renderWithTheme(
      <Avatar 
        src="https://example.com/avatar.jpg" 
        alt="User avatar" 
        onClick={() => {}} 
        data-testid="avatar" 
      />
    );
    
    const interactiveAvatar = screen.getByTestId('avatar');
    expect(interactiveAvatar).toHaveAttribute('role', 'button');
    expect(interactiveAvatar).toHaveAttribute('tabIndex', '0');
  });

  // Edge cases
  test('handles empty name gracefully', () => {
    renderWithTheme(
      <Avatar 
        name="" 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    // Should show fallback icon instead of empty initials
    expect(avatar.querySelector('svg')).toBeInTheDocument();
  });

  test('handles special characters in name', () => {
    renderWithTheme(
      <Avatar 
        name="John-Doe O'Connor" 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent('JO');
  });

  test('handles names with multiple spaces', () => {
    renderWithTheme(
      <Avatar 
        name="John  Doe   Smith" 
        data-testid="avatar" 
      />
    );
    
    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent('JS');
  });
});
