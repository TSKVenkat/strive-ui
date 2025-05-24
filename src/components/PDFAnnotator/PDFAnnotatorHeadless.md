# PDFAnnotatorHeadless

A headless component for creating customizable PDF annotation interfaces with support for various annotation types and extensive flexibility for developers.

## Usage

```jsx
import { PDFAnnotatorHeadless } from 'strive-ui';

function MyPDFAnnotator() {
  const handleAnnotationAdd = (annotation) => {
    console.log('Annotation added:', annotation);
  };

  return (
    <PDFAnnotatorHeadless.Root
      pdfFile="https://example.com/sample.pdf"
      defaultColor="#FF0000"
      enableTextSelection={true}
      enableDrawing={true}
      enableShapes={true}
      onAnnotationAdd={handleAnnotationAdd}
      style={{ height: '800px' }}
    >
      <PDFAnnotatorHeadless.Toolbar>
        {({ 
          currentTool, 
          setCurrentTool, 
          currentShapeType, 
          setCurrentShapeType,
          scale,
          setScale,
          currentPage,
          numPages,
          setCurrentPage
        }) => (
          <div style={{ display: 'flex', padding: '10px', borderBottom: '1px solid #ccc', gap: '10px' }}>
            <div>
              <button 
                onClick={() => setCurrentTool(currentTool === 'highlight' ? null : 'highlight')}
                style={{ background: currentTool === 'highlight' ? '#eee' : 'transparent' }}
              >
                Highlight
              </button>
              <button 
                onClick={() => setCurrentTool(currentTool === 'text' ? null : 'text')}
                style={{ background: currentTool === 'text' ? '#eee' : 'transparent' }}
              >
                Add Text
              </button>
              <button 
                onClick={() => setCurrentTool(currentTool === 'drawing' ? null : 'drawing')}
                style={{ background: currentTool === 'drawing' ? '#eee' : 'transparent' }}
              >
                Draw
              </button>
              <button 
                onClick={() => setCurrentTool(currentTool === 'shape' ? null : 'shape')}
                style={{ background: currentTool === 'shape' ? '#eee' : 'transparent' }}
              >
                Shape
              </button>
            </div>
            
            {currentTool === 'shape' && (
              <div>
                <select 
                  value={currentShapeType}
                  onChange={(e) => setCurrentShapeType(e.target.value)}
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Circle</option>
                  <option value="arrow">Arrow</option>
                  <option value="line">Line</option>
                </select>
              </div>
            )}
            
            <div>
              <button onClick={() => setScale(scale - 0.1)}>-</button>
              <span>{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(scale + 0.1)}>+</button>
            </div>
          </div>
        )}
      </PDFAnnotatorHeadless.Toolbar>
      
      <PDFAnnotatorHeadless.Container>
        <PDFAnnotatorHeadless.Loading>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading PDF...
          </div>
        </PDFAnnotatorHeadless.Loading>
        
        <PDFAnnotatorHeadless.Error>
          {({ error }) => (
            <div style={{ color: 'red', padding: '20px' }}>
              Error loading PDF: {error.message}
            </div>
          )}
        </PDFAnnotatorHeadless.Error>
        
        {[1, 2, 3, 4, 5].map(pageNumber => (
          <PDFAnnotatorHeadless.Page 
            key={pageNumber} 
            pageNumber={pageNumber}
            style={{ 
              marginBottom: '20px', 
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              background: 'white',
              width: '800px',
              height: '1000px',
              display: pageNumber === currentPage ? 'block' : 'none'
            }}
          >
            {/* This would be your PDF page content */}
            <div style={{ padding: '20px' }}>
              <h2>Page {pageNumber}</h2>
              <p>This is sample content for page {pageNumber}.</p>
            </div>
            
            <PDFAnnotatorHeadless.AnnotationLayer pageNumber={pageNumber}>
              <PDFAnnotatorHeadless.Annotations pageNumber={pageNumber}>
                {({ annotations, selectedAnnotation, selectAnnotation, deleteAnnotation }) => (
                  <>
                    {annotations.map(annotation => (
                      <div 
                        key={annotation.id}
                        style={{
                          position: 'absolute',
                          left: `${annotation.position.x}px`,
                          top: `${annotation.position.y}px`,
                          width: annotation.position.width ? `${annotation.position.width}px` : 'auto',
                          height: annotation.position.height ? `${annotation.position.height}px` : 'auto',
                          background: annotation.type === 'highlight' ? annotation.color : 'transparent',
                          opacity: annotation.opacity,
                          border: selectedAnnotation?.id === annotation.id ? '2px dashed blue' : 'none',
                          cursor: 'pointer',
                          padding: annotation.type === 'text' ? '5px' : 0,
                        }}
                        onClick={() => selectAnnotation(annotation.id)}
                      >
                        {annotation.type === 'text' && annotation.content}
                        
                        {selectedAnnotation?.id === annotation.id && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAnnotation(annotation.id);
                            }}
                            style={{
                              position: 'absolute',
                              top: '-20px',
                              right: '-20px',
                              background: 'red',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </PDFAnnotatorHeadless.Annotations>
            </PDFAnnotatorHeadless.AnnotationLayer>
          </PDFAnnotatorHeadless.Page>
        ))}
      </PDFAnnotatorHeadless.Container>
      
      <PDFAnnotatorHeadless.Pagination>
        {({ 
          currentPage, 
          numPages, 
          setCurrentPage, 
          goToNextPage, 
          goToPreviousPage,
          canGoToNextPage,
          canGoToPreviousPage
        }) => (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px', gap: '10px' }}>
            <button onClick={goToPreviousPage} disabled={!canGoToPreviousPage}>
              Previous
            </button>
            <span>
              Page {currentPage} of {numPages}
            </span>
            <button onClick={goToNextPage} disabled={!canGoToNextPage}>
              Next
            </button>
          </div>
        )}
      </PDFAnnotatorHeadless.Pagination>
    </PDFAnnotatorHeadless.Root>
  );
}
```

## API

### PDFAnnotatorHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pdfFile` | `string` | - | PDF file URL or base64 data |
| `initialAnnotations` | `Annotation[]` | `[]` | Initial annotations |
| `defaultColor` | `string` | `'#FF0000'` | Default color for new annotations |
| `defaultOpacity` | `number` | `0.5` | Default opacity for new annotations |
| `defaultLineWidth` | `number` | `2` | Default line width for drawing annotations |
| `defaultAuthor` | `string` | `''` | Default author for new annotations |
| `enableTextSelection` | `boolean` | `true` | Whether to enable text selection |
| `enableDrawing` | `boolean` | `true` | Whether to enable drawing |
| `enableShapes` | `boolean` | `true` | Whether to enable shapes |
| `onAnnotationsChange` | `(annotations: Annotation[]) => void` | - | Callback when annotations change |
| `onAnnotationAdd` | `(annotation: Annotation) => void` | - | Callback when an annotation is added |
| `onAnnotationUpdate` | `(annotation: Annotation) => void` | - | Callback when an annotation is updated |
| `onAnnotationDelete` | `(annotationId: string) => void` | - | Callback when an annotation is deleted |
| `onAnnotationSelect` | `(annotation: Annotation \| null) => void` | - | Callback when an annotation is selected |
| `onPDFLoad` | `(numPages: number) => void` | - | Callback when the PDF is loaded |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |

### Annotation Types

```typescript
type AnnotationType = 'highlight' | 'underline' | 'strikethrough' | 'text' | 'drawing' | 'shape';
type ShapeType = 'rectangle' | 'circle' | 'arrow' | 'line';

interface Annotation {
  id: string;
  type: AnnotationType;
  pageNumber: number;
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  content?: string;
  color: string;
  opacity: number;
  lineWidth?: number;
  points?: Point[];
  shapeType?: ShapeType;
  createdAt: number;
  updatedAt: number;
  author?: string;
}
```

### Other Components

- `PDFAnnotatorHeadless.Container`: Container for the PDF viewer
- `PDFAnnotatorHeadless.Page`: Represents a PDF page
- `PDFAnnotatorHeadless.AnnotationLayer`: Layer for annotations on a page
- `PDFAnnotatorHeadless.Annotations`: Renders annotations for a specific page
- `PDFAnnotatorHeadless.Toolbar`: Provides access to annotation tools
- `PDFAnnotatorHeadless.Pagination`: Interface for navigating between pages
- `PDFAnnotatorHeadless.Error`: Displays error messages
- `PDFAnnotatorHeadless.Loading`: Displays a loading state

### usePDFAnnotator Hook

For even more control, you can use the `usePDFAnnotator` hook directly:

```jsx
import { usePDFAnnotator } from 'strive-ui';

function MyCustomPDFAnnotator() {
  const {
    annotations,
    selectedAnnotation,
    currentPage,
    numPages,
    currentTool,
    isLoaded,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    selectAnnotation,
    setCurrentPage,
    setCurrentTool,
    // ...other properties and methods
  } = usePDFAnnotator({
    pdfFile: 'https://example.com/sample.pdf',
    defaultColor: '#0000FF',
  });
  
  // Custom implementation
}
```

## Notes

This component is a headless implementation that provides the core functionality for PDF annotation. In a real-world application, you would need to integrate a PDF rendering library like `pdf.js` for actual PDF rendering. The current implementation includes placeholders for PDF rendering logic.
