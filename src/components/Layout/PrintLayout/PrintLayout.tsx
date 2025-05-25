import React, { forwardRef, useEffect, useState } from 'react';

export type PaperSize = 'a4' | 'a5' | 'letter' | 'legal' | 'tabloid';
export type Orientation = 'portrait' | 'landscape';
export type MarginSize = 'none' | 'small' | 'medium' | 'large' | 'custom';

export interface PrintLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the print layout
   */
  children: React.ReactNode;
  
  /**
   * The paper size for printing
   * @default 'a4'
   */
  paperSize?: PaperSize;
  
  /**
   * The orientation of the paper
   * @default 'portrait'
   */
  orientation?: Orientation;
  
  /**
   * The margin size
   * @default 'medium'
   */
  margin?: MarginSize;
  
  /**
   * Custom margin values (in mm) when margin is set to 'custom'
   * @default { top: 15, right: 15, bottom: 15, left: 15 }
   */
  customMargins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  
  /**
   * Whether to show page numbers
   * @default false
   */
  showPageNumbers?: boolean;
  
  /**
   * The starting page number
   * @default 1
   */
  startPageNumber?: number;
  
  /**
   * The position of the page numbers
   * @default 'bottom-center'
   */
  pageNumberPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  
  /**
   * Whether to include a header
   * @default false
   */
  showHeader?: boolean;
  
  /**
   * Content for the header
   */
  headerContent?: React.ReactNode;
  
  /**
   * Whether to include a footer
   * @default false
   */
  showFooter?: boolean;
  
  /**
   * Content for the footer
   */
  footerContent?: React.ReactNode;
  
  /**
   * Whether to show a print button
   * @default false
   */
  showPrintButton?: boolean;
  
  /**
   * The position of the print button
   * @default 'top-right'
   */
  printButtonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'floating';
  
  /**
   * Custom text for the print button
   * @default 'Print'
   */
  printButtonText?: string;
  
  /**
   * Whether to hide elements with the class 'no-print' when printing
   * @default true
   */
  hideNoPrint?: boolean;
  
  /**
   * Whether to add a print stylesheet automatically
   * @default true
   */
  addPrintStyles?: boolean;
  
  /**
   * Whether to show a preview of how the content will look when printed
   * @default false
   */
  showPreview?: boolean;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * PrintLayout component for creating print-optimized layouts
 */
export const PrintLayout = forwardRef<HTMLDivElement, PrintLayoutProps>(
  (
    {
      children,
      paperSize = 'a4',
      orientation = 'portrait',
      margin = 'medium',
      customMargins = { top: 15, right: 15, bottom: 15, left: 15 },
      showPageNumbers = false,
      startPageNumber = 1,
      pageNumberPosition = 'bottom-center',
      showHeader = false,
      headerContent,
      showFooter = false,
      footerContent,
      showPrintButton = false,
      printButtonPosition = 'top-right',
      printButtonText = 'Print',
      hideNoPrint = true,
      addPrintStyles = true,
      showPreview = false,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState(startPageNumber);
    
    // Get paper dimensions based on size and orientation
    const getPaperDimensions = () => {
      const dimensions = {
        a4: { width: 210, height: 297 },
        a5: { width: 148, height: 210 },
        letter: { width: 215.9, height: 279.4 },
        legal: { width: 215.9, height: 355.6 },
        tabloid: { width: 279.4, height: 431.8 },
      };
      
      const { width, height } = dimensions[paperSize];
      
      return orientation === 'portrait'
        ? { width, height }
        : { width: height, height: width };
    };
    
    // Get margin values based on size
    const getMarginValues = () => {
      if (margin === 'custom') {
        return {
          top: `${customMargins.top || 0}mm`,
          right: `${customMargins.right || 0}mm`,
          bottom: `${customMargins.bottom || 0}mm`,
          left: `${customMargins.left || 0}mm`,
        };
      }
      
      const marginSizes = {
        none: 0,
        small: 10,
        medium: 15,
        large: 25,
      };
      
      const marginValue = `${marginSizes[margin]}mm`;
      
      return {
        top: marginValue,
        right: marginValue,
        bottom: marginValue,
        left: marginValue,
      };
    };
    
    // Handle print button click
    const handlePrint = () => {
      window.print();
    };
    
    // Add print styles
    useEffect(() => {
      if (!addPrintStyles) return;
      
      // Create a style element for print styles
      const styleElement = document.createElement('style');
      styleElement.setAttribute('type', 'text/css');
      styleElement.setAttribute('data-print-styles', 'true');
      
      // Define print styles
      const printStyles = `
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .strive-print-layout {
            width: 100% !important;
            height: auto !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .strive-print-button {
            display: none !important;
          }
          
          ${hideNoPrint ? '.no-print { display: none !important; }' : ''}
          
          @page {
            size: ${paperSize} ${orientation};
            margin: ${getMarginValues().top} ${getMarginValues().right} ${getMarginValues().bottom} ${getMarginValues().left};
          }
        }
      `;
      
      styleElement.innerHTML = printStyles;
      document.head.appendChild(styleElement);
      
      return () => {
        // Clean up the style element when component unmounts
        document.head.removeChild(styleElement);
      };
    }, [addPrintStyles, hideNoPrint, paperSize, orientation, margin, customMargins]);
    
    // Calculate page numbers based on content height
    useEffect(() => {
      if (!showPageNumbers) return;
      
      const calculatePages = () => {
        // This is a simplified calculation
        // In a real implementation, you would need to account for the actual content height
        // and the available space on each page
        setCurrentPage(startPageNumber);
      };
      
      calculatePages();
      
      window.addEventListener('resize', calculatePages);
      
      return () => {
        window.removeEventListener('resize', calculatePages);
      };
    }, [showPageNumbers, startPageNumber, children]);
    
    // Get paper dimensions
    const { width, height } = getPaperDimensions();
    
    // Build the container style
    const containerStyle: React.CSSProperties = {
      width: showPreview ? `${width}mm` : '100%',
      minHeight: showPreview ? `${height}mm` : 'auto',
      backgroundColor: 'white',
      position: 'relative',
      ...(showPreview && {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '2rem auto',
        padding: 0,
      }),
      ...style,
    };
    
    // Build the content style
    const contentStyle: React.CSSProperties = {
      padding: `${getMarginValues().top} ${getMarginValues().right} ${getMarginValues().bottom} ${getMarginValues().left}`,
      minHeight: showHeader || showFooter ? `calc(100% - 80px)` : '100%',
    };
    
    // Build the header style
    const headerStyle: React.CSSProperties = {
      padding: `${getMarginValues().top} ${getMarginValues().right} 10px ${getMarginValues().left}`,
      borderBottom: '1px solid #e0e0e0',
    };
    
    // Build the footer style
    const footerStyle: React.CSSProperties = {
      padding: `10px ${getMarginValues().right} ${getMarginValues().bottom} ${getMarginValues().left}`,
      borderTop: '1px solid #e0e0e0',
    };
    
    // Build the page number style
    const getPageNumberStyle = (): React.CSSProperties => {
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        fontSize: '12px',
        color: '#666',
      };
      
      if (pageNumberPosition.startsWith('top')) {
        baseStyle.top = '5mm';
      } else {
        baseStyle.bottom = '5mm';
      }
      
      if (pageNumberPosition.endsWith('left')) {
        baseStyle.left = '5mm';
      } else if (pageNumberPosition.endsWith('right')) {
        baseStyle.right = '5mm';
      } else {
        baseStyle.left = '50%';
        baseStyle.transform = 'translateX(-50%)';
      }
      
      return baseStyle;
    };
    
    // Build the print button style
    const getPrintButtonStyle = (): React.CSSProperties => {
      const baseStyle: React.CSSProperties = {
        padding: '0.5rem 1rem',
        backgroundColor: '#1976d2',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: 100,
      };
      
      if (printButtonPosition === 'floating') {
        return {
          ...baseStyle,
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
        };
      }
      
      const positionStyle: React.CSSProperties = {
        position: 'absolute',
      };
      
      if (printButtonPosition.startsWith('top')) {
        positionStyle.top = '1rem';
      } else {
        positionStyle.bottom = '1rem';
      }
      
      if (printButtonPosition.endsWith('left')) {
        positionStyle.left = '1rem';
      } else {
        positionStyle.right = '1rem';
      }
      
      return { ...baseStyle, ...positionStyle };
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-print-layout ${className}`}
        style={containerStyle}
        {...rest}
      >
        {showHeader && (
          <header className="strive-print-header" style={headerStyle}>
            {headerContent || <div>Header</div>}
          </header>
        )}
        
        <div className="strive-print-content" style={contentStyle}>
          {children}
        </div>
        
        {showFooter && (
          <footer className="strive-print-footer" style={footerStyle}>
            {footerContent || <div>Footer</div>}
          </footer>
        )}
        
        {showPageNumbers && (
          <div className="strive-print-page-number" style={getPageNumberStyle()}>
            Page {currentPage}
          </div>
        )}
        
        {showPrintButton && (
          <button
            className="strive-print-button no-print"
            style={getPrintButtonStyle()}
            onClick={handlePrint}
            aria-label="Print document"
          >
            {printButtonText}
          </button>
        )}
      </Component>
    );
  }
);

PrintLayout.displayName = 'PrintLayout';
