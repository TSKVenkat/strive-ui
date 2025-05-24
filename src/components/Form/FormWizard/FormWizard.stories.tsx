import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { FormWizard } from './FormWizard';
import { FormWizardHeadless } from './FormWizardHeadless';
import { Box } from '../../Box';
import { Input } from '../../Input';
import { Button } from '../../Button';
import { Checkbox } from '../../Checkbox';
import { Select } from '../../Select';
import { Card } from '../../Card';
import { Text } from '../../Text';
import { Flex } from '../../Flex';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styled from 'styled-components';

const meta: Meta<typeof FormWizard> = {
  title: 'Components/Form/FormWizard',
  component: FormWizard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'numbered', 'dots', 'progress'],
      description: 'The visual style of the stepper',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the stepper',
    },
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The direction of the stepper',
    },
    transition: {
      control: 'select',
      options: ['none', 'fade', 'slide'],
      description: 'The transition effect between steps',
    },
    showStepper: {
      control: 'boolean',
      description: 'Whether to show the stepper',
    },
    showProgress: {
      control: 'boolean',
      description: 'Whether to show the progress bar',
    },
    showSummary: {
      control: 'boolean',
      description: 'Whether to show the summary',
    },
    showNavigation: {
      control: 'boolean',
      description: 'Whether to show the navigation buttons',
    },
    allowBackNavigation: {
      control: 'boolean',
      description: 'Whether to allow navigation to previous steps',
    },
    linear: {
      control: 'boolean',
      description: 'Whether to enforce linear navigation',
    },
    validateOnNext: {
      control: 'boolean',
      description: 'Whether to validate the current step before proceeding to the next',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormWizard>;

// Basic example
export const Basic: Story = {
  args: {
    steps: [
      { id: 'step1', title: 'Step 1', subtitle: 'First step' },
      { id: 'step2', title: 'Step 2', subtitle: 'Second step' },
      { id: 'step3', title: 'Step 3', subtitle: 'Final step' },
    ],
    variant: 'default',
    size: 'md',
    direction: 'horizontal',
    transition: 'fade',
    showStepper: true,
    showProgress: true,
    showSummary: false,
    showNavigation: true,
    allowBackNavigation: true,
    linear: false,
    validateOnNext: false,
  },
  render: (args) => (
    <Box style={{ width: '600px' }}>
      <FormWizard {...args}>
        <Box p={4}>
          <Text variant="h3" mb={4}>Step 1 Content</Text>
          <Text>This is the content for step 1. Fill out the information and click Next to continue.</Text>
          <Input label="Name" placeholder="Enter your name" mt={4} />
        </Box>
        <Box p={4}>
          <Text variant="h3" mb={4}>Step 2 Content</Text>
          <Text>This is the content for step 2. Fill out the information and click Next to continue.</Text>
          <Input label="Email" placeholder="Enter your email" mt={4} />
        </Box>
        <Box p={4}>
          <Text variant="h3" mb={4}>Step 3 Content</Text>
          <Text>This is the content for step 3. Review your information and click Finish to complete.</Text>
          <Text mt={4}>Thank you for completing all steps!</Text>
        </Box>
      </FormWizard>
    </Box>
  ),
};

// Different variants
export const Variants: Story = {
  render: () => (
    <Flex direction="column" gap={8} style={{ width: '800px' }}>
      <Card>
        <Text variant="h4" mb={4}>Default Variant</Text>
        <FormWizard
          steps={[
            { id: 'step1', title: 'Personal Info' },
            { id: 'step2', title: 'Address' },
            { id: 'step3', title: 'Review' },
          ]}
          variant="default"
          showProgress={false}
        >
          <Box p={2}>Personal Info Content</Box>
          <Box p={2}>Address Content</Box>
          <Box p={2}>Review Content</Box>
        </FormWizard>
      </Card>
      
      <Card>
        <Text variant="h4" mb={4}>Numbered Variant</Text>
        <FormWizard
          steps={[
            { id: 'step1', title: 'Personal Info' },
            { id: 'step2', title: 'Address' },
            { id: 'step3', title: 'Review' },
          ]}
          variant="numbered"
          showProgress={false}
        >
          <Box p={2}>Personal Info Content</Box>
          <Box p={2}>Address Content</Box>
          <Box p={2}>Review Content</Box>
        </FormWizard>
      </Card>
      
      <Card>
        <Text variant="h4" mb={4}>Dots Variant</Text>
        <FormWizard
          steps={[
            { id: 'step1', title: 'Personal Info' },
            { id: 'step2', title: 'Address' },
            { id: 'step3', title: 'Review' },
          ]}
          variant="dots"
          showProgress={false}
        >
          <Box p={2}>Personal Info Content</Box>
          <Box p={2}>Address Content</Box>
          <Box p={2}>Review Content</Box>
        </FormWizard>
      </Card>
      
      <Card>
        <Text variant="h4" mb={4}>Progress Variant</Text>
        <FormWizard
          steps={[
            { id: 'step1', title: 'Personal Info' },
            { id: 'step2', title: 'Address' },
            { id: 'step3', title: 'Review' },
          ]}
          variant="progress"
          showProgress={false}
        >
          <Box p={2}>Personal Info Content</Box>
          <Box p={2}>Address Content</Box>
          <Box p={2}>Review Content</Box>
        </FormWizard>
      </Card>
    </Flex>
  ),
};

// Different directions
export const Directions: Story = {
  render: () => (
    <Flex direction="column" gap={8} style={{ width: '800px' }}>
      <Card>
        <Text variant="h4" mb={4}>Horizontal Direction</Text>
        <FormWizard
          steps={[
            { id: 'step1', title: 'Step 1' },
            { id: 'step2', title: 'Step 2' },
            { id: 'step3', title: 'Step 3' },
          ]}
          direction="horizontal"
          showProgress={false}
        >
          <Box p={2}>Step 1 Content</Box>
          <Box p={2}>Step 2 Content</Box>
          <Box p={2}>Step 3 Content</Box>
        </FormWizard>
      </Card>
      
      <Card>
        <Text variant="h4" mb={4}>Vertical Direction</Text>
        <FormWizard
          steps={[
            { id: 'step1', title: 'Step 1' },
            { id: 'step2', title: 'Step 2' },
            { id: 'step3', title: 'Step 3' },
          ]}
          direction="vertical"
          showProgress={false}
        >
          <Box p={2}>Step 1 Content</Box>
          <Box p={2}>Step 2 Content</Box>
          <Box p={2}>Step 3 Content</Box>
        </FormWizard>
      </Card>
    </Flex>
  ),
};

// With validation
const ValidationExample = () => {
  // Step 1 validation schema
  const step1Schema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  });
  
  // Step 2 validation schema
  const step2Schema = z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  });
  
  // Step 3 validation schema
  const step3Schema = z.object({
    terms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  });
  
  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    terms: false,
  });
  
  // Step 1 form
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
    },
  });
  
  // Step 2 form
  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      email: formData.email,
      phone: formData.phone,
    },
  });
  
  // Step 3 form
  const step3Form = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      terms: formData.terms,
    },
  });
  
  // Handle validation for each step
  const validateStep = async (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        const step1Valid = await step1Form.trigger();
        if (step1Valid) {
          const data = step1Form.getValues();
          setFormData(prev => ({ ...prev, ...data }));
        }
        return step1Valid;
      case 1:
        const step2Valid = await step2Form.trigger();
        if (step2Valid) {
          const data = step2Form.getValues();
          setFormData(prev => ({ ...prev, ...data }));
        }
        return step2Valid;
      case 2:
        const step3Valid = await step3Form.trigger();
        if (step3Valid) {
          const data = step3Form.getValues();
          setFormData(prev => ({ ...prev, ...data }));
        }
        return step3Valid;
      default:
        return true;
    }
  };
  
  // Handle form completion
  const handleComplete = () => {
    console.log('Form completed with data:', formData);
    alert('Form submitted successfully!');
  };
  
  return (
    <Box style={{ width: '600px' }}>
      <FormWizard
        steps={[
          { id: 'personal', title: 'Personal Info', subtitle: 'Name details' },
          { id: 'contact', title: 'Contact Info', subtitle: 'How to reach you' },
          { id: 'review', title: 'Review & Submit', subtitle: 'Confirm details' },
        ]}
        validateStep={validateStep}
        onComplete={handleComplete}
        validateOnNext
        showProgress
        showSummary
      >
        <Box p={4}>
          <form>
            <Text variant="h3" mb={4}>Personal Information</Text>
            <Flex direction="column" gap={4}>
              <Input
                label="First Name"
                placeholder="Enter your first name"
                {...step1Form.register('firstName')}
                error={step1Form.formState.errors.firstName?.message}
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                {...step1Form.register('lastName')}
                error={step1Form.formState.errors.lastName?.message}
              />
            </Flex>
          </form>
        </Box>
        
        <Box p={4}>
          <form>
            <Text variant="h3" mb={4}>Contact Information</Text>
            <Flex direction="column" gap={4}>
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                {...step2Form.register('email')}
                error={step2Form.formState.errors.email?.message}
              />
              <Input
                label="Phone"
                placeholder="Enter your phone number"
                {...step2Form.register('phone')}
                error={step2Form.formState.errors.phone?.message}
              />
            </Flex>
          </form>
        </Box>
        
        <Box p={4}>
          <form>
            <Text variant="h3" mb={4}>Review & Submit</Text>
            <Card p={4} mb={4}>
              <Flex direction="column" gap={2}>
                <Text variant="h4">Personal Information</Text>
                <Text>First Name: {formData.firstName}</Text>
                <Text>Last Name: {formData.lastName}</Text>
                
                <Text variant="h4" mt={2}>Contact Information</Text>
                <Text>Email: {formData.email}</Text>
                <Text>Phone: {formData.phone}</Text>
              </Flex>
            </Card>
            
            <Checkbox
              label="I accept the terms and conditions"
              {...step3Form.register('terms')}
              error={step3Form.formState.errors.terms?.message}
            />
          </form>
        </Box>
      </FormWizard>
    </Box>
  );
};

export const WithValidation: Story = {
  render: () => <ValidationExample />,
};

// Headless usage example
const StyledStep = styled.div<{ $active: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${props => props.$active ? '#e6f7ff' : 'transparent'};
  border-bottom: 2px solid ${props => props.$active ? '#1890ff' : 'transparent'};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.$active ? '#e6f7ff' : '#f0f0f0'};
  }
`;

const StyledStepContent = styled.div`
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-top: 16px;
`;

const StyledButton = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${props => props.$primary ? '#1890ff' : 'white'};
  color: ${props => props.$primary ? 'white' : '#1890ff'};
  border: 1px solid #1890ff;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.$primary ? '#40a9ff' : '#e6f7ff'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HeadlessExample = () => {
  return (
    <Box style={{ width: '600px' }}>
      <FormWizardHeadless.Root
        steps={[
          { id: 'step1', title: 'Account' },
          { id: 'step2', title: 'Profile' },
          { id: 'step3', title: 'Review' },
        ]}
      >
        {({ activeStep, goToStep }) => (
          <div>
            <Flex gap={2}>
              {['Account', 'Profile', 'Review'].map((title, index) => (
                <StyledStep
                  key={index}
                  $active={activeStep === index}
                  onClick={() => goToStep(index)}
                >
                  {title}
                </StyledStep>
              ))}
            </Flex>
            
            <StyledStepContent>
              <FormWizardHeadless.Step index={0}>
                <Text variant="h3" mb={4}>Account Setup</Text>
                <Input label="Username" placeholder="Choose a username" mb={2} />
                <Input label="Password" type="password" placeholder="Create a password" />
              </FormWizardHeadless.Step>
              
              <FormWizardHeadless.Step index={1}>
                <Text variant="h3" mb={4}>Profile Information</Text>
                <Input label="Full Name" placeholder="Enter your full name" mb={2} />
                <Select
                  label="Country"
                  options={[
                    { value: 'us', label: 'United States' },
                    { value: 'ca', label: 'Canada' },
                    { value: 'uk', label: 'United Kingdom' },
                  ]}
                />
              </FormWizardHeadless.Step>
              
              <FormWizardHeadless.Step index={2}>
                <Text variant="h3" mb={4}>Review & Submit</Text>
                <Text>Please review your information and submit when ready.</Text>
              </FormWizardHeadless.Step>
            </StyledStepContent>
            
            <FormWizardHeadless.Navigation
              renderBackButton={({ onClick, disabled }) => (
                <StyledButton onClick={onClick} disabled={disabled}>
                  Back
                </StyledButton>
              )}
              renderNextButton={({ onClick, disabled, isLastStep }) => (
                <StyledButton $primary onClick={onClick} disabled={disabled}>
                  {isLastStep ? 'Submit' : 'Continue'}
                </StyledButton>
              )}
            />
          </div>
        )}
      </FormWizardHeadless.Root>
    </Box>
  );
};

export const HeadlessUsage: Story = {
  render: () => <HeadlessExample />,
};

// With optional steps
export const WithOptionalSteps: Story = {
  args: {
    steps: [
      { id: 'step1', title: 'Required Step', subtitle: 'Must complete' },
      { id: 'step2', title: 'Optional Step', subtitle: 'Can be skipped', optional: true },
      { id: 'step3', title: 'Final Step', subtitle: 'Complete process' },
    ],
    linear: true,
    showSummary: true,
  },
  render: (args) => (
    <Box style={{ width: '600px' }}>
      <FormWizard {...args}>
        <Box p={4}>
          <Text variant="h3" mb={4}>Required Step</Text>
          <Text>This step must be completed before proceeding.</Text>
          <Input label="Required Field" placeholder="Enter required information" mt={4} />
        </Box>
        <Box p={4}>
          <Text variant="h3" mb={4}>Optional Step</Text>
          <Text>This step is optional and can be skipped.</Text>
          <Input label="Optional Field" placeholder="Enter optional information" mt={4} />
        </Box>
        <Box p={4}>
          <Text variant="h3" mb={4}>Final Step</Text>
          <Text>Review and complete the process.</Text>
          <Button variant="primary" mt={4}>Submit</Button>
        </Box>
      </FormWizard>
    </Box>
  ),
};
