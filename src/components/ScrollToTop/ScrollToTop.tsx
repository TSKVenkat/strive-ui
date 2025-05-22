import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface ScrollToTopProps {
  /** Distance from the top to show the button (in pixels) */
  showAtPosition?: number;
  /** Position of the button */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon to display */
  icon?: React.ReactNode;
  /** Whether to smooth scroll to top */
  smooth?: boolean;
  /** Custom styles for the button */
  style?: React.CSSProperties;
  /** Additional className for the button */
  className?: string;
  /** Aria label for the button */
  ariaLabel?: string;
  /** Whether to use a different element to scroll to top */
  scrollElement?: HTMLElement;
}

const getPositionStyles = (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => {
  switch (position) {
    case 'bottom-right':
      return {
        bottom: '20px',
        right: '20px',
      };
    case 'bottom-left':
      return {
        bottom: '20px',
        left: '20px',
      };
    case 'top-right':
      return {
        top: '20px',
        right: '20px',
      };
    case 'top-left':
      return {
        top: '20px',
        left: '20px',
      };
    default:
      return {
        bottom: '20px',
        right: '20px',
      };
  }
};

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        width: '36px',
        height: '36px',
        fontSize: '16px',
      };
    case 'md':
      return {
        width: '48px',
        height: '48px',
        fontSize: '20px',
      };
    case 'lg':
      return {
        width: '60px',
        height: '60px',
        fontSize: '24px',
      };
    default:
      return {
        width: '48px',
        height: '48px',
        fontSize: '20px',
      };
  }
};

const ScrollButton = styled(motion.button)<{
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'sm' | 'md' | 'lg';
}>`
  position: fixed;
  ${({ position }) => getPositionStyles(position)};
  ${({ size }) => getSizeStyles(size)};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.neutral[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: background-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[700]};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[300]};
  }
`;

const ArrowUpIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5l-7 7h4.5v7h5v-7H19l-7-7z" fill="currentColor" />
  </svg>
);

export const ScrollToTop = ({
  showAtPosition = 300,
  position = 'bottom-right',
  size = 'md',
  icon,
  smooth = true,
  style,
  className,
  ariaLabel = 'Scroll to top',
  scrollElement,
}: ScrollToTopProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = scrollElement 
      ? scrollElement.scrollTop 
      : window.pageYOffset || document.documentElement.scrollTop;
    
    setIsVisible(scrollTop > showAtPosition);
  };

  useEffect(() => {
    const targetElement = scrollElement || window;
    targetElement.addEventListener('scroll', handleScroll);
    
    // Check initial position
    handleScroll();
    
    return () => {
      targetElement.removeEventListener('scroll', handleScroll);
    };
  }, [scrollElement, showAtPosition]);

  const scrollToTop = () => {
    if (scrollElement) {
      if (smooth) {
        scrollElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        scrollElement.scrollTop = 0;
      }
    } else {
      if (smooth) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo(0, 0);
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <ScrollButton
          position={position}
          size={size}
          onClick={scrollToTop}
          aria-label={ariaLabel}
          style={style}
          className={className}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {icon || <ArrowUpIcon />}
        </ScrollButton>
      )}
    </AnimatePresence>
  );
};

ScrollToTop.displayName = 'ScrollToTop';
