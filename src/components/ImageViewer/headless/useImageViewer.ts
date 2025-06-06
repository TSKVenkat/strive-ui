import { useState, useCallback, useRef, useEffect } from 'react';

export interface ImageViewerOptions {
  /**
   * Source URL of the image
   */
  src?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Initial zoom level
   */
  initialZoom?: number;
  /**
   * Initial rotation in degrees
   */
  initialRotation?: number;
  /**
   * Whether to show zoom controls
   */
  showZoomControls?: boolean;
  /**
   * Whether to show rotation controls
   */
  showRotationControls?: boolean;
  /**
   * Whether to show fullscreen button
   */
  showFullscreenButton?: boolean;
  /**
   * Whether to show download button
   */
  showDownloadButton?: boolean;
  /**
   * Whether to show reset button
   */
  showResetButton?: boolean;
  /**
   * Whether to enable drag to pan
   */
  enableDragToPan?: boolean;
  /**
   * Whether to enable wheel to zoom
   */
  enableWheelToZoom?: boolean;
  /**
   * Minimum zoom level
   */
  minZoom?: number;
  /**
   * Maximum zoom level
   */
  maxZoom?: number;
  /**
   * Zoom step for zoom controls
   */
  zoomStep?: number;
  /**
   * Rotation step for rotation controls in degrees
   */
  rotationStep?: number;
  /**
   * Callback when the zoom level changes
   */
  onZoomChange?: (zoom: number) => void;
  /**
   * Callback when the rotation changes
   */
  onRotationChange?: (rotation: number) => void;
  /**
   * Callback when entering fullscreen
   */
  onEnterFullscreen?: () => void;
  /**
   * Callback when exiting fullscreen
   */
  onExitFullscreen?: () => void;
  /**
   * Callback when the image is downloaded
   */
  onDownload?: () => void;
  /**
   * Callback when the image is reset
   */
  onReset?: () => void;
  /**
   * Callback when the image is loaded
   */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  /**
   * Callback when the image fails to load
   */
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
}

export interface UseImageViewerReturn {
  /**
   * Source URL of the image
   */
  src: string;
  /**
   * Set the source URL of the image
   */
  setSrc: (src: string) => void;
  /**
   * Alt text for the image
   */
  alt: string;
  /**
   * Set the alt text for the image
   */
  setAlt: (alt: string) => void;
  /**
   * Current zoom level
   */
  zoom: number;
  /**
   * Set the zoom level
   */
  setZoom: (zoom: number) => void;
  /**
   * Zoom in
   */
  zoomIn: () => void;
  /**
   * Zoom out
   */
  zoomOut: () => void;
  /**
   * Reset zoom to 100%
   */
  resetZoom: () => void;
  /**
   * Current rotation in degrees
   */
  rotation: number;
  /**
   * Set the rotation
   */
  setRotation: (rotation: number) => void;
  /**
   * Rotate left by rotation step
   */
  rotateLeft: () => void;
  /**
   * Rotate right by rotation step
   */
  rotateRight: () => void;
  /**
   * Reset rotation to 0 degrees
   */
  resetRotation: () => void;
  /**
   * Current pan position
   */
  pan: { x: number; y: number };
  /**
   * Set the pan position
   */
  setPan: (pan: { x: number; y: number }) => void;
  /**
   * Reset pan to center
   */
  resetPan: () => void;
  /**
   * Whether the image is in fullscreen mode
   */
  isFullscreen: boolean;
  /**
   * Enter fullscreen mode
   */
  enterFullscreen: () => void;
  /**
   * Exit fullscreen mode
   */
  exitFullscreen: () => void;
  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen: () => void;
  /**
   * Download the image
   */
  downloadImage: () => void;
  /**
   * Reset all transformations (zoom, rotation, pan)
   */
  resetAll: () => void;
  /**
   * Whether the image is loading
   */
  isLoading: boolean;
  /**
   * Whether the image has loaded
   */
  isLoaded: boolean;
  /**
   * Whether the image has an error
   */
  hasError: boolean;
  /**
   * Error message if any
   */
  error: string | null;
  /**
   * Reference to the container element
   */
  containerRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the image element
   */
  imageRef: React.RefObject<HTMLImageElement>;
  /**
   * Get props for the container element
   */
  getContainerProps: () => {
    ref: React.RefObject<HTMLDivElement>;
    style: React.CSSProperties;
    tabIndex: number;
  };
  /**
   * Get props for the image element
   */
  getImageProps: () => {
    ref: React.RefObject<HTMLImageElement>;
    src: string;
    alt: string;
    style: React.CSSProperties;
    onLoad: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    onError: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    draggable: boolean;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  /**
   * Get props for the zoom in button
   */
  getZoomInButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    disabled: boolean;
  };
  /**
   * Get props for the zoom out button
   */
  getZoomOutButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    disabled: boolean;
  };
  /**
   * Get props for the reset zoom button
   */
  getResetZoomButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    disabled: boolean;
  };
  /**
   * Get props for the rotate left button
   */
  getRotateLeftButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the rotate right button
   */
  getRotateRightButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the reset rotation button
   */
  getResetRotationButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    disabled: boolean;
  };
  /**
   * Get props for the fullscreen button
   */
  getFullscreenButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
  /**
   * Get props for the download button
   */
  getDownloadButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the reset all button
   */
  getResetAllButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    disabled: boolean;
  };
}

/**
 * Hook for creating an image viewer
 */
export function useImageViewer(options: ImageViewerOptions = {}): UseImageViewerReturn {
  // Destructure options with defaults
  const {
    src: initialSrc = '',
    alt: initialAlt = '',
    initialZoom = 1,
    initialRotation = 0,
    showZoomControls = true,
    showRotationControls = true,
    showFullscreenButton = true,
    showDownloadButton = true,
    showResetButton = true,
    enableDragToPan = true,
    enableWheelToZoom = true,
    minZoom = 0.1,
    maxZoom = 5,
    zoomStep = 0.1,
    rotationStep = 90,
    onZoomChange,
    onRotationChange,
    onEnterFullscreen,
    onExitFullscreen,
    onDownload,
    onReset,
    onLoad,
    onError,
  } = options;

  // State for image source and alt
  const [src, setSrc] = useState<string>(initialSrc);
  const [alt, setAlt] = useState<string>(initialAlt);
  
  // State for transformations
  const [zoom, setZoomState] = useState<number>(initialZoom);
  const [rotation, setRotationState] = useState<number>(initialRotation);
  const [pan, setPanState] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // State for fullscreen
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // State for loading
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Drag state
  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // Handle zoom change
  const setZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
    setZoomState(clampedZoom);
    onZoomChange?.(clampedZoom);
  }, [minZoom, maxZoom, onZoomChange]);

  // Zoom in
  const zoomIn = useCallback(() => {
    setZoom(zoom + zoomStep);
  }, [zoom, zoomStep, setZoom]);

  // Zoom out
  const zoomOut = useCallback(() => {
    setZoom(zoom - zoomStep);
  }, [zoom, zoomStep, setZoom]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    setZoom(1);
  }, [setZoom]);

  // Handle rotation change
  const setRotation = useCallback((newRotation: number) => {
    // Normalize rotation to be between 0 and 360
    const normalizedRotation = ((newRotation % 360) + 360) % 360;
    setRotationState(normalizedRotation);
    onRotationChange?.(normalizedRotation);
  }, [onRotationChange]);

  // Rotate left
  const rotateLeft = useCallback(() => {
    setRotation(rotation - rotationStep);
  }, [rotation, rotationStep, setRotation]);

  // Rotate right
  const rotateRight = useCallback(() => {
    setRotation(rotation + rotationStep);
  }, [rotation, rotationStep, setRotation]);

  // Reset rotation
  const resetRotation = useCallback(() => {
    setRotation(0);
  }, [setRotation]);

  // Set pan
  const setPan = useCallback((newPan: { x: number; y: number }) => {
    setPanState(newPan);
  }, []);

  // Reset pan
  const resetPan = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, [setPan]);

  // Enter fullscreen
  const enterFullscreen = useCallback(() => {
    const element = containerRef.current;
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
      onEnterFullscreen?.();
    }
  }, [onEnterFullscreen]);

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
      onExitFullscreen?.();
    }
  }, [onExitFullscreen]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Download image
  const downloadImage = useCallback(() => {
    if (src) {
      const link = document.createElement('a');
      link.href = src;
      link.download = src.split('/').pop() || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onDownload?.();
    }
  }, [src, onDownload]);

  // Reset all transformations
  const resetAll = useCallback(() => {
    resetZoom();
    resetRotation();
    resetPan();
    onReset?.();
  }, [resetZoom, resetRotation, resetPan, onReset]);

  // Handle fullscreen change
  const handleFullscreenChange = useCallback(() => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    
    setIsFullscreen(isCurrentlyFullscreen);
    
    if (!isCurrentlyFullscreen) {
      onExitFullscreen?.();
    }
  }, [onExitFullscreen]);

  // Add fullscreen change event listener
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  // Handle wheel to zoom
  useEffect(() => {
    if (!enableWheelToZoom) return;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const delta = -e.deltaY;
      const zoomFactor = delta > 0 ? 1.1 : 0.9;
      
      setZoom(zoom * zoomFactor);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [enableWheelToZoom, zoom, setZoom]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isImageFocused = document.activeElement === containerRef.current;
      if (!isImageFocused) return;
      
      switch (e.key) {
        case '+':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
        case 'r':
          rotateRight();
          break;
        case 'l':
          rotateLeft();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'd':
          downloadImage();
          break;
        case 'Escape':
          resetAll();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    zoomIn,
    zoomOut,
    resetZoom,
    rotateRight,
    rotateLeft,
    toggleFullscreen,
    downloadImage,
    resetAll
  ]);

  // Handle mouse drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!enableDragToPan) return;
    
    e.preventDefault();
    
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      setPan({
        x: dragRef.current.startPanX + dx,
        y: dragRef.current.startPanY + dy,
      });
    };
    
    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [enableDragToPan, pan, setPan]);

  // Handle touch drag
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enableDragToPan) return;
    
    e.preventDefault();
    
    const touch = e.touches[0];
    
    dragRef.current = {
      isDragging: true,
      startX: touch.clientX,
      startY: touch.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragRef.current.isDragging) return;
      
      const touch = e.touches[0];
      
      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;
      
      setPan({
        x: dragRef.current.startPanX + dx,
        y: dragRef.current.startPanY + dy,
      });
    };
    
    const handleTouchEnd = () => {
      dragRef.current.isDragging = false;
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [enableDragToPan, pan, setPan]);

  // Handle image load
  const handleImageLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setIsLoaded(true);
    setHasError(false);
    setError(null);
    
    onLoad?.(event);
  }, [onLoad]);

  // Handle image error
  const handleImageError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setIsLoaded(false);
    setHasError(true);
    setError('Failed to load image');
    
    onError?.(event);
  }, [onError]);

  // Get container props
  const getContainerProps = useCallback(() => {
    return {
      ref: containerRef,
      style: {
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
      } as React.CSSProperties,
      tabIndex: 0,
    };
  }, []);

  // Get image props
  const getImageProps = useCallback(() => {
    return {
      ref: imageRef,
      src,
      alt,
      style: {
        transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s ease',
        maxWidth: '100%',
        maxHeight: '100%',
      } as React.CSSProperties,
      onLoad: handleImageLoad,
      onError: handleImageError,
      draggable: false,
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
    };
  }, [src, alt, pan, rotation, zoom, handleImageLoad, handleImageError, handleMouseDown, handleTouchStart]);

  // Get zoom in button props
  const getZoomInButtonProps = useCallback(() => {
    return {
      onClick: zoomIn,
      'aria-label': 'Zoom in',
      disabled: zoom >= maxZoom,
    };
  }, [zoomIn, zoom, maxZoom]);

  // Get zoom out button props
  const getZoomOutButtonProps = useCallback(() => {
    return {
      onClick: zoomOut,
      'aria-label': 'Zoom out',
      disabled: zoom <= minZoom,
    };
  }, [zoomOut, zoom, minZoom]);

  // Get reset zoom button props
  const getResetZoomButtonProps = useCallback(() => {
    return {
      onClick: resetZoom,
      'aria-label': 'Reset zoom',
      disabled: zoom === 1,
    };
  }, [resetZoom, zoom]);

  // Get rotate left button props
  const getRotateLeftButtonProps = useCallback(() => {
    return {
      onClick: rotateLeft,
      'aria-label': 'Rotate left',
    };
  }, [rotateLeft]);

  // Get rotate right button props
  const getRotateRightButtonProps = useCallback(() => {
    return {
      onClick: rotateRight,
      'aria-label': 'Rotate right',
    };
  }, [rotateRight]);

  // Get reset rotation button props
  const getResetRotationButtonProps = useCallback(() => {
    return {
      onClick: resetRotation,
      'aria-label': 'Reset rotation',
      disabled: rotation === 0,
    };
  }, [resetRotation, rotation]);

  // Get fullscreen button props
  const getFullscreenButtonProps = useCallback(() => {
    return {
      onClick: toggleFullscreen,
      'aria-label': isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen',
      'aria-pressed': isFullscreen,
    };
  }, [toggleFullscreen, isFullscreen]);

  // Get download button props
  const getDownloadButtonProps = useCallback(() => {
    return {
      onClick: downloadImage,
      'aria-label': 'Download image',
    };
  }, [downloadImage]);

  // Get reset all button props
  const getResetAllButtonProps = useCallback(() => {
    return {
      onClick: resetAll,
      'aria-label': 'Reset image',
      disabled: zoom === 1 && rotation === 0 && pan.x === 0 && pan.y === 0,
    };
  }, [resetAll, zoom, rotation, pan]);

  return {
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
    error,
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
  };
}

export default useImageViewer;
