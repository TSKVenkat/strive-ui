import React, { forwardRef, useState, useRef, useEffect } from 'react';

export type KanbanGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;

export interface KanbanLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The kanban columns to render
   */
  children: React.ReactNode;
  
  /**
   * Gap between kanban columns
   * @default 'md'
   */
  gap?: KanbanGap;
  
  /**
   * Whether to fill the container width
   * @default true
   */
  fullWidth?: boolean;
  
  /**
   * Whether to fill the container height
   * @default true
   */
  fullHeight?: boolean;
  
  /**
   * Whether to enable drag and drop
   * @default false
   */
  draggable?: boolean;
  
  /**
   * Callback when a card is moved to a different column
   */
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  
  /**
   * The component used for the root node
   * @default 'div'
   */
  as?: React.ElementType;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * KanbanLayout component for creating kanban board layouts
 */
export const KanbanLayout = forwardRef<HTMLDivElement, KanbanLayoutProps>(
  (
    {
      children,
      gap = 'md',
      fullWidth = true,
      fullHeight = true,
      draggable = false,
      onCardMove,
      as: Component = 'div',
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Map gap values to actual CSS values
    const gapMap = {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };

    // Convert gap value to CSS
    const getGapValue = (gapValue: KanbanGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };

    // Build the style object
    const kanbanStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'row',
      gap: getGapValue(gap),
      overflowX: 'auto',
      ...(fullWidth && { width: '100%' }),
      ...(fullHeight && { height: '100%' }),
      ...style,
    };

    // State for drag and drop
    const [draggedCard, setDraggedCard] = useState<string | null>(null);
    const [draggedCardColumn, setDraggedCardColumn] = useState<string | null>(null);
    const dragCounter = useRef<{ [key: string]: number }>({});

    // Process children to apply kanban styles and drag-and-drop functionality
    const processedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      
      // Clone the column with additional props for drag and drop
      if (draggable) {
        return React.cloneElement(child as any, {
          draggable,
          onCardMove,
          draggedCard,
          draggedCardColumn,
          setDraggedCard,
          setDraggedCardColumn,
          dragCounter,
        });
      }
      
      return child;
    });

    return (
      <Component
        ref={ref}
        className={`strive-kanban-layout ${className}`}
        style={kanbanStyle}
        {...rest}
      >
        {processedChildren}
      </Component>
    );
  }
);

KanbanLayout.displayName = 'KanbanLayout';

export interface KanbanColumnProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * The kanban cards to render
   */
  children: React.ReactNode;
  
  /**
   * Unique identifier for the column
   */
  id: string;
  
  /**
   * Title of the column
   */
  title: React.ReactNode;
  
  /**
   * Width of the column
   * @default '300px'
   */
  width?: string | number;
  
  /**
   * Background color of the column
   * @default '#f5f5f5'
   */
  backgroundColor?: string;
  
  /**
   * Gap between kanban cards
   * @default 'md'
   */
  gap?: KanbanGap;
  
  /**
   * Whether to enable drag and drop
   * @default false
   */
  draggable?: boolean;
  
  /**
   * Callback when a card is moved to a different column
   */
  onCardMove?: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void;
  
  /**
   * Currently dragged card ID (internal use)
   */
  draggedCard?: string | null;
  
  /**
   * Column ID of the currently dragged card (internal use)
   */
  draggedCardColumn?: string | null;
  
  /**
   * Set dragged card ID (internal use)
   */
  setDraggedCard?: React.Dispatch<React.SetStateAction<string | null>>;
  
  /**
   * Set dragged card column ID (internal use)
   */
  setDraggedCardColumn?: React.Dispatch<React.SetStateAction<string | null>>;
  
  /**
   * Drag counter ref (internal use)
   */
  dragCounter?: React.MutableRefObject<{ [key: string]: number }>;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * KanbanColumn component for individual columns within a KanbanLayout
 */
export const KanbanColumn = forwardRef<HTMLDivElement, KanbanColumnProps>(
  (
    {
      children,
      id,
      title,
      width = '300px',
      backgroundColor = '#f5f5f5',
      gap = 'md',
      draggable = false,
      onCardMove,
      draggedCard,
      draggedCardColumn,
      setDraggedCard,
      setDraggedCardColumn,
      dragCounter,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Map gap values to actual CSS values
    const gapMap = {
      none: '0',
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    };

    // Convert gap value to CSS
    const getGapValue = (gapValue: KanbanGap) => {
      if (!gapValue || gapValue === 'none') return '0';
      return gapMap[gapValue] || gapValue;
    };

    // State for drag and drop
    const [isDragOver, setIsDragOver] = useState(false);

    // Build the style object
    const columnStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      minWidth: width,
      maxWidth: width,
      height: '100%',
      backgroundColor,
      borderRadius: '4px',
      padding: '1rem',
      ...(isDragOver && { boxShadow: '0 0 0 2px #2196f3' }),
      ...style,
    };
    
    const headerStyle: React.CSSProperties = {
      marginBottom: '1rem',
      fontWeight: 'bold',
      fontSize: '1rem',
    };
    
    const cardsContainerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: getGapValue(gap),
      overflowY: 'auto',
      flex: 1,
    };

    // Handle drag and drop events
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      if (!draggable) return;
      e.preventDefault();
      setIsDragOver(true);
    };
    
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      if (!draggable) return;
      e.preventDefault();
      
      // Increment drag counter for this column
      if (dragCounter?.current) {
        dragCounter.current[id] = (dragCounter.current[id] || 0) + 1;
      }
      
      setIsDragOver(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      if (!draggable) return;
      
      // Decrement drag counter for this column
      if (dragCounter?.current) {
        dragCounter.current[id] = (dragCounter.current[id] || 0) - 1;
        
        // Only set isDragOver to false if counter reaches 0
        if (dragCounter.current[id] <= 0) {
          setIsDragOver(false);
          dragCounter.current[id] = 0;
        }
      }
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      if (!draggable || !draggedCard || !draggedCardColumn || !setDraggedCard || !setDraggedCardColumn || !onCardMove) return;
      e.preventDefault();
      
      // Reset drag counter for this column
      if (dragCounter?.current) {
        dragCounter.current[id] = 0;
      }
      
      setIsDragOver(false);
      
      // Only process if card is dropped in a different column
      if (draggedCardColumn !== id) {
        onCardMove(draggedCard, draggedCardColumn, id, React.Children.count(children));
      }
      
      setDraggedCard(null);
      setDraggedCardColumn(null);
    };

    // Process children to apply kanban card styles and drag-and-drop functionality
    const processedChildren = React.Children.map(children, (child, index) => {
      if (!React.isValidElement(child)) return child;
      
      // Clone the card with additional props for drag and drop
      if (draggable) {
        return React.cloneElement(child as any, {
          draggable,
          columnId: id,
          index,
          setDraggedCard,
          setDraggedCardColumn,
        });
      }
      
      return child;
    });

    return (
      <div
        ref={ref}
        className={`strive-kanban-column ${className}`}
        style={columnStyle}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...rest}
      >
        <div className="strive-kanban-column-header" style={headerStyle}>
          {title}
        </div>
        <div className="strive-kanban-column-cards" style={cardsContainerStyle}>
          {processedChildren}
        </div>
      </div>
    );
  }
);

KanbanColumn.displayName = 'KanbanColumn';

export interface KanbanCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * The content of the kanban card
   */
  children?: React.ReactNode;
  
  /**
   * Unique identifier for the card
   */
  id: string;
  
  /**
   * Title of the card
   */
  title?: React.ReactNode;
  
  /**
   * Background color of the card
   * @default '#ffffff'
   */
  backgroundColor?: string;
  
  /**
   * Whether to enable drag and drop
   * @default false
   */
  draggable?: boolean;
  
  /**
   * ID of the column this card belongs to (internal use)
   */
  columnId?: string;
  
  /**
   * Index of the card in its column (internal use)
   */
  index?: number;
  
  /**
   * Set dragged card ID (internal use)
   */
  setDraggedCard?: React.Dispatch<React.SetStateAction<string | null>>;
  
  /**
   * Set dragged card column ID (internal use)
   */
  setDraggedCardColumn?: React.Dispatch<React.SetStateAction<string | null>>;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * KanbanCard component for individual cards within a KanbanColumn
 */
export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(
  (
    {
      children,
      id,
      title,
      backgroundColor = '#ffffff',
      draggable = false,
      columnId,
      index,
      setDraggedCard,
      setDraggedCardColumn,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // State for drag and drop
    const [isDragging, setIsDragging] = useState(false);

    // Build the style object
    const cardStyle: React.CSSProperties = {
      backgroundColor,
      borderRadius: '4px',
      padding: '1rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
      cursor: draggable ? 'grab' : 'default',
      opacity: isDragging ? 0.5 : 1,
      ...style,
    };
    
    const titleStyle: React.CSSProperties = {
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    };

    // Handle drag and drop events
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      if (!draggable || !setDraggedCard || !setDraggedCardColumn || !columnId) return;
      
      // Set data for drag operation
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', id);
      
      // Update dragged card state
      setDraggedCard(id);
      setDraggedCardColumn(columnId);
      setIsDragging(true);
      
      // Use a timeout to ensure the drag image is captured before hiding the element
      setTimeout(() => {
        setIsDragging(true);
      }, 0);
    };
    
    const handleDragEnd = () => {
      setIsDragging(false);
    };

    return (
      <div
        ref={ref}
        className={`strive-kanban-card ${className}`}
        style={cardStyle}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        data-card-id={id}
        data-column-id={columnId}
        data-card-index={index}
        {...rest}
      >
        {title && <div className="strive-kanban-card-title" style={titleStyle}>{title}</div>}
        {children}
      </div>
    );
  }
);

KanbanCard.displayName = 'KanbanCard';
