# StarRatingHeadless

A headless star rating component that provides all the functionality for star ratings without enforcing any specific styling.

## Features

- Extends the base RatingHeadless component with star-specific features
- Customizable star size
- Configurable active and inactive colors
- Support for half stars
- Option to display the rating value
- Fully accessible

## Usage

### Basic Usage

```jsx
import { StarRating } from '@strive-ui/star-rating';

function MyComponent() {
  return (
    <StarRating 
      label="Rate this product" 
      max={5} 
      defaultValue={3} 
    />
  );
}
```

### Controlled Star Rating

```jsx
import { useState } from 'react';
import { StarRating } from '@strive-ui/star-rating';

function ControlledStarRating() {
  const [value, setValue] = useState(3);
  
  return (
    <div>
      <p>Your rating: {value} stars</p>
      <StarRating 
        value={value} 
        onChange={setValue}
        max={5}
      />
    </div>
  );
}
```

### Half Stars

```jsx
import { StarRating } from '@strive-ui/star-rating';

function HalfStarRating() {
  return (
    <StarRating 
      max={5} 
      defaultValue={3.5}
      allowHalf
    />
  );
}
```

### Custom Colors

```jsx
import { StarRating } from '@strive-ui/star-rating';

function ColoredStarRating() {
  return (
    <StarRating 
      max={5} 
      defaultValue={4}
      activeColor="#FFD700"   // Gold color for active stars
      inactiveColor="#E5E7EB" // Light gray for inactive stars
    />
  );
}
```

### Custom Size

```jsx
import { StarRating } from '@strive-ui/star-rating';

function LargeStarRating() {
  return (
    <StarRating 
      max={5} 
      defaultValue={4}
      size="lg"  // Large stars
    />
  );
}
```

### Show Rating Value

```jsx
import { StarRating } from '@strive-ui/star-rating';

function StarRatingWithValue() {
  return (
    <StarRating 
      max={5} 
      defaultValue={4}
      showValue
    />
  );
}
```

### Custom Value Formatting

```jsx
import { StarRating } from '@strive-ui/star-rating';

function FormattedStarRating() {
  return (
    <StarRating 
      max={5} 
      defaultValue={4}
      showValue
      formatValue={(value) => `${value}/5 stars`}
    />
  );
}
```

### Precise Size Control

```jsx
import { StarRating } from '@strive-ui/star-rating';

function CustomSizedStarRating() {
  return (
    <StarRating 
      max={5} 
      defaultValue={4}
      size={36}  // 36px stars
    />
  );
}
```

### Disabled State

```jsx
import { StarRating } from '@strive-ui/star-rating';

function DisabledStarRating() {
  return (
    <StarRating 
      max={5} 
      defaultValue={4}
      disabled
    />
  );
}
```

### Read-Only State

```jsx
import { StarRating } from '@strive-ui/star-rating';

function ReadOnlyStarRating() {
  return (
    <StarRating 
      max={5} 
      defaultValue={4}
      readOnly
    />
  );
}
```

## API Reference

### StarRating Component

The StarRating component extends the base Rating component with the following additional props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| size | 'sm' \| 'md' \| 'lg' \| number | 'md' | Size of the stars. Can be a predefined size or a custom pixel value |
| activeColor | string | 'currentColor' | Color of the active stars |
| inactiveColor | string | 'currentColor' | Color of the inactive stars |
| showValue | boolean | false | Whether to show the rating value |
| formatValue | (value: number) => React.ReactNode | - | Format function for the rating value |

### Inherited Props from Rating

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | number | 0 | Default value (uncontrolled) |
| value | number | - | Controlled value |
| onChange | (value: number) => void | - | Callback when value changes |
| max | number | 5 | Maximum rating value |
| allowHalf | boolean | false | Whether to allow half ratings |
| allowClear | boolean | true | Whether to allow clearing the rating by clicking the same value |
| disabled | boolean | false | Whether the rating is disabled |
| readOnly | boolean | false | Whether the rating is read-only |
| required | boolean | false | Whether the rating is required |
| id | string | auto-generated | ID for the rating element |
| name | string | - | Name attribute for the rating |
| direction | 'ltr' \| 'rtl' | 'ltr' | Direction of the rating |
| label | string | - | Label text for the rating |

## Customization

The StarRating component is designed to be highly customizable. You can override the default styling by providing your own CSS or using a CSS-in-JS solution like styled-components.

### Example with styled-components

```jsx
import styled from 'styled-components';
import { StarRating } from '@strive-ui/star-rating';

const StyledStarRating = styled(StarRating)`
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #f3f4f6;
  }
`;

function CustomStyledStarRating() {
  return (
    <StyledStarRating 
      max={5} 
      defaultValue={4}
      activeColor="#FFD700"
      inactiveColor="#E5E7EB"
      showValue
    />
  );
}
```
