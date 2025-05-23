import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AdvancedCarousel } from './AdvancedCarousel';
import { Box } from '../Box/Box';
import { Button } from '../Button/Button';

const meta: Meta<typeof AdvancedCarousel> = {
  title: 'Components/AdvancedCarousel',
  component: AdvancedCarousel,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof AdvancedCarousel>;

// Sample items for the carousel
const items = [
  {
    id: 1,
    image: 'https://source.unsplash.com/random/800x400?nature',
    alt: 'Nature landscape',
    title: 'Beautiful Nature',
    description: 'Explore the wonders of natural landscapes from around the world.',
  },
  {
    id: 2,
    image: 'https://source.unsplash.com/random/800x400?city',
    alt: 'City skyline',
    title: 'Urban Exploration',
    description: 'Discover the architecture and vibrant life of modern cities.',
  },
  {
    id: 3,
    image: 'https://source.unsplash.com/random/800x400?food',
    alt: 'Delicious food',
    title: 'Culinary Delights',
    description: 'Savor the flavors of international cuisine and culinary masterpieces.',
  },
  {
    id: 4,
    image: 'https://source.unsplash.com/random/800x400?travel',
    alt: 'Travel destinations',
    title: 'Travel Adventures',
    description: 'Embark on journeys to exotic destinations and hidden gems.',
  },
  {
    id: 5,
    image: 'https://source.unsplash.com/random/800x400?technology',
    alt: 'Modern technology',
    title: 'Tech Innovations',
    description: 'Explore the latest advancements in technology and digital solutions.',
  },
];

// Basic carousel
export const Basic: Story = {
  args: {
    items,
    showArrows: true,
    showDots: true,
    effect: 'slide',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Fade effect
export const FadeEffect: Story = {
  args: {
    items,
    showArrows: true,
    showDots: true,
    effect: 'fade',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Zoom effect
export const ZoomEffect: Story = {
  args: {
    items,
    showArrows: true,
    showDots: true,
    effect: 'zoom',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Autoplay
export const Autoplay: Story = {
  args: {
    items,
    showArrows: true,
    showDots: true,
    autoplay: true,
    autoplayInterval: 3000,
    pauseOnHover: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// With thumbnails
export const WithThumbnails: Story = {
  args: {
    items,
    showArrows: true,
    showDots: false,
    showThumbnails: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '450px' }}>
        <Story />
      </div>
    ),
  ],
};

// Content positions
export const ContentPositions: Story = {
  render: () => {
    const [position, setPosition] = useState<'bottom' | 'top' | 'left' | 'right' | 'center'>('bottom');
    
    return (
      <Box display="flex" flexDirection="column" gap={3} height="500px">
        <Box display="flex" gap={2} justifyContent="center">
          <Button onClick={() => setPosition('bottom')}>Bottom</Button>
          <Button onClick={() => setPosition('top')}>Top</Button>
          <Button onClick={() => setPosition('left')}>Left</Button>
          <Button onClick={() => setPosition('right')}>Right</Button>
          <Button onClick={() => setPosition('center')}>Center</Button>
        </Box>
        
        <Box flex="1">
          <AdvancedCarousel
            items={items}
            showArrows={true}
            showDots={true}
            contentPosition={position}
          />
        </Box>
      </Box>
    );
  },
};

// Multiple slides
export const MultipleSlides: Story = {
  args: {
    items,
    showArrows: true,
    showDots: true,
    slidesToShow: 2,
    slidesToScroll: 1,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Fullscreen button
export const FullscreenButton: Story = {
  args: {
    items,
    showArrows: true,
    showDots: true,
    fullscreenButton: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Custom content
export const CustomContent: Story = {
  args: {
    items: [
      {
        id: 1,
        image: 'https://source.unsplash.com/random/800x400?product',
        alt: 'Product 1',
        content: (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            padding={4}
            backgroundColor="rgba(0, 0, 0, 0.7)"
            color="white"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Box as="h3" margin={0} fontSize="xl" fontWeight="bold">Premium Product</Box>
              <Box as="p" margin={0}>High-quality craftsmanship with premium materials</Box>
            </Box>
            <Button>Buy Now</Button>
          </Box>
        ),
      },
      {
        id: 2,
        image: 'https://source.unsplash.com/random/800x400?product',
        alt: 'Product 2',
        content: (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            padding={4}
            backgroundColor="rgba(255, 255, 255, 0.9)"
            borderRadius="md"
            textAlign="center"
            maxWidth="80%"
          >
            <Box as="h2" color="primary.500" fontWeight="bold" marginBottom={3}>Special Offer</Box>
            <Box as="p" marginBottom={4}>Limited time discount on our most popular items!</Box>
            <Button color="primary">Shop Now</Button>
          </Box>
        ),
      },
      {
        id: 3,
        image: 'https://source.unsplash.com/random/800x400?product',
        alt: 'Product 3',
        content: (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            backgroundColor="rgba(0, 0, 0, 0.5)"
          >
            <Box
              as="span"
              fontSize="4xl"
              fontWeight="bold"
              color="white"
              textShadow="0 2px 4px rgba(0,0,0,0.5)"
              marginBottom={4}
            >
              NEW COLLECTION
            </Box>
            <Button size="lg" variant="outline" color="white" borderColor="white">
              Explore Now
            </Button>
          </Box>
        ),
      },
    ],
    showArrows: true,
    showDots: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    const [effect, setEffect] = useState<'slide' | 'fade' | 'zoom'>('slide');
    const [autoplay, setAutoplay] = useState(false);
    const [showThumbnails, setShowThumbnails] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    return (
      <Box display="flex" flexDirection="column" gap={3} height="500px">
        <Box display="flex" gap={2} flexWrap="wrap">
          <Box display="flex" gap={2} alignItems="center">
            <Box as="span" fontWeight="medium">Effect:</Box>
            <Button 
              variant={effect === 'slide' ? 'filled' : 'outline'} 
              onClick={() => setEffect('slide')}
              size="sm"
            >
              Slide
            </Button>
            <Button 
              variant={effect === 'fade' ? 'filled' : 'outline'} 
              onClick={() => setEffect('fade')}
              size="sm"
            >
              Fade
            </Button>
            <Button 
              variant={effect === 'zoom' ? 'filled' : 'outline'} 
              onClick={() => setEffect('zoom')}
              size="sm"
            >
              Zoom
            </Button>
          </Box>
          
          <Box display="flex" gap={2} alignItems="center">
            <Button 
              variant={autoplay ? 'filled' : 'outline'} 
              onClick={() => setAutoplay(!autoplay)}
              size="sm"
            >
              {autoplay ? 'Autoplay: On' : 'Autoplay: Off'}
            </Button>
            
            <Button 
              variant={showThumbnails ? 'filled' : 'outline'} 
              onClick={() => setShowThumbnails(!showThumbnails)}
              size="sm"
            >
              {showThumbnails ? 'Thumbnails: On' : 'Thumbnails: Off'}
            </Button>
          </Box>
        </Box>
        
        <Box as="p" margin={0}>
          Current slide: {currentIndex + 1} of {items.length} - {items[currentIndex].title}
        </Box>
        
        <Box flex="1">
          <AdvancedCarousel
            items={items}
            showArrows={true}
            showDots={true}
            showThumbnails={showThumbnails}
            autoplay={autoplay}
            autoplayInterval={3000}
            effect={effect}
            onChange={setCurrentIndex}
            onSlideClick={(item, index) => {
              console.log('Slide clicked:', item, index);
            }}
          />
        </Box>
      </Box>
    );
  },
};

// Responsive example
export const Responsive: Story = {
  render: () => {
    return (
      <Box display="flex" flexDirection="column" gap={4}>
        <Box as="h3">Mobile View (1 slide)</Box>
        <Box height="200px">
          <AdvancedCarousel
            items={items}
            showArrows={true}
            showDots={true}
            slidesToShow={1}
          />
        </Box>
        
        <Box as="h3">Tablet View (2 slides)</Box>
        <Box height="300px">
          <AdvancedCarousel
            items={items}
            showArrows={true}
            showDots={true}
            slidesToShow={2}
          />
        </Box>
        
        <Box as="h3">Desktop View (3 slides)</Box>
        <Box height="400px">
          <AdvancedCarousel
            items={items}
            showArrows={true}
            showDots={true}
            slidesToShow={3}
          />
        </Box>
      </Box>
    );
  },
};
