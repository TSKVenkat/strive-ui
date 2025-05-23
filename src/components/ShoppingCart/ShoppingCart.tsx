import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '../Box';
import { Button } from '../Button';
import { Icon } from '../Icon';

export interface CartItem {
  /**
   * Unique identifier for the cart item
   */
  id: string | number;
  /**
   * Product name
   */
  name: string;
  /**
   * Product price
   */
  price: number;
  /**
   * Quantity of the product
   */
  quantity: number;
  /**
   * Product image URL
   */
  imageUrl: string;
  /**
   * Product variant information (e.g., size, color)
   */
  variant?: string;
  /**
   * Whether the item is available
   */
  inStock?: boolean;
  /**
   * Original price (for showing discounts)
   */
  originalPrice?: number;
  /**
   * Additional metadata
   */
  metadata?: Record<string, any>;
}

export interface ShoppingCartProps {
  /**
   * Array of cart items
   */
  items: CartItem[];
  /**
   * Function to handle removing an item from the cart
   */
  onRemoveItem?: (itemId: string | number) => void;
  /**
   * Function to handle updating item quantity
   */
  onUpdateQuantity?: (itemId: string | number, quantity: number) => void;
  /**
   * Function to handle clearing the cart
   */
  onClearCart?: () => void;
  /**
   * Function to handle checkout
   */
  onCheckout?: (items: CartItem[]) => void;
  /**
   * Currency symbol
   */
  currencySymbol?: string;
  /**
   * Whether to show the cart summary
   */
  showSummary?: boolean;
  /**
   * Tax rate (decimal)
   */
  taxRate?: number;
  /**
   * Shipping cost
   */
  shippingCost?: number;
  /**
   * Discount amount
   */
  discountAmount?: number;
  /**
   * Discount code
   */
  discountCode?: string;
  /**
   * Function to handle applying a discount code
   */
  onApplyDiscount?: (code: string) => void;
  /**
   * Whether the cart is in a loading state
   */
  loading?: boolean;
  /**
   * Custom empty cart component
   */
  emptyCartComponent?: React.ReactNode;
  /**
   * Whether to show quantity controls
   */
  showQuantityControls?: boolean;
  /**
   * Maximum quantity allowed per item
   */
  maxQuantity?: number;
  /**
   * Whether to show product images
   */
  showImages?: boolean;
  /**
   * Cart variant
   */
  variant?: 'default' | 'compact' | 'detailed';
  /**
   * Additional CSS styles
   */
  css?: any;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

const CartContainer = styled(Box)<{ $variant: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.common.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const CartHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0;
`;

const CartItemCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.neutral[800]};
  }
`;

const CartItemsContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[2]};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.neutral[400]};
    border-radius: 3px;
  }
`;

const CartItem = styled(motion.div)<{ $variant: string }>`
  display: flex;
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neutral[100]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const CartItemImage = styled.div<{ $variant: string }>`
  width: ${({ $variant }) => ($variant === 'compact' ? '50px' : '80px')};
  height: ${({ $variant }) => ($variant === 'compact' ? '50px' : '80px')};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-right: ${({ theme }) => theme.spacing[3]};
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CartItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CartItemName = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[1]};
`;

const CartItemVariant = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.neutral[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const CartItemPrice = styled.div<{ $hasDiscount?: boolean }>`
  display: flex;
  align-items: center;
  margin-top: auto;
`;

const Price = styled.span<{ $isOriginal?: boolean }>`
  font-size: ${({ theme, $isOriginal }) => 
    $isOriginal 
      ? theme.typography.fontSize.xs 
      : theme.typography.fontSize.sm
  };
  font-weight: ${({ theme, $isOriginal }) => 
    $isOriginal 
      ? theme.typography.fontWeight.regular 
      : theme.typography.fontWeight.semibold
  };
  color: ${({ theme, $isOriginal }) => 
    $isOriginal 
      ? theme.colors.neutral[500] 
      : theme.colors.primary.main
  };
  text-decoration: ${({ $isOriginal }) => 
    $isOriginal ? 'line-through' : 'none'
  };
  margin-right: ${({ theme, $isOriginal }) => 
    $isOriginal ? theme.spacing[1] : '0'
  };
`;

const CartItemActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[700]};
  background-color: ${({ theme }) => theme.colors.neutral[100]};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[200]};
  }
  
  &:disabled {
    color: ${({ theme }) => theme.colors.neutral[400]};
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  width: 36px;
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[900]};
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[1]};
  margin-left: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.neutral[500]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.error.main};
  }
`;

const CartSummary = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  background-color: ${({ theme }) => theme.colors.neutral[50]};
`;

const SummaryRow = styled.div<{ $isFinal?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme, $isFinal }) => 
    $isFinal 
      ? theme.typography.fontSize.md 
      : theme.typography.fontSize.sm
  };
  font-weight: ${({ theme, $isFinal }) => 
    $isFinal 
      ? theme.typography.fontWeight.bold 
      : theme.typography.fontWeight.regular
  };
  color: ${({ theme, $isFinal }) => 
    $isFinal 
      ? theme.colors.neutral[900] 
      : theme.colors.neutral[700]
  };
  
  &:last-child {
    margin-bottom: 0;
    padding-top: ${({ $isFinal, theme }) => 
      $isFinal ? theme.spacing[2] : '0'
    };
    border-top: ${({ $isFinal, theme }) => 
      $isFinal ? `1px solid ${theme.colors.neutral[200]}` : 'none'
    };
  }
`;

const DiscountForm = styled.form`
  display: flex;
  margin: ${({ theme }) => theme.spacing[3]} 0;
`;

const DiscountInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md} 0 0 ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ApplyButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.common.white};
  border: none;
  border-radius: 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.neutral[400]};
    cursor: not-allowed;
  }
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const EmptyCartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const EmptyCartIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.neutral[300]};
`;

const EmptyCartText = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.neutral[700]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]};
`;

const EmptyCartSubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin: 0 0 ${({ theme }) => theme.spacing[4]};
`;

/**
 * ShoppingCart component displays a list of items in a cart with various
 * customization options and interactive features.
 */
export const ShoppingCart: React.FC<ShoppingCartProps> = ({
  items = [],
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onCheckout,
  currencySymbol = '$',
  showSummary = true,
  taxRate = 0,
  shippingCost = 0,
  discountAmount = 0,
  discountCode = '',
  onApplyDiscount,
  loading = false,
  emptyCartComponent,
  showQuantityControls = true,
  maxQuantity = 10,
  showImages = true,
  variant = 'default',
  css,
  children
}) => {
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  
  // Calculate cart totals
  useEffect(() => {
    const newSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newTax = newSubtotal * taxRate;
    const newTotal = newSubtotal + newTax + shippingCost - discountAmount;
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [items, taxRate, shippingCost, discountAmount]);
  
  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity && onUpdateQuantity) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };
  
  const handleRemoveItem = (itemId: string | number) => {
    if (onRemoveItem) {
      onRemoveItem(itemId);
    }
  };
  
  const handleClearCart = () => {
    if (onClearCart) {
      onClearCart();
    }
  };
  
  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout(items);
    }
  };
  
  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (onApplyDiscount && discountCodeInput) {
      onApplyDiscount(discountCodeInput);
      setDiscountCodeInput('');
    }
  };
  
  // Empty cart state
  if (items.length === 0 && !loading) {
    return emptyCartComponent || (
      <CartContainer $variant={variant} css={css}>
        <CartHeader>
          <CartTitle>Shopping Cart</CartTitle>
        </CartHeader>
        <EmptyCartContainer>
          <EmptyCartIcon>🛒</EmptyCartIcon>
          <EmptyCartText>Your cart is empty</EmptyCartText>
          <EmptyCartSubtext>Add items to your cart to see them here</EmptyCartSubtext>
          <Button variant="primary">Continue Shopping</Button>
        </EmptyCartContainer>
      </CartContainer>
    );
  }
  
  return (
    <CartContainer $variant={variant} css={css}>
      <CartHeader>
        <div>
          <CartTitle>Shopping Cart</CartTitle>
          <CartItemCount>{items.length} {items.length === 1 ? 'item' : 'items'}</CartItemCount>
        </div>
        {items.length > 0 && (
          <ClearButton onClick={handleClearCart}>Clear Cart</ClearButton>
        )}
      </CartHeader>
      
      <CartItemsContainer>
        <AnimatePresence>
          {items.map((item) => (
            <CartItem
              key={item.id}
              $variant={variant}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {showImages && (
                <CartItemImage $variant={variant}>
                  <img src={item.imageUrl} alt={item.name} />
                </CartItemImage>
              )}
              
              <CartItemInfo>
                <CartItemName>{item.name}</CartItemName>
                {item.variant && (
                  <CartItemVariant>{item.variant}</CartItemVariant>
                )}
                
                <CartItemPrice $hasDiscount={!!item.originalPrice}>
                  {item.originalPrice && (
                    <Price $isOriginal>
                      {currencySymbol}{(item.originalPrice * item.quantity).toFixed(2)}
                    </Price>
                  )}
                  <Price>
                    {currencySymbol}{(item.price * item.quantity).toFixed(2)}
                  </Price>
                </CartItemPrice>
              </CartItemInfo>
              
              <CartItemActions>
                {showQuantityControls && (
                  <QuantityControls>
                    <QuantityButton
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </QuantityButton>
                    <QuantityValue>{item.quantity}</QuantityValue>
                    <QuantityButton
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.quantity >= maxQuantity || !item.inStock}
                      aria-label="Increase quantity"
                    >
                      +
                    </QuantityButton>
                  </QuantityControls>
                )}
                
                <RemoveButton
                  onClick={() => handleRemoveItem(item.id)}
                  aria-label="Remove item"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                  </svg>
                </RemoveButton>
              </CartItemActions>
            </CartItem>
          ))}
        </AnimatePresence>
      </CartItemsContainer>
      
      {showSummary && (
        <CartSummary>
          {onApplyDiscount && (
            <DiscountForm onSubmit={handleApplyDiscount}>
              <DiscountInput
                type="text"
                placeholder="Discount code"
                value={discountCodeInput}
                onChange={(e) => setDiscountCodeInput(e.target.value)}
              />
              <ApplyButton type="submit" disabled={!discountCodeInput}>
                Apply
              </ApplyButton>
            </DiscountForm>
          )}
          
          {discountCode && (
            <SummaryRow>
              <span>Discount ({discountCode})</span>
              <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
            </SummaryRow>
          )}
          
          <SummaryRow>
            <span>Subtotal</span>
            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
          </SummaryRow>
          
          {taxRate > 0 && (
            <SummaryRow>
              <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
              <span>{currencySymbol}{tax.toFixed(2)}</span>
            </SummaryRow>
          )}
          
          {shippingCost > 0 && (
            <SummaryRow>
              <span>Shipping</span>
              <span>{currencySymbol}{shippingCost.toFixed(2)}</span>
            </SummaryRow>
          )}
          
          <SummaryRow $isFinal>
            <span>Total</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </SummaryRow>
          
          <CheckoutButton
            variant="primary"
            size="lg"
            onClick={handleCheckout}
            disabled={items.length === 0 || loading}
          >
            {loading ? 'Processing...' : 'Checkout'}
          </CheckoutButton>
        </CartSummary>
      )}
      
      {children}
    </CartContainer>
  );
};

export default ShoppingCart;
