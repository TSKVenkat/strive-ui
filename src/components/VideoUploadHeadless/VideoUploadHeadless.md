# VideoUploadHeadless

A headless video upload component that provides all the functionality for uploading and previewing video files without enforcing any specific styling.

## Features

- Drag and drop support
- File selection via dialog
- Video preview with player controls
- Thumbnail generation
- Upload progress tracking
- Multiple file support
- File validation (type, size, count)
- Fully accessible

## Usage

### Basic Usage

```jsx
import { VideoUpload } from '@pulseui/video-upload';

function MyComponent() {
  return (
    <VideoUpload 
      label="Upload Video" 
      accept="video/*"
      maxSize={50 * 1024 * 1024} // 50MB
    />
  );
}
```

### Controlled Upload

```jsx
import { useState } from 'react';
import { VideoUpload } from '@pulseui/video-upload';

function ControlledUpload() {
  const [files, setFiles] = useState([]);
  
  return (
    <div>
      <VideoUpload 
        files={files} 
        onChange={setFiles}
        accept="video/*"
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
import { VideoUpload } from '@pulseui/video-upload';

function UploadWithServer() {
  const uploadToServer = async (files) => {
    // Create a FormData object
    const formData = new FormData();
    
    // Add each file to the form data
    files.forEach((file, index) => {
      formData.append(`video-${index}`, file);
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
    <VideoUpload 
      accept="video/*"
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
import { VideoUpload } from '@pulseui/video-upload';

function MultipleFileUpload() {
  return (
    <VideoUpload 
      accept="video/*"
      multiple
      maxFiles={3}
    />
  );
}
```

### With File Validation

```jsx
import { VideoUpload } from '@pulseui/video-upload';

function ValidatedUpload() {
  return (
    <VideoUpload 
      accept="video/mp4,video/webm,video/ogg"
      maxSize={100 * 1024 * 1024} // 100MB
      maxFiles={2}
      onFilesRejected={(files, reason) => {
        if (reason === 'type') {
          alert('Only MP4, WebM, and OGG video files are allowed');
        } else if (reason === 'size') {
          alert('Files must be smaller than 100MB');
        } else if (reason === 'count') {
          alert('You can upload a maximum of 2 files');
        }
      }}
    />
  );
}
```

### Thumbnail Generation

```jsx
import { VideoUpload } from '@pulseui/video-upload';

function ThumbnailGeneration() {
  return (
    <VideoUpload 
      accept="video/*"
      generateThumbnails={true}
      thumbnailCount={3}
      thumbnailWidth={240}
      thumbnailHeight={135}
    />
  );
}
```

### Disabled State

```jsx
import { VideoUpload } from '@pulseui/video-upload';

function DisabledUpload() {
  return (
    <VideoUpload 
      accept="video/*"
      disabled
    />
  );
}
```

### Read-Only State

```jsx
import { VideoUpload } from '@pulseui/video-upload';

function ReadOnlyUpload() {
  return (
    <VideoUpload 
      accept="video/*"
      readOnly
      defaultFiles={[/* some files */]}
    />
  );
}
```

### Custom Styling

```jsx
import { VideoUpload } from '@pulseui/video-upload';

function CustomStyledUpload() {
  return (
    <VideoUpload>
      <VideoUpload.Label style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
        Upload Video Files
      </VideoUpload.Label>
      
      <VideoUpload.DropZone style={{ 
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
          <p>Drag and drop video files here, or click to select files</p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            MP4, WebM, or OGG files up to 100MB
          </p>
        </div>
      </VideoUpload.DropZone>
      
      <VideoUpload.Input />
      
      <VideoUpload.Preview style={{ 
        marginTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        {(context) => 
          context.files.map((file) => (
            <VideoUpload.PreviewItem 
              key={file.name} 
              file={file}
              style={{ 
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <VideoUpload.Player 
                  file={file}
                  style={{ width: '240px', height: '135px', objectFit: 'cover' }}
                />
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {file.name}
                  </div>
                  
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>
                    {Math.round(file.size / 1024 / 1024)} MB
                    {file.duration && ` • ${Math.floor(file.duration / 60)}:${String(Math.floor(file.duration % 60)).padStart(2, '0')}`}
                    {file.width && file.height && ` • ${file.width}x${file.height}`}
                  </div>
                  
                  <VideoUpload.Thumbnails 
                    file={file}
                    style={{ 
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  />
                  
                  {file.status === 'uploading' && (
                    <VideoUpload.Progress 
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
                    </VideoUpload.Progress>
                  )}
                  
                  {file.status === 'error' && (
                    <VideoUpload.Error 
                      file={file}
                      style={{ 
                        marginTop: '8px',
                        color: '#ef4444',
                        fontSize: '0.875rem',
                      }}
                    />
                  )}
                </div>
                
                <VideoUpload.RemoveButton 
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
                </VideoUpload.RemoveButton>
              </div>
            </VideoUpload.PreviewItem>
          ))
        }
      </VideoUpload.Preview>
      
      <VideoUpload.Button style={{ 
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
      </VideoUpload.Button>
    </VideoUpload>
  );
}
```

## API Reference

### VideoUpload (Root Component)

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
| accept | string | 'video/*' | Accept attribute for the file input |
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
| generateThumbnails | boolean | true | Whether to generate thumbnails |
| thumbnailCount | number | 1 | Number of thumbnails to generate |
| thumbnailWidth | number | 160 | Width of thumbnails |
| thumbnailHeight | number | 90 | Height of thumbnails |
| label | string | - | Label text for the upload |

### Compound Components

The VideoUpload component uses a compound component pattern, providing the following sub-components:

- `VideoUpload.DropZone` - The drop zone area where files can be dragged and dropped
- `VideoUpload.Input` - The hidden file input element
- `VideoUpload.Label` - Label element for the upload
- `VideoUpload.Preview` - Container for previewing uploaded files
- `VideoUpload.PreviewItem` - Individual file preview item
- `VideoUpload.RemoveButton` - Button to remove a file
- `VideoUpload.Player` - Video player for previewing the file
- `VideoUpload.Thumbnail` - Individual thumbnail image
- `VideoUpload.Thumbnails` - Container for all thumbnails of a video
- `VideoUpload.Progress` - Progress indicator for file upload
- `VideoUpload.Error` - Error message display
- `VideoUpload.Button` - Button to trigger the upload

### VideoFile Interface

The VideoFile interface extends the standard File interface with additional properties:

| Property | Type | Description |
|----------|------|-------------|
| preview | string | URL for previewing the file |
| progress | number | Upload progress (0-100) |
| status | 'idle' \| 'uploading' \| 'success' \| 'error' | Upload status |
| error | string | Error message |
| duration | number | Duration in seconds |
| width | number | Width of the video |
| height | number | Height of the video |
| thumbnails | string[] | Array of thumbnail URLs |

### Hooks

#### useVideoUpload

```jsx
import { useVideoUpload } from '@pulseui/video-upload';

function MyCustomUpload() {
  const { 
    files,
    isUploading,
    addFiles,
    removeFile,
    removeAllFiles,
    uploadFiles,
    openFileDialog,
    generateThumbnail,
    getContainerProps,
    getInputProps,
    getDropZoneProps,
  } = useVideoUpload({
    accept: 'video/mp4,video/webm',
    maxSize: 100 * 1024 * 1024,
    multiple: true,
    generateThumbnails: true,
    thumbnailCount: 3,
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
                {file.thumbnails && file.thumbnails.map((thumbnail, index) => (
                  <img 
                    key={index} 
                    src={thumbnail} 
                    alt={`Thumbnail ${index}`} 
                    width="80" 
                    height="45" 
                  />
                ))}
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
