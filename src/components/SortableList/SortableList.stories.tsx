import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { SortableList } from './SortableList';
import { SortableListHeadless } from './SortableListHeadless';
import { Box } from '../Box';
import { Card } from '../Card';
import { Text } from '../Text';
import { Flex } from '../Flex';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { Button } from '../Button';
import styled from 'styled-components';

const meta: Meta<typeof SortableList> = {
  title: 'Components/SortableList',
  component: SortableList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Direction of the list',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the list is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SortableList>;

// Basic example
export const Basic: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', content: 'Item 1' },
      { id: '2', content: 'Item 2' },
      { id: '3', content: 'Item 3' },
      { id: '4', content: 'Item 4' },
      { id: '5', content: 'Item 5' },
    ]);
    
    return (
      <Box width="400px">
        <Text variant="h4" mb={4}>Basic Sortable List</Text>
        
        <SortableList
          items={items}
          onReorder={setItems}
          renderItem={(item) => (
            <Flex alignItems="center">
              <Icon name="drag-handle" size="sm" color="neutral.400" mr={2} />
              <Text>{item.content}</Text>
            </Flex>
          )}
          emptyContent="No items in the list"
        />
      </Box>
    );
  },
};

// Horizontal list
export const HorizontalList: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', color: 'primary.500', label: 'Item 1' },
      { id: '2', color: 'success.500', label: 'Item 2' },
      { id: '3', color: 'warning.500', label: 'Item 3' },
      { id: '4', color: 'error.500', label: 'Item 4' },
      { id: '5', color: 'info.500', label: 'Item 5' },
    ]);
    
    return (
      <Box width="600px">
        <Text variant="h4" mb={4}>Horizontal Sortable List</Text>
        
        <SortableList
          items={items}
          onReorder={setItems}
          direction="horizontal"
          renderItem={(item) => (
            <Box
              width="80px"
              height="80px"
              borderRadius="md"
              backgroundColor={item.color}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="common.white" fontWeight="bold">
                {item.label}
              </Text>
            </Box>
          )}
        />
      </Box>
    );
  },
};

// Task list
const TaskItem = styled(Flex)`
  width: 100%;
`;

const TaskCheckbox = styled.div<{ $completed: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${({ theme, $completed }) => 
    $completed ? theme.colors.success[500] : theme.colors.neutral[300]};
  background-color: ${({ theme, $completed }) => 
    $completed ? theme.colors.success[500] : 'transparent'};
  margin-right: ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.common.white};
  cursor: pointer;
  flex-shrink: 0;
`;

export const TaskList: Story = {
  render: () => {
    const [tasks, setTasks] = useState([
      { id: '1', title: 'Complete project proposal', completed: true, priority: 'high' },
      { id: '2', title: 'Review pull requests', completed: false, priority: 'medium' },
      { id: '3', title: 'Update documentation', completed: false, priority: 'low' },
      { id: '4', title: 'Fix reported bugs', completed: false, priority: 'high' },
      { id: '5', title: 'Prepare for demo', completed: false, priority: 'medium' },
    ]);
    
    const toggleTaskCompletion = (id: string) => {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
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
      <Box width="500px">
        <Text variant="h4" mb={4}>Task List</Text>
        
        <SortableList
          items={tasks}
          onReorder={setTasks}
          renderItem={(task) => (
            <TaskItem alignItems="center">
              <TaskCheckbox 
                $completed={task.completed}
                onClick={() => toggleTaskCompletion(task.id)}
              >
                {task.completed && <Icon name="check" size="xs" />}
              </TaskCheckbox>
              
              <Box flex="1">
                <Text
                  style={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? '#9e9e9e' : 'inherit',
                  }}
                >
                  {task.title}
                </Text>
              </Box>
              
              <Badge color={getPriorityColor(task.priority)} size="sm">
                {task.priority}
              </Badge>
            </TaskItem>
          )}
          emptyContent="No tasks to display"
        />
      </Box>
    );
  },
};

// Team members
export const TeamMembers: Story = {
  render: () => {
    const [members, setMembers] = useState([
      { id: '1', name: 'John Doe', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', role: 'UX Designer', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: '3', name: 'Robert Johnson', role: 'Frontend Developer', avatar: 'https://i.pravatar.cc/150?img=8' },
      { id: '4', name: 'Emily Davis', role: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?img=9' },
      { id: '5', name: 'Michael Wilson', role: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?img=11' },
    ]);
    
    return (
      <Box width="500px">
        <Text variant="h4" mb={4}>Team Members</Text>
        
        <SortableList
          items={members}
          onReorder={setMembers}
          renderItem={(member) => (
            <Flex alignItems="center">
              <Avatar src={member.avatar} name={member.name} size="md" mr={3} />
              <Box>
                <Text fontWeight="medium">{member.name}</Text>
                <Text variant="caption" color="text.secondary">{member.role}</Text>
              </Box>
              <Box ml="auto">
                <Icon name="drag-handle" size="sm" color="neutral.400" />
              </Box>
            </Flex>
          )}
        />
      </Box>
    );
  },
};

// With disabled items
export const WithDisabledItems: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', content: 'Item 1', disabled: false },
      { id: '2', content: 'Item 2 (Disabled)', disabled: true },
      { id: '3', content: 'Item 3', disabled: false },
      { id: '4', content: 'Item 4 (Disabled)', disabled: true },
      { id: '5', content: 'Item 5', disabled: false },
    ]);
    
    return (
      <Box width="400px">
        <Text variant="h4" mb={4}>With Disabled Items</Text>
        
        <SortableList
          items={items}
          onReorder={setItems}
          renderItem={(item) => (
            <Flex alignItems="center">
              <Icon name="drag-handle" size="sm" color={item.disabled ? "neutral.300" : "neutral.400"} mr={2} />
              <Text color={item.disabled ? "text.disabled" : "text.primary"}>{item.content}</Text>
            </Flex>
          )}
        />
      </Box>
    );
  },
};

// Headless usage example
const CustomItem = styled.div<{ $isDragging: boolean; $isOver: boolean }>`
  padding: 12px;
  margin-bottom: 8px;
  background-color: ${({ $isDragging }) => ($isDragging ? '#e3f2fd' : '#ffffff')};
  border: 2px solid ${({ $isDragging, $isOver }) => 
    $isOver ? '#2196f3' : $isDragging ? '#2196f3' : '#e0e0e0'};
  border-radius: 8px;
  box-shadow: ${({ $isDragging }) => 
    $isDragging ? '0 5px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #2196f3;
  }
`;

const CustomDragPreview = styled.div`
  padding: 12px;
  background-color: #ffffff;
  border: 2px solid #2196f3;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

export const HeadlessUsage: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: '1', content: 'Headless Item 1' },
      { id: '2', content: 'Headless Item 2' },
      { id: '3', content: 'Headless Item 3' },
      { id: '4', content: 'Headless Item 4' },
      { id: '5', content: 'Headless Item 5' },
    ]);
    
    const handleReorder = (reorderedItems) => {
      setItems(reorderedItems);
    };
    
    return (
      <Box width="400px">
        <Text variant="h4" mb={4}>Headless Usage</Text>
        
        <SortableListHeadless.Root
          items={items}
          onReorder={handleReorder}
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
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text>{item.content}</Text>
                      <Icon name="drag-handle" size="sm" />
                    </Flex>
                  </CustomItem>
                )}
              </SortableListHeadless.Item>
            ))}
          </SortableListHeadless.Container>
          
          <SortableListHeadless.Empty>
            <Box
              padding="lg"
              backgroundColor="#f5f5f5"
              border="2px dashed #9e9e9e"
              borderRadius="md"
              textAlign="center"
            >
              <Text>No items to display</Text>
            </Box>
          </SortableListHeadless.Empty>
          
          <SortableListHeadless.DragPreview>
            {(item) => (
              <CustomDragPreview>
                {item.content}
              </CustomDragPreview>
            )}
          </SortableListHeadless.DragPreview>
        </SortableListHeadless.Root>
      </Box>
    );
  },
};
