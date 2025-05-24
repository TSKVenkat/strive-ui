import React, { createContext, useContext, forwardRef } from 'react';
import { useBarcodeScanner, UseBarcodeScannerReturn, BarcodeScannerOptions, BarcodeResult, BarcodeFormat } from './useBarcodeScanner';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the BarcodeScanner component
interface BarcodeScannerContextValue extends UseBarcodeScannerReturn {}

const BarcodeScannerContext = createContext<BarcodeScannerContextValue | null>(null);

// Hook to use BarcodeScanner context
export function useBarcodeScannerContext() {
  const context = useContext(BarcodeScannerContext);
  if (!context) {
    throw new Error('useBarcodeScannerContext must be used within a BarcodeScannerHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends BarcodeScannerOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const barcodeScannerProps = useBarcodeScanner(options);
    
    return (
      <BarcodeScannerContext.Provider value={barcodeScannerProps}>
        <div ref={ref} style={{ position: 'relative' }}>
          {children}
        </div>
      </BarcodeScannerContext.Provider>
    );
  }
);

Root.displayName = 'BarcodeScannerHeadless.Root';

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
const Scanner = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ScannerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getVideoProps, getCanvasProps } = useBarcodeScannerContext();
    
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

Scanner.displayName = 'BarcodeScannerHeadless.Scanner';

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
const Controls = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ControlsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isScanning, startScanning, stopScanning, clearResults } = useBarcodeScannerContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ isScanning, startScanning, stopScanning, clearResults }) 
          : children}
      </Component>
    );
  }
);

Controls.displayName = 'BarcodeScannerHeadless.Controls';

// Result component props
export type ResultProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      lastResult: BarcodeResult | null;
      results: BarcodeResult[];
    }) => React.ReactNode);
  }
>;

// Result component
const Result = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ResultProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { lastResult, results } = useBarcodeScannerContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ lastResult, results }) 
          : children}
      </Component>
    );
  }
);

Result.displayName = 'BarcodeScannerHeadless.Result';

// FormatSelector component props
export type FormatSelectorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      activeFormats: BarcodeFormat[];
      setFormats: (formats: BarcodeFormat[]) => void;
      toggleFormat: (format: BarcodeFormat) => void;
    }) => React.ReactNode);
  }
>;

// FormatSelector component
const FormatSelector = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: FormatSelectorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { activeFormats, setFormats, toggleFormat } = useBarcodeScannerContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ activeFormats, setFormats, toggleFormat }) 
          : children}
      </Component>
    );
  }
);

FormatSelector.displayName = 'BarcodeScannerHeadless.FormatSelector';

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
const Error = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ErrorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { error } = useBarcodeScannerContext();
    
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

Error.displayName = 'BarcodeScannerHeadless.Error';

// Overlay component props
export type OverlayProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      isScanning: boolean;
      lastResult: BarcodeResult | null;
    }) => React.ReactNode);
  }
>;

// Overlay component
const Overlay = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: OverlayProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isScanning, lastResult } = useBarcodeScannerContext();
    
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
          ? children({ isScanning, lastResult }) 
          : children}
      </Component>
    );
  }
);

Overlay.displayName = 'BarcodeScannerHeadless.Overlay';

// Export all components
export const BarcodeScannerHeadless = {
  Root,
  Scanner,
  Controls,
  Result,
  FormatSelector,
  Error,
  Overlay,
  useBarcodeScannerContext,
};

export default BarcodeScannerHeadless;
