import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUpload } from './FileUpload';
import { ThemeProvider } from '../../styles/ThemeProvider';

// Mock framer-motion's AnimatePresence and motion components
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      li: ({ children, ...props }: any) => (
        <li data-testid="motion-li" {...props}>
          {children}
        </li>
      ),
    },
  };
});

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

// Create a mock File
const createMockFile = (name: string, size: number, type: string): File => {
  const file = new File(["test"], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('FileUpload', () => {
  // Basic rendering tests
  it('renders correctly with default props', () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} />);
    
    // Check that the component renders
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop files here, or')).toBeInTheDocument();
    expect(screen.getByText('Browse files')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const handleUpload = jest.fn();
    renderWithTheme(
      <FileUpload 
        onUpload={handleUpload} 
        dragDropText="Custom drag text" 
        browseText="Custom browse text" 
      />
    );
    
    expect(screen.getByText('Custom drag text')).toBeInTheDocument();
    expect(screen.getByText('Custom browse text')).toBeInTheDocument();
  });

  it('renders as disabled when disabled prop is true', () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} disabled />);
    
    // The container should have reduced opacity
    const container = screen.getByRole('button');
    expect(container).toHaveStyle('opacity: 0.6');
    expect(container).toHaveStyle('cursor: not-allowed');
    
    // The browse button should be disabled
    const browseButton = screen.getByText('Browse files');
    expect(browseButton).toBeDisabled();
  });

  // Interaction tests
  it('calls onUpload when files are selected via input', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} />);
    
    // Create a mock file
    const file = createMockFile('test.txt', 1024, 'text/plain');
    
    // Get the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });
    
    // Check that onUpload was called with the file
    expect(handleUpload).toHaveBeenCalledWith([file]);
  });

  it('supports multiple file selection when multiple is true', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} multiple />);
    
    // Create mock files
    const file1 = createMockFile('test1.txt', 1024, 'text/plain');
    const file2 = createMockFile('test2.txt', 2048, 'text/plain');
    
    // Get the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file1, file2] } });
    
    // Check that onUpload was called with both files
    expect(handleUpload).toHaveBeenCalledWith([file1, file2]);
  });

  it('validates file type when accept prop is provided', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} accept=".txt" />);
    
    // Create mock files with different types
    const validFile = createMockFile('test.txt', 1024, 'text/plain');
    const invalidFile = createMockFile('test.pdf', 1024, 'application/pdf');
    
    // Get the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate valid file selection
    fireEvent.change(input, { target: { files: [validFile] } });
    
    // Check that onUpload was called with the valid file
    expect(handleUpload).toHaveBeenCalledWith([validFile]);
    
    // Reset mock
    handleUpload.mockReset();
    
    // Simulate invalid file selection
    fireEvent.change(input, { target: { files: [invalidFile] } });
    
    // Check that onUpload was not called
    expect(handleUpload).not.toHaveBeenCalled();
    
    // Check that error message is displayed
    expect(screen.getByRole('alert')).toHaveTextContent('File type not accepted');
  });

  it('validates file size when maxSize prop is provided', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} maxSize={1000} />);
    
    // Create mock files with different sizes
    const smallFile = createMockFile('small.txt', 500, 'text/plain');
    const largeFile = createMockFile('large.txt', 1500, 'text/plain');
    
    // Get the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate small file selection
    fireEvent.change(input, { target: { files: [smallFile] } });
    
    // Check that onUpload was called with the small file
    expect(handleUpload).toHaveBeenCalledWith([smallFile]);
    
    // Reset mock
    handleUpload.mockReset();
    
    // Simulate large file selection
    fireEvent.change(input, { target: { files: [largeFile] } });
    
    // Check that onUpload was not called
    expect(handleUpload).not.toHaveBeenCalled();
    
    // Check that error message is displayed
    expect(screen.getByRole('alert')).toHaveTextContent('File size exceeds the limit');
  });

  it('validates max number of files when maxFiles prop is provided', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} multiple maxFiles={2} />);
    
    // Create mock files
    const file1 = createMockFile('test1.txt', 1024, 'text/plain');
    const file2 = createMockFile('test2.txt', 1024, 'text/plain');
    const file3 = createMockFile('test3.txt', 1024, 'text/plain');
    
    // Get the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate selecting two files
    fireEvent.change(input, { target: { files: [file1, file2] } });
    
    // Check that onUpload was called with both files
    expect(handleUpload).toHaveBeenCalledWith([file1, file2]);
    
    // Reset mock
    handleUpload.mockReset();
    
    // Simulate selecting a third file
    fireEvent.change(input, { target: { files: [file3] } });
    
    // Check that onUpload was not called
    expect(handleUpload).not.toHaveBeenCalled();
    
    // Check that error message is displayed
    expect(screen.getByRole('alert')).toHaveTextContent('Maximum number of files exceeded');
  });

  it('displays the file list when showFileList is true', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} showFileList />);
    
    // Create a mock file
    const file = createMockFile('test.txt', 1024, 'text/plain');
    
    // Get the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });
    
    // Check that the file list is displayed
    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
      expect(screen.getByText('1 KB')).toBeInTheDocument();
    });
  });

  it('does not display the file list when showFileList is false', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} showFileList={false} />);
    
    // Create a mock file
    const file = createMockFile('test.txt', 1024, 'text/plain');
    
    // Get the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });
    
    // Check that the file list is not displayed
    await waitFor(() => {
      expect(screen.queryByText('test.txt')).not.toBeInTheDocument();
    });
  });

  it('calls onRemove when a file is removed', async () => {
    const handleUpload = jest.fn();
    const handleRemove = jest.fn();
    renderWithTheme(
      <FileUpload onUpload={handleUpload} onRemove={handleRemove} showFileList />
    );
    
    // Create a mock file
    const file = createMockFile('test.txt', 1024, 'text/plain');
    
    // Get the hidden input
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });
    
    // Wait for the file list to be displayed
    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });
    
    // Click the remove button
    const removeButton = screen.getByLabelText('Remove test.txt');
    fireEvent.click(removeButton);
    
    // Check that onRemove was called with the file
    expect(handleRemove).toHaveBeenCalledWith(file);
    
    // Check that onUpload was called with an empty array
    expect(handleUpload).toHaveBeenCalledWith([]);
  });

  // Drag and drop tests
  it('handles drag and drop events', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} />);
    
    // Create a mock file
    const file = createMockFile('test.txt', 1024, 'text/plain');
    
    // Get the drop zone
    const dropZone = screen.getByRole('button');
    
    // Simulate drag enter
    fireEvent.dragEnter(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    // Check that the drop zone has the active style
    expect(dropZone).toHaveStyle('border: 2px dashed');
    
    // Simulate drag leave
    fireEvent.dragLeave(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    // Simulate drop
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    // Check that onUpload was called with the file
    expect(handleUpload).toHaveBeenCalledWith([file]);
  });

  it('does not handle drag and drop when disabled', async () => {
    const handleUpload = jest.fn();
    renderWithTheme(<FileUpload onUpload={handleUpload} disabled />);
    
    // Create a mock file
    const file = createMockFile('test.txt', 1024, 'text/plain');
    
    // Get the drop zone
    const dropZone = screen.getByRole('button');
    
    // Simulate drop
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    // Check that onUpload was not called
    expect(handleUpload).not.toHaveBeenCalled();
  });
});
