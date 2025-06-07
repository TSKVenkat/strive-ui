import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { SortableListHeadless, RootProps as HeadlessRootProps } from './SortableListHeadless';
import { SortableItem } from './useSortableList';
import { DragAndDrop } from '../DragAndDrop';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';
import { motion } from 'framer-motion';

// Styled components
const StyledContainer = styled.div<{ $direction: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: ${({ $direction }) => ($direction === 'vertical' ? 'column' : 'row')};
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
`;

const StyledItem = styled(motion.div)<{ 
  $isDragging: boolean; 
  $isOver: boolean;
  $direction: 'vertical' | 'horizontal';
  $disabled: boolean;
}>`
  position: relative;
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  box-shadow: ${({ $isDragging, theme }) => 
    $isDragging ? theme.shadows.md : theme.shadows.sm};
  transition: all 0.2s ease;
  opacity: ${({ $isDragging }) => ($isDragging ? 0.6 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'grab')};
  user-select: none;
  
  ${({ $isOver, theme }) =>
    $isOver &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${theme.colors.primary[50]};
        border-radius: ${theme.borderRadius.md};
        z-index: -1;
      }
    `}
  
  ${({ $direction, $isOver, theme }) =>
    $direction === 'vertical' && $isOver &&
    css`
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background-color: ${theme.colors.primary[500]};
        z-index: 1;
      }
      
      &::after {
        top: -1px;
      }
    `}
  
  ${({ $direction, $isOver, theme }) =>
    $direction === 'horizontal' && $isOver &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: ${theme.colors.primary[500]};
        z-index: 1;
      }
      
      &::after {
        left: -1px;
      }
    `}
  
  &:hover {
    border-color: ${({ theme, $disabled }) => ($disabled ? theme.colors.neutral[200] : theme.colors.primary[300])};
  }
  
  &:active {
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'grabbing')};
  }
`;

const StyledDragPreview = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.primary[300]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  opacity: 0.9;
  pointer-events: none;
`;

const StyledEmpty = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  width: 100%;
`;

// SortableList component props
export interface SortableListProps<T extends SortableItem = SortableItem> extends Omit<HeadlessRootProps<T>, 'children'> {
  /**
   * Render function for each item
   */
  renderItem: (item: T, index: number) => React.ReactNode;
  /**
   * Render function for the drag preview
   */
  renderDragPreview?: (item: T) => React.ReactNode;
  /**
   * Content to show when the list is empty
   */
  emptyContent?: React.ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom styles
   */
  style?: React.CSSProperties;
}

/**
 * SortableList component for creating lists with drag and drop reordering.
 * 
 * @example
 * ```jsx
 * import { SortableList } from 'pulseui';
 * 
 * function MyList() {
 *   const [items, setItems] = useState([
 *     { id: '1', content: 'Item 1' },
 *     { id: '2', content: 'Item 2' },
 *     { id: '3', content: 'Item 3' },
 *   ]);
 *   
 *   return (
 *     <SortableList
 *       items={items}
 *       onReorder={setItems}
 *       renderItem={(item) => <div>{item.content}</div>}
 *       emptyContent="No items"
 *     />
 *   );
 * }
 * ```
 */
export const SortableList = forwardRef(<T extends SortableItem = SortableItem>(
  {
    items,
    renderItem,
    renderDragPreview,
    emptyContent = 'No items',
    direction = 'vertical',
    className,
    style,
    ...rest
  }: SortableListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  return (
    <SortableListHeadless.Root
      items={items}
      direction={direction}
      {...rest}
    >
      <StyledContainer ref={ref} $direction={direction} className={className} style={style}>
        <SortableListHeadless.Container>
          {items.map((item, index) => (
            <SortableListHeadless.Item
              key={item.id}
              item={item}
              index={index}
            >
              {({ isDragging, isOver }) => (
                <StyledItem
                  $isDragging={isDragging}
                  $isOver={isOver}
                  $direction={direction}
                  $disabled={!!item.disabled}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {renderItem(item, index)}
                </StyledItem>
              )}
            </SortableListHeadless.Item>
          ))}
        </SortableListHeadless.Container>
        
        <SortableListHeadless.Empty>
          <StyledEmpty>{emptyContent}</StyledEmpty>
        </SortableListHeadless.Empty>
        
        <SortableListHeadless.DragPreview>
          {(item) => (
            <StyledDragPreview>
              {renderDragPreview ? renderDragPreview(item as T) : renderItem(item as T, -1)}
            </StyledDragPreview>
          )}
        </SortableListHeadless.DragPreview>
      </StyledContainer>
    </SortableListHeadless.Root>
  );
});

SortableList.displayName = 'SortableList';

export default SortableList;
