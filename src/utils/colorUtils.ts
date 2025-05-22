/**
 * Color utility functions for the StriveUI library
 */

/**
 * Adjusts the alpha (opacity) of a color
 * @param color - The color to adjust (hex, rgb, rgba)
 * @param alpha - The alpha value (0-1)
 * @returns The color with the adjusted alpha
 */
export const adjustAlpha = (color: string, alpha: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb(')) {
    const rgbValues = color.slice(4, -1).split(',').map(val => val.trim());
    return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba(')) {
    const rgbaValues = color.slice(5, -1).split(',').map(val => val.trim());
    return `rgba(${rgbaValues[0]}, ${rgbaValues[1]}, ${rgbaValues[2]}, ${alpha})`;
  }
  
  // Return the original color if it's not in a recognized format
  return color;
};

/**
 * Lightens a color by a given percentage
 * @param color - The color to lighten (hex)
 * @param percent - The percentage to lighten (0-100)
 * @returns The lightened color
 */
export const lightenColor = (color: string, percent: number): string => {
  if (!color.startsWith('#')) return color;
  
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

/**
 * Darkens a color by a given percentage
 * @param color - The color to darken (hex)
 * @param percent - The percentage to darken (0-100)
 * @returns The darkened color
 */
export const darkenColor = (color: string, percent: number): string => {
  if (!color.startsWith('#')) return color;
  
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
};

/**
 * Determines if a color is light or dark
 * @param color - The color to check (hex)
 * @returns True if the color is light, false if it's dark
 */
export const isLightColor = (color: string): boolean => {
  if (!color.startsWith('#')) return false;
  
  const hex = color.slice(1);
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate the perceived brightness using the formula:
  // (0.299*R + 0.587*G + 0.114*B)
  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  
  return brightness > 0.5;
};

/**
 * Gets a contrasting text color (black or white) based on the background color
 * @param bgColor - The background color (hex)
 * @returns '#ffffff' for dark backgrounds, '#000000' for light backgrounds
 */
export const getContrastTextColor = (bgColor: string): string => {
  return isLightColor(bgColor) ? '#000000' : '#ffffff';
};
