import React, { useEffect, useRef, useState } from 'react';
import styled, { DefaultTheme, css, keyframes } from 'styled-components';
import { Box } from '../Box';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** The title of the modal */
  title?: React.ReactNode;
  /** The content of the modal */
  children: React.ReactNode;
  /** The size of the modal */
  size?: ModalSize;
  /** Whether to close the modal when clicking outside */
  closeOnOverlayClick?: boolean;
  /** Whether to close the modal when pressing the escape key */
  closeOnEsc?: boolean;
  /** Whether to show a close button */
  showCloseButton?: boolean;
  /** Whether to center the modal vertically */
  isCentered?: boolean;
  /** Whether to block scrolling of the body when the modal is open */
  blockScrollOnMount?: boolean;
  /** Whether to render the modal without a backdrop */
  noBackdrop?: boolean;
  /** Additional CSS className */
  className?: string;
  /** Footer content */
  footer?: React.ReactNode;
}

interface StyledModalProps {
  $size: ModalSize;
  $isCentered: boolean;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div<{ $noBackdrop: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ $noBackdrop }) => ($noBackdrop ? 'transparent' : 'rgba(0, 0, 0, 0.5)')};
  display: flex;
  justify-content: center;
  align-items: ${({ $noBackdrop }) => ($noBackdrop ? 'flex-start' : 'center')};
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-in-out;
`;

const getModalWidth = (size: ModalSize, theme: DefaultTheme): string => {
  switch (size) {
    case 'sm':
      return '400px';
    case 'md':
      return '600px';
    case 'lg':
      return '800px';
    case 'xl':
      return '1000px';
    case 'full':
      return '90%';
    default:
      return '600px';
  }
};

const ModalContainer = styled.div<StyledModalProps>`
  background-color: ${({ theme }) => theme.colors.common.white || '#ffffff'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: ${({ $size, theme }) => getModalWidth($size, theme)};
  max-width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.3s ease-in-out;
  margin-top: ${({ $isCentered }) => ($isCentered ? '0' : '10vh')};
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
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

  &:hover {
    color: ${({ theme }) => theme.colors.neutral[700]};
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[6]}`};
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

// SVG for close icon
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  isCentered = false,
  blockScrollOnMount = true,
  noBackdrop = false,
  className,
  footer,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, closeOnEsc, onClose]);

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen && blockScrollOnMount) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, blockScrollOnMount]);

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen && !isVisible) {
    return null;
  }

  return (
    <ModalOverlay onClick={handleOverlayClick} $noBackdrop={noBackdrop}>
      <ModalContainer
        ref={modalRef}
        $size={size}
        $isCentered={isCentered}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <ModalHeader>
            {title && <ModalTitle>{title}</ModalTitle>}
            {showCloseButton && (
              <CloseButton onClick={onClose} aria-label="Close modal">
                <CloseIcon />
              </CloseButton>
            )}
          </ModalHeader>
        )}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContainer>
    </ModalOverlay>
  );
};

Modal.displayName = 'Modal';
