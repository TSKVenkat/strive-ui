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
const Trigger = forwardRef(function TriggerComponent<C extends React.ElementType = 'button'>(
  { as, children, image, index, ...props }: Omit<TriggerProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
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
    
    return React.createElement(Component as any, {
      ...triggerProps,
      ...props,
      onClick: handleClick,
      ref: ref as any
    }, children);
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

// Helper function to create polymorphic components
function createPolymorphicComponent<TDefaultElement extends React.ElementType, TProps = {}>(
  displayName: string,
  defaultElement: TDefaultElement,
  render: (
    props: any,
    ref: any
  ) => React.ReactElement | null
) {
  const Component = React.forwardRef(render);
  Component.displayName = displayName;
  return Component as any;
}

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
const Backdrop = createPolymorphicComponent(
  'LightboxHeadless.Backdrop',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { getBackdropProps, isOpen } = useLightboxContext();
    
    if (!isOpen) {
      return null;
    }
    
    const backdropProps = getBackdropProps();
    
    return React.createElement(
      Component,
      {
        ...backdropProps,
        ...props,
        ref,
      },
      children
    );
  }
);

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
const Container = createPolymorphicComponent(
  'LightboxHeadless.Container',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { getContainerProps, isOpen } = useLightboxContext();
    
    if (!isOpen) {
      return null;
    }
    
    const containerProps = getContainerProps();
    
    return React.createElement(
      Component,
      {
        ...containerProps,
        ...props,
        ref,
      },
      children
    );
  }
);

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
const Content = createPolymorphicComponent(
  'LightboxHeadless.Content',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { getContentProps } = useLightboxContext();
    
    const contentProps = getContentProps();
    
    return React.createElement(
      Component,
      {
        ...contentProps,
        ...props,
        ref,
      },
      children
    );
  }
);

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
const Header = createPolymorphicComponent(
  'LightboxHeadless.Header',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        ...props,
        ref,
      },
      children
    );
  }
);

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
const Body = createPolymorphicComponent(
  'LightboxHeadless.Body',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        ...props,
        ref,
      },
      children
    );
  }
);

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
const Footer = createPolymorphicComponent(
  'LightboxHeadless.Footer',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        ...props,
        ref,
      },
      children
    );
  }
);

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
const Close = createPolymorphicComponent(
  'LightboxHeadless.Close',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getCloseButtonProps } = useLightboxContext();
    
    const closeProps = getCloseButtonProps();
    
    return React.createElement(
      Component,
      {
        ...closeProps,
        ...props,
        ref,
      },
      children
    );
  }
);

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
const Image = createPolymorphicComponent(
  'LightboxHeadless.Image',
  'img',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'img';
    const { getImageProps } = useLightboxContext();
    
    const imageProps = getImageProps();
    
    return React.createElement(
      Component,
      {
        ...imageProps,
        ...props,
        ref,
        style: {
          ...imageProps.style,
          ...props.style,
        },
      },
      children
    );
  }
);

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
const Caption = createPolymorphicComponent(
  'LightboxHeadless.Caption',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { currentImage } = useLightboxContext();
    
    return React.createElement(
      Component,
      {
        ...props,
        ref,
      },
      children || currentImage?.caption
    );
  }
);

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
const NextButton = createPolymorphicComponent(
  'LightboxHeadless.NextButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getNextButtonProps } = useLightboxContext();
    
    const nextButtonProps = getNextButtonProps();
    
    return React.createElement(
      Component,
      {
        ...nextButtonProps,
        ...props,
        ref,
      },
      children || 'Next'
    );
  }
);

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
const PrevButton = createPolymorphicComponent(
  'LightboxHeadless.PrevButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getPrevButtonProps } = useLightboxContext();
    
    const prevButtonProps = getPrevButtonProps();
    
    return React.createElement(
      Component,
      {
        ...prevButtonProps,
        ...props,
        ref,
      },
      children || 'Previous'
    );
  }
);

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
const ZoomInButton = createPolymorphicComponent(
  'LightboxHeadless.ZoomInButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getZoomInButtonProps } = useLightboxContext();
    
    const zoomInButtonProps = getZoomInButtonProps();
    
    return React.createElement(
      Component,
      {
        ...zoomInButtonProps,
        ...props,
        ref,
      },
      children || 'Zoom In'
    );
  }
);

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
const ZoomOutButton = createPolymorphicComponent(
  'LightboxHeadless.ZoomOutButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getZoomOutButtonProps } = useLightboxContext();
    
    const zoomOutButtonProps = getZoomOutButtonProps();
    
    return React.createElement(
      Component,
      {
        ...zoomOutButtonProps,
        ...props,
        ref,
      },
      children || 'Zoom Out'
    );
  }
);

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
const ZoomResetButton = createPolymorphicComponent(
  'LightboxHeadless.ZoomResetButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getZoomResetButtonProps } = useLightboxContext();
    
    const zoomResetButtonProps = getZoomResetButtonProps();
    
    return React.createElement(
      Component,
      {
        ...zoomResetButtonProps,
        ...props,
        ref,
      },
      children || '100%'
    );
  }
);

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
const FullscreenButton = createPolymorphicComponent(
  'LightboxHeadless.FullscreenButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getFullscreenButtonProps, isFullscreen } = useLightboxContext();
    
    const fullscreenButtonProps = getFullscreenButtonProps();
    
    return React.createElement(
      Component,
      {
        ...fullscreenButtonProps,
        ...props,
        ref,
      },
      children || (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen')
    );
  }
);

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
const SlideshowButton = createPolymorphicComponent(
  'LightboxHeadless.SlideshowButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getSlideshowButtonProps, isSlideshowActive } = useLightboxContext();
    
    const slideshowButtonProps = getSlideshowButtonProps();
    
    return React.createElement(
      Component,
      {
        ...slideshowButtonProps,
        ...props,
        ref,
      },
      children || (isSlideshowActive ? 'Stop Slideshow' : 'Start Slideshow')
    );
  }
);

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
const DownloadButton = createPolymorphicComponent(
  'LightboxHeadless.DownloadButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getDownloadButtonProps } = useLightboxContext();
    
    const downloadButtonProps = getDownloadButtonProps();
    
    return React.createElement(
      Component,
      {
        ...downloadButtonProps,
        ...props,
        ref,
      },
      children || 'Download'
    );
  }
);

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
const Thumbnails = createPolymorphicComponent(
  'LightboxHeadless.Thumbnails',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { images } = useLightboxContext();
    
    return React.createElement(
      Component,
      {
        ...props,
        ref,
      },
      children || (
        images.map((_, index) => (
          <Thumbnail key={index} index={index} />
        ))
      )
    );
  }
);

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
const Thumbnail = createPolymorphicComponent(
  'LightboxHeadless.Thumbnail',
  'img',
  ({ as, children, index, ...props }: any, ref: any) => {
    const Component = as || 'img';
    const { 
      getThumbnailProps, 
      images, 
      currentIndex, 
      goToImage 
    } = useLightboxContext();
    
    const image = images[index];
    
    if (!image) {
      return null;
    }
    
    const thumbnailProps = getThumbnailProps(index);
    
    return React.createElement(
      Component,
      {
        ...thumbnailProps,
        ...props,
        ref,
        src: image.thumbnail || image.src,
        alt: image.alt || `Thumbnail ${index + 1}`,
        onClick: () => goToImage(index),
        style: {
          cursor: 'pointer',
          opacity: currentIndex === index ? 1 : 0.6,
          ...props.style,
        },
      },
      children
    );
  }
);

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
const Counter = createPolymorphicComponent(
  'LightboxHeadless.Counter',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { currentIndex, images } = useLightboxContext();
    
    return React.createElement(
      Component,
      {
        ...props,
        ref,
      },
      children || `${currentIndex + 1} / ${images.length}`
    );
  }
);

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
