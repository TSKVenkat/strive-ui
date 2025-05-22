/**
 * Base theme definition for StriveUI
 * This serves as the foundation for all other themes
 */
import { colors, typography, spacing, borderRadius, shadows, zIndex, animation } from '../tokens';

export interface ThemeColors {
  // Brand colors
  primary: Record<string, string>;
  secondary?: Record<string, string>;
  tertiary?: Record<string, string>;
  
  // UI colors
  background: {
    default: string;
    paper: string;
    subtle: string;
    inverse: string;
  };
  
  // Text colors
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    inverse: string;
    hint: string;
  };
  
  // Semantic colors
  success: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  warning: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  error: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  info: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  
  // Neutral colors
  neutral: Record<string, string>;
  
  // Additional colors
  divider: string;
  overlay: string;
  focus: string;
  
  // Common colors
  common: {
    white: string;
    black: string;
  };
}

export interface ThemeTypography {
  fontFamily: {
    base: string;
    heading: string;
    mono: string;
  };
  fontWeight: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  fontSize: Record<string, string>;
  lineHeight: Record<string, number>;
  letterSpacing?: Record<string, string>;
  
  // Typography variants
  variants: {
    h1: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
      marginTop?: string;
      marginBottom?: string;
    };
    h2: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
      marginTop?: string;
      marginBottom?: string;
    };
    h3: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
      marginTop?: string;
      marginBottom?: string;
    };
    h4: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
      marginTop?: string;
      marginBottom?: string;
    };
    h5: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
      marginTop?: string;
      marginBottom?: string;
    };
    h6: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
      marginTop?: string;
      marginBottom?: string;
    };
    body1: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    body2: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    subtitle1: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    subtitle2: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    button: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
      textTransform?: string;
    };
    caption: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
    };
    overline: {
      fontSize: string;
      fontWeight: number;
      lineHeight: number;
      letterSpacing?: string;
      textTransform?: string;
    };
  };
}

export interface ThemeSpacing {
  [key: string]: string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  none: string;
  focus: string;
}

export interface ThemeZIndex {
  [key: string | number]: number | string;
}

export interface ThemeAnimation {
  duration: Record<string, string>;
  easing: Record<string, string>;
}

export interface ComponentVariants {
  [component: string]: {
    [variant: string]: Record<string, any>;
  };
}

export interface ThemeOptions {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  zIndex: ThemeZIndex;
  animation: ThemeAnimation;
  isDark?: boolean;
  componentVariants?: ComponentVariants;
}

// Base theme definition
export const baseTheme: ThemeOptions = {
  name: 'base',
  colors: {
    primary: colors.primary,
    background: {
      default: colors.neutral[100],
      paper: colors.white,
      subtle: colors.neutral[200],
      inverse: colors.neutral[800],
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[700],
      disabled: colors.neutral[500],
      inverse: colors.neutral[100],
      hint: colors.neutral[600],
    },
    success: {
      light: '#84E472',
      main: colors.success,
      dark: '#389E0D',
      contrastText: colors.white,
    },
    warning: {
      light: '#FFD666',
      main: colors.warning,
      dark: '#D48806',
      contrastText: colors.neutral[900],
    },
    error: {
      light: '#FF7875',
      main: colors.error,
      dark: '#D32F2F',
      contrastText: colors.white,
    },
    info: {
      light: '#91D5FF',
      main: colors.info,
      dark: '#096DD9',
      contrastText: colors.white,
    },
    neutral: colors.neutral,
    divider: colors.neutral[300],
    overlay: 'rgba(0, 0, 0, 0.5)',
    focus: colors.primary[300],
    common: {
      white: colors.white,
      black: colors.neutral[900],
    },
  },
  typography: {
    fontFamily: typography.fontFamily,
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
        fontSize: typography.fontSize['5xl'],
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.lineHeight.tight,
        marginTop: spacing[6],
        marginBottom: spacing[4],
      },
      h2: {
        fontSize: typography.fontSize['4xl'],
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.tight,
        marginTop: spacing[5],
        marginBottom: spacing[4],
      },
      h3: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.snug,
        marginTop: spacing[4],
        marginBottom: spacing[3],
      },
      h4: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.snug,
        marginTop: spacing[4],
        marginBottom: spacing[2],
      },
      h5: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.normal,
        marginTop: spacing[3],
        marginBottom: spacing[2],
      },
      h6: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        lineHeight: typography.lineHeight.normal,
        marginTop: spacing[3],
        marginBottom: spacing[2],
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
  spacing,
  borderRadius,
  shadows: {
    ...shadows,
    focus: `0 0 0 3px ${colors.primary[300]}`,
  },
  zIndex,
  animation,
  isDark: false,
};

// Helper function to create a theme
export const createTheme = (options: Partial<ThemeOptions>): ThemeOptions => {
  return {
    ...baseTheme,
    ...options,
    colors: {
      ...baseTheme.colors,
      ...options.colors,
    },
    typography: {
      ...baseTheme.typography,
      ...options.typography,
      variants: {
        ...baseTheme.typography.variants,
        ...options.typography?.variants,
      },
    },
    componentVariants: {
      ...baseTheme.componentVariants,
      ...options.componentVariants,
    },
  };
};
