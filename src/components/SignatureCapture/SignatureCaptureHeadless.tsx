import React, { createContext, useContext, forwardRef } from 'react';
import { useSignatureCapture, UseSignatureCaptureReturn, SignatureCaptureOptions, Stroke } from './useSignatureCapture';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the SignatureCapture component
interface SignatureCaptureContextValue extends UseSignatureCaptureReturn {}

const SignatureCaptureContext = createContext<SignatureCaptureContextValue | null>(null);

// Hook to use SignatureCapture context
export function useSignatureCaptureContext() {
  const context = useContext(SignatureCaptureContext);
  if (!context) {
    throw new Error('useSignatureCaptureContext must be used within a SignatureCaptureHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends SignatureCaptureOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const signatureCaptureProps = useSignatureCapture(options);
    
    return (
      <SignatureCaptureContext.Provider value={signatureCaptureProps}>
        <div ref={ref}>
          {children}
        </div>
      </SignatureCaptureContext.Provider>
    );
  }
);

Root.displayName = 'SignatureCaptureHeadless.Root';

// Canvas component props
export type CanvasProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Canvas component
const Canvas = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'canvas';
    const { getSignaturePadProps } = useSignatureCaptureContext();
    
    const signaturePadProps = getSignaturePadProps();
    
    return (
      <Component 
        {...signaturePadProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Canvas.displayName = 'SignatureCaptureHeadless.Canvas';

// Controls component props
export type ControlsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      clear: () => void;
      undo: () => void;
      isEmpty: boolean;
      setPenColor: (color: string) => void;
      setPenWidth: (width: number) => void;
      setBackgroundColor: (color: string) => void;
    }) => React.ReactNode);
  }
>;

// Controls component
const Controls = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { 
      clear, 
      undo, 
      isEmpty, 
      setPenColor, 
      setPenWidth, 
      setBackgroundColor 
    } = useSignatureCaptureContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ clear, undo, isEmpty, setPenColor, setPenWidth, setBackgroundColor }) 
          : children}
      </Component>
    );
  }
);

Controls.displayName = 'SignatureCaptureHeadless.Controls';

// Export component props
export type ExportProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      toDataURL: (type?: string, encoderOptions?: number) => string;
      toSVG: () => string;
      isEmpty: boolean;
    }) => React.ReactNode);
  }
>;

// Export component
const Export = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { toDataURL, toSVG, isEmpty } = useSignatureCaptureContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ toDataURL, toSVG, isEmpty }) 
          : children}
      </Component>
    );
  }
);

Export.displayName = 'SignatureCaptureHeadless.Export';

// Preview component props
export type PreviewProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Type of the preview image
     */
    type?: string;
    /**
     * Encoder options for the preview image
     */
    encoderOptions?: number;
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: {
      dataURL: string;
      isEmpty: boolean;
    }) => React.ReactNode);
  }
>;

// Preview component
const Preview = forwardRef<any, any>(
  ({ as, type = 'image/png', encoderOptions = 1, children, ...props }, ref) => {
    const Component = as || 'div';
    const { toDataURL, isEmpty } = useSignatureCaptureContext();
    
    const dataURL = isEmpty ? '' : toDataURL(type, encoderOptions);
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ dataURL, isEmpty }) 
          : children || (
              !isEmpty && (
                <img 
                  src={dataURL} 
                  alt="Signature Preview" 
                  style={{ maxWidth: '100%' }} 
                />
              )
            )}
      </Component>
    );
  }
);

Preview.displayName = 'SignatureCaptureHeadless.Preview';

// Empty component props
export type EmptyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Empty component
const Empty = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { isEmpty } = useSignatureCaptureContext();
    
    if (!isEmpty) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

Empty.displayName = 'SignatureCaptureHeadless.Empty';

// NotEmpty component props
export type NotEmptyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// NotEmpty component
const NotEmpty = forwardRef<any, any>(
  ({ as, children, ...props }, ref) => {
    const Component = as || 'div';
    const { isEmpty } = useSignatureCaptureContext();
    
    if (isEmpty) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

NotEmpty.displayName = 'SignatureCaptureHeadless.NotEmpty';

// Export all components
export const SignatureCaptureHeadless = {
  Root,
  Canvas,
  Controls,
  Export,
  Preview,
  Empty,
  NotEmpty,
  useSignatureCaptureContext,
};

export default SignatureCaptureHeadless;
