# SliderHeadless

A headless slider component that provides all the functionality without any styling.

## Features

- Supports both controlled and uncontrolled modes
- Horizontal and vertical orientations
- Customizable min, max, and step values
- Marks support
- Tooltip support
- Keyboard navigation
- Fully accessible

## Usage

### Basic Usage

```jsx
import { Slider } from '@strive-ui/slider';

function MyComponent() {
  return (
    <Slider 
      label="Volume" 
      min={0} 
      max={100} 
      defaultValue={50} 
    />
  );
}
```

### Controlled Slider

```jsx
import { useState } from 'react';
import { Slider } from '@strive-ui/slider';

function ControlledSlider() {
  const [value, setValue] = useState(50);
  
  return (
    <div>
      <p>Value: {value}</p>
      <Slider 
        value={value} 
        onChange={setValue}
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
import { Slider } from '@strive-ui/slider';

function SliderWithMarks() {
  return (
    <Slider 
      min={0} 
      max={100} 
      step={20}
      marks={[
        { value: 0, label: '0°C' },
        { value: 20, label: '20°C' },
        { value: 40, label: '40°C' },
        { value: 60, label: '60°C' },
        { value: 80, label: '80°C' },
        { value: 100, label: '100°C' },
      ]}
    />
  );
}
```

### With Tooltip

```jsx
import { Slider } from '@strive-ui/slider';

function SliderWithTooltip() {
  return (
    <Slider 
      min={0} 
      max={100} 
      defaultValue={50}
      tooltip
    />
  );
}
```

### Vertical Orientation

```jsx
import { Slider } from '@strive-ui/slider';

function VerticalSlider() {
  return (
    <Slider 
      orientation="vertical" 
      min={0} 
      max={100} 
      defaultValue={50}
      style={{ height: '200px' }}
    />
  );
}
```

### Custom Styling

```jsx
import { Slider } from '@strive-ui/slider';

function CustomSlider() {
  return (
    <Slider min={0} max={100} defaultValue={50}>
      <Slider.Label style={{ marginBottom: '8px', display: 'block' }}>
        Volume
      </Slider.Label>
      <Slider.Track 
        style={{ 
          height: '4px', 
          backgroundColor: '#E5E7EB', 
          borderRadius: '2px',
          position: 'relative',
        }}
      >
        <Slider.Range 
          style={{ 
            height: '100%', 
            backgroundColor: '#6366F1',
            borderRadius: '2px',
          }} 
        />
        <Slider.Thumb 
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
          <Slider.Tooltip 
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
            format={(value) => `${value}%`}
          />
        </Slider.Thumb>
      </Slider.Track>
    </Slider>
  );
}
```

## API Reference

### Slider (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | number | 0 | Default value (uncontrolled) |
| value | number | - | Controlled value |
| onChange | (value: number) => void | - | Callback when value changes |
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
| label | string | - | Label text for the slider |

### Hooks

#### useSlider

```jsx
import { useSlider } from '@strive-ui/slider';

function MyCustomSlider() {
  const { 
    value,
    percentage,
    getTrackProps,
    getThumbProps,
    getInputProps,
  } = useSlider({
    min: 0,
    max: 100,
    defaultValue: 50,
  });
  
  return (
    <div>
      <div {...getTrackProps()}>
        <div 
          style={{ width: `${percentage}%`, height: '4px', backgroundColor: 'blue' }} 
        />
        <div {...getThumbProps()} />
      </div>
      <input {...getInputProps()} />
    </div>
  );
}
```
