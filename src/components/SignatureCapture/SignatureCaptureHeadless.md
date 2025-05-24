# SignatureCaptureHeadless

A headless component for creating customizable signature capture interfaces with extensive flexibility for developers.

## Usage

```jsx
import { SignatureCaptureHeadless } from 'strive-ui';

function MySignatureCapture() {
  const handleSave = (dataUrl) => {
    // Save the signature image
    console.log('Signature saved:', dataUrl);
    
    // You could also send it to a server
    // fetch('/api/save-signature', {
    //   method: 'POST',
    //   body: JSON.stringify({ signature: dataUrl }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
  };

  return (
    <SignatureCaptureHeadless.Root
      width={400}
      height={200}
      penColor="#000000"
      backgroundColor="#f8f8f8"
      showGuide={true}
      onComplete={handleSave}
    >
      <div>
        <h3>Please sign below:</h3>
        
        <SignatureCaptureHeadless.Canvas 
          style={{ 
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '10px'
          }} 
        />
        
        <SignatureCaptureHeadless.Empty>
          <div style={{ color: '#999', textAlign: 'center', marginTop: '5px' }}>
            Sign above
          </div>
        </SignatureCaptureHeadless.Empty>
        
        <SignatureCaptureHeadless.Controls>
          {({ clear, undo, isEmpty, setPenColor, setPenWidth }) => (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={clear} disabled={isEmpty}>Clear</button>
              <button onClick={undo} disabled={isEmpty}>Undo</button>
              
              <select 
                onChange={(e) => setPenColor(e.target.value)}
                defaultValue="#000000"
              >
                <option value="#000000">Black</option>
                <option value="#0000ff">Blue</option>
                <option value="#ff0000">Red</option>
              </select>
              
              <select 
                onChange={(e) => setPenWidth(Number(e.target.value))}
                defaultValue="2"
              >
                <option value="1">Thin</option>
                <option value="2">Medium</option>
                <option value="4">Thick</option>
              </select>
            </div>
          )}
        </SignatureCaptureHeadless.Controls>
        
        <SignatureCaptureHeadless.Export>
          {({ toDataURL, isEmpty }) => (
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={() => handleSave(toDataURL())}
                disabled={isEmpty}
              >
                Save Signature
              </button>
            </div>
          )}
        </SignatureCaptureHeadless.Export>
        
        <SignatureCaptureHeadless.Preview />
      </div>
    </SignatureCaptureHeadless.Root>
  );
}
```

## API

### SignatureCaptureHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `300` | Width of the signature pad |
| `height` | `number` | `150` | Height of the signature pad |
| `backgroundColor` | `string` | `'rgba(255, 255, 255, 0)'` | Background color of the signature pad |
| `penColor` | `string` | `'#000000'` | Pen color |
| `penWidth` | `number` | `2` | Pen width |
| `minWidth` | `number` | `0.5` | Minimum width of the pen |
| `maxWidth` | `number` | `4` | Maximum width of the pen |
| `usePressure` | `boolean` | `true` | Whether to use pressure sensitivity |
| `velocityFilterWeight` | `number` | `0.7` | Weight for velocity filter |
| `minDistance` | `number` | `0.5` | Minimum distance between points |
| `showGuide` | `boolean` | `false` | Whether to show a dotted line guide |
| `trimWhitespace` | `boolean` | `true` | Whether to trim empty space around the signature |
| `onChange` | `(isEmpty: boolean, data?: string) => void` | - | Callback when signature changes |
| `onComplete` | `(data: string) => void` | - | Callback when signature is completed |

### Other Components

- `SignatureCaptureHeadless.Canvas`: Renders the signature canvas
- `SignatureCaptureHeadless.Controls`: Provides access to signature controls
- `SignatureCaptureHeadless.Export`: Interface for exporting the signature
- `SignatureCaptureHeadless.Preview`: Renders a preview of the signature
- `SignatureCaptureHeadless.Empty`: Renders content when the signature is empty
- `SignatureCaptureHeadless.NotEmpty`: Renders content when the signature is not empty

### useSignatureCapture Hook

For even more control, you can use the `useSignatureCapture` hook directly:

```jsx
import { useSignatureCapture } from 'strive-ui';

function MyCustomSignatureCapture() {
  const {
    isEmpty,
    canvasRef,
    clear,
    undo,
    toDataURL,
    toSVG,
    setPenColor,
    setPenWidth,
    // ...other properties and methods
  } = useSignatureCapture({
    width: 400,
    height: 200,
    penColor: '#0000ff',
  });
  
  // Custom implementation
}
```
