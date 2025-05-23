import React from 'react';
import styled, { css } from 'styled-components';
import { TableHeadless, TableColumn } from './TableHeadless';
import { Box } from '../Box/Box';
import { Icon } from '../Icon/Icon';

// Styled components
const StyledTable = styled(TableHeadless.Table)`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const StyledHeader = styled(TableHeadless.Header)`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const StyledHeaderRow = styled(TableHeadless.HeaderRow)`
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const StyledHeaderCell = styled(TableHeadless.HeaderCell)`
  padding: ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-align: left;
  color: ${({ theme }) => theme.colors.neutral[700]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  position: relative;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const SortIcon = styled.span`
  margin-left: ${({ theme }) => theme.spacing[1]};
  display: inline-flex;
  align-items: center;
`;

const StyledBody = styled(TableHeadless.Body)`
  background-color: ${({ theme }) => theme.colors.common.white};
`;

const StyledRow = styled(TableHeadless.Row)<{ $clickable?: boolean }>`
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[50]};
  }
  
  ${({ $clickable }) => $clickable && css`
    cursor: pointer;
  `}
`;

const StyledSelectedRow = styled(StyledRow)`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[100]};
  }
`;

const StyledExpandedRow = styled(StyledRow)`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const StyledCell = styled(TableHeadless.Cell)`
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  color: ${({ theme }) => theme.colors.neutral[800]};
`;

const StyledFooter = styled(TableHeadless.Footer)`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const StyledFooterRow = styled(TableHeadless.FooterRow)`
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const StyledFooterCell = styled(TableHeadless.FooterCell)`
  padding: ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-align: left;
  color: ${({ theme }) => theme.colors.neutral[700]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const StyledPagination = styled(TableHeadless.Pagination)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const PageSizeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const PageSizeSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.common.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PageInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const PaginationButton = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.common.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  ${({ $disabled, theme }) => $disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: ${theme.colors.common.white};
    }
  `}
`;

const StyledSelectionCell = styled(TableHeadless.SelectionCell)`
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  width: 40px;
  text-align: center;
`;

const StyledExpandCell = styled(TableHeadless.ExpandCell)`
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  width: 40px;
  text-align: center;
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.common.white};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const StyledFilter = styled(TableHeadless.Filter)`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[1]};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[300]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const StyledColumnToggle = styled(TableHeadless.ColumnToggle)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const StyledEmpty = styled(TableHeadless.Empty)`
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const StyledLoading = styled(TableHeadless.Loading)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.neutral[700]};
`;

const TableContainer = styled.div`
  position: relative;
  overflow: auto;
`;

export interface TableProps<T extends object = any> {
  /**
   * Data to display in the table
   */
  data: T[];
  /**
   * Column definitions
   */
  columns: TableColumn<T>[];
  /**
   * Whether to enable row selection
   */
  selectable?: boolean;
  /**
   * Whether to enable row expansion
   */
  expandable?: boolean;
  /**
   * Render function for expanded rows
   */
  renderExpandedRow?: (row: T, index: number) => React.ReactNode;
  /**
   * Whether to enable pagination
   */
  pagination?: boolean;
  /**
   * Default page size
   */
  defaultPageSize?: number;
  /**
   * Available page sizes
   */
  pageSizeOptions?: number[];
  /**
   * Whether to enable filtering
   */
  filterable?: boolean;
  /**
   * Whether to enable sorting
   */
  sortable?: boolean;
  /**
   * Whether to enable column visibility toggle
   */
  toggleableColumns?: boolean;
  /**
   * Whether to show the table footer
   */
  showFooter?: boolean;
  /**
   * Whether the table is loading
   */
  loading?: boolean;
  /**
   * Loading message
   */
  loadingMessage?: React.ReactNode;
  /**
   * Empty state message
   */
  emptyMessage?: React.ReactNode;
  /**
   * Callback when a row is clicked
   */
  onRowClick?: (row: T, index: number) => void;
  /**
   * Callback when row selection changes
   */
  onSelectionChange?: (selectedRows: Record<string, boolean>) => void;
  /**
   * Callback when row expansion changes
   */
  onExpandChange?: (expandedRows: Record<string, boolean>) => void;
  /**
   * Callback when sort changes
   */
  onSortChange?: (sortBy: { id: string; direction: 'asc' | 'desc' | null }) => void;
  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;
  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * Callback when filters change
   */
  onFilterChange?: (filters: Record<string, any>) => void;
  /**
   * Class name for the table container
   */
  className?: string;
  /**
   * Style object for the table container
   */
  style?: React.CSSProperties;
}

/**
 * Table component for displaying data in a tabular format with features like
 * sorting, filtering, pagination, selection, and expansion.
 */
export function Table<T extends object = any>({
  data,
  columns,
  selectable = false,
  expandable = false,
  renderExpandedRow,
  pagination = true,
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  filterable = false,
  sortable = true,
  toggleableColumns = false,
  showFooter = false,
  loading = false,
  loadingMessage = 'Loading...',
  emptyMessage = 'No data available',
  onRowClick,
  onSelectionChange,
  onExpandChange,
  onSortChange,
  onPageChange,
  onPageSizeChange,
  onFilterChange,
  className,
  style,
}: TableProps<T>) {
  // Prepare columns with sortable property
  const enhancedColumns = React.useMemo(() => {
    return columns.map(column => ({
      ...column,
      sortable: column.sortable !== undefined ? column.sortable : sortable,
    }));
  }, [columns, sortable]);
  
  // Render expanded row content
  const renderExpanded = (row: T, index: number) => {
    if (!expandable || !renderExpandedRow) return null;
    
    return (
      <tr>
        <td colSpan={enhancedColumns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0)}>
          <Box padding={3}>
            {renderExpandedRow(row, index)}
          </Box>
        </td>
      </tr>
    );
  };
  
  return (
    <TableHeadless.Root
      data={data}
      columns={enhancedColumns}
      initialState={{
        pageSize: defaultPageSize,
      }}
      onRowClick={onRowClick}
      onRowSelect={onSelectionChange}
      onRowExpand={onExpandChange}
      onSort={onSortChange}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onFilterChange={onFilterChange}
      disableSelection={!selectable}
      disableExpanding={!expandable}
      disablePagination={!pagination}
      disableFilters={!filterable}
      disableSortBy={!sortable}
      disableColumnHiding={!toggleableColumns}
      className={className}
      style={style}
    >
      <TableContainer>
        <StyledTable>
          <StyledHeader>
            <StyledHeaderRow>
              {selectable && (
                <StyledSelectionCell />
              )}
              
              {expandable && (
                <StyledHeaderCell
                  column={{ id: 'expand', header: '', accessor: '' }}
                  showSortIndicator={false}
                />
              )}
              
              {enhancedColumns.map(column => (
                <StyledHeaderCell
                  key={column.id}
                  column={column}
                  sortAscIcon={<SortIcon>↑</SortIcon>}
                  sortDescIcon={<SortIcon>↓</SortIcon>}
                  sortNoneIcon={<SortIcon>↕</SortIcon>}
                />
              ))}
            </StyledHeaderRow>
            
            {filterable && (
              <StyledHeaderRow>
                {selectable && <td />}
                {expandable && <td />}
                
                {enhancedColumns.map(column => (
                  <td key={column.id}>
                    <StyledFilter
                      column={column}
                      placeholder={`Filter ${String(column.header)}...`}
                    />
                  </td>
                ))}
              </StyledHeaderRow>
            )}
          </StyledHeader>
          
          <StyledBody>
            <TableHeadless.Empty message={emptyMessage} />
            
            {data.map((row, rowIndex) => {
              const { selected, expanded } = TableHeadless.useTableContext<T>().getRowProps(row, rowIndex);
              
              const RowComponent = selected ? StyledSelectedRow : expanded ? StyledExpandedRow : StyledRow;
              
              return (
                <React.Fragment key={rowIndex}>
                  <RowComponent
                    row={row}
                    index={rowIndex}
                    $clickable={!!onRowClick}
                  >
                    {selectable && (
                      <StyledSelectionCell
                        row={row}
                        index={rowIndex}
                      />
                    )}
                    
                    {expandable && (
                      <StyledExpandCell
                        row={row}
                        index={rowIndex}
                        expandIcon={<span>+</span>}
                        collapseIcon={<span>-</span>}
                      />
                    )}
                    
                    {enhancedColumns.map(column => (
                      <StyledCell
                        key={column.id}
                        column={column}
                        row={row}
                        index={rowIndex}
                      />
                    ))}
                  </RowComponent>
                  
                  {expanded && renderExpanded(row, rowIndex)}
                </React.Fragment>
              );
            })}
          </StyledBody>
          
          {showFooter && (
            <StyledFooter>
              <StyledFooterRow>
                {selectable && <td />}
                {expandable && <td />}
                
                {enhancedColumns.map(column => (
                  <StyledFooterCell
                    key={column.id}
                    column={column}
                  />
                ))}
              </StyledFooterRow>
            </StyledFooter>
          )}
        </StyledTable>
        
        <TableHeadless.Loading
          loading={loading}
          message={loadingMessage}
          className={StyledLoading.toString()}
        />
      </TableContainer>
      
      {pagination && (
        <StyledPagination
          showPageSizeOptions={true}
          showPageInfo={true}
          prevLabel={<span>Previous</span>}
          nextLabel={<span>Next</span>}
          pageSizeLabel="Rows per page:"
        />
      )}
    </TableHeadless.Root>
  );
}

export default Table;
