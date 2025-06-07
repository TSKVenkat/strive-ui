# FileUpload Component

The FileUpload component provides an intuitive interface for users to upload files through drag-and-drop or file browser, with support for validation, multiple file selection, and file preview.

## Import

```jsx
import { FileUpload } from 'pulseui';
```

## Usage

```jsx
const handleUpload = (files) => {
  console.log('Files uploaded:', files);
};

<FileUpload onUpload={handleUpload} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onUpload` | `(files: File[]) => void` | Required | Callback fired when files are uploaded |
| `onRemove` | `(file: File) => void` | - | Callback fired when a file is removed |
| `multiple` | `boolean` | `false` | Whether to accept multiple files |
| `accept` | `string` | - | Accepted file types (e.g., 'image/*', '.pdf,.docx') |
| `maxSize` | `number` | - | Maximum file size in bytes |
| `maxFiles` | `number` | `0` | Maximum number of files (0 means unlimited) |
| `showFileList` | `boolean` | `true` | Whether to show the file list |
| `disabled` | `boolean` | `false` | Whether the file upload is disabled |
| `dragDropText` | `string` | `'Drag and drop files here, or'` | Custom drag and drop text |
| `browseText` | `string` | `'Browse files'` | Custom browse text |
| `errorMessages` | `object` | See below | Custom validation error messages |
| `className` | `string` | - | Additional className for the container |
| `style` | `React.CSSProperties` | - | Optional style overrides for the container |
| `ariaLabel` | `string` | `'File upload'` | Aria label for the file input |

### Default Error Messages

```jsx
{
  maxSize: 'File size exceeds the limit',
  maxFiles: 'Maximum number of files exceeded',
  acceptedTypes: 'File type not accepted'
}
```

## Examples

### Basic Usage

```jsx
const handleUpload = (files) => {
  console.log('Files uploaded:', files);
};

<FileUpload onUpload={handleUpload} />
```

### Multiple File Upload

```jsx
<FileUpload 
  onUpload={handleUpload} 
  multiple 
/>
```

### Image Upload Only

```jsx
<FileUpload 
  onUpload={handleUpload} 
  accept="image/*" 
  multiple 
/>
```

### File Type Restrictions

```jsx
<FileUpload 
  onUpload={handleUpload} 
  accept=".pdf,.docx,.xlsx" 
  multiple 
/>
```

### File Size Limit

```jsx
<FileUpload 
  onUpload={handleUpload} 
  maxSize={1024 * 1024 * 5} // 5MB
  multiple 
/>
```

### Maximum Number of Files

```jsx
<FileUpload 
  onUpload={handleUpload} 
  multiple 
  maxFiles={3} 
/>
```

### Without File List

```jsx
<FileUpload 
  onUpload={handleUpload} 
  multiple 
  showFileList={false} 
/>
```

### Disabled State

```jsx
<FileUpload 
  onUpload={handleUpload} 
  disabled 
/>
```

### Custom Text

```jsx
<FileUpload 
  onUpload={handleUpload} 
  dragDropText="Drop your files here or" 
  browseText="Select from your device" 
/>
```

### Custom Error Messages

```jsx
<FileUpload 
  onUpload={handleUpload} 
  maxSize={1024 * 1024} // 1MB
  errorMessages={{
    maxSize: 'File is too large (max 1MB)',
    acceptedTypes: 'This file type is not supported',
    maxFiles: 'You can only upload up to 5 files'
  }}
/>
```

### With File Removal

```jsx
const handleUpload = (files) => {
  setUploadedFiles(files);
};

const handleRemove = (file) => {
  console.log('File removed:', file);
};

<FileUpload 
  onUpload={handleUpload} 
  onRemove={handleRemove}
  multiple 
/>
```

## Accessibility

The FileUpload component follows accessibility best practices:

- Uses appropriate ARIA attributes
- Supports keyboard navigation
- Provides clear error messages
- Maintains proper focus management

## Animation

The FileUpload component uses Framer Motion for smooth animations:

- Subtle visual feedback when dragging files over the drop zone
- Smooth transitions when adding and removing files from the file list
