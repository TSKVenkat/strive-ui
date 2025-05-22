import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from './Modal';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Modal', () => {
  const onCloseMock = jest.fn();
  
  beforeEach(() => {
    onCloseMock.mockClear();
    // Mock document methods for scroll locking
    Object.defineProperty(document.body.style, 'overflow', {
      configurable: true,
      value: '',
    });
  });

  test('renders correctly when open', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    renderWithTheme(
      <Modal isOpen={false} onClose={onCloseMock} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  test('calls onClose when clicking the close button', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={onCloseMock} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when clicking the overlay if closeOnOverlayClick is true', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={onCloseMock} closeOnOverlayClick={true}>
        <p>Modal content</p>
      </Modal>
    );
    
    // Find the overlay (parent of the modal content)
    const overlay = screen.getByText('Modal content').parentElement?.parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    }
  });

  test('does not call onClose when clicking the overlay if closeOnOverlayClick is false', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={onCloseMock} closeOnOverlayClick={false}>
        <p>Modal content</p>
      </Modal>
    );
    
    // Find the overlay (parent of the modal content)
    const overlay = screen.getByText('Modal content').parentElement?.parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(onCloseMock).not.toHaveBeenCalled();
    }
  });

  test('calls onClose when pressing Escape key if closeOnEsc is true', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={onCloseMock} closeOnEsc={true}>
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when pressing Escape key if closeOnEsc is false', () => {
    renderWithTheme(
      <Modal isOpen={true} onClose={onCloseMock} closeOnEsc={false}>
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test('renders with footer when provided', () => {
    renderWithTheme(
      <Modal 
        isOpen={true} 
        onClose={onCloseMock} 
        footer={<button>Footer Button</button>}
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Footer Button')).toBeInTheDocument();
  });

  test('does not show close button when showCloseButton is false', () => {
    renderWithTheme(
      <Modal 
        isOpen={true} 
        onClose={onCloseMock} 
        showCloseButton={false}
        title="No Close Button"
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  test('locks body scroll when blockScrollOnMount is true', () => {
    renderWithTheme(
      <Modal 
        isOpen={true} 
        onClose={onCloseMock} 
        blockScrollOnMount={true}
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
  });

  test('does not lock body scroll when blockScrollOnMount is false', () => {
    const originalOverflow = document.body.style.overflow;
    
    renderWithTheme(
      <Modal 
        isOpen={true} 
        onClose={onCloseMock} 
        blockScrollOnMount={false}
      >
        <p>Modal content</p>
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe(originalOverflow);
  });
});
