import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '../Box';
import { ProductCard, ProductCardProps } from '../ProductCard/ProductCard';

export interface ProductGridProps {
  /**
   * Array of product data to display
   */
  products: Array<ProductCardProps & { id: string | number }>;
  /**
   * Number of columns at different breakpoints
   */
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /**
   * Gap between items
   */
  gap?: string;
  /**
   * Product card variant
   */
  cardVariant?: 'default' | 'horizontal' | 'minimal' | 'featured';
  /**
   * Whether to animate items on load
   */
  animated?: boolean;
  /**
   * Custom animation variants
   */
  animationVariants?: any;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Number of skeleton items to show when loading
   */
  skeletonCount?: number;
  /**
   * Custom empty state component
   */
  emptyState?: React.ReactNode;
  /**
   * Custom loading state component
   */
  loadingState?: React.ReactNode;
  /**
   * Whether to show wishlist button
   */
  showWishlist?: boolean;
  /**
   * Whether to show quick view button
   */
  showQuickView?: boolean;
  /**
   * Whether to show add to cart button
   */
  showAddToCart?: boolean;
  /**
   * Function to handle add to cart
   */
  onAddToCart?: (product: ProductCardProps & { id: string | number }) => void;
  /**
   * Function to handle wishlist toggle
   */
  onWishlistToggle?: (product: ProductCardProps & { id: string | number }) => void;
  /**
   * Function to handle quick view
   */
  onQuickView?: (product: ProductCardProps & { id: string | number }) => void;
  /**
   * Function to handle product click
   */
  onProductClick?: (product: ProductCardProps & { id: string | number }) => void;
  /**
   * Array of product IDs in wishlist
   */
  wishlistItems?: Array<string | number>;
  /**
   * Array of product IDs in cart
   */
  cartItems?: Array<string | number>;
  /**
   * Currency symbol
   */
  currencySymbol?: string;
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

const StyledProductGrid = styled(Box)<{
  $columns: ProductGridProps['columns'];
  $gap: string;
}>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns?.xs || 1}, 1fr);
  gap: ${({ $gap }) => $gap || '24px'};
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(${({ $columns }) => $columns?.sm || 2}, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(${({ $columns }) => $columns?.md || 3}, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(${({ $columns }) => $columns?.lg || 4}, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(${({ $columns }) => $columns?.xl || 4}, 1fr);
  }
`;

const EmptyStateContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  grid-column: 1 / -1;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.neutral[300]};
`;

const EmptyStateText = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin: 0 0 8px 0;
`;

const EmptyStateSubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin: 0;
`;

// Default animation variants
const defaultAnimationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut'
    }
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

/**
 * ProductGrid component displays a responsive grid of product cards
 * with various customization options and interactive features.
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 4 },
  gap = '24px',
  cardVariant = 'default',
  animated = true,
  animationVariants = defaultAnimationVariants,
  loading = false,
  skeletonCount = 8,
  emptyState,
  loadingState,
  showWishlist = true,
  showQuickView = true,
  showAddToCart = true,
  onAddToCart,
  onWishlistToggle,
  onQuickView,
  onProductClick,
  wishlistItems = [],
  cartItems = [],
  currencySymbol = '$',
  css,
  children
}) => {
  // Handle empty state
  if (!loading && products.length === 0) {
    return emptyState || (
      <EmptyStateContainer>
        <EmptyStateIcon>📦</EmptyStateIcon>
        <EmptyStateText>No products found</EmptyStateText>
        <EmptyStateSubtext>Try adjusting your filters or search criteria</EmptyStateSubtext>
      </EmptyStateContainer>
    );
  }

  // Handle loading state
  if (loading) {
    return loadingState || (
      <StyledProductGrid $columns={columns} $gap={gap} css={css}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </StyledProductGrid>
    );
  }

  return (
    <StyledProductGrid $columns={columns} $gap={gap} css={css}>
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            custom={index}
            initial={animated ? 'hidden' : undefined}
            animate={animated ? 'visible' : undefined}
            exit={animated ? 'exit' : undefined}
            variants={animationVariants}
            layout
          >
            <ProductCard
              {...product}
              variant={cardVariant}
              showWishlist={showWishlist}
              showQuickView={showQuickView}
              showAddToCart={showAddToCart}
              isInWishlist={wishlistItems.includes(product.id)}
              currencySymbol={currencySymbol}
              onAddToCart={() => onAddToCart?.(product)}
              onWishlistToggle={() => onWishlistToggle?.(product)}
              onQuickView={() => onQuickView?.(product)}
              onClick={() => onProductClick?.(product)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {children}
    </StyledProductGrid>
  );
};

// ProductCardSkeleton component for loading state
const SkeletonPulse = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.neutral[200]} 25%,
    ${({ theme }) => theme.colors.neutral[300]} 50%,
    ${({ theme }) => theme.colors.neutral[200]} 75%
  );
  background-size: 400% 100%;
  animation: pulse 1.5s ease-in-out infinite;
  
  @keyframes pulse {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

const ProductCardSkeletonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.common.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  height: 100%;
`;

const ProductImageSkeleton = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;
  
  ${SkeletonPulse} {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const ProductContentSkeleton = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TitleSkeleton = styled.div`
  height: 24px;
  width: 90%;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  
  ${SkeletonPulse} {
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

const PriceSkeleton = styled.div`
  height: 20px;
  width: 40%;
  margin: ${({ theme }) => theme.spacing[2]} 0;
  
  ${SkeletonPulse} {
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

const RatingSkeleton = styled.div`
  height: 16px;
  width: 60%;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  
  ${SkeletonPulse} {
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }
`;

const ButtonSkeleton = styled.div`
  height: 36px;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[3]};
  
  ${SkeletonPulse} {
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const ProductCardSkeleton: React.FC = () => (
  <ProductCardSkeletonWrapper>
    <ProductImageSkeleton>
      <SkeletonPulse />
    </ProductImageSkeleton>
    <ProductContentSkeleton>
      <TitleSkeleton>
        <SkeletonPulse />
      </TitleSkeleton>
      <RatingSkeleton>
        <SkeletonPulse />
      </RatingSkeleton>
      <PriceSkeleton>
        <SkeletonPulse />
      </PriceSkeleton>
      <ButtonSkeleton>
        <SkeletonPulse />
      </ButtonSkeleton>
    </ProductContentSkeleton>
  </ProductCardSkeletonWrapper>
);

export default ProductGrid;
