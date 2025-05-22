import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Drawer, DrawerProps } from './Drawer';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styled from 'styled-components';

export default {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component: 'Drawer component for displaying content that slides in from the edge of the screen.'
      }
    }
  },
  argTypes: {
    placement: {
      control: { type: 'select', options: ['left', 'right', 'top', 'bottom'] },
      description: 'The placement of the drawer',
    },
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'] },
      description: 'The size of the drawer',
    },
    title: {
      control: 'text',
      description: 'The title of the drawer',
    },
    hasCloseButton: {
      control: 'boolean',
      description: 'Whether to show a close button',
    },
    closeOnOutsideClick: {
      control: 'boolean',
      description: 'Whether to close the drawer when clicking outside',
    },
    closeOnEsc: {
      control: 'boolean',
      description: 'Whether to close the drawer when pressing escape',
    },
    hasBackdrop: {
      control: 'boolean',
      description: 'Whether to show a backdrop',
    },
    hasBorder: {
      control: 'boolean',
      description: 'Whether the drawer has a border',
    },
    elevated: {
      control: 'boolean',
      description: 'Whether the drawer is elevated',
    },
    elevation: {
      control: { type: 'select', options: ['sm', 'md', 'lg', 'xl'] },
      description: 'The elevation level',
    },
    rounded: {
      control: 'boolean',
      description: 'Whether the drawer is rounded',
    },
    radius: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'The border radius',
    },
    fullScreenOnMobile: {
      control: 'boolean',
      description: 'Whether the drawer is fullscreen on mobile',
    },
    trapFocus: {
      control: 'boolean',
      description: 'Whether to trap focus within the drawer',
    },
    lockScroll: {
      control: 'boolean',
      description: 'Whether to lock scroll when the drawer is open',
    },
    resizable: {
      control: 'boolean',
      description: 'Whether the drawer is resizable',
    },
    blurBackdrop: {
      control: 'boolean',
      description: 'Whether to show a backdrop blur effect',
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show a header',
    },
    scrollable: {
      control: 'boolean',
      description: 'Whether the drawer is scrollable',
    },
  },
} as Meta;

const Template: Story<DrawerProps> = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
      <Drawer {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>This is the drawer content.</p>
        <p>You can put any content here.</p>
      </Drawer>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: 'Drawer Title',
  placement: 'right',
  size: 'md',
  hasCloseButton: true,
  closeOnOutsideClick: true,
  closeOnEsc: true,
  hasBackdrop: true,
  elevated: true,
  elevation: 'lg',
};

export const Placements = () => {
  const [placement, setPlacement] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <ButtonGroup>
        <Button 
          variant={placement === 'left' ? 'primary' : 'secondary'} 
          onClick={() => setPlacement('left')}
        >
          Left
        </Button>
        <Button 
          variant={placement === 'right' ? 'primary' : 'secondary'} 
          onClick={() => setPlacement('right')}
        >
          Right
        </Button>
        <Button 
          variant={placement === 'top' ? 'primary' : 'secondary'} 
          onClick={() => setPlacement('top')}
        >
          Top
        </Button>
        <Button 
          variant={placement === 'bottom' ? 'primary' : 'secondary'} 
          onClick={() => setPlacement('bottom')}
        >
          Bottom
        </Button>
      </ButtonGroup>
      
      <Button onClick={() => setIsOpen(true)} style={{ marginTop: '1rem' }}>
        Open {placement} drawer
      </Button>
      
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement={placement}
        title={`${placement.charAt(0).toUpperCase() + placement.slice(1)} Drawer`}
      >
        <p>This drawer slides in from the {placement}.</p>
        <p>You can use different placements based on your needs.</p>
      </Drawer>
    </div>
  );
};

export const Sizes = () => {
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>('md');
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <ButtonGroup>
        <Button 
          variant={size === 'xs' ? 'primary' : 'secondary'} 
          onClick={() => setSize('xs')}
        >
          XS
        </Button>
        <Button 
          variant={size === 'sm' ? 'primary' : 'secondary'} 
          onClick={() => setSize('sm')}
        >
          SM
        </Button>
        <Button 
          variant={size === 'md' ? 'primary' : 'secondary'} 
          onClick={() => setSize('md')}
        >
          MD
        </Button>
        <Button 
          variant={size === 'lg' ? 'primary' : 'secondary'} 
          onClick={() => setSize('lg')}
        >
          LG
        </Button>
        <Button 
          variant={size === 'xl' ? 'primary' : 'secondary'} 
          onClick={() => setSize('xl')}
        >
          XL
        </Button>
        <Button 
          variant={size === 'full' ? 'primary' : 'secondary'} 
          onClick={() => setSize('full')}
        >
          Full
        </Button>
      </ButtonGroup>
      
      <Button onClick={() => setIsOpen(true)} style={{ marginTop: '1rem' }}>
        Open {size} drawer
      </Button>
      
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size={size}
        title={`${size.toUpperCase()} Drawer`}
      >
        <p>This is a {size} drawer.</p>
        <p>You can choose different sizes based on your content needs.</p>
      </Drawer>
    </div>
  );
};

export const WithoutBackdrop = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Drawer without Backdrop</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        hasBackdrop={false}
        title="No Backdrop"
      >
        <p>This drawer doesn't have a backdrop.</p>
        <p>This can be useful for non-modal drawers that don't block interaction with the page.</p>
      </Drawer>
    </div>
  );
};

export const WithBlurredBackdrop = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Drawer with Blurred Backdrop</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        blurBackdrop
        title="Blurred Backdrop"
      >
        <p>This drawer has a blurred backdrop.</p>
        <p>This creates a modern, frosted glass effect.</p>
      </Drawer>
    </div>
  );
};

export const Rounded = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Rounded Drawer</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        rounded
        radius="lg"
        title="Rounded Drawer"
      >
        <p>This drawer has rounded corners.</p>
        <p>You can customize the border radius to match your design system.</p>
      </Drawer>
    </div>
  );
};

export const WithCustomHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const customHeader = (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '1rem',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Icon name="Settings" />
        <h3 style={{ margin: 0 }}>Custom Header</h3>
      </div>
      <Button size="sm" variant="secondary" onClick={() => setIsOpen(false)}>
        Close
      </Button>
    </div>
  );
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Drawer with Custom Header</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header={customHeader}
        hasCloseButton={false}
      >
        <p>This drawer has a custom header.</p>
        <p>You can fully customize the header to match your design needs.</p>
      </Drawer>
    </div>
  );
};

export const WithFooter = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const footer = (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: '0.5rem',
      padding: '1rem'
    }}>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => setIsOpen(false)}>
        Save
      </Button>
    </div>
  );
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Drawer with Footer</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Drawer with Footer"
        footer={footer}
      >
        <p>This drawer has a footer with action buttons.</p>
        <p>This is useful for forms or when you need confirmation actions.</p>
      </Drawer>
    </div>
  );
};

export const Resizable = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Resizable Drawer</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Resizable Drawer"
        resizable
        minSize={200}
        maxSize={800}
      >
        <p>This drawer is resizable.</p>
        <p>Hover over the edge and drag to resize.</p>
        <p>This is useful when users need to adjust the size based on their content viewing needs.</p>
      </Drawer>
    </div>
  );
};

export const FullScreenOnMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Drawer (Full Screen on Mobile)</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Mobile Optimized"
        fullScreenOnMobile
        mobileBreakpoint={768}
      >
        <p>This drawer becomes full screen on mobile devices.</p>
        <p>Resize your browser window to see the effect.</p>
        <p>This provides a better user experience on small screens.</p>
      </Drawer>
    </div>
  );
};

export const FormExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const footer = (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-end', 
      gap: '0.5rem',
      padding: '1rem'
    }}>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={() => setIsOpen(false)}>
        Submit
      </Button>
    </div>
  );
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Form Drawer</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="User Profile"
        footer={footer}
        size="md"
      >
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Name
            </label>
            <input 
              id="name" 
              type="text" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '0.25rem',
                border: '1px solid #cbd5e0'
              }} 
            />
          </div>
          
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Email
            </label>
            <input 
              id="email" 
              type="email" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '0.25rem',
                border: '1px solid #cbd5e0'
              }} 
            />
          </div>
          
          <div>
            <label htmlFor="bio" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Bio
            </label>
            <textarea 
              id="bio" 
              rows={4}
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                borderRadius: '0.25rem',
                border: '1px solid #cbd5e0'
              }} 
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export const NestedDrawers = () => {
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isNestedOpen, setIsNestedOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsMainOpen(true)}>Open Main Drawer</Button>
      
      <Drawer
        isOpen={isMainOpen}
        onClose={() => setIsMainOpen(false)}
        title="Main Drawer"
        placement="left"
        size="md"
      >
        <p>This is the main drawer.</p>
        <Button onClick={() => setIsNestedOpen(true)} style={{ marginTop: '1rem' }}>
          Open Nested Drawer
        </Button>
        
        <Drawer
          isOpen={isNestedOpen}
          onClose={() => setIsNestedOpen(false)}
          title="Nested Drawer"
          placement="right"
          size="sm"
        >
          <p>This is a nested drawer.</p>
          <p>You can create complex UI patterns with nested drawers.</p>
        </Drawer>
      </Drawer>
    </div>
  );
};

export const LongContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Drawer with Long Content</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Scrollable Content"
        scrollable
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <p key={index}>
            This is paragraph {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        ))}
      </Drawer>
    </div>
  );
};

// Styled components for the stories
const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;
