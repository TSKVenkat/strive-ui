import React, { useEffect, useState } from 'react';
import styled, { keyframes, css, DefaultTheme } from 'styled-components';
import { Box } from '../Box';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastPosition = 
  | 'top-right' 
  | 'top-left' 
  | 'top-center' 
  | 'bottom-right' 
  | 'bottom-left' 
  | 'bottom-center';

export interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
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
  /** Function to call when the toast is closed */
  onClose?: (id: string) => void;
  /** Whether the toast has a progress bar */
  hasProgressBar?: boolean;
  /** Additional CSS className */
  className?: string;
}

interface StyledToastProps {
  $variant: ToastVariant;
  $isVisible: boolean;
}

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

const StyledToast = styled.div<StyledToastProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.common.white || '#ffffff'};
  border-left: 4px solid ${({ $variant, theme }) => getToastBackground($variant, theme)};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  max-width: 350px;
  width: 100%;
  pointer-events: auto;
  overflow: hidden;
  position: relative;
  
  ${({ $isVisible }) => 
    $isVisible
      ? css`animation: ${fadeIn} 0.3s ease-in-out forwards;`
      : css`animation: ${fadeOut} 0.3s ease-in-out forwards;`
  }
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
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};
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

// SVG Icons
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
      d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
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
      d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.6415 19.6871 1.81442 19.9905C1.98734 20.2939 2.23586 20.5467 2.53679 20.7239C2.83772 20.9012 3.18051 20.9962 3.53 21H20.47C20.8195 20.9962 21.1623 20.9012 21.4632 20.7239C21.7641 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z"
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

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'info',
  duration = 5000,
  isClosable = true,
  onClose,
  hasProgressBar = true,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        
        // Add a small delay to allow the fade-out animation to complete
        setTimeout(() => {
          if (onClose) {
            onClose(id);
          }
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    
    // Add a small delay to allow the fade-out animation to complete
    setTimeout(() => {
      if (onClose) {
        onClose(id);
      }
    }, 300);
  };

  return (
    <StyledToast $variant={variant} $isVisible={isVisible} className={className}>
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

// ToastContainer component to manage multiple toasts
interface ToastContainerProps {
  /** Position of the toast container */
  position?: ToastPosition;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Additional CSS className */
  className?: string;
  /** Toast items to display */
  children: React.ReactNode;
}

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
`;

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  maxToasts = 3,
  className,
  children,
}) => {
  // Limit the number of toasts shown
  const toastsToShow = React.Children.toArray(children).slice(0, maxToasts);

  return (
    <StyledToastContainer $position={position} className={className}>
      {toastsToShow}
    </StyledToastContainer>
  );
};

Toast.displayName = 'Toast';
ToastContainer.displayName = 'ToastContainer';
