import React from 'react';
import { render, screen } from '@testing-library/react';
import { Timeline, TimelineItem } from './Timeline';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../../theme';

// Mock theme provider for styled components
const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={defaultTheme}>
      {ui}
    </ThemeProvider>
  );
};

const sampleItems: TimelineItem[] = [
  {
    id: 1,
    title: 'Project Started',
    content: 'Initial project setup and planning phase',
    date: 'Jan 10, 2023',
    completed: true,
  },
  {
    id: 2,
    title: 'Design Phase',
    content: 'Creating wireframes and design mockups',
    date: 'Feb 15, 2023',
    completed: true,
  },
  {
    id: 3,
    title: 'Development',
    content: 'Building the core functionality and features',
    date: 'Mar 20, 2023',
    active: true,
  },
];

describe('Timeline Component', () => {
  it('renders timeline with correct number of items', () => {
    renderWithTheme(<Timeline items={sampleItems} animate={false} />);
    
    // Check if all timeline items are rendered
    const timelineItems = screen.getAllByRole('listitem');
    expect(timelineItems).toHaveLength(sampleItems.length);
  });

  it('renders timeline with correct titles', () => {
    renderWithTheme(<Timeline items={sampleItems} animate={false} />);
    
    // Check if all titles are rendered
    sampleItems.forEach(item => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it('renders timeline with correct content', () => {
    renderWithTheme(<Timeline items={sampleItems} animate={false} />);
    
    // Check if all content is rendered
    sampleItems.forEach(item => {
      expect(screen.getByText(item.content.toString())).toBeInTheDocument();
    });
  });

  it('renders timeline with correct dates', () => {
    renderWithTheme(<Timeline items={sampleItems} animate={false} />);
    
    // Check if all dates are rendered
    sampleItems.forEach(item => {
      if (item.date) {
        expect(screen.getByText(item.date)).toBeInTheDocument();
      }
    });
  });

  it('marks the active item correctly', () => {
    renderWithTheme(<Timeline items={sampleItems} animate={false} />);
    
    // Find the active item
    const activeItem = sampleItems.find(item => item.active);
    if (activeItem) {
      const activeElement = screen.getByText(activeItem.title).closest('[aria-current="step"]');
      expect(activeElement).toBeInTheDocument();
    }
  });

  it('renders timeline with horizontal orientation', () => {
    renderWithTheme(<Timeline items={sampleItems} orientation="horizontal" animate={false} />);
    
    // Check if container has horizontal orientation
    const container = screen.getByRole('list');
    expect(container).toHaveStyle('flex-direction: row');
  });

  it('renders timeline with vertical orientation', () => {
    renderWithTheme(<Timeline items={sampleItems} orientation="vertical" animate={false} />);
    
    // Check if container has vertical orientation
    const container = screen.getByRole('list');
    expect(container).toHaveStyle('flex-direction: column');
  });

  it('renders timeline with left alignment', () => {
    renderWithTheme(<Timeline items={sampleItems} align="left" animate={false} />);
    
    // Check if items have left alignment
    const timelineItems = screen.getAllByRole('listitem');
    expect(timelineItems[0]).toBeInTheDocument();
  });

  it('renders timeline with right alignment', () => {
    renderWithTheme(<Timeline items={sampleItems} align="right" animate={false} />);
    
    // Check if items have right alignment
    const timelineItems = screen.getAllByRole('listitem');
    expect(timelineItems[0]).toBeInTheDocument();
  });

  it('renders timeline with alternate alignment', () => {
    renderWithTheme(<Timeline items={sampleItems} align="alternate" animate={false} />);
    
    // Check if items have alternate alignment
    const timelineItems = screen.getAllByRole('listitem');
    expect(timelineItems[0]).toBeInTheDocument();
  });

  it('renders timeline without connector when showConnector is false', () => {
    const { container } = renderWithTheme(
      <Timeline items={sampleItems} showConnector={false} animate={false} />
    );
    
    // Check if connector is not rendered
    // Since we can't easily target the connector directly, we'll check for its absence
    // by looking at the container's child count
    const timelineContainer = screen.getByRole('list');
    const connectorExists = Array.from(timelineContainer.children).some(
      child => (child as HTMLElement).style.position === 'absolute'
    );
    
    expect(connectorExists).toBe(false);
  });

  it('applies custom connector color when provided', () => {
    const customColor = '#ff0000';
    renderWithTheme(
      <Timeline 
        items={sampleItems} 
        connectorColor={customColor} 
        animate={false} 
      />
    );
    
    // The connector should have the custom color
    const timelineContainer = screen.getByRole('list');
    const connector = Array.from(timelineContainer.children).find(
      child => (child as HTMLElement).style.position === 'absolute'
    ) as HTMLElement;
    
    expect(connector).toHaveStyle(`background-color: ${customColor}`);
  });

  it('applies custom connector width when provided', () => {
    const customWidth = '5px';
    renderWithTheme(
      <Timeline 
        items={sampleItems} 
        connectorWidth={customWidth} 
        animate={false} 
      />
    );
    
    // The connector should have the custom width
    const timelineContainer = screen.getByRole('list');
    const connector = Array.from(timelineContainer.children).find(
      child => (child as HTMLElement).style.position === 'absolute'
    ) as HTMLElement;
    
    // For vertical orientation, width should be set
    expect(connector).toHaveStyle(`width: ${customWidth}`);
  });
});
