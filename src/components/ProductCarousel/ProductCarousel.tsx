import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { CarouselHeadless } from '../CarouselHeadless/CarouselHeadless';
import { UseCarouselOptions } from '../CarouselHeadless/useCarousel';

// Define the product item type
export interface ProductItem {
  /**
   * Unique identifier for the product
   */
  id: string | number;
  
  /**
   * The name of the product
   */
  name: string;
  
  /**
   * The price of the product
   */
  price: number | string;
  
  /**
   * The original price (for showing discounts)
   */
  originalPrice?: number | string;
  
  /**
   * The image URL of the product
   */
  imageUrl: string;
  
  /**
   * Alt text for the product image
   */
  imageAlt: string;
  
  /**
   * Short description of the product
   */
  description?: string;
  
  /**
   * Rating of the product (out of 5)
   */
  rating?: number;
  
  /**
   * Number of reviews for the product
   */
  reviewCount?: number;
  
  /**
   * Whether the product is in stock
   */
  inStock?: boolean;
  
  /**
   * Tags or categories for the product
   */
  tags?: string[];
  
  /**
   * URL to the product detail page
   */
  url?: string;
  
  /**
   * Whether the product is featured
   */
  featured?: boolean;
  
  /**
   * Whether the product is new
   */
  isNew?: boolean;
  
  /**
   * Whether the product is on sale
   */
  onSale?: boolean;
}

// Define the props for the ProductCarousel component
export interface ProductCarouselProps extends Omit<UseCarouselOptions, 'itemCount'> {
  /**
   * Array of product items to display in the carousel
   */
  products: ProductItem[];
  
  /**
   * Currency symbol to display with prices
   * @default '$'
   */
  currencySymbol?: string;
  
  /**
   * Whether to show product ratings
   * @default true
   */
  showRatings?: boolean;
  
  /**
   * Whether to show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  
  /**
   * Whether to show navigation dots
   * @default true
   */
  showDots?: boolean;
  
  /**
   * Whether to show "Add to Cart" button
   * @default true
   */
  showAddToCart?: boolean;
  
  /**
   * Whether to show "Quick View" button
   * @default true
   */
  showQuickView?: boolean;
  
  /**
   * Whether to show product badges (new, sale, etc.)
   * @default true
   */
  showBadges?: boolean;
  
  /**
   * Callback when "Add to Cart" is clicked
   */
  onAddToCart?: (product: ProductItem) => void;
  
  /**
   * Callback when "Quick View" is clicked
   */
  onQuickView?: (product: ProductItem) => void;
  
  /**
   * Callback when a product is clicked
   */
  onProductClick?: (product: ProductItem) => void;
  
  /**
   * Custom class name for the component
   */
  className?: string;
}

// Styled components for the ProductCarousel
const StyledCarouselRoot = styled(CarouselHeadless.Root)`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const StyledCarouselTrack = styled(CarouselHeadless.Track)`
  display: flex;
  transition: transform 0.3s ease;
`;

const StyledCarouselSlide = styled(CarouselHeadless.Slide)`
  flex: 0 0 100%;
  position: relative;
  padding: 15px;
  box-sizing: border-box;
`;

const StyledProductCard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StyledImageContainer = styled.div`
  position: relative;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  overflow: hidden;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${StyledProductCard}:hover & {
    transform: scale(1.05);
  }
`;

const StyledBadgeContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  z-index: 1;
`;

const StyledBadge = styled.span<{ variant: 'new' | 'sale' | 'featured' }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  
  ${({ variant }) => {
    switch (variant) {
      case 'new':
        return `
          background-color: #4CAF50;
          color: white;
        `;
      case 'sale':
        return `
          background-color: #F44336;
          color: white;
        `;
      case 'featured':
        return `
          background-color: #2196F3;
          color: white;
        `;
      default:
        return '';
    }
  }}
`;

const StyledProductInfo = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const StyledProductName = styled.h3`
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const StyledProductDescription = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StyledPriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const StyledPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #333;
`;

const StyledOriginalPrice = styled.span`
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
`;

const StyledRatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
`;

const StyledStars = styled.div`
  display: flex;
`;

const StyledStar = styled.span<{ filled: boolean }>`
  color: ${({ filled }) => (filled ? '#FFC107' : '#E0E0E0')};
  font-size: 14px;
`;

const StyledReviewCount = styled.span`
  font-size: 12px;
  color: #666;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: auto;
`;

const StyledButton = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex: 1;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #1976D2;
          color: white;
          
          &:hover {
            background-color: #1565C0;
          }
          
          &:disabled {
            background-color: #BDBDBD;
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background-color: #F5F5F5;
          color: #333;
          
          &:hover {
            background-color: #E0E0E0;
          }
        `;
      default:
        return '';
    }
  }}
`;

const StyledStockStatus = styled.div<{ inStock: boolean }>`
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${({ inStock }) => (inStock ? '#4CAF50' : '#F44336')};
`;

const StyledNav = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
  padding: 0 10px;
  box-sizing: border-box;
`;

const StyledArrowButton = styled.button`
  background: white;
  color: #333;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #f5f5f5;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StyledDots = styled(CarouselHeadless.Dots)`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
`;

const StyledDot = styled(CarouselHeadless.Dot)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #BDBDBD;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.active {
    background: #1976D2;
    transform: scale(1.2);
  }
  
  &:hover {
    background: #9E9E9E;
  }
`;

// ProductCarousel component
export const ProductCarousel = forwardRef<HTMLDivElement, ProductCarouselProps>(
  ({
    products,
    currencySymbol = '$',
    showRatings = true,
    showArrows = true,
    showDots = true,
    showAddToCart = true,
    showQuickView = true,
    showBadges = true,
    onAddToCart,
    onQuickView,
    onProductClick,
    className = '',
    ...carouselProps
  }, ref) => {
    // Render stars for product rating
    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }).map((_, index) => (
        <StyledStar key={index} filled={index < Math.floor(rating)}>
          ★
        </StyledStar>
      ));
    };
    
    // Handle add to cart button click
    const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
      e.preventDefault();
      e.stopPropagation();
      if (onAddToCart) {
        onAddToCart(product);
      }
    };
    
    // Handle quick view button click
    const handleQuickView = (e: React.MouseEvent, product: ProductItem) => {
      e.preventDefault();
      e.stopPropagation();
      if (onQuickView) {
        onQuickView(product);
      }
    };
    
    // Handle product card click
    const handleProductClick = (product: ProductItem) => {
      if (onProductClick) {
        onProductClick(product);
      }
    };
    
    return (
      <StyledCarouselRoot
        ref={ref}
        itemCount={products.length}
        className={`strive-product-carousel ${className}`}
        {...carouselProps}
      >
        <StyledCarouselTrack>
          {products.map((product, index) => (
            <StyledCarouselSlide key={product.id} index={index}>
              <StyledProductCard 
                onClick={() => handleProductClick(product)}
                role="button"
                tabIndex={0}
              >
                <StyledImageContainer>
                  <StyledImage
                    src={product.imageUrl}
                    alt={product.imageAlt}
                    loading="lazy"
                  />
                  
                  {showBadges && (
                    <StyledBadgeContainer>
                      {product.isNew && (
                        <StyledBadge variant="new">New</StyledBadge>
                      )}
                      {product.onSale && (
                        <StyledBadge variant="sale">Sale</StyledBadge>
                      )}
                      {product.featured && (
                        <StyledBadge variant="featured">Featured</StyledBadge>
                      )}
                    </StyledBadgeContainer>
                  )}
                </StyledImageContainer>
                
                <StyledProductInfo>
                  <StyledProductName>{product.name}</StyledProductName>
                  
                  {product.description && (
                    <StyledProductDescription>
                      {product.description}
                    </StyledProductDescription>
                  )}
                  
                  <StyledPriceContainer>
                    <StyledPrice>
                      {currencySymbol}{typeof product.price === 'number' 
                        ? product.price.toFixed(2) 
                        : product.price}
                    </StyledPrice>
                    
                    {product.originalPrice && (
                      <StyledOriginalPrice>
                        {currencySymbol}{typeof product.originalPrice === 'number' 
                          ? product.originalPrice.toFixed(2) 
                          : product.originalPrice}
                      </StyledOriginalPrice>
                    )}
                  </StyledPriceContainer>
                  
                  {showRatings && product.rating !== undefined && (
                    <StyledRatingContainer>
                      <StyledStars>
                        {renderStars(product.rating)}
                      </StyledStars>
                      
                      {product.reviewCount !== undefined && (
                        <StyledReviewCount>
                          ({product.reviewCount})
                        </StyledReviewCount>
                      )}
                    </StyledRatingContainer>
                  )}
                  
                  <StyledStockStatus inStock={product.inStock !== false}>
                    {product.inStock !== false ? 'In Stock' : 'Out of Stock'}
                  </StyledStockStatus>
                  
                  <StyledButtonContainer>
                    {showAddToCart && (
                      <StyledButton
                        variant="primary"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={product.inStock === false}
                      >
                        Add to Cart
                      </StyledButton>
                    )}
                    
                    {showQuickView && (
                      <StyledButton
                        variant="secondary"
                        onClick={(e) => handleQuickView(e, product)}
                      >
                        Quick View
                      </StyledButton>
                    )}
                  </StyledButtonContainer>
                </StyledProductInfo>
              </StyledProductCard>
            </StyledCarouselSlide>
          ))}
        </StyledCarouselTrack>
        
        {showArrows && (
          <StyledNav>
            <StyledArrowButton as={CarouselHeadless.PrevButton} aria-label="Previous product">
              ←
            </StyledArrowButton>
            <StyledArrowButton as={CarouselHeadless.NextButton} aria-label="Next product">
              →
            </StyledArrowButton>
          </StyledNav>
        )}
        
        {showDots && (
          <StyledDots>
            {Array.from({ length: Math.ceil(products.length / (carouselProps.slidesToScroll || 1)) }).map((_, index) => (
              <StyledDot key={index} index={index} />
            ))}
          </StyledDots>
        )}
      </StyledCarouselRoot>
    );
  }
);

ProductCarousel.displayName = 'ProductCarousel';

export default ProductCarousel;
