import React, { createContext, useContext, useRef, useEffect, forwardRef, useState } from 'react';
import { useDataGrid, UseDataGridReturn, DataGridOptions, DataGridColumn, DataGridGroup, DataGridExportFormat } from './useDataGrid';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the DataGrid
interface DataGridContextValue<T extends object = any> extends UseDataGridReturn<T> {}

const DataGridContext = createContext<DataGridContextValue | null>(null);

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

const DataGrid: DataGridComponent = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, className, style, ...props }: DataGridProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const dataGrid = useDataGridContext();
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          position: 'relative',
          overflow: 'auto',
          ...style,
        }}
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
    style?: React.CSSProperties;
  }
>;

const Header = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, className, style, ...props }: HeaderProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          ...style,
        }}
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
    style?: React.CSSProperties;
  }
>;

const HeaderRow = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, className, style, ...props }: HeaderRowProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          ...style,
        }}
        {...props}
      />
    );
  }
);

// HeaderCell component
export interface HeaderCellProps<C extends React.ElementType = 'div'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    column: DataGridColumn;
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
> {}

const HeaderCell = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      column,
      className,
      style,
      showSortIndicator = true,
      sortAscIcon = '↑',
      sortDescIcon = '↓',
      sortNoneIcon = '↕',
      resizable,
      reorderable,
      onReorderStart,
      ...props
    }: HeaderCellProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
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
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          position: 'relative',
          cursor: column.sortable ? 'pointer' : undefined,
          width: columnWidths[column.id] || column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          userSelect: 'none',
          ...style,
        }}
        onClick={column.sortable ? onSort : undefined}
        draggable={reorderable}
        onDragStart={handleDragStart}
        {...props}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{column.header}</span>
          {getSortIcon()}
        </div>
        
        {resizable && (
          <div
            ref={resizeHandleRef}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '5px',
              cursor: 'col-resize',
              zIndex: 1,
            }}
          />
        )}
      </Component>
    );
  }
);

// Body component
export interface BodyProps<C extends React.ElementType = 'div'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
    style?: React.CSSProperties;
    virtualized?: boolean;
  }
> {}

const Body = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, className, style, virtualized = false, ...props }: BodyProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const dataGrid = useDataGridContext();
    const { virtualization } = dataGrid;
    
    return (
      <Component
        ref={virtualized ? virtualization.containerRef : ref}
        className={className}
        style={{
          position: 'relative',
          overflow: 'auto',
          ...style,
        }}
        {...props}
      >
        {virtualized && (
          <div style={{ height: virtualization.totalHeight }}>
            <div
              style={{
                position: 'absolute',
                top: virtualization.visibleStartIndex * 40, // assuming rowHeight is 40
                width: '100%',
              }}
            >
              {props.children}
            </div>
          </div>
        )}
        
        {!virtualized && props.children}
      </Component>
    );
  }
);

// Row component
export interface RowProps<T = any, C extends React.ElementType = 'div'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    row: T;
    index: number;
    className?: string;
    style?: React.CSSProperties;
    selectedClassName?: string;
    expandedClassName?: string;
  }
> {}

const Row = forwardRef(
  <T extends object = any, C extends React.ElementType = 'div'>(
    {
      as,
      row,
      index,
      className,
      style,
      selectedClassName = '',
      expandedClassName = '',
      ...props
    }: RowProps<T, C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const dataGrid = useDataGridContext<T>();
    const { tableProps } = dataGrid;
    const { selected, expanded, onClick, onSelect, onExpand } = tableProps.getRowProps(row, index);
    
    return (
      <Component
        ref={ref}
        className={`
          ${className || ''}
          ${selected ? selectedClassName : ''}
          ${expanded ? expandedClassName : ''}
        `.trim()}
        style={{
          display: 'flex',
          ...style,
        }}
        onClick={onClick}
        {...props}
      />
    );
  }
);

// Cell component
export interface CellProps<T = any, C extends React.ElementType = 'div'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    column: DataGridColumn<T>;
    row: T;
    index: number;
    className?: string;
    style?: React.CSSProperties;
    editMode?: 'click' | 'dblclick';
  }
> {}

const Cell = forwardRef(
  <T extends object = any, C extends React.ElementType = 'div'>(
    {
      as,
      column,
      row,
      index,
      className,
      style,
      editMode = 'dblclick',
      ...props
    }: CellProps<T, C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const dataGrid = useDataGridContext<T>();
    const { tableProps, editingCell, startEditingCell, stopEditingCell, setEditedValue, editedValue, columnWidths } = dataGrid;
    const { value } = tableProps.getCellProps(column, row, index);
    
    const isEditing = editingCell?.rowIndex === index && editingCell?.columnId === column.id;
    
    const handleClick = () => {
      if (column.editable && editMode === 'click') {
        startEditingCell(index, column.id);
      }
    };
    
    const handleDoubleClick = () => {
      if (column.editable && editMode === 'dblclick') {
        startEditingCell(index, column.id);
      }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (isEditing) {
        if (e.key === 'Enter') {
          stopEditingCell(true);
        } else if (e.key === 'Escape') {
          stopEditingCell(false);
        }
      }
    };
    
    const renderContent = () => {
      if (isEditing) {
        if (column.editor) {
          const Editor = column.editor;
          return (
            <Editor
              value={editedValue}
              row={row}
              column={column}
              onSave={(value) => {
                setEditedValue(value);
                stopEditingCell(true);
              }}
              onCancel={() => stopEditingCell(false)}
            />
          );
        }
        
        return (
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => stopEditingCell(true)}
            autoFocus
            style={{ width: '100%' }}
          />
        );
      }
      
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
          width: columnWidths[column.id] || column.width,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          ...style,
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        {...props}
      >
        {renderContent()}
      </Component>
    );
  }
);

// GroupRow component
export interface GroupRowProps<T = any, C extends React.ElementType = 'div'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    group: DataGridGroup<T>;
    groupIndex: number;
    className?: string;
    style?: React.CSSProperties;
    expandIcon?: React.ReactNode;
    collapseIcon?: React.ReactNode;
  }
> {}

const GroupRow = forwardRef(
  <T extends object = any, C extends React.ElementType = 'div'>(
    {
      as,
      group,
      groupIndex,
      className,
      style,
      expandIcon = '+',
      collapseIcon = '-',
      ...props
    }: GroupRowProps<T, C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const dataGrid = useDataGridContext<T>();
    const { toggleGroupExpansion } = dataGrid;
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          ...style,
        }}
        {...props}
      >
        <button
          onClick={() => toggleGroupExpansion(groupIndex)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '8px' }}
        >
          {group.expanded ? collapseIcon : expandIcon}
        </button>
        <span>
          {group.columnId}: {String(group.value)} ({group.rows.length} items)
        </span>
      </Component>
    );
  }
);

// Toolbar component
export interface ToolbarProps<C extends React.ElementType = 'div'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
    style?: React.CSSProperties;
  }
> {}

const Toolbar = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, className, style, ...props }: ToolbarProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          ...style,
        }}
        {...props}
      />
    );
  }
);

// ColumnSelector component
export interface ColumnSelectorProps {
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  className,
  style,
  label = 'Columns',
}) => {
  const dataGrid = useDataGridContext();
  const { tableProps } = dataGrid;
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={className} style={style}>
      <button onClick={() => setIsOpen(!isOpen)}>{label}</button>
      
      {isOpen && (
        <div style={{ position: 'absolute', zIndex: 10, background: 'white', border: '1px solid #ccc', padding: '8px' }}>
          {tableProps.columns.map(column => (
            <div key={column.id}>
              <label>
                <input
                  type="checkbox"
                  checked={tableProps.visibleColumns.includes(column)}
                  onChange={() => tableProps.toggleColumnVisibility(column.id)}
                />
                {column.header}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ExportButton component
export interface ExportButtonProps {
  className?: string;
  style?: React.CSSProperties;
  format: DataGridExportFormat;
  label?: React.ReactNode;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  className,
  style,
  format,
  label,
}) => {
  const dataGrid = useDataGridContext();
  const { exportData } = dataGrid;
  
  const getDefaultLabel = () => {
    switch (format) {
      case 'csv': return 'Export CSV';
      case 'excel': return 'Export Excel';
      case 'pdf': return 'Export PDF';
      case 'json': return 'Export JSON';
      default: return 'Export';
    }
  };
  
  return (
    <button
      className={className}
      style={style}
      onClick={() => exportData(format)}
    >
      {label || getDefaultLabel()}
    </button>
  );
};

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
  
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: '16px',
        padding: '4px 8px',
        margin: '4px',
        ...style,
      }}
    >
      <span>{column.header}</span>
      <button
        onClick={() => removeGroupBy(columnId)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '4px',
        }}
      >
        ×
      </button>
    </div>
  );
};

// GroupByArea component
export interface GroupByAreaProps<C extends React.ElementType = 'div'> extends PolymorphicComponentPropsWithRef<
  C,
  {
    className?: string;
    style?: React.CSSProperties;
    placeholder?: React.ReactNode;
  }
> {}

const GroupByArea = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      className,
      style,
      placeholder = 'Drag columns here to group',
      ...props
    }: GroupByAreaProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
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
    
    return (
      <Component
        ref={ref}
        className={className}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          minHeight: '40px',
          border: '1px dashed #ccc',
          padding: '4px',
          ...style,
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...props}
      >
        {groupBy.length === 0 ? (
          <div style={{ color: '#999' }}>{placeholder}</div>
        ) : (
          groupBy.map(columnId => (
            <GroupByChip key={columnId} columnId={columnId} />
          ))
        )}
      </Component>
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
  
  return (
    <div
      className={className}
      style={{
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
      }}
    >
      {message}
    </div>
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
  
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        ...style,
      }}
    >
      {message}
    </div>
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
};

export default DataGridHeadless;
