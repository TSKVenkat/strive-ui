# RatingHeadless

A headless rating component that provides all the functionality for rating systems without any styling.

## Features

- Supports both controlled and uncontrolled modes
- Configurable maximum rating value
- Support for half ratings
- Option to clear ratings
- Keyboard navigation
- RTL support
- Fully accessible

## Usage

### Basic Usage

```jsx
import { Rating } from '@strive-ui/rating';

function MyComponent() {
  return (
    <Rating 
      label="Rate this product" 
      max={5} 
      defaultValue={3} 
    />
  );
}
```

### Controlled Rating

```jsx
import { useState } from 'react';
import { Rating } from '@strive-ui/rating';

function ControlledRating() {
  const [value, setValue] = useState(3);
  
  return (
    <div>
      <p>Your rating: {value}</p>
      <Rating 
        value={value} 
        onChange={setValue}
        max={5}
      />
    </div>
  );
}
```

### Half Ratings

```jsx
import { Rating } from '@strive-ui/rating';

function HalfRating() {
  return (
    <Rating 
      max={5} 
      defaultValue={3.5}
      allowHalf
    />
  );
}
```

### Custom Icons

```jsx
import { Rating } from '@strive-ui/rating';

function CustomIconRating() {
  return (
    <Rating max={5} defaultValue={3}>
      <Rating.Group style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Rating.Item 
            key={i + 1} 
            value={i + 1}
            activeIcon={<span style={{ color: 'gold' }}>★</span>}
            inactiveIcon={<span style={{ color: 'gray' }}>☆</span>}
          />
        ))}
      </Rating.Group>
    </Rating>
  );
}
```

### RTL Support

```jsx
import { Rating } from '@strive-ui/rating';

function RTLRating() {
  return (
    <Rating 
      max={5} 
      defaultValue={3}
      direction="rtl"
    />
  );
}
```

### Custom Styling

```jsx
import { Rating } from '@strive-ui/rating';

function CustomStyledRating() {
  return (
    <Rating max={5} defaultValue={4}>
      <Rating.Label style={{ marginBottom: '8px', display: 'block' }}>
        Rate this product
      </Rating.Label>
      <Rating.Group style={{ display: 'flex', gap: '4px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Rating.Item 
            key={i + 1} 
            value={i + 1}
            style={{ 
              cursor: 'pointer',
              fontSize: '24px',
              transition: 'transform 0.2s',
            }}
            activeIcon={<span style={{ color: '#FFD700' }}>★</span>}
            inactiveIcon={<span style={{ color: '#E5E7EB' }}>☆</span>}
          />
        ))}
      </Rating.Group>
      <Rating.Input />
    </Rating>
  );
}
```

## API Reference

### Rating (Root Component)

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

### Compound Components

The Rating component uses a compound component pattern, providing the following sub-components:

- `Rating.Item` - An individual rating item
- `Rating.Input` - Hidden input for the rating value (for form submission)
- `Rating.Label` - Label element for the rating
- `Rating.Group` - Container for the rating items

#### Rating.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | - | Value of the rating item |
| half | boolean | false | Whether this is a half item |
| activeIcon | React.ReactNode | - | Icon to display when item is active |
| inactiveIcon | React.ReactNode | - | Icon to display when item is inactive |

### Hooks

#### useRating

```jsx
import { useRating } from '@strive-ui/rating';

function MyCustomRating() {
  const { 
    value,
    hoverValue,
    getRootProps,
    getItemProps,
    getInputProps,
  } = useRating({
    max: 5,
    defaultValue: 3,
    allowHalf: true,
  });
  
  return (
    <div {...getRootProps()}>
      <div style={{ display: 'flex' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span 
            key={i + 1}
            {...getItemProps({ value: i + 1 })}
            style={{ 
              color: (hoverValue || value) >= i + 1 ? 'gold' : 'gray',
              cursor: 'pointer',
            }}
          >
            {(hoverValue || value) >= i + 1 ? '★' : '☆'}
          </span>
        ))}
      </div>
      <input {...getInputProps()} />
    </div>
  );
}
```
