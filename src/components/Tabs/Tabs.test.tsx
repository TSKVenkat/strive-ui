import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Tabs } from './Tabs';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Tabs', () => {
  // Basic rendering tests
  test('renders correctly with default props', () => {
    renderWithTheme(
      <Tabs data-testid="tabs">
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
          <Tabs.Tab>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
          <Tabs.Panel>Panel 3 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    const tabs = screen.getByTestId('tabs');
    expect(tabs).toBeInTheDocument();
    
    // All tabs should be rendered
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
    
    // Only the first panel should be visible by default
    expect(screen.getByText('Panel 1 content')).toBeVisible();
    expect(screen.queryByText('Panel 2 content')).not.toBeVisible();
    expect(screen.queryByText('Panel 3 content')).not.toBeVisible();
  });

  // Tab selection tests
  test('changes active tab when clicked', () => {
    renderWithTheme(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
          <Tabs.Tab>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
          <Tabs.Panel>Panel 3 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    // Initially, the first tab should be active
    expect(screen.getByText('Panel 1 content')).toBeVisible();
    
    // Click the second tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    // Now the second panel should be visible
    expect(screen.queryByText('Panel 1 content')).not.toBeVisible();
    expect(screen.getByText('Panel 2 content')).toBeVisible();
    expect(screen.queryByText('Panel 3 content')).not.toBeVisible();
    
    // Click the third tab
    fireEvent.click(screen.getByText('Tab 3'));
    
    // Now the third panel should be visible
    expect(screen.queryByText('Panel 1 content')).not.toBeVisible();
    expect(screen.queryByText('Panel 2 content')).not.toBeVisible();
    expect(screen.getByText('Panel 3 content')).toBeVisible();
  });

  // Default index tests
  test('respects defaultIndex prop', () => {
    renderWithTheme(
      <Tabs defaultIndex={1}>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
          <Tabs.Tab>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
          <Tabs.Panel>Panel 3 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    // The second tab should be active initially
    expect(screen.queryByText('Panel 1 content')).not.toBeVisible();
    expect(screen.getByText('Panel 2 content')).toBeVisible();
    expect(screen.queryByText('Panel 3 content')).not.toBeVisible();
  });

  // Controlled component tests
  test('functions as a controlled component', () => {
    const handleChange = jest.fn();
    
    const { rerender } = renderWithTheme(
      <Tabs index={0} onChange={handleChange}>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
          <Tabs.Tab>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
          <Tabs.Panel>Panel 3 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    // Initially, the first tab should be active
    expect(screen.getByText('Panel 1 content')).toBeVisible();
    
    // Click the second tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    // The onChange handler should be called
    expect(handleChange).toHaveBeenCalledWith(1);
    
    // But the tab shouldn't change (it's controlled)
    expect(screen.getByText('Panel 1 content')).toBeVisible();
    
    // Update the index prop
    rerender(
      <ThemeProvider>
        <Tabs index={1} onChange={handleChange}>
          <Tabs.List>
            <Tabs.Tab>Tab 1</Tabs.Tab>
            <Tabs.Tab>Tab 2</Tabs.Tab>
            <Tabs.Tab>Tab 3</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel>Panel 1 content</Tabs.Panel>
            <Tabs.Panel>Panel 2 content</Tabs.Panel>
            <Tabs.Panel>Panel 3 content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </ThemeProvider>
    );
    
    // Now the second panel should be visible
    expect(screen.queryByText('Panel 1 content')).not.toBeVisible();
    expect(screen.getByText('Panel 2 content')).toBeVisible();
  });

  // Variant tests
  test('renders with different variants', () => {
    const { rerender } = renderWithTheme(
      <Tabs variant="line" data-testid="tabs">
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    let tabs = screen.getByTestId('tabs');
    expect(tabs).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Tabs variant="enclosed" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab>Tab 1</Tabs.Tab>
            <Tabs.Tab>Tab 2</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel>Panel 1 content</Tabs.Panel>
            <Tabs.Panel>Panel 2 content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </ThemeProvider>
    );
    
    tabs = screen.getByTestId('tabs');
    expect(tabs).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Tabs variant="filled" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab>Tab 1</Tabs.Tab>
            <Tabs.Tab>Tab 2</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel>Panel 1 content</Tabs.Panel>
            <Tabs.Panel>Panel 2 content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </ThemeProvider>
    );
    
    tabs = screen.getByTestId('tabs');
    expect(tabs).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Tabs variant="unstyled" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab>Tab 1</Tabs.Tab>
            <Tabs.Tab>Tab 2</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel>Panel 1 content</Tabs.Panel>
            <Tabs.Panel>Panel 2 content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </ThemeProvider>
    );
    
    tabs = screen.getByTestId('tabs');
    expect(tabs).toBeInTheDocument();
  });

  // Orientation tests
  test('renders with different orientations', () => {
    const { rerender } = renderWithTheme(
      <Tabs orientation="horizontal" data-testid="tabs">
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    let tabs = screen.getByTestId('tabs');
    expect(tabs).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Tabs orientation="vertical" data-testid="tabs">
          <Tabs.List>
            <Tabs.Tab>Tab 1</Tabs.Tab>
            <Tabs.Tab>Tab 2</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel>Panel 1 content</Tabs.Panel>
            <Tabs.Panel>Panel 2 content</Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </ThemeProvider>
    );
    
    tabs = screen.getByTestId('tabs');
    expect(tabs).toBeInTheDocument();
  });

  // Disabled tab tests
  test('does not select disabled tabs', () => {
    renderWithTheme(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab isDisabled>Tab 2</Tabs.Tab>
          <Tabs.Tab>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
          <Tabs.Panel>Panel 3 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    // Initially, the first tab should be active
    expect(screen.getByText('Panel 1 content')).toBeVisible();
    
    // Try to click the disabled tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    // The first panel should still be visible
    expect(screen.getByText('Panel 1 content')).toBeVisible();
    expect(screen.queryByText('Panel 2 content')).not.toBeVisible();
    
    // Click the third tab
    fireEvent.click(screen.getByText('Tab 3'));
    
    // Now the third panel should be visible
    expect(screen.queryByText('Panel 1 content')).not.toBeVisible();
    expect(screen.getByText('Panel 3 content')).toBeVisible();
  });

  // Keyboard navigation tests
  test('supports keyboard navigation', () => {
    renderWithTheme(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
          <Tabs.Tab>Tab 3</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
          <Tabs.Panel>Panel 3 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    // Focus the first tab
    const firstTab = screen.getByText('Tab 1');
    firstTab.focus();
    
    // Press right arrow key to move to the next tab
    fireEvent.keyDown(document.activeElement || document.body, { key: 'ArrowRight' });
    
    // The second tab should now be focused
    expect(document.activeElement).toBe(screen.getByText('Tab 2'));
    
    // Press right arrow key again to move to the third tab
    fireEvent.keyDown(document.activeElement || document.body, { key: 'ArrowRight' });
    
    // The third tab should now be focused
    expect(document.activeElement).toBe(screen.getByText('Tab 3'));
    
    // Press right arrow key again should cycle back to the first tab
    fireEvent.keyDown(document.activeElement || document.body, { key: 'ArrowRight' });
    
    // The first tab should now be focused
    expect(document.activeElement).toBe(screen.getByText('Tab 1'));
    
    // Press left arrow key to move to the last tab
    fireEvent.keyDown(document.activeElement || document.body, { key: 'ArrowLeft' });
    
    // The third tab should now be focused
    expect(document.activeElement).toBe(screen.getByText('Tab 3'));
  });

  // Lazy rendering tests
  test('supports lazy rendering of panels', () => {
    renderWithTheme(
      <Tabs isLazy>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    // Initially, only the first panel should be rendered
    expect(screen.getByText('Panel 1 content')).toBeInTheDocument();
    expect(screen.queryByText('Panel 2 content')).not.toBeInTheDocument();
    
    // Click the second tab
    fireEvent.click(screen.getByText('Tab 2'));
    
    // Now the second panel should be rendered
    expect(screen.queryByText('Panel 1 content')).not.toBeVisible();
    expect(screen.getByText('Panel 2 content')).toBeVisible();
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Tabs>
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('has appropriate ARIA attributes', () => {
    renderWithTheme(
      <Tabs>
        <Tabs.List aria-label="Tabs example">
          <Tabs.Tab>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
          <Tabs.Panel>Panel 2 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    // TabList should have role="tablist"
    const tabList = screen.getByRole('tablist');
    expect(tabList).toHaveAttribute('aria-label', 'Tabs example');
    
    // Tabs should have role="tab"
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    
    // First tab should be selected by default
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    
    // TabPanels should have role="tabpanel"
    const panels = screen.getAllByRole('tabpanel');
    expect(panels).toHaveLength(1); // Only the active panel is rendered by default
    
    // Each tab should control its panel
    expect(tabs[0]).toHaveAttribute('aria-controls');
    const panelId = tabs[0].getAttribute('aria-controls');
    expect(panels[0]).toHaveAttribute('id', panelId);
    
    // Each panel should be labeled by its tab
    expect(panels[0]).toHaveAttribute('aria-labelledby');
    const tabId = panels[0].getAttribute('aria-labelledby');
    expect(tabs[0]).toHaveAttribute('id', tabId);
  });

  // Edge cases
  test('handles no children gracefully', () => {
    renderWithTheme(
      <Tabs data-testid="tabs">
        <Tabs.List></Tabs.List>
        <Tabs.Panels></Tabs.Panels>
      </Tabs>
    );
    
    const tabs = screen.getByTestId('tabs');
    expect(tabs).toBeInTheDocument();
  });

  test('applies className correctly', () => {
    renderWithTheme(
      <Tabs className="custom-tabs" data-testid="tabs">
        <Tabs.List className="custom-list">
          <Tabs.Tab className="custom-tab">Tab 1</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels className="custom-panels">
          <Tabs.Panel className="custom-panel">Panel 1 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    expect(screen.getByTestId('tabs')).toHaveClass('custom-tabs');
    expect(screen.getByRole('tablist')).toHaveClass('custom-list');
    expect(screen.getByRole('tab')).toHaveClass('custom-tab');
    expect(screen.getByRole('tabpanel')).toHaveClass('custom-panel');
  });

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    
    renderWithTheme(
      <Tabs ref={ref} data-testid="tabs">
        <Tabs.List>
          <Tabs.Tab>Tab 1</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>Panel 1 content</Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );
    
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId('tabs'));
  });
});
