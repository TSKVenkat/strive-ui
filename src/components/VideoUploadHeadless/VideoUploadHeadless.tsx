import React, { createContext, useContext, forwardRef } from 'react';
import { useVideoUpload, UseVideoUploadReturn, VideoFile } from './useVideoUpload';

// Define the props for the VideoUpload component
export interface VideoUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Default files (uncontrolled)
   */
  defaultFiles?: File[];
  /**
   * Controlled files
   */
  files?: File[];
  /**
   * Callback when files change
   */
  onChange?: (files: File[]) => void;
  /**
   * Whether the upload is disabled
   */
  disabled?: boolean;
  /**
   * Whether the upload is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the upload is required
   */
  required?: boolean;
  /**
   * ID for the upload element
   */
  id?: string;
  /**
   * Name attribute for the upload
   */
  name?: string;
  /**
   * Accept attribute for the file input
   */
  accept?: string;
  /**
   * Maximum file size in bytes
   */
  maxSize?: number;
  /**
   * Maximum number of files
   */
  maxFiles?: number;
  /**
   * Whether to allow multiple files
   */
  multiple?: boolean;
  /**
   * Callback when files are added
   */
  onFilesAdded?: (files: File[]) => void;
  /**
   * Callback when files are removed
   */
  onFilesRemoved?: (files: File[]) => void;
  /**
   * Callback when files are rejected
   */
  onFilesRejected?: (files: File[], reason: 'type' | 'size' | 'count') => void;
  /**
   * Callback when upload starts
   */
  onUploadStart?: () => void;
  /**
   * Callback when upload progress changes
   */
  onUploadProgress?: (progress: number) => void;
  /**
   * Callback when upload completes
   */
  onUploadComplete?: (urls: string[]) => void;
  /**
   * Callback when upload fails
   */
  onUploadError?: (error: Error) => void;
  /**
   * Function to upload files
   */
  uploadFn?: (files: File[]) => Promise<string[]>;
  /**
   * Whether to generate thumbnails
   */
  generateThumbnails?: boolean;
  /**
   * Number of thumbnails to generate
   */
  thumbnailCount?: number;
  /**
   * Width of thumbnails
   */
  thumbnailWidth?: number;
  /**
   * Height of thumbnails
   */
  thumbnailHeight?: number;
  /**
   * Label text for the upload
   */
  label?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the VideoUpload
export interface VideoUploadContextValue extends UseVideoUploadReturn {
  label?: string;
}

const VideoUploadContext = createContext<VideoUploadContextValue | undefined>(undefined);

// Hook to use the VideoUpload context
export function useVideoUploadContext() {
  const context = useContext(VideoUploadContext);
  if (!context) {
    throw new Error('useVideoUploadContext must be used within a VideoUploadProvider');
  }
  return context;
}

// Root component
export const VideoUploadRoot = forwardRef<HTMLDivElement, VideoUploadProps>(
  (
    {
      defaultFiles,
      files,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      accept,
      maxSize,
      maxFiles,
      multiple,
      onFilesAdded,
      onFilesRemoved,
      onFilesRejected,
      onUploadStart,
      onUploadProgress,
      onUploadComplete,
      onUploadError,
      uploadFn,
      generateThumbnails,
      thumbnailCount,
      thumbnailWidth,
      thumbnailHeight,
      label,
      children,
      ...props
    },
    ref
  ) => {
    // Use the video upload hook
    const videoUpload = useVideoUpload({
      defaultFiles,
      files,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      accept,
      maxSize,
      maxFiles,
      multiple,
      onFilesAdded,
      onFilesRemoved,
      onFilesRejected,
      onUploadStart,
      onUploadProgress,
      onUploadComplete,
      onUploadError,
      uploadFn,
      generateThumbnails,
      thumbnailCount,
      thumbnailWidth,
      thumbnailHeight,
    });

    // Get container props
    const containerProps = videoUpload.getContainerProps(props);

    return (
      <VideoUploadContext.Provider value={{ ...videoUpload, label }}>
        <div {...containerProps} ref={ref}>
          {children || (
            <>
              <VideoUploadLabel>{label}</VideoUploadLabel>
              <VideoUploadDropZone />
              <VideoUploadInput />
              <VideoUploadPreview>
                {(context) =>
                  context.files.map((file) => (
                    <VideoUploadPreviewItem key={file.name} file={file}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <VideoUploadPlayer file={file} />
                        <div style={{ flex: 1 }}>
                          <div>{file.name}</div>
                          <div>
                            {Math.round(file.size / 1024)} KB
                            {file.duration && ` • ${Math.round(file.duration)}s`}
                          </div>
                          {file.status === 'uploading' && (
                            <VideoUploadProgress file={file} />
                          )}
                          {file.status === 'error' && (
                            <VideoUploadError file={file} />
                          )}
                        </div>
                        <VideoUploadRemoveButton file={file} />
                      </div>
                    </VideoUploadPreviewItem>
                  ))
                }
              </VideoUploadPreview>
              {videoUpload.files.length > 0 && uploadFn && (
                <VideoUploadButton />
              )}
            </>
          )}
        </div>
      </VideoUploadContext.Provider>
    );
  }
);

VideoUploadRoot.displayName = 'VideoUpload';

// Label component
export interface VideoUploadLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export const VideoUploadLabel = forwardRef<HTMLLabelElement, VideoUploadLabelProps>(
  ({ children, ...props }, ref) => {
    const { id, label } = useVideoUploadContext();

    return (
      <label {...props} ref={ref} htmlFor={`${id}-input`}>
        {children || label}
      </label>
    );
  }
);

VideoUploadLabel.displayName = 'VideoUpload.Label';

// Input component
export interface VideoUploadInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const VideoUploadInput = forwardRef<HTMLInputElement, VideoUploadInputProps>(
  (props, ref) => {
    const { getInputProps } = useVideoUploadContext();
    const inputProps = getInputProps({ ...props, ref });

    return <input {...inputProps} />;
  }
);

VideoUploadInput.displayName = 'VideoUpload.Input';

// Drop zone component
export interface VideoUploadDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const VideoUploadDropZone = forwardRef<HTMLDivElement, VideoUploadDropZoneProps>(
  ({ children, ...props }, ref) => {
    const { getDropZoneProps, disabled, readOnly } = useVideoUploadContext();
    const dropZoneProps = getDropZoneProps({ ...props, ref });

    return (
      <div {...dropZoneProps}>
        {children || (
          <div>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
            </svg>
            <p>
              {disabled
                ? 'Upload disabled'
                : readOnly
                ? 'Upload read-only'
                : 'Drag and drop video files here, or click to select files'}
            </p>
          </div>
        )}
      </div>
    );
  }
);

VideoUploadDropZone.displayName = 'VideoUpload.DropZone';

// Preview component
export interface VideoUploadPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ((context: VideoUploadContextValue) => React.ReactNode) | React.ReactNode;
}

export const VideoUploadPreview = forwardRef<HTMLDivElement, VideoUploadPreviewProps>(
  ({ children, ...props }, ref) => {
    const context = useVideoUploadContext();

    return (
      <div {...props} ref={ref}>
        {typeof children === 'function' ? children(context) : children}
      </div>
    );
  }
);

VideoUploadPreview.displayName = 'VideoUpload.Preview';

// Preview item component
export interface VideoUploadPreviewItemProps extends React.HTMLAttributes<HTMLDivElement> {
  file: VideoFile;
  children?: React.ReactNode;
}

export const VideoUploadPreviewItem = forwardRef<HTMLDivElement, VideoUploadPreviewItemProps>(
  ({ file, children, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

VideoUploadPreviewItem.displayName = 'VideoUpload.PreviewItem';

// Remove button component
export interface VideoUploadRemoveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  file: VideoFile;
  children?: React.ReactNode;
}

export const VideoUploadRemoveButton = forwardRef<HTMLButtonElement, VideoUploadRemoveButtonProps>(
  ({ file, children, ...props }, ref) => {
    const { removeFile, disabled, readOnly } = useVideoUploadContext();

    return (
      <button
        {...props}
        ref={ref}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          removeFile(file);
          props.onClick?.(e);
        }}
        disabled={disabled || readOnly || props.disabled}
        aria-label={`Remove ${file.name}`}
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

VideoUploadRemoveButton.displayName = 'VideoUpload.RemoveButton';

// Player component
export interface VideoUploadPlayerProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  file: VideoFile;
}

export const VideoUploadPlayer = forwardRef<HTMLVideoElement, VideoUploadPlayerProps>(
  ({ file, ...props }, ref) => {
    return (
      <video
        {...props}
        ref={ref}
        src={file.preview}
        controls
        width={props.width || 160}
        height={props.height || 90}
      />
    );
  }
);

VideoUploadPlayer.displayName = 'VideoUpload.Player';

// Thumbnail component
export interface VideoUploadThumbnailProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  file: VideoFile;
  index?: number;
}

export const VideoUploadThumbnail = forwardRef<HTMLImageElement, VideoUploadThumbnailProps>(
  ({ file, index = 0, ...props }, ref) => {
    const thumbnailSrc = file.thumbnails && file.thumbnails.length > index
      ? file.thumbnails[index]
      : file.preview;

    return (
      <img
        {...props}
        ref={ref}
        src={thumbnailSrc}
        alt={`Thumbnail for ${file.name}`}
        width={props.width || 160}
        height={props.height || 90}
      />
    );
  }
);

VideoUploadThumbnail.displayName = 'VideoUpload.Thumbnail';

// Progress component
export interface VideoUploadProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  file: VideoFile;
  children?: React.ReactNode;
}

export const VideoUploadProgress = forwardRef<HTMLDivElement, VideoUploadProgressProps>(
  ({ file, children, ...props }, ref) => {
    return (
      <div {...props} ref={ref} role="progressbar" aria-valuenow={file.progress}>
        {children || (
          <div style={{ 
            height: '4px', 
            backgroundColor: '#e2e8f0', 
            borderRadius: '2px', 
            overflow: 'hidden', 
            position: 'relative' 
          }}>
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
          </div>
        )}
      </div>
    );
  }
);

VideoUploadProgress.displayName = 'VideoUpload.Progress';

// Error component
export interface VideoUploadErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  file: VideoFile;
  children?: React.ReactNode;
}

export const VideoUploadError = forwardRef<HTMLDivElement, VideoUploadErrorProps>(
  ({ file, children, ...props }, ref) => {
    return (
      <div {...props} ref={ref} role="alert">
        {children || (
          <div style={{ color: '#ef4444' }}>
            {file.error || 'An error occurred while uploading the file.'}
          </div>
        )}
      </div>
    );
  }
);

VideoUploadError.displayName = 'VideoUpload.Error';

// Button component
export interface VideoUploadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const VideoUploadButton = forwardRef<HTMLButtonElement, VideoUploadButtonProps>(
  ({ children, ...props }, ref) => {
    const { uploadFiles, isUploading, disabled, readOnly } = useVideoUploadContext();

    return (
      <button
        {...props}
        ref={ref}
        type="button"
        onClick={(e) => {
          uploadFiles();
          props.onClick?.(e);
        }}
        disabled={isUploading || disabled || readOnly || props.disabled}
      >
        {children || (isUploading ? 'Uploading...' : 'Upload Files')}
      </button>
    );
  }
);

VideoUploadButton.displayName = 'VideoUpload.Button';

// Thumbnails container component
export interface VideoUploadThumbnailsProps extends React.HTMLAttributes<HTMLDivElement> {
  file: VideoFile;
  children?: React.ReactNode;
}

export const VideoUploadThumbnails = forwardRef<HTMLDivElement, VideoUploadThumbnailsProps>(
  ({ file, children, ...props }, ref) => {
    const { thumbnailWidth, thumbnailHeight } = useVideoUploadContext();

    return (
      <div {...props} ref={ref}>
        {children || (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {file.thumbnails?.map((_, index) => (
              <VideoUploadThumbnail
                key={index}
                file={file}
                index={index}
                width={thumbnailWidth}
                height={thumbnailHeight}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

VideoUploadThumbnails.displayName = 'VideoUpload.Thumbnails';

// Create the VideoUpload component with all its subcomponents
export const VideoUploadHeadless = Object.assign(VideoUploadRoot, {
  Label: VideoUploadLabel,
  Input: VideoUploadInput,
  DropZone: VideoUploadDropZone,
  Preview: VideoUploadPreview,
  PreviewItem: VideoUploadPreviewItem,
  RemoveButton: VideoUploadRemoveButton,
  Player: VideoUploadPlayer,
  Thumbnail: VideoUploadThumbnail,
  Thumbnails: VideoUploadThumbnails,
  Progress: VideoUploadProgress,
  Error: VideoUploadError,
  Button: VideoUploadButton,
});

export default VideoUploadHeadless;
