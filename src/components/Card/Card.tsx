import React from 'react';
import styled, { css } from 'styled-components';

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps {
  /** The variant of the card */
  variant?: CardVariant;
  /** Whether the card has a hover effect */
  interactive?: boolean;
  /** The content of the card */
  children: React.ReactNode;
  /** Additional CSS className */
  className?: string;
  /** Optional card title */
  title?: string;
  /** Optional card subtitle */
  subtitle?: string;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Optional header action (e.g., a button or icon) */
  headerAction?: React.ReactNode;
}

const getVariantStyles = (variant: CardVariant) => {
  switch (variant) {
    case 'elevated':
      return css`
        background-color: ${({ theme }) => theme.colors.neutral[100]};
        box-shadow: ${({ theme }) => theme.shadows.md};
        border: none;
      `;
    case 'outlined':
      return css`
        background-color: ${({ theme }) => theme.colors.neutral[100]};
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
        box-shadow: none;
      `;
    case 'filled':
      return css`
        background-color: ${({ theme }) => theme.colors.neutral[200]};
        border: none;
        box-shadow: none;
      `;
    default:
      return '';
  }
};

const StyledCard = styled.div<{ variant: CardVariant; interactive: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  ${({ variant }) => getVariantStyles(variant)};
  transition: all ${({ theme }) => theme.animation.duration.normal} ${({ theme }) => theme.animation.easing.easeInOut};
  
  ${({ interactive, theme }) =>
    interactive &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.lg};
      }
    `}
`;

const CardHeader = styled.div`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[2]}`};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const HeaderAction = styled.div`
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

const CardTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
`;

const CardSubtitle = styled.div`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const CardContent = styled.div`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
`;

const CardFooter = styled.div`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]} ${theme.spacing[4]}`};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  interactive = false,
  children,
  className,
  title,
  subtitle,
  footer,
  headerAction,
}) => {
  const hasHeader = title || subtitle || headerAction;
  
  return (
    <StyledCard variant={variant} interactive={interactive} className={className}>
      {hasHeader && (
        <CardHeader>
          <HeaderContent>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
          </HeaderContent>
          {headerAction && <HeaderAction>{headerAction}</HeaderAction>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </StyledCard>
  );
};

Card.displayName = 'Card';
