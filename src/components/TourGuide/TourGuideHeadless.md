# TourGuideHeadless

A headless component for creating guided tours and walkthroughs for your application.

## Usage

```jsx
import { TourGuideHeadless } from 'strive-ui';
import { useRef } from 'react';

function MyApp() {
  const featureRef = useRef(null);
  
  const steps = [
    {
      id: 'step1',
      target: '.header',
      title: 'Welcome',
      content: 'Welcome to our application!',
      placement: 'bottom',
    },
    {
      id: 'step2',
      target: featureRef,
      title: 'Key Feature',
      content: 'This is an important feature you should know about.',
      placement: 'right',
    },
  ];
  
  return (
    <div>
      <header className="header">My App</header>
      
      <div ref={featureRef}>Important Feature</div>
      
      <TourGuideHeadless.Root steps={steps} enabled={true}>
        <TourGuideHeadless.Mask />
        <TourGuideHeadless.Highlight />
        
        <TourGuideHeadless.Tooltip>
          {({ currentStep, isFirstStep, isLastStep }) => (
            <div>
              <h3>{currentStep.title}</h3>
              <div>{currentStep.content}</div>
              
              <TourGuideHeadless.Controls>
                {({ prev, next, skip, isFirstStep, isLastStep }) => (
                  <div>
                    {!isFirstStep && <button onClick={prev}>Back</button>}
                    <button onClick={skip}>Skip</button>
                    <button onClick={next}>
                      {isLastStep ? 'Finish' : 'Next'}
                    </button>
                  </div>
                )}
              </TourGuideHeadless.Controls>
              
              <TourGuideHeadless.Progress>
                {({ currentStepIndex, totalSteps }) => (
                  <div>{currentStepIndex + 1} of {totalSteps}</div>
                )}
              </TourGuideHeadless.Progress>
            </div>
          )}
        </TourGuideHeadless.Tooltip>
      </TourGuideHeadless.Root>
      
      <button onClick={() => tourGuideRef.current.start()}>Start Tour</button>
    </div>
  );
}
```

## API

### TourGuideHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `TourStep[]` | Required | Steps of the tour |
| `enabled` | `boolean` | `true` | Whether the tour is enabled |
| `initialStepIndex` | `number` | `0` | Initial step index |
| `closeOnClickOutside` | `boolean` | `true` | Whether to close the tour when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the tour when pressing escape |
| `showStepIndicators` | `boolean` | `true` | Whether to show step indicators |
| `showStepNumbers` | `boolean` | `true` | Whether to show step numbers |
| `showNavigation` | `boolean` | `true` | Whether to show navigation buttons |
| `showCloseButton` | `boolean` | `true` | Whether to show the close button |
| `showSkipButton` | `boolean` | `true` | Whether to show the skip button |
| `showMask` | `boolean` | `true` | Whether to mask the rest of the page |
| `updateUrlHash` | `boolean` | `false` | Whether to update the URL hash |
| `onStart` | `() => void` | - | Callback when the tour starts |
| `onEnd` | `(completed: boolean) => void` | - | Callback when the tour ends |
| `onStepChange` | `(currentStep, nextStep) => void` | - | Callback when a step changes |
| `onStepShow` | `(step) => void` | - | Callback when a step is shown |
| `onSkip` | `() => void` | - | Callback when the tour is skipped |

### TourStep Interface

```typescript
interface TourStep {
  id: string;
  target: string | React.RefObject<HTMLElement>;
  title?: string;
  content: React.ReactNode;
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'auto';
  highlight?: boolean;
  disableInteraction?: boolean;
  scrollToTarget?: boolean;
  offset?: number;
  className?: string;
  style?: React.CSSProperties;
  beforeStep?: () => Promise<boolean> | boolean;
  afterStep?: () => void;
}
```

### Other Components

- `TourGuideHeadless.Mask`: Renders a mask over the page
- `TourGuideHeadless.Tooltip`: Renders a tooltip for the current step
- `TourGuideHeadless.Highlight`: Highlights the target element
- `TourGuideHeadless.Controls`: Provides navigation controls
- `TourGuideHeadless.Progress`: Shows progress through the tour
- `TourGuideHeadless.Badge`: Shows step number information
