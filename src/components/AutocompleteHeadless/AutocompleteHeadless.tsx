import React, { createContext, useContext, forwardRef } from 'react';
import { useAutocomplete, UseAutocompleteReturn, AutocompleteOption } from './useAutocomplete';

// Define the props for the Autocomplete component
export interface AutocompleteProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Array of options to select from
   */
  options: AutocompleteOption[];
  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Controlled selected value
   */
  value?: string;
  /**
   * Default input value (uncontrolled)
   */
  defaultInputValue?: string;
  /**
   * Controlled input value
   */
  inputValue?: string;
  /**
   * Callback when selection changes
   */
  onChange?: (value: string) => void;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Whether the autocomplete is disabled
   */
  disabled?: boolean;
  /**
   * Whether the autocomplete is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the autocomplete is required
   */
  required?: boolean;
  /**
   * ID for the autocomplete element
   */
  id?: string;
  /**
   * Name attribute for the autocomplete
   */
  name?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Whether to allow custom values not in the options
   */
  allowCustomValue?: boolean;
  /**
   * Whether to open the dropdown when the input is focused
   */
  openOnFocus?: boolean;
  /**
   * Whether to clear the input value when an option is selected
   */
  clearOnSelect?: boolean;
  /**
   * Whether to select all text when the input is focused
   */
  selectOnFocus?: boolean;
  /**
   * Whether to filter options based on input value
   */
  filterOptions?: boolean;
  /**
   * Custom filter function
   */
  filterFunction?: (option: AutocompleteOption, inputValue: string) => boolean;
  /**
   * Minimum number of characters to start showing suggestions
   */
  minChars?: number;
  /**
   * Maximum number of suggestions to show
   */
  maxSuggestions?: number;
  /**
   * Debounce time in milliseconds for input changes
   */
  debounceTime?: number;
  /**
   * Whether to auto-select the first option
   */
  autoSelectFirst?: boolean;
  /**
   * Callback when dropdown opens
   */
  onOpen?: () => void;
  /**
   * Callback when dropdown closes
   */
  onClose?: () => void;
  /**
   * Callback when an option is highlighted
   */
  onHighlight?: (option: AutocompleteOption | null) => void;
  /**
   * Callback when the input is focused
   */
  onFocus?: (event: React.FocusEvent) => void;
  /**
   * Callback when the input is blurred
   */
  onBlur?: (event: React.FocusEvent) => void;
  /**
   * Callback to load options asynchronously
   */
  loadOptions?: (inputValue: string) => Promise<AutocompleteOption[]>;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the Autocomplete
export interface AutocompleteContextValue extends UseAutocompleteReturn {}

const AutocompleteContext = createContext<AutocompleteContextValue | undefined>(undefined);

// Hook to use the Autocomplete context
export function useAutocompleteContext() {
  const context = useContext(AutocompleteContext);
  if (!context) {
    throw new Error('useAutocompleteContext must be used within an AutocompleteProvider');
  }
  return context;
}

// Root component
export const AutocompleteRoot = forwardRef<HTMLDivElement, AutocompleteProps>(
  (
    {
      options,
      defaultValue,
      value,
      defaultInputValue,
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
      minChars,
      maxSuggestions,
      debounceTime,
      autoSelectFirst,
      onOpen,
      onClose,
      onHighlight,
      onFocus,
      onBlur,
      loadOptions,
      children,
      ...props
    },
    ref
  ) => {
    // Use the autocomplete hook
    const autocomplete = useAutocomplete({
      options,
      defaultValue,
      value,
      defaultInputValue,
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
      minChars,
      maxSuggestions,
      debounceTime,
      autoSelectFirst,
      onOpen,
      onClose,
      onHighlight,
      onFocus,
      onBlur,
      loadOptions,
    });

    return (
      <AutocompleteContext.Provider value={autocomplete}>
        <div {...props} ref={ref}>
          {children || (
            <>
              <AutocompleteInput />
              <AutocompleteClearButton />
              <AutocompleteDropdown>
                {autocomplete.loading ? (
                  <AutocompleteLoading />
                ) : autocomplete.filteredOptions.length === 0 ? (
                  <AutocompleteEmpty />
                ) : (
                  <AutocompleteOptions>
                    {autocomplete.filteredOptions.map((option) => (
                      <AutocompleteOption key={option.value} option={option}>
                        {option.label}
                      </AutocompleteOption>
                    ))}
                  </AutocompleteOptions>
                )}
              </AutocompleteDropdown>
            </>
          )}
        </div>
      </AutocompleteContext.Provider>
    );
  }
);

AutocompleteRoot.displayName = 'Autocomplete';

// Input component
export interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  (props, ref) => {
    const { getInputProps } = useAutocompleteContext();
    const inputProps = getInputProps({ ...props, ref });

    return <input {...inputProps} />;
  }
);

AutocompleteInput.displayName = 'Autocomplete.Input';

// Dropdown component
export interface AutocompleteDropdownProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AutocompleteDropdown = forwardRef<HTMLDivElement, AutocompleteDropdownProps>(
  (props, ref) => {
    const { getDropdownProps, isOpen } = useAutocompleteContext();
    const dropdownProps = getDropdownProps({ ...props, ref });

    if (!isOpen) {
      return null;
    }

    return <div {...dropdownProps} />;
  }
);

AutocompleteDropdown.displayName = 'Autocomplete.Dropdown';

// Options component
export interface AutocompleteOptionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AutocompleteOptions = forwardRef<HTMLDivElement, AutocompleteOptionsProps>(
  (props, ref) => {
    return <div role="group" {...props} ref={ref} />;
  }
);

AutocompleteOptions.displayName = 'Autocomplete.Options';

// Option component
export interface AutocompleteOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  option: AutocompleteOption;
}

export const AutocompleteOption = forwardRef<HTMLDivElement, AutocompleteOptionProps>(
  ({ option, children, ...props }, ref) => {
    const { getOptionProps } = useAutocompleteContext();
    const optionProps = getOptionProps(option, { ...props, ref });

    return <div {...optionProps}>{children}</div>;
  }
);

AutocompleteOption.displayName = 'Autocomplete.Option';

// Clear button component
export interface AutocompleteClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const AutocompleteClearButton = forwardRef<HTMLButtonElement, AutocompleteClearButtonProps>(
  (props, ref) => {
    const { getClearButtonProps, selectedValue } = useAutocompleteContext();
    const clearButtonProps = getClearButtonProps({ ...props, ref });

    if (!selectedValue) {
      return null;
    }

    return (
      <button {...clearButtonProps}>
        {props.children || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        )}
      </button>
    );
  }
);

AutocompleteClearButton.displayName = 'Autocomplete.ClearButton';

// Loading component
export interface AutocompleteLoadingProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AutocompleteLoading = forwardRef<HTMLDivElement, AutocompleteLoadingProps>(
  (props, ref) => {
    return (
      <div role="status" {...props} ref={ref}>
        {props.children || 'Loading...'}
      </div>
    );
  }
);

AutocompleteLoading.displayName = 'Autocomplete.Loading';

// Empty component
export interface AutocompleteEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AutocompleteEmpty = forwardRef<HTMLDivElement, AutocompleteEmptyProps>(
  (props, ref) => {
    return (
      <div {...props} ref={ref}>
        {props.children || 'No results found'}
      </div>
    );
  }
);

AutocompleteEmpty.displayName = 'Autocomplete.Empty';

// Create the Autocomplete component with all its subcomponents
export const AutocompleteHeadless = Object.assign(AutocompleteRoot, {
  Input: AutocompleteInput,
  Dropdown: AutocompleteDropdown,
  Options: AutocompleteOptions,
  Option: AutocompleteOption,
  ClearButton: AutocompleteClearButton,
  Loading: AutocompleteLoading,
  Empty: AutocompleteEmpty,
});

export default AutocompleteHeadless;
