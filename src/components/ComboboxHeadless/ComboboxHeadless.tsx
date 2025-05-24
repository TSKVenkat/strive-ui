import React, { createContext, useContext, forwardRef } from 'react';
import { useCombobox, UseComboboxReturn, ComboboxOption } from './useCombobox';

// Define the props for the Combobox component
export interface ComboboxProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Options for the combobox
   */
  options: ComboboxOption[];
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
  onChange?: (value: string, option: ComboboxOption | null) => void;
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
  filterFunction?: (option: ComboboxOption, inputValue: string) => boolean;
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
  onHighlight?: (option: ComboboxOption | null) => void;
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
    const comboboxProps = combobox.getComboboxProps({ ...props, ref });

    return (
      <ComboboxContext.Provider value={combobox}>
        <div {...comboboxProps}>
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

// Input component
export interface ComboboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  (props, ref) => {
    const { getInputProps } = useComboboxContext();
    const inputProps = getInputProps({ ...props, ref });

    return <input {...inputProps} />;
  }
);

ComboboxInput.displayName = 'Combobox.Input';

// Toggle button component
export interface ComboboxToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const ComboboxToggleButton = forwardRef<HTMLButtonElement, ComboboxToggleButtonProps>(
  ({ children, ...props }, ref) => {
    const { getToggleButtonProps, isOpen } = useComboboxContext();
    const toggleButtonProps = getToggleButtonProps({ ...props, ref });

    return (
      <button {...toggleButtonProps}>
        {children || (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        )}
      </button>
    );
  }
);

ComboboxToggleButton.displayName = 'Combobox.ToggleButton';

// Clear button component
export interface ComboboxClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const ComboboxClearButton = forwardRef<HTMLButtonElement, ComboboxClearButtonProps>(
  ({ children, ...props }, ref) => {
    const { getClearButtonProps } = useComboboxContext();
    const clearButtonProps = getClearButtonProps({ ...props, ref });

    return (
      <button {...clearButtonProps}>
        {children || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        )}
      </button>
    );
  }
);

ComboboxClearButton.displayName = 'Combobox.ClearButton';

// Listbox component
export interface ComboboxListboxProps extends React.HTMLAttributes<HTMLUListElement> {
  children?: React.ReactNode;
}

export const ComboboxListbox = forwardRef<HTMLUListElement, ComboboxListboxProps>(
  ({ children, ...props }, ref) => {
    const { getListboxProps } = useComboboxContext();
    const listboxProps = getListboxProps({ ...props, ref });

    return <ul {...listboxProps}>{children}</ul>;
  }
);

ComboboxListbox.displayName = 'Combobox.Listbox';

// Option component
export interface ComboboxOptionProps extends React.LiHTMLAttributes<HTMLLIElement> {
  option: ComboboxOption;
  children?: React.ReactNode;
}

export const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  ({ option, children, ...props }, ref) => {
    const { getOptionProps } = useComboboxContext();
    const optionProps = getOptionProps(option, { ...props, ref });

    return <li {...optionProps}>{children || option.label}</li>;
  }
);

ComboboxOption.displayName = 'Combobox.Option';

// Group component
export interface ComboboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  children?: React.ReactNode;
}

export const ComboboxGroup = forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ label, children, ...props }, ref) => {
    const { getGroupProps } = useComboboxContext();
    const groupProps = getGroupProps(label, { ...props, ref });

    return (
      <div {...groupProps}>
        <div role="presentation">{label}</div>
        {children}
      </div>
    );
  }
);

ComboboxGroup.displayName = 'Combobox.Group';

// Empty component
export interface ComboboxEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ComboboxEmpty = forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ children, ...props }, ref) => {
    const { filteredOptions } = useComboboxContext();

    if (filteredOptions.length > 0) {
      return null;
    }

    return (
      <div role="presentation" {...props} ref={ref}>
        {children || 'No options found'}
      </div>
    );
  }
);

ComboboxEmpty.displayName = 'Combobox.Empty';

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
