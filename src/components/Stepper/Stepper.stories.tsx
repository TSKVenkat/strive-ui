import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Stepper, StepperProps } from './Stepper';
import styled from 'styled-components';
import { Button } from '../Button';

export default {
  title: 'Components/Stepper',
  component: Stepper,
  argTypes: {
    activeStep: {
      control: { type: 'number', min: 0, max: 3 },
    },
    orientation: {
      control: { type: 'select', options: ['horizontal', 'vertical'] },
    },
    alternateLabels: {
      control: 'boolean',
    },
    showStepNumbers: {
      control: 'boolean',
    },
    clickable: {
      control: 'boolean',
    },
    onStepClick: { action: 'step clicked' },
  },
} as Meta;

const Container = styled.div`
  max-width: 800px;
  padding: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;
`;

const steps = ['Account Details', 'Personal Information', 'Review', 'Confirmation'];

const Template: Story<StepperProps> = (args) => (
  <Container>
    <Stepper {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  activeStep: 1,
  steps,
  orientation: 'horizontal',
  alternateLabels: false,
  showStepNumbers: true,
  clickable: false,
};

export const Vertical = Template.bind({});
Vertical.args = {
  activeStep: 1,
  steps,
  orientation: 'vertical',
  showStepNumbers: true,
  clickable: false,
};

export const AlternateLabels = Template.bind({});
AlternateLabels.args = {
  activeStep: 1,
  steps,
  orientation: 'horizontal',
  alternateLabels: true,
  showStepNumbers: true,
  clickable: false,
};

export const Clickable = Template.bind({});
Clickable.args = {
  activeStep: 1,
  steps,
  orientation: 'horizontal',
  alternateLabels: false,
  showStepNumbers: true,
  clickable: true,
};

export const Interactive: Story = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  return (
    <Container>
      <Stepper
        activeStep={activeStep}
        steps={steps}
        clickable
        onStepClick={handleStepClick}
      />
      
      <ButtonGroup>
        <Button 
          variant="secondary" 
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === steps.length - 2 ? 'Finish' : 'Next'}
        </Button>
      </ButtonGroup>
    </Container>
  );
};
