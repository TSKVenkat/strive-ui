# Headless Button

The Headless Button component is a flexible and customizable button that provides all the functionality without any styling. It follows the headless component architecture, separating logic from presentation and allowing developers to provide their own styling while benefiting from the built-in functionality.

## Features

- Fully customizable styling
- Accessibility support
- Keyboard navigation
- State management (pressed, focused, hovered, loading, disabled)
- Polymorphic (can render as any HTML element or React component)
- Support for link buttons (with href, target, rel)

## Installation

```jsx
import { ButtonHeadless } from 'pulseui';
```

## Usage

### Basic Usage

```jsx
import { ButtonHeadless } from 'pulseui';

function MyComponent() {
  return (
    <ButtonHeadless
      onClick={() => console.log('Button clicked!')}
      style={{
        padding: '8px 16px',
        backgroundColor: 'blue',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
      }}
    >
      Click Me
    </ButtonHeadless>
  );
}
```

### Styled with styled-components

```jsx
import { ButtonHeadless } from 'pulseui';
import styled from 'styled-components';

const PrimaryButton = styled(ButtonHeadless)`
  background-color: ${props => props['data-disabled'] ? '#6c8eef' : props['data-hovered'] ? '#3e6ae1' : '#4a75e6'};
  color: white;
  padding: ${props => props['data-pressed'] ? '9px 15px 7px 17px' : '8px 16px'};
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: ${props => props['data-disabled'] ? 'not-allowed' : 'pointer'};
  opacity: ${props => props['data-disabled'] ? 0.7 : 1};
  transition: all 0.2s ease;
  transform: ${props => props['data-pressed'] ? 'scale(0.98)' : 'scale(1)'};
`;

function MyComponent() {
  return (
    <PrimaryButton onClick={() => console.log('Button clicked!')}>
      Primary Button
    </PrimaryButton>
  );
}
```

### Loading State

```jsx
import { ButtonHeadless } from 'pulseui';
import styled from 'styled-components';
import { useState } from 'react';

const LoadingButton = styled(ButtonHeadless)`
  background-color: #4a75e6;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  min-width: 120px;
  position: relative;
  
  &::before {
    content: '';
    display: ${props => props['data-loading'] ? 'block' : 'none'};
    position: absolute;
    top: 50%;
    left: 12px;
    width: 16px;
    height: 16px;
    margin-top: -8px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };
  
  return (
    <LoadingButton 
      onClick={handleClick} 
      loading={isLoading}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Submit'}
    </LoadingButton>
  );
}
```

### Link Button

```jsx
import { ButtonHeadless } from 'pulseui';
import styled from 'styled-components';

const LinkButton = styled(ButtonHeadless)`
  color: ${props => props['data-hovered'] ? '#3e6ae1' : '#4a75e6'};
  text-decoration: none;
  padding: 8px 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transform: ${props => props['data-hovered'] ? 'scaleX(1)' : 'scaleX(0)'};
    transform-origin: left;
    transition: transform 0.3s ease;
  }
`;

function MyComponent() {
  return (
    <LinkButton 
      href="https://example.com" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      Visit Website
    </LinkButton>
  );
}
```

### Polymorphic Usage

```jsx
import { ButtonHeadless } from 'pulseui';
import styled from 'styled-components';

const CardButton = styled(ButtonHeadless)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: ${props => props['data-hovered'] ? '#f5f5f5' : 'white'};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 200px;
  cursor: pointer;
  transition: all 0.2s ease;
`;

function MyComponent() {
  return (
    <CardButton 
      as="div" 
      onClick={() => console.log('Card clicked!')}
    >
      <h3>Feature Card</h3>
      <p>Click this card to activate this feature</p>
    </CardButton>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `loading` | `boolean` | `false` | Whether the button is in loading state |
| `onClick` | `(event: React.MouseEvent<HTMLButtonElement \| HTMLAnchorElement>) => void` | - | Callback when the button is clicked |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Type of the button |
| `href` | `string` | - | URL for link buttons |
| `target` | `string` | - | Target for link buttons |
| `rel` | `string` | - | Rel attribute for link buttons |
| `ariaLabel` | `string` | - | Aria-label for accessibility |
| `as` | `React.ElementType` | `'button'` or `'a'` | Element type to render as |
| `children` | `React.ReactNode` | Required | Content of the button |
| `className` | `string` | - | Custom class name |
| `style` | `React.CSSProperties` | - | Custom inline styles |

## Data Attributes

The component provides the following data attributes that can be used for styling based on the button's state:

| Attribute | Type | Description |
|-----------|------|-------------|
| `data-pressed` | `boolean` | Whether the button is currently pressed |
| `data-focused` | `boolean` | Whether the button is currently focused |
| `data-hovered` | `boolean` | Whether the button is currently hovered |
| `data-loading` | `boolean` | Whether the button is currently loading |
| `data-disabled` | `boolean` | Whether the button is disabled |

## Accessibility

The Headless Button component follows accessibility best practices:

- Proper role attributes for buttons and links
- Keyboard navigation support (Enter and Space keys)
- Proper focus management
- ARIA attributes for disabled state
- Support for aria-label

## Examples

### Different Button Types

```jsx
import { ButtonHeadless } from 'pulseui';
import styled from 'styled-components';

const ButtonBase = styled(ButtonHeadless)`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: ${props => props['data-disabled'] ? 'not-allowed' : 'pointer'};
  opacity: ${props => props['data-disabled'] ? 0.7 : 1};
  transition: all 0.2s ease;
`;

const PrimaryBtn = styled(ButtonBase)`
  background-color: ${props => props['data-hovered'] ? '#3e6ae1' : '#4a75e6'};
  color: white;
`;

const SecondaryBtn = styled(ButtonBase)`
  background-color: ${props => props['data-hovered'] ? '#e6e6e6' : '#f2f2f2'};
  color: #333;
`;

const DangerBtn = styled(ButtonBase)`
  background-color: ${props => props['data-hovered'] ? '#d32f2f' : '#f44336'};
  color: white;
`;

function MyComponent() {
  return (
    <div>
      <PrimaryBtn onClick={() => console.log('Primary clicked')}>Primary</PrimaryBtn>
      <SecondaryBtn onClick={() => console.log('Secondary clicked')}>Secondary</SecondaryBtn>
      <DangerBtn onClick={() => console.log('Danger clicked')}>Danger</DangerBtn>
    </div>
  );
}
```

### Icon Button

```jsx
import { ButtonHeadless } from 'pulseui';
import styled from 'styled-components';

const IconButton = styled(ButtonHeadless)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props['data-hovered'] ? '#f5f5f5' : 'transparent'};
  color: #333;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

function MyComponent() {
  return (
    <IconButton 
      onClick={() => console.log('Icon clicked')}
      ariaLabel="Add to favorites"
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
      </svg>
    </IconButton>
  );
}
```

## Using the useButton Hook Directly

For even more customization, you can use the `useButton` hook directly:

```jsx
import { useButton } from 'pulseui';

function CustomButton({ onClick, disabled, children }) {
  const { 
    buttonProps, 
    isPressed, 
    isFocused, 
    isHovered, 
    isLoading, 
    isDisabled 
  } = useButton({
    onClick,
    disabled
  });
  
  return (
    <button 
      {...buttonProps} 
      className={`custom-button ${isPressed ? 'pressed' : ''} ${isHovered ? 'hovered' : ''}`}
    >
      {children}
    </button>
  );
}
```
