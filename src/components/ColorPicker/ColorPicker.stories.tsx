import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { ColorPicker, ColorPickerProps } from './ColorPicker';
import styled from 'styled-components';

export default {
  title: 'Components/ColorPicker',
  component: ColorPicker,
  argTypes: {
    value: {
      control: 'color',
    },
    disabled: {
      control: 'boolean',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
    },
    showValue: {
      control: 'boolean',
    },
    format: {
      control: { type: 'select', options: ['hex', 'rgb', 'hsl'] },
    },
    placeholder: {
      control: 'text',
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

const ColorPreview = styled.div<{ color: string }>`
  width: 100%;
  height: 100px;
  background-color: ${({ color }) => color};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: 20px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => {
    // Simple function to determine if text should be white or black based on background color
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? '#000000' : '#FFFFFF';
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Template: Story<ColorPickerProps> = (args) => {
  const [color, setColor] = useState(args.value);
  
  return (
    <Container>
      <Row>
        <Label>Color Picker:</Label>
        <ColorPicker {...args} value={color} onChange={setColor} />
      </Row>
      
      <ColorPreview color={color}>
        Selected Color: {color}
      </ColorPreview>
    </Container>
  );
};

export const Default = Template.bind({});
Default.args = {
  value: '#3f51b5',
  disabled: false,
  size: 'md',
  showValue: true,
  format: 'hex',
  placeholder: 'Select color',
  ariaLabel: 'Color picker',
};

export const Small = Template.bind({});
Small.args = {
  value: '#e91e63',
  disabled: false,
  size: 'sm',
  showValue: true,
  format: 'hex',
};

export const Large = Template.bind({});
Large.args = {
  value: '#4caf50',
  disabled: false,
  size: 'lg',
  showValue: true,
  format: 'hex',
};

export const Disabled = Template.bind({});
Disabled.args = {
  value: '#9c27b0',
  disabled: true,
  size: 'md',
  showValue: true,
  format: 'hex',
};

export const RGBFormat = Template.bind({});
RGBFormat.args = {
  value: '#2196f3',
  disabled: false,
  size: 'md',
  showValue: true,
  format: 'rgb',
};

export const HSLFormat = Template.bind({});
HSLFormat.args = {
  value: '#ff9800',
  disabled: false,
  size: 'md',
  showValue: true,
  format: 'hsl',
};

export const WithoutValueDisplay = Template.bind({});
WithoutValueDisplay.args = {
  value: '#607d8b',
  disabled: false,
  size: 'md',
  showValue: false,
  format: 'hex',
};

export const CustomPresetColors = Template.bind({});
CustomPresetColors.args = {
  value: '#ff5722',
  disabled: false,
  size: 'md',
  showValue: true,
  format: 'hex',
  presetColors: ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'],
};
