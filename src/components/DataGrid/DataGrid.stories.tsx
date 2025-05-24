import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import { DataGrid, DataGridProps } from './DataGrid';
import { DataGridColumn } from './useDataGrid';
import styled from 'styled-components';

export default {
  title: 'Data Display/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
          The DataGrid component is a powerful and flexible data grid for displaying and manipulating tabular data.
          It supports features like sorting, filtering, pagination, selection, column resizing, cell editing,
          row grouping, virtualization, keyboard navigation, and more.
        `,
      },
    },
  },
  argTypes: {
    enableSorting: { control: 'boolean' },
    enableFiltering: { control: 'boolean' },
    enablePagination: { control: 'boolean' },
    enableSelection: { control: 'boolean' },
    enableColumnResize: { control: 'boolean' },
    enableColumnReorder: { control: 'boolean' },
    enableCellEdit: { control: 'boolean' },
    enableRowGrouping: { control: 'boolean' },
    enableVirtualization: { control: 'boolean' },
    enableKeyboardNavigation: { control: 'boolean' },
    enableExport: { control: 'boolean' },
    showToolbar: { control: 'boolean' },
    showColumnSelector: { control: 'boolean' },
    showExportButton: { control: 'boolean' },
    showGroupByArea: { control: 'boolean' },
    showPagination: { control: 'boolean' },
  },
} as Meta;

// Sample data
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  salary: number;
  department: string;
  manager: string;
}

const generateData = (count: number): Person[] => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Product', 'Design'];
  const statuses = ['active', 'inactive', 'pending'] as const;
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    firstName: `First${i + 1}`,
    lastName: `Last${i + 1}`,
    age: 20 + Math.floor(Math.random() * 40),
    email: `person${i + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 5)).toISOString().split('T')[0],
    salary: 30000 + Math.floor(Math.random() * 120000),
    department: departments[Math.floor(Math.random() * departments.length)],
    manager: `Manager${Math.floor(Math.random() * 5) + 1}`,
  }));
};

// Sample columns
const columns: DataGridColumn<Person>[] = [
  {
    id: 'id',
    header: 'ID',
    width: 80,
    sortable: true,
    resizable: true,
    pinLeft: true,
  },
  {
    id: 'firstName',
    header: 'First Name',
    width: 150,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
  },
  {
    id: 'lastName',
    header: 'Last Name',
    width: 150,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
  },
  {
    id: 'age',
    header: 'Age',
    width: 80,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
    validator: (value) => {
      const num = Number(value);
      return !isNaN(num) && num > 0 && num < 120 ? true : 'Age must be a number between 1 and 120';
    },
  },
  {
    id: 'email',
    header: 'Email',
    width: 220,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
  },
  {
    id: 'status',
    header: 'Status',
    width: 120,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
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
    id: 'joinDate',
    header: 'Join Date',
    width: 120,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
  },
  {
    id: 'salary',
    header: 'Salary',
    width: 120,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
    cell: (value) => `$${value.toLocaleString()}`,
    validator: (value) => {
      const num = Number(value);
      return !isNaN(num) && num >= 0 ? true : 'Salary must be a positive number';
    },
  },
  {
    id: 'department',
    header: 'Department',
    width: 150,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
    groupable: true,
  },
  {
    id: 'manager',
    header: 'Manager',
    width: 150,
    sortable: true,
    filterable: true,
    resizable: true,
    editable: true,
    groupable: true,
    pinRight: true,
  },
];

const data = generateData(100);

// Container for fixed height
const Container = styled.div`
  height: 500px;
  width: 100%;
  border: 1px solid #eee;
`;

// Basic template
const Template: Story<DataGridProps<Person>> = (args) => (
  <Container>
    <DataGrid {...args} />
  </Container>
);

// Basic example
export const Basic = Template.bind({});
Basic.args = {
  columns,
  data,
  enableSorting: true,
  enablePagination: true,
  pageSize: 10,
};

// Advanced example with all features enabled
export const Advanced = Template.bind({});
Advanced.args = {
  columns,
  data,
  enableSorting: true,
  enableFiltering: true,
  enablePagination: true,
  enableSelection: true,
  enableColumnResize: true,
  enableColumnReorder: true,
  enableCellEdit: true,
  enableRowGrouping: true,
  enableKeyboardNavigation: true,
  enableExport: true,
  showToolbar: true,
  showColumnSelector: true,
  showExportButton: true,
  showGroupByArea: true,
  showPagination: true,
  pageSize: 10,
};

// Virtualized example for large datasets
export const Virtualized = () => {
  const largeData = generateData(10000);
  
  return (
    <Container>
      <DataGrid
        columns={columns}
        data={largeData}
        enableVirtualization
        enableSorting
        enableFiltering
        enableColumnResize
      />
    </Container>
  );
};

// Editable example
export const Editable = () => {
  const [editableData, setEditableData] = useState(generateData(20));
  
  const handleCellValueChange = (columnId: string, rowIndex: number, value: any) => {
    setEditableData(prev => {
      const newData = [...prev];
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
      return newData;
    });
  };
  
  return (
    <Container>
      <DataGrid
        columns={columns}
        data={editableData}
        enableCellEdit
        enableSorting
        enablePagination
        pageSize={10}
        onCellValueChange={handleCellValueChange}
      />
    </Container>
  );
};

// Grouped example
export const Grouped = () => {
  return (
    <Container>
      <DataGrid
        columns={columns}
        data={data}
        enableRowGrouping
        enableSorting
        enablePagination
        pageSize={10}
        showGroupByArea
        groupBy={['department']}
      />
    </Container>
  );
};

// Loading state example
export const Loading = Template.bind({});
Loading.args = {
  columns,
  data: [],
  loading: true,
  loadingMessage: 'Loading data...',
};

// Empty state example
export const Empty = Template.bind({});
Empty.args = {
  columns,
  data: [],
  emptyMessage: 'No data available. Try changing your filters or adding new records.',
};

// Custom styling example
const CustomStyledContainer = styled.div`
  height: 500px;
  width: 100%;
  --primary-color: #6200ee;
  --primary-light: #bb86fc;
  --primary-dark: #3700b3;
  --secondary-color: #03dac6;
  --background-color: #f5f5f5;
  --surface-color: #ffffff;
  --error-color: #b00020;
  --on-primary: #ffffff;
  --on-secondary: #000000;
  --on-background: #000000;
  --on-surface: #000000;
  --on-error: #ffffff;
`;

export const CustomStyling = () => {
  return (
    <CustomStyledContainer>
      <DataGrid
        columns={columns}
        data={data}
        enableSorting
        enablePagination
        enableSelection
        enableColumnResize
        pageSize={10}
        style={{
          '--primary-color': 'var(--primary-color)',
          '--primary-light': 'var(--primary-light)',
          '--primary-dark': 'var(--primary-dark)',
          '--secondary-color': 'var(--secondary-color)',
          '--background-color': 'var(--background-color)',
          '--surface-color': 'var(--surface-color)',
          '--error-color': 'var(--error-color)',
          '--on-primary': 'var(--on-primary)',
          '--on-secondary': 'var(--on-secondary)',
          '--on-background': 'var(--on-background)',
          '--on-surface': 'var(--on-surface)',
          '--on-error': 'var(--on-error)',
        } as any}
      />
    </CustomStyledContainer>
  );
};
