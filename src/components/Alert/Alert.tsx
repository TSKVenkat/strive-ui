import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Icon } from '../Icon';
import { useThemeContext } from '../../styles/ThemeProvider';
import { transitions } from '../../animations';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type AlertSize = 'sm' | 'md' | 'lg';
export type AlertStatus = 'visible' | 'closing' | 'closed';

export interface AlertProps {
  /**
   * The variant of the alert
   * @default 'info'
   */
  variant?: AlertVariant;
  
  /**
   * The size of the alert
   * @default 'md'
   */
  size?: AlertSize;
  
  /**
   * The title of the alert
   */
  title?: React.ReactNode;
  
  /**
   * The content of the alert
   */
  children: React.ReactNode;
  
  /**
   * Whether the alert is closable
   * @default true
   */
  closable?: boolean;
  
  /**
   * Whether the alert should auto close
   * @default false
   */
  autoClose?: boolean;
  
  /**
   * The duration in ms before auto closing
   * @default 5000
   */
  autoCloseDuration?: number;
  
  /**
   * Callback when the alert is closed
   */
  onClose?: () => void;
  
  /**
   * Whether to show an icon
   * @default true
   */
  hasIcon?: boolean;
  
  /**
   * Custom icon to display
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the alert is outlined
   * @default false
   */
  outlined?: boolean;
  
  /**
   * Whether the alert is filled
   * @default false
   */
  filled?: boolean;
  
  /**
   * Whether the alert has a border
   * @default true
   */
  hasBorder?: boolean;
  
  /**
   * The border position
   * @default 'left'
   */
  borderPosition?: 'left' | 'right' | 'top' | 'bottom' | 'all';
  
  /**
   * Whether the alert is elevated
   * @default false
   */
  elevated?: boolean;
  
  /**
   * The elevation level
   * @default 'md'
   */
  elevation?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the alert is rounded
   * @default true
   */
  rounded?: boolean;
  
  /**
   * The border radius
   * @default 'md'
   */
  radius?: 'sm' | 'md' | 'lg' | 'full';
  
  /**
   * Custom actions to display
   */
  actions?: React.ReactNode;
  
  /**
   * Whether the alert is expandable
   * @default false
   */
  expandable?: boolean;
  
  /**
   * Whether the alert is expanded by default
   * @default false
   */
  defaultExpanded?: boolean;
  
  /**
   * The expanded state (controlled)
   */
  expanded?: boolean;
  
  /**
   * Callback when the expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;
  
  /**
   * Additional content to show when expanded
   */
  expandedContent?: React.ReactNode;
  
  /**
   * Animation duration in ms
   * @default 300
   */
  animationDuration?: number;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Custom ID
   */
  id?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * Whether the alert is dismissible by clicking anywhere on it
   * @default false
   */
  dismissible?: boolean;
  
  /**
   * Whether the alert should show a progress bar for auto-close
   * @default false
   */
  showProgress?: boolean;
  
  /**
   * Whether the alert should pause auto-close on hover
   * @default true
   */
  pauseOnHover?: boolean;
  
  /**
   * Whether the alert should pause auto-close on focus
   * @default true
   */
  pauseOnFocus?: boolean;
}

// Animations
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInBottom = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// Progress animation
const progress = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// Styled components
const StyledAlert = styled.div<{
  $variant: AlertVariant;
  $size: AlertSize;
  $outlined: boolean;
  $filled: boolean;
  $hasBorder: boolean;
  $borderPosition: 'left' | 'right' | 'top' | 'bottom' | 'all';
  $elevated: boolean;
  $elevation: 'sm' | 'md' | 'lg';
  $rounded: boolean;
  $radius: 'sm' | 'md' | 'lg' | 'full';
  $status: AlertStatus;
  $animationDuration: number;
  $dismissible: boolean;
}>`
  position: relative;
  display: flex;
  width: 100%;
  overflow: hidden;
  
  ${props => {
    // Size styles
    const sizeStyles = {
      sm: css`
        padding: 0.5rem 0.75rem;
        font-size: ${props.theme.typography.fontSize.sm};
      `,
      md: css`
        padding: 0.75rem 1rem;
        font-size: ${props.theme.typography.fontSize.md};
      `,
      lg: css`
        padding: 1rem 1.25rem;
        font-size: ${props.theme.typography.fontSize.lg};
      `,
    };
    
    return sizeStyles[props.$size];
  }}
  
  ${props => {
    // Border radius styles
    const radiusStyles = {
      sm: props.theme.borderRadius.sm,
      md: props.theme.borderRadius.md,
      lg: props.theme.borderRadius.lg,
      full: props.theme.borderRadius.full,
    };
    
    return props.$rounded && css`
      border-radius: ${radiusStyles[props.$radius]};
    `;
  }}
  
  ${props => {
    // Elevation styles
    const elevationStyles = {
      sm: props.theme.shadows.sm,
      md: props.theme.shadows.md,
      lg: props.theme.shadows.lg,
    };
    
    return props.$elevated && css`
      box-shadow: ${elevationStyles[props.$elevation]};
    `;
  }}
  
  ${props => {
    // Animation styles
    if (props.$status === 'visible') {
      return css`
        animation: ${fadeIn} ${props.$animationDuration}ms ${transitions.ease.ease} forwards;
      `;
    }
    
    if (props.$status === 'closing') {
      return css`
        animation: ${fadeOut} ${props.$animationDuration}ms ${transitions.ease.ease} forwards;
      `;
    }
  }}
  
  ${props => {
    // Variant styles
    const getVariantStyles = () => {
      const variantColors = {
        info: {
          bg: props.theme.colors.primary[50],
          border: props.theme.colors.primary[400],
          text: props.theme.colors.primary[800],
          filledBg: props.theme.colors.primary[500],
          filledText: '#ffffff',
        },
        success: {
          bg: props.theme.colors.neutral[50],
          border: props.theme.colors.primary[400],
          text: props.theme.colors.neutral[800],
          filledBg: props.theme.colors.primary[500],
          filledText: '#ffffff',
        },
        warning: {
          bg: props.theme.colors.neutral[50],
          border: props.theme.colors.neutral[400],
          text: props.theme.colors.neutral[800],
          filledBg: props.theme.colors.neutral[500],
          filledText: '#ffffff',
        },
        error: {
          bg: props.theme.colors.neutral[50],
          border: props.theme.colors.neutral[400],
          text: props.theme.colors.neutral[800],
          filledBg: props.theme.colors.neutral[500],
          filledText: '#ffffff',
        },
        neutral: {
          bg: props.theme.colors.neutral[50],
          border: props.theme.colors.neutral[400],
          text: props.theme.colors.neutral[800],
          filledBg: props.theme.colors.neutral[500],
          filledText: '#ffffff',
        },
      };
      
      const colors = variantColors[props.$variant];
      
      if (props.$filled) {
        return css`
          background-color: ${colors.filledBg};
          color: ${colors.filledText};
          border: ${props.$hasBorder ? `1px solid ${colors.filledBg}` : 'none'};
        `;
      }
      
      if (props.$outlined) {
        return css`
          background-color: transparent;
          color: ${colors.text};
          border: 1px solid ${colors.border};
        `;
      }
      
      return css`
        background-color: ${colors.bg};
        color: ${colors.text};
        border: ${props.$hasBorder ? `1px solid ${colors.border}` : 'none'};
      `;
    };
    
    const getBorderStyles = () => {
      if (!props.$hasBorder) return '';
      
      const borderColor = props.$filled 
        ? 'currentColor' 
        : props.$variant === 'info' ? props.theme.colors.primary[400]
        : props.$variant === 'success' ? props.theme.colors.primary[400]
        : props.$variant === 'warning' ? props.theme.colors.neutral[400]
        : props.$variant === 'error' ? props.theme.colors.neutral[400]
        : props.theme.colors.neutral[400];
      
      if (props.$borderPosition === 'all') {
        return css`
          border: 1px solid ${borderColor};
        `;
      }
      
      return css`
        border: none;
        border-${props.$borderPosition}: 3px solid ${borderColor};
      `;
    };
    
    return css`
      ${getVariantStyles()}
      ${getBorderStyles()}
    `;
  }}
  
  ${props => props.$dismissible && css`
    cursor: pointer;
  `}
`;

const AlertIcon = styled.div<{
  $size: AlertSize;
  $variant: AlertVariant;
  $filled: boolean;
}>`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;
  
  ${props => {
    const sizeMap = {
      sm: '1rem',
      md: '1.25rem',
      lg: '1.5rem',
    };
    
    return css`
      font-size: ${sizeMap[props.$size]};
    `;
  }}
  
  ${props => {
    if (props.$filled) return '';
    
    const colorMap = {
      info: props.theme.colors.primary[500],
      success: props.theme.colors.primary[500],
      warning: props.theme.colors.neutral[500],
      error: props.theme.colors.neutral[500],
      neutral: props.theme.colors.neutral[500],
    };
    
    return css`
      color: ${colorMap[props.$variant]};
    `;
  }}
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div<{
  $size: AlertSize;
}>`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  margin-bottom: 0.25rem;
  
  ${props => {
    const sizeMap = {
      sm: props.theme.typography.fontSize.sm,
      md: props.theme.typography.fontSize.md,
      lg: props.theme.typography.fontSize.lg,
    };
    
    return css`
      font-size: ${sizeMap[props.$size]};
    `;
  }}
`;

const AlertMessage = styled.div<{
  $size: AlertSize;
}>`
  ${props => {
    const sizeMap = {
      sm: props.theme.typography.fontSize.xs,
      md: props.theme.typography.fontSize.sm,
      lg: props.theme.typography.fontSize.md,
    };
    
    return css`
      font-size: ${sizeMap[props.$size]};
    `;
  }}
`;

const AlertActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`;

const CloseButton = styled.button<{
  $size: AlertSize;
  $filled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  border-radius: 50%;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s, background-color 0.2s;
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  ${props => props.$filled && css`
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `}
  
  ${props => {
    const sizeMap = {
      sm: '0.75rem',
      md: '1rem',
      lg: '1.25rem',
    };
    
    return css`
      font-size: ${sizeMap[props.$size]};
    `;
  }}
`;

const ExpandButton = styled.button<{
  $expanded: boolean;
  $size: AlertSize;
  $filled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  border-radius: 50%;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s, background-color 0.2s, transform 0.2s;
  transform: rotate(${props => props.$expanded ? '180deg' : '0deg'});
  
  &:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  ${props => props.$filled && css`
    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  `}
  
  ${props => {
    const sizeMap = {
      sm: '0.75rem',
      md: '1rem',
      lg: '1.25rem',
    };
    
    return css`
      font-size: ${sizeMap[props.$size]};
    `;
  }}
`;

const ExpandedContent = styled.div<{
  $expanded: boolean;
  $animationDuration: number;
}>`
  max-height: ${props => props.$expanded ? '500px' : '0'};
  opacity: ${props => props.$expanded ? 1 : 0};
  overflow: hidden;
  transition: max-height ${props => props.$animationDuration}ms ease, 
              opacity ${props => props.$animationDuration}ms ease;
  margin-top: ${props => props.$expanded ? '0.75rem' : '0'};
  padding-top: ${props => props.$expanded ? '0.75rem' : '0'};
  border-top: ${props => props.$expanded ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'};
`;

const ProgressBar = styled.div<{
  $variant: AlertVariant;
  $filled: boolean;
  $duration: number;
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: ${props => {
    if (props.$filled) {
      return 'rgba(255, 255, 255, 0.4)';
    }
    
    const colorMap = {
      info: props.theme.colors.primary[500],
      success: props.theme.colors.primary[500],
      warning: props.theme.colors.neutral[500],
      error: props.theme.colors.neutral[500],
      neutral: props.theme.colors.neutral[500],
    };
    
    return colorMap[props.$variant];
  }};
  animation: ${progress} ${props => props.$duration}ms linear forwards;
`;

/**
 * Alert component for displaying important messages to users
 * 
 * @example
 * ```jsx
 * <Alert variant="success" title="Success">
 *   Your changes have been saved successfully.
 * </Alert>
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  size = 'md',
  title,
  children,
  closable = true,
  autoClose = false,
  autoCloseDuration = 5000,
  onClose,
  hasIcon = true,
  icon,
  outlined = false,
  filled = false,
  hasBorder = true,
  borderPosition = 'left',
  elevated = false,
  elevation = 'md',
  rounded = true,
  radius = 'md',
  actions,
  expandable = false,
  defaultExpanded = false,
  expanded: controlledExpanded,
  onExpandedChange,
  expandedContent,
  animationDuration = 300,
  className,
  id,
  style,
  dismissible = false,
  showProgress = false,
  pauseOnHover = true,
  pauseOnFocus = true,
}) => {
  const { theme } = useThemeContext();
  const [status, setStatus] = useState<AlertStatus>('visible');
  const [expanded, setExpanded] = useState(defaultExpanded);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pausedRef = useRef<boolean>(false);
  const remainingTimeRef = useRef<number>(autoCloseDuration);
  const startTimeRef = useRef<number>(0);
  
  // Use controlled or uncontrolled expanded state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : expanded;
  
  // Handle expand toggle
  const handleExpandToggle = () => {
    const newExpanded = !isExpanded;
    
    if (controlledExpanded === undefined) {
      setExpanded(newExpanded);
    }
    
    onExpandedChange?.(newExpanded);
  };
  
  // Handle close
  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    
    setStatus('closing');
    
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Wait for animation to complete before calling onClose
    timerRef.current = setTimeout(() => {
      setStatus('closed');
      onClose?.();
    }, animationDuration);
  };
  
  // Handle alert click (for dismissible)
  const handleAlertClick = () => {
    if (dismissible) {
      handleClose();
    }
  };
  
  // Set up auto-close timer
  useEffect(() => {
    if (autoClose && status === 'visible') {
      startTimeRef.current = Date.now();
      remainingTimeRef.current = autoCloseDuration;
      
      timerRef.current = setTimeout(() => {
        handleClose();
      }, autoCloseDuration);
      
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [autoClose, autoCloseDuration, status]);
  
  // Handle pause on hover/focus
  const handlePause = () => {
    if ((pauseOnHover || pauseOnFocus) && autoClose && timerRef.current) {
      clearTimeout(timerRef.current);
      pausedRef.current = true;
      remainingTimeRef.current -= Date.now() - startTimeRef.current;
    }
  };
  
  // Handle resume on mouse leave/blur
  const handleResume = () => {
    if ((pauseOnHover || pauseOnFocus) && autoClose && pausedRef.current) {
      pausedRef.current = false;
      startTimeRef.current = Date.now();
      
      timerRef.current = setTimeout(() => {
        handleClose();
      }, remainingTimeRef.current);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Don't render if closed
  if (status === 'closed') {
    return null;
  }
  
  // Get the appropriate icon based on variant
  const getIcon = () => {
    if (icon) return icon;
    
    const iconMap = {
      info: <Icon name="Info" />,
      success: <Icon name="CheckCircle" />,
      warning: <Icon name="AlertTriangle" />,
      error: <Icon name="AlertCircle" />,
      neutral: <Icon name="Info" />,
    };
    
    return iconMap[variant];
  };
  
  return (
    <StyledAlert
      $variant={variant}
      $size={size}
      $outlined={outlined}
      $filled={filled}
      $hasBorder={hasBorder}
      $borderPosition={borderPosition}
      $elevated={elevated}
      $elevation={elevation}
      $rounded={rounded}
      $radius={radius}
      $status={status}
      $animationDuration={animationDuration}
      $dismissible={dismissible}
      className={className}
      id={id}
      style={style}
      role="alert"
      onClick={handleAlertClick}
      onMouseEnter={pauseOnHover ? handlePause : undefined}
      onMouseLeave={pauseOnHover ? handleResume : undefined}
      onFocus={pauseOnFocus ? handlePause : undefined}
      onBlur={pauseOnFocus ? handleResume : undefined}
    >
      {hasIcon && (
        <AlertIcon $size={size} $variant={variant} $filled={filled}>
          {getIcon()}
        </AlertIcon>
      )}
      
      <AlertContent>
        {title && <AlertTitle $size={size}>{title}</AlertTitle>}
        <AlertMessage $size={size}>{children}</AlertMessage>
        
        {expandedContent && (
          <ExpandedContent $expanded={isExpanded} $animationDuration={animationDuration}>
            {expandedContent}
          </ExpandedContent>
        )}
      </AlertContent>
      
      <AlertActions>
        {actions}
        
        {expandable && expandedContent && (
          <ExpandButton
            $expanded={isExpanded}
            $size={size}
            $filled={filled}
            onClick={handleExpandToggle}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <Icon name="ChevronDown" />
          </ExpandButton>
        )}
        
        {closable && (
          <CloseButton
            $size={size}
            $filled={filled}
            onClick={handleClose}
            aria-label="Close"
          >
            <Icon name="X" />
          </CloseButton>
        )}
      </AlertActions>
      
      {showProgress && autoClose && status === 'visible' && (
        <ProgressBar
          $variant={variant}
          $filled={filled}
          $duration={autoCloseDuration}
        />
      )}
    </StyledAlert>
  );
};
