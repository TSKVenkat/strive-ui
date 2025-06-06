import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '../Box';

// Types
export interface Column<T = any> {
  id: string;
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => any);
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  sticky?: boolean;
  footer?: React.ReactNode | ((data: T[]) => React.ReactNode);
}

export interface DataTableProps<T = any> {
  /**
   * Table data
   */
  data: T[];
  /**
   * Table columns
   */
  columns: Column<T>[];
  /**
   * Whether the table is loading
   */
  loading?: boolean;
  /**
   * Loading component
   */
  loadingComponent?: React.ReactNode;
  /**
   * Whether to enable sorting
   */
  sortable?: boolean;
  /**
   * Initial sort
   */
  initialSort?: { id: string; desc: boolean };
  /**
   * Whether to enable filtering
   */
  filterable?: boolean;
  /**
   * Whether to enable pagination
   */
  pagination?: boolean;
  /**
   * Page size
   */
  pageSize?: number;
  /**
   * Page size options
   */
  pageSizeOptions?: number[];
  /**
   * Whether to enable row selection
   */
  selectable?: boolean;
  /**
   * Selection type
   */
  selectionType?: 'single' | 'multiple';
  /**
   * Selected row IDs
   */
  selectedRowIds?: Record<string, boolean>;
  /**
   * Row selection change handler
   */
  onSelectionChange?: (selectedRowIds: Record<string, boolean>) => void;
  /**
   * Row click handler
   */
  onRowClick?: (row: T) => void;
  /**
   * Whether rows are expandable
   */
  expandable?: boolean;
  /**
   * Expanded row renderer
   */
  renderExpandedRow?: (row: T) => React.ReactNode;
  /**
   * Whether to enable resizing
   */
  resizable?: boolean;
  /**
   * Whether to enable reordering
   */
  reorderable?: boolean;
  /**
   * Whether to enable sticky header
   */
  stickyHeader?: boolean;
  /**
   * Whether to enable sticky footer
   */
  stickyFooter?: boolean;
  /**
   * Whether to enable virtualization
   */
  virtualized?: boolean;
  /**
   * Whether to show borders
   */
  bordered?: boolean;
  /**
   * Whether to stripe rows
   */
  striped?: boolean;
  /**
   * Whether to highlight rows on hover
   */
  highlightOnHover?: boolean;
  /**
   * Whether to make the table dense
   */
  dense?: boolean;
  /**
   * Table size
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Empty state component
   */
  emptyComponent?: React.ReactNode;
  /**
   * Table caption
   */
  caption?: React.ReactNode;
  /**
   * Whether to show the column visibility toggle
   */
  showColumnToggle?: boolean;
  /**
   * Whether to show the table toolbar
   */
  showToolbar?: boolean;
  /**
   * Custom toolbar component
   */
  toolbar?: React.ReactNode;
  /**
   * Custom footer component
   */
  footer?: React.ReactNode;
  /**
   * Custom row renderer
   */
  renderRow?: (row: T, index: number) => React.ReactNode;
  /**
   * Row key function
   */
  getRowId?: (row: T) => string;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Styled components
const TableContainer = styled(Box)<{ $bordered: boolean }>`
  position: relative;
  width: 100%;
  overflow: auto;
  border: ${({ $bordered, theme }) => $bordered ? `1px solid ${theme.colors.neutral[200]}` : 'none'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StyledTable = styled.table<{ $size: string; $bordered: boolean; $striped: boolean }>`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: ${({ theme, $size }) => {
    switch ($size) {
      case 'sm': return theme.typography.fontSize.xs;
      case 'lg': return theme.typography.fontSize.md;
      default: return theme.typography.fontSize.sm;
    }
  }};
`;

const TableHead = styled.thead<{ $sticky: boolean }>`
  position: ${({ $sticky }) => $sticky ? 'sticky' : 'relative'};
  top: 0;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.common.white};
`;

const TableBody = styled.tbody``;

const TableFoot = styled.tfoot<{ $sticky: boolean }>`
  position: ${({ $sticky }) => $sticky ? 'sticky' : 'relative'};
  bottom: 0;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.common.white};
`;

const TableRow = styled(motion.tr)<{ 
  $selected: boolean; 
  $clickable: boolean; 
  $highlight: boolean;
  $striped: boolean;
  $index: number;
}>`
  background-color: ${({ $selected, $striped, $index, theme }) => 
    $selected 
      ? theme.colors.primary[50] 
      : ($striped && $index % 2 === 1 ? theme.colors.neutral[50] : theme.colors.common.white)
  };
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};
  
  &:hover {
    background-color: ${({ $highlight, $selected, theme }) => 
      $highlight 
        ? ($selected ? theme.colors.primary[100] : theme.colors.neutral[100]) 
        : ($selected ? theme.colors.primary[50] : 'inherit')
    };
  }
`;

const TableHeaderCell = styled.th<{ 
  $align: string; 
  $sortable: boolean; 
  $sorted: boolean;
  $width?: string | number;
  $minWidth?: string | number;
  $maxWidth?: string | number;
  $sticky: boolean;
}>`
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: ${({ $align }) => $align};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[800]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  position: ${({ $sticky }) => $sticky ? 'sticky' : 'relative'};
  left: ${({ $sticky }) => $sticky ? 0 : 'auto'};
  z-index: ${({ $sticky }) => $sticky ? 1 : 'auto'};
  width: ${({ $width }) => $width ? (typeof $width === 'number' ? `${$width}px` : $width) : 'auto'};
  min-width: ${({ $minWidth }) => $minWidth ? (typeof $minWidth === 'number' ? `${$minWidth}px` : $minWidth) : 'auto'};
  max-width: ${({ $maxWidth }) => $maxWidth ? (typeof $maxWidth === 'number' ? `${$maxWidth}px` : $maxWidth) : 'none'};
  cursor: ${({ $sortable }) => $sortable ? 'pointer' : 'default'};
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ $sortable, theme }) => $sortable ? theme.colors.neutral[100] : theme.colors.neutral[50]};
  }
`;

const TableCell = styled.td<{ 
  $align: string;
  $width?: string | number;
  $minWidth?: string | number;
  $maxWidth?: string | number;
  $sticky: boolean;
}>`
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: ${({ $align }) => $align};
  color: ${({ theme }) => theme.colors.neutral[800]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  position: ${({ $sticky }) => $sticky ? 'sticky' : 'relative'};
  left: ${({ $sticky }) => $sticky ? 0 : 'auto'};
  z-index: ${({ $sticky }) => $sticky ? 1 : 'auto'};
  background-color: inherit;
  width: ${({ $width }) => $width ? (typeof $width === 'number' ? `${$width}px` : $width) : 'auto'};
  min-width: ${({ $minWidth }) => $minWidth ? (typeof $minWidth === 'number' ? `${$minWidth}px` : $minWidth) : 'auto'};
  max-width: ${({ $maxWidth }) => $maxWidth ? (typeof $maxWidth === 'number' ? `${$maxWidth}px` : $maxWidth) : 'none'};
`;

const SortIcon = styled.span<{ $direction?: 'asc' | 'desc' }>`
  display: inline-block;
  margin-left: ${({ theme }) => theme.spacing[1]};
  transition: transform 0.2s ease;
  transform: ${({ $direction }) => 
    $direction === 'asc' 
      ? 'rotate(0deg)' 
      : $direction === 'desc' 
        ? 'rotate(180deg)' 
        : 'rotate(0deg)'
  };
  opacity: ${({ $direction }) => $direction ? 1 : 0.3};
`;

const ExpandedRow = styled.tr`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const ExpandedContent = styled.td`
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 10;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const PageInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const PageButton = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ $active, theme }) => $active ? theme.colors.primary.main : theme.colors.neutral[300]};
  background-color: ${({ $active, theme }) => $active ? theme.colors.primary.main : theme.colors.common.white};
  color: ${({ $active, theme }) => $active ? theme.colors.common.white : theme.colors.neutral[700]};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ $disabled }) => $disabled ? 0.5 : 1};
  
  &:hover {
    background-color: ${({ $active, $disabled, theme }) => 
      $disabled 
        ? ($active ? theme.colors.primary.main : theme.colors.common.white) 
        : ($active ? theme.colors.primary.dark : theme.colors.neutral[100])
    };
  }
`;

const PageSizeSelector = styled.select`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ theme }) => theme.colors.common.white};
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  background-color: ${({ theme }) => theme.colors.common.white};
  color: ${({ theme }) => theme.colors.neutral[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  width: 200px;
`;

/**
 * DataTable component provides a flexible and feature-rich table
 * for displaying and interacting with structured data.
 */
export function DataTable<T extends object = any>({
  data = [],
  columns = [],
  loading = false,
  loadingComponent,
  sortable = true,
  initialSort,
  filterable = true,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  selectable = false,
  selectionType = 'multiple',
  selectedRowIds = {},
  onSelectionChange,
  onRowClick,
  expandable = false,
  renderExpandedRow,
  resizable = false,
  reorderable = false,
  stickyHeader = true,
  stickyFooter = false,
  virtualized = false,
  bordered = true,
  striped = true,
  highlightOnHover = true,
  dense = false,
  size = 'md',
  emptyComponent,
  caption,
  showColumnToggle = false,
  showToolbar = true,
  toolbar,
  footer,
  renderRow,
  getRowId = (row: T) => (row as any).id,
  css,
  children
}: DataTableProps<T>) {
  // State
  const [sortBy, setSortBy] = useState<{ id: string; desc: boolean } | undefined>(initialSort);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [selected, setSelected] = useState<Record<string, boolean>>(selectedRowIds || {});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    columns.reduce((acc, column) => ({ ...acc, [column.id]: !column.hidden }), {})
  );

  // Update selected rows when selectedRowIds changes
  useEffect(() => {
    if (selectedRowIds) {
      setSelected(selectedRowIds);
    }
  }, [selectedRowIds]);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Apply column filters
    Object.entries(filters).forEach(([columnId, filterValue]) => {
      if (!filterValue) return;

      const column = columns.find(col => col.id === columnId);
      if (!column) return;

      filtered = filtered.filter(row => {
        const value = typeof column.accessor === 'function'
          ? column.accessor(row)
          : row[column.accessor as keyof T];

        if (typeof value === 'string') {
          return value.toLowerCase().includes(filterValue.toLowerCase());
        }
        
        return String(value).includes(String(filterValue));
      });
    });

    // Apply global filter
    if (globalFilter) {
      filtered = filtered.filter(row => {
        return columns.some(column => {
          const value = typeof column.accessor === 'function'
            ? column.accessor(row)
            : row[column.accessor as keyof T];

          if (typeof value === 'string') {
            return value.toLowerCase().includes(globalFilter.toLowerCase());
          }
          
          return String(value).includes(globalFilter);
        });
      });
    }

    return filtered;
  }, [data, filters, globalFilter, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortBy) return filteredData;

    const column = columns.find(col => col.id === sortBy.id);
    if (!column) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valueA = typeof column.accessor === 'function'
        ? column.accessor(a)
        : a[column.accessor as keyof T];
      
      const valueB = typeof column.accessor === 'function'
        ? column.accessor(b)
        : b[column.accessor as keyof T];

      if (valueA === valueB) return 0;

      const direction = sortBy.desc ? -1 : 1;

      if (valueA === null || valueA === undefined) return direction;
      if (valueB === null || valueB === undefined) return -direction;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * direction;
      }

      return (valueA > valueB ? 1 : -1) * direction;
    });
  }, [filteredData, sortBy, columns]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const start = currentPage * currentPageSize;
    const end = start + currentPageSize;

    return sortedData.slice(start, end);
  }, [sortedData, pagination, currentPage, currentPageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!pagination) return 1;
    return Math.ceil(sortedData.length / currentPageSize);
  }, [sortedData, pagination, currentPageSize]);

  // Handle sort
  const handleSort = (columnId: string) => {
    if (!sortable) return;

    const column = columns.find(col => col.id === columnId);
    if (!column || column.sortable === false) return;

    setSortBy(prev => {
      if (prev?.id === columnId) {
        return prev.desc ? undefined : { id: columnId, desc: true };
      }
      return { id: columnId, desc: false };
    });
  };

  // Handle filter
  const handleFilter = (columnId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value
    }));
    setCurrentPage(0);
  };

  // Handle global filter
  const handleGlobalFilter = (value: string) => {
    setGlobalFilter(value);
    setCurrentPage(0);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(0);
  };

  // Handle row selection
  const handleRowSelection = (rowId: string) => {
    if (!selectable) return;

    setSelected(prev => {
      const newSelected = { ...prev };

      if (selectionType === 'single') {
        Object.keys(newSelected).forEach(key => {
          newSelected[key] = false;
        });
      }

      newSelected[rowId] = !newSelected[rowId];

      if (onSelectionChange) {
        onSelectionChange(newSelected);
      }

      return newSelected;
    });
  };

  // Handle row expansion
  const handleRowExpansion = (rowId: string) => {
    if (!expandable) return;

    setExpanded(prev => ({
      ...prev,
      [rowId]: !prev[rowId]
    }));
  };

  // Handle column visibility
  const handleColumnVisibility = (columnId: string, visible: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnId]: visible
    }));
  };

  // Render table header
  const renderHeader = () => {
    return (
      <TableHead $sticky={stickyHeader}>
        <tr>
          {columns
            .filter(column => visibleColumns[column.id])
            .map(column => (
              <TableHeaderCell
                key={column.id}
                $align={column.align || 'left'}
                $sortable={sortable && column.sortable !== false}
                $sorted={sortBy?.id === column.id}
                $width={column.width}
                $minWidth={column.minWidth}
                $maxWidth={column.maxWidth}
                $sticky={column.sticky || false}
                onClick={() => handleSort(column.id)}
              >
                {column.header}
                {sortable && column.sortable !== false && (
                  <SortIcon $direction={sortBy?.id === column.id ? (sortBy.desc ? 'desc' : 'asc') : undefined}>
                    ▲
                  </SortIcon>
                )}
              </TableHeaderCell>
            ))}
        </tr>
      </TableHead>
    );
  };

  // Render table body
  const renderBody = () => {
    if (paginatedData.length === 0) {
      return (
        <TableBody>
          <tr>
            <td colSpan={columns.filter(column => visibleColumns[column.id]).length}>
              {emptyComponent || (
                <EmptyState>
                  <div>No data available</div>
                </EmptyState>
              )}
            </td>
          </tr>
        </TableBody>
      );
    }

    return (
      <TableBody>
        {paginatedData.map((row, rowIndex) => {
          const rowId = getRowId(row);
          const isSelected = !!selected[rowId];
          const isExpanded = !!expanded[rowId];

          return (
            <React.Fragment key={rowId}>
              <TableRow
                $selected={isSelected}
                $clickable={!!onRowClick || selectable || expandable}
                $highlight={highlightOnHover}
                $striped={striped}
                $index={rowIndex}
                onClick={() => {
                  if (onRowClick) onRowClick(row);
                  if (selectable) handleRowSelection(rowId);
                  if (expandable) handleRowExpansion(rowId);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {columns
                  .filter(column => visibleColumns[column.id])
                  .map(column => {
                    const value = typeof column.accessor === 'function'
                      ? column.accessor(row)
                      : row[column.accessor as keyof T];

                    return (
                      <TableCell
                        key={column.id}
                        $align={column.align || 'left'}
                        $width={column.width}
                        $minWidth={column.minWidth}
                        $maxWidth={column.maxWidth}
                        $sticky={column.sticky || false}
                      >
                        {column.cell ? column.cell(value, row) : value}
                      </TableCell>
                    );
                  })}
              </TableRow>
              {expandable && isExpanded && (
                <ExpandedRow>
                  <ExpandedContent colSpan={columns.filter(column => visibleColumns[column.id]).length}>
                    {renderExpandedRow?.(row)}
                  </ExpandedContent>
                </ExpandedRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    );
  };

  // Render table footer
  const renderFooter = () => {
    if (!columns.some(column => column.footer)) return null;

    return (
      <TableFoot $sticky={stickyFooter}>
        <tr>
          {columns
            .filter(column => visibleColumns[column.id])
            .map(column => (
              <TableCell
                key={column.id}
                $align={column.align || 'left'}
                $width={column.width}
                $minWidth={column.minWidth}
                $maxWidth={column.maxWidth}
                $sticky={column.sticky || false}
              >
                {typeof column.footer === 'function' ? column.footer(data) : column.footer}
              </TableCell>
            ))}
        </tr>
      </TableFoot>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination) return null;

    return (
      <Pagination>
        <PageInfo>
          Showing {currentPage * currentPageSize + 1} to {Math.min((currentPage + 1) * currentPageSize, sortedData.length)} of {sortedData.length} entries
        </PageInfo>
        <div>
          <PageControls>
            <PageButton
              $disabled={currentPage === 0}
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
            >
              «
            </PageButton>
            <PageButton
              $disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              ‹
            </PageButton>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = currentPage;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > totalPages - 3) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <PageButton
                  key={pageNum}
                  $active={currentPage === pageNum}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum + 1}
                </PageButton>
              );
            })}
            
            <PageButton
              $disabled={currentPage === totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              ›
            </PageButton>
            <PageButton
              $disabled={currentPage === totalPages - 1}
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
            >
              »
            </PageButton>
          </PageControls>
          
          <PageSizeSelector
            value={currentPageSize}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </PageSizeSelector>
        </div>
      </Pagination>
    );
  };

  // Render toolbar
  const renderToolbar = () => {
    if (!showToolbar) return null;

    if (toolbar) return toolbar;

    return (
      <Toolbar>
        <ToolbarActions>
          {filterable && (
            <SearchInput
              placeholder="Search..."
              value={globalFilter}
              onChange={e => handleGlobalFilter(e.target.value)}
            />
          )}
        </ToolbarActions>
      </Toolbar>
    );
  };

  return (
    <Box style={css}>
      {renderToolbar()}
      
      <TableContainer $bordered={bordered}>
        <StyledTable $size={size} $bordered={bordered} $striped={striped}>
          {caption && <caption>{caption}</caption>}
          {renderHeader()}
          {renderBody()}
          {renderFooter()}
        </StyledTable>
        
        <AnimatePresence>
          {loading && (
            <LoadingOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loadingComponent || <div>Loading...</div>}
            </LoadingOverlay>
          )}
        </AnimatePresence>
      </TableContainer>
      
      {renderPagination()}
      
      {footer}
      {children}
    </Box>
  );
}

export default DataTable;
