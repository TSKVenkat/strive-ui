import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';
import { Box } from '../Box';

const meta: Meta<typeof ProductCard> = {
  title: 'E-Commerce/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'horizontal', 'minimal', 'featured'],
    },
    rating: {
      control: { type: 'range', min: 0, max: 5, step: 0.5 },
    },
    inStock: {
      control: 'boolean',
    },
    isInWishlist: {
      control: 'boolean',
    },
    showQuickView: {
      control: 'boolean',
    },
    showAddToCart: {
      control: 'boolean',
    },
    showWishlist: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

// Sample product data
const sampleProduct = {
  imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80',
  title: 'Premium Smartwatch with Health Monitoring',
  price: 199.99,
  originalPrice: 249.99,
  rating: 4.5,
  reviewCount: 128,
  badges: [
    { text: 'New', variant: 'primary' },
    { text: 'Sale', variant: 'error' },
  ],
  description: 'Advanced smartwatch with health monitoring features, GPS, and water resistance up to 50 meters.',
  inStock: true,
};

// Basic example
export const Default: Story = {
  args: {
    ...sampleProduct,
    variant: 'default',
  },
};

// Horizontal layout
export const Horizontal: Story = {
  args: {
    ...sampleProduct,
    variant: 'horizontal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Horizontal layout is ideal for list views or search results where more horizontal space is available.',
      },
    },
  },
};

// Minimal variant
export const Minimal: Story = {
  args: {
    ...sampleProduct,
    variant: 'minimal',
    showQuickView: false,
    showWishlist: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal variant with fewer interactive elements, suitable for dense grid layouts.',
      },
    },
  },
};

// Featured variant
export const Featured: Story = {
  args: {
    ...sampleProduct,
    variant: 'featured',
    badges: [
      { text: 'Featured', variant: 'success' },
      { text: 'Best Seller', variant: 'warning' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Featured variant with prominent styling for highlighting special products.',
      },
    },
  },
};

// Out of stock
export const OutOfStock: Story = {
  args: {
    ...sampleProduct,
    inStock: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Product card displaying out-of-stock status.',
      },
    },
  },
};

// With wishlist
export const InWishlist: Story = {
  args: {
    ...sampleProduct,
    isInWishlist: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Product card showing that the item is in the user\'s wishlist.',
      },
    },
  },
};

// Grid layout example
export const ProductGrid: Story = {
  render: () => {
    const products = [
      {
        ...sampleProduct,
        id: 1,
        title: 'Premium Smartwatch',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1399&q=80',
      },
      {
        ...sampleProduct,
        id: 2,
        title: 'Wireless Headphones',
        price: 149.99,
        originalPrice: 199.99,
        rating: 4.8,
        reviewCount: 256,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        badges: [{ text: 'Top Rated', variant: 'success' }],
      },
      {
        ...sampleProduct,
        id: 3,
        title: 'Professional Camera',
        price: 899.99,
        originalPrice: 1099.99,
        rating: 4.6,
        reviewCount: 89,
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80',
        badges: [{ text: 'Sale', variant: 'error' }],
      },
      {
        ...sampleProduct,
        id: 4,
        title: 'Smartphone',
        price: 799.99,
        originalPrice: 899.99,
        rating: 4.7,
        reviewCount: 312,
        imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        badges: [{ text: 'New', variant: 'primary' }],
      },
    ];

    return (
      <Box
        css={`
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          max-width: 1000px;
          
          @media (min-width: 768px) {
            grid-template-columns: repeat(3, 1fr);
          }
          
          @media (min-width: 1024px) {
            grid-template-columns: repeat(4, 1fr);
          }
        `}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={() => console.log(`Added ${product.title} to cart`)}
            onWishlistToggle={() => console.log(`Toggled wishlist for ${product.title}`)}
            onQuickView={() => console.log(`Quick view for ${product.title}`)}
            onClick={() => console.log(`Clicked on ${product.title}`)}
          />
        ))}
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of a responsive product grid layout with different products.',
      },
    },
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

// Interactive example with state
export const Interactive: Story = {
  render: () => {
    const [isInWishlist, setIsInWishlist] = React.useState(false);
    const [isInCart, setIsInCart] = React.useState(false);
    
    return (
      <Box css="width: 300px;">
        <ProductCard
          {...sampleProduct}
          isInWishlist={isInWishlist}
          onWishlistToggle={() => setIsInWishlist(!isInWishlist)}
          onAddToCart={() => setIsInCart(true)}
          onClick={() => console.log('Clicked on product')}
          onQuickView={() => console.log('Quick view opened')}
        />
        
        <Box 
          css={`
            margin-top: 16px;
            padding: 16px;
            background-color: #f5f5f5;
            border-radius: 8px;
          `}
        >
          <p>Product State:</p>
          <ul>
            <li>In Wishlist: {isInWishlist ? 'Yes' : 'No'}</li>
            <li>In Cart: {isInCart ? 'Yes' : 'No'}</li>
          </ul>
          {isInCart && (
            <Button 
              onClick={() => setIsInCart(false)}
              variant="secondary"
              size="sm"
            >
              Remove from Cart
            </Button>
          )}
        </Box>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example demonstrating state management with the ProductCard component.',
      },
    },
  },
};

// Helper component for the Interactive story
const Button = ({ children, onClick, variant, size }) => {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: variant === 'primary' ? '#3f51b5' : '#f5f5f5',
        color: variant === 'primary' ? 'white' : '#333',
        border: 'none',
        borderRadius: '4px',
        padding: size === 'sm' ? '8px 12px' : '12px 16px',
        cursor: 'pointer',
        fontSize: size === 'sm' ? '14px' : '16px',
        marginTop: '8px',
      }}
    >
      {children}
    </button>
  );
};
