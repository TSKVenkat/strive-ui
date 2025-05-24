import React, { forwardRef, createContext, useContext } from 'react';
import { useTextarea, UseTextareaProps, UseTextareaReturn } from './useTextarea';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the TextareaHeadless component
 */
export type TextareaHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseTextareaProps & {
    /** Label for the textarea */
    label?: string;
    /** Children to render inside the component */
    children?: React.ReactNode | ((props: {
      value: string;
      disabled: boolean;
      readOnly: boolean;
      required: boolean;
      focused: boolean;
      charCount: number;
      wordCount: number;
      clear: () => void;
    }) => React.ReactNode);
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the TextareaField component
 */
export type TextareaFieldProps<C extends React.ElementType = 'textarea'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the TextareaLabel component
 */
export type TextareaLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the TextareaCount component
 */
export type TextareaCountProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Type of count to display */
    type?: 'characters' | 'words';
    /** Custom format for the count display */
    format?: (current: number, max?: number) => React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the TextareaClearButton component
 */
export type TextareaClearButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
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

// Create a context to share the textarea state
interface TextareaContextValue extends UseTextareaReturn {}

const TextareaContext = createContext<TextareaContextValue | null>(null);

// Custom hook to use the textarea context
const useTextareaContext = () => {
  const context = useContext<TextareaContextValue | null>(TextareaContext);
  if (!context) {
    throw new Error('Textarea compound components must be used within a TextareaHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type TextareaHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: TextareaHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TextareaFieldComponent = <C extends React.ElementType = 'textarea'>(
  props: TextareaFieldProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TextareaLabelComponent = <C extends React.ElementType = 'label'>(
  props: TextareaLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TextareaCountComponent = <C extends React.ElementType = 'div'>(
  props: TextareaCountProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type TextareaClearButtonComponent = <C extends React.ElementType = 'button'>(
  props: TextareaClearButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Textarea component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled textarea implementations.
 */
export const TextareaHeadless = forwardRef(function TextareaHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<TextareaHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const textareaState = useTextarea(props);
  
  const { 
    value,
    disabled,
    readOnly,
    required,
    focused,
    charCount,
    wordCount,
    clear,
  } = textareaState;

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <TextareaContext.Provider value={textareaState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
      >
        {typeof children === 'function' 
          ? children({ 
              value, 
              disabled, 
              readOnly, 
              required, 
              focused, 
              charCount, 
              wordCount, 
              clear 
            }) 
          : children || (
            <>
              {label && <TextareaLabel>{label}</TextareaLabel>}
              <TextareaField />
              {props.showCount && <TextareaCount type={props.countType} />}
            </>
          )}
      </ElementType>
    </TextareaContext.Provider>
  );
}) as unknown as TextareaHeadlessComponent;

/**
 * The actual textarea element.
 */
export const TextareaField = forwardRef(function TextareaField<C extends React.ElementType = 'textarea'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<TextareaFieldProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getTextareaProps, textareaRef } = useTextareaContext();
  
  // Get props for the textarea
  const textareaProps = getTextareaProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'textarea'
  const ElementType: React.ElementType = as || 'textarea';

  return (
    <ElementType
      {...textareaProps}
      ref={(node) => {
        // Handle both the internal ref and the forwarded ref
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<any>).current = node;
        }
        
        // @ts-ignore - textareaRef.current is read-only
        textareaRef.current = node;
      }}
    />
  );
}) as unknown as TextareaFieldComponent;

/**
 * The label component for the textarea.
 */
export const TextareaLabel = forwardRef(function TextareaLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<TextareaLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getLabelProps } = useTextareaContext();
  
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
}) as unknown as TextareaLabelComponent;

/**
 * The character or word count component.
 */
export const TextareaCount = forwardRef(function TextareaCount<C extends React.ElementType = 'div'>(
  { 
    as, 
    className, 
    style, 
    type = 'characters',
    format,
    ...props 
  }: Omit<TextareaCountProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { charCount, wordCount, maxLength } = useTextareaContext();
  
  // Determine the count to display
  const count = type === 'characters' ? charCount : wordCount;
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  // Default format function
  const defaultFormat = (current: number, max?: number) => {
    return max ? `${current}/${max}` : current;
  };

  // Use custom format function if provided, otherwise use default
  const displayCount = format 
    ? format(count, type === 'characters' ? maxLength : undefined)
    : defaultFormat(count, type === 'characters' ? maxLength : undefined);

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      aria-live="polite"
      {...props}
    >
      {displayCount}
    </ElementType>
  );
}) as unknown as TextareaCountComponent;

/**
 * A button to clear the textarea.
 */
export const TextareaClearButton = forwardRef(function TextareaClearButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<TextareaClearButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { clear, disabled, readOnly, value } = useTextareaContext();
  
  // Don't render if the textarea is empty, disabled, or read-only
  if (!value || disabled || readOnly) {
    return null;
  }
  
  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      type="button"
      onClick={clear}
      aria-label="Clear"
      {...props}
    >
      {children || (
        <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </ElementType>
  );
}) as unknown as TextareaClearButtonComponent;

// Add displayNames for better debugging
(TextareaHeadless as any).displayName = 'TextareaHeadless';
(TextareaField as any).displayName = 'TextareaField';
(TextareaLabel as any).displayName = 'TextareaLabel';
(TextareaCount as any).displayName = 'TextareaCount';
(TextareaClearButton as any).displayName = 'TextareaClearButton';

// Create a compound component
export const Textarea = Object.assign(TextareaHeadless, {
  Field: TextareaField,
  Label: TextareaLabel,
  Count: TextareaCount,
  ClearButton: TextareaClearButton,
});

export default Textarea;
