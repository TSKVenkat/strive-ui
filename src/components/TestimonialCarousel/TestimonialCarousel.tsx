import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { CarouselHeadless } from '../CarouselHeadless/CarouselHeadless';
import { UseCarouselOptions } from '../CarouselHeadless/useCarousel';

// Define the testimonial item type
export interface TestimonialItem {
  /**
   * Unique identifier for the testimonial
   */
  id: string | number;
  
  /**
   * The name of the person giving the testimonial
   */
  name: string;
  
  /**
   * The role or title of the person
   */
  role?: string;
  
  /**
   * The company or organization of the person
   */
  company?: string;
  
  /**
   * The testimonial content/quote
   */
  content: string;
  
  /**
   * The rating given by the person (out of 5)
   */
  rating?: number;
  
  /**
   * The avatar/image URL of the person
   */
  avatarUrl?: string;
  
  /**
   * Alt text for the avatar image
   */
  avatarAlt?: string;
  
  /**
   * The date of the testimonial
   */
  date?: string;
  
  /**
   * Whether the testimonial is featured
   */
  featured?: boolean;
  
  /**
   * Optional verification status
   */
  verified?: boolean;
  
  /**
   * Optional social media profiles
   */
  socialProfiles?: {
    platform: string;
    url: string;
    icon?: string;
  }[];
}

// Define the props for the TestimonialCarousel component
export interface TestimonialCarouselProps extends Omit<UseCarouselOptions, 'itemCount'> {
  /**
   * Array of testimonial items to display in the carousel
   */
  testimonials: TestimonialItem[];
  
  /**
   * Whether to show ratings
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
   * Whether to show the date of testimonials
   * @default false
   */
  showDate?: boolean;
  
  /**
   * Whether to show verification badges
   * @default true
   */
  showVerified?: boolean;
  
  /**
   * Whether to show social profiles
   * @default false
   */
  showSocialProfiles?: boolean;
  
  /**
   * Layout style for testimonials
   * @default 'card'
   */
  layout?: 'card' | 'quote' | 'minimal' | 'featured';
  
  /**
   * Custom class name for the component
   */
  className?: string;
}

// Styled components for the TestimonialCarousel
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

const StyledTestimonialCard = styled.div<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  ${({ layout }) => {
    switch (layout) {
      case 'card':
        return `
          background: white;
          border: 1px solid #eaeaea;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          
          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
          }
        `;
      case 'quote':
        return `
          background: #f9f9f9;
          padding: 30px;
          border-left: 4px solid #1976D2;
          
          &:hover {
            background: #f5f5f5;
          }
        `;
      case 'minimal':
        return `
          background: transparent;
          padding: 20px;
        `;
      case 'featured':
        return `
          background: linear-gradient(135deg, #1976D2, #2196F3);
          color: white;
          padding: 30px;
          box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
          
          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(33, 150, 243, 0.4);
          }
        `;
      default:
        return '';
    }
  }}
`;

const StyledQuoteIcon = styled.div<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  font-size: 36px;
  margin-bottom: 15px;
  opacity: 0.2;
  
  ${({ layout }) => {
    switch (layout) {
      case 'featured':
        return `
          color: rgba(255, 255, 255, 0.5);
        `;
      default:
        return `
          color: #1976D2;
        `;
    }
  }}
`;

const StyledContent = styled.blockquote<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  margin: 0 0 20px;
  font-size: 16px;
  line-height: 1.6;
  font-style: italic;
  flex-grow: 1;
  
  ${({ layout }) => {
    switch (layout) {
      case 'featured':
        return `
          color: white;
          font-size: 18px;
        `;
      default:
        return `
          color: #333;
        `;
    }
  }}
`;

const StyledFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: auto;
`;

const StyledAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledPersonInfo = styled.div<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  display: flex;
  flex-direction: column;
  
  ${({ layout }) => {
    if (layout === 'featured') {
      return `
        color: white;
      `;
    }
    return '';
  }}
`;

const StyledName = styled.div<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  font-weight: 600;
  font-size: 16px;
  
  ${({ layout }) => {
    if (layout === 'featured') {
      return `
        color: white;
      `;
    }
    return `
      color: #333;
    `;
  }}
`;

const StyledRole = styled.div<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  font-size: 14px;
  
  ${({ layout }) => {
    if (layout === 'featured') {
      return `
        color: rgba(255, 255, 255, 0.8);
      `;
    }
    return `
      color: #666;
    `;
  }}
`;

const StyledMeta = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 15px;
`;

const StyledDate = styled.div<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  font-size: 12px;
  
  ${({ layout }) => {
    if (layout === 'featured') {
      return `
        color: rgba(255, 255, 255, 0.7);
      `;
    }
    return `
      color: #999;
    `;
  }}
`;

const StyledVerified = styled.div<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  
  ${({ layout }) => {
    if (layout === 'featured') {
      return `
        color: rgba(255, 255, 255, 0.9);
      `;
    }
    return `
      color: #4CAF50;
    `;
  }}
  
  &::before {
    content: '✓';
    display: inline-block;
    margin-right: 4px;
    font-weight: bold;
  }
`;

const StyledRatingContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const StyledStar = styled.span<{ filled: boolean; layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  ${({ filled, layout }) => {
    if (layout === 'featured') {
      return `
        color: ${filled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
      `;
    }
    return `
      color: ${filled ? '#FFC107' : '#E0E0E0'};
    `;
  }}
  font-size: 18px;
  margin-right: 2px;
`;

const StyledSocialProfiles = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const StyledSocialLink = styled.a<{ layout: 'card' | 'quote' | 'minimal' | 'featured' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  ${({ layout }) => {
    if (layout === 'featured') {
      return `
        background: rgba(255, 255, 255, 0.2);
        color: white;
        
        &:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `;
    }
    return `
      background: #f5f5f5;
      color: #666;
      
      &:hover {
        background: #e0e0e0;
        color: #333;
      }
    `;
  }}
`;

const StyledFeaturedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #FFD700;
  color: #333;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
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

// TestimonialCarousel component
export const TestimonialCarousel = forwardRef<HTMLDivElement, TestimonialCarouselProps>(
  ({
    testimonials,
    showRatings = true,
    showArrows = true,
    showDots = true,
    showDate = false,
    showVerified = true,
    showSocialProfiles = false,
    layout = 'card',
    className = '',
    ...carouselProps
  }, ref) => {
    // Render stars for testimonial rating
    const renderStars = (rating: number) => {
      return Array.from({ length: 5 }).map((_, index) => (
        <StyledStar key={index} filled={index < Math.floor(rating)} layout={layout}>
          ★
        </StyledStar>
      ));
    };
    
    // Render social profile links
    const renderSocialProfiles = (profiles?: { platform: string; url: string; icon?: string }[]) => {
      if (!profiles || profiles.length === 0) return null;
      
      return (
        <StyledSocialProfiles>
          {profiles.map((profile, index) => (
            <StyledSocialLink 
              key={index} 
              href={profile.url} 
              target="_blank" 
              rel="noopener noreferrer"
              layout={layout}
              aria-label={`${profile.platform} profile`}
            >
              {profile.icon || profile.platform.charAt(0)}
            </StyledSocialLink>
          ))}
        </StyledSocialProfiles>
      );
    };
    
    return (
      <StyledCarouselRoot
        ref={ref}
        itemCount={testimonials.length}
        className={`strive-testimonial-carousel ${className}`}
        {...carouselProps}
      >
        <StyledCarouselTrack>
          {testimonials.map((testimonial, index) => (
            <StyledCarouselSlide key={testimonial.id} index={index}>
              <StyledTestimonialCard layout={layout}>
                {testimonial.featured && layout !== 'featured' && (
                  <StyledFeaturedBadge>Featured</StyledFeaturedBadge>
                )}
                
                <StyledQuoteIcon layout={layout}>❝</StyledQuoteIcon>
                
                {showRatings && testimonial.rating !== undefined && (
                  <StyledRatingContainer>
                    {renderStars(testimonial.rating)}
                  </StyledRatingContainer>
                )}
                
                <StyledContent layout={layout}>
                  {testimonial.content}
                </StyledContent>
                
                <StyledFooter>
                  {testimonial.avatarUrl && (
                    <StyledAvatar>
                      <StyledImage
                        src={testimonial.avatarUrl}
                        alt={testimonial.avatarAlt || `${testimonial.name}'s avatar`}
                        loading="lazy"
                      />
                    </StyledAvatar>
                  )}
                  
                  <StyledPersonInfo layout={layout}>
                    <StyledName layout={layout}>{testimonial.name}</StyledName>
                    
                    {(testimonial.role || testimonial.company) && (
                      <StyledRole layout={layout}>
                        {testimonial.role}
                        {testimonial.role && testimonial.company && ', '}
                        {testimonial.company}
                      </StyledRole>
                    )}
                    
                    <StyledMeta>
                      {showDate && testimonial.date && (
                        <StyledDate layout={layout}>{testimonial.date}</StyledDate>
                      )}
                      
                      {showVerified && testimonial.verified && (
                        <StyledVerified layout={layout}>Verified</StyledVerified>
                      )}
                    </StyledMeta>
                    
                    {showSocialProfiles && renderSocialProfiles(testimonial.socialProfiles)}
                  </StyledPersonInfo>
                </StyledFooter>
              </StyledTestimonialCard>
            </StyledCarouselSlide>
          ))}
        </StyledCarouselTrack>
        
        {showArrows && (
          <StyledNav>
            <StyledArrowButton as={CarouselHeadless.PrevButton} aria-label="Previous testimonial">
              ←
            </StyledArrowButton>
            <StyledArrowButton as={CarouselHeadless.NextButton} aria-label="Next testimonial">
              →
            </StyledArrowButton>
          </StyledNav>
        )}
        
        {showDots && (
          <StyledDots>
            {Array.from({ length: Math.ceil(testimonials.length / (carouselProps.slidesToScroll || 1)) }).map((_, index) => (
              <StyledDot key={index} index={index} />
            ))}
          </StyledDots>
        )}
      </StyledCarouselRoot>
    );
  }
);

TestimonialCarousel.displayName = 'TestimonialCarousel';

export default TestimonialCarousel;
