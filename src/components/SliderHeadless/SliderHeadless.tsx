import React, { forwardRef, createContext, useContext } from 'react';
import { useSlider, UseSliderProps, UseSliderReturn } from './useSlider';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the SliderHeadless component
 */
export type SliderHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseSliderProps & {
    /** Label for the slider */
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
 * Props for the SliderTrack component
 */
export type SliderTrackProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the track */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SliderRange component
 */
export type SliderRangeProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SliderThumb component
 */
export type SliderThumbProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the thumb */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SliderMarks component
 */
export type SliderMarksProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SliderMark component
 */
export type SliderMarkProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Value of the mark */
    value: number;
    /** Children to render inside the mark */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SliderInput component
 */
export type SliderInputProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SliderLabel component
 */
export type SliderLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the SliderTooltip component
 */
export type SliderTooltipProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Format function for the tooltip value */
    format?: (value: number) => React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the slider state
interface SliderContextValue extends UseSliderReturn {}

const SliderContext = createContext<SliderContextValue | null>(null);

// Custom hook to use the slider context
const useSliderContext = () => {
  const context = useContext<SliderContextValue | null>(SliderContext);
  if (!context) {
    throw new Error('Slider compound components must be used within a SliderHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type SliderHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SliderHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SliderTrackComponent = <C extends React.ElementType = 'div'>(
  props: SliderTrackProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SliderRangeComponent = <C extends React.ElementType = 'div'>(
  props: SliderRangeProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SliderThumbComponent = <C extends React.ElementType = 'div'>(
  props: SliderThumbProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SliderMarksComponent = <C extends React.ElementType = 'div'>(
  props: SliderMarksProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SliderMarkComponent = <C extends React.ElementType = 'div'>(
  props: SliderMarkProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SliderInputComponent = <C extends React.ElementType = 'input'>(
  props: SliderInputProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SliderLabelComponent = <C extends React.ElementType = 'label'>(
  props: SliderLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SliderTooltipComponent = <C extends React.ElementType = 'div'>(
  props: SliderTooltipProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

/**
 * A headless Slider component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled slider implementations.
 */
export const SliderHeadless = forwardRef(function SliderHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<SliderHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const sliderState = useSlider(props);
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <SliderContext.Provider value={sliderState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...sliderState.getRootProps()}
      >
        {children || (
          <>
            {label && <SliderLabel>{label}</SliderLabel>}
            <SliderTrack>
              <SliderRange />
              <SliderThumb>
                {props.tooltip && <SliderTooltip />}
              </SliderThumb>
            </SliderTrack>
            {props.marks && <SliderMarks />}
            <SliderInput />
          </>
        )}
      </ElementType>
    </SliderContext.Provider>
  );
}) as unknown as SliderHeadlessComponent;

/**
 * The track element of the slider.
 */
export const SliderTrack = forwardRef(function SliderTrack<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SliderTrackProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getTrackProps } = useSliderContext();
  
  // Get props for the track
  const trackProps = getTrackProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...trackProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as SliderTrackComponent;

/**
 * The filled range element of the slider.
 */
export const SliderRange = forwardRef(function SliderRange<C extends React.ElementType = 'div'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<SliderRangeProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { percentage, orientation } = useSliderContext();
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        ...style,
        [orientation === 'horizontal' ? 'width' : 'height']: `${percentage}%`,
      }}
      role="presentation"
      {...props}
    />
  );
}) as unknown as SliderRangeComponent;

/**
 * The thumb element of the slider.
 */
export const SliderThumb = forwardRef(function SliderThumb<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SliderThumbProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getThumbProps } = useSliderContext();
  
  // Get props for the thumb
  const thumbProps = getThumbProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...thumbProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as SliderThumbComponent;

/**
 * The marks container element of the slider.
 */
export const SliderMarks = forwardRef(function SliderMarks<C extends React.ElementType = 'div'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<SliderMarksProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { marks } = useSliderContext();
  
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
      {marks.map((mark) => (
        <SliderMark key={mark.value} value={mark.value}>
          {mark.label}
        </SliderMark>
      ))}
    </ElementType>
  );
}) as unknown as SliderMarksComponent;

/**
 * An individual mark element of the slider.
 */
export const SliderMark = forwardRef(function SliderMark<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    value,
    ...props 
  }: Omit<SliderMarkProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { marks, orientation, value: currentValue } = useSliderContext();
  
  // Find the mark in the marks array
  const mark = marks.find((m) => m.value === value);
  
  if (!mark) {
    return null;
  }
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        ...style,
        [orientation === 'horizontal' ? 'left' : 'bottom']: `${mark.percentage}%`,
      }}
      role="presentation"
      data-value={value}
      data-active={value <= currentValue ? '' : undefined}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as SliderMarkComponent;

/**
 * The hidden input element of the slider.
 */
export const SliderInput = forwardRef(function SliderInput<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<SliderInputProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getInputProps } = useSliderContext();
  
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
}) as unknown as SliderInputComponent;

/**
 * The label element of the slider.
 */
export const SliderLabel = forwardRef(function SliderLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SliderLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { id } = useSliderContext();
  
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
}) as unknown as SliderLabelComponent;

/**
 * The tooltip element of the slider.
 */
export const SliderTooltip = forwardRef(function SliderTooltip<C extends React.ElementType = 'div'>(
  { 
    as, 
    className, 
    style, 
    format,
    ...props 
  }: Omit<SliderTooltipProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { value, dragging, focused } = useSliderContext();
  
  // Only show tooltip when dragging or focused
  if (!dragging && !focused) {
    return null;
  }
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  // Format the value
  const formattedValue = format ? format(value) : value;

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="tooltip"
      {...props}
    >
      {formattedValue}
    </ElementType>
  );
}) as unknown as SliderTooltipComponent;

// Add displayNames for better debugging
(SliderHeadless as any).displayName = 'SliderHeadless';
(SliderTrack as any).displayName = 'SliderTrack';
(SliderRange as any).displayName = 'SliderRange';
(SliderThumb as any).displayName = 'SliderThumb';
(SliderMarks as any).displayName = 'SliderMarks';
(SliderMark as any).displayName = 'SliderMark';
(SliderInput as any).displayName = 'SliderInput';
(SliderLabel as any).displayName = 'SliderLabel';
(SliderTooltip as any).displayName = 'SliderTooltip';

// Create a compound component
export const Slider = Object.assign(SliderHeadless, {
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
  Marks: SliderMarks,
  Mark: SliderMark,
  Input: SliderInput,
  Label: SliderLabel,
  Tooltip: SliderTooltip,
});

export default Slider;
