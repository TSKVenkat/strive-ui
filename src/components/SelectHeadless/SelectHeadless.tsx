import React, { forwardRef, createContext, useContext } from 'react';
import { useSelect, UseSelectProps, UseSelectReturn } from './useSelect';
import type { SelectOption, SelectGroup } from './useSelect';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the SelectHeadless component
 */
export type SelectHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseSelectProps & {
    /** Children to render inside the component */
    children?: React.ReactNode;
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SelectTrigger component
 */
export type SelectTriggerProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the trigger */
    children?: React.ReactNode | ((props: {
      selectedOption: SelectOption | null;
      isOpen: boolean;
      placeholder: string;
    }) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SelectDropdown component
 */
export type SelectDropdownProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the dropdown */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SelectSearch component
 */
export type SelectSearchProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Placeholder for the search input */
    placeholder?: string;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SelectOption component
 */
export type SelectOptionProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The option data */
    option: SelectOption;
    /** Children to render inside the option */
    children?: React.ReactNode | ((props: {
      option: SelectOption;
      isSelected: boolean;
      isHighlighted: boolean;
      isDisabled: boolean;
    }) => React.ReactNode);
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SelectGroup component
 */
export type SelectGroupProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The group label */
    label: string;
    /** The group name (key) */
    name: string;
    /** Children to render inside the group */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SelectClearButton component
 */
export type SelectClearButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
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

/**
 * Props for the SelectLabel component
 */
export type SelectLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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

// Create a context to share the select state
interface SelectContextValue extends UseSelectReturn {}

const SelectContext = createContext<SelectContextValue | null>(null);

// Custom hook to use the select context
const useSelectContext = () => {
  const context = useContext<SelectContextValue | null>(SelectContext);
  if (!context) {
    throw new Error('Select compound components must be used within a SelectHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type SelectHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SelectHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SelectTriggerComponent = <C extends React.ElementType = 'button'>(
  props: SelectTriggerProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SelectDropdownComponent = <C extends React.ElementType = 'div'>(
  props: SelectDropdownProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

type SelectSearchComponent = <C extends React.ElementType = 'input'>(
  props: SelectSearchProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SelectOptionComponent = <C extends React.ElementType = 'div'>(
  props: SelectOptionProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SelectGroupComponent = <C extends React.ElementType = 'div'>(
  props: SelectGroupProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SelectClearButtonComponent = <C extends React.ElementType = 'button'>(
  props: SelectClearButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SelectLabelComponent = <C extends React.ElementType = 'label'>(
  props: SelectLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Select component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled select implementations.
 */
export const SelectHeadless = forwardRef(function SelectHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SelectHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const selectState = useSelect(props);

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <SelectContext.Provider value={selectState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
      >
        {children}
      </ElementType>
    </SelectContext.Provider>
  );
}) as unknown as SelectHeadlessComponent;

/**
 * The trigger button for the select dropdown.
 */
export const SelectTrigger = forwardRef(function SelectTrigger<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SelectTriggerProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const selectContext = useSelectContext();
  const { 
    getTriggerProps, 
    selectedOption, 
    isOpen,
  } = selectContext;
  
  const placeholder = 'Select an option';
  
  // Get props for the trigger
  const triggerProps = getTriggerProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      {...triggerProps}
      ref={ref}
    >
      {typeof children === 'function' 
        ? children({ selectedOption, isOpen, placeholder }) 
        : children || (selectedOption?.label || placeholder)}
    </ElementType>
  );
}) as unknown as SelectTriggerComponent;

/**
 * The dropdown container for the select options.
 */
export const SelectDropdown = forwardRef(function SelectDropdown<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SelectDropdownProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getDropdownProps, isOpen } = useSelectContext();
  
  // Don't render if not open
  if (!isOpen) {
    return null;
  }
  
  // Get props for the dropdown
  const dropdownProps = getDropdownProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...dropdownProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as SelectDropdownComponent;

/**
 * The search input for filtering options.
 */
export const SelectSearch = forwardRef(function SelectSearch<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    placeholder: propPlaceholder = 'Search...' as any,
    ...props 
  }: Omit<SelectSearchProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getSearchInputProps } = useSelectContext();
  
  // Get props for the search input
  const searchInputProps = getSearchInputProps({
    className,
    style,
    placeholder: propPlaceholder,
    ...props,
  } as any);

  // Use the 'as' prop or default to 'input'
  const ElementType: React.ElementType = as || 'input';

  return (
    <ElementType
      {...searchInputProps}
      ref={ref}
    />
  );
}) as unknown as SelectSearchComponent;

/**
 * An option in the select dropdown.
 */
export const SelectOption = forwardRef(function SelectOption<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    option,
    ...props 
  }: Omit<SelectOptionProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { 
    getOptionProps, 
    value, 
    highlightedIndex,
    filteredOptions,
  } = useSelectContext();
  
  // Find the index of this option in the filtered options
  const index = filteredOptions.findIndex(opt => opt.value === option.value);
  
  // Get props for the option
  const optionProps = getOptionProps(option, index, {
    className,
    style,
    ...props,
  });
  
  const isSelected = option.value === value;
  const isHighlighted = index === highlightedIndex;
  const isDisabled = !!option.disabled;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...optionProps}
      ref={ref}
    >
      {typeof children === 'function' 
        ? children({ option, isSelected, isHighlighted, isDisabled }) 
        : children || option.label}
    </ElementType>
  );
}) as unknown as SelectOptionComponent;

/**
 * A group of options in the select dropdown.
 */
export const SelectGroup = forwardRef(function SelectGroup<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    name,
    ...props 
  }: Omit<SelectGroupProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="group"
      aria-labelledby={`select-group-${name}`}
      {...props}
    >
      <div id={`select-group-${name}`} role="presentation">{label}</div>
      {children}
    </ElementType>
  );
}) as unknown as SelectGroupComponent;

/**
 * A button to clear the current selection.
 */
export const SelectClearButton = forwardRef(function SelectClearButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SelectClearButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getClearButtonProps, selectedOption } = useSelectContext();
  
  // Don't render if no option is selected
  if (!selectedOption) {
    return null;
  }
  
  // Get props for the clear button
  const clearButtonProps = getClearButtonProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      {...clearButtonProps}
      ref={ref}
    >
      {children || (
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </ElementType>
  );
}) as unknown as SelectClearButtonComponent;

/**
 * A label for the select.
 */
export const SelectLabel = forwardRef(function SelectLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SelectLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { id } = useSelectContext();
  
  // Use the 'as' prop or default to 'label'
  const ElementType: React.ElementType = as || 'label';

  return (
    <ElementType
      ref={ref}
      id={`${id}-label`}
      htmlFor={id}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as SelectLabelComponent;

// Add displayNames for better debugging
(SelectHeadless as any).displayName = 'SelectHeadless';
(SelectTrigger as any).displayName = 'SelectTrigger';
(SelectDropdown as any).displayName = 'SelectDropdown';
(SelectSearch as any).displayName = 'SelectSearch';
(SelectOption as any).displayName = 'SelectOption';
(SelectGroup as any).displayName = 'SelectGroup';
(SelectClearButton as any).displayName = 'SelectClearButton';
(SelectLabel as any).displayName = 'SelectLabel';

// Create a compound component
export const Select = Object.assign(SelectHeadless, {
  Trigger: SelectTrigger,
  Dropdown: SelectDropdown,
  Search: SelectSearch,
  Option: SelectOption,
  Group: SelectGroup,
  ClearButton: SelectClearButton,
  Label: SelectLabel,
});

export default Select;
