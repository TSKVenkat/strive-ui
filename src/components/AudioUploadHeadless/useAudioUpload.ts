import { useState, useCallback, useRef, useId, useEffect } from 'react';

export interface UseAudioUploadProps {
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
}

export interface AudioFile {
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
   * Duration in seconds
   */
  duration?: number;
  /**
   * Waveform data
   */
  waveform?: number[];
}

export interface UseAudioUploadReturn {
  /**
   * Current files
   */
  files: AudioFile[];
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
   * Get props for the container element
   */
  getContainerProps: <E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E>;
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
  ) => React.HTMLAttributes<E>;
}

/**
 * Hook for creating audio upload functionality.
 */
export function useAudioUpload({
  defaultFiles = [],
  files: controlledFiles,
  onChange,
  disabled = false,
  readOnly = false,
  required = false,
  id,
  name,
  accept = 'audio/*',
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
}: UseAudioUploadProps = {}): UseAudioUploadReturn {
  // Generate a unique ID if none is provided
  const generatedId = useId();
  const uploadId = id || `audio-upload-${generatedId}`;
  
  // State for files
  const [internalFiles, setInternalFiles] = useState<AudioFile[]>(
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
  
  // Enhance file with preview URL and metadata
  function enhanceFile(file: File): AudioFile {
    if ((file as AudioFile).preview) {
      return file as AudioFile;
    }
    
    const audioFile = file as AudioFile;
    audioFile.preview = URL.createObjectURL(file);
    audioFile.progress = 0;
    audioFile.status = 'idle';
    
    // Extract audio duration and waveform data
    const audio = new Audio();
    audio.src = audioFile.preview;
    
    audio.addEventListener('loadedmetadata', () => {
      audioFile.duration = audio.duration;
      
      // Generate waveform data (simplified version)
      // In a real implementation, you would use a library like wavesurfer.js
      // or analyze the audio data using Web Audio API
      const sampleCount = 50;
      const dummyWaveform = Array.from({ length: sampleCount }, () => 
        Math.random() * 0.8 + 0.2
      );
      audioFile.waveform = dummyWaveform;
      
      // Update state to trigger re-render with new metadata
      if (controlledFiles === undefined) {
        setInternalFiles(prevFiles => [...prevFiles]);
      }
    });
    
    return audioFile;
  }
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);
  
  // Add files
  const addFiles = useCallback((newFiles: File[]) => {
    // Filter files by type
    const validTypeFiles = newFiles.filter(file => {
      const isValidType = file.type.startsWith('audio/');
      if (!isValidType && onFilesRejected) {
        onFilesRejected([file], 'type');
      }
      return isValidType;
    });
    
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
    controlledFiles, 
    onChange, 
    onFilesAdded, 
    onFilesRejected
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
    if ((fileToRemove as AudioFile).preview) {
      URL.revokeObjectURL((fileToRemove as AudioFile).preview!);
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
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      id: uploadId,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      'data-required': required ? '' : undefined,
    };
  }, [uploadId, disabled, readOnly, required]);
  
  // Get props for the input element
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ): React.InputHTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(inputRef, props?.ref),
      type: 'file',
      id: `${uploadId}-input`,
      name,
      accept,
      multiple,
      disabled: disabled || readOnly,
      required,
      style: { display: 'none', ...props?.style },
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange(event);
        if (props?.onChange) {
          (props.onChange as any)(event);
        }
      },
    } as React.InputHTMLAttributes<E>;
  }, [uploadId, name, accept, multiple, disabled, readOnly, required, handleInputChange]);
  
  // Get props for the drop zone element
  const getDropZoneProps = useCallback(<E extends HTMLDivElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ): React.HTMLAttributes<E> => {
    return {
      ...props,
      ref: mergeRefs(dropZoneRef, props?.ref),
      role: 'button',
      tabIndex: disabled || readOnly ? -1 : 0,
      'aria-disabled': disabled ? true : undefined,
      'aria-readonly': readOnly ? true : undefined,
      'data-disabled': disabled ? '' : undefined,
      'data-readonly': readOnly ? '' : undefined,
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        if (!disabled && !readOnly) {
          openFileDialog();
        }
        if (props?.onClick) {
          (props.onClick as any)(event);
        }
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!disabled && !readOnly && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          openFileDialog();
        }
        if (props?.onKeyDown) {
          (props.onKeyDown as any)(event);
        }
      },
      onDragEnter: (event: React.DragEvent<HTMLDivElement>) => {
        handleDragEnter(event);
        if (props?.onDragEnter) {
          (props.onDragEnter as any)(event);
        }
      },
      onDragOver: (event: React.DragEvent<HTMLDivElement>) => {
        handleDragOver(event);
        if (props?.onDragOver) {
          (props.onDragOver as any)(event);
        }
      },
      onDragLeave: (event: React.DragEvent<HTMLDivElement>) => {
        handleDragLeave(event);
        if (props?.onDragLeave) {
          (props.onDragLeave as any)(event);
        }
      },
      onDrop: (event: React.DragEvent<HTMLDivElement>) => {
        handleDrop(event);
        if (props?.onDrop) {
          (props.onDrop as any)(event);
        }
      },
    } as React.HTMLAttributes<E>;
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
    inputRef,
    dropZoneRef,
    addFiles,
    removeFile,
    removeAllFiles,
    uploadFiles,
    openFileDialog,
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
      } else if (ref && ref !== null && typeof ref === 'object' && 'current' in ref) {
        (ref as React.MutableRefObject<T>).current = value;
      }
    });
  };
}
