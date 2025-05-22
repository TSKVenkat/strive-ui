# Avatar Component

The Avatar component displays a user's profile picture, initials, or fallback icon. It's commonly used in user interfaces to represent a person or entity.

## Import

```jsx
import { Avatar } from 'strive-ui';
```

## Features

- Multiple size options
- Support for images, initials, and fallback icons
- Customizable shapes (circle, rounded, square)
- Status indicators
- Group layout support
- Responsive design
- Accessible implementation

## Usage

```jsx
import { Avatar } from 'strive-ui';

// Basic usage with image
<Avatar src="/path/to/image.jpg" alt="User Name" />

// Using initials when no image is available
<Avatar name="John Doe" />

// With different sizes
<Avatar src="/path/to/image.jpg" size="sm" />
<Avatar src="/path/to/image.jpg" size="md" />
<Avatar src="/path/to/image.jpg" size="lg" />

// With different shapes
<Avatar src="/path/to/image.jpg" shape="circle" />
<Avatar src="/path/to/image.jpg" shape="rounded" />
<Avatar src="/path/to/image.jpg" shape="square" />

// With status indicator
<Avatar 
  src="/path/to/image.jpg" 
  status="online" 
  statusPosition="bottom-right" 
/>

// Avatar group
<Avatar.Group spacing={-8} max={3}>
  <Avatar src="/path/to/user1.jpg" />
  <Avatar src="/path/to/user2.jpg" />
  <Avatar src="/path/to/user3.jpg" />
  <Avatar src="/path/to/user4.jpg" />
  <Avatar src="/path/to/user5.jpg" />
</Avatar.Group>
```

## Props

### Avatar Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | - | URL of the image to be displayed |
| `alt` | string | - | Alternative text for the image |
| `name` | string | - | Name used to generate initials when no image is available |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number | 'md' | Size of the avatar |
| `shape` | 'circle' \| 'rounded' \| 'square' | 'circle' | Shape of the avatar |
| `status` | 'online' \| 'offline' \| 'busy' \| 'away' | - | Status indicator |
| `statusPosition` | 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | 'bottom-right' | Position of the status indicator |
| `statusSize` | 'xs' \| 'sm' \| 'md' \| 'lg' | - | Size of the status indicator (defaults based on avatar size) |
| `fallbackIcon` | ReactNode | - | Icon to display when image fails to load and no name is provided |
| `background` | string | - | Background color of the avatar |
| `color` | string | - | Text color for initials |
| `border` | boolean | false | Whether to show a border |
| `borderColor` | string | - | Color of the border |
| `onClick` | (event: React.MouseEvent) => void | - | Click event handler |

### Avatar.Group Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Avatar components to be rendered in the group |
| `max` | number | - | Maximum number of avatars to display before showing a count |
| `spacing` | number | -8 | Spacing between avatars (negative values create overlap) |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Size applied to all avatars in the group |
| `shape` | 'circle' \| 'rounded' \| 'square' | 'circle' | Shape applied to all avatars in the group |
| `border` | boolean | false | Whether to show borders on all avatars |
| `borderColor` | string | - | Border color for all avatars |

## Accessibility

The Avatar component follows accessibility best practices:
- Uses appropriate alt text for images
- Maintains adequate color contrast for text and background
- Ensures interactive avatars are keyboard accessible
- Provides appropriate ARIA attributes for screen readers
- Supports focus management for keyboard users when interactive
