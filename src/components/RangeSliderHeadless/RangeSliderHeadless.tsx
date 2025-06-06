import React, { forwardRef, createContext, useContext } from 'react';
import { useRangeSlider, UseRangeSliderProps, UseRangeSliderReturn } from './useRangeSlider';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the RangeSliderHeadless component
 */
export type RangeSliderHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseRangeSliderProps & {
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
 * Props for the RangeSliderTrack component
 */
export type RangeSliderTrackProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
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
 * Props for the RangeSliderRange component
 */
export type RangeSliderRangeProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RangeSliderStartThumb component
 */
export type RangeSliderStartThumbProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
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
 * Props for the RangeSliderEndThumb component
 */
export type RangeSliderEndThumbProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
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
 * Props for the RangeSliderMarks component
 */
export type RangeSliderMarksProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RangeSliderMark component
 */
export type RangeSliderMarkProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
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
 * Props for the RangeSliderStartInput component
 */
export type RangeSliderStartInputProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RangeSliderEndInput component
 */
export type RangeSliderEndInputProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RangeSliderLabel component
 */
export type RangeSliderLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the RangeSliderTooltip component
 */
export type RangeSliderTooltipProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Format function for the tooltip value */
    format?: (value: number) => React.ReactNode;
    /** Whether this is for the start or end thumb */
    type: 'start' | 'end';
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the slider state
interface RangeSliderContextValue extends UseRangeSliderReturn {
  orientation: 'horizontal' | 'vertical';
  startValue: number;
  endValue: number;
}

const RangeSliderContext = createContext<RangeSliderContextValue | null>(null);

// Custom hook to use the slider context
const useRangeSliderContext = () => {
  const context = useContext<RangeSliderContextValue | null>(RangeSliderContext);
  if (!context) {
    throw new Error('RangeSlider compound components must be used within a RangeSliderHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type RangeSliderHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: RangeSliderHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderTrackComponent = <C extends React.ElementType = 'div'>(
  props: RangeSliderTrackProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderRangeComponent = <C extends React.ElementType = 'div'>(
  props: RangeSliderRangeProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderStartThumbComponent = <C extends React.ElementType = 'div'>(
  props: RangeSliderStartThumbProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderEndThumbComponent = <C extends React.ElementType = 'div'>(
  props: RangeSliderEndThumbProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderMarksComponent = <C extends React.ElementType = 'div'>(
  props: RangeSliderMarksProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderMarkComponent = <C extends React.ElementType = 'div'>(
  props: RangeSliderMarkProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderStartInputComponent = <C extends React.ElementType = 'input'>(
  props: RangeSliderStartInputProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderEndInputComponent = <C extends React.ElementType = 'input'>(
  props: RangeSliderEndInputProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderLabelComponent = <C extends React.ElementType = 'label'>(
  props: RangeSliderLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RangeSliderTooltipComponent = <C extends React.ElementType = 'div'>(
  props: RangeSliderTooltipProps<C> & { ref?: React.Ref<any> }
) => JSX.Element | null;

/**
 * A headless Range Slider component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled range slider implementations.
 */
export const RangeSliderHeadless = forwardRef(function RangeSliderHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    orientation,
    ...props 
  }: Omit<RangeSliderHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const resolvedOrientation = orientation || 'horizontal';
  const rangeSliderState = useRangeSlider({ orientation: resolvedOrientation, ...props });
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <RangeSliderContext.Provider value={{
      ...rangeSliderState,
      orientation: resolvedOrientation,
    }}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...rangeSliderState.getRootProps()}
      >
        {children || (
          <>
            {label && <RangeSliderLabel>{label}</RangeSliderLabel>}
            <RangeSliderTrack>
              <RangeSliderRange />
              <RangeSliderStartThumb>
                {props.tooltip && <RangeSliderTooltip type="start" />}
              </RangeSliderStartThumb>
              <RangeSliderEndThumb>
                {props.tooltip && <RangeSliderTooltip type="end" />}
              </RangeSliderEndThumb>
            </RangeSliderTrack>
            {props.marks && <RangeSliderMarks />}
            <RangeSliderStartInput />
            <RangeSliderEndInput />
          </>
        )}
      </ElementType>
    </RangeSliderContext.Provider>
  );
}) as unknown as RangeSliderHeadlessComponent;

/**
 * The track element of the range slider.
 */
export const RangeSliderTrack = forwardRef(function RangeSliderTrack<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RangeSliderTrackProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getTrackProps } = useRangeSliderContext();
  
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
}) as unknown as RangeSliderTrackComponent;

/**
 * The filled range element of the range slider.
 */
export const RangeSliderRange = forwardRef(function RangeSliderRange<C extends React.ElementType = 'div'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<RangeSliderRangeProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getRangeProps } = useRangeSliderContext();
  
  // Get props for the range
  const rangeProps = getRangeProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...rangeProps}
      ref={ref}
    />
  );
}) as unknown as RangeSliderRangeComponent;

/**
 * The start thumb element of the range slider.
 */
export const RangeSliderStartThumb = forwardRef(function RangeSliderStartThumb<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RangeSliderStartThumbProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getStartThumbProps } = useRangeSliderContext();
  
  // Get props for the start thumb
  const startThumbProps = getStartThumbProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...startThumbProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as RangeSliderStartThumbComponent;

/**
 * The end thumb element of the range slider.
 */
export const RangeSliderEndThumb = forwardRef(function RangeSliderEndThumb<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RangeSliderEndThumbProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getEndThumbProps } = useRangeSliderContext();
  
  // Get props for the end thumb
  const endThumbProps = getEndThumbProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...endThumbProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as RangeSliderEndThumbComponent;

/**
 * The marks container element of the range slider.
 */
export const RangeSliderMarks = forwardRef(function RangeSliderMarks<C extends React.ElementType = 'div'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<RangeSliderMarksProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { marks } = useRangeSliderContext();
  
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
        <RangeSliderMark key={mark.value} value={mark.value}>
          {mark.label}
        </RangeSliderMark>
      ))}
    </ElementType>
  );
}) as unknown as RangeSliderMarksComponent;

/**
 * An individual mark element of the range slider.
 */
export const RangeSliderMark = forwardRef(function RangeSliderMark<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    value,
    ...props 
  }: Omit<RangeSliderMarkProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { marks, orientation, startValue, endValue } = useRangeSliderContext();
  
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
      data-active={value >= startValue && value <= endValue ? '' : undefined}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as RangeSliderMarkComponent;

/**
 * The hidden start input element of the range slider.
 */
export const RangeSliderStartInput = forwardRef(function RangeSliderStartInput<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<RangeSliderStartInputProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getStartInputProps } = useRangeSliderContext();
  
  // Get props for the start input
  const startInputProps = getStartInputProps({
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
      {...startInputProps}
      ref={ref}
    />
  );
}) as unknown as RangeSliderStartInputComponent;

/**
 * The hidden end input element of the range slider.
 */
export const RangeSliderEndInput = forwardRef(function RangeSliderEndInput<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<RangeSliderEndInputProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getEndInputProps } = useRangeSliderContext();
  
  // Get props for the end input
  const endInputProps = getEndInputProps({
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
      {...endInputProps}
      ref={ref}
    />
  );
}) as unknown as RangeSliderEndInputComponent;

/**
 * The label element of the range slider.
 */
export const RangeSliderLabel = forwardRef(function RangeSliderLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RangeSliderLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { id } = useRangeSliderContext();
  
  // Use the 'as' prop or default to 'label'
  const ElementType: React.ElementType = as || 'label';

  return (
    <ElementType
      ref={ref}
      htmlFor={`${id}-start`}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as RangeSliderLabelComponent;

/**
 * The tooltip element of the range slider.
 */
export const RangeSliderTooltip = forwardRef(function RangeSliderTooltip<C extends React.ElementType = 'div'>(
  { 
    as, 
    className, 
    style, 
    format,
    type,
    ...props 
  }: Omit<RangeSliderTooltipProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { 
    startValue, 
    endValue, 
    startFocused, 
    endFocused, 
    startDragging, 
    endDragging 
  } = useRangeSliderContext();
  
  // Only show tooltip when dragging or focused
  const isStartActive = type === 'start' && (startDragging || startFocused);
  const isEndActive = type === 'end' && (endDragging || endFocused);
  
  if (!isStartActive && !isEndActive) {
    return null;
  }
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  // Format the value
  const value = type === 'start' ? startValue : endValue;
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
}) as unknown as RangeSliderTooltipComponent;

// Add displayNames for better debugging
(RangeSliderHeadless as any).displayName = 'RangeSliderHeadless';
(RangeSliderTrack as any).displayName = 'RangeSliderTrack';
(RangeSliderRange as any).displayName = 'RangeSliderRange';
(RangeSliderStartThumb as any).displayName = 'RangeSliderStartThumb';
(RangeSliderEndThumb as any).displayName = 'RangeSliderEndThumb';
(RangeSliderMarks as any).displayName = 'RangeSliderMarks';
(RangeSliderMark as any).displayName = 'RangeSliderMark';
(RangeSliderStartInput as any).displayName = 'RangeSliderStartInput';
(RangeSliderEndInput as any).displayName = 'RangeSliderEndInput';
(RangeSliderLabel as any).displayName = 'RangeSliderLabel';
(RangeSliderTooltip as any).displayName = 'RangeSliderTooltip';

// Create a compound component
export const RangeSlider = Object.assign(RangeSliderHeadless, {
  Track: RangeSliderTrack,
  Range: RangeSliderRange,
  StartThumb: RangeSliderStartThumb,
  EndThumb: RangeSliderEndThumb,
  Marks: RangeSliderMarks,
  Mark: RangeSliderMark,
  StartInput: RangeSliderStartInput,
  EndInput: RangeSliderEndInput,
  Label: RangeSliderLabel,
  Tooltip: RangeSliderTooltip,
});

export default RangeSlider;
