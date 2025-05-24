import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface Point {
  /**
   * X coordinate
   */
  x: number;
  /**
   * Y coordinate
   */
  y: number;
  /**
   * Pressure (if available)
   */
  pressure?: number;
  /**
   * Timestamp
   */
  time: number;
}

export interface Stroke {
  /**
   * Array of points in the stroke
   */
  points: Point[];
  /**
   * Stroke color
   */
  color: string;
  /**
   * Stroke width
   */
  width: number;
  /**
   * Stroke type (e.g., 'brush', 'eraser')
   */
  type: 'brush' | 'eraser';
}

export interface DrawingHistory {
  /**
   * Array of strokes
   */
  strokes: Stroke[];
  /**
   * Background color
   */
  backgroundColor: string;
  /**
   * Background image (if any)
   */
  backgroundImage?: string;
}

export interface UseDrawingCanvasProps {
  /**
   * Default drawing history (uncontrolled)
   */
  defaultHistory?: DrawingHistory;
  /**
   * Controlled drawing history
   */
  history?: DrawingHistory;
  /**
   * Callback when drawing history changes
   */
  onChange?: (history: DrawingHistory) => void;
  /**
   * Whether the drawing canvas is disabled
   */
  disabled?: boolean;
  /**
   * Whether the drawing canvas is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the drawing canvas is required
   */
  required?: boolean;
  /**
   * ID for the drawing canvas element
   */
  id?: string;
  /**
   * Name attribute for the drawing canvas
   */
  name?: string;
  /**
   * Minimum width of the stroke
   */
  minWidth?: number;
  /**
   * Maximum width of the stroke
   */
  maxWidth?: number;
  /**
   * Default color of the stroke
   */
  defaultColor?: string;
  /**
   * Default width of the stroke
   */
  defaultStrokeWidth?: number;
  /**
   * Default tool type
   */
  defaultToolType?: 'brush' | 'eraser';
  /**
   * Background color of the canvas
   */
  backgroundColor?: string;
  /**
   * Background image of the canvas
   */
  backgroundImage?: string;
  /**
   * Width of the canvas
   */
  width?: number;
  /**
   * Height of the canvas
   */
  height?: number;
  /**
   * Callback when drawing starts
   */
  onBegin?: () => void;
  /**
   * Callback when drawing ends
   */
  onEnd?: () => void;
  /**
   * Callback when canvas is cleared
   */
  onClear?: () => void;
  /**
   * Callback when drawing is saved as data URL
   */
  onSave?: (dataURL: string) => void;
}

export interface UseDrawingCanvasReturn {
  /**
   * Current drawing history
   */
  history: DrawingHistory;
  /**
   * Whether the drawing canvas is empty
   */
  isEmpty: boolean;
  /**
   * Whether the drawing canvas is currently being used
   */
  isDrawing: boolean;
  /**
   * Current tool type
   */
  toolType: 'brush' | 'eraser';
  /**
   * Whether the drawing canvas is disabled
   */
  disabled: boolean;
  /**
   * Whether the drawing canvas is read-only
   */
  readOnly: boolean;
  /**
   * Whether the drawing canvas is required
   */
  required: boolean;
  /**
   * ID for the drawing canvas element
   */
  id: string;
  /**
   * Name attribute for the drawing canvas
   */
  name: string | undefined;
  /**
   * Color of the stroke
   */
  color: string;
  /**
   * Width of the stroke
   */
  strokeWidth: number;
  /**
   * Background color of the canvas
   */
  backgroundColor: string;
  /**
   * Background image of the canvas
   */
  backgroundImage: string | undefined;
  /**
   * Width of the canvas
   */
  width: number;
  /**
   * Height of the canvas
   */
  height: number;
  /**
   * Reference to the canvas element
   */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /**
   * Clear the drawing canvas
   */
  clear: () => void;
  /**
   * Undo the last stroke
   */
  undo: () => void;
  /**
   * Redo the last undone stroke
   */
  redo: () => void;
  /**
   * Save the drawing as a data URL
   */
  toDataURL: (type?: string, encoderOptions?: number) => string;
  /**
   * Set the stroke color
   */
  setColor: (color: string) => void;
  /**
   * Set the stroke width
   */
  setStrokeWidth: (width: number) => void;
  /**
   * Set the tool type
   */
  setToolType: (type: 'brush' | 'eraser') => void;
  /**
   * Set the background color
   */
  setBackgroundColor: (color: string) => void;
  /**
   * Set the background image
   */
  setBackgroundImage: (image: string) => void;
  /**
   * Get props for the canvas element
   */
  getCanvasProps: <E extends HTMLCanvasElement = HTMLCanvasElement>(
    props?: React.CanvasHTMLAttributes<E>
  ) => React.CanvasHTMLAttributes<E>;
  /**
   * Get props for the clear button
   */
  getClearButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the undo button
   */
  getUndoButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the redo button
   */
  getRedoButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the save button
   */
  getSaveButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>,
    type?: string,
    encoderOptions?: number
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the brush tool button
   */
  getBrushButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the eraser tool button
   */
  getEraserButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
}

/**
 * Hook for creating drawing canvas functionality.
 */
export function useDrawingCanvas({
  defaultHistory,
  history: controlledHistory,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  minWidth = 1,
  maxWidth = 20,
  defaultColor = '#000000',
  defaultStrokeWidth = 5,
  defaultToolType = 'brush',
  backgroundColor = '#ffffff',
  backgroundImage,
  width = 500,
  height = 300,
  onBegin,
  onEnd,
  onClear,
  onSave,
}: UseDrawingCanvasProps = {}): UseDrawingCanvasReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const drawingCanvasId = id || `drawing-canvas-${generatedId}`;
  
  // Create default history if none is provided
  const defaultHistoryValue: DrawingHistory = defaultHistory || {
    strokes: [],
    backgroundColor: backgroundColor,
    backgroundImage: backgroundImage,
  };
  
  // State for drawing canvas
  const [internalHistory, setInternalHistory] = useState<DrawingHistory>(defaultHistoryValue);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [currentColor, setCurrentColor] = useState<string>(defaultColor);
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>(defaultStrokeWidth);
  const [currentToolType, setCurrentToolType] = useState<'brush' | 'eraser'>(defaultToolType);
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState<string>(
    defaultHistoryValue.backgroundColor
  );
  const [currentBackgroundImage, setCurrentBackgroundImage] = useState<string | undefined>(
    defaultHistoryValue.backgroundImage
  );
  
  // Undo/redo history
  const [undoStack, setUndoStack] = useState<Stroke[]>([]);
  
  // Use controlled or uncontrolled history
  const history = controlledHistory !== undefined ? controlledHistory : internalHistory;
  
  // Refs for DOM elements and drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointRef = useRef<Point | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Check if the drawing canvas is empty
  const isEmpty = history.strokes.length === 0 && !currentStroke;
  
  // Draw the drawing on the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set the background color
    ctx.fillStyle = history.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw background image if available
    if (history.backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Draw all strokes after the image is loaded
        drawStrokes();
      };
      img.src = history.backgroundImage;
    } else {
      // Draw all strokes
      drawStrokes();
    }
    
    function drawStrokes() {
      [...history.strokes, currentStroke].filter(Boolean).forEach((stroke) => {
        if (!stroke || stroke.points.length === 0) return;
        
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        
        for (let i = 1; i < stroke.points.length; i++) {
          const p1 = stroke.points[i - 1];
          const p2 = stroke.points[i];
          
          // Calculate control points for a quadratic curve
          const cx = (p1.x + p2.x) / 2;
          const cy = (p1.y + p2.y) / 2;
          
          // Draw a quadratic curve
          ctx.quadraticCurveTo(p1.x, p1.y, cx, cy);
        }
        
        // If there's only one point, draw a dot
        if (stroke.points.length === 1) {
          ctx.lineTo(stroke.points[0].x + 0.1, stroke.points[0].y + 0.1);
        }
        
        if (stroke.type === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = stroke.color;
        }
        
        ctx.lineWidth = stroke.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
      });
    }
  }, [history, currentStroke]);
  
  // Handle mouse/touch down
  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Capture the pointer
    canvas.setPointerCapture(event.pointerId);
    
    // Get the canvas bounds
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the point
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    // Create a new point
    const point: Point = {
      x,
      y,
      pressure: event.pressure,
      time: Date.now(),
    };
    
    // Create a new stroke
    const stroke: Stroke = {
      points: [point],
      color: currentColor,
      width: currentStrokeWidth,
      type: currentToolType,
    };
    
    // Set the current stroke
    setCurrentStroke(stroke);
    setIsDrawing(true);
    lastPointRef.current = point;
    
    // Clear the undo stack when starting a new stroke after undoing
    if (undoStack.length > 0) {
      setUndoStack([]);
    }
    
    // Call onBegin callback
    if (onBegin) {
      onBegin();
    }
  }, [disabled, readOnly, currentColor, currentStrokeWidth, currentToolType, undoStack.length, onBegin]);
  
  // Handle mouse/touch move
  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled || readOnly) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get the canvas bounds
    const rect = canvas.getBoundingClientRect();
    
    // Calculate the point
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    
    // Create a new point
    const point: Point = {
      x,
      y,
      pressure: event.pressure,
      time: Date.now(),
    };
    
    // Add the point to the current stroke
    if (currentStroke) {
      setCurrentStroke({
        ...currentStroke,
        points: [...currentStroke.points, point],
      });
    }
    
    lastPointRef.current = point;
    
    // Request animation frame to draw the drawing
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(drawCanvas);
  }, [isDrawing, disabled, readOnly, currentStroke, drawCanvas]);
  
  // Handle mouse/touch up
  const handlePointerUp = useCallback(() => {
    if (!isDrawing || disabled || readOnly) return;
    
    // Add the current stroke to the strokes array
    if (currentStroke) {
      const newStrokes = [...history.strokes, currentStroke];
      const newHistory = {
        ...history,
        strokes: newStrokes,
      };
      
      // Update internal state for uncontrolled component
      if (controlledHistory === undefined) {
        setInternalHistory(newHistory);
      }
      
      // Call onChange callback
      if (onChange) {
        onChange(newHistory);
      }
    }
    
    // Reset the current stroke
    setCurrentStroke(null);
    setIsDrawing(false);
    lastPointRef.current = null;
    
    // Call onEnd callback
    if (onEnd) {
      onEnd();
    }
  }, [isDrawing, disabled, readOnly, currentStroke, history, controlledHistory, onChange, onEnd]);
  
  // Handle pointer cancel
  const handlePointerCancel = useCallback(() => {
    if (!isDrawing) return;
    
    // Reset the current stroke
    setCurrentStroke(null);
    setIsDrawing(false);
    lastPointRef.current = null;
  }, [isDrawing]);
  
  // Clear the drawing canvas
  const clear = useCallback(() => {
    if (disabled || readOnly) return;
    
    // Save current strokes to undo stack
    if (history.strokes.length > 0) {
      setUndoStack([...undoStack, ...history.strokes]);
    }
    
    const newHistory = {
      ...history,
      strokes: [],
    };
    
    // Update internal state for uncontrolled component
    if (controlledHistory === undefined) {
      setInternalHistory(newHistory);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newHistory);
    }
    
    // Reset the current stroke
    setCurrentStroke(null);
    setIsDrawing(false);
    lastPointRef.current = null;
    
    // Call onClear callback
    if (onClear) {
      onClear();
    }
    
    // Draw the empty canvas
    drawCanvas();
  }, [disabled, readOnly, history, undoStack, controlledHistory, onChange, onClear, drawCanvas]);
  
  // Undo the last stroke
  const undo = useCallback(() => {
    if (disabled || readOnly || history.strokes.length === 0) return;
    
    // Get the last stroke
    const lastStroke = history.strokes[history.strokes.length - 1];
    
    // Add the last stroke to the undo stack
    setUndoStack([...undoStack, lastStroke]);
    
    // Remove the last stroke from the strokes array
    const newStrokes = history.strokes.slice(0, -1);
    const newHistory = {
      ...history,
      strokes: newStrokes,
    };
    
    // Update internal state for uncontrolled component
    if (controlledHistory === undefined) {
      setInternalHistory(newHistory);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newHistory);
    }
    
    // Draw the canvas
    drawCanvas();
  }, [disabled, readOnly, history, undoStack, controlledHistory, onChange, drawCanvas]);
  
  // Redo the last undone stroke
  const redo = useCallback(() => {
    if (disabled || readOnly || undoStack.length === 0) return;
    
    // Get the last undone stroke
    const lastUndoneStroke = undoStack[undoStack.length - 1];
    
    // Add the last undone stroke to the strokes array
    const newStrokes = [...history.strokes, lastUndoneStroke];
    const newHistory = {
      ...history,
      strokes: newStrokes,
    };
    
    // Update internal state for uncontrolled component
    if (controlledHistory === undefined) {
      setInternalHistory(newHistory);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newHistory);
    }
    
    // Remove the last undone stroke from the undo stack
    setUndoStack(undoStack.slice(0, -1));
    
    // Draw the canvas
    drawCanvas();
  }, [disabled, readOnly, undoStack, history, controlledHistory, onChange, drawCanvas]);
  
  // Save the drawing as a data URL
  const toDataURL = useCallback((type = 'image/png', encoderOptions = 0.92) => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    
    // Call onSave callback
    const dataURL = canvas.toDataURL(type, encoderOptions);
    if (onSave) {
      onSave(dataURL);
    }
    
    return dataURL;
  }, [onSave]);
  
  // Set the stroke color
  const setColor = useCallback((newColor: string) => {
    setCurrentColor(newColor);
  }, []);
  
  // Set the stroke width
  const setStrokeWidth = useCallback((newWidth: number) => {
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setCurrentStrokeWidth(clampedWidth);
  }, [minWidth, maxWidth]);
  
  // Set the tool type
  const setToolType = useCallback((type: 'brush' | 'eraser') => {
    setCurrentToolType(type);
  }, []);
  
  // Set the background color
  const setBackgroundColor = useCallback((newColor: string) => {
    setCurrentBackgroundColor(newColor);
    
    const newHistory = {
      ...history,
      backgroundColor: newColor,
    };
    
    // Update internal state for uncontrolled component
    if (controlledHistory === undefined) {
      setInternalHistory(newHistory);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newHistory);
    }
    
    drawCanvas();
  }, [history, controlledHistory, onChange, drawCanvas]);
  
  // Set the background image
  const setBackgroundImage = useCallback((image: string) => {
    setCurrentBackgroundImage(image);
    
    const newHistory = {
      ...history,
      backgroundImage: image,
    };
    
    // Update internal state for uncontrolled component
    if (controlledHistory === undefined) {
      setInternalHistory(newHistory);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newHistory);
    }
    
    drawCanvas();
  }, [history, controlledHistory, onChange, drawCanvas]);
  
  // Draw the canvas when the component mounts or when history changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);
  
  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Get props for the canvas element
  const getCanvasProps = useCallback(<E extends HTMLCanvasElement = HTMLCanvasElement>(
    props?: React.CanvasHTMLAttributes<E>
  ): React.CanvasHTMLAttributes<E> => {
    return {
      ...props,
      ref: canvasRef,
      id: `${drawingCanvasId}-canvas`,
      width,
      height,
      style: {
        touchAction: 'none',
        ...props?.style,
      },
      onPointerDown: (event: React.PointerEvent<E>) => {
        handlePointerDown(event as unknown as React.PointerEvent<HTMLCanvasElement>);
        props?.onPointerDown?.(event);
      },
      onPointerMove: (event: React.PointerEvent<E>) => {
        handlePointerMove(event as unknown as React.PointerEvent<HTMLCanvasElement>);
        props?.onPointerMove?.(event);
      },
      onPointerUp: (event: React.PointerEvent<E>) => {
        handlePointerUp();
        props?.onPointerUp?.(event);
      },
      onPointerCancel: (event: React.PointerEvent<E>) => {
        handlePointerCancel();
        props?.onPointerCancel?.(event);
      },
      onPointerLeave: (event: React.PointerEvent<E>) => {
        handlePointerUp();
        props?.onPointerLeave?.(event);
      },
      'aria-label': props?.['aria-label'] || 'Drawing canvas',
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
      'data-empty': isEmpty ? '' : undefined,
      'data-drawing': isDrawing ? '' : undefined,
      'data-tool': currentToolType,
    };
  }, [
    drawingCanvasId,
    width,
    height,
    disabled,
    readOnly,
    required,
    isEmpty,
    isDrawing,
    currentToolType,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  ]);
  
  // Get props for the clear button
  const getClearButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': props?.['aria-label'] || 'Clear drawing',
      disabled: disabled || readOnly || isEmpty || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        clear();
        props?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly || isEmpty) ? '' : undefined,
    };
  }, [disabled, readOnly, isEmpty, clear]);
  
  // Get props for the undo button
  const getUndoButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': props?.['aria-label'] || 'Undo last stroke',
      disabled: disabled || readOnly || history.strokes.length === 0 || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        undo();
        props?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly || history.strokes.length === 0) ? '' : undefined,
    };
  }, [disabled, readOnly, history.strokes.length, undo]);
  
  // Get props for the redo button
  const getRedoButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': props?.['aria-label'] || 'Redo last undone stroke',
      disabled: disabled || readOnly || undoStack.length === 0 || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        redo();
        props?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly || undoStack.length === 0) ? '' : undefined,
    };
  }, [disabled, readOnly, undoStack.length, redo]);
  
  // Get props for the save button
  const getSaveButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>,
    type = 'image/png',
    encoderOptions = 0.92
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': props?.['aria-label'] || 'Save drawing',
      disabled: disabled || isEmpty || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        toDataURL(type, encoderOptions);
        props?.onClick?.(event);
      },
      'data-disabled': (disabled || isEmpty) ? '' : undefined,
    };
  }, [disabled, isEmpty, toDataURL]);
  
  // Get props for the brush tool button
  const getBrushButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': props?.['aria-label'] || 'Brush tool',
      'aria-pressed': currentToolType === 'brush',
      disabled: disabled || readOnly || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        setToolType('brush');
        props?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly) ? '' : undefined,
      'data-active': currentToolType === 'brush' ? '' : undefined,
    };
  }, [disabled, readOnly, currentToolType, setToolType]);
  
  // Get props for the eraser tool button
  const getEraserButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button',
      'aria-label': props?.['aria-label'] || 'Eraser tool',
      'aria-pressed': currentToolType === 'eraser',
      disabled: disabled || readOnly || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        setToolType('eraser');
        props?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly) ? '' : undefined,
      'data-active': currentToolType === 'eraser' ? '' : undefined,
    };
  }, [disabled, readOnly, currentToolType, setToolType]);
  
  return {
    history,
    isEmpty,
    isDrawing,
    toolType: currentToolType,
    disabled,
    readOnly,
    required,
    id: drawingCanvasId,
    name,
    color: currentColor,
    strokeWidth: currentStrokeWidth,
    backgroundColor: currentBackgroundColor,
    backgroundImage: currentBackgroundImage,
    width,
    height,
    canvasRef,
    clear,
    undo,
    redo,
    toDataURL,
    setColor,
    setStrokeWidth,
    setToolType,
    setBackgroundColor,
    setBackgroundImage,
    getCanvasProps,
    getClearButtonProps,
    getUndoButtonProps,
    getRedoButtonProps,
    getSaveButtonProps,
    getBrushButtonProps,
    getEraserButtonProps,
  };
}
