import React, { forwardRef } from 'react';
import { useButton, UseButtonProps } from './useButton';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless Button component
 */
export type ButtonHeadlessProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  UseButtonProps & {
    /** Children to render inside the button */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * A headless Button component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled buttons.
 *
 * @example
 * ```jsx
 * import { ButtonHeadless } from 'pulseui';
 * import styled from 'styled-components';
 *
 * const StyledButton = styled(ButtonHeadless)`
 *   background-color: ${props => props.isHovered ? 'blue' : 'navy'};
 *   color: white;
 *   padding: 8px 16px;
 *   border-radius: 4px;
 *   border: none;
 *   cursor: ${props => props.isDisabled ? 'not-allowed' : 'pointer'};
 *   opacity: ${props => props.isDisabled ? 0.7 : 1};
 * `;
 *
 * function MyComponent() {
 *   return (
 *     <StyledButton onClick={() => console.log('Clicked!')}>
 *       Click Me
 *     </StyledButton>
 *   );
 * }
 * ```
 */
// Create a type for the forwardRef component
type ButtonHeadlessComponent = <C extends React.ElementType = 'button'>(
  props: ButtonHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

// Create a properly typed forwardRef function
export const ButtonHeadless = forwardRef(function ButtonHeadless<C extends React.ElementType = 'button'>(
  { as, children, className, style, ...props }: Omit<ButtonHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const {
    buttonProps,
    isPressed,
    isFocused,
    isHovered,
    isLoading,
    isDisabled,
  } = useButton(props);

  // Combine refs
  const combinedRef = (node: any) => {
    // Update the internal ref
    if (buttonProps.ref) {
      if (typeof buttonProps.ref === 'function') {
        (buttonProps.ref as any)(node);
      } else if (buttonProps.ref) {
        (buttonProps.ref as React.MutableRefObject<any>).current = node;
      }
    }
    
    // Forward the ref
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<any>).current = node;
    }
  };

  // Remove the ref from buttonProps to avoid React warning about duplicate refs
  const { ref: buttonRef, ...restButtonProps } = buttonProps;

  // Use the 'as' prop or default to 'a' if href is provided, otherwise 'button'
  const ElementType: React.ElementType = as || (props.href ? 'a' : 'button');

  return React.createElement(
    ElementType,
    {
      ...restButtonProps,
      ref: combinedRef,
      className,
      style,
      'data-pressed': isPressed,
      'data-focused': isFocused,
      'data-hovered': isHovered,
      'data-loading': isLoading,
      'data-disabled': isDisabled
    },
    children
  );
}) as unknown as ButtonHeadlessComponent;

// Add displayName for better debugging
(ButtonHeadless as any).displayName = 'ButtonHeadless';

// Export the component with the correct type
export default ButtonHeadless;
