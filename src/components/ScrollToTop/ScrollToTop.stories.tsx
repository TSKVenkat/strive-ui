import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ScrollToTop, ScrollToTopProps } from './ScrollToTop';
import styled from 'styled-components';

export default {
  title: 'Components/ScrollToTop',
  component: ScrollToTop,
  argTypes: {
    showAtPosition: {
      control: { type: 'number', min: 100, max: 1000 },
    },
    position: {
      control: { type: 'select', options: ['bottom-right', 'bottom-left', 'top-right', 'top-left'] },
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    smooth: {
      control: 'boolean',
    },
    ariaLabel: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as Meta;

const Container = styled.div`
  height: 200vh;
  padding: 20px;
  background: linear-gradient(to bottom, #f5f5f5, #e0e0e0);
`;

const ScrollMessage = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 999;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Section = styled.section`
  margin-bottom: 40px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Template: Story<ScrollToTopProps> = (args) => (
  <Container>
    <ScrollMessage>Scroll down to see the ScrollToTop button</ScrollMessage>
    
    <Content>
      <h1>ScrollToTop Demo</h1>
      <p>Scroll down to see the ScrollToTop button appear.</p>
      
      {Array.from({ length: 10 }).map((_, index) => (
        <Section key={index}>
          <h2>Section {index + 1}</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget
            aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
            Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam
            nisl nunc quis nisl.
          </p>
          <p>
            Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam
            nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet
            nunc, quis aliquam nisl nunc quis nisl.
          </p>
        </Section>
      ))}
    </Content>
    
    <ScrollToTop {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  showAtPosition: 300,
  position: 'bottom-right',
  size: 'md',
  smooth: true,
};

export const BottomLeft = Template.bind({});
BottomLeft.args = {
  showAtPosition: 300,
  position: 'bottom-left',
  size: 'md',
  smooth: true,
};

export const Small = Template.bind({});
Small.args = {
  showAtPosition: 300,
  position: 'bottom-right',
  size: 'sm',
  smooth: true,
};

export const Large = Template.bind({});
Large.args = {
  showAtPosition: 300,
  position: 'bottom-right',
  size: 'lg',
  smooth: true,
};

export const CustomIcon = Template.bind({});
CustomIcon.args = {
  showAtPosition: 300,
  position: 'bottom-right',
  size: 'md',
  smooth: true,
  icon: (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 15h14l-7-8-7 8z" fill="currentColor" />
    </svg>
  ),
};
