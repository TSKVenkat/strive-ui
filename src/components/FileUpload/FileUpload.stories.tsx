import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { FileUpload, FileUploadProps } from './FileUpload';
import styled from 'styled-components';

export default {
  title: 'Components/FileUpload',
  component: FileUpload,
  argTypes: {
    multiple: {
      control: 'boolean',
    },
    accept: {
      control: 'text',
    },
    maxSize: {
      control: { type: 'number' },
    },
    maxFiles: {
      control: { type: 'number' },
    },
    showFileList: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    dragDropText: {
      control: 'text',
    },
    browseText: {
      control: 'text',
    },
  },
} as Meta;

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
`;

const FileDetails = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const FileDetailsTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 12px;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const FileDetailsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FileDetailsItem = styled.li`
  margin-bottom: 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const Template: Story<FileUploadProps> = (args) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const handleUpload = (files: File[]) => {
    setUploadedFiles(files);
    console.log('Files uploaded:', files);
  };
  
  const handleRemove = (file: File) => {
    console.log('File removed:', file);
  };
  
  return (
    <Container>
      <FileUpload 
        {...args} 
        onUpload={handleUpload}
        onRemove={handleRemove}
      />
      
      {uploadedFiles.length > 0 && (
        <FileDetails>
          <FileDetailsTitle>Uploaded Files</FileDetailsTitle>
          <FileDetailsList>
            {uploadedFiles.map((file, index) => (
              <FileDetailsItem key={index}>
                <strong>{file.name}</strong> ({file.type || 'unknown'}) - {(file.size / 1024).toFixed(2)} KB
              </FileDetailsItem>
            ))}
          </FileDetailsList>
        </FileDetails>
      )}
    </Container>
  );
};

export const Default = Template.bind({});
Default.args = {
  multiple: false,
  showFileList: true,
  disabled: false,
  dragDropText: 'Drag and drop files here, or',
  browseText: 'Browse files',
};

export const MultipleFiles = Template.bind({});
MultipleFiles.args = {
  multiple: true,
  showFileList: true,
  disabled: false,
  dragDropText: 'Drag and drop files here, or',
  browseText: 'Browse files',
};

export const ImageUpload = Template.bind({});
ImageUpload.args = {
  multiple: true,
  accept: 'image/*',
  showFileList: true,
  disabled: false,
  dragDropText: 'Drag and drop images here, or',
  browseText: 'Browse images',
};

export const PDFUpload = Template.bind({});
PDFUpload.args = {
  multiple: true,
  accept: '.pdf',
  showFileList: true,
  disabled: false,
  dragDropText: 'Drag and drop PDF files here, or',
  browseText: 'Browse PDF files',
};

export const MaxFileSize = Template.bind({});
MaxFileSize.args = {
  multiple: true,
  maxSize: 1024 * 1024, // 1MB
  showFileList: true,
  disabled: false,
  dragDropText: 'Drag and drop files here (max 1MB), or',
  browseText: 'Browse files',
};

export const MaxFiles = Template.bind({});
MaxFiles.args = {
  multiple: true,
  maxFiles: 3,
  showFileList: true,
  disabled: false,
  dragDropText: 'Drag and drop up to 3 files, or',
  browseText: 'Browse files',
};

export const HideFileList = Template.bind({});
HideFileList.args = {
  multiple: true,
  showFileList: false,
  disabled: false,
  dragDropText: 'Drag and drop files here, or',
  browseText: 'Browse files',
};

export const Disabled = Template.bind({});
Disabled.args = {
  multiple: true,
  showFileList: true,
  disabled: true,
  dragDropText: 'File upload is disabled',
  browseText: 'Browse files',
};

export const CustomText = Template.bind({});
CustomText.args = {
  multiple: true,
  showFileList: true,
  disabled: false,
  dragDropText: 'Drop your files in this area or',
  browseText: 'Select from your device',
};
