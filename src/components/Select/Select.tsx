import React, { useState, useRef, useEffect, forwardRef, SelectHTMLAttributes } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

export interface SelectOption {
  /**
   * The value of the option
   */
  value: string;
  /**
   * The label to display for the option
   */
  label: string;
  /**
   * Whether the option is disabled
   */
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /**
   * The options to display in the select
   */
  options: SelectOption[];
  /**
   * The placeholder text to display when no option is selected
   */
  placeholder?: string;
  /**
   * Whether the select is disabled
   */
  isDisabled?: boolean;
  /**
   * Whether the select has an error
   */
  isError?: boolean;
  /**
   * The size of the select
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * The icon to display at the end of the select
   */
  icon?: React.ReactNode;
  /**
   * Whether the select is required
   */
  isRequired?: boolean;
  /**
   * The value of the select
   */
  value?: string;
  /**
   * The default value of the select
   */
  defaultValue?: string;
  /**
   * Callback when the select value changes
   */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

// Size styles are now handled directly in the StyledSelect component

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

type SelectSize = 'sm' | 'md' | 'lg';

interface StyledSelectProps {
  $isError?: boolean;
  $size: SelectSize;
  $hasPlaceholder: boolean;
}

const StyledSelect = styled.select<StyledSelectProps>`
  appearance: none;
  width: 100%;
  border: 1px solid ${props => 
    props.$isError ? props.theme.colors.error.main : props.theme.colors.neutral[300]
  };
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.common.white || props.theme.colors.neutral[100]};
  color: ${props => 
    props.$hasPlaceholder ? props.theme.colors.neutral[500] : props.theme.colors.neutral[800]
  };
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  
  /* Size styles */
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
      props.$isError ? props.theme.colors.error.main : props.theme.colors.primary[300]
    };
  }
  
  &:focus {
    border-color: ${props => 
      props.$isError ? props.theme.colors.error.main : props.theme.colors.primary[500]
    };
    box-shadow: 0 0 0 2px ${props => 
      props.$isError ? `${props.theme.colors.error.main}33` : `${props.theme.colors.primary[500]}33`
    };
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.neutral[200]};
    color: ${props => props.theme.colors.neutral[500]};
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  /* Hide default arrow in IE */
  &::-ms-expand {
    display: none;
  }
`;

interface IconWrapperProps {
  $size: SelectSize;
}

const IconWrapper = styled.div<IconWrapperProps>`
  position: absolute;
  right: ${props => 
    props.$size === 'sm' ? props.theme.spacing[2] : 
    props.$size === 'lg' ? props.theme.spacing[4] : 
    props.theme.spacing[3]
  };
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.neutral[600]};
`;

const ChevronIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
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

/**
 * Select component for selecting a value from a list of options
 * 
 * @example
 * ```jsx
 * <Select
 *   options={[
 *     { value: 'option1', label: 'Option 1' },
 *     { value: 'option2', label: 'Option 2' }
 *   ]}
 *   placeholder="Select an option"
 * />
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  placeholder,
  isDisabled = false,
  isError = false,
  size = 'md',
  icon,
  isRequired = false,
  value,
  defaultValue,
  onChange,
  ...props
}, ref) => {
  const hasPlaceholder = !value && !defaultValue;
  
  return (
    <SelectWrapper>
      <StyledSelect
        ref={ref}
        $isError={isError}
        $size={size}
        disabled={isDisabled}
        required={isRequired}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        $hasPlaceholder={!!placeholder && hasPlaceholder}
        aria-invalid={isError}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={isRequired} hidden={isRequired}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </StyledSelect>
      <IconWrapper $size={size}>
        {icon || <ChevronIcon />}
      </IconWrapper>
    </SelectWrapper>
  );
});

Select.displayName = 'Select';
