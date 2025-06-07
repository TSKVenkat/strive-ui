# Theming

## Overview

Pulse UI provides a flexible theming system that works with its headless architecture, allowing complete customization of component styling while maintaining consistent design tokens.

## Default Theme

The default theme includes a comprehensive set of design tokens for colors, typography, spacing, and more. It's automatically applied when using the `ThemeProvider`:

```jsx
import { ThemeProvider } from '@pulse-ui/core';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Custom Theming

Create a custom theme by extending the default theme:

```jsx
import { ThemeProvider, theme } from '@strive-ui/core';

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: {
      ...theme.colors.primary,
      main: '#0066ff',
    },
    secondary: {
      ...theme.colors.secondary,
      main: '#ff6b00',
    },
  },
  borderRadius: {
    ...theme.borderRadius,
    md: '8px',
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

The theme object is organized into logical categories for easy customization:

```typescript
interface Theme {
  colors: {                // Color tokens
    primary: ColorScale;   // Brand primary color
    secondary: ColorScale; // Brand secondary color
    error: ColorScale;     // Error states
    warning: ColorScale;   // Warning states
    info: ColorScale;      // Informational states
    success: ColorScale;   // Success states
    neutral: NeutralScale; // Grayscale palette
    text: TextColors;      // Text colors
    background: BgColors;  // Background colors
    // ... other color tokens
  };
  typography: {            // Typography system
    fontFamily: FontFamilies;
    fontSize: FontSizes;
    fontWeight: FontWeights;
    lineHeight: LineHeights;
  };
  spacing: SpacingScale;   // Spacing system
  borderRadius: RadiusScale; // Border radius tokens
  shadows: ShadowScale;    // Elevation/shadow tokens
  zIndices: ZIndexScale;   // z-index tokens
  transitions: {           // Animation tokens
    duration: TransitionDurations;
    easing: TransitionEasings;
  };
}
```

## Using Theme in Styled Components

Access theme values in your styled components:

```jsx
import styled from 'styled-components';

const Card = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing[4]};
  box-shadow: ${props => props.theme.shadows.md};
  color: ${props => props.theme.colors.text.primary};
  font-family: ${props => props.theme.typography.fontFamily.base};
`;
```

## Dark Mode Implementation

Implement dark mode with a theme toggle:

```jsx
import React, { useState } from 'react';
import { ThemeProvider, theme, Button } from '@strive-ui/core';

// Create a dark theme variant
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
  },
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentTheme = isDarkMode ? darkTheme : theme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <Button onClick={() => setIsDarkMode(!isDarkMode)}>
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </Button>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Theme Hooks

Access theme values in your functional components:

```jsx
import { useTheme } from '@strive-ui/core';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ color: theme.colors.primary.main }}>
      This text uses the primary color
    </div>
  );
}
```

## Theme Composition

For larger applications, consider composing theme segments:

```jsx
// themes/colors.js
export const colors = {
  primary: { /* ... */ },
  secondary: { /* ... */ },
  // ...
};

// themes/typography.js
export const typography = {
  fontFamily: { /* ... */ },
  // ...
};

// themes/index.js
import { colors } from './colors';
import { typography } from './typography';

export const theme = {
  colors,
  typography,
  // ...
};
```

## Performance Considerations

To optimize theme performance:

1. Memoize theme objects to prevent unnecessary re-renders
2. Use the `useMemo` hook when computing derived theme values
3. Consider code-splitting theme modules for large applications
