import { useState, useCallback } from 'react';
import { useTextInput, UseTextInputProps, UseTextInputReturn } from '../TextInput/useTextInput';

export interface UsePasswordInputProps extends Omit<UseTextInputProps, 'type'> {
  /**
   * Minimum password strength (0-4)
   * 0: Very weak, 1: Weak, 2: Medium, 3: Strong, 4: Very strong
   */
  minStrength?: number;
  /**
   * Whether to show password strength indicator
   */
  showStrengthIndicator?: boolean;
  /**
   * Whether to show password requirements
   */
  showRequirements?: boolean;
  /**
   * Custom password requirements
   */
  requirements?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
  };
}

export interface UsePasswordInputReturn extends UseTextInputReturn {
  /**
   * Whether the password is visible
   */
  isVisible: boolean;
  /**
   * Toggle password visibility
   */
  toggleVisibility: () => void;
  /**
   * Password strength (0-4)
   */
  strength: number;
  /**
   * Whether the password meets all requirements
   */
  meetsRequirements: boolean;
  /**
   * Object indicating which requirements are met
   */
  requirementsMet: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
  /**
   * Whether to show password strength indicator
   */
  showStrengthIndicator: boolean;
  /**
   * Whether to show password requirements
   */
  showRequirements: boolean;
  /**
   * Get props for the visibility toggle button
   */
  getToggleButtonProps: <E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ) => React.ButtonHTMLAttributes<E>;
  /**
   * Get props for the strength indicator
   */
  getStrengthIndicatorProps: <E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => React.HTMLAttributes<E> & {
    'data-strength': number;
  };
}

/**
 * Hook for creating password input functionality.
 * 
 * @example
 * ```jsx
 * const MyPasswordInput = (props) => {
 *   const { 
 *     isVisible,
 *     toggleVisibility,
 *     strength,
 *     getInputProps,
 *     getToggleButtonProps,
 *     getStrengthIndicatorProps,
 *   } = usePasswordInput(props);
 *   
 *   return (
 *     <div>
 *       <input {...getInputProps()} type={isVisible ? 'text' : 'password'} />
 *       <button {...getToggleButtonProps()}>
 *         {isVisible ? 'Hide' : 'Show'}
 *       </button>
 *       <div {...getStrengthIndicatorProps()} />
 *     </div>
 *   );
 * };
 * ```
 */
export function usePasswordInput({
  minStrength = 0,
  showStrengthIndicator = false,
  showRequirements = false,
  requirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  ...textInputProps
}: UsePasswordInputProps = {}): UsePasswordInputReturn {
  // Use the base text input hook
  const textInputState = useTextInput({
    ...textInputProps,
    type: 'password',
  });
  
  // State for password visibility
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  // Toggle password visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);
  
  // Calculate password strength and requirements
  const { value } = textInputState;
  
  const requirementsMet = {
    minLength: value.length >= (requirements.minLength || 8),
    hasUppercase: requirements.requireUppercase ? /[A-Z]/.test(value) : true,
    hasLowercase: requirements.requireLowercase ? /[a-z]/.test(value) : true,
    hasNumbers: requirements.requireNumbers ? /[0-9]/.test(value) : true,
    hasSpecialChars: requirements.requireSpecialChars ? /[^A-Za-z0-9]/.test(value) : true,
  };
  
  const meetsRequirements = Object.values(requirementsMet).every(Boolean);
  
  // Calculate password strength (0-4)
  const calculateStrength = (): number => {
    if (value.length === 0) return 0;
    
    let score = 0;
    
    // Length contribution (up to 1 point)
    const lengthScore = Math.min(value.length / 12, 1);
    score += lengthScore;
    
    // Character variety contribution (up to 3 points)
    if (/[A-Z]/.test(value)) score += 0.75;
    if (/[a-z]/.test(value)) score += 0.75;
    if (/[0-9]/.test(value)) score += 0.75;
    if (/[^A-Za-z0-9]/.test(value)) score += 0.75;
    
    // Convert to 0-4 scale
    return Math.min(Math.floor(score), 4);
  };
  
  const strength = calculateStrength();
  
  // Get props for the visibility toggle button
  const getToggleButtonProps = useCallback(<E extends HTMLButtonElement = HTMLButtonElement>(
    props?: React.ButtonHTMLAttributes<E>
  ): React.ButtonHTMLAttributes<E> => {
    return {
      ...props,
      type: 'button' as const,
      onClick: (event: React.MouseEvent<E>) => {
        toggleVisibility();
        props?.onClick?.(event as any);
      },
      'aria-label': isVisible ? 'Hide password' : 'Show password',
      'aria-pressed': isVisible,
    };
  }, [isVisible, toggleVisibility]);
  
  // Get props for the strength indicator
  const getStrengthIndicatorProps = useCallback(<E extends HTMLElement = HTMLDivElement>(
    props?: React.HTMLAttributes<E>
  ) => {
    return {
      ...props,
      role: 'meter',
      'aria-label': 'Password strength',
      'aria-valuemin': 0,
      'aria-valuemax': 4,
      'aria-valuenow': strength,
      'data-strength': strength,
    };
  }, [strength]);
  
  // Override the getInputProps to handle visibility
  const originalGetInputProps = textInputState.getInputProps;
  
  const getInputProps = useCallback(<E extends HTMLInputElement = HTMLInputElement>(
    props?: React.InputHTMLAttributes<E>
  ) => {
    const inputProps = originalGetInputProps(props);
    
    return {
      ...inputProps,
      type: isVisible ? 'text' : 'password',
    };
  }, [originalGetInputProps, isVisible]);
  
  return {
    ...textInputState,
    getInputProps,
    isVisible,
    toggleVisibility,
    strength,
    meetsRequirements,
    requirementsMet,
    showStrengthIndicator,
    showRequirements,
    getToggleButtonProps,
    getStrengthIndicatorProps,
  };
}
