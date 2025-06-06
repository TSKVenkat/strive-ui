import React, { createContext, useContext, forwardRef } from 'react';
import { useDrawingBoard, UseDrawingBoardReturn, DrawingBoardOptions, DrawingObject, DrawingTool, DrawingMode, DrawingStyle } from './useDrawingBoard';
import { PolymorphicComponentPropsWithRef, PolymorphicRef, polymorphicForwardRef } from '../../types/polymorphic';

// Context for the DrawingBoard component
interface DrawingBoardContextValue extends UseDrawingBoardReturn {}

const DrawingBoardContext = createContext<DrawingBoardContextValue | null>(null);

// Hook to use DrawingBoard context
export function useDrawingBoardContext() {
  const context = useContext(DrawingBoardContext);
  if (!context) {
    throw new Error('useDrawingBoardContext must be used within a DrawingBoardHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends DrawingBoardOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const drawingBoardProps = useDrawingBoard(options);
    
    return (
      <DrawingBoardContext.Provider value={drawingBoardProps}>
        <div ref={ref}>
          {children}
        </div>
      </DrawingBoardContext.Provider>
    );
  }
);

Root.displayName = 'DrawingBoardHeadless.Root';

// Canvas component props
export type CanvasProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Canvas component
const Canvas = polymorphicForwardRef<'canvas', {
  children?: React.ReactNode;
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'canvas';
    const { getBoardProps } = useDrawingBoardContext();
    
    const boardProps = getBoardProps();
    
    return (
      <Component 
        {...boardProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Canvas.displayName = 'DrawingBoardHeadless.Canvas';

// Toolbar component props
export type ToolbarProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      tool: DrawingTool;
      setTool: (tool: DrawingTool) => void;
      mode: DrawingMode;
      setMode: (mode: DrawingMode) => void;
      style: DrawingStyle;
      setStyle: (style: Partial<DrawingStyle>) => void;
      clear: () => void;
      undo: () => void;
      redo: () => void;
    }) => React.ReactNode);
  }
>;

// Toolbar component
const Toolbar = polymorphicForwardRef<'div', {
  children: React.ReactNode | ((props: {
    tool: DrawingTool;
    setTool: (tool: DrawingTool) => void;
    mode: DrawingMode;
    setMode: (mode: DrawingMode) => void;
    style: DrawingStyle;
    setStyle: (style: Partial<DrawingStyle>) => void;
    clear: () => void;
    undo: () => void;
    redo: () => void;
  }) => React.ReactNode);
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { 
      tool, 
      setTool, 
      mode, 
      setMode, 
      style, 
      setStyle, 
      clear, 
      undo, 
      redo 
    } = useDrawingBoardContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ tool, setTool, mode, setMode, style, setStyle, clear, undo, redo }) 
          : children}
      </Component>
    );
  }
);

Toolbar.displayName = 'DrawingBoardHeadless.Toolbar';

// ColorPicker component props
export type ColorPickerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Type of color to pick (stroke or fill)
     */
    type: 'stroke' | 'fill';
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      color: string;
      setColor: (color: string) => void;
    }) => React.ReactNode);
  }
>;

// ColorPicker component
const ColorPicker = polymorphicForwardRef<'div', {
  type: 'stroke' | 'fill';
  children: React.ReactNode | ((props: {
    color: string;
    setColor: (color: string) => void;
  }) => React.ReactNode);
}>(
  (
    { as, type, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { style, setStyle } = useDrawingBoardContext();
    
    const color = type === 'stroke' ? style.strokeColor : style.fillColor;
    
    const setColor = (newColor: string) => {
      if (type === 'stroke') {
        setStyle({ strokeColor: newColor });
      } else {
        setStyle({ fillColor: newColor });
      }
    };
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ color, setColor }) 
          : children}
      </Component>
    );
  }
);

ColorPicker.displayName = 'DrawingBoardHeadless.ColorPicker';

// StrokeWidthPicker component props
export type StrokeWidthPickerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      strokeWidth: number;
      setStrokeWidth: (width: number) => void;
    }) => React.ReactNode);
  }
>;

// StrokeWidthPicker component
const StrokeWidthPicker = polymorphicForwardRef<'div', {
  children: React.ReactNode | ((props: {
    strokeWidth: number;
    setStrokeWidth: (width: number) => void;
  }) => React.ReactNode);
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { style, setStyle } = useDrawingBoardContext();
    
    const setStrokeWidth = (width: number) => {
      setStyle({ strokeWidth: width });
    };
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ strokeWidth: style.strokeWidth, setStrokeWidth }) 
          : children}
      </Component>
    );
  }
);

StrokeWidthPicker.displayName = 'DrawingBoardHeadless.StrokeWidthPicker';

// OpacityPicker component props
export type OpacityPickerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      opacity: number;
      setOpacity: (opacity: number) => void;
    }) => React.ReactNode);
  }
>;

// OpacityPicker component
const OpacityPicker = polymorphicForwardRef<'div', {
  children: React.ReactNode | ((props: {
    opacity: number;
    setOpacity: (opacity: number) => void;
  }) => React.ReactNode);
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { style, setStyle } = useDrawingBoardContext();
    
    const setOpacity = (opacity: number) => {
      setStyle({ opacity });
    };
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ opacity: style.opacity, setOpacity }) 
          : children}
      </Component>
    );
  }
);

OpacityPicker.displayName = 'DrawingBoardHeadless.OpacityPicker';

// Objects component props
export type ObjectsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      objects: DrawingObject[];
      selectedObjectId: string | null;
      selectObject: (id: string | null) => void;
      removeObject: (id: string) => void;
    }) => React.ReactNode);
  }
>;

// Objects component
const Objects = polymorphicForwardRef<'div', {
  children: React.ReactNode | ((props: {
    objects: DrawingObject[];
    selectedObjectId: string | null;
    selectObject: (id: string | null) => void;
    removeObject: (id: string) => void;
  }) => React.ReactNode);
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { objects, selectedObjectId, selectObject, removeObject } = useDrawingBoardContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ objects, selectedObjectId, selectObject, removeObject }) 
          : children}
      </Component>
    );
  }
);

Objects.displayName = 'DrawingBoardHeadless.Objects';

// Export component props
export type ExportProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      exportImage: (type?: string, quality?: number) => string;
      importImage: (dataUrl: string) => void;
    }) => React.ReactNode);
  }
>;

// Export component
const Export = polymorphicForwardRef<'div', {
  children: React.ReactNode | ((props: {
    exportImage: (type?: string, quality?: number) => string;
    importImage: (dataUrl: string) => void;
  }) => React.ReactNode);
}>(
  (
    { as, children, ...props },
    ref
  ) => {
    const Component = as || 'div';
    const { exportImage, importImage } = useDrawingBoardContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ exportImage, importImage }) 
          : children}
      </Component>
    );
  }
);

Export.displayName = 'DrawingBoardHeadless.Export';

// Export all components
export const DrawingBoardHeadless = {
  Root,
  Canvas,
  Toolbar,
  ColorPicker,
  StrokeWidthPicker,
  OpacityPicker,
  Objects,
  Export,
  useDrawingBoardContext,
};

export default DrawingBoardHeadless;
