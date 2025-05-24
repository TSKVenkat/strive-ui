# PasswordInputHeadless

A headless implementation of a password input component that provides all the functionality without any styling. This component extends the TextInput with password-specific features like visibility toggle, strength indicator, and requirements validation.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with proper ARIA attributes
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Password visibility toggle**: Show/hide password functionality
- **Password strength meter**: Built-in strength calculation
- **Requirements validation**: Customizable password requirements
- **Controlled & uncontrolled modes**: Works with both controlled and uncontrolled inputs

## Basic Usage

### With Regular CSS

```jsx
import { PasswordInput } from 'strive-ui';
import './styles.css'; // Your CSS file

function BasicPasswordInput() {
  return (
    <PasswordInput 
      label="Password" 
      placeholder="Enter your password"
      showStrengthIndicator
      showRequirements
      className="password-container"
    >
      <PasswordInput.Label className="password-label" />
      <div className="password-field-wrapper">
        <PasswordInput.Field className="password-field" />
        <PasswordInput.Toggle className="password-toggle" />
        <PasswordInput.ClearButton className="password-clear" />
      </div>
      <PasswordInput.StrengthIndicator className="password-strength" />
      <PasswordInput.Requirements className="password-requirements" />
    </PasswordInput>
  );
}

// In styles.css
/*
.password-container {
  margin-bottom: 16px;
}

.password-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.password-field-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-field {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.password-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.password-toggle {
  position: absolute;
  right: 32px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.password-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.password-strength {
  margin-top: 8px;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.password-strength[data-strength="0"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 20%;
  background-color: #ef4444;
}

.password-strength[data-strength="1"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 40%;
  background-color: #f97316;
}

.password-strength[data-strength="2"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 60%;
  background-color: #eab308;
}

.password-strength[data-strength="3"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 80%;
  background-color: #22c55e;
}

.password-strength[data-strength="4"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 100%;
  background-color: #16a34a;
}

.password-requirements {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.password-requirements ul {
  list-style: none;
  padding-left: 0;
}

.password-requirements li {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.password-requirements li[data-met="true"]::before {
  content: "✓";
  color: #16a34a;
  margin-right: 4px;
}

.password-requirements li[data-met="false"]::before {
  content: "✗";
  color: #ef4444;
  margin-right: 4px;
}
*/
```

### With Tailwind CSS

```jsx
import { PasswordInput } from 'strive-ui';

function TailwindPasswordInput() {
  return (
    <PasswordInput 
      label="Create Password" 
      placeholder="Enter a strong password"
      showStrengthIndicator
      showRequirements
      className="mb-4"
    >
      <PasswordInput.Label className="block mb-2 text-sm font-medium text-gray-700" />
      <div className="relative">
        <PasswordInput.Field className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          <PasswordInput.Toggle className="text-sm text-gray-500 hover:text-gray-700">
            {isVisible => (
              <span className="flex items-center">
                {isVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </span>
            )}
          </PasswordInput.Toggle>
          <PasswordInput.ClearButton className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </PasswordInput.ClearButton>
        </div>
      </div>
      
      <PasswordInput.StrengthIndicator className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
        {strength => (
          <div 
            className={`h-full ${
              strength === 0 ? 'w-1/5 bg-red-500' : 
              strength === 1 ? 'w-2/5 bg-orange-500' : 
              strength === 2 ? 'w-3/5 bg-yellow-500' : 
              strength === 3 ? 'w-4/5 bg-green-500' : 
              'w-full bg-green-600'
            }`}
          />
        )}
      </PasswordInput.StrengthIndicator>
      
      <div className="mt-1 text-xs text-gray-500">
        <PasswordInput.StrengthIndicator>
          {strength => (
            <span>
              Password strength: {
                strength === 0 ? 'Very Weak' : 
                strength === 1 ? 'Weak' : 
                strength === 2 ? 'Medium' : 
                strength === 3 ? 'Strong' : 
                'Very Strong'
              }
            </span>
          )}
        </PasswordInput.StrengthIndicator>
      </div>
      
      <PasswordInput.Requirements className="mt-2 text-xs text-gray-500">
        {requirementsMet => (
          <ul className="space-y-1">
            <li className={`flex items-center ${requirementsMet.minLength ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-1">{requirementsMet.minLength ? '✓' : '✗'}</span>
              At least 8 characters
            </li>
            <li className={`flex items-center ${requirementsMet.hasUppercase ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-1">{requirementsMet.hasUppercase ? '✓' : '✗'}</span>
              At least one uppercase letter
            </li>
            <li className={`flex items-center ${requirementsMet.hasLowercase ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-1">{requirementsMet.hasLowercase ? '✓' : '✗'}</span>
              At least one lowercase letter
            </li>
            <li className={`flex items-center ${requirementsMet.hasNumbers ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-1">{requirementsMet.hasNumbers ? '✓' : '✗'}</span>
              At least one number
            </li>
            <li className={`flex items-center ${requirementsMet.hasSpecialChars ? 'text-green-600' : 'text-red-500'}`}>
              <span className="mr-1">{requirementsMet.hasSpecialChars ? '✓' : '✗'}</span>
              At least one special character
            </li>
          </ul>
        )}
      </PasswordInput.Requirements>
    </PasswordInput>
  );
}
```

### With styled-components

```jsx
import { PasswordInput } from 'strive-ui';
import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 16px;
`;

const Label = styled(PasswordInput.Label)`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled(PasswordInput.Field)`
  width: 100%;
  padding: 8px 12px;
  padding-right: 64px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
`;

const ToggleButton = styled(PasswordInput.Toggle)`
  position: absolute;
  right: 32px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #1f2937;
  }
  
  &:disabled {
    color: #d1d5db;
    cursor: not-allowed;
  }
`;

const ClearButton = styled(PasswordInput.ClearButton)`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  
  &:hover {
    color: #1f2937;
  }
  
  &:disabled {
    color: #d1d5db;
    cursor: not-allowed;
  }
`;

const StrengthMeter = styled(PasswordInput.StrengthIndicator)`
  margin-top: 8px;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  
  &::before {
    content: "";
    display: block;
    height: 100%;
    width: ${props => (props['data-strength'] + 1) * 20}%;
    background-color: ${props => 
      props['data-strength'] === 0 ? '#ef4444' : 
      props['data-strength'] === 1 ? '#f97316' : 
      props['data-strength'] === 2 ? '#eab308' : 
      props['data-strength'] === 3 ? '#22c55e' : 
      '#16a34a'
    };
  }
`;

const RequirementsList = styled(PasswordInput.Requirements)`
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  
  ul {
    list-style: none;
    padding-left: 0;
  }
  
  li {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
  }
  
  li[data-met="true"] {
    color: #16a34a;
  }
  
  li[data-met="true"]::before {
    content: "✓";
    margin-right: 4px;
  }
  
  li[data-met="false"] {
    color: #ef4444;
  }
  
  li[data-met="false"]::before {
    content: "✗";
    margin-right: 4px;
  }
`;

function StyledPasswordInput() {
  return (
    <PasswordInput 
      label="Create Password" 
      placeholder="Enter a strong password"
      showStrengthIndicator
      showRequirements
      as={Container}
    >
      <Label />
      <InputWrapper>
        <Input />
        <ToggleButton />
        <ClearButton />
      </InputWrapper>
      <StrengthMeter />
      <RequirementsList />
    </PasswordInput>
  );
}
```

### With CSS Modules

```jsx
import { PasswordInput } from 'strive-ui';
import styles from './PasswordInput.module.css';

function CSSModulesPasswordInput() {
  return (
    <PasswordInput 
      label="Password" 
      placeholder="Enter your password"
      showStrengthIndicator
      showRequirements
      className={styles.container}
    >
      <PasswordInput.Label className={styles.label} />
      <div className={styles.inputWrapper}>
        <PasswordInput.Field className={styles.input} />
        <PasswordInput.Toggle className={styles.toggle} />
        <PasswordInput.ClearButton className={styles.clear} />
      </div>
      <PasswordInput.StrengthIndicator className={styles.strength} />
      <PasswordInput.Requirements className={styles.requirements} />
    </PasswordInput>
  );
}

// In PasswordInput.module.css
/*
.container {
  margin-bottom: 16px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.inputWrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: 8px 12px;
  padding-right: 64px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.toggle {
  position: absolute;
  right: 32px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.toggle:hover {
  color: #1f2937;
}

.clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.clear:hover {
  color: #1f2937;
}

.strength {
  margin-top: 8px;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength[data-strength="0"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 20%;
  background-color: #ef4444;
}

.strength[data-strength="1"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 40%;
  background-color: #f97316;
}

.strength[data-strength="2"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 60%;
  background-color: #eab308;
}

.strength[data-strength="3"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 80%;
  background-color: #22c55e;
}

.strength[data-strength="4"]::before {
  content: "";
  display: block;
  height: 100%;
  width: 100%;
  background-color: #16a34a;
}

.requirements {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.requirements ul {
  list-style: none;
  padding-left: 0;
}

.requirements li {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

.requirements li[data-met="true"]::before {
  content: "✓";
  color: #16a34a;
  margin-right: 4px;
}

.requirements li[data-met="false"]::before {
  content: "✗";
  color: #ef4444;
  margin-right: 4px;
}
*/
```

## Advanced Usage

### With Custom Requirements

```jsx
import { PasswordInput } from 'strive-ui';

function CustomRequirementsPasswordInput() {
  return (
    <div className="max-w-md mx-auto">
      <PasswordInput 
        label="Create Password" 
        placeholder="Enter your password"
        showStrengthIndicator
        showRequirements
        requirements={{
          minLength: 10,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false,
        }}
        className="space-y-2"
      >
        <PasswordInput.Label className="block text-sm font-medium text-gray-700" />
        <div className="relative rounded-md shadow-sm">
          <PasswordInput.Field className="block w-full pr-16 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <PasswordInput.Toggle className="p-1 text-gray-400 hover:text-gray-600">
              {isVisible => (
                isVisible ? 'Hide' : 'Show'
              )}
            </PasswordInput.Toggle>
            <PasswordInput.ClearButton className="p-1 mr-2 text-gray-400 hover:text-gray-600">
              ✕
            </PasswordInput.ClearButton>
          </div>
        </div>
        
        <PasswordInput.StrengthIndicator>
          {strength => (
            <div className="flex items-center space-x-2">
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    strength === 0 ? 'w-1/5 bg-red-500' : 
                    strength === 1 ? 'w-2/5 bg-orange-500' : 
                    strength === 2 ? 'w-3/5 bg-yellow-500' : 
                    strength === 3 ? 'w-4/5 bg-green-500' : 
                    'w-full bg-green-600'
                  }`}
                />
              </div>
              <span className="text-xs text-gray-500">
                {
                  strength === 0 ? 'Very Weak' : 
                  strength === 1 ? 'Weak' : 
                  strength === 2 ? 'Medium' : 
                  strength === 3 ? 'Strong' : 
                  'Very Strong'
                }
              </span>
            </div>
          )}
        </PasswordInput.StrengthIndicator>
        
        <PasswordInput.Requirements className="text-sm text-gray-500">
          {requirementsMet => (
            <div className="p-3 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Password must have:</h4>
              <ul className="space-y-1">
                <li className={requirementsMet.minLength ? 'text-green-600' : 'text-gray-500'}>
                  {requirementsMet.minLength ? '✅' : '⬜'} At least 10 characters
                </li>
                <li className={requirementsMet.hasUppercase ? 'text-green-600' : 'text-gray-500'}>
                  {requirementsMet.hasUppercase ? '✅' : '⬜'} At least one uppercase letter
                </li>
                <li className={requirementsMet.hasLowercase ? 'text-green-600' : 'text-gray-500'}>
                  {requirementsMet.hasLowercase ? '✅' : '⬜'} At least one lowercase letter
                </li>
                <li className={requirementsMet.hasNumbers ? 'text-green-600' : 'text-gray-500'}>
                  {requirementsMet.hasNumbers ? '✅' : '⬜'} At least one number
                </li>
              </ul>
            </div>
          )}
        </PasswordInput.Requirements>
      </PasswordInput>
    </div>
  );
}
```

## Props

### PasswordInput

Inherits all props from TextInput plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| minStrength | number | 0 | Minimum password strength (0-4) |
| showStrengthIndicator | boolean | false | Whether to show password strength indicator |
| showRequirements | boolean | false | Whether to show password requirements |
| requirements | object | { minLength: 8, requireUppercase: true, requireLowercase: true, requireNumbers: true, requireSpecialChars: true } | Custom password requirements |

### PasswordInput.Label

Same as TextInput.Label

### PasswordInput.Field

Same as TextInput.Field

### PasswordInput.Toggle

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode \| (isVisible: boolean) => React.ReactNode | 'Show'/'Hide' | Children to render |
| className | string | - | Custom class name |
| style | object | - | Custom styles |
| as | React.ElementType | 'button' | Element type to render as |

### PasswordInput.StrengthIndicator

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode \| (strength: number) => React.ReactNode | Strength label | Children to render |
| className | string | - | Custom class name |
| style | object | - | Custom styles |
| as | React.ElementType | 'div' | Element type to render as |

### PasswordInput.Requirements

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode \| (requirementsMet: object) => React.ReactNode | Default list | Children to render |
| className | string | - | Custom class name |
| style | object | - | Custom styles |
| as | React.ElementType | 'div' | Element type to render as |

### PasswordInput.ClearButton

Same as TextInput.ClearButton

## Accessibility

The PasswordInputHeadless component includes several accessibility features:

- Proper label association using htmlFor/id
- ARIA attributes for disabled, required, and readonly states
- Toggle button with appropriate aria-label and aria-pressed
- Strength indicator with role="meter" and appropriate aria attributes
- Focus management
- Clear button with appropriate aria-label
