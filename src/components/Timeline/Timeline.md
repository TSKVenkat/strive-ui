# Timeline

The Timeline component displays a sequence of events in chronological order. It's useful for showing history, progress, or steps in a process.

## Features

- Vertical or horizontal orientation
- Left, right, or alternating alignment for vertical timelines
- Customizable connector line and dots
- Support for active and completed states
- Animation support
- Customizable colors and sizes
- Support for icons and metadata

## Installation

```jsx
import { Timeline } from 'strive-ui';
```

## Usage

```jsx
import { Timeline } from 'strive-ui';

const timelineItems = [
  {
    id: 1,
    title: 'Project Started',
    content: 'Initial project setup and planning phase',
    date: 'Jan 10, 2023',
    completed: true,
  },
  {
    id: 2,
    title: 'Design Phase',
    content: 'Creating wireframes and design mockups',
    date: 'Feb 15, 2023',
    completed: true,
  },
  {
    id: 3,
    title: 'Development',
    content: 'Building the core functionality and features',
    date: 'Mar 20, 2023',
    active: true,
  },
  {
    id: 4,
    title: 'Testing',
    content: 'Quality assurance and bug fixing',
    date: 'Apr 25, 2023',
  },
  {
    id: 5,
    title: 'Deployment',
    content: 'Launching the product to production',
    date: 'May 30, 2023',
  },
];

function MyComponent() {
  return (
    <Timeline 
      items={timelineItems} 
      orientation="vertical"
      align="alternate"
    />
  );
}
```

## Props

### Timeline Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TimelineItem[]` | Required | Array of timeline items to display |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Orientation of the timeline |
| `align` | `'left' \| 'right' \| 'alternate'` | `'alternate'` | Alignment of timeline items (vertical orientation only) |
| `animate` | `boolean` | `true` | Whether to animate timeline items on mount |
| `showConnector` | `boolean` | `true` | Whether to show the connector line |
| `connectorColor` | `string` | `theme.colors.neutral[300]` | Custom color for the connector line |
| `connectorWidth` | `string` | `'2px'` | Width of the connector line |
| `dotSize` | `string` | `'24px'` | Size of the timeline dots |
| `className` | `string` | - | Additional CSS class for the container |
| `style` | `React.CSSProperties` | - | Additional inline styles for the container |

### TimelineItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string \| number` | Required | Unique identifier for the timeline item |
| `title` | `string` | Required | Title of the timeline item |
| `content` | `React.ReactNode` | Required | Content or description of the timeline item |
| `date` | `string` | - | Date or time of the timeline item |
| `icon` | `React.ReactNode` | - | Custom icon to display in the timeline dot |
| `meta` | `React.ReactNode` | - | Additional metadata to display |
| `active` | `boolean` | `false` | Whether the timeline item is active |
| `completed` | `boolean` | `false` | Whether the timeline item is completed |
| `color` | `string` | - | Custom color for the timeline dot |

## Examples

### Vertical Timeline (Default)

```jsx
<Timeline items={timelineItems} />
```

### Horizontal Timeline

```jsx
<Timeline 
  items={timelineItems} 
  orientation="horizontal" 
/>
```

### Left-Aligned Timeline

```jsx
<Timeline 
  items={timelineItems} 
  align="left" 
/>
```

### Right-Aligned Timeline

```jsx
<Timeline 
  items={timelineItems} 
  align="right" 
/>
```

### Custom Colors

```jsx
<Timeline 
  items={timelineItems.map(item => ({
    ...item,
    color: item.active ? '#3B82F6' : item.completed ? '#10B981' : '#6B7280',
  }))}
  connectorColor="#CBD5E1"
/>
```

### With Custom Icons

```jsx
<Timeline 
  items={timelineItems.map(item => ({
    ...item,
    icon: item.completed ? <CheckIcon /> : item.active ? <EditIcon /> : <ClockIcon />,
  }))}
/>
```

### With Metadata

```jsx
<Timeline 
  items={timelineItems.map(item => ({
    ...item,
    meta: `Assigned to: ${item.assignee}`,
  }))}
/>
```

### Without Animation

```jsx
<Timeline 
  items={timelineItems} 
  animate={false} 
/>
```

### Without Connector

```jsx
<Timeline 
  items={timelineItems} 
  showConnector={false} 
/>
```

### Custom Sizing

```jsx
<Timeline 
  items={timelineItems} 
  connectorWidth="4px"
  dotSize="32px"
/>
```

## Accessibility

- The Timeline component uses appropriate ARIA attributes for better screen reader support.
- The timeline container has `role="list"` and each item has `role="listitem"`.
- Active items are marked with `aria-current="step"`.

## Design Considerations

- For vertical timelines, consider using the `alternate` alignment for a balanced look.
- For horizontal timelines, ensure there's enough space for all items to be visible.
- Use the `active` and `completed` states to clearly indicate progress.
- Consider using custom icons to enhance visual understanding.
- For long timelines, consider breaking them into sections or using pagination.

## Best Practices

- Keep timeline item titles short and descriptive.
- Use dates consistently throughout the timeline.
- For complex content, consider using tooltips or expandable sections.
- Ensure sufficient color contrast for accessibility.
- For mobile views, consider using a vertical orientation regardless of desktop preference.
