import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Carousel, CarouselProps } from './Carousel';
import styled from 'styled-components';

export default {
  title: 'Components/Carousel',
  component: Carousel,
  argTypes: {
    autoPlay: {
      control: 'boolean',
    },
    autoPlayInterval: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
    },
    showDots: {
      control: 'boolean',
    },
    showArrows: {
      control: 'boolean',
    },
    onSlideChange: { action: 'slide changed' },
  },
} as Meta;

const SlideContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const Slide1 = styled(SlideContainer)`
  background-color: ${({ theme }) => theme.colors.primary[600]};
`;

const Slide2 = styled(SlideContainer)`
  background-color: ${({ theme }) => theme.colors.success};
`;

const Slide3 = styled(SlideContainer)`
  background-color: ${({ theme }) => theme.colors.error};
`;

const Template: Story<CarouselProps> = (args) => (
  <Carousel {...args}>
    <Slide1>Slide 1</Slide1>
    <Slide2>Slide 2</Slide2>
    <Slide3>Slide 3</Slide3>
  </Carousel>
);

export const Default = Template.bind({});
Default.args = {
  autoPlay: false,
  showDots: true,
  showArrows: true,
};

export const AutoPlay = Template.bind({});
AutoPlay.args = {
  autoPlay: true,
  autoPlayInterval: 3000,
  showDots: true,
  showArrows: true,
};

export const WithoutDots = Template.bind({});
WithoutDots.args = {
  autoPlay: false,
  showDots: false,
  showArrows: true,
};

export const WithoutArrows = Template.bind({});
WithoutArrows.args = {
  autoPlay: false,
  showDots: true,
  showArrows: false,
};
