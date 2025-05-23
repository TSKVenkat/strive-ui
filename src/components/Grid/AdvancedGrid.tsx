import React from 'react';
import styled from 'styled-components';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

// Types
export type GridTemplateAreas = string[];
export type GridArea = string;
export type GridGap = string | number;
export type GridAutoFlow = 'row' | 'column' | 'row dense' | 'column dense';
export type GridAutoRows = string | string[];
export type GridAutoColumns = string | string[];
export type GridTemplateRows = string | string[];
export type GridTemplateColumns = string | string[];

export type ResponsiveValue<T> = {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
};

export interface AdvancedGridProps {
  /**
   * Grid template areas
   */
  templateAreas?: GridTemplateAreas | ResponsiveValue<GridTemplateAreas>;
  /**
   * Grid template rows
   */
  templateRows?: GridTemplateRows | ResponsiveValue<GridTemplateRows>;
  /**
   * Grid template columns
   */
  templateColumns?: GridTemplateColumns | ResponsiveValue<GridTemplateColumns>;
  /**
   * Grid auto flow
   */
  autoFlow?: GridAutoFlow | ResponsiveValue<GridAutoFlow>;
  /**
   * Grid auto rows
   */
  autoRows?: GridAutoRows | ResponsiveValue<GridAutoRows>;
  /**
   * Grid auto columns
   */
  autoColumns?: GridAutoColumns | ResponsiveValue<GridAutoColumns>;
  /**
   * Grid row gap
   */
  rowGap?: GridGap | ResponsiveValue<GridGap>;
  /**
   * Grid column gap
   */
  columnGap?: GridGap | ResponsiveValue<GridGap>;
  /**
   * Grid gap (shorthand for rowGap and columnGap)
   */
  gap?: GridGap | ResponsiveValue<GridGap>;
  /**
   * Justify items
   */
  justifyItems?: 'start' | 'end' | 'center' | 'stretch' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  /**
   * Align items
   */
  alignItems?: 'start' | 'end' | 'center' | 'stretch' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  /**
   * Justify content
   */
  justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'>;
  /**
   * Align content
   */
  alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'>;
  /**
   * Whether to use inline grid
   */
  inline?: boolean;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

export interface GridItemProps {
  /**
   * Grid area
   */
  area?: GridArea;
  /**
   * Grid column
   */
  column?: string | ResponsiveValue<string>;
  /**
   * Grid row
   */
  row?: string | ResponsiveValue<string>;
  /**
   * Grid column start
   */
  columnStart?: string | number | ResponsiveValue<string | number>;
  /**
   * Grid column end
   */
  columnEnd?: string | number | ResponsiveValue<string | number>;
  /**
   * Grid row start
   */
  rowStart?: string | number | ResponsiveValue<string | number>;
  /**
   * Grid row end
   */
  rowEnd?: string | number | ResponsiveValue<string | number>;
  /**
   * Justify self
   */
  justifySelf?: 'start' | 'end' | 'center' | 'stretch' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  /**
   * Align self
   */
  alignSelf?: 'start' | 'end' | 'center' | 'stretch' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  /**
   * Z-index
   */
  zIndex?: number;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Helper functions
const createResponsiveStyles = <T extends any>(
  property: string,
  value: T | ResponsiveValue<T> | undefined,
  transform: (val: T) => string = (val) => String(val)
): string => {
  if (value === undefined) return '';
  
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([breakpoint, breakpointValue]) => {
        if (breakpointValue === undefined) return '';
        
        const breakpointKey = breakpoint as keyof ResponsiveValue<T>;
        
        if (breakpointKey === 'xs') {
          return `${property}: ${transform(breakpointValue)};`;
        }
        
        return `
          @media (min-width: ${({ theme }: any) => theme.breakpoints[breakpointKey]}) {
            ${property}: ${transform(breakpointValue)};
          }
        `;
      })
      .join('');
  }
  
  return `${property}: ${transform(value)};`;
};

const formatGridGap = (gap: GridGap): string => {
  if (typeof gap === 'number') {
    return `${gap}px`;
  }
  return gap;
};

const formatGridTemplateAreas = (areas: GridTemplateAreas): string => {
  return areas.map(area => `"${area}"`).join(' ');
};

const formatGridTemplate = (template: string | string[]): string => {
  if (Array.isArray(template)) {
    return template.join(' ');
  }
  return template;
};

// Styled components
const StyledGrid = styled.div<{
  $templateAreas?: GridTemplateAreas | ResponsiveValue<GridTemplateAreas>;
  $templateRows?: GridTemplateRows | ResponsiveValue<GridTemplateRows>;
  $templateColumns?: GridTemplateColumns | ResponsiveValue<GridTemplateColumns>;
  $autoFlow?: GridAutoFlow | ResponsiveValue<GridAutoFlow>;
  $autoRows?: GridAutoRows | ResponsiveValue<GridAutoRows>;
  $autoColumns?: GridAutoColumns | ResponsiveValue<GridAutoColumns>;
  $rowGap?: GridGap | ResponsiveValue<GridGap>;
  $columnGap?: GridGap | ResponsiveValue<GridGap>;
  $gap?: GridGap | ResponsiveValue<GridGap>;
  $justifyItems?: 'start' | 'end' | 'center' | 'stretch' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  $alignItems?: 'start' | 'end' | 'center' | 'stretch' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  $justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'>;
  $alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'>;
  $inline?: boolean;
  $css?: any;
}>`
  display: ${({ $inline }) => $inline ? 'inline-grid' : 'grid'};
  
  ${({ $templateAreas }) => createResponsiveStyles(
    'grid-template-areas',
    $templateAreas,
    formatGridTemplateAreas
  )}
  
  ${({ $templateRows }) => createResponsiveStyles(
    'grid-template-rows',
    $templateRows,
    formatGridTemplate
  )}
  
  ${({ $templateColumns }) => createResponsiveStyles(
    'grid-template-columns',
    $templateColumns,
    formatGridTemplate
  )}
  
  ${({ $autoFlow }) => createResponsiveStyles(
    'grid-auto-flow',
    $autoFlow
  )}
  
  ${({ $autoRows }) => createResponsiveStyles(
    'grid-auto-rows',
    $autoRows,
    formatGridTemplate
  )}
  
  ${({ $autoColumns }) => createResponsiveStyles(
    'grid-auto-columns',
    $autoColumns,
    formatGridTemplate
  )}
  
  ${({ $rowGap }) => createResponsiveStyles(
    'grid-row-gap',
    $rowGap,
    formatGridGap
  )}
  
  ${({ $columnGap }) => createResponsiveStyles(
    'grid-column-gap',
    $columnGap,
    formatGridGap
  )}
  
  ${({ $gap }) => createResponsiveStyles(
    'grid-gap',
    $gap,
    formatGridGap
  )}
  
  ${({ $justifyItems }) => createResponsiveStyles(
    'justify-items',
    $justifyItems
  )}
  
  ${({ $alignItems }) => createResponsiveStyles(
    'align-items',
    $alignItems
  )}
  
  ${({ $justifyContent }) => createResponsiveStyles(
    'justify-content',
    $justifyContent
  )}
  
  ${({ $alignContent }) => createResponsiveStyles(
    'align-content',
    $alignContent
  )}
  
  ${({ $css }) => $css}
`;

const StyledGridItem = styled.div<{
  $area?: GridArea;
  $column?: string | ResponsiveValue<string>;
  $row?: string | ResponsiveValue<string>;
  $columnStart?: string | number | ResponsiveValue<string | number>;
  $columnEnd?: string | number | ResponsiveValue<string | number>;
  $rowStart?: string | number | ResponsiveValue<string | number>;
  $rowEnd?: string | number | ResponsiveValue<string | number>;
  $justifySelf?: 'start' | 'end' | 'center' | 'stretch' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  $alignSelf?: 'start' | 'end' | 'center' | 'stretch' | ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  $zIndex?: number;
  $css?: any;
}>`
  ${({ $area }) => $area ? `grid-area: ${$area};` : ''}
  
  ${({ $column }) => createResponsiveStyles(
    'grid-column',
    $column
  )}
  
  ${({ $row }) => createResponsiveStyles(
    'grid-row',
    $row
  )}
  
  ${({ $columnStart }) => createResponsiveStyles(
    'grid-column-start',
    $columnStart
  )}
  
  ${({ $columnEnd }) => createResponsiveStyles(
    'grid-column-end',
    $columnEnd
  )}
  
  ${({ $rowStart }) => createResponsiveStyles(
    'grid-row-start',
    $rowStart
  )}
  
  ${({ $rowEnd }) => createResponsiveStyles(
    'grid-row-end',
    $rowEnd
  )}
  
  ${({ $justifySelf }) => createResponsiveStyles(
    'justify-self',
    $justifySelf
  )}
  
  ${({ $alignSelf }) => createResponsiveStyles(
    'align-self',
    $alignSelf
  )}
  
  ${({ $zIndex }) => $zIndex !== undefined ? `z-index: ${$zIndex};` : ''}
  
  ${({ $css }) => $css}
`;

/**
 * AdvancedGrid component provides a powerful and flexible grid layout system
 * with support for responsive design and CSS Grid features.
 */
export const AdvancedGrid = React.forwardRef<
  HTMLDivElement,
  PolymorphicComponentPropsWithRef<'div', AdvancedGridProps>
>(
  (
    {
      as,
      templateAreas,
      templateRows,
      templateColumns,
      autoFlow,
      autoRows,
      autoColumns,
      rowGap,
      columnGap,
      gap,
      justifyItems,
      alignItems,
      justifyContent,
      alignContent,
      inline = false,
      css,
      children,
      ...rest
    },
    ref
  ) => {
    const Component = as || 'div';
    
    return (
      <StyledGrid
        as={Component}
        ref={ref}
        $templateAreas={templateAreas}
        $templateRows={templateRows}
        $templateColumns={templateColumns}
        $autoFlow={autoFlow}
        $autoRows={autoRows}
        $autoColumns={autoColumns}
        $rowGap={rowGap}
        $columnGap={columnGap}
        $gap={gap}
        $justifyItems={justifyItems}
        $alignItems={alignItems}
        $justifyContent={justifyContent}
        $alignContent={alignContent}
        $inline={inline}
        $css={css}
        {...rest}
      >
        {children}
      </StyledGrid>
    );
  }
);

AdvancedGrid.displayName = 'AdvancedGrid';

/**
 * GridItem component represents an item within an AdvancedGrid layout.
 */
export const GridItem = React.forwardRef<
  HTMLDivElement,
  PolymorphicComponentPropsWithRef<'div', GridItemProps>
>(
  (
    {
      as,
      area,
      column,
      row,
      columnStart,
      columnEnd,
      rowStart,
      rowEnd,
      justifySelf,
      alignSelf,
      zIndex,
      css,
      children,
      ...rest
    },
    ref
  ) => {
    const Component = as || 'div';
    
    return (
      <StyledGridItem
        as={Component}
        ref={ref}
        $area={area}
        $column={column}
        $row={row}
        $columnStart={columnStart}
        $columnEnd={columnEnd}
        $rowStart={rowStart}
        $rowEnd={rowEnd}
        $justifySelf={justifySelf}
        $alignSelf={alignSelf}
        $zIndex={zIndex}
        $css={css}
        {...rest}
      >
        {children}
      </StyledGridItem>
    );
  }
);

GridItem.displayName = 'GridItem';

// Utility functions for creating common grid layouts
export const createResponsiveGrid = (columns: ResponsiveValue<number>, gap?: GridGap) => {
  const templateColumns: ResponsiveValue<string> = {};
  
  Object.entries(columns).forEach(([breakpoint, value]) => {
    templateColumns[breakpoint as keyof ResponsiveValue<string>] = `repeat(${value}, 1fr)`;
  });
  
  return {
    templateColumns,
    gap
  };
};

export const createAutoGrid = (minWidth: string, gap?: GridGap) => {
  return {
    templateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
    gap
  };
};

export const createAreaGrid = (areas: GridTemplateAreas, templateColumns: string, templateRows: string, gap?: GridGap) => {
  return {
    templateAreas: areas,
    templateColumns,
    templateRows,
    gap
  };
};

export default {
  AdvancedGrid,
  GridItem,
  createResponsiveGrid,
  createAutoGrid,
  createAreaGrid
};
