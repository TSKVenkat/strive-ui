import { useState, useCallback } from 'react';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';

export interface BannerOptions {
  /**
   * Whether the banner is initially visible
   */
  defaultVisible?: boolean;
  /**
   * Whether the banner can be dismissed
   */
  dismissible?: boolean;
  /**
   * Callback when the banner is dismissed
   */
  onDismiss?: () => void;
  /**
   * Callback when the banner is shown
   */
  onShow?: () => void;
  /**
   * Variant of the banner
   */
  variant?: BannerVariant;
  /**
   * Whether the banner has an icon
   */
  hasIcon?: boolean;
  /**
   * Whether the banner has a close button
   */
  hasCloseButton?: boolean;
  /**
   * Auto-dismiss timeout in milliseconds
   */
  autoHideTimeout?: number;
}

export interface UseBannerReturn {
  /**
   * Whether the banner is visible
   */
  visible: boolean;
  /**
   * Show the banner
   */
  show: () => void;
  /**
   * Hide the banner
   */
  hide: () => void;
  /**
   * Toggle the banner visibility
   */
  toggle: () => void;
  /**
   * Variant of the banner
   */
  variant: BannerVariant;
  /**
   * Set the variant of the banner
   */
  setVariant: (variant: BannerVariant) => void;
  /**
   * Whether the banner is dismissible
   */
  dismissible: boolean;
  /**
   * Whether the banner has an icon
   */
  hasIcon: boolean;
  /**
   * Whether the banner has a close button
   */
  hasCloseButton: boolean;
  /**
   * Get props for the banner container
   */
  getBannerProps: () => {
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
}

/**
 * Hook for creating a banner
 */
export function useBanner(options: BannerOptions = {}): UseBannerReturn {
  // Destructure options with defaults
  const {
    defaultVisible = false,
    dismissible = true,
    onDismiss,
    onShow,
    variant: initialVariant = 'info',
    hasIcon = true,
    hasCloseButton = true,
    autoHideTimeout,
  } = options;

  // State for visibility
  const [visible, setVisible] = useState<boolean>(defaultVisible);
  
  // State for variant
  const [variant, setVariant] = useState<BannerVariant>(initialVariant);

  // Show the banner
  const show = useCallback(() => {
    setVisible(true);
    onShow?.();
    
    // Auto-hide if timeout is set
    if (autoHideTimeout) {
      setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHideTimeout);
    }
  }, [autoHideTimeout, onDismiss, onShow]);

  // Hide the banner
  const hide = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  // Toggle the banner visibility
  const toggle = useCallback(() => {
    if (visible) {
      hide();
    } else {
      show();
    }
  }, [visible, hide, show]);

  // Get props for the banner container
  const getBannerProps = useCallback(() => {
    return {
      role: 'alert',
      'aria-live': 'polite',
    };
  }, []);

  // Get props for the close button
  const getCloseButtonProps = useCallback(() => {
    return {
      onClick: hide,
      'aria-label': 'Close banner',
    };
  }, [hide]);

  return {
    visible,
    show,
    hide,
    toggle,
    variant,
    setVariant,
    dismissible,
    hasIcon,
    hasCloseButton,
    getBannerProps,
    getCloseButtonProps,
  };
}

export default useBanner;
