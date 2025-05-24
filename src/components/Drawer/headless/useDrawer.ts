import { useState, useCallback } from 'react';
import { useModal, ModalOptions } from '../../Modal/headless/useModal';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';

export interface DrawerOptions extends ModalOptions {
  /**
   * Placement of the drawer
   */
  placement?: DrawerPlacement;
  /**
   * Width of the drawer (for left/right placements)
   */
  width?: string | number;
  /**
   * Height of the drawer (for top/bottom placements)
   */
  height?: string | number;
  /**
   * Whether to show a backdrop behind the drawer
   */
  hasBackdrop?: boolean;
  /**
   * Whether to enable swipe gestures to open/close the drawer
   */
  enableGestures?: boolean;
  /**
   * Callback when the drawer is swiped
   */
  onSwipe?: (distance: number) => void;
  /**
   * Callback when the drawer is fully swiped open or closed
   */
  onSwipeEnd?: (isOpen: boolean) => void;
}

export interface UseDrawerReturn {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
  /**
   * Open the drawer
   */
  open: () => void;
  /**
   * Close the drawer
   */
  close: () => void;
  /**
   * Toggle the drawer
   */
  toggle: () => void;
  /**
   * Placement of the drawer
   */
  placement: DrawerPlacement;
  /**
   * Width of the drawer (for left/right placements)
   */
  width: string | number;
  /**
   * Height of the drawer (for top/bottom placements)
   */
  height: string | number;
  /**
   * Whether to show a backdrop behind the drawer
   */
  hasBackdrop: boolean;
  /**
   * Whether gestures are enabled
   */
  enableGestures: boolean;
  /**
   * Get props for the drawer container
   */
  getContainerProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: React.RefObject<HTMLDivElement>;
  };
  /**
   * Get props for the drawer overlay/backdrop
   */
  getBackdropProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the drawer content
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
    style: React.CSSProperties;
  };
  /**
   * Get props for the drawer trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the drawer close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
}

/**
 * Hook for creating a drawer
 */
export function useDrawer(options: DrawerOptions = {}): UseDrawerReturn {
  const {
    placement = 'right',
    width = '300px',
    height = '300px',
    hasBackdrop = true,
    enableGestures = false,
    onSwipe,
    onSwipeEnd,
    ...modalOptions
  } = options;

  const modalProps = useModal(modalOptions);
  
  // Get content style based on placement
  const getContentStyle = useCallback((): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1050,
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.3s ease-in-out',
    };
    
    switch (placement) {
      case 'left':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          bottom: 0,
          width: width,
          transform: modalProps.isOpen ? 'translateX(0)' : 'translateX(-100%)',
        };
      case 'right':
        return {
          ...baseStyle,
          top: 0,
          right: 0,
          bottom: 0,
          width: width,
          transform: modalProps.isOpen ? 'translateX(0)' : 'translateX(100%)',
        };
      case 'top':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          right: 0,
          height: height,
          transform: modalProps.isOpen ? 'translateY(0)' : 'translateY(-100%)',
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          height: height,
          transform: modalProps.isOpen ? 'translateY(0)' : 'translateY(100%)',
        };
      default:
        return baseStyle;
    }
  }, [placement, width, height, modalProps.isOpen]);

  // Get content props
  const getContentProps = useCallback(() => {
    const contentProps = modalProps.getContentProps();
    
    return {
      ...contentProps,
      style: getContentStyle(),
    };
  }, [modalProps, getContentStyle]);

  // Get backdrop props
  const getBackdropProps = useCallback(() => {
    return modalProps.getOverlayProps();
  }, [modalProps]);

  return {
    ...modalProps,
    placement,
    width,
    height,
    hasBackdrop,
    enableGestures,
    getContentProps,
    getBackdropProps,
  };
}

export default useDrawer;
