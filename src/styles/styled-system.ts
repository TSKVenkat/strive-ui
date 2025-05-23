import { css } from 'styled-components';
import { 
  SystemStyleProps, 
  parseResponsiveValue, 
  isResponsiveObject,
  ThemeValue
} from '../types/css-properties';

/**
 * A utility for creating type-safe styled components with access to the theme
 * This implements the "Template Literal Types for CSS-in-JS" strategy
 */

// Convert camelCase to kebab-case for CSS properties
const toKebabCase = (str: string): string => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
};

// Map of style props to CSS properties
const stylePropsMap: Record<keyof SystemStyleProps, string | string[]> = {
  // Layout
  width: 'width',
  height: 'height',
  minWidth: 'min-width',
  maxWidth: 'max-width',
  minHeight: 'min-height',
  maxHeight: 'max-height',
  
  // Spacing
  margin: 'margin',
  marginTop: 'margin-top',
  marginRight: 'margin-right',
  marginBottom: 'margin-bottom',
  marginLeft: 'margin-left',
  marginX: ['margin-left', 'margin-right'],
  marginY: ['margin-top', 'margin-bottom'],
  padding: 'padding',
  paddingTop: 'padding-top',
  paddingRight: 'padding-right',
  paddingBottom: 'padding-bottom',
  paddingLeft: 'padding-left',
  paddingX: ['padding-left', 'padding-right'],
  paddingY: ['padding-top', 'padding-bottom'],
  
  // Typography
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  lineHeight: 'line-height',
  letterSpacing: 'letter-spacing',
  textAlign: 'text-align',
  fontStyle: 'font-style',
  textTransform: 'text-transform',
  textDecoration: 'text-decoration',
  
  // Colors
  color: 'color',
  backgroundColor: 'background-color',
  borderColor: 'border-color',
  
  // Borders
  borderRadius: 'border-radius',
  borderWidth: 'border-width',
  borderTopWidth: 'border-top-width',
  borderRightWidth: 'border-right-width',
  borderBottomWidth: 'border-bottom-width',
  borderLeftWidth: 'border-left-width',
  borderStyle: 'border-style',
  
  // Effects
  boxShadow: 'box-shadow',
  opacity: 'opacity',
  
  // Layout
  display: 'display',
  overflow: 'overflow',
  position: 'position',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
  zIndex: 'z-index',
  
  // Flexbox
  flexDirection: 'flex-direction',
  flexWrap: 'flex-wrap',
  justifyContent: 'justify-content',
  alignItems: 'align-items',
  alignContent: 'align-content',
  alignSelf: 'align-self',
  flex: 'flex',
  flexGrow: 'flex-grow',
  flexShrink: 'flex-shrink',
  flexBasis: 'flex-basis',
  
  // Grid
  gridTemplateColumns: 'grid-template-columns',
  gridTemplateRows: 'grid-template-rows',
  gridColumn: 'grid-column',
  gridRow: 'grid-row',
  gridAutoFlow: 'grid-auto-flow',
  gridAutoColumns: 'grid-auto-columns',
  gridAutoRows: 'grid-auto-rows',
  gridColumnGap: 'grid-column-gap',
  gridRowGap: 'grid-row-gap',
  gridGap: 'grid-gap',
  
  // Other
  cursor: 'cursor',
  visibility: 'visibility',
};

// Get theme value or use raw value
const getThemeValue = (theme: any, scale: string, value: any): any => {
  // If value is a number (except 0) and the scale exists in theme, try to get the value from theme
  if (typeof value === 'string' && theme?.[scale]?.[value]) {
    return theme[scale][value];
  }
  
  // For spacing, handle numeric values
  if (scale === 'spacing' && typeof value === 'number' && value !== 0) {
    return theme?.spacing?.[value] || `${value * 0.25}rem`;
  }
  
  // For spacing scale values
  if (scale === 'spacing' && typeof value === 'string' && !isNaN(Number(value))) {
    const numValue = Number(value);
    return theme?.spacing?.[value] || `${numValue * 0.25}rem`;
  }
  
  // Special case for colors
  if (scale === 'colors' && typeof value === 'string' && !value.includes('#') && !value.includes('rgb') && !value.includes('hsl')) {
    // Handle dot notation for nested color values (e.g., "primary.500")
    if (value.includes('.')) {
      const [colorName, shade] = value.split('.');
      return theme?.colors?.[colorName]?.[shade] || value;
    }
    return theme?.colors?.[value] || value;
  }
  
  return value;
};

// Process a single style prop
const processStyleProp = (prop: keyof SystemStyleProps, value: any, theme: any): string => {
  const cssProperties = stylePropsMap[prop];
  
  // Function to convert a value to CSS
  const convertToCss = (cssProperty: string, val: any): string => {
    // Determine the theme scale based on the property
    let scale = '';
    if (cssProperty.includes('margin') || cssProperty.includes('padding') || 
        cssProperty === 'top' || cssProperty === 'right' || 
        cssProperty === 'bottom' || cssProperty === 'left' ||
        cssProperty === 'width' || cssProperty === 'height' || 
        cssProperty.includes('gap')) {
      scale = 'spacing';
    } else if (cssProperty === 'color' || cssProperty === 'background-color' || cssProperty === 'border-color') {
      scale = 'colors';
    } else if (cssProperty === 'font-size') {
      scale = 'fontSizes';
    } else if (cssProperty === 'font-weight') {
      scale = 'fontWeights';
    } else if (cssProperty === 'line-height') {
      scale = 'lineHeights';
    } else if (cssProperty === 'letter-spacing') {
      scale = 'letterSpacings';
    } else if (cssProperty === 'border-radius') {
      scale = 'borderRadius';
    } else if (cssProperty.includes('border-width')) {
      scale = 'borderWidths';
    } else if (cssProperty === 'box-shadow') {
      scale = 'shadows';
    } else if (cssProperty === 'z-index') {
      scale = 'zIndices';
    }
    
    // Get the value from theme or use raw value
    const themeValue = getThemeValue(theme, scale, val);
    return `${cssProperty}: ${themeValue};`;
  };
  
  // Handle array of CSS properties (like marginX -> margin-left, margin-right)
  if (Array.isArray(cssProperties)) {
    return cssProperties.map(cssProp => convertToCss(cssProp, value)).join('\n');
  }
  
  // Handle single CSS property
  return convertToCss(cssProperties as string, value);
};

// Process responsive values
const processResponsiveValue = (prop: keyof SystemStyleProps, value: any, theme: any): string => {
  if (isResponsiveObject(value)) {
    const result = parseResponsiveValue(value, (val) => {
      return processStyleProp(prop, val, theme);
    });
    
    // Convert to CSS string with media queries
    let cssString = '';
    
    // Base styles (no media query)
    if (result.base) {
      cssString += result.base + '\n';
    }
    
    // Media query styles
    Object.entries(result).forEach(([breakpoint, styles]) => {
      if (breakpoint !== 'base') {
        cssString += `${breakpoint} {\n  ${styles}\n}\n`;
      }
    });
    
    return cssString;
  }
  
  // Non-responsive value
  return processStyleProp(prop, value, theme);
};

// Main styled-system function
export const styledSystem = (props: SystemStyleProps) => {
  return (props: any) => {
    const { theme, ...styleProps } = props;
    
    let cssString = '';
    
    // Process each style prop
    Object.entries(styleProps).forEach(([key, value]) => {
      if (key in stylePropsMap && value !== undefined && value !== null) {
        cssString += processResponsiveValue(key as keyof SystemStyleProps, value, theme) + '\n';
      }
    });
    
    return css`${cssString}`;
  };
};

// Shorthand style props creators
export const space = (props: Pick<SystemStyleProps, 
  'margin' | 'marginTop' | 'marginRight' | 'marginBottom' | 'marginLeft' | 'marginX' | 'marginY' | 
  'padding' | 'paddingTop' | 'paddingRight' | 'paddingBottom' | 'paddingLeft' | 'paddingX' | 'paddingY'
>) => styledSystem(props);

export const layout = (props: Pick<SystemStyleProps,
  'width' | 'height' | 'minWidth' | 'maxWidth' | 'minHeight' | 'maxHeight' | 
  'display' | 'overflow' | 'position' | 'top' | 'right' | 'bottom' | 'left' | 'zIndex'
>) => styledSystem(props);

export const typography = (props: Pick<SystemStyleProps,
  'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing' | 
  'textAlign' | 'fontStyle' | 'textTransform' | 'textDecoration'
>) => styledSystem(props);

export const color = (props: Pick<SystemStyleProps,
  'color' | 'backgroundColor' | 'borderColor' | 'opacity'
>) => styledSystem(props);

export const border = (props: Pick<SystemStyleProps,
  'borderRadius' | 'borderWidth' | 'borderTopWidth' | 'borderRightWidth' | 
  'borderBottomWidth' | 'borderLeftWidth' | 'borderStyle' | 'borderColor'
>) => styledSystem(props);

export const flexbox = (props: Pick<SystemStyleProps,
  'flexDirection' | 'flexWrap' | 'justifyContent' | 'alignItems' | 
  'alignContent' | 'alignSelf' | 'flex' | 'flexGrow' | 'flexShrink' | 'flexBasis'
>) => styledSystem(props);

export const grid = (props: Pick<SystemStyleProps,
  'gridTemplateColumns' | 'gridTemplateRows' | 'gridColumn' | 'gridRow' | 
  'gridAutoFlow' | 'gridAutoColumns' | 'gridAutoRows' | 'gridColumnGap' | 'gridRowGap' | 'gridGap'
>) => styledSystem(props);

// Combine all style props
export const system = styledSystem;
