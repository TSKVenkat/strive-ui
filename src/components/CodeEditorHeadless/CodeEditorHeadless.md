# CodeEditorHeadless

A headless code editor component that provides all the functionality for code editing without enforcing any specific styling.

## Features

- Syntax highlighting for various programming languages
- Line numbers
- Customizable themes (light/dark)
- Line wrapping
- Tab size configuration
- Auto-closing brackets
- Matching brackets highlighting
- Auto-indentation
- Fully accessible
- Supports both controlled and uncontrolled modes

## Usage

### Basic Usage

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function MyComponent() {
  return (
    <CodeEditor 
      label="JavaScript Code" 
      language="javascript"
      placeholder="Enter your code here..."
      defaultValue="function hello() {\n  console.log('Hello, world!');\n}"
    />
  );
}
```

### Controlled Editor

```jsx
import { useState } from 'react';
import { CodeEditor } from '@pulseui/code-editor';

function ControlledEditor() {
  const [code, setCode] = useState("function hello() {\n  console.log('Hello, world!');\n}");
  
  return (
    <div>
      <CodeEditor 
        value={code} 
        onChange={setCode}
        language="javascript"
      />
      <div>
        <h3>Current Code:</h3>
        <pre>{code}</pre>
      </div>
    </div>
  );
}
```

### Different Languages

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function PythonEditor() {
  return (
    <CodeEditor 
      language="python"
      defaultValue="def hello():\n    print('Hello, world!')"
    />
  );
}
```

### Dark Theme

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function DarkThemeEditor() {
  return (
    <CodeEditor 
      language="javascript"
      theme="dark"
      defaultValue="function hello() {\n  console.log('Hello, world!');\n}"
    />
  );
}
```

### Line Wrapping

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function WrappingEditor() {
  return (
    <CodeEditor 
      language="javascript"
      lineWrapping
      defaultValue="function hello() {\n  console.log('This is a very long line of code that would normally extend beyond the visible area of the editor, but with line wrapping enabled, it will wrap to the next line.');\n}"
    />
  );
}
```

### Custom Tab Size

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function CustomTabSizeEditor() {
  return (
    <CodeEditor 
      language="javascript"
      tabSize={4}
      defaultValue="function hello() {\n    console.log('Hello, world!');\n}"
    />
  );
}
```

### Read-Only Mode

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function ReadOnlyEditor() {
  return (
    <CodeEditor 
      language="javascript"
      readOnly
      defaultValue="function hello() {\n  console.log('Hello, world!');\n}"
    />
  );
}
```

### Disabled State

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function DisabledEditor() {
  return (
    <CodeEditor 
      language="javascript"
      disabled
      defaultValue="function hello() {\n  console.log('Hello, world!');\n}"
    />
  );
}
```

### Without Line Numbers

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function NoLineNumbersEditor() {
  return (
    <CodeEditor 
      language="javascript"
      showLineNumbers={false}
      defaultValue="function hello() {\n  console.log('Hello, world!');\n}"
    />
  );
}
```

### Custom Styling

```jsx
import { CodeEditor } from '@pulseui/code-editor';

function CustomStyledEditor() {
  return (
    <CodeEditor>
      <CodeEditor.Label style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
        JavaScript Code
      </CodeEditor.Label>
      
      <div style={{ 
        display: 'flex',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <CodeEditor.LineNumbers style={{ 
          backgroundColor: '#f1f5f9',
          color: '#64748b',
          padding: '12px 8px',
          textAlign: 'right',
          borderRight: '1px solid #cbd5e1',
          fontFamily: 'monospace',
          fontSize: '14px',
        }} />
        
        <CodeEditor.Content style={{ 
          flex: 1,
          fontFamily: 'monospace',
          fontSize: '14px',
          lineHeight: 1.5,
        }} />
      </div>
    </CodeEditor>
  );
}
```

## API Reference

### CodeEditor (Root Component)

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
| language | string | - | Programming language for syntax highlighting |
| theme | 'light' \| 'dark' \| string | 'light' | Theme for the editor |
| showLineNumbers | boolean | true | Whether to show line numbers |
| lineWrapping | boolean | false | Whether to enable line wrapping |
| tabSize | number | 2 | Tab size in spaces |
| autoCloseBrackets | boolean | true | Whether to auto-close brackets |
| matchBrackets | boolean | true | Whether to highlight matching brackets |
| autoIndent | boolean | true | Whether to enable auto-indentation |
| onFocus | (event: React.FocusEvent) => void | - | Callback when editor is focused |
| onBlur | (event: React.FocusEvent) => void | - | Callback when editor is blurred |
| label | string | - | Label text for the editor |

### Compound Components

The CodeEditor component uses a compound component pattern, providing the following sub-components:

- `CodeEditor.Content` - The content editable area
- `CodeEditor.Label` - Label element for the editor
- `CodeEditor.LineNumbers` - Line numbers display

## Integration with CodeMirror

This headless component is designed to work with the CodeMirror code editor library. To use it with CodeMirror, you'll need to install CodeMirror and integrate it with the component:

```bash
npm install codemirror
# or
yarn add codemirror
```

Then, in your application:

```jsx
import { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import { CodeEditor } from '@pulseui/code-editor';

function CodeMirrorEditor() {
  const editorRef = useRef(null);
  const codeMirrorRef = useRef(null);
  
  useEffect(() => {
    if (editorRef.current && !codeMirrorRef.current) {
      codeMirrorRef.current = CodeMirror.fromTextArea(editorRef.current, {
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true,
        lineWrapping: false,
        tabSize: 2,
        indentUnit: 2,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentWithTabs: true,
      });
      
      codeMirrorRef.current.on('change', (instance) => {
        const value = instance.getValue();
        console.log('Editor content:', value);
      });
    }
    
    return () => {
      if (codeMirrorRef.current) {
        codeMirrorRef.current.toTextArea();
        codeMirrorRef.current = null;
      }
    };
  }, []);
  
  return (
    <div>
      <h2>CodeMirror Editor</h2>
      <textarea ref={editorRef} defaultValue="function hello() {\n  console.log('Hello, world!');\n}" />
    </div>
  );
}
```

## Customization

The CodeEditor component is designed to be highly customizable. You can override the default styling by providing your own CSS or using a CSS-in-JS solution like styled-components.

### Example with styled-components

```jsx
import styled from 'styled-components';
import { CodeEditor } from '@pulseui/code-editor';

const StyledEditor = styled(CodeEditor)`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StyledLineNumbers = styled(CodeEditor.LineNumbers)`
  background-color: #1e293b;
  color: #64748b;
  padding: 16px 8px;
  text-align: right;
  border-right: 1px solid #334155;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
`;

const StyledContent = styled(CodeEditor.Content)`
  flex: 1;
  background-color: #0f172a;
  color: #f8fafc;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
  line-height: 1.6;
  
  & textarea {
    background-color: transparent;
    color: inherit;
    padding: 16px;
  }
`;

function StyledCodeEditor() {
  return (
    <StyledEditor
      language="javascript"
      defaultValue="function hello() {\n  console.log('Hello, world!');\n}"
    >
      <CodeEditor.Label style={{ 
        marginBottom: '8px', 
        display: 'block', 
        fontWeight: 'bold',
        color: '#f8fafc'
      }}>
        JavaScript Code
      </CodeEditor.Label>
      
      <div style={{ display: 'flex' }}>
        <StyledLineNumbers />
        <StyledContent />
      </div>
    </StyledEditor>
  );
}
```

## Hooks

### useCodeEditor

```jsx
import { useCodeEditor } from '@pulseui/code-editor';

function MyCustomEditor() {
  const { 
    value,
    getContainerProps,
    getEditorProps,
    insertText,
    focus,
    clear,
  } = useCodeEditor({
    defaultValue: "function hello() {\n  console.log('Hello, world!');\n}",
    language: 'javascript',
    theme: 'light',
  });
  
  return (
    <div {...getContainerProps()}>
      <div style={{ marginBottom: '8px' }}>
        <button onClick={() => focus()}>Focus</button>
        <button onClick={() => clear()}>Clear</button>
        <button onClick={() => insertText('// Add a comment\n')}>Add Comment</button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ 
          width: '40px', 
          textAlign: 'right', 
          padding: '8px', 
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #ddd',
        }}>
          {value.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div {...getEditorProps()} style={{ flex: 1 }}>
          <textarea 
            defaultValue={value}
            style={{ 
              width: '100%', 
              height: '200px',
              border: 'none',
              outline: 'none',
              padding: '8px',
              fontFamily: 'monospace',
            }}
          />
        </div>
      </div>
    </div>
  );
}
```
