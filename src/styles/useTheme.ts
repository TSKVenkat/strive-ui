import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Theme } from './ThemeProvider';

export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};
