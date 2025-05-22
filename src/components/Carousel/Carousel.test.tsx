import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Carousel } from './Carousel';
import { ThemeProvider } from '../../styles/ThemeProvider';

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

// Mock slides for testing
const slides = [
  <div key="slide1" data-testid="slide-1">Slide 1</div>,
  <div key="slide2" data-testid="slide-2">Slide 2</div>,
  <div key="slide3" data-testid="slide-3">Slide 3</div>
];

describe('Carousel', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Basic rendering tests
  it('renders correctly with default props', () => {
    renderWithTheme(<Carousel>{slides}</Carousel>);
    
    // First slide should be visible
    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
    
    // Navigation dots should be visible (default showDots is true)
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(5); // 3 dots + 2 arrows
  });

  it('renders without dots when showDots is false', () => {
    renderWithTheme(<Carousel showDots={false}>{slides}</Carousel>);
    
    // Only arrow buttons should be visible
    expect(screen.getAllByRole('button').length).toBe(2);
  });

  it('renders without arrows when showArrows is false', () => {
    renderWithTheme(<Carousel showArrows={false}>{slides}</Carousel>);
    
    // Only dot buttons should be visible
    expect(screen.getAllByRole('button').length).toBe(3);
  });

  // Navigation tests
  it('navigates to the next slide when next arrow is clicked', () => {
    renderWithTheme(<Carousel>{slides}</Carousel>);
    
    // First slide should be visible initially
    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
    
    // Click the next arrow
    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    
    // Second slide should now be visible
    expect(screen.getByTestId('slide-2')).toBeInTheDocument();
  });

  it('navigates to the previous slide when previous arrow is clicked', () => {
    renderWithTheme(<Carousel>{slides}</Carousel>);
    
    // Navigate to second slide first
    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    
    // Click the previous arrow
    const prevButton = screen.getByLabelText('Previous slide');
    fireEvent.click(prevButton);
    
    // First slide should now be visible again
    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
  });

  it('navigates to the specific slide when a dot is clicked', () => {
    renderWithTheme(<Carousel>{slides}</Carousel>);
    
    // Click the third dot
    const dots = screen.getAllByRole('button').filter(button => 
      button.getAttribute('aria-label')?.includes('Go to slide')
    );
    fireEvent.click(dots[2]); // Third dot
    
    // Third slide should now be visible
    expect(screen.getByTestId('slide-3')).toBeInTheDocument();
  });

  // Auto-play tests
  it('automatically transitions slides when autoPlay is true', () => {
    renderWithTheme(
      <Carousel autoPlay autoPlayInterval={1000}>
        {slides}
      </Carousel>
    );
    
    // First slide should be visible initially
    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
    
    // Advance timer by autoPlayInterval
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Second slide should now be visible
    expect(screen.getByTestId('slide-2')).toBeInTheDocument();
    
    // Advance timer again
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Third slide should now be visible
    expect(screen.getByTestId('slide-3')).toBeInTheDocument();
  });

  it('calls onSlideChange callback when slide changes', () => {
    const onSlideChange = jest.fn();
    renderWithTheme(
      <Carousel onSlideChange={onSlideChange}>
        {slides}
      </Carousel>
    );
    
    // Click the next arrow
    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    
    // Callback should have been called with index 1
    expect(onSlideChange).toHaveBeenCalledWith(1);
  });
});
