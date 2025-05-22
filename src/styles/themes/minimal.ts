/**
 * Minimal theme for StriveUI
 * A clean, minimalist theme with subtle styling
 */
import { createTheme } from './base';
import { typography } from '../tokens';

export const minimalTheme = createTheme({
  name: 'minimal',
  colors: {
    primary: {
      100: '#F3F8FF',
      200: '#E6F0FF',
      300: '#CCE0FF',
      400: '#99C0FF',
      500: '#66A0FF',
      600: '#3380FF',
      700: '#0066FF',
      800: '#0052CC',
      900: '#003D99',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      subtle: '#FAFAFA',
      inverse: '#111111',
    },
    text: {
      primary: '#111111',
      secondary: '#555555',
      disabled: '#999999',
      inverse: '#FFFFFF',
      hint: '#777777',
    },
    neutral: {
      100: '#FFFFFF',
      200: '#FAFAFA',
      300: '#F0F0F0',
      400: '#E0E0E0',
      500: '#C0C0C0',
      600: '#999999',
      700: '#777777',
      800: '#555555',
      900: '#111111',
    },
    divider: '#EEEEEE',
    // Add missing required properties
    success: {
      light: '#8AE65C',
      main: '#52C41A',
      dark: '#389E0D',
      contrastText: '#FFFFFF',
    },
    warning: {
      light: '#FFE58F',
      main: '#FAAD14',
      dark: '#D48806',
      contrastText: '#111111',
    },
    error: {
      light: '#FFA39E',
      main: '#FF4D4F',
      dark: '#CF1322',
      contrastText: '#FFFFFF',
    },
    info: {
      light: '#A7D1FF',
      main: '#3380FF',
      dark: '#0052CC',
      contrastText: '#FFFFFF',
    },
    overlay: 'rgba(0, 0, 0, 0.3)',
    focus: '#3380FF',
    common: {
      white: '#FFFFFF',
      black: '#111111',
    },
  },
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '3px',
    lg: '4px',
    xl: '6px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.03)',
    md: '0 2px 4px rgba(0, 0, 0, 0.03)',
    lg: '0 3px 6px rgba(0, 0, 0, 0.03)',
    xl: '0 4px 8px rgba(0, 0, 0, 0.03)',
    '2xl': '0 6px 12px rgba(0, 0, 0, 0.03)',
    inner: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)',
    none: 'none',
    focus: '0 0 0 2px rgba(51, 128, 255, 0.2)',
  },
  typography: {
    fontFamily: {
      base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    // Add missing required properties
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    variants: {
      h1: {
        fontSize: typography.fontSize['4xl'],
        fontWeight: 700,
        lineHeight: 1.2,
        marginTop: '1.5rem',
        marginBottom: '1rem',
      },
      h2: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: 600,
        lineHeight: 1.25,
        marginTop: '1.25rem',
        marginBottom: '0.75rem',
      },
      h3: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: 600,
        lineHeight: 1.3,
        marginTop: '1rem',
        marginBottom: '0.75rem',
      },
      h4: {
        fontSize: typography.fontSize.xl,
        fontWeight: 600,
        lineHeight: 1.4,
        marginTop: '1rem',
        marginBottom: '0.5rem',
      },
      h5: {
        fontSize: typography.fontSize.lg,
        fontWeight: 600,
        lineHeight: 1.4,
        marginTop: '0.75rem',
        marginBottom: '0.5rem',
      },
      h6: {
        fontSize: typography.fontSize.md,
        fontWeight: 600,
        lineHeight: 1.5,
        marginTop: '0.75rem',
        marginBottom: '0.5rem',
      },
      body1: {
        fontSize: typography.fontSize.md,
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: typography.fontSize.sm,
        fontWeight: 400,
        lineHeight: 1.5,
      },
      subtitle1: {
        fontSize: typography.fontSize.lg,
        fontWeight: 500,
        lineHeight: 1.4,
      },
      subtitle2: {
        fontSize: typography.fontSize.md,
        fontWeight: 500,
        lineHeight: 1.4,
      },
      button: {
        fontSize: typography.fontSize.sm,
        fontWeight: 500,
        lineHeight: 1.5,
        textTransform: 'none',
      },
      caption: {
        fontSize: typography.fontSize.xs,
        fontWeight: 400,
        lineHeight: 1.5,
      },
      overline: {
        fontSize: typography.fontSize.xs,
        fontWeight: 500,
        lineHeight: 1.5,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      },
    },
  },
  componentVariants: {
    Button: {
      primary: {
        borderRadius: '3px',
        boxShadow: 'none',
        fontWeight: 500,
        transition: 'all 0.15s ease',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
      },
      secondary: {
        borderRadius: '3px',
        boxShadow: 'none',
        border: '1px solid #E0E0E0',
        fontWeight: 500,
        '&:hover': {
          backgroundColor: '#FAFAFA',
        },
      },
    },
    Card: {
      default: {
        borderRadius: '3px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
        border: '1px solid #F0F0F0',
      },
    },
    Input: {
      default: {
        borderRadius: '3px',
        border: '1px solid #E0E0E0',
        '&:focus': {
          borderColor: '#3380FF',
          boxShadow: '0 0 0 2px rgba(51, 128, 255, 0.1)',
        },
      },
    },
  },
});
