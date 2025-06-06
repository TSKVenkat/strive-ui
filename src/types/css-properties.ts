/**
 * Advanced TypeScript type utilities for CSS-in-JS
 * These utilities provide type-safe access to design system values
 */

// Basic CSS property types
export type CSSLength = `${number}px` | `${number}rem` | `${number}em` | `${number}%` | `${number}vh` | `${number}vw` | 0;
export type CSSColor = `#${string}` | `rgb(${number}, ${number}, ${number})` | `rgba(${number}, ${number}, ${number}, ${number})` | `hsl(${number}, ${number}%, ${number}%)` | `hsla(${number}, ${number}%, ${number}%, ${number})`;

// Design system spacing scale
export type SpacingScale = 
  | '0'    // 0px
  | 'px'   // 1px
  | '0.5'  // 0.125rem (2px)
  | '1'    // 0.25rem (4px)
  | '1.5'  // 0.375rem (6px)
  | '2'    // 0.5rem (8px)
  | '2.5'  // 0.625rem (10px)
  | '3'    // 0.75rem (12px)
  | '3.5'  // 0.875rem (14px)
  | '4'    // 1rem (16px)
  | '5'    // 1.25rem (20px)
  | '6'    // 1.5rem (24px)
  | '7'    // 1.75rem (28px)
  | '8'    // 2rem (32px)
  | '9'    // 2.25rem (36px)
  | '10'   // 2.5rem (40px)
  | '11'   // 2.75rem (44px)
  | '12'   // 3rem (48px)
  | '14'   // 3.5rem (56px)
  | '16'   // 4rem (64px)
  | '20'   // 5rem (80px)
  | '24'   // 6rem (96px)
  | '28'   // 7rem (112px)
  | '32'   // 8rem (128px)
  | '36'   // 9rem (144px)
  | '40'   // 10rem (160px)
  | '44'   // 11rem (176px)
  | '48'   // 12rem (192px)
  | '52'   // 13rem (208px)
  | '56'   // 14rem (224px)
  | '60'   // 15rem (240px)
  | '64'   // 16rem (256px)
  | '72'   // 18rem (288px)
  | '80'   // 20rem (320px)
  | '96';  // 24rem (384px)

// Design system spacing with auto option
export type Spacing = SpacingScale | 'auto';

// Design system font size scale
export type FontSizeScale = 
  | 'xs'   // 0.75rem (12px)
  | 'sm'   // 0.875rem (14px)
  | 'base' // 1rem (16px)
  | 'md'   // 1rem (16px) - alias for base
  | 'lg'   // 1.125rem (18px)
  | 'xl'   // 1.25rem (20px)
  | '2xl'  // 1.5rem (24px)
  | '3xl'  // 1.875rem (30px)
  | '4xl'  // 2.25rem (36px)
  | '5xl'  // 3rem (48px)
  | '6xl'  // 3.75rem (60px)
  | '7xl'  // 4.5rem (72px)
  | '8xl'  // 6rem (96px)
  | '9xl'; // 8rem (128px)

// Design system font weight scale
export type FontWeightScale = 
  | 'thin'       // 100
  | 'extralight' // 200
  | 'light'      // 300
  | 'normal'     // 400
  | 'medium'     // 500
  | 'semibold'   // 600
  | 'bold'       // 700
  | 'extrabold'  // 800
  | 'black';     // 900

// Design system line height scale
export type LineHeightScale = 
  | 'none'     // 1
  | 'tight'    // 1.25
  | 'snug'     // 1.375
  | 'normal'   // 1.5
  | 'relaxed'  // 1.625
  | 'loose';   // 2

// Design system border radius scale
export type BorderRadiusScale = 
  | 'none'  // 0px
  | 'sm'    // 0.125rem (2px)
  | 'md'    // 0.375rem (6px)
  | 'lg'    // 0.5rem (8px)
  | 'xl'    // 0.75rem (12px)
  | '2xl'   // 1rem (16px)
  | '3xl'   // 1.5rem (24px)
  | 'full'; // 9999px

// Design system border width scale
export type BorderWidthScale = 
  | '0'     // 0px
  | '1'     // 1px
  | '2'     // 2px
  | '4'     // 4px
  | '8';    // 8px

// Design system shadow scale
export type ShadowScale = 
  | 'none'  // none
  | 'sm'    // 0 1px 2px 0 rgba(0, 0, 0, 0.05)
  | 'md'    // 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
  | 'lg'    // 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
  | 'xl'    // 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
  | '2xl'   // 0 25px 50px -12px rgba(0, 0, 0, 0.25)
  | 'inner' // inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)
  | 'none'; // none

// Design system z-index scale
export type ZIndexScale = 
  | '0'        // 0
  | '10'       // 10
  | '20'       // 20
  | '30'       // 30
  | '40'       // 40
  | '50'       // 50
  | 'auto';    // auto

// Design system opacity scale
export type OpacityScale = 
  | '0'    // 0
  | '5'    // 0.05
  | '10'   // 0.1
  | '20'   // 0.2
  | '25'   // 0.25
  | '30'   // 0.3
  | '40'   // 0.4
  | '50'   // 0.5
  | '60'   // 0.6
  | '70'   // 0.7
  | '75'   // 0.75
  | '80'   // 0.8
  | '90'   // 0.9
  | '95'   // 0.95
  | '100';  // 1

// Design system breakpoints
export type Breakpoint = 
  | 'base'  // Default (mobile first)
  | 'sm'    // 640px
  | 'md'    // 768px
  | 'lg'    // 1024px
  | 'xl'    // 1280px
  | '2xl';  // 1536px

// Responsive value type
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// CSS property types with design system values
export type SystemSpacing = Spacing | CSSLength;
export type SystemColor = CSSColor | string; // Allow theme color keys
export type SystemFontSize = FontSizeScale | CSSLength;
export type SystemFontWeight = FontWeightScale | number;
export type SystemLineHeight = LineHeightScale | number | CSSLength;
export type SystemBorderRadius = BorderRadiusScale | CSSLength;
export type SystemBorderWidth = BorderWidthScale | CSSLength;
export type SystemShadow = ShadowScale | string;
export type SystemZIndex = ZIndexScale | number;
export type SystemOpacity = OpacityScale | number;

// Responsive property types
export type ResponsiveSpacing = ResponsiveValue<SystemSpacing>;
export type ResponsiveColor = ResponsiveValue<SystemColor>;
export type ResponsiveFontSize = ResponsiveValue<SystemFontSize>;
export type ResponsiveFontWeight = ResponsiveValue<SystemFontWeight>;
export type ResponsiveLineHeight = ResponsiveValue<SystemLineHeight>;
export type ResponsiveBorderRadius = ResponsiveValue<SystemBorderRadius>;
export type ResponsiveBorderWidth = ResponsiveValue<SystemBorderWidth>;
export type ResponsiveShadow = ResponsiveValue<SystemShadow>;
export type ResponsiveZIndex = ResponsiveValue<SystemZIndex>;
export type ResponsiveOpacity = ResponsiveValue<SystemOpacity>;

// CSS property map for style props
export interface SystemStyleProps {
  // Layout
  width?: ResponsiveValue<SystemSpacing | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit'>;
  height?: ResponsiveValue<SystemSpacing | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit'>;
  minWidth?: ResponsiveValue<SystemSpacing | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit'>;
  maxWidth?: ResponsiveValue<SystemSpacing | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit'>;
  minHeight?: ResponsiveValue<SystemSpacing | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit'>;
  maxHeight?: ResponsiveValue<SystemSpacing | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit'>;
  
  // Spacing
  margin?: ResponsiveSpacing;
  marginTop?: ResponsiveSpacing;
  marginRight?: ResponsiveSpacing;
  marginBottom?: ResponsiveSpacing;
  marginLeft?: ResponsiveSpacing;
  marginX?: ResponsiveSpacing;
  marginY?: ResponsiveSpacing;
  padding?: ResponsiveSpacing;
  paddingTop?: ResponsiveSpacing;
  paddingRight?: ResponsiveSpacing;
  paddingBottom?: ResponsiveSpacing;
  paddingLeft?: ResponsiveSpacing;
  paddingX?: ResponsiveSpacing;
  paddingY?: ResponsiveSpacing;
  
  // Typography
  fontSize?: ResponsiveFontSize;
  fontWeight?: ResponsiveFontWeight;
  lineHeight?: ResponsiveLineHeight;
  letterSpacing?: ResponsiveValue<'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest' | CSSLength>;
  textAlign?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;
  fontStyle?: ResponsiveValue<'normal' | 'italic'>;
  textTransform?: ResponsiveValue<'uppercase' | 'lowercase' | 'capitalize' | 'none'>;
  textDecoration?: ResponsiveValue<'underline' | 'line-through' | 'none'>;
  
  // Colors
  color?: ResponsiveColor;
  backgroundColor?: ResponsiveColor;
  borderColor?: ResponsiveColor;
  
  // Borders
  border?: ResponsiveValue<string>;
  borderRadius?: ResponsiveBorderRadius;
  borderWidth?: ResponsiveBorderWidth;
  borderTopWidth?: ResponsiveBorderWidth;
  borderRightWidth?: ResponsiveBorderWidth;
  borderBottomWidth?: ResponsiveBorderWidth;
  borderLeftWidth?: ResponsiveBorderWidth;
  borderStyle?: ResponsiveValue<'solid' | 'dashed' | 'dotted' | 'double' | 'none'>;
  
  // Effects
  boxShadow?: ResponsiveShadow;
  opacity?: ResponsiveOpacity;
  
  // Layout
  display?: ResponsiveValue<'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none'>;
  overflow?: ResponsiveValue<'auto' | 'hidden' | 'visible' | 'scroll'>;
  position?: ResponsiveValue<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>;
  top?: ResponsiveSpacing;
  right?: ResponsiveSpacing;
  bottom?: ResponsiveSpacing;
  left?: ResponsiveSpacing;
  zIndex?: ResponsiveZIndex;
  
  // Flexbox
  flexDirection?: ResponsiveValue<'row' | 'row-reverse' | 'column' | 'column-reverse'>;
  flexWrap?: ResponsiveValue<'nowrap' | 'wrap' | 'wrap-reverse'>;
  justifyContent?: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'>;
  alignItems?: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'>;
  alignContent?: ResponsiveValue<'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch'>;
  alignSelf?: ResponsiveValue<'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'>;
  flex?: ResponsiveValue<'1' | 'auto' | 'initial' | 'none' | string>;
  flexGrow?: ResponsiveValue<'0' | '1' | number>;
  flexShrink?: ResponsiveValue<'0' | '1' | number>;
  flexBasis?: ResponsiveValue<SystemSpacing | 'auto'>;
  
  // Grid
  gridTemplateColumns?: ResponsiveValue<string>;
  gridTemplateRows?: ResponsiveValue<string>;
  gridColumn?: ResponsiveValue<string>;
  gridRow?: ResponsiveValue<string>;
  gridAutoFlow?: ResponsiveValue<'row' | 'column' | 'row dense' | 'column dense'>;
  gridAutoColumns?: ResponsiveValue<string>;
  gridAutoRows?: ResponsiveValue<string>;
  gridColumnGap?: ResponsiveSpacing;
  gridRowGap?: ResponsiveSpacing;
  gridGap?: ResponsiveSpacing;
  gap?: ResponsiveSpacing;
  
  // Other
  cursor?: ResponsiveValue<'auto' | 'default' | 'pointer' | 'wait' | 'text' | 'move' | 'not-allowed'>;
  visibility?: ResponsiveValue<'visible' | 'hidden' | 'collapse'>;
  outline?: ResponsiveValue<string>;

  // Pseudo-class states
  _hover?: Partial<SystemStyleProps>;
  _focus?: Partial<SystemStyleProps>;
  _active?: Partial<SystemStyleProps>;
  _disabled?: Partial<SystemStyleProps>;
}

// Helper type for creating style props with theme values
export type ThemeValue<T> = T | string;

// Helper function to check if a value is a responsive object
export const isResponsiveObject = <T>(value: ResponsiveValue<T>): value is Partial<Record<Breakpoint, T>> => {
  if (!value || typeof value !== 'object') return false;
  return Object.keys(value).some(key => ['base', 'sm', 'md', 'lg', 'xl', '2xl'].includes(key));
};

// Helper function to parse responsive values
export const parseResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  callback: (val: T) => string
): Record<string, string> => {
  if (!value) return {};
  
  if (isResponsiveObject(value)) {
    const result: Record<string, string> = {};
    
    // Base style (no media query)
    if (value.base) {
      result.base = callback(value.base);
    }
    
    // Breakpoint styles
    const breakpoints: Record<Breakpoint, string> = {
      base: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    };
    
    Object.entries(value).forEach(([key, val]) => {
      if (key !== 'base' && key in breakpoints) {
        const breakpoint = key as Breakpoint;
        result[`@media (min-width: ${breakpoints[breakpoint]})`] = callback(val as T);
      }
    });
    
    return result;
  }
  
  // Non-responsive value
  return { base: callback(value) };
};
