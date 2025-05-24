# RichTextEditorHeadless

A headless rich text editor component that provides all the functionality for rich text editing without enforcing any specific styling.

## Features

- WYSIWYG editing experience
- Customizable toolbar options
- Support for text formatting, lists, links, images, and more
- Character count and maximum length support
- Fully accessible
- Supports both controlled and uncontrolled modes

## Usage

### Basic Usage

```jsx
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function MyComponent() {
  return (
    <RichTextEditor 
      label="Description" 
      placeholder="Enter your description here..."
      defaultValue=""
    />
  );
}
```

### Controlled Editor

```jsx
import { useState } from 'react';
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function ControlledEditor() {
  const [value, setValue] = useState('<p>Initial content</p>');
  
  return (
    <div>
      <RichTextEditor 
        value={value} 
        onChange={setValue}
        placeholder="Enter your content here..."
      />
      <div>
        <h3>HTML Output:</h3>
        <pre>{value}</pre>
      </div>
    </div>
  );
}
```

### Custom Toolbar Options

```jsx
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function EditorWithCustomToolbar() {
  return (
    <RichTextEditor 
      toolbarOptions={['bold', 'italic', 'underline', 'link']}
      placeholder="Enter your content here..."
    />
  );
}
```

### Character Limit

```jsx
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function EditorWithCharLimit() {
  return (
    <RichTextEditor 
      maxLength={500}
      placeholder="Enter your content here (max 500 characters)..."
    />
  );
}
```

### Custom File Upload Handler

```jsx
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function EditorWithFileUpload() {
  const handleFileUpload = async (file) => {
    // Upload file to your server or cloud storage
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('https://your-upload-endpoint.com/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    // Return the URL to the uploaded file
    return data.url;
  };
  
  return (
    <RichTextEditor 
      onFileUpload={handleFileUpload}
      placeholder="You can paste or drop images here..."
    />
  );
}
```

### Read-Only Mode

```jsx
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function ReadOnlyEditor() {
  return (
    <RichTextEditor 
      defaultValue="<p>This content cannot be edited.</p>"
      readOnly
    />
  );
}
```

### Disabled State

```jsx
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function DisabledEditor() {
  return (
    <RichTextEditor 
      defaultValue="<p>This editor is disabled.</p>"
      disabled
    />
  );
}
```

### Custom Styling

```jsx
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function CustomStyledEditor() {
  return (
    <RichTextEditor>
      <RichTextEditor.Label style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
        Blog Post
      </RichTextEditor.Label>
      
      <RichTextEditor.Toolbar style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '8px',
        padding: '8px',
        backgroundColor: '#f1f5f9',
        borderRadius: '4px',
      }}>
        <RichTextEditor.Button 
          format="bold"
          style={{ 
            padding: '4px 8px', 
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
          data-active-style={{ backgroundColor: '#e2e8f0' }}
        >
          <strong>B</strong>
        </RichTextEditor.Button>
        
        <RichTextEditor.Button 
          format="italic"
          style={{ 
            padding: '4px 8px', 
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
          data-active-style={{ backgroundColor: '#e2e8f0' }}
        >
          <em>I</em>
        </RichTextEditor.Button>
        
        <RichTextEditor.Button 
          format="underline"
          style={{ 
            padding: '4px 8px', 
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
          data-active-style={{ backgroundColor: '#e2e8f0' }}
        >
          <u>U</u>
        </RichTextEditor.Button>
        
        <RichTextEditor.Button 
          format="header"
          value={1}
          style={{ 
            padding: '4px 8px', 
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
          data-active-style={{ backgroundColor: '#e2e8f0' }}
        >
          H1
        </RichTextEditor.Button>
        
        <RichTextEditor.Button 
          format="header"
          value={2}
          style={{ 
            padding: '4px 8px', 
            borderRadius: '4px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
          data-active-style={{ backgroundColor: '#e2e8f0' }}
        >
          H2
        </RichTextEditor.Button>
      </RichTextEditor.Toolbar>
      
      <RichTextEditor.Content style={{ 
        minHeight: '200px',
        padding: '12px',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        outline: 'none',
      }} />
      
      <RichTextEditor.CharCount style={{ 
        marginTop: '8px', 
        textAlign: 'right',
        fontSize: '0.875rem',
        color: '#64748b',
      }} />
    </RichTextEditor>
  );
}
```

## API Reference

### RichTextEditor (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultValue | string | '' | Default value (uncontrolled) |
| value | string | - | Controlled value |
| onChange | (value: string) => void | - | Callback when value changes |
| disabled | boolean | false | Whether the editor is disabled |
| readOnly | boolean | false | Whether the editor is read-only |
| required | boolean | false | Whether the editor is required |
| placeholder | string | - | Placeholder text |
| id | string | auto-generated | ID for the editor element |
| name | string | - | Name attribute for the editor |
| toolbarOptions | ToolbarOption[] | All options | Available toolbar options |
| maxLength | number | - | Maximum character count |
| onFocus | (event: React.FocusEvent) => void | - | Callback when editor is focused |
| onBlur | (event: React.FocusEvent) => void | - | Callback when editor is blurred |
| onFileUpload | (file: File) => Promise<string> | - | Callback when a file is pasted or dropped |
| label | string | - | Label text for the editor |

### Compound Components

The RichTextEditor component uses a compound component pattern, providing the following sub-components:

- `RichTextEditor.Toolbar` - The toolbar element that contains formatting buttons
- `RichTextEditor.Content` - The content editable area
- `RichTextEditor.Label` - Label element for the editor
- `RichTextEditor.Button` - A button for the toolbar
- `RichTextEditor.CharCount` - Character count display

#### RichTextEditor.Button Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| format | string | - | Format to apply when clicked |
| value | any | - | Value for the format (optional) |

### Toolbar Options

The following toolbar options are available:

- `'bold'` - Bold text
- `'italic'` - Italic text
- `'underline'` - Underlined text
- `'strike'` - Strikethrough text
- `'blockquote'` - Blockquote
- `'code-block'` - Code block
- `'header'` - Headings
- `'list'` - Ordered list
- `'bullet'` - Bullet list
- `'indent'` - Indentation
- `'link'` - Hyperlinks
- `'image'` - Images
- `'align'` - Text alignment
- `'color'` - Text color
- `'background'` - Background color
- `'clean'` - Remove formatting

### Hooks

#### useRichTextEditor

```jsx
import { useRichTextEditor } from '@strive-ui/rich-text-editor';

function MyCustomEditor() {
  const { 
    value,
    getContainerProps,
    getToolbarProps,
    getEditorProps,
    getToolbarButtonProps,
    formatText,
    insertText,
    insertEmbed,
  } = useRichTextEditor({
    defaultValue: '<p>Initial content</p>',
    placeholder: 'Enter your content here...',
  });
  
  return (
    <div {...getContainerProps()}>
      <div {...getToolbarProps()}>
        <button {...getToolbarButtonProps({ format: 'bold' })}>
          Bold
        </button>
        <button {...getToolbarButtonProps({ format: 'italic' })}>
          Italic
        </button>
        <button onClick={() => insertText('Hello, world!')}>
          Insert Text
        </button>
      </div>
      <div {...getEditorProps()} contentEditable />
    </div>
  );
}
```

## Integration with Quill

This headless component is designed to work with the Quill rich text editor library. To use it with Quill, you'll need to install Quill and integrate it with the component:

```bash
npm install quill
# or
yarn add quill
```

Then, in your application:

```jsx
import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles
import { RichTextEditor } from '@strive-ui/rich-text-editor';

function QuillEditor() {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
          ]
        },
        placeholder: 'Compose an epic...',
      });
      
      quillRef.current.on('text-change', function() {
        const html = editorRef.current.querySelector('.ql-editor').innerHTML;
        console.log('Editor content:', html);
      });
    }
    
    return () => {
      quillRef.current = null;
    };
  }, []);
  
  return (
    <div>
      <h2>Quill Editor</h2>
      <div ref={editorRef} style={{ height: '300px' }} />
    </div>
  );
}
```

## Customization

The RichTextEditor component is designed to be highly customizable. You can override the default styling by providing your own CSS or using a CSS-in-JS solution like styled-components.

### Example with styled-components

```jsx
import styled from 'styled-components';
import { RichTextEditor } from '@strive-ui/rich-text-editor';

const StyledEditor = styled(RichTextEditor)`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const StyledToolbar = styled(RichTextEditor.Toolbar)`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`;

const StyledButton = styled(RichTextEditor.Button)`
  padding: 4px 8px;
  border-radius: 4px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  
  &:hover {
    background-color: #e2e8f0;
  }
  
  &[data-active] {
    background-color: #cbd5e1;
  }
`;

const StyledContent = styled(RichTextEditor.Content)`
  padding: 16px;
  min-height: 200px;
  
  &:focus {
    outline: none;
  }
  
  &[data-placeholder]:empty:before {
    content: attr(data-placeholder);
    color: #94a3b8;
  }
`;

const StyledCharCount = styled(RichTextEditor.CharCount)`
  padding: 8px;
  text-align: right;
  font-size: 0.875rem;
  color: #64748b;
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
`;

function StyledRichTextEditor() {
  return (
    <StyledEditor>
      <StyledToolbar>
        <StyledButton format="bold">B</StyledButton>
        <StyledButton format="italic">I</StyledButton>
        <StyledButton format="underline">U</StyledButton>
        <StyledButton format="header" value={1}>H1</StyledButton>
        <StyledButton format="header" value={2}>H2</StyledButton>
      </StyledToolbar>
      <StyledContent />
      <StyledCharCount />
    </StyledEditor>
  );
}
```
