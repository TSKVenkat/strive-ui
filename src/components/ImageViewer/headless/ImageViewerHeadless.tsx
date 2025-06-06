import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useImageViewer, 
  UseImageViewerReturn, 
  ImageViewerOptions 
} from './useImageViewer';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Helper type for polymorphic forwardRef
type PolymorphicForwardRefExoticComponent<
  DefaultElement extends React.ElementType,
  Props = {}
> = <C extends React.ElementType = DefaultElement>(
  props: PolymorphicComponentPropsWithRef<C, Props>
) => React.ReactElement | null;

// Context for the ImageViewer component
interface ImageViewerContextValue extends UseImageViewerReturn {}

const ImageViewerContext = createContext<ImageViewerContextValue | null>(null);

// Hook to use ImageViewer context
export function useImageViewerContext() {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error('useImageViewerContext must be used within an ImageViewerHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ImageViewerOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const imageViewerProps = useImageViewer(options);
    
    return (
      <ImageViewerContext.Provider value={imageViewerProps}>
        <div ref={ref}>
          {children}
        </div>
      </ImageViewerContext.Provider>
    );
  }
);

Root.displayName = 'ImageViewerHeadless.Root';

// Container component props
export type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Container component
const Container = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getContainerProps } = useImageViewerContext();
  
  const containerProps = getContainerProps();
  
  return (
    <Component 
      {...containerProps} 
      {...restProps} 
      ref={ref}
      style={{
        ...containerProps.style,
        ...restProps.style,
      }}
    >
      {children}
    </Component>
  );
}) as any;

(Container as any).displayName = 'ImageViewerHeadless.Container';

// Image component props
export type ImageProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Source URL of the image
     */
    src?: string;
    /**
     * Alt text for the image
     */
    alt?: string;
  }
>;

// Image component
const Image = forwardRef<any, any>((props, ref) => {
  const { as, src, alt, ...restProps } = props;
  const Component = as || 'img';
  const { getImageProps, setSrc, setAlt } = useImageViewerContext();
  
  // Set the source and alt if provided
  React.useEffect(() => {
    if (src) {
      setSrc(src);
    }
    if (alt) {
      setAlt(alt);
    }
  }, [src, alt, setSrc, setAlt]);
  
  const imageProps = getImageProps();
  
  return (
    <Component 
      {...imageProps} 
      {...restProps} 
      ref={ref}
      style={{
        ...imageProps.style,
        ...restProps.style,
      }}
    />
  );
}) as any;

(Image as any).displayName = 'ImageViewerHeadless.Image';

// Toolbar component props
export type ToolbarProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Toolbar component
const Toolbar = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

(Toolbar as any).displayName = 'ImageViewerHeadless.Toolbar';

// ZoomInButton component props
export type ZoomInButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ZoomInButton component
const ZoomInButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getZoomInButtonProps } = useImageViewerContext();
  
  const zoomInButtonProps = getZoomInButtonProps();
  
  return (
    <Component 
      {...zoomInButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Zoom In'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(ZoomInButton as any).displayName = 'ImageViewerHeadless.ZoomInButton';

// ZoomOutButton component props
export type ZoomOutButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ZoomOutButton component
const ZoomOutButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getZoomOutButtonProps } = useImageViewerContext();
  
  const zoomOutButtonProps = getZoomOutButtonProps();
  
  return (
    <Component 
      {...zoomOutButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Zoom Out'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(ZoomOutButton as any).displayName = 'ImageViewerHeadless.ZoomOutButton';

// ResetZoomButton component props
export type ResetZoomButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ResetZoomButton component
const ResetZoomButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getResetZoomButtonProps } = useImageViewerContext();
  
  const resetZoomButtonProps = getResetZoomButtonProps();
  
  return (
    <Component 
      {...resetZoomButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Reset Zoom'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(ResetZoomButton as any).displayName = 'ImageViewerHeadless.ResetZoomButton';

// RotateLeftButton component props
export type RotateLeftButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// RotateLeftButton component
const RotateLeftButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getRotateLeftButtonProps } = useImageViewerContext();
  
  const rotateLeftButtonProps = getRotateLeftButtonProps();
  
  return (
    <Component 
      {...rotateLeftButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Rotate Left'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(RotateLeftButton as any).displayName = 'ImageViewerHeadless.RotateLeftButton';

// RotateRightButton component props
export type RotateRightButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// RotateRightButton component
const RotateRightButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getRotateRightButtonProps } = useImageViewerContext();
  
  const rotateRightButtonProps = getRotateRightButtonProps();
  
  return (
    <Component 
      {...rotateRightButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Rotate Right'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(RotateRightButton as any).displayName = 'ImageViewerHeadless.RotateRightButton';

// ResetRotationButton component props
export type ResetRotationButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ResetRotationButton component
const ResetRotationButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getResetRotationButtonProps } = useImageViewerContext();
  
  const resetRotationButtonProps = getResetRotationButtonProps();
  
  return (
    <Component 
      {...resetRotationButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Reset Rotation'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(ResetRotationButton as any).displayName = 'ImageViewerHeadless.ResetRotationButton';

// FullscreenButton component props
export type FullscreenButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// FullscreenButton component
const FullscreenButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getFullscreenButtonProps } = useImageViewerContext();
  
  const fullscreenButtonProps = getFullscreenButtonProps();
  
  return (
    <Component 
      {...fullscreenButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Fullscreen'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(FullscreenButton as any).displayName = 'ImageViewerHeadless.FullscreenButton';

// DownloadButton component props
export type DownloadButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// DownloadButton component
const DownloadButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getDownloadButtonProps } = useImageViewerContext();
  
  const downloadButtonProps = getDownloadButtonProps();
  
  return (
    <Component 
      {...downloadButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Download'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(DownloadButton as any).displayName = 'ImageViewerHeadless.DownloadButton';

// ResetAllButton component props
export type ResetAllButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ResetAllButton component
const ResetAllButton = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getResetAllButtonProps } = useImageViewerContext();
  
  const resetAllButtonProps = getResetAllButtonProps();
  
  return (
    <Component 
      {...resetAllButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Reset All'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'button', { children?: React.ReactNode }>;

(ResetAllButton as any).displayName = 'ImageViewerHeadless.ResetAllButton';

// ZoomIndicator component props
export type ZoomIndicatorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ZoomIndicator component
const ZoomIndicator = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { zoom } = useImageViewerContext();
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children || `${Math.round(zoom * 100)}%`}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'div', { children?: React.ReactNode }>;

(ZoomIndicator as any).displayName = 'ImageViewerHeadless.ZoomIndicator';

// RotationIndicator component props
export type RotationIndicatorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// RotationIndicator component
const RotationIndicator = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { rotation } = useImageViewerContext();
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children || `${rotation}°`}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'div', { children?: React.ReactNode }>;

(RotationIndicator as any).displayName = 'ImageViewerHeadless.RotationIndicator';

// LoadingIndicator component props
export type LoadingIndicatorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// LoadingIndicator component
const LoadingIndicator = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { isLoading } = useImageViewerContext();
  
  if (!isLoading) return null;
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children || 'Loading...'}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'div', { children?: React.ReactNode }>;

(LoadingIndicator as any).displayName = 'ImageViewerHeadless.LoadingIndicator';

// ErrorIndicator component props
export type ErrorIndicatorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ErrorIndicator component
const ErrorIndicator = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { hasError, error } = useImageViewerContext();
  
  if (!hasError) return null;
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children || error}
    </Component>
  );
}) as PolymorphicForwardRefExoticComponent<'div', { children?: React.ReactNode }>;

(ErrorIndicator as any).displayName = 'ImageViewerHeadless.ErrorIndicator';

// Export all components
export const ImageViewerHeadless = {
  Root,
  Container,
  Image,
  Toolbar,
  ZoomInButton,
  ZoomOutButton,
  ResetZoomButton,
  RotateLeftButton,
  RotateRightButton,
  ResetRotationButton,
  FullscreenButton,
  DownloadButton,
  ResetAllButton,
  ZoomIndicator,
  RotationIndicator,
  LoadingIndicator,
  ErrorIndicator,
  useImageViewerContext,
};

export default ImageViewerHeadless;
