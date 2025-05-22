import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Toast, ToastProps, ToastContainer, ToastPosition } from './Toast';
import { Button } from '../Button';
import { Box } from '../Box';

export default {
  title: 'Components/Toast',
  component: Toast,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['info', 'success', 'warning', 'error'] },
    },
    duration: {
      control: { type: 'number', min: 0, max: 20000, step: 1000 },
    },
    isClosable: {
      control: 'boolean',
    },
    hasProgressBar: {
      control: 'boolean',
    },
  },
} as Meta;

// Basic Toast Template
const Template: Story<ToastProps> = (args) => <Toast {...args} />;

export const Info = Template.bind({});
Info.args = {
  id: '1',
  title: 'Information',
  description: 'This is an informational toast message.',
  variant: 'info',
  duration: 0, // Disable auto-close for demo
};

export const Success = Template.bind({});
Success.args = {
  id: '2',
  title: 'Success',
  description: 'Your action was completed successfully!',
  variant: 'success',
  duration: 0, // Disable auto-close for demo
};

export const Warning = Template.bind({});
Warning.args = {
  id: '3',
  title: 'Warning',
  description: 'Please be careful with this action.',
  variant: 'warning',
  duration: 0, // Disable auto-close for demo
};

export const Error = Template.bind({});
Error.args = {
  id: '4',
  title: 'Error',
  description: 'An error occurred while processing your request.',
  variant: 'error',
  duration: 0, // Disable auto-close for demo
};

export const WithoutTitle = Template.bind({});
WithoutTitle.args = {
  id: '5',
  description: 'This is a toast message without a title.',
  variant: 'info',
  duration: 0, // Disable auto-close for demo
};

export const WithProgressBar = Template.bind({});
WithProgressBar.args = {
  id: '6',
  title: 'Auto-closing',
  description: 'This toast will close automatically in 5 seconds.',
  variant: 'info',
  duration: 5000,
  hasProgressBar: true,
};

export const WithoutProgressBar = Template.bind({});
WithoutProgressBar.args = {
  id: '7',
  title: 'No Progress Bar',
  description: 'This toast has no progress bar.',
  variant: 'info',
  duration: 5000,
  hasProgressBar: false,
};

export const NotClosable = Template.bind({});
NotClosable.args = {
  id: '8',
  title: 'Not Closable',
  description: 'This toast cannot be manually closed.',
  variant: 'warning',
  duration: 0,
  isClosable: false,
};

// Toast Container with Multiple Toasts
interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

// Interactive demo with toast container
export const ToastContainerDemo: Story = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [position, setPosition] = useState<ToastPosition>('top-right');
  
  const addToast = (variant: ToastProps['variant']) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      title: `${variant?.charAt(0).toUpperCase()}${variant?.slice(1)}`,
      description: `This is a ${variant} toast notification.`,
      variant,
      duration: 5000,
      isClosable: true,
      hasProgressBar: true,
    };
    
    setToasts((prev) => [...prev, newToast]);
  };
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  
  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={4} maxWidth="600px" marginBottom={6}>
        <h3>Add Toast</h3>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button onClick={() => addToast('info')} variant="primary">
            Add Info Toast
          </Button>
          <Button onClick={() => addToast('success')} variant="primary">
            Add Success Toast
          </Button>
          <Button onClick={() => addToast('warning')} variant="primary">
            Add Warning Toast
          </Button>
          <Button onClick={() => addToast('error')} variant="primary">
            Add Error Toast
          </Button>
        </Box>
        
        <h3>Toast Position</h3>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button 
            onClick={() => setPosition('top-right')} 
            variant={position === 'top-right' ? 'primary' : 'secondary'}
          >
            Top Right
          </Button>
          <Button 
            onClick={() => setPosition('top-left')} 
            variant={position === 'top-left' ? 'primary' : 'secondary'}
          >
            Top Left
          </Button>
          <Button 
            onClick={() => setPosition('top-center')} 
            variant={position === 'top-center' ? 'primary' : 'secondary'}
          >
            Top Center
          </Button>
          <Button 
            onClick={() => setPosition('bottom-right')} 
            variant={position === 'bottom-right' ? 'primary' : 'secondary'}
          >
            Bottom Right
          </Button>
          <Button 
            onClick={() => setPosition('bottom-left')} 
            variant={position === 'bottom-left' ? 'primary' : 'secondary'}
          >
            Bottom Left
          </Button>
          <Button 
            onClick={() => setPosition('bottom-center')} 
            variant={position === 'bottom-center' ? 'primary' : 'secondary'}
          >
            Bottom Center
          </Button>
        </Box>
      </Box>
      
      <ToastContainer position={position} maxToasts={5}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </Box>
  );
};

// Custom use case examples
export const CustomToasts: Story = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const addCustomToast = (type: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    let newToast: ToastItem;
    
    switch (type) {
      case 'fileUpload':
        newToast = {
          id,
          title: 'File Uploaded',
          description: 'Your file has been successfully uploaded.',
          variant: 'success',
          duration: 5000,
          isClosable: true,
          hasProgressBar: true,
        };
        break;
      case 'paymentSuccess':
        newToast = {
          id,
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
          variant: 'success',
          duration: 7000,
          isClosable: true,
          hasProgressBar: true,
        };
        break;
      case 'networkError':
        newToast = {
          id,
          title: 'Network Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          variant: 'error',
          duration: 0, // No auto-close for important errors
          isClosable: true,
          hasProgressBar: false,
        };
        break;
      case 'sessionExpiring':
        newToast = {
          id,
          title: 'Session Expiring',
          description: 'Your session will expire in 5 minutes. Please save your work.',
          variant: 'warning',
          duration: 10000,
          isClosable: true,
          hasProgressBar: true,
        };
        break;
      default:
        newToast = {
          id,
          title: 'Notification',
          description: 'This is a custom notification.',
          variant: 'info',
          duration: 5000,
          isClosable: true,
          hasProgressBar: true,
        };
    }
    
    setToasts((prev) => [...prev, newToast]);
  };
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  
  return (
    <Box>
      <Box display="flex" flexDirection="column" gap={4} maxWidth="600px" marginBottom={6}>
        <h3>Real-world Toast Examples</h3>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button onClick={() => addCustomToast('fileUpload')} variant="primary">
            File Upload Success
          </Button>
          <Button onClick={() => addCustomToast('paymentSuccess')} variant="primary">
            Payment Success
          </Button>
          <Button onClick={() => addCustomToast('networkError')} variant="primary">
            Network Error
          </Button>
          <Button onClick={() => addCustomToast('sessionExpiring')} variant="primary">
            Session Expiring
          </Button>
        </Box>
      </Box>
      
      <ToastContainer position="bottom-right" maxToasts={5}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </Box>
  );
};
