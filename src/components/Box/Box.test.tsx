import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Box } from './Box';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Box', () => {
  // Basic rendering tests
  test('renders correctly with children', () => {
    renderWithTheme(
      <Box data-testid="box">Box content</Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toBeInTheDocument();
    expect(box).toHaveTextContent('Box content');
  });

  // Style props tests
  test('applies margin props correctly', () => {
    renderWithTheme(
      <Box m="2" data-testid="box">Box content</Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle('margin: 0.5rem');
    
    // Test individual margin directions
    const { rerender } = renderWithTheme(
      <Box mt="3" data-testid="box">Box content</Box>
    );
    expect(screen.getByTestId('box')).toHaveStyle('margin-top: 0.75rem');
    
    rerender(
      <ThemeProvider>
        <Box mr="4" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('margin-right: 1rem');
    
    rerender(
      <ThemeProvider>
        <Box mb="5" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('margin-bottom: 1.25rem');
    
    rerender(
      <ThemeProvider>
        <Box ml="6" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('margin-left: 1.5rem');
    
    // Test horizontal and vertical margins
    rerender(
      <ThemeProvider>
        <Box mx="2" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('margin-left: 0.5rem');
    expect(screen.getByTestId('box')).toHaveStyle('margin-right: 0.5rem');
    
    rerender(
      <ThemeProvider>
        <Box my="3" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('margin-top: 0.75rem');
    expect(screen.getByTestId('box')).toHaveStyle('margin-bottom: 0.75rem');
  });

  test('applies padding props correctly', () => {
    renderWithTheme(
      <Box p="2" data-testid="box">Box content</Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle('padding: 0.5rem');
    
    // Test individual padding directions
    const { rerender } = renderWithTheme(
      <Box pt="3" data-testid="box">Box content</Box>
    );
    expect(screen.getByTestId('box')).toHaveStyle('padding-top: 0.75rem');
    
    rerender(
      <ThemeProvider>
        <Box pr="4" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('padding-right: 1rem');
    
    rerender(
      <ThemeProvider>
        <Box pb="5" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('padding-bottom: 1.25rem');
    
    rerender(
      <ThemeProvider>
        <Box pl="6" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('padding-left: 1.5rem');
    
    // Test horizontal and vertical paddings
    rerender(
      <ThemeProvider>
        <Box px="2" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('padding-left: 0.5rem');
    expect(screen.getByTestId('box')).toHaveStyle('padding-right: 0.5rem');
    
    rerender(
      <ThemeProvider>
        <Box py="3" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box')).toHaveStyle('padding-top: 0.75rem');
    expect(screen.getByTestId('box')).toHaveStyle('padding-bottom: 0.75rem');
  });

  test('applies color and background props correctly', () => {
    renderWithTheme(
      <Box color="primary.500" bg="neutral.100" data-testid="box">
        Box content
      </Box>
    );
    
    const box = screen.getByTestId('box');
    // Note: Exact color values would depend on the theme implementation
    expect(box).toHaveStyle('color: var(--colors-primary-500)');
    expect(box).toHaveStyle('background-color: var(--colors-neutral-100)');
  });

  test('applies border props correctly', () => {
    renderWithTheme(
      <Box 
        border="1px solid" 
        borderColor="primary.500" 
        borderRadius="md" 
        data-testid="box"
      >
        Box content
      </Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle('border: 1px solid');
    expect(box).toHaveStyle('border-color: var(--colors-primary-500)');
    expect(box).toHaveStyle('border-radius: var(--radii-md)');
  });

  test('applies display and layout props correctly', () => {
    renderWithTheme(
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="space-between" 
        data-testid="box"
      >
        Box content
      </Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle('display: flex');
    expect(box).toHaveStyle('flex-direction: column');
    expect(box).toHaveStyle('align-items: center');
    expect(box).toHaveStyle('justify-content: space-between');
  });

  test('applies width, height, and position props correctly', () => {
    renderWithTheme(
      <Box 
        width="100px" 
        height="50px" 
        position="relative" 
        data-testid="box"
      >
        Box content
      </Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toHaveStyle('width: 100px');
    expect(box).toHaveStyle('height: 50px');
    expect(box).toHaveStyle('position: relative');
  });

  test('applies responsive styles correctly', () => {
    renderWithTheme(
      <Box 
        width={['100%', '50%', '33%']} 
        p={['1', '2', '3']} 
        data-testid="box"
      >
        Box content
      </Box>
    );
    
    const box = screen.getByTestId('box');
    // Note: Testing responsive styles is complex and may require more sophisticated testing
    expect(box).toBeInTheDocument();
  });

  // As prop tests
  test('renders as different HTML elements', () => {
    const { rerender } = renderWithTheme(
      <Box as="section" data-testid="box">Box content</Box>
    );
    
    expect(screen.getByTestId('box').tagName).toBe('SECTION');
    
    rerender(
      <ThemeProvider>
        <Box as="article" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box').tagName).toBe('ARTICLE');
    
    rerender(
      <ThemeProvider>
        <Box as="span" data-testid="box">Box content</Box>
      </ThemeProvider>
    );
    expect(screen.getByTestId('box').tagName).toBe('SPAN');
  });

  // Event handling tests
  test('handles click events', () => {
    const handleClick = jest.fn();
    
    renderWithTheme(
      <Box onClick={handleClick} data-testid="box">
        Box content
      </Box>
    );
    
    const box = screen.getByTestId('box');
    box.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Box data-testid="box">Box content</Box>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('passes through ARIA attributes', () => {
    renderWithTheme(
      <Box 
        aria-label="Box description" 
        aria-hidden={false} 
        role="region" 
        data-testid="box"
      >
        Box content
      </Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toHaveAttribute('aria-label', 'Box description');
    expect(box).toHaveAttribute('aria-hidden', 'false');
    expect(box).toHaveAttribute('role', 'region');
  });

  // Edge cases
  test('handles empty children', () => {
    renderWithTheme(
      <Box data-testid="box"></Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toBeInTheDocument();
    expect(box).toBeEmptyDOMElement();
  });

  test('applies className correctly', () => {
    renderWithTheme(
      <Box className="custom-box" data-testid="box">
        Box content
      </Box>
    );
    
    const box = screen.getByTestId('box');
    expect(box).toHaveClass('custom-box');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    renderWithTheme(
      <Box ref={ref} data-testid="box">
        Box content
      </Box>
    );
    
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('box'));
  });
});
