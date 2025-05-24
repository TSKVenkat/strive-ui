# QRCodeScannerHeadless

A headless component for creating customizable QR code scanning interfaces with extensive flexibility for developers.

## Usage

```jsx
import { QRCodeScannerHeadless } from 'strive-ui';

function MyQRCodeScanner() {
  const handleScan = (result) => {
    console.log('Scanned QR code:', result.text);
    // You could also navigate to the URL or process the data
    // window.open(result.text, '_blank');
  };

  return (
    <QRCodeScannerHeadless.Root
      width={400}
      height={400}
      facingMode="environment"
      highlightCode={true}
      beepOnScan={true}
      onScan={handleScan}
    >
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <QRCodeScannerHeadless.Scanner />
        
        <QRCodeScannerHeadless.Overlay>
          {({ isScanning }) => (
            <>
              {isScanning && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '200px',
                  height: '200px',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid #fff',
                  boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.5)',
                  borderRadius: '10px',
                }}/>
              )}
            </>
          )}
        </QRCodeScannerHeadless.Overlay>
        
        <QRCodeScannerHeadless.Controls>
          {({ isScanning, startScanning, stopScanning }) => (
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {!isScanning ? (
                <button onClick={startScanning}>Start Scanner</button>
              ) : (
                <button onClick={stopScanning}>Stop Scanner</button>
              )}
            </div>
          )}
        </QRCodeScannerHeadless.Controls>
        
        <QRCodeScannerHeadless.Result>
          {({ lastResult }) => (
            <div style={{ marginTop: '20px' }}>
              {lastResult && (
                <div>
                  <h3>Scan Result:</h3>
                  <p><strong>Content:</strong> {lastResult.text}</p>
                  <p><strong>Format:</strong> {lastResult.format}</p>
                  <p><strong>Time:</strong> {new Date(lastResult.timestamp).toLocaleTimeString()}</p>
                  {lastResult.imageData && (
                    <img 
                      src={lastResult.imageData} 
                      alt="Scanned Frame" 
                      style={{ maxWidth: '100%', maxHeight: '200px' }} 
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </QRCodeScannerHeadless.Result>
        
        <QRCodeScannerHeadless.Error>
          {({ error }) => (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Error: {error.message}
            </div>
          )}
        </QRCodeScannerHeadless.Error>
      </div>
    </QRCodeScannerHeadless.Root>
  );
}
```

## API

### QRCodeScannerHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `300` | Width of the scanner |
| `height` | `number` | `300` | Height of the scanner |
| `facingMode` | `'user' \| 'environment'` | `'environment'` | Camera facing mode (front or back) |
| `highlightCode` | `boolean` | `true` | Whether to highlight the QR code when found |
| `highlightColor` | `string` | `'#00FF00'` | Color of the highlight |
| `beepOnScan` | `boolean` | `false` | Whether to play a sound when a QR code is detected |
| `beepSoundUrl` | `string` | `''` | Custom beep sound URL |
| `scanFrequency` | `number` | `500` | Scan frequency in milliseconds |
| `stopOnScan` | `boolean` | `false` | Whether to stop scanning after finding a QR code |
| `autoStart` | `boolean` | `false` | Whether to auto-start scanning |
| `onScan` | `(result: QRCodeResult) => void` | - | Callback when a QR code is detected |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |
| `onStart` | `() => void` | - | Callback when scanning starts |
| `onStop` | `() => void` | - | Callback when scanning stops |

### Other Components

- `QRCodeScannerHeadless.Scanner`: Renders the video and canvas elements for scanning
- `QRCodeScannerHeadless.Controls`: Provides access to scanning controls
- `QRCodeScannerHeadless.Result`: Displays scan results
- `QRCodeScannerHeadless.Error`: Displays error messages
- `QRCodeScannerHeadless.Overlay`: Renders an overlay on top of the scanner

### QRCodeResult Interface

```typescript
interface QRCodeResult {
  text: string;
  format: string;
  timestamp: number;
  imageData?: string;
}
```

### useQRCodeScanner Hook

For even more control, you can use the `useQRCodeScanner` hook directly:

```jsx
import { useQRCodeScanner } from 'strive-ui';

function MyCustomQRCodeScanner() {
  const {
    isScanning,
    lastResult,
    startScanning,
    stopScanning,
    getVideoProps,
    getCanvasProps,
    // ...other properties and methods
  } = useQRCodeScanner({
    width: 400,
    height: 400,
    facingMode: 'environment',
  });
  
  // Custom implementation
}
```

## Notes

This component is a headless implementation that provides the core functionality for QR code scanning. In a real-world application, you would need to integrate a QR code detection library like `jsQR` or `zxing-js` for actual QR code detection. The current implementation includes a placeholder for QR code detection logic.
