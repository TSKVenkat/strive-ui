# Carousel Component

The Carousel component is a customizable slideshow for cycling through elements like images or cards.

## Import

```jsx
import { Carousel } from 'strive-ui';
```

## Usage

```jsx
<Carousel autoPlay showDots showArrows>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode[]` | Required | Array of elements to display in the carousel |
| `autoPlayInterval` | `number` | `5000` | Duration of the automatic slide transition in milliseconds |
| `autoPlay` | `boolean` | `false` | Whether to automatically transition between slides |
| `showDots` | `boolean` | `true` | Whether to show navigation dots |
| `showArrows` | `boolean` | `true` | Whether to show navigation arrows |
| `onSlideChange` | `(index: number) => void` | - | Function called when the active slide changes |

## Examples

### Basic Carousel

```jsx
<Carousel>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

### Auto-playing Carousel

```jsx
<Carousel autoPlay autoPlayInterval={3000}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

### Carousel with Custom Navigation

```jsx
<Carousel showDots={false} showArrows={true}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

### Carousel with Event Handling

```jsx
const handleSlideChange = (index) => {
  console.log(`Current slide: ${index}`);
};

<Carousel onSlideChange={handleSlideChange}>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>
```

## Accessibility

The Carousel component follows accessibility best practices:

- Arrow buttons have appropriate aria-labels
- Dot navigation buttons have descriptive aria-labels
- Focus management is handled properly
- Keyboard navigation is supported

## Animation

The Carousel uses Framer Motion for smooth slide transitions with configurable animation properties.
