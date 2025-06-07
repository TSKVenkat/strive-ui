# DataGrid

The DataGrid component is a powerful and flexible data grid for displaying and manipulating tabular data. It builds upon the TableHeadless component while adding advanced features like virtualization, column resizing, cell editing, row grouping, and more.

## Features

- **Sorting**: Sort data by multiple columns with custom sort functions
- **Filtering**: Filter data with custom filter functions
- **Pagination**: Navigate through large datasets with customizable page sizes
- **Selection**: Select rows with single or multiple selection modes
- **Column Resizing**: Resize columns with mouse drag
- **Column Reordering**: Reorder columns with drag and drop
- **Cell Editing**: Edit cell values with custom editors and validators
- **Row Grouping**: Group rows by one or more columns with aggregation
- **Virtualization**: Efficiently render large datasets with virtualized scrolling
- **Keyboard Navigation**: Navigate and interact with the grid using keyboard
- **Export**: Export data to various formats (CSV, JSON, Excel, PDF)
- **Accessibility**: Fully accessible with ARIA attributes and keyboard navigation
- **Theming**: Customizable styling with theme support
- **Responsive**: Adapts to different screen sizes
- **Performance Optimized**: Efficient rendering with React.memo and optimized hooks

## Installation

```bash
npm install pulseui
# or
yarn add pulseui
```

## Usage

### Basic Usage

```jsx
import { DataGrid } from 'pulseui';

const columns = [
  { id: 'name', header: 'Name', width: 200 },
  { id: 'age', header: 'Age', width: 100 },
  { id: 'email', header: 'Email', width: 300 },
];

const data = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
];

function MyComponent() {
  return (
    <DataGrid
      columns={columns}
      data={data}
      enableSorting
      enablePagination
      pageSize={10}
    />
  );
}
```

### Advanced Usage

```jsx
import { DataGrid } from 'pulseui';
import { useState } from 'react';

function AdvancedDataGridExample() {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', department: 'Marketing' },
  ]);

  const columns = [
    {
      id: 'id',
      header: 'ID',
      width: 80,
      sortable: true,
      pinLeft: true,
    },
    {
      id: 'name',
      header: 'Name',
      width: 200,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      id: 'age',
      header: 'Age',
      width: 100,
      sortable: true,
      filterable: true,
      editable: true,
      validator: (value) => {
        const num = Number(value);
        return !isNaN(num) && num > 0 ? true : 'Age must be a positive number';
      },
    },
    {
      id: 'email',
      header: 'Email',
      width: 300,
      sortable: true,
      filterable: true,
      editable: true,
    },
    {
      id: 'department',
      header: 'Department',
      width: 150,
      sortable: true,
      filterable: true,
      editable: true,
      groupable: true,
    },
  ];

  const handleCellValueChange = (columnId, rowIndex, value) => {
    setData(prev => {
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
      return newData;
    });
  };

  return (
    <DataGrid
      columns={columns}
      data={data}
      enableSorting
      enableFiltering
      enablePagination
      enableSelection
      enableColumnResize
      enableColumnReorder
      enableCellEdit
      enableRowGrouping
      enableKeyboardNavigation
      enableExport
      showToolbar
      showColumnSelector
      showExportButton
      showGroupByArea
      showPagination
      pageSize={10}
      onCellValueChange={handleCellValueChange}
    />
  );
}
```

### Virtualization for Large Datasets

```jsx
import { DataGrid } from 'pulseui';

function VirtualizedDataGridExample() {
  // Generate a large dataset
  const largeData = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    age: 20 + Math.floor(Math.random() * 40),
    email: `person${i + 1}@example.com`,
  }));

  const columns = [
    { id: 'id', header: 'ID', width: 80 },
    { id: 'name', header: 'Name', width: 200 },
    { id: 'age', header: 'Age', width: 100 },
    { id: 'email', header: 'Email', width: 300 },
  ];

  return (
    <div style={{ height: '500px' }}>
      <DataGrid
        columns={columns}
        data={largeData}
        enableVirtualization
        enableSorting
        enableFiltering
      />
    </div>
  );
}
```

### Custom Cell Rendering

```jsx
import { DataGrid } from 'pulseui';

function CustomCellRenderingExample() {
  const columns = [
    { id: 'id', header: 'ID', width: 80 },
    { id: 'name', header: 'Name', width: 200 },
    {
      id: 'status',
      header: 'Status',
      width: 120,
      cell: (value) => {
        const color = value === 'active' ? 'green' : value === 'inactive' ? 'red' : 'orange';
        return (
          <span style={{ 
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: `${color}20`,
            color,
            fontWeight: 500,
          }}>
            {value}
          </span>
        );
      },
    },
    {
      id: 'progress',
      header: 'Progress',
      width: 200,
      cell: (value) => (
        <div style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <div
            style={{
              width: `${value}%`,
              height: '8px',
              backgroundColor: value < 30 ? 'red' : value < 70 ? 'orange' : 'green',
              borderRadius: '4px',
            }}
          />
        </div>
      ),
    },
  ];

  const data = [
    { id: 1, name: 'Task 1', status: 'active', progress: 75 },
    { id: 2, name: 'Task 2', status: 'inactive', progress: 20 },
    { id: 3, name: 'Task 3', status: 'pending', progress: 50 },
  ];

  return (
    <DataGrid
      columns={columns}
      data={data}
      enableSorting
    />
  );
}
```

### Custom Editors

```jsx
import { DataGrid } from 'pulseui';

function CustomEditorsExample() {
  const columns = [
    { id: 'id', header: 'ID', width: 80 },
    { id: 'name', header: 'Name', width: 200, editable: true },
    {
      id: 'status',
      header: 'Status',
      width: 120,
      editable: true,
      editor: ({ value, onSave, onCancel }) => (
        <select 
          value={value} 
          onChange={(e) => onSave(e.target.value)}
          onBlur={() => onSave(value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave(e.currentTarget.value);
            if (e.key === 'Escape') onCancel();
          }}
          autoFocus
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="pending">pending</option>
        </select>
      ),
    },
    {
      id: 'date',
      header: 'Date',
      width: 150,
      editable: true,
      editor: ({ value, onSave, onCancel }) => (
        <input
          type="date"
          value={value}
          onChange={(e) => onSave(e.target.value)}
          onBlur={() => onSave(value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave(e.currentTarget.value);
            if (e.key === 'Escape') onCancel();
          }}
          autoFocus
        />
      ),
    },
  ];

  const data = [
    { id: 1, name: 'Task 1', status: 'active', date: '2023-01-15' },
    { id: 2, name: 'Task 2', status: 'inactive', date: '2023-02-20' },
    { id: 3, name: 'Task 3', status: 'pending', date: '2023-03-10' },
  ];

  return (
    <DataGrid
      columns={columns}
      data={data}
      enableCellEdit
    />
  );
}
```

## API Reference

### DataGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `DataGridColumn[]` | Required | Columns configuration |
| `data` | `T[]` | Required | Data to display |
| `loading` | `boolean` | `false` | Whether the data is loading |
| `loadingMessage` | `ReactNode` | `'Loading...'` | Message to display when loading |
| `emptyMessage` | `ReactNode` | `'No data available'` | Message to display when there is no data |
| `showToolbar` | `boolean` | `true` | Whether to show the toolbar |
| `showColumnSelector` | `boolean` | `true` | Whether to show the column selector |
| `showExportButton` | `boolean` | `true` | Whether to show the export button |
| `exportFormats` | `DataGridExportFormat[]` | `['csv', 'json']` | Export formats to show |
| `showGroupByArea` | `boolean` | `false` | Whether to show the group by area |
| `showPagination` | `boolean` | `true` | Whether to show the pagination |
| `enableSorting` | `boolean` | `false` | Whether to enable sorting |
| `enableFiltering` | `boolean` | `false` | Whether to enable filtering |
| `enablePagination` | `boolean` | `false` | Whether to enable pagination |
| `enableSelection` | `boolean` | `false` | Whether to enable row selection |
| `enableColumnResize` | `boolean` | `true` | Whether to enable column resizing |
| `enableColumnReorder` | `boolean` | `true` | Whether to enable column reordering |
| `enableCellEdit` | `boolean` | `false` | Whether to enable cell editing |
| `enableRowGrouping` | `boolean` | `false` | Whether to enable row grouping |
| `enableVirtualization` | `boolean` | `false` | Whether to enable row virtualization |
| `enableKeyboardNavigation` | `boolean` | `true` | Whether to enable keyboard navigation |
| `enableExport` | `boolean` | `true` | Whether to enable export functionality |
| `selectionMode` | `'single' \| 'multiple' \| 'none'` | `'multiple'` | Selection mode |
| `pageSize` | `number` | `10` | Number of rows per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | Available page size options |
| `initialSortBy` | `{ columnId: string, direction: 'asc' \| 'desc' }[]` | `[]` | Initial sort configuration |
| `initialFilters` | `{ columnId: string, value: any }[]` | `[]` | Initial filter configuration |
| `initialGroupBy` | `string[]` | `[]` | Initial grouping configuration |
| `rowHeight` | `number` | `40` | Row height for virtualization |
| `onSelectionChange` | `(selectedRows: T[]) => void` | - | Callback when selection changes |
| `onSortChange` | `(sortBy: { columnId: string, direction: 'asc' \| 'desc' }[]) => void` | - | Callback when sort changes |
| `onFilterChange` | `(filters: { columnId: string, value: any }[]) => void` | - | Callback when filters change |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes |
| `onPageSizeChange` | `(pageSize: number) => void` | - | Callback when page size changes |
| `onCellValueChange` | `(columnId: string, rowIndex: number, value: any) => void` | - | Callback when cell value changes |
| `onColumnOrderChange` | `(columnOrder: string[]) => void` | - | Callback when column order changes |
| `onColumnResize` | `(columnId: string, width: number) => void` | - | Callback when column resize happens |
| `onGroupByChange` | `(groupBy: string[]) => void` | - | Callback when grouping changes |
| `className` | `string` | - | Custom class name |
| `style` | `CSSProperties` | - | Custom styles |

### DataGridColumn Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `id` | `string` | Required | Unique identifier for the column |
| `header` | `ReactNode` | Required | Column header content |
| `width` | `number` | - | Column width in pixels |
| `minWidth` | `number` | - | Minimum column width in pixels |
| `maxWidth` | `number` | - | Maximum column width in pixels |
| `sortable` | `boolean` | `false` | Whether the column is sortable |
| `sortFn` | `(a: T, b: T) => number` | - | Custom sort function |
| `filterable` | `boolean` | `false` | Whether the column is filterable |
| `filterFn` | `(row: T, value: any) => boolean` | - | Custom filter function |
| `resizable` | `boolean` | `true` | Whether the column can be resized |
| `reorderable` | `boolean` | `true` | Whether the column can be reordered |
| `editable` | `boolean` | `false` | Whether the column can be edited |
| `editor` | `ComponentType<DataGridCellEditorProps<T>>` | - | Custom editor component |
| `validator` | `(value: any, row: T) => boolean \| string` | - | Validator function for edited values |
| `groupable` | `boolean` | `false` | Whether the column can be used for grouping |
| `aggregator` | `(values: any[]) => any` | - | Aggregation function for grouped data |
| `aggregateFormatter` | `(value: any) => ReactNode` | - | Custom formatter for aggregated values |
| `pinLeft` | `boolean` | `false` | Whether to pin the column to the left |
| `pinRight` | `boolean` | `false` | Whether to pin the column to the right |
| `cell` | `(value: any, row: T, index: number) => ReactNode` | - | Custom cell renderer |
| `footer` | `ReactNode` | - | Column footer content |
| `hidden` | `boolean` | `false` | Whether the column is hidden |

## Headless Usage

For complete control over styling and behavior, you can use the headless version of the DataGrid component:

```jsx
import { DataGridHeadless } from 'pulseui';
import { useDataGrid } from 'pulseui';
import styled from 'styled-components';

// Custom styled components
const StyledDataGrid = styled(DataGridHeadless.DataGrid)`
  /* Your custom styles */
`;

const StyledHeader = styled(DataGridHeadless.Header)`
  /* Your custom styles */
`;

// ... more styled components

function CustomDataGrid({ columns, data, ...props }) {
  return (
    <DataGridHeadless.Root
      columns={columns}
      data={data}
      {...props}
    >
      <StyledDataGrid>
        <StyledHeader>
          <DataGridHeadless.HeaderRow>
            {columns.map(column => (
              <DataGridHeadless.HeaderCell
                key={column.id}
                column={column}
              />
            ))}
          </DataGridHeadless.HeaderRow>
        </StyledHeader>
        
        <DataGridHeadless.Body>
          {data.map((row, index) => (
            <DataGridHeadless.Row
              key={index}
              row={row}
              index={index}
            >
              {columns.map(column => (
                <DataGridHeadless.Cell
                  key={column.id}
                  column={column}
                  row={row}
                  index={index}
                />
              ))}
            </DataGridHeadless.Row>
          ))}
        </DataGridHeadless.Body>
      </StyledDataGrid>
    </DataGridHeadless.Root>
  );
}
```

## Accessibility

The DataGrid component is designed with accessibility in mind:

- Proper ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management for cell editing
- Screen reader announcements for important actions
- Support for high contrast mode
- Respects user's reduced motion preferences

## Performance Considerations

For large datasets, consider using these features:

- Enable virtualization with `enableVirtualization`
- Use pagination with `enablePagination`
- Implement server-side sorting, filtering, and pagination for very large datasets
- Use `React.memo` for custom cell renderers
- Optimize expensive operations with `useCallback` and `useMemo`

## Customization

The DataGrid component can be customized in several ways:

- Custom cell renderers with the `cell` property
- Custom editors with the `editor` property
- Custom styling with CSS or styled-components
- Custom theme with CSS custom properties
- Custom validators with the `validator` property
- Custom aggregators with the `aggregator` property

## Browser Support

The DataGrid component supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

MIT
