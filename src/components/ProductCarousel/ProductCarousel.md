# Product Carousel

A specialized carousel component for showcasing products with rich product cards, including images, pricing, ratings, stock status, and action buttons.

## Features

- **Product Cards**: Display products with images, names, prices, descriptions, and more
- **Price Display**: Show current prices with optional original prices for discounts
- **Ratings**: Display star ratings with review counts
- **Stock Status**: Indicate whether products are in stock
- **Action Buttons**: "Add to Cart" and "Quick View" buttons with customizable callbacks
- **Product Badges**: Show "New", "Sale", and "Featured" badges
- **Navigation Controls**: Customizable arrows and dots for navigation
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Fully accessible with keyboard navigation and ARIA attributes
- **Customization**: Easily customizable styling and behavior

## Installation

```bash
npm install @strive-ui/product-carousel
```

## Usage

### Basic Usage

```jsx
import { ProductCarousel } from '@strive-ui/product-carousel';

const products = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    originalPrice: 129.99,
    imageUrl: 'https://example.com/headphones.jpg',
    imageAlt: 'Black wireless headphones',
    description: 'Premium wireless headphones with noise cancellation',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    isNew: true,
    onSale: true
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    imageUrl: 'https://example.com/smartwatch.jpg',
    imageAlt: 'Smart watch with black band',
    description: 'Feature-packed smartwatch with health monitoring',
    rating: 4.2,
    reviewCount: 75,
    inStock: true
  },
  // More products...
];

function App() {
  const handleAddToCart = (product) => {
    console.log('Adding to cart:', product);
    // Add your cart logic here
  };
  
  const handleQuickView = (product) => {
    console.log('Quick view:', product);
    // Open a modal or navigate to product detail
  };
  
  return (
    <ProductCarousel 
      products={products}
      onAddToCart={handleAddToCart}
      onQuickView={handleQuickView}
      slidesToShow={3}
      autoplay={true}
      autoplayInterval={5000}
    />
  );
}
```

### Custom Styling and Configuration

```jsx
import { ProductCarousel } from '@strive-ui/product-carousel';
import styled from 'styled-components';
import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaSearch } from 'react-icons/fa';

// Custom styled product carousel
const StyledProductCarousel = styled(ProductCarousel)`
  .strive-product-card {
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .strive-product-name {
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
  }
  
  .strive-price {
    color: #e63946;
  }
  
  .strive-add-to-cart-button {
    background-color: #2a9d8f;
    
    &:hover {
      background-color: #264653;
    }
  }
`;

function App() {
  return (
    <StyledProductCarousel 
      products={products}
      currencySymbol="€"
      showQuickView={false}
      infinite={true}
      slidesToShow={4}
      slidesToScroll={2}
      centerMode={true}
      renderPrevButton={({ onClick, disabled }) => (
        <button 
          onClick={onClick} 
          disabled={disabled}
          className="custom-arrow-button"
        >
          <FaArrowLeft />
        </button>
      )}
      renderNextButton={({ onClick, disabled }) => (
        <button 
          onClick={onClick} 
          disabled={disabled}
          className="custom-arrow-button"
        >
          <FaArrowRight />
        </button>
      )}
      renderAddToCartButton={({ onClick, disabled, product }) => (
        <button 
          onClick={onClick} 
          disabled={disabled}
          className="custom-cart-button"
        >
          <FaShoppingCart /> Add
        </button>
      )}
    />
  );
}
```

### Responsive Configuration

```jsx
import { ProductCarousel } from '@strive-ui/product-carousel';

function App() {
  const responsiveSettings = [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
      }
    }
  ];

  return (
    <ProductCarousel 
      products={products}
      responsive={responsiveSettings}
      infinite={true}
      autoplay={true}
    />
  );
}
```

## API Reference

### ProductCarousel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `products` | `ProductItem[]` | Required | Array of product items to display |
| `currencySymbol` | `string` | `'$'` | Currency symbol to display with prices |
| `showRatings` | `boolean` | `true` | Whether to show product ratings |
| `showArrows` | `boolean` | `true` | Whether to show navigation arrows |
| `showDots` | `boolean` | `true` | Whether to show navigation dots |
| `showAddToCart` | `boolean` | `true` | Whether to show "Add to Cart" button |
| `showQuickView` | `boolean` | `true` | Whether to show "Quick View" button |
| `showBadges` | `boolean` | `true` | Whether to show product badges |
| `onAddToCart` | `(product: ProductItem) => void` | - | Callback when "Add to Cart" is clicked |
| `onQuickView` | `(product: ProductItem) => void` | - | Callback when "Quick View" is clicked |
| `onProductClick` | `(product: ProductItem) => void` | - | Callback when a product is clicked |
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

### ProductItem Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string \| number` | Yes | Unique identifier for the product |
| `name` | `string` | Yes | The name of the product |
| `price` | `number \| string` | Yes | The price of the product |
| `originalPrice` | `number \| string` | No | The original price (for showing discounts) |
| `imageUrl` | `string` | Yes | The image URL of the product |
| `imageAlt` | `string` | Yes | Alt text for the product image |
| `description` | `string` | No | Short description of the product |
| `rating` | `number` | No | Rating of the product (out of 5) |
| `reviewCount` | `number` | No | Number of reviews for the product |
| `inStock` | `boolean` | No | Whether the product is in stock |
| `tags` | `string[]` | No | Tags or categories for the product |
| `url` | `string` | No | URL to the product detail page |
| `featured` | `boolean` | No | Whether the product is featured |
| `isNew` | `boolean` | No | Whether the product is new |
| `onSale` | `boolean` | No | Whether the product is on sale |

## Accessibility

The ProductCarousel component is built with accessibility in mind:

- All product images require alt text for screen readers
- Keyboard navigation is supported (arrow keys)
- ARIA attributes are properly set for screen readers
- Focus management for keyboard users
- Proper button roles and labels
- Semantic HTML structure

## Best Practices

1. **Performance**: Use the `lazyLoad` feature to optimize loading times, especially for carousels with many products.
2. **Responsive Design**: Configure the `slidesToShow` property based on screen size for optimal display across devices.
3. **User Experience**: Consider using `autoplay: false` for product carousels to give users time to read product details.
4. **Accessibility**: Always provide descriptive `imageAlt` text for product images.
5. **Pricing**: Use the `originalPrice` property to show discounts and sales clearly.

## Browser Support

The ProductCarousel component works in all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with appropriate polyfills)

## License

MIT
