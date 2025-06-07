# AudioUploadHeadless

A headless audio upload component that provides all the functionality for uploading and previewing audio files without enforcing any specific styling.

## Features

- Drag and drop support
- File selection via dialog
- Audio preview with waveform visualization
- Upload progress tracking
- Multiple file support
- File validation (type, size, count)
- Fully accessible

## Usage

### Basic Usage

```jsx
import { AudioUpload } from '@pulseui/audio-upload';

function MyComponent() {
  return (
    <AudioUpload 
      label="Upload Audio" 
      accept="audio/*"
      maxSize={10 * 1024 * 1024} // 10MB
    />
  );
}
```

### Controlled Upload

```jsx
import { useState } from 'react';
import { AudioUpload } from '@pulseui/audio-upload';

function ControlledUpload() {
  const [files, setFiles] = useState([]);
  
  return (
    <div>
      <AudioUpload 
        files={files} 
        onChange={setFiles}
        accept="audio/*"
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
import { AudioUpload } from '@pulseui/audio-upload';

function UploadWithServer() {
  const uploadToServer = async (files) => {
    // Create a FormData object
    const formData = new FormData();
    
    // Add each file to the form data
    files.forEach((file, index) => {
      formData.append(`audio-${index}`, file);
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
    <AudioUpload 
      accept="audio/*"
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
import { AudioUpload } from '@pulseui/audio-upload';

function MultipleFileUpload() {
  return (
    <AudioUpload 
      accept="audio/*"
      multiple
      maxFiles={5}
    />
  );
}
```

### With File Validation

```jsx
import { AudioUpload } from '@pulseui/audio-upload';

function ValidatedUpload() {
  return (
    <AudioUpload 
      accept="audio/mp3,audio/wav"
      maxSize={5 * 1024 * 1024} // 5MB
      maxFiles={3}
      onFilesRejected={(files, reason) => {
        if (reason === 'type') {
          alert('Only MP3 and WAV files are allowed');
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

### Disabled State

```jsx
import { AudioUpload } from '@pulseui/audio-upload';

function DisabledUpload() {
  return (
    <AudioUpload 
      accept="audio/*"
      disabled
    />
  );
}
```

### Read-Only State

```jsx
import { AudioUpload } from '@pulseui/audio-upload';

function ReadOnlyUpload() {
  return (
    <AudioUpload 
      accept="audio/*"
      readOnly
      defaultFiles={[/* some files */]}
    />
  );
}
```

### Custom Styling

```jsx
import { AudioUpload } from '@pulseui/audio-upload';

function CustomStyledUpload() {
  return (
    <AudioUpload>
      <AudioUpload.Label style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
        Upload Audio Files
      </AudioUpload.Label>
      
      <AudioUpload.DropZone style={{ 
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
          <p>Drag and drop audio files here, or click to select files</p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            MP3, WAV, or OGG files up to 10MB
          </p>
        </div>
      </AudioUpload.DropZone>
      
      <AudioUpload.Input />
      
      <AudioUpload.Preview style={{ 
        marginTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {(context) => 
          context.files.map((file) => (
            <AudioUpload.PreviewItem 
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
                <AudioUpload.Player 
                  file={file}
                  style={{ width: '120px' }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {file.name}
                  </div>
                  
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>
                    {Math.round(file.size / 1024)} KB
                    {file.duration && ` • ${Math.round(file.duration)}s`}
                  </div>
                  
                  <AudioUpload.Waveform 
                    file={file}
                    style={{ 
                      height: '32px',
                      gap: '2px',
                    }}
                  />
                  
                  {file.status === 'uploading' && (
                    <AudioUpload.Progress 
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
                    </AudioUpload.Progress>
                  )}
                  
                  {file.status === 'error' && (
                    <AudioUpload.Error 
                      file={file}
                      style={{ 
                        marginTop: '8px',
                        color: '#ef4444',
                        fontSize: '0.875rem',
                      }}
                    />
                  )}
                </div>
                
                <AudioUpload.RemoveButton 
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
                </AudioUpload.RemoveButton>
              </div>
            </AudioUpload.PreviewItem>
          ))
        }
      </AudioUpload.Preview>
      
      <AudioUpload.Button style={{ 
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
      </AudioUpload.Button>
    </AudioUpload>
  );
}
```

## API Reference

### AudioUpload (Root Component)

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
| accept | string | 'audio/*' | Accept attribute for the file input |
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
| label | string | - | Label text for the upload |

### Compound Components

The AudioUpload component uses a compound component pattern, providing the following sub-components:

- `AudioUpload.DropZone` - The drop zone area where files can be dragged and dropped
- `AudioUpload.Input` - The hidden file input element
- `AudioUpload.Label` - Label element for the upload
- `AudioUpload.Preview` - Container for previewing uploaded files
- `AudioUpload.PreviewItem` - Individual file preview item
- `AudioUpload.RemoveButton` - Button to remove a file
- `AudioUpload.Player` - Audio player for previewing the file
- `AudioUpload.Waveform` - Visualization of the audio waveform
- `AudioUpload.Progress` - Progress indicator for file upload
- `AudioUpload.Error` - Error message display
- `AudioUpload.Button` - Button to trigger the upload

### AudioFile Interface

The AudioFile interface extends the standard File interface with additional properties:

| Property | Type | Description |
|----------|------|-------------|
| preview | string | URL for previewing the file |
| progress | number | Upload progress (0-100) |
| status | 'idle' \| 'uploading' \| 'success' \| 'error' | Upload status |
| error | string | Error message |
| duration | number | Duration in seconds |
| waveform | number[] | Waveform data |

### Hooks

#### useAudioUpload

```jsx
import { useAudioUpload } from '@pulseui/audio-upload';

function MyCustomUpload() {
  const { 
    files,
    isUploading,
    addFiles,
    removeFile,
    removeAllFiles,
    uploadFiles,
    openFileDialog,
    getContainerProps,
    getInputProps,
    getDropZoneProps,
  } = useAudioUpload({
    accept: 'audio/mp3,audio/wav',
    maxSize: 10 * 1024 * 1024,
    multiple: true,
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
                {file.name}
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
