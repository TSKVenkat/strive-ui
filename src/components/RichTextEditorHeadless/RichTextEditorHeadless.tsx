import React, { forwardRef, createContext, useContext, useEffect, useRef } from 'react';
import { useRichTextEditor, UseRichTextEditorProps, UseRichTextEditorReturn, ToolbarOption } from './useRichTextEditor';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the RichTextEditorHeadless component
 */
export type RichTextEditorHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseRichTextEditorProps & {
    /** Label for the editor */
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
 * Props for the RichTextEditorToolbar component
 */
export type RichTextEditorToolbarProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the toolbar */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RichTextEditorContent component
 */
export type RichTextEditorContentProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the content */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RichTextEditorLabel component
 */
export type RichTextEditorLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the RichTextEditorButton component
 */
export type RichTextEditorButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Format to apply when clicked */
    format: string;
    /** Value for the format (optional) */
    value?: any;
    /** Children to render inside the button */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the RichTextEditorCharCount component
 */
export type RichTextEditorCharCountProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the char count */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the editor state
interface RichTextEditorContextValue extends UseRichTextEditorReturn {}

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(null);

// Custom hook to use the editor context
const useRichTextEditorContext = () => {
  const context = useContext<RichTextEditorContextValue | null>(RichTextEditorContext);
  if (!context) {
    throw new Error('RichTextEditor compound components must be used within a RichTextEditorHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type RichTextEditorHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: RichTextEditorHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RichTextEditorToolbarComponent = <C extends React.ElementType = 'div'>(
  props: RichTextEditorToolbarProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RichTextEditorContentComponent = <C extends React.ElementType = 'div'>(
  props: RichTextEditorContentProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RichTextEditorLabelComponent = <C extends React.ElementType = 'label'>(
  props: RichTextEditorLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RichTextEditorButtonComponent = <C extends React.ElementType = 'button'>(
  props: RichTextEditorButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type RichTextEditorCharCountComponent = <C extends React.ElementType = 'div'>(
  props: RichTextEditorCharCountProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Rich Text Editor component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled rich text editor implementations.
 */
export const RichTextEditorHeadless = forwardRef(function RichTextEditorHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<RichTextEditorHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const editorState = useRichTextEditor(props);
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  // Initialize Quill on mount
  const quillRef = useRef<any>(null);

  useEffect(() => {
    // This is where we would initialize Quill if it were included
    // For now, we'll just set up a placeholder for the implementation
    if (editorState.editorRef.current && !quillRef.current) {
      // In a real implementation, we would initialize Quill here
      // quillRef.current = new Quill(editorState.editorRef.current, {
      //   theme: 'snow',
      //   placeholder: editorState.placeholder,
      //   readOnly: editorState.readOnly || editorState.disabled,
      //   modules: {
      //     toolbar: editorState.toolbarRef.current,
      //   },
      // });
      
      // Set up event listeners for Quill
      // quillRef.current.on('text-change', () => {
      //   const html = editorState.editorRef.current.innerHTML;
      //   editorState.setValue(html);
      // });
    }
    
    return () => {
      // Clean up Quill instance on unmount
      if (quillRef.current) {
        // quillRef.current = null;
      }
    };
  }, [editorState.editorRef, editorState.toolbarRef, editorState.placeholder, editorState.readOnly, editorState.disabled, editorState.setValue]);

  return (
    <RichTextEditorContext.Provider value={editorState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...editorState.getContainerProps()}
      >
        {children || (
          <>
            {label && <RichTextEditorLabel>{label}</RichTextEditorLabel>}
            <RichTextEditorToolbar>
              {editorState.toolbarOptions.includes('bold') && (
                <RichTextEditorButton format="bold">Bold</RichTextEditorButton>
              )}
              {editorState.toolbarOptions.includes('italic') && (
                <RichTextEditorButton format="italic">Italic</RichTextEditorButton>
              )}
              {editorState.toolbarOptions.includes('underline') && (
                <RichTextEditorButton format="underline">Underline</RichTextEditorButton>
              )}
              {/* Add more default buttons here */}
            </RichTextEditorToolbar>
            <RichTextEditorContent />
            {editorState.maxLength && (
              <RichTextEditorCharCount />
            )}
          </>
        )}
      </ElementType>
    </RichTextEditorContext.Provider>
  );
}) as unknown as RichTextEditorHeadlessComponent;

/**
 * The toolbar element of the rich text editor.
 */
export const RichTextEditorToolbar = forwardRef(function RichTextEditorToolbar<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RichTextEditorToolbarProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getToolbarProps } = useRichTextEditorContext();
  
  // Get props for the toolbar
  const toolbarProps = getToolbarProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...toolbarProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as RichTextEditorToolbarComponent;

/**
 * The content element of the rich text editor.
 */
export const RichTextEditorContent = forwardRef(function RichTextEditorContent<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RichTextEditorContentProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getEditorProps, placeholder } = useRichTextEditorContext();
  
  // Get props for the editor
  const editorProps = getEditorProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...editorProps}
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
    >
      {children}
    </ElementType>
  );
}) as unknown as RichTextEditorContentComponent;

/**
 * The label element of the rich text editor.
 */
export const RichTextEditorLabel = forwardRef(function RichTextEditorLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RichTextEditorLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { id } = useRichTextEditorContext();
  
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
}) as unknown as RichTextEditorLabelComponent;

/**
 * A button element for the rich text editor toolbar.
 */
export const RichTextEditorButton = forwardRef(function RichTextEditorButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    format,
    value,
    ...props 
  }: Omit<RichTextEditorButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getToolbarButtonProps } = useRichTextEditorContext();
  
  // Get props for the button
  const buttonProps = getToolbarButtonProps({
    format,
    value,
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      {...buttonProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as RichTextEditorButtonComponent;

/**
 * The character count element of the rich text editor.
 */
export const RichTextEditorCharCount = forwardRef(function RichTextEditorCharCount<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<RichTextEditorCharCountProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { charCount, maxLength } = useRichTextEditorContext();
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="status"
      aria-live="polite"
      {...props}
    >
      {children || (
        maxLength ? `${charCount}/${maxLength}` : charCount
      )}
    </ElementType>
  );
}) as unknown as RichTextEditorCharCountComponent;

// Add displayNames for better debugging
(RichTextEditorHeadless as any).displayName = 'RichTextEditorHeadless';
(RichTextEditorToolbar as any).displayName = 'RichTextEditorToolbar';
(RichTextEditorContent as any).displayName = 'RichTextEditorContent';
(RichTextEditorLabel as any).displayName = 'RichTextEditorLabel';
(RichTextEditorButton as any).displayName = 'RichTextEditorButton';
(RichTextEditorCharCount as any).displayName = 'RichTextEditorCharCount';

// Create a compound component
export const RichTextEditor = Object.assign(RichTextEditorHeadless, {
  Toolbar: RichTextEditorToolbar,
  Content: RichTextEditorContent,
  Label: RichTextEditorLabel,
  Button: RichTextEditorButton,
  CharCount: RichTextEditorCharCount,
});

export default RichTextEditor;
