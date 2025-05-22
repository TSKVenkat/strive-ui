import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Card, CardProps } from './Card';
import { Button } from '../Button';

export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['elevated', 'outlined', 'filled'] },
    },
    interactive: {
      control: 'boolean',
    },
    title: {
      control: 'text',
    },
    subtitle: {
      control: 'text',
    },
  },
} as Meta;

const Template: Story<CardProps> = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'This is a basic card with some content.',
};

export const WithTitleAndSubtitle = Template.bind({});
WithTitleAndSubtitle.args = {
  title: 'Card Title',
  subtitle: 'Card Subtitle',
  children: 'This is a card with a title and subtitle.',
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  title: 'Card with Footer',
  children: 'This card has a footer with an action button.',
  footer: <Button variant="primary">Action</Button>,
};

export const WithHeaderAction = Template.bind({});
WithHeaderAction.args = {
  title: 'Card with Header Action',
  children: 'This card has a header action.',
  headerAction: <Button variant="tertiary" size="sm">Edit</Button>,
};

export const Elevated = Template.bind({});
Elevated.args = {
  variant: 'elevated',
  children: 'Elevated Card',
};

export const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  children: 'Outlined Card',
};

export const Filled = Template.bind({});
Filled.args = {
  variant: 'filled',
  children: 'Filled Card',
};

export const Interactive = Template.bind({});
Interactive.args = {
  interactive: true,
  children: 'This card has a hover effect.',
};

export const ComplexCard = Template.bind({});
ComplexCard.args = {
  title: 'Complex Card Example',
  subtitle: 'With multiple elements',
  headerAction: <Button variant="tertiary" size="sm">More</Button>,
  children: (
    <div>
      <p>This is a complex card with multiple elements.</p>
      <p>It demonstrates how you can compose different components together.</p>
      <Button variant="secondary" size="sm" style={{ marginTop: '1rem' }}>
        Secondary Action
      </Button>
    </div>
  ),
  footer: (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
      <Button variant="tertiary">Cancel</Button>
      <Button variant="primary">Submit</Button>
    </div>
  ),
};
