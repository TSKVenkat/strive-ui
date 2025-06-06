import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface UseCodeEditorProps {
  /**
   * Default value (uncontrolled)
   */
  defaultValue?: string;
  /**
   * Controlled value
   */
  value?: string;
  /**
   * Callback when value changes
   */
  onChange?: (value: string) => void;
  /**
   * Whether the editor is disabled
   */
  disabled?: boolean;
  /**
   * Whether the editor is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the editor is required
   */
  required?: boolean;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * ID for the editor element
   */
  id?: string;
  /**
   * Name attribute for the editor
   */
  name?: string;
  /**
   * Programming language for syntax highlighting
   */
  language?: string;
  /**
   * Theme for the editor
   */
  theme?: 'light' | 'dark' | string;
  /**
   * Whether to show line numbers
   */
  showLineNumbers?: boolean;
  /**
   * Whether to enable line wrapping
   */
  lineWrapping?: boolean;
  /**
   * Tab size in spaces
   */
  tabSize?: number;
  /**
   * Whether to auto-close brackets
   */
  autoCloseBrackets?: boolean;
  /**
   * Whether to highlight matching brackets
   */
  matchBrackets?: boolean;
  /**
   * Whether to enable auto-indentation
   */
  autoIndent?: boolean;
  /**
   * Callback when editor is focused
   */
  onFocus?: (event: React.FocusEvent) => void;
  /**
   * Callback when editor is blurred
   */
  onBlur?: (event: React.FocusEvent) => void;
}

export interface UseCodeEditorReturn {
  /**
   * Current value
   */
  value: string;
  /**
   * Whether the editor is disabled
   */
  disabled: boolean;
  /**
   * Whether the editor is read-only
   */
  readOnly: boolean;
  /**
   * Whether the editor is required
   */
  required: boolean;
  /**
   * Whether the editor is focused
   */
  focused: boolean;
  /**
   * Editor ID
   */
  id: string;
  /**
   * Editor name
   */
  name: string | undefined;
  /**
   * Placeholder text
   */
  placeholder: string | undefined;
  /**
   * Programming language for syntax highlighting
   */
  language: string | undefined;
  /**
   * Theme for the editor
   */
  theme: string;
  /**
   * Whether to show line numbers
   */
  showLineNumbers: boolean;
  /**
   * Whether to enable line wrapping
   */
  lineWrapping: boolean;
  /**
   * Tab size in spaces
   */
  tabSize: number;
  /**
   * Whether to auto-close brackets
   */
  autoCloseBrackets: boolean;
  /**
   * Whether to highlight matching brackets
   */
  matchBrackets: boolean;
  /**
   * Whether to enable auto-indentation
   */
  autoIndent: boolean;
  /**
   * Reference to the editor container element
   */
  containerRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the editor element
   */
  editorRef: React.RefObject<any>;
  /**
   * Set the value
   */
  setValue: (value: string) => void;
  /**
   * Focus the editor
   */
  focus: () => void;
  /**
   * Blur the editor
   */
  blur: () => void;
  /**
   * Clear the editor
   */
  clear: () => void;
  /**
   * Insert text at the current cursor position
   */
  insertText: (text: string) => void;
  /**
   * Get the current selection range
   */
  getSelection: () => { from: number; to: number } | null;
  /**
   * Set the selection range
   */
  setSelection: (from: number, to: number) => void;
  /**
   * Get the current cursor position
   */
  getCursor: () => { line: number; ch: number } | null;
  /**
   * Set the cursor position
   */
  setCursor: (line: number, ch: number) => void;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E> & { ref?: React.Ref<E> }
  ) => React.HTMLAttributes<E> & { 'data-disabled'?: string; 'data-readonly'?: string; 'data-required'?: string };
  /**
   * Get props for the editor element
   */
  getEditorProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E> & { ref?: React.Ref<E> }
  ) => React.HTMLAttributes<E>;
}

/**
 * Hook for creating code editor functionality.
 * 
 * Note: This hook is meant to be used with a code editor library like CodeMirror.
 * The implementation details will depend on the specific library being used.
 */
export function useCodeEditor({
  defaultValue = '',
  value: controlledValue,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  placeholder,
  id,
  name,
  language,
  theme = 'light',
  showLineNumbers = true,
  lineWrapping = false,
  tabSize = 2,
  autoCloseBrackets = true,
  matchBrackets = true,
  autoIndent = true,
  onFocus,
  onBlur,
}: UseCodeEditorProps = {}): UseCodeEditorReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const editorId = id || `code-editor-${generatedId}`;
  
  // State for values
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [focused, setFocused] = useState<boolean>(false);
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  
  // Set value
  const setValue = useCallback((newValue: string) => {
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newValue);
    }
  }, [controlledValue, onChange]);
  
  // Focus the editor
  const focus = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);
  
  // Blur the editor
  const blur = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.blur();
    }
  }, []);
  
  // Clear the editor
  const clear = useCallback(() => {
    setValue('');
  }, [setValue]);
  
  // Insert text at the current cursor position
  const insertText = useCallback((text: string) => {
    if (editorRef.current) {
      const cursor = editorRef.current.getCursor();
      editorRef.current.replaceRange(text, cursor);
    }
  }, []);
  
  // Get the current selection range
  const getSelection = useCallback(() => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        return {
          from: editorRef.current.indexFromPos(selection.from),
          to: editorRef.current.indexFromPos(selection.to),
        };
      }
    }
    return null;
  }, []);
  
  // Set the selection range
  const setSelection = useCallback((from: number, to: number) => {
    if (editorRef.current) {
      const fromPos = editorRef.current.posFromIndex(from);
      const toPos = editorRef.current.posFromIndex(to);
      editorRef.current.setSelection(fromPos, toPos);
    }
  }, []);
  
  // Get the current cursor position
  const getCursor = useCallback(() => {
    if (editorRef.current) {
      return editorRef.current.getCursor();
    }
    return null;
  }, []);
  
  // Set the cursor position
  const setCursor = useCallback((line: number, ch: number) => {
    if (editorRef.current) {
      editorRef.current.setCursor({ line, ch });
    }
  }, []);
  
    // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.HTMLAttributes<E> & { 'data-disabled'?: string; 'data-readonly'?: string; 'data-required'?: string } => {
    return {
      ...props,
      ref: mergeRefs(containerRef, props?.ref) as any,
      id: editorId,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
    } as any;
  }, [editorId, disabled, readOnly, required]);

  // Get props for the editor element
  const getEditorProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E> & { ref?: React.Ref<E> }
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(editorRef, props?.ref) as any,
      role: 'textbox',
      'aria-multiline': true,
      'aria-label': props?.['aria-label'] || 'Code editor',
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'aria-required': required ? true : undefined,
      onFocus: (event: React.FocusEvent<E>) => {
        setFocused(true);
        props?.onFocus?.(event);
        onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        setFocused(false);
        props?.onBlur?.(event);
        onBlur?.(event);
      },
    } as any;
  }, [disabled, readOnly, required, onFocus, onBlur]);
  
  return {
    value,
    disabled,
    readOnly,
    required,
    focused,
    id: editorId,
    name,
    placeholder,
    language,
    theme,
    showLineNumbers,
    lineWrapping,
    tabSize,
    autoCloseBrackets,
    matchBrackets,
    autoIndent,
    containerRef,
    editorRef,
    setValue,
    focus,
    blur,
    clear,
    insertText,
    getSelection,
    setSelection,
    getCursor,
    setCursor,
    getContainerProps,
    getEditorProps,
  };
}

// Helper function to merge refs
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
}
