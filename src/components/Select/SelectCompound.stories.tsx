import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Select, SelectRoot, SelectTrigger, SelectContent, SelectItem } from './SelectCompound';
import styled from 'styled-components';

const meta: Meta<typeof SelectRoot> = {
  title: 'Components/Select/Compound',
  component: SelectRoot,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SelectRoot>;

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'watermelon', label: 'Watermelon' },
  { value: 'pineapple', label: 'Pineapple' },
  { value: 'mango', label: 'Mango' },
];

// Basic example using the simple API
export const Basic: Story = {
  args: {
    options: options,
    placeholder: 'Select a fruit',
    size: 'md',
  },
  render: (args) => (
    <div style={{ width: '300px' }}>
      <Select.Root {...args}>
        <Select.Trigger />
        <Select.Content />
      </Select.Root>
    </div>
  ),
};

// Controlled example
export const Controlled: Story = {
  args: {
    options: options,
    placeholder: 'Select a fruit',
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('apple');
    
    return (
      <div style={{ width: '300px' }}>
        <div style={{ marginBottom: '10px' }}>
          Selected value: <strong>{value}</strong>
        </div>
        <Select.Root 
          {...args} 
          value={value} 
          onValueChange={(newValue) => setValue(newValue)}
        >
          <Select.Trigger />
          <Select.Content />
        </Select.Root>
      </div>
    );
  },
};

// Different sizes
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '300px' }}>
      <Select.Root options={options} placeholder="Small size" size="sm">
        <Select.Trigger />
        <Select.Content />
      </Select.Root>
      
      <Select.Root options={options} placeholder="Medium size" size="md">
        <Select.Trigger />
        <Select.Content />
      </Select.Root>
      
      <Select.Root options={options} placeholder="Large size" size="lg">
        <Select.Trigger />
        <Select.Content />
      </Select.Root>
    </div>
  ),
};

// Disabled state
export const Disabled: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Select.Root options={options} placeholder="Disabled select" disabled>
        <Select.Trigger />
        <Select.Content />
      </Select.Root>
    </div>
  ),
};

// Error state
export const Error: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Select.Root options={options} placeholder="Error state" error>
        <Select.Trigger />
        <Select.Content />
      </Select.Root>
    </div>
  ),
};

// Custom trigger
const CustomTrigger = styled(SelectTrigger)`
  border-radius: 30px;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  border: none;
  
  &:hover {
    background: linear-gradient(to right, #5a0fcb, #1565fc);
  }
`;

const CustomIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8 12L2 6H14L8 12Z" 
      fill="currentColor" 
    />
  </svg>
);

export const CustomTriggerExample: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Select.Root options={options} placeholder="Custom trigger">
        <CustomTrigger>
          <span>Choose a fruit</span>
          <CustomIcon />
        </CustomTrigger>
        <Select.Content />
      </Select.Root>
    </div>
  ),
};

// Custom items
const CustomItem = styled(SelectItem)`
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #f0f9ff;
  }
`;

const FruitIcon = ({ fruit }: { fruit: string }) => {
  const icons: Record<string, string> = {
    apple: '🍎',
    banana: '🍌',
    orange: '🍊',
    grape: '🍇',
    strawberry: '🍓',
    watermelon: '🍉',
    pineapple: '🍍',
    mango: '🥭',
  };
  
  return <span>{icons[fruit] || '🍽️'}</span>;
};

export const CustomItems: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <Select.Root options={options} placeholder="Select a fruit">
        <Select.Trigger />
        <Select.Content>
          {options.map((option) => (
            <CustomItem key={option.value} value={option.value}>
              <FruitIcon fruit={option.value} />
              {option.label}
            </CustomItem>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  ),
};

// Fully customized example
const CustomSelectContainer = styled.div`
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const CustomSelectTrigger = styled(SelectTrigger)`
  background-color: #1e293b;
  color: white;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 12px 16px;
  font-weight: 500;
  
  &:hover {
    background-color: #334155;
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 2px #94a3b8;
    outline: none;
  }
`;

const CustomSelectContent = styled(SelectContent)`
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  margin-top: 8px;
  overflow: hidden;
`;

const CustomSelectItem = styled(SelectItem)`
  padding: 10px 16px;
  color: #e2e8f0;
  
  &:hover {
    background-color: #334155;
  }
  
  &[aria-selected="true"] {
    background-color: #2563eb;
    color: white;
    font-weight: bold;
  }
  
  &[aria-disabled="true"] {
    color: #64748b;
  }
`;

export const FullyCustomized: Story = {
  render: () => (
    <div style={{ width: '300px', background: '#0f172a', padding: '20px', borderRadius: '12px' }}>
      <h3 style={{ color: 'white', marginBottom: '16px' }}>Dark Theme Select</h3>
      <CustomSelectContainer>
        <Select.Root options={options} placeholder="Select a fruit">
          <CustomSelectTrigger>
            <span>Choose a fruit</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </CustomSelectTrigger>
          <CustomSelectContent>
            {options.map((option) => (
              <CustomSelectItem key={option.value} value={option.value}>
                {option.label}
              </CustomSelectItem>
            ))}
          </CustomSelectContent>
        </Select.Root>
      </CustomSelectContainer>
    </div>
  ),
};
