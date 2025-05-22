import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Input, InputProps } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['outlined', 'filled', 'flushed'] },
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    isError: {
      control: 'boolean',
    },
    isDisabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
    errorText: {
      control: 'text',
    },
    onChange: { action: 'changed' },
  },
} as Meta;

const Template: Story<InputProps> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter text',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Username',
  placeholder: 'Enter username',
};

export const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  placeholder: 'Outlined input',
};

export const Filled = Template.bind({});
Filled.args = {
  variant: 'filled',
  placeholder: 'Filled input',
};

export const Flushed = Template.bind({});
Flushed.args = {
  variant: 'flushed',
  placeholder: 'Flushed input',
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  placeholder: 'Small input',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'md',
  placeholder: 'Medium input',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  placeholder: 'Large input',
};

export const WithError = Template.bind({});
WithError.args = {
  isError: true,
  errorText: 'This field is required',
  placeholder: 'Error input',
};

export const WithHelperText = Template.bind({});
WithHelperText.args = {
  helperText: 'Enter your username',
  placeholder: 'With helper text',
};

export const Disabled = Template.bind({});
Disabled.args = {
  isDisabled: true,
  placeholder: 'Disabled input',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
  placeholder: 'Full width input',
};
