# RangeSliderHeadless

A headless range slider component that provides all the functionality for selecting a range between two values without any styling.

## Features

- Supports both controlled and uncontrolled modes
- Horizontal and vertical orientations
- Customizable min, max, and step values
- Marks support
- Tooltip support
- Keyboard navigation
- Minimum distance and cross-over configuration
- Fully accessible

## Usage

### Basic Usage

```jsx
import { RangeSlider } from '@pulseui/range-slider';

function MyComponent() {
  return (
    <RangeSlider 
      label="Price Range" 
      min={0} 
      max={1000} 
      defaultStartValue={200} 
      defaultEndValue={800} 
    />
  );
}
```

### Controlled Range Slider

```jsx
import { useState } from 'react';
import { RangeSlider } from '@pulseui/range-slider';

function ControlledRangeSlider() {
  const [values, setValues] = useState([25, 75]);
  
  const handleChange = (newValues) => {
    setValues(newValues);
  };
  
  return (
    <div>
      <p>Selected Range: ${values[0]} - ${values[1]}</p>
      <RangeSlider 
        startValue={values[0]} 
        endValue={values[1]} 
        onChange={handleChange}
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}
```

### With Marks

```jsx
import { RangeSlider } from '@pulseui/range-slider';

function RangeSliderWithMarks() {
  return (
    <RangeSlider 
      min={0} 
      max={100} 
      step={20}
      defaultStartValue={20}
      defaultEndValue={80}
      marks={[
        { value: 0, label: '$0' },
        { value: 20, label: '$20' },
        { value: 40, label: '$40' },
        { value: 60, label: '$60' },
        { value: 80, label: '$80' },
        { value: 100, label: '$100' },
      ]}
    />
  );
}
```

### With Tooltip

```jsx
import { RangeSlider } from '@pulseui/range-slider';

function RangeSliderWithTooltip() {
  return (
    <RangeSlider 
      min={0} 
      max={100} 
      defaultStartValue={20}
      defaultEndValue={80}
      tooltip
    />
  );
}
```

### With Minimum Distance

```jsx
import { RangeSlider } from '@pulseui/range-slider';

function RangeSliderWithMinDistance() {
  return (
    <RangeSlider 
      min={0} 
      max={100} 
      defaultStartValue={20}
      defaultEndValue={80}
      minDistance={10} // Minimum distance between handles
    />
  );
}
```

### Vertical Orientation

```jsx
import { RangeSlider } from '@pulseui/range-slider';

function VerticalRangeSlider() {
  return (
    <RangeSlider 
      orientation="vertical" 
      min={0} 
      max={100} 
      defaultStartValue={20}
      defaultEndValue={80}
      style={{ height: '200px' }}
    />
  );
}
```

### Custom Styling

```jsx
import { RangeSlider } from '@pulseui/range-slider';

function CustomRangeSlider() {
  return (
    <RangeSlider 
      min={0} 
      max={1000} 
      defaultStartValue={200} 
      defaultEndValue={800}
    >
      <RangeSlider.Label style={{ marginBottom: '8px', display: 'block' }}>
        Price Range
      </RangeSlider.Label>
      <RangeSlider.Track 
        style={{ 
          height: '4px', 
          backgroundColor: '#E5E7EB', 
          borderRadius: '2px',
          position: 'relative',
          margin: '20px 0',
        }}
      >
        <RangeSlider.Range 
          style={{ 
            height: '100%', 
            backgroundColor: '#6366F1',
            borderRadius: '2px',
          }} 
        />
        <RangeSlider.StartThumb 
          style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: 'white', 
            border: '2px solid #6366F1', 
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }} 
        >
          <RangeSlider.Tooltip 
            type="start"
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#6366F1',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
            format={(value) => `$${value}`}
          />
        </RangeSlider.StartThumb>
        <RangeSlider.EndThumb 
          style={{ 
            width: '16px', 
            height: '16px', 
            backgroundColor: 'white', 
            border: '2px solid #6366F1', 
            borderRadius: '50%',
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }} 
        >
          <RangeSlider.Tooltip 
            type="end"
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#6366F1',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
            format={(value) => `$${value}`}
          />
        </RangeSlider.EndThumb>
      </RangeSlider.Track>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
        <span>$0</span>
        <span>$1000</span>
      </div>
    </RangeSlider>
  );
}
```

## API Reference

### RangeSlider (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultStartValue | number | 0 | Default start value (uncontrolled) |
| defaultEndValue | number | 100 | Default end value (uncontrolled) |
| startValue | number | - | Controlled start value |
| endValue | number | - | Controlled end value |
| onChange | (values: [number, number]) => void | - | Callback when values change |
| min | number | 0 | Minimum value |
| max | number | 100 | Maximum value |
| step | number | 1 | Step value |
| disabled | boolean | false | Whether the slider is disabled |
| readOnly | boolean | false | Whether the slider is read-only |
| required | boolean | false | Whether the slider is required |
| id | string | auto-generated | ID for the slider element |
| name | string | - | Name attribute for the slider |
| marks | boolean \| { value: number; label?: string }[] | false | Whether to show marks |
| tooltip | boolean | false | Whether to show tooltip |
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | Orientation of the slider |
| minDistance | number | 0 | Minimum distance between handles |
| allowCross | boolean | false | Whether to allow handles to cross |
| label | string | - | Label text for the slider |

### Compound Components

The RangeSlider component uses a compound component pattern, providing the following sub-components:

- `RangeSlider.Track` - The track element of the slider
- `RangeSlider.Range` - The filled range element between the two thumbs
- `RangeSlider.StartThumb` - The start thumb element
- `RangeSlider.EndThumb` - The end thumb element
- `RangeSlider.Marks` - Container for the marks
- `RangeSlider.Mark` - Individual mark element
- `RangeSlider.StartInput` - Hidden input for the start value (for form submission)
- `RangeSlider.EndInput` - Hidden input for the end value (for form submission)
- `RangeSlider.Label` - Label element for the slider
- `RangeSlider.Tooltip` - Tooltip element for displaying the current value

### Hooks

#### useRangeSlider

```jsx
import { useRangeSlider } from '@pulseui/range-slider';

function MyCustomRangeSlider() {
  const { 
    startValue,
    endValue,
    startPercentage,
    endPercentage,
    getRootProps,
    getTrackProps,
    getRangeProps,
    getStartThumbProps,
    getEndThumbProps,
    getStartInputProps,
    getEndInputProps,
  } = useRangeSlider({
    min: 0,
    max: 100,
    defaultStartValue: 20,
    defaultEndValue: 80,
  });
  
  return (
    <div {...getRootProps()}>
      <div {...getTrackProps()}>
        <div 
          {...getRangeProps()} 
          style={{ height: '4px', backgroundColor: 'blue' }} 
        />
        <div {...getStartThumbProps()} />
        <div {...getEndThumbProps()} />
      </div>
      <input {...getStartInputProps()} />
      <input {...getEndInputProps()} />
    </div>
  );
}
```
