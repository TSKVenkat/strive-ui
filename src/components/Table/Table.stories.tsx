import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  age: number;
}

const users: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: ['Admin', 'Editor', 'Viewer'][Math.floor(Math.random() * 3)],
  status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as 'active' | 'inactive' | 'pending',
  lastLogin: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
  age: 20 + Math.floor(Math.random() * 40),
}));

// Status cell renderer
const StatusCell = ({ value }: { value: 'active' | 'inactive' | 'pending' }) => {
  const getColor = () => {
    switch (value) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'neutral';
    }
  };
  
  return (
    <Badge color={getColor()}>{value}</Badge>
  );
};

// Date formatter
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Basic Table
export const Basic: Story = {
  args: {
    data: users.slice(0, 10),
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role',
      },
    ],
  },
};

// Sortable Table
export const Sortable: Story = {
  args: {
    data: users.slice(0, 10),
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        sortable: true,
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
        sortable: true,
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role',
        sortable: true,
      },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age',
        sortable: true,
        sortType: 'number',
      },
    ],
    sortable: true,
  },
};

// Filterable Table
export const Filterable: Story = {
  args: {
    data: users.slice(0, 20),
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role',
      },
    ],
    filterable: true,
  },
};

// Paginated Table
export const Paginated: Story = {
  args: {
    data: users,
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role',
      },
    ],
    pagination: true,
    defaultPageSize: 10,
  },
};

// Selectable Table
export const Selectable: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    
    const handleSelectionChange = (selected: Record<string, boolean>) => {
      setSelectedRows(selected);
    };
    
    const getSelectedCount = () => {
      return Object.keys(selectedRows).filter(key => selectedRows[key]).length;
    };
    
    return (
      <Box display="flex" flexDirection="column" gap={3}>
        <Box>
          <Button disabled={getSelectedCount() === 0}>
            Action on {getSelectedCount()} selected rows
          </Button>
        </Box>
        
        <Table
          data={users.slice(0, 10)}
          columns={[
            {
              id: 'name',
              header: 'Name',
              accessor: 'name',
            },
            {
              id: 'email',
              header: 'Email',
              accessor: 'email',
            },
            {
              id: 'role',
              header: 'Role',
              accessor: 'role',
            },
          ]}
          selectable
          onSelectionChange={handleSelectionChange}
        />
      </Box>
    );
  },
};

// Expandable Table
export const Expandable: Story = {
  args: {
    data: users.slice(0, 10),
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role',
      },
    ],
    expandable: true,
    renderExpandedRow: (row: User) => (
      <Box padding={3} backgroundColor="neutral.50" borderRadius="md">
        <h3>User Details</h3>
        <p>ID: {row.id}</p>
        <p>Age: {row.age}</p>
        <p>Last Login: {formatDate(row.lastLogin)}</p>
      </Box>
    ),
  },
};

// Custom Cell Rendering
export const CustomCells: Story = {
  args: {
    data: users.slice(0, 10),
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
        cell: (value, row) => (
          <Box fontWeight="bold" color="primary.500">
            {value}
          </Box>
        ),
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
        cell: (value) => (
          <a href={`mailto:${value}`}>{value}</a>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        cell: (value) => <StatusCell value={value} />,
      },
      {
        id: 'lastLogin',
        header: 'Last Login',
        accessor: 'lastLogin',
        cell: (value) => formatDate(value),
        sortType: 'datetime',
      },
      {
        id: 'actions',
        header: 'Actions',
        accessor: 'id',
        cell: (value, row) => (
          <Box display="flex" gap={2}>
            <Button size="sm" variant="outline">Edit</Button>
            <Button size="sm" variant="outline" color="error">Delete</Button>
          </Box>
        ),
      },
    ],
    sortable: true,
  },
};

// Loading State
export const Loading: Story = {
  args: {
    data: [],
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role',
      },
    ],
    loading: true,
    loadingMessage: 'Loading data...',
  },
};

// Empty State
export const Empty: Story = {
  args: {
    data: [],
    columns: [
      {
        id: 'name',
        header: 'Name',
        accessor: 'name',
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email',
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role',
      },
    ],
    emptyMessage: 'No users found',
  },
};

// Full Featured Table
export const FullFeatured: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
    
    return (
      <Table
        data={users}
        columns={[
          {
            id: 'name',
            header: 'Name',
            accessor: 'name',
            footer: 'Name',
          },
          {
            id: 'email',
            header: 'Email',
            accessor: 'email',
            footer: 'Email',
          },
          {
            id: 'role',
            header: 'Role',
            accessor: 'role',
            footer: 'Role',
          },
          {
            id: 'status',
            header: 'Status',
            accessor: 'status',
            cell: (value) => <StatusCell value={value} />,
            footer: 'Status',
          },
          {
            id: 'lastLogin',
            header: 'Last Login',
            accessor: 'lastLogin',
            cell: (value) => formatDate(value),
            sortType: 'datetime',
            footer: 'Last Login',
          },
          {
            id: 'age',
            header: 'Age',
            accessor: 'age',
            sortType: 'number',
            footer: `Avg: ${Math.round(users.reduce((sum, user) => sum + user.age, 0) / users.length)}`,
          },
        ]}
        selectable
        expandable
        renderExpandedRow={(row: User) => (
          <Box padding={3} backgroundColor="neutral.50" borderRadius="md">
            <h3>User Details</h3>
            <p>ID: {row.id}</p>
            <p>Full details for {row.name}</p>
          </Box>
        )}
        pagination
        filterable
        sortable
        showFooter
        onSelectionChange={setSelectedRows}
      />
    );
  },
};

// Headless Table Example
export const HeadlessUsage: Story = {
  render: () => {
    const { TableHeadless } = require('./TableHeadless');
    
    return (
      <TableHeadless.Root
        data={users.slice(0, 5)}
        columns={[
          {
            id: 'name',
            header: 'Name',
            accessor: 'name',
          },
          {
            id: 'email',
            header: 'Email',
            accessor: 'email',
          },
          {
            id: 'role',
            header: 'Role',
            accessor: 'role',
          },
        ]}
      >
        <Box border="1px solid" borderColor="neutral.200" borderRadius="md" overflow="hidden">
          <TableHeadless.Table>
            <TableHeadless.Header>
              <TableHeadless.HeaderRow>
                {TableHeadless.useTableContext().visibleColumns.map(column => (
                  <TableHeadless.HeaderCell
                    key={column.id}
                    column={column}
                    style={{
                      padding: '12px',
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                      borderBottom: '1px solid #e0e0e0',
                    }}
                  />
                ))}
              </TableHeadless.HeaderRow>
            </TableHeadless.Header>
            
            <TableHeadless.Body>
              {TableHeadless.useTableContext().paginatedData.map((row, rowIndex) => (
                <TableHeadless.Row
                  key={rowIndex}
                  row={row}
                  index={rowIndex}
                  style={{
                    '&:hover': {
                      backgroundColor: '#f9f9f9',
                    },
                  }}
                >
                  {TableHeadless.useTableContext().visibleColumns.map(column => (
                    <TableHeadless.Cell
                      key={column.id}
                      column={column}
                      row={row}
                      index={rowIndex}
                      style={{
                        padding: '12px',
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    />
                  ))}
                </TableHeadless.Row>
              ))}
              
              <TableHeadless.Empty
                message="No data available"
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: '#666',
                }}
              />
            </TableHeadless.Body>
          </TableHeadless.Table>
        </Box>
      </TableHeadless.Root>
    );
  },
};
