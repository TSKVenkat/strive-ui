import { useState, useCallback, useMemo, useEffect } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = any> {
  id: string;
  accessor: keyof T | ((row: T) => any);
  header: React.ReactNode;
  footer?: React.ReactNode;
  cell?: (value: any, row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  sortType?: 'alphanumeric' | 'datetime' | 'number' | ((a: any, b: any) => number);
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  hidden?: boolean;
}

export interface TableState<T = any> {
  sortBy: { id: string; direction: SortDirection };
  selectedRows: Record<string, boolean>;
  expandedRows: Record<string, boolean>;
  page: number;
  pageSize: number;
  filters: Record<string, any>;
  groupBy: string[];
  hiddenColumns: string[];
  columnOrder: string[];
}

export interface TableOptions<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  initialState?: Partial<TableState<T>>;
  getRowId?: (row: T, index: number) => string;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  manualPagination?: boolean;
  onStateChange?: (state: TableState<T>) => void;
  onRowClick?: (row: T, index: number) => void;
  onRowSelect?: (selectedRows: Record<string, boolean>) => void;
  onRowExpand?: (expandedRows: Record<string, boolean>) => void;
  onSort?: (sortBy: { id: string; direction: SortDirection }) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  defaultColumn?: Partial<TableColumn<T>>;
  autoResetSortBy?: boolean;
  autoResetSelectedRows?: boolean;
  autoResetExpandedRows?: boolean;
  autoResetPage?: boolean;
  autoResetFilters?: boolean;
  disableSortBy?: boolean;
  disableMultiSort?: boolean;
  disableFilters?: boolean;
  disablePagination?: boolean;
  disableSelection?: boolean;
  disableExpanding?: boolean;
  disableGrouping?: boolean;
  disableColumnHiding?: boolean;
  disableColumnOrdering?: boolean;
}

export interface TableRowProps<T = any> {
  row: T;
  index: number;
  selected: boolean;
  expanded: boolean;
  onClick: (e: React.MouseEvent) => void;
  onSelect: (e: React.MouseEvent) => void;
  onExpand: (e: React.MouseEvent) => void;
}

export interface TableCellProps<T = any> {
  column: TableColumn<T>;
  row: T;
  value: any;
  index: number;
}

export interface TableHeaderCellProps<T = any> {
  column: TableColumn<T>;
  sortDirection: SortDirection;
  onSort: () => void;
}

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions: number[];
}

/**
 * Hook for creating a headless table with sorting, filtering, pagination, and more.
 */
export function useTable<T extends object = any>(options: TableOptions<T>) {
  const {
    data = [],
    columns = [],
    initialState = {},
    getRowId = (row: T, index: number) => `${index}`,
    manualSorting = false,
    manualFiltering = false,
    manualPagination = false,
    onStateChange,
    onRowClick,
    onRowSelect,
    onRowExpand,
    onSort,
    onPageChange,
    onPageSizeChange,
    onFilterChange,
    defaultColumn = {},
    autoResetSortBy = true,
    autoResetSelectedRows = true,
    autoResetExpandedRows = true,
    autoResetPage = true,
    autoResetFilters = true,
    disableSortBy = false,
    disableMultiSort = true,
    disableFilters = false,
    disablePagination = false,
    disableSelection = false,
    disableExpanding = false,
    disableGrouping = true,
    disableColumnHiding = false,
    disableColumnOrdering = true,
  } = options;

  // Merge default column with columns
  const mergedColumns = useMemo(() => {
    return columns.map(column => ({
      ...defaultColumn,
      ...column,
    }));
  }, [columns, defaultColumn]);

  // Initialize state
  const [state, setState] = useState<TableState<T>>({
    sortBy: initialState.sortBy || { id: '', direction: null },
    selectedRows: initialState.selectedRows || {},
    expandedRows: initialState.expandedRows || {},
    page: initialState.page || 0,
    pageSize: initialState.pageSize || 10,
    filters: initialState.filters || {},
    groupBy: initialState.groupBy || [],
    hiddenColumns: initialState.hiddenColumns || [],
    columnOrder: initialState.columnOrder || mergedColumns.map(col => col.id),
  });

  // Update state when initialState changes
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      ...initialState,
    }));
  }, [initialState]);

  // Notify state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  // Reset sort when data changes
  useEffect(() => {
    if (autoResetSortBy && state.sortBy.id) {
      setState(prevState => ({
        ...prevState,
        sortBy: { id: '', direction: null },
      }));
    }
  }, [data, autoResetSortBy]);

  // Reset selected rows when data changes
  useEffect(() => {
    if (autoResetSelectedRows && Object.keys(state.selectedRows).length > 0) {
      setState(prevState => ({
        ...prevState,
        selectedRows: {},
      }));
    }
  }, [data, autoResetSelectedRows]);

  // Reset expanded rows when data changes
  useEffect(() => {
    if (autoResetExpandedRows && Object.keys(state.expandedRows).length > 0) {
      setState(prevState => ({
        ...prevState,
        expandedRows: {},
      }));
    }
  }, [data, autoResetExpandedRows]);

  // Reset page when data changes
  useEffect(() => {
    if (autoResetPage && state.page > 0) {
      setState(prevState => ({
        ...prevState,
        page: 0,
      }));
    }
  }, [data, autoResetPage]);

  // Reset filters when data changes
  useEffect(() => {
    if (autoResetFilters && Object.keys(state.filters).length > 0) {
      setState(prevState => ({
        ...prevState,
        filters: {},
      }));
    }
  }, [data, autoResetFilters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (disableSortBy || !state.sortBy.id || !state.sortBy.direction || manualSorting) {
      return [...data];
    }

    const column = mergedColumns.find(col => col.id === state.sortBy.id);
    if (!column) return [...data];

    return [...data].sort((rowA, rowB) => {
      const valueA = typeof column.accessor === 'function'
        ? column.accessor(rowA)
        : rowA[column.accessor as keyof T];
      
      const valueB = typeof column.accessor === 'function'
        ? column.accessor(rowB)
        : rowB[column.accessor as keyof T];

      if (valueA === valueB) {
        return 0;
      }

      const direction = state.sortBy.direction === 'asc' ? 1 : -1;

      if (column.sortType === 'number') {
        return (Number(valueA) - Number(valueB)) * direction;
      }

      if (column.sortType === 'datetime') {
        return (new Date(valueA).getTime() - new Date(valueB).getTime()) * direction;
      }

      if (typeof column.sortType === 'function') {
        return column.sortType(valueA, valueB) * direction;
      }

      // Default alphanumeric sort
      if (valueA === null || valueA === undefined) return direction;
      if (valueB === null || valueB === undefined) return -direction;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB) * direction;
      }

      return (valueA > valueB ? 1 : -1) * direction;
    });
  }, [data, state.sortBy, mergedColumns, disableSortBy, manualSorting]);

  // Filter data
  const filteredData = useMemo(() => {
    if (disableFilters || Object.keys(state.filters).length === 0 || manualFiltering) {
      return sortedData;
    }

    return sortedData.filter(row => {
      return Object.entries(state.filters).every(([columnId, filterValue]) => {
        if (!filterValue) return true;

        const column = mergedColumns.find(col => col.id === columnId);
        if (!column) return true;

        const value = typeof column.accessor === 'function'
          ? column.accessor(row)
          : row[column.accessor as keyof T];

        if (typeof filterValue === 'function') {
          return filterValue(value, row);
        }

        if (typeof value === 'string') {
          return value.toLowerCase().includes(String(filterValue).toLowerCase());
        }

        return String(value).includes(String(filterValue));
      });
    });
  }, [sortedData, state.filters, mergedColumns, disableFilters, manualFiltering]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (disablePagination || manualPagination) {
      return filteredData;
    }

    const start = state.page * state.pageSize;
    const end = start + state.pageSize;

    return filteredData.slice(start, end);
  }, [filteredData, state.page, state.pageSize, disablePagination, manualPagination]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (disablePagination) return 1;
    return Math.ceil(filteredData.length / state.pageSize);
  }, [filteredData.length, state.pageSize, disablePagination]);

  // Row handlers
  const getRowProps = useCallback((row: T, index: number): TableRowProps<T> => {
    const rowId = getRowId(row, index);
    
    return {
      row,
      index,
      selected: !!state.selectedRows[rowId],
      expanded: !!state.expandedRows[rowId],
      onClick: (e: React.MouseEvent) => {
        if (onRowClick) {
          onRowClick(row, index);
        }
      },
      onSelect: (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disableSelection) return;

        setState(prevState => {
          const newSelectedRows = { ...prevState.selectedRows };
          newSelectedRows[rowId] = !newSelectedRows[rowId];

          if (onRowSelect) {
            onRowSelect(newSelectedRows);
          }

          return {
            ...prevState,
            selectedRows: newSelectedRows,
          };
        });
      },
      onExpand: (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disableExpanding) return;

        setState(prevState => {
          const newExpandedRows = { ...prevState.expandedRows };
          newExpandedRows[rowId] = !newExpandedRows[rowId];

          if (onRowExpand) {
            onRowExpand(newExpandedRows);
          }

          return {
            ...prevState,
            expandedRows: newExpandedRows,
          };
        });
      },
    };
  }, [
    getRowId,
    state.selectedRows,
    state.expandedRows,
    onRowClick,
    onRowSelect,
    onRowExpand,
    disableSelection,
    disableExpanding,
  ]);

  // Cell handlers
  const getCellProps = useCallback((column: TableColumn<T>, row: T, index: number): TableCellProps<T> => {
    const value = typeof column.accessor === 'function'
      ? column.accessor(row)
      : row[column.accessor as keyof T];

    return {
      column,
      row,
      value,
      index,
    };
  }, []);

  // Header cell handlers
  const getHeaderCellProps = useCallback((column: TableColumn<T>): TableHeaderCellProps<T> => {
    const isSorted = state.sortBy.id === column.id;
    const sortDirection = isSorted ? state.sortBy.direction : null;

    return {
      column,
      sortDirection,
      onSort: () => {
        if (disableSortBy || column.sortable === false) return;

        setState(prevState => {
          let direction: SortDirection = 'asc';
          
          if (prevState.sortBy.id === column.id) {
            direction = prevState.sortBy.direction === 'asc' ? 'desc' : null;
          }

          const newSortBy = { id: direction ? column.id : '', direction };

          if (onSort) {
            onSort(newSortBy);
          }

          return {
            ...prevState,
            sortBy: newSortBy,
          };
        });
      },
    };
  }, [state.sortBy, disableSortBy, onSort]);

  // Pagination handlers
  const getPaginationProps = useCallback((): TablePaginationProps => {
    return {
      page: state.page,
      pageSize: state.pageSize,
      totalPages,
      totalRows: filteredData.length,
      onPageChange: (page: number) => {
        if (disablePagination) return;

        setState(prevState => {
          if (onPageChange) {
            onPageChange(page);
          }

          return {
            ...prevState,
            page,
          };
        });
      },
      onPageSizeChange: (pageSize: number) => {
        if (disablePagination) return;

        setState(prevState => {
          if (onPageSizeChange) {
            onPageSizeChange(pageSize);
          }

          return {
            ...prevState,
            pageSize,
            page: 0, // Reset to first page when changing page size
          };
        });
      },
      pageSizeOptions: [5, 10, 20, 50, 100],
    };
  }, [
    state.page,
    state.pageSize,
    totalPages,
    filteredData.length,
    disablePagination,
    onPageChange,
    onPageSizeChange,
  ]);

  // Filter handlers
  const setFilter = useCallback((columnId: string, value: any) => {
    if (disableFilters) return;

    setState(prevState => {
      const newFilters = {
        ...prevState.filters,
        [columnId]: value,
      };

      if (onFilterChange) {
        onFilterChange(newFilters);
      }

      return {
        ...prevState,
        filters: newFilters,
        page: 0, // Reset to first page when filtering
      };
    });
  }, [disableFilters, onFilterChange]);

  // Column visibility handlers
  const toggleColumnVisibility = useCallback((columnId: string) => {
    if (disableColumnHiding) return;

    setState(prevState => {
      const newHiddenColumns = [...prevState.hiddenColumns];
      const index = newHiddenColumns.indexOf(columnId);

      if (index === -1) {
        newHiddenColumns.push(columnId);
      } else {
        newHiddenColumns.splice(index, 1);
      }

      return {
        ...prevState,
        hiddenColumns: newHiddenColumns,
      };
    });
  }, [disableColumnHiding]);

  // Select all rows
  const selectAllRows = useCallback(() => {
    if (disableSelection) return;

    setState(prevState => {
      const allSelected = paginatedData.length > 0 && 
        paginatedData.every(row => prevState.selectedRows[getRowId(row, 0)]);

      const newSelectedRows = { ...prevState.selectedRows };

      if (allSelected) {
        // Deselect all visible rows
        paginatedData.forEach((row, index) => {
          delete newSelectedRows[getRowId(row, index)];
        });
      } else {
        // Select all visible rows
        paginatedData.forEach((row, index) => {
          newSelectedRows[getRowId(row, index)] = true;
        });
      }

      if (onRowSelect) {
        onRowSelect(newSelectedRows);
      }

      return {
        ...prevState,
        selectedRows: newSelectedRows,
      };
    });
  }, [paginatedData, getRowId, disableSelection, onRowSelect]);

  // Check if all rows are selected
  const areAllRowsSelected = useMemo(() => {
    return paginatedData.length > 0 && 
      paginatedData.every(row => state.selectedRows[getRowId(row, 0)]);
  }, [paginatedData, state.selectedRows, getRowId]);

  // Check if some rows are selected
  const areSomeRowsSelected = useMemo(() => {
    return paginatedData.some(row => state.selectedRows[getRowId(row, 0)]);
  }, [paginatedData, state.selectedRows, getRowId]);

  // Get visible columns
  const visibleColumns = useMemo(() => {
    return mergedColumns.filter(column => !state.hiddenColumns.includes(column.id));
  }, [mergedColumns, state.hiddenColumns]);

  return {
    // State
    state,
    setState,
    
    // Data
    data,
    sortedData,
    filteredData,
    paginatedData,
    
    // Columns
    columns: mergedColumns,
    visibleColumns,
    
    // Row props
    getRowProps,
    
    // Cell props
    getCellProps,
    
    // Header props
    getHeaderCellProps,
    
    // Pagination props
    getPaginationProps,
    totalPages,
    
    // Selection
    selectAllRows,
    areAllRowsSelected,
    areSomeRowsSelected,
    
    // Filters
    setFilter,
    
    // Column visibility
    toggleColumnVisibility,
  };
}

export default useTable;
