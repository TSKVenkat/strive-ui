import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { DragAndDropHeadless } from './DragAndDropHeadless';
import { DragData, DragPosition, DragOperation } from './useDragAndDrop';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Styled components
const StyledProvider = styled(DragAndDropHeadless.Provider)`
  position: relative;
`;

const StyledDraggable = styled(DragAndDropHeadless.Draggable)<{ $isDragging: boolean }>`
  cursor: ${({ $isDragging, disabled }) => (disabled ? 'not-allowed' : $isDragging ? 'grabbing' : 'grab')};
  user-select: none;
  transition: transform 0.1s ease, opacity 0.1s ease, box-shadow 0.1s ease;
  
  ${({ $isDragging }) =>
    $isDragging &&
    css`
      opacity: 0.7;
      transform: scale(1.02);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    `}
`;

const StyledDroppable = styled(DragAndDropHeadless.Droppable)<{ $isOver: boolean; $canDrop: boolean }>`
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
  
  ${({ $isOver, $canDrop, theme }) =>
    $isOver &&
    $canDrop &&
    css`
      background-color: ${theme.colors.primary[50]};
      border-color: ${theme.colors.primary[300]};
      transform: scale(1.01);
    `}
  
  ${({ $isOver, $canDrop, theme }) =>
    $isOver &&
    !$canDrop &&
    css`
      background-color: ${theme.colors.error[50]};
      border-color: ${theme.colors.error[300]};
    `}
`;

const StyledDragLayer = styled(DragAndDropHeadless.DragLayer)`
  /* Base styles are in the headless component */
`;

// DragPreview component
const StyledDragPreview = styled.div<{ $operation: DragOperation }>`
  position: absolute;
  pointer-events: none;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  
  ${({ $operation, theme }) =>
    $operation === 'copy' &&
    css`
      border: 2px solid ${theme.colors.success[500]};
    `}
  
  ${({ $operation, theme }) =>
    $operation === 'move' &&
    css`
      border: 2px solid ${theme.colors.primary[500]};
    `}
  
  ${({ $operation, theme }) =>
    $operation === 'link' &&
    css`
      border: 2px solid ${theme.colors.info[500]};
    `}
  
  ${({ $operation, theme }) =>
    $operation === 'none' &&
    css`
      border: 2px solid ${theme.colors.error[500]};
      opacity: 0.5;
    `}
`;

// Provider props
export type ProviderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
  }
>;

// Provider component
const Provider = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      children,
      className,
      style,
      ...props
    }: ProviderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    return (
      <StyledProvider as={as} ref={ref} className={className} style={style} {...props}>
        {children}
      </StyledProvider>
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
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
  }
>;

// Draggable component
const Draggable = forwardRef(
  <C extends React.ElementType = 'div'>(
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
      className,
      style,
      ...props
    }: DraggableProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    return (
      <StyledDraggable
        as={as}
        ref={ref}
        data={data}
        disabled={disabled}
        allowedOperations={allowedOperations}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        className={className}
        style={style}
        {...props}
      >
        {({ isDragging, position }) => (
          <div $isDragging={isDragging}>
            {typeof children === 'function' ? children({ isDragging, position }) : children}
          </div>
        )}
      </StyledDraggable>
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
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom styles
     */
    style?: React.CSSProperties;
  }
>;

// Droppable component
const Droppable = forwardRef(
  <C extends React.ElementType = 'div'>(
    {
      as,
      accept,
      disabled = false,
      onDragOver,
      onDragLeave,
      onDrop,
      canDrop,
      children,
      className,
      style,
      ...props
    }: DroppableProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    return (
      <StyledDroppable
        as={as}
        ref={ref}
        accept={accept}
        disabled={disabled}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        canDrop={canDrop}
        className={className}
        style={style}
        {...props}
      >
        {({ isOver, canDrop: canDropHere, dragData }) => (
          <div $isOver={isOver} $canDrop={canDropHere}>
            {typeof children === 'function' ? children({ isOver, canDrop: canDropHere, dragData }) : children}
          </div>
        )}
      </StyledDroppable>
    );
  }
);

// DragLayer props
export type DragLayerProps = {
  /**
   * Render function for the drag preview
   */
  renderPreview?: (data: DragData, operation: DragOperation) => React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
};

// DragLayer component
const DragLayer: React.FC<DragLayerProps> = ({ renderPreview, className, style }) => {
  return (
    <StyledDragLayer className={className} style={style}>
      {({ isDragging, dragData, position, currentOperation }) => {
        if (!isDragging || !dragData) return null;
        
        return (
          <StyledDragPreview
            $operation={currentOperation}
            style={{
              transform: `translate(${position.x + 15}px, ${position.y + 15}px)`,
            }}
          >
            {renderPreview ? (
              renderPreview(dragData, currentOperation)
            ) : (
              <div>
                <div>{dragData.type}</div>
                <div>{dragData.id}</div>
              </div>
            )}
          </StyledDragPreview>
        );
      }}
    </StyledDragLayer>
  );
};

// Export all components
export const DragAndDrop = {
  Provider,
  Draggable,
  Droppable,
  DragLayer,
};

export default DragAndDrop;
