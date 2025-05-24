import { useState, useRef, useCallback, useEffect } from 'react';

export type DrawingTool = 'pen' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text';
export type DrawingMode = 'draw' | 'select' | 'pan';

export interface DrawingStyle {
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
}

export interface DrawingObject {
  id: string;
  type: DrawingTool;
  points: { x: number; y: number }[];
  style: DrawingStyle;
  text?: string;
}

export interface DrawingBoardOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  initialObjects?: DrawingObject[];
  initialTool?: DrawingTool;
  initialStyle?: Partial<DrawingStyle>;
  initialMode?: DrawingMode;
  gridSize?: number;
  showGrid?: boolean;
  snapToGrid?: boolean;
  onDrawingChange?: (objects: DrawingObject[]) => void;
  onObjectAdd?: (object: DrawingObject) => void;
  onObjectRemove?: (objectId: string) => void;
  onObjectSelect?: (objectId: string | null) => void;
}

export interface UseDrawingBoardReturn {
  objects: DrawingObject[];
  selectedObjectId: string | null;
  tool: DrawingTool;
  mode: DrawingMode;
  style: DrawingStyle;
  isDrawing: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  setTool: (tool: DrawingTool) => void;
  setMode: (mode: DrawingMode) => void;
  setStyle: (style: Partial<DrawingStyle>) => void;
  addObject: (object: Omit<DrawingObject, 'id'>) => string;
  removeObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  clear: () => void;
  undo: () => void;
  redo: () => void;
  exportImage: (type?: string, quality?: number) => string;
  importImage: (dataUrl: string) => void;
  getBoardProps: () => {
    ref: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
}

export function useDrawingBoard(options: DrawingBoardOptions = {}): UseDrawingBoardReturn {
  const {
    width = 800,
    height = 600,
    backgroundColor = '#ffffff',
    initialObjects = [],
    initialTool = 'pen',
    initialStyle = {},
    initialMode = 'draw',
    gridSize = 20,
    showGrid = false,
    snapToGrid = false,
    onDrawingChange,
    onObjectAdd,
    onObjectRemove,
    onObjectSelect,
  } = options;

  const defaultStyle: DrawingStyle = {
    strokeColor: '#000000',
    fillColor: 'transparent',
    strokeWidth: 2,
    opacity: 1,
    fontSize: 16,
    fontFamily: 'Arial',
  };

  const [objects, setObjects] = useState<DrawingObject[]>(initialObjects);
  const [history, setHistory] = useState<DrawingObject[][]>([initialObjects]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [tool, setTool] = useState<DrawingTool>(initialTool);
  const [mode, setMode] = useState<DrawingMode>(initialMode);
  const [style, setStyleState] = useState<DrawingStyle>({ ...defaultStyle, ...initialStyle });
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [currentObject, setCurrentObject] = useState<DrawingObject | null>(null);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctxRef.current = ctx;
        redrawCanvas();
      }
    }
  }, []);

  // Redraw canvas when objects change
  useEffect(() => {
    redrawCanvas();
    onDrawingChange?.(objects);
  }, [objects, backgroundColor, showGrid, gridSize]);

  // Generate unique ID
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  // Set style
  const setStyle = useCallback((newStyle: Partial<DrawingStyle>) => {
    setStyleState(prevStyle => ({ ...prevStyle, ...newStyle }));
  }, []);

  // Get mouse/touch position relative to canvas
  const getPointerPosition = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    // Apply snap to grid if enabled
    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }
    
    return { x, y };
  }, [gridSize, snapToGrid]);

  // Handle drawing start
  const handleDrawingStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (mode !== 'draw') return;
    
    const pos = getPointerPosition(e);
    setIsDrawing(true);
    
    const newObject: DrawingObject = {
      id: generateId(),
      type: tool,
      points: [pos],
      style: { ...style },
    };
    
    setCurrentObject(newObject);
  }, [mode, tool, style, getPointerPosition, generateId]);

  // Handle drawing move
  const handleDrawingMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentObject || mode !== 'draw') return;
    
    const pos = getPointerPosition(e);
    
    setCurrentObject(prev => {
      if (!prev) return null;
      
      const updatedObject = { ...prev };
      
      if (tool === 'pen' || tool === 'eraser') {
        updatedObject.points = [...prev.points, pos];
      } else {
        // For shapes, we only need start and current point
        updatedObject.points = [prev.points[0], pos];
      }
      
      return updatedObject;
    });
    
    redrawCanvas();
  }, [isDrawing, currentObject, mode, tool, getPointerPosition]);

  // Handle drawing end
  const handleDrawingEnd = useCallback(() => {
    if (!isDrawing || !currentObject || mode !== 'draw') return;
    
    setIsDrawing(false);
    
    // Add the completed object to objects
    setObjects(prev => {
      const newObjects = [...prev, currentObject];
      
      // Add to history
      addToHistory(newObjects);
      
      return newObjects;
    });
    
    onObjectAdd?.(currentObject);
    setCurrentObject(null);
  }, [isDrawing, currentObject, mode, onObjectAdd]);

  // Add to history
  const addToHistory = useCallback((newObjects: DrawingObject[]) => {
    setHistory(prev => {
      // Remove any future history if we've gone back and then drawn something new
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newObjects];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Add object
  const addObject = useCallback((object: Omit<DrawingObject, 'id'>) => {
    const id = generateId();
    const newObject: DrawingObject = {
      ...object,
      id,
    };
    
    setObjects(prev => {
      const newObjects = [...prev, newObject];
      addToHistory(newObjects);
      return newObjects;
    });
    
    onObjectAdd?.(newObject);
    return id;
  }, [generateId, onObjectAdd]);

  // Remove object
  const removeObject = useCallback((id: string) => {
    setObjects(prev => {
      const newObjects = prev.filter(obj => obj.id !== id);
      addToHistory(newObjects);
      return newObjects;
    });
    
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
      onObjectSelect?.(null);
    }
    
    onObjectRemove?.(id);
  }, [selectedObjectId, onObjectRemove, onObjectSelect]);

  // Select object
  const selectObject = useCallback((id: string | null) => {
    setSelectedObjectId(id);
    onObjectSelect?.(id);
  }, [onObjectSelect]);

  // Clear canvas
  const clear = useCallback(() => {
    setObjects([]);
    addToHistory([]);
  }, []);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setObjects(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setObjects(history[newIndex]);
    }
  }, [history, historyIndex]);

  // Export image
  const exportImage = useCallback((type = 'image/png', quality = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return '';
    
    return canvas.toDataURL(type, quality);
  }, []);

  // Import image
  const importImage = useCallback((dataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      
      if (!canvas || !ctx) return;
      
      ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
  }, []);

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    
    if (!canvas || !ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
    
    // Draw objects
    objects.forEach(obj => {
      drawObject(ctx, obj);
    });
    
    // Draw current object if drawing
    if (isDrawing && currentObject) {
      drawObject(ctx, currentObject);
    }
    
    // Highlight selected object
    if (selectedObjectId) {
      const selectedObject = objects.find(obj => obj.id === selectedObjectId);
      if (selectedObject) {
        drawSelectionBox(ctx, selectedObject);
      }
    }
  }, [objects, isDrawing, currentObject, selectedObjectId, backgroundColor, showGrid, gridSize]);

  // Draw object
  const drawObject = useCallback((ctx: CanvasRenderingContext2D, obj: DrawingObject) => {
    const { type, points, style } = obj;
    
    ctx.strokeStyle = style.strokeColor;
    ctx.fillStyle = style.fillColor;
    ctx.lineWidth = style.strokeWidth;
    ctx.globalAlpha = style.opacity;
    
    switch (type) {
      case 'pen':
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.stroke();
        break;
        
      case 'eraser':
        const savedCompositeOperation = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'destination-out';
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        
        ctx.lineWidth = style.strokeWidth * 2;
        ctx.stroke();
        ctx.globalCompositeOperation = savedCompositeOperation;
        break;
        
      case 'line':
        if (points.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.stroke();
        break;
        
      case 'rectangle':
        if (points.length < 2) return;
        
        const [start, end] = points;
        const width = end.x - start.x;
        const height = end.y - start.y;
        
        ctx.beginPath();
        ctx.rect(start.x, start.y, width, height);
        ctx.stroke();
        
        if (style.fillColor !== 'transparent') {
          ctx.fill();
        }
        break;
        
      case 'circle':
        if (points.length < 2) return;
        
        const [center, radiusPoint] = points;
        const radius = Math.sqrt(
          Math.pow(radiusPoint.x - center.x, 2) + Math.pow(radiusPoint.y - center.y, 2)
        );
        
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        if (style.fillColor !== 'transparent') {
          ctx.fill();
        }
        break;
        
      case 'text':
        if (!obj.text) return;
        
        ctx.font = `${style.fontSize}px ${style.fontFamily}`;
        ctx.fillStyle = style.strokeColor;
        ctx.fillText(obj.text, points[0].x, points[0].y);
        break;
    }
    
    ctx.globalAlpha = 1;
  }, []);

  // Draw selection box
  const drawSelectionBox = useCallback((ctx: CanvasRenderingContext2D, obj: DrawingObject) => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    // Find bounding box
    obj.points.forEach(point => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });
    
    // Add padding
    const padding = 5;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    // Draw dashed rectangle
    ctx.strokeStyle = '#0095ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
    ctx.setLineDash([]);
    
    // Draw control points
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0095ff';
    ctx.lineWidth = 1;
    
    const controlPoints = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
      { x: (minX + maxX) / 2, y: minY },
      { x: maxX, y: (minY + maxY) / 2 },
      { x: (minX + maxX) / 2, y: maxY },
      { x: minX, y: (minY + maxY) / 2 },
    ];
    
    controlPoints.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });
  }, []);

  // Get board props
  const getBoardProps = useCallback(() => {
    return {
      ref: canvasRef,
      width,
      height,
      onMouseDown: handleDrawingStart,
      onMouseMove: handleDrawingMove,
      onMouseUp: handleDrawingEnd,
      onTouchStart: handleDrawingStart,
      onTouchMove: handleDrawingMove,
      onTouchEnd: handleDrawingEnd,
    };
  }, [width, height, handleDrawingStart, handleDrawingMove, handleDrawingEnd]);

  return {
    objects,
    selectedObjectId,
    tool,
    mode,
    style,
    isDrawing,
    canvasRef,
    setTool,
    setMode,
    setStyle,
    addObject,
    removeObject,
    selectObject,
    clear,
    undo,
    redo,
    exportImage,
    importImage,
    getBoardProps,
  };
}

export default useDrawingBoard;
