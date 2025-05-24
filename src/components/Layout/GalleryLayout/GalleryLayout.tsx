import React, { forwardRef, useState, useEffect } from 'react';

export type GalleryLayoutVariant = 'grid' | 'masonry' | 'carousel' | 'filmstrip' | 'mosaic';
export type GalleryLayoutGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
export type GalleryAspectRatio = '1:1' | '4:3' | '16:9' | '3:2' | '2:3' | 'auto';

export interface GalleryLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The gallery items to render
   */
  children: React.ReactNode[];
  
  /**
   * Layout variant
   * @default 'grid'
   */
  variant?: GalleryLayoutVariant;
  
  /**
   * Number of columns in grid or masonry variant
   * @default 3
   */
  columns?: number;
  
  /**
   * Gap between gallery items
   * @default 'md'
   */
  gap?: GalleryLayoutGap;
  
  /**
   * Aspect ratio of gallery items
   * @default '1:1'
   */
  aspectRatio?: GalleryAspectRatio;
  
  /**
   * Whether to fill the container width
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Whether to enable lightbox on click
   * @default false
   */
  lightbox?: boolean;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Responsive configuration for different breakpoints
   */
  responsive?: {
    sm?: Partial<GalleryLayoutProps>;
    md?: Partial<GalleryLayoutProps>;
    lg?: Partial<GalleryLayoutProps>;
    xl?: Partial<GalleryLayoutProps>;
  };
}

/**
 * GalleryLayout component for creating image gallery layouts
 */
export const GalleryLayout = forwardRef<HTMLDivElement, GalleryLayoutProps>(
  (
    {
      children,
      variant = 'grid',
      columns = 3,
      gap = 'md',
      aspectRatio = '1:1',
      fullWidth = true,
      lightbox = false,
      as: Component = 'div',
      className = '',
      responsive,
      style,
      ...rest
    },
    ref
  ) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [columnCount, setColumnCount] = useState(columns);
    const [itemsPerColumn, setItemsPerColumn] = useState<React.ReactNode[][]>([]);
    
    // Map gap values to actual CSS values
    const gapMap = {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };

    // Convert gap value to CSS
    const getGapValue = (gapValue: GalleryLayoutGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };
    
    // Convert aspect ratio to padding-bottom percentage
    const getAspectRatioPadding = (ratio: GalleryAspectRatio) => {
      if (ratio === 'auto') return 'auto';
      
      const [width, height] = ratio.split(':').map(Number);
      return `${(height / width) * 100}%`;
    };

    // Handle responsive columns based on breakpoints
    useEffect(() => {
      if (!responsive) {
        setColumnCount(columns);
        return;
      }

      const handleResize = () => {
        const width = window.innerWidth;
        let newColumnCount = columns;

        if (width >= 1280 && responsive.xl?.columns) {
          newColumnCount = responsive.xl.columns;
        } else if (width >= 1024 && responsive.lg?.columns) {
          newColumnCount = responsive.lg.columns;
        } else if (width >= 768 && responsive.md?.columns) {
          newColumnCount = responsive.md.columns;
        } else if (width >= 640 && responsive.sm?.columns) {
          newColumnCount = responsive.sm.columns;
        }

        setColumnCount(newColumnCount);
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [responsive, columns]);

    // Distribute items into columns for masonry layout
    useEffect(() => {
      if (variant !== 'masonry' || !children || !children.length) {
        setItemsPerColumn([]);
        return;
      }

      const newItemsPerColumn: React.ReactNode[][] = Array.from({ length: columnCount }, () => []);
      
      // Distribute items evenly across columns (column-first approach)
      children.forEach((child, index) => {
        const columnIndex = index % columnCount;
        newItemsPerColumn[columnIndex].push(child);
      });

      setItemsPerColumn(newItemsPerColumn);
    }, [children, columnCount, variant]);

    // Handle lightbox functionality
    const openLightbox = (index: number) => {
      if (lightbox) {
        setActiveIndex(index);
        document.body.style.overflow = 'hidden';
      }
    };

    const closeLightbox = () => {
      setActiveIndex(null);
      document.body.style.overflow = '';
    };

    // Build the style object based on variant
    let galleryStyle: React.CSSProperties = {
      ...(fullWidth && { width: '100%' }),
      ...style,
    };

    // Process children to apply styles based on variant
    let processedChildren;
    
    // Apply styles based on variant
    switch (variant) {
      case 'grid':
        galleryStyle = {
          ...galleryStyle,
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
          gap: getGapValue(gap),
        };
        
        processedChildren = React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          const itemStyle: React.CSSProperties = {
            position: 'relative',
            overflow: 'hidden',
            ...(aspectRatio !== 'auto' && {
              paddingBottom: getAspectRatioPadding(aspectRatio),
            }),
          };

          return (
            <div
              className="strive-gallery-item"
              style={itemStyle}
              onClick={() => openLightbox(index)}
            >
              {React.cloneElement(child, {
                style: {
                  position: aspectRatio !== 'auto' ? 'absolute' : 'relative',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: aspectRatio !== 'auto' ? '100%' : 'auto',
                  objectFit: 'cover',
                  ...child.props.style,
                },
                className: `strive-gallery-image ${child.props.className || ''}`,
              })}
            </div>
          );
        });
        break;
        
      case 'masonry':
        galleryStyle = {
          ...galleryStyle,
          display: 'flex',
          gap: getGapValue(gap),
        };
        
        processedChildren = itemsPerColumn.map((columnItems, columnIndex) => (
          <div
            key={`masonry-column-${columnIndex}`}
            className="strive-gallery-column"
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: `calc((100% - ${getGapValue(gap)} * ${columnCount - 1}) / ${columnCount})`,
              gap: getGapValue(gap),
            }}
          >
            {columnItems.map((item, itemIndex) => {
              if (!React.isValidElement(item)) return item;
              
              const globalIndex = columnIndex + (itemIndex * columnCount);
              
              return (
                <div
                  key={`masonry-item-${columnIndex}-${itemIndex}`}
                  className="strive-gallery-item"
                  style={{ overflow: 'hidden' }}
                  onClick={() => openLightbox(globalIndex)}
                >
                  {React.cloneElement(item, {
                    style: {
                      width: '100%',
                      display: 'block',
                      ...item.props.style,
                    },
                    className: `strive-gallery-image ${item.props.className || ''}`,
                  })}
                </div>
              );
            })}
          </div>
        ));
        break;
        
      case 'carousel':
        galleryStyle = {
          ...galleryStyle,
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          gap: getGapValue(gap),
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        };
        
        processedChildren = React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          const itemStyle: React.CSSProperties = {
            flex: '0 0 auto',
            width: `calc((100% - (${getGapValue(gap)} * ${Math.min(children.length, 3) - 1})) / ${Math.min(children.length, 3)})`,
            scrollSnapAlign: 'start',
            position: 'relative',
            overflow: 'hidden',
            ...(aspectRatio !== 'auto' && {
              paddingBottom: getAspectRatioPadding(aspectRatio),
            }),
          };

          return (
            <div
              className="strive-gallery-item"
              style={itemStyle}
              onClick={() => openLightbox(index)}
            >
              {React.cloneElement(child, {
                style: {
                  position: aspectRatio !== 'auto' ? 'absolute' : 'relative',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: aspectRatio !== 'auto' ? '100%' : 'auto',
                  objectFit: 'cover',
                  ...child.props.style,
                },
                className: `strive-gallery-image ${child.props.className || ''}`,
              })}
            </div>
          );
        });
        break;
        
      case 'filmstrip':
        galleryStyle = {
          ...galleryStyle,
          display: 'flex',
          flexDirection: 'column',
          gap: getGapValue(gap),
        };
        
        const mainImageStyle: React.CSSProperties = {
          position: 'relative',
          overflow: 'hidden',
          ...(aspectRatio !== 'auto' && {
            paddingBottom: getAspectRatioPadding(aspectRatio),
          }),
        };
        
        const thumbnailsStyle: React.CSSProperties = {
          display: 'flex',
          gap: getGapValue(gap),
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        };
        
        processedChildren = (
          <>
            <div className="strive-gallery-main" style={mainImageStyle}>
              {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child) || index !== 0) return null;
                
                return React.cloneElement(child, {
                  style: {
                    position: aspectRatio !== 'auto' ? 'absolute' : 'relative',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: aspectRatio !== 'auto' ? '100%' : 'auto',
                    objectFit: 'cover',
                    ...child.props.style,
                  },
                  className: `strive-gallery-image ${child.props.className || ''}`,
                  onClick: () => openLightbox(0),
                });
              })}
            </div>
            <div className="strive-gallery-thumbnails" style={thumbnailsStyle}>
              {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return null;
                
                const thumbnailStyle: React.CSSProperties = {
                  flex: '0 0 auto',
                  width: '100px',
                  height: '75px',
                  scrollSnapAlign: 'start',
                  cursor: 'pointer',
                };
                
                return (
                  <div
                    className="strive-gallery-thumbnail"
                    style={thumbnailStyle}
                    onClick={() => openLightbox(index)}
                  >
                    {React.cloneElement(child, {
                      style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        ...child.props.style,
                      },
                      className: `strive-gallery-thumbnail-image ${child.props.className || ''}`,
                    })}
                  </div>
                );
              })}
            </div>
          </>
        );
        break;
        
      case 'mosaic':
        galleryStyle = {
          ...galleryStyle,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'minmax(100px, auto)',
          gap: getGapValue(gap),
        };
        
        processedChildren = React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;

          // Define different grid spans for a mosaic layout
          let gridColumn = 'span 1';
          let gridRow = 'span 1';
          
          // Create a mosaic pattern
          if (index === 0) {
            gridColumn = 'span 2';
            gridRow = 'span 2';
          } else if (index % 5 === 0) {
            gridColumn = 'span 2';
          } else if (index % 7 === 0) {
            gridRow = 'span 2';
          }

          const itemStyle: React.CSSProperties = {
            gridColumn,
            gridRow,
            overflow: 'hidden',
          };

          return (
            <div
              className="strive-gallery-item"
              style={itemStyle}
              onClick={() => openLightbox(index)}
            >
              {React.cloneElement(child, {
                style: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  ...child.props.style,
                },
                className: `strive-gallery-image ${child.props.className || ''}`,
              })}
            </div>
          );
        });
        break;
    }

    // Lightbox component
    const lightboxComponent = lightbox && activeIndex !== null && (
      <div
        className="strive-gallery-lightbox"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
        onClick={closeLightbox}
      >
        <button
          className="strive-gallery-lightbox-close"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          onClick={closeLightbox}
        >
          ×
        </button>
        <div
          className="strive-gallery-lightbox-content"
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            position: 'relative',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child) || index !== activeIndex) return null;
            
            return React.cloneElement(child, {
              style: {
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                ...child.props.style,
              },
              className: `strive-gallery-lightbox-image ${child.props.className || ''}`,
            });
          })}
        </div>
        <button
          className="strive-gallery-lightbox-prev"
          style={{
            position: 'absolute',
            left: '20px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((prev) => (prev === null || prev === 0) ? children.length - 1 : prev - 1);
          }}
        >
          ‹
        </button>
        <button
          className="strive-gallery-lightbox-next"
          style={{
            position: 'absolute',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((prev) => (prev === null || prev === children.length - 1) ? 0 : prev + 1);
          }}
        >
          ›
        </button>
      </div>
    );

    return (
      <>
        <Component
          ref={ref}
          className={`strive-gallery-layout strive-gallery-layout-${variant} ${className}`}
          style={galleryStyle}
          {...rest}
        >
          {processedChildren}
        </Component>
        {lightboxComponent}
      </>
    );
  }
);

GalleryLayout.displayName = 'GalleryLayout';
