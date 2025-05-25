import React, { forwardRef, useRef, useState, useEffect } from 'react';

export type ParallaxSpeed = number;
export type ParallaxDirection = 'up' | 'down' | 'left' | 'right';
export type ParallaxEffect = 'scroll' | 'mouse' | 'both';

export interface ParallaxContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the parallax container
   */
  children: React.ReactNode;
  
  /**
   * The background image URL
   */
  backgroundImage?: string;
  
  /**
   * The background color
   * @default 'transparent'
   */
  backgroundColor?: string;
  
  /**
   * The speed of the parallax effect
   * Positive values move elements in the opposite direction of scroll
   * Negative values move elements in the same direction as scroll
   * @default 0.5
   */
  speed?: ParallaxSpeed;
  
  /**
   * The direction of the parallax effect
   * @default 'up'
   */
  direction?: ParallaxDirection;
  
  /**
   * The type of parallax effect
   * @default 'scroll'
   */
  effect?: ParallaxEffect;
  
  /**
   * Whether to disable the parallax effect
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Whether to add an overlay
   * @default false
   */
  overlay?: boolean;
  
  /**
   * The overlay color
   * @default 'rgba(0, 0, 0, 0.3)'
   */
  overlayColor?: string;
  
  /**
   * The height of the container
   * @default '400px'
   */
  height?: string | number;
  
  /**
   * Whether to make the container full screen
   * @default false
   */
  fullScreen?: boolean;
  
  /**
   * Whether to center the content
   * @default true
   */
  centerContent?: boolean;
  
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
 * ParallaxContainer component for creating parallax scrolling effects
 */
export const ParallaxContainer = forwardRef<HTMLDivElement, ParallaxContainerProps>(
  (
    {
      children,
      backgroundImage,
      backgroundColor = 'transparent',
      speed = 0.5,
      direction = 'up',
      effect = 'scroll',
      disabled = false,
      overlay = false,
      overlayColor = 'rgba(0, 0, 0, 0.3)',
      height = '400px',
      fullScreen = false,
      centerContent = true,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
    
    // Calculate the height
    const getHeight = () => {
      if (fullScreen) {
        return '100vh';
      }
      if (typeof height === 'number') {
        return `${height}px`;
      }
      return height;
    };
    
    // Handle scroll effect
    useEffect(() => {
      if (disabled || (effect !== 'scroll' && effect !== 'both')) return;
      
      const handleScroll = () => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        
        // Check if the container is in the viewport
        if (
          rect.bottom >= 0 &&
          rect.top <= window.innerHeight
        ) {
          // Calculate the offset based on the scroll position
          const offsetY = (scrollY - (rect.top + scrollY - window.innerHeight)) * speed;
          
          // Apply the offset based on the direction
          if (direction === 'up' || direction === 'down') {
            setOffset((prev) => ({
              ...prev,
              y: direction === 'up' ? offsetY : -offsetY,
            }));
          } else if (direction === 'left' || direction === 'right') {
            setOffset((prev) => ({
              ...prev,
              x: direction === 'left' ? offsetY : -offsetY,
            }));
          }
        }
      };
      
      // Add scroll event listener
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial calculation
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [disabled, effect, speed, direction]);
    
    // Handle mouse effect
    useEffect(() => {
      if (disabled || (effect !== 'mouse' && effect !== 'both')) return;
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        
        // Store the container rect for later use
        if (!containerRect) {
          setContainerRect(rect);
        }
        
        // Calculate the mouse position relative to the container center
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        
        setMousePosition({ x, y });
      };
      
      // Add mouse move event listener
      if (containerRef.current) {
        containerRef.current.addEventListener('mousemove', handleMouseMove);
      }
      
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousemove', handleMouseMove);
        }
      };
    }, [disabled, effect, containerRect]);
    
    // Calculate the transform based on the effect type
    const getTransform = () => {
      if (disabled) return 'translate3d(0, 0, 0)';
      
      let x = 0;
      let y = 0;
      
      if (effect === 'scroll' || effect === 'both') {
        x += offset.x;
        y += offset.y;
      }
      
      if (effect === 'mouse' || effect === 'both') {
        const mouseSpeed = 20; // Adjust this value to control the mouse effect intensity
        
        if (direction === 'up' || direction === 'down') {
          y += direction === 'up' ? -mousePosition.y * mouseSpeed : mousePosition.y * mouseSpeed;
        } else if (direction === 'left' || direction === 'right') {
          x += direction === 'left' ? -mousePosition.x * mouseSpeed : mousePosition.x * mouseSpeed;
        }
      }
      
      return `translate3d(${x}px, ${y}px, 0)`;
    };
    
    // Build the container style
    const containerStyle: React.CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      height: getHeight(),
      ...style,
    };
    
    // Build the background style
    const backgroundStyle: React.CSSProperties = {
      position: 'absolute',
      top: -100,
      left: -100,
      right: -100,
      bottom: -100,
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      backgroundColor,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transform: getTransform(),
      transition: 'transform 0.1s ease-out',
      zIndex: 0,
    };
    
    // Build the overlay style
    const overlayStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: overlayColor,
      zIndex: 1,
    };
    
    // Build the content style
    const contentStyle: React.CSSProperties = {
      position: 'relative',
      zIndex: 2,
      height: '100%',
      ...(centerContent && {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }),
    };
    
    return (
      <Component
        ref={(node) => {
          // Handle both the forwardRef and the local ref
          if (ref) {
            if (typeof ref === 'function') {
              ref(node);
            } else {
              ref.current = node;
            }
          }
          containerRef.current = node;
        }}
        className={`strive-parallax-container ${className}`}
        style={containerStyle}
        {...rest}
      >
        <div className="strive-parallax-background" style={backgroundStyle} />
        {overlay && <div className="strive-parallax-overlay" style={overlayStyle} />}
        <div className="strive-parallax-content" style={contentStyle}>
          {children}
        </div>
      </Component>
    );
  }
);

ParallaxContainer.displayName = 'ParallaxContainer';

/**
 * ParallaxLayer component for creating multiple parallax layers within a ParallaxContainer
 */
export interface ParallaxLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content to render in the parallax layer
   */
  children: React.ReactNode;
  
  /**
   * The speed of the parallax effect
   * @default 0.5
   */
  speed?: ParallaxSpeed;
  
  /**
   * The horizontal offset of the layer
   * @default 0
   */
  offsetX?: number;
  
  /**
   * The vertical offset of the layer
   * @default 0
   */
  offsetY?: number;
  
  /**
   * The z-index of the layer
   * @default 'auto'
   */
  zIndex?: number | 'auto';
  
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

export const ParallaxLayer = forwardRef<HTMLDivElement, ParallaxLayerProps>(
  (
    {
      children,
      speed = 0.5,
      offsetX = 0,
      offsetY = 0,
      zIndex = 'auto',
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [scrollY, setScrollY] = useState(0);
    
    useEffect(() => {
      const handleScroll = () => {
        setScrollY(window.scrollY);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Initial calculation
      handleScroll();
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
    
    // Calculate the transform based on the scroll position
    const getTransform = () => {
      const y = scrollY * speed;
      return `translate3d(${offsetX}px, ${offsetY + y}px, 0)`;
    };
    
    // Build the layer style
    const layerStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: getTransform(),
      zIndex: zIndex === 'auto' ? 'auto' : zIndex,
      ...style,
    };
    
    return (
      <Component
        ref={ref}
        className={`strive-parallax-layer ${className}`}
        style={layerStyle}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

ParallaxLayer.displayName = 'ParallaxLayer';
