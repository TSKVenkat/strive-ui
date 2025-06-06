import React, { createContext, useContext, forwardRef } from 'react';
import { useMultiSelect, UseMultiSelectReturn, SelectOption } from './useMultiSelect';

// Define the props for the MultiSelect component
export interface MultiSelectProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Array of options to select from
   */
  options: SelectOption[];
  /**
   * Default selected values (uncontrolled)
   */
  defaultValue?: string[];
  /**
   * Controlled selected values
   */
  value?: string[];
  /**
   * Callback when selection changes
   */
  onChange?: (value: string[]) => void;
  /**
   * Whether the select is disabled
   */
  disabled?: boolean;
  /**
   * Whether the select is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the select is required
   */
  required?: boolean;
  /**
   * ID for the select element
   */
  id?: string;
  /**
   * Name attribute for the select
   */
  name?: string;
  /**
   * Placeholder text when no option is selected
   */
  placeholder?: string;
  /**
   * Whether to close the dropdown when an option is selected
   */
  closeOnSelect?: boolean;
  /**
   * Whether to filter options based on input value
   */
  filterOptions?: boolean;
  /**
   * Custom filter function
   */
  filterFunction?: (option: SelectOption, inputValue: string) => boolean;
  /**
   * Maximum number of items that can be selected
   */
  maxSelectedItems?: number;
  /**
   * Whether to show a search input
   */
  searchable?: boolean;
  /**
   * Default input value for search (uncontrolled)
   */
  defaultInputValue?: string;
  /**
   * Controlled input value for search
   */
  inputValue?: string;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
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
  onHighlight?: (option: SelectOption | null) => void;
  /**
   * Callback when the select is focused
   */
  onFocus?: (event: React.FocusEvent) => void;
  /**
   * Callback when the select is blurred
   */
  onBlur?: (event: React.FocusEvent) => void;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the MultiSelect
export interface MultiSelectContextValue extends UseMultiSelectReturn {}

const MultiSelectContext = createContext<MultiSelectContextValue | undefined>(undefined);

// Hook to use the MultiSelect context
export function useMultiSelectContext() {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error('useMultiSelectContext must be used within a MultiSelectProvider');
  }
  return context;
}

// Root component
export const MultiSelectRoot = forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      defaultValue,
      value,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      placeholder,
      closeOnSelect,
      filterOptions,
      filterFunction,
      maxSelectedItems,
      searchable,
      defaultInputValue,
      inputValue,
      onInputChange,
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
    // Use the multi-select hook
    const multiSelect = useMultiSelect({
      options,
      defaultValue,
      value,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      placeholder,
      closeOnSelect,
      filterOptions,
      filterFunction,
      maxSelectedItems,
      searchable,
      defaultInputValue,
      inputValue,
      onInputChange,
      onOpen,
      onClose,
      onHighlight,
      onFocus,
      onBlur,
    });

    return (
      <MultiSelectContext.Provider value={multiSelect}>
        <div {...props} ref={ref}>
          {children || (
            <>
              <MultiSelectTrigger />
              <MultiSelectDropdown>
                {searchable && <MultiSelectInput />}
                <MultiSelectOptions>
                  {multiSelect.filteredOptions.map((option) => (
                    <MultiSelectOption key={option.value} option={option}>
                      {option.label}
                    </MultiSelectOption>
                  ))}
                </MultiSelectOptions>
              </MultiSelectDropdown>
            </>
          )}
        </div>
      </MultiSelectContext.Provider>
    );
  }
);

MultiSelectRoot.displayName = 'MultiSelect';

// Trigger component
export interface MultiSelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const MultiSelectTrigger = forwardRef<HTMLButtonElement, MultiSelectTriggerProps>(
  (props, ref) => {
    const { getTriggerProps, selectedOptions, placeholder } = useMultiSelectContext();
    const triggerProps = getTriggerProps(props as any);

    return (
      <button {...triggerProps} ref={ref}>
        {selectedOptions.length > 0 ? (
          <MultiSelectSelectedItems>
            {selectedOptions.map((option) => (
              <MultiSelectSelectedItem key={option.value} option={option}>
                {option.label}
                <MultiSelectSelectedItemRemove option={option} />
              </MultiSelectSelectedItem>
            ))}
          </MultiSelectSelectedItems>
        ) : (
          <span>{placeholder}</span>
        )}
      </button>
    );
  }
);

MultiSelectTrigger.displayName = 'MultiSelect.Trigger';

// Dropdown component
export interface MultiSelectDropdownProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MultiSelectDropdown = forwardRef<HTMLDivElement, MultiSelectDropdownProps>(
  (props, ref) => {
    const { getDropdownProps, isOpen } = useMultiSelectContext();
    const dropdownProps = getDropdownProps(props as any);

    if (!isOpen) {
      return null;
    }

    return <div {...dropdownProps} ref={ref} />;
  }
);

MultiSelectDropdown.displayName = 'MultiSelect.Dropdown';

// Options component
export interface MultiSelectOptionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MultiSelectOptions = forwardRef<HTMLDivElement, MultiSelectOptionsProps>(
  (props, ref) => {
    return <div role="group" {...props} ref={ref} />;
  }
);

MultiSelectOptions.displayName = 'MultiSelect.Options';

// Option component
export interface MultiSelectOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  option: SelectOption;
}

export const MultiSelectOption = forwardRef<HTMLDivElement, MultiSelectOptionProps>(
  ({ option, children, ...props }, ref) => {
    const { getOptionProps } = useMultiSelectContext();
    const { ref: _, ...optionProps } = getOptionProps(option, props);

    return <div {...optionProps} ref={ref}>{children}</div>;
  }
);

MultiSelectOption.displayName = 'MultiSelect.Option';

// Input component
export interface MultiSelectInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const MultiSelectInput = forwardRef<HTMLInputElement, MultiSelectInputProps>(
  (props, ref) => {
    const { getInputProps } = useMultiSelectContext();
    const { ref: _, ...inputProps } = getInputProps(props);

    return <input {...inputProps} ref={ref} />;
  }
);

MultiSelectInput.displayName = 'MultiSelect.Input';

// Clear button component
export interface MultiSelectClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const MultiSelectClearButton = forwardRef<HTMLButtonElement, MultiSelectClearButtonProps>(
  (props, ref) => {
    const { getClearButtonProps } = useMultiSelectContext();
    const clearButtonProps = getClearButtonProps(props);

    return (
      <button {...clearButtonProps} ref={ref}>
        {props.children || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        )}
      </button>
    );
  }
);

MultiSelectClearButton.displayName = 'MultiSelect.ClearButton';

// Selected items component
export interface MultiSelectSelectedItemsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MultiSelectSelectedItems = forwardRef<HTMLDivElement, MultiSelectSelectedItemsProps>(
  (props, ref) => {
    return <div role="list" {...props} ref={ref} />;
  }
);

MultiSelectSelectedItems.displayName = 'MultiSelect.SelectedItems';

// Selected item component
export interface MultiSelectSelectedItemProps extends React.HTMLAttributes<HTMLDivElement> {
  option: SelectOption;
}

export const MultiSelectSelectedItem = forwardRef<HTMLDivElement, MultiSelectSelectedItemProps>(
  ({ option, children, ...props }, ref) => {
    const { getSelectedItemProps } = useMultiSelectContext();
    const selectedItemProps = getSelectedItemProps(option, props);

    return <div {...selectedItemProps} ref={ref}>{children}</div>;
  }
);

MultiSelectSelectedItem.displayName = 'MultiSelect.SelectedItem';

// Selected item remove component
export interface MultiSelectSelectedItemRemoveProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  option: SelectOption;
}

export const MultiSelectSelectedItemRemove = forwardRef<
  HTMLButtonElement,
  MultiSelectSelectedItemRemoveProps
>(({ option, children, ...props }, ref) => {
  const { getSelectedItemRemoveProps } = useMultiSelectContext();
  const selectedItemRemoveProps = getSelectedItemRemoveProps(option, props);

  return (
    <button {...selectedItemRemoveProps} ref={ref}>
      {children || (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      )}
    </button>
  );
});

MultiSelectSelectedItemRemove.displayName = 'MultiSelect.SelectedItemRemove';

// Create the MultiSelect component with all its subcomponents
export const MultiSelectHeadless = Object.assign(MultiSelectRoot, {
  Trigger: MultiSelectTrigger,
  Dropdown: MultiSelectDropdown,
  Options: MultiSelectOptions,
  Option: MultiSelectOption,
  Input: MultiSelectInput,
  ClearButton: MultiSelectClearButton,
  SelectedItems: MultiSelectSelectedItems,
  SelectedItem: MultiSelectSelectedItem,
  SelectedItemRemove: MultiSelectSelectedItemRemove,
});

// Ensure the default export has correct typing that includes options property
const MultiSelectWithCorrectTypes = MultiSelectHeadless as React.ForwardRefExoticComponent<
  MultiSelectProps & React.RefAttributes<HTMLDivElement>
>;

export default MultiSelectWithCorrectTypes;
