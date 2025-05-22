import React, { createContext, useContext, FormHTMLAttributes } from 'react';
import styled from 'styled-components';

export interface FormContextValue {
  /**
   * Whether the form is currently submitting
   */
  isSubmitting?: boolean;
  /**
   * Whether the form has been submitted
   */
  isSubmitted?: boolean;
  /**
   * Form errors object
   */
  errors?: Record<string, string>;
}

export const FormContext = createContext<FormContextValue>({
  isSubmitting: false,
  isSubmitted: false,
  errors: {},
});

export const useFormContext = () => useContext(FormContext);

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /**
   * The content of the form
   */
  children: React.ReactNode;
  /**
   * Whether the form is currently submitting
   */
  isSubmitting?: boolean;
  /**
   * Whether the form has been submitted
   */
  isSubmitted?: boolean;
  /**
   * Form errors object
   */
  errors?: Record<string, string>;
  /**
   * Spacing between form elements
   */
  spacing?: 'sm' | 'md' | 'lg';
}

const StyledForm = styled.form<{ spacing?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  & > * + * {
    margin-top: ${({ spacing, theme }) => {
      switch (spacing) {
        case 'sm':
          return theme.spacing[2];
        case 'lg':
          return theme.spacing[6];
        case 'md':
        default:
          return theme.spacing[4];
      }
    }};
  }
`;

/**
 * Form component provides context for form elements and handles layout
 * 
 * @example
 * ```jsx
 * <Form onSubmit={handleSubmit}>
 *   <Input name="email" label="Email" />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 */
export const Form: React.FC<FormProps> = ({
  children,
  isSubmitting = false,
  isSubmitted = false,
  errors = {},
  spacing = 'md',
  ...props
}) => {
  const formContextValue = {
    isSubmitting,
    isSubmitted,
    errors,
  };

  return (
    <FormContext.Provider value={formContextValue}>
      <StyledForm spacing={spacing} {...props}>
        {children}
      </StyledForm>
    </FormContext.Provider>
  );
};
