import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper } from './Stepper';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

const steps = ['Step 1', 'Step 2', 'Step 3'];

describe('Stepper', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    renderWithTheme(<Stepper activeStep={0} steps={steps} />);
    
    // Check that all steps are rendered
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    
    // Check that the navigation role is applied
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders with the correct active step', () => {
    renderWithTheme(<Stepper activeStep={1} steps={steps} />);
    
    // The active step should have aria-current="step"
    const stepContainers = screen.getAllByRole('button', { hidden: true });
    expect(stepContainers[1]).toHaveAttribute('aria-current', 'step');
  });

  it('renders with vertical orientation', () => {
    renderWithTheme(<Stepper activeStep={0} steps={steps} orientation="vertical" />);
    
    // Check that the container has the correct styles for vertical orientation
    const container = screen.getByRole('navigation');
    expect(container).toHaveStyle('flex-direction: column');
  });

  it('renders without step numbers when showStepNumbers is false', () => {
    renderWithTheme(<Stepper activeStep={0} steps={steps} showStepNumbers={false} />);
    
    // Step numbers should not be visible
    const stepIcons = screen.getAllByRole('button', { hidden: true });
    const firstStepIcon = stepIcons[0].querySelector('div');
    expect(firstStepIcon?.textContent).toBe('');
  });

  // Interaction tests
  it('calls onStepClick when a step is clicked and clickable is true', () => {
    const handleStepClick = jest.fn();
    renderWithTheme(
      <Stepper 
        activeStep={0} 
        steps={steps} 
        clickable 
        onStepClick={handleStepClick} 
      />
    );
    
    // Click on the second step
    const stepContainers = screen.getAllByRole('button', { hidden: true });
    fireEvent.click(stepContainers[1]);
    
    // Check that the handler was called with the correct step index
    expect(handleStepClick).toHaveBeenCalledWith(1);
  });

  it('does not call onStepClick when clickable is false', () => {
    const handleStepClick = jest.fn();
    renderWithTheme(
      <Stepper 
        activeStep={0} 
        steps={steps} 
        clickable={false} 
        onStepClick={handleStepClick} 
      />
    );
    
    // Try to click on the second step
    const stepContainers = screen.getAllByRole('button', { hidden: true });
    fireEvent.click(stepContainers[1]);
    
    // Check that the handler was not called
    expect(handleStepClick).not.toHaveBeenCalled();
  });

  // Custom icon tests
  it('renders with custom completed icon', () => {
    const customCompletedIcon = <span data-testid="custom-completed-icon">✓</span>;
    renderWithTheme(
      <Stepper 
        activeStep={1} 
        steps={steps} 
        completedIcon={customCompletedIcon} 
      />
    );
    
    // Check that the custom icon is rendered for completed steps
    expect(screen.getByTestId('custom-completed-icon')).toBeInTheDocument();
  });

  it('renders with custom active icon', () => {
    const customActiveIcon = <span data-testid="custom-active-icon">*</span>;
    renderWithTheme(
      <Stepper 
        activeStep={1} 
        steps={steps} 
        activeIcon={customActiveIcon} 
      />
    );
    
    // Check that the custom icon is rendered for the active step
    expect(screen.getByTestId('custom-active-icon')).toBeInTheDocument();
  });
});
