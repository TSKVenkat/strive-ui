# ThumbsRatingHeadless

A headless thumbs up/down rating component that provides all the functionality for binary feedback without enforcing any specific styling.

## Features

- Simple thumbs up/down rating system
- Customizable thumbs size
- Configurable active and inactive colors
- Option to clear selection
- Fully accessible

## Usage

### Basic Usage

```jsx
import { ThumbsRating } from '@strive-ui/thumbs-rating';

function MyComponent() {
  return (
    <ThumbsRating 
      label="Was this helpful?" 
      defaultValue={null}
    />
  );
}
```

### Controlled Thumbs Rating

```jsx
import { useState } from 'react';
import { ThumbsRating } from '@strive-ui/thumbs-rating';

function ControlledThumbsRating() {
  const [value, setValue] = useState(null);
  
  return (
    <div>
      <p>Your feedback: {value === 'up' ? 'Helpful' : value === 'down' ? 'Not helpful' : 'No feedback'}</p>
      <ThumbsRating 
        value={value} 
        onChange={setValue}
      />
    </div>
  );
}
```

### Custom Colors

```jsx
import { ThumbsRating } from '@strive-ui/thumbs-rating';

function ColoredThumbsRating() {
  return (
    <ThumbsRating 
      defaultValue={null}
      activeColor="#4CAF50"   // Green color for active thumbs
      inactiveColor="#9E9E9E" // Gray for inactive thumbs
    />
  );
}
```

### Custom Size

```jsx
import { ThumbsRating } from '@strive-ui/thumbs-rating';

function LargeThumbsRating() {
  return (
    <ThumbsRating 
      defaultValue={null}
      size="lg"  // Large thumbs
    />
  );
}
```

### Disabled State

```jsx
import { ThumbsRating } from '@strive-ui/thumbs-rating';

function DisabledThumbsRating() {
  return (
    <ThumbsRating 
      defaultValue="up"
      disabled
    />
  );
}
```

### Read-Only State

```jsx
import { ThumbsRating } from '@strive-ui/thumbs-rating';

function ReadOnlyThumbsRating() {
  return (
    <ThumbsRating 
      defaultValue="up"
      readOnly
    />
  );
}
```

### Custom Labels

```jsx
import { ThumbsRating } from '@strive-ui/thumbs-rating';

function CustomLabelThumbsRating() {
  return (
    <ThumbsRating 
      defaultValue={null}
      upLabel="I like this"
      downLabel="I don't like this"
    />
  );
}
```

### Custom Styling

```jsx
import { ThumbsRating } from '@strive-ui/thumbs-rating';

function CustomStyledThumbsRating() {
  return (
    <div>
      <p>Was this article helpful?</p>
      <ThumbsRating>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <ThumbsRating.ThumbsUp 
            style={{ 
              padding: '8px', 
              borderRadius: '50%',
              transition: 'background-color 0.2s',
              backgroundColor: 'transparent',
              ':hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#4CAF50">
              <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
            </svg>
            <span style={{ marginLeft: '4px' }}>Yes</span>
          </ThumbsRating.ThumbsUp>
          
          <ThumbsRating.ThumbsDown
            style={{ 
              padding: '8px', 
              borderRadius: '50%',
              transition: 'background-color 0.2s',
              backgroundColor: 'transparent',
              ':hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
              }
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#F44336">
              <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
            </svg>
            <span style={{ marginLeft: '4px' }}>No</span>
          </ThumbsRating.ThumbsDown>
        </div>
      </ThumbsRating>
    </div>
  );
}
```

## API Reference

### ThumbsRating Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | 'up' \| 'down' \| null | null | Default value (uncontrolled) |
| value | 'up' \| 'down' \| null | - | Controlled value |
| onChange | (value: 'up' \| 'down' \| null) => void | - | Callback when value changes |
| allowClear | boolean | true | Whether to allow clearing the rating by clicking the same value |
| disabled | boolean | false | Whether the rating is disabled |
| readOnly | boolean | false | Whether the rating is read-only |
| required | boolean | false | Whether the rating is required |
| id | string | - | ID for the rating element |
| name | string | - | Name attribute for the rating |
| upLabel | string | 'Thumbs up' | Label for the thumbs up button |
| downLabel | string | 'Thumbs down' | Label for the thumbs down button |
| size | 'sm' \| 'md' \| 'lg' \| number | 'md' | Size of the thumbs. Can be a predefined size or a custom pixel value |
| activeColor | string | 'currentColor' | Color of the active thumbs |
| inactiveColor | string | 'currentColor' | Color of the inactive thumbs |

### Compound Components

The ThumbsRating component uses a compound component pattern, providing the following sub-components:

- `ThumbsRating.ThumbsUp` - The thumbs up button
- `ThumbsRating.ThumbsDown` - The thumbs down button

## Customization

The ThumbsRating component is designed to be highly customizable. You can override the default styling by providing your own CSS or using a CSS-in-JS solution like styled-components.

### Example with styled-components

```jsx
import styled from 'styled-components';
import { ThumbsRating } from '@strive-ui/thumbs-rating';

const StyledThumbsRating = styled(ThumbsRating)`
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

const StyledThumbsUp = styled(ThumbsRating.ThumbsUp)`
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
  
  &[aria-pressed="true"] {
    background-color: rgba(76, 175, 80, 0.2);
  }
`;

const StyledThumbsDown = styled(ThumbsRating.ThumbsDown)`
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(244, 67, 54, 0.1);
  }
  
  &[aria-pressed="true"] {
    background-color: rgba(244, 67, 54, 0.2);
  }
`;

function CustomStyledThumbsRating() {
  return (
    <StyledThumbsRating>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <StyledThumbsUp>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#4CAF50">
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z" />
          </svg>
        </StyledThumbsUp>
        
        <StyledThumbsDown>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#F44336">
            <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z" />
          </svg>
        </StyledThumbsDown>
      </div>
    </StyledThumbsRating>
  );
}
```
