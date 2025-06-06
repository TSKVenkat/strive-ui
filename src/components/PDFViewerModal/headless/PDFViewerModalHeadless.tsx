import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  usePDFViewerModal, 
  UsePDFViewerModalReturn, 
  PDFViewerModalOptions
} from './usePDFViewerModal';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the PDFViewerModal component
interface PDFViewerModalContextValue extends UsePDFViewerModalReturn {}

const PDFViewerModalContext = createContext<PDFViewerModalContextValue | null>(null);

// Hook to use PDFViewerModal context
export function usePDFViewerModalContext() {
  const context = useContext(PDFViewerModalContext);
  if (!context) {
    throw new Error('usePDFViewerModalContext must be used within a PDFViewerModalHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends PDFViewerModalOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const pdfViewerModalProps = usePDFViewerModal(options);
    
    return (
      <PDFViewerModalContext.Provider value={pdfViewerModalProps}>
        <div ref={ref}>
          {children}
        </div>
      </PDFViewerModalContext.Provider>
    );
  }
);

Root.displayName = 'PDFViewerModalHeadless.Root';

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
const Trigger = forwardRef(function Trigger<C extends React.ElementType = 'button'>(
  { as, children, ...props }: Omit<TriggerProps<C>, 'ref'>,
  ref: React.ForwardedRef<React.ElementRef<C>>
) {
    const Component = as || 'button';
    const { getTriggerProps } = usePDFViewerModalContext();
    
    const triggerProps = getTriggerProps();
    
    return React.createElement(Component as any, {
      ...triggerProps,
      ...props,
      ref: ref as any
    }, children);
  });

Trigger.displayName = 'PDFViewerModalHeadless.Trigger';

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
  portalId = 'pdf-viewer-modal-root',
  usePortal = true 
}) => {
  const { isOpen } = usePDFViewerModalContext();
  
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

Portal.displayName = 'PDFViewerModalHeadless.Portal';

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
  'PDFViewerModalHeadless.Backdrop',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { getBackdropProps, isOpen } = usePDFViewerModalContext();
    
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
  'PDFViewerModalHeadless.Container',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { getContainerProps, isOpen } = usePDFViewerModalContext();
    
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
  'PDFViewerModalHeadless.Content',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { getContentProps } = usePDFViewerModalContext();
    
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
  'PDFViewerModalHeadless.Header',
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
  'PDFViewerModalHeadless.Body',
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
  'PDFViewerModalHeadless.Footer',
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
  'PDFViewerModalHeadless.Close',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getCloseButtonProps } = usePDFViewerModalContext();
    
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

// Document component props
export type DocumentProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Source of the PDF document
     */
    src?: string;
  }
>;

// Document component
const Document = createPolymorphicComponent(
  'PDFViewerModalHeadless.Document',
  'div',
  ({ as, src, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { getDocumentProps, setSrc } = usePDFViewerModalContext();
    
    // Set the source if provided
    React.useEffect(() => {
      if (src) {
        setSrc(src);
      }
    }, [src, setSrc]);
    
    const documentProps = getDocumentProps();
    
    return React.createElement(
      Component,
      {
        ...documentProps,
        ...props,
        ref,
        style: {
          ...documentProps.style,
          ...props.style,
        },
      }
    );
  }
);

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
const Toolbar = createPolymorphicComponent(
  'PDFViewerModalHeadless.Toolbar',
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

// Sidebar component props
export type SidebarProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Sidebar component
const Sidebar = createPolymorphicComponent(
  'PDFViewerModalHeadless.Sidebar',
  'div',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'div';
    const { isSidebarOpen } = usePDFViewerModalContext();
    
    if (!isSidebarOpen) {
      return null;
    }
    
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

// NextPageButton component props
export type NextPageButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// NextPageButton component
const NextPageButton = createPolymorphicComponent(
  'PDFViewerModalHeadless.NextPageButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getNextPageButtonProps } = usePDFViewerModalContext();
    
    const nextPageButtonProps = getNextPageButtonProps();
    
    return React.createElement(
      Component,
      {
        ...nextPageButtonProps,
        ...props,
        ref,
      },
      children || 'Next'
    );
  }
);

// PrevPageButton component props
export type PrevPageButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// PrevPageButton component
const PrevPageButton = createPolymorphicComponent(
  'PDFViewerModalHeadless.PrevPageButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getPrevPageButtonProps } = usePDFViewerModalContext();
    
    const prevPageButtonProps = getPrevPageButtonProps();
    
    return React.createElement(
      Component,
      {
        ...prevPageButtonProps,
        ...props,
        ref,
      },
      children || 'Previous'
    );
  }
);

// PageInput component props
export type PageInputProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the page input
     */
    label?: string;
  }
>;

// PageInput component
const PageInput = createPolymorphicComponent(
  'PDFViewerModalHeadless.PageInput',
  'input',
  ({ as, label, ...props }: any, ref: any) => {
    const Component = as || 'input';
    const { getPageInputProps, currentPage, numPages } = usePDFViewerModalContext();
    
    const pageInputProps = getPageInputProps();
    const displayLabel = label !== undefined ? label : 'Page';
    
    return React.createElement(
      'div',
      {},
      displayLabel && React.createElement('label', {}, displayLabel),
      React.createElement(
        Component,
        {
          ...pageInputProps,
          ...props,
          ref,
        }
      ),
      numPages > 0 && React.createElement('span', {}, ` / ${numPages}`)
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
  'PDFViewerModalHeadless.ZoomInButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getZoomInButtonProps } = usePDFViewerModalContext();
    
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
  'PDFViewerModalHeadless.ZoomOutButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getZoomOutButtonProps } = usePDFViewerModalContext();
    
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
  'PDFViewerModalHeadless.ZoomResetButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getZoomResetButtonProps } = usePDFViewerModalContext();
    
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
const RotateLeftButton = createPolymorphicComponent(
  'PDFViewerModalHeadless.RotateLeftButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getRotateLeftButtonProps } = usePDFViewerModalContext();
    
    const rotateLeftButtonProps = getRotateLeftButtonProps();
    
    return React.createElement(
      Component,
      {
        ...rotateLeftButtonProps,
        ...props,
        ref,
      },
      children || 'Rotate Left'
    );
  }
);

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
const RotateRightButton = createPolymorphicComponent(
  'PDFViewerModalHeadless.RotateRightButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getRotateRightButtonProps } = usePDFViewerModalContext();
    
    const rotateRightButtonProps = getRotateRightButtonProps();
    
    return React.createElement(
      Component,
      {
        ...rotateRightButtonProps,
        ...props,
        ref,
      },
      children || 'Rotate Right'
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
  'PDFViewerModalHeadless.DownloadButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getDownloadButtonProps } = usePDFViewerModalContext();
    
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

// PrintButton component props
export type PrintButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// PrintButton component
const PrintButton = createPolymorphicComponent(
  'PDFViewerModalHeadless.PrintButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getPrintButtonProps } = usePDFViewerModalContext();
    
    const printButtonProps = getPrintButtonProps();
    
    return React.createElement(
      Component,
      {
        ...printButtonProps,
        ...props,
        ref,
      },
      children || 'Print'
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
  'PDFViewerModalHeadless.FullscreenButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getFullscreenButtonProps, isFullscreen } = usePDFViewerModalContext();
    
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

// SidebarToggleButton component props
export type SidebarToggleButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// SidebarToggleButton component
const SidebarToggleButton = createPolymorphicComponent(
  'PDFViewerModalHeadless.SidebarToggleButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getSidebarToggleButtonProps, isSidebarOpen } = usePDFViewerModalContext();
    
    const sidebarToggleButtonProps = getSidebarToggleButtonProps();
    
    return React.createElement(
      Component,
      {
        ...sidebarToggleButtonProps,
        ...props,
        ref,
      },
      children || (isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar')
    );
  }
);

// SearchInput component props
export type SearchInputProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the search input
     */
    label?: string;
  }
>;

// SearchInput component
const SearchInput = createPolymorphicComponent(
  'PDFViewerModalHeadless.SearchInput',
  'input',
  ({ as, label, ...props }: any, ref: any) => {
    const Component = as || 'input';
    const { getSearchInputProps } = usePDFViewerModalContext();
    
    const searchInputProps = getSearchInputProps();
    const displayLabel = label !== undefined ? label : 'Search';
    
    return React.createElement(
      'div',
      {},
      displayLabel && React.createElement('label', {}, displayLabel),
      React.createElement(
        Component,
        {
          ...searchInputProps,
          ...props,
          ref,
        }
      )
    );
  }
);

// SearchButton component props
export type SearchButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// SearchButton component
const SearchButton = createPolymorphicComponent(
  'PDFViewerModalHeadless.SearchButton',
  'button',
  ({ as, children, ...props }: any, ref: any) => {
    const Component = as || 'button';
    const { getSearchButtonProps } = usePDFViewerModalContext();
    
    const searchButtonProps = getSearchButtonProps();
    
    return React.createElement(
      Component,
      {
        ...searchButtonProps,
        ...props,
        ref,
      },
      children || 'Search'
    );
  }
);

// Export all components
export const PDFViewerModalHeadless = {
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
  Document,
  Toolbar,
  Sidebar,
  NextPageButton,
  PrevPageButton,
  PageInput,
  ZoomInButton,
  ZoomOutButton,
  ZoomResetButton,
  RotateLeftButton,
  RotateRightButton,
  DownloadButton,
  PrintButton,
  FullscreenButton,
  SidebarToggleButton,
  SearchInput,
  SearchButton,
  usePDFViewerModalContext,
};

export default PDFViewerModalHeadless;
