import { useState, useCallback, useRef, useEffect } from 'react';
import { useTable, TableOptions, TableColumn, SortDirection } from '../Table/hooks/useTable';

export type DataGridColumnResizeMode = 'fit' | 'expand';
export type DataGridCellEditMode = 'click' | 'dblclick';
export type DataGridSelectionMode = 'single' | 'multiple' | 'none';
export type DataGridExportFormat = 'csv' | 'excel' | 'pdf' | 'json';

export interface DataGridColumn<T extends object = any> extends TableColumn<T> {
  /**
   * Whether the column can be resized
   */
  resizable?: boolean;
  /**
   * Whether the column can be reordered
   */
  reorderable?: boolean;
  /**
   * Whether the column can be edited
   */
  editable?: boolean;
  /**
   * Custom editor component for the column
   */
  editor?: React.ComponentType<DataGridCellEditorProps<T>>;
  /**
   * Validator function for edited values
   */
  validator?: (value: any, row: T) => boolean | string;
  /**
   * Whether the column can be used for grouping
   */
  groupable?: boolean;
  /**
   * Aggregation function for grouped data
   */
  aggregator?: (values: any[]) => any;
  /**
   * Custom formatter for aggregated values
   */
  aggregateFormatter?: (value: any) => React.ReactNode;
  /**
   * Whether to pin the column to the left
   */
  pinLeft?: boolean;
  /**
   * Whether to pin the column to the right
   */
  pinRight?: boolean;
}

export interface DataGridCellEditorProps<T extends object = any> {
  /**
   * The value to edit
   */
  value: any;
  /**
   * The row data
   */
  row: T;
  /**
   * The column definition
   */
  column: DataGridColumn<T>;
  /**
   * Callback to save the edited value
   */
  onSave: (value: any) => void;
  /**
   * Callback to cancel editing
   */
  onCancel: () => void;
}

export interface DataGridGroup<T extends object = any> {
  /**
   * The column ID used for grouping
   */
  columnId: string;
  /**
   * The group value
   */
  value: any;
  /**
   * The rows in this group
   */
  rows: T[];
  /**
   * Aggregated values for this group
   */
  aggregates: Record<string, any>;
  /**
   * Whether the group is expanded
   */
  expanded: boolean;
}

export interface DataGridOptions<T extends object = any> extends TableOptions<T> {
  /**
   * Columns configuration
   */
  columns: DataGridColumn<T>[];
  /**
   * Whether to enable column resizing
   */
  enableColumnResize?: boolean;
  /**
   * Column resize mode
   */
  columnResizeMode?: DataGridColumnResizeMode;
  /**
   * Whether to enable column reordering
   */
  enableColumnReorder?: boolean;
  /**
   * Whether to enable cell editing
   */
  enableCellEdit?: boolean;
  /**
   * Cell edit mode
   */
  cellEditMode?: DataGridCellEditMode;
  /**
   * Whether to enable row virtualization
   */
  enableVirtualization?: boolean;
  /**
   * Row height for virtualization
   */
  rowHeight?: number;
  /**
   * Whether to enable row grouping
   */
  enableRowGrouping?: boolean;
  /**
   * Initial grouping configuration
   */
  groupBy?: string[];
  /**
   * Whether to enable keyboard navigation
   */
  enableKeyboardNavigation?: boolean;
  /**
   * Whether to enable clipboard operations
   */
  enableClipboard?: boolean;
  /**
   * Whether to enable export functionality
   */
  enableExport?: boolean;
  /**
   * Selection mode
   */
  selectionMode?: DataGridSelectionMode;
  /**
   * Callback when cell value changes
   */
  onCellValueChange?: (columnId: string, rowIndex: number, value: any) => void;
  /**
   * Callback when column order changes
   */
  onColumnOrderChange?: (columnOrder: string[]) => void;
  /**
   * Callback when column resize happens
   */
  onColumnResize?: (columnId: string, width: number) => void;
  /**
   * Callback when grouping changes
   */
  onGroupByChange?: (groupBy: string[]) => void;
}

export interface UseDataGridReturn<T extends object = any> {
  /**
   * All properties from useTable
   */
  tableProps: ReturnType<typeof useTable<T>>;
  /**
   * Currently edited cell
   */
  editingCell: { rowIndex: number; columnId: string } | null;
  /**
   * Start editing a cell
   */
  startEditingCell: (rowIndex: number, columnId: string) => void;
  /**
   * Stop editing and save value
   */
  stopEditingCell: (save?: boolean) => void;
  /**
   * Set edited value
   */
  setEditedValue: (value: any) => void;
  /**
   * Current edited value
   */
  editedValue: any;
  /**
   * Column widths
   */
  columnWidths: Record<string, number>;
  /**
   * Resize a column
   */
  resizeColumn: (columnId: string, width: number) => void;
  /**
   * Column order
   */
  columnOrder: string[];
  /**
   * Reorder columns
   */
  reorderColumns: (sourceIndex: number, targetIndex: number) => void;
  /**
   * Grouped data
   */
  groupedData: DataGridGroup<T>[];
  /**
   * Current grouping configuration
   */
  groupBy: string[];
  /**
   * Add a column to grouping
   */
  addGroupBy: (columnId: string) => void;
  /**
   * Remove a column from grouping
   */
  removeGroupBy: (columnId: string) => void;
  /**
   * Toggle group expansion
   */
  toggleGroupExpansion: (groupIndex: number) => void;
  /**
   * Export data in specified format
   */
  exportData: (format: DataGridExportFormat) => void;
  /**
   * Virtualization props
   */
  virtualization: {
    containerRef: React.RefObject<HTMLDivElement>;
    totalHeight: number;
    visibleStartIndex: number;
    visibleEndIndex: number;
    visibleRows: T[];
  };
  /**
   * Keyboard navigation state
   */
  keyboardNavigation: {
    focusedCell: { rowIndex: number; columnId: string } | null;
    moveFocus: (rowDelta: number, colDelta: number) => void;
  };
}

/**
 * Hook for creating advanced data grid components with features like virtualization,
 * column resizing, cell editing, row grouping, and more.
 */
export function useDataGrid<T extends object = any>({
  columns,
  data,
  enableColumnResize = false,
  columnResizeMode = 'fit',
  enableColumnReorder = false,
  enableCellEdit = false,
  cellEditMode = 'dblclick',
  enableVirtualization = false,
  rowHeight = 40,
  enableRowGrouping = false,
  groupBy = [],
  enableKeyboardNavigation = false,
  enableClipboard = false,
  enableExport = false,
  selectionMode = 'multiple',
  onCellValueChange,
  onColumnOrderChange,
  onColumnResize,
  onGroupByChange,
  ...tableOptions
}: DataGridOptions<T>): UseDataGridReturn<T> {
  // Create table instance
  const tableProps = useTable<T>({
    ...tableOptions,
    columns: columns as TableColumn<T>[],
    data,
  });

  // Cell editing state
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [editedValue, setEditedValue] = useState<any>(null);

  // Column resizing state
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

  // Column ordering state
  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map(column => column.id)
  );

  // Row grouping state
  const [groupByState, setGroupByState] = useState<string[]>(groupBy);
  const [groupedData, setGroupedData] = useState<DataGridGroup<T>[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>({});

  // Virtualization state
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Keyboard navigation state
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; columnId: string } | null>(null);

  // Start editing a cell
  const startEditingCell = useCallback((rowIndex: number, columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column?.editable && enableCellEdit) {
      const row = tableProps.paginatedData[rowIndex];
      const value = row[columnId];
      setEditingCell({ rowIndex, columnId });
      setEditedValue(value);
    }
  }, [columns, enableCellEdit, tableProps.paginatedData]);

  // Stop editing and optionally save the value
  const stopEditingCell = useCallback((save = true) => {
    if (editingCell && save) {
      const { rowIndex, columnId } = editingCell;
      const column = columns.find(col => col.id === columnId);
      const row = tableProps.paginatedData[rowIndex];
      
      // Validate the value if a validator is provided
      if (column?.validator) {
        const validationResult = column.validator(editedValue, row);
        if (validationResult !== true) {
          // Handle validation error
          console.error('Validation error:', validationResult);
          return;
        }
      }
      
      // Update the data
      const newData = [...tableProps.data];
      const dataIndex = tableProps.data.indexOf(row);
      if (dataIndex !== -1) {
        newData[dataIndex] = { ...row, [columnId]: editedValue };
        // Call the callback if provided
        onCellValueChange?.(columnId, dataIndex, editedValue);
      }
    }
    
    setEditingCell(null);
    setEditedValue(null);
  }, [editingCell, editedValue, columns, tableProps.paginatedData, tableProps.data, onCellValueChange]);

  // Resize a column
  const resizeColumn = useCallback((columnId: string, width: number) => {
    if (enableColumnResize) {
      setColumnWidths(prev => ({ ...prev, [columnId]: width }));
      onColumnResize?.(columnId, width);
    }
  }, [enableColumnResize, onColumnResize]);

  // Reorder columns
  const reorderColumns = useCallback((sourceIndex: number, targetIndex: number) => {
    if (enableColumnReorder && sourceIndex !== targetIndex) {
      const newOrder = [...columnOrder];
      const [movedItem] = newOrder.splice(sourceIndex, 1);
      newOrder.splice(targetIndex, 0, movedItem);
      setColumnOrder(newOrder);
      onColumnOrderChange?.(newOrder);
    }
  }, [enableColumnReorder, columnOrder, onColumnOrderChange]);

  // Group data by specified columns
  useEffect(() => {
    if (enableRowGrouping && groupByState.length > 0) {
      const groups: DataGridGroup<T>[] = [];
      
      // Helper function to group data recursively
      const groupData = (rows: T[], groupColumns: string[], parentGroups: any[] = []) => {
        if (groupColumns.length === 0 || rows.length === 0) return;
        
        const currentColumn = groupColumns[0];
        const remainingColumns = groupColumns.slice(1);
        
        // Group rows by the current column
        const groupMap = new Map<any, T[]>();
        rows.forEach(row => {
          const value = row[currentColumn];
          if (!groupMap.has(value)) {
            groupMap.set(value, []);
          }
          groupMap.get(value)!.push(row);
        });
        
        // Create group objects
        Array.from(groupMap.entries()).forEach(([value, groupRows]) => {
          const currentGroups = [...parentGroups, { columnId: currentColumn, value }];
          const groupKey = currentGroups.map(g => `${g.columnId}:${g.value}`).join('|');
          
          // Calculate aggregates
          const aggregates: Record<string, any> = {};
          columns.forEach(column => {
            if (column.aggregator) {
              const values = groupRows.map(row => row[column.id]);
              aggregates[column.id] = column.aggregator(values);
            }
          });
          
          // Add group to the result
          const groupIndex = groups.length;
          groups.push({
            columnId: currentColumn,
            value,
            rows: groupRows,
            aggregates,
            expanded: expandedGroups[groupIndex] ?? true,
          });
          
          // Process subgroups if there are more grouping columns
          if (remainingColumns.length > 0) {
            groupData(groupRows, remainingColumns, currentGroups);
          }
        });
      };
      
      groupData(tableProps.data, groupByState);
      setGroupedData(groups);
    } else {
      setGroupedData([]);
    }
  }, [enableRowGrouping, groupByState, tableProps.data, columns, expandedGroups]);

  // Add a column to grouping
  const addGroupBy = useCallback((columnId: string) => {
    if (enableRowGrouping && !groupByState.includes(columnId)) {
      const newGroupBy = [...groupByState, columnId];
      setGroupByState(newGroupBy);
      onGroupByChange?.(newGroupBy);
    }
  }, [enableRowGrouping, groupByState, onGroupByChange]);

  // Remove a column from grouping
  const removeGroupBy = useCallback((columnId: string) => {
    if (enableRowGrouping) {
      const newGroupBy = groupByState.filter(id => id !== columnId);
      setGroupByState(newGroupBy);
      onGroupByChange?.(newGroupBy);
    }
  }, [enableRowGrouping, groupByState, onGroupByChange]);

  // Toggle group expansion
  const toggleGroupExpansion = useCallback((groupIndex: number) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupIndex]: !prev[groupIndex],
    }));
  }, []);

  // Export data in specified format
  const exportData = useCallback((format: DataGridExportFormat) => {
    if (!enableExport) return;
    
    const visibleColumns = columns.filter(col => tableProps.visibleColumns.includes(col as TableColumn<T>));
    
    switch (format) {
      case 'csv': {
        // Generate CSV content
        const headers = visibleColumns.map(col => col.header).join(',');
        const rows = tableProps.data.map(row => 
          visibleColumns.map(col => {
            const value = row[col.id];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"`
              : String(value);
          }).join(',')
        ).join('\n');
        const csvContent = `${headers}\n${rows}`;
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data-export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      }
      case 'json': {
        // Generate JSON content
        const jsonData = tableProps.data.map(row => {
          const jsonRow: Record<string, any> = {};
          visibleColumns.forEach(col => {
            jsonRow[col.id] = row[col.id];
          });
          return jsonRow;
        });
        
        const jsonContent = JSON.stringify(jsonData, null, 2);
        
        // Create download link
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data-export.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      }
      // Other formats would require additional libraries
      default:
        console.warn(`Export format ${format} not implemented`);
    }
  }, [enableExport, columns, tableProps.visibleColumns, tableProps.data]);

  // Calculate virtualization
  useEffect(() => {
    if (enableVirtualization && containerRef.current) {
      const updateContainerHeight = () => {
        setContainerHeight(containerRef.current?.clientHeight || 0);
      };
      
      updateContainerHeight();
      
      const handleScroll = () => {
        if (containerRef.current) {
          setScrollTop(containerRef.current.scrollTop);
        }
      };
      
      const container = containerRef.current;
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', updateContainerHeight);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', updateContainerHeight);
      };
    }
  }, [enableVirtualization]);

  // Calculate visible rows for virtualization
  const visibleStartIndex = enableVirtualization ? Math.floor(scrollTop / rowHeight) : 0;
  const visibleRowCount = enableVirtualization ? Math.ceil(containerHeight / rowHeight) + 1 : tableProps.paginatedData.length;
  const visibleEndIndex = Math.min(visibleStartIndex + visibleRowCount, tableProps.paginatedData.length);
  const visibleRows = enableVirtualization 
    ? tableProps.paginatedData.slice(visibleStartIndex, visibleEndIndex)
    : tableProps.paginatedData;
  const totalHeight = tableProps.paginatedData.length * rowHeight;

  // Keyboard navigation
  const moveFocus = useCallback((rowDelta: number, colDelta: number) => {
    if (!enableKeyboardNavigation) return;
    
    setFocusedCell(prev => {
      if (!prev) {
        return { rowIndex: 0, columnId: columns[0].id };
      }
      
      const { rowIndex, columnId } = prev;
      const colIndex = columns.findIndex(col => col.id === columnId);
      
      // Calculate new indices
      const newRowIndex = Math.max(0, Math.min(tableProps.paginatedData.length - 1, rowIndex + rowDelta));
      const newColIndex = Math.max(0, Math.min(columns.length - 1, colIndex + colDelta));
      
      return {
        rowIndex: newRowIndex,
        columnId: columns[newColIndex].id
      };
    });
  }, [enableKeyboardNavigation, columns, tableProps.paginatedData.length]);

  return {
    tableProps,
    editingCell,
    startEditingCell,
    stopEditingCell,
    setEditedValue,
    editedValue,
    columnWidths,
    resizeColumn,
    columnOrder,
    reorderColumns,
    groupedData,
    groupBy: groupByState,
    addGroupBy,
    removeGroupBy,
    toggleGroupExpansion,
    exportData,
    virtualization: {
      containerRef,
      totalHeight,
      visibleStartIndex,
      visibleEndIndex,
      visibleRows,
    },
    keyboardNavigation: {
      focusedCell,
      moveFocus,
    },
  };
}
