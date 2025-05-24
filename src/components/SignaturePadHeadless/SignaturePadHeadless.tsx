import React, { createContext, useContext, forwardRef } from 'react';
import { useSignaturePad, UseSignaturePadReturn, Stroke } from './useSignaturePad';

// Define the props for the SignaturePad component
export interface SignaturePadProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Default strokes (uncontrolled)
   */
  defaultStrokes?: Stroke[];
  /**
   * Controlled strokes
   */
  strokes?: Stroke[];
  /**
   * Callback when strokes change
   */
  onChange?: (strokes: Stroke[]) => void;
  /**
   * Whether the signature pad is disabled
   */
  disabled?: boolean;
  /**
   * Whether the signature pad is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the signature pad is required
   */
  required?: boolean;
  /**
   * ID for the signature pad element
   */
  id?: string;
  /**
   * Name attribute for the signature pad
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
   * Color of the stroke
   */
  color?: string;
  /**
   * Background color of the canvas
   */
  backgroundColor?: string;
  /**
   * Width of the canvas
   */
  width?: number;
  /**
   * Height of the canvas
   */
  height?: number;
  /**
   * Callback when signature starts
   */
  onBegin?: () => void;
  /**
   * Callback when signature ends
   */
  onEnd?: () => void;
  /**
   * Callback when canvas is cleared
   */
  onClear?: () => void;
  /**
   * Callback when signature is saved as data URL
   */
  onSave?: (dataURL: string) => void;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the SignaturePad
export interface SignaturePadContextValue extends UseSignaturePadReturn {}

const SignaturePadContext = createContext<SignaturePadContextValue | undefined>(undefined);

// Hook to use the SignaturePad context
export function useSignaturePadContext() {
  const context = useContext(SignaturePadContext);
  if (!context) {
    throw new Error('useSignaturePadContext must be used within a SignaturePadProvider');
  }
  return context;
}

// Root component
export const SignaturePadRoot = forwardRef<HTMLDivElement, SignaturePadProps>(
  (
    {
      defaultStrokes,
      strokes,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      minWidth,
      maxWidth,
      color,
      backgroundColor,
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
    // Use the signature pad hook
    const signaturePad = useSignaturePad({
      defaultStrokes,
      strokes,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      minWidth,
      maxWidth,
      color,
      backgroundColor,
      width,
      height,
      onBegin,
      onEnd,
      onClear,
      onSave,
    });

    return (
      <SignaturePadContext.Provider value={signaturePad}>
        <div {...props} ref={ref}>
          {children || (
            <>
              <SignaturePadCanvas />
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <SignaturePadClearButton />
                <SignaturePadUndoButton />
                <SignaturePadSaveButton />
              </div>
            </>
          )}
        </div>
      </SignaturePadContext.Provider>
    );
  }
);

SignaturePadRoot.displayName = 'SignaturePad';

// Canvas component
export interface SignaturePadCanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {}

export const SignaturePadCanvas = forwardRef<HTMLCanvasElement, SignaturePadCanvasProps>(
  (props, ref) => {
    const { getCanvasProps } = useSignaturePadContext();
    const canvasProps = getCanvasProps({ ...props, ref });

    return <canvas {...canvasProps} />;
  }
);

SignaturePadCanvas.displayName = 'SignaturePad.Canvas';

// Clear button component
export interface SignaturePadClearButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignaturePadClearButton = forwardRef<HTMLButtonElement, SignaturePadClearButtonProps>(
  (props, ref) => {
    const { getClearButtonProps } = useSignaturePadContext();
    const clearButtonProps = getClearButtonProps({ ...props, ref });

    return (
      <button {...clearButtonProps}>
        {props.children || 'Clear'}
      </button>
    );
  }
);

SignaturePadClearButton.displayName = 'SignaturePad.ClearButton';

// Undo button component
export interface SignaturePadUndoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SignaturePadUndoButton = forwardRef<HTMLButtonElement, SignaturePadUndoButtonProps>(
  (props, ref) => {
    const { getUndoButtonProps } = useSignaturePadContext();
    const undoButtonProps = getUndoButtonProps({ ...props, ref });

    return (
      <button {...undoButtonProps}>
        {props.children || 'Undo'}
      </button>
    );
  }
);

SignaturePadUndoButton.displayName = 'SignaturePad.UndoButton';

// Save button component
export interface SignaturePadSaveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Type of the image
   */
  type?: string;
  /**
   * Encoder options
   */
  encoderOptions?: number;
}

export const SignaturePadSaveButton = forwardRef<HTMLButtonElement, SignaturePadSaveButtonProps>(
  ({ type, encoderOptions, ...props }, ref) => {
    const { getSaveButtonProps } = useSignaturePadContext();
    const saveButtonProps = getSaveButtonProps({ ...props, ref }, type, encoderOptions);

    return (
      <button {...saveButtonProps}>
        {props.children || 'Save'}
      </button>
    );
  }
);

SignaturePadSaveButton.displayName = 'SignaturePad.SaveButton';

// Color picker component
export interface SignaturePadColorPickerProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SignaturePadColorPicker = forwardRef<HTMLInputElement, SignaturePadColorPickerProps>(
  (props, ref) => {
    const { setColor, color } = useSignaturePadContext();

    return (
      <input
        {...props}
        ref={ref}
        type="color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          props.onChange?.(e);
        }}
      />
    );
  }
);

SignaturePadColorPicker.displayName = 'SignaturePad.ColorPicker';

// Width slider component
export interface SignaturePadWidthSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SignaturePadWidthSlider = forwardRef<HTMLInputElement, SignaturePadWidthSliderProps>(
  (props, ref) => {
    const { setStrokeWidth, strokeWidth, minWidth, maxWidth } = useSignaturePadContext();

    return (
      <input
        {...props}
        ref={ref}
        type="range"
        min={minWidth}
        max={maxWidth}
        step={0.1}
        value={strokeWidth}
        onChange={(e) => {
          setStrokeWidth(parseFloat(e.target.value));
          props.onChange?.(e);
        }}
      />
    );
  }
);

SignaturePadWidthSlider.displayName = 'SignaturePad.WidthSlider';

// Create the SignaturePad component with all its subcomponents
export const SignaturePadHeadless = Object.assign(SignaturePadRoot, {
  Canvas: SignaturePadCanvas,
  ClearButton: SignaturePadClearButton,
  UndoButton: SignaturePadUndoButton,
  SaveButton: SignaturePadSaveButton,
  ColorPicker: SignaturePadColorPicker,
  WidthSlider: SignaturePadWidthSlider,
});

export default SignaturePadHeadless;
