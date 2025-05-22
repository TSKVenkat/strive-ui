import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export interface ColorPickerProps {
  /** The current color value */
  value: string;
  /** Callback fired when the color changes */
  onChange: (color: string) => void;
  /** Whether the color picker is disabled */
  disabled?: boolean;
  /** Size of the color picker */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the color value */
  showValue?: boolean;
  /** Format of the color value display */
  format?: 'hex' | 'rgb' | 'hsl';
  /** Predefined color options */
  presetColors?: string[];
  /** Placeholder text for the color input */
  placeholder?: string;
  /** Additional className for the container */
  className?: string;
  /** Optional style overrides for the container */
  style?: React.CSSProperties;
  /** Aria label for the color picker */
  ariaLabel?: string;
}

const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        width: '24px',
        height: '24px',
      };
    case 'md':
      return {
        width: '36px',
        height: '36px',
      };
    case 'lg':
      return {
        width: '48px',
        height: '48px',
      };
    default:
      return {
        width: '36px',
        height: '36px',
      };
  }
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const ColorButton = styled.button<{
  color: string;
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}>`
  ${({ size }) => getSizeStyles(size)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ color }) => color};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  padding: 0;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
`;

const Popover = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 16px;
  width: 240px;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0;
  border: none;
  margin-bottom: 16px;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
  
  &::-moz-color-swatch {
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const ValueDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const ValueLabel = styled.span`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const ValueInput = styled.input`
  flex: 2;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[800]};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const PresetColorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

const PresetColor = styled.button<{ color: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ color }) => color};
  cursor: pointer;
  padding: 0;
  transition: all ${({ theme }) => theme.animation.duration.fast} ${({ theme }) => theme.animation.easing.easeInOut};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[300]};
  }
`;

// Helper function to convert color formats
const convertColor = (color: string, format: 'hex' | 'rgb' | 'hsl'): string => {
  // Create a temporary element to use the browser's color parsing
  const tempEl = document.createElement('div');
  tempEl.style.color = color;
  document.body.appendChild(tempEl);
  const computedColor = getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);
  
  // Parse RGB values
  const rgbMatch = computedColor.match(/rgba?\((\d+), (\d+), (\d+)(?:, [\d.]+)?\)/);
  if (!rgbMatch) return color; // Return original if parsing fails
  
  const r = parseInt(rgbMatch[1], 10);
  const g = parseInt(rgbMatch[2], 10);
  const b = parseInt(rgbMatch[3], 10);
  
  switch (format) {
    case 'hex': {
      const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }
    case 'rgb':
      return `rgb(${r}, ${g}, ${b})`;
    case 'hsl': {
      // Convert RGB to HSL
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case rNorm:
            h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
            break;
          case gNorm:
            h = (bNorm - rNorm) / d + 2;
            break;
          case bNorm:
            h = (rNorm - gNorm) / d + 4;
            break;
        }
        
        h /= 6;
      }
      
      return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
    default:
      return color;
  }
};

export const ColorPicker = ({
  value,
  onChange,
  disabled = false,
  size = 'md',
  showValue = true,
  format = 'hex',
  presetColors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'],
  placeholder = 'Select color',
  className,
  style,
  ariaLabel = 'Color picker',
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setInputValue(convertColor(value, format));
  }, [value, format]);
  
  const handleButtonClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    onChange(newColor);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };
  
  const handleInputBlur = () => {
    try {
      // Test if the input value is a valid color
      const tempEl = document.createElement('div');
      tempEl.style.color = inputValue;
      document.body.appendChild(tempEl);
      const computedColor = getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);
      
      if (computedColor !== 'rgba(0, 0, 0, 0)') {
        onChange(inputValue);
      } else {
        // Reset to current value if invalid
        setInputValue(convertColor(value, format));
      }
    } catch (e) {
      // Reset to current value if invalid
      setInputValue(convertColor(value, format));
    }
  };
  
  const handlePresetColorClick = (color: string) => {
    onChange(color);
  };
  
  // Close the popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <Container ref={containerRef} className={className} style={style}>
      <ColorButton
        type="button"
        color={value}
        size={size}
        disabled={disabled}
        onClick={handleButtonClick}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="true"
      />
      
      <AnimatePresence>
        {isOpen && (
          <Popover
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ColorInput
              type="color"
              value={value}
              onChange={handleColorChange}
              aria-label="Select color"
            />
            
            {showValue && (
              <ValueDisplay>
                <ValueLabel>Color:</ValueLabel>
                <ValueInput
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder={placeholder}
                />
              </ValueDisplay>
            )}
            
            {presetColors && presetColors.length > 0 && (
              <PresetColorsContainer>
                {presetColors.map((color, index) => (
                  <PresetColor
                    key={`${color}-${index}`}
                    color={color}
                    onClick={() => handlePresetColorClick(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </PresetColorsContainer>
            )}
          </Popover>
        )}
      </AnimatePresence>
    </Container>
  );
};

ColorPicker.displayName = 'ColorPicker';
