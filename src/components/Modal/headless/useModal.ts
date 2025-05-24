import { useState, useCallback, useEffect, useRef } from 'react';

export interface ModalOptions {
  /**
   * Whether the modal is initially open
   */
  defaultOpen?: boolean;
  /**
   * Whether the modal is controlled externally
   */
  open?: boolean;
  /**
   * Callback when the modal opens
   */
  onOpen?: () => void;
  /**
   * Callback when the modal closes
   */
  onClose?: () => void;
  /**
   * Whether to close the modal when clicking outside
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to close the modal when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Whether to trap focus within the modal
   */
  trapFocus?: boolean;
  /**
   * Whether to prevent scrolling of the body when modal is open
   */
  preventScroll?: boolean;
  /**
   * Whether to render the modal in a portal
   */
  usePortal?: boolean;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
}

export interface UseModalReturn {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Open the modal
   */
  open: () => void;
  /**
   * Close the modal
   */
  close: () => void;
  /**
   * Toggle the modal
   */
  toggle: () => void;
  /**
   * Get props for the modal container
   */
  getContainerProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: React.RefObject<HTMLDivElement>;
  };
  /**
   * Get props for the modal overlay
   */
  getOverlayProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the modal content
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the modal trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the modal close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
}

/**
 * Hook for creating a modal
 */
export function useModal(options: ModalOptions = {}): UseModalReturn {
  const {
    defaultOpen = false,
    open: controlledOpen,
    onOpen,
    onClose,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    trapFocus = true,
    preventScroll = true,
    usePortal = true,
    portalId = 'modal-root',
  } = options;

  const isControlled = controlledOpen !== undefined;
  const [isOpenState, setIsOpen] = useState<boolean>(defaultOpen);
  const isOpen = isControlled ? controlledOpen : isOpenState;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalId = useRef<string>(`modal-${Math.random().toString(36).substr(2, 9)}`);

  // Handle body scroll locking
  useEffect(() => {
    if (!preventScroll) return;
    
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, preventScroll]);

  // Handle focus trapping
  useEffect(() => {
    if (!trapFocus || !isOpen) return;
    
    // Save current active element to restore focus later
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Focus the modal container
    if (containerRef.current) {
      containerRef.current.focus();
    }
    
    // Handle focus trap
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (!containerRef.current || e.key !== 'Tab') return;
      
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      // If shift+tab on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } 
      // If tab on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    document.addEventListener('keydown', handleFocusTrap);
    
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      
      // Restore focus when modal closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, trapFocus]);

  // Open modal
  const open = useCallback(() => {
    if (!isControlled) {
      setIsOpen(true);
    }
    onOpen?.();
  }, [isControlled, onOpen]);

  // Close modal
  const close = useCallback(() => {
    if (!isControlled) {
      setIsOpen(false);
    }
    onClose?.();
  }, [isControlled, onClose]);

  // Toggle modal
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Handle escape key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (closeOnEscape && e.key === 'Escape') {
      close();
    }
  }, [close, closeOnEscape]);

  // Handle outside click
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      close();
    }
  }, [close, closeOnOutsideClick]);

  // Handle content click (prevent propagation)
  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Get props for the modal container
  const getContainerProps = useCallback(() => {
    return {
      role: 'dialog',
      'aria-modal': true,
      tabIndex: -1,
      onKeyDown: handleKeyDown,
      ref: containerRef,
    };
  }, [handleKeyDown]);

  // Get props for the modal overlay
  const getOverlayProps = useCallback(() => {
    return {
      onClick: handleOverlayClick,
    };
  }, [handleOverlayClick]);

  // Get props for the modal content
  const getContentProps = useCallback(() => {
    return {
      onClick: handleContentClick,
    };
  }, [handleContentClick]);

  // Get props for the modal trigger
  const getTriggerProps = useCallback(() => {
    return {
      onClick: open,
      'aria-expanded': isOpen,
      'aria-controls': modalId.current,
    };
  }, [open, isOpen]);

  // Get props for the modal close button
  const getCloseButtonProps = useCallback(() => {
    return {
      onClick: close,
      'aria-label': 'Close modal',
    };
  }, [close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    getContainerProps,
    getOverlayProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
  };
}

export default useModal;
