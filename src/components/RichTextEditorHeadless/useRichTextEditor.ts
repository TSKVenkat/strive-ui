import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface UseRichTextEditorProps {
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
   * Available toolbar options
   */
  toolbarOptions?: ToolbarOption[];
  /**
   * Maximum character count
   */
  maxLength?: number;
  /**
   * Callback when editor is focused
   */
  onFocus?: (event: React.FocusEvent) => void;
  /**
   * Callback when editor is blurred
   */
  onBlur?: (event: React.FocusEvent) => void;
  /**
   * Callback when a file is pasted or dropped
   */
  onFileUpload?: (file: File) => Promise<string>;
}

export type ToolbarOption =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'blockquote'
  | 'code-block'
  | 'header'
  | 'list'
  | 'bullet'
  | 'indent'
  | 'link'
  | 'image'
  | 'align'
  | 'color'
  | 'background'
  | 'clean';

export interface UseRichTextEditorReturn {
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
   * Available toolbar options
   */
  toolbarOptions: ToolbarOption[];
  /**
   * Maximum character count
   */
  maxLength: number | undefined;
  /**
   * Current character count
   */
  charCount: number;
  /**
   * Reference to the editor container element
   */
  containerRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the editor element
   */
  editorRef: React.RefObject<any>;
  /**
   * Reference to the toolbar element
   */
  toolbarRef: React.RefObject<HTMLDivElement>;
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
   * Format text with the given format
   */
  formatText: (format: string, value?: any) => void;
  /**
   * Insert text at the current cursor position
   */
  insertText: (text: string) => void;
  /**
   * Insert an embed at the current cursor position
   */
  insertEmbed: (type: string, value: any) => void;
  /**
   * Get the current selection range
   */
  getSelection: () => { index: number; length: number } | null;
  /**
   * Set the selection range
   */
  setSelection: (index: number, length: number) => void;
  /**
   * Get the current format at the cursor
   */
  getFormat: () => Record<string, any>;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the toolbar element
   */
  getToolbarProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the editor element
   */
  getEditorProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for a toolbar button
   */
  getToolbarButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props: {
      format: string;
      value?: any;
    } & React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
}

/**
 * Hook for creating rich text editor functionality.
 * 
 * Note: This hook is meant to be used with a rich text editor library like Quill.
 * The implementation details will depend on the specific library being used.
 */
export function useRichTextEditor({
  defaultValue = '',
  value: controlledValue,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  placeholder,
  id,
  name,
  toolbarOptions = [
    'bold', 'italic', 'underline', 'strike', 
    'blockquote', 'code-block', 'header', 
    'list', 'bullet', 'indent', 'link', 
    'image', 'align', 'color', 'background', 'clean'
  ],
  maxLength,
  onFocus,
  onBlur,
  onFileUpload,
}: UseRichTextEditorProps = {}): UseRichTextEditorReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const editorId = id || `rich-text-editor-${generatedId}`;
  
  // State for values
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [focused, setFocused] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(
    defaultValue ? countCharacters(defaultValue) : 0
  );
  
  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Refs for DOM elements
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  
  // Set value
  const setValue = useCallback((newValue: string) => {
    // Check if the value exceeds the maximum length
    if (maxLength !== undefined) {
      const newCharCount = countCharacters(newValue);
      if (newCharCount > maxLength) {
        return;
      }
      setCharCount(newCharCount);
    }
    
    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(newValue);
    }
  }, [maxLength, controlledValue, onChange]);
  
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
  
  // Format text with the given format
  const formatText = useCallback((format: string, value?: any) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        editorRef.current.formatText(selection.index, selection.length, { [format]: value });
      }
    }
  }, []);
  
  // Insert text at the current cursor position
  const insertText = useCallback((text: string) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        editorRef.current.insertText(selection.index, text);
      }
    }
  }, []);
  
  // Insert an embed at the current cursor position
  const insertEmbed = useCallback((type: string, value: any) => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        editorRef.current.insertEmbed(selection.index, type, value);
      }
    }
  }, []);
  
  // Get the current selection range
  const getSelection = useCallback(() => {
    if (editorRef.current) {
      return editorRef.current.getSelection();
    }
    return null;
  }, []);
  
  // Set the selection range
  const setSelection = useCallback((index: number, length: number) => {
    if (editorRef.current) {
      editorRef.current.setSelection(index, length);
    }
  }, []);
  
  // Get the current format at the cursor
  const getFormat = useCallback(() => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      if (selection) {
        return editorRef.current.getFormat(selection.index, selection.length);
      }
    }
    return {};
  }, []);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(containerRef, props?.ref),
      id: editorId,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
    };
  }, [editorId, disabled, readOnly, required]);
  
  // Get props for the toolbar element
  const getToolbarProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(toolbarRef, props?.ref),
      role: 'toolbar',
      'aria-label': 'Formatting options',
      'aria-disabled': disabled || readOnly ? true : undefined,
    };
  }, [disabled, readOnly]);
  
  // Get props for the editor element
  const getEditorProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(editorRef, props?.ref),
      role: 'textbox',
      'aria-multiline': true,
      'aria-label': props?.['aria-label'] || 'Rich text editor',
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
    };
  }, [disabled, readOnly, required, onFocus, onBlur]);
  
  // Get props for a toolbar button
  const getToolbarButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props: {
      format: string;
      value?: any;
    } & React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    const { format, value, ...restProps } = props;
    
    // Get the current format to determine if the button is active
    const currentFormat = getFormat();
    const isActive = currentFormat[format] !== undefined && 
      (value === undefined || currentFormat[format] === value);
    
    return {
      ...restProps,
      type: 'button',
      disabled: disabled || readOnly,
      'aria-pressed': isActive ? true : undefined,
      'data-active': isActive ? '' : undefined,
      onClick: (event: React.MouseEvent<E>) => {
        formatText(format, value);
        restProps.onClick?.(event);
      },
    };
  }, [disabled, readOnly, getFormat, formatText]);
  
  return {
    value,
    disabled,
    readOnly,
    required,
    focused,
    id: editorId,
    name,
    placeholder,
    toolbarOptions,
    maxLength,
    charCount,
    containerRef,
    editorRef,
    toolbarRef,
    setValue,
    focus,
    blur,
    clear,
    formatText,
    insertText,
    insertEmbed,
    getSelection,
    setSelection,
    getFormat,
    getContainerProps,
    getToolbarProps,
    getEditorProps,
    getToolbarButtonProps,
  };
}

// Helper function to count characters in HTML content
function countCharacters(html: string): number {
  // Create a temporary div to parse the HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Get the text content (without HTML tags)
  const textContent = tempDiv.textContent || '';
  
  return textContent.length;
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
