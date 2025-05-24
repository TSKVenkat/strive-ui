import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useColorPickerModal, 
  UseColorPickerModalReturn, 
  ColorPickerModalOptions,
  ColorFormat
} from './useColorPickerModal';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

// Context for the ColorPickerModal component
interface ColorPickerModalContextValue extends UseColorPickerModalReturn {}

const ColorPickerModalContext = createContext<ColorPickerModalContextValue | null>(null);

// Hook to use ColorPickerModal context
export function useColorPickerModalContext() {
  const context = useContext(ColorPickerModalContext);
  if (!context) {
    throw new Error('useColorPickerModalContext must be used within a ColorPickerModalHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends ColorPickerModalOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const colorPickerModalProps = useColorPickerModal(options);
    
    return (
      <ColorPickerModalContext.Provider value={colorPickerModalProps}>
        <div ref={ref}>
          {children}
        </div>
      </ColorPickerModalContext.Provider>
    );
  }
);

Root.displayName = 'ColorPickerModalHeadless.Root';

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
    const { getTriggerProps } = useColorPickerModalContext();
    
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

Trigger.displayName = 'ColorPickerModalHeadless.Trigger';

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
  portalId = 'color-picker-modal-root',
  usePortal = true 
}) => {
  const { isOpen } = useColorPickerModalContext();
  
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

Portal.displayName = 'ColorPickerModalHeadless.Portal';

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
    const { getBackdropProps, isOpen } = useColorPickerModalContext();
    
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

Backdrop.displayName = 'ColorPickerModalHeadless.Backdrop';

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
    const { getContainerProps, isOpen } = useColorPickerModalContext();
    
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

Container.displayName = 'ColorPickerModalHeadless.Container';

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
    const { getContentProps } = useColorPickerModalContext();
    
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

Content.displayName = 'ColorPickerModalHeadless.Content';

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

Header.displayName = 'ColorPickerModalHeadless.Header';

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

Body.displayName = 'ColorPickerModalHeadless.Body';

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

Footer.displayName = 'ColorPickerModalHeadless.Footer';

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
    const { getCloseButtonProps } = useColorPickerModalContext();
    
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

Close.displayName = 'ColorPickerModalHeadless.Close';

// Select component props
export type SelectProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Select component
const Select = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: SelectProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getSelectButtonProps } = useColorPickerModalContext();
    
    const selectProps = getSelectButtonProps();
    
    return (
      <Component 
        {...selectProps} 
        {...props} 
        ref={ref}
      >
        {children || 'Select'}
      </Component>
    );
  }
);

Select.displayName = 'ColorPickerModalHeadless.Select';

// Preview component props
export type PreviewProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Preview component
const Preview = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: PreviewProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getPreviewProps } = useColorPickerModalContext();
    
    const previewProps = getPreviewProps();
    
    return (
      <Component 
        {...previewProps} 
        {...props} 
        ref={ref}
        style={{
          ...previewProps.style,
          ...props.style,
        }}
      >
        {children}
      </Component>
    );
  }
);

Preview.displayName = 'ColorPickerModalHeadless.Preview';

// HueSlider component props
export type HueSliderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the slider
     */
    label?: string;
  }
>;

// HueSlider component
const HueSlider = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Hue', ...props }: HueSliderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getHueSliderProps } = useColorPickerModalContext();
    
    const hueSliderProps = getHueSliderProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...hueSliderProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

HueSlider.displayName = 'ColorPickerModalHeadless.HueSlider';

// SaturationSlider component props
export type SaturationSliderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the slider
     */
    label?: string;
  }
>;

// SaturationSlider component
const SaturationSlider = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Saturation', ...props }: SaturationSliderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getSaturationSliderProps } = useColorPickerModalContext();
    
    const saturationSliderProps = getSaturationSliderProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...saturationSliderProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

SaturationSlider.displayName = 'ColorPickerModalHeadless.SaturationSlider';

// LightnessSlider component props
export type LightnessSliderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the slider
     */
    label?: string;
  }
>;

// LightnessSlider component
const LightnessSlider = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Lightness', ...props }: LightnessSliderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getLightnessSliderProps } = useColorPickerModalContext();
    
    const lightnessSliderProps = getLightnessSliderProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...lightnessSliderProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

LightnessSlider.displayName = 'ColorPickerModalHeadless.LightnessSlider';

// OpacitySlider component props
export type OpacitySliderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the slider
     */
    label?: string;
  }
>;

// OpacitySlider component
const OpacitySlider = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Opacity', ...props }: OpacitySliderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getOpacitySliderProps } = useColorPickerModalContext();
    
    const opacitySliderProps = getOpacitySliderProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...opacitySliderProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

OpacitySlider.displayName = 'ColorPickerModalHeadless.OpacitySlider';

// RedSlider component props
export type RedSliderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the slider
     */
    label?: string;
  }
>;

// RedSlider component
const RedSlider = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Red', ...props }: RedSliderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getRedSliderProps } = useColorPickerModalContext();
    
    const redSliderProps = getRedSliderProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...redSliderProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

RedSlider.displayName = 'ColorPickerModalHeadless.RedSlider';

// GreenSlider component props
export type GreenSliderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the slider
     */
    label?: string;
  }
>;

// GreenSlider component
const GreenSlider = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Green', ...props }: GreenSliderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getGreenSliderProps } = useColorPickerModalContext();
    
    const greenSliderProps = getGreenSliderProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...greenSliderProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

GreenSlider.displayName = 'ColorPickerModalHeadless.GreenSlider';

// BlueSlider component props
export type BlueSliderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the slider
     */
    label?: string;
  }
>;

// BlueSlider component
const BlueSlider = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Blue', ...props }: BlueSliderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getBlueSliderProps } = useColorPickerModalContext();
    
    const blueSliderProps = getBlueSliderProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...blueSliderProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

BlueSlider.displayName = 'ColorPickerModalHeadless.BlueSlider';

// HexInput component props
export type HexInputProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the input
     */
    label?: string;
  }
>;

// HexInput component
const HexInput = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Hex', ...props }: HexInputProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getHexInputProps } = useColorPickerModalContext();
    
    const hexInputProps = getHexInputProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...hexInputProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

HexInput.displayName = 'ColorPickerModalHeadless.HexInput';

// FormatSelector component props
export type FormatSelectorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the selector
     */
    label?: string;
    /**
     * Available formats
     */
    formats?: ColorFormat[];
  }
>;

// FormatSelector component
const FormatSelector = forwardRef(
  <C extends React.ElementType = 'select'>(
    { 
      as, 
      label = 'Format', 
      formats = ['hex', 'rgb', 'rgba', 'hsl', 'hsla'],
      ...props 
    }: FormatSelectorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'select';
    const { format, setFormat } = useColorPickerModalContext();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          value={format}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setFormat(e.target.value as ColorFormat);
          }}
          {...props} 
          ref={ref}
        >
          {formats.map((f) => (
            <option key={f} value={f}>
              {f.toUpperCase()}
            </option>
          ))}
        </Component>
      </div>
    );
  }
);

FormatSelector.displayName = 'ColorPickerModalHeadless.FormatSelector';

// ColorValue component props
export type ColorValueProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the color value
     */
    label?: string;
  }
>;

// ColorValue component
const ColorValue = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, label = 'Value', ...props }: ColorValueProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { formattedColor } = useColorPickerModalContext();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...props} 
          ref={ref}
        >
          {formattedColor}
        </Component>
      </div>
    );
  }
);

ColorValue.displayName = 'ColorPickerModalHeadless.ColorValue';

// Presets component props
export type PresetsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the presets
     */
    label?: string;
    /**
     * Color presets
     */
    presets?: string[];
    /**
     * Component to render for each preset
     */
    renderPreset?: (props: {
      color: string;
      index: number;
      presetProps: ReturnType<UseColorPickerModalReturn['getPresetProps']>;
    }) => React.ReactNode;
  }
>;

// Presets component
const Presets = forwardRef(
  <C extends React.ElementType = 'div'>(
    { 
      as, 
      label = 'Presets', 
      presets = [
        '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00',
        '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff',
        '#ff00ff', '#ff0080', '#ffffff', '#cccccc', '#999999',
        '#666666', '#333333', '#000000'
      ],
      renderPreset,
      ...props 
    }: PresetsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getPresetProps } = useColorPickerModalContext();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...props} 
          ref={ref}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            ...props.style,
          }}
        >
          {presets.map((color, index) => {
            const presetProps = getPresetProps(color);
            
            if (renderPreset) {
              return renderPreset({ color, index, presetProps });
            }
            
            return (
              <div
                key={`${color}-${index}`}
                {...presetProps}
                style={{
                  ...presetProps.style,
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: '1px solid #ccc',
                }}
              />
            );
          })}
        </Component>
      </div>
    );
  }
);

Presets.displayName = 'ColorPickerModalHeadless.Presets';

// Export all components
export const ColorPickerModalHeadless = {
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
  Select,
  Preview,
  HueSlider,
  SaturationSlider,
  LightnessSlider,
  OpacitySlider,
  RedSlider,
  GreenSlider,
  BlueSlider,
  HexInput,
  FormatSelector,
  ColorValue,
  Presets,
  useColorPickerModalContext,
};

export default ColorPickerModalHeadless;
