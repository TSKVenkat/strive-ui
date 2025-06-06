import React, { forwardRef, createContext, useContext } from 'react';
import { useRating, UseRatingProps, UseRatingReturn } from './useRating';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the RatingHeadless component
 */
export type RatingHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseRatingProps & {
    /** Label for the rating */
    label?: string;
    /** Children to render inside the component */
    children?: React.ReactNode;
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RatingItem component
 */
export type RatingItemProps<C extends React.ElementType = 'span'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Value of the rating item */
    value: number;
    /** Whether this is a half item */
    half?: boolean;
    /** Children to render inside the item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
    /** Icon to display when item is active */
    activeIcon?: React.ReactNode;
    /** Icon to display when item is inactive */
    inactiveIcon?: React.ReactNode;
  }
>;

/**
 * Props for the RatingInput component
 */
export type RatingInputProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RatingLabel component
 */
export type RatingLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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

/**
 * Props for the RatingGroup component
 */
export type RatingGroupProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the group */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the rating state
interface RatingContextValue extends UseRatingReturn {}

const RatingContext = createContext<RatingContextValue | null>(null);

// Custom hook to use the rating context
const useRatingContext = () => {
  const context = useContext<RatingContextValue | null>(RatingContext);
  if (!context) {
    throw new Error('Rating compound components must be used within a RatingHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type RatingHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: RatingHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RatingItemComponent = <C extends React.ElementType = 'span'>(
  props: RatingItemProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RatingInputComponent = <C extends React.ElementType = 'input'>(
  props: RatingInputProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RatingLabelComponent = <C extends React.ElementType = 'label'>(
  props: RatingLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RatingGroupComponent = <C extends React.ElementType = 'div'>(
  props: RatingGroupProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Rating component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled rating implementations.
 */
export const RatingHeadless = forwardRef(function RatingHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<RatingHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const ratingState = useRating(props);
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <RatingContext.Provider value={ratingState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...ratingState.getRootProps()}
      >
        {children || (
          <>
            {label && <RatingLabel>{label}</RatingLabel>}
            <RatingGroup>
              {Array.from({ length: ratingState.max }, (_, i) => (
                <RatingItem key={i + 1} value={i + 1} />
              ))}
            </RatingGroup>
            <RatingInput />
          </>
        )}
      </ElementType>
    </RatingContext.Provider>
  );
}) as unknown as RatingHeadlessComponent;

/**
 * An individual rating item.
 */
export const RatingItem = forwardRef(function RatingItem<C extends React.ElementType = 'span'>(
  { 
    as, 
    children, 
    className, 
    style, 
    value,
    half = false as any,
    activeIcon,
    inactiveIcon,
    ...props 
  }: Omit<RatingItemProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getItemProps, value: currentValue, hoverValue } = useRatingContext();
  
  // Get props for the item
  const itemProps = getItemProps({
    value,
    half,
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'span'
  const ElementType: React.ElementType = as || 'span';

  // Determine if the item is active
  const displayValue = hoverValue > 0 ? hoverValue : currentValue;
  const isActive = half 
    ? value - 0.5 <= displayValue 
    : value <= displayValue;

  return (
    <ElementType
      {...itemProps}
      ref={ref}
    >
      {children || (isActive ? activeIcon : inactiveIcon)}
    </ElementType>
  );
}) as unknown as RatingItemComponent;

/**
 * The hidden input element of the rating.
 */
export const RatingInput = forwardRef(function RatingInput<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<RatingInputProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getInputProps } = useRatingContext();
  
  // Get props for the input
  const inputProps = getInputProps({
    className,
    style: {
      ...style,
      // Hide the input visually but keep it accessible
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: 0,
    },
    ...props,
  });

  // Use the 'as' prop or default to 'input'
  const ElementType: React.ElementType = as || 'input';

  return (
    <ElementType
      {...inputProps}
      ref={ref}
    />
  );
}) as unknown as RatingInputComponent;

/**
 * The label element of the rating.
 */
export const RatingLabel = forwardRef(function RatingLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RatingLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { id } = useRatingContext();
  
  // Use the 'as' prop or default to 'label'
  const ElementType: React.ElementType = as || 'label';

  return (
    <ElementType
      ref={ref}
      htmlFor={id}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as RatingLabelComponent;

/**
 * The group element that contains the rating items.
 */
export const RatingGroup = forwardRef(function RatingGroup<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RatingGroupProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="presentation"
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as RatingGroupComponent;

// Add displayNames for better debugging
(RatingHeadless as any).displayName = 'RatingHeadless';
(RatingItem as any).displayName = 'RatingItem';
(RatingInput as any).displayName = 'RatingInput';
(RatingLabel as any).displayName = 'RatingLabel';
(RatingGroup as any).displayName = 'RatingGroup';

// Create a compound component
export const Rating = Object.assign(RatingHeadless, {
  Item: RatingItem,
  Input: RatingInput,
  Label: RatingLabel,
  Group: RatingGroup,
});

export default Rating;
