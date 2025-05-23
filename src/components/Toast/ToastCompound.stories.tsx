import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import styled from 'styled-components';
import Toast from './ToastCompound';
import { Box } from '../Box';
import { Button } from '../Button';

const meta: Meta<typeof Toast.Provider> = {
  title: 'Components/Toast/ToastCompound',
  component: Toast.Provider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Toast.Provider>;

// Styled components for the stories
const StoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const PositionSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 16px;
  max-width: 400px;
`;

const PositionButton = styled(Button)<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.7)};
  border: ${({ $active, theme }) => ($active ? `2px solid ${theme.colors.primary[500]}` : 'none')};
`;

// Basic example
export const Basic: Story = {
  render: () => {
    const BasicExample = () => {
      const toast = Toast.useToast();

      const showInfoToast = () => {
        toast.info({
          title: 'Information',
          description: 'This is an informational message.',
        });
      };

      const showSuccessToast = () => {
        toast.success({
          title: 'Success',
          description: 'Your action was completed successfully!',
        });
      };

      const showWarningToast = () => {
        toast.warning({
          title: 'Warning',
          description: 'Please be careful with this action.',
        });
      };

      const showErrorToast = () => {
        toast.error({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
        });
      };

      return (
        <StoryContainer>
          <h2>Basic Toast Examples</h2>
          <p>Click the buttons below to show different types of toasts:</p>
          <ButtonGroup>
            <Button onClick={showInfoToast} variant="primary">
              Info Toast
            </Button>
            <Button onClick={showSuccessToast} variant="primary" color="success">
              Success Toast
            </Button>
            <Button onClick={showWarningToast} variant="primary" color="warning">
              Warning Toast
            </Button>
            <Button onClick={showErrorToast} variant="primary" color="error">
              Error Toast
            </Button>
          </ButtonGroup>
        </StoryContainer>
      );
    };

    return (
      <Toast.Provider>
        <BasicExample />
        <Toast.Container />
      </Toast.Provider>
    );
  },
};

// Positions example
export const Positions: Story = {
  render: () => {
    const PositionsExample = () => {
      const toast = Toast.useToast();
      const [position, setPosition] = useState<'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'>('top-right');

      const showToast = () => {
        toast.info({
          title: `Toast (${position})`,
          description: `This toast appears in the ${position} position.`,
        });
      };

      const positions = [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ] as const;

      return (
        <StoryContainer>
          <h2>Toast Positions</h2>
          <p>Select a position and click "Show Toast" to see how it appears:</p>
          
          <Button onClick={showToast} variant="primary" size="lg">
            Show Toast
          </Button>

          <h3>Position:</h3>
          <PositionSelector>
            {positions.map((pos) => (
              <PositionButton
                key={pos}
                onClick={() => setPosition(pos)}
                $active={position === pos}
                variant="secondary"
                size="sm"
              >
                {pos}
              </PositionButton>
            ))}
          </PositionSelector>
        </StoryContainer>
      );
    };

    return (
      <Toast.Provider>
        <PositionsExample />
        <Toast.Container />
      </Toast.Provider>
    );
  },
};

// Custom duration example
export const CustomDuration: Story = {
  render: () => {
    const DurationExample = () => {
      const toast = Toast.useToast();
      const [duration, setDuration] = useState(3000);

      const showToast = () => {
        toast.info({
          title: `Toast (${duration}ms)`,
          description: `This toast will automatically close after ${duration / 1000} seconds.`,
          duration,
        });
      };

      const durations = [1000, 3000, 5000, 10000, 0];

      return (
        <StoryContainer>
          <h2>Custom Duration</h2>
          <p>Select a duration and click "Show Toast" to see how long it stays visible:</p>
          
          <Button onClick={showToast} variant="primary" size="lg">
            Show Toast
          </Button>

          <h3>Duration:</h3>
          <ButtonGroup>
            {durations.map((dur) => (
              <Button
                key={dur}
                onClick={() => setDuration(dur)}
                variant={duration === dur ? 'primary' : 'secondary'}
                size="sm"
              >
                {dur === 0 ? 'Persistent' : `${dur / 1000}s`}
              </Button>
            ))}
          </ButtonGroup>
          <p>
            <small>Note: Setting duration to 0 makes the toast persistent (won't auto-close).</small>
          </p>
        </StoryContainer>
      );
    };

    return (
      <Toast.Provider>
        <DurationExample />
        <Toast.Container />
      </Toast.Provider>
    );
  },
};

// Custom render example
export const CustomRender: Story = {
  render: () => {
    const CustomRenderExample = () => {
      const toast = Toast.useToast();

      const showCustomToast = () => {
        toast.addToast({
          description: 'Custom toast',
          render: ({ onClose }) => (
            <Box
              display="flex"
              flexDirection="column"
              padding="4"
              backgroundColor="primary.50"
              borderRadius="md"
              boxShadow="md"
              width="100%"
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" margin="12px 0 0 0" padding="8px" backgroundColor="primary.100" borderRadius="sm">
                <Box as="h4" margin={0} fontWeight="bold" color="primary.700">
                  Custom Toast
                </Box>
                <Button
                  onClick={onClose}
                  variant="secondary"
                  size="sm"
                  aria-label="Close toast"
                >
                  ×
                </Button>
              </Box>
              <Box color="neutral.700">
                This is a completely custom toast with your own design and layout.
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                marginTop={3}
                padding={2}
                backgroundColor="primary.100"
                borderRadius="sm"
              >
                <Box as="span" color="primary.700">
                  Custom footer content
                </Box>
                <Button onClick={onClose} size="sm" variant="secondary">
                  Dismiss
                </Button>
              </Box>
            </Box>
          ),
        });
      };

      return (
        <StoryContainer>
          <h2>Custom Render</h2>
          <p>Click the button below to show a completely custom toast:</p>
          <Button onClick={showCustomToast} variant="primary" size="lg">
            Show Custom Toast
          </Button>
        </StoryContainer>
      );
    };

    return (
      <Toast.Provider>
        <CustomRenderExample />
        <Toast.Container />
      </Toast.Provider>
    );
  },
};

// Update toast example
export const UpdateToast: Story = {
  render: () => {
    const UpdateToastExample = () => {
      const toast = Toast.useToast();
      const [toastId, setToastId] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(false);

      const startProcess = () => {
        setIsLoading(true);
        
        // Show initial loading toast
        const id = toast.info({
          title: 'Processing',
          description: 'Your request is being processed...',
          duration: 0, // Don't auto-close
          hasProgressBar: false,
        });
        
        setToastId(id);
        
        // Simulate a process
        setTimeout(() => {
          // Update to success after 3 seconds
          if (id) {
            toast.updateToast(id, {
              variant: 'success',
              title: 'Success',
              description: 'Your request was processed successfully!',
              duration: 5000, // Auto-close after 5 seconds
              hasProgressBar: true,
            });
          }
          setIsLoading(false);
          setToastId(null);
        }, 3000);
      };

      return (
        <StoryContainer>
          <h2>Update Toast</h2>
          <p>Click the button to start a process that updates the toast when complete:</p>
          <Button 
            onClick={startProcess} 
            variant="primary" 
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Start Process'}
          </Button>
        </StoryContainer>
      );
    };

    return (
      <Toast.Provider>
        <UpdateToastExample />
        <Toast.Container />
      </Toast.Provider>
    );
  },
};

// Multiple toasts example
export const MultipleToasts: Story = {
  render: () => {
    const MultipleToastsExample = () => {
      const toast = Toast.useToast();
      
      const addMultipleToasts = () => {
        toast.info({
          title: 'Information',
          description: 'This is an informational message.',
        });
        
        setTimeout(() => {
          toast.success({
            title: 'Success',
            description: 'Your action was completed successfully!',
          });
        }, 500);
        
        setTimeout(() => {
          toast.warning({
            title: 'Warning',
            description: 'Please be careful with this action.',
          });
        }, 1000);
        
        setTimeout(() => {
          toast.error({
            title: 'Error',
            description: 'Something went wrong. Please try again.',
          });
        }, 1500);
      };

      const clearAllToasts = () => {
        toast.removeAllToasts();
      };

      return (
        <StoryContainer>
          <h2>Multiple Toasts</h2>
          <p>Click the button to add multiple toasts in sequence:</p>
          <ButtonGroup>
            <Button onClick={addMultipleToasts} variant="primary" size="lg">
              Show Multiple Toasts
            </Button>
            <Button onClick={clearAllToasts} variant="secondary" size="lg">
              Clear All Toasts
            </Button>
          </ButtonGroup>
        </StoryContainer>
      );
    };

    return (
      <Toast.Provider maxToasts={4}>
        <MultipleToastsExample />
        <Toast.Container />
      </Toast.Provider>
    );
  },
};

// Custom Toast Component example
export const CustomToastComponent: Story = {
  render: () => {
    const CustomToastComponentExample = () => {
      const [isVisible, setIsVisible] = useState(false);
      
      const toggleToast = () => {
        setIsVisible(!isVisible);
      };
      
      return (
        <StoryContainer>
          <h2>Custom Toast Component</h2>
          <p>This example shows how to use the Toast.Custom component directly:</p>
          
          <Button onClick={toggleToast} variant="primary" size="lg">
            {isVisible ? 'Hide Custom Toast' : 'Show Custom Toast'}
          </Button>
          
          {isVisible && (
            <Box margin="16px 0 0 0">
              <Toast.Custom
                variant="success"
                hasProgressBar={true}
                duration={10000}
                onClose={() => setIsVisible(false)}
              >
                <Box padding={3}>
                  <Box as="h4" margin={0} fontWeight="bold" color="primary.700">
                    Custom Toast Component
                  </Box>
                  <Box as="p" margin={0}>
                    This is a custom toast component that you can use directly in your UI.
                  </Box>
                  <Box display="flex" justifyContent="flex-end" margin="12px 0 0 0">
                    <Button onClick={() => setIsVisible(false)} size="sm" variant="secondary">
                      Dismiss
                    </Button>
                  </Box>
                </Box>
              </Toast.Custom>
            </Box>
          )}
        </StoryContainer>
      );
    };

    return (
      <Toast.Provider>
        <CustomToastComponentExample />
        <Toast.Container />
      </Toast.Provider>
    );
  },
};
