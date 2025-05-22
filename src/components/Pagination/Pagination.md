# Pagination Component

The Pagination component enables users to navigate through multiple pages of content, providing controls to move between pages and visual feedback on the current page.

## Import

```jsx
import { Pagination } from 'strive-ui';
```

## Features

- Customizable page controls
- Various size options
- Support for different visual variants
- First/last page navigation
- Previous/next page navigation
- Page number display
- Responsive design
- Accessible implementation

## Usage

```jsx
import { Pagination } from 'strive-ui';
import { useState } from 'react';

function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
}
```

## Advanced Usage

```jsx
import { Pagination } from 'strive-ui';
import { useState } from 'react';

function AdvancedPaginationExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;
  
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      size="md"
      variant="outline"
      showFirstLast
      siblingCount={1}
      boundaryCount={1}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | number | 1 | The current active page |
| `totalPages` | number | - | Total number of pages |
| `onPageChange` | (page: number) => void | - | Callback when page changes |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Size of the pagination controls |
| `variant` | 'solid' \| 'outline' \| 'ghost' | 'solid' | Visual variant of the pagination controls |
| `showFirstLast` | boolean | false | Whether to show first/last page buttons |
| `showPrevNext` | boolean | true | Whether to show previous/next page buttons |
| `showPageNumbers` | boolean | true | Whether to show page number buttons |
| `siblingCount` | number | 1 | Number of siblings on each side of the current page |
| `boundaryCount` | number | 1 | Number of pages to show at the beginning and end |
| `disabled` | boolean | false | Whether the pagination is disabled |
| `shape` | 'round' \| 'square' | 'round' | Shape of the pagination buttons |
| `compact` | boolean | false | Whether to use a compact layout |
| `itemsPerPage` | number | - | Number of items per page (for displaying item range) |
| `totalItems` | number | - | Total number of items (for displaying item range) |
| `showItemsPerPageSelect` | boolean | false | Whether to show items per page selector |
| `itemsPerPageOptions` | number[] | [10, 25, 50, 100] | Options for items per page selector |
| `onItemsPerPageChange` | (itemsPerPage: number) => void | - | Callback when items per page changes |

## Examples

### Basic Pagination

```jsx
<Pagination
  currentPage={3}
  totalPages={10}
  onPageChange={(page) => console.log(`Page changed to ${page}`)}
/>
```

### With First/Last Buttons

```jsx
<Pagination
  currentPage={5}
  totalPages={20}
  onPageChange={(page) => console.log(`Page changed to ${page}`)}
  showFirstLast
/>
```

### Different Sizes

```jsx
<Pagination
  currentPage={3}
  totalPages={10}
  size="sm"
  onPageChange={(page) => console.log(`Page changed to ${page}`)}
/>

<Pagination
  currentPage={3}
  totalPages={10}
  size="md"
  onPageChange={(page) => console.log(`Page changed to ${page}`)}
/>

<Pagination
  currentPage={3}
  totalPages={10}
  size="lg"
  onPageChange={(page) => console.log(`Page changed to ${page}`)}
/>
```

### Different Variants

```jsx
<Pagination
  currentPage={3}
  totalPages={10}
  variant="solid"
  onPageChange={(page) => console.log(`Page changed to ${page}`)}
/>

<Pagination
  currentPage={3}
  totalPages={10}
  variant="outline"
  onPageChange={(page) => console.log(`Page changed to ${page}`)}
/>

<Pagination
  currentPage={3}
  totalPages={10}
  variant="ghost"
  onPageChange={(page) => console.log(`Page changed to ${page}`)}
/>
```

### With Items Per Page Selector

```jsx
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const totalItems = 243;

<Pagination
  currentPage={currentPage}
  totalPages={Math.ceil(totalItems / itemsPerPage)}
  onPageChange={setCurrentPage}
  itemsPerPage={itemsPerPage}
  totalItems={totalItems}
  showItemsPerPageSelect
  itemsPerPageOptions={[5, 10, 25, 50]}
  onItemsPerPageChange={setItemsPerPage}
/>
```

## Accessibility

The Pagination component follows accessibility best practices:
- Uses appropriate ARIA roles and attributes
- Provides proper keyboard navigation
- Includes focus management for interactive elements
- Ensures adequate color contrast for all states
- Includes appropriate labels for screen readers
- Follows a logical tab order
