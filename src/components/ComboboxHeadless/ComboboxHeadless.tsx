import React, { createContext, useContext, forwardRef } from 'react';
import { useCombobox, UseComboboxReturn, type ComboboxOption as ComboboxOptionType } from './useCombobox';

// Define the props for the Combobox component
export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Options for the combobox
   */
  options: ComboboxOptionType[];
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Default input value (uncontrolled)
   */
  defaultInputValue?: string;
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Controlled input value
   */
  inputValue?: string;
  /**
   * Callback when value changes
   */
  onChange?: (value: string, option: ComboboxOptionType | null) => void;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Whether the combobox is disabled
   */
  disabled?: boolean;
  /**
   * Whether the combobox is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the combobox is required
   */
  required?: boolean;
  /**
   * ID for the combobox element
   */
  id?: string;
  /**
   * Name attribute for the combobox
   */
  name?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether to allow free text input
   */
  allowCustomValue?: boolean;
  /**
   * Whether to open the dropdown on focus
   */
  openOnFocus?: boolean;
  /**
   * Whether to clear the input when an option is selected
   */
  clearOnSelect?: boolean;
  /**
   * Whether to select the first option when the dropdown is opened
   */
  selectOnFocus?: boolean;
  /**
   * Whether to filter options based on input value
   */
  filterOptions?: boolean;
  /**
   * Custom filter function
   */
  filterFunction?: (option: ComboboxOptionType, inputValue: string) => boolean;
  /**
   * Callback when dropdown is opened
   */
  onOpen?: () => void;
  /**
   * Callback when dropdown is closed
   */
  onClose?: () => void;
  /**
   * Callback when an option is highlighted
   */
  onHighlight?: (option: ComboboxOptionType | null) => void;
  /**
   * Callback when the input is focused
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when the input is blurred
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the Combobox
export interface ComboboxContextValue extends UseComboboxReturn {}

const ComboboxContext = createContext<ComboboxContextValue | undefined>(undefined);

// Hook to use the Combobox context
export function useComboboxContext() {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error('useComboboxContext must be used within a ComboboxProvider');
  }
  return context;
}

// Root component
export const ComboboxRoot = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      defaultValue,
      defaultInputValue,
      value,
      inputValue,
      onChange,
      onInputChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      placeholder,
      allowCustomValue,
      openOnFocus,
      clearOnSelect,
      selectOnFocus,
      filterOptions,
      filterFunction,
      onOpen,
      onClose,
      onHighlight,
      onFocus,
      onBlur,
      children,
      ...props
    },
    ref
  ) => {
    // Use the combobox hook
    const combobox = useCombobox({
      options,
      defaultValue,
      defaultInputValue,
      value,
      inputValue,
      onChange,
      onInputChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      placeholder,
      allowCustomValue,
      openOnFocus,
      clearOnSelect,
      selectOnFocus,
      filterOptions,
      filterFunction,
      onOpen,
      onClose,
      onHighlight,
      onFocus,
      onBlur,
    });

    // Get combobox props
    const comboboxProps = combobox.getComboboxProps(props);

    return (
      <ComboboxContext.Provider value={combobox}>
        <div {...comboboxProps} ref={ref}>
          {children || (
            <>
              <ComboboxInput />
              <ComboboxToggleButton />
              <ComboboxClearButton />
              <ComboboxListbox>
                {combobox.filteredOptions.map((option) => (
                  <ComboboxOption key={option.value} option={option} />
                ))}
              </ComboboxListbox>
            </>
          )}
        </div>
      </ComboboxContext.Provider>
    );
  }
);

ComboboxRoot.displayName = 'Combobox';

// Export interfaces that extend React HTML element interfaces but omit ref
export interface ComboboxInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref'> {}

// Input component
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  (props, ref) => {
    const { getInputProps } = useComboboxContext();
    const inputProps = getInputProps(props);
    return <input {...inputProps} ref={ref} />;
  }
);

ComboboxInput.displayName = 'ComboboxInput';

// Toggle button interface and component
export interface ComboboxToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  children?: React.ReactNode;
}

export const ComboboxToggleButton = forwardRef<HTMLButtonElement, ComboboxToggleButtonProps>(
  ({ children, ...props }, ref) => {
    const { getToggleButtonProps } = useComboboxContext();
    const toggleButtonProps = getToggleButtonProps(props);

    return (
      <button {...toggleButtonProps} ref={ref}>
        {children || '▼'}
      </button>
    );
  }
);

ComboboxToggleButton.displayName = 'ComboboxToggleButton';

// Clear button interface and component  
export interface ComboboxClearButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  children?: React.ReactNode;
}

export const ComboboxClearButton = forwardRef<HTMLButtonElement, ComboboxClearButtonProps>(
  ({ children, ...props }, ref) => {
    const { getClearButtonProps } = useComboboxContext();
    const clearButtonProps = getClearButtonProps(props);

    return (
      <button {...clearButtonProps} ref={ref}>
        {children || '✕'}
      </button>
    );
  }
);

ComboboxClearButton.displayName = 'ComboboxClearButton';

// Listbox interface and component
export interface ComboboxListboxProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'ref'> {
  children?: React.ReactNode;
}

export const ComboboxListbox = forwardRef<HTMLUListElement, ComboboxListboxProps>(
  ({ children, ...props }, ref) => {
    const { getListboxProps } = useComboboxContext();
    const listboxProps = getListboxProps(props);

    return <ul {...listboxProps} ref={ref}>{children}</ul>;
  }
);

ComboboxListbox.displayName = 'ComboboxListbox';

// Option interface and component
export interface ComboboxOptionProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'ref'> {
  option: ComboboxOptionType;
  children?: React.ReactNode;
}

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  ({ option, children, ...props }, ref) => {
    const { getOptionProps } = useComboboxContext();
    const optionProps = getOptionProps(option, props);

    return <li {...optionProps} ref={ref}>{children || option.label}</li>;
  }
);

ComboboxOption.displayName = 'ComboboxOption';

// Group interface and component
export interface ComboboxGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'> {
  label: string;
  children?: React.ReactNode;
}

export const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ label, children, ...props }, ref) => {
    const { getGroupProps } = useComboboxContext();
    const groupProps = getGroupProps(label, props);

    return (
      <div {...groupProps} ref={ref}>
        <div role="group" aria-label={label}>
          {label}
        </div>
        {children}
      </div>
    );
  }
);

ComboboxGroup.displayName = 'ComboboxGroup';

// Empty state interface and component
export interface ComboboxEmptyProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'> {
  children?: React.ReactNode;
}

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ children, ...props }, ref) => {
    const { filteredOptions } = useComboboxContext();

    if (filteredOptions.length > 0) return null;

    return (
      <div {...props} ref={ref}>
        {children || 'No options found'}
      </div>
    );
  }
);

ComboboxEmpty.displayName = 'ComboboxEmpty';

// Create the Combobox component with all its subcomponents
export const ComboboxHeadless = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  ToggleButton: ComboboxToggleButton,
  ClearButton: ComboboxClearButton,
  Listbox: ComboboxListbox,
  Option: ComboboxOption,
  Group: ComboboxGroup,
  Empty: ComboboxEmpty,
});

export default ComboboxHeadless;
