import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface UseDocumentUploadProps {
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
}

export interface DocumentFile extends File {
  /**
   * Preview URL
   */
  preview?: string;
  /**
   * Upload progress (0-100)
   */
  progress?: number;
  /**
   * Upload status
   */
  status?: 'idle' | 'uploading' | 'success' | 'error';
  /**
   * Error message
   */
  error?: string;
  /**
   * Document type category
   */
  category?: 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image' | 'text' | 'archive' | 'other';
  /**
   * Number of pages (for PDFs)
   */
  pageCount?: number;
  /**
   * Whether the preview is ready
   */
  previewReady?: boolean;
}

export interface UseDocumentUploadReturn {
  /**
   * Current files
   */
  files: DocumentFile[];
  /**
   * Whether the upload is disabled
   */
  disabled: boolean;
  /**
   * Whether the upload is read-only
   */
  readOnly: boolean;
  /**
   * Whether the upload is required
   */
  required: boolean;
  /**
   * Whether the upload is in progress
   */
  isUploading: boolean;
  /**
   * Upload ID
   */
  id: string;
  /**
   * Upload name
   */
  name: string | undefined;
  /**
   * Accept attribute for the file input
   */
  accept: string;
  /**
   * Maximum file size in bytes
   */
  maxSize: number | undefined;
  /**
   * Maximum number of files
   */
  maxFiles: number | undefined;
  /**
   * Whether to allow multiple files
   */
  multiple: boolean;
  /**
   * Whether to generate previews for documents
   */
  generatePreviews: boolean;
  /**
   * Reference to the file input element
   */
  inputRef: React.RefObject<HTMLInputElement>;
  /**
   * Reference to the drop zone element
   */
  dropZoneRef: React.RefObject<HTMLDivElement>;
  /**
   * Add files
   */
  addFiles: (files: File[]) => void;
  /**
   * Remove file
   */
  removeFile: (file: File) => void;
  /**
   * Remove all files
   */
  removeAllFiles: () => void;
  /**
   * Upload files
   */
  uploadFiles: () => Promise<string[]>;
  /**
   * Open file dialog
   */
  openFileDialog: () => void;
  /**
   * Get document category based on file type
   */
  getDocumentCategory: (file: File) => DocumentFile['category'];
  /**
   * Get document icon based on file type
   */
  getDocumentIcon: (file: File) => React.ReactNode;
  /**
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { 'data-disabled'?: string; 'data-readonly'?: string; 'data-required'?: string };
  /**
   * Get props for the input element
   */
  getInputProps: <E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => React.InputHTMLAttributes<E>;
  /**
   * Get props for the drop zone element
   */
  getDropZoneProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & { 'data-disabled'?: string; 'data-readonly'?: string };
}

/**
 * Hook for creating document upload functionality.
 */
export function useDocumentUpload({
  defaultFiles = [],
  files: controlledFiles,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.csv,.zip,.rar',
  maxSize,
  maxFiles,
  multiple = false,
  onFilesAdded,
  onFilesRemoved,
  onFilesRejected,
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  uploadFn,
  generatePreviews = true,
  previewRenderer,
}: UseDocumentUploadProps = {}): UseDocumentUploadReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const uploadId = id || `document-upload-${generatedId}`;
  
  // State for files
  const [internalFiles, setInternalFiles] = useState<DocumentFile[]>(
    defaultFiles.map(enhanceFile)
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Use controlled or uncontrolled files
  const files = controlledFiles !== undefined 
    ? controlledFiles.map(enhanceFile) 
    : internalFiles;
  
  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Determine document category based on file type
  const getDocumentCategory = useCallback((file: File): DocumentFile['category'] => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const type = file.type.toLowerCase();
    
    if (type.includes('pdf') || extension === 'pdf') {
      return 'pdf';
    } else if (
      type.includes('msword') || 
      type.includes('wordprocessingml') || 
      extension === 'doc' || 
      extension === 'docx'
    ) {
      return 'word';
    } else if (
      type.includes('ms-excel') || 
      type.includes('spreadsheetml') || 
      extension === 'xls' || 
      extension === 'xlsx' ||
      extension === 'csv'
    ) {
      return 'excel';
    } else if (
      type.includes('ms-powerpoint') || 
      type.includes('presentationml') || 
      extension === 'ppt' || 
      extension === 'pptx'
    ) {
      return 'powerpoint';
    } else if (
      type.includes('image/') || 
      ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension || '')
    ) {
      return 'image';
    } else if (
      type.includes('text/') || 
      ['txt', 'rtf', 'md'].includes(extension || '')
    ) {
      return 'text';
    } else if (
      type.includes('zip') || 
      type.includes('rar') || 
      type.includes('tar') || 
      type.includes('gzip') || 
      ['zip', 'rar', 'tar', 'gz', '7z'].includes(extension || '')
    ) {
      return 'archive';
    } else {
      return 'other';
    }
  }, []);
  
  // Get document icon based on file type
  const getDocumentIcon = useCallback((file: File): React.ReactNode => {
    const category = getDocumentCategory(file);
    
    // Return a placeholder icon based on category
    // In a real implementation, this would return SVG icons
    return category;
  }, [getDocumentCategory]);
  
  // Enhance file with preview URL and metadata
  function enhanceFile(file: File): DocumentFile {
    if ((file as DocumentFile).preview) {
      return file as DocumentFile;
    }
    
    const documentFile = file as DocumentFile;
    documentFile.category = getDocumentCategory(file);
    
    // Create preview URL for supported file types
    if (documentFile.category === 'image') {
      documentFile.preview = URL.createObjectURL(file);
      documentFile.previewReady = true;
    } else if (documentFile.category === 'pdf' && generatePreviews) {
      // For PDFs, we would use a PDF.js library to render a preview
      // This is a simplified implementation
      documentFile.preview = URL.createObjectURL(file);
      documentFile.previewReady = false;
      
      // In a real implementation, we would use PDF.js to get page count
      // and render the first page as a preview
      setTimeout(() => {
        documentFile.pageCount = 1; // Placeholder
        documentFile.previewReady = true;
        
        // Update state to trigger re-render with new metadata
        if (controlledFiles === undefined) {
          setInternalFiles(prevFiles => [...prevFiles]);
        }
      }, 500);
    } else if (previewRenderer) {
      // Use custom preview renderer if provided
      const customPreview = previewRenderer(documentFile);
      if (customPreview) {
        documentFile.preview = customPreview;
        documentFile.previewReady = true;
      }
    }
    
    documentFile.progress = 0;
    documentFile.status = 'idle';
    
    return documentFile;
  }
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview && file.category !== 'pdf') {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);
  
  // Add files
  const addFiles = useCallback((newFiles: File[]) => {
    // Filter files by type if accept is specified
    const validTypeFiles = accept 
      ? newFiles.filter(file => {
          const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
          const fileType = file.type.toLowerCase();
          
          // Check if file type matches any of the accepted types
          const isValidType = accept.split(',').some(acceptedType => {
            acceptedType = acceptedType.trim().toLowerCase();
            return acceptedType === fileType || 
                  (acceptedType.startsWith('.') && fileExtension === acceptedType) ||
                  (acceptedType.endsWith('/*') && fileType.startsWith(acceptedType.slice(0, -1)));
          });
          
          if (!isValidType && onFilesRejected) {
            onFilesRejected([file], 'type');
          }
          
          return isValidType;
        })
      : newFiles;
    
    // Filter files by size
    const validSizeFiles = maxSize 
      ? validTypeFiles.filter(file => {
          const isValidSize = file.size <= maxSize;
          if (!isValidSize && onFilesRejected) {
            onFilesRejected([file], 'size');
          }
          return isValidSize;
        })
      : validTypeFiles;
    
    // Check if adding these files would exceed maxFiles
    if (maxFiles !== undefined) {
      const totalFiles = multiple 
        ? files.length + validSizeFiles.length 
        : validSizeFiles.length;
      
      if (totalFiles > maxFiles) {
        if (onFilesRejected) {
          const rejectedFiles = validSizeFiles.slice(maxFiles - files.length);
          onFilesRejected(rejectedFiles, 'count');
        }
        
        // Truncate the array to maxFiles
        validSizeFiles.splice(maxFiles - files.length);
      }
    }
    
    // If no files are valid, return
    if (validSizeFiles.length === 0) {
      return;
    }
    
    // Enhance files with preview URLs and metadata
    const enhancedFiles = validSizeFiles.map(enhanceFile);
    
    // Update files
    const updatedFiles = multiple 
      ? [...files, ...enhancedFiles] 
      : enhancedFiles;
    
    // Update internal state for uncontrolled component
    if (controlledFiles === undefined) {
      setInternalFiles(updatedFiles);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(updatedFiles);
    }
    
    // Call onFilesAdded callback
    if (onFilesAdded) {
      onFilesAdded(enhancedFiles);
    }
  }, [
    files, 
    multiple, 
    maxSize, 
    maxFiles, 
    accept,
    controlledFiles, 
    onChange, 
    onFilesAdded, 
    onFilesRejected,
    enhanceFile,
    previewRenderer,
    generatePreviews
  ]);
  
  // Remove file
  const removeFile = useCallback((fileToRemove: File) => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    
    // Update internal state for uncontrolled component
    if (controlledFiles === undefined) {
      setInternalFiles(updatedFiles);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange(updatedFiles);
    }
    
    // Call onFilesRemoved callback
    if (onFilesRemoved) {
      onFilesRemoved([fileToRemove]);
    }
    
    // Revoke object URL
    if ((fileToRemove as DocumentFile).preview) {
      URL.revokeObjectURL((fileToRemove as DocumentFile).preview!);
    }
  }, [files, controlledFiles, onChange, onFilesRemoved]);
  
  // Remove all files
  const removeAllFiles = useCallback(() => {
    // Revoke all object URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    
    // Update internal state for uncontrolled component
    if (controlledFiles === undefined) {
      setInternalFiles([]);
    }
    
    // Call onChange callback
    if (onChange) {
      onChange([]);
    }
    
    // Call onFilesRemoved callback
    if (onFilesRemoved) {
      onFilesRemoved(files);
    }
  }, [files, controlledFiles, onChange, onFilesRemoved]);
  
  // Upload files
  const uploadFiles = useCallback(async () => {
    if (!uploadFn || files.length === 0 || isUploading || disabled || readOnly) {
      return [];
    }
    
    setIsUploading(true);
    
    // Call onUploadStart callback
    if (onUploadStart) {
      onUploadStart();
    }
    
    try {
      // Update file status
      const updatedFiles = files.map(file => ({
        ...file,
        status: 'uploading' as const,
        progress: 0,
      }));
      
      // Update internal state for uncontrolled component
      if (controlledFiles === undefined) {
        setInternalFiles(updatedFiles);
      }
      
      // Call onChange callback
      if (onChange) {
        onChange(updatedFiles);
      }
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        if (controlledFiles === undefined) {
          setInternalFiles(prevFiles => 
            prevFiles.map(file => ({
              ...file,
              progress: Math.min((file.progress || 0) + 10, 90),
            }))
          );
        }
        
        // Call onUploadProgress callback
        if (onUploadProgress) {
          const avgProgress = files.reduce((sum, file) => sum + (file.progress || 0), 0) / files.length;
          onUploadProgress(avgProgress);
        }
      }, 500);
      
      // Upload files
      const urls = await uploadFn(files);
      
      // Clear progress interval
      clearInterval(progressInterval);
      
      // Update file status
      const completedFiles = files.map(file => ({
        ...file,
        status: 'success' as const,
        progress: 100,
      }));
      
      // Update internal state for uncontrolled component
      if (controlledFiles === undefined) {
        setInternalFiles(completedFiles);
      }
      
      // Call onChange callback
      if (onChange) {
        onChange(completedFiles);
      }
      
      // Call onUploadComplete callback
      if (onUploadComplete) {
        onUploadComplete(urls);
      }
      
      // Call onUploadProgress callback with 100%
      if (onUploadProgress) {
        onUploadProgress(100);
      }
      
      setIsUploading(false);
      return urls;
    } catch (error) {
      // Update file status
      const failedFiles = files.map(file => ({
        ...file,
        status: 'error' as const,
        error: (error as Error).message,
      }));
      
      // Update internal state for uncontrolled component
      if (controlledFiles === undefined) {
        setInternalFiles(failedFiles);
      }
      
      // Call onChange callback
      if (onChange) {
        onChange(failedFiles);
      }
      
      // Call onUploadError callback
      if (onUploadError) {
        onUploadError(error as Error);
      }
      
      setIsUploading(false);
      return [];
    }
  }, [
    files, 
    isUploading, 
    disabled, 
    readOnly, 
    uploadFn, 
    controlledFiles, 
    onChange, 
    onUploadStart, 
    onUploadProgress, 
    onUploadComplete, 
    onUploadError
  ]);
  
  // Open file dialog
  const openFileDialog = useCallback(() => {
    if (inputRef.current && !disabled && !readOnly) {
      inputRef.current.click();
    }
  }, [disabled, readOnly]);
  
  // Handle file input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      addFiles(filesArray);
      
      // Reset the input value so the same file can be selected again
      event.target.value = '';
    }
  }, [addFiles]);
  
  // Handle drop zone events
  const handleDragEnter = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled || readOnly) {
      return;
    }
    
    const fileList = event.dataTransfer.files;
    if (fileList) {
      const filesArray = Array.from(fileList);
      addFiles(filesArray);
    }
  }, [disabled, readOnly, addFiles]);
  
  // Get props for the container element
  const getContainerProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { 'data-disabled'?: string; 'data-readonly'?: string; 'data-required'?: string } => {
    return {
      ...props,
      id: uploadId,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
    } as React.HTMLAttributes<E> & { 'data-disabled'?: string; 'data-readonly'?: string; 'data-required'?: string };
  }, [uploadId, disabled, readOnly, required]);
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      type: 'file',
      id: `${uploadId}-input`,
      name,
      accept,
      multiple,
      disabled: disabled || readOnly,
      required,
      style: { display: 'none', ...props?.style },
      onChange: (event: React.ChangeEvent<E>) => {
        handleInputChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
        props?.onChange?.(event);
      },
    };
  }, [uploadId, name, accept, multiple, disabled, readOnly, required, handleInputChange]);
  
  // Get props for the drop zone element
  const getDropZoneProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> & { 'data-disabled'?: string; 'data-readonly'?: string } => {
    return {
      ...props,
      role: 'button',
      tabIndex: disabled || readOnly ? -1 : 0,
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      onClick: (event: React.MouseEvent<E>) => {
        if (!disabled && !readOnly) {
          openFileDialog();
        }
        props?.onClick?.(event);
      },
      onKeyDown: (event: React.KeyboardEvent<E>) => {
        if (!disabled && !readOnly && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          openFileDialog();
        }
        props?.onKeyDown?.(event);
      },
      onDragEnter: (event: React.DragEvent<E>) => {
        handleDragEnter(event as unknown as React.DragEvent<HTMLDivElement>);
        props?.onDragEnter?.(event);
      },
      onDragOver: (event: React.DragEvent<E>) => {
        handleDragOver(event as unknown as React.DragEvent<HTMLDivElement>);
        props?.onDragOver?.(event);
      },
      onDragLeave: (event: React.DragEvent<E>) => {
        handleDragLeave(event as unknown as React.DragEvent<HTMLDivElement>);
        props?.onDragLeave?.(event);
      },
      onDrop: (event: React.DragEvent<E>) => {
        handleDrop(event as unknown as React.DragEvent<HTMLDivElement>);
        props?.onDrop?.(event);
      },
    } as React.HTMLAttributes<E> & { 'data-disabled'?: string; 'data-readonly'?: string };
  }, [
    disabled, 
    readOnly, 
    openFileDialog, 
    handleDragEnter, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop
  ]);
  
  return {
    files,
    disabled,
    readOnly,
    required,
    isUploading,
    id: uploadId,
    name,
    accept,
    maxSize,
    maxFiles,
    multiple,
    generatePreviews,
    inputRef,
    dropZoneRef,
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
  };
}

// Helper function to merge refs
function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
}
