import React, { createContext, useContext, ReactNode, ElementType, forwardRef } from 'react';
import { useTable, TableOptions, TableColumn, TableRowProps, TableCellProps, TableHeaderCellProps, TablePaginationProps, SortDirection } from './hooks/useTable';
import { Box } from '../Box/Box';
import { PolymorphicComponentPropsWithRef, PolymorphicRef, PolymorphicComponent } from '../../types/polymorphic';

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

const TableContext = createContext<TableContextValue<any> | null>(null);

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

export type TableComponent = PolymorphicComponent<'table'>;

const Table = forwardRef(
  <C extends React.ElementType = 'table'>(
    { as, className, ...props }: Omit<TableProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'table';
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        ...props
      }
    );
  }
) as TableComponent;

// Header component
export type HeaderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
  }
>;

const Header = forwardRef(
  <C extends React.ElementType = 'thead'>(
    { as, className, ...props }: Omit<HeaderProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'thead';
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        ...props
      }
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

const HeaderRow = forwardRef(
  <C extends React.ElementType = 'tr'>(
    { as, className, ...props }: Omit<HeaderRowProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'tr';
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        ...props
      }
    );
  }
);

// HeaderCell component
export type HeaderCellProps<C extends React.ElementType = 'th'> = PolymorphicComponentPropsWithRef<
  C,
  {
    column: TableColumn<any>;
    className?: string;
    showSortIndicator?: boolean;
    sortAscIcon?: ReactNode;
    sortDescIcon?: ReactNode;
    sortNoneIcon?: ReactNode;
  }
>;

const HeaderCell = forwardRef(
  <C extends React.ElementType = 'th'>(
    {
      as,
      column,
      className,
      showSortIndicator = true as any,
      sortAscIcon = '↑' as any,
      sortDescIcon = '↓' as any,
      sortNoneIcon = '↕' as any,
      ...props
    }: Omit<HeaderCellProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'th';
    const table = useTableContext();
    const { sortDirection, onSort } = table.getHeaderCellProps(column);
    const sortable = column.sortable !== false;
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        onClick: () => sortable && onSort?.(),
        style: {
          width: column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        },
        ...props
      },
      column.header,
      sortable && showSortIndicator && 
        React.createElement(
          'span',
          null,
          sortDirection === 'asc' ? sortAscIcon : 
          sortDirection === 'desc' ? sortDescIcon : 
          sortDirection === null ? sortNoneIcon : null
        )
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

const Body = forwardRef(
  <C extends React.ElementType = 'tbody'>(
    { as, className, ...props }: Omit<BodyProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'tbody';
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        ...props
      }
    );
  }
);

// Row component
export type RowProps<T = any, C extends React.ElementType = 'tr'> = PolymorphicComponentPropsWithRef<
  C,
  {
    row: T;
    index: number;
    className?: string;
    selectedClassName?: string;
    expandedClassName?: string;
  }
>;

const Row = forwardRef(
  <T extends object = any, C extends React.ElementType = 'tr'>(
    {
      as,
      row,
      index,
      className,
      selectedClassName = '' as any,
      expandedClassName = '' as any,
      ...props
    }: Omit<RowProps<T, C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'tr';
    const table = useTableContext<T>();
    const { selected, expanded, onClick, onSelect, onExpand } = table.getRowProps(row, index);
    
    const combinedClassName = `${className || ''} ${selected ? selectedClassName : ''} ${expanded ? expandedClassName : ''}`.trim();
    
    return React.createElement(
      Component,
      {
        ref,
        className: combinedClassName,
        onClick: onClick,
        ...props
      }
    );
  }
);

// Cell component
export type CellProps<T = any, C extends React.ElementType = 'td'> = PolymorphicComponentPropsWithRef<
  C,
  {
    column: TableColumn<T>;
    row: T;
    index: number;
    className?: string;
  }
>;

const Cell = forwardRef(
  <T extends object = any, C extends React.ElementType = 'td'>(
    {
      as,
      column,
      row,
      index,
      className,
      ...props
    }: Omit<CellProps<T, C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
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
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        style: {
          width: column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        },
        ...props
      },
      renderContent()
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

const Footer = forwardRef(
  <C extends React.ElementType = 'tfoot'>(
    { as, className, ...props }: Omit<FooterProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'tfoot';
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        ...props
      }
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

const FooterRow = forwardRef(
  <C extends React.ElementType = 'tr'>(
    { as, className, ...props }: Omit<FooterRowProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'tr';
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        ...props
      }
    );
  }
);

// FooterCell component
export type FooterCellProps<C extends React.ElementType = 'td'> = PolymorphicComponentPropsWithRef<
  C,
  {
    column: TableColumn;
    className?: string;
  }
>;

const FooterCell = forwardRef(
  <C extends React.ElementType = 'td'>(
    {
      as,
      column,
      className,
      ...props
    }: Omit<FooterCellProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'td';
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        style: {
          width: column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
        },
        ...props
      },
      column.footer
    );
  }
);

// SelectionCell component
export type SelectionCellProps<C extends React.ElementType = 'td'> = PolymorphicComponentPropsWithRef<
  C,
  {
    row?: any;
    index?: number;
    className?: string;
  }
>;

const SelectionCell = forwardRef(
  <C extends React.ElementType = 'td'>(
    { as, row, index, className, ...props }: Omit<SelectionCellProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'td';
    const table = useTableContext();
    const { selected, onSelect } = table.getRowProps(row, index || 0);
    
    if (row) {
      return React.createElement(
        Component,
        {
          ref,
          className,
          onClick: (e: React.MouseEvent) => e.stopPropagation(),
          ...props
        },
        React.createElement('input', {
          type: 'checkbox',
          checked: selected,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => onSelect?.(e as any)
        })
      );
    }
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        ...props
      },
      React.createElement('input', {
        type: 'checkbox',
        checked: table.areAllRowsSelected,
        ref: (input: HTMLInputElement | null) => {
          if (input) {
            input.indeterminate = !table.areAllRowsSelected && table.areSomeRowsSelected;
          }
        },
        onChange: () => table.selectAllRows && table.selectAllRows()
      })
    );
  }
);

// ExpandCell component
export type ExpandCellProps<C extends React.ElementType = 'td'> = PolymorphicComponentPropsWithRef<
  C,
  {
    row: any;
    index: number;
    className?: string;
    expandIcon?: ReactNode;
    collapseIcon?: ReactNode;
  }
>;

const ExpandCell = forwardRef(
  <C extends React.ElementType = 'td'>(
    { 
      as, 
      row, 
      index, 
      className, 
      expandIcon = '+' as any, 
      collapseIcon = '-' as any, 
      ...props 
    }: Omit<ExpandCellProps<C>, 'ref'>,
    ref: React.ForwardedRef<React.ElementRef<C>>
  ) => {
    const Component = as || 'td';
    const table = useTableContext();
    const { expanded, onExpand } = table.getRowProps(row, index);
    
    return React.createElement(
      Component,
      {
        ref,
        className,
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        ...props
      },
      React.createElement(
        'button',
        {
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => onExpand && onExpand(e),
          style: { background: 'none', border: 'none', cursor: 'pointer' }
        },
        expanded ? collapseIcon : expandIcon
      )
    );
  }
);

// Filter component
export interface FilterProps<T extends object = any> {
  column: TableColumn<T>;
  className?: string;
  placeholder?: string;
}

const Filter = <T extends object = any>({
  column,
  className,
  placeholder = `Filter ${String(column.header)}...`,
}) => {
  const table = useTableContext();
  
  return React.createElement(
    'input',
    {
      type: 'text',
      className,
      placeholder,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => table.setFilter(column.id, e.target.value)
    }
  );
};

// ColumnToggle component
export interface ColumnToggleProps<T extends object = any> {
  column: TableColumn<T>;
  className?: string;
  label?: ReactNode;
}

const ColumnToggle = <T extends object = any>({
  column,
  className,
  label,
}) => {
  const table = useTableContext();
  const isHidden = table.visibleColumns.indexOf(column) === -1;
  
  return React.createElement(
    'label',
    { className },
    React.createElement(
      'input',
      {
        type: 'checkbox',
        checked: !isHidden,
        onChange: () => table.toggleColumnVisibility(column.id)
      }
    ),
    label || column.header
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
  
  return React.createElement(
    'div',
    { className },
    message
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
  
  return React.createElement(
    'div',
    { className },
    message
  );
};

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
  
  return React.createElement(
    'div',
    { className },
    showPageSizeOptions && React.createElement(
      'div',
      null,
      React.createElement(
        'span',
        null,
        pageSizeLabel
      ),
      React.createElement(
        'select',
        {
          value: pageSize,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onPageSizeChange(Number(e.target.value))
        },
        pageSizeOptions.map(option => React.createElement(
          'option',
          { key: option, value: option },
          option
        ))
      )
    ),
    showPageInfo && React.createElement(
      'div',
      null,
      pageInfoTemplate({ page, pageSize, totalPages, totalRows })
    ),
    React.createElement(
      'div',
      null,
      React.createElement(
        'button',
        {
          onClick: () => onPageChange(page - 1),
          disabled: page === 0
        },
        prevLabel
      ),
      React.createElement(
        'button',
        {
          onClick: () => onPageChange(page + 1),
          disabled: page >= totalPages - 1
        },
        nextLabel
      )
    )
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
  useTableContext,
};

export default TableHeadless;
