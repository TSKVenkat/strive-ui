import React, { createContext, useContext, useState, useRef, useCallback, useEffect, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '../Box/Box';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';
import FocusTrap from 'focus-trap-react';

// Types
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

// Context
interface SelectContextType {
  // State
  isOpen: boolean;
  selectedOption: SelectOption | null;
  highlightedIndex: number;
  
  // Methods
  openSelect: () => void;
  closeSelect: () => void;
  toggleSelect: () => void;
  selectOption: (option: SelectOption) => void;
  highlightOption: (index: number) => void;
  
  // Properties
  options: SelectOption[];
  size: SelectSize;
  disabled: boolean;
  error: boolean;
  placeholder: string;
  
  // Refs
  triggerRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLDivElement>;
  
  // Accessibility
  labelId: string;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

// Hook for consuming the context
export const useSelectContext = () => {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error('Select compound components must be used within a Select.Root component');
  }
  return context;
};

// Styled Components
const StyledTrigger = styled.div<{
  $size: SelectSize;
  $isOpen: boolean;
  $hasValue: boolean;
  $disabled: boolean;
  $error: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 1px solid ${props => 
    props.$error ? props.theme.colors.error.main : 
    props.$isOpen ? props.theme.colors.primary[500] : 
    props.theme.colors.neutral[300]
  };
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => 
    props.$disabled ? props.theme.colors.neutral[200] : 
    props.theme.colors.common.white
  };
  color: ${props => 
    props.$disabled ? props.theme.colors.neutral[500] : 
    !props.$hasValue ? props.theme.colors.neutral[500] : 
    props.theme.colors.neutral[800]
  };
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  outline: none;
  transition: all 0.2s ease;
  position: relative;
  
  ${props => {
    switch (props.$size) {
      case 'sm':
        return css`
          height: 32px;
          font-size: ${props.theme.typography.fontSize.xs};
          padding: 0 ${props.theme.spacing[2]};
        `;
      case 'lg':
        return css`
          height: 48px;
          font-size: ${props.theme.typography.fontSize.md};
          padding: 0 ${props.theme.spacing[4]};
        `;
      case 'md':
      default:
        return css`
          height: 40px;
          font-size: ${props.theme.typography.fontSize.sm};
          padding: 0 ${props.theme.spacing[3]};
        `;
    }
  }};
  
  &:hover:not(:disabled) {
    border-color: ${props => 
      props.$error ? props.theme.colors.error.main : 
      props.theme.colors.primary[300]
    };
  }
  
  &:focus-visible {
    border-color: ${props => 
      props.$error ? props.theme.colors.error.main : 
      props.theme.colors.primary[500]
    };
    box-shadow: 0 0 0 2px ${props => 
      props.$error ? `${props.theme.colors.error.main}33` : 
      `${props.theme.colors.primary[500]}33`
    };
  }
`;

const StyledContent = styled(motion.div)<{ role?: string; id?: string }>`
  position: absolute;
  width: 100%;
  background-color: ${props => props.theme.colors.common.white};
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.md};
  z-index: 1000;
  overflow: hidden;
  margin-top: 4px;
`;

const StyledOptionsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.neutral[100]};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.neutral[400]};
    border-radius: 4px;
  }
`;

const StyledOption = styled.div<{
  $highlighted: boolean;
  $selected: boolean;
  $disabled: boolean;
  $size: SelectSize;
}>`
  display: flex;
  align-items: center;
  padding: ${props => 
    props.$size === 'sm' ? props.theme.spacing[1] : 
    props.$size === 'lg' ? props.theme.spacing[3] : 
    props.theme.spacing[2]
  } ${props => 
    props.$size === 'sm' ? props.theme.spacing[2] : 
    props.$size === 'lg' ? props.theme.spacing[4] : 
    props.theme.spacing[3]
  };
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => 
    props.$disabled ? props.theme.colors.neutral[100] : 
    props.$highlighted ? props.theme.colors.primary[50] : 
    props.$selected ? props.theme.colors.primary[100] : 
    'transparent'
  };
  color: ${props => 
    props.$disabled ? props.theme.colors.neutral[500] : 
    props.$selected ? props.theme.colors.primary[700] : 
    props.theme.colors.neutral[800]
  };
  opacity: ${props => props.$disabled ? 0.7 : 1};
  font-weight: ${props => props.$selected ? '500' : 'normal'};
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${props => 
      props.$disabled ? props.theme.colors.neutral[100] : 
      props.theme.colors.primary[50]
    };
  }
`;

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ 
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease'
    }}
  >
    <path 
      d="M4 6L8 10L12 6" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Root Component
interface SelectRootProps {
  /** The options for the select */
  options: SelectOption[];
  /** The default selected option value */
  defaultValue?: string;
  /** The selected option value (controlled) */
  value?: string;
  /** Callback when selection changes */
  onValueChange?: (value: string) => void;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select has an error */
  error?: boolean;
  /** The size of the select */
  size?: SelectSize;
  /** Children components */
  children: React.ReactNode;
  /** ID for accessibility */
  id?: string;
}

export const SelectRoot: React.FC<SelectRootProps> = ({
  options,
  defaultValue,
  value: controlledValue,
  onValueChange,
  placeholder = 'Select an option',
  disabled = false,
  error = false,
  size = 'md',
  children,
  id,
}) => {
  // Generate unique ID for accessibility
  const uniqueId = useRef(`select-${Math.random().toString(36).substring(2, 9)}`);
  const labelId = id || uniqueId.current;
  
  // Refs
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(() => {
    const initialValue = controlledValue !== undefined ? controlledValue : defaultValue;
    if (initialValue) {
      const option = options.find(opt => opt.value === initialValue);
      return option || null;
    }
    return null;
  });
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  // Update selected option when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      const option = options.find(opt => opt.value === controlledValue);
      setSelectedOption(option || null);
    }
  }, [controlledValue, options]);
  
  // Methods
  const openSelect = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      // Set highlighted index to selected option or first option
      if (selectedOption) {
        const index = options.findIndex(opt => opt.value === selectedOption.value);
        setHighlightedIndex(index);
      } else {
        setHighlightedIndex(0);
      }
    }
  }, [disabled, options, selectedOption]);
  
  const closeSelect = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);
  
  const toggleSelect = useCallback(() => {
    if (isOpen) {
      closeSelect();
    } else {
      openSelect();
    }
  }, [isOpen, openSelect, closeSelect]);
  
  const selectOption = useCallback((option: SelectOption) => {
    if (!option.disabled) {
      setSelectedOption(option);
      if (onValueChange) {
        onValueChange(option.value);
      }
      closeSelect();
    }
  }, [onValueChange, closeSelect]);
  
  const highlightOption = useCallback((index: number) => {
    setHighlightedIndex(index);
  }, []);
  
  // Close select when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        !contentRef.current.contains(event.target as Node)
      ) {
        closeSelect();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeSelect]);
  
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => {
            const nextIndex = prev + 1;
            if (nextIndex >= options.length) return 0;
            return nextIndex;
          });
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => {
            const nextIndex = prev - 1;
            if (nextIndex < 0) return options.length - 1;
            return nextIndex;
          });
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          if (highlightedIndex !== -1) {
            selectOption(options[highlightedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          closeSelect();
          break;
        case 'Tab':
          closeSelect();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, highlightedIndex, options, selectOption, closeSelect]);
  
  // Context value
  const contextValue: SelectContextType = {
    isOpen,
    selectedOption,
    highlightedIndex,
    openSelect,
    closeSelect,
    toggleSelect,
    selectOption,
    highlightOption,
    options,
    size,
    disabled,
    error,
    placeholder,
    triggerRef,
    contentRef,
    labelId,
  };
  
  return (
    <SelectContext.Provider value={contextValue}>
      <Box position="relative">
        {children}
      </Box>
    </SelectContext.Provider>
  );
};

// Trigger Component
interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Children components */
  children?: React.ReactNode;
}

export const SelectTrigger = forwardRef<HTMLDivElement, SelectTriggerProps>(({
  children,
  ...props
}, ref) => {
  const {
    isOpen,
    toggleSelect,
    selectedOption,
    disabled,
    error,
    size,
    placeholder,
    triggerRef,
    labelId,
  } = useSelectContext();
  
  // Combine refs
  const handleRef = (element: HTMLDivElement) => {
    // Update the internal ref
    if (triggerRef) {
      (triggerRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
    
    // Forward the ref
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };
  
  return (
    <StyledTrigger
      ref={handleRef}
      $isOpen={isOpen}
      $hasValue={!!selectedOption}
      $disabled={disabled}
      $error={error}
      $size={size}
      onClick={toggleSelect}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls={`${labelId}-content`}
      aria-labelledby={labelId}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children || (
        <>
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronIcon isOpen={isOpen} />
        </>
      )}
    </StyledTrigger>
  );
});

SelectTrigger.displayName = 'SelectTrigger';

// Content Component
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Children components */
  children?: React.ReactNode;
}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(({
  children,
  ...props
}, ref) => {
  const {
    isOpen,
    contentRef,
    labelId,
    options,
  } = useSelectContext();
  
  // Combine refs
  const handleRef = (element: HTMLDivElement) => {
    // Update the internal ref
    if (contentRef) {
      (contentRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
    }
    
    // Forward the ref
    if (typeof ref === 'function') {
      ref(element);
    } else if (ref) {
      ref.current = element;
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            escapeDeactivates: true,
            clickOutsideDeactivates: true,
            returnFocusOnDeactivate: true,
          }}
        >
          <StyledContent
            ref={handleRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            id={`${labelId}-content`}
            aria-labelledby={labelId}
            {...props as any}
          >
            <StyledOptionsList>
              {children || (
                options.map((option, index) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))
              )}
            </StyledOptionsList>
          </StyledContent>
        </FocusTrap>
      )}
    </AnimatePresence>
  );
});

SelectContent.displayName = 'SelectContent';

// Item Component
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The value of the option */
  value: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Children components */
  children: React.ReactNode;
}

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(({
  value,
  disabled = false,
  children,
  ...props
}, ref) => {
  const {
    selectedOption,
    highlightedIndex,
    selectOption,
    highlightOption,
    options,
    size,
  } = useSelectContext();
  
  const option = options.find(opt => opt.value === value) || { value, label: children, disabled };
  const index = options.findIndex(opt => opt.value === value);
  const isSelected = selectedOption?.value === value;
  const isHighlighted = highlightedIndex === index;
  
  const handleClick = () => {
    if (!disabled) {
      selectOption(option);
    }
  };
  
  const handleMouseEnter = () => {
    if (!disabled) {
      highlightOption(index);
    }
  };
  
  return (
    <StyledOption
      ref={ref}
      $highlighted={isHighlighted}
      $selected={isSelected}
      $disabled={disabled}
      $size={size}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </StyledOption>
  );
});

SelectItem.displayName = 'SelectItem';

// Compound component
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
};
