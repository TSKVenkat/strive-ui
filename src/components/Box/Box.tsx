import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

export type BorderRadiusType = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | string;
export type BoxShadowType = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'none' | string;

// Base props for the Box component without the polymorphic 'as' prop
export interface BoxBaseProps {
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
  /** Shorthand for padding */
  p?: number | string | (number | string)[];
  /** Shorthand for margin */
  m?: number | string;
  /** Margin top */
  mt?: number | string;
  /** Margin right */
  mr?: number | string;
  /** Margin bottom */
  mb?: number | string;
  /** Margin left */
  ml?: number | string;
  /** Margin horizontal (left and right) */
  mx?: number | string;
  /** Margin vertical (top and bottom) */
  my?: number | string;
  /** Padding top */
  pt?: number | string;
  /** Padding right */
  pr?: number | string;
  /** Padding bottom */
  pb?: number | string;
  /** Padding left */
  pl?: number | string;
  /** Padding horizontal (left and right) */
  px?: number | string;
  /** Padding vertical (top and bottom) */
  py?: number | string;
  /** Width of the box */
  width?: number | string | (number | string)[];
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
  /** Shorthand for backgroundColor */
  bg?: string;
  /** Text color */
  color?: string;
  /** Border color */
  borderColor?: string;
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
  /** onClick handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /** onMouseEnter handler */
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
  /** onMouseLeave handler */
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
}

// Polymorphic Box props that combine BoxBaseProps with the polymorphic component props
export type BoxProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<C, BoxBaseProps>

const formatSpacingValue = (value: number | string | (number | string)[] | undefined, theme: any): string | undefined => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return formatSpacingValue(value[0], theme);
  if (typeof value === 'string') return value;
  return theme.spacing[value] || `${value}px`;
};

const StyledBox = styled.div<BoxBaseProps>`
  ${({ display }) => display && `display: ${display};`}
  ${({ flexDirection }) => flexDirection && `flex-direction: ${flexDirection};`}
  ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
  ${({ alignItems }) => alignItems && `align-items: ${alignItems};`}
  ${({ flexWrap }) => flexWrap && `flex-wrap: ${flexWrap};`}
  ${({ gap, theme }) => gap !== undefined && `gap: ${formatSpacingValue(gap, theme)};`}
  ${({ padding, p, theme }) => (padding !== undefined || p !== undefined) && `padding: ${formatSpacingValue((p || padding) as number | string | undefined, theme)};`}
  ${({ margin, m, theme }) => (margin !== undefined || m !== undefined) && `margin: ${formatSpacingValue(m || margin, theme)};`}
  ${({ mt, theme }) => mt !== undefined && `margin-top: ${formatSpacingValue(mt, theme)};`}
  ${({ mr, theme }) => mr !== undefined && `margin-right: ${formatSpacingValue(mr, theme)};`}
  ${({ mb, theme }) => mb !== undefined && `margin-bottom: ${formatSpacingValue(mb, theme)};`}
  ${({ ml, theme }) => ml !== undefined && `margin-left: ${formatSpacingValue(ml, theme)};`}
  ${({ mx, theme }) => mx !== undefined && `margin-left: ${formatSpacingValue(mx, theme)}; margin-right: ${formatSpacingValue(mx, theme)};`}
  ${({ my, theme }) => my !== undefined && `margin-top: ${formatSpacingValue(my, theme)}; margin-bottom: ${formatSpacingValue(my, theme)};`}
  ${({ pt, theme }) => pt !== undefined && `padding-top: ${formatSpacingValue(pt, theme)};`}
  ${({ pr, theme }) => pr !== undefined && `padding-right: ${formatSpacingValue(pr, theme)};`}
  ${({ pb, theme }) => pb !== undefined && `padding-bottom: ${formatSpacingValue(pb, theme)};`}
  ${({ pl, theme }) => pl !== undefined && `padding-left: ${formatSpacingValue(pl, theme)};`}
  ${({ px, theme }) => px !== undefined && `padding-left: ${formatSpacingValue(px, theme)}; padding-right: ${formatSpacingValue(px, theme)};`}
  ${({ py, theme }) => py !== undefined && `padding-top: ${formatSpacingValue(py, theme)}; padding-bottom: ${formatSpacingValue(py, theme)};`}
  ${({ width }) => width !== undefined && `width: ${Array.isArray(width) ? width[0] : (typeof width === 'number' ? `${width}px` : width)};`}
  ${({ height }) => height !== undefined && `height: ${typeof height === 'number' ? `${height}px` : height};`}
  ${({ maxWidth }) => maxWidth !== undefined && `max-width: ${typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth};`}
  ${({ maxHeight }) => maxHeight !== undefined && `max-height: ${typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight};`}
  ${({ minWidth }) => minWidth !== undefined && `min-width: ${typeof minWidth === 'number' ? `${minWidth}px` : minWidth};`}
  ${({ minHeight }) => minHeight !== undefined && `min-height: ${typeof minHeight === 'number' ? `${minHeight}px` : minHeight};`}
  ${({ backgroundColor, bg }) => (backgroundColor || bg) && `background-color: ${bg || backgroundColor};`}
  ${({ color }) => color && `color: ${color};`}
  ${({ borderColor }) => borderColor && `border-color: ${borderColor};`}
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

/**
 * Box component that can be rendered as any HTML element or React component
 * while maintaining proper typing for props and ref.
 */
type PolymorphicBoxComponent = <C extends React.ElementType = 'div'>(
  props: BoxProps<C>
) => JSX.Element;

interface PolymorphicBoxComponentWithDisplayName extends PolymorphicBoxComponent {
  displayName?: string;
}

export const Box = forwardRef(function Box<C extends React.ElementType = 'div'>(
  { as, children, ...restProps }: BoxProps<C>,
  ref: React.Ref<any>
) {
  const Component = as || 'div';
  return (
    <StyledBox as={Component} ref={ref} {...restProps}>
      {children}
    </StyledBox>
  );
}) as unknown as PolymorphicBoxComponentWithDisplayName;

Box.displayName = 'Box';
