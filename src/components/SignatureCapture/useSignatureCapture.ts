import { useState, useRef, useCallback, useEffect } from 'react';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
  time?: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
}

export interface SignatureCaptureOptions {
  /**
   * Width of the signature pad
   */
  width?: number;
  /**
   * Height of the signature pad
   */
  height?: number;
  /**
   * Background color of the signature pad
   */
  backgroundColor?: string;
  /**
   * Pen color
   */
  penColor?: string;
  /**
   * Pen width
   */
  penWidth?: number;
  /**
   * Minimum width of the pen
   */
  minWidth?: number;
  /**
   * Maximum width of the pen
   */
  maxWidth?: number;
  /**
   * Whether to use pressure sensitivity
   */
  usePressure?: boolean;
  /**
   * Whether to use velocity for line width
   */
  velocityFilterWeight?: number;
  /**
   * Minimum distance between points
   */
  minDistance?: number;
  /**
   * Whether to show a dotted line guide
   */
  showGuide?: boolean;
  /**
   * Whether to trim empty space around the signature
   */
  trimWhitespace?: boolean;
  /**
   * Callback when signature changes
   */
  onChange?: (isEmpty: boolean, data?: string) => void;
  /**
   * Callback when signature is completed
   */
  onComplete?: (data: string) => void;
}

export interface UseSignatureCaptureReturn {
  /**
   * Whether the signature pad is empty
   */
  isEmpty: boolean;
  /**
   * Current strokes
   */
  strokes: Stroke[];
  /**
   * Canvas reference
   */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /**
   * Clear the signature
   */
  clear: () => void;
  /**
   * Undo the last stroke
   */
  undo: () => void;
  /**
   * Get the signature as data URL
   */
  toDataURL: (type?: string, encoderOptions?: number) => string;
  /**
   * Get the signature as SVG
   */
  toSVG: () => string;
  /**
   * Set the pen color
   */
  setPenColor: (color: string) => void;
  /**
   * Set the pen width
   */
  setPenWidth: (width: number) => void;
  /**
   * Set the background color
   */
  setBackgroundColor: (color: string) => void;
  /**
   * Get props for the signature pad
   */
  getSignaturePadProps: () => {
    ref: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    style: React.CSSProperties;
  };
}

/**
 * Hook for creating a signature capture component
 */
export function useSignatureCapture(options: SignatureCaptureOptions = {}): UseSignatureCaptureReturn {
  const {
    width = 300,
    height = 150,
    backgroundColor = 'rgba(255, 255, 255, 0)',
    penColor = '#000000',
    penWidth = 2,
    minWidth = 0.5,
    maxWidth = 4,
    usePressure = true,
    velocityFilterWeight = 0.7,
    minDistance = 0.5,
    showGuide = false,
    trimWhitespace = true,
    onChange,
    onComplete,
  } = options;

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [currentPenColor, setCurrentPenColor] = useState<string>(penColor);
  const [currentPenWidth, setCurrentPenWidth] = useState<number>(penWidth);
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState<string>(backgroundColor);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<Point | null>(null);
  const lastVelocityRef = useRef<number>(0);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set up the canvas
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentPenColor;
        ctx.lineWidth = currentPenWidth;
        
        // Set the canvas resolution for better quality
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.scale(dpr, dpr);
        
        ctxRef.current = ctx;
        
        // Draw background
        drawBackground();
        
        // Draw guide lines if enabled
        if (showGuide) {
          drawGuideLines();
        }
      }
    }
  }, [width, height, currentBackgroundColor, showGuide]);

  // Draw background
  const drawBackground = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    
    if (ctx && canvas) {
      ctx.fillStyle = currentBackgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [currentBackgroundColor]);

  // Draw guide lines
  const drawGuideLines = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    
    if (ctx && canvas) {
      const dpr = window.devicePixelRatio || 1;
      
      ctx.save();
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      
      // Draw horizontal line
      const middleY = (canvas.height / dpr) / 2;
      ctx.beginPath();
      ctx.moveTo(0, middleY);
      ctx.lineTo(canvas.width / dpr, middleY);
      ctx.stroke();
      
      ctx.restore();
    }
  }, []);

  // Generate unique ID
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  // Get point from event
  const getPointFromEvent = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let x, y, pressure = 0.5;
    
    if ('touches' in e) {
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
      
      // Get pressure if available
      if (usePressure && 'force' in touch) {
        pressure = touch.force;
      }
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      
      // Use 0.5 as default pressure for mouse events
      pressure = 0.5;
    }
    
    return {
      x,
      y,
      pressure: usePressure ? pressure : undefined,
      time: Date.now(),
    };
  }, [usePressure]);

  // Calculate velocity between two points
  const getVelocity = useCallback((p1: Point, p2: Point): number => {
    if (!p1.time || !p2.time) return 0;
    
    const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const time = p2.time - p1.time;
    
    return time > 0 ? distance / time : 0;
  }, []);

  // Calculate line width based on velocity and pressure
  const getLineWidth = useCallback((velocity: number, pressure?: number): number => {
    // Base width
    let width = currentPenWidth;
    
    // Adjust for pressure if available
    if (usePressure && pressure !== undefined) {
      width *= pressure * 2;
    }
    
    // Adjust for velocity (faster = thinner)
    if (velocity > 0) {
      width = Math.max(minWidth, Math.min(maxWidth, width * (1 - Math.min(velocity, 10) / 10)));
    }
    
    return width;
  }, [currentPenWidth, usePressure, minWidth, maxWidth]);

  // Start drawing
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    const point = getPointFromEvent(e);
    
    // Create a new stroke
    const newStroke: Stroke = {
      id: generateId(),
      points: [point],
      color: currentPenColor,
      width: currentPenWidth,
    };
    
    setCurrentStroke(newStroke);
    isDrawingRef.current = true;
    lastPointRef.current = point;
    lastVelocityRef.current = 0;
    
    // Draw the first point
    drawPoint(point, currentPenColor, currentPenWidth);
  }, [getPointFromEvent, generateId, currentPenColor, currentPenWidth]);

  // Continue drawing
  const continueDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    if (!isDrawingRef.current || !currentStroke || !lastPointRef.current) return;
    
    const newPoint = getPointFromEvent(e);
    const lastPoint = lastPointRef.current;
    
    // Calculate distance between points
    const distance = Math.sqrt(Math.pow(newPoint.x - lastPoint.x, 2) + Math.pow(newPoint.y - lastPoint.y, 2));
    
    // Only add point if it's far enough from the last one
    if (distance >= minDistance) {
      // Calculate velocity
      const velocity = getVelocity(lastPoint, newPoint);
      
      // Apply velocity filter
      const filteredVelocity = lastVelocityRef.current * velocityFilterWeight + velocity * (1 - velocityFilterWeight);
      lastVelocityRef.current = filteredVelocity;
      
      // Calculate line width
      const lineWidth = getLineWidth(filteredVelocity, newPoint.pressure);
      
      // Draw line to the new point
      drawLine(lastPoint, newPoint, currentStroke.color, lineWidth);
      
      // Update current stroke
      setCurrentStroke(prev => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...prev.points, newPoint],
        };
      });
      
      lastPointRef.current = newPoint;
    }
  }, [getPointFromEvent, minDistance, getVelocity, velocityFilterWeight, getLineWidth, currentStroke]);

  // End drawing
  const endDrawing = useCallback(() => {
    if (!isDrawingRef.current || !currentStroke) return;
    
    isDrawingRef.current = false;
    
    // Add the current stroke to strokes
    setStrokes(prev => {
      const newStrokes = [...prev, currentStroke];
      
      // Update isEmpty state
      setIsEmpty(newStrokes.length === 0);
      
      // Call onChange callback
      if (onChange) {
        const dataUrl = toDataURL();
        onChange(newStrokes.length === 0, dataUrl);
      }
      
      return newStrokes;
    });
    
    setCurrentStroke(null);
    lastPointRef.current = null;
    
    // Call onComplete callback
    if (onComplete) {
      const dataUrl = toDataURL();
      onComplete(dataUrl);
    }
  }, [currentStroke, onChange, onComplete]);

  // Draw a point
  const drawPoint = useCallback((point: Point, color: string, width: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, width / 2, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Draw a line
  const drawLine = useCallback((p1: Point, p2: Point, color: string, width: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }, []);

  // Redraw the canvas
  const redrawCanvas = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    
    if (!ctx || !canvas) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
    
    // Draw background
    drawBackground();
    
    // Draw guide lines if enabled
    if (showGuide) {
      drawGuideLines();
    }
    
    // Draw all strokes
    strokes.forEach(stroke => {
      const { points, color, width } = stroke;
      
      if (points.length === 1) {
        // Single point
        drawPoint(points[0], color, width);
      } else {
        // Multiple points (line)
        for (let i = 1; i < points.length; i++) {
          drawLine(points[i - 1], points[i], color, width);
        }
      }
    });
  }, [strokes, drawBackground, showGuide, drawGuideLines, drawPoint, drawLine]);

  // Update canvas when strokes change
  useEffect(() => {
    redrawCanvas();
  }, [strokes, redrawCanvas]);

  // Clear the signature
  const clear = useCallback(() => {
    setStrokes([]);
    setIsEmpty(true);
    
    // Call onChange callback
    if (onChange) {
      onChange(true);
    }
    
    redrawCanvas();
  }, [onChange, redrawCanvas]);

  // Undo the last stroke
  const undo = useCallback(() => {
    setStrokes(prev => {
      const newStrokes = prev.slice(0, -1);
      
      // Update isEmpty state
      setIsEmpty(newStrokes.length === 0);
      
      // Call onChange callback
      if (onChange) {
        const dataUrl = newStrokes.length === 0 ? undefined : toDataURL();
        onChange(newStrokes.length === 0, dataUrl);
      }
      
      return newStrokes;
    });
  }, [onChange]);

  // Get the signature as data URL
  const toDataURL = useCallback((type = 'image/png', encoderOptions = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    
    if (trimWhitespace) {
      return trimmedCanvasDataURL(type, encoderOptions);
    }
    
    return canvas.toDataURL(type, encoderOptions);
  }, [trimWhitespace]);

  // Get the signature as SVG
  const toSVG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return '';
    
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    // Find bounds
    strokes.forEach(stroke => {
      stroke.points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    });
    
    // Add padding
    const padding = 10;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width, maxX + padding);
    maxY = Math.min(canvas.height, maxY + padding);
    
    const w = maxX - minX;
    const h = maxY - minY;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${minX} ${minY} ${w} ${h}">`;
    
    // Add strokes
    strokes.forEach(stroke => {
      const { points, color, width } = stroke;
      
      if (points.length === 1) {
        // Single point
        const point = points[0];
        svg += `<circle cx="${point.x}" cy="${point.y}" r="${width / 2}" fill="${color}" />`;
      } else {
        // Multiple points (line)
        let path = `<path d="M ${points[0].x} ${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
          path += ` L ${points[i].x} ${points[i].y}`;
        }
        
        path += `" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" fill="none" />`;
        svg += path;
      }
    });
    
    svg += '</svg>';
    
    return svg;
  }, [strokes]);

  // Get trimmed canvas data URL
  const trimmedCanvasDataURL = useCallback((type = 'image/png', encoderOptions = 1) => {
    const canvas = canvasRef.current;
    if (!canvas || strokes.length === 0) return '';
    
    const ctx = ctxRef.current;
    if (!ctx) return '';
    
    // Find bounds
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    strokes.forEach(stroke => {
      stroke.points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
      });
    });
    
    // Add padding
    const padding = 10;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width / (window.devicePixelRatio || 1), maxX + padding);
    maxY = Math.min(canvas.height / (window.devicePixelRatio || 1), maxY + padding);
    
    const w = maxX - minX;
    const h = maxY - minY;
    
    // Create a new canvas with the trimmed size
    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = w;
    trimmedCanvas.height = h;
    
    const trimmedCtx = trimmedCanvas.getContext('2d');
    if (!trimmedCtx) return '';
    
    // Draw the trimmed signature
    trimmedCtx.drawImage(
      canvas,
      minX * (window.devicePixelRatio || 1),
      minY * (window.devicePixelRatio || 1),
      w * (window.devicePixelRatio || 1),
      h * (window.devicePixelRatio || 1),
      0,
      0,
      w,
      h
    );
    
    return trimmedCanvas.toDataURL(type, encoderOptions);
  }, [strokes]);

  // Set pen color
  const setPenColor = useCallback((color: string) => {
    setCurrentPenColor(color);
  }, []);

  // Set pen width
  const setPenWidth = useCallback((width: number) => {
    setCurrentPenWidth(width);
  }, []);

  // Set background color
  const setBackgroundColor = useCallback((color: string) => {
    setCurrentBackgroundColor(color);
    redrawCanvas();
  }, [redrawCanvas]);

  // Get props for the signature pad
  const getSignaturePadProps = useCallback(() => {
    return {
      ref: canvasRef,
      width,
      height,
      onMouseDown: startDrawing,
      onMouseMove: continueDrawing,
      onMouseUp: endDrawing,
      onMouseLeave: endDrawing,
      onTouchStart: startDrawing,
      onTouchMove: continueDrawing,
      onTouchEnd: endDrawing,
      style: {
        touchAction: 'none',
        cursor: 'crosshair',
        border: '1px solid #ccc',
        backgroundColor: currentBackgroundColor,
      },
    };
  }, [width, height, startDrawing, continueDrawing, endDrawing, currentBackgroundColor]);

  return {
    isEmpty,
    strokes,
    canvasRef,
    clear,
    undo,
    toDataURL,
    toSVG,
    setPenColor,
    setPenWidth,
    setBackgroundColor,
    getSignaturePadProps,
  };
}

export default useSignatureCapture;
