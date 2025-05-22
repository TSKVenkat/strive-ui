import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Timeline, TimelineProps, TimelineItem } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['vertical', 'horizontal'],
    },
    align: {
      control: { type: 'radio' },
      options: ['left', 'right', 'alternate'],
    },
    animate: {
      control: 'boolean',
    },
    showConnector: {
      control: 'boolean',
    },
    connectorColor: {
      control: 'color',
    },
    connectorWidth: {
      control: 'text',
    },
    dotSize: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

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
  {
    id: 4,
    title: 'Testing',
    content: 'Quality assurance and bug fixing',
    date: 'Apr 25, 2023',
  },
  {
    id: 5,
    title: 'Deployment',
    content: 'Launching the product to production',
    date: 'May 30, 2023',
  },
];

export const Default: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
    align: 'alternate',
    animate: true,
    showConnector: true,
  },
};

export const Horizontal: Story = {
  args: {
    items: sampleItems,
    orientation: 'horizontal',
    animate: true,
    showConnector: true,
  },
};

export const LeftAligned: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
    align: 'left',
    animate: true,
    showConnector: true,
  },
};

export const RightAligned: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
    align: 'right',
    animate: true,
    showConnector: true,
  },
};

export const CustomColors: Story = {
  args: {
    items: [
      {
        id: 1,
        title: 'Project Started',
        content: 'Initial project setup and planning phase',
        date: 'Jan 10, 2023',
        completed: true,
        color: '#8B5CF6',
      },
      {
        id: 2,
        title: 'Design Phase',
        content: 'Creating wireframes and design mockups',
        date: 'Feb 15, 2023',
        completed: true,
        color: '#EC4899',
      },
      {
        id: 3,
        title: 'Development',
        content: 'Building the core functionality and features',
        date: 'Mar 20, 2023',
        active: true,
        color: '#3B82F6',
      },
      {
        id: 4,
        title: 'Testing',
        content: 'Quality assurance and bug fixing',
        date: 'Apr 25, 2023',
        color: '#10B981',
      },
      {
        id: 5,
        title: 'Deployment',
        content: 'Launching the product to production',
        date: 'May 30, 2023',
        color: '#F59E0B',
      },
    ],
    orientation: 'vertical',
    align: 'alternate',
    animate: true,
    showConnector: true,
    connectorColor: '#CBD5E1',
  },
};

export const WithCustomIcons: Story = {
  args: {
    items: [
      {
        id: 1,
        title: 'Project Started',
        content: 'Initial project setup and planning phase',
        date: 'Jan 10, 2023',
        completed: true,
        icon: (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        ),
      },
      {
        id: 2,
        title: 'Design Phase',
        content: 'Creating wireframes and design mockups',
        date: 'Feb 15, 2023',
        completed: true,
        icon: (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a.996.996 0 00-1.41 0L9 12.25 11.75 15l8.96-8.96a.996.996 0 000-1.41z" />
          </svg>
        ),
      },
      {
        id: 3,
        title: 'Development',
        content: 'Building the core functionality and features',
        date: 'Mar 20, 2023',
        active: true,
        icon: (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
          </svg>
        ),
      },
      {
        id: 4,
        title: 'Testing',
        content: 'Quality assurance and bug fixing',
        date: 'Apr 25, 2023',
        icon: (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
          </svg>
        ),
      },
      {
        id: 5,
        title: 'Deployment',
        content: 'Launching the product to production',
        date: 'May 30, 2023',
        icon: (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        ),
      },
    ],
    orientation: 'vertical',
    align: 'alternate',
    animate: true,
    showConnector: true,
  },
};

export const WithMetadata: Story = {
  args: {
    items: [
      {
        id: 1,
        title: 'Project Started',
        content: 'Initial project setup and planning phase',
        date: 'Jan 10, 2023',
        completed: true,
        meta: 'Assigned to: John Doe',
      },
      {
        id: 2,
        title: 'Design Phase',
        content: 'Creating wireframes and design mockups',
        date: 'Feb 15, 2023',
        completed: true,
        meta: 'Assigned to: Jane Smith',
      },
      {
        id: 3,
        title: 'Development',
        content: 'Building the core functionality and features',
        date: 'Mar 20, 2023',
        active: true,
        meta: 'Assigned to: Dev Team',
      },
      {
        id: 4,
        title: 'Testing',
        content: 'Quality assurance and bug fixing',
        date: 'Apr 25, 2023',
        meta: 'Assigned to: QA Team',
      },
      {
        id: 5,
        title: 'Deployment',
        content: 'Launching the product to production',
        date: 'May 30, 2023',
        meta: 'Assigned to: DevOps Team',
      },
    ],
    orientation: 'vertical',
    align: 'alternate',
    animate: true,
    showConnector: true,
  },
};

export const NoAnimation: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
    align: 'alternate',
    animate: false,
    showConnector: true,
  },
};

export const NoConnector: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
    align: 'alternate',
    animate: true,
    showConnector: false,
  },
};

export const CustomSizing: Story = {
  args: {
    items: sampleItems,
    orientation: 'vertical',
    align: 'alternate',
    animate: true,
    showConnector: true,
    connectorWidth: '4px',
    dotSize: '32px',
  },
};
