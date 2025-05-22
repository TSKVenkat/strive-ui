import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Grid } from './Grid';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Grid', () => {
  // Basic rendering tests
  test('renders correctly with children', () => {
    renderWithTheme(
      <Grid data-testid="grid">
        <Grid.Item data-testid="grid-item">Grid item content</Grid.Item>
      </Grid>
    );
    
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('grid-item')).toBeInTheDocument();
    expect(screen.getByText('Grid item content')).toBeInTheDocument();
  });

  // Grid layout tests
  test('renders with different template columns', () => {
    const { rerender } = renderWithTheme(
      <Grid templateColumns="1fr" data-testid="grid">
        <Grid.Item>Item 1</Grid.Item>
      </Grid>
    );
    
    let grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-columns: 1fr');
    
    rerender(
      <ThemeProvider>
        <Grid templateColumns="1fr 1fr" data-testid="grid">
          <Grid.Item>Item 1</Grid.Item>
          <Grid.Item>Item 2</Grid.Item>
        </Grid>
      </ThemeProvider>
    );
    
    grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-columns: 1fr 1fr');
    
    rerender(
      <ThemeProvider>
        <Grid templateColumns="repeat(3, 1fr)" data-testid="grid">
          <Grid.Item>Item 1</Grid.Item>
          <Grid.Item>Item 2</Grid.Item>
          <Grid.Item>Item 3</Grid.Item>
        </Grid>
      </ThemeProvider>
    );
    
    grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-columns: repeat(3, 1fr)');
  });

  test('renders with different template rows', () => {
    renderWithTheme(
      <Grid templateRows="auto auto" data-testid="grid">
        <Grid.Item>Item 1</Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-rows: auto auto');
  });

  test('renders with different gap values', () => {
    const { rerender } = renderWithTheme(
      <Grid gap="1rem" data-testid="grid">
        <Grid.Item>Item 1</Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
      </Grid>
    );
    
    let grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('gap: 1rem');
    
    rerender(
      <ThemeProvider>
        <Grid columnGap="1rem" rowGap="2rem" data-testid="grid">
          <Grid.Item>Item 1</Grid.Item>
          <Grid.Item>Item 2</Grid.Item>
        </Grid>
      </ThemeProvider>
    );
    
    grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('column-gap: 1rem');
    expect(grid).toHaveStyle('row-gap: 2rem');
  });

  // Grid.Item tests
  test('renders Grid.Item with different column spans', () => {
    renderWithTheme(
      <Grid templateColumns="repeat(3, 1fr)" data-testid="grid">
        <Grid.Item colSpan={2} data-testid="grid-item">
          Spans 2 columns
        </Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
      </Grid>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveStyle('grid-column: span 2');
  });

  test('renders Grid.Item with different row spans', () => {
    renderWithTheme(
      <Grid templateRows="repeat(3, auto)" data-testid="grid">
        <Grid.Item rowSpan={2} data-testid="grid-item">
          Spans 2 rows
        </Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
      </Grid>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveStyle('grid-row: span 2');
  });

  test('renders Grid.Item with specific column start/end positions', () => {
    renderWithTheme(
      <Grid templateColumns="repeat(3, 1fr)" data-testid="grid">
        <Grid.Item colStart={2} colEnd={4} data-testid="grid-item">
          From column 2 to 4
        </Grid.Item>
      </Grid>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveStyle('grid-column-start: 2');
    expect(gridItem).toHaveStyle('grid-column-end: 4');
  });

  test('renders Grid.Item with specific row start/end positions', () => {
    renderWithTheme(
      <Grid templateRows="repeat(3, auto)" data-testid="grid">
        <Grid.Item rowStart={2} rowEnd={4} data-testid="grid-item">
          From row 2 to 4
        </Grid.Item>
      </Grid>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveStyle('grid-row-start: 2');
    expect(gridItem).toHaveStyle('grid-row-end: 4');
  });

  // Responsive grid tests
  test('renders with responsive column templates', () => {
    renderWithTheme(
      <Grid 
        templateColumns={['1fr', '1fr 1fr', 'repeat(3, 1fr)']} 
        data-testid="grid"
      >
        <Grid.Item>Item 1</Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
        <Grid.Item>Item 3</Grid.Item>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
    // Note: Testing responsive styles would require more sophisticated testing
  });

  // Auto-fit and auto-fill tests
  test('renders with auto-fit columns', () => {
    renderWithTheme(
      <Grid 
        templateColumns="repeat(auto-fit, minmax(200px, 1fr))" 
        data-testid="grid"
      >
        <Grid.Item>Item 1</Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))');
  });

  test('renders with auto-fill columns', () => {
    renderWithTheme(
      <Grid 
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))" 
        data-testid="grid"
      >
        <Grid.Item>Item 1</Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))');
  });

  // Grid areas tests
  test('renders with template areas', () => {
    renderWithTheme(
      <Grid 
        templateAreas={`
          "header header"
          "sidebar content"
          "footer footer"
        `}
        templateColumns="200px 1fr"
        templateRows="auto 1fr auto"
        data-testid="grid"
      >
        <Grid.Item gridArea="header" data-testid="header">Header</Grid.Item>
        <Grid.Item gridArea="sidebar" data-testid="sidebar">Sidebar</Grid.Item>
        <Grid.Item gridArea="content" data-testid="content">Content</Grid.Item>
        <Grid.Item gridArea="footer" data-testid="footer">Footer</Grid.Item>
      </Grid>
    );
    
    const grid = screen.getByTestId('grid');
    const header = screen.getByTestId('header');
    const sidebar = screen.getByTestId('sidebar');
    const content = screen.getByTestId('content');
    const footer = screen.getByTestId('footer');
    
    expect(grid).toBeInTheDocument();
    expect(header).toHaveStyle('grid-area: header');
    expect(sidebar).toHaveStyle('grid-area: sidebar');
    expect(content).toHaveStyle('grid-area: content');
    expect(footer).toHaveStyle('grid-area: footer');
  });

  // Grid alignment tests
  test('renders with different alignment properties', () => {
    const { rerender } = renderWithTheme(
      <Grid 
        alignItems="center" 
        justifyItems="end" 
        data-testid="grid"
      >
        <Grid.Item>Item 1</Grid.Item>
      </Grid>
    );
    
    let grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('align-items: center');
    expect(grid).toHaveStyle('justify-items: end');
    
    rerender(
      <ThemeProvider>
        <Grid 
          alignContent="space-between" 
          justifyContent="space-around" 
          data-testid="grid"
        >
          <Grid.Item>Item 1</Grid.Item>
        </Grid>
      </ThemeProvider>
    );
    
    grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('align-content: space-between');
    expect(grid).toHaveStyle('justify-content: space-around');
  });

  test('renders Grid.Item with different self-alignment', () => {
    renderWithTheme(
      <Grid data-testid="grid">
        <Grid.Item 
          alignSelf="center" 
          justifySelf="end" 
          data-testid="grid-item"
        >
          Aligned item
        </Grid.Item>
      </Grid>
    );
    
    const gridItem = screen.getByTestId('grid-item');
    expect(gridItem).toHaveStyle('align-self: center');
    expect(gridItem).toHaveStyle('justify-self: end');
  });

  // Auto-flow tests
  test('renders with different grid-auto-flow values', () => {
    const { rerender } = renderWithTheme(
      <Grid autoFlow="row" data-testid="grid">
        <Grid.Item>Item 1</Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
      </Grid>
    );
    
    let grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-auto-flow: row');
    
    rerender(
      <ThemeProvider>
        <Grid autoFlow="column" data-testid="grid">
          <Grid.Item>Item 1</Grid.Item>
          <Grid.Item>Item 2</Grid.Item>
        </Grid>
      </ThemeProvider>
    );
    
    grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-auto-flow: column');
    
    rerender(
      <ThemeProvider>
        <Grid autoFlow="row dense" data-testid="grid">
          <Grid.Item>Item 1</Grid.Item>
          <Grid.Item>Item 2</Grid.Item>
        </Grid>
      </ThemeProvider>
    );
    
    grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle('grid-auto-flow: row dense');
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Grid data-testid="grid">
        <Grid.Item>Item 1</Grid.Item>
        <Grid.Item>Item 2</Grid.Item>
      </Grid>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Edge cases
  test('applies className correctly', () => {
    renderWithTheme(
      <Grid className="custom-grid" data-testid="grid">
        <Grid.Item className="custom-item" data-testid="grid-item">
          Grid item
        </Grid.Item>
      </Grid>
    );
    
    expect(screen.getByTestId('grid')).toHaveClass('custom-grid');
    expect(screen.getByTestId('grid-item')).toHaveClass('custom-item');
  });

  test('handles empty children gracefully', () => {
    renderWithTheme(
      <Grid data-testid="grid"></Grid>
    );
    
    const grid = screen.getByTestId('grid');
    expect(grid).toBeInTheDocument();
    expect(grid).toBeEmptyDOMElement();
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    renderWithTheme(
      <Grid ref={ref} data-testid="grid">
        <Grid.Item>Item 1</Grid.Item>
      </Grid>
    );
    
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('grid'));
  });
});
