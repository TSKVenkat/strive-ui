# SortableList

The SortableList component provides a flexible and accessible way to create sortable lists with drag and drop functionality. It allows users to reorder items by dragging them to a new position.

## Features

- **Flexible API**: Create sortable lists with minimal configuration
- **Headless Architecture**: Separate logic from presentation for maximum customization
- **Accessible**: Built with keyboard navigation and screen reader support
- **Animated**: Smooth animations for drag and drop interactions
- **Customizable**: Style and render items however you want
- **Responsive**: Works on both desktop and mobile devices
- **Direction Support**: Create both vertical and horizontal sortable lists
- **Disabled Items**: Support for disabling specific items or the entire list
- **Empty State**: Customizable empty state when there are no items

## Installation

```bash
npm install @strive-ui/sortable-list
```

## Basic Usage

```jsx
import { SortableList } from 'strive-ui';
import { useState } from 'react';

function MyComponent() {
  const [items, setItems] = useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);

  return (
    <SortableList
      items={items}
      onReorder={setItems}
      renderItem={(item) => <div>{item.content}</div>}
      emptyContent="No items available"
    />
  );
}
```

## Advanced Usage

### Horizontal List

```jsx
<SortableList
  items={items}
  onReorder={setItems}
  direction="horizontal"
  renderItem={(item) => <div>{item.content}</div>}
/>
```

### With Disabled Items

```jsx
const items = [
  { id: '1', content: 'Item 1', disabled: false },
  { id: '2', content: 'Item 2', disabled: true }, // This item cannot be dragged
  { id: '3', content: 'Item 3', disabled: false },
];

<SortableList
  items={items}
  onReorder={setItems}
  renderItem={(item) => <div>{item.content}</div>}
/>
```

### Custom Drag Preview

```jsx
<SortableList
  items={items}
  onReorder={setItems}
  renderItem={(item) => <div>{item.content}</div>}
  renderDragPreview={(item) => (
    <div style={{ padding: '10px', background: '#f0f0f0', border: '1px dashed #ccc' }}>
      {item.content}
    </div>
  )}
/>
```

## Headless Usage

For maximum customization, you can use the headless version of the component:

```jsx
import { SortableListHeadless } from 'strive-ui';
import { useState } from 'react';
import styled from 'styled-components';

const CustomItem = styled.div`
  padding: 16px;
  margin-bottom: 8px;
  background-color: ${({ $isDragging }) => ($isDragging ? '#e3f2fd' : '#ffffff')};
  border: 1px solid ${({ $isDragging }) => ($isDragging ? '#2196f3' : '#e0e0e0')};
  border-radius: 4px;
`;

function MyComponent() {
  const [items, setItems] = useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);

  return (
    <SortableListHeadless.Root
      items={items}
      onReorder={setItems}
    >
      <SortableListHeadless.Container>
        {items.map((item, index) => (
          <SortableListHeadless.Item
            key={item.id}
            item={item}
            index={index}
          >
            {({ isDragging, isOver }) => (
              <CustomItem $isDragging={isDragging} $isOver={isOver}>
                {item.content}
              </CustomItem>
            )}
          </SortableListHeadless.Item>
        ))}
      </SortableListHeadless.Container>
      
      <SortableListHeadless.Empty>
        <div>No items available</div>
      </SortableListHeadless.Empty>
      
      <SortableListHeadless.DragPreview>
        {(item) => (
          <div style={{ padding: '16px', background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            {item.content}
          </div>
        )}
      </SortableListHeadless.DragPreview>
    </SortableListHeadless.Root>
  );
}
```

## API Reference

### SortableList Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `SortableItem[]` | Required | Array of items to render in the list |
| `onReorder` | `(items: SortableItem[]) => void` | - | Callback when items are reordered |
| `renderItem` | `(item: SortableItem, index: number) => ReactNode` | Required | Function to render each item |
| `renderDragPreview` | `(item: SortableItem) => ReactNode` | - | Function to render the drag preview |
| `emptyContent` | `ReactNode` | 'No items' | Content to show when the list is empty |
| `direction` | `'vertical' \| 'horizontal'` | 'vertical' | Direction of the list |
| `disabled` | `boolean` | `false` | Whether the list is disabled |
| `type` | `string` | 'sortable-item' | Type of the draggable items |
| `allowedOperations` | `DragOperation[]` | ['move'] | Allowed drag operations |
| `onDragStart` | `(item: SortableItem, index: number) => void` | - | Callback when drag starts |
| `onDragEnd` | `(item: SortableItem, sourceIndex: number, destinationIndex: number) => void` | - | Callback when drag ends |
| `onDragCancel` | `(item: SortableItem) => void` | - | Callback when drag is canceled |
| `className` | `string` | - | Custom class name |
| `style` | `CSSProperties` | - | Custom styles |

### SortableItem Interface

```typescript
interface SortableItem {
  id: string;
  disabled?: boolean;
  [key: string]: any;
}
```

### SortableListHeadless Components

#### Root

```typescript
interface RootProps<T extends SortableItem = SortableItem> extends SortableListOptions<T> {
  children: ReactNode;
}
```

#### Container

```typescript
interface ContainerProps<C extends React.ElementType> {
  as?: C;
  children: ReactNode;
  [key: string]: any;
}
```

#### Item

```typescript
interface ItemProps<T extends SortableItem = SortableItem> {
  item: T;
  index: number;
  children: ReactNode | ((props: { isDragging: boolean; isOver: boolean }) => ReactNode);
}
```

#### DragPreview

```typescript
interface DragPreviewProps<T extends SortableItem = SortableItem> {
  children: (item: T) => ReactNode;
}
```

#### Empty

```typescript
interface EmptyProps<C extends React.ElementType> {
  as?: C;
  children: ReactNode;
  [key: string]: any;
}
```

## useSortableList Hook

For even more control, you can use the `useSortableList` hook directly:

```typescript
function useSortableList<T extends SortableItem = SortableItem>(
  options: SortableListOptions<T>
): UseSortableListReturn<T>;
```

### SortableListOptions

```typescript
interface SortableListOptions<T extends SortableItem = SortableItem> {
  items: T[];
  onReorder?: (items: T[]) => void;
  type?: string;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
  allowedOperations?: DragOperation[];
  onDragStart?: (item: T, index: number) => void;
  onDragEnd?: (item: T, sourceIndex: number, destinationIndex: number) => void;
  onDragCancel?: (item: T) => void;
}
```

### UseSortableListReturn

```typescript
interface UseSortableListReturn<T extends SortableItem = SortableItem> {
  items: T[];
  setItems: (items: T[]) => void;
  getItemProps: (item: T, index: number) => {...};
  getContainerProps: () => {...};
  getDroppableProps: (index: number) => {...};
  moveItem: (fromIndex: number, toIndex: number) => void;
  draggedIndex: number | null;
  overIndex: number | null;
  isDragging: boolean;
}
```

## Accessibility

The SortableList component follows WAI-ARIA guidelines for drag and drop interactions:

- Uses appropriate ARIA attributes for drag and drop operations
- Supports keyboard navigation for drag and drop operations
- Provides visual feedback during drag operations
- Announces drag and drop operations to screen readers

## Browser Support

The SortableList component works in all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## Dependencies

- React 16.8.0 or higher
- styled-components 5.0.0 or higher
- framer-motion 4.0.0 or higher

## License

MIT
