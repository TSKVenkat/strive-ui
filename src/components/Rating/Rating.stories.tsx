import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Rating, RatingProps } from './Rating';
import styled from 'styled-components';

export default {
  title: 'Components/Rating',
  component: Rating,
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
    },
    readOnly: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    allowHalf: {
      control: 'boolean',
    },
    showValue: {
      control: 'boolean',
    },
    filledColor: {
      control: 'color',
    },
    emptyColor: {
      control: 'color',
    },
    ariaLabel: {
      control: 'text',
    },
  },
} as Meta;

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
`;

const Label = styled.label`
  width: 120px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const EmptyHeartIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
  </svg>
);

const Template: Story<RatingProps> = (args) => {
  const [rating, setRating] = useState(args.value);
  
  const handleChange = (newValue: number) => {
    setRating(newValue);
    if (args.onChange) {
      args.onChange(newValue);
    }
  };
  
  return (
    <Container>
      <Row>
        <Label>Rating:</Label>
        <Rating {...args} value={rating} onChange={handleChange} />
      </Row>
      
      {!args.readOnly && (
        <div>Selected rating: {rating}</div>
      )}
    </Container>
  );
};

export const Default = Template.bind({});
Default.args = {
  value: 3,
  max: 5,
  readOnly: false,
  disabled: false,
  size: 'md',
  allowHalf: false,
  showValue: false,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  value: 4,
  max: 5,
  readOnly: true,
  disabled: false,
  size: 'md',
  allowHalf: false,
  showValue: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  value: 3.5,
  max: 5,
  readOnly: false,
  disabled: true,
  size: 'md',
  allowHalf: true,
  showValue: false,
};

export const Small = Template.bind({});
Small.args = {
  value: 3,
  max: 5,
  readOnly: false,
  disabled: false,
  size: 'sm',
  allowHalf: false,
  showValue: false,
};

export const Large = Template.bind({});
Large.args = {
  value: 3,
  max: 5,
  readOnly: false,
  disabled: false,
  size: 'lg',
  allowHalf: false,
  showValue: false,
};

export const HalfStar = Template.bind({});
HalfStar.args = {
  value: 3.5,
  max: 5,
  readOnly: false,
  disabled: false,
  size: 'md',
  allowHalf: true,
  showValue: false,
};

export const ShowValue = Template.bind({});
ShowValue.args = {
  value: 4,
  max: 5,
  readOnly: false,
  disabled: false,
  size: 'md',
  allowHalf: false,
  showValue: true,
};

export const CustomColors = Template.bind({});
CustomColors.args = {
  value: 3,
  max: 5,
  readOnly: false,
  disabled: false,
  size: 'md',
  allowHalf: false,
  showValue: false,
  filledColor: '#e91e63',
  emptyColor: '#eeeeee',
};

export const CustomIcons = Template.bind({});
CustomIcons.args = {
  value: 3,
  max: 5,
  readOnly: false,
  disabled: false,
  size: 'md',
  allowHalf: false,
  showValue: false,
  filledIcon: <HeartIcon />,
  emptyIcon: <EmptyHeartIcon />,
  filledColor: '#e91e63',
};

export const MoreStars = Template.bind({});
MoreStars.args = {
  value: 6,
  max: 10,
  readOnly: false,
  disabled: false,
  size: 'md',
  allowHalf: false,
  showValue: true,
};
