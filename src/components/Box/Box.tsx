import React from 'react';
import styled from 'styled-components';

export type BorderRadiusType = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
export type BoxShadowType = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none' | string;

export interface BoxProps {
  /** The content of the box */
  children?: React.ReactNode;
  /** Additional CSS className */
  className?: string;
  /** Display property */
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
  /** Flex direction when display is flex or inline-flex */
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  /** Justify content when display is flex or inline-flex */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  /** Align items when display is flex or inline-flex */
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  /** Flex wrap when display is flex or inline-flex */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Gap between items */
  gap?: number | string;
  /** Padding (can be a number for uniform padding or a string for custom padding) */
  padding?: number | string;
  /** Margin (can be a number for uniform margin or a string for custom margin) */
  margin?: number | string;
  /** Width of the box */
  width?: number | string;
  /** Height of the box */
  height?: number | string;
  /** Max width of the box */
  maxWidth?: number | string;
  /** Max height of the box */
  maxHeight?: number | string;
  /** Min width of the box */
  minWidth?: number | string;
  /** Min height of the box */
  minHeight?: number | string;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  color?: string;
  /** Border radius of the box */
  borderRadius?: BorderRadiusType | number | string;
  /** Border */
  border?: string;
  /** Box shadow */
  boxShadow?: BoxShadowType | string;
  /** Position */
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  /** Top position when using absolute or fixed positioning */
  top?: number | string;
  /** Right position when using absolute or fixed positioning */
  right?: number | string;
  /** Bottom position when using absolute or fixed positioning */
  bottom?: number | string;
  /** Left position when using absolute or fixed positioning */
  left?: number | string;
  /** Z-index */
  zIndex?: number;
  /** Overflow behavior */
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  /** HTML element to render as */
  as?: React.ElementType;
  /** onClick handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** onMouseEnter handler */
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
  /** onMouseLeave handler */
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
}

const formatSpacingValue = (value: number | string | undefined, theme: any): string | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === 'string') return value;
  return theme.spacing[value] || `${value}px`;
};

const StyledBox = styled.div<BoxProps>`
  ${({ display }) => display && `display: ${display};`}
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection};`}
  ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
  ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
  ${({ flexWrap }) => flexWrap && `flex-wrap: ${flexWrap};`}
  ${({ gap, theme }) => gap !== undefined && `gap: ${formatSpacingValue(gap, theme)};`}
  ${({ padding, theme }) => padding !== undefined && `padding: ${formatSpacingValue(padding, theme)};`}
  ${({ margin, theme }) => margin !== undefined && `margin: ${formatSpacingValue(margin, theme)};`}
  ${({ width }) => width !== undefined && `width: ${typeof width === 'number' ? `${width}px` : width};`}
  ${({ height }) => height !== undefined && `height: ${typeof height === 'number' ? `${height}px` : height};`}
  ${({ maxWidth }) => maxWidth !== undefined && `max-width: ${typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth};`}
  ${({ maxHeight }) => maxHeight !== undefined && `max-height: ${typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight};`}
  ${({ minWidth }) => minWidth !== undefined && `min-width: ${typeof minWidth === 'number' ? `${minWidth}px` : minWidth};`}
  ${({ minHeight }) => minHeight !== undefined && `min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight};`}
  ${({ backgroundColor }) => backgroundColor && `background-color: ${backgroundColor};`}
  ${({ color }) => color && `color: ${color};`}
  ${({ borderRadius, theme }) => borderRadius !== undefined && 
    `border-radius: ${typeof borderRadius === 'number' ? `${borderRadius}px` : 
    (typeof borderRadius === 'string' && borderRadius in theme.borderRadius) ? 
    theme.borderRadius[borderRadius as keyof typeof theme.borderRadius] : borderRadius};`}
  ${({ border }) => border && `border: ${border};`}
  ${({ boxShadow, theme }) => boxShadow && `box-shadow: ${(typeof boxShadow === 'string' && boxShadow in theme.shadows) ? theme.shadows[boxShadow as keyof typeof theme.shadows] : boxShadow};`}
  ${({ position }) => position && `position: ${position};`}
  ${({ top }) => top !== undefined && `top: ${typeof top === 'number' ? `${top}px` : top};`}
  ${({ right }) => right !== undefined && `right: ${typeof right === 'number' ? `${right}px` : right};`}
  ${({ bottom }) => bottom !== undefined && `bottom: ${typeof bottom === 'number' ? `${bottom}px` : bottom};`}
  ${({ left }) => left !== undefined && `left: ${typeof left === 'number' ? `${left}px` : left};`}
  ${({ zIndex }) => zIndex !== undefined && `z-index: ${zIndex};`}
  ${({ overflow }) => overflow && `overflow: ${overflow};`}
`;

export const Box: React.FC<BoxProps> = ({ children, ...props }) => {
  return <StyledBox {...props}>{children}</StyledBox>;
};

Box.displayName = 'Box';
