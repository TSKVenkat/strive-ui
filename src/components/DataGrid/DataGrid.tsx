import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { DataGridHeadless, DataGridProps as HeadlessDataGridProps } from './DataGridHeadless';
import { DataGridOptions, DataGridColumn, DataGridExportFormat } from './useDataGrid';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Styled components
const StyledDataGrid = styled(DataGridHeadless.DataGrid)`
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.common.white};
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  &:focus-within {
    outline: 2px solid ${({ theme }) => theme.colors.primary[300]};
    outline-offset: 2px;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      transition: none !important;
      animation: none !important;
    }
  }
`;

const StyledHeader = styled(DataGridHeadless.Header)`
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const StyledHeaderRow = styled(DataGridHeadless.HeaderRow)`
  height: 48px;
`;

const StyledHeaderCell = styled(DataGridHeadless.HeaderCell)<{ $pinned?: 'left' | 'right' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[800]};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  ${({ $pinned }) => $pinned === 'left' && css`
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: ${({ theme }) => theme.colors.neutral[50]};
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  `}
  
  ${({ $pinned }) => $pinned === 'right' && css`
    position: sticky;
    right: 0;
    z-index: 2;
    background-color: ${({ theme }) => theme.colors.neutral[50]};
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
  `}
  
  &:last-child {
    border-right: none;
  }
`;

const StyledBody = styled(DataGridHeadless.Body)`
  flex: 1;
  overflow: auto;
`;

const StyledRow = styled(DataGridHeadless.Row)<{ $selected?: boolean; $hovered?: boolean }>`
  height: 40px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[50]};
  }
  
  ${({ $selected }) => $selected && css`
    background-color: ${({ theme }) => theme.colors.primary[50]};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary[100]};
    }
  `}
  
  &:last-child {
    border-bottom: none;
  }
`;

const StyledCell = styled(DataGridHeadless.Cell)<{ $pinned?: 'left' | 'right'; $editable?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-right: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  ${({ $pinned }) => $pinned === 'left' && css`
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: inherit;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  `}
  
  ${({ $pinned }) => $pinned === 'right' && css`
    position: sticky;
    right: 0;
    z-index: 1;
    background-color: inherit;
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
  `}
  
  ${({ $editable }) => $editable && css`
    cursor: pointer;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.neutral[100]};
    }
  `}
  
  &:last-child {
    border-right: none;
  }
  
  input, select, textarea {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[1]};
    border: 1px solid ${({ theme }) => theme.colors.primary[300]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    outline: none;
    
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
    }
  }
`;

const StyledGroupRow = styled(DataGridHeadless.GroupRow)`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
`;

const StyledToolbar = styled(DataGridHeadless.Toolbar)`
  padding: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  gap: ${({ theme }) => theme.spacing[2]};
`;

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.common.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[200]};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;

const StyledColumnSelector = styled(DataGridHeadless.ColumnSelector)`
  position: relative;
`;

const StyledExportButton = styled(DataGridHeadless.ExportButton)`
  ${StyledButton}
`;

const StyledGroupByArea = styled(DataGridHeadless.GroupByArea)`
  margin: ${({ theme }) => theme.spacing[2]};
`;

const StyledGroupByChip = styled(DataGridHeadless.GroupByChip)`
  background-color: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[800]};
  
  button {
    color: ${({ theme }) => theme.colors.primary[800]};
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary[900]};
    }
  }
`;

const StyledLoading = styled(DataGridHeadless.Loading)`
  background-color: rgba(255, 255, 255, 0.8);
  color: ${({ theme }) => theme.colors.primary[500]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StyledEmpty = styled(DataGridHeadless.Empty)`
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-style: italic;
`;

const StyledPagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  
  .pagination-info {
    color: ${({ theme }) => theme.colors.neutral[600]};
  }
  
  .pagination-controls {
    display: flex;
    gap: ${({ theme }) => theme.spacing[1]};
  }
  
  .page-size-selector {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[1]};
    
    label {
      color: ${({ theme }) => theme.colors.neutral[600]};
    }
    
    select {
      padding: ${({ theme }) => theme.spacing[1]};
      border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      background-color: ${({ theme }) => theme.colors.common.white};
    }
  }
`;

const StyledPaginationButton = styled.button<{ $active?: boolean }>`
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary[500] : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary[50] : theme.colors.common.white};
  color: ${({ theme, $active }) => $active ? theme.colors.primary[700] : theme.colors.neutral[700]};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme, $active }) => $active ? theme.colors.primary[100] : theme.colors.neutral[50]};
    border-color: ${({ theme, $active }) => $active ? theme.colors.primary[600] : theme.colors.neutral[400]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// DataGrid component props
export interface DataGridProps<T extends object = any> extends Omit<DataGridOptions<T>, 'columns'> {
  /**
   * Columns configuration
   */
  columns: DataGridColumn<T>[];
  /**
   * Data to display
   */
  data: T[];
  /**
   * Whether the data is loading
   */
  loading?: boolean;
  /**
   * Message to display when loading
   */
  loadingMessage?: React.ReactNode;
  /**
   * Message to display when there is no data
   */
  emptyMessage?: React.ReactNode;
  /**
   * Whether to show the toolbar
   */
  showToolbar?: boolean;
  /**
   * Whether to show the column selector
   */
  showColumnSelector?: boolean;
  /**
   * Whether to show the export button
   */
  showExportButton?: boolean;
  /**
   * Export formats to show
   */
  exportFormats?: DataGridExportFormat[];
  /**
   * Whether to show the group by area
   */
  showGroupByArea?: boolean;
  /**
   * Whether to show the pagination
   */
  showPagination?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

/**
 * DataGrid component for displaying and interacting with tabular data.
 * Features include sorting, filtering, pagination, row selection, column resizing,
 * cell editing, row grouping, virtualization, and more.
 *
 * @example
 * ```jsx
 * import { DataGrid } from 'pulseui';
 *
 * const columns = [
 *   { id: 'name', header: 'Name', width: 200 },
 *   { id: 'age', header: 'Age', width: 100 },
 *   { id: 'email', header: 'Email', width: 300 },
 * ];
 *
 * const data = [
 *   { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
 *   { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
 * ];
 *
 * function MyComponent() {
 *   return (
 *     <DataGrid
 *       columns={columns}
 *       data={data}
 *       enableSorting
 *       enablePagination
 *       pageSize={10}
 *     />
 *   );
 * }
 * ```
 */
export const DataGrid = forwardRef(<T extends object = any>(
  {
    columns,
    data,
    loading = false,
    loadingMessage,
    emptyMessage,
    showToolbar = true,
    showColumnSelector = true,
    showExportButton = true,
    exportFormats = ['csv', 'json'],
    showGroupByArea = false,
    showPagination = true,
    className,
    style,
    enableColumnResize = true,
    enableColumnReorder = true,
    enableCellEdit = false,
    enableRowGrouping = false,
    enableVirtualization = false,
    enableKeyboardNavigation = true,
    enableExport = true,
    ...rest
  }: DataGridProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <DataGridHeadless.Root
      columns={columns}
      data={data}
      enableColumnResize={enableColumnResize}
      enableColumnReorder={enableColumnReorder}
      enableCellEdit={enableCellEdit}
      enableRowGrouping={enableRowGrouping}
      enableVirtualization={enableVirtualization}
      enableKeyboardNavigation={enableKeyboardNavigation}
      enableExport={enableExport}
      {...rest}
    >
      <StyledDataGrid ref={ref} className={className} style={style}>
        {showToolbar && (
          <StyledToolbar>
            {showColumnSelector && (
              <StyledColumnSelector />
            )}
            
            {showExportButton && enableExport && exportFormats.map(format => (
              <StyledExportButton key={format} format={format} />
            ))}
            
            {showGroupByArea && enableRowGrouping && (
              <StyledGroupByArea />
            )}
          </StyledToolbar>
        )}
        
        <StyledHeader>
          <StyledHeaderRow>
            {columns.map(column => (
              <StyledHeaderCell
                key={column.id}
                column={column}
                $pinned={column.pinLeft ? 'left' : column.pinRight ? 'right' : undefined}
                resizable={enableColumnResize && column.resizable !== false}
                reorderable={enableColumnReorder && column.reorderable !== false}
              />
            ))}
          </StyledHeaderRow>
        </StyledHeader>
        
        <StyledBody virtualized={enableVirtualization}>
          {data.map((row, index) => (
            <StyledRow
              key={index}
              row={row}
              index={index}
              $selected={false} // This would be controlled by the selection state
            >
              {columns.map(column => (
                <StyledCell
                  key={column.id}
                  column={column as any}
                  row={row}
                  index={index}
                  $pinned={column.pinLeft ? 'left' : column.pinRight ? 'right' : undefined}
                  $editable={enableCellEdit && column.editable}
                  editMode="dblclick"
                />
              ))}
            </StyledRow>
          ))}
        </StyledBody>
        
        {showPagination && (
          <StyledPagination>
            <div className="page-size-selector">
              <label>Rows per page:</label>
              <select>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <div className="pagination-info">
              1-10 of 100
            </div>
            
            <div className="pagination-controls">
              <StyledPaginationButton disabled>
                {'<'}
              </StyledPaginationButton>
              <StyledPaginationButton $active>
                1
              </StyledPaginationButton>
              <StyledPaginationButton>
                2
              </StyledPaginationButton>
              <StyledPaginationButton>
                3
              </StyledPaginationButton>
              <StyledPaginationButton>
                {'>'}
              </StyledPaginationButton>
            </div>
          </StyledPagination>
        )}
        
        <StyledLoading loading={loading} message={loadingMessage} />
        <StyledEmpty message={emptyMessage} />
      </StyledDataGrid>
    </DataGridHeadless.Root>
  );
});

DataGrid.displayName = 'DataGrid';

export default DataGrid;
