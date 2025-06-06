import React, { createContext, useContext, forwardRef } from 'react';
import { usePinInput } from './usePinInput';
import type { UsePinInputReturn } from './usePinInput';

// Define the props for the PinInput component
export interface PinInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onFocus' | 'onBlur' | 'onKeyDown' | 'onChange'> {
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback when all inputs are filled
   */
  onComplete?: (value: string) => void;
  /**
   * Number of input fields
   */
  length?: number;
  /**
   * Type of input fields
   */
  type?: 'text' | 'password' | 'number';
  /**
   * Mask character for password type
   */
  mask?: string;
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
  /**
   * Whether the input is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the input is required
   */
  required?: boolean;
  /**
   * ID for the pin input element
   */
  id?: string;
  /**
   * Name attribute for the pin input
   */
  name?: string;
  /**
   * Whether to auto focus the first input
   */
  autoFocus?: boolean;
  /**
   * Whether to focus the next input automatically
   */
  autoFocusNext?: boolean;
  /**
   * Whether to focus the previous input on backspace
   */
  focusPrevOnBackspace?: boolean;
  /**
   * Whether to clear all inputs when the value is cleared
   */
  clearOnReset?: boolean;
  /**
   * Whether to allow only one character per input
   */
  oneCharPerInput?: boolean;
  /**
   * Regex pattern for input validation
   */
  pattern?: string;
  /**
   * Placeholder for each input
   */
  placeholder?: string;
  /**
   * Separator between inputs
   */
  separator?: React.ReactNode;
  /**
   * Callback when an input is focused
   */
  onFocus?: (index: number, event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when an input is blurred
   */
  onBlur?: (index: number, event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when a key is pressed
   */
  onKeyDown?: (index: number, event: React.KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Callback when paste event occurs
   */
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the PinInput
export interface PinInputContextValue extends UsePinInputReturn {}

const PinInputContext = createContext<PinInputContextValue | undefined>(undefined);

// Hook to use the PinInput context
export function usePinInputContext() {
  const context = useContext(PinInputContext);
  if (!context) {
    throw new Error('usePinInputContext must be used within a PinInputProvider');
  }
  return context;
}

// Root component
export const PinInputRoot = forwardRef<HTMLDivElement, PinInputProps>(
  (
    {
      defaultValue,
      value,
      onChange,
      onComplete,
      length = 4,
      type = 'text',
      mask,
      disabled,
      readOnly,
      required,
      id,
      name,
      autoFocus,
      autoFocusNext,
      focusPrevOnBackspace,
      clearOnReset,
      oneCharPerInput,
      pattern,
      placeholder,
      separator,
      onFocus,
      onBlur,
      onKeyDown,
      onPaste,
      children,
      ...props
    },
    ref
  ) => {
    // Use the pin input hook
    const pinInput = usePinInput({
      defaultValue,
      value,
      onChange,
      onComplete,
      length,
      type,
      mask,
      disabled,
      readOnly,
      required,
      id,
      name,
      autoFocus,
      autoFocusNext,
      focusPrevOnBackspace,
      clearOnReset,
      oneCharPerInput,
      pattern,
      placeholder,
      separator,
      onFocus,
      onBlur,
      onKeyDown,
      onPaste,
    });

    // Get pin input props
    const pinInputProps = pinInput.getPinInputProps(props);

    return (
      <PinInputContext.Provider value={pinInput}>
        <div {...pinInputProps} ref={ref}>
          {children || (
            <>
              {Array.from({ length }).map((_, index) => (
                <React.Fragment key={index}>
                  <PinInputField index={index} />
                  {separator && index < length - 1 && (
                    <PinInputSeparator>{separator}</PinInputSeparator>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </PinInputContext.Provider>
    );
  }
);

PinInputRoot.displayName = 'PinInput';

// Field component
export interface PinInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  index: number;
}

export const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  ({ index, ...props }, ref) => {
    const { getInputProps, type, mask } = usePinInputContext();
    const inputProps = getInputProps(index, props);

    // If type is password and mask is provided, display the mask character instead of the actual value
    if (type === 'password' && mask && inputProps.value) {
      inputProps.value = mask;
    }

    return <input {...inputProps} ref={ref} />;
  }
);

PinInputField.displayName = 'PinInput.Field';

// Separator component
export interface PinInputSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const PinInputSeparator = forwardRef<HTMLDivElement, PinInputSeparatorProps>(
  ({ children, ...props }, ref) => {
    return (
      <div role="separator" {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

PinInputSeparator.displayName = 'PinInput.Separator';

// Clear button component
export interface PinInputClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const PinInputClearButton = forwardRef<HTMLButtonElement, PinInputClearButtonProps>(
  ({ children, ...props }, ref) => {
    const { clear, disabled, readOnly, value } = usePinInputContext();

    return (
      <button
        type="button"
        {...props}
        ref={ref}
        onClick={(e) => {
          clear();
          props.onClick?.(e);
        }}
        disabled={disabled || readOnly || !value || props.disabled}
        aria-label="Clear"
        data-visible={value ? '' : undefined}
      >
        {children || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        )}
      </button>
    );
  }
);

PinInputClearButton.displayName = 'PinInput.ClearButton';

// Hide component
export interface PinInputHideProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const PinInputHide = forwardRef<HTMLDivElement, PinInputHideProps>(
  ({ children, ...props }, ref) => {
    return (
      <div {...props} ref={ref} aria-hidden="true" style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }
);

PinInputHide.displayName = 'PinInput.Hide';

// Create the PinInput component with all its subcomponents
export const PinInputHeadless = Object.assign(PinInputRoot, {
  Field: PinInputField,
  Separator: PinInputSeparator,
  ClearButton: PinInputClearButton,
  Hide: PinInputHide,
});

export default PinInputHeadless;
