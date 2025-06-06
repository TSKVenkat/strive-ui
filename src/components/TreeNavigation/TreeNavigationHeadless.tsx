import React, { forwardRef, createContext, useContext } from 'react';
import { useTreeNavigation, UseTreeNavigationProps, TreeNode } from './useTreeNavigation';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the headless TreeNavigation component
 */
export type TreeNavigationHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  Omit<UseTreeNavigationProps, 'nodes'> & {
    /** Tree nodes to render */
    nodes: TreeNode[];
    /** Children to render inside the tree navigation */
    children: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Aria label for the tree */
    ariaLabel?: string;
  }
>;

/**
 * Props for the headless TreeItem component
 */
export type TreeItemHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The tree node data */
    node: TreeNode;
    /** Children to render inside the tree item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Level of nesting (used for indentation) */
    level?: number;
  }
>;

/**
 * Props for the headless TreeItemLabel component
 */
export type TreeItemLabelHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The tree node data */
    node: TreeNode;
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless TreeItemContent component
 */
export type TreeItemContentHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The tree node data */
    node: TreeNode;
    /** Children to render inside the content */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Level of nesting (used for indentation) */
    level?: number;
  }
>;

/**
 * Props for the headless TreeItemToggle component
 */
export type TreeItemToggleHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The tree node data */
    node: TreeNode;
    /** Children to render inside the toggle */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the headless TreeItemIcon component
 */
export type TreeItemIconHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** The tree node data */
    node: TreeNode;
    /** Children to render inside the icon */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the tree navigation state
interface TreeNavigationContextValue {
  expandedIds: string[];
  selectedIds: string[];
  toggleExpanded: (nodeId: string) => void;
  toggleSelected: (nodeId: string) => void;
  expandNode: (nodeId: string) => void;
  collapseNode: (nodeId: string) => void;
  selectNode: (nodeId: string) => void;
  deselectNode: (nodeId: string) => void;
  isExpanded: (nodeId: string) => boolean;
  isSelected: (nodeId: string) => boolean;
  getNodeProps: (node: TreeNode) => {
    role: string;
    'aria-expanded'?: boolean;
    'aria-selected': boolean;
    'aria-disabled'?: boolean;
    tabIndex: number;
    onClick: (event: React.MouseEvent) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
}

const TreeNavigationContext = createContext<TreeNavigationContextValue | null>(null);

// Custom hook to use the tree navigation context
const useTreeNavigationContext = () => {
  const context = useContext<TreeNavigationContextValue | null>(TreeNavigationContext);
  if (!context) {
    throw new Error('TreeNavigation compound components must be used within a TreeNavigationHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type TreeNavigationHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TreeNavigationHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TreeItemHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TreeItemHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TreeItemLabelHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TreeItemLabelHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TreeItemContentHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TreeItemContentHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TreeItemToggleHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TreeItemToggleHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TreeItemIconHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TreeItemIconHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless TreeNavigation component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled tree navigation implementations.
 */
export const TreeNavigationHeadless = forwardRef(function TreeNavigationHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    nodes,
    defaultExpandedIds,
    defaultSelectedId,
    multiSelect,
    expandedIds: controlledExpandedIds,
    selectedIds: controlledSelectedIds,
    onExpandedChange,
    onSelectedChange,
    autoExpandParent,
    collapseSiblings,
    ariaLabel = 'Tree navigation' as any,
    ...props 
  }: Omit<TreeNavigationHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const treeNavigationState = useTreeNavigation({
    nodes,
    defaultExpandedIds,
    defaultSelectedId,
    multiSelect,
    expandedIds: controlledExpandedIds,
    selectedIds: controlledSelectedIds,
    onExpandedChange,
    onSelectedChange,
    autoExpandParent,
    collapseSiblings,
  });

  const { 
    expandedIds, 
    selectedIds,
    toggleExpanded,
    toggleSelected,
    expandNode,
    collapseNode,
    selectNode,
    deselectNode,
    isExpanded,
    isSelected,
    getNodeProps,
  } = treeNavigationState;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <TreeNavigationContext.Provider 
      value={{ 
        expandedIds, 
        selectedIds,
        toggleExpanded,
        toggleSelected,
        expandNode,
        collapseNode,
        selectNode,
        deselectNode,
        isExpanded,
        isSelected,
        getNodeProps,
      }}
    >
      <ElementType
        ref={ref}
        role="tree"
        aria-label={ariaLabel}
        className={className}
        style={style}
        {...props}
      >
        {children}
      </ElementType>
    </TreeNavigationContext.Provider>
  );
}) as unknown as TreeNavigationHeadlessComponent;

/**
 * A headless TreeItem component for rendering a tree node.
 */
export const TreeItemHeadless = forwardRef(function TreeItemHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    node,
    level = 0 as any,
    ...props 
  }: Omit<TreeItemHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getNodeProps } = useTreeNavigationContext();
  
  // Get props for the tree item
  const itemProps = getNodeProps(node);

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        ...style,
      }}
      {...itemProps}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as TreeItemHeadlessComponent;

/**
 * A headless TreeItemLabel component for rendering the label of a tree node.
 */
export const TreeItemLabelHeadless = forwardRef(function TreeItemLabelHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    node,
    ...props 
  }: Omit<TreeItemLabelHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      {...props}
    >
      {children || node.label}
    </ElementType>
  );
}) as unknown as TreeItemLabelHeadlessComponent;

/**
 * A headless TreeItemContent component for rendering the content of a tree node.
 */
export const TreeItemContentHeadless = forwardRef(function TreeItemContentHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    node,
    level = 0 as any,
    ...props 
  }: Omit<TreeItemContentHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { isExpanded } = useTreeNavigationContext();
  const expanded = node.children && node.children.length > 0 ? isExpanded(node.id) : false;
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  if (!expanded || !node.children || node.children.length === 0) {
    return null;
  }

  return (
    <ElementType
      ref={ref}
      role="group"
      className={className}
      style={{
        ...style,
      }}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as TreeItemContentHeadlessComponent;

/**
 * A headless TreeItemToggle component for rendering the toggle button of a tree node.
 */
export const TreeItemToggleHeadless = forwardRef(function TreeItemToggleHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    node,
    ...props 
  }: Omit<TreeItemToggleHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { toggleExpanded, isExpanded } = useTreeNavigationContext();
  const expanded = node.children && node.children.length > 0 ? isExpanded(node.id) : false;
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  // If the node has no children, don't render a toggle
  if (!node.children || node.children.length === 0) {
    return null;
  }

  return (
    <ElementType
      ref={ref}
      role="button"
      aria-label={expanded ? 'Collapse' : 'Expand'}
      tabIndex={-1}
      className={className}
      style={style}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        toggleExpanded(node.id);
      }}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as TreeItemToggleHeadlessComponent;

/**
 * A headless TreeItemIcon component for rendering the icon of a tree node.
 */
export const TreeItemIconHeadless = forwardRef(function TreeItemIconHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    node,
    ...props 
  }: Omit<TreeItemIconHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      aria-hidden="true"
      className={className}
      style={style}
      {...props}
    >
      {children || node.icon}
    </ElementType>
  );
}) as unknown as TreeItemIconHeadlessComponent;

// Add displayNames for better debugging
(TreeNavigationHeadless as any).displayName = 'TreeNavigationHeadless';
(TreeItemHeadless as any).displayName = 'TreeItemHeadless';
(TreeItemLabelHeadless as any).displayName = 'TreeItemLabelHeadless';
(TreeItemContentHeadless as any).displayName = 'TreeItemContentHeadless';
(TreeItemToggleHeadless as any).displayName = 'TreeItemToggleHeadless';
(TreeItemIconHeadless as any).displayName = 'TreeItemIconHeadless';

// Create a compound component
export const TreeNavigation = Object.assign(TreeNavigationHeadless, {
  Item: TreeItemHeadless,
  Label: TreeItemLabelHeadless,
  Content: TreeItemContentHeadless,
  Toggle: TreeItemToggleHeadless,
  Icon: TreeItemIconHeadless,
});

export default TreeNavigation;
