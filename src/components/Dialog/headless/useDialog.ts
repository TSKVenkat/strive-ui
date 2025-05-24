import { useState, useCallback } from 'react';
import { useModal, ModalOptions } from '../../Modal/headless/useModal';

export interface DialogOptions extends ModalOptions {
  /**
   * Default return value when dialog is closed without a decision
   */
  defaultReturnValue?: any;
  /**
   * Callback when dialog is confirmed
   */
  onConfirm?: (value?: any) => void;
  /**
   * Callback when dialog is cancelled
   */
  onCancel?: (value?: any) => void;
}

export interface UseDialogReturn {
  /**
   * Whether the dialog is open
   */
  isOpen: boolean;
  /**
   * Open the dialog
   */
  open: () => void;
  /**
   * Close the dialog
   */
  close: () => void;
  /**
   * Toggle the dialog
   */
  toggle: () => void;
  /**
   * Confirm the dialog with a value
   */
  confirm: (value?: any) => void;
  /**
   * Cancel the dialog with a value
   */
  cancel: (value?: any) => void;
  /**
   * Get props for the dialog container
   */
  getContainerProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: React.RefObject<HTMLDivElement>;
  };
  /**
   * Get props for the dialog overlay
   */
  getOverlayProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the dialog content
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the dialog trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the dialog close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the dialog confirm button
   */
  getConfirmButtonProps: (value?: any) => {
    onClick: () => void;
    type: string;
  };
  /**
   * Get props for the dialog cancel button
   */
  getCancelButtonProps: (value?: any) => {
    onClick: () => void;
    type: string;
  };
}

/**
 * Hook for creating a dialog
 */
export function useDialog(options: DialogOptions = {}): UseDialogReturn {
  const {
    defaultReturnValue = null,
    onConfirm,
    onCancel,
    onClose,
    ...modalOptions
  } = options;

  const [returnValue, setReturnValue] = useState<any>(defaultReturnValue);
  
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);
  
  const modalProps = useModal({
    ...modalOptions,
    onClose: handleClose,
  });
  
  const { close } = modalProps;

  // Confirm the dialog with a value
  const confirm = useCallback((value: any = returnValue) => {
    onConfirm?.(value);
    close();
  }, [close, onConfirm, returnValue]);

  // Cancel the dialog with a value
  const cancel = useCallback((value: any = returnValue) => {
    onCancel?.(value);
    close();
  }, [close, onCancel, returnValue]);

  // Get props for the dialog confirm button
  const getConfirmButtonProps = useCallback((value?: any) => {
    return {
      onClick: () => confirm(value),
      type: 'button' as const,
    };
  }, [confirm]);

  // Get props for the dialog cancel button
  const getCancelButtonProps = useCallback((value?: any) => {
    return {
      onClick: () => cancel(value),
      type: 'button' as const,
    };
  }, [cancel]);

  return {
    ...modalProps,
    confirm,
    cancel,
    getConfirmButtonProps,
    getCancelButtonProps,
  };
}

export default useDialog;
