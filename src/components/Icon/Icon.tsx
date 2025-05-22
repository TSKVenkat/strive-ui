import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import * as iconComponents from './icons';

// Icon size variants
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;

// Icon weight/style variants
export type IconWeight = 'light' | 'regular' | 'medium' | 'bold' | 'fill';

// Available icon names (dynamically generated from the icons object)
export type IconName = keyof typeof iconComponents;

// Define a custom interface that doesn't extend SVGAttributes
export interface IconProps {
  /**
   * Name of the icon to display
   */
  name: IconName;
  
  /**
   * Size of the icon
   * @default 'md'
   */
  size?: IconSize;
  
  /**
   * Weight/style of the icon
   * @default 'regular'
   */
  weight?: IconWeight;
  
  /**
   * Color of the icon (inherits from parent by default)
   */
  color?: string;
  
  /**
   * Whether the icon should spin
   * @default false
   */
  spin?: boolean;
  
  /**
   * Whether the icon should pulse
   * @default false
   */
  pulse?: boolean;
  
  /**
   * Whether the icon should have a bounce animation
   * @default false
   */
  bounce?: boolean;
  
  /**
   * Custom CSS class name
   */
  className?: string;
  
  /**
   * Title for accessibility
   */
  title?: string;
  
  /**
   * Description for accessibility
   */
  description?: string;
  
  /**
   * Label for accessibility
   */
  label?: string;
  
  /**
   * Whether the icon is mirrored (RTL support)
   * @default false
   */
  mirrored?: boolean;
  
  /**
   * Additional SVG props
   */
  svgProps?: React.SVGAttributes<SVGElement>;
}

// Size mapping
const getSizeValue = (size: IconSize): string => {
  if (typeof size === 'number') {
    return `${size}px`;
  }
  
  const sizeMap: Record<string, string> = {
    xs: '1rem',    // 16px
    sm: '1.25rem', // 20px
    md: '1.5rem',  // 24px
    lg: '2rem',    // 32px
    xl: '2.5rem',  // 40px
    '2xl': '3rem', // 48px
  };
  
  return sizeMap[size as string] || sizeMap.md;
};

// Styled icon component
const StyledIcon = styled.svg<{
  $size: IconSize;
  $color?: string;
  $spin?: boolean;
  $pulse?: boolean;
  $bounce?: boolean;
  $mirrored?: boolean;
}>`
  display: inline-flex;
  align-self: center;
  width: ${props => getSizeValue(props.$size)};
  height: ${props => getSizeValue(props.$size)};
  color: ${props => props.$color || 'currentColor'};
  fill: currentColor;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  
  ${props => props.$mirrored && css`
    transform: scaleX(-1);
  `}
  
  ${props => props.$spin && css`
    animation: spin 1.5s linear infinite;
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
  
  ${props => props.$pulse && css`
    animation: pulse 1.5s ease-in-out infinite;
    
    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }
  `}
  
  ${props => props.$bounce && css`
    animation: bounce 1s ease infinite;
    
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-5px);
      }
    }
  `}
`;

/**
 * Icon component for displaying vector icons
 * 
 * @example
 * ```jsx
 * <Icon name="check" size="md" color="green" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps & React.SVGAttributes<SVGElement>>(({
  name,
  size = 'md',
  weight = 'regular',
  color,
  spin = false,
  pulse = false,
  bounce = false,
  mirrored = false,
  title,
  description,
  label,
  className,
  ...props
}, ref) => {
  // Get the icon component
  const IconComponent = iconComponents[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${String(name)}" not found`);
    return null;
  }
  
  // Accessibility props
  const accessibilityProps: Record<string, string> = {};
  
  if (title || label) {
    accessibilityProps['aria-label'] = label || title || '';
  } else {
    accessibilityProps['aria-hidden'] = 'true';
  }
  
  // Extract svgProps and other props
  const { svgProps, ...otherProps } = props;
  
  return (
    <StyledIcon
      ref={ref}
      $size={size}
      $color={color}
      $spin={spin}
      $pulse={pulse}
      $bounce={bounce}
      $mirrored={mirrored}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...accessibilityProps}
      {...otherProps}
      {...svgProps}
    >
      {title && <title>{title}</title>}
      {description && <desc>{description}</desc>}
      <IconComponent weight={weight} />
    </StyledIcon>
  );
});

Icon.displayName = 'Icon';

// Export icon names for autocomplete
export const iconNames = Object.keys(iconComponents) as IconName[];
