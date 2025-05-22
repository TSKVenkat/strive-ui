import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Pagination, PaginationProps } from './Pagination';
import styled from 'styled-components';

export default {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: 'Pagination component for navigating through multiple pages of content.'
      }
    }
  },
  argTypes: {
    totalPages: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'The total number of pages',
    },
    currentPage: {
      control: { type: 'number', min: 1, max: 100 },
      description: 'The current page (1-based)',
    },
    siblingCount: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'The number of pages to show on each side of the current page',
    },
    boundaryCount: {
      control: { type: 'number', min: 0, max: 5 },
      description: 'The number of pages to show at the beginning and end',
    },
    showFirstButton: {
      control: 'boolean',
      description: 'Whether to show the first page button',
    },
    showLastButton: {
      control: 'boolean',
      description: 'Whether to show the last page button',
    },
    showPrevButton: {
      control: 'boolean',
      description: 'Whether to show the previous page button',
    },
    showNextButton: {
      control: 'boolean',
      description: 'Whether to show the next page button',
    },
    variant: {
      control: { type: 'select', options: ['default', 'rounded', 'outlined', 'filled'] },
      description: 'The variant of the pagination',
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'] },
      description: 'The size of the pagination',
    },
    shape: {
      control: { type: 'select', options: ['square', 'rounded', 'circular'] },
      description: 'The shape of the pagination items',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether to disable the pagination',
    },
    hideOnSinglePage: {
      control: 'boolean',
      description: 'Whether to hide the pagination when there\'s only one page',
    },
    showPageNumbers: {
      control: 'boolean',
      description: 'Whether to show page numbers',
    },
    loading: {
      control: 'boolean',
      description: 'Whether to show a loading state',
    },
    responsiveCompact: {
      control: 'boolean',
      description: 'Whether to show a compact version on mobile',
    },
    showJumpToPage: {
      control: 'boolean',
      description: 'Whether to show a jump to page input',
    },
    showPageSizeSelector: {
      control: 'boolean',
      description: 'Whether to show a page size selector',
    },
    showTotalItems: {
      control: 'boolean',
      description: 'Whether to show the total items count',
    },
    showItemsRange: {
      control: 'boolean',
      description: 'Whether to show the current range of items',
    },
  },
} as Meta;

const Template: Story<PaginationProps> = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
  const [pageSize, setPageSize] = useState(args.pageSize || 10);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
  };
  
  return (
    <Pagination
      {...args}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      pageSize={pageSize}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  totalPages: 10,
  currentPage: 1,
  siblingCount: 1,
  boundaryCount: 1,
  showFirstButton: true,
  showLastButton: true,
  showPrevButton: true,
  showNextButton: true,
  variant: 'default',
  size: 'md',
  shape: 'rounded',
  disabled: false,
  hideOnSinglePage: true,
  showPageNumbers: true,
  loading: false,
  responsiveCompact: true,
};

export const Variants = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <Stack>
      <div>
        <h3>Default</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          variant="default"
        />
      </div>
      
      <div>
        <h3>Rounded</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          variant="rounded"
        />
      </div>
      
      <div>
        <h3>Outlined</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          variant="outlined"
        />
      </div>
      
      <div>
        <h3>Filled</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          variant="filled"
        />
      </div>
    </Stack>
  );
};

export const Sizes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <Stack>
      <div>
        <h3>Small</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          size="sm"
        />
      </div>
      
      <div>
        <h3>Medium</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          size="md"
        />
      </div>
      
      <div>
        <h3>Large</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          size="lg"
        />
      </div>
    </Stack>
  );
};

export const Shapes = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <Stack>
      <div>
        <h3>Square</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          shape="square"
        />
      </div>
      
      <div>
        <h3>Rounded</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          shape="rounded"
        />
      </div>
      
      <div>
        <h3>Circular</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          shape="circular"
        />
      </div>
    </Stack>
  );
};

export const CustomBoundaries = () => {
  const [currentPage, setCurrentPage] = useState(5);
  
  return (
    <Stack>
      <div>
        <h3>Default (siblingCount=1, boundaryCount=1)</h3>
        <Pagination
          totalPages={20}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          siblingCount={1}
          boundaryCount={1}
        />
      </div>
      
      <div>
        <h3>More siblings (siblingCount=2, boundaryCount=1)</h3>
        <Pagination
          totalPages={20}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          siblingCount={2}
          boundaryCount={1}
        />
      </div>
      
      <div>
        <h3>More boundaries (siblingCount=1, boundaryCount=2)</h3>
        <Pagination
          totalPages={20}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          siblingCount={1}
          boundaryCount={2}
        />
      </div>
      
      <div>
        <h3>Show all (siblingCount=10, boundaryCount=10)</h3>
        <Pagination
          totalPages={20}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          siblingCount={10}
          boundaryCount={10}
        />
      </div>
    </Stack>
  );
};

export const States = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <Stack>
      <div>
        <h3>Default</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
      
      <div>
        <h3>Disabled</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          disabled
        />
      </div>
      
      <div>
        <h3>Loading</h3>
        <Pagination
          totalPages={10}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          loading
        />
      </div>
    </Stack>
  );
};

export const WithJumpToPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  return (
    <Pagination
      totalPages={100}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showJumpToPage
      jumpToPageLabel="Go to page:"
      jumpToPagePlaceholder="Page"
      jumpToPageButtonText="Go"
    />
  );
};

export const WithPageSizeSelector = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 235;
  
  // Recalculate total pages when page size changes
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showPageSizeSelector
      pageSizeOptions={[10, 20, 50, 100]}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeLabel="Items per page:"
      totalItems={totalItems}
      showTotalItems
    />
  );
};

export const WithItemsRange = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 235;
  
  // Recalculate total pages when page size changes
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showPageSizeSelector
      pageSizeOptions={[10, 20, 50, 100]}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeLabel="Items per page:"
      totalItems={totalItems}
      showItemsRange
      itemsRangeFormat="{start}-{end} of {total} items"
    />
  );
};

export const CompleteExample = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 235;
  
  // Recalculate total pages when page size changes
  const totalPages = Math.ceil(totalItems / pageSize);
  
  return (
    <Pagination
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      showPageSizeSelector
      pageSizeOptions={[10, 20, 50, 100]}
      pageSize={pageSize}
      onPageSizeChange={setPageSize}
      pageSizeLabel="Items per page:"
      totalItems={totalItems}
      showItemsRange
      itemsRangeFormat="{start}-{end} of {total} items"
      showJumpToPage
      jumpToPageLabel="Go to page:"
      variant="filled"
      size="md"
      shape="rounded"
    />
  );
};

// Styled components for the stories
const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
  }
`;
