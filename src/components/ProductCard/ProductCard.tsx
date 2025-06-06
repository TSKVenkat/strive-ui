import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';
import { Box } from '../Box';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Rating } from '../Rating';

// Types
export interface ProductCardProps {
  /**
   * Product image URL
   */
  imageUrl: string;
  /**
   * Product title
   */
  title: string;
  /**
   * Product price
   */
  price: number;
  /**
   * Original price (for showing discounts)
   */
  originalPrice?: number;
  /**
   * Product rating (0-5)
   */
  rating?: number;
  /**
   * Number of reviews
   */
  reviewCount?: number;
  /**
   * Product badges (e.g., "New", "Sale", "Bestseller")
   */
  badges?: Array<{
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  }>;
  /**
   * Whether the product is in stock
   */
  inStock?: boolean;
  /**
   * Custom action when add to cart button is clicked
   */
  onAddToCart?: () => void;
  /**
   * Custom action when product is clicked
   */
  onClick?: () => void;
  /**
   * Custom action when wishlist button is clicked
   */
  onWishlistToggle?: () => void;
  /**
   * Whether the product is in the wishlist
   */
  isInWishlist?: boolean;
  /**
   * Custom action when quick view button is clicked
   */
  onQuickView?: () => void;
  /**
   * Whether to show quick view button
   */
  showQuickView?: boolean;
  /**
   * Whether to show add to cart button
   */
  showAddToCart?: boolean;
  /**
   * Whether to show wishlist button
   */
  showWishlist?: boolean;
  /**
   * Currency symbol
   */
  currencySymbol?: string;
  /**
   * Product description (optional)
   */
  description?: string;
  /**
   * Card variant
   */
  variant?: 'default' | 'horizontal' | 'minimal' | 'featured';
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Styled components
const StyledProductCard = styled(motion.div)<{ $variant: string }>`
  position: relative;
  display: flex;
  flex-direction: ${({ $variant }) => ($variant === 'horizontal' ? 'row' : 'column')};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.common.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-4px);
    
    .product-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ProductImage = styled.div<{ $variant: string }>`
  position: relative;
  overflow: hidden;
  ${({ $variant }) => 
    $variant === 'horizontal' 
      ? 'width: 40%; height: 100%; min-height: 200px;' 
      : 'width: 100%; padding-top: 100%;'
  }
  
  img {
    position: ${({ $variant }) => ($variant === 'horizontal' ? 'relative' : 'absolute')};
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const BadgesContainer = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProductContent = styled.div<{ $variant: string }>`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  flex: 1;
  ${({ $variant }) => $variant === 'horizontal' && 'width: 60%;'}
`;

const ProductTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin: 0 0 ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.neutral[900]};
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin: 0 0 ${({ theme }) => theme.spacing[3]};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin: ${({ theme }) => theme.spacing[2]} 0;
`;

const Price = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[500]};
  text-decoration: line-through;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ReviewCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[500]};
`;

const ProductActions = styled.div<{ $variant: string }>`
  display: flex;
  ${({ $variant }) => 
    $variant === 'horizontal' 
      ? 'flex-direction: row; justify-content: flex-start; gap: 8px;' 
      : 'flex-direction: row; justify-content: space-between;'
  }
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing[3]};
`;

const ActionButtons = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 2;
`;

const StockStatus = styled.div<{ $inStock: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ $inStock, theme }) => 
    $inStock ? theme.colors.success.main : theme.colors.error.main
  };
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const WishlistButton = styled(motion.button)`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.common.white};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  svg {
    width: 20px;
    height: 20px;
    fill: ${({ theme }) => theme.colors.neutral[400]};
    transition: fill 0.2s ease;
  }
  
  &:hover svg {
    fill: ${({ theme }) => theme.colors.error.main};
  }
  
  &[data-active="true"] svg {
    fill: ${({ theme }) => theme.colors.error.main};
  }
`;

/**
 * ProductCard component displays product information in a visually appealing card format
 * with various customization options and interactive elements.
 */
export const ProductCard = React.forwardRef<
  HTMLDivElement,
  PolymorphicComponentPropsWithRef<'div', ProductCardProps>
>(
  (
    {
      as,
      imageUrl,
      title,
      price,
      originalPrice,
      rating = 0,
      reviewCount = 0,
      badges = [],
      inStock = true,
      onAddToCart,
      onClick,
      onWishlistToggle,
      isInWishlist = false,
      onQuickView,
      showQuickView = true,
      showAddToCart = true,
      showWishlist = true,
      currencySymbol = '$',
      description,
      variant = 'default',
      css,
      children,
      onDrag,
      onDragStart,
      onDragEnd,
      draggable,
      onAnimationStart: htmlOnAnimationStart,
      onAnimationEnd: htmlOnAnimationEnd,
      ...rest
    },
    ref
  ) => {
    const Component = as || 'div';
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
    
    const handleCardClick = (e: React.MouseEvent) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    };
    
    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onAddToCart) {
        onAddToCart();
      }
    };
    
    const handleWishlistToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onWishlistToggle) {
        onWishlistToggle();
      }
    };
    
    const handleQuickView = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onQuickView) {
        onQuickView();
      }
    };
    
    return (
      <StyledProductCard
        ref={ref}
        $variant={variant}
        onClick={handleCardClick}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        {...rest}
      >
        <ProductImage $variant={variant}>
          <img src={imageUrl} alt={title} />
          
          {badges && badges.length > 0 && (
            <BadgesContainer>
              {badges.map((badge, index) => (
                <Badge key={index} variant={badge.variant === 'primary' ? 'solid' : badge.variant === 'secondary' ? 'outline' : 'subtle'}>
                  {badge.text}
                </Badge>
              ))}
              
              {originalPrice && discount > 0 && (
                <Badge variant="solid" color="error">-{discount}%</Badge>
              )}
            </BadgesContainer>
          )}
          
          {showWishlist && (
            <WishlistButton
              onClick={handleWishlistToggle}
              data-active={isInWishlist}
              whileTap={{ scale: 0.9 }}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isInWishlist ? (
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                ) : (
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                )}
              </svg>
            </WishlistButton>
          )}
          
          <ActionButtons className="product-actions">
            {showQuickView && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleQuickView}
                aria-label="Quick view"
              >
                Quick View
              </Button>
            )}
            
            {showAddToCart && inStock && (
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddToCart}
                aria-label="Add to cart"
              >
                Add to Cart
              </Button>
            )}
          </ActionButtons>
        </ProductImage>
        
        <ProductContent $variant={variant}>
          {inStock !== undefined && (
            <StockStatus $inStock={inStock}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </StockStatus>
          )}
          
          <ProductTitle>{title}</ProductTitle>
          
          {description && <ProductDescription>{description}</ProductDescription>}
          
          {rating !== undefined && (
            <RatingContainer>
              <Rating value={rating} size="sm" readOnly />
              {reviewCount > 0 && (
                <ReviewCount>({reviewCount})</ReviewCount>
              )}
            </RatingContainer>
          )}
          
          <PriceContainer>
            <Price>
              {currencySymbol}{price.toFixed(2)}
            </Price>
            {originalPrice && originalPrice > price && (
              <OriginalPrice>
                {currencySymbol}{originalPrice.toFixed(2)}
              </OriginalPrice>
            )}
          </PriceContainer>
          
          {variant === 'horizontal' && (
            <ProductActions $variant={variant}>
              {showAddToCart && (
                <Button
                  size="sm"
                  variant={inStock ? 'primary' : 'secondary'}
                  onClick={handleAddToCart}
                  disabled={!inStock}
                >
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              )}
              
              {showQuickView && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleQuickView}
                >
                  Quick View
                </Button>
              )}
            </ProductActions>
          )}
          
          {children}
        </ProductContent>
      </StyledProductCard>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
