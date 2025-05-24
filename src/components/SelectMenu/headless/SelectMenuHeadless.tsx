import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelectMenu, UseSelectMenuReturn, SelectMenuOptions, SelectOption } from './useSelectMenu';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the SelectMenu component
interface SelectMenuContextValue extends UseSelectMenuReturn {}

const SelectMenuContext = createContext<SelectMenuContextValue | null>(null);

// Hook to use SelectMenu context
export function useSelectMenuContext() {
  const context = useContext(SelectMenuContext);
  if (!context) {
    throw new Error('useSelectMenuContext must be used within a SelectMenuHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends SelectMenuOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const selectMenuProps = useSelectMenu(options);
    
    return (
      <SelectMenuContext.Provider value={selectMenuProps}>
        <div ref={ref}>
          {children}
        </div>
      </SelectMenuContext.Provider>
    );
  }
);

Root.displayName = 'SelectMenuHeadless.Root';

// Container component props
export type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Container component
const Container = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContainerProps } = useSelectMenuContext();
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'SelectMenuHeadless.Container';

// Trigger component props
export type TriggerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Trigger component
const Trigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getTriggerProps, getDisplayValue } = useSelectMenuContext();
    
    const triggerProps = getTriggerProps();
    
    return (
      <Component 
        {...triggerProps} 
        {...props} 
        ref={ref}
      >
        {children || getDisplayValue()}
      </Component>
    );
  }
);

Trigger.displayName = 'SelectMenuHeadless.Trigger';

// Portal component props
export type PortalProps = {
  /**
   * Children of the component
   */
  children: React.ReactNode;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
  /**
   * Whether to use a portal
   */
  usePortal?: boolean;
};

// Portal component
const Portal: React.FC<PortalProps> = ({ 
  children, 
  portalId = 'select-menu-root',
  usePortal = true 
}) => {
  const { isOpen } = useSelectMenuContext();
  
  // Create portal container if it doesn't exist
  React.useEffect(() => {
    if (!usePortal) return;
    
    let portalElement = document.getElementById(portalId);
    
    if (!portalElement) {
      portalElement = document.createElement('div');
      portalElement.id = portalId;
      document.body.appendChild(portalElement);
    }
    
    return () => {
      // Only remove the portal element if it's empty
      if (portalElement && portalElement.childNodes.length === 0) {
        portalElement.remove();
      }
    };
  }, [portalId, usePortal]);
  
  if (!isOpen) {
    return null;
  }
  
  if (!usePortal) {
    return <>{children}</>;
  }
  
  const portalElement = document.getElementById(portalId);
  
  if (!portalElement) {
    return null;
  }
  
  return createPortal(children, portalElement);
};

Portal.displayName = 'SelectMenuHeadless.Portal';

// Menu component props
export type MenuProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Menu component
const Menu = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: MenuProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getMenuProps, isOpen } = useSelectMenuContext();
    
    if (!isOpen) {
      return null;
    }
    
    const menuProps = getMenuProps();
    
    return (
      <Component 
        {...menuProps} 
        {...props} 
        ref={ref}
        style={{ 
          ...menuProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Menu.displayName = 'SelectMenuHeadless.Menu';

// Search component props
export type SearchProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Placeholder for the search input
     */
    placeholder?: string;
  }
>;

// Search component
const Search = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, placeholder, ...props }: SearchProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getSearchInputProps } = useSelectMenuContext();
    
    const searchProps = getSearchInputProps();
    
    return (
      <Component 
        type="text"
        {...searchProps} 
        placeholder={placeholder || searchProps.placeholder}
        {...props} 
        ref={ref}
        onClick={(e: React.MouseEvent) => {
          // Prevent closing the select menu when clicking the search input
          e.stopPropagation();
          if (props.onClick) {
            props.onClick(e);
          }
        }}
      />
    );
  }
);

Search.displayName = 'SelectMenuHeadless.Search';

// Option component props
export type OptionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Option data
     */
    option: SelectOption;
    /**
     * Option index
     */
    index: number;
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Option component
const Option = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, option, index, children, ...props }: OptionProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getOptionProps, value, highlightedIndex } = useSelectMenuContext();
    
    const optionProps = getOptionProps(option, index);
    const isSelected = Array.isArray(value) 
      ? value.includes(option.value) 
      : value === option.value;
    const isHighlighted = index === highlightedIndex;
    
    return (
      <Component 
        {...optionProps} 
        {...props} 
        ref={ref}
        data-highlighted={isHighlighted}
        data-selected={isSelected}
        style={{ 
          cursor: option.disabled ? 'not-allowed' : 'pointer',
          opacity: option.disabled ? 0.5 : 1,
          ...props.style,
        }}
      >
        {children || option.label}
      </Component>
    );
  }
);

Option.displayName = 'SelectMenuHeadless.Option';

// Group component props
export type GroupProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Group name
     */
    name: string;
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Group component
const Group = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, name, children, ...props }: GroupProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getGroupProps } = useSelectMenuContext();
    
    const groupProps = getGroupProps(name);
    
    return (
      <Component 
        {...groupProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Group.displayName = 'SelectMenuHeadless.Group';

// GroupLabel component props
export type GroupLabelProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Group name
     */
    name: string;
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// GroupLabel component
const GroupLabel = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, name, children, ...props }: GroupLabelProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getGroupLabelProps } = useSelectMenuContext();
    
    const groupLabelProps = getGroupLabelProps(name);
    
    return (
      <Component 
        {...groupLabelProps} 
        {...props} 
        ref={ref}
      >
        {children || name}
      </Component>
    );
  }
);

GroupLabel.displayName = 'SelectMenuHeadless.GroupLabel';

// SelectAll component props
export type SelectAllProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// SelectAll component
const SelectAll = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: SelectAllProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getSelectAllProps } = useSelectMenuContext();
    
    const selectAllProps = getSelectAllProps();
    
    return (
      <Component 
        {...selectAllProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Select All'}
      </Component>
    );
  }
);

SelectAll.displayName = 'SelectMenuHeadless.SelectAll';

// ClearButton component props
export type ClearButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ClearButton component
const ClearButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ClearButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getClearButtonProps } = useSelectMenuContext();
    
    const clearButtonProps = getClearButtonProps();
    
    return (
      <Component 
        {...clearButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || '×'}
      </Component>
    );
  }
);

ClearButton.displayName = 'SelectMenuHeadless.ClearButton';

// CreateOption component props
export type CreateOptionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// CreateOption component
const CreateOption = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: CreateOptionProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { createNewOption, searchValue, filteredOptions } = useSelectMenuContext();
    
    // Only show if we have a search value and no matching options
    if (!searchValue || filteredOptions.length > 0) {
      return null;
    }
    
    return (
      <Component 
        role="option"
        onClick={() => createNewOption()}
        {...props} 
        ref={ref}
        style={{ 
          cursor: 'pointer',
          ...props.style,
        }}
      >
        {children || `Create "${searchValue}"`}
      </Component>
    );
  }
);

CreateOption.displayName = 'SelectMenuHeadless.CreateOption';

// NoOptions component props
export type NoOptionsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Text to display when no options are available
     */
    noOptionsText?: string;
    /**
     * Text to display when no options match the search query
     */
    noResultsText?: string;
  }
>;

// NoOptions component
const NoOptions = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, noOptionsText = 'No options available', noResultsText = 'No results found', ...props }: NoOptionsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { filteredOptions, searchValue } = useSelectMenuContext();
    
    // Only show if we have no options
    if (filteredOptions.length > 0) {
      return null;
    }
    
    return (
      <Component 
        role="presentation"
        {...props} 
        ref={ref}
      >
        {children || (searchValue ? noResultsText : noOptionsText)}
      </Component>
    );
  }
);

NoOptions.displayName = 'SelectMenuHeadless.NoOptions';

// Loading component props
export type LoadingProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Loading component
const Loading = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: LoadingProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { loading } = useSelectMenuContext();
    
    // Only show if loading
    if (!loading) {
      return null;
    }
    
    return (
      <Component 
        role="presentation"
        {...props} 
        ref={ref}
      >
        {children || 'Loading...'}
      </Component>
    );
  }
);

Loading.displayName = 'SelectMenuHeadless.Loading';

// Error component props
export type ErrorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Error component
const Error = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ErrorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { hasError, error } = useSelectMenuContext();
    
    // Only show if there's an error
    if (!hasError) {
      return null;
    }
    
    return (
      <Component 
        role="alert"
        {...props} 
        ref={ref}
      >
        {children || error}
      </Component>
    );
  }
);

Error.displayName = 'SelectMenuHeadless.Error';

// Value component props
export type ValueProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Value component
const Value = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ValueProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getDisplayValue } = useSelectMenuContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || getDisplayValue()}
      </Component>
    );
  }
);

Value.displayName = 'SelectMenuHeadless.Value';

// Export all components
export const SelectMenuHeadless = {
  Root,
  Container,
  Trigger,
  Portal,
  Menu,
  Search,
  Option,
  Group,
  GroupLabel,
  SelectAll,
  ClearButton,
  CreateOption,
  NoOptions,
  Loading,
  Error,
  Value,
  useSelectMenuContext,
};

export default SelectMenuHeadless;
