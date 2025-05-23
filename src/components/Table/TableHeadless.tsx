import React, { createContext, useContext, ReactNode } from 'react';
import { useTable, TableOptions, TableColumn, TableRowProps, TableCellProps, TableHeaderCellProps, TablePaginationProps, SortDirection } from './hooks/useTable';
import { Box } from '../Box/Box';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the table
interface TableContextValue<T extends object = any> {
  getRowProps: (row: T, index: number) => TableRowProps<T>;
  getCellProps: (column: TableColumn<T>, row: T, index: number) => TableCellProps<T>;
  getHeaderCellProps: (column: TableColumn<T>) => TableHeaderCellProps<T>;
  getPaginationProps: () => TablePaginationProps;
  columns: TableColumn<T>[];
  visibleColumns: TableColumn<T>[];
  data: T[];
  paginatedData: T[];
  selectAllRows: () => void;
  areAllRowsSelected: boolean;
  areSomeRowsSelected: boolean;
  setFilter: (columnId: string, value: any) => void;
  toggleColumnVisibility: (columnId: string) => void;
}

const TableContext = createContext<TableContextValue | null>(null);

// Hook to use table context
export function useTableContext<T extends object = any>() {
  const context = useContext(TableContext) as TableContextValue<T> | null;
  if (!context) {
    throw new Error('useTableContext must be used within a TableHeadless.Root component');
  }
  return context;
}

// Root component
export interface RootProps<T extends object = any> extends TableOptions<T> {
  children: ReactNode;
  className?: string;
}

const Root = <T extends object = any>({
  children,
  className,
  ...options
}: RootProps<T>) => {
  const table = useTable<T>(options);
  
  return (
    <TableContext.Provider
      value={{
        getRowProps: table.getRowProps,
        getCellProps: table.getCellProps,
        getHeaderCellProps: table.getHeaderCellProps,
        getPaginationProps: table.getPaginationProps,
        columns: table.columns,
        visibleColumns: table.visibleColumns,
        data: table.data,
        paginatedData: table.paginatedData,
        selectAllRows: table.selectAllRows,
        areAllRowsSelected: table.areAllRowsSelected,
        areSomeRowsSelected: table.areSomeRowsSelected,
        setFilter: table.setFilter,
        toggleColumnVisibility: table.toggleColumnVisibility,
      }}
    >
      <div className={className}>
        {children}
      </div>
    </TableContext.Provider>
  );
};

// Table component
export type TableElementProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
  }
>;

export type TableProps<C extends React.ElementType> = TableElementProps<C>;

export type TableComponent = <C extends React.ElementType = 'table'>(
  props: TableProps<C>
) => React.ReactElement | null;

const Table: TableComponent = React.forwardRef(
  <C extends React.ElementType = 'table'>(
    { as, className, ...props }: TableProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'table';
    
    return (
      <Component
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

// Header component
export type HeaderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
  }
>;

const Header = React.forwardRef(
  <C extends React.ElementType = 'thead'>(
    { as, className, ...props }: HeaderProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'thead';
    
    return (
      <Component
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

// HeaderRow component
export type HeaderRowProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
  }
>;

const HeaderRow = React.forwardRef(
  <C extends React.ElementType = 'tr'>(
    { as, className, ...props }: HeaderRowProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'tr';
    
    return (
      <Component
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

// HeaderCell component
export interface HeaderCellProps<C extends React.ElementType = 'th'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    column: TableColumn;
    className?: string;
    showSortIndicator?: boolean;
    sortAscIcon?: ReactNode;
    sortDescIcon?: ReactNode;
    sortNoneIcon?: ReactNode;
  }
> {}

const HeaderCell = React.forwardRef(
  <C extends React.ElementType = 'th'>(
    {
      as,
      column,
      className,
      showSortIndicator = true,
      sortAscIcon = '↑',
      sortDescIcon = '↓',
      sortNoneIcon = '↕',
      ...props
    }: HeaderCellProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'th';
    const table = useTableContext();
    const { sortDirection, onSort } = table.getHeaderCellProps(column);
    
    const getSortIcon = () => {
      if (!showSortIndicator || !column.sortable) return null;
      
      if (sortDirection === 'asc') return sortAscIcon;
      if (sortDirection === 'desc') return sortDescIcon;
      return sortNoneIcon;
    };
    
    return (
      <Component
        ref={ref}
        className={className}
        onClick={column.sortable ? onSort : undefined}
        style={{
          cursor: column.sortable ? 'pointer' : undefined,
          width: column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        }}
        {...props}
      >
        {column.header}
        {getSortIcon()}
      </Component>
    );
  }
);

// Body component
export type BodyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
  }
>;

const Body = React.forwardRef(
  <C extends React.ElementType = 'tbody'>(
    { as, className, ...props }: BodyProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'tbody';
    
    return (
      <Component
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

// Row component
export interface RowProps<T = any, C extends React.ElementType = 'tr'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    row: T;
    index: number;
    className?: string;
    selectedClassName?: string;
    expandedClassName?: string;
  }
> {}

const Row = React.forwardRef(
  <T extends object = any, C extends React.ElementType = 'tr'>(
    {
      as,
      row,
      index,
      className,
      selectedClassName = '',
      expandedClassName = '',
      ...props
    }: RowProps<T, C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'tr';
    const table = useTableContext<T>();
    const { selected, expanded, onClick, onSelect, onExpand } = table.getRowProps(row, index);
    
    return (
      <Component
        ref={ref}
        className={`
          ${className || ''}
          ${selected ? selectedClassName : ''}
          ${expanded ? expandedClassName : ''}
        `.trim()}
        onClick={onClick}
        {...props}
      />
    );
  }
);

// Cell component
export interface CellProps<T = any, C extends React.ElementType = 'td'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    column: TableColumn<T>;
    row: T;
    index: number;
    className?: string;
  }
> {}

const Cell = React.forwardRef(
  <T extends object = any, C extends React.ElementType = 'td'>(
    {
      as,
      column,
      row,
      index,
      className,
      ...props
    }: CellProps<T, C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'td';
    const table = useTableContext<T>();
    const { value } = table.getCellProps(column, row, index);
    
    const renderContent = () => {
      if (column.cell) {
        return column.cell(value, row, index);
      }
      
      return value;
    };
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          width: column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        }}
        {...props}
      >
        {renderContent()}
      </Component>
    );
  }
);

// Footer component
export type FooterProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
  }
>;

const Footer = React.forwardRef(
  <C extends React.ElementType = 'tfoot'>(
    { as, className, ...props }: FooterProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'tfoot';
    
    return (
      <Component
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

// FooterRow component
export type FooterRowProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
  }
>;

const FooterRow = React.forwardRef(
  <C extends React.ElementType = 'tr'>(
    { as, className, ...props }: FooterRowProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'tr';
    
    return (
      <Component
        ref={ref}
        className={className}
        {...props}
      />
    );
  }
);

// FooterCell component
export interface FooterCellProps<C extends React.ElementType = 'td'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    column: TableColumn;
    className?: string;
  }
> {}

const FooterCell = React.forwardRef(
  <C extends React.ElementType = 'td'>(
    {
      as,
      column,
      className,
      ...props
    }: FooterCellProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'td';
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          width: column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        }}
        {...props}
      >
        {column.footer}
      </Component>
    );
  }
);

// Pagination component
export interface PaginationProps {
  className?: string;
  showPageSizeOptions?: boolean;
  showPageInfo?: boolean;
  prevLabel?: ReactNode;
  nextLabel?: ReactNode;
  pageSizeLabel?: ReactNode;
  pageInfoTemplate?: (info: { page: number; pageSize: number; totalPages: number; totalRows: number }) => ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({
  className,
  showPageSizeOptions = true,
  showPageInfo = true,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  pageSizeLabel = 'Rows per page:',
  pageInfoTemplate = ({ page, pageSize, totalRows }) => {
    const start = page * pageSize + 1;
    const end = Math.min((page + 1) * pageSize, totalRows);
    return `${start}-${end} of ${totalRows}`;
  },
}) => {
  const table = useTableContext();
  const { page, pageSize, totalPages, totalRows, onPageChange, onPageSizeChange, pageSizeOptions } = table.getPaginationProps();
  
  return (
    <div className={className}>
      {showPageSizeOptions && (
        <div>
          {pageSizeLabel}
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {showPageInfo && (
        <div>
          {pageInfoTemplate({ page, pageSize, totalPages, totalRows })}
        </div>
      )}
      
      <div>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          {prevLabel}
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
};

// SelectionCell component
export interface SelectionCellProps<C extends React.ElementType = 'td'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    row?: any;
    index?: number;
    className?: string;
  }
> {}

const SelectionCell = React.forwardRef(
  <C extends React.ElementType = 'td'>(
    {
      as,
      row,
      index,
      className,
      ...props
    }: SelectionCellProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'td';
    const table = useTableContext();
    
    // If row and index are provided, render a row selection checkbox
    if (row !== undefined && index !== undefined) {
      const { selected, onSelect } = table.getRowProps(row, index);
      
      return (
        <Component
          ref={ref}
          className={className}
          onClick={e => e.stopPropagation()}
          {...props}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={onSelect}
          />
        </Component>
      );
    }
    
    // Otherwise, render a header selection checkbox
    return (
      <Component
        ref={ref}
        className={className}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        <input
          type="checkbox"
          checked={table.areAllRowsSelected}
          ref={input => {
            if (input) {
              input.indeterminate = !table.areAllRowsSelected && table.areSomeRowsSelected;
            }
          }}
          onChange={table.selectAllRows}
        />
      </Component>
    );
  }
);

// ExpandCell component
export interface ExpandCellProps<C extends React.ElementType = 'td'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    row: any;
    index: number;
    className?: string;
    expandIcon?: ReactNode;
    collapseIcon?: ReactNode;
  }
> {}

const ExpandCell = React.forwardRef(
  <C extends React.ElementType = 'td'>(
    {
      as,
      row,
      index,
      className,
      expandIcon = '+',
      collapseIcon = '-',
      ...props
    }: ExpandCellProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'td';
    const table = useTableContext();
    const { expanded, onExpand } = table.getRowProps(row, index);
    
    return (
      <Component
        ref={ref}
        className={className}
        onClick={e => e.stopPropagation()}
        {...props}
      >
        <button
          onClick={onExpand}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {expanded ? collapseIcon : expandIcon}
        </button>
      </Component>
    );
  }
);

// Filter component
export interface FilterProps {
  column: TableColumn;
  className?: string;
  placeholder?: string;
}

const Filter: React.FC<FilterProps> = ({
  column,
  className,
  placeholder = `Filter ${String(column.header)}...`,
}) => {
  const table = useTableContext();
  
  return (
    <input
      type="text"
      className={className}
      placeholder={placeholder}
      onChange={e => table.setFilter(column.id, e.target.value)}
    />
  );
};

// ColumnToggle component
export interface ColumnToggleProps {
  column: TableColumn;
  className?: string;
  label?: ReactNode;
}

const ColumnToggle: React.FC<ColumnToggleProps> = ({
  column,
  className,
  label,
}) => {
  const table = useTableContext();
  const isHidden = table.visibleColumns.indexOf(column) === -1;
  
  return (
    <label className={className}>
      <input
        type="checkbox"
        checked={!isHidden}
        onChange={() => table.toggleColumnVisibility(column.id)}
      />
      {label || column.header}
    </label>
  );
};

// Empty state component
export interface EmptyProps {
  className?: string;
  message?: ReactNode;
}

const Empty: React.FC<EmptyProps> = ({
  className,
  message = 'No data available',
}) => {
  const table = useTableContext();
  
  if (table.paginatedData.length > 0) {
    return null;
  }
  
  return (
    <div className={className}>
      {message}
    </div>
  );
};

// Loading state component
export interface LoadingProps {
  loading?: boolean;
  className?: string;
  message?: ReactNode;
}

const Loading: React.FC<LoadingProps> = ({
  loading,
  className,
  message = 'Loading...',
}) => {
  if (!loading) {
    return null;
  }
  
  return (
    <div className={className}>
      {message}
    </div>
  );
};

// Export all components
export const TableHeadless = {
  Root,
  Table,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
  Footer,
  FooterRow,
  FooterCell,
  Pagination,
  SelectionCell,
  ExpandCell,
  Filter,
  ColumnToggle,
  Empty,
  Loading,
};

export default TableHeadless;
