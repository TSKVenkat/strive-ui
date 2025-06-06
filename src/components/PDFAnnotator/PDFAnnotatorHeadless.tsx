import React, { createContext, useContext, forwardRef } from 'react';
import { usePDFAnnotator, UsePDFAnnotatorReturn, PDFAnnotatorOptions, Annotation, AnnotationType, ShapeType } from './usePDFAnnotator';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the PDFAnnotator component
interface PDFAnnotatorContextValue extends UsePDFAnnotatorReturn {}

const PDFAnnotatorContext = createContext<PDFAnnotatorContextValue | null>(null);

// Hook to use PDFAnnotator context
export function usePDFAnnotatorContext() {
  const context = useContext(PDFAnnotatorContext);
  if (!context) {
    throw new Error('usePDFAnnotatorContext must be used within a PDFAnnotatorHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends PDFAnnotatorOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const pdfAnnotatorProps = usePDFAnnotator(options);
    
    return (
      <PDFAnnotatorContext.Provider value={pdfAnnotatorProps}>
        <div ref={ref} style={{ position: 'relative', width: '100%', height: '100%' }}>
          {children}
        </div>
      </PDFAnnotatorContext.Provider>
    );
  }
);

Root.displayName = 'PDFAnnotatorHeadless.Root';

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
  const { getPDFContainerProps } = usePDFAnnotatorContext();
  
  const containerProps = getPDFContainerProps();
  
  return (
    <Component 
      {...containerProps} 
      {...restProps} 
      ref={ref}
      style={{ ...containerProps.style, ...restProps.style }}
    >
      {children}
    </Component>
  );
}) as any;

(Container as any).displayName = 'PDFAnnotatorHeadless.Container';

// Page component props
export type PageProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Page number
     */
    pageNumber: number;
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Page component
const Page = forwardRef<any, any>((props, ref) => {
  const { as, pageNumber, children, ...restProps } = props;
  const Component = as || 'div';
  const { scale } = usePDFAnnotatorContext();
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
      style={{ 
        position: 'relative',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        ...restProps.style 
      }}
      data-page-number={pageNumber}
    >
      {children}
    </Component>
  );
}) as any;

(Page as any).displayName = 'PDFAnnotatorHeadless.Page';

// AnnotationLayer component props
export type AnnotationLayerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Page number
     */
    pageNumber: number;
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// AnnotationLayer component
const AnnotationLayer = forwardRef<any, any>((props, ref) => {
  const { as, pageNumber, children, ...restProps } = props;
  const Component = as || 'div';
  const { getAnnotationLayerProps } = usePDFAnnotatorContext();
  
  const layerProps = getAnnotationLayerProps(pageNumber);
  
  return (
    <Component 
      {...layerProps} 
      {...restProps} 
      ref={ref}
      style={{ ...layerProps.style, ...restProps.style }}
    >
      {children}
    </Component>
  );
}) as any;

(AnnotationLayer as any).displayName = 'PDFAnnotatorHeadless.AnnotationLayer';

// Annotations component props
export type AnnotationsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Page number
     */
    pageNumber: number;
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      annotations: Annotation[];
      selectedAnnotation: Annotation | null;
      selectAnnotation: (annotationId: string | null) => void;
      updateAnnotation: (annotationId: string, updates: Partial<Annotation>) => void;
      deleteAnnotation: (annotationId: string) => void;
    }) => React.ReactNode);
  }
>;

// Annotations component
const Annotations = forwardRef<any, any>((props, ref) => {
  const { as, pageNumber, children, ...restProps } = props;
  const Component = as || 'div';
  const { 
    getPageAnnotations, 
    selectedAnnotation, 
    selectAnnotation, 
    updateAnnotation, 
    deleteAnnotation 
  } = usePDFAnnotatorContext();
  
  const annotations = getPageAnnotations(pageNumber);
  
  const renderProps = {
    annotations,
    selectedAnnotation,
    selectAnnotation,
    updateAnnotation,
    deleteAnnotation,
  };
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Component>
  );
}) as any;

(Annotations as any).displayName = 'PDFAnnotatorHeadless.Annotations';

// Toolbar component props
export type ToolbarProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      currentTool: AnnotationType | null;
      setCurrentTool: (tool: AnnotationType | null) => void;
      currentShapeType: ShapeType;
      setCurrentShapeType: (shapeType: ShapeType) => void;
      scale: number;
      setScale: (scale: number) => void;
      currentPage: number;
      numPages: number;
      setCurrentPage: (pageNumber: number) => void;
    }) => React.ReactNode);
  }
>;

// Toolbar component
const Toolbar = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { 
    currentTool, 
    setCurrentTool, 
    currentShapeType, 
    setCurrentShapeType, 
    scale, 
    setScale, 
    currentPage, 
    numPages, 
    setCurrentPage 
  } = usePDFAnnotatorContext();
  
  const renderProps = {
    currentTool,
    setCurrentTool,
    currentShapeType,
    setCurrentShapeType,
    scale,
    setScale,
    currentPage,
    numPages,
    setCurrentPage,
  };
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Component>
  );
}) as any;

(Toolbar as any).displayName = 'PDFAnnotatorHeadless.Toolbar';

// Pagination component props
export type PaginationProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      currentPage: number;
      numPages: number;
      setCurrentPage: (pageNumber: number) => void;
      goToNextPage: () => void;
      goToPreviousPage: () => void;
      canGoToNextPage: boolean;
      canGoToPreviousPage: boolean;
    }) => React.ReactNode);
  }
>;

// Pagination component
const Pagination = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { currentPage, numPages, setCurrentPage } = usePDFAnnotatorContext();
  
  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const canGoToNextPage = currentPage < numPages;
  const canGoToPreviousPage = currentPage > 1;
  
  const renderProps = {
    currentPage,
    numPages,
    setCurrentPage,
    goToNextPage,
    goToPreviousPage,
    canGoToNextPage,
    canGoToPreviousPage,
  };
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Component>
  );
}) as any;

(Pagination as any).displayName = 'PDFAnnotatorHeadless.Pagination';

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
const ErrorComponent = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { error } = usePDFAnnotatorContext();
  
  if (!error) return null;
  
  const renderProps = {
    error,
  };
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' ? children(renderProps) : children}
    </Component>
  );
}) as any;

(ErrorComponent as any).displayName = 'PDFAnnotatorHeadless.Error';

// Loading component props
export type LoadingProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Loading component
const Loading = forwardRef<any, any>((props, ref) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { isLoaded } = usePDFAnnotatorContext();
  
  if (isLoaded) return null;
  
  return (
    <Component {...restProps} ref={ref}>
      {children || 'Loading PDF...'}
    </Component>
  );
}) as any;

(Loading as any).displayName = 'PDFAnnotatorHeadless.Loading';

// Export all components
export const PDFAnnotatorHeadless = {
  Root,
  Container,
  Page,
  AnnotationLayer,
  Annotations,
  Toolbar,
  Pagination,
  Error: ErrorComponent,
  Loading,
  usePDFAnnotatorContext,
};

export default PDFAnnotatorHeadless;
