import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Parallax, ParallaxProps } from './Parallax';
import styled from 'styled-components';

export default {
  title: 'Components/Parallax',
  component: Parallax,
  argTypes: {
    speed: {
      control: { type: 'range', min: -2, max: 2, step: 0.1 },
    },
    direction: {
      control: { type: 'select', options: ['vertical', 'horizontal'] },
    },
    enabled: {
      control: 'boolean',
    },
    zIndex: {
      control: { type: 'number' },
    },
    useViewport: {
      control: 'boolean',
    },
    easing: {
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
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  z-index: 1000;
`;

const ParallaxBox = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 100px 0;
  background-color: ${({ theme }) => theme.colors.primary[600]};
  color: white;
  font-size: 24px;
  font-weight: bold;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ParallaxImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 500px;
  background-image: url(${({ imageUrl }) => imageUrl});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: 100px 0;
`;

const ParallaxContent = styled.div`
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Template: Story<ParallaxProps> = (args) => (
  <Container>
    <ScrollMessage>Scroll down to see the parallax effect</ScrollMessage>
    
    <h1 style={{ textAlign: 'center', marginTop: '100px' }}>Parallax Demo</h1>
    
    <Parallax {...args}>
      <ParallaxBox>
        Parallax Content
      </ParallaxBox>
    </Parallax>
    
    <div style={{ height: '500px' }} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  speed: 0.5,
  direction: 'vertical',
  enabled: true,
  useViewport: true,
  easing: 'linear',
};

export const HorizontalParallax = Template.bind({});
HorizontalParallax.args = {
  speed: 0.5,
  direction: 'horizontal',
  enabled: true,
  useViewport: true,
  easing: 'linear',
};

export const SlowParallax = Template.bind({});
SlowParallax.args = {
  speed: 0.2,
  direction: 'vertical',
  enabled: true,
  useViewport: true,
  easing: 'linear',
};

export const ReverseParallax = Template.bind({});
ReverseParallax.args = {
  speed: -0.5,
  direction: 'vertical',
  enabled: true,
  useViewport: true,
  easing: 'linear',
};

export const MultipleParallaxElements: Story = () => (
  <Container>
    <ScrollMessage>Scroll down to see the parallax effects</ScrollMessage>
    
    <h1 style={{ textAlign: 'center', marginTop: '100px' }}>Multiple Parallax Elements</h1>
    
    <Parallax speed={0.3} direction="vertical">
      <ParallaxImage imageUrl="https://source.unsplash.com/random/1200x800?nature" />
    </Parallax>
    
    <Parallax speed={-0.2} direction="horizontal">
      <ParallaxContent>
        <h2>Parallax Title</h2>
        <p>
          This content moves in the opposite direction at a different speed.
          Parallax scrolling creates an illusion of depth and adds visual interest to your website.
        </p>
      </ParallaxContent>
    </Parallax>
    
    <Parallax speed={0.5} direction="vertical">
      <ParallaxImage imageUrl="https://source.unsplash.com/random/1200x800?mountains" />
    </Parallax>
    
    <div style={{ height: '300px' }} />
  </Container>
);
