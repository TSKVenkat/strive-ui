import { useState, useRef, useCallback, useEffect } from 'react';
import { usePopover, PopoverOptions, PopoverPlacement } from '../../Popover/headless/usePopover';

export type TooltipOptions = Omit<PopoverOptions, 'closeOnTriggerClick'> & {
  /**
   * Delay before showing the tooltip in milliseconds
   */
  showDelay?: number;
  /**
   * Delay before hiding the tooltip in milliseconds
   */
  hideDelay?: number;
  /**
   * Whether to show the tooltip on hover
   */
  showOnHover?: boolean;
  /**
   * Whether to show the tooltip on focus
   */
  showOnFocus?: boolean;
};

export interface UseTooltipReturn {
  /**
   * Whether the tooltip is open
   */
  isOpen: boolean;
  /**
   * Open the tooltip
   */
  open: () => void;
  /**
   * Close the tooltip
   */
  close: () => void;
  /**
   * Toggle the tooltip
   */
  toggle: () => void;
  /**
   * Ref for the trigger element
   */
  triggerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the tooltip content element
   */
  contentRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the arrow element
   */
  arrowRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the tooltip trigger
   */
  getTriggerProps: () => {
    ref: React.RefObject<HTMLElement>;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onFocus: (e: React.FocusEvent) => void;
    onBlur: (e: React.FocusEvent) => void;
    'aria-describedby': string | undefined;
  };
  /**
   * Get props for the tooltip content
   */
  getContentProps: () => {
    ref: React.RefObject<HTMLElement>;
    style: React.CSSProperties;
    role: string;
    id: string;
  };
  /**
   * Get props for the tooltip arrow
   */
  getArrowProps: () => {
    ref: React.RefObject<HTMLElement>;
    style: React.CSSProperties;
  };
}

/**
 * Hook for creating a tooltip
 */
export function useTooltip(options: TooltipOptions = {}): UseTooltipReturn {
  const {
    showDelay = 300,
    hideDelay = 200,
    showOnHover = true,
    showOnFocus = true,
    ...popoverOptions
  } = options;

  // Generate a unique ID for aria-describedby
  const tooltipId = useRef<string>(`tooltip-${Math.random().toString(36).substring(2, 11)}`);
  
  // Use the popover hook for positioning and basic functionality
  const popoverProps = usePopover({
    ...popoverOptions,
    closeOnTriggerClick: false,
  });
  
  // Timers for show/hide delays
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any pending timeouts
  const clearTimeouts = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  // Open the tooltip with delay
  const openWithDelay = useCallback(() => {
    clearTimeouts();
    if (showDelay <= 0) {
      popoverProps.open();
    } else {
      showTimeoutRef.current = setTimeout(() => {
        popoverProps.open();
      }, showDelay);
    }
  }, [clearTimeouts, popoverProps, showDelay]);

  // Close the tooltip with delay
  const closeWithDelay = useCallback(() => {
    clearTimeouts();
    if (hideDelay <= 0) {
      popoverProps.close();
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        popoverProps.close();
      }, hideDelay);
    }
  }, [clearTimeouts, popoverProps, hideDelay]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  // Get trigger props with hover and focus handlers
  const getTriggerProps = useCallback(() => {
    return {
      ref: popoverProps.triggerRef,
      onMouseEnter: (e: React.MouseEvent) => {
        if (showOnHover) {
          openWithDelay();
        }
      },
      onMouseLeave: (e: React.MouseEvent) => {
        if (showOnHover) {
          closeWithDelay();
        }
      },
      onFocus: (e: React.FocusEvent) => {
        if (showOnFocus) {
          openWithDelay();
        }
      },
      onBlur: (e: React.FocusEvent) => {
        if (showOnFocus) {
          closeWithDelay();
        }
      },
      'aria-describedby': popoverProps.isOpen ? tooltipId.current : undefined,
    };
  }, [popoverProps, showOnHover, showOnFocus, openWithDelay, closeWithDelay]);

  // Get content props with role and id for accessibility
  const getContentProps = useCallback(() => {
    const contentProps = popoverProps.getContentProps();
    
    return {
      ...contentProps,
      role: 'tooltip',
      id: tooltipId.current,
    };
  }, [popoverProps]);

  return {
    ...popoverProps,
    getTriggerProps,
    getContentProps,
  };
}

export default useTooltip;
