import { useState, useCallback, useRef } from 'react';
import { DragData, DragPosition, DragOperation } from '../DragAndDrop';

/**
 * Item in the sortable list
 */
export interface SortableItem {
  /**
   * Unique identifier for the item
   */
  id: string;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Custom data associated with the item
   */
  [key: string]: any;
}

/**
 * Options for the sortable list
 */
export interface SortableListOptions<T extends SortableItem = SortableItem> {
  /**
   * Items in the list
   */
  items: T[];
  /**
   * Callback when items are reordered
   */
  onReorder?: (items: T[]) => void;
  /**
   * Type of the draggable items
   */
  type?: string;
  /**
   * Whether the list is disabled
   */
  disabled?: boolean;
  /**
   * Direction of the list
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Allowed drag operations
   */
  allowedOperations?: DragOperation[];
  /**
   * Callback when drag starts
   */
  onDragStart?: (item: T, index: number) => void;
  /**
   * Callback when drag ends
   */
  onDragEnd?: (item: T, sourceIndex: number, destinationIndex: number) => void;
  /**
   * Callback when drag is canceled
   */
  onDragCancel?: (item: T) => void;
}

/**
 * Return type for the useSortableList hook
 */
export interface UseSortableListReturn<T extends SortableItem = SortableItem> {
  /**
   * Items in the list
   */
  items: T[];
  /**
   * Set items in the list
   */
  setItems: (items: T[]) => void;
  /**
   * Get props for a draggable item
   */
  getItemProps: (item: T, index: number) => {
    /**
     * Data for the draggable item
     */
    data: DragData;
    /**
     * Whether the item is disabled
     */
    disabled: boolean;
    /**
     * Allowed drag operations
     */
    allowedOperations: DragOperation[];
    /**
     * Callback when drag starts
     */
    onDragStart: (data: DragData, position: DragPosition) => void;
    /**
     * Callback when drag ends
     */
    onDragEnd: (data: DragData, position: DragPosition, operation: DragOperation) => void;
    /**
     * Callback when drag is canceled
     */
    onDragCancel: (data: DragData) => void;
  };
  /**
   * Get props for a droppable container
   */
  getContainerProps: () => {
    /**
     * Accepted types of draggable items
     */
    accept: string;
  };
  /**
   * Get props for a droppable zone
   */
  getDroppableProps: (index: number) => {
    /**
     * Accepted types of draggable items
     */
    accept: string;
    /**
     * Callback when an item is dropped
     */
    onDrop: (data: DragData, position: DragPosition, operation: DragOperation) => void;
  };
  /**
   * Move an item from one position to another
   */
  moveItem: (fromIndex: number, toIndex: number) => void;
  /**
   * The index of the item being dragged
   */
  draggedIndex: number | null;
  /**
   * The index of the item being hovered over
   */
  overIndex: number | null;
  /**
   * Whether an item is being dragged
   */
  isDragging: boolean;
}

/**
 * Hook for creating a sortable list
 */
export function useSortableList<T extends SortableItem = SortableItem>(
  options: SortableListOptions<T>
): UseSortableListReturn<T> {
  const {
    items: initialItems,
    onReorder,
    type = 'sortable-item',
    disabled = false,
    direction = 'vertical',
    allowedOperations = ['move'],
    onDragStart,
    onDragEnd,
    onDragCancel,
  } = options;

  // State for the items
  const [items, setItems] = useState<T[]>(initialItems);
  // State for tracking the dragged item
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  // State for tracking the item being hovered over
  const [overIndex, setOverIndex] = useState<number | null>(null);
  // Ref for tracking whether an item is being dragged
  const isDraggingRef = useRef<boolean>(false);

  // Update items when initialItems change
  useState(() => {
    setItems(initialItems);
  });

  // Move an item from one position to another
  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      const newItems = [...items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      
      setItems(newItems);
      onReorder?.(newItems);
    },
    [items, onReorder]
  );

  // Get props for a draggable item
  const getItemProps = useCallback(
    (item: T, index: number) => {
      return {
        data: {
          id: item.id,
          type,
          payload: { item, index },
        },
        disabled: disabled || !!item.disabled,
        allowedOperations,
        onDragStart: (data: DragData) => {
          setDraggedIndex(index);
          isDraggingRef.current = true;
          onDragStart?.(item, index);
        },
        onDragEnd: (data: DragData, position: DragPosition, operation: DragOperation) => {
          const sourceIndex = index;
          const destinationIndex = overIndex !== null ? overIndex : index;
          
          if (sourceIndex !== destinationIndex && overIndex !== null) {
            moveItem(sourceIndex, destinationIndex);
            onDragEnd?.(item, sourceIndex, destinationIndex);
          }
          
          setDraggedIndex(null);
          setOverIndex(null);
          isDraggingRef.current = false;
        },
        onDragCancel: (data: DragData) => {
          setDraggedIndex(null);
          setOverIndex(null);
          isDraggingRef.current = false;
          onDragCancel?.(item);
        },
      };
    },
    [
      type,
      disabled,
      allowedOperations,
      moveItem,
      overIndex,
      onDragStart,
      onDragEnd,
      onDragCancel,
    ]
  );

  // Get props for a droppable container
  const getContainerProps = useCallback(() => {
    return {
      accept: type,
    };
  }, [type]);

  // Get props for a droppable zone
  const getDroppableProps = useCallback(
    (index: number) => {
      return {
        accept: type,
        onDrop: (data: DragData) => {
          const sourceIndex = data.payload.index;
          const destinationIndex = index;
          
          if (sourceIndex !== destinationIndex) {
            moveItem(sourceIndex, destinationIndex);
            const item = items[sourceIndex];
            onDragEnd?.(item, sourceIndex, destinationIndex);
          }
          
          setDraggedIndex(null);
          setOverIndex(null);
          isDraggingRef.current = false;
        },
        onDragOver: () => {
          setOverIndex(index);
        },
        onDragLeave: () => {
          if (overIndex === index) {
            setOverIndex(null);
          }
        },
      };
    },
    [type, items, moveItem, overIndex, onDragEnd]
  );

  return {
    items,
    setItems,
    getItemProps,
    getContainerProps,
    getDroppableProps,
    moveItem,
    draggedIndex,
    overIndex,
    isDragging: isDraggingRef.current,
  };
}

export default useSortableList;
