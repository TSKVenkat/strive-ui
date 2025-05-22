import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Select, SelectProps } from './Select';
import { FormControl } from '../Form/FormControl';

export default {
  title: 'Components/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: 'Select component for selecting a value from a list of options.'
      }
    }
  },
  argTypes: {
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    isDisabled: {
      control: 'boolean',
    },
    isError: {
      control: 'boolean',
    },
    isRequired: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  }
} as Meta;

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'br', label: 'Brazil' },
  { value: 'ar', label: 'Argentina' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'it', label: 'Italy' },
  { value: 'es', label: 'Spain' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
  { value: 'in', label: 'India' },
  { value: 'au', label: 'Australia' },
  { value: 'nz', label: 'New Zealand' },
];

const Template: Story<SelectProps> = (args) => <Select {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  options: countries,
  placeholder: 'Select a country',
};

export const WithValue = Template.bind({});
WithValue.args = {
  options: countries,
  value: 'fr',
};

export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Select 
      options={countries} 
      placeholder="Small size" 
      size="sm" 
    />
    <Select 
      options={countries} 
      placeholder="Medium size (default)" 
      size="md" 
    />
    <Select 
      options={countries} 
      placeholder="Large size" 
      size="lg" 
    />
  </div>
);

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <Select 
      options={countries} 
      placeholder="Default state" 
    />
    <Select 
      options={countries} 
      placeholder="Disabled state" 
      isDisabled 
    />
    <Select 
      options={countries} 
      placeholder="Error state" 
      isError 
    />
    <Select 
      options={countries} 
      placeholder="Required" 
      isRequired 
    />
  </div>
);

export const WithFormControl = () => {
  const [value, setValue] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };
  
  return (
    <div style={{ maxWidth: '400px' }}>
      <FormControl 
        label="Country" 
        helperText="Select your country of residence"
        isRequired
      >
        <Select
          options={countries}
          placeholder="Select a country"
          value={value}
          onChange={handleChange}
          isRequired
        />
      </FormControl>
    </div>
  );
};

export const WithDisabledOptions = Template.bind({});
WithDisabledOptions.args = {
  options: [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'mx', label: 'Mexico', disabled: true },
    { value: 'br', label: 'Brazil' },
    { value: 'ar', label: 'Argentina', disabled: true },
  ],
  placeholder: 'Select a country',
};
