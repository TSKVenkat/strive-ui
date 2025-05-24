import { useState, useRef, useCallback, useEffect } from 'react';

export type PopoverPlacement = 
  | 'top' 
  | 'top-start' 
  | 'top-end' 
  | 'right' 
  | 'right-start' 
  | 'right-end' 
  | 'bottom' 
  | 'bottom-start' 
  | 'bottom-end' 
  | 'left' 
  | 'left-start' 
  | 'left-end';

export interface PopoverOptions {
  /**
   * Whether the popover is initially open
   */
  defaultOpen?: boolean;
  /**
   * Whether the popover is controlled externally
   */
  open?: boolean;
  /**
   * Callback when the popover opens
   */
  onOpen?: () => void;
  /**
   * Callback when the popover closes
   */
  onClose?: () => void;
  /**
   * Placement of the popover relative to the trigger
   */
  placement?: PopoverPlacement;
  /**
   * Offset from the trigger element in pixels
   */
  offset?: number;
  /**
   * Whether to close the popover when clicking outside
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to close the popover when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Whether to close the popover when the trigger is clicked while the popover is open
   */
  closeOnTriggerClick?: boolean;
  /**
   * Whether to trap focus within the popover
   */
  trapFocus?: boolean;
  /**
   * Whether to show an arrow pointing to the trigger
   */
  showArrow?: boolean;
  /**
   * Size of the arrow in pixels
   */
  arrowSize?: number;
  /**
   * Whether to render the popover in a portal
   */
  usePortal?: boolean;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
}

export interface UsePopoverReturn {
  /**
   * Whether the popover is open
   */
  isOpen: boolean;
  /**
   * Open the popover
   */
  open: () => void;
  /**
   * Close the popover
   */
  close: () => void;
  /**
   * Toggle the popover
   */
  toggle: () => void;
  /**
   * Ref for the trigger element
   */
  triggerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the popover content element
   */
  contentRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the arrow element
   */
  arrowRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the popover trigger
   */
  getTriggerProps: <T extends HTMLElement = HTMLElement>() => {
    ref: React.RefObject<T>;
    onClick: (e: React.MouseEvent) => void;
    'aria-expanded': boolean;
    'aria-haspopup': boolean;
  };
  /**
   * Get props for the popover content
   */
  getContentProps: <T extends HTMLElement = HTMLElement>() => {
    ref: React.RefObject<T>;
    style: React.CSSProperties;
    role: string;
    tabIndex: number;
    'aria-hidden': boolean;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  /**
   * Get props for the popover arrow
   */
  getArrowProps: <T extends HTMLElement = HTMLElement>() => {
    ref: React.RefObject<T>;
    style: React.CSSProperties;
  };
  /**
   * Get props for the popover close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
}

/**
 * Hook for creating a popover
 */
export function usePopover(options: PopoverOptions = {}): UsePopoverReturn {
  const {
    defaultOpen = false,
    open: controlledOpen,
    onOpen,
    onClose,
    placement = 'bottom',
    offset = 8,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    closeOnTriggerClick = true,
    trapFocus = true,
    showArrow = true,
    arrowSize = 8,
    usePortal = true,
    portalId = 'popover-root',
  } = options;

  const isControlled = controlledOpen !== undefined;
  const [isOpenState, setIsOpen] = useState<boolean>(defaultOpen);
  const isOpen = isControlled ? controlledOpen : isOpenState;
  
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Open popover
  const open = useCallback(() => {
    if (!isControlled) {
      setIsOpen(true);
    }
    onOpen?.();
    
    // Save current active element to restore focus later
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, [isControlled, onOpen]);

  // Close popover
  const close = useCallback(() => {
    if (!isControlled) {
      setIsOpen(false);
    }
    onClose?.();
    
    // Restore focus when popover closes
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isControlled, onClose]);

  // Toggle popover
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Handle outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;
    
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        contentRef.current && 
        !contentRef.current.contains(e.target as Node) && 
        triggerRef.current && 
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, closeOnOutsideClick, close]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, closeOnEscape, close]);

  // Handle focus trap
  useEffect(() => {
    if (!isOpen || !trapFocus || !contentRef.current) return;
    
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !contentRef.current) return;
      
      const focusableElements = contentRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;
      
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
    
    // Focus the first focusable element in the popover
    const focusableElements = contentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    } else {
      contentRef.current.focus();
    }
    
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
    };
  }, [isOpen, trapFocus]);

  // Position the popover
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return;
    
    const updatePosition = () => {
      const triggerRect = triggerRef.current?.getBoundingClientRect();
      const contentRect = contentRef.current?.getBoundingClientRect();
      
      if (!triggerRect || !contentRect) return;
      
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      let top = 0;
      let left = 0;
      
      // Calculate position based on placement
      switch (placement) {
        case 'top':
          top = triggerRect.top - contentRect.height - offset + scrollY;
          left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2) + scrollX;
          break;
        case 'top-start':
          top = triggerRect.top - contentRect.height - offset + scrollY;
          left = triggerRect.left + scrollX;
          break;
        case 'top-end':
          top = triggerRect.top - contentRect.height - offset + scrollY;
          left = triggerRect.right - contentRect.width + scrollX;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2) + scrollY;
          left = triggerRect.right + offset + scrollX;
          break;
        case 'right-start':
          top = triggerRect.top + scrollY;
          left = triggerRect.right + offset + scrollX;
          break;
        case 'right-end':
          top = triggerRect.bottom - contentRect.height + scrollY;
          left = triggerRect.right + offset + scrollX;
          break;
        case 'bottom':
          top = triggerRect.bottom + offset + scrollY;
          left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2) + scrollX;
          break;
        case 'bottom-start':
          top = triggerRect.bottom + offset + scrollY;
          left = triggerRect.left + scrollX;
          break;
        case 'bottom-end':
          top = triggerRect.bottom + offset + scrollY;
          left = triggerRect.right - contentRect.width + scrollX;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2) + scrollY;
          left = triggerRect.left - contentRect.width - offset + scrollX;
          break;
        case 'left-start':
          top = triggerRect.top + scrollY;
          left = triggerRect.left - contentRect.width - offset + scrollX;
          break;
        case 'left-end':
          top = triggerRect.bottom - contentRect.height + scrollY;
          left = triggerRect.left - contentRect.width - offset + scrollX;
          break;
        default:
          top = triggerRect.bottom + offset + scrollY;
          left = triggerRect.left + scrollX;
      }
      
      // Apply position to content
      if (contentRef.current) {
        contentRef.current.style.top = `${top}px`;
        contentRef.current.style.left = `${left}px`;
      }
      
      // Position arrow if needed
      if (showArrow && arrowRef.current) {
        let arrowTop = 0;
        let arrowLeft = 0;
        
        // Calculate arrow position based on placement
        switch (placement) {
          case 'top':
          case 'top-start':
          case 'top-end':
            arrowTop = contentRect.height;
            arrowLeft = placement === 'top' 
              ? contentRect.width / 2 - arrowSize 
              : placement === 'top-start' 
                ? triggerRect.width / 2 
                : contentRect.width - triggerRect.width / 2 - arrowSize * 2;
            arrowRef.current.style.transform = 'rotate(45deg)';
            break;
          case 'right':
          case 'right-start':
          case 'right-end':
            arrowTop = placement === 'right' 
              ? contentRect.height / 2 - arrowSize 
              : placement === 'right-start' 
                ? triggerRect.height / 2 
                : contentRect.height - triggerRect.height / 2 - arrowSize * 2;
            arrowLeft = -arrowSize;
            arrowRef.current.style.transform = 'rotate(135deg)';
            break;
          case 'bottom':
          case 'bottom-start':
          case 'bottom-end':
            arrowTop = -arrowSize;
            arrowLeft = placement === 'bottom' 
              ? contentRect.width / 2 - arrowSize 
              : placement === 'bottom-start' 
                ? triggerRect.width / 2 
                : contentRect.width - triggerRect.width / 2 - arrowSize * 2;
            arrowRef.current.style.transform = 'rotate(225deg)';
            break;
          case 'left':
          case 'left-start':
          case 'left-end':
            arrowTop = placement === 'left' 
              ? contentRect.height / 2 - arrowSize 
              : placement === 'left-start' 
                ? triggerRect.height / 2 
                : contentRect.height - triggerRect.height / 2 - arrowSize * 2;
            arrowLeft = contentRect.width;
            arrowRef.current.style.transform = 'rotate(315deg)';
            break;
        }
        
        arrowRef.current.style.top = `${arrowTop}px`;
        arrowRef.current.style.left = `${arrowLeft}px`;
      }
    };
    
    // Update position initially and on resize
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, placement, offset, showArrow, arrowSize]);

  // Get props for the trigger
  const getTriggerProps = useCallback(() => {
    return {
      ref: triggerRef,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isOpen && closeOnTriggerClick) {
          close();
        } else if (!isOpen) {
          open();
        }
      },
      'aria-expanded': isOpen,
      'aria-haspopup': true,
    };
  }, [isOpen, open, close, closeOnTriggerClick]);

  // Get props for the content
  const getContentProps = useCallback(() => {
    return {
      ref: contentRef,
      style: {
        position: 'absolute',
        zIndex: 1000,
        visibility: isOpen ? 'visible' : 'hidden',
        opacity: isOpen ? 1 : 0,
      },
      role: 'dialog',
      tabIndex: -1,
      'aria-hidden': !isOpen,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (closeOnEscape && e.key === 'Escape') {
          close();
        }
      },
    };
  }, [isOpen, close, closeOnEscape]);

  // Get props for the arrow
  const getArrowProps = useCallback(() => {
    return {
      ref: arrowRef,
      style: {
        position: 'absolute',
        width: `${arrowSize * 2}px`,
        height: `${arrowSize * 2}px`,
        background: 'inherit',
        visibility: isOpen && showArrow ? 'visible' : 'hidden',
      },
    };
  }, [isOpen, showArrow, arrowSize]);

  // Get props for the close button
  const getCloseButtonProps = useCallback(() => {
    return {
      onClick: close,
      'aria-label': 'Close popover',
    };
  }, [close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
    contentRef,
    arrowRef,
    getTriggerProps,
    getContentProps,
    getArrowProps,
    getCloseButtonProps,
  };
}

export default usePopover;
