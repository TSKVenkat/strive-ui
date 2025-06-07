/**
 * Modern theme for Pulse UI
 * A sleek, contemporary theme with rounded corners and subtle shadows
 */
import { createTheme } from './base';
import { typography } from '../tokens';

export const modernTheme = createTheme({
  name: 'modern',
  colors: {
    primary: {
      100: '#E6F7FF',
      200: '#BAE7FF',
      300: '#91D5FF',
      400: '#69C0FF',
      500: '#40A9FF',
      600: '#1890FF',
      700: '#096DD9',
      800: '#0050B3',
      900: '#003A8C',
    },
    secondary: {
      100: '#F0F5FF',
      200: '#D6E4FF',
      300: '#ADC6FF',
      400: '#85A5FF',
      500: '#597EF7',
      600: '#2F54EB',
      700: '#1D39C4',
      800: '#10239E',
      900: '#061178',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
      subtle: '#F5F5F5',
      inverse: '#141414',
    },
    text: {
      primary: '#262626',
      secondary: '#595959',
      disabled: '#BFBFBF',
      inverse: '#FFFFFF',
      hint: '#8C8C8C',
    },
    // Add missing required properties
    success: {
      light: '#95DE64',
      main: '#52C41A',
      dark: '#389E0D',
      contrastText: '#FFFFFF',
    },
    warning: {
      light: '#FFD666',
      main: '#FAAD14',
      dark: '#D48806',
      contrastText: '#262626',
    },
    error: {
      light: '#FF7875',
      main: '#FF4D4F',
      dark: '#D9363E',
      contrastText: '#FFFFFF',
    },
    info: {
      light: '#91D5FF',
      main: '#1890FF',
      dark: '#096DD9',
      contrastText: '#FFFFFF',
    },
    neutral: {
      100: '#FFFFFF',
      200: '#F5F5F5',
      300: '#E8E8E8',
      400: '#D9D9D9',
      500: '#BFBFBF',
      600: '#8C8C8C',
      700: '#595959',
      800: '#262626',
      900: '#000000',
    },
    divider: '#E8E8E8',
    overlay: 'rgba(0, 0, 0, 0.45)',
    focus: '#1890FF',
    common: {
      white: '#FFFFFF',
      black: '#000000',
    },
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',  // 4px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.03)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.05), 0 10px 10px rgba(0, 0, 0, 0.03)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.03)',
    none: 'none',
    focus: '0 0 0 3px rgba(24, 144, 255, 0.3)',
  },
  typography: {
    fontFamily: {
      base: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
    },
    // Add missing required properties
    fontWeight: typography.fontWeight,
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
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
        marginTop: '1.5rem',
        marginBottom: '1rem',
      },
      h2: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.tight,
        marginTop: '1.25rem',
        marginBottom: '0.75rem',
      },
      h3: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.snug,
        marginTop: '1rem',
        marginBottom: '0.75rem',
      },
      h4: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.snug,
        marginTop: '1rem',
        marginBottom: '0.5rem',
      },
      h5: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.normal,
        marginTop: '0.75rem',
        marginBottom: '0.5rem',
      },
      h6: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.normal,
        marginTop: '0.75rem',
        marginBottom: '0.5rem',
      },
      body1: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.lineHeight.normal,
      },
      body2: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.lineHeight.normal,
      },
      subtitle1: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.lineHeight.normal,
      },
      subtitle2: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.lineHeight.normal,
      },
      button: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.lineHeight.normal,
        textTransform: 'none',
      },
      caption: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.regular,
        lineHeight: typography.lineHeight.normal,
      },
      overline: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        lineHeight: typography.lineHeight.normal,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
    },
  },
  componentVariants: {
    Button: {
      primary: {
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(24, 144, 255, 0.3)',
        },
      },
      secondary: {
        borderRadius: '0.5rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    Card: {
      default: {
        borderRadius: '0.75rem',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    Input: {
      default: {
        borderRadius: '0.5rem',
        transition: 'all 0.2s ease',
        '&:focus': {
          boxShadow: '0 0 0 3px rgba(24, 144, 255, 0.2)',
        },
      },
    },
  },
});
