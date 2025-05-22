import React from 'react';
import styled, { css } from 'styled-components';

export type BadgeVariant = 'solid' | 'outline' | 'subtle';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface BadgeProps {
  /** The content of the badge */
  children: React.ReactNode;
  /** The variant of the badge */
  variant?: BadgeVariant;
  /** The size of the badge */
  size?: BadgeSize;
  /** The color of the badge */
  color?: BadgeColor;
  /** Whether the badge is rounded */
  rounded?: boolean;
  /** Additional CSS className */
  className?: string;
}

interface StyledBadgeProps {
  $variant: BadgeVariant;
  $size: BadgeSize;
  $color: BadgeColor;
  $rounded: boolean;
}

const getColorStyles = (variant: BadgeVariant, color: BadgeColor) => {
  const getColorValue = (theme: any) => {
    switch (color) {
      case 'primary':
        return theme.colors.primary[600];
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      case 'neutral':
      default:
        return theme.colors.neutral[600];
    }
  };

  const getLightColorValue = (theme: any) => {
    switch (color) {
      case 'primary':
        return theme.colors.primary[100];
      case 'success':
        return '#E6F7E6';
      case 'warning':
        return '#FFF7E6';
      case 'error':
        return '#FEE6E6';
      case 'info':
        return '#E6F7FF';
      case 'neutral':
      default:
        return theme.colors.neutral[200];
    }
  };

  switch (variant) {
    case 'solid':
      return css`
        background-color: ${({ theme }: { theme: any }) => getColorValue(theme)};
        color: ${({ theme }: { theme: any }) => theme.colors.neutral[100]};
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }: { theme: any }) => getColorValue(theme)};
        border: 1px solid ${({ theme }: { theme: any }) => getColorValue(theme)};
      `;
    case 'subtle':
      return css`
        background-color: ${({ theme }: { theme: any }) => getLightColorValue(theme)};
        color: ${({ theme }: { theme: any }) => getColorValue(theme)};
      `;
    default:
      return '';
  }
};

const getSizeStyles = (size: BadgeSize) => {
  switch (size) {
    case 'sm':
      return css`
        font-size: ${({ theme }: { theme: any }) => theme.typography.fontSize.xs};
        padding: 0 ${({ theme }: { theme: any }) => theme.spacing[1]};
        height: 20px;
      `;
    case 'md':
      return css`
        font-size: ${({ theme }: { theme: any }) => theme.typography.fontSize.xs};
        padding: 0 ${({ theme }: { theme: any }) => theme.spacing[2]};
        height: 24px;
      `;
    case 'lg':
      return css`
        font-size: ${({ theme }: { theme: any }) => theme.typography.fontSize.sm};
        padding: 0 ${({ theme }: { theme: any }) => theme.spacing[2]};
        height: 28px;
      `;
    default:
      return '';
  }
};

const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ $rounded, theme }: { $rounded: boolean; theme: any }) => 
    $rounded ? '9999px' : theme.borderRadius.md};
  font-weight: ${({ theme }: { theme: any }) => theme.typography.fontWeight.medium};
  line-height: 1;
  white-space: nowrap;
  
  ${({ $variant, $color }: { $variant: BadgeVariant; $color: BadgeColor }) => 
    getColorStyles($variant, $color)};
  ${({ $size }: { $size: BadgeSize }) => getSizeStyles($size)};
`;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'solid',
  size = 'md',
  color = 'primary',
  rounded = false,
  className,
}) => {
  return (
    <StyledBadge
      $variant={variant}
      $size={size}
      $color={color}
      $rounded={rounded}
      className={className}
    >
      {children}
    </StyledBadge>
  );
};

Badge.displayName = 'Badge';
