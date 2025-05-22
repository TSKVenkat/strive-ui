import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ToastProvider, ToastProviderProps, useToast } from './ToastProvider';
import { Button } from '../Button';
import { Box } from '../Box';

export default {
  title: 'Components/ToastProvider',
  component: ToastProvider,
  argTypes: {
    position: {
      control: {
        type: 'select',
        options: [
          'top-right',
          'top-left',
          'top-center',
          'bottom-right',
          'bottom-left',
          'bottom-center',
        ],
      },
    },
    maxToasts: {
      control: { type: 'number', min: 1, max: 10 },
    },
  },
} as Meta;

// Create a component that uses the useToast hook
const ToastDemo = () => {
  const toast = useToast();

  return (
    <Box display="flex" flexDirection="column" gap={4} maxWidth="600px">
      <h3>Toast Provider Demo</h3>
      <p>Click the buttons below to show different types of toast notifications.</p>
      
      <Box display="flex" gap={2} flexWrap="wrap">
        <Button
          onClick={() =>
            toast.info({
              title: 'Information',
              description: 'This is an informational message.',
              duration: 5000,
            })
          }
          variant="primary"
        >
          Show Info Toast
        </Button>
        
        <Button
          onClick={() =>
            toast.success({
              title: 'Success',
              description: 'Your action was completed successfully!',
              duration: 5000,
            })
          }
          variant="primary"
        >
          Show Success Toast
        </Button>
        
        <Button
          onClick={() =>
            toast.warning({
              title: 'Warning',
              description: 'Please be careful with this action.',
              duration: 5000,
            })
          }
          variant="primary"
        >
          Show Warning Toast
        </Button>
        
        <Button
          onClick={() =>
            toast.error({
              title: 'Error',
              description: 'An error occurred while processing your request.',
              duration: 5000,
            })
          }
          variant="primary"
        >
          Show Error Toast
        </Button>
      </Box>
      
      <h3>Advanced Usage</h3>
      
      <Box display="flex" gap={2} flexWrap="wrap">
        <Button
          onClick={() => {
            const id = toast.info({
              title: 'Loading...',
              description: 'Please wait while we process your request.',
              duration: 0, // No auto-close
              isClosable: false,
            });
            
            // Simulate an API call
            setTimeout(() => {
              toast.updateToast(id, {
                title: 'Success',
                description: 'Your request has been processed successfully!',
                variant: 'success',
                duration: 5000,
                isClosable: true,
              });
            }, 3000);
          }}
          variant="secondary"
        >
          Show Loading Toast
        </Button>
        
        <Button
          onClick={() => {
            toast.info({
              description: 'This is a toast without a title.',
              duration: 5000,
            });
          }}
          variant="secondary"
        >
          Toast Without Title
        </Button>
        
        <Button
          onClick={() => {
            toast.info({
              title: 'No Progress Bar',
              description: 'This toast has no progress bar.',
              duration: 5000,
              hasProgressBar: false,
            });
          }}
          variant="secondary"
        >
          No Progress Bar
        </Button>
        
        <Button
          onClick={() => toast.removeAllToasts()}
          variant="tertiary"
        >
          Clear All Toasts
        </Button>
      </Box>
    </Box>
  );
};

// Template for the ToastProvider story
const Template: Story<ToastProviderProps> = (args) => (
  <ToastProvider {...args}>
    <ToastDemo />
  </ToastProvider>
);

export const Default = Template.bind({});
Default.args = {
  position: 'top-right',
  maxToasts: 5,
};

export const TopLeft = Template.bind({});
TopLeft.args = {
  position: 'top-left',
  maxToasts: 5,
};

export const TopCenter = Template.bind({});
TopCenter.args = {
  position: 'top-center',
  maxToasts: 5,
};

export const BottomRight = Template.bind({});
BottomRight.args = {
  position: 'bottom-right',
  maxToasts: 5,
};

export const BottomLeft = Template.bind({});
BottomLeft.args = {
  position: 'bottom-left',
  maxToasts: 5,
};

export const BottomCenter = Template.bind({});
BottomCenter.args = {
  position: 'bottom-center',
  maxToasts: 5,
};

export const LimitedToasts = Template.bind({});
LimitedToasts.args = {
  position: 'top-right',
  maxToasts: 3,
};
