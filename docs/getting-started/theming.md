# Theming

StriveUI comes with a powerful theming system that allows you to customize the look and feel of all components to match your brand.

## Default Theme

StriveUI includes a default theme with carefully selected colors, typography, spacing, and other design tokens. This theme is automatically applied when you use the `ThemeProvider`.

```jsx
import { ThemeProvider } from 'strive-ui';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Customizing the Theme

You can customize the theme by passing a theme object to the `ThemeProvider`. Your custom theme will be merged with the default theme.

```jsx
import { ThemeProvider, theme } from 'strive-ui';

// Create a custom theme by extending the default theme
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: {
      ...theme.colors.primary,
      main: '#0066ff', // Change primary color
    },
    secondary: {
      ...theme.colors.secondary,
      main: '#ff6b00', // Change secondary color
    },
  },
  borderRadius: {
    ...theme.borderRadius,
    md: '8px', // Change medium border radius
  },
};

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Theme Structure

The theme object has the following structure:

```typescript
interface Theme {
  colors: {
    primary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    error: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    warning: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    info: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    success: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    neutral: {
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    common: {
      black: string;
      white: string;
    };
    text: {
      primary: string;
      secondary: string;
      disabled: string;
    };
    background: {
      default: string;
      paper: string;
    };
  };
  typography: {
    fontFamily: {
      base: string;
      heading: string;
      monospace: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      none: number;
      tight: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
  };
  spacing: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
    40: string;
    48: string;
    64: string;
    80: string;
    96: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  zIndices: {
    hide: number;
    auto: string;
    base: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    overlay: number;
    modal: number;
    popover: number;
    toast: number;
    tooltip: number;
  };
  transitions: {
    duration: {
      fastest: string;
      fast: string;
      normal: string;
      slow: string;
      slower: string;
    };
    easing: {
      easeInOut: string;
      easeOut: string;
      easeIn: string;
      sharp: string;
    };
  };
}
```

## Using Theme Values in Your Components

You can access theme values in your styled components:

```jsx
import styled from 'styled-components';

const CustomCard = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  box-shadow: ${props => props.theme.shadows.md};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.typography.fontFamily.base};
`;
```

## Dark Mode

You can implement dark mode by creating a dark theme and toggling between themes:

```jsx
import React, { useState } from 'react';
import { ThemeProvider, theme, Button } from 'strive-ui';

// Create a dark theme
const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      disabled: '#6c6c6c',
    },
    // Add other color overrides as needed
  },
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? darkTheme : theme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <div>
        <Button onClick={() => setIsDarkMode(!isDarkMode)}>
          Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
        </Button>
        <YourApp />
      </div>
    </ThemeProvider>
  );
}
```

## Theme Utilities

StriveUI provides utility hooks for accessing the theme:

```jsx
import { useTheme } from 'strive-ui';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ color: theme.colors.primary.main }}>
      This text uses the primary color from the theme
    </div>
  );
}
```
