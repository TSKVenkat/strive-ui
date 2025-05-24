import React, { forwardRef, createContext, useContext } from 'react';
import { useCheckbox, UseCheckboxProps, UseCheckboxReturn } from './useCheckbox';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the CheckboxHeadless component
 */
export type CheckboxHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseCheckboxProps & {
    /** Label for the checkbox */
    label?: string;
    /** Children to render inside the component */
    children?: React.ReactNode | ((props: {
      checked: boolean;
      indeterminate: boolean;
      disabled: boolean;
      required: boolean;
      focused: boolean;
      toggle: () => void;
    }) => React.ReactNode);
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the CheckboxInput component
 */
export type CheckboxInputProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the CheckboxLabel component
 */
export type CheckboxLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the CheckboxControl component
 */
export type CheckboxControlProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the control */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the CheckboxIndicator component
 */
export type CheckboxIndicatorProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the indicator */
    children?: React.ReactNode | ((props: {
      checked: boolean;
      indeterminate: boolean;
    }) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the checkbox state
interface CheckboxContextValue extends UseCheckboxReturn {}

const CheckboxContext = createContext<CheckboxContextValue | null>(null);

// Custom hook to use the checkbox context
const useCheckboxContext = () => {
  const context = useContext<CheckboxContextValue | null>(CheckboxContext);
  if (!context) {
    throw new Error('Checkbox compound components must be used within a CheckboxHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type CheckboxHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: CheckboxHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type CheckboxInputComponent = <C extends React.ElementType = 'input'>(
  props: CheckboxInputProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type CheckboxLabelComponent = <C extends React.ElementType = 'label'>(
  props: CheckboxLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type CheckboxControlComponent = <C extends React.ElementType = 'div'>(
  props: CheckboxControlProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type CheckboxIndicatorComponent = <C extends React.ElementType = 'div'>(
  props: CheckboxIndicatorProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

/**
 * A headless Checkbox component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled checkbox implementations.
 */
export const CheckboxHeadless = forwardRef(function CheckboxHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<CheckboxHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const checkboxState = useCheckbox(props);
  
  const { 
    checked,
    indeterminate,
    disabled,
    required,
    focused,
    toggle,
  } = checkboxState;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <CheckboxContext.Provider value={checkboxState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
      >
        {typeof children === 'function' 
          ? children({ 
              checked, 
              indeterminate, 
              disabled, 
              required, 
              focused, 
              toggle 
            }) 
          : children || (
            <>
              <CheckboxInput />
              <CheckboxControl>
                <CheckboxIndicator />
              </CheckboxControl>
              {label && <CheckboxLabel>{label}</CheckboxLabel>}
            </>
          )}
      </ElementType>
    </CheckboxContext.Provider>
  );
}) as unknown as CheckboxHeadlessComponent;

/**
 * The actual checkbox input element (visually hidden in most implementations).
 */
export const CheckboxInput = forwardRef(function CheckboxInput<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<CheckboxInputProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getInputProps, inputRef } = useCheckboxContext();
  
  // Get props for the input
  const inputProps = getInputProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'input'
  const ElementType: React.ElementType = as || 'input';

  return (
    <ElementType
      {...inputProps}
      ref={(node) => {
        // Handle both the internal ref and the forwarded ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<any>).current = node;
        }
        
        // @ts-ignore - inputRef.current is read-only
        inputRef.current = node;
      }}
    />
  );
}) as unknown as CheckboxInputComponent;

/**
 * The label component for the checkbox.
 */
export const CheckboxLabel = forwardRef(function CheckboxLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<CheckboxLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getLabelProps } = useCheckboxContext();
  
  // Get props for the label
  const labelProps = getLabelProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'label'
  const ElementType: React.ElementType = as || 'label';

  return (
    <ElementType
      {...labelProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as CheckboxLabelComponent;

/**
 * The visual control component that replaces the native checkbox.
 */
export const CheckboxControl = forwardRef(function CheckboxControl<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<CheckboxControlProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { checked, indeterminate, disabled, id } = useCheckboxContext();
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
      data-disabled={disabled || undefined}
      aria-hidden="true"
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as CheckboxControlComponent;

/**
 * The indicator component that shows when the checkbox is checked or indeterminate.
 */
export const CheckboxIndicator = forwardRef(function CheckboxIndicator<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<CheckboxIndicatorProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { checked, indeterminate } = useCheckboxContext();
  
  // If not checked or indeterminate, don't render anything
  if (!checked && !indeterminate) {
    return null;
  }
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      data-state={indeterminate ? 'indeterminate' : 'checked'}
      {...props}
    >
      {typeof children === 'function' 
        ? children({ checked, indeterminate }) 
        : children || (
          indeterminate ? (
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
              <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )
        )}
    </ElementType>
  );
}) as unknown as CheckboxIndicatorComponent;

// Add displayNames for better debugging
(CheckboxHeadless as any).displayName = 'CheckboxHeadless';
(CheckboxInput as any).displayName = 'CheckboxInput';
(CheckboxLabel as any).displayName = 'CheckboxLabel';
(CheckboxControl as any).displayName = 'CheckboxControl';
(CheckboxIndicator as any).displayName = 'CheckboxIndicator';

// Create a compound component
export const Checkbox = Object.assign(CheckboxHeadless, {
  Input: CheckboxInput,
  Label: CheckboxLabel,
  Control: CheckboxControl,
  Indicator: CheckboxIndicator,
});

export default Checkbox;
