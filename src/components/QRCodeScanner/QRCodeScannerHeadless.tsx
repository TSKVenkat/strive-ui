import React, { createContext, useContext, forwardRef } from 'react';
import { useQRCodeScanner, UseQRCodeScannerReturn, QRCodeScannerOptions, QRCodeResult } from './useQRCodeScanner';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the QRCodeScanner component
interface QRCodeScannerContextValue extends UseQRCodeScannerReturn {}

const QRCodeScannerContext = createContext<QRCodeScannerContextValue | null>(null);

// Hook to use QRCodeScanner context
export function useQRCodeScannerContext() {
  const context = useContext(QRCodeScannerContext);
  if (!context) {
    throw new globalThis.Error('useQRCodeScannerContext must be used within a QRCodeScannerHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends QRCodeScannerOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const qrCodeScannerProps = useQRCodeScanner(options);
    
    return (
      <QRCodeScannerContext.Provider value={qrCodeScannerProps}>
        <div ref={ref} style={{ position: 'relative' }}>
          {children}
        </div>
      </QRCodeScannerContext.Provider>
    );
  }
);

Root.displayName = 'QRCodeScannerHeadless.Root';

// Scanner component props
export type ScannerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Scanner component
const Scanner = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ScannerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getVideoProps, getCanvasProps } = useQRCodeScannerContext();
    
    const videoProps = getVideoProps();
    const canvasProps = getCanvasProps();
    
    return (
      <Component {...props} ref={ref} style={{ position: 'relative', ...props.style }}>
        <video {...videoProps} />
        <canvas {...canvasProps} />
        {children}
      </Component>
    );
  }
);

Scanner.displayName = 'QRCodeScannerHeadless.Scanner';

// Controls component props
export type ControlsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      isScanning: boolean;
      startScanning: () => void;
      stopScanning: () => void;
      clearResults: () => void;
    }) => React.ReactNode);
  }
>;

// Controls component
const Controls = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ControlsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isScanning, startScanning, stopScanning, clearResults } = useQRCodeScannerContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ isScanning, startScanning, stopScanning, clearResults }) 
          : children}
      </Component>
    );
  }
);

Controls.displayName = 'QRCodeScannerHeadless.Controls';

// Result component props
export type ResultProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      lastResult: QRCodeResult | null;
      results: QRCodeResult[];
    }) => React.ReactNode);
  }
>;

// Result component
const Result = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ResultProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { lastResult, results } = useQRCodeScannerContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ lastResult, results }) 
          : children}
      </Component>
    );
  }
);

Result.displayName = 'QRCodeScannerHeadless.Result';

// Error component props
export type ErrorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      error: Error;
    }) => React.ReactNode);
  }
>;

// Error component
const ErrorComponent = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ErrorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { error } = useQRCodeScannerContext();
    
    if (!error) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ error }) 
          : children || error.message}
      </Component>
    );
  }
);

ErrorComponent.displayName = 'QRCodeScannerHeadless.Error';

// Overlay component props
export type OverlayProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      isScanning: boolean;
    }) => React.ReactNode);
  }
>;

// Overlay component
const Overlay = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: OverlayProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isScanning } = useQRCodeScannerContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          ...props.style
        }}
      >
        {typeof children === 'function' 
          ? children({ isScanning }) 
          : children}
      </Component>
    );
  }
);

Overlay.displayName = 'QRCodeScannerHeadless.Overlay';

// Export all components
export const QRCodeScannerHeadless = {
  Root,
  Scanner,
  Controls,
  Result,
  Error: ErrorComponent,
  Overlay,
  useQRCodeScannerContext,
};

export default QRCodeScannerHeadless;
