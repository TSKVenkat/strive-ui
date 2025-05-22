import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Alert, AlertProps } from './Alert';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styled from 'styled-components';

export default {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: 'Alerts display important messages to users, such as success notifications, warnings, or error messages.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] },
      description: 'The variant of the alert',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'The size of the alert',
    },
    title: {
      control: 'text',
      description: 'The title of the alert',
    },
    children: {
      control: 'text',
      description: 'The content of the alert',
    },
    closable: {
      control: 'boolean',
      description: 'Whether the alert is closable',
    },
    autoClose: {
      control: 'boolean',
      description: 'Whether the alert should auto close',
    },
    autoCloseDuration: {
      control: { type: 'number', min: 1000, max: 10000, step: 1000 },
      description: 'The duration in ms before auto closing',
    },
    hasIcon: {
      control: 'boolean',
      description: 'Whether to show an icon',
    },
    outlined: {
      control: 'boolean',
      description: 'Whether the alert is outlined',
    },
    filled: {
      control: 'boolean',
      description: 'Whether the alert is filled',
    },
    hasBorder: {
      control: 'boolean',
      description: 'Whether the alert has a border',
    },
    borderPosition: {
      control: { type: 'select', options: ['left', 'right', 'top', 'bottom', 'all'] },
      description: 'The border position',
    },
    elevated: {
      control: 'boolean',
      description: 'Whether the alert is elevated',
    },
    elevation: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'The elevation level',
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the alert is rounded',
    },
    radius: {
      control: { type: 'select', options: ['sm', 'md', 'lg', 'full'] },
      description: 'The border radius',
    },
    expandable: {
      control: 'boolean',
      description: 'Whether the alert is expandable',
    },
    defaultExpanded: {
      control: 'boolean',
      description: 'Whether the alert is expanded by default',
    },
    dismissible: {
      control: 'boolean',
      description: 'Whether the alert is dismissible by clicking anywhere on it',
    },
    showProgress: {
      control: 'boolean',
      description: 'Whether the alert should show a progress bar for auto-close',
    },
    pauseOnHover: {
      control: 'boolean',
      description: 'Whether the alert should pause auto-close on hover',
    },
    pauseOnFocus: {
      control: 'boolean',
      description: 'Whether the alert should pause auto-close on focus',
    },
  },
} as Meta;

const Template: Story<AlertProps> = (args) => <Alert {...args} />;

export const Default = Template.bind({});
Default.args = {
  variant: 'info',
  title: 'Information',
  children: 'This is an informational alert message.',
  size: 'md',
  hasIcon: true,
  closable: true,
};

export const Variants = () => (
  <AlertStack>
    <Alert variant="info" title="Information">
      This is an informational alert message.
    </Alert>
    
    <Alert variant="success" title="Success">
      Your changes have been saved successfully.
    </Alert>
    
    <Alert variant="warning" title="Warning">
      This action cannot be undone.
    </Alert>
    
    <Alert variant="error" title="Error">
      An error occurred while processing your request.
    </Alert>
    
    <Alert variant="neutral" title="Neutral">
      This is a neutral alert message.
    </Alert>
  </AlertStack>
);

export const Sizes = () => (
  <AlertStack>
    <Alert variant="info" size="sm" title="Small Alert">
      This is a small alert message.
    </Alert>
    
    <Alert variant="info" size="md" title="Medium Alert">
      This is a medium alert message.
    </Alert>
    
    <Alert variant="info" size="lg" title="Large Alert">
      This is a large alert message.
    </Alert>
  </AlertStack>
);

export const WithoutIcons = () => (
  <AlertStack>
    <Alert variant="info" hasIcon={false} title="Information">
      This is an informational alert without an icon.
    </Alert>
    
    <Alert variant="success" hasIcon={false} title="Success">
      This is a success alert without an icon.
    </Alert>
    
    <Alert variant="warning" hasIcon={false} title="Warning">
      This is a warning alert without an icon.
    </Alert>
    
    <Alert variant="error" hasIcon={false} title="Error">
      This is an error alert without an icon.
    </Alert>
  </AlertStack>
);

export const WithoutTitles = () => (
  <AlertStack>
    <Alert variant="info">This is an informational alert without a title.</Alert>
    <Alert variant="success">This is a success alert without a title.</Alert>
    <Alert variant="warning">This is a warning alert without a title.</Alert>
    <Alert variant="error">This is an error alert without a title.</Alert>
  </AlertStack>
);

export const Outlined = () => (
  <AlertStack>
    <Alert variant="info" outlined title="Information">
      This is an outlined informational alert.
    </Alert>
    
    <Alert variant="success" outlined title="Success">
      This is an outlined success alert.
    </Alert>
    
    <Alert variant="warning" outlined title="Warning">
      This is an outlined warning alert.
    </Alert>
    
    <Alert variant="error" outlined title="Error">
      This is an outlined error alert.
    </Alert>
  </AlertStack>
);

export const Filled = () => (
  <AlertStack>
    <Alert variant="info" filled title="Information">
      This is a filled informational alert.
    </Alert>
    
    <Alert variant="success" filled title="Success">
      This is a filled success alert.
    </Alert>
    
    <Alert variant="warning" filled title="Warning">
      This is a filled warning alert.
    </Alert>
    
    <Alert variant="error" filled title="Error">
      This is a filled error alert.
    </Alert>
  </AlertStack>
);

export const BorderPositions = () => (
  <AlertStack>
    <Alert variant="info" borderPosition="left" title="Left Border">
      This alert has a border on the left side.
    </Alert>
    
    <Alert variant="info" borderPosition="right" title="Right Border">
      This alert has a border on the right side.
    </Alert>
    
    <Alert variant="info" borderPosition="top" title="Top Border">
      This alert has a border on the top side.
    </Alert>
    
    <Alert variant="info" borderPosition="bottom" title="Bottom Border">
      This alert has a border on the bottom side.
    </Alert>
    
    <Alert variant="info" borderPosition="all" title="All Borders">
      This alert has borders on all sides.
    </Alert>
  </AlertStack>
);

export const Elevated = () => (
  <AlertStack>
    <Alert variant="info" elevated elevation="sm" title="Small Elevation">
      This alert has a small elevation.
    </Alert>
    
    <Alert variant="info" elevated elevation="md" title="Medium Elevation">
      This alert has a medium elevation.
    </Alert>
    
    <Alert variant="info" elevated elevation="lg" title="Large Elevation">
      This alert has a large elevation.
    </Alert>
  </AlertStack>
);

export const BorderRadius = () => (
  <AlertStack>
    <Alert variant="info" radius="sm" title="Small Radius">
      This alert has a small border radius.
    </Alert>
    
    <Alert variant="info" radius="md" title="Medium Radius">
      This alert has a medium border radius.
    </Alert>
    
    <Alert variant="info" radius="lg" title="Large Radius">
      This alert has a large border radius.
    </Alert>
    
    <Alert variant="info" radius="full" title="Full Radius">
      This alert has a full border radius.
    </Alert>
  </AlertStack>
);

export const WithActions = () => (
  <AlertStack>
    <Alert
      variant="info"
      title="Information"
      actions={
        <Button variant="primary" size="sm">
          View Details
        </Button>
      }
    >
      This alert has an action button.
    </Alert>
    
    <Alert
      variant="warning"
      title="Warning"
      actions={
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </div>
      }
    >
      This alert has multiple action buttons.
    </Alert>
  </AlertStack>
);

export const Expandable = () => (
  <AlertStack>
    <Alert
      variant="info"
      title="Expandable Alert"
      expandable
      expandedContent={
        <div>
          <p>This is additional content that is shown when the alert is expanded.</p>
          <p>You can include any content here, such as:</p>
          <ul>
            <li>Detailed error information</li>
            <li>Troubleshooting steps</li>
            <li>Links to documentation</li>
          </ul>
        </div>
      }
    >
      Click the expand button to see more details.
    </Alert>
    
    <Alert
      variant="error"
      title="Error Details"
      expandable
      defaultExpanded
      expandedContent={
        <pre style={{ 
          background: 'rgba(0, 0, 0, 0.05)', 
          padding: '0.5rem', 
          borderRadius: '0.25rem',
          overflowX: 'auto' 
        }}>
          {`Error: Unable to connect to server
  at fetchData (api.js:42)
  at processRequest (main.js:123)
  at handleSubmit (form.js:87)`}
        </pre>
      }
    >
      An error occurred while connecting to the server.
    </Alert>
  </AlertStack>
);

export const AutoClose = () => (
  <AlertStack>
    <Alert
      variant="info"
      title="Auto Close"
      autoClose
      autoCloseDuration={5000}
      showProgress
    >
      This alert will automatically close after 5 seconds.
    </Alert>
    
    <Alert
      variant="success"
      title="Auto Close with Progress"
      autoClose
      autoCloseDuration={8000}
      showProgress
    >
      This alert will automatically close after 8 seconds and shows a progress bar.
    </Alert>
  </AlertStack>
);

export const CustomIcons = () => (
  <AlertStack>
    <Alert
      variant="info"
      title="Custom Icon"
      icon={<Icon name="Info" />}
    >
      This alert has a custom bell icon.
    </Alert>
    
    <Alert
      variant="success"
      title="Custom Icon"
      icon={<Icon name="CheckCircle" />}
    >
      This alert has a custom thumbs up icon.
    </Alert>
    
    <Alert
      variant="warning"
      title="Custom Icon"
      icon={<Icon name="AlertTriangle" />}
    >
      This alert has a custom clock icon.
    </Alert>
  </AlertStack>
);

export const Dismissible = () => (
  <Alert
    variant="info"
    title="Dismissible Alert"
    dismissible
  >
    Click anywhere on this alert to dismiss it.
  </Alert>
);

export const ControlledAlert = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  return (
    <div>
      {isVisible ? (
        <Alert
          variant="info"
          title="Controlled Alert"
          onClose={() => setIsVisible(false)}
        >
          This is a controlled alert that can be programmatically shown or hidden.
        </Alert>
      ) : (
        <Button onClick={() => setIsVisible(true)}>
          Show Alert
        </Button>
      )}
    </div>
  );
};

// Styled components for the stories
const AlertStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
