import React, { forwardRef, createContext, useContext } from 'react';
import { useRadio, UseRadioProps, UseRadioReturn } from './useRadio';
import { useRadioGroup, UseRadioGroupProps, UseRadioGroupReturn } from './useRadioGroup';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the RadioHeadless component
 */
export type RadioHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseRadioProps & {
    /** Label for the radio */
    label?: string;
    /** Children to render inside the component */
    children?: React.ReactNode | ((props: {
      checked: boolean;
      disabled: boolean;
      required: boolean;
      focused: boolean;
    }) => React.ReactNode);
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RadioInput component
 */
export type RadioInputProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RadioLabel component
 */
export type RadioLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the RadioControl component
 */
export type RadioControlProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
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
 * Props for the RadioIndicator component
 */
export type RadioIndicatorProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the indicator */
    children?: React.ReactNode | ((props: {
      checked: boolean;
    }) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RadioGroup component
 */
export type RadioGroupProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseRadioGroupProps & {
    /** Children to render inside the component */
    children?: React.ReactNode | ((props: {
      value: string;
      setValue: (value: string) => void;
      disabled: boolean;
      required: boolean;
      name: string;
      orientation: 'horizontal' | 'vertical';
    }) => React.ReactNode);
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the radio state
interface RadioContextValue extends UseRadioReturn {}

const RadioContext = createContext<RadioContextValue | null>(null);

// Create a context to share the radio group state
interface RadioGroupContextValue extends UseRadioGroupReturn {}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

// Custom hook to use the radio context
const useRadioContext = () => {
  const context = useContext<RadioContextValue | null>(RadioContext);
  if (!context) {
    throw new Error('Radio compound components must be used within a RadioHeadless component');
  }
  return context;
};

// Custom hook to use the radio group context
const useRadioGroupContext = () => {
  const context = useContext<RadioGroupContextValue | null>(RadioGroupContext);
  return context; // This can be null if not used within a RadioGroup
};

// Create types for the forwardRef components
type RadioHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: RadioHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RadioInputComponent = <C extends React.ElementType = 'input'>(
  props: RadioInputProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RadioLabelComponent = <C extends React.ElementType = 'label'>(
  props: RadioLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RadioControlComponent = <C extends React.ElementType = 'div'>(
  props: RadioControlProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RadioIndicatorComponent = <C extends React.ElementType = 'div'>(
  props: RadioIndicatorProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type RadioGroupComponent = <C extends React.ElementType = 'div'>(
  props: RadioGroupProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Radio component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled radio implementations.
 */
export const RadioHeadless = forwardRef(function RadioHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<RadioHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Get radio group context if available
  const radioGroupContext = useRadioGroupContext();
  
  // If within a radio group, use its props
  const radioProps: UseRadioProps = radioGroupContext 
    ? {
        name: radioGroupContext.name,
        checked: radioGroupContext.value === props.value,
        onChange: (checked, event) => {
          if (checked && props.value) {
            radioGroupContext.setValue(props.value);
            
            // Call the original onChange if provided
            props.onChange?.(checked, event);
          }
        },
        disabled: radioGroupContext.disabled || props.disabled,
        required: radioGroupContext.required || props.required,
      }
    : props;
  
  const radioState = useRadio(radioProps);
  
  const { 
    checked,
    disabled,
    required,
    focused,
  } = radioState;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <RadioContext.Provider value={radioState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
      >
        {typeof children === 'function' 
          ? children({ 
              checked, 
              disabled, 
              required, 
              focused, 
            }) 
          : children || (
            <>
              <RadioInput />
              <RadioControl>
                <RadioIndicator />
              </RadioControl>
              {label && <RadioLabel>{label}</RadioLabel>}
            </>
          )}
      </ElementType>
    </RadioContext.Provider>
  );
}) as unknown as RadioHeadlessComponent;

/**
 * The actual radio input element (visually hidden in most implementations).
 */
export const RadioInput = forwardRef(function RadioInput<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<RadioInputProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getInputProps, inputRef } = useRadioContext();
  
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
}) as unknown as RadioInputComponent;

/**
 * The label component for the radio.
 */
export const RadioLabel = forwardRef(function RadioLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RadioLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getLabelProps } = useRadioContext();
  
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
}) as unknown as RadioLabelComponent;

/**
 * The visual control component that replaces the native radio.
 */
export const RadioControl = forwardRef(function RadioControl<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RadioControlProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { checked, disabled, id } = useRadioContext();
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      data-state={checked ? 'checked' : 'unchecked'}
      data-disabled={disabled || undefined}
      aria-hidden="true"
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as RadioControlComponent;

/**
 * The indicator component that shows when the radio is checked.
 */
export const RadioIndicator = forwardRef(function RadioIndicator<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RadioIndicatorProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { checked } = useRadioContext();
  
  // If not checked, don't render anything
  if (!checked) {
    return null;
  }
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      data-state="checked"
      {...props}
    >
      {typeof children === 'function' 
        ? children({ checked }) 
        : children || (
          <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor">
            <circle cx="8" cy="8" r="4" />
          </svg>
        )}
    </ElementType>
  );
}) as unknown as RadioIndicatorComponent;

/**
 * A group of radio buttons.
 */
export const RadioGroup = forwardRef(function RadioGroup<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RadioGroupProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const radioGroupState = useRadioGroup(props);
  
  const { 
    value,
    setValue,
    disabled,
    required,
    name,
    orientation,
    getRadioGroupProps,
  } = radioGroupState;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  // Get props for the radio group
  const radioGroupProps = getRadioGroupProps({
    className,
    style,
  });

  return (
    <RadioGroupContext.Provider value={radioGroupState}>
      <ElementType
        {...radioGroupProps}
        ref={ref}
        data-orientation={orientation}
      >
        {typeof children === 'function' 
          ? children({ 
              value, 
              setValue, 
              disabled, 
              required, 
              name, 
              orientation 
            }) 
          : children}
      </ElementType>
    </RadioGroupContext.Provider>
  );
}) as unknown as RadioGroupComponent;

// Add displayNames for better debugging
(RadioHeadless as any).displayName = 'RadioHeadless';
(RadioInput as any).displayName = 'RadioInput';
(RadioLabel as any).displayName = 'RadioLabel';
(RadioControl as any).displayName = 'RadioControl';
(RadioIndicator as any).displayName = 'RadioIndicator';
(RadioGroup as any).displayName = 'RadioGroup';

// Create a compound component
export const Radio = Object.assign(RadioHeadless, {
  Input: RadioInput,
  Label: RadioLabel,
  Control: RadioControl,
  Indicator: RadioIndicator,
  Group: RadioGroup,
});

export default Radio;
