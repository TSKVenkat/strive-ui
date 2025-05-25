# Timeline Headless

The `TimelineHeadless` component provides a flexible and accessible foundation for building timeline interfaces, perfect for displaying chronological events, activity feeds, and process flows.

## Features

- **Compound Component Pattern**: Flexible and customizable structure
- **Headless Architecture**: Separation of logic and presentation
- **Accessibility**: ARIA attributes and keyboard navigation
- **Multiple Orientations**: Vertical and horizontal layouts
- **Flexible Alignment**: Left, right, center, or alternating items
- **Responsive Design**: Collapsible on mobile devices
- **Animation Support**: Optional entrance animations
- **Interactive Items**: Expandable/collapsible timeline events

## Installation

```bash
npm install @strive-ui/timeline
```

## Basic Usage

```tsx
import { TimelineHeadless } from '@strive-ui/timeline';
import { styled } from 'styled-components';

// Styled components for the timeline
const StyledTimeline = styled(TimelineHeadless.Root)`
  position: relative;
  margin: 40px 0;
  padding: 0;
  
  &.vertical {
    padding-left: 40px;
  }
  
  &.horizontal {
    display: flex;
    align-items: flex-start;
    padding-top: 40px;
  }
`;

const StyledItem = styled(TimelineHeadless.Item)`
  position: relative;
  margin-bottom: 40px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .horizontal & {
    margin-bottom: 0;
    margin-right: 40px;
    
    &:last-child {
      margin-right: 0;
    }
  }
`;

const StyledConnector = styled(TimelineHeadless.Connector)`
  position: absolute;
  
  .vertical & {
    top: 0;
    bottom: 0;
    left: -36px;
    width: 2px;
    height: 100%;
    background-color: #e0e0e0;
  }
  
  .horizontal & {
    left: 0;
    right: 0;
    top: -36px;
    height: 2px;
    width: 100%;
    background-color: #e0e0e0;
  }
`;

const StyledDot = styled(TimelineHeadless.Dot)`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #1976d2;
  border: 4px solid #fff;
  box-shadow: 0 0 0 2px #1976d2;
  
  .vertical & {
    left: -45px;
    top: 0;
  }
  
  .horizontal & {
    top: -45px;
    left: 0;
  }
  
  .active & {
    background-color: #f44336;
    box-shadow: 0 0 0 2px #f44336;
  }
`;

const StyledContent = styled(TimelineHeadless.Content)`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .active & {
    background-color: #e3f2fd;
  }
`;

const StyledDate = styled(TimelineHeadless.Date)`
  font-size: 14px;
  color: #757575;
  margin-bottom: 8px;
`;

const StyledTitle = styled(TimelineHeadless.Title)`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 8px 0;
`;

const StyledDescription = styled(TimelineHeadless.Description)`
  font-size: 16px;
  margin: 0;
`;

// Basic timeline component
function BasicTimeline() {
  const events = [
    {
      id: 1,
      date: 'January 10, 2025',
      title: 'Project Kickoff',
      description: 'Initial meeting with the client to discuss project requirements and timeline.',
    },
    {
      id: 2,
      date: 'February 15, 2025',
      title: 'Design Phase',
      description: 'Completed wireframes and design mockups for client approval.',
    },
    {
      id: 3,
      date: 'March 20, 2025',
      title: 'Development Begins',
      description: 'Started coding the frontend and backend components of the application.',
    },
    {
      id: 4,
      date: 'April 25, 2025',
      title: 'Testing Phase',
      description: 'Conducted thorough testing to identify and fix bugs and issues.',
    },
    {
      id: 5,
      date: 'May 30, 2025',
      title: 'Project Launch',
      description: 'Successfully deployed the application to production environment.',
    },
  ];

  return (
    <StyledTimeline 
      orientation="vertical"
      alignment="left"
      sortOrder="asc"
      collapseOnMobile
    >
      {events.map((event, index) => (
        <StyledItem key={event.id} index={index}>
          <StyledConnector />
          <StyledDot />
          <StyledContent>
            <StyledDate>{event.date}</StyledDate>
            <StyledTitle>{event.title}</StyledTitle>
            <StyledDescription>{event.description}</StyledDescription>
          </StyledContent>
        </StyledItem>
      ))}
    </StyledTimeline>
  );
}
```

## Examples

### Alternating Timeline

```tsx
import { TimelineHeadless } from '@strive-ui/timeline';
import { styled } from 'styled-components';

// Styled components (reusing from previous example)
// ...

// Timeline with alternating items
function AlternatingTimeline() {
  const events = [
    {
      id: 1,
      date: 'January 10, 2025',
      title: 'Project Kickoff',
      description: 'Initial meeting with the client to discuss project requirements and timeline.',
    },
    {
      id: 2,
      date: 'February 15, 2025',
      title: 'Design Phase',
      description: 'Completed wireframes and design mockups for client approval.',
    },
    {
      id: 3,
      date: 'March 20, 2025',
      title: 'Development Begins',
      description: 'Started coding the frontend and backend components of the application.',
    },
    {
      id: 4,
      date: 'April 25, 2025',
      title: 'Testing Phase',
      description: 'Conducted thorough testing to identify and fix bugs and issues.',
    },
    {
      id: 5,
      date: 'May 30, 2025',
      title: 'Project Launch',
      description: 'Successfully deployed the application to production environment.',
    },
  ];

  // Additional styles for alternating timeline
  const AlternatingTimelineRoot = styled(StyledTimeline)`
    &.vertical.alternate {
      padding-left: 0;
    }
  `;
  
  const AlternatingItem = styled(StyledItem)`
    &.left {
      padding-left: 40px;
      padding-right: 0;
    }
    
    &.right {
      padding-right: 40px;
      padding-left: 0;
      text-align: right;
    }
  `;
  
  const AlternatingConnector = styled(StyledConnector)`
    .vertical.alternate & {
      left: 50%;
      transform: translateX(-50%);
    }
  `;
  
  const AlternatingDot = styled(StyledDot)`
    .vertical.alternate & {
      left: 50%;
      transform: translateX(-50%);
    }
    
    .vertical.alternate .left & {
      transform: translateX(-50%);
    }
    
    .vertical.alternate .right & {
      transform: translateX(-50%);
    }
  `;

  return (
    <AlternatingTimelineRoot 
      orientation="vertical"
      alignment="alternate"
      sortOrder="asc"
      collapseOnMobile
    >
      {events.map((event, index) => (
        <AlternatingItem key={event.id} index={index}>
          <AlternatingConnector />
          <AlternatingDot />
          <StyledContent>
            <StyledDate>{event.date}</StyledDate>
            <StyledTitle>{event.title}</StyledTitle>
            <StyledDescription>{event.description}</StyledDescription>
          </StyledContent>
        </AlternatingItem>
      ))}
    </AlternatingTimelineRoot>
  );
}
```

### Horizontal Timeline

```tsx
import { TimelineHeadless } from '@strive-ui/timeline';
import { styled } from 'styled-components';

// Styled components (reusing from previous example)
// ...

// Horizontal timeline
function HorizontalTimeline() {
  const events = [
    {
      id: 1,
      date: 'Jan 2025',
      title: 'Kickoff',
      description: 'Project begins',
    },
    {
      id: 2,
      date: 'Feb 2025',
      title: 'Design',
      description: 'Design phase',
    },
    {
      id: 3,
      date: 'Mar 2025',
      title: 'Develop',
      description: 'Development',
    },
    {
      id: 4,
      date: 'Apr 2025',
      title: 'Test',
      description: 'Testing phase',
    },
    {
      id: 5,
      date: 'May 2025',
      title: 'Launch',
      description: 'Project launch',
    },
  ];

  // Additional styles for horizontal timeline
  const HorizontalItem = styled(StyledItem)`
    flex: 1;
    min-width: 120px;
    max-width: 200px;
  `;
  
  const HorizontalContent = styled(StyledContent)`
    height: 100%;
    display: flex;
    flex-direction: column;
  `;

  return (
    <div style={{ overflowX: 'auto' }}>
      <StyledTimeline 
        orientation="horizontal"
        alignment="center"
        sortOrder="asc"
      >
        {events.map((event, index) => (
          <HorizontalItem key={event.id} index={index}>
            <StyledConnector />
            <StyledDot />
            <HorizontalContent>
              <StyledDate>{event.date}</StyledDate>
              <StyledTitle>{event.title}</StyledTitle>
              <StyledDescription>{event.description}</StyledDescription>
            </HorizontalContent>
          </HorizontalItem>
        ))}
      </StyledTimeline>
    </div>
  );
}
```

### Interactive Timeline with Icons

```tsx
import { TimelineHeadless } from '@strive-ui/timeline';
import { styled } from 'styled-components';
import { useState } from 'react';

// Styled components (reusing from previous example)
// ...

// Interactive timeline with icons
function InteractiveTimeline() {
  const events = [
    {
      id: 1,
      date: 'January 10, 2025',
      title: 'Project Kickoff',
      description: 'Initial meeting with the client to discuss project requirements and timeline.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      details: 'During this meeting, we established the project scope, identified key stakeholders, and set preliminary milestones. The client expressed a strong preference for a modern design language with emphasis on accessibility and mobile responsiveness.'
    },
    {
      id: 2,
      date: 'February 15, 2025',
      title: 'Design Phase',
      description: 'Completed wireframes and design mockups for client approval.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      details: 'Our design team created low-fidelity wireframes followed by high-fidelity mockups. After two rounds of revisions based on client feedback, we finalized the design system including typography, color palette, and component library.'
    },
    {
      id: 3,
      date: 'March 20, 2025',
      title: 'Development Begins',
      description: 'Started coding the frontend and backend components of the application.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      ),
      details: 'Development was divided into frontend and backend tracks. The frontend team implemented the UI components using React while the backend team built the API endpoints using Node.js and Express. We established a CI/CD pipeline for continuous integration and deployment.'
    },
    {
      id: 4,
      date: 'April 25, 2025',
      title: 'Testing Phase',
      description: 'Conducted thorough testing to identify and fix bugs and issues.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>
        </svg>
      ),
      details: 'Our QA team performed extensive testing including unit tests, integration tests, and end-to-end tests. We also conducted performance testing and security audits to ensure the application meets all requirements. User acceptance testing with the client revealed minor issues that were promptly addressed.'
    },
    {
      id: 5,
      date: 'May 30, 2025',
      title: 'Project Launch',
      description: 'Successfully deployed the application to production environment.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      details: 'The application was successfully deployed to the production environment. We conducted post-launch monitoring to ensure stability and performance. The client was extremely satisfied with the final product, which met all requirements and was delivered on schedule and within budget.'
    },
  ];

  // Custom styled components for interactive timeline
  const IconDot = styled(StyledDot)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    left: -55px;
    background-color: white;
    color: #1976d2;
    
    .active & {
      color: #f44336;
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  `;
  
  const ExpandableContent = styled(StyledContent)`
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  `;
  
  const Details = styled.div`
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e0e0e0;
    display: none;
    
    .active & {
      display: block;
    }
  `;

  return (
    <StyledTimeline 
      orientation="vertical"
      alignment="left"
      sortOrder="asc"
      collapseOnMobile
    >
      {events.map((event, index) => (
        <StyledItem key={event.id} index={index}>
          <StyledConnector />
          <IconDot>{event.icon}</IconDot>
          <ExpandableContent>
            <StyledDate>{event.date}</StyledDate>
            <StyledTitle>{event.title}</StyledTitle>
            <StyledDescription>{event.description}</StyledDescription>
            <Details>{event.details}</Details>
          </ExpandableContent>
        </StyledItem>
      ))}
    </StyledTimeline>
  );
}
```

## API Reference

### useTimeline Hook

The `useTimeline` hook provides the core functionality for the timeline.

#### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | The orientation of the timeline |
| `alignment` | `'left' \| 'right' \| 'center' \| 'alternate'` | `'left'` | The alignment of the timeline items |
| `sortOrder` | `'asc' \| 'desc'` | `'asc'` | The sort order of the timeline items |
| `collapseOnMobile` | `boolean` | `true` | Whether to collapse items on mobile |
| `mobileBreakpoint` | `number` | `768` | The breakpoint for mobile view (in px) |
| `animateOnScroll` | `boolean` | `true` | Whether to animate items when they enter the viewport |
| `initialActiveIndex` | `number` | `-1` | The initial active item index |
| `onItemActivate` | `(index: number) => void` | - | Callback when an item is activated |

#### Return Value

| Name | Type | Description |
|------|------|-------------|
| `orientation` | `TimelineOrientation` | The orientation of the timeline |
| `alignment` | `TimelineAlignment` | The alignment of the timeline items |
| `sortOrder` | `TimelineSortOrder` | The sort order of the timeline items |
| `isMobileView` | `boolean` | Whether the timeline is in mobile view |
| `activeIndex` | `number` | The active item index |
| `setActiveIndex` | `(index: number) => void` | Set the active item index |
| `toggleActiveIndex` | `(index: number) => void` | Toggle the active item index |
| `getTimelineProps` | `() => object` | Get props for the timeline container |
| `getItemProps` | `(index: number) => object` | Get props for a timeline item |
| `getItemPosition` | `(index: number) => 'left' \| 'right'` | Get the position of an item based on index |
| `getItemAnimationDirection` | `(index: number) => 'left' \| 'right' \| 'top' \| 'bottom'` | Get the animation direction for an item |

### TimelineHeadless Components

#### TimelineHeadless.Root

The main container component that provides context for all other components.

```tsx
<TimelineHeadless.Root 
  orientation="vertical"
  alignment="left"
  sortOrder="asc"
>
  {/* Other timeline components */}
</TimelineHeadless.Root>
```

#### TimelineHeadless.Item

The individual item component.

```tsx
<TimelineHeadless.Item index={0}>
  {/* Item content */}
</TimelineHeadless.Item>
```

#### TimelineHeadless.Connector

The connector component that visually connects timeline items.

```tsx
<TimelineHeadless.Connector />
```

#### TimelineHeadless.Dot

The dot component that marks each timeline item.

```tsx
<TimelineHeadless.Dot />
```

#### TimelineHeadless.Content

The content container for each timeline item.

```tsx
<TimelineHeadless.Content>
  {/* Content */}
</TimelineHeadless.Content>
```

#### TimelineHeadless.Date

The date component for timeline items.

```tsx
<TimelineHeadless.Date>January 1, 2025</TimelineHeadless.Date>
```

#### TimelineHeadless.Title

The title component for timeline items.

```tsx
<TimelineHeadless.Title>Event Title</TimelineHeadless.Title>
```

#### TimelineHeadless.Description

The description component for timeline items.

```tsx
<TimelineHeadless.Description>
  Event description goes here.
</TimelineHeadless.Description>
```

## Accessibility

The TimelineHeadless component follows accessibility best practices:

- Proper ARIA attributes for the timeline and its items
- Keyboard navigation support
- Focus management
- Screen reader announcements
- Semantic HTML structure

## Browser Support

The TimelineHeadless component is compatible with all modern browsers:

- Chrome
- Firefox
- Safari
- Edge

## License

MIT
