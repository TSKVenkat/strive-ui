/**
 * Dark theme for Pulse UI
 */
import { createTheme } from './base';
import { colors } from '../tokens';

export const darkTheme = createTheme({
  name: 'dark',
  isDark: true,
  colors: {
    primary: {
      100: '#1A365D',
      200: '#2A4365',
      300: '#2C5282',
      400: '#2B6CB0',
      500: '#3182CE',
      600: '#4299E1',
      700: '#63B3ED',
      800: '#90CDF4',
      900: '#BEE3F8',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
      subtle: '#2C2C2C',
      inverse: '#F5F5F5',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#A0AEC0',
      disabled: '#718096',
      inverse: '#1A202C',
      hint: '#CBD5E0',
    },
    success: {
      light: '#48BB78',
      main: '#38A169',
      dark: '#2F855A',
      contrastText: '#FFFFFF',
    },
    warning: {
      light: '#F6AD55',
      main: '#ED8936',
      dark: '#DD6B20',
      contrastText: '#1A202C',
    },
    error: {
      light: '#FC8181',
      main: '#F56565',
      dark: '#E53E3E',
      contrastText: '#FFFFFF',
    },
    info: {
      light: '#63B3ED',
      main: '#4299E1',
      dark: '#3182CE',
      contrastText: '#FFFFFF',
    },
    neutral: {
      100: '#1A202C',
      200: '#2D3748',
      300: '#4A5568',
      400: '#718096',
      500: '#A0AEC0',
      600: '#CBD5E0',
      700: '#E2E8F0',
      800: '#EDF2F7',
      900: '#F7FAFC',
    },
    divider: '#2D3748',
    overlay: 'rgba(0, 0, 0, 0.7)',
    focus: '#4299E1',
    common: {
      white: '#FFFFFF',
      black: '#000000',
    },
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px rgba(0, 0, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.4)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.5), 0 4px 6px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.5), 0 10px 10px rgba(0, 0, 0, 0.4)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.6)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',
    none: 'none',
    focus: '0 0 0 3px rgba(66, 153, 225, 0.5)',
  },
  // You can override component variants for dark theme
  componentVariants: {
    Button: {
      primary: {
        backgroundColor: '#4299E1',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#3182CE',
        },
      },
      secondary: {
        backgroundColor: '#2D3748',
        color: '#FFFFFF',
        border: '1px solid #4A5568',
        '&:hover': {
          backgroundColor: '#4A5568',
        },
      },
    },
    Card: {
      default: {
        backgroundColor: '#1E1E1E',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.5)',
      },
    },
    Input: {
      default: {
        backgroundColor: '#2C2C2C',
        color: '#F5F5F5',
        border: '1px solid #4A5568',
        '&:focus': {
          borderColor: '#4299E1',
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.3)',
        },
      },
    },
  },
});
