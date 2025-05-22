import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Modal, ModalProps } from './Modal';
import { Button } from '../Button';
import { Box } from '../Box';
import { Input } from '../Input';

export default {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'closed' },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg', 'xl', 'full'] },
    },
    closeOnOverlayClick: { control: 'boolean' },
    closeOnEsc: { control: 'boolean' },
    showCloseButton: { control: 'boolean' },
    isCentered: { control: 'boolean' },
    blockScrollOnMount: { control: 'boolean' },
    noBackdrop: { control: 'boolean' },
  },
} as Meta;

// Create a template that includes a button to toggle the modal
const Template: Story<ModalProps & { buttonText: string }> = ({ buttonText, ...args }) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  return (
    <>
      <Button onClick={onOpen}>{buttonText}</Button>
      <Modal {...args} isOpen={isOpen} onClose={onClose}>
        {args.children}
      </Modal>
    </>
  );
};

export const Basic = Template.bind({});
Basic.args = {
  buttonText: 'Open Modal',
  title: 'Modal Title',
  children: (
    <Box>
      <p>This is a basic modal with a title and content.</p>
      <p>Click outside or press ESC to close it.</p>
    </Box>
  ),
  size: 'md',
  closeOnOverlayClick: true,
  closeOnEsc: true,
  showCloseButton: true,
};

export const WithFooter = Template.bind({});
WithFooter.args = {
  buttonText: 'Open Modal with Footer',
  title: 'Confirmation',
  children: (
    <Box>
      <p>Are you sure you want to delete this item?</p>
      <p>This action cannot be undone.</p>
    </Box>
  ),
  footer: (
    <>
      <Button variant="tertiary" onClick={() => {}}>
        Cancel
      </Button>
      <Button variant="danger" onClick={() => {}}>
        Delete
      </Button>
    </>
  ),
  size: 'sm',
};

export const LargeModal = Template.bind({});
LargeModal.args = {
  buttonText: 'Open Large Modal',
  title: 'Large Modal',
  children: (
    <Box>
      <p>This is a large modal that takes up more screen space.</p>
      <p>It's useful for displaying more complex content or forms.</p>
      <div style={{ height: '300px', background: '#f5f5f5', padding: '20px', marginTop: '20px' }}>
        <p>Additional content area</p>
      </div>
    </Box>
  ),
  size: 'lg',
};

export const FormModal = Template.bind({});
FormModal.args = {
  buttonText: 'Open Form Modal',
  title: 'Contact Form',
  children: (
    <Box display="flex" flexDirection="column" gap={4}>
      <Input label="Name" placeholder="Enter your name" />
      <Input label="Email" placeholder="Enter your email" type="email" />
      <Input label="Message" placeholder="Enter your message" as="textarea" rows={4} />
    </Box>
  ),
  footer: (
    <>
      <Button variant="tertiary" onClick={() => {}}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => {}}>
        Submit
      </Button>
    </>
  ),
  size: 'md',
};

export const CenteredModal = Template.bind({});
CenteredModal.args = {
  buttonText: 'Open Centered Modal',
  title: 'Centered Modal',
  children: <p>This modal is centered vertically in the viewport.</p>,
  isCentered: true,
  size: 'sm',
};

export const NoBackdrop = Template.bind({});
NoBackdrop.args = {
  buttonText: 'Open Modal Without Backdrop',
  title: 'No Backdrop',
  children: <p>This modal doesn't have a backdrop overlay.</p>,
  noBackdrop: true,
  size: 'sm',
};

export const NoCloseButton = Template.bind({});
NoCloseButton.args = {
  buttonText: 'Open Modal Without Close Button',
  title: 'No Close Button',
  children: (
    <Box>
      <p>This modal doesn't have a close button in the header.</p>
      <p>You can still close it by clicking outside or pressing ESC.</p>
    </Box>
  ),
  showCloseButton: false,
};

export const NestedModals: Story = () => {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsFirstOpen(true)}>Open First Modal</Button>
      
      <Modal 
        isOpen={isFirstOpen} 
        onClose={() => setIsFirstOpen(false)}
        title="First Modal"
      >
        <Box>
          <p>This is the first modal.</p>
          <Button onClick={() => setIsSecondOpen(true)}>Open Second Modal</Button>
        </Box>
      </Modal>
      
      <Modal 
        isOpen={isSecondOpen} 
        onClose={() => setIsSecondOpen(false)}
        title="Second Modal"
        size="sm"
      >
        <p>This is a nested modal inside the first one.</p>
      </Modal>
    </>
  );
};
