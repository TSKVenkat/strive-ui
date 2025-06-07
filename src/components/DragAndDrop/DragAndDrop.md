# DragAndDrop

The DragAndDrop component provides a flexible and powerful system for implementing drag and drop functionality in your applications. It follows the headless component architecture pattern, separating the logic from the presentation to allow for maximum flexibility and customization.

## Features

- **Flexible API**: Simple yet powerful API for creating draggable elements and drop targets.
- **Custom Drag Previews**: Support for custom drag previews with different styles based on the operation.
- **Multiple Operations**: Support for different drag operations (move, copy, link).
- **Conditional Dropping**: Control when and where items can be dropped.
- **Drag Layer**: Customizable drag layer for showing drag previews.
- **Accessibility**: Built with accessibility in mind.
- **Headless Architecture**: Separate logic from presentation for maximum customization.
- **Styled Components**: Pre-styled components ready for use in your application.

## Installation

```bash
npm install pulseui
# or
yarn add pulseui
```

## Basic Usage

```jsx
import { DragAndDrop } from 'pulseui';

function DragAndDropExample() {
  const handleDrop = (data) => {
    console.log('Item dropped:', data);
    // Handle the drop operation
  };
  
  return (
    <DragAndDrop.Provider>
      {/* Draggable item */}
      <DragAndDrop.Draggable
        data={{ id: 'item-1', type: 'item', payload: { content: 'Drag me' } }}
      >
        <div>Drag me</div>
      </DragAndDrop.Draggable>
      
      {/* Drop target */}
      <DragAndDrop.Droppable
        accept="item"
        onDrop={handleDrop}
      >
        {({ isOver, canDrop }) => (
          <div
            style={{
              padding: '20px',
              backgroundColor: isOver && canDrop ? '#e8f5e9' : '#f5f5f5',
              border: '2px dashed',
              borderColor: isOver && canDrop ? '#4caf50' : '#9e9e9e',
            }}
          >
            Drop here
          </div>
        )}
      </DragAndDrop.Droppable>
      
      {/* Custom drag preview */}
      <DragAndDrop.DragLayer
        renderPreview={(data) => (
          <div>
            {data.payload.content}
          </div>
        )}
      />
    </DragAndDrop.Provider>
  );
}
```

## Advanced Usage

### Sortable List

```jsx
import { DragAndDrop } from 'pulseui';
import { useState } from 'react';

function SortableList() {
  const [items, setItems] = useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);
  
  const moveItem = (dragIndex, hoverIndex) => {
    const newItems = [...items];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    setItems(newItems);
  };
  
  return (
    <DragAndDrop.Provider>
      <div>
        {items.map((item, index) => (
          <DragAndDrop.Draggable
            key={item.id}
            data={{ id: item.id, type: 'list-item', payload: { item, index } }}
          >
            {({ isDragging }) => (
              <DragAndDrop.Droppable
                accept="list-item"
                onDrop={(data) => {
                  const { index: dragIndex } = data.payload;
                  moveItem(dragIndex, index);
                }}
              >
                {({ isOver, canDrop }) => (
                  <div
                    style={{
                      padding: '10px',
                      marginBottom: '8px',
                      backgroundColor: isOver && canDrop ? '#f0f9ff' : 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      opacity: isDragging ? 0.5 : 1,
                    }}
                  >
                    {item.content}
                  </div>
                )}
              </DragAndDrop.Droppable>
            )}
          </DragAndDrop.Draggable>
        ))}
      </div>
      
      <DragAndDrop.DragLayer
        renderPreview={(data) => (
          <div
            style={{
              padding: '10px',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {data.payload.item.content}
          </div>
        )}
      />
    </DragAndDrop.Provider>
  );
}
```

### Kanban Board

```jsx
import { DragAndDrop } from 'pulseui';
import { useState } from 'react';

function KanbanBoard() {
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: 'task-1', content: 'Task 1' },
        { id: 'task-2', content: 'Task 2' },
      ],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      cards: [
        { id: 'task-3', content: 'Task 3' },
      ],
    },
    done: {
      id: 'done',
      title: 'Done',
      cards: [
        { id: 'task-4', content: 'Task 4' },
      ],
    },
  });
  
  const moveCard = (cardId, sourceColumnId, targetColumnId) => {
    if (sourceColumnId === targetColumnId) return;
    
    const sourceColumn = columns[sourceColumnId];
    const targetColumn = columns[targetColumnId];
    
    const card = sourceColumn.cards.find(c => c.id === cardId);
    if (!card) return;
    
    setColumns({
      ...columns,
      [sourceColumnId]: {
        ...sourceColumn,
        cards: sourceColumn.cards.filter(c => c.id !== cardId),
      },
      [targetColumnId]: {
        ...targetColumn,
        cards: [...targetColumn.cards, card],
      },
    });
  };
  
  return (
    <DragAndDrop.Provider>
      <div style={{ display: 'flex', gap: '16px' }}>
        {Object.values(columns).map(column => (
          <div
            key={column.id}
            style={{
              width: '250px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              padding: '8px',
            }}
          >
            <h3>{column.title}</h3>
            
            <DragAndDrop.Droppable
              accept="kanban-card"
              onDrop={(data) => {
                moveCard(data.id, data.payload.sourceColumnId, column.id);
              }}
            >
              {({ isOver, canDrop }) => (
                <div
                  style={{
                    minHeight: '200px',
                    padding: '8px',
                    backgroundColor: isOver && canDrop ? '#e8f5e9' : undefined,
                    borderRadius: '4px',
                  }}
                >
                  {column.cards.map(card => (
                    <DragAndDrop.Draggable
                      key={card.id}
                      data={{
                        id: card.id,
                        type: 'kanban-card',
                        payload: { card, sourceColumnId: column.id },
                      }}
                    >
                      {({ isDragging }) => (
                        <div
                          style={{
                            padding: '8px',
                            marginBottom: '8px',
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            opacity: isDragging ? 0.5 : 1,
                          }}
                        >
                          {card.content}
                        </div>
                      )}
                    </DragAndDrop.Draggable>
                  ))}
                </div>
              )}
            </DragAndDrop.Droppable>
          </div>
        ))}
      </div>
      
      <DragAndDrop.DragLayer
        renderPreview={(data) => (
          <div
            style={{
              padding: '8px',
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            {data.payload.card.content}
          </div>
        )}
      />
    </DragAndDrop.Provider>
  );
}
```

## Headless Usage

For maximum customization, you can use the headless version of the DragAndDrop component:

```jsx
import { DragAndDropHeadless } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

// Custom styled components
const CustomDraggable = styled.div`
  padding: 16px;
  background-color: ${props => props.$isDragging ? '#e3f2fd' : '#ffffff'};
  border: 2px solid ${props => props.$isDragging ? '#2196f3' : '#e0e0e0'};
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const CustomDroppable = styled.div`
  padding: 16px;
  background-color: ${props => 
    props.$isOver && props.$canDrop ? '#e8f5e9' : 
    props.$isOver && !props.$canDrop ? '#ffebee' : '#f5f5f5'};
  border: 2px dashed ${props => 
    props.$isOver && props.$canDrop ? '#4caf50' : 
    props.$isOver && !props.$canDrop ? '#f44336' : '#9e9e9e'};
  border-radius: 8px;
  min-height: 150px;
`;

function HeadlessExample() {
  const [items, setItems] = useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);
  
  const [droppedItems, setDroppedItems] = useState([]);
  
  const handleDrop = (data) => {
    setDroppedItems(prev => [...prev, data.payload]);
    setItems(prev => prev.filter(item => item.id !== data.id));
  };
  
  return (
    <DragAndDropHeadless.Provider>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div>
          <h3>Draggable Items</h3>
          
          {items.map(item => (
            <DragAndDropHeadless.Draggable
              key={item.id}
              data={{ id: item.id, type: 'custom-item', payload: item }}
            >
              {({ isDragging }) => (
                <CustomDraggable $isDragging={isDragging}>
                  {item.content}
                </CustomDraggable>
              )}
            </DragAndDropHeadless.Draggable>
          ))}
        </div>
        
        <div>
          <h3>Drop Zone</h3>
          
          <DragAndDropHeadless.Droppable
            accept="custom-item"
            onDrop={handleDrop}
          >
            {({ isOver, canDrop }) => (
              <CustomDroppable $isOver={isOver} $canDrop={canDrop}>
                {droppedItems.length === 0 ? (
                  <div>Drop items here</div>
                ) : (
                  droppedItems.map(item => (
                    <div key={item.id} style={{ padding: '8px', marginBottom: '8px', backgroundColor: 'white', borderRadius: '4px' }}>
                      {item.content}
                    </div>
                  ))
                )}
              </CustomDroppable>
            )}
          </DragAndDropHeadless.Droppable>
        </div>
      </div>
      
      <DragAndDropHeadless.DragLayer>
        {({ isDragging, dragData, position }) => {
          if (!isDragging || !dragData) return null;
          
          return (
            <div
              style={{
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: 100,
                left: position.x + 15,
                top: position.y + 15,
                backgroundColor: '#ffffff',
                padding: '8px 12px',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                border: '2px solid #2196f3',
              }}
            >
              {dragData.payload.content}
            </div>
          );
        }}
      </DragAndDropHeadless.DragLayer>
    </DragAndDropHeadless.Provider>
  );
}
```

## API Reference

### DragAndDrop.Provider

The provider component that sets up the drag and drop context.

```jsx
<DragAndDrop.Provider>
  {/* Drag and drop components */}
</DragAndDrop.Provider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'div'` | The element type to render |
| `className` | `string` | `undefined` | Custom class name |
| `style` | `React.CSSProperties` | `undefined` | Custom styles |
| `children` | `React.ReactNode` | Required | Children of the component |

### DragAndDrop.Draggable

The component that makes an element draggable.

```jsx
<DragAndDrop.Draggable
  data={{ id: 'item-1', type: 'item', payload: { content: 'Drag me' } }}
  disabled={false}
  allowedOperations={['move', 'copy']}
  onDragStart={(data, position) => console.log('Drag started', data, position)}
  onDragMove={(data, position) => console.log('Dragging', data, position)}
  onDragEnd={(data, position, operation) => console.log('Drag ended', data, position, operation)}
  onDragCancel={(data) => console.log('Drag canceled', data)}
>
  <div>Drag me</div>
</DragAndDrop.Draggable>

// Or with render props
<DragAndDrop.Draggable
  data={{ id: 'item-1', type: 'item', payload: { content: 'Drag me' } }}
>
  {({ isDragging, position }) => (
    <div style={{ opacity: isDragging ? 0.5 : 1 }}>
      Drag me
    </div>
  )}
</DragAndDrop.Draggable>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'div'` | The element type to render |
| `data` | `DragData` | Required | Data for the draggable item |
| `disabled` | `boolean` | `false` | Whether the item is disabled |
| `allowedOperations` | `DragOperation[]` | `['move']` | Allowed drag operations |
| `onDragStart` | `(data: DragData, position: DragPosition) => void` | `undefined` | Callback when drag starts |
| `onDragMove` | `(data: DragData, position: DragPosition) => void` | `undefined` | Callback when drag moves |
| `onDragEnd` | `(data: DragData, position: DragPosition, operation: DragOperation) => void` | `undefined` | Callback when drag ends |
| `onDragCancel` | `(data: DragData) => void` | `undefined` | Callback when drag is canceled |
| `className` | `string` | `undefined` | Custom class name |
| `style` | `React.CSSProperties` | `undefined` | Custom styles |
| `children` | `React.ReactNode \| ((props: { isDragging: boolean; position: DragPosition }) => React.ReactNode)` | Required | Children of the component |

### DragAndDrop.Droppable

The component that makes an element a drop target.

```jsx
<DragAndDrop.Droppable
  accept="item"
  disabled={false}
  onDragOver={(data, position) => console.log('Drag over', data, position)}
  onDragLeave={(data) => console.log('Drag leave', data)}
  onDrop={(data, position, operation) => console.log('Drop', data, position, operation)}
  canDrop={(data) => data.id !== 'item-3'}
>
  <div>Drop here</div>
</DragAndDrop.Droppable>

// Or with render props
<DragAndDrop.Droppable
  accept="item"
  onDrop={(data) => console.log('Drop', data)}
>
  {({ isOver, canDrop, dragData }) => (
    <div
      style={{
        backgroundColor: isOver && canDrop ? '#e8f5e9' : '#f5f5f5',
        border: '2px dashed',
        borderColor: isOver && canDrop ? '#4caf50' : '#9e9e9e',
      }}
    >
      {isOver && canDrop ? 'Release to drop' : 'Drop here'}
    </div>
  )}
</DragAndDrop.Droppable>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'div'` | The element type to render |
| `accept` | `string \| string[]` | Required | Accepted types of draggable items |
| `disabled` | `boolean` | `false` | Whether the drop target is disabled |
| `onDragOver` | `(data: DragData, position: DragPosition) => void` | `undefined` | Callback when an item is dragged over the drop target |
| `onDragLeave` | `(data: DragData) => void` | `undefined` | Callback when an item is dragged out of the drop target |
| `onDrop` | `(data: DragData, position: DragPosition, operation: DragOperation) => void` | `undefined` | Callback when an item is dropped on the drop target |
| `canDrop` | `(data: DragData) => boolean` | `undefined` | Callback to determine if the item can be dropped |
| `className` | `string` | `undefined` | Custom class name |
| `style` | `React.CSSProperties` | `undefined` | Custom styles |
| `children` | `React.ReactNode \| ((props: { isOver: boolean; canDrop: boolean; dragData: DragData | null }) => React.ReactNode)` | Required | Children of the component |

### DragAndDrop.DragLayer

The component that renders a custom drag preview.

```jsx
<DragAndDrop.DragLayer
  renderPreview={(data, operation) => (
    <div
      style={{
        padding: '8px',
        backgroundColor: 'white',
        border: `2px solid ${operation === 'copy' ? 'green' : operation === 'move' ? 'blue' : 'red'}`,
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {data.payload.content}
    </div>
  )}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `renderPreview` | `(data: DragData, operation: DragOperation) => React.ReactNode` | Required | Render function for the drag preview |
| `className` | `string` | `undefined` | Custom class name |
| `style` | `React.CSSProperties` | `undefined` | Custom styles |

### Types

#### DragData

```typescript
interface DragData {
  /**
   * Unique identifier for the dragged item
   */
  id: string;
  /**
   * Type of the dragged item
   */
  type: string;
  /**
   * Data associated with the dragged item
   */
  payload: any;
}
```

#### DragPosition

```typescript
interface DragPosition {
  /**
   * X coordinate
   */
  x: number;
  /**
   * Y coordinate
   */
  y: number;
}
```

#### DragOperation

```typescript
type DragOperation = 'move' | 'copy' | 'link' | 'none';
```

### useDragAndDrop Hook

The `useDragAndDrop` hook provides the core functionality for the DragAndDrop component and can be used independently for custom implementations.

```jsx
import { useDragAndDrop } from 'pulseui';

function CustomDragAndDrop() {
  const {
    dragState,
    startDrag,
    updateDragPosition,
    endDrag,
    cancelDrag,
    setDragOperation,
    createDraggable,
    createDroppable,
  } = useDragAndDrop();
  
  // Use the hook to create custom drag and drop functionality
  
  return (
    <div>
      {/* Custom implementation */}
    </div>
  );
}
```

## Accessibility

The DragAndDrop component is built with accessibility in mind:

- Uses native HTML5 drag and drop API
- Provides visual feedback for drag operations
- Supports keyboard modifiers for different operations (Ctrl for copy, Alt for link)
- Handles focus management properly

## Best Practices

1. **Unique Identifiers**: Always provide unique IDs for draggable items to ensure proper tracking.
2. **Type System**: Use a consistent type system for draggable items and drop targets.
3. **Visual Feedback**: Provide clear visual feedback for drag operations, especially for different operations (move, copy, link).
4. **Performance**: Be mindful of performance when dragging large or complex elements.
5. **Touch Devices**: Consider the experience on touch devices, as HTML5 drag and drop has limited support.
6. **Accessibility**: Ensure your drag and drop interface is accessible to all users.
7. **Error Handling**: Implement proper error handling for drag and drop operations.

## Examples

### File Upload

```jsx
import { DragAndDrop } from 'pulseui';
import { useState } from 'react';

function FileUpload() {
  const [files, setFiles] = useState([]);
  
  const handleFileDrop = (data) => {
    setFiles(prev => [...prev, data.payload]);
  };
  
  const handleRemoveFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };
  
  return (
    <DragAndDrop.Provider>
      <div>
        <h2>File Upload</h2>
        
        <DragAndDrop.Droppable
          accept="file"
          onDrop={handleFileDrop}
        >
          {({ isOver, canDrop }) => (
            <div
              style={{
                padding: '32px',
                backgroundColor: isOver && canDrop ? '#e8f5e9' : '#f5f5f5',
                border: '2px dashed',
                borderColor: isOver && canDrop ? '#4caf50' : '#9e9e9e',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div>Drop files here</div>
              <div>or click to browse</div>
            </div>
          )}
        </DragAndDrop.Droppable>
        
        {files.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h3>Uploaded Files</h3>
            
            {files.map(file => (
              <div
                key={file.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <div>{file.name}</div>
                  <div style={{ fontSize: '0.8em', color: '#666' }}>{file.size} bytes</div>
                </div>
                <button onClick={() => handleRemoveFile(file.id)}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DragAndDrop.Provider>
  );
}
```

### Color Palette

```jsx
import { DragAndDrop } from 'pulseui';
import { useState } from 'react';

function ColorPalette() {
  const [palette, setPalette] = useState([
    { id: 'color-1', color: '#f44336', name: 'Red' },
    { id: 'color-2', color: '#2196f3', name: 'Blue' },
    { id: 'color-3', color: '#4caf50', name: 'Green' },
    { id: 'color-4', color: '#ffeb3b', name: 'Yellow' },
    { id: 'color-5', color: '#9c27b0', name: 'Purple' },
  ]);
  
  const [canvas, setCanvas] = useState([]);
  
  const handleDrop = (data, position) => {
    setCanvas(prev => [
      ...prev,
      {
        id: `canvas-${Date.now()}`,
        colorId: data.id,
        color: data.payload.color,
        position: { x: position.x, y: position.y },
      },
    ]);
  };
  
  return (
    <DragAndDrop.Provider>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ width: '150px' }}>
          <h3>Color Palette</h3>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {palette.map(color => (
              <DragAndDrop.Draggable
                key={color.id}
                data={{ id: color.id, type: 'color', payload: color }}
                allowedOperations={['copy']}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: color.color,
                    borderRadius: '4px',
                    cursor: 'grab',
                  }}
                  title={color.name}
                />
              </DragAndDrop.Draggable>
            ))}
          </div>
        </div>
        
        <div>
          <h3>Canvas</h3>
          
          <DragAndDrop.Droppable
            accept="color"
            onDrop={(data, position) => handleDrop(data, position)}
          >
            {({ isOver, canDrop }) => (
              <div
                style={{
                  width: '400px',
                  height: '300px',
                  backgroundColor: '#f5f5f5',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  position: 'relative',
                }}
              >
                {canvas.map(item => (
                  <div
                    key={item.id}
                    style={{
                      position: 'absolute',
                      left: item.position.x - 20,
                      top: item.position.y - 20,
                      width: '40px',
                      height: '40px',
                      backgroundColor: item.color,
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </div>
            )}
          </DragAndDrop.Droppable>
        </div>
      </div>
      
      <DragAndDrop.DragLayer
        renderPreview={(data) => (
          <div
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: data.payload.color,
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}
          />
        )}
      />
    </DragAndDrop.Provider>
  );
}
```

## Conclusion

The DragAndDrop component provides a flexible and powerful solution for implementing drag and drop functionality in your React applications. With its headless architecture, you can either use the pre-styled components or create your own custom UI while leveraging the built-in logic for drag and drop operations.
