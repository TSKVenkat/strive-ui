import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface Tag {
  /**
   * Unique identifier for the tag
   */
  id: string;
  /**
   * Tag value
   */
  value: string;
  /**
   * Whether the tag is disabled
   */
  disabled?: boolean;
  /**
   * Additional data
   */
  [key: string]: any;
}

export interface UseTagInputProps {
  /**
   * Default tags (uncontrolled)
   */
  defaultTags?: Tag[];
  /**
   * Controlled tags
   */
  tags?: Tag[];
  /**
   * Default input value (uncontrolled)
   */
  defaultInputValue?: string;
  /**
   * Controlled input value
   */
  inputValue?: string;
  /**
   * Callback when tags change
   */
  onChange?: (tags: Tag[]) => void;
  /**
   * Callback when input value changes
   */
  onInputChange?: (value: string) => void;
  /**
   * Callback when a tag is added
   */
  onTagAdd?: (tag: Tag) => void;
  /**
   * Callback when a tag is removed
   */
  onTagRemove?: (tag: Tag) => void;
  /**
   * Whether the tag input is disabled
   */
  disabled?: boolean;
  /**
   * Whether the tag input is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the tag input is required
   */
  required?: boolean;
  /**
   * ID for the tag input element
   */
  id?: string;
  /**
   * Name attribute for the tag input
   */
  name?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Maximum number of tags
   */
  maxTags?: number;
  /**
   * Whether to allow duplicate tags
   */
  allowDuplicates?: boolean;
  /**
   * Whether to add tags on blur
   */
  addOnBlur?: boolean;
  /**
   * Delimiter characters that trigger tag creation
   */
  delimiters?: string[];
  /**
   * Function to validate a tag
   */
  validateTag?: (value: string) => boolean | string;
  /**
   * Function to transform a tag value before adding
   */
  transformTag?: (value: string) => string;
  /**
   * Callback when the input is focused
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when the input is blurred
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * Callback when a key is pressed in the input
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  /**
   * Callback when paste event occurs
   */
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
}

export interface UseTagInputReturn {
  /**
   * Current tags
   */
  tags: Tag[];
  /**
   * Current input value
   */
  inputValue: string;
  /**
   * Whether the tag input is disabled
   */
  disabled: boolean;
  /**
   * Whether the tag input is read-only
   */
  readOnly: boolean;
  /**
   * Whether the tag input is required
   */
  required: boolean;
  /**
   * Whether the tag input is focused
   */
  focused: boolean;
  /**
   * Index of the currently focused tag
   */
  focusedTagIndex: number;
  /**
   * Tag input ID
   */
  id: string;
  /**
   * Tag input name
   */
  name: string | undefined;
  /**
   * Placeholder text
   */
  placeholder: string | undefined;
  /**
   * Reference to the input element
   */
  inputRef: React.RefObject<HTMLInputElement>;
  /**
   * Reference to the container element
   */
  containerRef: React.RefObject<HTMLDivElement>;
  /**
   * Add a tag
   */
  addTag: (value: string) => boolean;
  /**
   * Remove a tag
   */
  removeTag: (tagOrIndex: Tag | number) => void;
  /**
   * Clear all tags
   */
  clearTags: () => void;
  /**
   * Set the input value
   */
  setInputValue: (value: string) => void;
  /**
   * Focus the input
   */
  focus: () => void;
  /**
   * Blur the input
   */
  blur: () => void;
  /**
   * Get props for the tag input container element
   */
  getContainerProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for the input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
  /**
   * Get props for a tag element
   */
  getTagProps: <E extends HTMLDivElement = HTMLDivElement>(
    tagOrIndex: Tag | number,
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
  /**
   * Get props for a tag remove button
   */
  getTagRemoveProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    tagOrIndex: Tag | number,
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
}

/**
 * Hook for creating tag input functionality.
 */
export function useTagInput({
  defaultTags = [],
  tags: controlledTags,
  defaultInputValue = '',
  inputValue: controlledInputValue,
  onChange,
  onInputChange,
  onTagAdd,
  onTagRemove,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  placeholder = 'Add tags...',
  maxTags,
  allowDuplicates = false,
  addOnBlur = true,
  delimiters = [',', 'Enter'],
  validateTag,
  transformTag,
  onFocus,
  onBlur,
  onKeyDown,
  onPaste,
}: UseTagInputProps = {}): UseTagInputReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const tagInputId = id || `tag-input-${generatedId}`;
  
  // State for tag input
  const [internalTags, setInternalTags] = useState<Tag[]>(defaultTags);
  const [internalInputValue, setInternalInputValue] = useState<string>(defaultInputValue);
  const [focused, setFocused] = useState<boolean>(false);
  const [focusedTagIndex, setFocusedTagIndex] = useState<number>(-1);
  
  // Use controlled or uncontrolled values
  const tags = controlledTags !== undefined ? controlledTags : internalTags;
  const inputValue = controlledInputValue !== undefined ? controlledInputValue : internalInputValue;
  
  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate a unique ID for a tag
  const generateTagId = useCallback(() => {
    return `${tagInputId}-tag-${Math.random().toString(36).substring(2, 11)}`;
  }, [tagInputId]);
  
  // Set the input value
  const setInputValueInternal = useCallback((newValue: string) => {
    // Update internal state for uncontrolled component
    if (controlledInputValue === undefined) {
      setInternalInputValue(newValue);
    }
    
    // Call onInputChange callback
    if (onInputChange) {
      onInputChange(newValue);
    }
  }, [controlledInputValue, onInputChange]);
  
  // Validate a tag value
  const validateTagValue = useCallback((value: string): boolean | string => {
    // Trim the value
    const trimmedValue = value.trim();
    
    // Check if the value is empty
    if (!trimmedValue) {
      return false;
    }
    
    // Check if we've reached the maximum number of tags
    if (maxTags !== undefined && tags.length >= maxTags) {
      return 'Maximum number of tags reached';
    }
    
    // Check for duplicates
    if (!allowDuplicates && tags.some(tag => tag.value === trimmedValue)) {
      return 'Duplicate tag';
    }
    
    // Custom validation
    if (validateTag) {
      return validateTag(trimmedValue);
    }
    
    return true;
  }, [maxTags, tags, allowDuplicates, validateTag]);
  
  // Transform a tag value
  const transformTagValue = useCallback((value: string): string => {
    // Trim the value
    let transformedValue = value.trim();
    
    // Custom transformation
    if (transformTag) {
      transformedValue = transformTag(transformedValue);
    }
    
    return transformedValue;
  }, [transformTag]);
  
  // Add a tag
  const addTag = useCallback((value: string): boolean => {
    if (disabled || readOnly) {
      return false;
    }
    
    // Transform the value
    const transformedValue = transformTagValue(value);
    
    // Validate the tag
    const validationResult = validateTagValue(transformedValue);
    
    // If validation failed, return false
    if (validationResult !== true) {
      return false;
    }
    
    // Create the new tag
    const newTag: Tag = {
      id: generateTagId(),
      value: transformedValue,
    };
    
    // Update internal state for uncontrolled component
    if (controlledTags === undefined) {
      setInternalTags(prevTags => [...prevTags, newTag]);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange([...tags, newTag]);
    }
    
    // Call onTagAdd callback
    if (onTagAdd) {
      onTagAdd(newTag);
    }
    
    // Clear the input value
    setInputValueInternal('');
    
    return true;
  }, [
    disabled, 
    readOnly, 
    transformTagValue, 
    validateTagValue, 
    generateTagId, 
    controlledTags, 
    onChange, 
    onTagAdd, 
    tags, 
    setInputValueInternal
  ]);
  
  // Remove a tag
  const removeTag = useCallback((tagOrIndex: Tag | number) => {
    if (disabled || readOnly) {
      return;
    }
    
    // Get the tag and index
    let tagToRemove: Tag;
    let indexToRemove: number;
    
    if (typeof tagOrIndex === 'number') {
      indexToRemove = tagOrIndex;
      tagToRemove = tags[indexToRemove];
    } else {
      tagToRemove = tagOrIndex;
      indexToRemove = tags.findIndex(tag => tag.id === tagToRemove.id);
    }
    
    // If the tag doesn't exist or is disabled, return
    if (indexToRemove === -1 || tagToRemove.disabled) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledTags === undefined) {
      setInternalTags(prevTags => prevTags.filter((_, i) => i !== indexToRemove));
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(tags.filter((_, i) => i !== indexToRemove));
    }
    
    // Call onTagRemove callback
    if (onTagRemove) {
      onTagRemove(tagToRemove);
    }
    
    // Focus the input
    focus();
  }, [disabled, readOnly, tags, controlledTags, onChange, onTagRemove, focus]);
  
  // Clear all tags
  const clearTags = useCallback(() => {
    if (disabled || readOnly) {
      return;
    }
    
    // Update internal state for uncontrolled component
    if (controlledTags === undefined) {
      setInternalTags([]);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange([]);
    }
    
    // Focus the input
    focus();
  }, [disabled, readOnly, controlledTags, onChange, focus]);
  
  // Focus the input
  const focus = useCallback(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);
  
  // Blur the input
  const blur = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);
  
  // Handle input focus
  const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    setFocusedTagIndex(-1);
    
    // Call onFocus callback
    if (onFocus) {
      onFocus(event);
    }
  }, [onFocus]);
  
  // Handle input blur
  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    
    // Add tag on blur if enabled
    if (addOnBlur && inputValue) {
      addTag(inputValue);
    }
    
    // Call onBlur callback
    if (onBlur) {
      onBlur(event);
    }
  }, [addOnBlur, inputValue, addTag, onBlur]);
  
  // Handle input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValueInternal(event.target.value);
  }, [setInputValueInternal]);
  
  // Handle key down events
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    // Call onKeyDown callback
    if (onKeyDown) {
      onKeyDown(event);
      
      // If the event was prevented, return
      if (event.defaultPrevented) {
        return;
      }
    }
    
    // Check if the key is a delimiter
    const isDelimiter = delimiters.includes(event.key);
    
    if (isDelimiter && inputValue) {
      // Prevent default behavior for Enter key
      if (event.key === 'Enter') {
        event.preventDefault();
      }
      
      // Add the tag
      addTag(inputValue);
    } else if (event.key === 'Backspace' && !inputValue && tags.length > 0) {
      // If the input is empty and the user presses Backspace, remove the last tag
      const lastTag = tags[tags.length - 1];
      
      if (!lastTag.disabled) {
        removeTag(tags.length - 1);
      }
    } else if (event.key === 'ArrowLeft' && !inputValue && focusedTagIndex === -1 && tags.length > 0) {
      // If the input is empty and the user presses ArrowLeft, focus the last tag
      setFocusedTagIndex(tags.length - 1);
    } else if (event.key === 'Escape') {
      // If the user presses Escape, blur the input
      blur();
    }
  }, [
    onKeyDown, 
    delimiters, 
    inputValue, 
    tags, 
    focusedTagIndex, 
    addTag, 
    removeTag, 
    blur
  ]);
  
  // Handle tag key down events
  const handleTagKeyDown = useCallback((index: number, event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowRight':
        // If the user presses ArrowRight on the last tag, focus the input
        if (index === tags.length - 1) {
          focus();
          setFocusedTagIndex(-1);
        } else {
          // Otherwise, focus the next tag
          setFocusedTagIndex(index + 1);
        }
        break;
      case 'ArrowLeft':
        // If the user presses ArrowLeft on the first tag, do nothing
        if (index > 0) {
          // Otherwise, focus the previous tag
          setFocusedTagIndex(index - 1);
        }
        break;
      case 'Delete':
      case 'Backspace':
        // If the user presses Delete or Backspace, remove the tag
        if (!tags[index].disabled) {
          removeTag(index);
          
          // Focus the previous tag or the input
          if (index > 0) {
            setFocusedTagIndex(index - 1);
          } else {
            focus();
            setFocusedTagIndex(-1);
          }
        }
        break;
      case 'Escape':
        // If the user presses Escape, focus the input
        focus();
        setFocusedTagIndex(-1);
        break;
    }
  }, [tags, focus, removeTag]);
  
  // Handle paste events
  const handlePaste = useCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    // Call onPaste callback
    if (onPaste) {
      onPaste(event);
      
      // If the event was prevented, return
      if (event.defaultPrevented) {
        return;
      }
    }
    
    // Get the pasted text
    const pastedText = event.clipboardData.getData('text/plain');
    
    // If the pasted text contains a delimiter, split it and add each part as a tag
    const hasDelimiter = delimiters
      .filter(delimiter => delimiter !== 'Enter')
      .some(delimiter => pastedText.includes(delimiter));
    
    if (hasDelimiter) {
      // Prevent the default paste behavior
      event.preventDefault();
      
      // Split the pasted text by delimiters
      const regex = new RegExp(`[${delimiters.filter(d => d !== 'Enter').join('')}]`);
      const parts = pastedText.split(regex);
      
      // Add each part as a tag
      parts.forEach(part => {
        if (part.trim()) {
          addTag(part);
        }
      });
    }
  }, [onPaste, delimiters, addTag]);
  
  // Get props for the tag input container element
  const getContainerProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(containerRef, props?.ref),
      id: tagInputId,
      role: 'group',
      'aria-labelledby': props?.['aria-labelledby'],
      'aria-label': props?.['aria-label'] || 'Tag input',
      onClick: (event: React.MouseEvent<E>) => {
        // If the user clicks on the container, focus the input
        if (event.target === event.currentTarget) {
          focus();
        }
        props?.onClick?.(event as any);
      },
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
      'data-focused': focused ? '' : undefined,
      'data-empty': tags.length === 0 ? '' : undefined,
    };
  }, [
    tagInputId, 
    disabled, 
    readOnly, 
    required, 
    focused, 
    tags.length, 
    focus
  ]);
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(inputRef, props?.ref),
      id: `${tagInputId}-input`,
      value: inputValue,
      placeholder: tags.length === 0 ? placeholder : props?.placeholder,
      disabled,
      readOnly,
      required: required && tags.length === 0,
      name,
      onChange: (event: React.ChangeEvent<E>) => {
        handleInputChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
        props?.onChange?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        handleFocus(event as unknown as React.FocusEvent<HTMLInputElement>);
        props?.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        handleBlur(event as unknown as React.FocusEvent<HTMLInputElement>);
        props?.onBlur?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        handleKeyDown(event as unknown as React.KeyboardEvent<HTMLInputElement>);
        props?.onKeyDown?.(event);
      },
      onPaste: (event: React.ClipboardEvent<E>) => {
        handlePaste(event as unknown as React.ClipboardEvent<HTMLInputElement>);
        props?.onPaste?.(event);
      },
      'aria-autocomplete': 'list',
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
      'data-focused': focused ? '' : undefined,
    };
  }, [
    tagInputId, 
    inputValue, 
    placeholder, 
    tags.length, 
    disabled, 
    readOnly, 
    required, 
    name, 
    focused, 
    handleInputChange, 
    handleFocus, 
    handleBlur, 
    handleKeyDown, 
    handlePaste
  ]);
  
  // Get props for a tag element
  const getTagProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    tagOrIndex: Tag | number,
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    // Get the tag and index
    const tag = typeof tagOrIndex === 'number' ? tags[tagOrIndex] : tagOrIndex;
    const index = typeof tagOrIndex === 'number' ? tagOrIndex : tags.findIndex(t => t.id === tag.id);
    
    // If the tag doesn't exist, return empty props
    if (!tag) {
      return props || {};
    }
    
    return {
      ...props,
      id: `${tagInputId}-tag-${index}`,
      role: 'listitem',
      tabIndex: focusedTagIndex === index ? 0 : -1,
      'aria-disabled': tag.disabled ? true : undefined,
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        handleTagKeyDown(index, event as unknown as React.KeyboardEvent<HTMLDivElement>);
        props?.onKeyDown?.(event);
      },
      onFocus: (event: React.FocusEvent<E>) => {
        setFocusedTagIndex(index);
        props?.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<E>) => {
        setFocusedTagIndex(-1);
        props?.onBlur?.(event);
      },
      'data-disabled': tag.disabled ? '' : undefined,
      'data-focused': focusedTagIndex === index ? '' : undefined,
    };
  }, [tagInputId, tags, focusedTagIndex, handleTagKeyDown]);
  
  // Get props for a tag remove button
  const getTagRemoveProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    tagOrIndex: Tag | number,
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    // Get the tag and index
    const tag = typeof tagOrIndex === 'number' ? tags[tagOrIndex] : tagOrIndex;
    const index = typeof tagOrIndex === 'number' ? tagOrIndex : tags.findIndex(t => t.id === tag.id);
    
    // If the tag doesn't exist, return empty props
    if (!tag) {
      return props || {};
    }
    
    return {
      ...props,
      type: 'button',
      'aria-label': `Remove ${tag.value}`,
      tabIndex: -1,
      disabled: disabled || readOnly || tag.disabled || props?.disabled,
      onClick: (event: React.MouseEvent<E>) => {
        event.stopPropagation();
        removeTag(index);
        props?.onClick?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          removeTag(index);
        }
        props?.onKeyDown?.(event);
      },
      'data-disabled': (disabled || readOnly || tag.disabled) ? '' : undefined,
    };
  }, [tags, disabled, readOnly, removeTag]);
  
  return {
    tags,
    inputValue,
    disabled,
    readOnly,
    required,
    focused,
    focusedTagIndex,
    id: tagInputId,
    name,
    placeholder,
    inputRef,
    containerRef,
    addTag,
    removeTag,
    clearTags,
    setInputValue: setInputValueInternal,
    focus,
    blur,
    getContainerProps,
    getInputProps,
    getTagProps,
    getTagRemoveProps,
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
