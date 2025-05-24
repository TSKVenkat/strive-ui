import React, { createContext, useContext, forwardRef } from 'react';
import { useDocumentUpload, UseDocumentUploadReturn, DocumentFile } from './useDocumentUpload';

// Define the props for the DocumentUpload component
export interface DocumentUploadProps extends React.HTMLAttributes<HTMLDivElement> {
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
   * Whether to generate previews for documents
   */
  generatePreviews?: boolean;
  /**
   * Custom preview renderer for specific file types
   */
  previewRenderer?: (file: DocumentFile) => string | null;
  /**
   * Label text for the upload
   */
  label?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the DocumentUpload
export interface DocumentUploadContextValue extends UseDocumentUploadReturn {
  label?: string;
}

const DocumentUploadContext = createContext<DocumentUploadContextValue | undefined>(undefined);

// Hook to use the DocumentUpload context
export function useDocumentUploadContext() {
  const context = useContext(DocumentUploadContext);
  if (!context) {
    throw new Error('useDocumentUploadContext must be used within a DocumentUploadProvider');
  }
  return context;
}

// Root component
export const DocumentUploadRoot = forwardRef<HTMLDivElement, DocumentUploadProps>(
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
      generatePreviews,
      previewRenderer,
      label,
      children,
      ...props
    },
    ref
  ) => {
    // Use the document upload hook
    const documentUpload = useDocumentUpload({
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
      generatePreviews,
      previewRenderer,
    });

    // Get container props
    const containerProps = documentUpload.getContainerProps(props);

    return (
      <DocumentUploadContext.Provider value={{ ...documentUpload, label }}>
        <div {...containerProps} ref={ref}>
          {children || (
            <>
              <DocumentUploadLabel>{label}</DocumentUploadLabel>
              <DocumentUploadDropZone />
              <DocumentUploadInput />
              <DocumentUploadPreview>
                {(context) =>
                  context.files.map((file) => (
                    <DocumentUploadPreviewItem key={file.name} file={file}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <DocumentUploadIcon file={file} />
                        <div style={{ flex: 1 }}>
                          <div>{file.name}</div>
                          <div>
                            {Math.round(file.size / 1024)} KB
                            {file.pageCount && ` • ${file.pageCount} pages`}
                          </div>
                          {file.status === 'uploading' && (
                            <DocumentUploadProgress file={file} />
                          )}
                          {file.status === 'error' && (
                            <DocumentUploadError file={file} />
                          )}
                        </div>
                        <DocumentUploadRemoveButton file={file} />
                      </div>
                    </DocumentUploadPreviewItem>
                  ))
                }
              </DocumentUploadPreview>
              {documentUpload.files.length > 0 && uploadFn && (
                <DocumentUploadButton />
              )}
            </>
          )}
        </div>
      </DocumentUploadContext.Provider>
    );
  }
);

DocumentUploadRoot.displayName = 'DocumentUpload';

// Label component
export interface DocumentUploadLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export const DocumentUploadLabel = forwardRef<HTMLLabelElement, DocumentUploadLabelProps>(
  ({ children, ...props }, ref) => {
    const { id, label } = useDocumentUploadContext();

    return (
      <label {...props} ref={ref} htmlFor={`${id}-input`}>
        {children || label}
      </label>
    );
  }
);

DocumentUploadLabel.displayName = 'DocumentUpload.Label';

// Input component
export interface DocumentUploadInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const DocumentUploadInput = forwardRef<HTMLInputElement, DocumentUploadInputProps>(
  (props, ref) => {
    const { getInputProps } = useDocumentUploadContext();
    const inputProps = getInputProps({ ...props, ref });

    return <input {...inputProps} />;
  }
);

DocumentUploadInput.displayName = 'DocumentUpload.Input';

// Drop zone component
export interface DocumentUploadDropZoneProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DocumentUploadDropZone = forwardRef<HTMLDivElement, DocumentUploadDropZoneProps>(
  ({ children, ...props }, ref) => {
    const { getDropZoneProps, disabled, readOnly } = useDocumentUploadContext();
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
                : 'Drag and drop document files here, or click to select files'}
            </p>
          </div>
        )}
      </div>
    );
  }
);

DocumentUploadDropZone.displayName = 'DocumentUpload.DropZone';

// Preview component
export interface DocumentUploadPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ((context: DocumentUploadContextValue) => React.ReactNode) | React.ReactNode;
}

export const DocumentUploadPreview = forwardRef<HTMLDivElement, DocumentUploadPreviewProps>(
  ({ children, ...props }, ref) => {
    const context = useDocumentUploadContext();

    return (
      <div {...props} ref={ref}>
        {typeof children === 'function' ? children(context) : children}
      </div>
    );
  }
);

DocumentUploadPreview.displayName = 'DocumentUpload.Preview';

// Preview item component
export interface DocumentUploadPreviewItemProps extends React.HTMLAttributes<HTMLDivElement> {
  file: DocumentFile;
  children?: React.ReactNode;
}

export const DocumentUploadPreviewItem = forwardRef<HTMLDivElement, DocumentUploadPreviewItemProps>(
  ({ file, children, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

DocumentUploadPreviewItem.displayName = 'DocumentUpload.PreviewItem';

// Remove button component
export interface DocumentUploadRemoveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  file: DocumentFile;
  children?: React.ReactNode;
}

export const DocumentUploadRemoveButton = forwardRef<HTMLButtonElement, DocumentUploadRemoveButtonProps>(
  ({ file, children, ...props }, ref) => {
    const { removeFile, disabled, readOnly } = useDocumentUploadContext();

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

DocumentUploadRemoveButton.displayName = 'DocumentUpload.RemoveButton';

// Icon component
export interface DocumentUploadIconProps extends React.HTMLAttributes<HTMLDivElement> {
  file: DocumentFile;
  children?: React.ReactNode;
}

export const DocumentUploadIcon = forwardRef<HTMLDivElement, DocumentUploadIconProps>(
  ({ file, children, ...props }, ref) => {
    const { getDocumentIcon } = useDocumentUploadContext();

    // If the file has a preview and it's an image, show the image
    if (file.preview && file.category === 'image') {
      return (
        <div {...props} ref={ref}>
          <img 
            src={file.preview} 
            alt={file.name} 
            style={{ 
              width: '48px', 
              height: '48px', 
              objectFit: 'cover',
              borderRadius: '4px',
            }} 
          />
        </div>
      );
    }

    // If the file has a preview and it's a PDF, show the PDF preview
    if (file.preview && file.category === 'pdf' && file.previewReady) {
      return (
        <div {...props} ref={ref}>
          <img 
            src={file.preview} 
            alt={file.name} 
            style={{ 
              width: '48px', 
              height: '48px', 
              objectFit: 'cover',
              borderRadius: '4px',
            }} 
          />
        </div>
      );
    }

    // Otherwise, show an icon based on the file type
    return (
      <div {...props} ref={ref}>
        {children || (
          <div style={{ 
            width: '48px', 
            height: '48px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f1f5f9',
            borderRadius: '4px',
            color: '#64748b',
          }}>
            {getDocumentIcon(file)}
          </div>
        )}
      </div>
    );
  }
);

DocumentUploadIcon.displayName = 'DocumentUpload.Icon';

// Preview component for documents that can be previewed
export interface DocumentUploadDocumentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  file: DocumentFile;
  children?: React.ReactNode;
}

export const DocumentUploadDocumentPreview = forwardRef<HTMLDivElement, DocumentUploadDocumentPreviewProps>(
  ({ file, children, ...props }, ref) => {
    // If the file has a preview and it's an image, show the image
    if (file.preview && file.category === 'image') {
      return (
        <div {...props} ref={ref}>
          <img 
            src={file.preview} 
            alt={file.name} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '300px', 
              objectFit: 'contain',
            }} 
          />
        </div>
      );
    }

    // If the file has a preview and it's a PDF, show the PDF preview
    if (file.preview && file.category === 'pdf') {
      return (
        <div {...props} ref={ref}>
          {file.previewReady ? (
            <iframe 
              src={file.preview} 
              title={file.name} 
              style={{ 
                width: '100%', 
                height: '300px', 
                border: 'none',
              }} 
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '300px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f1f5f9',
              borderRadius: '4px',
              color: '#64748b',
            }}>
              Loading preview...
            </div>
          )}
        </div>
      );
    }

    // For other file types, show a message
    return (
      <div {...props} ref={ref}>
        {children || (
          <div style={{ 
            width: '100%', 
            height: '100px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f1f5f9',
            borderRadius: '4px',
            color: '#64748b',
          }}>
            No preview available for this file type
          </div>
        )}
      </div>
    );
  }
);

DocumentUploadDocumentPreview.displayName = 'DocumentUpload.DocumentPreview';

// Progress component
export interface DocumentUploadProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  file: DocumentFile;
  children?: React.ReactNode;
}

export const DocumentUploadProgress = forwardRef<HTMLDivElement, DocumentUploadProgressProps>(
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

DocumentUploadProgress.displayName = 'DocumentUpload.Progress';

// Error component
export interface DocumentUploadErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  file: DocumentFile;
  children?: React.ReactNode;
}

export const DocumentUploadError = forwardRef<HTMLDivElement, DocumentUploadErrorProps>(
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

DocumentUploadError.displayName = 'DocumentUpload.Error';

// Button component
export interface DocumentUploadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

export const DocumentUploadButton = forwardRef<HTMLButtonElement, DocumentUploadButtonProps>(
  ({ children, ...props }, ref) => {
    const { uploadFiles, isUploading, disabled, readOnly } = useDocumentUploadContext();

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

DocumentUploadButton.displayName = 'DocumentUpload.Button';

// Create the DocumentUpload component with all its subcomponents
export const DocumentUploadHeadless = Object.assign(DocumentUploadRoot, {
  Label: DocumentUploadLabel,
  Input: DocumentUploadInput,
  DropZone: DocumentUploadDropZone,
  Preview: DocumentUploadPreview,
  PreviewItem: DocumentUploadPreviewItem,
  RemoveButton: DocumentUploadRemoveButton,
  Icon: DocumentUploadIcon,
  DocumentPreview: DocumentUploadDocumentPreview,
  Progress: DocumentUploadProgress,
  Error: DocumentUploadError,
  Button: DocumentUploadButton,
});

export default DocumentUploadHeadless;
