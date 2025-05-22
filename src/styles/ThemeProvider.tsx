import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider, createGlobalStyle, css } from 'styled-components';
import { baseTheme, darkTheme, modernTheme, minimalTheme, ThemeOptions } from './themes';
import { keyframes } from '../animations/motion';

// Available themes
export const themes = {
  base: baseTheme,
  dark: darkTheme,
  modern: modernTheme,
  minimal: minimalTheme,
};

export type ThemeName = keyof typeof themes;
export type Theme = ThemeOptions;

// Theme context
interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Global styles with enhanced animations and transitions
const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  /* Include all keyframe animations */
  ${Object.values(keyframes).join('\n')}
  
  *, *::before, *::after {
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: ${props => props.theme.typography.fontFamily.base};
    font-size: ${props => props.theme.typography.fontSize.md};
    line-height: ${props => props.theme.typography.lineHeight.normal};
    color: ${props => props.theme.colors.text.primary};
    background-color: ${props => props.theme.colors.background.default};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  /* Typography styles */
  h1 {
    ${props => css`
      font-size: ${props.theme.typography.variants.h1.fontSize};
      font-weight: ${props.theme.typography.variants.h1.fontWeight};
      line-height: ${props.theme.typography.variants.h1.lineHeight};
      margin-top: ${props.theme.typography.variants.h1.marginTop};
      margin-bottom: ${props.theme.typography.variants.h1.marginBottom};
    `}
  }
  
  h2 {
    ${props => css`
      font-size: ${props.theme.typography.variants.h2.fontSize};
      font-weight: ${props.theme.typography.variants.h2.fontWeight};
      line-height: ${props.theme.typography.variants.h2.lineHeight};
      margin-top: ${props.theme.typography.variants.h2.marginTop};
      margin-bottom: ${props.theme.typography.variants.h2.marginBottom};
    `}
  }
  
  h3 {
    ${props => css`
      font-size: ${props.theme.typography.variants.h3.fontSize};
      font-weight: ${props.theme.typography.variants.h3.fontWeight};
      line-height: ${props.theme.typography.variants.h3.lineHeight};
      margin-top: ${props.theme.typography.variants.h3.marginTop};
      margin-bottom: ${props.theme.typography.variants.h3.marginBottom};
    `}
  }
  
  h4 {
    ${props => css`
      font-size: ${props.theme.typography.variants.h4.fontSize};
      font-weight: ${props.theme.typography.variants.h4.fontWeight};
      line-height: ${props.theme.typography.variants.h4.lineHeight};
      margin-top: ${props.theme.typography.variants.h4.marginTop};
      margin-bottom: ${props.theme.typography.variants.h4.marginBottom};
    `}
  }
  
  h5 {
    ${props => css`
      font-size: ${props.theme.typography.variants.h5.fontSize};
      font-weight: ${props.theme.typography.variants.h5.fontWeight};
      line-height: ${props.theme.typography.variants.h5.lineHeight};
      margin-top: ${props.theme.typography.variants.h5.marginTop};
      margin-bottom: ${props.theme.typography.variants.h5.marginBottom};
    `}
  }
  
  h6 {
    ${props => css`
      font-size: ${props.theme.typography.variants.h6.fontSize};
      font-weight: ${props.theme.typography.variants.h6.fontWeight};
      line-height: ${props.theme.typography.variants.h6.lineHeight};
      margin-top: ${props.theme.typography.variants.h6.marginTop};
      margin-bottom: ${props.theme.typography.variants.h6.marginBottom};
    `}
  }
  
  p {
    ${props => css`
      font-size: ${props.theme.typography.variants.body1.fontSize};
      font-weight: ${props.theme.typography.variants.body1.fontWeight};
      line-height: ${props.theme.typography.variants.body1.lineHeight};
      margin-top: ${props.theme.spacing[3]};
      margin-bottom: ${props.theme.spacing[3]};
    `}
  }
  
  a {
    color: ${props => props.theme.colors.primary[600]};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${props => props.theme.colors.primary[700]};
      text-decoration: underline;
    }
  }
  
  /* Focus styles for accessibility */
  :focus-visible {
    outline: none;
    box-shadow: ${props => props.theme.shadows.focus};
  }
  
  /* Smooth scrolling */
  html {
    scroll-behavior: smooth;
  }
  
  /* Selection styling */
  ::selection {
    background-color: ${props => props.theme.colors.primary[200]};
    color: ${props => props.theme.colors.primary[900]};
  }
`;

export interface ThemeProviderProps {
  /** The theme to use (defaults to 'base') */
  initialTheme?: ThemeName;
  /** Whether to enable system preference dark mode detection */
  enableSystemPreference?: boolean;
  /** Children to render */
  children: React.ReactNode;
}

/**
 * Enhanced ThemeProvider with support for multiple themes and dark mode
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  initialTheme = 'base',
  enableSystemPreference = true,
  children 
}) => {
  // State for current theme
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);
  
  // Detect system preference for dark mode
  const prefersDarkMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  }, []);
  
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    enableSystemPreference ? prefersDarkMode : themeName === 'dark'
  );
  
  // Set initial theme based on system preference if enabled
  useEffect(() => {
    if (enableSystemPreference && prefersDarkMode) {
      setThemeName('dark');
      setIsDarkMode(true);
    }
  }, [enableSystemPreference, prefersDarkMode]);
  
  // Listen for changes in system preference
  useEffect(() => {
    if (!enableSystemPreference || typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      setThemeName(e.matches ? 'dark' : 'base');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enableSystemPreference]);
  
  // Set theme
  const setTheme = (name: ThemeName) => {
    setThemeName(name);
    setIsDarkMode(themes[name].isDark || false);
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    setThemeName(newIsDarkMode ? 'dark' : 'base');
  };
  
  // Get current theme object
  const currentTheme = themes[themeName];
  
  // Theme context value
  const themeContextValue = {
    theme: currentTheme,
    themeName,
    setTheme,
    isDarkMode,
    toggleDarkMode,
  };
  
  return (
    <ThemeContext.Provider value={themeContextValue}>
      <StyledThemeProvider theme={currentTheme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the theme context
 */
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
