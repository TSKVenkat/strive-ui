import React, { createContext, useContext, forwardRef } from 'react';
import { 
  useDrawingCanvas, 
  UseDrawingCanvasReturn, 
  Stroke, 
  DrawingHistory 
} from './useDrawingCanvas';

// Define the props for the DrawingCanvas component
export interface DrawingCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Default drawing history (uncontrolled)
   */
  defaultHistory?: DrawingHistory;
  /**
   * Controlled drawing history
   */
  history?: DrawingHistory;
  /**
   * Callback when drawing history changes
   */
  onChange?: (history: DrawingHistory) => void;
  /**
   * Whether the drawing canvas is disabled
   */
  disabled?: boolean;
  /**
   * Whether the drawing canvas is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the drawing canvas is required
   */
  required?: boolean;
  /**
   * ID for the drawing canvas element
   */
  id?: string;
  /**
   * Name attribute for the drawing canvas
   */
  name?: string;
  /**
   * Minimum width of the stroke
   */
  minWidth?: number;
  /**
   * Maximum width of the stroke
   */
  maxWidth?: number;
  /**
   * Default color of the stroke
   */
  defaultColor?: string;
  /**
   * Default width of the stroke
   */
  defaultStrokeWidth?: number;
  /**
   * Default tool type
   */
  defaultToolType?: 'brush' | 'eraser';
  /**
   * Background color of the canvas
   */
  backgroundColor?: string;
  /**
   * Background image of the canvas
   */
  backgroundImage?: string;
  /**
   * Width of the canvas
   */
  width?: number;
  /**
   * Height of the canvas
   */
  height?: number;
  /**
   * Callback when drawing starts
   */
  onBegin?: () => void;
  /**
   * Callback when drawing ends
   */
  onEnd?: () => void;
  /**
   * Callback when canvas is cleared
   */
  onClear?: () => void;
  /**
   * Callback when drawing is saved as data URL
   */
  onSave?: (dataURL: string) => void;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the DrawingCanvas
export interface DrawingCanvasContextValue extends UseDrawingCanvasReturn {}

const DrawingCanvasContext = createContext<DrawingCanvasContextValue | undefined>(undefined);

// Hook to use the DrawingCanvas context
export function useDrawingCanvasContext() {
  const context = useContext(DrawingCanvasContext);
  if (!context) {
    throw new Error('useDrawingCanvasContext must be used within a DrawingCanvasProvider');
  }
  return context;
}

// Root component
export const DrawingCanvasRoot = forwardRef<HTMLDivElement, DrawingCanvasProps>(
  (
    {
      defaultHistory,
      history,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      minWidth,
      maxWidth,
      defaultColor,
      defaultStrokeWidth,
      defaultToolType,
      backgroundColor,
      backgroundImage,
      width,
      height,
      onBegin,
      onEnd,
      onClear,
      onSave,
      children,
      ...props
    },
    ref
  ) => {
    // Use the drawing canvas hook
    const drawingCanvas = useDrawingCanvas({
      defaultHistory,
      history,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      minWidth,
      maxWidth,
      defaultColor,
      defaultStrokeWidth,
      defaultToolType,
      backgroundColor,
      backgroundImage,
      width,
      height,
      onBegin,
      onEnd,
      onClear,
      onSave,
    });

    return (
      <DrawingCanvasContext.Provider value={drawingCanvas}>
        <div {...props} ref={ref}>
          {children || (
            <>
              <DrawingCanvasCanvas />
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <DrawingCanvasBrushButton />
                <DrawingCanvasEraserButton />
                <DrawingCanvasColorPicker />
                <DrawingCanvasWidthSlider />
                <DrawingCanvasClearButton />
                <DrawingCanvasUndoButton />
                <DrawingCanvasRedoButton />
                <DrawingCanvasSaveButton />
              </div>
            </>
          )}
        </div>
      </DrawingCanvasContext.Provider>
    );
  }
);

DrawingCanvasRoot.displayName = 'DrawingCanvas';

// Canvas component
export interface DrawingCanvasCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

export const DrawingCanvasCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasCanvasProps>(
  (props, ref) => {
    const { getCanvasProps } = useDrawingCanvasContext();
    const canvasProps = getCanvasProps({ ...props, ref });

    return <canvas {...canvasProps} />;
  }
);

DrawingCanvasCanvas.displayName = 'DrawingCanvas.Canvas';

// Clear button component
export interface DrawingCanvasClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawingCanvasClearButton = forwardRef<HTMLButtonElement, DrawingCanvasClearButtonProps>(
  (props, ref) => {
    const { getClearButtonProps } = useDrawingCanvasContext();
    const clearButtonProps = getClearButtonProps({ ...props, ref });

    return (
      <button {...clearButtonProps}>
        {props.children || 'Clear'}
      </button>
    );
  }
);

DrawingCanvasClearButton.displayName = 'DrawingCanvas.ClearButton';

// Undo button component
export interface DrawingCanvasUndoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawingCanvasUndoButton = forwardRef<HTMLButtonElement, DrawingCanvasUndoButtonProps>(
  (props, ref) => {
    const { getUndoButtonProps } = useDrawingCanvasContext();
    const undoButtonProps = getUndoButtonProps({ ...props, ref });

    return (
      <button {...undoButtonProps}>
        {props.children || 'Undo'}
      </button>
    );
  }
);

DrawingCanvasUndoButton.displayName = 'DrawingCanvas.UndoButton';

// Redo button component
export interface DrawingCanvasRedoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawingCanvasRedoButton = forwardRef<HTMLButtonElement, DrawingCanvasRedoButtonProps>(
  (props, ref) => {
    const { getRedoButtonProps } = useDrawingCanvasContext();
    const redoButtonProps = getRedoButtonProps({ ...props, ref });

    return (
      <button {...redoButtonProps}>
        {props.children || 'Redo'}
      </button>
    );
  }
);

DrawingCanvasRedoButton.displayName = 'DrawingCanvas.RedoButton';

// Save button component
export interface DrawingCanvasSaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Type of the image
   */
  type?: string;
  /**
   * Encoder options
   */
  encoderOptions?: number;
}

export const DrawingCanvasSaveButton = forwardRef<HTMLButtonElement, DrawingCanvasSaveButtonProps>(
  ({ type, encoderOptions, ...props }, ref) => {
    const { getSaveButtonProps } = useDrawingCanvasContext();
    const saveButtonProps = getSaveButtonProps({ ...props, ref }, type, encoderOptions);

    return (
      <button {...saveButtonProps}>
        {props.children || 'Save'}
      </button>
    );
  }
);

DrawingCanvasSaveButton.displayName = 'DrawingCanvas.SaveButton';

// Brush button component
export interface DrawingCanvasBrushButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawingCanvasBrushButton = forwardRef<HTMLButtonElement, DrawingCanvasBrushButtonProps>(
  (props, ref) => {
    const { getBrushButtonProps } = useDrawingCanvasContext();
    const brushButtonProps = getBrushButtonProps({ ...props, ref });

    return (
      <button {...brushButtonProps}>
        {props.children || 'Brush'}
      </button>
    );
  }
);

DrawingCanvasBrushButton.displayName = 'DrawingCanvas.BrushButton';

// Eraser button component
export interface DrawingCanvasEraserButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DrawingCanvasEraserButton = forwardRef<HTMLButtonElement, DrawingCanvasEraserButtonProps>(
  (props, ref) => {
    const { getEraserButtonProps } = useDrawingCanvasContext();
    const eraserButtonProps = getEraserButtonProps({ ...props, ref });

    return (
      <button {...eraserButtonProps}>
        {props.children || 'Eraser'}
      </button>
    );
  }
);

DrawingCanvasEraserButton.displayName = 'DrawingCanvas.EraserButton';

// Color picker component
export interface DrawingCanvasColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const DrawingCanvasColorPicker = forwardRef<HTMLInputElement, DrawingCanvasColorPickerProps>(
  (props, ref) => {
    const { setColor, color, toolType } = useDrawingCanvasContext();

    return (
      <input
        {...props}
        ref={ref}
        type="color"
        value={color}
        disabled={toolType === 'eraser' || props.disabled}
        onChange={(e) => {
          setColor(e.target.value);
          props.onChange?.(e);
        }}
        'data-disabled': (toolType === 'eraser' || props.disabled) ? '' : undefined,
      />
    );
  }
);

DrawingCanvasColorPicker.displayName = 'DrawingCanvas.ColorPicker';

// Width slider component
export interface DrawingCanvasWidthSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const DrawingCanvasWidthSlider = forwardRef<HTMLInputElement, DrawingCanvasWidthSliderProps>(
  (props, ref) => {
    const { setStrokeWidth, strokeWidth, minWidth, maxWidth } = useDrawingCanvasContext();

    return (
      <input
        {...props}
        ref={ref}
        type="range"
        min={minWidth}
        max={maxWidth}
        step={0.5}
        value={strokeWidth}
        onChange={(e) => {
          setStrokeWidth(parseFloat(e.target.value));
          props.onChange?.(e);
        }}
      />
    );
  }
);

DrawingCanvasWidthSlider.displayName = 'DrawingCanvas.WidthSlider';

// Background color picker component
export interface DrawingCanvasBackgroundColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const DrawingCanvasBackgroundColorPicker = forwardRef<HTMLInputElement, DrawingCanvasBackgroundColorPickerProps>(
  (props, ref) => {
    const { setBackgroundColor, backgroundColor } = useDrawingCanvasContext();

    return (
      <input
        {...props}
        ref={ref}
        type="color"
        value={backgroundColor}
        onChange={(e) => {
          setBackgroundColor(e.target.value);
          props.onChange?.(e);
        }}
      />
    );
  }
);

DrawingCanvasBackgroundColorPicker.displayName = 'DrawingCanvas.BackgroundColorPicker';

// Create the DrawingCanvas component with all its subcomponents
export const DrawingCanvasHeadless = Object.assign(DrawingCanvasRoot, {
  Canvas: DrawingCanvasCanvas,
  ClearButton: DrawingCanvasClearButton,
  UndoButton: DrawingCanvasUndoButton,
  RedoButton: DrawingCanvasRedoButton,
  SaveButton: DrawingCanvasSaveButton,
  BrushButton: DrawingCanvasBrushButton,
  EraserButton: DrawingCanvasEraserButton,
  ColorPicker: DrawingCanvasColorPicker,
  WidthSlider: DrawingCanvasWidthSlider,
  BackgroundColorPicker: DrawingCanvasBackgroundColorPicker,
});

export default DrawingCanvasHeadless;
