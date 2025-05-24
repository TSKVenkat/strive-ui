import { useState, useCallback, useRef, useEffect } from 'react';

export type SnackbarVariant = 'default' | 'info' | 'success' | 'warning' | 'error';
export type SnackbarPosition = 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';

export interface SnackbarOptions {
  /**
   * Whether the snackbar is initially visible
   */
  defaultVisible?: boolean;
  /**
   * Auto-hide timeout in milliseconds
   */
  autoHideTimeout?: number;
  /**
   * Whether the snackbar can be dismissed
   */
  dismissible?: boolean;
  /**
   * Callback when the snackbar is dismissed
   */
  onDismiss?: () => void;
  /**
   * Callback when the snackbar is shown
   */
  onShow?: () => void;
  /**
   * Variant of the snackbar
   */
  variant?: SnackbarVariant;
  /**
   * Position of the snackbar
   */
  position?: SnackbarPosition;
  /**
   * Whether the snackbar has an action button
   */
  hasAction?: boolean;
  /**
   * Whether the snackbar has a close button
   */
  hasCloseButton?: boolean;
  /**
   * Callback when the action button is clicked
   */
  onAction?: () => void;
}

export interface UseSnackbarReturn {
  /**
   * Whether the snackbar is visible
   */
  visible: boolean;
  /**
   * Show the snackbar
   */
  show: () => void;
  /**
   * Hide the snackbar
   */
  hide: () => void;
  /**
   * Toggle the snackbar visibility
   */
  toggle: () => void;
  /**
   * Variant of the snackbar
   */
  variant: SnackbarVariant;
  /**
   * Set the variant of the snackbar
   */
  setVariant: (variant: SnackbarVariant) => void;
  /**
   * Position of the snackbar
   */
  position: SnackbarPosition;
  /**
   * Set the position of the snackbar
   */
  setPosition: (position: SnackbarPosition) => void;
  /**
   * Whether the snackbar is dismissible
   */
  dismissible: boolean;
  /**
   * Whether the snackbar has an action button
   */
  hasAction: boolean;
  /**
   * Whether the snackbar has a close button
   */
  hasCloseButton: boolean;
  /**
   * Get props for the snackbar container
   */
  getSnackbarProps: () => {
    role: string;
    'aria-live': string;
  };
  /**
   * Get props for the close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the action button
   */
  getActionButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
}

/**
 * Hook for creating a snackbar
 */
export function useSnackbar(options: SnackbarOptions = {}): UseSnackbarReturn {
  // Destructure options with defaults
  const {
    defaultVisible = false,
    autoHideTimeout = 5000,
    dismissible = true,
    onDismiss,
    onShow,
    variant: initialVariant = 'default',
    position: initialPosition = 'bottom',
    hasAction = false,
    hasCloseButton = true,
    onAction,
  } = options;

  // State for visibility
  const [visible, setVisible] = useState<boolean>(defaultVisible);
  
  // State for variant
  const [variant, setVariant] = useState<SnackbarVariant>(initialVariant);
  
  // State for position
  const [position, setPosition] = useState<SnackbarPosition>(initialPosition);
  
  // Ref for timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Show the snackbar
  const show = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setVisible(true);
    onShow?.();
    
    // Auto-hide if timeout is set
    if (autoHideTimeout) {
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHideTimeout);
    }
  }, [autoHideTimeout, onDismiss, onShow]);

  // Hide the snackbar
  const hide = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  // Toggle the snackbar visibility
  const toggle = useCallback(() => {
    if (visible) {
      hide();
    } else {
      show();
    }
  }, [visible, hide, show]);

  // Handle action button click
  const handleAction = useCallback(() => {
    onAction?.();
    hide();
  }, [onAction, hide]);

  // Get props for the snackbar container
  const getSnackbarProps = useCallback(() => {
    return {
      role: 'status',
      'aria-live': 'polite',
    };
  }, []);

  // Get props for the close button
  const getCloseButtonProps = useCallback(() => {
    return {
      onClick: hide,
      'aria-label': 'Close notification',
    };
  }, [hide]);

  // Get props for the action button
  const getActionButtonProps = useCallback(() => {
    return {
      onClick: handleAction,
      'aria-label': 'Action',
    };
  }, [handleAction]);

  return {
    visible,
    show,
    hide,
    toggle,
    variant,
    setVariant,
    position,
    setPosition,
    dismissible,
    hasAction,
    hasCloseButton,
    getSnackbarProps,
    getCloseButtonProps,
    getActionButtonProps,
  };
}

export default useSnackbar;
