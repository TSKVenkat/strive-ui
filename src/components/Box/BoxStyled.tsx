import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';
import { SystemStyleProps } from '../../types/css-properties';
import { system } from '../../styles/styled-system';

/**
 * BoxStyled is a polymorphic component that accepts all system style props
 * and renders with proper styling based on the theme.
 * It demonstrates the power of template literal types for CSS-in-JS.
 */

// Base props for the BoxStyled component
export type BoxStyledBaseProps = SystemStyleProps & {
  /** Children to render inside the box */
  children?: React.ReactNode;
};

// Polymorphic BoxStyled props
export type BoxStyledProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  BoxStyledBaseProps
>;

// Create the styled component with system props
const StyledBox = styled.div<BoxStyledBaseProps>`
  ${system}
`;

// Create a type for the forwardRef component
type BoxStyledComponent = <C extends React.ElementType = 'div'>(
  props: BoxStyledProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * BoxStyled is a foundational component that accepts all system style props.
 * It provides a type-safe way to style components using the design system values.
 * 
 * @example
 * ```jsx
 * <BoxStyled 
 *   padding="4"
 *   margin={{ base: '2', md: '4', lg: '6' }}
 *   color="primary.500"
 *   backgroundColor="neutral.100"
 *   borderRadius="md"
 *   display="flex"
 *   flexDirection={{ base: 'column', md: 'row' }}
 * >
 *   Content
 * </BoxStyled>
 * ```
 */
export const BoxStyled = forwardRef(function BoxStyled<C extends React.ElementType = 'div'>(
  { as, children, ...restProps }: Omit<BoxStyledProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return React.createElement(
    StyledBox,
    {
      as: ElementType,
      ref,
      ...restProps,
    },
    children
  );
}) as unknown as BoxStyledComponent;

// Add displayName for better debugging
(BoxStyled as any).displayName = 'BoxStyled';

export default BoxStyled;
