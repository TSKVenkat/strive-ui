# Testimonial Carousel

A specialized carousel component for showcasing customer testimonials, reviews, and quotes with various layout options and customizable styling.

## Features

- **Multiple Layouts**: Choose from card, quote, minimal, or featured layouts
- **Rich Content**: Display testimonials with quotes, ratings, author information, and more
- **Avatar Support**: Show profile pictures of testimonial authors
- **Rating Display**: Show star ratings with customizable appearance
- **Verification Badges**: Indicate verified testimonials
- **Social Profiles**: Optionally display social media links for testimonial authors
- **Featured Testimonials**: Highlight important testimonials
- **Navigation Controls**: Customizable arrows and dots for navigation
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Fully accessible with keyboard navigation and ARIA attributes
- **Customization**: Easily customizable styling and behavior

## Installation

```bash
npm install @strive-ui/testimonial-carousel
```

## Usage

### Basic Usage

```jsx
import { TestimonialCarousel } from '@strive-ui/testimonial-carousel';

const testimonials = [
  {
    id: '1',
    name: 'John Smith',
    role: 'CTO',
    company: 'Tech Solutions',
    content: 'This product has completely transformed our workflow. The interface is intuitive and our team productivity has increased by 30%.',
    rating: 5,
    avatarUrl: 'https://example.com/avatar1.jpg',
    verified: true
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'Creative Agency',
    content: 'I've tried many similar products, but this one stands out for its flexibility and powerful features. Highly recommended!',
    rating: 4.5,
    avatarUrl: 'https://example.com/avatar2.jpg',
    date: 'May 15, 2025',
    verified: true
  },
  // More testimonials...
];

function App() {
  return (
    <TestimonialCarousel 
      testimonials={testimonials}
      autoplay={true}
      autoplayInterval={5000}
    />
  );
}
```

### Different Layouts

```jsx
import { TestimonialCarousel } from '@strive-ui/testimonial-carousel';
import { useState } from 'react';

function App() {
  const [layout, setLayout] = useState('card');
  
  return (
    <div>
      <div className="layout-controls">
        <button onClick={() => setLayout('card')}>Card Layout</button>
        <button onClick={() => setLayout('quote')}>Quote Layout</button>
        <button onClick={() => setLayout('minimal')}>Minimal Layout</button>
        <button onClick={() => setLayout('featured')}>Featured Layout</button>
      </div>
      
      <TestimonialCarousel 
        testimonials={testimonials}
        layout={layout}
        showDate={true}
        showSocialProfiles={true}
        slidesToShow={layout === 'minimal' ? 2 : 1}
      />
    </div>
  );
}
```

### Styled with Styled Components

```jsx
import { TestimonialCarousel } from '@strive-ui/testimonial-carousel';
import styled from 'styled-components';

const StyledTestimonialCarousel = styled(TestimonialCarousel)`
  .strive-testimonial-card {
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
  
  .strive-quote-icon {
    color: #6200ea;
  }
  
  .strive-testimonial-content {
    font-family: 'Georgia', serif;
    line-height: 1.8;
  }
  
  .strive-testimonial-name {
    color: #6200ea;
    font-weight: 700;
  }
  
  .strive-testimonial-avatar {
    border: 3px solid #6200ea;
  }
`;

function App() {
  return (
    <StyledTestimonialCarousel 
      testimonials={testimonials}
      layout="quote"
      infinite={true}
      showRatings={false}
    />
  );
}
```

## API Reference

### TestimonialCarousel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `testimonials` | `TestimonialItem[]` | Required | Array of testimonial items to display |
| `showRatings` | `boolean` | `true` | Whether to show ratings |
| `showArrows` | `boolean` | `true` | Whether to show navigation arrows |
| `showDots` | `boolean` | `true` | Whether to show navigation dots |
| `showDate` | `boolean` | `false` | Whether to show the date of testimonials |
| `showVerified` | `boolean` | `true` | Whether to show verification badges |
| `showSocialProfiles` | `boolean` | `false` | Whether to show social profiles |
| `layout` | `'card' \| 'quote' \| 'minimal' \| 'featured'` | `'card'` | Layout style for testimonials |
| `className` | `string` | `''` | Custom class name for the component |
| `infinite` | `boolean` | `false` | Whether to enable infinite looping |
| `autoplay` | `boolean` | `false` | Whether to enable autoplay |
| `autoplayInterval` | `number` | `3000` | The interval for autoplay in milliseconds |
| `pauseOnHover` | `boolean` | `true` | Whether to pause autoplay on hover |
| `pauseOnFocus` | `boolean` | `true` | Whether to pause autoplay on focus |
| `slidesToShow` | `number` | `1` | The number of items to show at once |
| `slidesToScroll` | `number` | `1` | The number of items to scroll at once |
| `centerMode` | `boolean` | `false` | Whether to center the active slide |
| `draggable` | `boolean` | `true` | Whether to enable dragging/swiping |
| `swipeThreshold` | `number` | `50` | The threshold for swipe distance (in px) |
| `onChange` | `(index: number) => void` | - | Callback when the active index changes |
| `keyboardNavigation` | `boolean` | `true` | Whether to enable keyboard navigation |

### TestimonialItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string \| number` | Yes | Unique identifier for the testimonial |
| `name` | `string` | Yes | The name of the person giving the testimonial |
| `role` | `string` | No | The role or title of the person |
| `company` | `string` | No | The company or organization of the person |
| `content` | `string` | Yes | The testimonial content/quote |
| `rating` | `number` | No | The rating given by the person (out of 5) |
| `avatarUrl` | `string` | No | The avatar/image URL of the person |
| `avatarAlt` | `string` | No | Alt text for the avatar image |
| `date` | `string` | No | The date of the testimonial |
| `featured` | `boolean` | No | Whether the testimonial is featured |
| `verified` | `boolean` | No | Optional verification status |
| `socialProfiles` | `Array<{platform: string; url: string; icon?: string}>` | No | Optional social media profiles |

## Layout Options

### Card Layout

The default layout with a clean card design featuring:
- Bordered container with subtle shadow
- Quote icon
- Testimonial content
- Author information with avatar
- Optional rating, date, and verification badge

### Quote Layout

A layout emphasizing the testimonial text:
- Left border accent
- Prominent quote styling
- Subtle background
- Author information below the quote

### Minimal Layout

A simplified, clean layout:
- No borders or background
- Focused on the testimonial content
- Minimal styling for a clean look
- Works well when showing multiple testimonials at once

### Featured Layout

A standout design for highlighting important testimonials:
- Gradient background
- White text for contrast
- Enhanced shadow effect
- Slightly larger quote text

## Accessibility

The TestimonialCarousel component is built with accessibility in mind:

- All avatar images have appropriate alt text
- Keyboard navigation is supported (arrow keys)
- ARIA attributes are properly set for screen readers
- Semantic HTML structure with blockquote for testimonial content
- Focus management for keyboard users

## Best Practices

1. **Content Length**: Keep testimonials concise for better readability.
2. **Verification**: Use the verification badge to build trust with your audience.
3. **Layout Selection**: Choose the layout that best matches your website's design:
   - Card: For a clean, professional look
   - Quote: For emphasizing the testimonial text
   - Minimal: For a modern, minimalist design
   - Featured: For highlighting important testimonials
4. **Autoplay**: Consider setting `autoplay: false` for testimonials with longer content to give users time to read.
5. **Responsive Design**: Adjust `slidesToShow` based on screen size for optimal display across devices.

## Browser Support

The TestimonialCarousel component works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with appropriate polyfills)

## License

MIT
