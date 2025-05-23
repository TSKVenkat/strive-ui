import React from 'react';

/**
 * Extract props from a React component
 */
export type PropsOf<C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<C, React.ComponentPropsWithoutRef<C>>;

/**
 * Extract the 'as' prop from a component's props
 */
export type AsProp<C extends React.ElementType> = {
  /**
   * An override of the default HTML tag.
   * Can also be another React component.
   */
  as?: C;
};

/**
 * Allows for extending a set of props ('ExtendedProps') by an overriding set of props
 * ('OverrideProps'), ensuring that any duplicates are overridden by the overriding
 * props and that the 'as' prop is correctly handled.
 */
export type ExtendableProps<
  ExtendedProps = {},
  OverrideProps = {}
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component can be rendered as any other
 * component or HTML element by passing an 'as' prop.
 */
export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = ExtendableProps<PropsOf<C>, Props & AsProp<C>>;

/**
 * A more sophisticated version of PolymorphicComponentProps that also
 * preserves the static properties of the component, including ref.
 */
export type PolymorphicRef<C extends React.ElementType> =
  React.ComponentPropsWithRef<C>['ref'];

/**
 * A complete polymorphic component type that includes both the component props
 * and the ref prop, as well as static properties.
 */
export type PolymorphicComponentPropsWithRef<
  C extends React.ElementType,
  Props = {}
> = PolymorphicComponentProps<C, Props> & { ref?: PolymorphicRef<C> };

/**
 * A utility type for creating polymorphic components with proper ref forwarding
 */
export type PolymorphicComponent<
  DefaultElement extends React.ElementType,
  Props = {}
> = <C extends React.ElementType = DefaultElement>(
  props: PolymorphicComponentPropsWithRef<C, Props>
) => React.ReactElement | null;
