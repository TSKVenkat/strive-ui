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
const Container = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getPDFContainerProps } = usePDFAnnotatorContext();
    
    const containerProps = getPDFContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
        style={{ ...containerProps.style, ...props.style }}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'PDFAnnotatorHeadless.Container';

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
const Page = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, pageNumber, children, ...props }: PageProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { scale } = usePDFAnnotatorContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
        style={{ 
          position: 'relative',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          ...props.style 
        }}
        data-page-number={pageNumber}
      >
        {children}
      </Component>
    );
  }
);

Page.displayName = 'PDFAnnotatorHeadless.Page';

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
const AnnotationLayer = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, pageNumber, children, ...props }: AnnotationLayerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getAnnotationLayerProps } = usePDFAnnotatorContext();
    
    const layerProps = getAnnotationLayerProps(pageNumber);
    
    return (
      <Component 
        {...layerProps} 
        {...props} 
        ref={ref}
        style={{ ...layerProps.style, ...props.style }}
      >
        {children}
      </Component>
    );
  }
);

AnnotationLayer.displayName = 'PDFAnnotatorHeadless.AnnotationLayer';

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
const Annotations = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, pageNumber, children, ...props }: AnnotationsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      getPageAnnotations, 
      selectedAnnotation, 
      selectAnnotation, 
      updateAnnotation, 
      deleteAnnotation 
    } = usePDFAnnotatorContext();
    
    const annotations = getPageAnnotations(pageNumber);
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ 
              annotations, 
              selectedAnnotation, 
              selectAnnotation, 
              updateAnnotation, 
              deleteAnnotation 
            }) 
          : children}
      </Component>
    );
  }
);

Annotations.displayName = 'PDFAnnotatorHeadless.Annotations';

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
const Toolbar = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ToolbarProps<C>,
    ref: PolymorphicRef<C>
  ) => {
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
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ 
              currentTool, 
              setCurrentTool, 
              currentShapeType, 
              setCurrentShapeType,
              scale,
              setScale,
              currentPage,
              numPages,
              setCurrentPage
            }) 
          : children}
      </Component>
    );
  }
);

Toolbar.displayName = 'PDFAnnotatorHeadless.Toolbar';

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
const Pagination = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: PaginationProps<C>,
    ref: PolymorphicRef<C>
  ) => {
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
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ 
              currentPage, 
              numPages, 
              setCurrentPage, 
              goToNextPage, 
              goToPreviousPage,
              canGoToNextPage,
              canGoToPreviousPage
            }) 
          : children}
      </Component>
    );
  }
);

Pagination.displayName = 'PDFAnnotatorHeadless.Pagination';

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
const Error = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ErrorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { error } = usePDFAnnotatorContext();
    
    if (!error) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ error }) 
          : children || error.message}
      </Component>
    );
  }
);

Error.displayName = 'PDFAnnotatorHeadless.Error';

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
const Loading = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: LoadingProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isLoaded } = usePDFAnnotatorContext();
    
    if (isLoaded) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

Loading.displayName = 'PDFAnnotatorHeadless.Loading';

// Export all components
export const PDFAnnotatorHeadless = {
  Root,
  Container,
  Page,
  AnnotationLayer,
  Annotations,
  Toolbar,
  Pagination,
  Error,
  Loading,
  usePDFAnnotatorContext,
};

export default PDFAnnotatorHeadless;
