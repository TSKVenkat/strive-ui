# TagInputHeadless

A headless tag input component that provides all the functionality for creating and managing tags or tokens without enforcing any specific styling.

## Features

- Add tags by typing and pressing Enter or delimiter keys
- Remove tags with backspace or delete keys
- Keyboard navigation between tags
- Paste support for multiple tags
- Validation and transformation of tags
- Fully accessible

## Usage

### Basic Usage

```jsx
import { TagInput } from '@pulseui/tag-input';

function MyComponent() {
  return (
    <TagInput 
      placeholder="Add tags..."
      onChange={(tags) => console.log('Tags:', tags)}
    />
  );
}
```

### Controlled TagInput

```jsx
import { useState } from 'react';
import { TagInput } from '@pulseui/tag-input';

function ControlledTagInput() {
  const [tags, setTags] = useState([]);
  
  return (
    <div>
      <TagInput 
        tags={tags} 
        onChange={setTags}
        placeholder="Add tags..."
      />
      <div>
        <h3>Selected Tags:</h3>
        <ul>
          {tags.map(tag => (
            <li key={tag.id}>{tag.value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### With Custom Delimiters

```jsx
import { TagInput } from '@pulseui/tag-input';

function TagInputWithCustomDelimiters() {
  return (
    <TagInput 
      placeholder="Add tags (separate with space, comma, or Enter)..."
      delimiters={[' ', ',', 'Enter']}
    />
  );
}
```

### With Validation

```jsx
import { TagInput } from '@pulseui/tag-input';

function ValidatedTagInput() {
  // Validate that the tag is at least 3 characters long
  const validateTag = (value) => {
    if (value.length < 3) {
      return 'Tag must be at least 3 characters long';
    }
    return true;
  };
  
  return (
    <TagInput 
      placeholder="Add tags (min 3 characters)..."
      validateTag={validateTag}
    />
  );
}
```

### With Transformation

```jsx
import { TagInput } from '@pulseui/tag-input';

function TransformedTagInput() {
  // Transform tag to lowercase
  const transformTag = (value) => {
    return value.toLowerCase();
  };
  
  return (
    <TagInput 
      placeholder="Add tags (will be converted to lowercase)..."
      transformTag={transformTag}
    />
  );
}
```

### With Maximum Tags

```jsx
import { TagInput } from '@pulseui/tag-input';

function LimitedTagInput() {
  return (
    <TagInput 
      placeholder="Add up to 5 tags..."
      maxTags={5}
    />
  );
}
```

### Disabled State

```jsx
import { TagInput } from '@pulseui/tag-input';

function DisabledTagInput() {
  return (
    <TagInput 
      placeholder="Tags cannot be added or removed"
      disabled
      defaultTags={[
        { id: '1', value: 'React' },
        { id: '2', value: 'TypeScript' },
      ]}
    />
  );
}
```

### With Disabled Tags

```jsx
import { TagInput } from '@pulseui/tag-input';

function TagInputWithDisabledTags() {
  const defaultTags = [
    { id: '1', value: 'React' },
    { id: '2', value: 'TypeScript', disabled: true },
    { id: '3', value: 'JavaScript' },
  ];
  
  return (
    <TagInput 
      placeholder="Add tags..."
      defaultTags={defaultTags}
    />
  );
}
```

### Custom Styling

```jsx
import { TagInput } from '@pulseui/tag-input';

function CustomStyledTagInput() {
  return (
    <TagInput
      placeholder="Add tags..."
      style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '8px',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        minHeight: '40px',
      }}
    >
      <TagInput.TagList
        style={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {(context) => 
          context.tags.map((tag) => (
            <TagInput.Tag
              key={tag.id}
              tag={tag}
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: tag.disabled ? '#f1f5f9' : '#e0f2fe',
                color: tag.disabled ? '#94a3b8' : '#0284c7',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: tag.disabled ? 'not-allowed' : 'default',
                '[data-focused]': {
                  outline: '2px solid #0284c7',
                  outlineOffset: '1px',
                },
              }}
            >
              {tag.value}
              {!tag.disabled && (
                <TagInput.TagRemove
                  tag={tag}
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    padding: 0,
                    border: 'none',
                    background: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    opacity: 0.7,
                    ':hover': {
                      opacity: 1,
                    },
                  }}
                />
              )}
            </TagInput.Tag>
          ))
        }
      </TagInput.TagList>
      
      <TagInput.Input
        style={{ 
          flex: '1 0 120px',
          minWidth: '120px',
          border: 'none',
          outline: 'none',
          padding: '4px 0',
          fontSize: '14px',
        }}
      />
      
      <TagInput.ClearButton
        style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          padding: 0,
          border: 'none',
          background: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          ':hover': {
            color: '#64748b',
          },
        }}
      />
    </TagInput>
  );
}
```

### Using the Hook Directly

```jsx
import { useTagInput } from '@pulseui/tag-input';

function CustomTagInput() {
  const {
    tags,
    inputValue,
    addTag,
    removeTag,
    clearTags,
    getContainerProps,
    getInputProps,
    getTagProps,
    getTagRemoveProps,
  } = useTagInput({
    defaultTags: [
      { id: '1', value: 'React' },
      { id: '2', value: 'TypeScript' },
    ],
    placeholder: 'Add tags...',
  });
  
  return (
    <div>
      <div {...getContainerProps({ className: 'tag-input-container' })}>
        <div className="tag-list">
          {tags.map((tag) => (
            <div key={tag.id} {...getTagProps(tag, { className: 'tag' })}>
              {tag.value}
              <button {...getTagRemoveProps(tag, { className: 'tag-remove' })}>
                ×
              </button>
            </div>
          ))}
        </div>
        
        <input {...getInputProps({ className: 'tag-input' })} />
        
        <button 
          onClick={clearTags} 
          disabled={tags.length === 0}
          className="clear-button"
        >
          Clear All
        </button>
      </div>
      
      <div className="tag-input-controls">
        <button onClick={() => addTag('New Tag')}>Add Tag</button>
      </div>
    </div>
  );
}
```

## API Reference

### TagInput (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultTags | Tag[] | [] | Default tags (uncontrolled) |
| tags | Tag[] | - | Controlled tags |
| defaultInputValue | string | '' | Default input value (uncontrolled) |
| inputValue | string | - | Controlled input value |
| onChange | (tags: Tag[]) => void | - | Callback when tags change |
| onInputChange | (value: string) => void | - | Callback when input value changes |
| onTagAdd | (tag: Tag) => void | - | Callback when a tag is added |
| onTagRemove | (tag: Tag) => void | - | Callback when a tag is removed |
| disabled | boolean | false | Whether the tag input is disabled |
| readOnly | boolean | false | Whether the tag input is read-only |
| required | boolean | false | Whether the tag input is required |
| id | string | auto-generated | ID for the tag input element |
| name | string | - | Name attribute for the tag input |
| placeholder | string | 'Add tags...' | Placeholder text |
| maxTags | number | - | Maximum number of tags |
| allowDuplicates | boolean | false | Whether to allow duplicate tags |
| addOnBlur | boolean | true | Whether to add tags on blur |
| delimiters | string[] | [',', 'Enter'] | Delimiter characters that trigger tag creation |
| validateTag | (value: string) => boolean \| string | - | Function to validate a tag |
| transformTag | (value: string) => string | - | Function to transform a tag value before adding |
| onFocus | (event: React.FocusEvent) => void | - | Callback when the input is focused |
| onBlur | (event: React.FocusEvent) => void | - | Callback when the input is blurred |
| onKeyDown | (event: React.KeyboardEvent) => void | - | Callback when a key is pressed in the input |
| onPaste | (event: React.ClipboardEvent) => void | - | Callback when paste event occurs |

### Tag Interface

| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier for the tag |
| value | string | Tag value |
| disabled | boolean | Whether the tag is disabled |
| [key: string] | any | Additional data |

### Compound Components

The TagInput component uses a compound component pattern, providing the following sub-components:

- `TagInput.Input` - Input element for entering new tags
- `TagInput.TagList` - Container for the tags
- `TagInput.Tag` - Individual tag element
- `TagInput.TagRemove` - Button to remove a tag
- `TagInput.ClearButton` - Button to clear all tags

### Data Attributes

The TagInput component and its sub-components expose several data attributes that can be used for styling:

- `data-disabled`: Present when the tag input is disabled
- `data-readonly`: Present when the tag input is read-only
- `data-required`: Present when the tag input is required
- `data-focused`: Present when the input is focused
- `data-empty`: Present when there are no tags

### Hooks

#### useTagInput

```jsx
import { useTagInput } from '@pulseui/tag-input';

function MyCustomTagInput() {
  const {
    tags,
    inputValue,
    disabled,
    readOnly,
    required,
    focused,
    focusedTagIndex,
    id,
    name,
    placeholder,
    inputRef,
    containerRef,
    addTag,
    removeTag,
    clearTags,
    setInputValue,
    focus,
    blur,
    getContainerProps,
    getInputProps,
    getTagProps,
    getTagRemoveProps,
  } = useTagInput({
    defaultTags: [
      { id: '1', value: 'React' },
      { id: '2', value: 'TypeScript' },
    ],
    placeholder: 'Add tags...',
  });
  
  // Build your custom tag input UI
}
```
