# Kanban Layout

The `KanbanLayout`, `KanbanColumn`, and `KanbanCard` components provide a flexible way to create kanban board layouts for task management, workflow visualization, and project tracking. They support customizable columns and cards with optional drag-and-drop functionality.

## Features

- **Flexible Column System**: Create customizable columns for different workflow stages
- **Customizable Cards**: Style cards with titles, content, and custom backgrounds
- **Drag and Drop Support**: Optional drag-and-drop functionality for moving cards between columns
- **Responsive Design**: Horizontally scrollable layout for mobile and desktop
- **Event Callbacks**: Hooks for responding to card movements and updates
- **Customizable Styling**: Control colors, spacing, and dimensions
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { KanbanLayout, KanbanColumn, KanbanCard } from '@pulseui/layout';

function BasicKanban() {
  return (
    <KanbanLayout>
      <KanbanColumn id="todo" title="To Do">
        <KanbanCard id="task-1" title="Task 1">
          Implement login functionality
        </KanbanCard>
        <KanbanCard id="task-2" title="Task 2">
          Design homepage layout
        </KanbanCard>
      </KanbanColumn>
      
      <KanbanColumn id="in-progress" title="In Progress">
        <KanbanCard id="task-3" title="Task 3">
          Set up CI/CD pipeline
        </KanbanCard>
      </KanbanColumn>
      
      <KanbanColumn id="done" title="Done">
        <KanbanCard id="task-4" title="Task 4">
          Create project repository
        </KanbanCard>
        <KanbanCard id="task-5" title="Task 5">
          Initial project setup
        </KanbanCard>
      </KanbanColumn>
    </KanbanLayout>
  );
}
```

## Examples

### With Drag and Drop

```tsx
import { KanbanLayout, KanbanColumn, KanbanCard } from '@pulseui/layout';
import { useState } from 'react';

function DraggableKanban() {
  // Sample data structure for kanban board
  const [columns, setColumns] = useState({
    'todo': {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: 'task-1', title: 'Task 1', content: 'Implement login functionality' },
        { id: 'task-2', title: 'Task 2', content: 'Design homepage layout' },
      ]
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      cards: [
        { id: 'task-3', title: 'Task 3', content: 'Set up CI/CD pipeline' },
      ]
    },
    'done': {
      id: 'done',
      title: 'Done',
      cards: [
        { id: 'task-4', title: 'Task 4', content: 'Create project repository' },
        { id: 'task-5', title: 'Task 5', content: 'Initial project setup' },
      ]
    }
  });

  // Handle card movement between columns
  const handleCardMove = (cardId, fromColumnId, toColumnId, newIndex) => {
    setColumns(prevColumns => {
      // Create a deep copy of the columns
      const newColumns = JSON.parse(JSON.stringify(prevColumns));
      
      // Find the card in the source column
      const cardIndex = newColumns[fromColumnId].cards.findIndex(card => card.id === cardId);
      const [movedCard] = newColumns[fromColumnId].cards.splice(cardIndex, 1);
      
      // Add the card to the destination column at the specified index
      newColumns[toColumnId].cards.splice(newIndex, 0, movedCard);
      
      return newColumns;
    });
  };

  return (
    <KanbanLayout draggable onCardMove={handleCardMove}>
      {Object.values(columns).map(column => (
        <KanbanColumn 
          key={column.id} 
          id={column.id} 
          title={column.title}
        >
          {column.cards.map(card => (
            <KanbanCard 
              key={card.id} 
              id={card.id} 
              title={card.title}
            >
              {card.content}
            </KanbanCard>
          ))}
        </KanbanColumn>
      ))}
    </KanbanLayout>
  );
}
```

### Custom Styled Kanban

```tsx
import { KanbanLayout, KanbanColumn, KanbanCard } from '@pulseui/layout';

function StyledKanban() {
  return (
    <KanbanLayout gap="lg" style={{ height: '600px' }}>
      <KanbanColumn 
        id="backlog" 
        title="Backlog" 
        backgroundColor="#f0f4f8"
        width="350px"
      >
        <KanbanCard 
          id="card-1" 
          title="Improve Performance" 
          backgroundColor="#ffffff"
        >
          <p>Optimize rendering for large datasets</p>
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <span style={{ 
              backgroundColor: '#e6f7ff', 
              color: '#0066cc',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              Performance
            </span>
          </div>
        </KanbanCard>
        <KanbanCard 
          id="card-2" 
          title="Add New Features" 
          backgroundColor="#ffffff"
        >
          <p>Implement dark mode and theme customization</p>
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <span style={{ 
              backgroundColor: '#f0f9eb', 
              color: '#52c41a',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              Feature
            </span>
          </div>
        </KanbanCard>
      </KanbanColumn>
      
      <KanbanColumn 
        id="todo" 
        title="To Do" 
        backgroundColor="#ebf5fa"
        width="350px"
      >
        <KanbanCard 
          id="card-3" 
          title="Fix Bugs" 
          backgroundColor="#ffffff"
        >
          <p>Address issues in the authentication flow</p>
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <span style={{ 
              backgroundColor: '#fff2e8', 
              color: '#fa541c',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              Bug
            </span>
          </div>
        </KanbanCard>
      </KanbanColumn>
      
      <KanbanColumn 
        id="in-progress" 
        title="In Progress" 
        backgroundColor="#e6f7ff"
        width="350px"
      >
        <KanbanCard 
          id="card-4" 
          title="Update Documentation" 
          backgroundColor="#ffffff"
        >
          <p>Revise API documentation and add examples</p>
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <span style={{ 
              backgroundColor: '#f9f0ff', 
              color: '#722ed1',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              Documentation
            </span>
          </div>
        </KanbanCard>
      </KanbanColumn>
      
      <KanbanColumn 
        id="done" 
        title="Done" 
        backgroundColor="#f6ffed"
        width="350px"
      >
        <KanbanCard 
          id="card-5" 
          title="Setup Project" 
          backgroundColor="#ffffff"
        >
          <p>Initialize repository and configure build tools</p>
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <span style={{ 
              backgroundColor: '#f9f0ff', 
              color: '#722ed1',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem'
            }}>
              Setup
            </span>
          </div>
        </KanbanCard>
      </KanbanColumn>
    </KanbanLayout>
  );
}
```

### Project Management Kanban

```tsx
import { KanbanLayout, KanbanColumn, KanbanCard } from '@pulseui/layout';

function ProjectKanban() {
  // Define custom card component for project tasks
  const TaskCard = ({ id, title, description, assignee, priority, dueDate }) => (
    <KanbanCard id={id} title={title}>
      <p style={{ marginBottom: '0.5rem' }}>{description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
        <div>
          <strong>Assignee:</strong> {assignee}
        </div>
        <div>
          <span style={{ 
            backgroundColor: 
              priority === 'High' ? '#fff1f0' : 
              priority === 'Medium' ? '#fff7e6' : 
              '#f6ffed',
            color: 
              priority === 'High' ? '#f5222d' : 
              priority === 'Medium' ? '#fa8c16' : 
              '#52c41a',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem'
          }}>
            {priority}
          </span>
        </div>
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#666' }}>
        Due: {dueDate}
      </div>
    </KanbanCard>
  );

  return (
    <KanbanLayout gap="lg" style={{ height: '700px' }}>
      <KanbanColumn id="backlog" title="Backlog" backgroundColor="#f9f9f9">
        <TaskCard 
          id="task-1"
          title="Research Competitors"
          description="Analyze top 5 competitors and identify market opportunities"
          assignee="Alice"
          priority="Medium"
          dueDate="Jun 15, 2023"
        />
        <TaskCard 
          id="task-2"
          title="Define MVP Features"
          description="Create a list of essential features for the minimum viable product"
          assignee="Bob"
          priority="High"
          dueDate="Jun 10, 2023"
        />
      </KanbanColumn>
      
      <KanbanColumn id="todo" title="To Do" backgroundColor="#f0f0f0">
        <TaskCard 
          id="task-3"
          title="Create Wireframes"
          description="Design initial wireframes for key user flows"
          assignee="Charlie"
          priority="High"
          dueDate="Jun 12, 2023"
        />
        <TaskCard 
          id="task-4"
          title="Setup Development Environment"
          description="Configure development tools and environments for the team"
          assignee="Dave"
          priority="Medium"
          dueDate="Jun 8, 2023"
        />
      </KanbanColumn>
      
      <KanbanColumn id="in-progress" title="In Progress" backgroundColor="#e6f7ff">
        <TaskCard 
          id="task-5"
          title="Implement Authentication"
          description="Create user authentication and authorization system"
          assignee="Eve"
          priority="High"
          dueDate="Jun 18, 2023"
        />
      </KanbanColumn>
      
      <KanbanColumn id="review" title="In Review" backgroundColor="#fff7e6">
        <TaskCard 
          id="task-6"
          title="Database Schema Design"
          description="Design the database schema for core functionality"
          assignee="Frank"
          priority="Medium"
          dueDate="Jun 5, 2023"
        />
      </KanbanColumn>
      
      <KanbanColumn id="done" title="Done" backgroundColor="#f6ffed">
        <TaskCard 
          id="task-7"
          title="Project Kickoff"
          description="Initial project kickoff meeting with stakeholders"
          assignee="Team"
          priority="High"
          dueDate="Jun 1, 2023"
        />
        <TaskCard 
          id="task-8"
          title="Requirements Gathering"
          description="Collect and document initial project requirements"
          assignee="Alice"
          priority="High"
          dueDate="Jun 3, 2023"
        />
      </KanbanColumn>
    </KanbanLayout>
  );
}
```

## API Reference

### KanbanLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The kanban columns to render |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Gap between kanban columns |
| `fullWidth` | `boolean` | `true` | Whether to fill the container width |
| `fullHeight` | `boolean` | `true` | Whether to fill the container height |
| `draggable` | `boolean` | `false` | Whether to enable drag and drop |
| `onCardMove` | `(cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void` | - | Callback when a card is moved to a different column |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the KanbanLayout component accepts all standard HTML div attributes.

### KanbanColumn Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The kanban cards to render |
| `id` | `string` | - | Unique identifier for the column |
| `title` | `React.ReactNode` | - | Title of the column |
| `width` | `string \| number` | `'300px'` | Width of the column |
| `backgroundColor` | `string` | `'#f5f5f5'` | Background color of the column |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Gap between kanban cards |
| `className` | `string` | `''` | Custom class name |

Additionally, the KanbanColumn component accepts all standard HTML div attributes.

### KanbanCard Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the kanban card |
| `id` | `string` | - | Unique identifier for the card |
| `title` | `React.ReactNode` | - | Title of the card |
| `backgroundColor` | `string` | `'#ffffff'` | Background color of the card |
| `className` | `string` | `''` | Custom class name |

Additionally, the KanbanCard component accepts all standard HTML div attributes.

## Gap Reference

| Size | Value |
|------|-------|
| `none` | 0 |
| `xs` | 0.25rem (4px) |
| `sm` | 0.5rem (8px) |
| `md` | 1rem (16px) |
| `lg` | 1.5rem (24px) |
| `xl` | 2rem (32px) |

## Drag and Drop Implementation

The drag and drop functionality is implemented using the HTML5 Drag and Drop API. When enabled:

1. Cards can be dragged from one column to another
2. Visual feedback is provided during drag operations
3. The `onCardMove` callback is triggered when a card is moved
4. The callback provides the card ID, source column ID, destination column ID, and new index

This allows for flexible integration with state management solutions like React's useState, Redux, or other state management libraries.

## Accessibility

The KanbanLayout component includes several accessibility considerations:

- Semantic structure for better screen reader navigation
- Keyboard navigation support when drag and drop is not enabled
- Visual feedback during drag and drop operations

For a fully accessible implementation, consider adding keyboard navigation for drag and drop operations and ARIA attributes for better screen reader support.

## Browser Support

The KanbanLayout component is compatible with all modern browsers that support the HTML5 Drag and Drop API:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
