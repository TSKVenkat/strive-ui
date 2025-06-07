# DocumentUploadHeadless

A headless document upload component that provides all the functionality for uploading and previewing document files without enforcing any specific styling.

## Features

- Drag and drop support
- File selection via dialog
- Document preview for supported file types (images, PDFs)
- File type detection and appropriate icons
- Upload progress tracking
- Multiple file support
- File validation (type, size, count)
- Fully accessible

## Usage

### Basic Usage

```jsx
import { DocumentUpload } from '@pulseui/document-upload';

function MyComponent() {
  return (
    <DocumentUpload 
      label="Upload Document" 
      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
      maxSize={10 * 1024 * 1024} // 10MB
    />
  );
}
```

### Controlled Upload

```jsx
import { useState } from 'react';
import { DocumentUpload } from '@pulseui/document-upload';

function ControlledUpload() {
  const [files, setFiles] = useState([]);
  
  return (
    <div>
      <DocumentUpload 
        files={files} 
        onChange={setFiles}
        accept=".pdf,.doc,.docx"
      />
      <div>
        <h3>Selected Files:</h3>
        <ul>
          {files.map(file => (
            <li key={file.name}>{file.name} ({Math.round(file.size / 1024)} KB)</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### With Upload Function

```jsx
import { DocumentUpload } from '@pulseui/document-upload';

function UploadWithServer() {
  const uploadToServer = async (files) => {
    // Create a FormData object
    const formData = new FormData();
    
    // Add each file to the form data
    files.forEach((file, index) => {
      formData.append(`document-${index}`, file);
    });
    
    // Send the request to the server
    const response = await fetch('https://your-upload-endpoint.com/upload', {
      method: 'POST',
      body: formData,
    });
    
    // Parse the response
    const data = await response.json();
    
    // Return the URLs of the uploaded files
    return data.urls;
  };
  
  return (
    <DocumentUpload 
      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
      uploadFn={uploadToServer}
      onUploadComplete={(urls) => {
        console.log('Uploaded files:', urls);
      }}
    />
  );
}
```

### Multiple File Upload

```jsx
import { DocumentUpload } from '@pulseui/document-upload';

function MultipleFileUpload() {
  return (
    <DocumentUpload 
      accept=".pdf,.doc,.docx"
      multiple
      maxFiles={5}
    />
  );
}
```

### With File Validation

```jsx
import { DocumentUpload } from '@pulseui/document-upload';

function ValidatedUpload() {
  return (
    <DocumentUpload 
      accept=".pdf,.doc,.docx"
      maxSize={5 * 1024 * 1024} // 5MB
      maxFiles={3}
      onFilesRejected={(files, reason) => {
        if (reason === 'type') {
          alert('Only PDF, DOC, and DOCX files are allowed');
        } else if (reason === 'size') {
          alert('Files must be smaller than 5MB');
        } else if (reason === 'count') {
          alert('You can upload a maximum of 3 files');
        }
      }}
    />
  );
}
```

### Custom Preview Renderer

```jsx
import { DocumentUpload } from '@pulseui/document-upload';

function CustomPreviewRenderer() {
  // Custom preview renderer for specific file types
  const customPreviewRenderer = (file) => {
    // For Excel files, return a custom preview URL
    if (file.category === 'excel') {
      return 'https://example.com/excel-icon.png';
    }
    
    // For other files, return null to use the default preview
    return null;
  };
  
  return (
    <DocumentUpload 
      accept=".pdf,.doc,.docx,.xls,.xlsx"
      previewRenderer={customPreviewRenderer}
    />
  );
}
```

### Disabled State

```jsx
import { DocumentUpload } from '@pulseui/document-upload';

function DisabledUpload() {
  return (
    <DocumentUpload 
      accept=".pdf,.doc,.docx"
      disabled
    />
  );
}
```

### Read-Only State

```jsx
import { DocumentUpload } from '@pulseui/document-upload';

function ReadOnlyUpload() {
  return (
    <DocumentUpload 
      accept=".pdf,.doc,.docx"
      readOnly
      defaultFiles={[/* some files */]}
    />
  );
}
```

### Custom Styling

```jsx
import { DocumentUpload } from '@pulseui/document-upload';

function CustomStyledUpload() {
  return (
    <DocumentUpload>
      <DocumentUpload.Label style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
        Upload Document Files
      </DocumentUpload.Label>
      
      <DocumentUpload.DropZone style={{ 
        padding: '32px',
        border: '2px dashed #cbd5e1',
        borderRadius: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}>
        <div>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#64748b">
            <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
          </svg>
          <p>Drag and drop document files here, or click to select files</p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX files up to 10MB
          </p>
        </div>
      </DocumentUpload.DropZone>
      
      <DocumentUpload.Input />
      
      <DocumentUpload.Preview style={{ 
        marginTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {(context) => 
          context.files.map((file) => (
            <DocumentUpload.PreviewItem 
              key={file.name} 
              file={file}
              style={{ 
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <DocumentUpload.Icon 
                  file={file}
                  style={{ 
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '4px',
                    color: '#64748b',
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {file.name}
                  </div>
                  
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>
                    {Math.round(file.size / 1024)} KB
                    {file.pageCount && ` • ${file.pageCount} pages`}
                  </div>
                  
                  {file.category === 'pdf' && file.preview && (
                    <DocumentUpload.DocumentPreview 
                      file={file}
                      style={{ 
                        marginTop: '8px',
                        marginBottom: '8px',
                        maxHeight: '200px',
                        overflow: 'hidden',
                        borderRadius: '4px',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                  )}
                  
                  {file.status === 'uploading' && (
                    <DocumentUpload.Progress 
                      file={file}
                      style={{ 
                        marginTop: '8px',
                        height: '4px',
                        backgroundColor: '#e2e8f0',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div 
                        style={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: `${file.progress}%`,
                          backgroundColor: '#3b82f6',
                          transition: 'width 0.3s',
                        }}
                      />
                    </DocumentUpload.Progress>
                  )}
                  
                  {file.status === 'error' && (
                    <DocumentUpload.Error 
                      file={file}
                      style={{ 
                        marginTop: '8px',
                        color: '#ef4444',
                        fontSize: '0.875rem',
                      }}
                    />
                  )}
                </div>
                
                <DocumentUpload.RemoveButton 
                  file={file}
                  style={{ 
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#f1f5f9',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </DocumentUpload.RemoveButton>
              </div>
            </DocumentUpload.PreviewItem>
          ))
        }
      </DocumentUpload.Preview>
      
      <DocumentUpload.Button style={{ 
        marginTop: '16px',
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}>
        Upload Files
      </DocumentUpload.Button>
    </DocumentUpload>
  );
}
```

## API Reference

### DocumentUpload (Root Component)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| defaultFiles | File[] | [] | Default files (uncontrolled) |
| files | File[] | - | Controlled files |
| onChange | (files: File[]) => void | - | Callback when files change |
| disabled | boolean | false | Whether the upload is disabled |
| readOnly | boolean | false | Whether the upload is read-only |
| required | boolean | false | Whether the upload is required |
| id | string | auto-generated | ID for the upload element |
| name | string | - | Name attribute for the upload |
| accept | string | '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.csv,.zip,.rar' | Accept attribute for the file input |
| maxSize | number | - | Maximum file size in bytes |
| maxFiles | number | - | Maximum number of files |
| multiple | boolean | false | Whether to allow multiple files |
| onFilesAdded | (files: File[]) => void | - | Callback when files are added |
| onFilesRemoved | (files: File[]) => void | - | Callback when files are removed |
| onFilesRejected | (files: File[], reason: 'type' \| 'size' \| 'count') => void | - | Callback when files are rejected |
| onUploadStart | () => void | - | Callback when upload starts |
| onUploadProgress | (progress: number) => void | - | Callback when upload progress changes |
| onUploadComplete | (urls: string[]) => void | - | Callback when upload completes |
| onUploadError | (error: Error) => void | - | Callback when upload fails |
| uploadFn | (files: File[]) => Promise<string[]> | - | Function to upload files |
| generatePreviews | boolean | true | Whether to generate previews for documents |
| previewRenderer | (file: DocumentFile) => string \| null | - | Custom preview renderer for specific file types |
| label | string | - | Label text for the upload |

### Compound Components

The DocumentUpload component uses a compound component pattern, providing the following sub-components:

- `DocumentUpload.DropZone` - The drop zone area where files can be dragged and dropped
- `DocumentUpload.Input` - The hidden file input element
- `DocumentUpload.Label` - Label element for the upload
- `DocumentUpload.Preview` - Container for previewing uploaded files
- `DocumentUpload.PreviewItem` - Individual file preview item
- `DocumentUpload.RemoveButton` - Button to remove a file
- `DocumentUpload.Icon` - Icon representation of the file type
- `DocumentUpload.DocumentPreview` - Preview for supported document types
- `DocumentUpload.Progress` - Progress indicator for file upload
- `DocumentUpload.Error` - Error message display
- `DocumentUpload.Button` - Button to trigger the upload

### DocumentFile Interface

The DocumentFile interface extends the standard File interface with additional properties:

| Property | Type | Description |
|----------|------|-------------|
| preview | string | URL for previewing the file |
| progress | number | Upload progress (0-100) |
| status | 'idle' \| 'uploading' \| 'success' \| 'error' | Upload status |
| error | string | Error message |
| category | 'pdf' \| 'word' \| 'excel' \| 'powerpoint' \| 'image' \| 'text' \| 'archive' \| 'other' | Document type category |
| pageCount | number | Number of pages (for PDFs) |
| previewReady | boolean | Whether the preview is ready |

### Hooks

#### useDocumentUpload

```jsx
import { useDocumentUpload } from '@pulseui/document-upload';

function MyCustomUpload() {
  const { 
    files,
    isUploading,
    addFiles,
    removeFile,
    removeAllFiles,
    uploadFiles,
    openFileDialog,
    getDocumentCategory,
    getDocumentIcon,
    getContainerProps,
    getInputProps,
    getDropZoneProps,
  } = useDocumentUpload({
    accept: '.pdf,.doc,.docx',
    maxSize: 10 * 1024 * 1024,
    multiple: true,
    generatePreviews: true,
  });
  
  return (
    <div {...getContainerProps()}>
      <div {...getDropZoneProps({ onClick: openFileDialog })}>
        <p>Drop files here or click to select</p>
      </div>
      <input {...getInputProps()} />
      
      {files.length > 0 && (
        <div>
          <h3>Selected Files</h3>
          <ul>
            {files.map(file => (
              <li key={file.name}>
                {getDocumentIcon(file)}
                {file.name} ({getDocumentCategory(file)})
                <button onClick={() => removeFile(file)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={removeAllFiles}>Clear All</button>
          <button onClick={uploadFiles} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
}
```
