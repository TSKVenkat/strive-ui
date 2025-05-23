import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ButtonHeadless from './ButtonHeadless';
import styled from 'styled-components';

const meta: Meta<typeof ButtonHeadless> = {
  title: 'Components/Button/Headless',
  component: ButtonHeadless,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonHeadless>;

// Basic example with minimal styling
export const Basic: Story = {
  args: {
    children: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
  render: (args) => (
    <ButtonHeadless
      {...args}
      style={{
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    />
  ),
};

// Styled with styled-components
const PrimaryButton = styled(ButtonHeadless)`
  background-color: ${props => props['data-disabled'] ? '#6c8eef' : props['data-hovered'] ? '#3e6ae1' : '#4a75e6'};
  color: white;
  padding: ${props => props['data-pressed'] ? '9px 15px 7px 17px' : '8px 16px'};
  border-radius: 4px;
  border: none;
  font-family: 'Arial', sans-serif;
  font-weight: 600;
  font-size: 14px;
  cursor: ${props => props['data-disabled'] ? 'not-allowed' : 'pointer'};
  opacity: ${props => props['data-disabled'] ? 0.7 : 1};
  transition: all 0.2s ease;
  outline: none;
  box-shadow: ${props => props['data-focused'] ? '0 0 0 3px rgba(74, 117, 230, 0.4)' : 'none'};
  transform: ${props => props['data-pressed'] ? 'scale(0.98)' : 'scale(1)'};
  
  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(74, 117, 230, 0.4);
  }
`;

export const StyledButton: Story = {
  args: {
    children: 'Primary Button',
    onClick: () => alert('Button clicked!'),
  },
  render: (args) => <PrimaryButton {...args} />,
};

// Loading state
export const LoadingButton: Story = {
  args: {
    children: 'Loading Button',
    loading: true,
  },
  render: (args) => {
    const LoadingButtonStyled = styled(ButtonHeadless)`
      background-color: #4a75e6;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      font-family: 'Arial', sans-serif;
      font-weight: 600;
      font-size: 14px;
      cursor: ${props => props['data-disabled'] ? 'not-allowed' : 'pointer'};
      opacity: ${props => props['data-disabled'] ? 0.7 : 1};
      min-width: 120px;
      position: relative;
      
      &::before {
        content: '';
        display: ${props => props['data-loading'] ? 'block' : 'none'};
        position: absolute;
        top: 50%;
        left: 12px;
        width: 16px;
        height: 16px;
        margin-top: -8px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    
    return (
      <LoadingButtonStyled {...args}>
        {args.loading ? 'Loading...' : args.children}
      </LoadingButtonStyled>
    );
  },
};

// Different button types
export const ButtonTypes: Story = {
  render: () => {
    const ButtonBase = styled(ButtonHeadless)`
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      font-family: 'Arial', sans-serif;
      font-weight: 600;
      font-size: 14px;
      cursor: ${props => props['data-disabled'] ? 'not-allowed' : 'pointer'};
      opacity: ${props => props['data-disabled'] ? 0.7 : 1};
      transition: all 0.2s ease;
      margin: 0 8px;
    `;
    
    const PrimaryBtn = styled(ButtonBase)`
      background-color: ${props => props['data-hovered'] ? '#3e6ae1' : '#4a75e6'};
      color: white;
    `;
    
    const SecondaryBtn = styled(ButtonBase)`
      background-color: ${props => props['data-hovered'] ? '#e6e6e6' : '#f2f2f2'};
      color: #333;
    `;
    
    const DangerBtn = styled(ButtonBase)`
      background-color: ${props => props['data-hovered'] ? '#d32f2f' : '#f44336'};
      color: white;
    `;
    
    return (
      <div style={{ display: 'flex' }}>
        <PrimaryBtn onClick={() => alert('Primary clicked')}>Primary</PrimaryBtn>
        <SecondaryBtn onClick={() => alert('Secondary clicked')}>Secondary</SecondaryBtn>
        <DangerBtn onClick={() => alert('Danger clicked')}>Danger</DangerBtn>
      </div>
    );
  },
};

// Link button
export const LinkButton: Story = {
  args: {
    children: 'Visit Storybook',
    href: 'https://storybook.js.org/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  render: (args) => {
    const StyledLinkButton = styled(ButtonHeadless)`
      display: inline-flex;
      align-items: center;
      color: ${props => props['data-hovered'] ? '#3e6ae1' : '#4a75e6'};
      text-decoration: none;
      font-family: 'Arial', sans-serif;
      font-weight: 600;
      font-size: 14px;
      padding: 8px 0;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: currentColor;
        transform: ${props => props['data-hovered'] ? 'scaleX(1)' : 'scaleX(0)'};
        transform-origin: left;
        transition: transform 0.3s ease;
      }
      
      svg {
        margin-left: 8px;
      }
    `;
    
    return (
      <StyledLinkButton {...args}>
        {args.children}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3L7.295 3.705L11.085 7.5H3V8.5H11.085L7.295 12.295L8 13L13 8L8 3Z" fill="currentColor"/>
        </svg>
      </StyledLinkButton>
    );
  },
};

// Custom component example
export const CustomComponent: Story = {
  render: () => {
    const CardButton = styled(ButtonHeadless)`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background-color: ${props => props['data-hovered'] ? '#f5f5f5' : 'white'};
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      width: 200px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: ${props => props['data-hovered'] ? '0 4px 8px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)'};
      transform: ${props => props['data-pressed'] ? 'translateY(2px)' : 'translateY(0)'};
      
      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba(74, 117, 230, 0.4);
      }
    `;
    
    return (
      <CardButton onClick={() => alert('Card clicked!')}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '12px' }}>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4a75e6" />
        </svg>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Feature Card</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#666', textAlign: 'center' }}>
          Click this card to activate this feature
        </p>
      </CardButton>
    );
  },
};
