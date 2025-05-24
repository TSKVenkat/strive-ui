import { useState, useCallback } from 'react';

export interface ErrorBoundaryOptions {
  /**
   * Callback when an error is caught
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /**
   * Callback when the error boundary is reset
   */
  onReset?: () => void;
  /**
   * Whether to log errors to the console
   */
  logErrors?: boolean;
  /**
   * Custom fallback UI
   */
  fallback?: React.ReactNode;
}

export interface UseErrorBoundaryReturn {
  /**
   * Whether an error has been caught
   */
  hasError: boolean;
  /**
   * The error that was caught
   */
  error: Error | null;
  /**
   * Error information
   */
  errorInfo: React.ErrorInfo | null;
  /**
   * Reset the error boundary
   */
  resetErrorBoundary: () => void;
  /**
   * Set the error and error info
   */
  setError: (error: Error, errorInfo: React.ErrorInfo) => void;
  /**
   * Get props for the error container
   */
  getErrorContainerProps: () => {
    role: string;
    'aria-live': string;
  };
  /**
   * Get props for the reset button
   */
  getResetButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
}

/**
 * Hook for creating an error boundary
 */
export function useErrorBoundary(options: ErrorBoundaryOptions = {}): UseErrorBoundaryReturn {
  // Destructure options with defaults
  const {
    onError,
    onReset,
    logErrors = true,
  } = options;

  // State for error handling
  const [error, setErrorState] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null);

  // Set error and error info
  const setError = useCallback((error: Error, errorInfo: React.ErrorInfo) => {
    setErrorState(error);
    setErrorInfo(errorInfo);

    // Log errors to console if enabled
    if (logErrors) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Call onError callback if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }, [logErrors, onError]);

  // Reset error boundary
  const resetErrorBoundary = useCallback(() => {
    setErrorState(null);
    setErrorInfo(null);

    // Call onReset callback if provided
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  // Get props for the error container
  const getErrorContainerProps = useCallback(() => {
    return {
      role: 'alert',
      'aria-live': 'assertive',
    };
  }, []);

  // Get props for the reset button
  const getResetButtonProps = useCallback(() => {
    return {
      onClick: resetErrorBoundary,
      'aria-label': 'Reset error boundary',
    };
  }, [resetErrorBoundary]);

  return {
    hasError: error !== null,
    error,
    errorInfo,
    resetErrorBoundary,
    setError,
    getErrorContainerProps,
    getResetButtonProps,
  };
}

export default useErrorBoundary;
