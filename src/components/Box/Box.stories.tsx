import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Box, BoxProps } from './Box';

export default {
  title: 'Components/Box',
  component: Box,
  argTypes: {
    display: {
      control: { 
        type: 'select', 
        options: ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none'] 
      },
    },
    flexDirection: {
      control: { 
        type: 'select', 
        options: ['row', 'row-reverse', 'column', 'column-reverse'] 
      },
    },
    justifyContent: {
      control: { 
        type: 'select', 
        options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] 
      },
    },
    alignItems: {
      control: { 
        type: 'select', 
        options: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'] 
      },
    },
    padding: {
      control: 'number',
    },
    margin: {
      control: 'number',
    },
    backgroundColor: {
      control: 'color',
    },
    color: {
      control: 'color',
    },
    width: {
      control: 'text',
    },
    height: {
      control: 'text',
    },
  },
} as Meta;

const Template: Story<BoxProps> = (args) => <Box {...args} />;

export const Default = Template.bind({});
Default.args = {
  padding: 4,
  children: 'Basic Box',
};

export const StyledBox = Template.bind({});
StyledBox.args = {
  padding: 4,
  backgroundColor: '#f5f5f5',
  borderRadius: 'lg',
  border: '1px solid #e0e0e0',
  children: 'Styled Box',
};

export const FlexContainer = Template.bind({});
FlexContainer.args = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 4,
  backgroundColor: '#f5f5f5',
  children: (
    <>
      <Box padding={2} backgroundColor="#e3f2fd">Item 1</Box>
      <Box padding={2} backgroundColor="#e8f5e9">Item 2</Box>
      <Box padding={2} backgroundColor="#fff3e0">Item 3</Box>
    </>
  ),
};

export const FlexColumn = Template.bind({});
FlexColumn.args = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 4,
  backgroundColor: '#f5f5f5',
  children: (
    <>
      <Box padding={2} backgroundColor="#e3f2fd">Item 1</Box>
      <Box padding={2} backgroundColor="#e8f5e9">Item 2</Box>
      <Box padding={2} backgroundColor="#fff3e0">Item 3</Box>
    </>
  ),
};

export const ResponsiveBox = Template.bind({});
ResponsiveBox.args = {
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
  padding: 4,
  backgroundColor: '#f5f5f5',
  children: 'Centered Box with max width',
};

export const NestedBoxes = Template.bind({});
NestedBoxes.args = {
  position: 'relative',
  height: '200px',
  backgroundColor: '#f5f5f5',
  padding: 4,
  children: (
    <>
      <div>Parent Box</div>
      <Box
        position="absolute"
        top={0}
        right={0}
        padding={2}
        backgroundColor="#1890ff"
        color="white"
        borderRadius="md"
      >
        Positioned Box
      </Box>
    </>
  ),
};
