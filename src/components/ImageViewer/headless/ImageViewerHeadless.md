# ImageViewerHeadless

A headless component for creating customizable image viewers with extensive flexibility for developers. The image viewer allows users to zoom, rotate, pan, and interact with images.

## Usage

```jsx
import { ImageViewerHeadless } from 'strive-ui';

function MyImageViewer() {
  return (
    <ImageViewerHeadless.Root
      src="https://example.com/image.jpg"
      alt="Example image"
      initialZoom={1}
      initialRotation={0}
      enableDragToPan={true}
      enableWheelToZoom={true}
      onZoomChange={(zoom) => console.log('Zoom changed:', zoom)}
      onRotationChange={(rotation) => console.log('Rotation changed:', rotation)}
    >
      <ImageViewerHeadless.Container
        style={{
          width: '100%',
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ImageViewerHeadless.Toolbar
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            borderBottom: '1px solid #eee',
            gap: '8px',
          }}
        >
          <ImageViewerHeadless.ZoomOutButton
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            -
          </ImageViewerHeadless.ZoomOutButton>
          
          <ImageViewerHeadless.ZoomIndicator
            style={{
              minWidth: '60px',
              textAlign: 'center',
            }}
          />
          
          <ImageViewerHeadless.ZoomInButton
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            +
          </ImageViewerHeadless.ZoomInButton>
          
          <div style={{ width: '1px', height: '20px', backgroundColor: '#eee', margin: '0 8px' }} />
          
          <ImageViewerHeadless.RotateLeftButton
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            ↺
          </ImageViewerHeadless.RotateLeftButton>
          
          <ImageViewerHeadless.RotationIndicator
            style={{
              minWidth: '60px',
              textAlign: 'center',
            }}
          />
          
          <ImageViewerHeadless.RotateRightButton
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          >
            ↻
          </ImageViewerHeadless.RotateRightButton>
          
          <div style={{ flex: 1 }} />
          
          <ImageViewerHeadless.ResetAllButton
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          />
          
          <ImageViewerHeadless.FullscreenButton
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          />
          
          <ImageViewerHeadless.DownloadButton
            style={{
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }}
          />
        </ImageViewerHeadless.Toolbar>
        
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <ImageViewerHeadless.LoadingIndicator
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '8px 16px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              borderRadius: '4px',
            }}
          />
          
          <ImageViewerHeadless.ErrorIndicator
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              borderRadius: '4px',
            }}
          />
          
          <ImageViewerHeadless.Image
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </ImageViewerHeadless.Container>
    </ImageViewerHeadless.Root>
  );
}
```

## Creating a Reusable Image Viewer

```jsx
import { ImageViewerHeadless } from 'strive-ui';

function CustomImageViewer({ 
  src, 
  alt,
  showControls = true,
  onZoomChange,
  onRotationChange,
}) {
  return (
    <ImageViewerHeadless.Root
      src={src}
      alt={alt}
      enableDragToPan={true}
      enableWheelToZoom={true}
      onZoomChange={onZoomChange}
      onRotationChange={onRotationChange}
    >
      <ImageViewerHeadless.Container
        style={{
          width: '100%',
          height: '400px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {showControls && (
          <ImageViewerHeadless.Toolbar
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px',
              borderBottom: '1px solid #eee',
              gap: '8px',
            }}
          >
            <ImageViewerHeadless.ZoomOutButton
              style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              -
            </ImageViewerHeadless.ZoomOutButton>
            
            <ImageViewerHeadless.ZoomIndicator
              style={{
                minWidth: '60px',
                textAlign: 'center',
              }}
            />
            
            <ImageViewerHeadless.ZoomInButton
              style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              +
            </ImageViewerHeadless.ZoomInButton>
            
            <div style={{ width: '1px', height: '20px', backgroundColor: '#eee', margin: '0 8px' }} />
            
            <ImageViewerHeadless.RotateLeftButton
              style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              ↺
            </ImageViewerHeadless.RotateLeftButton>
            
            <ImageViewerHeadless.RotationIndicator
              style={{
                minWidth: '60px',
                textAlign: 'center',
              }}
            />
            
            <ImageViewerHeadless.RotateRightButton
              style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            >
              ↻
            </ImageViewerHeadless.RotateRightButton>
            
            <div style={{ flex: 1 }} />
            
            <ImageViewerHeadless.ResetAllButton
              style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            />
            
            <ImageViewerHeadless.FullscreenButton
              style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            />
            
            <ImageViewerHeadless.DownloadButton
              style={{
                background: 'none',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px 8px',
                cursor: 'pointer',
              }}
            />
          </ImageViewerHeadless.Toolbar>
        )}
        
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <ImageViewerHeadless.LoadingIndicator
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '8px 16px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              borderRadius: '4px',
            }}
          />
          
          <ImageViewerHeadless.ErrorIndicator
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 0, 0, 0.7)',
              color: 'white',
              borderRadius: '4px',
            }}
          />
          
          <ImageViewerHeadless.Image
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      </ImageViewerHeadless.Container>
    </ImageViewerHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div>
      <h1>Image Viewer Example</h1>
      <CustomImageViewer
        src="https://example.com/image.jpg"
        alt="Example image"
        showControls={true}
        onZoomChange={(zoom) => console.log('Zoom changed:', zoom)}
      />
    </div>
  );
}
```

## API

### ImageViewerHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `''` | Source URL of the image |
| `alt` | `string` | `''` | Alt text for the image |
| `initialZoom` | `number` | `1` | Initial zoom level |
| `initialRotation` | `number` | `0` | Initial rotation in degrees |
| `showZoomControls` | `boolean` | `true` | Whether to show zoom controls |
| `showRotationControls` | `boolean` | `true` | Whether to show rotation controls |
| `showFullscreenButton` | `boolean` | `true` | Whether to show fullscreen button |
| `showDownloadButton` | `boolean` | `true` | Whether to show download button |
| `showResetButton` | `boolean` | `true` | Whether to show reset button |
| `enableDragToPan` | `boolean` | `true` | Whether to enable drag to pan |
| `enableWheelToZoom` | `boolean` | `true` | Whether to enable wheel to zoom |
| `minZoom` | `number` | `0.1` | Minimum zoom level |
| `maxZoom` | `number` | `5` | Maximum zoom level |
| `zoomStep` | `number` | `0.1` | Zoom step for zoom controls |
| `rotationStep` | `number` | `90` | Rotation step for rotation controls in degrees |
| `onZoomChange` | `(zoom: number) => void` | - | Callback when the zoom level changes |
| `onRotationChange` | `(rotation: number) => void` | - | Callback when the rotation changes |
| `onEnterFullscreen` | `() => void` | - | Callback when entering fullscreen |
| `onExitFullscreen` | `() => void` | - | Callback when exiting fullscreen |
| `onDownload` | `() => void` | - | Callback when the image is downloaded |
| `onReset` | `() => void` | - | Callback when the image is reset |
| `onLoad` | `(event: React.SyntheticEvent<HTMLImageElement>) => void` | - | Callback when the image is loaded |
| `onError` | `(event: React.SyntheticEvent<HTMLImageElement>) => void` | - | Callback when the image fails to load |

### Other Components

- `ImageViewerHeadless.Container`: Container for the image viewer
- `ImageViewerHeadless.Image`: Image element
- `ImageViewerHeadless.Toolbar`: Container for the toolbar controls
- `ImageViewerHeadless.ZoomInButton`: Button that zooms in on the image
- `ImageViewerHeadless.ZoomOutButton`: Button that zooms out of the image
- `ImageViewerHeadless.ResetZoomButton`: Button that resets the zoom level
- `ImageViewerHeadless.RotateLeftButton`: Button that rotates the image left
- `ImageViewerHeadless.RotateRightButton`: Button that rotates the image right
- `ImageViewerHeadless.ResetRotationButton`: Button that resets the rotation
- `ImageViewerHeadless.FullscreenButton`: Button that toggles fullscreen mode
- `ImageViewerHeadless.DownloadButton`: Button that downloads the image
- `ImageViewerHeadless.ResetAllButton`: Button that resets all transformations
- `ImageViewerHeadless.ZoomIndicator`: Element that displays the current zoom level
- `ImageViewerHeadless.RotationIndicator`: Element that displays the current rotation
- `ImageViewerHeadless.LoadingIndicator`: Element that displays when the image is loading
- `ImageViewerHeadless.ErrorIndicator`: Element that displays when the image fails to load

### useImageViewer Hook

For even more control, you can use the `useImageViewer` hook directly:

```jsx
import { useImageViewer } from 'strive-ui';

function MyCustomImageViewer() {
  const {
    src,
    setSrc,
    alt,
    setAlt,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    rotation,
    setRotation,
    rotateLeft,
    rotateRight,
    resetRotation,
    pan,
    setPan,
    resetPan,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    downloadImage,
    resetAll,
    isLoading,
    isLoaded,
    hasError,
    containerRef,
    imageRef,
    getContainerProps,
    getImageProps,
    getZoomInButtonProps,
    getZoomOutButtonProps,
    getResetZoomButtonProps,
    getRotateLeftButtonProps,
    getRotateRightButtonProps,
    getResetRotationButtonProps,
    getFullscreenButtonProps,
    getDownloadButtonProps,
    getResetAllButtonProps,
  } = useImageViewer({
    src: 'https://example.com/image.jpg',
    alt: 'Example image',
    initialZoom: 1,
    initialRotation: 0,
    onZoomChange: (zoom) => console.log('Zoom changed:', zoom),
  });
  
  // Custom implementation
}
```

## Keyboard Navigation

The Image Viewer component supports the following keyboard shortcuts:

- **+**: Zoom in
- **-**: Zoom out
- **0**: Reset zoom
- **r**: Rotate right
- **l**: Rotate left
- **f**: Toggle fullscreen
- **d**: Download image
- **Escape**: Reset all transformations

## Gestures

The Image Viewer component supports the following gestures:

- **Drag**: Pan the image (when `enableDragToPan` is `true`)
- **Mouse wheel**: Zoom in/out (when `enableWheelToZoom` is `true`)

## Accessibility

The Image Viewer component follows accessibility best practices:

- All buttons have appropriate ARIA labels for screen readers
- The container element is focusable and can be navigated to with the keyboard
- Keyboard shortcuts are available for all actions
- The image has appropriate alt text for screen readers
