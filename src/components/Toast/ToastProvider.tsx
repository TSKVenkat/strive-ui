import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer, ToastProps, ToastPosition } from './Toast';

// Omit the id and onClose from ToastProps as they'll be managed by the provider
export type ToastOptions = Omit<ToastProps, 'id' | 'onClose'>;

interface ToastContextValue {
  /**
   * Add a new toast notification
   */
  addToast: (options: ToastOptions) => string;
  /**
   * Update an existing toast notification
   */
  updateToast: (id: string, options: ToastOptions) => void;
  /**
   * Remove a toast notification
   */
  removeToast: (id: string) => void;
  /**
   * Remove all toast notifications
   */
  removeAllToasts: () => void;
  /**
   * Show an info toast
   */
  info: (options: Omit<ToastOptions, 'variant'>) => string;
  /**
   * Show a success toast
   */
  success: (options: Omit<ToastOptions, 'variant'>) => string;
  /**
   * Show a warning toast
   */
  warning: (options: Omit<ToastOptions, 'variant'>) => string;
  /**
   * Show an error toast
   */
  error: (options: Omit<ToastOptions, 'variant'>) => string;
}

// Create the context
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  /**
   * The position of the toast container
   */
  position?: ToastPosition;
  /**
   * The maximum number of toasts to show at once
   */
  maxToasts?: number;
  /**
   * Children components
   */
  children: React.ReactNode;
}

/**
 * Provider component that makes the toast API available to any nested component
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  position = 'top-right',
  maxToasts = 5,
  children,
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Generate a unique ID for each toast
  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 9);
  }, []);

  // Add a new toast
  const addToast = useCallback((options: ToastOptions): string => {
    const id = generateId();
    const newToast: ToastProps = {
      id,
      ...options,
    };
    
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, [generateId]);

  // Update an existing toast
  const updateToast = useCallback((id: string, options: ToastOptions) => {
    setToasts((prev) => 
      prev.map((toast) => 
        toast.id === id ? { ...toast, ...options } : toast
      )
    );
  }, []);

  // Remove a toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Remove all toasts
  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast variants
  const info = useCallback((options: Omit<ToastOptions, 'variant'>) => {
    return addToast({ ...options, variant: 'info' });
  }, [addToast]);

  const success = useCallback((options: Omit<ToastOptions, 'variant'>) => {
    return addToast({ ...options, variant: 'success' });
  }, [addToast]);

  const warning = useCallback((options: Omit<ToastOptions, 'variant'>) => {
    return addToast({ ...options, variant: 'warning' });
  }, [addToast]);

  const error = useCallback((options: Omit<ToastOptions, 'variant'>) => {
    return addToast({ ...options, variant: 'error' });
  }, [addToast]);

  // Create the context value
  const contextValue = {
    addToast,
    updateToast,
    removeToast,
    removeAllToasts,
    info,
    success,
    warning,
    error,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} maxToasts={maxToasts}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

/**
 * Hook to use the toast API
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

ToastProvider.displayName = 'ToastProvider';
