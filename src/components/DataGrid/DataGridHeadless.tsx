import React, { createContext, useContext, useRef, useEffect, forwardRef, useState } from 'react';
import { useDataGrid, UseDataGridReturn, DataGridOptions, DataGridGroup, DataGridExportFormat } from './useDataGrid';

// Extend DataGridColumn to include formatter and render properties
export interface DataGridColumn<T> {
  id: string;
  header: React.ReactNode;
  accessor: ((row: T) => any) | string;
  isVisible?: boolean;
  editable?: boolean;
  sortable?: boolean;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  formatter?: (value: any, row: T) => any;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the DataGrid
interface DataGridContextValue<T extends object = any> extends UseDataGridReturn<T> {
  onCellEdit?: (row: T, columnId: string, value: any) => void;
  toggleColumnVisibility?: (columnId: string) => void;
}

const DataGridContext = createContext<DataGridContextValue<any> | null>(null);

// Hook to use DataGrid context
export function useDataGridContext<T extends object = any>() {
  const context = useContext(DataGridContext) as DataGridContextValue<T> | null;
  if (!context) {
    throw new Error('useDataGridContext must be used within a DataGridHeadless.Root component');
  }
  return context;
}

// Root component
export interface RootProps<T extends object = any> extends DataGridOptions<T> {
  children: React.ReactNode;
  className?: string;
}

const Root = <T extends object = any>({
  children,
  className,
  ...options
}: RootProps<T>) => {
  const dataGrid = useDataGrid<T>(options);
  
  return (
    <DataGridContext.Provider value={dataGrid}>
      <div className={className}>
        {children}
      </div>
    </DataGridContext.Provider>
  );
};

// DataGrid component
export type DataGridElementProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
    style?: React.CSSProperties;
  }
>;

export type DataGridProps<C extends React.ElementType> = DataGridElementProps<C>;

export type DataGridComponent = <C extends React.ElementType = 'div'>(
  props: DataGridProps<C>
) => React.ReactElement | null;

const DataGrid = forwardRef(function DataGrid<C extends React.ElementType = 'div'>(
    { as, className, style, ...props }: Omit<DataGridProps<C>, 'ref'>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    const dataGrid = useDataGridContext();
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          position: 'relative',
          overflow: 'auto',
          ...style,
        },
        ...props
      }
    );
  }
) as DataGridComponent;

// Header component
export type HeaderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
    style?: React.CSSProperties;
  }
>;

const Header = forwardRef(function Header<C extends React.ElementType = 'div'>(
    { as, className, style, ...props }: Omit<HeaderProps<C>, 'ref'>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          position: 'sticky',
          top: 0,
          zIndex: 2,
          ...style,
        },
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
    style?: React.CSSProperties;
  }
>;

const HeaderRow = forwardRef(function HeaderRow<C extends React.ElementType = 'div'>(
    { as, className, style, ...props }: Omit<HeaderRowProps<C>, 'ref'>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          display: 'flex',
          ...style,
        },
        ...props
      }
    );
  }
);

// HeaderCell component
export type HeaderCellProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    column: DataGridColumn<any>;
    className?: string;
    style?: React.CSSProperties;
    showSortIndicator?: boolean;
    sortAscIcon?: React.ReactNode;
    sortDescIcon?: React.ReactNode;
    sortNoneIcon?: React.ReactNode;
    resizable?: boolean;
    reorderable?: boolean;
    onReorderStart?: (columnId: string) => void;
  }
>

const HeaderCell = forwardRef(function HeaderCell<C extends React.ElementType = 'div'>(
    {
      as,
      column,
      className,
      style,
      showSortIndicator,
      sortAscIcon,
      sortDescIcon,
      sortNoneIcon,
      resizable,
      reorderable,
      onReorderStart,
      ...props
    }: Omit<HeaderCellProps<C>, 'ref'>,
    ref: PolymorphicRef<C>
  ) {
    const Component = as || 'div';
    const dataGrid = useDataGridContext();
    const { tableProps, resizeColumn, columnWidths } = dataGrid;
    const { sortDirection, onSort } = tableProps.getHeaderCellProps(column);
    
    const resizeHandleRef = useRef<HTMLDivElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    
    // Handle column resizing
    useEffect(() => {
      if (!resizable || !resizeHandleRef.current) return;
      
      const resizeHandle = resizeHandleRef.current;
      let startX: number;
      let startWidth: number;
      
      const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        startX = e.clientX;
        startWidth = columnWidths[column.id] || (resizeHandle.parentElement?.clientWidth || 100);
        setIsResizing(true);
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      };
      
      const handleMouseMove = (e: MouseEvent) => {
        if (isResizing) {
          const width = Math.max(50, startWidth + (e.clientX - startX));
          resizeColumn(column.id, width);
        }
      };
      
      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      resizeHandle.addEventListener('mousedown', handleMouseDown);
      
      return () => {
        resizeHandle.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [column.id, columnWidths, isResizing, resizable, resizeColumn]);
    
    // Handle column reordering
    const handleDragStart = (e: React.DragEvent) => {
      if (reorderable) {
        e.dataTransfer.setData('text/plain', column.id);
        onReorderStart?.(column.id);
      }
    };
    
    const getSortIcon = () => {
      if (!showSortIndicator || !column.sortable) return null;
      
      if (sortDirection === 'asc') return sortAscIcon;
      if (sortDirection === 'desc') return sortDescIcon;
      return sortNoneIcon;
    };
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          position: 'relative',
          cursor: column.sortable ? 'pointer' : undefined,
          width: columnWidths[column.id] || column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          userSelect: 'none',
          ...style,
        },
        onClick: column.sortable ? onSort : undefined,
        draggable: reorderable,
        onDragStart: handleDragStart,
        ...props
      },
      React.createElement(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        },
        React.createElement('span', null, column.header),
        getSortIcon()
      ),
      resizable && React.createElement(
        'div',
        {
          ref: resizeHandleRef,
          style: {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '5px',
            cursor: 'col-resize',
            zIndex: 1,
          },
        }
      )
    );
  }
);

// Body component
export type BodyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
    style?: React.CSSProperties;
    virtualized?: boolean;
  }
>

// Row component
export type RowProps<T extends object = any, C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    row: T;
    index: number;
    className?: string;
    style?: React.CSSProperties;
  }
>

const Row = forwardRef<HTMLDivElement, Omit<RowProps<any, 'div'>, 'ref'>>(function Row<T extends object = any>(
    { as, row, index, className, style, ...props }: Omit<RowProps<T, 'div'>, 'ref'>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    const dataGrid = useDataGridContext<T>();
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          display: 'flex',
          borderBottom: '1px solid #eee',
          ...style,
        },
        ...props
      },
      props.children
    );
  }
);

// Body component
const Body = forwardRef(function Body<C extends React.ElementType = 'div'>(
    { as, className, style, virtualized, ...props }: Omit<BodyProps<C>, 'ref'> & { virtualized?: boolean },
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    const dataGrid = useDataGridContext();
    const { virtualization } = dataGrid;
    const rowHeight = 40; // Default row height
    const { paginatedData = [] } = dataGrid.tableProps || {};
    
    // Calculate visible range for virtualization
    const startIndex = virtualized && virtualization ? virtualization.visibleStartIndex : 0;
    const endIndex = virtualized && virtualization ? virtualization.visibleEndIndex : paginatedData.length;
    
    let childContent;
    
    if (virtualized && props.children) {
      // Create virtualized content
      const virtualizedRows = paginatedData
        .slice(startIndex, endIndex)
        .map((row, index) => {
          const actualIndex = startIndex + index;
          return React.cloneElement(props.children as React.ReactElement, {
            key: actualIndex,
            row,
            index: actualIndex,
            style: {
              position: 'absolute',
              top: `${actualIndex * rowHeight}px`,
              width: '100%',
              height: `${rowHeight}px`,
            },
          });
        });
      
      childContent = React.createElement(
        'div',
        {
          style: {
            height: `${paginatedData.length * rowHeight}px`,
            position: 'relative',
          }
        },
        virtualizedRows
      );
    } else if (props.children) {
      // Create regular mapped content
      const mappedRows = paginatedData.map((row, index) => {
        return React.cloneElement(props.children as React.ReactElement, {
          key: index,
          row,
          index,
        });
      });
      
      childContent = mappedRows;
    }
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          display: 'flex',
          flexDirection: 'column',
          ...style,
        },
        ...props
      },
      childContent
    );
  }
);

// Cell component
export type CellProps<T extends object = any, C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    column: DataGridColumn<T>;
    row: T;
    index: number;
    className?: string;
    style?: React.CSSProperties;
    editMode: 'none' | 'click' | 'dblclick';
  }
>

const Cell = forwardRef<HTMLDivElement, Omit<CellProps<any, 'div'>, 'ref'>>(function Cell<T extends object = any>(
    {
      as,
      column,
      row,
      index,
      className,
      style,
      editMode,
      ...props
    }: Omit<CellProps<T, 'div'>, 'ref'>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    const dataGrid = useDataGridContext<T>();
    const { tableProps } = dataGrid;
    const [isEditing, setIsEditing] = useState(false);
    
    // Get cell value - handle different accessor types
    const getCellValue = () => {
      if (typeof column.accessor === 'function') {
        return column.accessor(row);
      } else if (typeof column.accessor === 'string') {
        return row[column.accessor as keyof T];
      }
      return '';
    };
    
    const value = getCellValue();
    const [editValue, setEditValue] = useState<any>(value);
    
    // Format the value if formatter exists
    const getFormattedValue = () => {
      if (column.formatter && typeof column.formatter === 'function') {
        return column.formatter(value, row);
      }
      return value;
    };
    
    const formattedValue = getFormattedValue();
    
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (editMode === 'click' && column.editable) {
        setIsEditing(true);
      }
      
      if (props.onClick) {
        props.onClick(e);
      }
    };
    
    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (editMode === 'dblclick' && column.editable) {
        setIsEditing(true);
      }
      
      if (props.onDoubleClick) {
        props.onDoubleClick(e);
      }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditValue(e.target.value);
    };
    
    const handleBlur = () => {
      setIsEditing(false);
      if (editValue !== value) {
        // Handle cell edit - use optional onCellEdit or dispatch a custom event
        if (dataGrid.onCellEdit) {
          dataGrid.onCellEdit(row, column.id, editValue);
        } else {
          // Fallback: dispatch a custom event that can be handled by the parent
          const event = new CustomEvent('cell-edit', {
            detail: { row, columnId: column.id, value: editValue }
          });
          document.dispatchEvent(event);
        }
      }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsEditing(false);
        if (editValue !== value) {
          // Handle cell edit - use optional onCellEdit or dispatch a custom event
          if (dataGrid.onCellEdit) {
            dataGrid.onCellEdit(row, column.id, editValue);
          } else {
            // Fallback: dispatch a custom event that can be handled by the parent
            const event = new CustomEvent('cell-edit', {
              detail: { row, columnId: column.id, value: editValue }
            });
            document.dispatchEvent(event);
          }
        }
      } else if (e.key === 'Escape') {
        setIsEditing(false);
        setEditValue(value);
      }
    };
    
    const renderContent = () => {
      if (isEditing && column.editable) {
        return React.createElement('input', {
          type: 'text',
          value: editValue,
          onChange: handleChange,
          onBlur: handleBlur,
          onKeyDown: handleKeyDown,
          autoFocus: true,
          style: { width: '100%' }
        });
      }
      
      // Check if custom cell renderer exists
      if (column.render && typeof column.render === 'function') {
        return column.render(formattedValue, row, index);
      }
      
      return formattedValue;
    };
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          padding: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          ...style,
        },
        onClick: handleClick,
        onDoubleClick: handleDoubleClick,
        ...props
      },
      renderContent()
    );
  }
);

// GroupRow component
export type GroupRowProps<T extends object = any, C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    group: DataGridGroup<T>;
    groupIndex: number;
    className?: string;
    style?: React.CSSProperties;
    expandIcon?: React.ReactNode;
    collapseIcon?: React.ReactNode;
  }
>

const GroupRow = forwardRef<HTMLDivElement, Omit<GroupRowProps<any, 'div'>, 'ref'>>(function GroupRow<T extends object = any>(
    {
      as,
      group,
      groupIndex,
      className,
      style,
      expandIcon,
      collapseIcon,
      ...props
    }: Omit<GroupRowProps<T, 'div'>, 'ref'>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    const dataGrid = useDataGridContext<T>();
    const { toggleGroupExpansion } = dataGrid;
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          display: 'flex',
          alignItems: 'center',
          ...style,
        },
        ...props
      },
      React.createElement(
        'button',
        {
          onClick: () => toggleGroupExpansion(groupIndex),
          style: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginRight: '8px',
          },
        },
        group.expanded ? collapseIcon : expandIcon
      ),
      React.createElement(
        'span',
        null,
        `${group.columnId}: ${String(group.value)} (${group.rows.length} items)`
      )
    );
  }
);

// Toolbar component
export type ToolbarProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
    style?: React.CSSProperties;
  }
>

const Toolbar = forwardRef(function Toolbar<C extends React.ElementType = 'div'>(
    { as, className, style, ...props }: Omit<ToolbarProps<C>, 'ref'>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px',
          ...style,
        },
        ...props
      },
      props.children
    );
  }
);

// ColumnSelector component
export interface ColumnSelectorProps {
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
}

const ColumnSelector = forwardRef<HTMLDivElement, { className?: string; style?: React.CSSProperties }>(
  function ColumnSelector({ className, style }, ref) {
    const dataGrid = useDataGridContext();
    const { tableProps } = dataGrid;
    const [isOpen, setIsOpen] = useState(false);
    
    // Handle column visibility toggle
    const handleToggleVisibility = (columnId: string) => {
      if (dataGrid.toggleColumnVisibility) {
        dataGrid.toggleColumnVisibility(columnId);
      } else if (tableProps.toggleColumnVisibility) {
        tableProps.toggleColumnVisibility(columnId);
      }
    };
    
    return React.createElement(
      'div',
      {
        ref: ref,
        className: className,
        style: style
      },
      [
        React.createElement(
          'button',
          {
            key: 'toggle-button',
            onClick: () => setIsOpen(!isOpen),
            style: {
              background: 'none',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
            }
          },
          'Columns'
        ),
        isOpen && React.createElement(
          'div',
          {
            key: 'dropdown',
            style: {
              position: 'absolute',
              zIndex: 10,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
              marginTop: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }
          },
          (tableProps.columns || []).map(column => 
            React.createElement(
              'div',
              {
                key: column.id,
                style: { padding: '4px 0' }
              },
              React.createElement(
                'label',
                {
                  style: { display: 'flex', alignItems: 'center' }
                },
                [
                  React.createElement(
                    'input',
                    {
                      key: 'checkbox',
                      type: 'checkbox',
                      checked: (column as any).isVisible || !(column as any).hidden || false,
                      onChange: () => handleToggleVisibility(column.id),
                      style: { marginRight: '8px' }
                    }
                  ),
                  column.header
                ]
              )
            )
          )
        )
      ]
    );
  }
);

// ExportButton component
export interface ExportButtonProps {
  className?: string;
  style?: React.CSSProperties;
  format: DataGridExportFormat;
  label?: React.ReactNode;
}

const ExportButton = forwardRef<HTMLButtonElement, { className?: string; style?: React.CSSProperties; format?: DataGridExportFormat; label?: string }>(
  function ExportButton({ className, style, format = 'csv', label = 'Export' }, ref) {
    const dataGrid = useDataGridContext();
    const { exportData } = dataGrid;
    
    return React.createElement(
      'button',
      {
        ref: ref,
        className: className,
        style: {
          background: 'none',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          ...style,
        },
        onClick: () => exportData(format)
      },
      label
    );
  }
);

// GroupByChip component
export interface GroupByChipProps {
  columnId: string;
  className?: string;
  style?: React.CSSProperties;
}

const GroupByChip: React.FC<GroupByChipProps> = ({
  columnId,
  className,
  style,
}) => {
  const dataGrid = useDataGridContext();
  const { tableProps, removeGroupBy } = dataGrid;
  const column = tableProps.columns.find(col => col.id === columnId);
  
  if (!column) return null;
  
  return React.createElement(
    'div',
    {
      className: className,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '16px',
        padding: '4px 8px',
        margin: '4px',
        ...style,
      }
    },
    [
      React.createElement('span', { key: 'label' }, column.header),
      React.createElement(
        'button',
        {
          key: 'remove-button',
          onClick: () => removeGroupBy(columnId),
          style: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '4px',
          }
        },
        '×'
      )
    ]
  );
};

// GroupByArea component
export type GroupByAreaProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
    style?: React.CSSProperties;
    placeholder?: React.ReactNode;
  }
>

const GroupByArea = forwardRef(function GroupByArea<C extends React.ElementType = 'div'>(
    {
      as,
      className,
      style,
      placeholder,
      ...props
    }: Omit<GroupByAreaProps<C>, 'ref'> & { placeholder?: React.ReactNode },
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    const Component = as || 'div';
    const dataGrid = useDataGridContext();
    const { groupBy, addGroupBy } = dataGrid;
    
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };
    
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const columnId = e.dataTransfer.getData('text/plain');
      if (columnId) {
        addGroupBy(columnId);
      }
    };
    
    return React.createElement(
      Component,
      {
        ref: ref,
        className: className,
        style: {
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          minHeight: '40px',
          border: '1px dashed #ccc',
          padding: '4px',
          ...style,
        },
        onDragOver: handleDragOver,
        onDrop: handleDrop,
        ...props
      },
      groupBy.length === 0 ? 
        React.createElement('div', { style: { color: '#999' } }, placeholder || 'Drag columns here to group') : 
        groupBy.map(columnId => 
          React.createElement(GroupByChip, { key: columnId, columnId: columnId })
        )
    );
  }
);

// Loading component
export interface LoadingProps {
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  message?: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({
  loading,
  className,
  style,
  message = 'Loading...',
}) => {
  if (!loading) {
    return null;
  }
  
  return React.createElement(
    'div',
    {
      className: className,
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 10,
        ...style,
      }
    },
    message
  );
};

// Empty state component
export interface EmptyProps {
  className?: string;
  style?: React.CSSProperties;
  message?: React.ReactNode;
}

const Empty: React.FC<EmptyProps> = ({
  className,
  style,
  message = 'No data available',
}) => {
  const dataGrid = useDataGridContext();
  
  if (dataGrid.tableProps.paginatedData.length > 0) {
    return null;
  }
  
  return React.createElement(
    'div',
    {
      className: className,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        ...style,
      }
    },
    message
  );
};

// Export all components
export const DataGridHeadless = {
  Root,
  DataGrid,
  Header,
  HeaderRow,
  HeaderCell,
  Body,
  Row,
  Cell,
  GroupRow,
  Toolbar,
  ColumnSelector,
  ExportButton,
  GroupByArea,
  GroupByChip,
  Loading,
  Empty,
} as const;

// Type for the compound component
export type DataGridHeadlessType = typeof DataGridHeadless;

export default DataGridHeadless;
