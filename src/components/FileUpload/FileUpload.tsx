import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface FileUploadProps {
  /** Callback fired when files are uploaded */
  onUpload: (files: File[]) => void;
  /** Callback fired when a file is removed */
  onRemove?: (file: File) => void;
  /** Whether to accept multiple files */
  multiple?: boolean;
  /** Accepted file types */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Whether to show the file list */
  showFileList?: boolean;
  /** Whether the file upload is disabled */
  disabled?: boolean;
  /** Custom drag and drop text */
  dragDropText?: string;
  /** Custom browse text */
  browseText?: string;
  /** Custom validation error messages */
  errorMessages?: {
    maxSize?: string;
    maxFiles?: string;
    acceptedTypes?: string;
  };
  /** Additional className for the container */
  className?: string;
  /** Optional style overrides for the container */
  style?: React.CSSProperties;
  /** Aria label for the file input */
  ariaLabel?: string;
}

const Container = styled.div<{
  isDragActive: boolean;
  disabled?: boolean;
}>`
  border: 2px dashed ${({ theme, isDragActive, disabled }) => 
    disabled 
      ? theme.colors.neutral[300] 
      : isDragActive 
        ? theme.colors.primary[500] 
        : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  background-color: ${({ theme, isDragActive, disabled }) => 
    disabled 
      ? theme.colors.neutral[100] 
      : isDragActive 
        ? `${theme.colors.primary[100]}80` 
        : theme.colors.neutral[50]};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const UploadIcon = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.primary[500]};
  
  svg {
    width: 48px;
    height: 48px;
  }
`;

const UploadText = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const BrowseButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.neutral[100]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primary[700]};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing[4]} 0 0;
  max-height: 200px;
  overflow-y: auto;
`;

const FileItem = styled(motion.li)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary[500]};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const FileName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const FileSize = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.error}10`};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const UploadIconSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" fill="currentColor" />
  </svg>
);

const FileIconSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="currentColor" />
  </svg>
);

const RemoveIconSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
  </svg>
);

export const FileUpload = ({
  onUpload,
  onRemove,
  multiple = false,
  accept,
  maxSize,
  maxFiles = 0,
  showFileList = true,
  disabled = false,
  dragDropText = 'Drag and drop files here, or',
  browseText = 'Browse files',
  errorMessages = {
    maxSize: 'File size exceeds the limit',
    maxFiles: 'Maximum number of files exceeded',
    acceptedTypes: 'File type not accepted',
  },
  className,
  style,
  ariaLabel = 'File upload',
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const validateFiles = (newFiles: File[]): { valid: boolean; error?: string } => {
    // Check max files
    if (maxFiles > 0 && files.length + newFiles.length > maxFiles) {
      return { valid: false, error: errorMessages.maxFiles };
    }
    
    // Check file types and sizes
    for (const file of newFiles) {
      // Check file type
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type || '';
        const fileExtension = file.name.split('.').pop() || '';
        
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            // Check extension
            return `.${fileExtension.toLowerCase()}` === type.toLowerCase();
          } else if (type.includes('*')) {
            // Check mime type pattern (e.g., "image/*")
            const [category] = type.split('/');
            return fileType.startsWith(`${category}/`);
          } else {
            // Check exact mime type
            return fileType === type;
          }
        });
        
        if (!isAccepted) {
          return { valid: false, error: errorMessages.acceptedTypes };
        }
      }
      
      // Check file size
      if (maxSize && file.size > maxSize) {
        return { valid: false, error: errorMessages.maxSize };
      }
    }
    
    return { valid: true };
  };
  
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || disabled) return;
    
    const fileArray = Array.from(newFiles);
    const { valid, error } = validateFiles(fileArray);
    
    if (!valid) {
      setError(error || 'Invalid files');
      return;
    }
    
    setError(null);
    const updatedFiles = multiple ? [...files, ...fileArray] : fileArray;
    setFiles(updatedFiles);
    onUpload(updatedFiles);
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  }, [disabled]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (!disabled) {
      const { files } = e.dataTransfer;
      handleFiles(files);
    }
  }, [disabled, handleFiles]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    handleFiles(files);
  };
  
  const handleBrowseClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };
  
  const handleRemoveFile = (file: File) => {
    const updatedFiles = files.filter(f => f !== file);
    setFiles(updatedFiles);
    
    if (onRemove) {
      onRemove(file);
    }
    
    // If we're removing all files, also update the parent
    if (updatedFiles.length === 0) {
      onUpload([]);
    } else {
      onUpload(updatedFiles);
    }
  };
  
  return (
    <div className={className} style={style}>
      <Container
        isDragActive={isDragActive}
        disabled={disabled}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            handleBrowseClick();
          }
        }}
      >
        <UploadIcon>
          <UploadIconSvg />
        </UploadIcon>
        
        <UploadText>
          {dragDropText}
        </UploadText>
        
        <BrowseButton
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
        >
          {browseText}
        </BrowseButton>
        
        <HiddenInput
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
          aria-hidden="true"
        />
      </Container>
      
      {error && (
        <ErrorMessage role="alert">
          {error}
        </ErrorMessage>
      )}
      
      {showFileList && files.length > 0 && (
        <FileList>
          <AnimatePresence>
            {files.map((file, index) => (
              <FileItem
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FileInfo>
                  <FileIcon>
                    <FileIconSvg />
                  </FileIcon>
                  <FileName>{file.name}</FileName>
                  <FileSize>{formatFileSize(file.size)}</FileSize>
                </FileInfo>
                
                {!disabled && (
                  <RemoveButton
                    type="button"
                    onClick={() => handleRemoveFile(file)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <RemoveIconSvg />
                  </RemoveButton>
                )}
              </FileItem>
            ))}
          </AnimatePresence>
        </FileList>
      )}
    </div>
  );
};

FileUpload.displayName = 'FileUpload';
