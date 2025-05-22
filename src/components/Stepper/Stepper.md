# Stepper Component

The Stepper component displays progress through a sequence of logical and numbered steps. It's commonly used for multi-step forms, wizards, or checkout flows.

## Import

```jsx
import { Stepper } from 'strive-ui';
```

## Usage

```jsx
<Stepper
  activeStep={1}
  steps={['Account Details', 'Personal Information', 'Review', 'Confirmation']}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeStep` | `number` | Required | Current active step (0-indexed) |
| `steps` | `string[]` | Required | Array of step labels |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation of the stepper |
| `alternateLabels` | `boolean` | `false` | Whether to alternate the step label positions (horizontal orientation only) |
| `showStepNumbers` | `boolean` | `true` | Whether to show step numbers |
| `clickable` | `boolean` | `false` | Whether steps are clickable |
| `onStepClick` | `(step: number) => void` | - | Callback fired when a step is clicked |
| `completedIcon` | `React.ReactNode` | - | Custom component to render for completed steps |
| `activeIcon` | `React.ReactNode` | - | Custom component to render for the active step |

## Examples

### Horizontal Stepper (Default)

```jsx
<Stepper
  activeStep={1}
  steps={['Account Details', 'Personal Information', 'Review', 'Confirmation']}
/>
```

### Vertical Stepper

```jsx
<Stepper
  activeStep={1}
  steps={['Account Details', 'Personal Information', 'Review', 'Confirmation']}
  orientation="vertical"
/>
```

### Stepper with Alternate Labels

```jsx
<Stepper
  activeStep={1}
  steps={['Account Details', 'Personal Information', 'Review', 'Confirmation']}
  alternateLabels
/>
```

### Clickable Stepper

```jsx
const handleStepClick = (step) => {
  console.log(`Clicked on step ${step}`);
  // Navigate to the selected step
};

<Stepper
  activeStep={1}
  steps={['Account Details', 'Personal Information', 'Review', 'Confirmation']}
  clickable
  onStepClick={handleStepClick}
/>
```

### Interactive Stepper with Navigation Buttons

```jsx
const [activeStep, setActiveStep] = useState(0);
const steps = ['Account Details', 'Personal Information', 'Review', 'Confirmation'];

const handleNext = () => {
  setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
};

const handleBack = () => {
  setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
};

return (
  <>
    <Stepper activeStep={activeStep} steps={steps} />
    
    <div style={{ marginTop: '20px' }}>
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
    </div>
  </>
);
```

## Accessibility

The Stepper component follows accessibility best practices:

- Uses appropriate ARIA attributes (`aria-current="step"` for the active step)
- Provides a navigation role for the stepper container
- Supports keyboard navigation when steps are clickable
- Maintains proper focus management
