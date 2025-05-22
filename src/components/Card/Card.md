# Card Component

The Card component is a flexible container that groups related content and actions. It provides a consistent way to present information with a clean, bordered layout.

## Import

```jsx
import { Card } from 'strive-ui';
```

## Features

- Flexible layout with header, body, and footer sections
- Multiple elevation levels
- Customizable borders and border radius
- Interactive states (hover, focus)
- Support for media content
- Responsive design
- Accessible implementation

## Usage

```jsx
import { Card, Button } from 'strive-ui';

// Basic usage
<Card>
  <Card.Body>
    Simple card with only body content
  </Card.Body>
</Card>

// With header and footer
<Card>
  <Card.Header>Card Title</Card.Header>
  <Card.Body>
    This is the main content of the card.
  </Card.Body>
  <Card.Footer>
    <Button variant="primary">Action</Button>
  </Card.Footer>
</Card>

// With elevation
<Card elevation="md">
  <Card.Header>Elevated Card</Card.Header>
  <Card.Body>
    This card has a medium elevation.
  </Card.Body>
</Card>

// With media
<Card>
  <Card.Media 
    src="/path/to/image.jpg" 
    alt="Card image"
    height="200px"
  />
  <Card.Body>
    Card with media content
  </Card.Body>
</Card>

// Interactive card
<Card 
  interactive 
  onClick={() => console.log('Card clicked')}
>
  <Card.Body>
    Click this card to trigger an action
  </Card.Body>
</Card>

// Horizontal layout
<Card layout="horizontal">
  <Card.Media 
    src="/path/to/image.jpg" 
    alt="Card image"
    width="150px"
  />
  <div>
    <Card.Header>Horizontal Card</Card.Header>
    <Card.Body>
      This card has a horizontal layout.
    </Card.Body>
  </div>
</Card>
```

## Props

### Card Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `elevation` | 'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'sm' | The elevation/shadow level of the card |
| `bordered` | boolean | true | Whether the card has a border |
| `borderColor` | string | - | Custom border color |
| `borderRadius` | 'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | The border radius of the card |
| `background` | string | - | Background color of the card |
| `padding` | 'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Padding inside the card |
| `interactive` | boolean | false | Whether the card has interactive hover/focus states |
| `disabled` | boolean | false | Whether the card is disabled (reduces opacity) |
| `layout` | 'vertical' \| 'horizontal' | 'vertical' | The layout direction of the card |
| `width` | string \| number | - | Width of the card |
| `maxWidth` | string \| number | - | Maximum width of the card |
| `height` | string \| number | - | Height of the card |
| `onClick` | (event: React.MouseEvent) => void | - | Click event handler (makes the card interactive) |

### Card.Header Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | ReactNode | - | Actions to display in the header (typically buttons) |
| `divider` | boolean | true | Whether to show a divider between the header and body |
| `padding` | 'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Padding inside the header |

### Card.Body Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `padding` | 'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Padding inside the body |

### Card.Footer Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `divider` | boolean | true | Whether to show a divider between the body and footer |
| `padding` | 'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Padding inside the footer |
| `align` | 'left' \| 'center' \| 'right' \| 'between' | 'left' | Alignment of the footer content |

### Card.Media Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | string | - | Source URL of the media |
| `alt` | string | - | Alternative text for the media |
| `height` | string \| number | - | Height of the media |
| `width` | string \| number | - | Width of the media |
| `position` | 'top' \| 'bottom' | 'top' | Position of the media in vertical layout |
| `objectFit` | 'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down' | 'cover' | Object-fit property for the media |

## Accessibility

The Card component follows accessibility best practices:
- Uses appropriate semantic HTML structure
- Ensures proper focus management for interactive cards
- Provides appropriate ARIA attributes when used as interactive elements
- Maintains adequate color contrast for content
- Ensures media elements have proper alt text
