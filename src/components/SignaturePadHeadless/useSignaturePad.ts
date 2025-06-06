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
}

export interface UseSignaturePadProps {
  /**
   * Default strokes (uncontrolled)
   */
  defaultStrokes?: Stroke[];
  /**
   * Controlled strokes
   */
  strokes?: Stroke[];
  /**
   * Callback when strokes change
   */
  onChange?: (strokes: Stroke[]) => void;
  /**
   * Whether the signature pad is disabled
   */
  disabled?: boolean;
  /**
   * Whether the signature pad is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the signature pad is required
   */
  required?: boolean;
  /**
   * ID for the signature pad element
   */
  id?: string;
  /**
   * Name attribute for the signature pad
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
   * Color of the stroke
   */
  color?: string;
  /**
   * Background color of the canvas
   */
  backgroundColor?: string;
  /**
   * Width of the canvas
   */
  width?: number;
  /**
   * Height of the canvas
   */
  height?: number;
  /**
   * Callback when signature starts
   */
  onBegin?: () => void;
  /**
   * Callback when signature ends
   */
  onEnd?: () => void;
  /**
   * Callback when canvas is cleared
   */
  onClear?: () => void;
  /**
   * Callback when signature is saved as data URL
   */
  onSave?: (dataURL: string) => void;
}

export interface UseSignaturePadReturn {
  /**
   * Current strokes
   */
  strokes: Stroke[];
  /**
   * Whether the signature pad is empty
   */
  isEmpty: boolean;
  /**
   * Whether the signature pad is currently being used
   */
  isDrawing: boolean;
  /**
   * Whether the signature pad is disabled
   */
  disabled: boolean;
  /**
   * Whether the signature pad is read-only
   */
  readOnly: boolean;
  /**
   * Whether the signature pad is required
   */
  required: boolean;
  /**
   * ID for the signature pad element
   */
  id: string;
  /**
   * Name attribute for the signature pad
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
   * Minimum width of the stroke
   */
  minWidth: number;
  /**
   * Maximum width of the stroke
   */
  maxWidth: number;
  /**
   * Background color of the canvas
   */
  backgroundColor: string;
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
   * Clear the signature pad
   */
  clear: () => void;
  /**
   * Undo the last stroke
   */
  undo: () => void;
  /**
   * Save the signature as a data URL
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
   * Set the background color
   */
  setBackgroundColor: (color: string) => void;
  /**
   * Get props for the canvas element
   */
  getCanvasProps: <E extends HTMLCanvasElement = HTMLCanvasElement>(
    props?: React.CanvasHTMLAttributes<E> & { ref?: React.Ref<E> }
  ) => React.CanvasHTMLAttributes<E> & { ref?: any };
  /**
   * Get props for the clear button
   */
  getClearButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E> & { ref?: React.Ref<E> }
  ) => React.ButtonHTMLAttributes<E> & { 'data-disabled'?: string; ref?: any };
  /**
   * Get props for the undo button
   */
  getUndoButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E> & { ref?: React.Ref<E> }
  ) => React.ButtonHTMLAttributes<E> & { 'data-disabled'?: string; ref?: any };
  /**
   * Get props for the save button
   */
  getSaveButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E> & { ref?: React.Ref<E> },
    type = 'image/png',
    encoderOptions = 0.92
  ) => React.ButtonHTMLAttributes<E> & { 'data-disabled'?: string; ref?: any };
}

/**
 * Hook for creating signature pad functionality.
 */
export function useSignaturePad({
  defaultStrokes = [],
  strokes: controlledStrokes,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  minWidth = 0.5,
  maxWidth = 2.5,
  color = '#000000',
  backgroundColor = 'rgba(0,0,0,0)',
  width = 300,
  height = 150,
  onBegin,
  onEnd,
  onClear,
  onSave,
}: UseSignaturePadProps = {}): UseSignaturePadReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const signaturePadId = id || `signature-pad-${generatedId}`;
  
  // State for signature pad
  const [internalStrokes, setInternalStrokes] = useState<Stroke[]>(defaultStrokes);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [currentColor, setCurrentColor] = useState<string>(color);
  const [currentStrokeWidth, setCurrentStrokeWidth] = useState<number>(
    minWidth + (maxWidth - minWidth) / 2
  );
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState<string>(backgroundColor);
  
  // Use controlled or uncontrolled strokes
  const strokes = controlledStrokes !== undefined ? controlledStrokes : internalStrokes;
  
  // Refs for DOM elements and drawing state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointRef = useRef<Point | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Check if the signature pad is empty
  const isEmpty = strokes.length === 0 && !currentStroke;
  
  // Draw the signature on the canvas
  const drawSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set the background color
    if (currentBackgroundColor !== 'rgba(0,0,0,0)') {
      ctx.fillStyle = currentBackgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw all strokes
    [...strokes, currentStroke].filter(Boolean).forEach((stroke) => {
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
      
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }, [strokes, currentStroke, currentBackgroundColor]);
  
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
    };
    
    // Set the current stroke
    setCurrentStroke(stroke);
    setIsDrawing(true);
    lastPointRef.current = point;
    
    // Call onBegin callback
    if (onBegin) {
      onBegin();
    }
  }, [disabled, readOnly, currentColor, currentStrokeWidth, onBegin]);
  
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
    
    // Request animation frame to draw the signature
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(drawSignature);
  }, [isDrawing, disabled, readOnly, currentStroke, drawSignature]);
  
  // Handle mouse/touch up
  const handlePointerUp = useCallback(() => {
    if (!isDrawing || disabled || readOnly) return;
    
    // Add the current stroke to the strokes array
    if (currentStroke) {
      // Update internal state for uncontrolled component
      if (controlledStrokes === undefined) {
        setInternalStrokes(prev => [...prev, currentStroke]);
      }
      
      // Call onChange callback
      if (onChange) {
        onChange([...strokes, currentStroke]);
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
  }, [isDrawing, disabled, readOnly, currentStroke, controlledStrokes, strokes, onChange, onEnd]);
  
  // Handle pointer cancel
  const handlePointerCancel = useCallback(() => {
    if (!isDrawing) return;
    
    // Reset the current stroke
    setCurrentStroke(null);
    setIsDrawing(false);
    lastPointRef.current = null;
  }, [isDrawing]);
  
  // Clear the signature pad
  const clear = useCallback(() => {
    if (disabled || readOnly) return;
    
    // Update internal state for uncontrolled component
    if (controlledStrokes === undefined) {
      setInternalStrokes([]);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange([]);
    }
    
    // Reset the current stroke
    setCurrentStroke(null);
    setIsDrawing(false);
    lastPointRef.current = null;
    
    // Call onClear callback
    if (onClear) {
      onClear();
    }
    
    // Draw the empty signature
    drawSignature();
  }, [disabled, readOnly, controlledStrokes, onChange, onClear, drawSignature]);
  
  // Undo the last stroke
  const undo = useCallback(() => {
    if (disabled || readOnly || strokes.length === 0) return;
    
    // Update internal state for uncontrolled component
    if (controlledStrokes === undefined) {
      setInternalStrokes(prev => prev.slice(0, -1));
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(strokes.slice(0, -1));
    }
    
    // Draw the signature
    drawSignature();
  }, [disabled, readOnly, strokes, controlledStrokes, onChange, drawSignature]);
  
  // Export signature as data URL
  const exportAsDataURL = useCallback((
    type?: string,
    encoderOptions?: number
  ) => {
    const typeToUse = type || 'image/png';
    const encoderOptionsToUse = encoderOptions || 0.92;
    
    const canvas = canvasRef.current;
    if (!canvas) return '';
    
    // Call onSave callback
    const dataURL = canvas.toDataURL(typeToUse, encoderOptionsToUse);
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
  
  // Set the background color
  const setBackgroundColor = useCallback((newColor: string) => {
    setCurrentBackgroundColor(newColor);
    drawSignature();
  }, [drawSignature]);
  
  // Draw the signature when the component mounts or when strokes change
  useEffect(() => {
    drawSignature();
  }, [drawSignature]);
  
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
    props?: React.CanvasHTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.CanvasHTMLAttributes<E> & { ref?: any } => {
    const { ref: propsRef, ...restProps } = props || {};
    return {
      ...restProps,
      ref: canvasRef,
      id: `${signaturePadId}-canvas`,
      width,
      height,
      style: {
        touchAction: 'none',
        ...restProps?.style,
      },
      onPointerDown: (event: React.PointerEvent<E>) => {
        handlePointerDown(event as unknown as React.PointerEvent<HTMLCanvasElement>);
        restProps?.onPointerDown?.(event);
      },
      onPointerMove: (event: React.PointerEvent<E>) => {
        handlePointerMove(event as unknown as React.PointerEvent<HTMLCanvasElement>);
        restProps?.onPointerMove?.(event);
      },
      onPointerUp: (event: React.PointerEvent<E>) => {
        handlePointerUp();
        restProps?.onPointerUp?.(event);
      },
      onPointerCancel: (event: React.PointerEvent<E>) => {
        handlePointerCancel();
        restProps?.onPointerCancel?.(event);
      },
      onPointerLeave: (event: React.PointerEvent<E>) => {
        handlePointerUp();
        restProps?.onPointerLeave?.(event);
      },
      'aria-label': restProps?.['aria-label'] || 'Signature pad',
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
      'data-empty': isEmpty ? '' : undefined,
      'data-drawing': isDrawing ? '' : undefined,
    } as any;
  }, [
    signaturePadId,
    width,
    height,
    disabled,
    readOnly,
    required,
    isEmpty,
    isDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  ]);
  
  // Get props for the clear button
  const getClearButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.ButtonHTMLAttributes<E> & { 'data-disabled'?: string; ref?: any } => {
    const { ref: propsRef, ...restProps } = props || {};
    return {
      ...restProps,
      ref: propsRef,
      type: 'button',
      'aria-label': restProps?.['aria-label'] || 'Clear signature',
      disabled: disabled || readOnly || isEmpty || restProps?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        clear();
        restProps?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly || isEmpty) ? '' : undefined,
    } as any;
  }, [disabled, readOnly, isEmpty, clear]);
  
  // Get props for the undo button
  const getUndoButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.ButtonHTMLAttributes<E> & { 'data-disabled'?: string; ref?: any } => {
    const { ref: propsRef, ...restProps } = props || {};
    return {
      ...restProps,
      ref: propsRef,
      type: 'button',
      'aria-label': restProps?.['aria-label'] || 'Undo last stroke',
      disabled: disabled || readOnly || strokes.length === 0 || restProps?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        undo();
        restProps?.onClick?.(event);
      },
      'data-disabled': (disabled || readOnly || strokes.length === 0) ? '' : undefined,
    } as any;
  }, [disabled, readOnly, strokes.length, undo]);
  
  // Get props for the save button
  const getSaveButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E> & { ref?: React.Ref<E> },
    type = 'image/png',
    encoderOptions = 0.92
  ): React.ButtonHTMLAttributes<E> & { 'data-disabled'?: string; ref?: any } => {
    const { ref: propsRef, ...restProps } = props || {};
    return {
      ...restProps,
      ref: propsRef,
      type: 'button',
      'aria-label': restProps?.['aria-label'] || 'Save signature',
      disabled: disabled || isEmpty || restProps?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        exportAsDataURL(type, encoderOptions);
        restProps?.onClick?.(event);
      },
      'data-disabled': (disabled || isEmpty) ? '' : undefined,
    } as any;
  }, [disabled, isEmpty, exportAsDataURL]);
  
  return {
    strokes,
    isEmpty,
    isDrawing,
    disabled,
    readOnly,
    required,
    id: signaturePadId,
    name,
    color: currentColor,
    strokeWidth: currentStrokeWidth,
    minWidth,
    maxWidth,
    backgroundColor: currentBackgroundColor,
    width,
    height,
    canvasRef,
    clear,
    undo,
    toDataURL: exportAsDataURL,
    setColor,
    setStrokeWidth,
    setBackgroundColor,
    getCanvasProps,
    getClearButtonProps,
    getUndoButtonProps,
    getSaveButtonProps,
  };
}
