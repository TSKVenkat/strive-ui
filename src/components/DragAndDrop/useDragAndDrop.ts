import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Types of drag operations
 */
export type DragOperation = 'move' | 'copy' | 'link' | 'none';

/**
 * Position of the dragged item
 */
export interface DragPosition {
  x: number;
  y: number;
}

/**
 * Data for the dragged item
 */
export interface DragData {
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

/**
 * State of the drag operation
 */
export interface DragState {
  /**
   * Whether an item is being dragged
   */
  isDragging: boolean;
  /**
   * The data of the dragged item
   */
  dragData: DragData | null;
  /**
   * The position of the dragged item
   */
  position: DragPosition;
  /**
   * The allowed drag operations
   */
  allowedOperations: DragOperation[];
  /**
   * The current drag operation
   */
  currentOperation: DragOperation;
}

/**
 * Options for the draggable item
 */
export interface DraggableOptions {
  /**
   * Data for the draggable item
   */
  data: DragData;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Allowed drag operations
   */
  allowedOperations?: DragOperation[];
  /**
   * Callback when drag starts
   */
  onDragStart?: (data: DragData, position: DragPosition) => void;
  /**
   * Callback when drag moves
   */
  onDragMove?: (data: DragData, position: DragPosition) => void;
  /**
   * Callback when drag ends
   */
  onDragEnd?: (data: DragData, position: DragPosition, operation: DragOperation) => void;
  /**
   * Callback when drag is canceled
   */
  onDragCancel?: (data: DragData) => void;
}

/**
 * Options for the drop target
 */
export interface DroppableOptions {
  /**
   * Accepted types of draggable items
   */
  accept: string | string[];
  /**
   * Whether the drop target is disabled
   */
  disabled?: boolean;
  /**
   * Callback when an item is dragged over the drop target
   */
  onDragOver?: (data: DragData, position: DragPosition) => void;
  /**
   * Callback when an item is dragged out of the drop target
   */
  onDragLeave?: (data: DragData) => void;
  /**
   * Callback when an item is dropped on the drop target
   */
  onDrop?: (data: DragData, position: DragPosition, operation: DragOperation) => void;
  /**
   * Callback to determine if the item can be dropped
   */
  canDrop?: (data: DragData) => boolean;
}

/**
 * Return type for the useDraggable hook
 */
export interface UseDraggableReturn {
  /**
   * Props to spread on the draggable element
   */
  draggableProps: {
    draggable: boolean;
    onDragStart: (e: React.DragEvent) => void;
    onDrag: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
  };
  /**
   * Whether the item is being dragged
   */
  isDragging: boolean;
  /**
   * The current position of the dragged item
   */
  position: DragPosition;
}

/**
 * Return type for the useDroppable hook
 */
export interface UseDroppableReturn {
  /**
   * Props to spread on the droppable element
   */
  droppableProps: {
    onDragOver: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  /**
   * Whether an item is being dragged over the drop target
   */
  isOver: boolean;
  /**
   * Whether the dragged item can be dropped on the target
   */
  canDrop: boolean;
  /**
   * The data of the dragged item
   */
  dragData: DragData | null;
}

/**
 * Return type for the useDragAndDrop hook
 */
export interface UseDragAndDropReturn {
  /**
   * The current state of the drag operation
   */
  dragState: DragState;
  /**
   * Start a drag operation
   */
  startDrag: (data: DragData, position: DragPosition, allowedOperations?: DragOperation[]) => void;
  /**
   * Update the position of the dragged item
   */
  updateDragPosition: (position: DragPosition) => void;
  /**
   * End the drag operation
   */
  endDrag: (operation?: DragOperation) => void;
  /**
   * Cancel the drag operation
   */
  cancelDrag: () => void;
  /**
   * Set the current drag operation
   */
  setDragOperation: (operation: DragOperation) => void;
  /**
   * Create a draggable item
   */
  createDraggable: (options: DraggableOptions) => UseDraggableReturn;
  /**
   * Create a drop target
   */
  createDroppable: (options: DroppableOptions) => UseDroppableReturn;
}

/**
 * Hook for creating a drag and drop system
 */
export function useDragAndDrop(): UseDragAndDropReturn {
  // State for the drag operation
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragData: null,
    position: { x: 0, y: 0 },
    allowedOperations: ['move'],
    currentOperation: 'move',
  });

  // Ref to track active drop targets
  const activeDropTargets = useRef<Set<HTMLElement>>(new Set());

  // Start a drag operation
  const startDrag = useCallback((data: DragData, position: DragPosition, allowedOperations: DragOperation[] = ['move']) => {
    setDragState({
      isDragging: true,
      dragData: data,
      position,
      allowedOperations,
      currentOperation: allowedOperations[0] || 'none',
    });
  }, []);

  // Update the position of the dragged item
  const updateDragPosition = useCallback((position: DragPosition) => {
    setDragState((prev) => ({
      ...prev,
      position,
    }));
  }, []);

  // End the drag operation
  const endDrag = useCallback((operation?: DragOperation) => {
    setDragState((prev) => {
      const finalOperation = operation || prev.currentOperation;
      // Only end if we're actually dragging
      if (prev.isDragging) {
        return {
          isDragging: false,
          dragData: null,
          position: { x: 0, y: 0 },
          allowedOperations: ['move'],
          currentOperation: 'move',
        };
      }
      return prev;
    });
    // Clear active drop targets
    activeDropTargets.current.clear();
  }, []);

  // Cancel the drag operation
  const cancelDrag = useCallback(() => {
    setDragState((prev) => {
      // Only cancel if we're actually dragging
      if (prev.isDragging) {
        return {
          isDragging: false,
          dragData: null,
          position: { x: 0, y: 0 },
          allowedOperations: ['move'],
          currentOperation: 'move',
        };
      }
      return prev;
    });
    // Clear active drop targets
    activeDropTargets.current.clear();
  }, []);

  // Set the current drag operation
  const setDragOperation = useCallback((operation: DragOperation) => {
    setDragState((prev) => {
      // Only update if the operation is allowed
      if (prev.allowedOperations.includes(operation) || operation === 'none') {
        return {
          ...prev,
          currentOperation: operation,
        };
      }
      return prev;
    });
  }, []);

  // Create a draggable item
  const createDraggable = useCallback(
    (options: DraggableOptions): UseDraggableReturn => {
      const { data, disabled = false, allowedOperations = ['move'], onDragStart, onDragMove, onDragEnd, onDragCancel } = options;

      // Track if this specific draggable is being dragged
      const [isDragging, setIsDragging] = useState(false);
      const [position, setPosition] = useState<DragPosition>({ x: 0, y: 0 });

      // Handle drag start
      const handleDragStart = (e: React.DragEvent) => {
        if (disabled) {
          e.preventDefault();
          return;
        }

        // Set the drag image (optional)
        if (e.dataTransfer.setDragImage) {
          const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
          dragImage.style.position = 'absolute';
          dragImage.style.top = '-1000px';
          document.body.appendChild(dragImage);
          e.dataTransfer.setDragImage(dragImage, 0, 0);
          setTimeout(() => {
            document.body.removeChild(dragImage);
          }, 0);
        }

        // Set the allowed effects
        e.dataTransfer.effectAllowed = allowedOperations.includes('copy')
          ? 'copy'
          : allowedOperations.includes('move')
          ? 'move'
          : allowedOperations.includes('link')
          ? 'link'
          : 'none';

        // Set the data
        e.dataTransfer.setData('application/json', JSON.stringify(data));

        // Get the position
        const newPosition = { x: e.clientX, y: e.clientY };
        setPosition(newPosition);
        setIsDragging(true);

        // Start the drag in the global state
        startDrag(data, newPosition, allowedOperations);

        // Call the callback
        onDragStart?.(data, newPosition);
      };

      // Handle drag
      const handleDrag = (e: React.DragEvent) => {
        if (e.clientX === 0 && e.clientY === 0) {
          // Ignore events with no coordinates (happens when dragging outside the window)
          return;
        }

        const newPosition = { x: e.clientX, y: e.clientY };
        setPosition(newPosition);
        updateDragPosition(newPosition);

        // Call the callback
        onDragMove?.(data, newPosition);
      };

      // Handle drag end
      const handleDragEnd = (e: React.DragEvent) => {
        const newPosition = { x: e.clientX, y: e.clientY };
        setPosition(newPosition);
        setIsDragging(false);

        // Determine the operation
        let operation: DragOperation = 'none';
        switch (e.dataTransfer.dropEffect) {
          case 'copy':
            operation = 'copy';
            break;
          case 'link':
            operation = 'link';
            break;
          case 'move':
            operation = 'move';
            break;
          default:
            operation = 'none';
            break;
        }

        // End the drag in the global state
        endDrag(operation);

        // Call the appropriate callback
        if (operation === 'none') {
          onDragCancel?.(data);
        } else {
          onDragEnd?.(data, newPosition, operation);
        }
      };

      return {
        draggableProps: {
          draggable: !disabled,
          onDragStart: handleDragStart,
          onDrag: handleDrag,
          onDragEnd: handleDragEnd,
        },
        isDragging,
        position,
      };
    },
    [startDrag, updateDragPosition, endDrag]
  );

  // Create a drop target
  const createDroppable = useCallback(
    (options: DroppableOptions): UseDroppableReturn => {
      const { accept, disabled = false, onDragOver, onDragLeave, onDrop, canDrop: canDropFn } = options;

      // Track if an item is being dragged over this drop target
      const [isOver, setIsOver] = useState(false);
      // Track if the dragged item can be dropped on this target
      const [canDrop, setCanDrop] = useState(false);
      // Track the dragged item's data
      const [draggedData, setDraggedData] = useState<DragData | null>(null);

      // Check if the dragged item is accepted by this drop target
      const isAccepted = useCallback(
        (type: string) => {
          if (Array.isArray(accept)) {
            return accept.includes(type);
          }
          return accept === type;
        },
        [accept]
      );

      // Handle drag over
      const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (disabled) return;

        try {
          // Get the dragged item's data
          const dataStr = e.dataTransfer.getData('application/json');
          if (!dataStr) return;

          const data = JSON.parse(dataStr) as DragData;
          if (!isAccepted(data.type)) return;

          // Check if the item can be dropped
          const canDropHere = canDropFn ? canDropFn(data) : true;
          setCanDrop(canDropHere);
          setDraggedData(data);

          if (canDropHere) {
            // Set the drop effect
            if (dragState.allowedOperations.includes('copy') && e.ctrlKey) {
              e.dataTransfer.dropEffect = 'copy';
              setDragOperation('copy');
            } else if (dragState.allowedOperations.includes('link') && e.altKey) {
              e.dataTransfer.dropEffect = 'link';
              setDragOperation('link');
            } else if (dragState.allowedOperations.includes('move')) {
              e.dataTransfer.dropEffect = 'move';
              setDragOperation('move');
            } else {
              e.dataTransfer.dropEffect = 'none';
              setDragOperation('none');
            }

            // Call the callback
            onDragOver?.(data, { x: e.clientX, y: e.clientY });
          } else {
            e.dataTransfer.dropEffect = 'none';
            setDragOperation('none');
          }
        } catch (error) {
          console.error('Error parsing drag data:', error);
        }
      };

      // Handle drag enter
      const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        if (disabled) return;

        try {
          // Get the dragged item's data
          const dataStr = e.dataTransfer.getData('application/json');
          if (!dataStr) return;

          const data = JSON.parse(dataStr) as DragData;
          if (!isAccepted(data.type)) return;

          // Add this element to the active drop targets
          activeDropTargets.current.add(e.currentTarget as HTMLElement);
          setIsOver(true);
          setDraggedData(data);
        } catch (error) {
          console.error('Error parsing drag data:', error);
        }
      };

      // Handle drag leave
      const handleDragLeave = (e: React.DragEvent) => {
        if (disabled) return;

        // Only set isOver to false if we're leaving all active drop targets
        activeDropTargets.current.delete(e.currentTarget as HTMLElement);
        if (activeDropTargets.current.size === 0) {
          setIsOver(false);
          if (draggedData) {
            onDragLeave?.(draggedData);
          }
        }
      };

      // Handle drop
      const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (disabled) return;

        try {
          // Get the dragged item's data
          const dataStr = e.dataTransfer.getData('application/json');
          if (!dataStr) return;

          const data = JSON.parse(dataStr) as DragData;
          if (!isAccepted(data.type)) return;

          // Check if the item can be dropped
          const canDropHere = canDropFn ? canDropFn(data) : true;
          if (canDropHere) {
            // Determine the operation
            let operation: DragOperation = 'none';
            switch (e.dataTransfer.dropEffect) {
              case 'copy':
                operation = 'copy';
                break;
              case 'link':
                operation = 'link';
                break;
              case 'move':
                operation = 'move';
                break;
              default:
                operation = 'none';
                break;
            }

            // Call the callback
            onDrop?.(data, { x: e.clientX, y: e.clientY }, operation);
          }

          // Reset state
          setIsOver(false);
          activeDropTargets.current.clear();
        } catch (error) {
          console.error('Error parsing drag data:', error);
        }
      };

      return {
        droppableProps: {
          onDragOver: handleDragOver,
          onDragEnter: handleDragEnter,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
        },
        isOver,
        canDrop,
        dragData: draggedData,
      };
    },
    [dragState.allowedOperations, setDragOperation]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      activeDropTargets.current.clear();
    };
  }, []);

  return {
    dragState,
    startDrag,
    updateDragPosition,
    endDrag,
    cancelDrag,
    setDragOperation,
    createDraggable,
    createDroppable,
  };
}

export default useDragAndDrop;
