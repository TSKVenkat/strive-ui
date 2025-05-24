import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useLightbox, 
  UseLightboxReturn, 
  LightboxOptions,
  LightboxImage
} from './useLightbox';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the Lightbox component
interface LightboxContextValue extends UseLightboxReturn {}

const LightboxContext = createContext<LightboxContextValue | null>(null);

// Hook to use Lightbox context
export function useLightboxContext() {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error('useLightboxContext must be used within a LightboxHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends LightboxOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const lightboxProps = useLightbox(options);
    
    return (
      <LightboxContext.Provider value={lightboxProps}>
        <div ref={ref}>
          {children}
        </div>
      </LightboxContext.Provider>
    );
  }
);

Root.displayName = 'LightboxHeadless.Root';

// Trigger component props
export type TriggerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
    /**
     * Image to display when the trigger is clicked
     */
    image?: LightboxImage;
    /**
     * Index of the image to display when the trigger is clicked
     */
    index?: number;
  }
>;

// Trigger component
const Trigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, image, index, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { 
      getTriggerProps, 
      addImage, 
      goToImage, 
      open,
      images
    } = useLightboxContext();
    
    const triggerProps = getTriggerProps();
    
    const handleClick = (e: React.MouseEvent) => {
      if (image) {
        // Add the image if it doesn't exist
        addImage(image);
        // Find the index of the image
        const imageIndex = images.findIndex(img => img.src === image.src);
        if (imageIndex !== -1) {
          goToImage(imageIndex);
        }
      } else if (typeof index === 'number') {
        goToImage(index);
      }
      
      open();
      
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    return (
      <Component 
        {...triggerProps} 
        {...props} 
        onClick={handleClick}
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Trigger.displayName = 'LightboxHeadless.Trigger';

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
  portalId = 'lightbox-root',
  usePortal = true 
}) => {
  const { isOpen } = useLightboxContext();
  
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

Portal.displayName = 'LightboxHeadless.Portal';

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
    const { getBackdropProps, isOpen } = useLightboxContext();
    
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

Backdrop.displayName = 'LightboxHeadless.Backdrop';

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
    const { getContainerProps, isOpen } = useLightboxContext();
    
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

Container.displayName = 'LightboxHeadless.Container';

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
    const { getContentProps } = useLightboxContext();
    
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

Content.displayName = 'LightboxHeadless.Content';

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

Header.displayName = 'LightboxHeadless.Header';

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

Body.displayName = 'LightboxHeadless.Body';

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

Footer.displayName = 'LightboxHeadless.Footer';

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
    const { getCloseButtonProps } = useLightboxContext();
    
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

Close.displayName = 'LightboxHeadless.Close';

// Image component props
export type ImageProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Image component
const Image = forwardRef(
  <C extends React.ElementType = 'img'>(
    { as, children, ...props }: ImageProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'img';
    const { getImageProps } = useLightboxContext();
    
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
      >
        {children}
      </Component>
    );
  }
);

Image.displayName = 'LightboxHeadless.Image';

// Caption component props
export type CaptionProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Caption component
const Caption = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: CaptionProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { currentImage } = useLightboxContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || currentImage?.caption}
      </Component>
    );
  }
);

Caption.displayName = 'LightboxHeadless.Caption';

// NextButton component props
export type NextButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// NextButton component
const NextButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: NextButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getNextButtonProps } = useLightboxContext();
    
    const nextButtonProps = getNextButtonProps();
    
    return (
      <Component 
        {...nextButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Next'}
      </Component>
    );
  }
);

NextButton.displayName = 'LightboxHeadless.NextButton';

// PrevButton component props
export type PrevButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// PrevButton component
const PrevButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: PrevButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getPrevButtonProps } = useLightboxContext();
    
    const prevButtonProps = getPrevButtonProps();
    
    return (
      <Component 
        {...prevButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Previous'}
      </Component>
    );
  }
);

PrevButton.displayName = 'LightboxHeadless.PrevButton';

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
    const { getZoomInButtonProps } = useLightboxContext();
    
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

ZoomInButton.displayName = 'LightboxHeadless.ZoomInButton';

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
    const { getZoomOutButtonProps } = useLightboxContext();
    
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

ZoomOutButton.displayName = 'LightboxHeadless.ZoomOutButton';

// ZoomResetButton component props
export type ZoomResetButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// ZoomResetButton component
const ZoomResetButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: ZoomResetButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getZoomResetButtonProps } = useLightboxContext();
    
    const zoomResetButtonProps = getZoomResetButtonProps();
    
    return (
      <Component 
        {...zoomResetButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || '100%'}
      </Component>
    );
  }
);

ZoomResetButton.displayName = 'LightboxHeadless.ZoomResetButton';

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
    const { getFullscreenButtonProps, isFullscreen } = useLightboxContext();
    
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

FullscreenButton.displayName = 'LightboxHeadless.FullscreenButton';

// SlideshowButton component props
export type SlideshowButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// SlideshowButton component
const SlideshowButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: SlideshowButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getSlideshowButtonProps, isSlideshowActive } = useLightboxContext();
    
    const slideshowButtonProps = getSlideshowButtonProps();
    
    return (
      <Component 
        {...slideshowButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || (isSlideshowActive ? 'Pause' : 'Play')}
      </Component>
    );
  }
);

SlideshowButton.displayName = 'LightboxHeadless.SlideshowButton';

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
    const { getDownloadButtonProps } = useLightboxContext();
    
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

DownloadButton.displayName = 'LightboxHeadless.DownloadButton';

// Thumbnails component props
export type ThumbnailsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Thumbnails component
const Thumbnails = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ThumbnailsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { images } = useLightboxContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || (
          images.map((_, index) => (
            <Thumbnail key={index} index={index} />
          ))
        )}
      </Component>
    );
  }
);

Thumbnails.displayName = 'LightboxHeadless.Thumbnails';

// Thumbnail component props
export type ThumbnailProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
    /**
     * Index of the image to display
     */
    index: number;
  }
>;

// Thumbnail component
const Thumbnail = forwardRef(
  <C extends React.ElementType = 'img'>(
    { as, children, index, ...props }: ThumbnailProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'img';
    const { getThumbnailProps, images, currentIndex } = useLightboxContext();
    
    if (index < 0 || index >= images.length) {
      return null;
    }
    
    const thumbnailProps = getThumbnailProps(index);
    
    return (
      <Component 
        {...thumbnailProps} 
        {...props} 
        ref={ref}
        style={{
          ...props.style,
          cursor: 'pointer',
          border: index === currentIndex ? '2px solid #0070f3' : 'none',
        }}
      >
        {children}
      </Component>
    );
  }
);

Thumbnail.displayName = 'LightboxHeadless.Thumbnail';

// Counter component props
export type CounterProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Counter component
const Counter = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: CounterProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { currentIndex, images } = useLightboxContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children || `${currentIndex + 1} / ${images.length}`}
      </Component>
    );
  }
);

Counter.displayName = 'LightboxHeadless.Counter';

// Export all components
export const LightboxHeadless = {
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
  Caption,
  NextButton,
  PrevButton,
  ZoomInButton,
  ZoomOutButton,
  ZoomResetButton,
  FullscreenButton,
  SlideshowButton,
  DownloadButton,
  Thumbnails,
  Thumbnail,
  Counter,
  useLightboxContext,
};

export default LightboxHeadless;
