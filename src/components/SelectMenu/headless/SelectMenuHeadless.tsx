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
    throw new globalThis.Error('useSelectMenuContext must be used within a SelectMenuHeadless.Root component');
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
const ContainerComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { getContainerProps } = useSelectMenuContext();
  
  const { ref: _, ...containerProps } = getContainerProps();
  
  return (
    <Component 
      {...containerProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

ContainerComponent.displayName = 'SelectMenuHeadless.Container';

const Container = ContainerComponent as <C extends React.ElementType = 'div'>(
  props: ContainerProps<C>
) => React.ReactElement | null;

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
const TriggerComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'button', children, ...restProps } = props;
  const { getTriggerProps, getDisplayValue } = useSelectMenuContext();
  
  const { ref: _, ...triggerProps } = getTriggerProps();
  
  return (
    <Component 
      {...triggerProps} 
      {...restProps} 
      ref={ref}
    >
      {children || getDisplayValue()}
    </Component>
  );
});

TriggerComponent.displayName = 'SelectMenuHeadless.Trigger';

const Trigger = TriggerComponent as <C extends React.ElementType = 'button'>(
  props: TriggerProps<C>
) => React.ReactElement | null;

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
const MenuComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { getMenuProps, isOpen } = useSelectMenuContext();
  
  if (!isOpen) {
    return null;
  }
  
  const menuProps = getMenuProps();
  
  return (
    <Component 
      {...menuProps} 
      {...restProps} 
      ref={ref}
      style={{ 
        ...menuProps.style,
        ...restProps.style,
      }}
    >
      {children}
    </Component>
  );
});

MenuComponent.displayName = 'SelectMenuHeadless.Menu';

const Menu = MenuComponent as <C extends React.ElementType = 'div'>(
  props: MenuProps<C>
) => React.ReactElement | null;

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
const SearchComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'input', placeholder, ...restProps } = props;
  const { getSearchInputProps } = useSelectMenuContext();
  
  const { ref: _, ...searchProps } = getSearchInputProps();
  
  return (
    <Component 
      type="text"
      {...searchProps} 
      placeholder={placeholder || searchProps.placeholder}
      {...restProps} 
      ref={ref}
      onClick={(e: React.MouseEvent) => {
        // Prevent closing the select menu when clicking the search input
        e.stopPropagation();
        if (restProps.onClick) {
          restProps.onClick(e);
        }
      }}
    />
  );
});

SearchComponent.displayName = 'SelectMenuHeadless.Search';

const Search = SearchComponent as <C extends React.ElementType = 'input'>(
  props: SearchProps<C>
) => React.ReactElement | null;

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
const OptionComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', option, index, children, ...restProps } = props;
  const { getOptionProps, value, highlightedIndex } = useSelectMenuContext();
  
  const optionProps = getOptionProps(option, index);
  const isSelected = Array.isArray(value) 
    ? value.includes(option.value) 
    : value === option.value;
  const isHighlighted = index === highlightedIndex;
  
  return (
    <Component 
      {...optionProps} 
      {...restProps} 
      ref={ref}
      data-highlighted={isHighlighted}
      data-selected={isSelected}
      style={{ 
        cursor: option.disabled ? 'not-allowed' : 'pointer',
        opacity: option.disabled ? 0.5 : 1,
        ...restProps.style,
      }}
    >
      {children || option.label}
    </Component>
  );
});

OptionComponent.displayName = 'SelectMenuHeadless.Option';

const Option = OptionComponent as <C extends React.ElementType = 'div'>(
  props: OptionProps<C>
) => React.ReactElement | null;

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
const GroupComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', name, children, ...restProps } = props;
  const { getGroupProps } = useSelectMenuContext();
  
  const groupProps = getGroupProps(name);
  
  return (
    <Component 
      {...groupProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

GroupComponent.displayName = 'SelectMenuHeadless.Group';

const Group = GroupComponent as <C extends React.ElementType = 'div'>(
  props: GroupProps<C>
) => React.ReactElement | null;

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
const GroupLabelComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', name, children, ...restProps } = props;
  const { getGroupLabelProps } = useSelectMenuContext();
  
  const groupLabelProps = getGroupLabelProps(name);
  
  return (
    <Component 
      {...groupLabelProps} 
      {...restProps} 
      ref={ref}
    >
      {children || name}
    </Component>
  );
});

GroupLabelComponent.displayName = 'SelectMenuHeadless.GroupLabel';

const GroupLabel = GroupLabelComponent as <C extends React.ElementType = 'div'>(
  props: GroupLabelProps<C>
) => React.ReactElement | null;

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
const SelectAllComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { getSelectAllProps } = useSelectMenuContext();
  
  const selectAllProps = getSelectAllProps();
  
  return (
    <Component 
      {...selectAllProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Select All'}
    </Component>
  );
});

SelectAllComponent.displayName = 'SelectMenuHeadless.SelectAll';

const SelectAll = SelectAllComponent as <C extends React.ElementType = 'div'>(
  props: SelectAllProps<C>
) => React.ReactElement | null;

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
const ClearButtonComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'button', children, ...restProps } = props;
  const { getClearButtonProps } = useSelectMenuContext();
  
  const clearButtonProps = getClearButtonProps();
  
  return (
    <Component 
      {...clearButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || '×'}
    </Component>
  );
});

ClearButtonComponent.displayName = 'SelectMenuHeadless.ClearButton';

const ClearButton = ClearButtonComponent as <C extends React.ElementType = 'button'>(
  props: ClearButtonProps<C>
) => React.ReactElement | null;

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
const CreateOptionComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { createNewOption, searchValue, filteredOptions } = useSelectMenuContext();
  
  // Only show if we have a search value and no matching options
  if (!searchValue || filteredOptions.length > 0) {
    return null;
  }
  
  return (
    <Component 
      role="option"
      onClick={() => createNewOption()}
      {...restProps} 
      ref={ref}
      style={{ 
        cursor: 'pointer',
        ...restProps.style,
      }}
    >
      {children || `Create "${searchValue}"`}
    </Component>
  );
});

CreateOptionComponent.displayName = 'SelectMenuHeadless.CreateOption';

const CreateOption = CreateOptionComponent as <C extends React.ElementType = 'div'>(
  props: CreateOptionProps<C>
) => React.ReactElement | null;

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
const NoOptionsComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, noOptionsText = 'No options available', noResultsText = 'No results found', ...restProps } = props;
  const { filteredOptions, searchValue } = useSelectMenuContext();
  
  // Only show if we have no options
  if (filteredOptions.length > 0) {
    return null;
  }
  
  return (
    <Component 
      role="presentation"
      {...restProps} 
      ref={ref}
    >
      {children || (searchValue ? noResultsText : noOptionsText)}
    </Component>
  );
});

NoOptionsComponent.displayName = 'SelectMenuHeadless.NoOptions';

const NoOptions = NoOptionsComponent as <C extends React.ElementType = 'div'>(
  props: NoOptionsProps<C>
) => React.ReactElement | null;

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
const LoadingComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { loading } = useSelectMenuContext();
  
  // Only show if loading
  if (!loading) {
    return null;
  }
  
  return (
    <Component 
      role="presentation"
      {...restProps} 
      ref={ref}
    >
      {children || 'Loading...'}
    </Component>
  );
});

LoadingComponent.displayName = 'SelectMenuHeadless.Loading';

const Loading = LoadingComponent as <C extends React.ElementType = 'div'>(
  props: LoadingProps<C>
) => React.ReactElement | null;

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
const ErrorComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { hasError, error } = useSelectMenuContext();
  
  // Only show if there's an error
  if (!hasError) {
    return null;
  }
  
  return (
    <Component 
      role="alert"
      {...restProps} 
      ref={ref}
    >
      {children || error}
    </Component>
  );
});

ErrorComponent.displayName = 'SelectMenuHeadless.Error';

const SelectError = ErrorComponent as <C extends React.ElementType = 'div'>(
  props: ErrorProps<C>
) => React.ReactElement | null;

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
const ValueComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { getDisplayValue } = useSelectMenuContext();
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children || getDisplayValue()}
    </Component>
  );
});

ValueComponent.displayName = 'SelectMenuHeadless.Value';

const Value = ValueComponent as <C extends React.ElementType = 'div'>(
  props: ValueProps<C>
) => React.ReactElement | null;

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
  Error: SelectError,
  Value,
  useSelectMenuContext,
};

export default SelectMenuHeadless;
