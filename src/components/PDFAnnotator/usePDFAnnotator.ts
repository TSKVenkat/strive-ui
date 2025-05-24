import { useState, useRef, useCallback, useEffect } from 'react';

export type AnnotationType = 'highlight' | 'underline' | 'strikethrough' | 'text' | 'drawing' | 'shape';
export type ShapeType = 'rectangle' | 'circle' | 'arrow' | 'line';

export interface Point {
  x: number;
  y: number;
}

export interface Annotation {
  /**
   * Unique ID of the annotation
   */
  id: string;
  /**
   * Type of annotation
   */
  type: AnnotationType;
  /**
   * Page number where the annotation is located
   */
  pageNumber: number;
  /**
   * Position of the annotation
   */
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  /**
   * Content of the annotation (for text annotations)
   */
  content?: string;
  /**
   * Color of the annotation
   */
  color: string;
  /**
   * Opacity of the annotation
   */
  opacity: number;
  /**
   * Line width for drawing annotations
   */
  lineWidth?: number;
  /**
   * Points for drawing annotations
   */
  points?: Point[];
  /**
   * Shape type for shape annotations
   */
  shapeType?: ShapeType;
  /**
   * Creation timestamp
   */
  createdAt: number;
  /**
   * Last modified timestamp
   */
  updatedAt: number;
  /**
   * Author of the annotation
   */
  author?: string;
}

export interface PDFAnnotatorOptions {
  /**
   * Initial PDF file URL or base64 data
   */
  pdfFile?: string;
  /**
   * Initial annotations
   */
  initialAnnotations?: Annotation[];
  /**
   * Default color for new annotations
   */
  defaultColor?: string;
  /**
   * Default opacity for new annotations
   */
  defaultOpacity?: number;
  /**
   * Default line width for drawing annotations
   */
  defaultLineWidth?: number;
  /**
   * Default author for new annotations
   */
  defaultAuthor?: string;
  /**
   * Whether to enable text selection
   */
  enableTextSelection?: boolean;
  /**
   * Whether to enable drawing
   */
  enableDrawing?: boolean;
  /**
   * Whether to enable shapes
   */
  enableShapes?: boolean;
  /**
   * Callback when annotations change
   */
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  /**
   * Callback when an annotation is added
   */
  onAnnotationAdd?: (annotation: Annotation) => void;
  /**
   * Callback when an annotation is updated
   */
  onAnnotationUpdate?: (annotation: Annotation) => void;
  /**
   * Callback when an annotation is deleted
   */
  onAnnotationDelete?: (annotationId: string) => void;
  /**
   * Callback when an annotation is selected
   */
  onAnnotationSelect?: (annotation: Annotation | null) => void;
  /**
   * Callback when the PDF is loaded
   */
  onPDFLoad?: (numPages: number) => void;
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
}

export interface UsePDFAnnotatorReturn {
  /**
   * Current annotations
   */
  annotations: Annotation[];
  /**
   * Currently selected annotation
   */
  selectedAnnotation: Annotation | null;
  /**
   * Current page number
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  numPages: number;
  /**
   * Current tool
   */
  currentTool: AnnotationType | null;
  /**
   * Current shape type
   */
  currentShapeType: ShapeType;
  /**
   * Whether the PDF is loaded
   */
  isLoaded: boolean;
  /**
   * Error if any
   */
  error: Error | null;
  /**
   * Current scale/zoom level
   */
  scale: number;
  /**
   * Add an annotation
   */
  addAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  /**
   * Update an annotation
   */
  updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => void;
  /**
   * Delete an annotation
   */
  deleteAnnotation: (annotationId: string) => void;
  /**
   * Select an annotation
   */
  selectAnnotation: (annotationId: string | null) => void;
  /**
   * Set the current page
   */
  setCurrentPage: (pageNumber: number) => void;
  /**
   * Set the current tool
   */
  setCurrentTool: (tool: AnnotationType | null) => void;
  /**
   * Set the current shape type
   */
  setCurrentShapeType: (shapeType: ShapeType) => void;
  /**
   * Set the scale/zoom level
   */
  setScale: (scale: number) => void;
  /**
   * Load a PDF file
   */
  loadPDF: (pdfFile: string) => void;
  /**
   * Get annotations for a specific page
   */
  getPageAnnotations: (pageNumber: number) => Annotation[];
  /**
   * Get props for the PDF container
   */
  getPDFContainerProps: () => {
    ref: React.RefObject<HTMLDivElement>;
    style: React.CSSProperties;
  };
  /**
   * Get props for the annotation layer
   */
  getAnnotationLayerProps: (pageNumber: number) => {
    ref: React.RefObject<HTMLDivElement>;
    style: React.CSSProperties;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
  };
}

/**
 * Hook for creating a PDF annotator
 */
export function usePDFAnnotator(options: PDFAnnotatorOptions = {}): UsePDFAnnotatorReturn {
  const {
    pdfFile,
    initialAnnotations = [],
    defaultColor = '#FF0000',
    defaultOpacity = 0.5,
    defaultLineWidth = 2,
    defaultAuthor = '',
    enableTextSelection = true,
    enableDrawing = true,
    enableShapes = true,
    onAnnotationsChange,
    onAnnotationAdd,
    onAnnotationUpdate,
    onAnnotationDelete,
    onAnnotationSelect,
    onPDFLoad,
    onError,
  } = options;

  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentTool, setCurrentTool] = useState<AnnotationType | null>(null);
  const [currentShapeType, setCurrentShapeType] = useState<ShapeType>('rectangle');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [shapeStart, setShapeStart] = useState<Point | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const annotationLayerRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Load PDF if provided
  useEffect(() => {
    if (pdfFile) {
      loadPDF(pdfFile);
    }
  }, [pdfFile]);

  // Notify when annotations change
  useEffect(() => {
    onAnnotationsChange?.(annotations);
  }, [annotations, onAnnotationsChange]);

  // Load PDF
  const loadPDF = useCallback((pdfFile: string) => {
    try {
      setIsLoaded(false);
      setError(null);
      
      // In a real implementation, you would use a library like pdf.js to load the PDF
      // This is a simplified version that simulates PDF loading
      setTimeout(() => {
        // Simulate successful PDF loading with 5 pages
        setNumPages(5);
        setIsLoaded(true);
        onPDFLoad?.(5);
      }, 1000);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    }
  }, [onPDFLoad, onError]);

  // Add annotation
  const addAnnotation = useCallback((annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now();
    const newAnnotation: Annotation = {
      ...annotation,
      id: `annotation-${now}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    setAnnotations(prev => [...prev, newAnnotation]);
    onAnnotationAdd?.(newAnnotation);
  }, [onAnnotationAdd]);

  // Update annotation
  const updateAnnotation = useCallback((annotationId: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => {
      const index = prev.findIndex(a => a.id === annotationId);
      if (index === -1) return prev;
      
      const updatedAnnotation = {
        ...prev[index],
        ...updates,
        updatedAt: Date.now(),
      };
      
      const newAnnotations = [...prev];
      newAnnotations[index] = updatedAnnotation;
      
      onAnnotationUpdate?.(updatedAnnotation);
      return newAnnotations;
    });
  }, [onAnnotationUpdate]);

  // Delete annotation
  const deleteAnnotation = useCallback((annotationId: string) => {
    setAnnotations(prev => {
      const newAnnotations = prev.filter(a => a.id !== annotationId);
      onAnnotationDelete?.(annotationId);
      return newAnnotations;
    });
    
    if (selectedAnnotation?.id === annotationId) {
      setSelectedAnnotation(null);
      onAnnotationSelect?.(null);
    }
  }, [selectedAnnotation, onAnnotationDelete, onAnnotationSelect]);

  // Select annotation
  const selectAnnotation = useCallback((annotationId: string | null) => {
    if (!annotationId) {
      setSelectedAnnotation(null);
      onAnnotationSelect?.(null);
      return;
    }
    
    const annotation = annotations.find(a => a.id === annotationId);
    setSelectedAnnotation(annotation || null);
    onAnnotationSelect?.(annotation || null);
  }, [annotations, onAnnotationSelect]);

  // Get annotations for a specific page
  const getPageAnnotations = useCallback((pageNumber: number) => {
    return annotations.filter(a => a.pageNumber === pageNumber);
  }, [annotations]);

  // Handle mouse down on annotation layer
  const handleMouseDown = useCallback((e: React.MouseEvent, pageNumber: number) => {
    if (!currentTool) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    if (currentTool === 'drawing') {
      setIsDrawing(true);
      setDrawingPoints([{ x, y }]);
    } else if (currentTool === 'shape') {
      setShapeStart({ x, y });
    } else if (currentTool === 'text') {
      // Add a text annotation at the clicked position
      addAnnotation({
        type: 'text',
        pageNumber,
        position: { x, y, width: 200, height: 100 },
        content: '',
        color: defaultColor,
        opacity: defaultOpacity,
        author: defaultAuthor,
      });
    } else if (currentTool === 'highlight' || currentTool === 'underline' || currentTool === 'strikethrough') {
      // In a real implementation, you would get the selected text and its position
      // This is a simplified version that adds a highlight at the clicked position
      addAnnotation({
        type: currentTool,
        pageNumber,
        position: { x, y, width: 100, height: 20 },
        color: defaultColor,
        opacity: defaultOpacity,
        author: defaultAuthor,
      });
    }
  }, [currentTool, scale, addAnnotation, defaultColor, defaultOpacity, defaultAuthor]);

  // Handle mouse move on annotation layer
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!currentTool) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    if (currentTool === 'drawing' && isDrawing) {
      setDrawingPoints(prev => [...prev, { x, y }]);
    }
  }, [currentTool, isDrawing, scale]);

  // Handle mouse up on annotation layer
  const handleMouseUp = useCallback((e: React.MouseEvent, pageNumber: number) => {
    if (!currentTool) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    if (currentTool === 'drawing' && isDrawing) {
      setIsDrawing(false);
      
      if (drawingPoints.length > 1) {
        addAnnotation({
          type: 'drawing',
          pageNumber,
          position: { x: drawingPoints[0].x, y: drawingPoints[0].y },
          points: drawingPoints,
          color: defaultColor,
          opacity: defaultOpacity,
          lineWidth: defaultLineWidth,
          author: defaultAuthor,
        });
      }
      
      setDrawingPoints([]);
    } else if (currentTool === 'shape' && shapeStart) {
      const width = Math.abs(x - shapeStart.x);
      const height = Math.abs(y - shapeStart.y);
      
      if (width > 5 && height > 5) {
        addAnnotation({
          type: 'shape',
          shapeType: currentShapeType,
          pageNumber,
          position: {
            x: Math.min(x, shapeStart.x),
            y: Math.min(y, shapeStart.y),
            width,
            height,
          },
          color: defaultColor,
          opacity: defaultOpacity,
          lineWidth: defaultLineWidth,
          author: defaultAuthor,
        });
      }
      
      setShapeStart(null);
    }
  }, [currentTool, isDrawing, shapeStart, drawingPoints, scale, addAnnotation, currentShapeType, defaultColor, defaultOpacity, defaultLineWidth, defaultAuthor]);

  // Get props for the PDF container
  const getPDFContainerProps = useCallback(() => {
    return {
      ref: containerRef,
      style: {
        position: 'relative' as const,
        overflow: 'auto' as const,
        width: '100%',
        height: '100%',
      },
    };
  }, []);

  // Get props for the annotation layer
  const getAnnotationLayerProps = useCallback((pageNumber: number) => {
    return {
      ref: (el: HTMLDivElement | null) => {
        annotationLayerRefs.current[pageNumber] = el;
      },
      style: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'all' as const,
      },
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, pageNumber),
      onMouseMove: handleMouseMove,
      onMouseUp: (e: React.MouseEvent) => handleMouseUp(e, pageNumber),
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    annotations,
    selectedAnnotation,
    currentPage,
    numPages,
    currentTool,
    currentShapeType,
    isLoaded,
    error,
    scale,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    selectAnnotation,
    setCurrentPage,
    setCurrentTool,
    setCurrentShapeType,
    setScale,
    loadPDF,
    getPageAnnotations,
    getPDFContainerProps,
    getAnnotationLayerProps,
  };
}

export default usePDFAnnotator;
