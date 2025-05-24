# ImageCropModalHeadless

A headless component for creating customizable image cropping modals with extensive flexibility for developers. The image crop modal allows users to select a portion of an image, rotate, zoom, and flip it before cropping.

## Usage

```jsx
import { ImageCropModalHeadless } from 'strive-ui';

function MyImageCropper() {
  const [croppedImage, setCroppedImage] = useState(null);

  return (
    <ImageCropModalHeadless.Root
      src="/path/to/image.jpg"
      aspectRatio={16/9}
      lockAspectRatio={true}
      onCrop={(croppedImageData, cropArea) => {
        console.log('Crop area:', cropArea);
        setCroppedImage(croppedImageData);
      }}
    >
      <ImageCropModalHeadless.Trigger
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Crop Image
      </ImageCropModalHeadless.Trigger>
      
      <ImageCropModalHeadless.Portal>
        <ImageCropModalHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
        
        <ImageCropModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '90vh',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ImageCropModalHeadless.Content>
            <ImageCropModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #eee'
              }}
            >
              <h3 style={{ margin: 0 }}>Crop Image</h3>
              <ImageCropModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </ImageCropModalHeadless.Close>
            </ImageCropModalHeadless.Header>
            
            <ImageCropModalHeadless.Body
              style={{
                position: 'relative',
                flex: 1,
                overflow: 'hidden',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '400px',
                  overflow: 'hidden'
                }}
              >
                <ImageCropModalHeadless.Image />
                <ImageCropModalHeadless.CropArea />
              </div>
              
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px'
                }}
              >
                <ImageCropModalHeadless.ZoomInButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </ImageCropModalHeadless.ZoomInButton>
                
                <ImageCropModalHeadless.ZoomOutButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </ImageCropModalHeadless.ZoomOutButton>
                
                <ImageCropModalHeadless.RotateLeftButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ↺
                </ImageCropModalHeadless.RotateLeftButton>
                
                <ImageCropModalHeadless.RotateRightButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ↻
                </ImageCropModalHeadless.RotateRightButton>
                
                <ImageCropModalHeadless.FlipHorizontalButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ↔
                </ImageCropModalHeadless.FlipHorizontalButton>
                
                <ImageCropModalHeadless.FlipVerticalButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ↕
                </ImageCropModalHeadless.FlipVerticalButton>
                
                <ImageCropModalHeadless.ResetButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </ImageCropModalHeadless.ResetButton>
              </div>
            </ImageCropModalHeadless.Body>
            
            <ImageCropModalHeadless.Footer
              style={{
                padding: '16px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <ImageCropModalHeadless.Close
                as="button"
                style={{
                  padding: '8px 16px',
                  background: '#f1f1f1',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </ImageCropModalHeadless.Close>
              <ImageCropModalHeadless.CropButton
                style={{
                  padding: '8px 16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Crop
              </ImageCropModalHeadless.CropButton>
            </ImageCropModalHeadless.Footer>
          </ImageCropModalHeadless.Content>
        </ImageCropModalHeadless.Container>
      </ImageCropModalHeadless.Portal>
      
      {croppedImage && (
        <div style={{ marginTop: '16px' }}>
          <h4>Cropped Image:</h4>
          <img 
            src={croppedImage} 
            alt="Cropped" 
            style={{ 
              maxWidth: '100%', 
              border: '1px solid #ccc' 
            }} 
          />
        </div>
      )}
    </ImageCropModalHeadless.Root>
  );
}
```

## Creating a Reusable Image Cropper

```jsx
import { ImageCropModalHeadless } from 'strive-ui';

function CustomImageCropper({ 
  isOpen, 
  onClose, 
  imageSrc, 
  onCrop,
  aspectRatio,
  title = 'Crop Image'
}) {
  return (
    <ImageCropModalHeadless.Root
      open={isOpen}
      onClose={onClose}
      src={imageSrc}
      aspectRatio={aspectRatio}
      onCrop={(croppedImage, cropArea) => {
        onCrop(croppedImage, cropArea);
      }}
    >
      <ImageCropModalHeadless.Portal>
        <ImageCropModalHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
        
        <ImageCropModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '80%',
            maxWidth: '800px',
            maxHeight: '90vh',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ImageCropModalHeadless.Content>
            <ImageCropModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #eee'
              }}
            >
              <h3 style={{ margin: 0 }}>{title}</h3>
              <ImageCropModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </ImageCropModalHeadless.Close>
            </ImageCropModalHeadless.Header>
            
            <ImageCropModalHeadless.Body
              style={{
                position: 'relative',
                flex: 1,
                overflow: 'hidden',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '400px',
                  overflow: 'hidden'
                }}
              >
                <ImageCropModalHeadless.Image />
                <ImageCropModalHeadless.CropArea />
              </div>
              
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                <ImageCropModalHeadless.ZoomInButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </ImageCropModalHeadless.ZoomInButton>
                
                <ImageCropModalHeadless.ZoomOutButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </ImageCropModalHeadless.ZoomOutButton>
                
                <ImageCropModalHeadless.RotateLeftButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ↺
                </ImageCropModalHeadless.RotateLeftButton>
                
                <ImageCropModalHeadless.RotateRightButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ↻
                </ImageCropModalHeadless.RotateRightButton>
                
                <ImageCropModalHeadless.FlipHorizontalButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ↔
                </ImageCropModalHeadless.FlipHorizontalButton>
                
                <ImageCropModalHeadless.FlipVerticalButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ↕
                </ImageCropModalHeadless.FlipVerticalButton>
                
                <ImageCropModalHeadless.ResetButton
                  style={{
                    padding: '8px',
                    background: '#f1f1f1',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </ImageCropModalHeadless.ResetButton>
              </div>
            </ImageCropModalHeadless.Body>
            
            <ImageCropModalHeadless.Footer
              style={{
                padding: '16px',
                borderTop: '1px solid #eee',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              }}
            >
              <ImageCropModalHeadless.Close
                as="button"
                style={{
                  padding: '8px 16px',
                  background: '#f1f1f1',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </ImageCropModalHeadless.Close>
              <ImageCropModalHeadless.CropButton
                style={{
                  padding: '8px 16px',
                  background: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Crop
              </ImageCropModalHeadless.CropButton>
            </ImageCropModalHeadless.Footer>
          </ImageCropModalHeadless.Content>
        </ImageCropModalHeadless.Container>
      </ImageCropModalHeadless.Portal>
    </ImageCropModalHeadless.Root>
  );
}

// Usage
function App() {
  const [isImageCropperOpen, setIsImageCropperOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setIsImageCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      
      {croppedImage && (
        <div style={{ marginTop: '16px' }}>
          <h4>Cropped Image:</h4>
          <img 
            src={croppedImage} 
            alt="Cropped" 
            style={{ 
              maxWidth: '100%', 
              border: '1px solid #ccc' 
            }} 
          />
        </div>
      )}
      
      <CustomImageCropper
        isOpen={isImageCropperOpen}
        onClose={() => setIsImageCropperOpen(false)}
        imageSrc={selectedImage}
        aspectRatio={1}
        onCrop={(croppedImage) => {
          setCroppedImage(croppedImage);
          setIsImageCropperOpen(false);
        }}
        title="Crop Profile Picture"
      />
    </div>
  );
}
```

## API

### ImageCropModalHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `''` | Source of the image to crop |
| `initialCropArea` | `CropArea` | `{ x: 0, y: 0, width: 0, height: 0 }` | Initial crop area |
| `aspectRatio` | `number` | - | Aspect ratio of the crop area (width / height) |
| `lockAspectRatio` | `boolean` | `false` | Whether to maintain the aspect ratio when resizing |
| `minWidth` | `number` | `10` | Minimum width of the crop area in pixels |
| `minHeight` | `number` | `10` | Minimum height of the crop area in pixels |
| `maxWidth` | `number` | - | Maximum width of the crop area in pixels |
| `maxHeight` | `number` | - | Maximum height of the crop area in pixels |
| `showGrid` | `boolean` | `true` | Whether to show grid lines |
| `showCropArea` | `boolean` | `true` | Whether to show the crop area |
| `showResizeHandles` | `boolean` | `true` | Whether to show resize handles |
| `showRotateControls` | `boolean` | `true` | Whether to show rotate controls |
| `showZoomControls` | `boolean` | `true` | Whether to show zoom controls |
| `showFlipControls` | `boolean` | `true` | Whether to show flip controls |
| `showResetButton` | `boolean` | `true` | Whether to show reset button |
| `showCropButton` | `boolean` | `true` | Whether to show crop button |
| `showCancelButton` | `boolean` | `true` | Whether to show cancel button |
| `closeOnCrop` | `boolean` | `true` | Whether to close the modal when the crop is complete |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the modal when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the modal when pressing Escape key |
| `onCropAreaChange` | `(cropArea: CropArea) => void` | - | Callback when crop area changes |
| `onCrop` | `(croppedImage: string, cropArea: CropArea) => void` | - | Callback when crop is complete |
| `onRotationChange` | `(rotation: number) => void` | - | Callback when rotation changes |
| `onZoomChange` | `(zoom: number) => void` | - | Callback when zoom changes |
| `onFlipChange` | `(flipX: boolean, flipY: boolean) => void` | - | Callback when flip changes |

### Other Components

- `ImageCropModalHeadless.Trigger`: Button that opens the image crop modal
- `ImageCropModalHeadless.Portal`: Portal container for the image crop modal
- `ImageCropModalHeadless.Backdrop`: Background overlay for the image crop modal
- `ImageCropModalHeadless.Container`: Container for the image crop modal
- `ImageCropModalHeadless.Content`: Content container for the image crop modal
- `ImageCropModalHeadless.Header`: Header section of the image crop modal
- `ImageCropModalHeadless.Body`: Body section of the image crop modal
- `ImageCropModalHeadless.Footer`: Footer section of the image crop modal
- `ImageCropModalHeadless.Close`: Button that closes the image crop modal
- `ImageCropModalHeadless.Image`: Image to crop
- `ImageCropModalHeadless.CropArea`: Crop area overlay
- `ImageCropModalHeadless.CropButton`: Button that crops the image
- `ImageCropModalHeadless.ResetButton`: Button that resets the crop area
- `ImageCropModalHeadless.RotateLeftButton`: Button that rotates the image left
- `ImageCropModalHeadless.RotateRightButton`: Button that rotates the image right
- `ImageCropModalHeadless.ZoomInButton`: Button that zooms in on the image
- `ImageCropModalHeadless.ZoomOutButton`: Button that zooms out of the image
- `ImageCropModalHeadless.FlipHorizontalButton`: Button that flips the image horizontally
- `ImageCropModalHeadless.FlipVerticalButton`: Button that flips the image vertically

### useImageCropModal Hook

For even more control, you can use the `useImageCropModal` hook directly:

```jsx
import { useImageCropModal } from 'strive-ui';

function MyCustomImageCropper() {
  const {
    isOpen,
    open,
    close,
    toggle,
    src,
    setSrc,
    cropArea,
    setCropArea,
    rotation,
    setRotation,
    zoom,
    setZoom,
    flipX,
    setFlipX,
    flipY,
    setFlipY,
    reset,
    crop,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
    getImageProps,
    getCropAreaProps,
    getCropButtonProps,
    getResetButtonProps,
    getRotateLeftButtonProps,
    getRotateRightButtonProps,
    getZoomInButtonProps,
    getZoomOutButtonProps,
    getFlipHorizontalButtonProps,
    getFlipVerticalButtonProps,
  } = useImageCropModal({
    src: '/path/to/image.jpg',
    aspectRatio: 16/9,
    onCrop: (croppedImage, cropArea) => {
      console.log('Cropped image:', croppedImage);
      console.log('Crop area:', cropArea);
    },
  });
  
  // Custom implementation
}
```

## Accessibility

The Image Crop Modal component follows WAI-ARIA best practices for dialogs:

- The image crop modal container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the image crop modal when open
- Focus is restored to the trigger element when the image crop modal closes
- The escape key can be used to close the image crop modal
- All buttons have appropriate ARIA labels for screen readers
