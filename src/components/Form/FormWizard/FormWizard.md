# FormWizard

The FormWizard component provides a comprehensive solution for creating multi-step forms with validation, navigation, and state management. It follows the headless component architecture pattern, separating the logic from the presentation to allow for maximum flexibility and customization.

## Features

- **Multi-Step Navigation**: Easily navigate between form steps with built-in next, previous, and direct step navigation.
- **Validation Support**: Validate each step before proceeding to ensure data integrity.
- **Progress Tracking**: Visual indicators for form completion progress.
- **Flexible Layout Options**: Support for both horizontal and vertical step layouts.
- **Customizable Transitions**: Smooth transitions between steps with various animation options.
- **Accessibility**: Fully accessible with proper ARIA attributes and keyboard navigation.
- **Form State Management**: Built-in state management for form data across steps.
- **Optional Steps**: Support for marking steps as optional in the wizard flow.
- **Headless Architecture**: Separate logic from presentation for maximum customization.
- **Styled Components**: Pre-styled components ready for use in your application.

## Installation

```bash
npm install strive-ui
# or
yarn add strive-ui
```

## Basic Usage

```jsx
import { FormWizard } from 'strive-ui';

function MyFormWizard() {
  const steps = [
    { id: 'personal', title: 'Personal Info', subtitle: 'Your details' },
    { id: 'contact', title: 'Contact Info', subtitle: 'How to reach you' },
    { id: 'review', title: 'Review', subtitle: 'Confirm details' }
  ];
  
  const handleComplete = (data) => {
    console.log('Form completed with data:', data);
    // Submit data to server, etc.
  };
  
  return (
    <FormWizard
      steps={steps}
      validateOnNext
      onComplete={handleComplete}
    >
      {/* Step 1: Personal Info */}
      <div>
        <h2>Personal Information</h2>
        <input placeholder="First Name" />
        <input placeholder="Last Name" />
      </div>
      
      {/* Step 2: Contact Info */}
      <div>
        <h2>Contact Information</h2>
        <input placeholder="Email" type="email" />
        <input placeholder="Phone" type="tel" />
      </div>
      
      {/* Step 3: Review */}
      <div>
        <h2>Review Your Information</h2>
        <p>Please review your information before submitting.</p>
        <button>Submit</button>
      </div>
    </FormWizard>
  );
}
```

## Advanced Usage with Validation

```jsx
import { FormWizard } from 'strive-ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

function ValidatedFormWizard() {
  // Define validation schemas for each step
  const step1Schema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  });
  
  const step2Schema = z.object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  });
  
  // Initialize react-hook-form for each step
  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });
  
  const step2Form = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      email: '',
      phone: '',
    },
  });
  
  // Validation function for FormWizard
  const validateStep = async (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return await step1Form.trigger();
      case 1:
        return await step2Form.trigger();
      default:
        return true;
    }
  };
  
  // Handle form completion
  const handleComplete = () => {
    const formData = {
      ...step1Form.getValues(),
      ...step2Form.getValues(),
    };
    console.log('Form completed with data:', formData);
  };
  
  return (
    <FormWizard
      steps={[
        { id: 'personal', title: 'Personal Info' },
        { id: 'contact', title: 'Contact Info' },
        { id: 'review', title: 'Review' },
      ]}
      validateStep={validateStep}
      onComplete={handleComplete}
      validateOnNext
    >
      {/* Step 1: Personal Info */}
      <form>
        <h2>Personal Information</h2>
        <input {...step1Form.register('firstName')} placeholder="First Name" />
        {step1Form.formState.errors.firstName && (
          <p>{step1Form.formState.errors.firstName.message}</p>
        )}
        
        <input {...step1Form.register('lastName')} placeholder="Last Name" />
        {step1Form.formState.errors.lastName && (
          <p>{step1Form.formState.errors.lastName.message}</p>
        )}
      </form>
      
      {/* Step 2: Contact Info */}
      <form>
        <h2>Contact Information</h2>
        <input {...step2Form.register('email')} placeholder="Email" type="email" />
        {step2Form.formState.errors.email && (
          <p>{step2Form.formState.errors.email.message}</p>
        )}
        
        <input {...step2Form.register('phone')} placeholder="Phone" type="tel" />
        {step2Form.formState.errors.phone && (
          <p>{step2Form.formState.errors.phone.message}</p>
        )}
      </form>
      
      {/* Step 3: Review */}
      <div>
        <h2>Review Your Information</h2>
        <p>First Name: {step1Form.getValues().firstName}</p>
        <p>Last Name: {step1Form.getValues().lastName}</p>
        <p>Email: {step2Form.getValues().email}</p>
        <p>Phone: {step2Form.getValues().phone}</p>
      </div>
    </FormWizard>
  );
}
```

## Headless Usage

For maximum customization, you can use the headless version of the FormWizard:

```jsx
import { FormWizardHeadless } from 'strive-ui';
import styled from 'styled-components';

// Custom styled components
const StyledStep = styled.div`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${props => props.active ? '#e6f7ff' : 'transparent'};
  border-bottom: 2px solid ${props => props.active ? '#1890ff' : 'transparent'};
  cursor: pointer;
`;

const StyledContent = styled.div`
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-top: 16px;
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${props => props.primary ? '#1890ff' : 'white'};
  color: ${props => props.primary ? 'white' : '#1890ff'};
  border: 1px solid #1890ff;
  cursor: pointer;
`;

function CustomFormWizard() {
  return (
    <FormWizardHeadless.Root
      steps={[
        { id: 'step1', title: 'Account' },
        { id: 'step2', title: 'Profile' },
        { id: 'step3', title: 'Review' },
      ]}
    >
      {({ activeStep, goToStep }) => (
        <div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Account', 'Profile', 'Review'].map((title, index) => (
              <StyledStep
                key={index}
                active={activeStep === index}
                onClick={() => goToStep(index)}
              >
                {title}
              </StyledStep>
            ))}
          </div>
          
          <StyledContent>
            <FormWizardHeadless.Step index={0}>
              <h2>Account Setup</h2>
              <input placeholder="Username" />
              <input type="password" placeholder="Password" />
            </FormWizardHeadless.Step>
            
            <FormWizardHeadless.Step index={1}>
              <h2>Profile Information</h2>
              <input placeholder="Full Name" />
              <select>
                <option value="us">United States</option>
                <option value="ca">Canada</option>
                <option value="uk">United Kingdom</option>
              </select>
            </FormWizardHeadless.Step>
            
            <FormWizardHeadless.Step index={2}>
              <h2>Review & Submit</h2>
              <p>Please review your information and submit when ready.</p>
            </FormWizardHeadless.Step>
          </StyledContent>
          
          <FormWizardHeadless.Navigation
            renderBackButton={({ onClick, disabled }) => (
              <StyledButton onClick={onClick} disabled={disabled}>
                Back
              </StyledButton>
            )}
            renderNextButton={({ onClick, disabled, isLastStep }) => (
              <StyledButton primary onClick={onClick} disabled={disabled}>
                {isLastStep ? 'Submit' : 'Continue'}
              </StyledButton>
            )}
          />
        </div>
      )}
    </FormWizardHeadless.Root>
  );
}
```

## API Reference

### FormWizard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `Array<FormWizardStep>` | Required | Array of step configurations |
| `initialStep` | `number` | `0` | Index of the initial active step |
| `variant` | `'default' \| 'numbered' \| 'dots' \| 'progress'` | `'default'` | Visual style of the stepper |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the stepper |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | Direction of the stepper |
| `transition` | `'none' \| 'fade' \| 'slide'` | `'fade'` | Transition effect between steps |
| `showStepper` | `boolean` | `true` | Whether to show the stepper |
| `showProgress` | `boolean` | `true` | Whether to show the progress bar |
| `showSummary` | `boolean` | `false` | Whether to show the summary |
| `showNavigation` | `boolean` | `true` | Whether to show the navigation buttons |
| `allowBackNavigation` | `boolean` | `true` | Whether to allow navigation to previous steps |
| `linear` | `boolean` | `false` | Whether to enforce linear navigation |
| `validateOnNext` | `boolean` | `false` | Whether to validate the current step before proceeding to the next |
| `validateStep` | `(stepIndex: number) => Promise<boolean> \| boolean` | `undefined` | Function to validate the current step |
| `onStepChange` | `(prevStep: number, nextStep: number) => void` | `undefined` | Callback when the active step changes |
| `onComplete` | `(data: any) => void` | `undefined` | Callback when the form is completed |
| `children` | `React.ReactNode \| React.ReactNode[]` | Required | Content for each step |
| `className` | `string` | `undefined` | Custom class name |
| `style` | `React.CSSProperties` | `undefined` | Custom styles |

### FormWizardStep Type

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the step |
| `title` | `string` | Title of the step |
| `subtitle` | `string` (optional) | Subtitle of the step |
| `icon` | `React.ReactNode` (optional) | Custom icon for the step |
| `optional` | `boolean` (optional) | Whether the step is optional |
| `completed` | `boolean` (optional) | Whether the step is completed |
| `hasError` | `boolean` (optional) | Whether the step has an error |

### useFormWizard Hook

The `useFormWizard` hook provides the core functionality for the FormWizard component and can be used independently for custom implementations.

```jsx
import { useFormWizard } from 'strive-ui';

function CustomWizard() {
  const {
    activeStep,
    steps,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep,
    isLastStep,
    progress,
    formData,
    updateFormData,
  } = useFormWizard({
    steps: [
      { id: 'step1', title: 'Step 1' },
      { id: 'step2', title: 'Step 2' },
      { id: 'step3', title: 'Step 3' },
    ],
    validateOnNext: true,
    validateStep: async (stepIndex) => {
      // Custom validation logic
      return true;
    },
  });
  
  return (
    <div>
      {/* Custom UI implementation */}
    </div>
  );
}
```

### FormWizardHeadless Components

The headless version of FormWizard provides the following components:

#### FormWizardHeadless.Root

The root component that provides the FormWizard context.

```jsx
<FormWizardHeadless.Root
  steps={steps}
  validateOnNext
  onComplete={handleComplete}
>
  {children}
</FormWizardHeadless.Root>
```

#### FormWizardHeadless.Stepper

The stepper component that displays the steps.

```jsx
<FormWizardHeadless.Stepper
  showConnector
  showNumbers
  showIcons
  showTitles
  showSubtitles
  showStatus
  clickable
/>
```

#### FormWizardHeadless.StepContainer

The container for the step content with transitions.

```jsx
<FormWizardHeadless.StepContainer>
  {children}
</FormWizardHeadless.StepContainer>
```

#### FormWizardHeadless.Step

The component for rendering a specific step.

```jsx
<FormWizardHeadless.Step index={0}>
  {/* Step content */}
</FormWizardHeadless.Step>
```

#### FormWizardHeadless.Navigation

The navigation component with back and next buttons.

```jsx
<FormWizardHeadless.Navigation
  showBackButton
  showNextButton
  backText="Back"
  nextText="Next"
  finishText="Finish"
  renderBackButton={({ onClick, disabled }) => (
    <button onClick={onClick} disabled={disabled}>Back</button>
  )}
  renderNextButton={({ onClick, disabled, isLastStep }) => (
    <button onClick={onClick} disabled={disabled}>
      {isLastStep ? 'Finish' : 'Next'}
    </button>
  )}
/>
```

#### FormWizardHeadless.Progress

The progress indicator component.

```jsx
<FormWizardHeadless.Progress
  showPercentage
  showStepCount
/>
```

#### FormWizardHeadless.Summary

The summary component that shows an overview of all steps.

```jsx
<FormWizardHeadless.Summary
  showTitles
  showStatus
  renderStep={(step, index, isActive) => (
    <div>{step.title}</div>
  )}
/>
```

## Accessibility

The FormWizard component is built with accessibility in mind:

- Proper ARIA attributes for the stepper and navigation
- Keyboard navigation support
- Focus management between steps
- Appropriate color contrast
- Screen reader friendly announcements for step changes

## Best Practices

1. **Keep Steps Focused**: Each step should focus on a specific part of the form to avoid overwhelming users.
2. **Provide Clear Instructions**: Include clear instructions at each step to guide users.
3. **Show Progress**: Always show progress indicators so users know how far they are in the process.
4. **Validate Appropriately**: Validate each step before allowing users to proceed, but don't be too restrictive.
5. **Allow Back Navigation**: Unless absolutely necessary, allow users to go back and edit previous steps.
6. **Provide Summary**: For longer forms, include a summary step at the end for review.
7. **Save Progress**: For complex forms, consider saving progress so users can return later.

## Examples

### Basic Form Wizard

```jsx
import { FormWizard } from 'strive-ui';

function BasicFormWizard() {
  return (
    <FormWizard
      steps={[
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ]}
    >
      <div>Step 1 Content</div>
      <div>Step 2 Content</div>
      <div>Step 3 Content</div>
    </FormWizard>
  );
}
```

### Vertical Form Wizard

```jsx
import { FormWizard } from 'strive-ui';

function VerticalFormWizard() {
  return (
    <FormWizard
      steps={[
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ]}
      direction="vertical"
    >
      <div>Step 1 Content</div>
      <div>Step 2 Content</div>
      <div>Step 3 Content</div>
    </FormWizard>
  );
}
```

### Form Wizard with Optional Steps

```jsx
import { FormWizard } from 'strive-ui';

function OptionalStepsWizard() {
  return (
    <FormWizard
      steps={[
        { id: 'step1', title: 'Required Step' },
        { id: 'step2', title: 'Optional Step', optional: true },
        { id: 'step3', title: 'Final Step' },
      ]}
      linear={true}
    >
      <div>Required Step Content</div>
      <div>Optional Step Content</div>
      <div>Final Step Content</div>
    </FormWizard>
  );
}
```

## Customization

The FormWizard component can be customized using styled-components:

```jsx
import styled from 'styled-components';
import { FormWizard } from 'strive-ui';

const CustomFormWizard = styled(FormWizard)`
  /* Custom styles for the FormWizard */
  background-color: #f9f9f9;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

function StyledFormWizard() {
  return (
    <CustomFormWizard
      steps={[
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ]}
    >
      <div>Step 1 Content</div>
      <div>Step 2 Content</div>
      <div>Step 3 Content</div>
    </CustomFormWizard>
  );
}
```

## Integration with Form Libraries

The FormWizard component works well with popular form libraries:

### React Hook Form

```jsx
import { FormWizard } from 'strive-ui';
import { useForm } from 'react-hook-form';

function ReactHookFormWizard() {
  const form1 = useForm();
  const form2 = useForm();
  
  const validateStep = async (stepIndex) => {
    if (stepIndex === 0) {
      return await form1.trigger();
    } else if (stepIndex === 1) {
      return await form2.trigger();
    }
    return true;
  };
  
  return (
    <FormWizard
      steps={[
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ]}
      validateStep={validateStep}
      validateOnNext
    >
      <form>
        <input {...form1.register('field1', { required: true })} />
        {form1.formState.errors.field1 && <span>This field is required</span>}
      </form>
      
      <form>
        <input {...form2.register('field2', { required: true })} />
        {form2.formState.errors.field2 && <span>This field is required</span>}
      </form>
      
      <div>Review Step</div>
    </FormWizard>
  );
}
```

### Formik

```jsx
import { FormWizard } from 'strive-ui';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function FormikWizard() {
  const step1Schema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
  });
  
  const step2Schema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
  });
  
  const formikRefs = [React.useRef(), React.useRef()];
  
  const validateStep = async (stepIndex) => {
    if (stepIndex === 0 || stepIndex === 1) {
      const formik = formikRefs[stepIndex].current;
      await formik.validateForm();
      return Object.keys(formik.errors).length === 0;
    }
    return true;
  };
  
  return (
    <FormWizard
      steps={[
        { id: 'step1', title: 'Step 1' },
        { id: 'step2', title: 'Step 2' },
        { id: 'step3', title: 'Step 3' },
      ]}
      validateStep={validateStep}
      validateOnNext
    >
      <Formik
        innerRef={formikRefs[0]}
        initialValues={{ firstName: '', lastName: '' }}
        validationSchema={step1Schema}
        onSubmit={() => {}}
      >
        <Form>
          <Field name="firstName" placeholder="First Name" />
          <ErrorMessage name="firstName" component="div" />
          
          <Field name="lastName" placeholder="Last Name" />
          <ErrorMessage name="lastName" component="div" />
        </Form>
      </Formik>
      
      <Formik
        innerRef={formikRefs[1]}
        initialValues={{ email: '' }}
        validationSchema={step2Schema}
        onSubmit={() => {}}
      >
        <Form>
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />
        </Form>
      </Formik>
      
      <div>Review Step</div>
    </FormWizard>
  );
}
```

## Conclusion

The FormWizard component provides a flexible and powerful solution for creating multi-step forms in your React applications. With its headless architecture, you can either use the pre-styled components or create your own custom UI while leveraging the built-in logic for navigation, validation, and state management.
