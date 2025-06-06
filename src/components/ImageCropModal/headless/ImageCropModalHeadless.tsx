import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useImageCropModal, 
  UseImageCropModalReturn, 
  ImageCropModalOptions,
  type CropArea
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
const Trigger = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getTriggerProps } = useImageCropModalContext();
  
  const triggerProps = getTriggerProps();
  
  return (
    <Component 
      {...triggerProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const Backdrop = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getBackdropProps, isOpen } = useImageCropModalContext();
  
  if (!isOpen) {
    return null;
  }
  
  const backdropProps = getBackdropProps();
  
  return (
    <Component 
      {...backdropProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const Container = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getContainerProps, isOpen } = useImageCropModalContext();
  
  if (!isOpen) {
    return null;
  }
  
  const containerProps = getContainerProps();
  
  return (
    <Component 
      {...containerProps} 
      {...restProps} 
      ref={ref}
      style={{ 
        ...restProps.style,
      }}
    >
      {children}
    </Component>
  );
}) as any;

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
const Content = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getContentProps } = useImageCropModalContext();
  
  const contentProps = getContentProps();
  
  return (
    <Component 
      {...contentProps} 
      {...restProps} 
      ref={ref}
      style={{ 
        overflow: 'auto',
        height: '100%',
        ...restProps.style,
      }}
    >
      {children}
    </Component>
  );
}) as any;

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
const Header = forwardRef((props: any, ref: any) => {
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
const Body = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
      style={{ 
        flex: 1,
        overflow: 'auto',
        ...restProps.style,
      }}
    >
      {children}
    </Component>
  );
}) as any;

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
const Footer = forwardRef((props: any, ref: any) => {
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
const Close = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getCloseButtonProps } = useImageCropModalContext();
  
  const closeProps = getCloseButtonProps();
  
  return (
    <Component 
      {...closeProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const Image = forwardRef((props: any, ref: any) => {
  const { as, src, alt, ...restProps } = props;
  const Component = as || 'img';
  const { getImageProps, src: contextSrc } = useImageCropModalContext();
  
  const imageProps = getImageProps();
  
  return (
    <Component 
      {...imageProps}
      {...restProps} 
      ref={ref}
      src={src || contextSrc}
      alt={alt || 'Crop image'}
    />
  );
}) as any;

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
const CropArea = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getCropAreaProps } = useImageCropModalContext();
  
  const cropAreaProps = getCropAreaProps();
  
  return (
    <Component 
      {...cropAreaProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const CropButton = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getCropButtonProps } = useImageCropModalContext();
  
  const cropButtonProps = getCropButtonProps();
  
  return (
    <Component 
      {...cropButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const ResetButton = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getResetButtonProps } = useImageCropModalContext();
  
  const resetButtonProps = getResetButtonProps();
  
  return (
    <Component 
      {...resetButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const RotateLeftButton = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getRotateLeftButtonProps } = useImageCropModalContext();
  
  const rotateLeftButtonProps = getRotateLeftButtonProps();
  
  return (
    <Component 
      {...rotateLeftButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const RotateRightButton = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getRotateRightButtonProps } = useImageCropModalContext();
  
  const rotateRightButtonProps = getRotateRightButtonProps();
  
  return (
    <Component 
      {...rotateRightButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const ZoomInButton = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getZoomInButtonProps } = useImageCropModalContext();
  
  const zoomInButtonProps = getZoomInButtonProps();
  
  return (
    <Component 
      {...zoomInButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const ZoomOutButton = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getZoomOutButtonProps } = useImageCropModalContext();
  
  const zoomOutButtonProps = getZoomOutButtonProps();
  
  return (
    <Component 
      {...zoomOutButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const FlipHorizontalButton = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getFlipHorizontalButtonProps } = useImageCropModalContext();
  
  const flipHorizontalButtonProps = getFlipHorizontalButtonProps();
  
  return (
    <Component 
      {...flipHorizontalButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
const FlipVerticalButton = forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getFlipVerticalButtonProps } = useImageCropModalContext();
  
  const flipVerticalButtonProps = getFlipVerticalButtonProps();
  
  return (
    <Component 
      {...flipVerticalButtonProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
}) as any;

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
