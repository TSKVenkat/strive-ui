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
const Trigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getTriggerProps } = usePDFViewerModalContext();
    
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
    const { getBackdropProps, isOpen } = usePDFViewerModalContext();
    
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

Backdrop.displayName = 'PDFViewerModalHeadless.Backdrop';

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
    const { getContainerProps, isOpen } = usePDFViewerModalContext();
    
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

Container.displayName = 'PDFViewerModalHeadless.Container';

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
    const { getContentProps } = usePDFViewerModalContext();
    
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

Content.displayName = 'PDFViewerModalHeadless.Content';

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

Header.displayName = 'PDFViewerModalHeadless.Header';

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

Body.displayName = 'PDFViewerModalHeadless.Body';

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

Footer.displayName = 'PDFViewerModalHeadless.Footer';

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
    const { getCloseButtonProps } = usePDFViewerModalContext();
    
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

Close.displayName = 'PDFViewerModalHeadless.Close';

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
const Document = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, src, ...props }: DocumentProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getDocumentProps, setSrc } = usePDFViewerModalContext();
    
    // Set the source if provided
    React.useEffect(() => {
      if (src) {
        setSrc(src);
      }
    }, [src, setSrc]);
    
    const documentProps = getDocumentProps();
    
    return (
      <Component 
        {...documentProps} 
        {...props} 
        ref={ref}
        style={{
          ...documentProps.style,
          ...props.style,
        }}
      />
    );
  }
);

Document.displayName = 'PDFViewerModalHeadless.Document';

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

Toolbar.displayName = 'PDFViewerModalHeadless.Toolbar';

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
const Sidebar = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: SidebarProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isSidebarOpen } = usePDFViewerModalContext();
    
    if (!isSidebarOpen) {
      return null;
    }
    
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

Sidebar.displayName = 'PDFViewerModalHeadless.Sidebar';

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
const NextPageButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: NextPageButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getNextPageButtonProps } = usePDFViewerModalContext();
    
    const nextPageButtonProps = getNextPageButtonProps();
    
    return (
      <Component 
        {...nextPageButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Next'}
      </Component>
    );
  }
);

NextPageButton.displayName = 'PDFViewerModalHeadless.NextPageButton';

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
const PrevPageButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: PrevPageButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getPrevPageButtonProps } = usePDFViewerModalContext();
    
    const prevPageButtonProps = getPrevPageButtonProps();
    
    return (
      <Component 
        {...prevPageButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Previous'}
      </Component>
    );
  }
);

PrevPageButton.displayName = 'PDFViewerModalHeadless.PrevPageButton';

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
const PageInput = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Page', ...props }: PageInputProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getPageInputProps, currentPage, numPages } = usePDFViewerModalContext();
    
    const pageInputProps = getPageInputProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...pageInputProps} 
          {...props} 
          ref={ref}
        />
        {numPages > 0 && <span> / {numPages}</span>}
      </div>
    );
  }
);

PageInput.displayName = 'PDFViewerModalHeadless.PageInput';

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
    const { getZoomInButtonProps } = usePDFViewerModalContext();
    
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

ZoomInButton.displayName = 'PDFViewerModalHeadless.ZoomInButton';

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
    const { getZoomOutButtonProps } = usePDFViewerModalContext();
    
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

ZoomOutButton.displayName = 'PDFViewerModalHeadless.ZoomOutButton';

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
    const { getZoomResetButtonProps } = usePDFViewerModalContext();
    
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

ZoomResetButton.displayName = 'PDFViewerModalHeadless.ZoomResetButton';

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
    const { getRotateLeftButtonProps } = usePDFViewerModalContext();
    
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

RotateLeftButton.displayName = 'PDFViewerModalHeadless.RotateLeftButton';

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
    const { getRotateRightButtonProps } = usePDFViewerModalContext();
    
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

RotateRightButton.displayName = 'PDFViewerModalHeadless.RotateRightButton';

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
    const { getDownloadButtonProps } = usePDFViewerModalContext();
    
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

DownloadButton.displayName = 'PDFViewerModalHeadless.DownloadButton';

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
const PrintButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: PrintButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getPrintButtonProps } = usePDFViewerModalContext();
    
    const printButtonProps = getPrintButtonProps();
    
    return (
      <Component 
        {...printButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Print'}
      </Component>
    );
  }
);

PrintButton.displayName = 'PDFViewerModalHeadless.PrintButton';

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
    const { getFullscreenButtonProps, isFullscreen } = usePDFViewerModalContext();
    
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

FullscreenButton.displayName = 'PDFViewerModalHeadless.FullscreenButton';

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
const SidebarToggleButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: SidebarToggleButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getSidebarToggleButtonProps, isSidebarOpen } = usePDFViewerModalContext();
    
    const sidebarToggleButtonProps = getSidebarToggleButtonProps();
    
    return (
      <Component 
        {...sidebarToggleButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || (isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar')}
      </Component>
    );
  }
);

SidebarToggleButton.displayName = 'PDFViewerModalHeadless.SidebarToggleButton';

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
const SearchInput = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Search', ...props }: SearchInputProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getSearchInputProps } = usePDFViewerModalContext();
    
    const searchInputProps = getSearchInputProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...searchInputProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'PDFViewerModalHeadless.SearchInput';

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
const SearchButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: SearchButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getSearchButtonProps } = usePDFViewerModalContext();
    
    const searchButtonProps = getSearchButtonProps();
    
    return (
      <Component 
        {...searchButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Search'}
      </Component>
    );
  }
);

SearchButton.displayName = 'PDFViewerModalHeadless.SearchButton';

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
