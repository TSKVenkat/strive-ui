import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { Icon } from '../Icon';
import { useThemeContext } from '../../styles/ThemeProvider';

export type PaginationVariant = 'default' | 'rounded' | 'outlined' | 'filled';
export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationShape = 'square' | 'rounded' | 'circular';

export interface PaginationProps {
  /**
   * The total number of pages
   */
  totalPages: number;
  
  /**
   * The current page (1-based)
   */
  currentPage: number;
  
  /**
   * Callback when page changes
   */
  onPageChange: (page: number) => void;
  
  /**
   * The number of pages to show on each side of the current page
   * @default 1
   */
  siblingCount?: number;
  
  /**
   * The number of pages to show at the beginning and end
   * @default 1
   */
  boundaryCount?: number;
  
  /**
   * Whether to show the first page button
   * @default true
   */
  showFirstButton?: boolean;
  
  /**
   * Whether to show the last page button
   * @default true
   */
  showLastButton?: boolean;
  
  /**
   * Whether to show the previous page button
   * @default true
   */
  showPrevButton?: boolean;
  
  /**
   * Whether to show the next page button
   * @default true
   */
  showNextButton?: boolean;
  
  /**
   * The variant of the pagination
   * @default 'default'
   */
  variant?: PaginationVariant;
  
  /**
   * The size of the pagination
   * @default 'md'
   */
  size?: PaginationSize;
  
  /**
   * The shape of the pagination items
   * @default 'rounded'
   */
  shape?: PaginationShape;
  
  /**
   * Whether to disable the pagination
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Custom ID
   */
  id?: string;
  
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
  
  /**
   * Whether to hide the pagination when there's only one page
   * @default true
   */
  hideOnSinglePage?: boolean;
  
  /**
   * Whether to show page numbers
   * @default true
   */
  showPageNumbers?: boolean;
  
  /**
   * Custom text for the previous button
   */
  prevButtonLabel?: string;
  
  /**
   * Custom text for the next button
   */
  nextButtonLabel?: string;
  
  /**
   * Custom text for the first button
   */
  firstButtonLabel?: string;
  
  /**
   * Custom text for the last button
   */
  lastButtonLabel?: string;
  
  /**
   * Custom icon for the previous button
   */
  prevButtonIcon?: React.ReactNode;
  
  /**
   * Custom icon for the next button
   */
  nextButtonIcon?: React.ReactNode;
  
  /**
   * Custom icon for the first button
   */
  firstButtonIcon?: React.ReactNode;
  
  /**
   * Custom icon for the last button
   */
  lastButtonIcon?: React.ReactNode;
  
  /**
   * Whether to show a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Whether to show a compact version on mobile
   * @default true
   */
  responsiveCompact?: boolean;
  
  /**
   * The breakpoint for mobile view
   * @default 480
   */
  mobileBreakpoint?: number;
  
  /**
   * Custom renderer for page items
   */
  renderItem?: (
    props: {
      page: number;
      selected: boolean;
      disabled: boolean;
      type: 'page' | 'first' | 'last' | 'next' | 'prev' | 'ellipsis';
      onClick: () => void;
    }
  ) => React.ReactNode;
  
  /**
   * Whether to show a jump to page input
   * @default false
   */
  showJumpToPage?: boolean;
  
  /**
   * Label for the jump to page input
   * @default 'Go to page:'
   */
  jumpToPageLabel?: string;
  
  /**
   * Placeholder for the jump to page input
   * @default 'Page'
   */
  jumpToPagePlaceholder?: string;
  
  /**
   * Text for the jump to page button
   * @default 'Go'
   */
  jumpToPageButtonText?: string;
  
  /**
   * Whether to show a page size selector
   * @default false
   */
  showPageSizeSelector?: boolean;
  
  /**
   * Available page sizes
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];
  
  /**
   * Current page size
   * @default 10
   */
  pageSize?: number;
  
  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
  
  /**
   * Label for the page size selector
   * @default 'Items per page:'
   */
  pageSizeLabel?: string;
  
  /**
   * Whether to show the total items count
   * @default false
   */
  showTotalItems?: boolean;
  
  /**
   * Total number of items
   */
  totalItems?: number;
  
  /**
   * Format for the total items text
   * @default '{total} items'
   */
  totalItemsFormat?: string;
  
  /**
   * Whether to show the current range of items
   * @default false
   */
  showItemsRange?: boolean;
  
  /**
   * Format for the items range text
   * @default '{start}-{end} of {total}'
   */
  itemsRangeFormat?: string;
}

// Helper function to create range of numbers
const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

// Styled components
const PaginationContainer = styled.nav<{
  $disabled: boolean;
  $size: PaginationSize;
  $responsiveCompact: boolean;
  $mobileBreakpoint: number;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  opacity: ${props => props.$disabled ? 0.5 : 1};
  pointer-events: ${props => props.$disabled ? 'none' : 'auto'};
  
  ${props => props.$responsiveCompact && css`
    @media (max-width: ${props.$mobileBreakpoint}px) {
      .pagination-item-extended {
        display: none;
      }
    }
  `}
`;

const PaginationList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0.25rem;
`;

const PaginationItem = styled.li<{
  $variant: PaginationVariant;
  $size: PaginationSize;
  $shape: PaginationShape;
  $selected: boolean;
  $disabled: boolean;
}>`
  margin: 0;
  
  ${props => {
    // Size styles
    const sizeStyles = {
      sm: css`
        font-size: ${props.theme.typography.fontSize.sm};
        min-width: 2rem;
        height: 2rem;
      `,
      md: css`
        font-size: ${props.theme.typography.fontSize.md};
        min-width: 2.5rem;
        height: 2.5rem;
      `,
      lg: css`
        font-size: ${props.theme.typography.fontSize.lg};
        min-width: 3rem;
        height: 3rem;
      `,
    };
    
    // Shape styles
    const getShapeStyles = () => {
      switch (props.$shape) {
        case 'square':
          return css`border-radius: 0;`;
        case 'rounded':
          return css`border-radius: ${props.theme.borderRadius.md};`;
        case 'circular':
          return css`border-radius: 50%;`;
        default:
          return '';
      }
    };
    
    // Variant styles
    const getVariantStyles = () => {
      const baseStyles = css`
        background-color: transparent;
        color: ${props.theme.colors.text.primary};
        
        &:hover:not(:disabled) {
          background-color: ${props.theme.colors.neutral[100]};
        }
        
        &:focus {
          outline: none;
          box-shadow: 0 0 0 2px ${props.theme.colors.primary[200]};
        }
      `;
      
      const selectedStyles = css`
        background-color: ${props.theme.colors.primary[500]};
        color: #ffffff;
        
        &:hover:not(:disabled) {
          background-color: ${props.theme.colors.primary[600]};
        }
      `;
      
      const disabledStyles = css`
        opacity: 0.5;
        cursor: not-allowed;
        
        &:hover {
          background-color: transparent;
        }
      `;
      
      switch (props.$variant) {
        case 'outlined':
          return css`
            ${baseStyles}
            border: 1px solid ${props.theme.colors.neutral[300]};
            
            ${props.$selected && css`
              ${selectedStyles}
              border-color: ${props.theme.colors.primary[500]};
            `}
            
            ${props.$disabled && disabledStyles}
          `;
        case 'filled':
          return css`
            ${baseStyles}
            background-color: ${props.theme.colors.neutral[100]};
            
            ${props.$selected && selectedStyles}
            ${props.$disabled && disabledStyles}
          `;
        case 'rounded':
          return css`
            ${baseStyles}
            border-radius: ${props.theme.borderRadius.full};
            
            ${props.$selected && selectedStyles}
            ${props.$disabled && disabledStyles}
          `;
        case 'default':
        default:
          return css`
            ${baseStyles}
            
            ${props.$selected && selectedStyles}
            ${props.$disabled && disabledStyles}
          `;
      }
    };
    
    return css`
      ${sizeStyles[props.$size]}
      ${getShapeStyles()}
      ${getVariantStyles()}
    `;
  }}
`;

const PaginationButton = styled.button<{
  $variant: PaginationVariant;
  $size: PaginationSize;
  $shape: PaginationShape;
  $selected: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: ${props => props.$selected ? props.theme.typography.fontWeight.semibold : props.theme.typography.fontWeight.regular};
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const PaginationEllipsis = styled.span<{
  $size: PaginationSize;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  
  ${props => {
    const sizeStyles = {
      sm: css`
        font-size: ${props.theme.typography.fontSize.sm};
        min-width: 2rem;
        height: 2rem;
      `,
      md: css`
        font-size: ${props.theme.typography.fontSize.md};
        min-width: 2.5rem;
        height: 2.5rem;
      `,
      lg: css`
        font-size: ${props.theme.typography.fontSize.lg};
        min-width: 3rem;
        height: 3rem;
      `,
    };
    
    return sizeStyles[props.$size];
  }}
`;

const PaginationJumpToPage = styled.div<{
  $size: PaginationSize;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
  
  ${props => {
    const sizeStyles = {
      sm: css`
        font-size: ${props.theme.typography.fontSize.sm};
      `,
      md: css`
        font-size: ${props.theme.typography.fontSize.md};
      `,
      lg: css`
        font-size: ${props.theme.typography.fontSize.lg};
      `,
    };
    
    return sizeStyles[props.$size];
  }}
`;

const PaginationJumpToPageInput = styled.input<{
  $size: PaginationSize;
}>`
  width: 4rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[200]};
  }
  
  ${props => {
    const sizeStyles = {
      sm: css`
        font-size: ${props.theme.typography.fontSize.sm};
        height: 1.75rem;
      `,
      md: css`
        font-size: ${props.theme.typography.fontSize.md};
        height: 2.25rem;
      `,
      lg: css`
        font-size: ${props.theme.typography.fontSize.lg};
        height: 2.75rem;
      `,
    };
    
    return sizeStyles[props.$size];
  }}
`;

const PaginationJumpToPageButton = styled.button<{
  $size: PaginationSize;
}>`
  padding: 0.25rem 0.75rem;
  background-color: ${props => props.theme.colors.primary[500]};
  color: #ffffff;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primary[600]};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[200]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${props => {
    const sizeStyles = {
      sm: css`
        font-size: ${props.theme.typography.fontSize.sm};
        height: 1.75rem;
      `,
      md: css`
        font-size: ${props.theme.typography.fontSize.md};
        height: 2.25rem;
      `,
      lg: css`
        font-size: ${props.theme.typography.fontSize.lg};
        height: 2.75rem;
      `,
    };
    
    return sizeStyles[props.$size];
  }}
`;

const PaginationPageSize = styled.div<{
  $size: PaginationSize;
}>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  
  ${props => {
    const sizeStyles = {
      sm: css`
        font-size: ${props.theme.typography.fontSize.sm};
      `,
      md: css`
        font-size: ${props.theme.typography.fontSize.md};
      `,
      lg: css`
        font-size: ${props.theme.typography.fontSize.lg};
      `,
    };
    
    return sizeStyles[props.$size];
  }}
`;

const PaginationPageSizeSelect = styled.select<{
  $size: PaginationSize;
}>`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.colors.neutral[300]};
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: inherit;
  background-color: ${props => props.theme.colors.background.paper};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary[200]};
  }
  
  ${props => {
    const sizeStyles = {
      sm: css`
        font-size: ${props.theme.typography.fontSize.sm};
        height: 1.75rem;
      `,
      md: css`
        font-size: ${props.theme.typography.fontSize.md};
        height: 2.25rem;
      `,
      lg: css`
        font-size: ${props.theme.typography.fontSize.lg};
        height: 2.75rem;
      `,
    };
    
    return sizeStyles[props.$size];
  }}
`;

const PaginationInfo = styled.div<{
  $size: PaginationSize;
}>`
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 1rem;
  
  ${props => {
    const sizeStyles = {
      sm: css`
        font-size: ${props.theme.typography.fontSize.sm};
      `,
      md: css`
        font-size: ${props.theme.typography.fontSize.md};
      `,
      lg: css`
        font-size: ${props.theme.typography.fontSize.lg};
      `,
    };
    
    return sizeStyles[props.$size];
  }}
`;

/**
 * Pagination component for navigating through multiple pages of content
 * 
 * @example
 * ```jsx
 * <Pagination
 *   totalPages={10}
 *   currentPage={1}
 *   onPageChange={(page) => console.log(`Page changed to ${page}`)}
 * />
 * ```
 */
export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstButton = true,
  showLastButton = true,
  showPrevButton = true,
  showNextButton = true,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  disabled = false,
  className,
  id,
  style,
  hideOnSinglePage = true,
  showPageNumbers = true,
  prevButtonLabel,
  nextButtonLabel,
  firstButtonLabel,
  lastButtonLabel,
  prevButtonIcon,
  nextButtonIcon,
  firstButtonIcon,
  lastButtonIcon,
  loading = false,
  responsiveCompact = true,
  mobileBreakpoint = 480,
  renderItem,
  showJumpToPage = false,
  jumpToPageLabel = 'Go to page:',
  jumpToPagePlaceholder = 'Page',
  jumpToPageButtonText = 'Go',
  showPageSizeSelector = false,
  pageSizeOptions = [10, 20, 50, 100],
  pageSize = 10,
  onPageSizeChange,
  pageSizeLabel = 'Items per page:',
  showTotalItems = false,
  totalItems,
  totalItemsFormat = '{total} items',
  showItemsRange = false,
  itemsRangeFormat = '{start}-{end} of {total}',
}) => {
  const { theme } = useThemeContext();
  const [jumpToPageValue, setJumpToPageValue] = useState('');
  
  // Reset jump to page value when current page changes
  useEffect(() => {
    setJumpToPageValue('');
  }, [currentPage]);
  
  // Don't render if there's only one page and hideOnSinglePage is true
  if (totalPages <= 1 && hideOnSinglePage) {
    return null;
  }
  
  // Generate page numbers
  const getPageNumbers = () => {
    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(
      Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
      totalPages
    );
    
    const siblingsStart = Math.max(
      Math.min(
        currentPage - siblingCount,
        totalPages - boundaryCount - siblingCount * 2 - 1
      ),
      boundaryCount + 2
    );
    
    const siblingsEnd = Math.min(
      Math.max(
        currentPage + siblingCount,
        boundaryCount + siblingCount * 2 + 2
      ),
      endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
    );
    
    const itemList: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [
      ...startPages,
      ...(siblingsStart > boundaryCount + 2
        ? ['ellipsis-start' as const]
        : boundaryCount + 1 < totalPages - boundaryCount
        ? [boundaryCount + 1]
        : []),
      ...range(siblingsStart, siblingsEnd),
      ...(siblingsEnd < totalPages - boundaryCount - 1
        ? ['ellipsis-end' as const]
        : totalPages - boundaryCount > boundaryCount
        ? [totalPages - boundaryCount]
        : []),
      ...endPages,
    ];
    
    // Remove duplicates
    return Array.from(new Set(itemList));
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  // Handle jump to page
  const handleJumpToPage = () => {
    const page = parseInt(jumpToPageValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpToPageValue('');
    }
  };
  
  // Handle jump to page input change
  const handleJumpToPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpToPageValue(e.target.value);
  };
  
  // Handle jump to page input keydown
  const handleJumpToPageKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJumpToPage();
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(e.target.value, 10);
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };
  
  // Calculate items range
  const getItemsRange = () => {
    if (!totalItems) return '';
    
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    
    return itemsRangeFormat
      .replace('{start}', start.toString())
      .replace('{end}', end.toString())
      .replace('{total}', totalItems.toString());
  };
  
  // Get total items text
  const getTotalItemsText = () => {
    if (!totalItems) return '';
    
    return totalItemsFormat.replace('{total}', totalItems.toString());
  };
  
  // Render pagination item
  const renderPaginationItem = (
    type: 'page' | 'first' | 'last' | 'next' | 'prev' | 'ellipsis',
    page: number,
    selected: boolean
  ) => {
    const isDisabled = disabled || loading || (
      (type === 'first' || type === 'prev') ? currentPage <= 1 :
      (type === 'last' || type === 'next') ? currentPage >= totalPages :
      false
    );
    
    // Use custom renderer if provided
    if (renderItem) {
      return renderItem({
        page,
        selected,
        disabled: isDisabled,
        type,
        onClick: () => handlePageChange(page),
      });
    }
    
    // Render ellipsis
    if (type === 'ellipsis') {
      return (
        <PaginationEllipsis $size={size}>...</PaginationEllipsis>
      );
    }
    
    // Get button content based on type
    const getButtonContent = () => {
      switch (type) {
        case 'first':
          return firstButtonIcon || firstButtonLabel || <Icon name="ChevronLeft" />;
        case 'prev':
          return prevButtonIcon || prevButtonLabel || <Icon name="ChevronLeft" />;
        case 'next':
          return nextButtonIcon || nextButtonLabel || <Icon name="ChevronRight" />;
        case 'last':
          return lastButtonIcon || lastButtonLabel || <Icon name="ChevronRight" />;
        case 'page':
          return page;
        default:
          return null;
      }
    };
    
    // Get aria label based on type
    const getAriaLabel = () => {
      switch (type) {
        case 'first':
          return 'Go to first page';
        case 'prev':
          return 'Go to previous page';
        case 'next':
          return 'Go to next page';
        case 'last':
          return 'Go to last page';
        case 'page':
          return `Go to page ${page}`;
        default:
          return '';
      }
    };
    
    return (
      <PaginationItem
        $variant={variant}
        $size={size}
        $shape={shape}
        $selected={selected}
        $disabled={isDisabled}
        className={`pagination-item ${type !== 'page' ? 'pagination-item-extended' : ''}`}
      >
        <PaginationButton
          $variant={variant}
          $size={size}
          $shape={shape}
          $selected={selected}
          onClick={() => handlePageChange(page)}
          disabled={isDisabled}
          aria-label={getAriaLabel()}
          aria-current={selected ? 'page' : undefined}
        >
          {getButtonContent()}
        </PaginationButton>
      </PaginationItem>
    );
  };
  
  // Get page numbers to display
  const pageNumbers = getPageNumbers();
  
  return (
    <PaginationContainer
      $disabled={disabled || loading}
      $size={size}
      $responsiveCompact={responsiveCompact}
      $mobileBreakpoint={mobileBreakpoint}
      className={className}
      id={id}
      style={style}
      aria-label="Pagination"
    >
      {showPageSizeSelector && (
        <PaginationPageSize $size={size}>
          <label htmlFor="page-size-select">{pageSizeLabel}</label>
          <PaginationPageSizeSelect
            id="page-size-select"
            $size={size}
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={disabled || loading}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </PaginationPageSizeSelect>
        </PaginationPageSize>
      )}
      
      {(showTotalItems || showItemsRange) && totalItems && (
        <PaginationInfo $size={size}>
          {showItemsRange ? getItemsRange() : getTotalItemsText()}
        </PaginationInfo>
      )}
      
      <PaginationList>
        {showFirstButton && (
          renderPaginationItem('first', 1, false)
        )}
        
        {showPrevButton && (
          renderPaginationItem('prev', currentPage - 1, false)
        )}
        
        {showPageNumbers && pageNumbers.map((item, index) => {
          if (item === 'ellipsis-start' || item === 'ellipsis-end') {
            return (
              <li key={`${item}-${index}`}>
                <PaginationEllipsis $size={size}>...</PaginationEllipsis>
              </li>
            );
          }
          
          return (
            <li key={item}>
              {renderPaginationItem('page', item, item === currentPage)}
            </li>
          );
        })}
        
        {showNextButton && (
          renderPaginationItem('next', currentPage + 1, false)
        )}
        
        {showLastButton && (
          renderPaginationItem('last', totalPages, false)
        )}
      </PaginationList>
      
      {showJumpToPage && (
        <PaginationJumpToPage $size={size}>
          <label htmlFor="jump-to-page-input">{jumpToPageLabel}</label>
          <PaginationJumpToPageInput
            id="jump-to-page-input"
            $size={size}
            type="number"
            min={1}
            max={totalPages}
            value={jumpToPageValue}
            onChange={handleJumpToPageInputChange}
            onKeyDown={handleJumpToPageKeyDown}
            placeholder={jumpToPagePlaceholder}
            disabled={disabled || loading}
          />
          <PaginationJumpToPageButton
            $size={size}
            onClick={handleJumpToPage}
            disabled={disabled || loading || !jumpToPageValue}
          >
            {jumpToPageButtonText}
          </PaginationJumpToPageButton>
        </PaginationJumpToPage>
      )}
    </PaginationContainer>
  );
};
