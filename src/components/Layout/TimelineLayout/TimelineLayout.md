# Timeline Layout

The `TimelineLayout` and `TimelineItem` components provide a flexible way to create timeline layouts for displaying chronological events, process steps, or historical data. They support different orientations, alignments, and styling options.

## Features

- **Multiple Variants**: Vertical, horizontal, alternating, and centered layouts
- **Customizable Alignment**: Left, right, or center alignment options
- **Flexible Styling**: Control connector and dot colors, sizes, and spacing
- **Reverse Order**: Option to display items in reverse chronological order
- **Rich Item Content**: Support for title, subtitle, and custom content
- **Active and Completed States**: Built-in support for active and completed items
- **Polymorphic Component**: Can be rendered as any HTML element or React component

## Installation

```bash
npm install @strive-ui/layout
```

## Basic Usage

```tsx
import { TimelineLayout, TimelineItem } from '@strive-ui/layout';

function BasicTimeline() {
  return (
    <TimelineLayout>
      <TimelineItem 
        title="Step 1" 
        subtitle="January 2023"
      >
        First step description goes here.
      </TimelineItem>
      <TimelineItem 
        title="Step 2" 
        subtitle="February 2023"
      >
        Second step description goes here.
      </TimelineItem>
      <TimelineItem 
        title="Step 3" 
        subtitle="March 2023"
      >
        Third step description goes here.
      </TimelineItem>
      <TimelineItem 
        title="Step 4" 
        subtitle="April 2023"
      >
        Fourth step description goes here.
      </TimelineItem>
    </TimelineLayout>
  );
}
```

## Examples

### Different Variants

```tsx
import { TimelineLayout, TimelineItem } from '@strive-ui/layout';
import { useState } from 'react';

function VariantsExample() {
  const [variant, setVariant] = useState<'vertical' | 'horizontal' | 'alternating' | 'centered'>('vertical');
  
  const timelineItems = [
    { title: 'Step 1', subtitle: 'January 2023', content: 'First step description.' },
    { title: 'Step 2', subtitle: 'February 2023', content: 'Second step description.' },
    { title: 'Step 3', subtitle: 'March 2023', content: 'Third step description.' },
    { title: 'Step 4', subtitle: 'April 2023', content: 'Fourth step description.' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setVariant('vertical')}>Vertical</button>
        <button onClick={() => setVariant('horizontal')}>Horizontal</button>
        <button onClick={() => setVariant('alternating')}>Alternating</button>
        <button onClick={() => setVariant('centered')}>Centered</button>
      </div>
      
      <TimelineLayout variant={variant}>
        {timelineItems.map((item, index) => (
          <TimelineItem 
            key={index}
            title={item.title} 
            subtitle={item.subtitle}
          >
            {item.content}
          </TimelineItem>
        ))}
      </TimelineLayout>
    </div>
  );
}
```

### Different Alignments

```tsx
import { TimelineLayout, TimelineItem } from '@strive-ui/layout';
import { useState } from 'react';

function AlignmentExample() {
  const [align, setAlign] = useState<'left' | 'right' | 'center'>('left');
  
  const timelineItems = [
    { title: 'Step 1', subtitle: 'January 2023', content: 'First step description.' },
    { title: 'Step 2', subtitle: 'February 2023', content: 'Second step description.' },
    { title: 'Step 3', subtitle: 'March 2023', content: 'Third step description.' },
    { title: 'Step 4', subtitle: 'April 2023', content: 'Fourth step description.' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setAlign('left')}>Left</button>
        <button onClick={() => setAlign('right')}>Right</button>
        <button onClick={() => setAlign('center')}>Center</button>
      </div>
      
      <TimelineLayout variant="vertical" align={align}>
        {timelineItems.map((item, index) => (
          <TimelineItem 
            key={index}
            title={item.title} 
            subtitle={item.subtitle}
          >
            {item.content}
          </TimelineItem>
        ))}
      </TimelineLayout>
    </div>
  );
}
```

### Custom Colors and Sizes

```tsx
import { TimelineLayout, TimelineItem } from '@strive-ui/layout';

function CustomStylesExample() {
  return (
    <TimelineLayout 
      connectorColor="#9c27b0" 
      dotColor="#e91e63"
      size="lg"
      gap="lg"
    >
      <TimelineItem 
        title="Step 1" 
        subtitle="January 2023"
        dotColor="#4caf50"
      >
        First step with custom dot color.
      </TimelineItem>
      <TimelineItem 
        title="Step 2" 
        subtitle="February 2023"
        dotColor="#ff9800"
      >
        Second step with custom dot color.
      </TimelineItem>
      <TimelineItem 
        title="Step 3" 
        subtitle="March 2023"
        dotColor="#2196f3"
      >
        Third step with custom dot color.
      </TimelineItem>
      <TimelineItem 
        title="Step 4" 
        subtitle="April 2023"
        dotColor="#f44336"
      >
        Fourth step with custom dot color.
      </TimelineItem>
    </TimelineLayout>
  );
}
```

### Active and Completed Items

```tsx
import { TimelineLayout, TimelineItem } from '@strive-ui/layout';

function StateExample() {
  return (
    <TimelineLayout>
      <TimelineItem 
        title="Step 1" 
        subtitle="January 2023"
        completed
      >
        Completed step.
      </TimelineItem>
      <TimelineItem 
        title="Step 2" 
        subtitle="February 2023"
        completed
      >
        Completed step.
      </TimelineItem>
      <TimelineItem 
        title="Step 3" 
        subtitle="March 2023"
        active
      >
        Active step.
      </TimelineItem>
      <TimelineItem 
        title="Step 4" 
        subtitle="April 2023"
      >
        Upcoming step.
      </TimelineItem>
    </TimelineLayout>
  );
}
```

### Reverse Order

```tsx
import { TimelineLayout, TimelineItem } from '@strive-ui/layout';

function ReverseOrderExample() {
  return (
    <TimelineLayout reverse>
      <TimelineItem 
        title="Step 1" 
        subtitle="January 2023"
      >
        This will be displayed last.
      </TimelineItem>
      <TimelineItem 
        title="Step 2" 
        subtitle="February 2023"
      >
        This will be displayed third.
      </TimelineItem>
      <TimelineItem 
        title="Step 3" 
        subtitle="March 2023"
      >
        This will be displayed second.
      </TimelineItem>
      <TimelineItem 
        title="Step 4" 
        subtitle="April 2023"
      >
        This will be displayed first.
      </TimelineItem>
    </TimelineLayout>
  );
}
```

### Company History Timeline

```tsx
import { TimelineLayout, TimelineItem } from '@strive-ui/layout';

function CompanyHistoryExample() {
  const history = [
    { 
      year: '2010', 
      title: 'Company Founded', 
      content: 'Our company was founded with a mission to create innovative solutions for modern problems.' 
    },
    { 
      year: '2013', 
      title: 'First Major Product', 
      content: 'We launched our first major product, which quickly gained traction in the market.' 
    },
    { 
      year: '2015', 
      title: 'International Expansion', 
      content: 'We expanded our operations to Europe and Asia, establishing offices in London and Tokyo.' 
    },
    { 
      year: '2018', 
      title: 'Acquisition', 
      content: 'We acquired a smaller competitor to strengthen our market position and expand our product offerings.' 
    },
    { 
      year: '2020', 
      title: 'Remote Work Transition', 
      content: 'We successfully transitioned to a fully remote work environment while maintaining productivity.' 
    },
    { 
      year: '2023', 
      title: 'New Headquarters', 
      content: 'We opened our new headquarters, designed for collaboration and innovation.' 
    },
  ];

  return (
    <TimelineLayout variant="alternating" gap="lg">
      {history.map((event, index) => (
        <TimelineItem 
          key={index}
          title={event.title} 
          subtitle={event.year}
        >
          <p>{event.content}</p>
        </TimelineItem>
      ))}
    </TimelineLayout>
  );
}
```

## API Reference

### TimelineLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The timeline items to render |
| `variant` | `'vertical' \| 'horizontal' \| 'alternating' \| 'centered'` | `'vertical'` | Timeline variant |
| `align` | `'left' \| 'right' \| 'center'` | `'left'` | Alignment of timeline items (for vertical variant) |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string` | `'md'` | Gap between timeline items |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the timeline connector and dots |
| `connectorColor` | `string` | `'#e0e0e0'` | Color of the timeline connector |
| `dotColor` | `string` | `'#1976d2'` | Color of the timeline dots |
| `fullWidth` | `boolean` | `true` | Whether to fill the container width |
| `reverse` | `boolean` | `false` | Whether to reverse the order of items |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

Additionally, the TimelineLayout component accepts all standard HTML div attributes.

### TimelineItem Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content of the timeline item |
| `title` | `React.ReactNode` | - | Title of the timeline item |
| `subtitle` | `React.ReactNode` | - | Subtitle or date of the timeline item |
| `icon` | `React.ReactNode` | - | Icon to display in the timeline dot |
| `dotColor` | `string` | - | Custom dot color for this item |
| `active` | `boolean` | `false` | Whether the item is active |
| `completed` | `boolean` | `false` | Whether the item is completed |
| `className` | `string` | `''` | Custom class name |

Additionally, the TimelineItem component accepts all standard HTML div attributes.

## Layout Variants

| Variant | Description |
|---------|-------------|
| `vertical` | Items stacked vertically with connector line |
| `horizontal` | Items arranged horizontally with connector line |
| `alternating` | Items alternate between left and right sides of the connector |
| `centered` | Items centered around the connector line |

## Size Reference

| Size | Dot Size | Connector Size |
|------|----------|----------------|
| `xs` | 0.5rem | 1px |
| `sm` | 0.75rem | 2px |
| `md` | 1rem | 2px |
| `lg` | 1.25rem | 3px |
| `xl` | 1.5rem | 4px |

## Gap Reference

| Size | Value |
|------|-------|
| `none` | 0 |
| `xs` | 0.5rem (8px) |
| `sm` | 1rem (16px) |
| `md` | 2rem (32px) |
| `lg` | 3rem (48px) |
| `xl` | 4rem (64px) |

## Accessibility

The TimelineLayout component includes several accessibility considerations:

- Semantic structure for better screen reader navigation
- Visual indicators for active and completed states
- Customizable colors for better contrast

## Browser Support

The TimelineLayout component is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
