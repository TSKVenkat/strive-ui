import React from 'react';
import styled, { css } from 'styled-components';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'circle' | 'square' | 'rounded';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

export interface AvatarProps {
  /**
   * The source URL of the image
   */
  src?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * The name to use for the initials fallback
   */
  name?: string;
  /**
   * The size of the avatar
   */
  size?: AvatarSize;
  /**
   * The shape of the avatar
   */
  variant?: AvatarVariant;
  /**
   * The status indicator to display
   */
  status?: AvatarStatus;
  /**
   * The background color of the avatar when displaying initials
   */
  bgColor?: string;
  /**
   * The content to display inside the avatar (overrides src and name)
   */
  children?: React.ReactNode;
  /**
   * Additional CSS class name
   */
  className?: string;
  /**
   * Click handler for the avatar
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

interface AvatarContainerProps {
  $size: AvatarSize;
  $variant: AvatarVariant;
  $bgColor?: string;
  $clickable: boolean;
}

interface StatusIndicatorProps {
  $status: AvatarStatus;
  $size: AvatarSize;
}

// Size mapping
const sizeMap = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '64px',
  '2xl': '96px',
};

const fontSizeMap = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '2rem',
};

const statusSizeMap = {
  xs: '6px',
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '14px',
  '2xl': '16px',
};

// Status color mapping
const statusColorMap = {
  online: '#52C41A',
  offline: '#8C8C8C',
  away: '#FAAD14',
  busy: '#FF4D4F',
  none: 'transparent',
};

// Styled components
const AvatarContainer = styled.div<AvatarContainerProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};
  font-size: ${({ $size }) => fontSizeMap[$size]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.common.white || '#ffffff'};
  background-color: ${({ $bgColor, theme }) => $bgColor || theme.colors.primary[500]};
  overflow: hidden;
  user-select: none;
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'square':
        return css`border-radius: 0;`;
      case 'rounded':
        return css`border-radius: ${({ theme }) => theme.borderRadius.md};`;
      case 'circle':
      default:
        return css`border-radius: 50%;`;
    }
  }}
  
  ${({ $clickable }) => $clickable && css`
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      opacity: 0.9;
      transform: scale(1.05);
    }
    
    &:active {
      transform: scale(0.95);
    }
  `}
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const StatusIndicator = styled.div<StatusIndicatorProps>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${({ $size }) => statusSizeMap[$size]};
  height: ${({ $size }) => statusSizeMap[$size]};
  border-radius: 50%;
  background-color: ${({ $status }) => statusColorMap[$status]};
  border: 2px solid ${({ theme }) => theme.colors.common.white || '#ffffff'};
  
  ${({ $status }) => $status === 'none' && css`
    display: none;
  `}
`;

const AvatarGroup = styled.div<{ $spacing?: number }>`
  display: inline-flex;
  flex-direction: row;
  
  & > *:not(:first-child) {
    margin-left: ${({ $spacing }) => $spacing ? `-${$spacing}px` : '-8px'};
  }
`;

/**
 * Get initials from a name
 */
const getInitials = (name: string): string => {
  if (!name) return '';
  
  const parts = name.split(' ').filter(Boolean);
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

/**
 * Generate a deterministic color based on a string
 */
const stringToColor = (str: string): string => {
  if (!str) return '#1890FF';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#1890FF', // Blue
    '#52C41A', // Green
    '#FAAD14', // Yellow
    '#F5222D', // Red
    '#722ED1', // Purple
    '#13C2C2', // Cyan
    '#FA8C16', // Orange
    '#EB2F96', // Pink
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Avatar component for displaying user profile images with fallback to initials
 * 
 * @example
 * ```jsx
 * <Avatar src="https://example.com/avatar.jpg" name="John Doe" size="md" />
 * ```
 */
export const Avatar: React.FC<AvatarProps> & {
  Group: React.FC<AvatarGroupProps>;
} = ({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
  status = 'none',
  bgColor,
  children,
  className,
  onClick,
}) => {
  const [imgError, setImgError] = React.useState(false);
  
  const handleImgError = () => {
    setImgError(true);
  };
  
  // Determine background color for initials
  const initialsColor = bgColor || (name ? stringToColor(name) : undefined);
  
  // Determine content to display
  let content;
  if (children) {
    content = children;
  } else if (src && !imgError) {
    content = <AvatarImage src={src} alt={alt || name || 'avatar'} onError={handleImgError} />;
  } else if (name) {
    content = getInitials(name);
  } else {
    // Default fallback
    content = (
      <svg width="60%" height="60%" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" />
        <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" />
      </svg>
    );
  }
  
  return (
    <AvatarContainer
      $size={size}
      $variant={variant}
      $bgColor={initialsColor}
      $clickable={!!onClick}
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {content}
      <StatusIndicator $status={status} $size={size} />
    </AvatarContainer>
  );
};

// Avatar Group
export interface AvatarGroupProps {
  /**
   * The avatars to display in the group
   */
  children: React.ReactNode;
  /**
   * The maximum number of avatars to display
   */
  max?: number;
  /**
   * The spacing between avatars (negative value for overlap)
   */
  spacing?: number;
  /**
   * Additional CSS class name
   */
  className?: string;
}

const AvatarGroupContainer = styled.div<{ $spacing?: number }>`
  display: inline-flex;
  flex-direction: row;
  
  & > *:not(:first-child) {
    margin-left: ${({ $spacing }) => `${$spacing}px`};
  }
`;

/**
 * Avatar.Group component for displaying multiple avatars in a group
 * 
 * @example
 * ```jsx
 * <Avatar.Group max={3}>
 *   <Avatar name="John Doe" />
 *   <Avatar name="Jane Smith" />
 *   <Avatar name="Bob Johnson" />
 *   <Avatar name="Alice Brown" />
 * </Avatar.Group>
 * ```
 */
const Group: React.FC<AvatarGroupProps> = ({
  children,
  max,
  spacing = -8,
  className,
}) => {
  const childrenArray = React.Children.toArray(children);
  const totalAvatars = childrenArray.length;
  
  // Determine if we need to show the +N avatar
  const showMax = max !== undefined && totalAvatars > max;
  const visibleAvatars = showMax ? childrenArray.slice(0, max) : childrenArray;
  const remainingCount = totalAvatars - (max || 0);
  
  return (
    <AvatarGroupContainer $spacing={spacing} className={className}>
      {visibleAvatars}
      {showMax && (
        <Avatar size={(visibleAvatars[0] as React.ReactElement)?.props?.size || 'md'}>
          +{remainingCount}
        </Avatar>
      )}
    </AvatarGroupContainer>
  );
};

Avatar.Group = Group;
