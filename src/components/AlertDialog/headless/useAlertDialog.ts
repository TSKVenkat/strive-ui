import { useDialog, DialogOptions } from '../../Dialog/headless/useDialog';

export interface AlertDialogOptions extends DialogOptions {
  /**
   * Whether to prevent closing the alert dialog by clicking outside or pressing escape
   */
  preventDismiss?: boolean;
}

export interface UseAlertDialogReturn {
  /**
   * Whether the alert dialog is open
   */
  isOpen: boolean;
  /**
   * Open the alert dialog
   */
  open: () => void;
  /**
   * Close the alert dialog
   */
  close: () => void;
  /**
   * Toggle the alert dialog
   */
  toggle: () => void;
  /**
   * Confirm the alert dialog with a value
   */
  confirm: (value?: any) => void;
  /**
   * Cancel the alert dialog with a value
   */
  cancel: (value?: any) => void;
  /**
   * Get props for the alert dialog container
   */
  getContainerProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: React.RefObject<HTMLDivElement>;
  };
  /**
   * Get props for the alert dialog overlay
   */
  getOverlayProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the alert dialog content
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the alert dialog trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the alert dialog close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the alert dialog confirm button
   */
  getConfirmButtonProps: (value?: any) => {
    onClick: () => void;
    type: string;
  };
  /**
   * Get props for the alert dialog cancel button
   */
  getCancelButtonProps: (value?: any) => {
    onClick: () => void;
    type: string;
  };
}

/**
 * Hook for creating an alert dialog
 */
export function useAlertDialog(options: AlertDialogOptions = {}): UseAlertDialogReturn {
  const {
    preventDismiss = false,
    closeOnOutsideClick = !preventDismiss,
    closeOnEscape = !preventDismiss,
    ...dialogOptions
  } = options;

  const dialogProps = useDialog({
    ...dialogOptions,
    closeOnOutsideClick,
    closeOnEscape,
  });

  return {
    ...dialogProps,
  };
}

export default useAlertDialog;
