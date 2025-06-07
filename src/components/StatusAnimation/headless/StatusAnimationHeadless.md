# StatusAnimationHeadless

A headless component for creating customizable status animations with extensive flexibility for developers. Status animations provide visual feedback for success, error, warning, info, and loading states.

## Usage

```jsx
import { StatusAnimationHeadless } from 'pulseui';
import { useState } from 'react';

function MyStatusAnimation() {
  const [active, setActive] = useState(false);
  
  return (
    <StatusAnimationHeadless.Root
      type="success"
      active={active}
      duration={1000}
      size={48}
      strokeWidth={3}
      color="#4caf50"
      backgroundColor="#e8f5e9"
      circle={true}
      autoHide={true}
      autoHideDelay={2000}
      onComplete={() => console.log('Animation completed!')}
    >
      <button onClick={() => setActive(true)}>
        Show Success Animation
      </button>
      
      <StatusAnimationHeadless.Container
        style={{
          marginTop: '16px',
        }}
      >
        <StatusAnimationHeadless.Success />
      </StatusAnimationHeadless.Container>
    </StatusAnimationHeadless.Root>
  );
}
```

## Creating Different Status Animation Types

```jsx
import { StatusAnimationHeadless } from 'pulseui';
import { useState } from 'react';

function StatusAnimationExample() {
  const [activeType, setActiveType] = useState(null);
  
  const handleClick = (type) => {
    setActiveType(type);
  };
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => handleClick('success')} style={{ marginRight: '8px' }}>Success</button>
        <button onClick={() => handleClick('error')} style={{ marginRight: '8px' }}>Error</button>
        <button onClick={() => handleClick('warning')} style={{ marginRight: '8px' }}>Warning</button>
        <button onClick={() => handleClick('info')} style={{ marginRight: '8px' }}>Info</button>
        <button onClick={() => handleClick('loading')} style={{ marginRight: '8px' }}>Loading</button>
      </div>
      
      <StatusAnimationHeadless.Root
        type={activeType || 'success'}
        active={activeType !== null}
        duration={1000}
        size={48}
        strokeWidth={3}
        circle={true}
        autoHide={true}
        autoHideDelay={2000}
        onComplete={() => console.log(`${activeType} animation completed!`)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StatusAnimationHeadless.Container>
            {activeType === 'success' && <StatusAnimationHeadless.Success />}
            {activeType === 'error' && <StatusAnimationHeadless.Error />}
            {activeType === 'warning' && <StatusAnimationHeadless.Warning />}
            {activeType === 'info' && <StatusAnimationHeadless.Info />}
            {activeType === 'loading' && <StatusAnimationHeadless.Loading />}
          </StatusAnimationHeadless.Container>
          
          <StatusAnimationHeadless.Text />
        </div>
      </StatusAnimationHeadless.Root>
    </div>
  );
}
```

## Creating a Form Submission Status Animation

```jsx
import { StatusAnimationHeadless } from 'pulseui';
import { useState } from 'react';

function FormWithStatusAnimation() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const [submissionStatus, setSubmissionStatus] = useState({
    type: null,
    active: false,
    message: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.name || !formState.email || !formState.message) {
      setSubmissionStatus({
        type: 'error',
        active: true,
        message: 'Please fill in all fields',
      });
      return;
    }
    
    // Show loading state
    setSubmissionStatus({
      type: 'loading',
      active: true,
      message: 'Submitting form...',
    });
    
    // Simulate API call
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes
      const success = Math.random() > 0.3;
      
      if (success) {
        setSubmissionStatus({
          type: 'success',
          active: true,
          message: 'Form submitted successfully!',
        });
        
        // Reset form
        setFormState({
          name: '',
          email: '',
          message: '',
        });
      } else {
        setSubmissionStatus({
          type: 'error',
          active: true,
          message: 'Failed to submit form. Please try again.',
        });
      }
    }, 1500);
  };
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Contact Form</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Name</label>
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Email</label>
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>Message</label>
          <textarea
            name="message"
            value={formState.message}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', minHeight: '100px' }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
          
          <StatusAnimationHeadless.Root
            type={submissionStatus.type}
            active={submissionStatus.active}
            duration={1000}
            size={24}
            strokeWidth={2}
            circle={true}
            autoHide={submissionStatus.type !== 'loading'}
            autoHideDelay={3000}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
              <StatusAnimationHeadless.Container>
                {submissionStatus.type === 'success' && <StatusAnimationHeadless.Success />}
                {submissionStatus.type === 'error' && <StatusAnimationHeadless.Error />}
                {submissionStatus.type === 'loading' && <StatusAnimationHeadless.Loading />}
              </StatusAnimationHeadless.Container>
              
              <div style={{ marginLeft: '8px' }}>
                {submissionStatus.message}
              </div>
            </div>
          </StatusAnimationHeadless.Root>
        </div>
      </form>
    </div>
  );
}
```

## Creating a Multi-Step Process Indicator

```jsx
import { StatusAnimationHeadless } from 'pulseui';
import { useState, useEffect } from 'react';

function ProcessStepIndicator({ step, status, title, description }) {
  return (
    <div style={{ display: 'flex', marginBottom: '16px' }}>
      <StatusAnimationHeadless.Root
        type={status}
        active={status !== null}
        duration={1000}
        size={32}
        strokeWidth={2}
        circle={true}
        backgroundColor={status === 'success' ? '#e8f5e9' : status === 'error' ? '#ffebee' : status === 'loading' ? '#e3f2fd' : '#f5f5f5'}
      >
        <StatusAnimationHeadless.Container
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '16px',
          }}
        >
          {status === 'success' && <StatusAnimationHeadless.Success />}
          {status === 'error' && <StatusAnimationHeadless.Error />}
          {status === 'loading' && <StatusAnimationHeadless.Loading />}
          {status === null && <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{step}</div>}
        </StatusAnimationHeadless.Container>
      </StatusAnimationHeadless.Root>
      
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{title}</div>
        <div style={{ color: '#666', fontSize: '14px' }}>{description}</div>
      </div>
    </div>
  );
}

function MultiStepProcess() {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState([
    { step: 1, status: 'loading', title: 'Validating Information', description: 'Checking your submitted information...' },
    { step: 2, status: null, title: 'Processing Payment', description: 'Securely processing your payment method.' },
    { step: 3, status: null, title: 'Generating Documents', description: 'Creating your personalized documents.' },
    { step: 4, status: null, title: 'Finalizing', description: 'Completing your request and sending confirmation.' },
  ]);
  
  useEffect(() => {
    // Simulate process flow
    const timers = [];
    
    // Step 1: Validating (2 seconds)
    timers.push(setTimeout(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[0].status = 'success';
        newSteps[1].status = 'loading';
        return newSteps;
      });
      setCurrentStep(2);
    }, 2000));
    
    // Step 2: Payment (3 seconds)
    timers.push(setTimeout(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[1].status = 'success';
        newSteps[2].status = 'loading';
        return newSteps;
      });
      setCurrentStep(3);
    }, 5000));
    
    // Step 3: Documents (2 seconds)
    timers.push(setTimeout(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[2].status = 'success';
        newSteps[3].status = 'loading';
        return newSteps;
      });
      setCurrentStep(4);
    }, 7000));
    
    // Step 4: Finalizing (2 seconds)
    timers.push(setTimeout(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[3].status = 'success';
        return newSteps;
      });
    }, 9000));
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2>Processing Your Order</h2>
      <p>Please wait while we process your order. This may take a few moments.</p>
      
      <div style={{ marginTop: '24px' }}>
        {steps.map((step, index) => (
          <ProcessStepIndicator
            key={index}
            step={step.step}
            status={step.status}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Step {currentStep} of {steps.length}
        </div>
        <div style={{ marginTop: '8px', height: '4px', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>
          <div
            style={{
              height: '100%',
              width: `${(currentStep / steps.length) * 100}%`,
              backgroundColor: '#2196f3',
              borderRadius: '2px',
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

## Creating a Notification System

```jsx
import { StatusAnimationHeadless } from 'pulseui';
import { useState, useEffect } from 'react';

function Notification({ type, message, onClose }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: type === 'success' ? '#e8f5e9' : type === 'error' ? '#ffebee' : type === 'warning' ? '#fff8e1' : type === 'info' ? '#e3f2fd' : '#f5f5f5',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '8px',
      }}
    >
      <StatusAnimationHeadless.Root
        type={type}
        active={true}
        duration={1000}
        size={24}
        strokeWidth={2}
      >
        <StatusAnimationHeadless.Container
          style={{
            marginRight: '12px',
          }}
        >
          {type === 'success' && <StatusAnimationHeadless.Success />}
          {type === 'error' && <StatusAnimationHeadless.Error />}
          {type === 'warning' && <StatusAnimationHeadless.Warning />}
          {type === 'info' && <StatusAnimationHeadless.Info />}
        </StatusAnimationHeadless.Container>
      </StatusAnimationHeadless.Root>
      
      <div style={{ flex: 1 }}>{message}</div>
      
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px',
          color: '#999',
        }}
      >
        ×
      </button>
    </div>
  );
}

function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => addNotification('success', 'Operation completed successfully!')} style={{ marginRight: '8px' }}>
          Success
        </button>
        <button onClick={() => addNotification('error', 'An error occurred. Please try again.')} style={{ marginRight: '8px' }}>
          Error
        </button>
        <button onClick={() => addNotification('warning', 'Warning: This action cannot be undone.')} style={{ marginRight: '8px' }}>
          Warning
        </button>
        <button onClick={() => addNotification('info', 'New features are available. Check them out!')} style={{ marginRight: '8px' }}>
          Info
        </button>
      </div>
      
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '300px',
          zIndex: 1000,
        }}
      >
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

## API

### StatusAnimationHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` | `'success'` | Type of status animation |
| `active` | `boolean` | `false` | Whether the animation is active |
| `duration` | `number` | `1000` | Duration of the animation in milliseconds |
| `size` | `number` | `48` | Size of the animation in pixels |
| `strokeWidth` | `number` | `3` | Stroke width of the animation |
| `color` | `string` | - | Color of the animation (defaults based on type) |
| `backgroundColor` | `string` | `'transparent'` | Background color of the animation |
| `circle` | `boolean` | `true` | Whether to show the animation in a circle |
| `once` | `boolean` | `false` | Whether to play the animation only once |
| `onComplete` | `() => void` | - | Callback when the animation completes |
| `autoHide` | `boolean` | `false` | Whether to auto-hide the animation after completion |
| `autoHideDelay` | `number` | `2000` | Delay before auto-hiding in milliseconds |

### Other Components

- `StatusAnimationHeadless.Container`: Container for the status animation
- `StatusAnimationHeadless.SVG`: SVG element for the status animation
- `StatusAnimationHeadless.Path`: Path element for the status animation
- `StatusAnimationHeadless.Success`: Success animation component
- `StatusAnimationHeadless.Error`: Error animation component
- `StatusAnimationHeadless.Warning`: Warning animation component
- `StatusAnimationHeadless.Info`: Info animation component
- `StatusAnimationHeadless.Loading`: Loading animation component
- `StatusAnimationHeadless.Text`: Text component for the status animation
- `StatusAnimationHeadless.Trigger`: Button to trigger the status animation

### useStatusAnimation Hook

For even more control, you can use the `useStatusAnimation` hook directly:

```jsx
import { useStatusAnimation } from 'pulseui';

function MyCustomStatusAnimation() {
  const {
    type,
    active,
    setActive,
    duration,
    size,
    strokeWidth,
    color,
    backgroundColor,
    circle,
    once,
    visible,
    setVisible,
    completed,
    setCompleted,
    start,
    stop,
    reset,
    getContainerProps,
    getSvgProps,
    getPathData,
    getAnimationStyle,
  } = useStatusAnimation({
    type: 'success',
    active: false,
    duration: 1000,
    size: 48,
    strokeWidth: 3,
    color: '#4caf50',
    backgroundColor: 'transparent',
    circle: true,
    once: false,
    onComplete: () => console.log('Animation complete!'),
    autoHide: false,
    autoHideDelay: 2000,
  });
  
  // Custom implementation
}
```

## Accessibility

The Status Animation component follows accessibility best practices:

- The status animation container has `role="status"` to notify screen readers of status information
- The status animation has `aria-live="polite"` to announce changes in a non-intrusive way
- The status animation has `aria-atomic="true"` to ensure the entire status message is announced
