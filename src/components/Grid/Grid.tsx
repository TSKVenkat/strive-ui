import React from 'react';
import styled, { css } from 'styled-components';

type GridBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid container
   */
  children: React.ReactNode;
  /**
   * Whether the container should take up the full width of its parent
   */
  fluid?: boolean;
  /**
   * The spacing between grid items
   */
  spacing?: number | Partial<Record<GridBreakpoint, number>>;
  /**
   * The maximum width of the container
   */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid item
   */
  children: React.ReactNode;
  /**
   * The number of columns the item should span (1-12)
   */
  xs?: number;
  /**
   * The number of columns the item should span at the sm breakpoint (1-12)
   */
  sm?: number;
  /**
   * The number of columns the item should span at the md breakpoint (1-12)
   */
  md?: number;
  /**
   * The number of columns the item should span at the lg breakpoint (1-12)
   */
  lg?: number;
  /**
   * The number of columns the item should span at the xl breakpoint (1-12)
   */
  xl?: number;
  /**
   * The order of the item
   */
  order?: number | Partial<Record<GridBreakpoint, number>>;
  /**
   * Whether the item should grow to fill available space
   */
  grow?: boolean;
}

const breakpoints = {
  xs: '0px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};

const maxWidths = {
  xs: '540px',
  sm: '720px',
  md: '960px',
  lg: '1140px',
  xl: '1320px',
  none: 'none',
};

const getSpacingValue = (spacing: number) => {
  return `${spacing * 0.25}rem`;
};

const getContainerStyles = (fluid?: boolean, maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none' = 'lg') => {
  if (fluid) {
    return css`
      width: 100%;
      padding-right: 1rem;
      padding-left: 1rem;
      margin-right: auto;
      margin-left: auto;
    `;
  }

  return css`
    width: 100%;
    padding-right: 1rem;
    padding-left: 1rem;
    margin-right: auto;
    margin-left: auto;
    
    @media (min-width: ${breakpoints.sm}) {
      max-width: ${maxWidth === 'xs' ? maxWidths.xs : '100%'};
    }
    
    @media (min-width: ${breakpoints.md}) {
      max-width: ${maxWidth === 'xs' || maxWidth === 'sm' ? maxWidths.sm : '100%'};
    }
    
    @media (min-width: ${breakpoints.lg}) {
      max-width: ${maxWidth === 'xs' || maxWidth === 'sm' || maxWidth === 'md' ? maxWidths.md : '100%'};
    }
    
    @media (min-width: ${breakpoints.xl}) {
      max-width: ${maxWidth === 'xs' || maxWidth === 'sm' || maxWidth === 'md' || maxWidth === 'lg' ? maxWidths.lg : '100%'};
    }
    
    @media (min-width: ${breakpoints.xl}) {
      max-width: ${maxWidth === 'none' ? '100%' : maxWidths[maxWidth]};
    }
  `;
};

const getSpacingStyles = (spacing?: number | Partial<Record<GridBreakpoint, number>>) => {
  if (spacing === undefined) {
    return '';
  }

  if (typeof spacing === 'number') {
    return css`
      margin: -${getSpacingValue(spacing / 2)};
      width: calc(100% + ${getSpacingValue(spacing)});
      
      & > * {
        padding: ${getSpacingValue(spacing / 2)};
      }
    `;
  }

  return css`
    margin: -${getSpacingValue((spacing.xs || 0) / 2)};
    width: calc(100% + ${getSpacingValue(spacing.xs || 0)});
    
    & > * {
      padding: ${getSpacingValue((spacing.xs || 0) / 2)};
    }
    
    @media (min-width: ${breakpoints.sm}) {
      ${spacing.sm !== undefined && css`
        margin: -${getSpacingValue(spacing.sm / 2)};
        width: calc(100% + ${getSpacingValue(spacing.sm)});
        
        & > * {
          padding: ${getSpacingValue(spacing.sm / 2)};
        }
      `}
    }
    
    @media (min-width: ${breakpoints.md}) {
      ${spacing.md !== undefined && css`
        margin: -${getSpacingValue(spacing.md / 2)};
        width: calc(100% + ${getSpacingValue(spacing.md)});
        
        & > * {
          padding: ${getSpacingValue(spacing.md / 2)};
        }
      `}
    }
    
    @media (min-width: ${breakpoints.lg}) {
      ${spacing.lg !== undefined && css`
        margin: -${getSpacingValue(spacing.lg / 2)};
        width: calc(100% + ${getSpacingValue(spacing.lg)});
        
        & > * {
          padding: ${getSpacingValue(spacing.lg / 2)};
        }
      `}
    }
    
    @media (min-width: ${breakpoints.xl}) {
      ${spacing.xl !== undefined && css`
        margin: -${getSpacingValue(spacing.xl / 2)};
        width: calc(100% + ${getSpacingValue(spacing.xl)});
        
        & > * {
          padding: ${getSpacingValue(spacing.xl / 2)};
        }
      `}
    }
  `;
};

const StyledGridContainer = styled.div<{
  $fluid?: boolean;
  $spacing?: number | Partial<Record<GridBreakpoint, number>>;
  $maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
}>`
  ${({ $fluid, $maxWidth }) => getContainerStyles($fluid, $maxWidth)}
`;

const StyledGridRow = styled.div<{
  $spacing?: number | Partial<Record<GridBreakpoint, number>>;
}>`
  display: flex;
  flex-wrap: wrap;
  ${({ $spacing }) => getSpacingStyles($spacing)}
`;

const getColumnStyles = (
  xs?: number,
  sm?: number,
  md?: number,
  lg?: number,
  xl?: number,
  order?: number | Partial<Record<GridBreakpoint, number>>,
  grow?: boolean,
) => {
  return css`
    flex-grow: ${grow ? 1 : 0};
    flex-shrink: 0;
    
    ${xs !== undefined && css`
      flex-basis: ${(xs / 12) * 100}%;
      max-width: ${(xs / 12) * 100}%;
    `}
    
    ${typeof order === 'number' && css`
      order: ${order};
    `}
    
    ${typeof order === 'object' && order.xs !== undefined && css`
      order: ${order.xs};
    `}
    
    @media (min-width: ${breakpoints.sm}) {
      ${sm !== undefined && css`
        flex-basis: ${(sm / 12) * 100}%;
        max-width: ${(sm / 12) * 100}%;
      `}
      
      ${typeof order === 'object' && order.sm !== undefined && css`
        order: ${order.sm};
      `}
    }
    
    @media (min-width: ${breakpoints.md}) {
      ${md !== undefined && css`
        flex-basis: ${(md / 12) * 100}%;
        max-width: ${(md / 12) * 100}%;
      `}
      
      ${typeof order === 'object' && order.md !== undefined && css`
        order: ${order.md};
      `}
    }
    
    @media (min-width: ${breakpoints.lg}) {
      ${lg !== undefined && css`
        flex-basis: ${(lg / 12) * 100}%;
        max-width: ${(lg / 12) * 100}%;
      `}
      
      ${typeof order === 'object' && order.lg !== undefined && css`
        order: ${order.lg};
      `}
    }
    
    @media (min-width: ${breakpoints.xl}) {
      ${xl !== undefined && css`
        flex-basis: ${(xl / 12) * 100}%;
        max-width: ${(xl / 12) * 100}%;
      `}
      
      ${typeof order === 'object' && order.xl !== undefined && css`
        order: ${order.xl};
      `}
    }
  `;
};

const StyledGridItem = styled.div<{
  $xs?: number;
  $sm?: number;
  $md?: number;
  $lg?: number;
  $xl?: number;
  $order?: number | Partial<Record<GridBreakpoint, number>>;
  $grow?: boolean;
}>`
  ${({ $xs, $sm, $md, $lg, $xl, $order, $grow }) => 
    getColumnStyles($xs, $sm, $md, $lg, $xl, $order, $grow)
  }
`;

/**
 * Grid.Container component for creating responsive layouts
 * 
 * @example
 * ```jsx
 * <Grid.Container>
 *   <Grid.Row spacing={2}>
 *     <Grid.Item xs={12} md={6}>
 *       Column 1
 *     </Grid.Item>
 *     <Grid.Item xs={12} md={6}>
 *       Column 2
 *     </Grid.Item>
 *   </Grid.Row>
 * </Grid.Container>
 * ```
 */
const Container: React.FC<GridContainerProps> = ({
  children,
  fluid = false,
  spacing,
  maxWidth = 'lg',
  ...props
}) => {
  return (
    <StyledGridContainer 
      $fluid={fluid} 
      $spacing={spacing}
      $maxWidth={maxWidth}
      {...props}
    >
      {children}
    </StyledGridContainer>
  );
};

/**
 * Grid.Row component for creating a row of grid items
 */
interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The content of the grid row
   */
  children: React.ReactNode;
  /**
   * The spacing between grid items
   */
  spacing?: number | Partial<Record<GridBreakpoint, number>>;
}

const Row: React.FC<GridRowProps> = ({
  children,
  spacing,
  ...props
}) => {
  return (
    <StyledGridRow $spacing={spacing} {...props}>
      {children}
    </StyledGridRow>
  );
};

/**
 * Grid.Item component for creating a column within a grid row
 */
const Item: React.FC<GridItemProps> = ({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  order,
  grow = false,
  ...props
}) => {
  return (
    <StyledGridItem
      $xs={xs}
      $sm={sm}
      $md={md}
      $lg={lg}
      $xl={xl}
      $order={order}
      $grow={grow}
      {...props}
    >
      {children}
    </StyledGridItem>
  );
};

export const Grid = {
  Container,
  Row,
  Item,
};
