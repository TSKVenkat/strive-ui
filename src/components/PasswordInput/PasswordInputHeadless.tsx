import React, { forwardRef, createContext, useContext } from 'react';
import { usePasswordInput, UsePasswordInputProps, UsePasswordInputReturn } from './usePasswordInput';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the PasswordInputHeadless component
 */
export type PasswordInputHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UsePasswordInputProps & {
    /** Label for the input */
    label?: string;
    /** Children to render inside the component */
    children?: React.ReactNode | ((props: {
      value: string;
      isFocused: boolean;
      isDisabled: boolean;
      isReadOnly: boolean;
      isRequired: boolean;
      isVisible: boolean;
      strength: number;
      meetsRequirements: boolean;
      requirementsMet: {
        minLength: boolean;
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasNumbers: boolean;
        hasSpecialChars: boolean;
      };
      inputId: string;
      clear: () => void;
      toggleVisibility: () => void;
    }) => React.ReactNode);
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the PasswordInputLabel component
 */
export type PasswordInputLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the PasswordInputField component
 */
export type PasswordInputFieldProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the PasswordInputToggle component
 */
export type PasswordInputToggleProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the toggle button */
    children?: React.ReactNode | ((isVisible: boolean) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the PasswordInputStrengthIndicator component
 */
export type PasswordInputStrengthIndicatorProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the strength indicator */
    children?: React.ReactNode | ((strength: number) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the PasswordInputRequirements component
 */
export type PasswordInputRequirementsProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the requirements list */
    children?: React.ReactNode | ((requirementsMet: {
      minLength: boolean;
      hasUppercase: boolean;
      hasLowercase: boolean;
      hasNumbers: boolean;
      hasSpecialChars: boolean;
    }) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the PasswordInputClearButton component
 */
export type PasswordInputClearButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
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
type PasswordInputHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: PasswordInputHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type PasswordInputLabelComponent = <C extends React.ElementType = 'label'>(
  props: PasswordInputLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type PasswordInputFieldComponent = <C extends React.ElementType = 'input'>(
  props: PasswordInputFieldProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type PasswordInputToggleComponent = <C extends React.ElementType = 'button'>(
  props: PasswordInputToggleProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type PasswordInputStrengthIndicatorComponent = <C extends React.ElementType = 'div'>(
  props: PasswordInputStrengthIndicatorProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type PasswordInputRequirementsComponent = <C extends React.ElementType = 'div'>(
  props: PasswordInputRequirementsProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type PasswordInputClearButtonComponent = <C extends React.ElementType = 'button'>(
  props: PasswordInputClearButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

// Create a context to share the password input state
interface PasswordInputContextValue extends UsePasswordInputReturn {
  requirementsMet: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
}

const PasswordInputContext = createContext<PasswordInputContextValue | null>(null);

// Custom hook to use the password input context
const usePasswordInputContext = () => {
  const context = useContext<PasswordInputContextValue | null>(PasswordInputContext);
  if (!context) {
    throw new Error('PasswordInput compound components must be used within a PasswordInputHeadless component');
  }
  return context;
};

/**
 * A headless PasswordInput component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled password input implementations.
 */
export const PasswordInputHeadless = forwardRef(function PasswordInputHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<PasswordInputHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const passwordInputState = usePasswordInput(props);
  
  const { 
    value,
    isFocused,
    isDisabled,
    isReadOnly,
    isRequired,
    isVisible,
    strength,
    meetsRequirements,
    requirementsMet,
    inputId,
    clear,
    toggleVisibility,
  } = passwordInputState;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <PasswordInputContext.Provider value={passwordInputState}>
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
              isVisible,
              strength,
              meetsRequirements,
              requirementsMet,
              inputId, 
              clear,
              toggleVisibility,
            }) 
          : children || (
            <>
              {label && <PasswordInputLabel>{label}</PasswordInputLabel>}
              <div style={{ position: 'relative' }}>
                <PasswordInputField />
                <PasswordInputToggle />
                <PasswordInputClearButton />
              </div>
              <PasswordInputStrengthIndicator />
              <PasswordInputRequirements />
            </>
          )}
      </ElementType>
    </PasswordInputContext.Provider>
  );
}) as unknown as PasswordInputHeadlessComponent;

/**
 * A label component for the PasswordInput.
 */
export const PasswordInputLabel = forwardRef(function PasswordInputLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<PasswordInputLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getLabelProps } = usePasswordInputContext();
  
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
}) as unknown as PasswordInputLabelComponent;

/**
 * An input field component for the PasswordInput.
 */
export const PasswordInputField = forwardRef(function PasswordInputField<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<PasswordInputFieldProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getInputProps } = usePasswordInputContext();
  
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
}) as unknown as PasswordInputFieldComponent;

/**
 * A toggle button component for the PasswordInput to show/hide the password.
 */
export const PasswordInputToggle = forwardRef(function PasswordInputToggle<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<PasswordInputToggleProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getToggleButtonProps, isVisible } = usePasswordInputContext();
  
  // Get props for the toggle button
  const toggleProps = getToggleButtonProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      {...toggleProps}
      ref={ref}
    >
      {typeof children === 'function' 
        ? children(isVisible) 
        : children || (isVisible ? 'Hide' : 'Show')}
    </ElementType>
  );
}) as unknown as PasswordInputToggleComponent;

/**
 * A strength indicator component for the PasswordInput.
 */
export const PasswordInputStrengthIndicator = forwardRef(function PasswordInputStrengthIndicator<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<PasswordInputStrengthIndicatorProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getStrengthIndicatorProps, strength, showStrengthIndicator } = usePasswordInputContext();
  
  // If strength indicator is disabled, don't render anything
  if (!showStrengthIndicator) {
    return null;
  }
  
  // Get props for the strength indicator
  const strengthProps = getStrengthIndicatorProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  // Strength labels
  const strengthLabels = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];

  return (
    <ElementType
      {...strengthProps}
      ref={ref}
    >
      {typeof children === 'function' 
        ? children(strength) 
        : children || strengthLabels[strength]}
    </ElementType>
  );
}) as unknown as PasswordInputStrengthIndicatorComponent;

/**
 * A requirements component for the PasswordInput.
 */
export const PasswordInputRequirements = forwardRef(function PasswordInputRequirements<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<PasswordInputRequirementsProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { requirementsMet, showRequirements } = usePasswordInputContext();
  
  // If requirements are disabled, don't render anything
  if (!showRequirements) {
    return null;
  }

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...props}
    >
      {typeof children === 'function' 
        ? children(requirementsMet) 
        : children || (
          <ul>
            <li data-met={requirementsMet.minLength}>At least 8 characters</li>
            <li data-met={requirementsMet.hasUppercase}>At least one uppercase letter</li>
            <li data-met={requirementsMet.hasLowercase}>At least one lowercase letter</li>
            <li data-met={requirementsMet.hasNumbers}>At least one number</li>
            <li data-met={requirementsMet.hasSpecialChars}>At least one special character</li>
          </ul>
        )}
    </ElementType>
  );
}) as unknown as PasswordInputRequirementsComponent;

/**
 * A clear button component for the PasswordInput.
 */
export const PasswordInputClearButton = forwardRef(function PasswordInputClearButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<PasswordInputClearButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { clear, isDisabled, isReadOnly, value } = usePasswordInputContext();
  
  // If there's no value, don't render the button
  if (!value) {
    return null;
  }
  
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
      aria-label="Clear password"
      {...props}
    >
      {children || '✕'}
    </ElementType>
  );
}) as unknown as PasswordInputClearButtonComponent;

// Add displayNames for better debugging
(PasswordInputHeadless as any).displayName = 'PasswordInputHeadless';
(PasswordInputLabel as any).displayName = 'PasswordInputLabel';
(PasswordInputField as any).displayName = 'PasswordInputField';
(PasswordInputToggle as any).displayName = 'PasswordInputToggle';
(PasswordInputStrengthIndicator as any).displayName = 'PasswordInputStrengthIndicator';
(PasswordInputRequirements as any).displayName = 'PasswordInputRequirements';
(PasswordInputClearButton as any).displayName = 'PasswordInputClearButton';

// Create a compound component
export const PasswordInput = Object.assign(PasswordInputHeadless, {
  Label: PasswordInputLabel,
  Field: PasswordInputField,
  Toggle: PasswordInputToggle,
  StrengthIndicator: PasswordInputStrengthIndicator,
  Requirements: PasswordInputRequirements,
  ClearButton: PasswordInputClearButton,
});

export default PasswordInput;
