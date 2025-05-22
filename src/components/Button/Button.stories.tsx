import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button, ButtonProps } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    fullWidth: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    onClick: { action: 'clicked' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Primary Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Secondary Button',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  variant: 'tertiary',
  children: 'Tertiary Button',
};

export const Danger = Template.bind({});
Danger.args = {
  variant: 'danger',
  children: 'Danger Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: 'Small Button',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'md',
  children: 'Medium Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  children: 'Large Button',
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
  children: 'Full Width Button',
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  children: 'Loading Button',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  children: 'Disabled Button',
};
