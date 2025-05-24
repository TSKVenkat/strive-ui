import { useState, useCallback, useRef } from 'react';
import { useModal, ModalOptions } from '../../Modal/headless/useModal';

export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';

export interface ColorValue {
  /**
   * Hex color value (e.g., #FF0000)
   */
  hex: string;
  /**
   * RGB color values
   */
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  /**
   * RGBA color values
   */
  rgba: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  /**
   * HSL color values
   */
  hsl: {
    h: number;
    s: number;
    l: number;
  };
  /**
   * HSLA color values
   */
  hsla: {
    h: number;
    s: number;
    l: number;
    a: number;
  };
}

export interface ColorPickerModalOptions extends ModalOptions {
  /**
   * Initial color value
   */
  defaultColor?: string;
  /**
   * Controlled color value
   */
  color?: string;
  /**
   * Callback when color changes
   */
  onChange?: (color: ColorValue) => void;
  /**
   * Callback when color is selected
   */
  onSelect?: (color: ColorValue) => void;
  /**
   * Color format to display
   */
  format?: ColorFormat;
  /**
   * Whether to show opacity slider
   */
  showOpacity?: boolean;
  /**
   * Whether to show color presets
   */
  showPresets?: boolean;
  /**
   * Color presets
   */
  presets?: string[];
  /**
   * Whether to show RGB sliders
   */
  showRgbSliders?: boolean;
  /**
   * Whether to show HSL sliders
   */
  showHslSliders?: boolean;
  /**
   * Whether to show hex input
   */
  showHexInput?: boolean;
  /**
   * Whether to show RGB inputs
   */
  showRgbInputs?: boolean;
  /**
   * Whether to show HSL inputs
   */
  showHslInputs?: boolean;
  /**
   * Whether to show color preview
   */
  showPreview?: boolean;
  /**
   * Whether to show color picker
   */
  showPicker?: boolean;
  /**
   * Whether to show a close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to show a select button
   */
  showSelectButton?: boolean;
  /**
   * Whether to close the modal when a color is selected
   */
  closeOnSelect?: boolean;
  /**
   * Whether to close the modal when clicking outside
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to close the modal when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Whether to trap focus within the modal
   */
  trapFocus?: boolean;
  /**
   * Whether to prevent scrolling of the body when the modal is open
   */
  preventScroll?: boolean;
  /**
   * Whether to render the modal in a portal
   */
  usePortal?: boolean;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
}

export interface UseColorPickerModalReturn {
  /**
   * Whether the color picker modal is open
   */
  isOpen: boolean;
  /**
   * Open the color picker modal
   */
  open: () => void;
  /**
   * Close the color picker modal
   */
  close: () => void;
  /**
   * Toggle the color picker modal
   */
  toggle: () => void;
  /**
   * Current color value
   */
  colorValue: ColorValue;
  /**
   * Set the color value
   */
  setColorValue: (color: string | ColorValue) => void;
  /**
   * Current color format
   */
  format: ColorFormat;
  /**
   * Set the color format
   */
  setFormat: (format: ColorFormat) => void;
  /**
   * Current color in the specified format
   */
  formattedColor: string;
  /**
   * Select a color
   */
  selectColor: () => void;
  /**
   * Ref for the color picker container
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Get props for the color picker container
   */
  getContainerProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: React.RefObject<HTMLElement>;
  };
  /**
   * Get props for the color picker overlay/backdrop
   */
  getBackdropProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the color picker content
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the color picker trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the color picker close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the color picker select button
   */
  getSelectButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the color picker preview
   */
  getPreviewProps: () => {
    style: React.CSSProperties;
  };
  /**
   * Get props for the color picker hue slider
   */
  getHueSliderProps: () => {
    type: string;
    min: number;
    max: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /**
   * Get props for the color picker saturation slider
   */
  getSaturationSliderProps: () => {
    type: string;
    min: number;
    max: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /**
   * Get props for the color picker lightness slider
   */
  getLightnessSliderProps: () => {
    type: string;
    min: number;
    max: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /**
   * Get props for the color picker opacity slider
   */
  getOpacitySliderProps: () => {
    type: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /**
   * Get props for the color picker red slider
   */
  getRedSliderProps: () => {
    type: string;
    min: number;
    max: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /**
   * Get props for the color picker green slider
   */
  getGreenSliderProps: () => {
    type: string;
    min: number;
    max: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /**
   * Get props for the color picker blue slider
   */
  getBlueSliderProps: () => {
    type: string;
    min: number;
    max: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /**
   * Get props for the color picker hex input
   */
  getHexInputProps: () => {
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  /**
   * Get props for the color picker preset
   */
  getPresetProps: (color: string) => {
    style: React.CSSProperties;
    onClick: () => void;
    'aria-label': string;
  };
}

// Helper functions for color conversion
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle shorthand hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const parseColor = (color: string): ColorValue => {
  let hex = '#000000';
  let rgb = { r: 0, g: 0, b: 0 };
  let rgba = { r: 0, g: 0, b: 0, a: 1 };
  let hsl = { h: 0, s: 0, l: 0 };
  let hsla = { h: 0, s: 0, l: 0, a: 1 };
  
  // Check if color is a hex value
  if (color.startsWith('#')) {
    hex = color;
    rgb = hexToRgb(hex);
    rgba = { ...rgb, a: 1 };
    hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsla = { ...hsl, a: 1 };
  }
  // Check if color is an rgb value
  else if (color.startsWith('rgb')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d*\.?\d+))?\)/);
    
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      const a = match[4] ? parseFloat(match[4]) : 1;
      
      rgb = { r, g, b };
      rgba = { r, g, b, a };
      hex = rgbToHex(r, g, b);
      hsl = rgbToHsl(r, g, b);
      hsla = { ...hsl, a };
    }
  }
  // Check if color is an hsl value
  else if (color.startsWith('hsl')) {
    const match = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*(\d*\.?\d+))?\)/);
    
    if (match) {
      const h = parseInt(match[1]);
      const s = parseInt(match[2]);
      const l = parseInt(match[3]);
      const a = match[4] ? parseFloat(match[4]) : 1;
      
      hsl = { h, s, l };
      hsla = { h, s, l, a };
      rgb = hslToRgb(h, s, l);
      rgba = { ...rgb, a };
      hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    }
  }
  
  return { hex, rgb, rgba, hsl, hsla };
};

const formatColor = (color: ColorValue, format: ColorFormat): string => {
  switch (format) {
    case 'hex':
      return color.hex;
    case 'rgb':
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case 'rgba':
      return `rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${color.rgba.a})`;
    case 'hsl':
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    case 'hsla':
      return `hsla(${color.hsla.h}, ${color.hsla.s}%, ${color.hsla.l}%, ${color.hsla.a})`;
    default:
      return color.hex;
  }
};

/**
 * Hook for creating a color picker modal
 */
export function useColorPickerModal(options: ColorPickerModalOptions = {}): UseColorPickerModalReturn {
  const {
    defaultColor = '#000000',
    color: controlledColor,
    onChange,
    onSelect,
    format: initialFormat = 'hex',
    showOpacity = true,
    showPresets = true,
    presets = [
      '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00',
      '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff',
      '#ff00ff', '#ff0080', '#ffffff', '#cccccc', '#999999',
      '#666666', '#333333', '#000000'
    ],
    showRgbSliders = true,
    showHslSliders = true,
    showHexInput = true,
    showRgbInputs = true,
    showHslInputs = true,
    showPreview = true,
    showPicker = true,
    showCloseButton = true,
    showSelectButton = true,
    closeOnSelect = true,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    trapFocus = true,
    preventScroll = true,
    usePortal = true,
    portalId = 'color-picker-modal-root',
    ...modalOptions
  } = options;

  // Use modal hook for basic functionality
  const modalProps = useModal({
    ...modalOptions,
    closeOnOutsideClick,
    closeOnEscape,
    trapFocus,
    preventScroll,
    usePortal,
    portalId,
  });
  
  // State for color and format
  const isControlled = controlledColor !== undefined;
  const [internalColorValue, setInternalColorValue] = useState<ColorValue>(
    parseColor(defaultColor)
  );
  const colorValue = isControlled ? parseColor(controlledColor!) : internalColorValue;
  
  const [format, setFormat] = useState<ColorFormat>(initialFormat);
  
  // Ref for container
  const containerRef = useRef<HTMLElement>(null);
  
  // Set color value
  const setColorValue = useCallback((color: string | ColorValue) => {
    const newColorValue = typeof color === 'string' ? parseColor(color) : color;
    
    if (!isControlled) {
      setInternalColorValue(newColorValue);
    }
    
    onChange?.(newColorValue);
  }, [isControlled, onChange]);
  
  // Select color
  const selectColor = useCallback(() => {
    onSelect?.(colorValue);
    
    if (closeOnSelect) {
      modalProps.close();
    }
  }, [colorValue, onSelect, closeOnSelect, modalProps]);
  
  // Get formatted color
  const formattedColor = formatColor(colorValue, format);
  
  // Get container props
  const getContainerProps = useCallback(() => {
    return {
      ...modalProps.getContainerProps(),
      ref: containerRef,
    };
  }, [modalProps]);
  
  // Get backdrop props
  const getBackdropProps = useCallback(() => {
    return modalProps.getOverlayProps();
  }, [modalProps]);
  
  // Get content props
  const getContentProps = useCallback(() => {
    return {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
      },
    };
  }, []);
  
  // Get trigger props
  const getTriggerProps = useCallback(() => {
    return modalProps.getTriggerProps();
  }, [modalProps]);
  
  // Get close button props
  const getCloseButtonProps = useCallback(() => {
    return modalProps.getCloseButtonProps();
  }, [modalProps]);
  
  // Get select button props
  const getSelectButtonProps = useCallback(() => {
    return {
      onClick: selectColor,
      'aria-label': 'Select color',
    };
  }, [selectColor]);
  
  // Get preview props
  const getPreviewProps = useCallback(() => {
    return {
      style: {
        backgroundColor: formattedColor,
      },
    };
  }, [formattedColor]);
  
  // Get hue slider props
  const getHueSliderProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: 360,
      value: colorValue.hsl.h,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const h = parseInt(e.target.value);
        const rgb = hslToRgb(h, colorValue.hsl.s, colorValue.hsl.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        
        setColorValue({
          hex,
          rgb,
          rgba: { ...rgb, a: colorValue.rgba.a },
          hsl: { h, s: colorValue.hsl.s, l: colorValue.hsl.l },
          hsla: { h, s: colorValue.hsl.s, l: colorValue.hsl.l, a: colorValue.hsla.a },
        });
      },
    };
  }, [colorValue, setColorValue]);
  
  // Get saturation slider props
  const getSaturationSliderProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: 100,
      value: colorValue.hsl.s,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const s = parseInt(e.target.value);
        const rgb = hslToRgb(colorValue.hsl.h, s, colorValue.hsl.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        
        setColorValue({
          hex,
          rgb,
          rgba: { ...rgb, a: colorValue.rgba.a },
          hsl: { h: colorValue.hsl.h, s, l: colorValue.hsl.l },
          hsla: { h: colorValue.hsl.h, s, l: colorValue.hsl.l, a: colorValue.hsla.a },
        });
      },
    };
  }, [colorValue, setColorValue]);
  
  // Get lightness slider props
  const getLightnessSliderProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: 100,
      value: colorValue.hsl.l,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const l = parseInt(e.target.value);
        const rgb = hslToRgb(colorValue.hsl.h, colorValue.hsl.s, l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        
        setColorValue({
          hex,
          rgb,
          rgba: { ...rgb, a: colorValue.rgba.a },
          hsl: { h: colorValue.hsl.h, s: colorValue.hsl.s, l },
          hsla: { h: colorValue.hsl.h, s: colorValue.hsl.s, l, a: colorValue.hsla.a },
        });
      },
    };
  }, [colorValue, setColorValue]);
  
  // Get opacity slider props
  const getOpacitySliderProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
      value: colorValue.rgba.a,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const a = parseFloat(e.target.value);
        
        setColorValue({
          ...colorValue,
          rgba: { ...colorValue.rgb, a },
          hsla: { ...colorValue.hsl, a },
        });
      },
    };
  }, [colorValue, setColorValue]);
  
  // Get red slider props
  const getRedSliderProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: 255,
      value: colorValue.rgb.r,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const r = parseInt(e.target.value);
        const hex = rgbToHex(r, colorValue.rgb.g, colorValue.rgb.b);
        const hsl = rgbToHsl(r, colorValue.rgb.g, colorValue.rgb.b);
        
        setColorValue({
          hex,
          rgb: { r, g: colorValue.rgb.g, b: colorValue.rgb.b },
          rgba: { r, g: colorValue.rgb.g, b: colorValue.rgb.b, a: colorValue.rgba.a },
          hsl,
          hsla: { ...hsl, a: colorValue.hsla.a },
        });
      },
    };
  }, [colorValue, setColorValue]);
  
  // Get green slider props
  const getGreenSliderProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: 255,
      value: colorValue.rgb.g,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const g = parseInt(e.target.value);
        const hex = rgbToHex(colorValue.rgb.r, g, colorValue.rgb.b);
        const hsl = rgbToHsl(colorValue.rgb.r, g, colorValue.rgb.b);
        
        setColorValue({
          hex,
          rgb: { r: colorValue.rgb.r, g, b: colorValue.rgb.b },
          rgba: { r: colorValue.rgb.r, g, b: colorValue.rgb.b, a: colorValue.rgba.a },
          hsl,
          hsla: { ...hsl, a: colorValue.hsla.a },
        });
      },
    };
  }, [colorValue, setColorValue]);
  
  // Get blue slider props
  const getBlueSliderProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: 255,
      value: colorValue.rgb.b,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const b = parseInt(e.target.value);
        const hex = rgbToHex(colorValue.rgb.r, colorValue.rgb.g, b);
        const hsl = rgbToHsl(colorValue.rgb.r, colorValue.rgb.g, b);
        
        setColorValue({
          hex,
          rgb: { r: colorValue.rgb.r, g: colorValue.rgb.g, b },
          rgba: { r: colorValue.rgb.r, g: colorValue.rgb.g, b, a: colorValue.rgba.a },
          hsl,
          hsla: { ...hsl, a: colorValue.hsla.a },
        });
      },
    };
  }, [colorValue, setColorValue]);
  
  // Get hex input props
  const getHexInputProps = useCallback(() => {
    return {
      type: 'text',
      value: colorValue.hex,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const hex = e.target.value;
        
        // Only update if valid hex
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
          setColorValue(hex);
        }
      },
    };
  }, [colorValue, setColorValue]);
  
  // Get preset props
  const getPresetProps = useCallback((color: string) => {
    return {
      style: {
        backgroundColor: color,
      },
      onClick: () => {
        setColorValue(color);
      },
      'aria-label': `Select color ${color}`,
    };
  }, [setColorValue]);

  return {
    isOpen: modalProps.isOpen,
    open: modalProps.open,
    close: modalProps.close,
    toggle: modalProps.toggle,
    colorValue,
    setColorValue,
    format,
    setFormat,
    formattedColor,
    selectColor,
    containerRef,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
    getSelectButtonProps,
    getPreviewProps,
    getHueSliderProps,
    getSaturationSliderProps,
    getLightnessSliderProps,
    getOpacitySliderProps,
    getRedSliderProps,
    getGreenSliderProps,
    getBlueSliderProps,
    getHexInputProps,
    getPresetProps,
  };
}

export default useColorPickerModal;
