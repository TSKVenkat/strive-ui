import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import styled, { keyframes, css, DefaultTheme } from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Box } from '../Box';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

// Types
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'top-center' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'bottom-center';

export interface ToastOptions {
  /** The title of the toast */
  title?: string;
  /** The content of the toast */
  description: string;
  /** The variant/type of the toast */
  variant?: ToastVariant;
  /** Duration in milliseconds before auto-closing (0 means it won't auto-close) */
  duration?: number;
  /** Whether to show a close button */
  isClosable?: boolean;
  /** Whether the toast has a progress bar */
  hasProgressBar?: boolean;
  /** Additional CSS className */
  className?: string;
  /** Custom render function for the toast content */
  render?: (props: { onClose: () => void }) => React.ReactNode;
}

export interface ToastItem extends ToastOptions {
  /** Unique identifier for the toast */
  id: string;
  /** When the toast was created */
  createdAt: number;
}

// Context
interface ToastContextValue {
  toasts: ToastItem[];
  position: ToastPosition;
  addToast: (options: ToastOptions) => string;
  updateToast: (id: string, options: Partial<ToastOptions>) => void;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
  info: (options: Omit<ToastOptions, 'variant'>) => string;
  success: (options: Omit<ToastOptions, 'variant'>) => string;
  warning: (options: Omit<ToastOptions, 'variant'>) => string;
  error: (options: Omit<ToastOptions, 'variant'>) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// Styled Components
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

const getToastBackground = (variant: ToastVariant, theme: DefaultTheme): string => {
  switch (variant) {
    case 'info':
      return theme.colors.info.main;
    case 'success':
      return theme.colors.success.main;
    case 'warning':
      return theme.colors.warning.main;
    case 'error':
      return theme.colors.error.main;
    default:
      return theme.colors.info.main;
  }
};

const getContainerPosition = (position: ToastPosition): React.CSSProperties => {
  switch (position) {
    case 'top-right':
      return { top: '1rem', right: '1rem' };
    case 'top-left':
      return { top: '1rem', left: '1rem' };
    case 'top-center':
      return { top: '1rem', left: '50%', transform: 'translateX(-50%)' };
    case 'bottom-right':
      return { bottom: '1rem', right: '1rem' };
    case 'bottom-left':
      return { bottom: '1rem', left: '1rem' };
    case 'bottom-center':
      return { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' };
    default:
      return { top: '1rem', right: '1rem' };
  }
};

const StyledToastContainer = styled.div<{ $position: ToastPosition }>`
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  ${({ $position }) => ({ ...getContainerPosition($position) })};
  max-width: 350px;
  width: 100%;
`;

const StyledToast = styled(motion.div)<{ $variant: ToastVariant }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.common.white || '#ffffff'};
  border-left: 4px solid ${({ $variant, theme }) => getToastBackground($variant, theme)};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
`;

const ToastHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ToastContent = styled.div`
  display: flex;
  align-items: flex-start;
`;

const IconWrapper = styled.div<{ $variant: ToastVariant }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $variant, theme }) => getToastBackground($variant, theme)};
  margin-right: ${({ theme }) => theme.spacing[3]};
  flex-shrink: 0;
`;

const ToastTitle = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  line-height: 1.4;
`;

const ToastDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
  line-height: 1.5;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.neutral[500]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;
  margin-left: ${({ theme }) => theme.spacing[2]};
  
  &:hover {
    color: ${({ theme }) => theme.colors.neutral[700]};
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
  }
`;

const progressAnimation = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

const ProgressBar = styled.div<{ $variant: ToastVariant; $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${({ $variant, theme }) => getToastBackground($variant, theme)};
  width: 100%;
  animation: ${progressAnimation} ${({ $duration }) => $duration}ms linear forwards;
`;

// Icons
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16V12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8H12.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 4L12 14.01L9 11.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.6415 19.6871 1.81442 19.9905C1.98734 20.2939 2.23637 20.5467 2.53779 20.7239C2.83921 20.901 3.18382 20.9962 3.53 21H20.47C20.8162 20.9962 21.1608 20.901 21.4622 20.7239C21.7636 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 9V13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17H12.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 9L9 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 9L15 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getToastIcon = (variant: ToastVariant): React.ReactNode => {
  switch (variant) {
    case 'info':
      return <InfoIcon />;
    case 'success':
      return <SuccessIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'error':
      return <ErrorIcon />;
    default:
      return <InfoIcon />;
  }
};

// Provider Component
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

export const ToastProvider: React.FC<ToastProviderProps> = ({
  position = 'top-right',
  maxToasts = 5,
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Generate a unique ID for each toast
  const generateId = useCallback(() => {
    return Math.random().toString(36).substring(2, 9);
  }, []);

  // Add a new toast
  const addToast = useCallback((options: ToastOptions): string => {
    const id = generateId();
    const newToast: ToastItem = {
      id,
      createdAt: Date.now(),
      ...options,
    };
    
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, [generateId]);

  // Update an existing toast
  const updateToast = useCallback((id: string, options: Partial<ToastOptions>) => {
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
    toasts,
    position,
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
    </ToastContext.Provider>
  );
};

// Hook to use the toast API
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

// Individual Toast Component
interface ToastItemProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const {
    id,
    title,
    description,
    variant = 'info',
    duration = 5000,
    isClosable = true,
    hasProgressBar = true,
    render,
  } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = useCallback(() => {
    onClose(id);
  }, [id, onClose]);

  // If a custom render function is provided, use it
  if (render) {
    return (
      <StyledToast
        $variant={variant}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        {render({ onClose: handleClose })}
        {hasProgressBar && duration > 0 && (
          <ProgressBar $variant={variant} $duration={duration} />
        )}
      </StyledToast>
    );
  }

  return (
    <StyledToast
      $variant={variant}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <ToastHeader>
        <ToastContent>
          <IconWrapper $variant={variant}>
            {getToastIcon(variant)}
          </IconWrapper>
          <Box>
            {title && <ToastTitle>{title}</ToastTitle>}
            <ToastDescription>{description}</ToastDescription>
          </Box>
        </ToastContent>
        {isClosable && (
          <CloseButton onClick={handleClose} aria-label="Close toast">
            <CloseIcon />
          </CloseButton>
        )}
      </ToastHeader>
      {hasProgressBar && duration > 0 && (
        <ProgressBar $variant={variant} $duration={duration} />
      )}
    </StyledToast>
  );
};

// Container Component
interface ToastContainerProps {
  position?: ToastPosition;
  maxToasts?: number;
}

const ToastContainerComponent: React.FC<ToastContainerProps> = ({
  position: positionProp,
  maxToasts = 5,
}) => {
  const { toasts, position: contextPosition, removeToast } = useToast();
  const position = positionProp || contextPosition;
  
  // Sort toasts by creation time and limit to maxToasts
  const visibleToasts = [...toasts]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, maxToasts);

  return (
    <StyledToastContainer $position={position}>
      <AnimatePresence>
        {visibleToasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </StyledToastContainer>
  );
};

// Custom Toast Component
interface CustomToastProps extends PolymorphicComponentPropsWithRef<'div'> {
  variant?: ToastVariant;
  hasProgressBar?: boolean;
  duration?: number;
  onClose?: () => void;
}

const CustomToast = React.forwardRef<HTMLDivElement, CustomToastProps>(
  ({ as, variant = 'info', hasProgressBar, duration = 5000, onClose, children, ...props }, ref) => {
    const Component = as || 'div';
    
    return (
      <StyledToast
        as={Component}
        $variant={variant}
        ref={ref}
        {...props}
      >
        {children}
        {hasProgressBar && duration > 0 && (
          <ProgressBar $variant={variant} $duration={duration} />
        )}
      </StyledToast>
    );
  }
);

CustomToast.displayName = 'Toast.Custom';

// Compound Component
const Toast = {
  Provider: ToastProvider,
  Container: ToastContainerComponent,
  Custom: CustomToast,
  useToast,
};

export default Toast;
