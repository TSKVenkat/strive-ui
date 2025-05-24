import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useImageViewer, 
  UseImageViewerReturn, 
  ImageViewerOptions 
} from './useImageViewer';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

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
const Container = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContainerProps } = useImageViewerContext();
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{
          ...containerProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'ImageViewerHeadless.Container';

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
const Image = forwardRef(
  <C extends React.ElementType = 'img'>(
    { as, src, alt, ...props }: ImageProps<C>,
    ref: PolymorphicRef<C>
  ) => {
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
        {...props} 
        ref={ref}
        style={{
          ...imageProps.style,
          ...props.style,
        }}
      />
    );
  }
);

Image.displayName = 'ImageViewerHeadless.Image';

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
const Toolbar = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ToolbarProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Toolbar.displayName = 'ImageViewerHeadless.Toolbar';

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
const ZoomInButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ZoomInButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getZoomInButtonProps } = useImageViewerContext();
    
    const zoomInButtonProps = getZoomInButtonProps();
    
    return (
      <Component 
        {...zoomInButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Zoom In'}
      </Component>
    );
  }
);

ZoomInButton.displayName = 'ImageViewerHeadless.ZoomInButton';

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
const ZoomOutButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ZoomOutButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getZoomOutButtonProps } = useImageViewerContext();
    
    const zoomOutButtonProps = getZoomOutButtonProps();
    
    return (
      <Component 
        {...zoomOutButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Zoom Out'}
      </Component>
    );
  }
);

ZoomOutButton.displayName = 'ImageViewerHeadless.ZoomOutButton';

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
const ResetZoomButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ResetZoomButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getResetZoomButtonProps, zoom } = useImageViewerContext();
    
    const resetZoomButtonProps = getResetZoomButtonProps();
    
    return (
      <Component 
        {...resetZoomButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || `${Math.round(zoom * 100)}%`}
      </Component>
    );
  }
);

ResetZoomButton.displayName = 'ImageViewerHeadless.ResetZoomButton';

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
const RotateLeftButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: RotateLeftButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getRotateLeftButtonProps } = useImageViewerContext();
    
    const rotateLeftButtonProps = getRotateLeftButtonProps();
    
    return (
      <Component 
        {...rotateLeftButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Rotate Left'}
      </Component>
    );
  }
);

RotateLeftButton.displayName = 'ImageViewerHeadless.RotateLeftButton';

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
const RotateRightButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: RotateRightButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getRotateRightButtonProps } = useImageViewerContext();
    
    const rotateRightButtonProps = getRotateRightButtonProps();
    
    return (
      <Component 
        {...rotateRightButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Rotate Right'}
      </Component>
    );
  }
);

RotateRightButton.displayName = 'ImageViewerHeadless.RotateRightButton';

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
const ResetRotationButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ResetRotationButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getResetRotationButtonProps, rotation } = useImageViewerContext();
    
    const resetRotationButtonProps = getResetRotationButtonProps();
    
    return (
      <Component 
        {...resetRotationButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || `${rotation}°`}
      </Component>
    );
  }
);

ResetRotationButton.displayName = 'ImageViewerHeadless.ResetRotationButton';

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
const FullscreenButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: FullscreenButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getFullscreenButtonProps, isFullscreen } = useImageViewerContext();
    
    const fullscreenButtonProps = getFullscreenButtonProps();
    
    return (
      <Component 
        {...fullscreenButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen')}
      </Component>
    );
  }
);

FullscreenButton.displayName = 'ImageViewerHeadless.FullscreenButton';

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
const DownloadButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: DownloadButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getDownloadButtonProps } = useImageViewerContext();
    
    const downloadButtonProps = getDownloadButtonProps();
    
    return (
      <Component 
        {...downloadButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Download'}
      </Component>
    );
  }
);

DownloadButton.displayName = 'ImageViewerHeadless.DownloadButton';

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
const ResetAllButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ResetAllButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getResetAllButtonProps } = useImageViewerContext();
    
    const resetAllButtonProps = getResetAllButtonProps();
    
    return (
      <Component 
        {...resetAllButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Reset'}
      </Component>
    );
  }
);

ResetAllButton.displayName = 'ImageViewerHeadless.ResetAllButton';

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
const ZoomIndicator = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ZoomIndicatorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { zoom } = useImageViewerContext();
    
    const zoomPercentage = Math.round(zoom * 100);
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || `${zoomPercentage}%`}
      </Component>
    );
  }
);

ZoomIndicator.displayName = 'ImageViewerHeadless.ZoomIndicator';

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
const RotationIndicator = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: RotationIndicatorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { rotation } = useImageViewerContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || `${rotation}°`}
      </Component>
    );
  }
);

RotationIndicator.displayName = 'ImageViewerHeadless.RotationIndicator';

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
const LoadingIndicator = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: LoadingIndicatorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isLoading } = useImageViewerContext();
    
    if (!isLoading) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || 'Loading...'}
      </Component>
    );
  }
);

LoadingIndicator.displayName = 'ImageViewerHeadless.LoadingIndicator';

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
const ErrorIndicator = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ErrorIndicatorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { hasError } = useImageViewerContext();
    
    if (!hasError) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || 'Failed to load image'}
      </Component>
    );
  }
);

ErrorIndicator.displayName = 'ImageViewerHeadless.ErrorIndicator';

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
