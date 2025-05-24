import { useState, useRef, useCallback, useEffect } from 'react';
import { useModal, ModalOptions } from '../../Modal/headless/useModal';

export interface BottomSheetOptions extends ModalOptions {
  /**
   * Initial height of the bottom sheet
   */
  initialHeight?: string | number;
  /**
   * Maximum height of the bottom sheet
   */
  maxHeight?: string | number;
  /**
   * Whether to allow resizing the bottom sheet by dragging
   */
  resizable?: boolean;
  /**
   * Whether to show a drag handle
   */
  showDragHandle?: boolean;
  /**
   * Whether to enable swipe down to close
   */
  enableSwipeToClose?: boolean;
  /**
   * Threshold for swipe to close (percentage of height)
   */
  swipeThreshold?: number;
  /**
   * Whether to show a backdrop behind the bottom sheet
   */
  hasBackdrop?: boolean;
  /**
   * Whether to close the bottom sheet when clicking the backdrop
   */
  closeOnBackdropClick?: boolean;
  /**
   * Whether to close the bottom sheet when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Callback when the bottom sheet is resized
   */
  onResize?: (height: number) => void;
  /**
   * Whether to enable snap points
   */
  enableSnapPoints?: boolean;
  /**
   * Snap points for the bottom sheet (percentage of viewport height)
   */
  snapPoints?: number[];
  /**
   * Whether to enable full screen mode
   */
  enableFullScreen?: boolean;
  /**
   * Whether to start in full screen mode
   */
  defaultFullScreen?: boolean;
  /**
   * Whether to show a close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to trap focus within the bottom sheet
   */
  trapFocus?: boolean;
  /**
   * Whether to prevent scrolling of the body when the bottom sheet is open
   */
  preventScroll?: boolean;
  /**
   * Whether to render the bottom sheet in a portal
   */
  usePortal?: boolean;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
}

export interface UseBottomSheetReturn {
  /**
   * Whether the bottom sheet is open
   */
  isOpen: boolean;
  /**
   * Open the bottom sheet
   */
  open: () => void;
  /**
   * Close the bottom sheet
   */
  close: () => void;
  /**
   * Toggle the bottom sheet
   */
  toggle: () => void;
  /**
   * Current height of the bottom sheet
   */
  height: string | number;
  /**
   * Set the height of the bottom sheet
   */
  setHeight: (height: string | number) => void;
  /**
   * Whether the bottom sheet is in full screen mode
   */
  isFullScreen: boolean;
  /**
   * Toggle full screen mode
   */
  toggleFullScreen: () => void;
  /**
   * Ref for the bottom sheet container
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the drag handle
   */
  dragHandleRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the content
   */
  contentRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the bottom sheet container
   */
  getContainerProps: () => {
    ref: React.RefObject<HTMLElement>;
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    style: React.CSSProperties;
  };
  /**
   * Get props for the bottom sheet overlay/backdrop
   */
  getBackdropProps: () => {
    onClick: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
  };
  /**
   * Get props for the bottom sheet content
   */
  getContentProps: () => {
    ref: React.RefObject<HTMLElement>;
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the bottom sheet drag handle
   */
  getDragHandleProps: () => {
    ref: React.RefObject<HTMLElement>;
    onMouseDown: (e: React.MouseEvent) => void;
    onTouchStart: (e: React.TouchEvent) => void;
    style: React.CSSProperties;
  };
  /**
   * Get props for the bottom sheet trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the bottom sheet close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the bottom sheet full screen button
   */
  getFullScreenButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
}

/**
 * Hook for creating a bottom sheet
 */
export function useBottomSheet(options: BottomSheetOptions = {}): UseBottomSheetReturn {
  const {
    initialHeight = '50vh',
    maxHeight = '90vh',
    resizable = true,
    showDragHandle = true,
    enableSwipeToClose = true,
    swipeThreshold = 0.5,
    hasBackdrop = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    onResize,
    enableSnapPoints = false,
    snapPoints = [25, 50, 75, 100],
    enableFullScreen = false,
    defaultFullScreen = false,
    showCloseButton = true,
    trapFocus = true,
    preventScroll = true,
    usePortal = true,
    portalId = 'bottom-sheet-root',
    ...modalOptions
  } = options;

  // Use modal hook for basic functionality
  const modalProps = useModal({
    ...modalOptions,
    closeOnOutsideClick: closeOnBackdropClick,
    closeOnEscape,
    trapFocus,
    preventScroll,
    usePortal,
    portalId,
  });
  
  // State for height and full screen
  const [height, setHeight] = useState<string | number>(initialHeight);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(defaultFullScreen);
  
  // Refs
  const containerRef = useRef<HTMLElement>(null);
  const dragHandleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  
  // State for dragging
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startY, setStartY] = useState<number>(0);
  const [startHeight, setStartHeight] = useState<number>(0);
  
  // Toggle full screen
  const toggleFullScreen = useCallback(() => {
    setIsFullScreen(prev => !prev);
  }, []);
  
  // Handle drag start
  const handleDragStart = useCallback((clientY: number) => {
    if (!resizable || isFullScreen) return;
    
    setIsDragging(true);
    setStartY(clientY);
    
    if (containerRef.current) {
      setStartHeight(containerRef.current.offsetHeight);
    }
  }, [resizable, isFullScreen]);
  
  // Handle drag move
  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging || !resizable || isFullScreen) return;
    
    const delta = startY - clientY;
    const newHeight = startHeight + delta;
    
    if (containerRef.current) {
      const maxHeightPx = typeof maxHeight === 'string' 
        ? (parseFloat(maxHeight) / 100) * window.innerHeight 
        : maxHeight;
      
      const clampedHeight = Math.min(Math.max(newHeight, 0), maxHeightPx as number);
      
      containerRef.current.style.height = `${clampedHeight}px`;
      onResize?.(clampedHeight);
      
      // Check for swipe to close
      if (enableSwipeToClose && newHeight < startHeight * swipeThreshold) {
        setIsDragging(false);
        modalProps.close();
        return;
      }
      
      // Check for snap points
      if (enableSnapPoints) {
        const viewportHeight = window.innerHeight;
        const heightPercentage = (clampedHeight / viewportHeight) * 100;
        
        // Find closest snap point
        let closestSnapPoint = snapPoints[0];
        let closestDistance = Math.abs(heightPercentage - snapPoints[0]);
        
        for (let i = 1; i < snapPoints.length; i++) {
          const distance = Math.abs(heightPercentage - snapPoints[i]);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestSnapPoint = snapPoints[i];
          }
        }
        
        // If close enough to a snap point, snap to it
        if (closestDistance < 5) {
          const snappedHeight = `${closestSnapPoint}vh`;
          setHeight(snappedHeight);
          containerRef.current.style.height = snappedHeight;
        } else {
          setHeight(clampedHeight);
        }
      } else {
        setHeight(clampedHeight);
      }
    }
  }, [isDragging, resizable, isFullScreen, startY, startHeight, maxHeight, enableSwipeToClose, swipeThreshold, enableSnapPoints, snapPoints, onResize, modalProps]);
  
  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  // Add global event listeners for dragging
  useEffect(() => {
    if (!isDragging) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY);
    };
    
    const handleMouseUp = () => {
      handleDragEnd();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleDragMove(e.touches[0].clientY);
      }
    };
    
    const handleTouchEnd = () => {
      handleDragEnd();
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);
  
  // Reset height when opening
  useEffect(() => {
    if (modalProps.isOpen) {
      setHeight(isFullScreen ? '100vh' : initialHeight);
    }
  }, [modalProps.isOpen, initialHeight, isFullScreen]);
  
  // Update height when full screen changes
  useEffect(() => {
    if (isFullScreen) {
      setHeight('100vh');
    } else if (modalProps.isOpen) {
      setHeight(initialHeight);
    }
  }, [isFullScreen, initialHeight, modalProps.isOpen]);
  
  // Get container props
  const getContainerProps = useCallback(() => {
    const containerProps = modalProps.getContainerProps();
    
    return {
      ...containerProps,
      style: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: isFullScreen ? '100vh' : height,
        backgroundColor: 'white',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1050,
        overflow: 'hidden',
        transition: 'height 0.3s ease',
        transform: modalProps.isOpen ? 'translateY(0)' : 'translateY(100%)',
      },
    };
  }, [modalProps, height, isFullScreen]);
  
  // Get backdrop props
  const getBackdropProps = useCallback(() => {
    const overlayProps = modalProps.getOverlayProps();
    
    return {
      ...overlayProps,
      style: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1040,
        opacity: modalProps.isOpen ? 1 : 0,
        visibility: modalProps.isOpen ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease, visibility 0.3s ease',
      },
    };
  }, [modalProps]);
  
  // Get content props
  const getContentProps = useCallback(() => {
    return {
      ref: contentRef,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
      },
    };
  }, []);
  
  // Get drag handle props
  const getDragHandleProps = useCallback(() => {
    return {
      ref: dragHandleRef,
      onMouseDown: (e: React.MouseEvent) => {
        handleDragStart(e.clientY);
      },
      onTouchStart: (e: React.TouchEvent) => {
        if (e.touches.length > 0) {
          handleDragStart(e.touches[0].clientY);
        }
      },
      style: {
        width: '40px',
        height: '5px',
        backgroundColor: '#ddd',
        borderRadius: '3px',
        margin: '10px auto',
        cursor: resizable && !isFullScreen ? 'ns-resize' : 'default',
      },
    };
  }, [handleDragStart, resizable, isFullScreen]);
  
  // Get trigger props
  const getTriggerProps = useCallback(() => {
    return modalProps.getTriggerProps();
  }, [modalProps]);
  
  // Get close button props
  const getCloseButtonProps = useCallback(() => {
    return modalProps.getCloseButtonProps();
  }, [modalProps]);
  
  // Get full screen button props
  const getFullScreenButtonProps = useCallback(() => {
    return {
      onClick: toggleFullScreen,
      'aria-label': isFullScreen ? 'Exit full screen' : 'Enter full screen',
    };
  }, [toggleFullScreen, isFullScreen]);

  return {
    isOpen: modalProps.isOpen,
    open: modalProps.open,
    close: modalProps.close,
    toggle: modalProps.toggle,
    height,
    setHeight,
    isFullScreen,
    toggleFullScreen,
    containerRef,
    dragHandleRef,
    contentRef,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getDragHandleProps,
    getTriggerProps,
    getCloseButtonProps,
    getFullScreenButtonProps,
  };
}

export default useBottomSheet;
