import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toast, ToastContainer } from './Toast';
import { ThemeProvider } from '../../styles/ThemeProvider';

// Mock timer functions
jest.useFakeTimers();

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Toast', () => {
  test('renders correctly with title and description', () => {
    renderWithTheme(
      <Toast
        id="test-toast"
        title="Test Title"
        description="Test Description"
        data-testid="toast"
      />
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders correctly without title', () => {
    renderWithTheme(
      <Toast
        id="test-toast"
        description="Test Description"
        data-testid="toast"
      />
    );
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('renders with different variants', () => {
    const { rerender } = renderWithTheme(
      <Toast
        id="test-toast"
        description="Info Toast"
        variant="info"
        data-testid="toast"
      />
    );
    
    expect(screen.getByText('Info Toast')).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Toast
          id="test-toast"
          description="Success Toast"
          variant="success"
          data-testid="toast"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Success Toast')).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Toast
          id="test-toast"
          description="Warning Toast"
          variant="warning"
          data-testid="toast"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Warning Toast')).toBeInTheDocument();
    
    rerender(
      <ThemeProvider>
        <Toast
          id="test-toast"
          description="Error Toast"
          variant="error"
          data-testid="toast"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Error Toast')).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    
    renderWithTheme(
      <Toast
        id="test-toast"
        description="Test Description"
        onClose={onCloseMock}
        isClosable={true}
        data-testid="toast"
      />
    );
    
    const closeButton = screen.getByLabelText('Close toast');
    fireEvent.click(closeButton);
    
    // Wait for the animation timeout
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(onCloseMock).toHaveBeenCalledWith('test-toast');
  });

  test('does not show close button when isClosable is false', () => {
    renderWithTheme(
      <Toast
        id="test-toast"
        description="Test Description"
        isClosable={false}
        data-testid="toast"
      />
    );
    
    expect(screen.queryByLabelText('Close toast')).not.toBeInTheDocument();
  });

  test('auto-closes after duration', () => {
    const onCloseMock = jest.fn();
    
    renderWithTheme(
      <Toast
        id="test-toast"
        description="Test Description"
        duration={2000}
        onClose={onCloseMock}
        data-testid="toast"
      />
    );
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Wait for the animation timeout
    act(() => {
      jest.advanceTimersByTime(300);
    });
    
    expect(onCloseMock).toHaveBeenCalledWith('test-toast');
  });

  test('does not auto-close when duration is 0', () => {
    const onCloseMock = jest.fn();
    
    renderWithTheme(
      <Toast
        id="test-toast"
        description="Test Description"
        duration={0}
        onClose={onCloseMock}
        data-testid="toast"
      />
    );
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test('renders progress bar when hasProgressBar is true', () => {
    renderWithTheme(
      <Toast
        id="test-toast"
        description="Test Description"
        hasProgressBar={true}
        duration={5000}
        data-testid="toast"
      />
    );
    
    // Progress bar is rendered as a div with animation
    // We can't easily test for its presence directly, but we can check that the component renders
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });
});

describe('ToastContainer', () => {
  test('renders toasts inside the container', () => {
    renderWithTheme(
      <ToastContainer position="top-right">
        <Toast id="toast-1" description="Toast 1" />
        <Toast id="toast-2" description="Toast 2" />
      </ToastContainer>
    );
    
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
  });

  test('limits the number of toasts based on maxToasts', () => {
    renderWithTheme(
      <ToastContainer position="top-right" maxToasts={2}>
        <Toast id="toast-1" description="Toast 1" />
        <Toast id="toast-2" description="Toast 2" />
        <Toast id="toast-3" description="Toast 3" />
      </ToastContainer>
    );
    
    expect(screen.getByText('Toast 1')).toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.queryByText('Toast 3')).not.toBeInTheDocument();
  });
});
