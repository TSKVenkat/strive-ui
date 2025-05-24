# TextareaHeadless

A headless textarea component that provides all the functionality without any styling. This component can be used as a base for creating custom styled textarea implementations.

## Features

- Supports both controlled and uncontrolled modes
- Auto-resize capability
- Character and word counting
- Clear functionality
- Compound component API for flexible customization
- Polymorphic components (can render as any HTML element or React component)
- Fully accessible with proper ARIA attributes
- Focus management

## Installation

```bash
npm install @strive-ui/textarea
```

## Usage

### Basic Usage

```jsx
import { Textarea } from '@strive-ui/textarea';

function MyComponent() {
  return (
    <Textarea 
      label="Comments" 
      placeholder="Enter your comments here..."
      rows={4}
    />
  );
}
```

### Controlled Textarea

```jsx
import { useState } from 'react';
import { Textarea } from '@strive-ui/textarea';

function ControlledTextarea() {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <p>Character count: {value.length}</p>
      <Textarea 
        label="Bio" 
        value={value} 
        onChange={(newValue) => setValue(newValue)}
        placeholder="Tell us about yourself"
      />
    </div>
  );
}
```

### Auto-resize Textarea

```jsx
import { Textarea } from '@strive-ui/textarea';

function AutoResizeTextarea() {
  return (
    <Textarea 
      label="Description" 
      placeholder="Enter a description..."
      autoResize
      minHeight={100}
      maxHeight={300}
    />
  );
}
```

### Character Count

```jsx
import { Textarea } from '@strive-ui/textarea';

function TextareaWithCount() {
  return (
    <Textarea 
      label="Tweet" 
      placeholder="What's happening?"
      maxLength={280}
      showCount
    />
  );
}
```

### Word Count

```jsx
import { Textarea } from '@strive-ui/textarea';

function TextareaWithWordCount() {
  return (
    <Textarea 
      label="Essay" 
      placeholder="Write your essay here..."
      showCount
      countType="words"
    />
  );
}
```

### With Clear Button

```jsx
import { Textarea } from '@strive-ui/textarea';

function TextareaWithClear() {
  return (
    <Textarea label="Notes">
      <div style={{ position: 'relative' }}>
        <Textarea.Label>Notes</Textarea.Label>
        <Textarea.Field placeholder="Enter your notes here..." />
        <div style={{ position: 'absolute', top: '0', right: '0', padding: '8px' }}>
          <Textarea.ClearButton />
        </div>
      </div>
    </Textarea>
  );
}
```

### Custom Styling with Compound Components

```jsx
import { Textarea } from '@strive-ui/textarea';

function CustomTextarea() {
  return (
    <Textarea>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Textarea.Label style={{ 
          fontWeight: 500,
          color: '#374151',
        }}>
          Feedback
        </Textarea.Label>
        
        <Textarea.Field style={{ 
          padding: '8px 12px',
          border: '1px solid #D1D5DB',
          borderRadius: '4px',
          fontSize: '14px',
          lineHeight: '1.5',
          resize: 'vertical',
          minHeight: '100px',
        }} 
        placeholder="Please provide your feedback..."
        />
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '4px',
          fontSize: '12px',
          color: '#6B7280',
        }}>
          <Textarea.Count />
          <Textarea.ClearButton style={{
            background: 'none',
            border: 'none',
            color: '#6B7280',
            cursor: 'pointer',
            padding: '0',
          }}>
            Clear
          </Textarea.ClearButton>
        </div>
      </div>
    </Textarea>
  );
}
```

### Styling with Tailwind CSS

```jsx
import { Textarea } from '@strive-ui/textarea';

function TailwindTextarea() {
  return (
    <Textarea className="space-y-2">
      <Textarea.Label className="block text-sm font-medium text-gray-700">
        Message
      </Textarea.Label>
      
      <div className="relative">
        <Textarea.Field 
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm resize-none"
          placeholder="Type your message here..."
          rows={4}
        />
        
        <div className="absolute top-0 right-0 p-2">
          <Textarea.ClearButton className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </Textarea.ClearButton>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Textarea.Count className="text-xs text-gray-500" />
      </div>
    </Textarea>
  );
}
```

### Styling with Styled Components

```jsx
import styled from 'styled-components';
import { Textarea } from '@strive-ui/textarea';

const StyledTextarea = styled(Textarea)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledLabel = styled(Textarea.Label)`
  font-weight: 500;
  color: #374151;
`;

const StyledField = styled(Textarea.Field)`
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #6366F1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
  
  &:disabled {
    background-color: #F3F4F6;
    cursor: not-allowed;
  }
`;

const StyledCount = styled(Textarea.Count)`
  font-size: 12px;
  color: #6B7280;
  align-self: flex-end;
`;

const StyledClearButton = styled(Textarea.ClearButton)`
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #4B5563;
  }
`;

function StyledComponentsTextarea() {
  return (
    <StyledTextarea>
      <StyledLabel>Message</StyledLabel>
      <StyledField placeholder="Type your message here..." rows={4} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <StyledClearButton>Clear</StyledClearButton>
        <StyledCount />
      </div>
    </StyledTextarea>
  );
}
```

### Styling with CSS Modules

```jsx
// Textarea.module.css
.container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-weight: 500;
  color: #374151;
}

.field {
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
}

.field:focus {
  outline: none;
  border-color: #6366F1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.field::placeholder {
  color: #9CA3AF;
}

.field:disabled {
  background-color: #F3F4F6;
  cursor: not-allowed;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.count {
  font-size: 12px;
  color: #6B7280;
}

.clearButton {
  background: none;
  border: none;
  color: #6B7280;
  cursor: pointer;
  padding: 0;
}

.clearButton:hover {
  color: #4B5563;
}
```

```jsx
import styles from './Textarea.module.css';
import { Textarea } from '@strive-ui/textarea';

function CSSModulesTextarea() {
  return (
    <Textarea className={styles.container}>
      <Textarea.Label className={styles.label}>Message</Textarea.Label>
      <Textarea.Field className={styles.field} placeholder="Type your message here..." rows={4} />
      <div className={styles.footer}>
        <Textarea.ClearButton className={styles.clearButton}>Clear</Textarea.ClearButton>
        <Textarea.Count className={styles.count} />
      </div>
    </Textarea>
  );
}
```

### Using the Render Prop Pattern

```jsx
import { Textarea } from '@strive-ui/textarea';

function RenderPropTextarea() {
  return (
    <Textarea showCount>
      {({ value, charCount, wordCount, clear, focused }) => (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          padding: focused ? '8px' : '0',
          border: focused ? '1px solid #E5E7EB' : 'none',
          borderRadius: '4px',
          transition: 'padding 0.2s, border 0.2s',
        }}>
          <Textarea.Label>Message</Textarea.Label>
          
          <Textarea.Field 
            placeholder="Type your message here..."
            rows={4}
            style={{
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
              fontSize: '14px',
              lineHeight: '1.5',
              resize: 'vertical',
            }}
          />
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#6B7280',
          }}>
            <div>
              <span>Characters: {charCount}</span>
              <span style={{ marginLeft: '8px' }}>Words: {wordCount}</span>
            </div>
            
            {value && (
              <button 
                onClick={clear}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: '0',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </Textarea>
  );
}
```

## API Reference

### Textarea (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | string | '' | Default value (uncontrolled) |
| value | string | - | Controlled value |
| onChange | (value: string, event: ChangeEvent) => void | - | Callback when value changes |
| onFocus | (event: FocusEvent) => void | - | Callback when textarea is focused |
| onBlur | (event: FocusEvent) => void | - | Callback when textarea is blurred |
| disabled | boolean | false | Whether the textarea is disabled |
| readOnly | boolean | false | Whether the textarea is read-only |
| required | boolean | false | Whether the textarea is required |
| placeholder | string | - | Placeholder text |
| maxLength | number | - | Maximum number of characters allowed |
| minLength | number | - | Minimum number of characters required |
| name | string | - | Name attribute for the textarea |
| id | string | auto-generated | ID for the textarea element |
| autoFocus | boolean | false | Whether to automatically focus the textarea on mount |
| rows | number | 3 | Number of rows to display |
| cols | number | - | Number of columns to display |
| autoResize | boolean | false | Whether to automatically resize the textarea based on content |
| minHeight | number | - | Minimum height of the textarea in pixels (for autoResize) |
| maxHeight | number | - | Maximum height of the textarea in pixels (for autoResize) |
| showCount | boolean | false | Whether to show the character count |
| countType | 'characters' \| 'words' | 'characters' | Whether to count characters or words |
| label | string | - | Label text for the textarea |
| children | ReactNode \| RenderFunction | - | Children to render inside the component |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |

### Textarea.Field

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'textarea' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | TextareaHTMLAttributes | - | All other props are passed to the underlying textarea element |

### Textarea.Label

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'label' | Element or component to render as |
| children | ReactNode | - | Children to render inside the label |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | LabelHTMLAttributes | - | All other props are passed to the underlying label element |

### Textarea.Count

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'characters' \| 'words' | 'characters' | Type of count to display |
| format | (current: number, max?: number) => ReactNode | - | Custom format for the count display |
| as | ElementType | 'div' | Element or component to render as |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | HTMLAttributes | - | All other props are passed to the underlying element |

### Textarea.ClearButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| as | ElementType | 'button' | Element or component to render as |
| children | ReactNode | - | Children to render inside the clear button |
| className | string | - | Custom class name |
| style | CSSProperties | - | Custom styles |
| ...rest | ButtonHTMLAttributes | - | All other props are passed to the underlying button element |

## Accessibility

The TextareaHeadless component follows the WAI-ARIA textarea pattern and includes the following accessibility features:

- Proper ARIA attributes (`aria-disabled`, `aria-readonly`, `aria-required`, `aria-invalid`)
- Focus management
- Label association with the textarea element
- Character count with `aria-live="polite"` for screen readers

## Hooks

### useTextarea

If you need more control, you can use the `useTextarea` hook directly:

```jsx
import { useTextarea } from '@strive-ui/textarea';

function MyCustomTextarea() {
  const { 
    value,
    disabled,
    readOnly,
    required,
    focused,
    charCount,
    wordCount,
    id,
    textareaRef,
    setValue,
    clear,
    focus,
    blur,
    getTextareaProps,
    getLabelProps,
  } = useTextarea({
    defaultValue: '',
    disabled: false,
    readOnly: false,
    required: false,
    placeholder: 'Enter text here...',
    rows: 4,
    autoResize: true,
    showCount: true,
  });
  
  return (
    <div>
      <label {...getLabelProps()}>Custom textarea</label>
      <textarea {...getTextareaProps()} />
      <div>Character count: {charCount}</div>
      <button onClick={clear}>Clear</button>
    </div>
  );
}
```
