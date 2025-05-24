import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DragAndDrop } from './DragAndDrop';
import { DragAndDropHeadless } from './DragAndDropHeadless';
import { Box } from '../Box';
import { Card } from '../Card';
import { Text } from '../Text';
import { Flex } from '../Flex';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import styled from 'styled-components';

const meta: Meta<typeof DragAndDrop.Provider> = {
  title: 'Components/DragAndDrop',
  component: DragAndDrop.Provider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DragAndDrop.Provider>;

// Basic example
export const Basic: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', content: 'Item 1' },
      { id: '2', content: 'Item 2' },
      { id: '3', content: 'Item 3' },
    ]);
    
    const handleDrop = (data: any) => {
      const newItems = [...items];
      const draggedItem = newItems.find(item => item.id === data.id);
      if (draggedItem) {
        const draggedIndex = newItems.indexOf(draggedItem);
        newItems.splice(draggedIndex, 1);
        newItems.push(draggedItem);
        setItems(newItems);
      }
    };
    
    return (
      <DragAndDrop.Provider>
        <Box width="400px">
          <Text variant="h4" mb={4}>Drag and Drop Example</Text>
          
          <Flex gap={2} mb={4}>
            {items.map(item => (
              <DragAndDrop.Draggable
                key={item.id}
                data={{ id: item.id, type: 'item', payload: item }}
              >
                <Card padding="md" width="100px" height="100px" display="flex" alignItems="center" justifyContent="center">
                  {item.content}
                </Card>
              </DragAndDrop.Draggable>
            ))}
          </Flex>
          
          <DragAndDrop.Droppable
            accept="item"
            onDrop={(data) => handleDrop(data.payload)}
          >
            {({ isOver, canDrop }) => (
              <Box
                padding="lg"
                border="1px dashed"
                borderColor={isOver && canDrop ? 'primary.500' : 'neutral.300'}
                backgroundColor={isOver && canDrop ? 'primary.50' : 'neutral.50'}
                borderRadius="md"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="neutral.600">Drop items here</Text>
              </Box>
            )}
          </DragAndDrop.Droppable>
          
          <DragAndDrop.DragLayer
            renderPreview={(data) => (
              <Box padding="sm" backgroundColor="common.white" borderRadius="md">
                {data.payload.content}
              </Box>
            )}
          />
        </Box>
      </DragAndDrop.Provider>
    );
  },
};

// Sortable list example
const SortableItem = styled(Card)`
  margin-bottom: 8px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SortableList: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', content: 'Item 1', color: 'primary.100' },
      { id: '2', content: 'Item 2', color: 'success.100' },
      { id: '3', content: 'Item 3', color: 'warning.100' },
      { id: '4', content: 'Item 4', color: 'error.100' },
      { id: '5', content: 'Item 5', color: 'info.100' },
    ]);
    
    const moveItem = (dragIndex: number, hoverIndex: number) => {
      const newItems = [...items];
      const draggedItem = newItems[dragIndex];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      setItems(newItems);
    };
    
    return (
      <DragAndDrop.Provider>
        <Box width="400px">
          <Text variant="h4" mb={4}>Sortable List</Text>
          
          <Box>
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
                      <SortableItem
                        style={{
                          opacity: isDragging ? 0.5 : 1,
                          backgroundColor: isOver && canDrop ? '#f0f9ff' : undefined,
                          transform: isOver && canDrop ? 'scale(1.01)' : undefined,
                        }}
                      >
                        <Flex alignItems="center">
                          <Box
                            width="20px"
                            height="20px"
                            borderRadius="sm"
                            backgroundColor={item.color}
                            mr={3}
                          />
                          <Text>{item.content}</Text>
                          <Box ml="auto">
                            <Icon name="drag-handle" size="sm" color="neutral.400" />
                          </Box>
                        </Flex>
                      </SortableItem>
                    )}
                  </DragAndDrop.Droppable>
                )}
              </DragAndDrop.Draggable>
            ))}
          </Box>
          
          <DragAndDrop.DragLayer
            renderPreview={(data) => (
              <SortableItem>
                <Flex alignItems="center">
                  <Box
                    width="20px"
                    height="20px"
                    borderRadius="sm"
                    backgroundColor={data.payload.item.color}
                    mr={3}
                  />
                  <Text>{data.payload.item.content}</Text>
                </Flex>
              </SortableItem>
            )}
          />
        </Box>
      </DragAndDrop.Provider>
    );
  },
};

// Kanban board example
const KanbanColumn = styled(Box)`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
`;

const KanbanCard = styled(Card)`
  margin-bottom: 8px;
  padding: 12px;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const KanbanBoard: Story = {
  render: () => {
    const [columns, setColumns] = useState({
      todo: {
        id: 'todo',
        title: 'To Do',
        cards: [
          { id: 'task-1', content: 'Research competitors', priority: 'high' },
          { id: 'task-2', content: 'Design wireframes', priority: 'medium' },
          { id: 'task-3', content: 'Set up project repository', priority: 'low' },
        ],
      },
      inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        cards: [
          { id: 'task-4', content: 'Implement authentication', priority: 'high' },
          { id: 'task-5', content: 'Create dashboard layout', priority: 'medium' },
        ],
      },
      done: {
        id: 'done',
        title: 'Done',
        cards: [
          { id: 'task-6', content: 'Project kickoff meeting', priority: 'medium' },
          { id: 'task-7', content: 'Define project scope', priority: 'high' },
        ],
      },
    });
    
    const moveCard = (cardId: string, sourceColumnId: string, targetColumnId: string) => {
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
    
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high':
          return 'error.500';
        case 'medium':
          return 'warning.500';
        case 'low':
          return 'success.500';
        default:
          return 'neutral.500';
      }
    };
    
    return (
      <DragAndDrop.Provider>
        <Box width="800px">
          <Text variant="h4" mb={4}>Kanban Board</Text>
          
          <Flex gap={3}>
            {Object.values(columns).map(column => (
              <KanbanColumn key={column.id}>
                <Text variant="h6" mb={2}>{column.title}</Text>
                
                <DragAndDrop.Droppable
                  accept="kanban-card"
                  onDrop={(data) => {
                    moveCard(data.id, data.payload.sourceColumnId, column.id);
                  }}
                >
                  {({ isOver, canDrop }) => (
                    <Box
                      minHeight="400px"
                      padding={2}
                      backgroundColor={isOver && canDrop ? 'neutral.200' : undefined}
                      borderRadius="md"
                      transition="background-color 0.2s ease"
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
                            <KanbanCard
                              style={{
                                opacity: isDragging ? 0.5 : 1,
                              }}
                            >
                              <Text mb={2}>{card.content}</Text>
                              <Badge color={getPriorityColor(card.priority)}>
                                {card.priority}
                              </Badge>
                            </KanbanCard>
                          )}
                        </DragAndDrop.Draggable>
                      ))}
                      
                      {column.cards.length === 0 && isOver && canDrop && (
                        <Box
                          height="80px"
                          borderRadius="md"
                          border="2px dashed"
                          borderColor="primary.300"
                          backgroundColor="primary.50"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text color="primary.700">Drop here</Text>
                        </Box>
                      )}
                      
                      {column.cards.length === 0 && !(isOver && canDrop) && (
                        <Box
                          height="80px"
                          borderRadius="md"
                          border="2px dashed"
                          borderColor="neutral.300"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text color="neutral.500">No tasks</Text>
                        </Box>
                      )}
                    </Box>
                  )}
                </DragAndDrop.Droppable>
              </KanbanColumn>
            ))}
          </Flex>
          
          <DragAndDrop.DragLayer
            renderPreview={(data) => (
              <KanbanCard width="230px">
                <Text mb={2}>{data.payload.card.content}</Text>
                <Badge color={getPriorityColor(data.payload.card.priority)}>
                  {data.payload.card.priority}
                </Badge>
              </KanbanCard>
            )}
          />
        </Box>
      </DragAndDrop.Provider>
    );
  },
};

// File upload example
const DropZone = styled(Box)<{ $isOver: boolean; $canDrop: boolean }>`
  border: 2px dashed ${({ $isOver, $canDrop, theme }) => 
    $isOver && $canDrop 
      ? theme.colors.primary[500] 
      : $isOver && !$canDrop 
        ? theme.colors.error[500] 
        : theme.colors.neutral[300]};
  background-color: ${({ $isOver, $canDrop, theme }) => 
    $isOver && $canDrop 
      ? theme.colors.primary[50] 
      : $isOver && !$canDrop 
        ? theme.colors.error[50] 
        : theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
`;

export const FileUpload: Story = {
  render: () => {
    const [files, setFiles] = useState<{ id: string; name: string; type: string; size: number }[]>([]);
    
    const handleFileDrop = (data: any) => {
      setFiles(prev => [...prev, data.payload]);
    };
    
    const handleRemoveFile = (id: string) => {
      setFiles(prev => prev.filter(file => file.id !== id));
    };
    
    const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) return 'image';
      if (type.startsWith('video/')) return 'video';
      if (type.startsWith('audio/')) return 'audio';
      if (type.includes('pdf')) return 'pdf';
      if (type.includes('word') || type.includes('document')) return 'document';
      if (type.includes('excel') || type.includes('spreadsheet')) return 'spreadsheet';
      return 'file';
    };
    
    const formatFileSize = (bytes: number) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };
    
    return (
      <DragAndDrop.Provider>
        <Box width="500px">
          <Text variant="h4" mb={4}>File Upload</Text>
          
          <DragAndDrop.Droppable
            accept="file"
            onDrop={handleFileDrop}
          >
            {({ isOver, canDrop }) => (
              <DropZone $isOver={isOver} $canDrop={canDrop} mb={4}>
                <Icon name="upload" size="lg" color={isOver && canDrop ? 'primary.500' : 'neutral.400'} mb={2} />
                <Text variant="h6" mb={1}>Drop files here</Text>
                <Text color="neutral.600">or click to browse</Text>
              </DropZone>
            )}
          </DragAndDrop.Droppable>
          
          {files.length > 0 && (
            <Box>
              <Text variant="h6" mb={2}>Uploaded Files</Text>
              
              {files.map(file => (
                <Card key={file.id} padding="sm" mb={2}>
                  <Flex alignItems="center">
                    <Icon name={getFileIcon(file.type)} size="md" color="primary.500" mr={2} />
                    <Box flex="1">
                      <Text fontWeight="medium">{file.name}</Text>
                      <Text variant="caption" color="neutral.600">{formatFileSize(file.size)}</Text>
                    </Box>
                    <Icon 
                      name="close" 
                      size="sm" 
                      color="neutral.500" 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleRemoveFile(file.id)}
                    />
                  </Flex>
                </Card>
              ))}
            </Box>
          )}
          
          {/* Simulated file drag from outside the browser */}
          <Box mt={4}>
            <Text variant="h6" mb={2}>Simulate External Files</Text>
            <Flex gap={2}>
              {[
                { id: 'img1', name: 'image.jpg', type: 'image/jpeg', size: 1024 * 1024 * 2.5 },
                { id: 'doc1', name: 'document.pdf', type: 'application/pdf', size: 1024 * 512 },
                { id: 'xls1', name: 'spreadsheet.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 1024 * 1024 * 1.2 },
              ].map(file => (
                <DragAndDrop.Draggable
                  key={file.id}
                  data={{ id: file.id, type: 'file', payload: file }}
                >
                  <Card padding="sm" width="100px" height="100px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <Icon name={getFileIcon(file.type)} size="md" color="primary.500" mb={1} />
                    <Text variant="caption" textAlign="center">{file.name}</Text>
                  </Card>
                </DragAndDrop.Draggable>
              ))}
            </Flex>
          </Box>
        </Box>
      </DragAndDrop.Provider>
    );
  },
};

// Headless usage example
const CustomDraggable = styled.div<{ $isDragging: boolean }>`
  padding: 16px;
  background-color: ${({ $isDragging }) => ($isDragging ? '#e3f2fd' : '#ffffff')};
  border: 2px solid ${({ $isDragging }) => ($isDragging ? '#2196f3' : '#e0e0e0')};
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: grab;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2196f3;
  }
  
  &:active {
    cursor: grabbing;
  }
`;

const CustomDroppable = styled.div<{ $isOver: boolean; $canDrop: boolean }>`
  padding: 16px;
  background-color: ${({ $isOver, $canDrop }) => 
    $isOver && $canDrop ? '#e8f5e9' : $isOver && !$canDrop ? '#ffebee' : '#f5f5f5'};
  border: 2px dashed ${({ $isOver, $canDrop }) => 
    $isOver && $canDrop ? '#4caf50' : $isOver && !$canDrop ? '#f44336' : '#9e9e9e'};
  border-radius: 8px;
  min-height: 150px;
  transition: all 0.2s ease;
`;

export const HeadlessUsage: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', content: 'Headless Item 1' },
      { id: '2', content: 'Headless Item 2' },
      { id: '3', content: 'Headless Item 3' },
    ]);
    
    const [droppedItems, setDroppedItems] = useState<any[]>([]);
    
    const handleDrop = (data: any) => {
      setDroppedItems(prev => [...prev, data.payload]);
      setItems(prev => prev.filter(item => item.id !== data.id));
    };
    
    return (
      <DragAndDropHeadless.Provider>
        <Box width="500px">
          <Text variant="h4" mb={4}>Headless Usage Example</Text>
          
          <Flex gap={4}>
            <Box width="50%">
              <Text variant="h6" mb={2}>Draggable Items</Text>
              
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
            </Box>
            
            <Box width="50%">
              <Text variant="h6" mb={2}>Drop Zone</Text>
              
              <DragAndDropHeadless.Droppable
                accept="custom-item"
                onDrop={handleDrop}
              >
                {({ isOver, canDrop }) => (
                  <CustomDroppable $isOver={isOver} $canDrop={canDrop}>
                    {droppedItems.length === 0 ? (
                      <Text color="neutral.600" textAlign="center">Drop items here</Text>
                    ) : (
                      droppedItems.map(item => (
                        <Box key={item.id} padding="sm" mb={2} backgroundColor="white" borderRadius="md">
                          {item.content}
                        </Box>
                      ))
                    )}
                  </CustomDroppable>
                )}
              </DragAndDropHeadless.Droppable>
            </Box>
          </Flex>
          
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
        </Box>
      </DragAndDropHeadless.Provider>
    );
  },
};
