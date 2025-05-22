import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Accordion } from './Accordion';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Accordion', () => {
  // Basic rendering tests
  test('renders correctly with default props', () => {
    renderWithTheme(
      <Accordion data-testid="accordion">
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    expect(screen.getByTestId('accordion')).toBeInTheDocument();
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  // Interaction tests
  test('expands and collapses when header is clicked', () => {
    renderWithTheme(
      <Accordion>
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const header = screen.getByText('Section 1');
    const panel = screen.getByText('Content 1');
    
    // Initially panel should be collapsed
    expect(panel.parentElement).toHaveStyle('max-height: 0');
    
    // Click to expand
    fireEvent.click(header);
    expect(panel.parentElement).toHaveStyle('max-height: 1000px');
    
    // Click to collapse
    fireEvent.click(header);
    expect(panel.parentElement).toHaveStyle('max-height: 0');
  });

  // Multiple items tests
  test('only one item expands at a time by default', () => {
    renderWithTheme(
      <Accordion>
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const header1 = screen.getByText('Section 1');
    const header2 = screen.getByText('Section 2');
    const panel1 = screen.getByText('Content 1');
    const panel2 = screen.getByText('Content 2');
    
    // Expand first item
    fireEvent.click(header1);
    expect(panel1.parentElement).toHaveStyle('max-height: 1000px');
    expect(panel2.parentElement).toHaveStyle('max-height: 0');
    
    // Expand second item, first should collapse
    fireEvent.click(header2);
    expect(panel1.parentElement).toHaveStyle('max-height: 0');
    expect(panel2.parentElement).toHaveStyle('max-height: 1000px');
  });

  // Multiple expansion test
  test('allows multiple items to be expanded when allowMultiple is true', () => {
    renderWithTheme(
      <Accordion allowMultiple>
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const header1 = screen.getByText('Section 1');
    const header2 = screen.getByText('Section 2');
    const panel1 = screen.getByText('Content 1');
    const panel2 = screen.getByText('Content 2');
    
    // Expand first item
    fireEvent.click(header1);
    expect(panel1.parentElement).toHaveStyle('max-height: 1000px');
    
    // Expand second item, first should remain expanded
    fireEvent.click(header2);
    expect(panel1.parentElement).toHaveStyle('max-height: 1000px');
    expect(panel2.parentElement).toHaveStyle('max-height: 1000px');
  });

  // Default expanded items test
  test('respects defaultExpandedItems prop', () => {
    renderWithTheme(
      <Accordion defaultExpandedItems={['item2']}>
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const panel1 = screen.getByText('Content 1');
    const panel2 = screen.getByText('Content 2');
    
    // Item 2 should be expanded by default
    expect(panel1.parentElement).toHaveStyle('max-height: 0');
    expect(panel2.parentElement).toHaveStyle('max-height: 1000px');
  });

  // Controlled component test
  test('functions as a controlled component with expandedItems and onChange', () => {
    const handleChange = jest.fn();
    const { rerender } = renderWithTheme(
      <Accordion expandedItems={['item1']} onChange={handleChange}>
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const header1 = screen.getByText('Section 1');
    const panel1 = screen.getByText('Content 1');
    const panel2 = screen.getByText('Content 2');
    
    // Item 1 should be expanded initially
    expect(panel1.parentElement).toHaveStyle('max-height: 1000px');
    expect(panel2.parentElement).toHaveStyle('max-height: 0');
    
    // Click header 1 to collapse
    fireEvent.click(header1);
    expect(handleChange).toHaveBeenCalledWith([]);
    
    // Controlled component should not change until props change
    expect(panel1.parentElement).toHaveStyle('max-height: 1000px');
    
    // Update props to reflect the change
    rerender(
      <ThemeProvider>
        <Accordion expandedItems={[]} onChange={handleChange}>
          <Accordion.Item id="item1">
            <Accordion.Header>Section 1</Accordion.Header>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item id="item2">
            <Accordion.Header>Section 2</Accordion.Header>
            <Accordion.Panel>Content 2</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </ThemeProvider>
    );
    
    // Now item 1 should be collapsed
    expect(panel1.parentElement).toHaveStyle('max-height: 0');
  });

  // Disabled item test
  test('disabled items cannot be toggled', () => {
    renderWithTheme(
      <Accordion>
        <Accordion.Item id="item1" isDisabled>
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const header = screen.getByText('Section 1');
    const panel = screen.getByText('Content 1');
    
    // Click the disabled header
    fireEvent.click(header);
    
    // Panel should remain collapsed
    expect(panel.parentElement).toHaveStyle('max-height: 0');
  });

  // Variant tests
  test('renders with different variants', () => {
    const { rerender } = renderWithTheme(
      <Accordion variant="default" data-testid="accordion">
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    // Default variant
    let accordion = screen.getByTestId('accordion');
    expect(accordion).toBeInTheDocument();
    
    // Bordered variant
    rerender(
      <ThemeProvider>
        <Accordion variant="bordered" data-testid="accordion">
          <Accordion.Item id="item1">
            <Accordion.Header>Section 1</Accordion.Header>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </ThemeProvider>
    );
    
    accordion = screen.getByTestId('accordion');
    expect(accordion).toBeInTheDocument();
    
    // Filled variant
    rerender(
      <ThemeProvider>
        <Accordion variant="filled" data-testid="accordion">
          <Accordion.Item id="item1">
            <Accordion.Header>Section 1</Accordion.Header>
            <Accordion.Panel>Content 1</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </ThemeProvider>
    );
    
    accordion = screen.getByTestId('accordion');
    expect(accordion).toBeInTheDocument();
  });

  // Keyboard interaction tests
  test('supports keyboard interaction', () => {
    renderWithTheme(
      <Accordion>
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const header = screen.getByText('Section 1');
    const panel = screen.getByText('Content 1');
    
    // Focus the header
    header.focus();
    
    // Press Enter to expand
    fireEvent.keyDown(header, { key: 'Enter' });
    expect(panel.parentElement).toHaveStyle('max-height: 1000px');
    
    // Press Enter again to collapse
    fireEvent.keyDown(header, { key: 'Enter' });
    expect(panel.parentElement).toHaveStyle('max-height: 0');
    
    // Press Space to expand
    fireEvent.keyDown(header, { key: ' ' });
    expect(panel.parentElement).toHaveStyle('max-height: 1000px');
  });

  // Accessibility tests
  test('has no accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Accordion>
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="item2">
          <Accordion.Header>Section 2</Accordion.Header>
          <Accordion.Panel>Content 2</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // ARIA attributes tests
  test('has correct ARIA attributes', () => {
    renderWithTheme(
      <Accordion>
        <Accordion.Item id="item1">
          <Accordion.Header>Section 1</Accordion.Header>
          <Accordion.Panel>Content 1</Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
    
    const header = screen.getByText('Section 1');
    const panel = screen.getByText('Content 1').parentElement;
    
    // Header should have button role and aria-expanded
    expect(header).toHaveAttribute('role', 'button');
    expect(header).toHaveAttribute('aria-expanded', 'false');
    
    // Panel should have appropriate ID and be controlled by header
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    
    // Expand the panel
    fireEvent.click(header);
    
    // Attributes should update
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(panel).toHaveAttribute('aria-hidden', 'false');
  });
});
