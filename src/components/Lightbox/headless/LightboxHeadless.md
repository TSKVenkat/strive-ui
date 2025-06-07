# LightboxHeadless

A headless component for creating customizable lightboxes with extensive flexibility for developers. The lightbox allows users to view, navigate, zoom, and interact with images in a modal overlay.

## Usage

```jsx
import { LightboxHeadless } from 'pulseui';

function MyLightbox() {
  const images = [
    {
      src: 'https://example.com/image1.jpg',
      alt: 'Image 1',
      caption: 'Beautiful landscape',
    },
    {
      src: 'https://example.com/image2.jpg',
      alt: 'Image 2',
      caption: 'City skyline',
    },
    {
      src: 'https://example.com/image3.jpg',
      alt: 'Image 3',
      caption: 'Mountain view',
    },
  ];

  return (
    <LightboxHeadless.Root
      images={images}
      initialIndex={0}
      infinite={true}
      showNavigation={true}
      showThumbnails={true}
      showCaptions={true}
      onImageChange={(index, image) => console.log('Image changed:', index, image)}
    >
      <div style={{ display: 'flex', gap: '10px' }}>
        {images.map((image, index) => (
          <LightboxHeadless.Trigger
            key={index}
            index={index}
            style={{
              cursor: 'pointer',
              border: 'none',
              padding: 0,
              background: 'none',
            }}
          >
            <img
              src={image.src}
              alt={image.alt}
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          </LightboxHeadless.Trigger>
        ))}
      </div>
      
      <LightboxHeadless.Portal>
        <LightboxHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
          }}
        />
        
        <LightboxHeadless.Container
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
        >
          <LightboxHeadless.Content
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <LightboxHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '16px',
              }}
            >
              <LightboxHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </LightboxHeadless.Close>
            </LightboxHeadless.Header>
            
            <LightboxHeadless.Body
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <LightboxHeadless.PrevButton
                style={{
                  position: 'absolute',
                  left: '16px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ‹
              </LightboxHeadless.PrevButton>
              
              <div
                style={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                  overflow: 'hidden',
                }}
              >
                <LightboxHeadless.Image
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
              
              <LightboxHeadless.NextButton
                style={{
                  position: 'absolute',
                  right: '16px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ›
              </LightboxHeadless.NextButton>
            </LightboxHeadless.Body>
            
            <LightboxHeadless.Footer
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <LightboxHeadless.Caption
                style={{
                  color: 'white',
                  textAlign: 'center',
                  maxWidth: '80%',
                }}
              />
              
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <LightboxHeadless.ZoomOutButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                >
                  -
                </LightboxHeadless.ZoomOutButton>
                
                <LightboxHeadless.ZoomResetButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                />
                
                <LightboxHeadless.ZoomInButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                >
                  +
                </LightboxHeadless.ZoomInButton>
                
                <LightboxHeadless.FullscreenButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                />
                
                <LightboxHeadless.SlideshowButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                />
                
                <LightboxHeadless.DownloadButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                />
              </div>
              
              <LightboxHeadless.Counter
                style={{
                  color: 'white',
                }}
              />
              
              <LightboxHeadless.Thumbnails
                style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  maxWidth: '100%',
                  padding: '8px 0',
                }}
              />
            </LightboxHeadless.Footer>
          </LightboxHeadless.Content>
        </LightboxHeadless.Container>
      </LightboxHeadless.Portal>
    </LightboxHeadless.Root>
  );
}
```

## Creating a Reusable Lightbox

```jsx
import { LightboxHeadless } from 'pulseui';

function CustomLightbox({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0 
}) {
  return (
    <LightboxHeadless.Root
      open={isOpen}
      onClose={onClose}
      images={images}
      initialIndex={initialIndex}
      infinite={true}
      showNavigation={true}
      showThumbnails={true}
      showCaptions={true}
    >
      <LightboxHeadless.Portal>
        <LightboxHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
          }}
        />
        
        <LightboxHeadless.Container
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
        >
          <LightboxHeadless.Content
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <LightboxHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '16px',
              }}
            >
              <LightboxHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
              >
                ×
              </LightboxHeadless.Close>
            </LightboxHeadless.Header>
            
            <LightboxHeadless.Body
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <LightboxHeadless.PrevButton
                style={{
                  position: 'absolute',
                  left: '16px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ‹
              </LightboxHeadless.PrevButton>
              
              <div
                style={{
                  maxWidth: '80%',
                  maxHeight: '80%',
                  overflow: 'hidden',
                }}
              >
                <LightboxHeadless.Image
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    transition: 'transform 0.3s ease',
                  }}
                />
              </div>
              
              <LightboxHeadless.NextButton
                style={{
                  position: 'absolute',
                  right: '16px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ›
              </LightboxHeadless.NextButton>
            </LightboxHeadless.Body>
            
            <LightboxHeadless.Footer
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <LightboxHeadless.Caption
                style={{
                  color: 'white',
                  textAlign: 'center',
                  maxWidth: '80%',
                }}
              />
              
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <LightboxHeadless.ZoomOutButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                >
                  -
                </LightboxHeadless.ZoomOutButton>
                
                <LightboxHeadless.ZoomResetButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                />
                
                <LightboxHeadless.ZoomInButton
                  style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                  }}
                >
                  +
                </LightboxHeadless.ZoomInButton>
              </div>
              
              <LightboxHeadless.Counter
                style={{
                  color: 'white',
                }}
              />
              
              <LightboxHeadless.Thumbnails
                style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  maxWidth: '100%',
                  padding: '8px 0',
                }}
              />
            </LightboxHeadless.Footer>
          </LightboxHeadless.Content>
        </LightboxHeadless.Container>
      </LightboxHeadless.Portal>
    </LightboxHeadless.Root>
  );
}

// Usage
function App() {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const images = [
    {
      src: 'https://example.com/image1.jpg',
      alt: 'Image 1',
      caption: 'Beautiful landscape',
    },
    {
      src: 'https://example.com/image2.jpg',
      alt: 'Image 2',
      caption: 'City skyline',
    },
    {
      src: 'https://example.com/image3.jpg',
      alt: 'Image 3',
      caption: 'Mountain view',
    },
  ];
  
  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setSelectedImageIndex(index);
              setIsLightboxOpen(true);
            }}
          />
        ))}
      </div>
      
      <CustomLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
}
```

## API

### LightboxHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `LightboxImage[]` | `[]` | Array of images to display in the lightbox |
| `initialIndex` | `number` | `0` | Initial index of the image to display |
| `infinite` | `boolean` | `true` | Whether to enable infinite loop navigation |
| `showNavigation` | `boolean` | `true` | Whether to show navigation controls |
| `showThumbnails` | `boolean` | `true` | Whether to show thumbnails |
| `showCaptions` | `boolean` | `true` | Whether to show image captions |
| `showCloseButton` | `boolean` | `true` | Whether to show the close button |
| `showZoomControls` | `boolean` | `true` | Whether to show the zoom controls |
| `showFullscreenButton` | `boolean` | `true` | Whether to show the fullscreen button |
| `showSlideshowButton` | `boolean` | `true` | Whether to show the slideshow button |
| `showDownloadButton` | `boolean` | `true` | Whether to show the download button |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the lightbox when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the lightbox when pressing Escape key |
| `slideshowInterval` | `number` | `3000` | Slideshow interval in milliseconds |
| `onImageChange` | `(index: number, image: LightboxImage) => void` | - | Callback when the current image changes |
| `onZoomChange` | `(zoom: number) => void` | - | Callback when the zoom level changes |
| `onEnterFullscreen` | `() => void` | - | Callback when entering fullscreen |
| `onExitFullscreen` | `() => void` | - | Callback when exiting fullscreen |
| `onSlideshowStart` | `() => void` | - | Callback when the slideshow starts |
| `onSlideshowStop` | `() => void` | - | Callback when the slideshow stops |
| `onDownload` | `(image: LightboxImage) => void` | - | Callback when an image is downloaded |

### LightboxImage

| Prop | Type | Description |
|------|------|-------------|
| `src` | `string` | Source URL of the image |
| `alt` | `string` | Alt text for the image |
| `thumbnail` | `string` | Optional thumbnail URL |
| `caption` | `string` | Optional caption for the image |
| `width` | `number` | Optional width of the image |
| `height` | `number` | Optional height of the image |

### Other Components

- `LightboxHeadless.Trigger`: Button that opens the lightbox
- `LightboxHeadless.Portal`: Portal container for the lightbox
- `LightboxHeadless.Backdrop`: Background overlay for the lightbox
- `LightboxHeadless.Container`: Container for the lightbox
- `LightboxHeadless.Content`: Content container for the lightbox
- `LightboxHeadless.Header`: Header section of the lightbox
- `LightboxHeadless.Body`: Body section of the lightbox
- `LightboxHeadless.Footer`: Footer section of the lightbox
- `LightboxHeadless.Close`: Button that closes the lightbox
- `LightboxHeadless.Image`: Image element
- `LightboxHeadless.Caption`: Caption element
- `LightboxHeadless.NextButton`: Button that navigates to the next image
- `LightboxHeadless.PrevButton`: Button that navigates to the previous image
- `LightboxHeadless.ZoomInButton`: Button that zooms in on the image
- `LightboxHeadless.ZoomOutButton`: Button that zooms out of the image
- `LightboxHeadless.ZoomResetButton`: Button that resets the zoom level
- `LightboxHeadless.FullscreenButton`: Button that toggles fullscreen mode
- `LightboxHeadless.SlideshowButton`: Button that toggles the slideshow
- `LightboxHeadless.DownloadButton`: Button that downloads the image
- `LightboxHeadless.Thumbnails`: Container for thumbnails
- `LightboxHeadless.Thumbnail`: Individual thumbnail element
- `LightboxHeadless.Counter`: Element that displays the current image index and total count

### useLightbox Hook

For even more control, you can use the `useLightbox` hook directly:

```jsx
import { useLightbox } from 'pulseui';

function MyCustomLightbox() {
  const {
    isOpen,
    open,
    close,
    toggle,
    images,
    setImages,
    addImage,
    removeImage,
    currentIndex,
    currentImage,
    goToImage,
    nextImage,
    prevImage,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isSlideshowActive,
    startSlideshow,
    stopSlideshow,
    toggleSlideshow,
    downloadImage,
    containerRef,
    imageRef,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
    getImageProps,
    getNextButtonProps,
    getPrevButtonProps,
    getZoomInButtonProps,
    getZoomOutButtonProps,
    getZoomResetButtonProps,
    getFullscreenButtonProps,
    getSlideshowButtonProps,
    getDownloadButtonProps,
    getThumbnailProps,
  } = useLightbox({
    images: [
      {
        src: 'https://example.com/image1.jpg',
        alt: 'Image 1',
        caption: 'Beautiful landscape',
      },
      {
        src: 'https://example.com/image2.jpg',
        alt: 'Image 2',
        caption: 'City skyline',
      },
    ],
    initialIndex: 0,
    onImageChange: (index, image) => console.log('Image changed:', index, image),
  });
  
  // Custom implementation
}
```

## Keyboard Navigation

The Lightbox component supports the following keyboard shortcuts:

- **Left Arrow**: Navigate to the previous image
- **Right Arrow**: Navigate to the next image
- **+**: Zoom in
- **-**: Zoom out
- **0**: Reset zoom
- **f**: Toggle fullscreen
- **p**: Toggle slideshow
- **d**: Download current image
- **Escape**: Close the lightbox

## Accessibility

The Lightbox component follows WAI-ARIA best practices for dialogs and image galleries:

- The lightbox container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the lightbox when open
- Focus is restored to the trigger element when the lightbox closes
- The escape key can be used to close the lightbox
- All buttons have appropriate ARIA labels for screen readers
- Navigation controls are keyboard accessible
- Thumbnails have `aria-current` to indicate the current image
