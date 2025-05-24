import React, { forwardRef } from 'react';
import { useTextInput, UseTextInputProps } from './useTextInput';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the TextInputHeadless component
 */
export type TextInputHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseTextInputProps & {
    /** Label for the input */
    label?: string;
    /** Children to render inside the component */
    children?: React.ReactNode | ((props: {
      value: string;
      isFocused: boolean;
      isDisabled: boolean;
      isReadOnly: boolean;
      isRequired: boolean;
      inputId: string;
      clear: () => void;
    }) => React.ReactNode);
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the TextInputLabel component
 */
export type TextInputLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the TextInputField component
 */
export type TextInputFieldProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the TextInputClearButton component
 */
export type TextInputClearButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the clear button */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create types for the forwardRef components
type TextInputHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TextInputHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TextInputLabelComponent = <C extends React.ElementType = 'label'>(
  props: TextInputLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TextInputFieldComponent = <C extends React.ElementType = 'input'>(
  props: TextInputFieldProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TextInputClearButtonComponent = <C extends React.ElementType = 'button'>(
  props: TextInputClearButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

// Create a context to share the text input state
interface TextInputContextValue {
  value: string;
  isFocused: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
  inputId: string;
  clear: () => void;
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
  getLabelProps: <E extends HTMLLabelElement = HTMLLabelElement>(
    props?: React.LabelHTMLAttributes<E>
  ) => React.LabelHTMLAttributes<E>;
}

const TextInputContext = React.createContext<TextInputContextValue | null>(null);

// Custom hook to use the text input context
const useTextInputContext = () => {
  const context = React.useContext<TextInputContextValue | null>(TextInputContext);
  if (!context) {
    throw new Error('TextInput compound components must be used within a TextInputHeadless component');
  }
  return context;
};

/**
 * A headless TextInput component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled text input implementations.
 */
export const TextInputHeadless = forwardRef(function TextInputHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<TextInputHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const textInputState = useTextInput(props);
  
  const { 
    value,
    isFocused,
    isDisabled,
    isReadOnly,
    isRequired,
    inputId,
    clear,
  } = textInputState;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <TextInputContext.Provider value={textInputState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
      >
        {typeof children === 'function' 
          ? children({ 
              value, 
              isFocused, 
              isDisabled, 
              isReadOnly, 
              isRequired, 
              inputId, 
              clear 
            }) 
          : children || (
            <>
              {label && <TextInputLabel>{label}</TextInputLabel>}
              <TextInputField />
            </>
          )}
      </ElementType>
    </TextInputContext.Provider>
  );
}) as unknown as TextInputHeadlessComponent;

/**
 * A label component for the TextInput.
 */
export const TextInputLabel = forwardRef(function TextInputLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<TextInputLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getLabelProps } = useTextInputContext();
  
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
}) as unknown as TextInputLabelComponent;

/**
 * An input field component for the TextInput.
 */
export const TextInputField = forwardRef(function TextInputField<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<TextInputFieldProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getInputProps } = useTextInputContext();
  
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
      ref={ref}
    />
  );
}) as unknown as TextInputFieldComponent;

/**
 * A clear button component for the TextInput.
 */
export const TextInputClearButton = forwardRef(function TextInputClearButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<TextInputClearButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { clear, isDisabled, isReadOnly } = useTextInputContext();
  
  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      onClick={clear}
      disabled={isDisabled || isReadOnly}
      type="button"
      aria-label="Clear input"
      {...props}
    >
      {children || '✕'}
    </ElementType>
  );
}) as unknown as TextInputClearButtonComponent;

// Add displayNames for better debugging
(TextInputHeadless as any).displayName = 'TextInputHeadless';
(TextInputLabel as any).displayName = 'TextInputLabel';
(TextInputField as any).displayName = 'TextInputField';
(TextInputClearButton as any).displayName = 'TextInputClearButton';

// Create a compound component
export const TextInput = Object.assign(TextInputHeadless, {
  Label: TextInputLabel,
  Field: TextInputField,
  ClearButton: TextInputClearButton,
});

export default TextInput;
