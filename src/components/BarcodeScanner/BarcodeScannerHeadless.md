# BarcodeScannerHeadless

A headless component for creating customizable barcode scanning interfaces with support for multiple barcode formats and extensive flexibility for developers.

## Usage

```jsx
import { BarcodeScannerHeadless } from 'strive-ui';

function MyBarcodeScanner() {
  const handleScan = (result) => {
    console.log('Scanned barcode:', result.text);
    console.log('Format:', result.format);
  };

  return (
    <BarcodeScannerHeadless.Root
      width={400}
      height={400}
      facingMode="environment"
      highlightCode={true}
      beepOnScan={true}
      formats={['EAN_13', 'CODE_128', 'QR_CODE']}
      onScan={handleScan}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <BarcodeScannerHeadless.Scanner />
        
        <BarcodeScannerHeadless.Overlay>
          {({ isScanning, lastResult }) => (
            <>
              {isScanning && !lastResult && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '250px',
                  height: '100px',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid #fff',
                  boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.5)',
                  borderRadius: '10px',
                }}/>
              )}
            </>
          )}
        </BarcodeScannerHeadless.Overlay>
        
        <BarcodeScannerHeadless.FormatSelector>
          {({ activeFormats, toggleFormat }) => (
            <div style={{ marginTop: '10px' }}>
              <h4>Barcode Types:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {['EAN_13', 'CODE_128', 'QR_CODE', 'UPC_A', 'DATA_MATRIX'].map(format => (
                  <label key={format} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="checkbox"
                      checked={activeFormats.includes(format as any)}
                      onChange={() => toggleFormat(format as any)}
                    />
                    {format}
                  </label>
                ))}
              </div>
            </div>
          )}
        </BarcodeScannerHeadless.FormatSelector>
        
        <BarcodeScannerHeadless.Controls>
          {({ isScanning, startScanning, stopScanning, clearResults }) => (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              {!isScanning ? (
                <button onClick={startScanning}>Start Scanner</button>
              ) : (
                <button onClick={stopScanning}>Stop Scanner</button>
              )}
              <button onClick={clearResults}>Clear Results</button>
            </div>
          )}
        </BarcodeScannerHeadless.Controls>
        
        <BarcodeScannerHeadless.Result>
          {({ lastResult, results }) => (
            <div style={{ marginTop: '20px' }}>
              {lastResult && (
                <div>
                  <h3>Last Scan:</h3>
                  <p><strong>Content:</strong> {lastResult.text}</p>
                  <p><strong>Format:</strong> {lastResult.format}</p>
                  <p><strong>Time:</strong> {new Date(lastResult.timestamp).toLocaleTimeString()}</p>
                </div>
              )}
              
              {results.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3>Scan History:</h3>
                  <ul>
                    {results.map((result, index) => (
                      <li key={index}>
                        {result.text} ({result.format}) - {new Date(result.timestamp).toLocaleTimeString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </BarcodeScannerHeadless.Result>
        
        <BarcodeScannerHeadless.Error>
          {({ error }) => (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Error: {error.message}
            </div>
          )}
        </BarcodeScannerHeadless.Error>
      </div>
    </BarcodeScannerHeadless.Root>
  );
}
```

## API

### BarcodeScannerHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `300` | Width of the scanner |
| `height` | `number` | `300` | Height of the scanner |
| `facingMode` | `'user' \| 'environment'` | `'environment'` | Camera facing mode (front or back) |
| `highlightCode` | `boolean` | `true` | Whether to highlight the barcode when found |
| `highlightColor` | `string` | `'#00FF00'` | Color of the highlight |
| `beepOnScan` | `boolean` | `false` | Whether to play a sound when a barcode is detected |
| `beepSoundUrl` | `string` | `''` | Custom beep sound URL |
| `scanFrequency` | `number` | `500` | Scan frequency in milliseconds |
| `stopOnScan` | `boolean` | `false` | Whether to stop scanning after finding a barcode |
| `autoStart` | `boolean` | `false` | Whether to auto-start scanning |
| `formats` | `BarcodeFormat[]` | `['QR_CODE', 'EAN_13', 'CODE_128']` | Formats to scan for |
| `onScan` | `(result: BarcodeResult) => void` | - | Callback when a barcode is detected |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |
| `onStart` | `() => void` | - | Callback when scanning starts |
| `onStop` | `() => void` | - | Callback when scanning stops |

### BarcodeFormat Type

```typescript
type BarcodeFormat = 
  | 'QR_CODE'
  | 'DATA_MATRIX'
  | 'UPC_A'
  | 'UPC_E'
  | 'EAN_8'
  | 'EAN_13'
  | 'CODE_39'
  | 'CODE_93'
  | 'CODE_128'
  | 'ITF'
  | 'CODABAR'
  | 'RSS_14'
  | 'RSS_EXPANDED'
  | 'PDF_417'
  | 'AZTEC';
```

### Other Components

- `BarcodeScannerHeadless.Scanner`: Renders the video and canvas elements for scanning
- `BarcodeScannerHeadless.Controls`: Provides access to scanning controls
- `BarcodeScannerHeadless.Result`: Displays scan results
- `BarcodeScannerHeadless.FormatSelector`: Interface for selecting which barcode formats to scan for
- `BarcodeScannerHeadless.Error`: Displays error messages
- `BarcodeScannerHeadless.Overlay`: Renders an overlay on top of the scanner

### BarcodeResult Interface

```typescript
interface BarcodeResult {
  text: string;
  format: BarcodeFormat;
  timestamp: number;
  imageData?: string;
  boundingBox?: {
    topLeft: { x: number, y: number };
    topRight: { x: number, y: number };
    bottomLeft: { x: number, y: number };
    bottomRight: { x: number, y: number };
  };
}
```

### useBarcodeScanner Hook

For even more control, you can use the `useBarcodeScanner` hook directly:

```jsx
import { useBarcodeScanner } from 'strive-ui';

function MyCustomBarcodeScanner() {
  const {
    isScanning,
    lastResult,
    startScanning,
    stopScanning,
    getVideoProps,
    getCanvasProps,
    activeFormats,
    setFormats,
    toggleFormat,
    // ...other properties and methods
  } = useBarcodeScanner({
    width: 400,
    height: 400,
    formats: ['EAN_13', 'CODE_128'],
  });
  
  // Custom implementation
}
```

## Notes

This component is a headless implementation that provides the core functionality for barcode scanning. In a real-world application, you would need to integrate a barcode detection library like `zxing-js` or `quagga` for actual barcode detection. The current implementation includes a placeholder for barcode detection logic.
