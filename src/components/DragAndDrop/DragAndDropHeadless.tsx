import React, { createContext, useContext, forwardRef } from 'react';
import { useDragAndDrop, UseDragAndDropReturn, DragData, DragPosition, DragOperation } from './useDragAndDrop';
import { PolymorphicComponentPropsWithRef, PolymorphicRef, polymorphicForwardRef } from '../../types/polymorphic';

// Context for the DragAndDrop system
const DragAndDropContext = createContext<UseDragAndDropReturn | null>(null);

// Hook to use DragAndDrop context
export function useDragAndDropContext() {
  const context = useContext(DragAndDropContext);
  if (!context) {
    throw new Error('useDragAndDropContext must be used within a DragAndDropHeadless.Provider component');
  }
  return context;
}

// Provider props
export type ProviderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Provider component
const Provider = polymorphicForwardRef<'div', {
  children: React.ReactNode;
}>(
  (
    {
      as,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || 'div';
    const dragAndDrop = useDragAndDrop();
    
    return (
      <DragAndDropContext.Provider value={dragAndDrop}>
        <Component ref={ref} {...props}>
          {children}
        </Component>
      </DragAndDropContext.Provider>
    );
  }
);

// Draggable props
export type DraggableProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
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
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: { isDragging: boolean; position: DragPosition }) => React.ReactNode);
  }
>;

// Draggable component
const Draggable = polymorphicForwardRef<'div', {
  data: DragData;
  disabled?: boolean;
  allowedOperations?: DragOperation[];
  onDragStart?: (data: DragData, position: DragPosition) => void;
  onDragMove?: (data: DragData, position: DragPosition) => void;
  onDragEnd?: (data: DragData, position: DragPosition, operation: DragOperation) => void;
  onDragCancel?: (data: DragData) => void;
  children: React.ReactNode | ((props: { isDragging: boolean; position: DragPosition }) => React.ReactNode);
}>(
  (
    {
      as,
      data,
      disabled = false,
      allowedOperations,
      onDragStart,
      onDragMove,
      onDragEnd,
      onDragCancel,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || 'div';
    const { createDraggable } = useDragAndDropContext();
    
    const { draggableProps, isDragging, position } = createDraggable({
      data,
      disabled,
      allowedOperations,
      onDragStart,
      onDragMove,
      onDragEnd,
      onDragCancel,
    });
    
    return (
      <Component ref={ref} {...draggableProps} {...props}>
        {typeof children === 'function' ? children({ isDragging, position }) : children}
      </Component>
    );
  }
);

// Droppable props
export type DroppableProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
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
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: { isOver: boolean; canDrop: boolean; dragData: DragData | null }) => React.ReactNode);
  }
>;

// Droppable component
const Droppable = polymorphicForwardRef<'div', {
  accept: string | string[];
  disabled?: boolean;
  onDragOver?: (data: DragData, position: DragPosition) => void;
  onDragLeave?: (data: DragData) => void;
  onDrop?: (data: DragData, position: DragPosition, operation: DragOperation) => void;
  canDrop?: (data: DragData) => boolean;
  children: React.ReactNode | ((props: { isOver: boolean; canDrop: boolean; dragData: DragData | null }) => React.ReactNode);
}>(
  (
    {
      as,
      accept,
      disabled = false,
      onDragOver,
      onDragLeave,
      onDrop,
      canDrop,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || 'div';
    const { createDroppable } = useDragAndDropContext();
    
    const { droppableProps, isOver, canDrop: canDropHere, dragData } = createDroppable({
      accept,
      disabled,
      onDragOver,
      onDragLeave,
      onDrop,
      canDrop,
    });
    
    return (
      <Component ref={ref} {...droppableProps} {...props}>
        {typeof children === 'function' ? children({ isOver, canDrop: canDropHere, dragData }) : children}
      </Component>
    );
  }
);

// DragLayer props
export type DragLayerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Render function for the drag layer
     */
    children: (props: {
      isDragging: boolean;
      dragData: DragData | null;
      position: DragPosition;
      currentOperation: DragOperation;
    }) => React.ReactNode;
  }
>;

// DragLayer component
const DragLayer = polymorphicForwardRef<'div', {
  children: (props: {
    isDragging: boolean;
    dragData: DragData | null;
    position: DragPosition;
    currentOperation: DragOperation;
  }) => React.ReactNode;
}>(
  (
    {
      as,
      children,
      ...props
    },
    ref
  ) => {
    const Component = as || 'div';
    const { dragState } = useDragAndDropContext();
    
    return (
      <Component
        ref={ref}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 100,
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
        }}
        {...props}
      >
        {children({
          isDragging: dragState.isDragging,
          dragData: dragState.dragData,
          position: dragState.position,
          currentOperation: dragState.currentOperation,
        })}
      </Component>
    );
  }
);

// Export all components
export const DragAndDropHeadless = {
  Provider,
  Draggable,
  Droppable,
  DragLayer,
};

export default DragAndDropHeadless;
