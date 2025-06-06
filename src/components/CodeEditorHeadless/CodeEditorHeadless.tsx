import React, { forwardRef, createContext, useContext, useEffect, useRef } from 'react';
import { useCodeEditor, UseCodeEditorProps, UseCodeEditorReturn } from './useCodeEditor';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the CodeEditorHeadless component
 */
export type CodeEditorHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseCodeEditorProps & {
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
 * Props for the CodeEditorContent component
 */
export type CodeEditorContentProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
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
 * Props for the CodeEditorLabel component
 */
export type CodeEditorLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
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
 * Props for the CodeEditorLineNumbers component
 */
export type CodeEditorLineNumbersProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the line numbers */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the editor state
interface CodeEditorContextValue extends UseCodeEditorReturn {}

const CodeEditorContext = createContext<CodeEditorContextValue | null>(null);

// Custom hook to use the editor context
const useCodeEditorContext = () => {
  const context = useContext<CodeEditorContextValue | null>(CodeEditorContext);
  if (!context) {
    throw new Error('CodeEditor compound components must be used within a CodeEditorHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type CodeEditorHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: CodeEditorHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type CodeEditorContentComponent = <C extends React.ElementType = 'div'>(
  props: CodeEditorContentProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type CodeEditorLabelComponent = <C extends React.ElementType = 'label'>(
  props: CodeEditorLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type CodeEditorLineNumbersComponent = <C extends React.ElementType = 'div'>(
  props: CodeEditorLineNumbersProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Code Editor component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled code editor implementations.
 */
export const CodeEditorHeadless = forwardRef(function CodeEditorHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<CodeEditorHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const editorState = useCodeEditor(props);
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  // Initialize CodeMirror on mount
  const codeMirrorRef = useRef<any>(null);

  useEffect(() => {
    // This is where we would initialize CodeMirror if it were included
    // For now, we'll just set up a placeholder for the implementation
    if (editorState.editorRef.current && !codeMirrorRef.current) {
      // In a real implementation, we would initialize CodeMirror here
      // codeMirrorRef.current = CodeMirror.fromTextArea(editorState.editorRef.current, {
      //   mode: editorState.language,
      //   theme: editorState.theme,
      //   lineNumbers: editorState.showLineNumbers,
      //   lineWrapping: editorState.lineWrapping,
      //   tabSize: editorState.tabSize,
      //   indentUnit: editorState.tabSize,
      //   readOnly: editorState.readOnly || editorState.disabled,
      //   autoCloseBrackets: editorState.autoCloseBrackets,
      //   matchBrackets: editorState.matchBrackets,
      //   indentWithTabs: true,
      //   extraKeys: {
      //     Tab: (cm) => {
      //       if (cm.somethingSelected()) {
      //         cm.indentSelection('add');
      //       } else {
      //         cm.replaceSelection('  ', 'end');
      //       }
      //     },
      //   },
      // });
      
      // Set up event listeners for CodeMirror
      // codeMirrorRef.current.on('change', (instance) => {
      //   const value = instance.getValue();
      //   editorState.setValue(value);
      // });
    }
    
    return () => {
      // Clean up CodeMirror instance on unmount
      if (codeMirrorRef.current) {
        // codeMirrorRef.current.toTextArea();
        // codeMirrorRef.current = null;
      }
    };
  }, [
    editorState.editorRef,
    editorState.language,
    editorState.theme,
    editorState.showLineNumbers,
    editorState.lineWrapping,
    editorState.tabSize,
    editorState.readOnly,
    editorState.disabled,
    editorState.autoCloseBrackets,
    editorState.matchBrackets,
    editorState.setValue
  ]);

  const { ...containerProps } = editorState.getContainerProps();

  return (
    <CodeEditorContext.Provider value={editorState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...containerProps}
      >
        {children || (
          <>
            {label && <CodeEditorLabel>{label}</CodeEditorLabel>}
            <div style={{ display: 'flex' }}>
              {editorState.showLineNumbers && <CodeEditorLineNumbers />}
              <CodeEditorContent />
            </div>
          </>
        )}
      </ElementType>
    </CodeEditorContext.Provider>
  );
}) as unknown as CodeEditorHeadlessComponent;

/**
 * The content element of the code editor.
 */
export const CodeEditorContent = forwardRef(function CodeEditorContent<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<CodeEditorContentProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getEditorProps, placeholder, value } = useCodeEditorContext();
  
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
    >
      {children || (
        <textarea
          defaultValue={value}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            fontFamily: 'monospace',
            padding: '8px',
          }}
        />
      )}
    </ElementType>
  );
}) as unknown as CodeEditorContentComponent;

/**
 * The label element of the code editor.
 */
export const CodeEditorLabel = forwardRef(function CodeEditorLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<CodeEditorLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { id } = useCodeEditorContext();
  
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
}) as unknown as CodeEditorLabelComponent;

/**
 * The line numbers element of the code editor.
 */
export const CodeEditorLineNumbers = forwardRef(function CodeEditorLineNumbers<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<CodeEditorLineNumbersProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { value } = useCodeEditorContext();
  
  // Calculate the number of lines
  const lineCount = value.split('\n').length;
  
  // Generate line numbers
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        width: '40px',
        textAlign: 'right',
        padding: '8px 4px',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #ddd',
        color: '#999',
        userSelect: 'none',
        fontFamily: 'monospace',
        ...style,
      }}
      aria-hidden="true"
      {...props}
    >
      {children || lineNumbers.map((num) => (
        <div key={num}>{num}</div>
      ))}
    </ElementType>
  );
}) as unknown as CodeEditorLineNumbersComponent;

// Add displayNames for better debugging
(CodeEditorHeadless as any).displayName = 'CodeEditorHeadless';
(CodeEditorContent as any).displayName = 'CodeEditorContent';
(CodeEditorLabel as any).displayName = 'CodeEditorLabel';
(CodeEditorLineNumbers as any).displayName = 'CodeEditorLineNumbers';

// Create a compound component
export const CodeEditor = Object.assign(CodeEditorHeadless, {
  Content: CodeEditorContent,
  Label: CodeEditorLabel,
  LineNumbers: CodeEditorLineNumbers,
});

export default CodeEditor;
