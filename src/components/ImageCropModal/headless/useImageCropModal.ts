import { useState, useCallback, useRef } from 'react';
import { useModal, ModalOptions } from '../../Modal/headless/useModal';

export interface CropArea {
  /**
   * X position of the crop area
   */
  x: number;
  /**
   * Y position of the crop area
   */
  y: number;
  /**
   * Width of the crop area
   */
  width: number;
  /**
   * Height of the crop area
   */
  height: number;
}

export interface ImageCropModalOptions extends ModalOptions {
  /**
   * Source of the image to crop
   */
  src?: string;
  /**
   * Initial crop area
   */
  initialCropArea?: CropArea;
  /**
   * Aspect ratio of the crop area (width / height)
   */
  aspectRatio?: number;
  /**
   * Whether to maintain the aspect ratio when resizing
   */
  lockAspectRatio?: boolean;
  /**
   * Minimum width of the crop area in pixels
   */
  minWidth?: number;
  /**
   * Minimum height of the crop area in pixels
   */
  minHeight?: number;
  /**
   * Maximum width of the crop area in pixels
   */
  maxWidth?: number;
  /**
   * Maximum height of the crop area in pixels
   */
  maxHeight?: number;
  /**
   * Whether to show grid lines
   */
  showGrid?: boolean;
  /**
   * Whether to show the crop area
   */
  showCropArea?: boolean;
  /**
   * Whether to show resize handles
   */
  showResizeHandles?: boolean;
  /**
   * Whether to show rotate controls
   */
  showRotateControls?: boolean;
  /**
   * Whether to show zoom controls
   */
  showZoomControls?: boolean;
  /**
   * Whether to show flip controls
   */
  showFlipControls?: boolean;
  /**
   * Whether to show reset button
   */
  showResetButton?: boolean;
  /**
   * Whether to show crop button
   */
  showCropButton?: boolean;
  /**
   * Whether to show cancel button
   */
  showCancelButton?: boolean;
  /**
   * Whether to close the modal when the crop is complete
   */
  closeOnCrop?: boolean;
  /**
   * Whether to close the modal when clicking outside
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to close the modal when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Callback when crop area changes
   */
  onCropAreaChange?: (cropArea: CropArea) => void;
  /**
   * Callback when crop is complete
   */
  onCrop?: (croppedImage: string, cropArea: CropArea) => void;
  /**
   * Callback when rotation changes
   */
  onRotationChange?: (rotation: number) => void;
  /**
   * Callback when zoom changes
   */
  onZoomChange?: (zoom: number) => void;
  /**
   * Callback when flip changes
   */
  onFlipChange?: (flipX: boolean, flipY: boolean) => void;
}

export interface UseImageCropModalReturn {
  /**
   * Whether the image crop modal is open
   */
  isOpen: boolean;
  /**
   * Open the image crop modal
   */
  open: () => void;
  /**
   * Close the image crop modal
   */
  close: () => void;
  /**
   * Toggle the image crop modal
   */
  toggle: () => void;
  /**
   * Source of the image to crop
   */
  src: string;
  /**
   * Set the source of the image to crop
   */
  setSrc: (src: string) => void;
  /**
   * Current crop area
   */
  cropArea: CropArea;
  /**
   * Set the crop area
   */
  setCropArea: (cropArea: CropArea) => void;
  /**
   * Current rotation in degrees
   */
  rotation: number;
  /**
   * Set the rotation
   */
  setRotation: (rotation: number) => void;
  /**
   * Current zoom level
   */
  zoom: number;
  /**
   * Set the zoom level
   */
  setZoom: (zoom: number) => void;
  /**
   * Whether the image is flipped horizontally
   */
  flipX: boolean;
  /**
   * Set whether the image is flipped horizontally
   */
  setFlipX: (flipX: boolean) => void;
  /**
   * Whether the image is flipped vertically
   */
  flipY: boolean;
  /**
   * Set whether the image is flipped vertically
   */
  setFlipY: (flipY: boolean) => void;
  /**
   * Reset the crop area, rotation, zoom, and flip
   */
  reset: () => void;
  /**
   * Crop the image
   */
  crop: () => void;
  /**
   * Ref for the image crop container
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the image element
   */
  imageRef: React.RefObject<HTMLImageElement>;
  /**
   * Ref for the crop area element
   */
  cropAreaRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the image crop container
   */
  getContainerProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: React.RefObject<HTMLElement>;
  };
  /**
   * Get props for the image crop overlay/backdrop
   */
  getBackdropProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the image crop content
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the image crop trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the image crop close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the image element
   */
  getImageProps: () => {
    src: string;
    alt: string;
    style: React.CSSProperties;
    ref: React.RefObject<HTMLImageElement>;
    onLoad: () => void;
  };
  /**
   * Get props for the crop area element
   */
  getCropAreaProps: () => {
    style: React.CSSProperties;
    ref: React.RefObject<HTMLElement>;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
  };
  /**
   * Get props for the crop button
   */
  getCropButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the reset button
   */
  getResetButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
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
   * Get props for the zoom in button
   */
  getZoomInButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the zoom out button
   */
  getZoomOutButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the flip horizontal button
   */
  getFlipHorizontalButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
  /**
   * Get props for the flip vertical button
   */
  getFlipVerticalButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
}

/**
 * Hook for creating an image crop modal
 */
export function useImageCropModal(options: ImageCropModalOptions = {}): UseImageCropModalReturn {
  const {
    src: initialSrc = '',
    initialCropArea = { x: 0, y: 0, width: 0, height: 0 },
    aspectRatio,
    lockAspectRatio = false,
    minWidth = 10,
    minHeight = 10,
    maxWidth,
    maxHeight,
    showGrid = true,
    showCropArea = true,
    showResizeHandles = true,
    showRotateControls = true,
    showZoomControls = true,
    showFlipControls = true,
    showResetButton = true,
    showCropButton = true,
    showCancelButton = true,
    closeOnCrop = true,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    onCropAreaChange,
    onCrop,
    onRotationChange,
    onZoomChange,
    onFlipChange,
    ...modalOptions
  } = options;

  // Use modal hook for basic functionality
  const modalProps = useModal({
    ...modalOptions,
    closeOnOutsideClick,
    closeOnEscape,
  });
  
  // State for image and crop area
  const [src, setSrc] = useState<string>(initialSrc);
  const [cropArea, setCropArea] = useState<CropArea>(initialCropArea);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [flipX, setFlipX] = useState<boolean>(false);
  const [flipY, setFlipY] = useState<boolean>(false);
  
  // Refs for elements
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropAreaRef = useRef<HTMLElement>(null);
  
  // Callback when crop area changes
  const handleCropAreaChange = useCallback((newCropArea: CropArea) => {
    setCropArea(newCropArea);
    onCropAreaChange?.(newCropArea);
  }, [onCropAreaChange]);
  
  // Callback when rotation changes
  const handleRotationChange = useCallback((newRotation: number) => {
    setRotation(newRotation);
    onRotationChange?.(newRotation);
  }, [onRotationChange]);
  
  // Callback when zoom changes
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [onZoomChange]);
  
  // Callback when flip changes
  const handleFlipChange = useCallback((newFlipX: boolean, newFlipY: boolean) => {
    setFlipX(newFlipX);
    setFlipY(newFlipY);
    onFlipChange?.(newFlipX, newFlipY);
  }, [onFlipChange]);
  
  // Reset the crop area, rotation, zoom, and flip
  const reset = useCallback(() => {
    setCropArea(initialCropArea);
    setRotation(0);
    setZoom(1);
    setFlipX(false);
    setFlipY(false);
  }, [initialCropArea]);
  
  // Crop the image
  const crop = useCallback(() => {
    if (!imageRef.current) {
      return;
    }
    
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return;
    }
    
    // Set canvas dimensions to crop area dimensions
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    
    // Draw the image on the canvas with the crop area
    ctx.save();
    
    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    ctx.drawImage(
      imageRef.current,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );
    
    ctx.restore();
    
    // Get the cropped image as a data URL
    const croppedImage = canvas.toDataURL('image/png');
    
    // Call the onCrop callback
    onCrop?.(croppedImage, cropArea);
    
    // Close the modal if closeOnCrop is true
    if (closeOnCrop) {
      modalProps.close();
    }
  }, [cropArea, rotation, flipX, flipY, onCrop, closeOnCrop, modalProps]);
  
  // Get container props
  const getContainerProps = useCallback(() => {
    return {
      ...modalProps.getContainerProps(),
      ref: containerRef,
    };
  }, [modalProps]);
  
  // Get backdrop props
  const getBackdropProps = useCallback(() => {
    return modalProps.getOverlayProps();
  }, [modalProps]);
  
  // Get content props
  const getContentProps = useCallback(() => {
    return {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
      },
    };
  }, []);
  
  // Get trigger props
  const getTriggerProps = useCallback(() => {
    return modalProps.getTriggerProps();
  }, [modalProps]);
  
  // Get close button props
  const getCloseButtonProps = useCallback(() => {
    return modalProps.getCloseButtonProps();
  }, [modalProps]);
  
  // Get image props
  const getImageProps = useCallback(() => {
    return {
      src,
      alt: 'Image to crop',
      style: {
        transform: `
          scale(${zoom})
          rotate(${rotation}deg)
          scaleX(${flipX ? -1 : 1})
          scaleY(${flipY ? -1 : 1})
        `,
        transformOrigin: 'center',
        maxWidth: '100%',
        maxHeight: '100%',
      },
      ref: imageRef,
      onLoad: () => {
        // Initialize crop area based on image dimensions
        if (imageRef.current && cropArea.width === 0 && cropArea.height === 0) {
          const { width, height } = imageRef.current;
          const newCropArea = {
            x: 0,
            y: 0,
            width: width,
            height: height,
          };
          
          // Apply aspect ratio if specified
          if (aspectRatio) {
            if (width / height > aspectRatio) {
              newCropArea.width = height * aspectRatio;
              newCropArea.x = (width - newCropArea.width) / 2;
            } else {
              newCropArea.height = width / aspectRatio;
              newCropArea.y = (height - newCropArea.height) / 2;
            }
          }
          
          handleCropAreaChange(newCropArea);
        }
      },
    };
  }, [src, zoom, rotation, flipX, flipY, cropArea, aspectRatio, handleCropAreaChange]);
  
  // Get crop area props
  const getCropAreaProps = useCallback(() => {
    return {
      style: {
        position: 'absolute' as const,
        left: `${cropArea.x}px`,
        top: `${cropArea.y}px`,
        width: `${cropArea.width}px`,
        height: `${cropArea.height}px`,
        border: '1px solid white',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        cursor: 'move',
      },
      ref: cropAreaRef,
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault();
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startCropArea = { ...cropArea };
        
        const handleMouseMove = (e: MouseEvent) => {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;
          
          const newCropArea = {
            ...startCropArea,
            x: Math.max(0, startCropArea.x + deltaX),
            y: Math.max(0, startCropArea.y + deltaY),
          };
          
          // Ensure crop area stays within image bounds
          if (imageRef.current) {
            const { width, height } = imageRef.current;
            
            if (newCropArea.x + newCropArea.width > width) {
              newCropArea.x = width - newCropArea.width;
            }
            
            if (newCropArea.y + newCropArea.height > height) {
              newCropArea.y = height - newCropArea.height;
            }
          }
          
          handleCropAreaChange(newCropArea);
        };
        
        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      },
      onTouchStart: (e: React.TouchEvent) => {
        e.preventDefault();
        
        const touch = e.touches[0];
        const startX = touch.clientX;
        const startY = touch.clientY;
        const startCropArea = { ...cropArea };
        
        const handleTouchMove = (e: TouchEvent) => {
          const touch = e.touches[0];
          const deltaX = touch.clientX - startX;
          const deltaY = touch.clientY - startY;
          
          const newCropArea = {
            ...startCropArea,
            x: Math.max(0, startCropArea.x + deltaX),
            y: Math.max(0, startCropArea.y + deltaY),
          };
          
          // Ensure crop area stays within image bounds
          if (imageRef.current) {
            const { width, height } = imageRef.current;
            
            if (newCropArea.x + newCropArea.width > width) {
              newCropArea.x = width - newCropArea.width;
            }
            
            if (newCropArea.y + newCropArea.height > height) {
              newCropArea.y = height - newCropArea.height;
            }
          }
          
          handleCropAreaChange(newCropArea);
        };
        
        const handleTouchEnd = () => {
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
        };
        
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
      },
    };
  }, [cropArea, handleCropAreaChange]);
  
  // Get crop button props
  const getCropButtonProps = useCallback(() => {
    return {
      onClick: crop,
      'aria-label': 'Crop image',
    };
  }, [crop]);
  
  // Get reset button props
  const getResetButtonProps = useCallback(() => {
    return {
      onClick: reset,
      'aria-label': 'Reset crop',
    };
  }, [reset]);
  
  // Get rotate left button props
  const getRotateLeftButtonProps = useCallback(() => {
    return {
      onClick: () => {
        const newRotation = (rotation - 90) % 360;
        handleRotationChange(newRotation);
      },
      'aria-label': 'Rotate left',
    };
  }, [rotation, handleRotationChange]);
  
  // Get rotate right button props
  const getRotateRightButtonProps = useCallback(() => {
    return {
      onClick: () => {
        const newRotation = (rotation + 90) % 360;
        handleRotationChange(newRotation);
      },
      'aria-label': 'Rotate right',
    };
  }, [rotation, handleRotationChange]);
  
  // Get zoom in button props
  const getZoomInButtonProps = useCallback(() => {
    return {
      onClick: () => {
        const newZoom = Math.min(zoom + 0.1, 3);
        handleZoomChange(newZoom);
      },
      'aria-label': 'Zoom in',
    };
  }, [zoom, handleZoomChange]);
  
  // Get zoom out button props
  const getZoomOutButtonProps = useCallback(() => {
    return {
      onClick: () => {
        const newZoom = Math.max(zoom - 0.1, 0.1);
        handleZoomChange(newZoom);
      },
      'aria-label': 'Zoom out',
    };
  }, [zoom, handleZoomChange]);
  
  // Get flip horizontal button props
  const getFlipHorizontalButtonProps = useCallback(() => {
    return {
      onClick: () => {
        const newFlipX = !flipX;
        handleFlipChange(newFlipX, flipY);
      },
      'aria-label': 'Flip horizontal',
      'aria-pressed': flipX,
    };
  }, [flipX, flipY, handleFlipChange]);
  
  // Get flip vertical button props
  const getFlipVerticalButtonProps = useCallback(() => {
    return {
      onClick: () => {
        const newFlipY = !flipY;
        handleFlipChange(flipX, newFlipY);
      },
      'aria-label': 'Flip vertical',
      'aria-pressed': flipY,
    };
  }, [flipX, flipY, handleFlipChange]);

  return {
    isOpen: modalProps.isOpen,
    open: modalProps.open,
    close: modalProps.close,
    toggle: modalProps.toggle,
    src,
    setSrc,
    cropArea,
    setCropArea: handleCropAreaChange,
    rotation,
    setRotation: handleRotationChange,
    zoom,
    setZoom: handleZoomChange,
    flipX,
    setFlipX: (newFlipX: boolean) => handleFlipChange(newFlipX, flipY),
    flipY,
    setFlipY: (newFlipY: boolean) => handleFlipChange(flipX, newFlipY),
    reset,
    crop,
    containerRef,
    imageRef,
    cropAreaRef,
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
  };
}

export default useImageCropModal;
