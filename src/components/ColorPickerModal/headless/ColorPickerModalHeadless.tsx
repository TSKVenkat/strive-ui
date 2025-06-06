import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useColorPickerModal, 
  UseColorPickerModalReturn, 
  ColorPickerModalOptions,
  ColorFormat
} from './useColorPickerModal';
import { PolymorphicComponentPropsWithRef } from '../../../types/polymorphic';

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
const TriggerComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getTriggerProps } = useColorPickerModalContext();
  
  const triggerProps = getTriggerProps();
  
  return (
    <Component 
      {...triggerProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

TriggerComponent.displayName = 'ColorPickerModalHeadless.Trigger';

const Trigger = TriggerComponent as <C extends React.ElementType = 'button'>(
  props: TriggerProps<C>
) => React.ReactElement | null;

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
const BackdropComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getBackdropProps, isOpen } = useColorPickerModalContext();
  
  if (!isOpen) {
    return null;
  }
  
  const backdropProps = getBackdropProps();
  
  return (
    <Component 
      {...backdropProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

BackdropComponent.displayName = 'ColorPickerModalHeadless.Backdrop';

const Backdrop = BackdropComponent as <C extends React.ElementType = 'div'>(
  props: BackdropProps<C>
) => React.ReactElement | null;

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
const ContainerComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getContainerProps, isOpen } = useColorPickerModalContext();
  
  if (!isOpen) {
    return null;
  }
  
  const containerProps = getContainerProps();
  
  return (
    <Component 
      {...containerProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

ContainerComponent.displayName = 'ColorPickerModalHeadless.Container';

const Container = ContainerComponent as <C extends React.ElementType = 'div'>(
  props: ContainerProps<C>
) => React.ReactElement | null;

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
const ContentComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getContentProps } = useColorPickerModalContext();
  
  const contentProps = getContentProps();
  
  return (
    <Component 
      {...contentProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

ContentComponent.displayName = 'ColorPickerModalHeadless.Content';

const Content = ContentComponent as <C extends React.ElementType = 'div'>(
  props: ContentProps<C>
) => React.ReactElement | null;

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
const HeaderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

HeaderComponent.displayName = 'ColorPickerModalHeadless.Header';

const Header = HeaderComponent as <C extends React.ElementType = 'div'>(
  props: HeaderProps<C>
) => React.ReactElement | null;

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
const BodyComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

BodyComponent.displayName = 'ColorPickerModalHeadless.Body';

const Body = BodyComponent as <C extends React.ElementType = 'div'>(
  props: BodyProps<C>
) => React.ReactElement | null;

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
const FooterComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

FooterComponent.displayName = 'ColorPickerModalHeadless.Footer';

const Footer = FooterComponent as <C extends React.ElementType = 'div'>(
  props: FooterProps<C>
) => React.ReactElement | null;

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
const CloseComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getCloseButtonProps } = useColorPickerModalContext();
  
  const closeProps = getCloseButtonProps();
  
  return (
    <Component 
      {...closeProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

CloseComponent.displayName = 'ColorPickerModalHeadless.Close';

const Close = CloseComponent as <C extends React.ElementType = 'button'>(
  props: CloseProps<C>
) => React.ReactElement | null;

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
const SelectComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getSelectButtonProps } = useColorPickerModalContext();
  
  const selectProps = getSelectButtonProps();
  
  return (
    <Component 
      {...selectProps} 
      {...restProps} 
      ref={ref}
    >
      {children || 'Select'}
    </Component>
  );
});

SelectComponent.displayName = 'ColorPickerModalHeadless.Select';

const Select = SelectComponent as <C extends React.ElementType = 'button'>(
  props: SelectProps<C>
) => React.ReactElement | null;

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
const PreviewComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getPreviewProps } = useColorPickerModalContext();
  
  const previewProps = getPreviewProps();
  
  return (
    <Component 
      {...previewProps} 
      {...restProps} 
      ref={ref}
      style={{
        ...previewProps.style,
        ...restProps.style,
      }}
    >
      {children}
    </Component>
  );
});

PreviewComponent.displayName = 'ColorPickerModalHeadless.Preview';

const Preview = PreviewComponent as <C extends React.ElementType = 'div'>(
  props: PreviewProps<C>
) => React.ReactElement | null;

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
const HueSliderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Hue', ...restProps } = props;
  const Component = as || 'input';
  const { getHueSliderProps } = useColorPickerModalContext();
  
  const hueSliderProps = getHueSliderProps();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...hueSliderProps} 
        {...restProps} 
        ref={ref}
      />
    </div>
  );
});

HueSliderComponent.displayName = 'ColorPickerModalHeadless.HueSlider';

const HueSlider = HueSliderComponent as <C extends React.ElementType = 'input'>(
  props: HueSliderProps<C>
) => React.ReactElement | null;

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
const SaturationSliderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Saturation', ...restProps } = props;
  const Component = as || 'input';
  const { getSaturationSliderProps } = useColorPickerModalContext();
  
  const saturationSliderProps = getSaturationSliderProps();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...saturationSliderProps} 
        {...restProps} 
        ref={ref}
      />
    </div>
  );
});

SaturationSliderComponent.displayName = 'ColorPickerModalHeadless.SaturationSlider';

const SaturationSlider = SaturationSliderComponent as <C extends React.ElementType = 'input'>(
  props: SaturationSliderProps<C>
) => React.ReactElement | null;

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
const LightnessSliderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Lightness', ...restProps } = props;
  const Component = as || 'input';
  const { getLightnessSliderProps } = useColorPickerModalContext();
  
  const lightnessSliderProps = getLightnessSliderProps();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...lightnessSliderProps} 
        {...restProps} 
        ref={ref}
      />
    </div>
  );
});

LightnessSliderComponent.displayName = 'ColorPickerModalHeadless.LightnessSlider';

const LightnessSlider = LightnessSliderComponent as <C extends React.ElementType = 'input'>(
  props: LightnessSliderProps<C>
) => React.ReactElement | null;

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
const OpacitySliderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Opacity', ...restProps } = props;
  const Component = as || 'input';
  const { getOpacitySliderProps } = useColorPickerModalContext();
  
  const opacitySliderProps = getOpacitySliderProps();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...opacitySliderProps} 
        {...restProps} 
        ref={ref}
      />
    </div>
  );
});

OpacitySliderComponent.displayName = 'ColorPickerModalHeadless.OpacitySlider';

const OpacitySlider = OpacitySliderComponent as <C extends React.ElementType = 'input'>(
  props: OpacitySliderProps<C>
) => React.ReactElement | null;

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
const RedSliderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Red', ...restProps } = props;
  const Component = as || 'input';
  const { getRedSliderProps } = useColorPickerModalContext();
  
  const redSliderProps = getRedSliderProps();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...redSliderProps} 
        {...restProps} 
        ref={ref}
      />
    </div>
  );
});

RedSliderComponent.displayName = 'ColorPickerModalHeadless.RedSlider';

const RedSlider = RedSliderComponent as <C extends React.ElementType = 'input'>(
  props: RedSliderProps<C>
) => React.ReactElement | null;

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
const GreenSliderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Green', ...restProps } = props;
  const Component = as || 'input';
  const { getGreenSliderProps } = useColorPickerModalContext();
  
  const greenSliderProps = getGreenSliderProps();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...greenSliderProps} 
        {...restProps} 
        ref={ref}
      />
    </div>
  );
});

GreenSliderComponent.displayName = 'ColorPickerModalHeadless.GreenSlider';

const GreenSlider = GreenSliderComponent as <C extends React.ElementType = 'input'>(
  props: GreenSliderProps<C>
) => React.ReactElement | null;

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
const BlueSliderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Blue', ...restProps } = props;
  const Component = as || 'input';
  const { getBlueSliderProps } = useColorPickerModalContext();
  
  const blueSliderProps = getBlueSliderProps();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...blueSliderProps} 
        {...restProps} 
        ref={ref}
      />
    </div>
  );
});

BlueSliderComponent.displayName = 'ColorPickerModalHeadless.BlueSlider';

const BlueSlider = BlueSliderComponent as <C extends React.ElementType = 'input'>(
  props: BlueSliderProps<C>
) => React.ReactElement | null;

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
const HexInputComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Hex', ...restProps } = props;
  const Component = as || 'input';
  const { getHexInputProps } = useColorPickerModalContext();
  
  const hexInputProps = getHexInputProps();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...hexInputProps} 
        {...restProps} 
        ref={ref}
      />
    </div>
  );
});

HexInputComponent.displayName = 'ColorPickerModalHeadless.HexInput';

const HexInput = HexInputComponent as <C extends React.ElementType = 'input'>(
  props: HexInputProps<C>
) => React.ReactElement | null;

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
const FormatSelectorComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Format', formats = ['hex', 'rgb', 'hsl'], ...restProps } = props;
  const Component = as || 'select';
  const { format, setFormat } = useColorPickerModalContext();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        value={format}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setFormat(e.target.value as any);
        }}
        {...restProps} 
        ref={ref}
      >
        {formats.map((format: string) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </Component>
    </div>
  );
});

FormatSelectorComponent.displayName = 'ColorPickerModalHeadless.FormatSelector';

const FormatSelector = FormatSelectorComponent as <C extends React.ElementType = 'select'>(
  props: FormatSelectorProps<C>
) => React.ReactElement | null;

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
const ColorValueComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Color Value', ...restProps } = props;
  const Component = as || 'div';
  const { formattedColor } = useColorPickerModalContext();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...restProps} 
        ref={ref}
      >
        {formattedColor}
      </Component>
    </div>
  );
});

ColorValueComponent.displayName = 'ColorPickerModalHeadless.ColorValue';

const ColorValue = ColorValueComponent as <C extends React.ElementType = 'div'>(
  props: ColorValueProps<C>
) => React.ReactElement | null;

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
const PresetsComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label = 'Presets', presets = [], renderPreset, ...restProps } = props;
  const Component = as || 'div';
  const { getPresetProps } = useColorPickerModalContext();
  
  return (
    <div>
      {label && <label>{label}</label>}
      <Component 
        {...restProps} 
        ref={ref}
      >
        {presets.map((color: string, index: number) => {
          const presetProps = getPresetProps(color);
          
          if (renderPreset) {
            return renderPreset({ color, index, presetProps });
          }
          
          return (
            <button
              key={`${color}-${index}`}
              {...presetProps}
              style={{
                backgroundColor: color,
                width: '20px',
                height: '20px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                margin: '2px',
                cursor: 'pointer',
              }}
              title={color}
            />
          );
        })}
      </Component>
    </div>
  );
});

PresetsComponent.displayName = 'ColorPickerModalHeadless.Presets';

const Presets = PresetsComponent as <C extends React.ElementType = 'div'>(
  props: PresetsProps<C>
) => React.ReactElement | null;

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
