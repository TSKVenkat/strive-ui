import React, { createContext, useContext, forwardRef } from 'react';
import { DragAndDropHeadless } from '../DragAndDrop';
import { useSortableList, UseSortableListReturn, SortableItem, SortableListOptions } from './useSortableList';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the SortableList
interface SortableListContextValue<T extends SortableItem = SortableItem> extends UseSortableListReturn<T> {}

const SortableListContext = createContext<SortableListContextValue | null>(null);

// Hook to use SortableList context
export function useSortableListContext<T extends SortableItem = SortableItem>() {
  const context = useContext(SortableListContext) as SortableListContextValue<T> | null;
  if (!context) {
    throw new Error('useSortableListContext must be used within a SortableListHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps<T extends SortableItem = SortableItem> extends SortableListOptions<T> {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = <T extends SortableItem = SortableItem>({
  children,
  ...options
}: RootProps<T>) => {
  const sortableList = useSortableList<T>(options);
  
  return (
    <DragAndDropHeadless.Provider>
      <SortableListContext.Provider value={sortableList as any}>
        {children}
      </SortableListContext.Provider>
    </DragAndDropHeadless.Provider>
  );
};

// Container component props
export type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Container component
const Container = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    {
      as,
      children,
      ...props
    }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContainerProps } = useSortableListContext();
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'SortableListHeadless.Container';

// Item component props
export interface ItemProps<T extends SortableItem = SortableItem> {
  /**
   * Item data
   */
  item: T;
  /**
   * Index of the item
   */
  index: number;
  /**
   * Children of the component
   */
  children: React.ReactNode | ((props: { isDragging: boolean; isOver: boolean }) => React.ReactNode);
}

// Item component
const Item = <T extends SortableItem = SortableItem>({
  item,
  index,
  children,
}: ItemProps<T>) => {
  const { getItemProps, getDroppableProps, draggedIndex, overIndex } = useSortableListContext<T>();
  const isDragging = draggedIndex === index;
  const isOver = overIndex === index;
  
  return (
    <DragAndDropHeadless.Droppable
      {...getDroppableProps(index)}
    >
      {({ isOver: isDroppableOver }) => (
        <DragAndDropHeadless.Draggable
          {...getItemProps(item, index)}
        >
          {({ isDragging: isDraggableActive }) => (
            typeof children === 'function'
              ? children({ isDragging: isDraggableActive, isOver: isDroppableOver })
              : children
          )}
        </DragAndDropHeadless.Draggable>
      )}
    </DragAndDropHeadless.Droppable>
  );
};

// DragPreview component props
export interface DragPreviewProps<T extends SortableItem = SortableItem> {
  /**
   * Render function for the drag preview
   */
  children: (item: T) => React.ReactNode;
}

// DragPreview component
const DragPreview = <T extends SortableItem = SortableItem>({
  children,
}: DragPreviewProps<T>) => {
  const { items } = useSortableListContext<T>();
  
  return (
    <DragAndDropHeadless.DragLayer>
      {({ isDragging, dragData }) => {
        if (!isDragging || !dragData) return null;
        
        const { item } = dragData.payload;
        
        return (
          <div
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              zIndex: 100,
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {children(item)}
          </div>
        );
      }}
    </DragAndDropHeadless.DragLayer>
  );
};

// Empty component props
export type EmptyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Empty component
const Empty = forwardRef<any, any>(
  <C extends React.ElementType = 'div'>(
    {
      as,
      children,
      ...props
    }: EmptyProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isEmpty } = useSortableListContext();
    
    if (!isEmpty) {
      return null;
    }
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

// Export all components
export const SortableListHeadless = {
  Root,
  Container,
  Item,
  DragPreview,
  Empty,
};

export default SortableListHeadless;
