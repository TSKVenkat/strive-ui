import React, { createContext, useContext, forwardRef } from 'react';
import { useTagInput, UseTagInputReturn, Tag } from './useTagInput';

// Define the props for the TagInput component
export interface TagInputProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the TagInput
export interface TagInputContextValue extends UseTagInputReturn {}

const TagInputContext = createContext<TagInputContextValue | undefined>(undefined);

// Hook to use the TagInput context
export function useTagInputContext() {
  const context = useContext(TagInputContext);
  if (!context) {
    throw new Error('useTagInputContext must be used within a TagInputProvider');
  }
  return context;
}

// Root component
export const TagInputRoot = forwardRef<HTMLDivElement, TagInputProps>(
  (
    {
      defaultTags,
      tags,
      defaultInputValue,
      inputValue,
      onChange,
      onInputChange,
      onTagAdd,
      onTagRemove,
      disabled,
      readOnly,
      required,
      id,
      name,
      placeholder,
      maxTags,
      allowDuplicates,
      addOnBlur,
      delimiters,
      validateTag,
      transformTag,
      onFocus,
      onBlur,
      onKeyDown,
      onPaste,
      children,
      ...props
    },
    ref
  ) => {
    // Use the tag input hook
    const tagInput = useTagInput({
      defaultTags,
      tags,
      defaultInputValue,
      inputValue,
      onChange,
      onInputChange,
      onTagAdd,
      onTagRemove,
      disabled,
      readOnly,
      required,
      id,
      name,
      placeholder,
      maxTags,
      allowDuplicates,
      addOnBlur,
      delimiters,
      validateTag,
      transformTag,
      onFocus,
      onBlur,
      onKeyDown,
      onPaste,
    });

    // Get container props
    const containerProps = tagInput.getContainerProps({ ...props, ref });

    return (
      <TagInputContext.Provider value={tagInput}>
        <div {...containerProps}>
          {children || (
            <>
              <TagInputTagList>
                {tagInput.tags.map((tag, index) => (
                  <TagInputTag key={tag.id} tag={tag}>
                    {tag.value}
                    <TagInputTagRemove tag={tag} />
                  </TagInputTag>
                ))}
              </TagInputTagList>
              <TagInputInput />
              {tagInput.tags.length > 0 && <TagInputClearButton />}
            </>
          )}
        </div>
      </TagInputContext.Provider>
    );
  }
);

TagInputRoot.displayName = 'TagInput';

// Input component
export interface TagInputInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const TagInputInput = forwardRef<HTMLInputElement, TagInputInputProps>(
  (props, ref) => {
    const { getInputProps } = useTagInputContext();
    const inputProps = getInputProps({ ...props, ref });

    return <input {...inputProps} />;
  }
);

TagInputInput.displayName = 'TagInput.Input';

// Tag list component
export interface TagInputTagListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const TagInputTagList = forwardRef<HTMLDivElement, TagInputTagListProps>(
  ({ children, ...props }, ref) => {
    return (
      <div role="list" {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

TagInputTagList.displayName = 'TagInput.TagList';

// Tag component
export interface TagInputTagProps extends React.HTMLAttributes<HTMLDivElement> {
  tag: Tag;
  children?: React.ReactNode;
}

export const TagInputTag = forwardRef<HTMLDivElement, TagInputTagProps>(
  ({ tag, children, ...props }, ref) => {
    const { getTagProps } = useTagInputContext();
    const tagProps = getTagProps(tag, { ...props, ref });

    return <div {...tagProps}>{children}</div>;
  }
);

TagInputTag.displayName = 'TagInput.Tag';

// Tag remove component
export interface TagInputTagRemoveProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tag: Tag;
  children?: React.ReactNode;
}

export const TagInputTagRemove = forwardRef<HTMLButtonElement, TagInputTagRemoveProps>(
  ({ tag, children, ...props }, ref) => {
    const { getTagRemoveProps } = useTagInputContext();
    const tagRemoveProps = getTagRemoveProps(tag, { ...props, ref });

    return (
      <button {...tagRemoveProps}>
        {children || (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        )}
      </button>
    );
  }
);

TagInputTagRemove.displayName = 'TagInput.TagRemove';

// Clear button component
export interface TagInputClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const TagInputClearButton = forwardRef<HTMLButtonElement, TagInputClearButtonProps>(
  ({ children, ...props }, ref) => {
    const { clearTags, disabled, readOnly, tags } = useTagInputContext();

    return (
      <button
        type="button"
        {...props}
        ref={ref}
        onClick={(e) => {
          clearTags();
          props.onClick?.(e);
        }}
        disabled={disabled || readOnly || tags.length === 0 || props.disabled}
        aria-label="Clear all tags"
      >
        {children || (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        )}
      </button>
    );
  }
);

TagInputClearButton.displayName = 'TagInput.ClearButton';

// Create the TagInput component with all its subcomponents
export const TagInputHeadless = Object.assign(TagInputRoot, {
  Input: TagInputInput,
  TagList: TagInputTagList,
  Tag: TagInputTag,
  TagRemove: TagInputTagRemove,
  ClearButton: TagInputClearButton,
});

export default TagInputHeadless;
