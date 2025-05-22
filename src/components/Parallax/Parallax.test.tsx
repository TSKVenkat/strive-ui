import React from 'react';
import { render, screen } from '@testing-library/react';
import { Parallax } from './Parallax';
import { ThemeProvider } from '../../styles/ThemeProvider';

// Mock framer-motion hooks
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion');
  return {
    ...actual,
    useScroll: jest.fn(() => ({ scrollY: { get: () => 0 } })),
    useTransform: jest.fn(() => 0),
    motion: {
      div: ({ children, ...props }: any) => <div data-testid="motion-div" {...props}>{children}</div>,
    },
  };
});

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Parallax', () => {
  // Basic rendering tests
  it('renders children correctly', () => {
    renderWithTheme(
      <Parallax>
        <div data-testid="parallax-child">Test Content</div>
      </Parallax>
    );
    
    expect(screen.getByTestId('parallax-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with motion div when enabled', () => {
    renderWithTheme(
      <Parallax enabled={true}>
        <div>Test Content</div>
      </Parallax>
    );
    
    expect(screen.getByTestId('motion-div')).toBeInTheDocument();
  });

  it('renders without motion div when disabled', () => {
    renderWithTheme(
      <Parallax enabled={false}>
        <div>Test Content</div>
      </Parallax>
    );
    
    expect(screen.queryByTestId('motion-div')).not.toBeInTheDocument();
  });

  it('applies custom className to container', () => {
    renderWithTheme(
      <Parallax className="custom-class">
        <div>Test Content</div>
      </Parallax>
    );
    
    const container = screen.getByText('Test Content').parentElement?.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('applies custom style to container', () => {
    renderWithTheme(
      <Parallax style={{ backgroundColor: 'red' }}>
        <div>Test Content</div>
      </Parallax>
    );
    
    const container = screen.getByText('Test Content').parentElement?.parentElement;
    expect(container).toHaveStyle('background-color: red');
  });

  it('applies custom z-index when provided', () => {
    renderWithTheme(
      <Parallax zIndex={10}>
        <div>Test Content</div>
      </Parallax>
    );
    
    const container = screen.getByText('Test Content').parentElement?.parentElement;
    expect(container).toHaveStyle('z-index: 10');
  });

  // Hook usage tests
  it('calls useScroll with undefined target when useViewport is true', () => {
    const { useScroll } = require('framer-motion');
    useScroll.mockClear();
    
    renderWithTheme(
      <Parallax useViewport={true}>
        <div>Test Content</div>
      </Parallax>
    );
    
    expect(useScroll).toHaveBeenCalledWith(expect.objectContaining({
      target: undefined,
    }));
  });

  it('calls useTransform with correct parameters for vertical direction', () => {
    const { useTransform } = require('framer-motion');
    useTransform.mockClear();
    
    renderWithTheme(
      <Parallax speed={0.5} direction="vertical">
        <div>Test Content</div>
      </Parallax>
    );
    
    // Check that useTransform was called for y transform
    expect(useTransform).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Array),
      expect.arrayContaining([expect.any(Number), expect.any(Number)]),
      expect.any(Object)
    );
  });

  it('calls useTransform with correct parameters for horizontal direction', () => {
    const { useTransform } = require('framer-motion');
    useTransform.mockClear();
    
    renderWithTheme(
      <Parallax speed={0.5} direction="horizontal">
        <div>Test Content</div>
      </Parallax>
    );
    
    // Check that useTransform was called for x transform
    expect(useTransform).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Array),
      expect.arrayContaining([expect.any(Number), expect.any(Number)]),
      expect.any(Object)
    );
  });

  it('uses the provided easing function', () => {
    const { useTransform } = require('framer-motion');
    useTransform.mockClear();
    
    renderWithTheme(
      <Parallax easing="easeInOut">
        <div>Test Content</div>
      </Parallax>
    );
    
    // Check that useTransform was called with the correct easing
    expect(useTransform).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Array),
      expect.any(Array),
      expect.objectContaining({ ease: 'easeInOut' })
    );
  });
});
