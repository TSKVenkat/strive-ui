# SignaturePadHeadless

A headless signature pad component that provides all the functionality for capturing and managing signatures without enforcing any specific styling.

## Features

- Smooth signature drawing with pressure sensitivity
- Undo last stroke
- Clear entire signature
- Save signature as image
- Customizable stroke color and width
- Customizable canvas size and background
- Fully accessible

## Usage

### Basic Usage

```jsx
import { SignaturePad } from '@strive-ui/signature-pad';

function MyComponent() {
  return (
    <SignaturePad 
      width={400}
      height={200}
      onSave={(dataURL) => console.log('Signature saved:', dataURL)}
    />
  );
}
```

### Controlled SignaturePad

```jsx
import { useState } from 'react';
import { SignaturePad } from '@strive-ui/signature-pad';

function ControlledSignaturePad() {
  const [strokes, setStrokes] = useState([]);
  
  return (
    <div>
      <SignaturePad 
        strokes={strokes}
        onChange={setStrokes}
        width={400}
        height={200}
      />
      <div>
        <p>Number of strokes: {strokes.length}</p>
        <button onClick={() => setStrokes([])}>Reset</button>
      </div>
    </div>
  );
}
```

### With Custom Colors

```jsx
import { SignaturePad } from '@strive-ui/signature-pad';

function ColorfulSignaturePad() {
  return (
    <SignaturePad 
      color="#3b82f6"
      backgroundColor="#f8fafc"
      width={400}
      height={200}
    >
      <SignaturePad.Canvas />
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <SignaturePad.ColorPicker />
        <label>Stroke Color</label>
      </div>
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <SignaturePad.WidthSlider />
        <label>Stroke Width</label>
      </div>
      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
        <SignaturePad.ClearButton />
        <SignaturePad.UndoButton />
        <SignaturePad.SaveButton />
      </div>
    </SignaturePad>
  );
}
```

### With Validation

```jsx
import { useState } from 'react';
import { SignaturePad } from '@strive-ui/signature-pad';

function ValidatedSignaturePad() {
  const [isValid, setIsValid] = useState(false);
  const [signature, setSignature] = useState('');
  
  const handleChange = (strokes) => {
    setIsValid(strokes.length > 0);
  };
  
  const handleSave = (dataURL) => {
    setSignature(dataURL);
  };
  
  return (
    <div>
      <SignaturePad 
        required
        onChange={handleChange}
        onSave={handleSave}
        width={400}
        height={200}
      />
      
      <div style={{ marginTop: '20px' }}>
        <button 
          disabled={!isValid} 
          onClick={() => alert('Form submitted with signature!')}
        >
          Submit Form
        </button>
      </div>
      
      {signature && (
        <div style={{ marginTop: '20px' }}>
          <h3>Captured Signature:</h3>
          <img src={signature} alt="Signature" style={{ border: '1px solid #ccc' }} />
        </div>
      )}
    </div>
  );
}
```

### Disabled State

```jsx
import { SignaturePad } from '@strive-ui/signature-pad';

function DisabledSignaturePad() {
  return (
    <SignaturePad 
      disabled
      width={400}
      height={200}
    />
  );
}
```

### Read-Only State with Existing Signature

```jsx
import { SignaturePad } from '@strive-ui/signature-pad';

// Example of a saved signature
const savedStrokes = [
  {
    points: [
      { x: 50, y: 50, pressure: 0.5, time: 1620000000000 },
      { x: 60, y: 60, pressure: 0.5, time: 1620000000100 },
      { x: 70, y: 70, pressure: 0.5, time: 1620000000200 },
    ],
    color: '#000000',
    width: 2,
  },
  // More strokes...
];

function ReadOnlySignaturePad() {
  return (
    <SignaturePad 
      readOnly
      defaultStrokes={savedStrokes}
      width={400}
      height={200}
    />
  );
}
```

### Custom Styling

```jsx
import { SignaturePad } from '@strive-ui/signature-pad';

function CustomStyledSignaturePad() {
  return (
    <SignaturePad
      width={400}
      height={200}
      color="#1e40af"
      backgroundColor="#f0f9ff"
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <h3 style={{ margin: 0 }}>Please sign below</h3>
        <p style={{ margin: '4px 0 0', color: '#64748b' }}>
          Use your mouse or touch screen
        </p>
      </div>
      
      <SignaturePad.Canvas 
        style={{ 
          border: '1px solid #94a3b8',
          borderRadius: '4px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
        }}
      />
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '16px',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <SignaturePad.ColorPicker 
            style={{ 
              width: '32px',
              height: '32px',
              padding: '2px',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
            }}
          />
          <SignaturePad.WidthSlider 
            style={{ 
              width: '100px',
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <SignaturePad.ClearButton 
            style={{ 
              padding: '4px 12px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              cursor: 'pointer',
              '[data-disabled]': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },
            }}
          />
          <SignaturePad.UndoButton 
            style={{ 
              padding: '4px 12px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              cursor: 'pointer',
              '[data-disabled]': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },
            }}
          />
          <SignaturePad.SaveButton 
            style={{ 
              padding: '4px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              '[data-disabled]': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },
            }}
          />
        </div>
      </div>
    </SignaturePad>
  );
}
```

### Using the Hook Directly

```jsx
import { useSignaturePad } from '@strive-ui/signature-pad';

function CustomSignaturePad() {
  const {
    strokes,
    isEmpty,
    isDrawing,
    color,
    strokeWidth,
    clear,
    undo,
    toDataURL,
    setColor,
    setStrokeWidth,
    getCanvasProps,
    getClearButtonProps,
    getUndoButtonProps,
    getSaveButtonProps,
  } = useSignaturePad({
    width: 400,
    height: 200,
    color: '#000000',
    backgroundColor: '#ffffff',
    onSave: (dataURL) => {
      console.log('Signature saved:', dataURL);
      // You can send this dataURL to your server or store it
    },
  });
  
  return (
    <div className="custom-signature-pad">
      <canvas {...getCanvasProps({ className: 'signature-canvas' })} />
      
      <div className="signature-controls">
        <div className="signature-tools">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
          />
          <input 
            type="range" 
            min={0.5} 
            max={5} 
            step={0.1} 
            value={strokeWidth} 
            onChange={(e) => setStrokeWidth(parseFloat(e.target.value))} 
          />
        </div>
        
        <div className="signature-actions">
          <button {...getClearButtonProps({ className: 'clear-button' })}>
            Clear
          </button>
          <button {...getUndoButtonProps({ className: 'undo-button' })}>
            Undo
          </button>
          <button 
            {...getSaveButtonProps(
              { className: 'save-button' }, 
              'image/png', 
              1.0
            )}
          >
            Save
          </button>
        </div>
      </div>
      
      <div className="signature-status">
        {isEmpty ? 'No signature' : `${strokes.length} strokes`}
        {isDrawing && ' (drawing...)'}
      </div>
    </div>
  );
}
```

## API Reference

### SignaturePad (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultStrokes | Stroke[] | [] | Default strokes (uncontrolled) |
| strokes | Stroke[] | - | Controlled strokes |
| onChange | (strokes: Stroke[]) => void | - | Callback when strokes change |
| disabled | boolean | false | Whether the signature pad is disabled |
| readOnly | boolean | false | Whether the signature pad is read-only |
| required | boolean | false | Whether the signature pad is required |
| id | string | auto-generated | ID for the signature pad element |
| name | string | - | Name attribute for the signature pad |
| minWidth | number | 0.5 | Minimum width of the stroke |
| maxWidth | number | 2.5 | Maximum width of the stroke |
| color | string | '#000000' | Color of the stroke |
| backgroundColor | string | 'rgba(0,0,0,0)' | Background color of the canvas |
| width | number | 300 | Width of the canvas |
| height | number | 150 | Height of the canvas |
| onBegin | () => void | - | Callback when signature starts |
| onEnd | () => void | - | Callback when signature ends |
| onClear | () => void | - | Callback when canvas is cleared |
| onSave | (dataURL: string) => void | - | Callback when signature is saved as data URL |

### Stroke Interface

| Property | Type | Description |
|----------|------|-------------|
| points | Point[] | Array of points in the stroke |
| color | string | Stroke color |
| width | number | Stroke width |

### Point Interface

| Property | Type | Description |
|----------|------|-------------|
| x | number | X coordinate |
| y | number | Y coordinate |
| pressure | number | Pressure (if available) |
| time | number | Timestamp |

### Compound Components

The SignaturePad component uses a compound component pattern, providing the following sub-components:

- `SignaturePad.Canvas` - Canvas element for drawing signatures
- `SignaturePad.ClearButton` - Button to clear the signature
- `SignaturePad.UndoButton` - Button to undo the last stroke
- `SignaturePad.SaveButton` - Button to save the signature as an image
- `SignaturePad.ColorPicker` - Color picker for the stroke color
- `SignaturePad.WidthSlider` - Slider for the stroke width

### Data Attributes

The SignaturePad component and its sub-components expose several data attributes that can be used for styling:

- `data-disabled`: Present when the signature pad is disabled
- `data-readonly`: Present when the signature pad is read-only
- `data-required`: Present when the signature pad is required
- `data-empty`: Present when there are no strokes
- `data-drawing`: Present when the user is actively drawing

### Hooks

#### useSignaturePad

```jsx
import { useSignaturePad } from '@strive-ui/signature-pad';

function MyCustomSignaturePad() {
  const {
    strokes,
    isEmpty,
    isDrawing,
    disabled,
    readOnly,
    required,
    id,
    name,
    color,
    strokeWidth,
    backgroundColor,
    width,
    height,
    canvasRef,
    clear,
    undo,
    toDataURL,
    setColor,
    setStrokeWidth,
    setBackgroundColor,
    getCanvasProps,
    getClearButtonProps,
    getUndoButtonProps,
    getSaveButtonProps,
  } = useSignaturePad({
    width: 400,
    height: 200,
    color: '#000000',
    backgroundColor: '#ffffff',
  });
  
  // Build your custom signature pad UI
}
```
