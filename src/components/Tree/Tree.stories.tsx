import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tree, TreeProps, TreeNode } from './Tree';

const meta: Meta<typeof Tree> = {
  title: 'Components/Tree',
  component: Tree,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showLines: {
      control: 'boolean',
    },
    animate: {
      control: 'boolean',
    },
    multiSelect: {
      control: 'boolean',
    },
    showIcons: {
      control: 'boolean',
    },
    indented: {
      control: 'boolean',
    },
    indentationWidth: {
      control: { type: 'number', min: 0, max: 100, step: 4 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tree>;

// File icons
const FolderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="currentColor" />
  </svg>
);

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor" />
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor" />
  </svg>
);

const CodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor" />
  </svg>
);

// Sample file structure
const fileStructure: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: <FolderIcon />,
    defaultExpanded: true,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <FolderIcon />,
        defaultExpanded: true,
        children: [
          {
            id: 'Button',
            label: 'Button',
            icon: <FolderIcon />,
            children: [
              {
                id: 'Button.tsx',
                label: 'Button.tsx',
                icon: <CodeIcon />,
              },
              {
                id: 'Button.test.tsx',
                label: 'Button.test.tsx',
                icon: <CodeIcon />,
              },
              {
                id: 'Button.stories.tsx',
                label: 'Button.stories.tsx',
                icon: <CodeIcon />,
              },
            ],
          },
          {
            id: 'Tree',
            label: 'Tree',
            icon: <FolderIcon />,
            children: [
              {
                id: 'Tree.tsx',
                label: 'Tree.tsx',
                icon: <CodeIcon />,
              },
              {
                id: 'Tree.test.tsx',
                label: 'Tree.test.tsx',
                icon: <CodeIcon />,
              },
              {
                id: 'Tree.stories.tsx',
                label: 'Tree.stories.tsx',
                icon: <CodeIcon />,
              },
            ],
          },
        ],
      },
      {
        id: 'assets',
        label: 'assets',
        icon: <FolderIcon />,
        children: [
          {
            id: 'logo.png',
            label: 'logo.png',
            icon: <ImageIcon />,
          },
          {
            id: 'background.jpg',
            label: 'background.jpg',
            icon: <ImageIcon />,
          },
        ],
      },
      {
        id: 'utils',
        label: 'utils',
        icon: <FolderIcon />,
        children: [
          {
            id: 'helpers.ts',
            label: 'helpers.ts',
            icon: <FileIcon />,
          },
          {
            id: 'constants.ts',
            label: 'constants.ts',
            icon: <FileIcon />,
          },
        ],
      },
      {
        id: 'App.tsx',
        label: 'App.tsx',
        icon: <CodeIcon />,
      },
      {
        id: 'index.tsx',
        label: 'index.tsx',
        icon: <CodeIcon />,
      },
    ],
  },
  {
    id: 'public',
    label: 'public',
    icon: <FolderIcon />,
    children: [
      {
        id: 'index.html',
        label: 'index.html',
        icon: <FileIcon />,
      },
      {
        id: 'favicon.ico',
        label: 'favicon.ico',
        icon: <ImageIcon />,
      },
    ],
  },
  {
    id: 'package.json',
    label: 'package.json',
    icon: <FileIcon />,
  },
  {
    id: 'tsconfig.json',
    label: 'tsconfig.json',
    icon: <FileIcon />,
  },
  {
    id: 'README.md',
    label: 'README.md',
    icon: <FileIcon />,
  },
];

// Sample organization structure
const organizationStructure: TreeNode[] = [
  {
    id: 'ceo',
    label: 'CEO - John Smith',
    defaultExpanded: true,
    children: [
      {
        id: 'cto',
        label: 'CTO - Jane Doe',
        children: [
          {
            id: 'engineering-manager',
            label: 'Engineering Manager - Bob Johnson',
            children: [
              {
                id: 'frontend-lead',
                label: 'Frontend Lead - Alice Williams',
                children: [
                  {
                    id: 'frontend-dev-1',
                    label: 'Frontend Developer - Mike Brown',
                  },
                  {
                    id: 'frontend-dev-2',
                    label: 'Frontend Developer - Sarah Miller',
                  },
                ],
              },
              {
                id: 'backend-lead',
                label: 'Backend Lead - Tom Davis',
                children: [
                  {
                    id: 'backend-dev-1',
                    label: 'Backend Developer - Chris Wilson',
                  },
                  {
                    id: 'backend-dev-2',
                    label: 'Backend Developer - Emily Taylor',
                  },
                ],
              },
            ],
          },
          {
            id: 'product-manager',
            label: 'Product Manager - David Martinez',
          },
        ],
      },
      {
        id: 'cfo',
        label: 'CFO - Robert Anderson',
        children: [
          {
            id: 'finance-manager',
            label: 'Finance Manager - Lisa Thomas',
          },
          {
            id: 'accounting',
            label: 'Accounting - Mark Jackson',
          },
        ],
      },
      {
        id: 'cmo',
        label: 'CMO - Patricia White',
        children: [
          {
            id: 'marketing-manager',
            label: 'Marketing Manager - Jennifer Harris',
          },
          {
            id: 'sales-director',
            label: 'Sales Director - Michael Clark',
            children: [
              {
                id: 'sales-rep-1',
                label: 'Sales Representative - Daniel Lewis',
              },
              {
                id: 'sales-rep-2',
                label: 'Sales Representative - Michelle Walker',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const Default: Story = {
  args: {
    nodes: fileStructure,
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: true,
    indented: true,
    indentationWidth: 20,
  },
};

export const WithoutLines: Story = {
  args: {
    nodes: fileStructure,
    showLines: false,
    animate: true,
    multiSelect: false,
    showIcons: true,
  },
};

export const WithoutAnimation: Story = {
  args: {
    nodes: fileStructure,
    showLines: true,
    animate: false,
    multiSelect: false,
    showIcons: true,
  },
};

export const MultiSelect: Story = {
  args: {
    nodes: fileStructure,
    showLines: true,
    animate: true,
    multiSelect: true,
    showIcons: true,
  },
};

export const WithoutIcons: Story = {
  args: {
    nodes: fileStructure,
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: false,
  },
};

export const CustomIndentation: Story = {
  args: {
    nodes: fileStructure,
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: true,
    indented: true,
    indentationWidth: 40,
  },
};

export const WithoutIndentation: Story = {
  args: {
    nodes: fileStructure,
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: true,
    indented: false,
  },
};

export const OrganizationChart: Story = {
  args: {
    nodes: organizationStructure,
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: false,
  },
};

export const WithDisabledNodes: Story = {
  args: {
    nodes: [
      ...fileStructure.slice(0, 2),
      {
        ...fileStructure[2],
        disabled: true,
      },
      ...fileStructure.slice(3),
    ],
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: true,
  },
};

export const WithSelectedNodes: Story = {
  args: {
    nodes: [
      {
        ...fileStructure[0],
        children: [
          {
            ...fileStructure[0].children![0],
            children: [
              {
                ...fileStructure[0].children![0].children![0],
                children: [
                  {
                    ...fileStructure[0].children![0].children![0].children![0],
                    selected: true,
                  },
                  ...fileStructure[0].children![0].children![0].children!.slice(1),
                ],
              },
              ...fileStructure[0].children![0].children!.slice(1),
            ],
          },
          ...fileStructure[0].children!.slice(1),
        ],
      },
      ...fileStructure.slice(1),
    ],
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: true,
  },
};

export const CustomNodeRenderer: Story = {
  args: {
    nodes: fileStructure,
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: true,
    nodeRenderer: (node, isExpanded, isSelected) => (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
        padding: '4px 8px',
        borderRadius: '4px',
        border: isSelected ? '1px solid #91d5ff' : '1px solid transparent',
      }}>
        {node.icon && <span style={{ marginRight: '8px' }}>{node.icon}</span>}
        <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{node.label}</span>
        {node.id.toString().endsWith('.tsx') && (
          <span style={{ 
            marginLeft: '8px', 
            fontSize: '12px', 
            padding: '2px 6px', 
            backgroundColor: '#e6f7ff', 
            borderRadius: '10px',
            color: '#1890ff',
          }}>
            TSX
          </span>
        )}
      </div>
    ),
  },
};

export const CustomToggleIcons: Story = {
  args: {
    nodes: fileStructure,
    showLines: true,
    animate: true,
    multiSelect: false,
    showIcons: true,
    collapsedIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" fill="currentColor" />
      </svg>
    ),
    expandedIcon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor" />
      </svg>
    ),
  },
};
