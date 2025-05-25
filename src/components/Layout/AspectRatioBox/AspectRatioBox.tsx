import React, { forwardRef } from 'react';

export type AspectRatio = number | `${number}/${number}`;

export interface AspectRatioBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render inside the aspect ratio box
   */
  children: React.ReactNode;
  
  /**
   * The aspect ratio to maintain
   * Can be a number (e.g., 16/9 = 1.7778) or a string in the format "width/height" (e.g., "16/9")
   * @default 1 (square)
   */
  ratio?: AspectRatio;
  
  /**
   * The maximum width of the box
   */
  maxWidth?: string | number;
  
  /**
   * The maximum height of the box
   */
  maxHeight?: string | number;
  
  /**
   * Whether to add a border to the box
   * @default false
   */
  bordered?: boolean;
  
  /**
   * The border color
   * @default '#e0e0e0'
   */
  borderColor?: string;
  
  /**
   * Whether to add rounded corners to the box
   * @default false
   */
  rounded?: boolean | string;
  
  /**
   * Whether the content should be centered within the box
   * @default true
   */
  centered?: boolean;
  
  /**
   * Whether the content should fill the box
   * @default false
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  
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
 * AspectRatioBox component for maintaining consistent aspect ratios for content
 */
export const AspectRatioBox = forwardRef<HTMLDivElement, AspectRatioBoxProps>(
  (
    {
      children,
      ratio = 1,
      maxWidth,
      maxHeight,
      bordered = false,
      borderColor = '#e0e0e0',
      rounded = false,
      centered = true,
      objectFit,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Calculate the aspect ratio
    const aspectRatio = typeof ratio === 'string' 
      ? (() => {
          const [width, height] = ratio.split('/').map(Number);
          return width / height;
        })() 
      : ratio;

    // Calculate border radius
    const getBorderRadius = () => {
      if (!rounded) return undefined;
      if (rounded === true) return '0.25rem';
      return rounded;
    };

    // Build the container style
    const containerStyle: React.CSSProperties = {
      position: 'relative',
      width: '100%',
      maxWidth,
      maxHeight,
      ...(bordered && {
        border: `1px solid ${borderColor}`,
      }),
      ...(rounded && {
        borderRadius: getBorderRadius(),
        overflow: 'hidden',
      }),
      ...style,
    };

    // Build the aspect ratio style
    const aspectRatioStyle: React.CSSProperties = {
      paddingBottom: `${(1 / aspectRatio) * 100}%`,
    };

    // Build the content style
    const contentStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      ...(centered && {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),
    };

    // If the child is a single image or video, add object-fit
    const childrenArray = React.Children.toArray(children);
    
    if (childrenArray.length === 1 && React.isValidElement(childrenArray[0])) {
      const child = childrenArray[0];
      const childElement = child.type as any;
      
      // Check if the child is an image or video
      const isMedia = 
        typeof childElement === 'string' && 
        (childElement === 'img' || childElement === 'video' || childElement === 'iframe');
      
      if (isMedia && objectFit) {
        return (
          <Component
            ref={ref}
            className={`strive-aspect-ratio-box ${className}`}
            style={containerStyle}
            {...rest}
          >
            {React.cloneElement(child as React.ReactElement, {
              style: {
                ...contentStyle,
                objectFit,
                ...(child.props.style || {}),
              },
            })}
          </Component>
        );
      }
    }

    return (
      <Component
        ref={ref}
        className={`strive-aspect-ratio-box ${className}`}
        style={containerStyle}
        {...rest}
      >
        <div style={aspectRatioStyle} />
        <div className="strive-aspect-ratio-content" style={contentStyle}>
          {children}
        </div>
      </Component>
    );
  }
);

AspectRatioBox.displayName = 'AspectRatioBox';
