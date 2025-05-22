import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Icon, IconProps, iconNames } from './Icon';
import styled from 'styled-components';

export default {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: 'Icon component for displaying vector icons with various customization options.'
      }
    }
  },
  argTypes: {
    name: {
      control: { type: 'select', options: iconNames },
      description: 'Name of the icon to display',
    },
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
      description: 'Size of the icon',
    },
    weight: {
      control: { type: 'select', options: ['light', 'regular', 'medium', 'bold', 'fill'] },
      description: 'Weight/style of the icon',
    },
    color: {
      control: 'color',
      description: 'Color of the icon',
    },
    spin: {
      control: 'boolean',
      description: 'Whether the icon should spin',
    },
    pulse: {
      control: 'boolean',
      description: 'Whether the icon should pulse',
    },
    bounce: {
      control: 'boolean',
      description: 'Whether the icon should bounce',
    },
    mirrored: {
      control: 'boolean',
      description: 'Whether the icon should be mirrored (RTL support)',
    },
  },
} as Meta;

const Template: Story<IconProps> = (args) => <Icon {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: 'Heart',
  size: 'md',
  weight: 'regular',
};

export const Sizes = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Icon name="Star" size="xs" />
    <Icon name="Star" size="sm" />
    <Icon name="Star" size="md" />
    <Icon name="Star" size="lg" />
    <Icon name="Star" size="xl" />
    <Icon name="Star" size="2xl" />
  </div>
);

export const Weights = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Icon name="Heart" weight="light" />
    <Icon name="Heart" weight="regular" />
    <Icon name="Heart" weight="medium" />
    <Icon name="Heart" weight="bold" />
    <Icon name="Heart" weight="fill" />
  </div>
);

export const Colors = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Icon name="Star" color="#1890FF" />
    <Icon name="Star" color="#52C41A" />
    <Icon name="Star" color="#FAAD14" />
    <Icon name="Star" color="#FF4D4F" />
    <Icon name="Star" color="#722ED1" />
  </div>
);

export const Animations = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Icon name="Settings" spin />
    <Icon name="Heart" pulse />
    <Icon name="ArrowUp" bounce />
  </div>
);

export const Mirrored = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <Icon name="ArrowLeft" />
    <Icon name="ArrowLeft" mirrored />
  </div>
);

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const IconCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.subtle};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[100]};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .icon-name {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.text.secondary};
    text-align: center;
  }
`;

export const AllIcons = () => (
  <Grid>
    {iconNames.map((name) => (
      <IconCard key={name}>
        <Icon name={name} size="lg" />
        <span className="icon-name">{name}</span>
      </IconCard>
    ))}
  </Grid>
);

export const UsageExamples = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Icon name="Info" color="#1890FF" />
      <span>Information message</span>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Icon name="AlertCircle" color="#FAAD14" />
      <span>Warning message</span>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Icon name="AlertTriangle" color="#FF4D4F" />
      <span>Error message</span>
    </div>
    
    <button style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      backgroundColor: '#1890FF',
      color: 'white',
      border: 'none',
      borderRadius: '0.25rem',
      cursor: 'pointer'
    }}>
      <Icon name="Plus" size="sm" />
      <span>Add item</span>
    </button>
    
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem',
      padding: '0.75rem',
      backgroundColor: '#F5F5F5',
      borderRadius: '0.25rem'
    }}>
      <Icon name="Search" color="#8C8C8C" />
      <span style={{ color: '#8C8C8C' }}>Search...</span>
    </div>
  </div>
);
