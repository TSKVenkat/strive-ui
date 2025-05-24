import React, { forwardRef, createContext, useContext } from 'react';
import { useSwitch, UseSwitchProps, UseSwitchReturn } from './useSwitch';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the SwitchHeadless component
 */
export type SwitchHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseSwitchProps & {
    /** Label for the switch */
    label?: string;
    /** Children to render inside the component */
    children?: React.ReactNode | ((props: {
      checked: boolean;
      disabled: boolean;
      required: boolean;
      focused: boolean;
      loading: boolean;
      toggle: () => void;
    }) => React.ReactNode);
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SwitchInput component
 */
export type SwitchInputProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SwitchLabel component
 */
export type SwitchLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the SwitchRoot component
 */
export type SwitchRootProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the root */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the SwitchThumb component
 */
export type SwitchThumbProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
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

// Create a context to share the switch state
interface SwitchContextValue extends UseSwitchReturn {}

const SwitchContext = createContext<SwitchContextValue | null>(null);

// Custom hook to use the switch context
const useSwitchContext = () => {
  const context = useContext<SwitchContextValue | null>(SwitchContext);
  if (!context) {
    throw new Error('Switch compound components must be used within a SwitchHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type SwitchHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: SwitchHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SwitchInputComponent = <C extends React.ElementType = 'input'>(
  props: SwitchInputProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SwitchLabelComponent = <C extends React.ElementType = 'label'>(
  props: SwitchLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SwitchRootComponent = <C extends React.ElementType = 'div'>(
  props: SwitchRootProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type SwitchThumbComponent = <C extends React.ElementType = 'div'>(
  props: SwitchThumbProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Switch component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled switch implementations.
 */
export const SwitchHeadless = forwardRef(function SwitchHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<SwitchHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const switchState = useSwitch(props);
  
  const { 
    checked,
    disabled,
    required,
    focused,
    loading,
    toggle,
  } = switchState;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <SwitchContext.Provider value={switchState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
      >
        {typeof children === 'function' 
          ? children({ 
              checked, 
              disabled, 
              required, 
              focused, 
              loading, 
              toggle 
            }) 
          : children || (
            <>
              <SwitchInput />
              <SwitchRoot>
                <SwitchThumb />
              </SwitchRoot>
              {label && <SwitchLabel>{label}</SwitchLabel>}
            </>
          )}
      </ElementType>
    </SwitchContext.Provider>
  );
}) as unknown as SwitchHeadlessComponent;

/**
 * The actual switch input element (visually hidden in most implementations).
 */
export const SwitchInput = forwardRef(function SwitchInput<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<SwitchInputProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getInputProps, inputRef } = useSwitchContext();
  
  // Get props for the input
  const inputProps = getInputProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'input'
  const ElementType: React.ElementType = as || 'input';

  return (
    <ElementType
      {...inputProps}
      ref={(node) => {
        // Handle both the internal ref and the forwarded ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<any>).current = node;
        }
        
        // @ts-ignore - inputRef.current is read-only
        inputRef.current = node;
      }}
    />
  );
}) as unknown as SwitchInputComponent;

/**
 * The label component for the switch.
 */
export const SwitchLabel = forwardRef(function SwitchLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SwitchLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getLabelProps } = useSwitchContext();
  
  // Get props for the label
  const labelProps = getLabelProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'label'
  const ElementType: React.ElementType = as || 'label';

  return (
    <ElementType
      {...labelProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as SwitchLabelComponent;

/**
 * The visual root component for the switch.
 */
export const SwitchRoot = forwardRef(function SwitchRoot<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SwitchRootProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getSwitchProps } = useSwitchContext();
  
  // Get props for the switch
  const switchProps = getSwitchProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...switchProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as SwitchRootComponent;

/**
 * The thumb component for the switch (the moving part).
 */
export const SwitchThumb = forwardRef(function SwitchThumb<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<SwitchThumbProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getThumbProps, loading } = useSwitchContext();
  
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
      {children || (loading ? (
        // Simple loading spinner (can be customized)
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="switch-loading-spinner">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v2" />
        </svg>
      ) : null)}
    </ElementType>
  );
}) as unknown as SwitchThumbComponent;

// Add displayNames for better debugging
(SwitchHeadless as any).displayName = 'SwitchHeadless';
(SwitchInput as any).displayName = 'SwitchInput';
(SwitchLabel as any).displayName = 'SwitchLabel';
(SwitchRoot as any).displayName = 'SwitchRoot';
(SwitchThumb as any).displayName = 'SwitchThumb';

// Create a compound component
export const Switch = Object.assign(SwitchHeadless, {
  Input: SwitchInput,
  Label: SwitchLabel,
  Root: SwitchRoot,
  Thumb: SwitchThumb,
});

export default Switch;
