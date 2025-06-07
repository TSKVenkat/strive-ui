# PDFViewerModalHeadless

A headless component for creating customizable PDF viewer modals with extensive flexibility for developers. The PDF viewer modal allows users to view, navigate, zoom, rotate, download, and print PDF documents.

## Usage

```jsx
import { PDFViewerModalHeadless } from 'pulseui';

function MyPDFViewer() {
  return (
    <PDFViewerModalHeadless.Root
      src="https://example.com/document.pdf"
      initialPage={1}
      initialZoom={1}
      showToolbar={true}
      showSidebar={true}
      onPageChange={(page) => console.log('Page changed:', page)}
      onDocumentLoad={(numPages) => console.log('Document loaded with', numPages, 'pages')}
    >
      <PDFViewerModalHeadless.Trigger
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        View PDF
      </PDFViewerModalHeadless.Trigger>
      
      <PDFViewerModalHeadless.Portal>
        <PDFViewerModalHeadless.Backdrop
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
        
        <PDFViewerModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '90%',
            maxWidth: '1200px',
            height: '90vh',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <PDFViewerModalHeadless.Content>
            <PDFViewerModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #eee'
              }}
            >
              <h3 style={{ margin: 0 }}>PDF Document</h3>
              <PDFViewerModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </PDFViewerModalHeadless.Close>
            </PDFViewerModalHeadless.Header>
            
            <PDFViewerModalHeadless.Toolbar
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderBottom: '1px solid #eee',
                gap: '8px'
              }}
            >
              <PDFViewerModalHeadless.SidebarToggleButton
                style={{
                  background: 'none',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PDFViewerModalHeadless.PrevPageButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                />
                
                <PDFViewerModalHeadless.PageInput
                  label=""
                  style={{
                    width: '40px',
                    padding: '4px',
                    textAlign: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                
                <PDFViewerModalHeadless.NextPageButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PDFViewerModalHeadless.ZoomOutButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </PDFViewerModalHeadless.ZoomOutButton>
                
                <PDFViewerModalHeadless.ZoomResetButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                />
                
                <PDFViewerModalHeadless.ZoomInButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </PDFViewerModalHeadless.ZoomInButton>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PDFViewerModalHeadless.RotateLeftButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  ↺
                </PDFViewerModalHeadless.RotateLeftButton>
                
                <PDFViewerModalHeadless.RotateRightButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  ↻
                </PDFViewerModalHeadless.RotateRightButton>
              </div>
              
              <div style={{ flex: 1 }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PDFViewerModalHeadless.SearchInput
                  label=""
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                
                <PDFViewerModalHeadless.SearchButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  🔍
                </PDFViewerModalHeadless.SearchButton>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PDFViewerModalHeadless.DownloadButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  ⬇️
                </PDFViewerModalHeadless.DownloadButton>
                
                <PDFViewerModalHeadless.PrintButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  🖨️
                </PDFViewerModalHeadless.PrintButton>
                
                <PDFViewerModalHeadless.FullscreenButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  ⛶
                </PDFViewerModalHeadless.FullscreenButton>
              </div>
            </PDFViewerModalHeadless.Toolbar>
            
            <PDFViewerModalHeadless.Body
              style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden'
              }}
            >
              <PDFViewerModalHeadless.Sidebar
                style={{
                  width: '200px',
                  borderRight: '1px solid #eee',
                  padding: '16px',
                  overflowY: 'auto'
                }}
              >
                <h4 style={{ margin: '0 0 16px 0' }}>Thumbnails</h4>
                {/* Thumbnails would be rendered here */}
              </PDFViewerModalHeadless.Sidebar>
              
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}
              >
                <PDFViewerModalHeadless.Document
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                  }}
                >
                  {/* PDF content would be rendered here */}
                  {/* This is where you would integrate with a PDF rendering library */}
                </PDFViewerModalHeadless.Document>
              </div>
            </PDFViewerModalHeadless.Body>
          </PDFViewerModalHeadless.Content>
        </PDFViewerModalHeadless.Container>
      </PDFViewerModalHeadless.Portal>
    </PDFViewerModalHeadless.Root>
  );
}
```

## Creating a Reusable PDF Viewer Modal

```jsx
import { PDFViewerModalHeadless } from 'pulseui';

function CustomPDFViewer({ 
  isOpen, 
  onClose, 
  pdfSrc, 
  title = 'PDF Document'
}) {
  return (
    <PDFViewerModalHeadless.Root
      open={isOpen}
      onClose={onClose}
      src={pdfSrc}
      showSidebar={true}
      showToolbar={true}
    >
      <PDFViewerModalHeadless.Portal>
        <PDFViewerModalHeadless.Backdrop
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
        
        <PDFViewerModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            width: '90%',
            maxWidth: '1200px',
            height: '90vh',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <PDFViewerModalHeadless.Content>
            <PDFViewerModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderBottom: '1px solid #eee'
              }}
            >
              <h3 style={{ margin: 0 }}>{title}</h3>
              <PDFViewerModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </PDFViewerModalHeadless.Close>
            </PDFViewerModalHeadless.Header>
            
            <PDFViewerModalHeadless.Toolbar
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                borderBottom: '1px solid #eee',
                gap: '8px'
              }}
            >
              <PDFViewerModalHeadless.SidebarToggleButton
                style={{
                  background: 'none',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PDFViewerModalHeadless.PrevPageButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                />
                
                <PDFViewerModalHeadless.PageInput
                  label=""
                  style={{
                    width: '40px',
                    padding: '4px',
                    textAlign: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                
                <PDFViewerModalHeadless.NextPageButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PDFViewerModalHeadless.ZoomOutButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  -
                </PDFViewerModalHeadless.ZoomOutButton>
                
                <PDFViewerModalHeadless.ZoomResetButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                />
                
                <PDFViewerModalHeadless.ZoomInButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  +
                </PDFViewerModalHeadless.ZoomInButton>
              </div>
              
              <div style={{ flex: 1 }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PDFViewerModalHeadless.DownloadButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  ⬇️
                </PDFViewerModalHeadless.DownloadButton>
                
                <PDFViewerModalHeadless.PrintButton
                  style={{
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    cursor: 'pointer'
                  }}
                >
                  🖨️
                </PDFViewerModalHeadless.PrintButton>
              </div>
            </PDFViewerModalHeadless.Toolbar>
            
            <PDFViewerModalHeadless.Body
              style={{
                display: 'flex',
                flex: 1,
                overflow: 'hidden'
              }}
            >
              <PDFViewerModalHeadless.Sidebar
                style={{
                  width: '200px',
                  borderRight: '1px solid #eee',
                  padding: '16px',
                  overflowY: 'auto'
                }}
              >
                <h4 style={{ margin: '0 0 16px 0' }}>Thumbnails</h4>
                {/* Thumbnails would be rendered here */}
              </PDFViewerModalHeadless.Sidebar>
              
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start'
                }}
              >
                <PDFViewerModalHeadless.Document
                  style={{
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                  }}
                >
                  {/* PDF content would be rendered here */}
                  {/* This is where you would integrate with a PDF rendering library */}
                </PDFViewerModalHeadless.Document>
              </div>
            </PDFViewerModalHeadless.Body>
          </PDFViewerModalHeadless.Content>
        </PDFViewerModalHeadless.Container>
      </PDFViewerModalHeadless.Portal>
    </PDFViewerModalHeadless.Root>
  );
}

// Usage
function App() {
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  
  return (
    <div>
      <button
        onClick={() => setIsPDFViewerOpen(true)}
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        View PDF
      </button>
      
      <CustomPDFViewer
        isOpen={isPDFViewerOpen}
        onClose={() => setIsPDFViewerOpen(false)}
        pdfSrc="https://example.com/document.pdf"
        title="User Manual"
      />
    </div>
  );
}
```

## Integration with PDF.js

The PDFViewerModalHeadless component is designed to be used with a PDF rendering library like PDF.js. Here's an example of how to integrate it with PDF.js:

```jsx
import { PDFViewerModalHeadless } from 'pulseui';
import { Document, Page, pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PDFViewerWithPDFJS() {
  const [numPages, setNumPages] = useState(null);
  
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
  
  return (
    <PDFViewerModalHeadless.Root
      src="https://example.com/document.pdf"
      onDocumentLoad={setNumPages}
    >
      <PDFViewerModalHeadless.Trigger>
        View PDF
      </PDFViewerModalHeadless.Trigger>
      
      <PDFViewerModalHeadless.Portal>
        <PDFViewerModalHeadless.Backdrop />
        
        <PDFViewerModalHeadless.Container>
          <PDFViewerModalHeadless.Content>
            <PDFViewerModalHeadless.Header>
              <h3>PDF Document</h3>
              <PDFViewerModalHeadless.Close />
            </PDFViewerModalHeadless.Header>
            
            <PDFViewerModalHeadless.Toolbar>
              {/* Toolbar controls */}
            </PDFViewerModalHeadless.Toolbar>
            
            <PDFViewerModalHeadless.Body>
              <PDFViewerModalHeadless.Document>
                {({ src, zoom, rotation }) => (
                  <Document
                    file={src}
                    onLoadSuccess={onDocumentLoadSuccess}
                    options={{
                      cMapUrl: 'cmaps/',
                      cMapPacked: true,
                    }}
                  >
                    <Page
                      pageNumber={currentPage}
                      scale={zoom}
                      rotate={rotation}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </Document>
                )}
              </PDFViewerModalHeadless.Document>
            </PDFViewerModalHeadless.Body>
          </PDFViewerModalHeadless.Content>
        </PDFViewerModalHeadless.Container>
      </PDFViewerModalHeadless.Portal>
    </PDFViewerModalHeadless.Root>
  );
}
```

## API

### PDFViewerModalHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `''` | Source of the PDF document |
| `initialPage` | `number` | `1` | Initial page number |
| `initialZoom` | `number` | `1` | Initial zoom level |
| `showToolbar` | `boolean` | `true` | Whether to show the toolbar |
| `showSidebar` | `boolean` | `true` | Whether to show the sidebar |
| `showNavigation` | `boolean` | `true` | Whether to show the navigation buttons |
| `showZoomControls` | `boolean` | `true` | Whether to show the zoom controls |
| `showPageControls` | `boolean` | `true` | Whether to show the page controls |
| `showDownloadButton` | `boolean` | `true` | Whether to show the download button |
| `showPrintButton` | `boolean` | `true` | Whether to show the print button |
| `showFullscreenButton` | `boolean` | `true` | Whether to show the fullscreen button |
| `showRotateButtons` | `boolean` | `true` | Whether to show the rotate buttons |
| `showSearchBox` | `boolean` | `true` | Whether to show the search box |
| `showCloseButton` | `boolean` | `true` | Whether to show the close button |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the modal when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the modal when pressing Escape key |
| `onPageChange` | `(page: number) => void` | - | Callback when the page changes |
| `onZoomChange` | `(zoom: number) => void` | - | Callback when the zoom changes |
| `onDocumentLoad` | `(numPages: number) => void` | - | Callback when the document is loaded |
| `onDocumentLoadError` | `(error: Error) => void` | - | Callback when the document fails to load |
| `onDownload` | `() => void` | - | Callback when the document is downloaded |
| `onPrint` | `() => void` | - | Callback when the document is printed |
| `onEnterFullscreen` | `() => void` | - | Callback when the document enters fullscreen |
| `onExitFullscreen` | `() => void` | - | Callback when the document exits fullscreen |
| `onRotate` | `(rotation: number) => void` | - | Callback when the document is rotated |
| `onSearch` | `(query: string) => void` | - | Callback when the document is searched |

### Other Components

- `PDFViewerModalHeadless.Trigger`: Button that opens the PDF viewer modal
- `PDFViewerModalHeadless.Portal`: Portal container for the PDF viewer modal
- `PDFViewerModalHeadless.Backdrop`: Background overlay for the PDF viewer modal
- `PDFViewerModalHeadless.Container`: Container for the PDF viewer modal
- `PDFViewerModalHeadless.Content`: Content container for the PDF viewer modal
- `PDFViewerModalHeadless.Header`: Header section of the PDF viewer modal
- `PDFViewerModalHeadless.Body`: Body section of the PDF viewer modal
- `PDFViewerModalHeadless.Footer`: Footer section of the PDF viewer modal
- `PDFViewerModalHeadless.Close`: Button that closes the PDF viewer modal
- `PDFViewerModalHeadless.Document`: Container for the PDF document
- `PDFViewerModalHeadless.Toolbar`: Container for the toolbar controls
- `PDFViewerModalHeadless.Sidebar`: Container for the sidebar
- `PDFViewerModalHeadless.NextPageButton`: Button that navigates to the next page
- `PDFViewerModalHeadless.PrevPageButton`: Button that navigates to the previous page
- `PDFViewerModalHeadless.PageInput`: Input for entering a page number
- `PDFViewerModalHeadless.ZoomInButton`: Button that zooms in on the document
- `PDFViewerModalHeadless.ZoomOutButton`: Button that zooms out of the document
- `PDFViewerModalHeadless.ZoomResetButton`: Button that resets the zoom level
- `PDFViewerModalHeadless.RotateLeftButton`: Button that rotates the document left
- `PDFViewerModalHeadless.RotateRightButton`: Button that rotates the document right
- `PDFViewerModalHeadless.DownloadButton`: Button that downloads the document
- `PDFViewerModalHeadless.PrintButton`: Button that prints the document
- `PDFViewerModalHeadless.FullscreenButton`: Button that toggles fullscreen mode
- `PDFViewerModalHeadless.SidebarToggleButton`: Button that toggles the sidebar
- `PDFViewerModalHeadless.SearchInput`: Input for searching the document
- `PDFViewerModalHeadless.SearchButton`: Button that initiates a search

### usePDFViewerModal Hook

For even more control, you can use the `usePDFViewerModal` hook directly:

```jsx
import { usePDFViewerModal } from 'pulseui';

function MyCustomPDFViewer() {
  const {
    isOpen,
    open,
    close,
    toggle,
    src,
    setSrc,
    currentPage,
    numPages,
    goToPage,
    nextPage,
    prevPage,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    rotation,
    setRotation,
    rotateLeft,
    rotateRight,
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    search,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    download,
    print,
    isLoading,
    isLoaded,
    hasError,
    errorMessage,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
    getDocumentProps,
    getNextPageButtonProps,
    getPrevPageButtonProps,
    getPageInputProps,
    getZoomInButtonProps,
    getZoomOutButtonProps,
    getZoomResetButtonProps,
    getRotateLeftButtonProps,
    getRotateRightButtonProps,
    getDownloadButtonProps,
    getPrintButtonProps,
    getFullscreenButtonProps,
    getSidebarToggleButtonProps,
    getSearchInputProps,
    getSearchButtonProps,
  } = usePDFViewerModal({
    src: 'https://example.com/document.pdf',
    initialPage: 1,
    initialZoom: 1,
    onPageChange: (page) => console.log('Page changed:', page),
    onDocumentLoad: (numPages) => console.log('Document loaded with', numPages, 'pages'),
  });
  
  // Custom implementation
}
```

## Accessibility

The PDF Viewer Modal component follows WAI-ARIA best practices for dialogs and document viewers:

- The PDF viewer modal container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the PDF viewer modal when open
- Focus is restored to the trigger element when the PDF viewer modal closes
- The escape key can be used to close the PDF viewer modal
- All buttons have appropriate ARIA labels for screen readers
- Navigation controls are keyboard accessible
