import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useImageCropModal, 
  UseImageCropModalReturn, 
  ImageCropModalOptions,
  CropArea
} from './useImageCropModal';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the ImageCropModal component
interface ImageCropModalContextValue extends UseImageCropModalReturn {}

const ImageCropModalContext = createContext<ImageCropModalContextValue | null>(null);

// Hook to use ImageCropModal context
export function useImageCropModalContext() {
  const context = useContext(ImageCropModalContext);
  if (!context) {
    throw new Error('useImageCropModalContext must be used within a ImageCropModalHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ImageCropModalOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const imageCropModalProps = useImageCropModal(options);
    
    return (
      <ImageCropModalContext.Provider value={imageCropModalProps}>
        <div ref={ref}>
          {children}
        </div>
      </ImageCropModalContext.Provider>
    );
  }
);

Root.displayName = 'ImageCropModalHeadless.Root';

// Trigger component props
export type TriggerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Trigger component
const Trigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getTriggerProps } = useImageCropModalContext();
    
    const triggerProps = getTriggerProps();
    
    return (
      <Component 
        {...triggerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Trigger.displayName = 'ImageCropModalHeadless.Trigger';

// Portal component props
export type PortalProps = {
  /**
   * Children of the component
   */
  children: React.ReactNode;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
  /**
   * Whether to use a portal
   */
  usePortal?: boolean;
};

// Portal component
const Portal: React.FC<PortalProps> = ({ 
  children, 
  portalId = 'image-crop-modal-root',
  usePortal = true 
}) => {
  const { isOpen } = useImageCropModalContext();
  
  // Create portal container if it doesn't exist
  React.useEffect(() => {
    if (!usePortal) return;
    
    let portalElement = document.getElementById(portalId);
    
    if (!portalElement) {
      portalElement = document.createElement('div');
      portalElement.id = portalId;
      document.body.appendChild(portalElement);
    }
    
    return () => {
      // Only remove the portal element if it's empty
      if (portalElement && portalElement.childNodes.length === 0) {
        portalElement.remove();
      }
    };
  }, [portalId, usePortal]);
  
  if (!isOpen) {
    return null;
  }
  
  if (!usePortal) {
    return <>{children}</>;
  }
  
  const portalElement = document.getElementById(portalId);
  
  if (!portalElement) {
    return null;
  }
  
  return createPortal(children, portalElement);
};

Portal.displayName = 'ImageCropModalHeadless.Portal';

// Backdrop component props
export type BackdropProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Backdrop component
const Backdrop = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: BackdropProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getBackdropProps, isOpen } = useImageCropModalContext();
    
    if (!isOpen) {
      return null;
    }
    
    const backdropProps = getBackdropProps();
    
    return (
      <Component 
        {...backdropProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Backdrop.displayName = 'ImageCropModalHeadless.Backdrop';

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
    const { getContainerProps, isOpen } = useImageCropModalContext();
    
    if (!isOpen) {
      return null;
    }
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'ImageCropModalHeadless.Container';

// Content component props
export type ContentProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Content component
const Content = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContentProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContentProps } = useImageCropModalContext();
    
    const contentProps = getContentProps();
    
    return (
      <Component 
        {...contentProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'ImageCropModalHeadless.Content';

// Header component props
export type HeaderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Header component
const Header = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: HeaderProps<C>,
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

Header.displayName = 'ImageCropModalHeadless.Header';

// Body component props
export type BodyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Body component
const Body = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: BodyProps<C>,
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

Body.displayName = 'ImageCropModalHeadless.Body';

// Footer component props
export type FooterProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Footer component
const Footer = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: FooterProps<C>,
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

Footer.displayName = 'ImageCropModalHeadless.Footer';

// Close component props
export type CloseProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Close component
const Close = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: CloseProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getCloseButtonProps } = useImageCropModalContext();
    
    const closeProps = getCloseButtonProps();
    
    return (
      <Component 
        {...closeProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Close.displayName = 'ImageCropModalHeadless.Close';

// Image component props
export type ImageProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Source of the image
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
    { as, src, alt = 'Image to crop', ...props }: ImageProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'img';
    const { getImageProps, setSrc } = useImageCropModalContext();
    
    // Set the source if provided
    React.useEffect(() => {
      if (src) {
        setSrc(src);
      }
    }, [src, setSrc]);
    
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

Image.displayName = 'ImageCropModalHeadless.Image';

// CropArea component props
export type CropAreaProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// CropArea component
const CropArea = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: CropAreaProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getCropAreaProps } = useImageCropModalContext();
    
    const cropAreaProps = getCropAreaProps();
    
    return (
      <Component 
        {...cropAreaProps} 
        {...props} 
        ref={ref}
        style={{
          ...cropAreaProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

CropArea.displayName = 'ImageCropModalHeadless.CropArea';

// CropButton component props
export type CropButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// CropButton component
const CropButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: CropButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getCropButtonProps } = useImageCropModalContext();
    
    const cropButtonProps = getCropButtonProps();
    
    return (
      <Component 
        {...cropButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Crop'}
      </Component>
    );
  }
);

CropButton.displayName = 'ImageCropModalHeadless.CropButton';

// ResetButton component props
export type ResetButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ResetButton component
const ResetButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ResetButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getResetButtonProps } = useImageCropModalContext();
    
    const resetButtonProps = getResetButtonProps();
    
    return (
      <Component 
        {...resetButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Reset'}
      </Component>
    );
  }
);

ResetButton.displayName = 'ImageCropModalHeadless.ResetButton';

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
    const { getRotateLeftButtonProps } = useImageCropModalContext();
    
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

RotateLeftButton.displayName = 'ImageCropModalHeadless.RotateLeftButton';

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
    const { getRotateRightButtonProps } = useImageCropModalContext();
    
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

RotateRightButton.displayName = 'ImageCropModalHeadless.RotateRightButton';

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
    const { getZoomInButtonProps } = useImageCropModalContext();
    
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

ZoomInButton.displayName = 'ImageCropModalHeadless.ZoomInButton';

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
    const { getZoomOutButtonProps } = useImageCropModalContext();
    
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

ZoomOutButton.displayName = 'ImageCropModalHeadless.ZoomOutButton';

// FlipHorizontalButton component props
export type FlipHorizontalButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// FlipHorizontalButton component
const FlipHorizontalButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: FlipHorizontalButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getFlipHorizontalButtonProps } = useImageCropModalContext();
    
    const flipHorizontalButtonProps = getFlipHorizontalButtonProps();
    
    return (
      <Component 
        {...flipHorizontalButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Flip Horizontal'}
      </Component>
    );
  }
);

FlipHorizontalButton.displayName = 'ImageCropModalHeadless.FlipHorizontalButton';

// FlipVerticalButton component props
export type FlipVerticalButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// FlipVerticalButton component
const FlipVerticalButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: FlipVerticalButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getFlipVerticalButtonProps } = useImageCropModalContext();
    
    const flipVerticalButtonProps = getFlipVerticalButtonProps();
    
    return (
      <Component 
        {...flipVerticalButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Flip Vertical'}
      </Component>
    );
  }
);

FlipVerticalButton.displayName = 'ImageCropModalHeadless.FlipVerticalButton';

// Export all components
export const ImageCropModalHeadless = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Container,
  Content,
  Header,
  Body,
  Footer,
  Close,
  Image,
  CropArea,
  CropButton,
  ResetButton,
  RotateLeftButton,
  RotateRightButton,
  ZoomInButton,
  ZoomOutButton,
  FlipHorizontalButton,
  FlipVerticalButton,
  useImageCropModalContext,
};

export default ImageCropModalHeadless;
