import { useState, useCallback, useRef, useEffect } from 'react';
import { useModal, ModalOptions } from '../../Modal/headless/useModal';

export interface LightboxImage {
  /**
   * Source URL of the image
   */
  src: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Optional thumbnail URL
   */
  thumbnail?: string;
  /**
   * Optional caption for the image
   */
  caption?: string;
  /**
   * Optional width of the image
   */
  width?: number;
  /**
   * Optional height of the image
   */
  height?: number;
}

export interface LightboxOptions extends ModalOptions {
  /**
   * Array of images to display in the lightbox
   */
  images?: LightboxImage[];
  /**
   * Initial index of the image to display
   */
  initialIndex?: number;
  /**
   * Whether to enable infinite loop navigation
   */
  infinite?: boolean;
  /**
   * Whether to show navigation controls
   */
  showNavigation?: boolean;
  /**
   * Whether to show thumbnails
   */
  showThumbnails?: boolean;
  /**
   * Whether to show image captions
   */
  showCaptions?: boolean;
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to show the zoom controls
   */
  showZoomControls?: boolean;
  /**
   * Whether to show the fullscreen button
   */
  showFullscreenButton?: boolean;
  /**
   * Whether to show the slideshow button
   */
  showSlideshowButton?: boolean;
  /**
   * Whether to show the download button
   */
  showDownloadButton?: boolean;
  /**
   * Whether to close the lightbox when clicking outside
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to close the lightbox when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Slideshow interval in milliseconds
   */
  slideshowInterval?: number;
  /**
   * Callback when the current image changes
   */
  onImageChange?: (index: number, image: LightboxImage) => void;
  /**
   * Callback when the zoom level changes
   */
  onZoomChange?: (zoom: number) => void;
  /**
   * Callback when entering fullscreen
   */
  onEnterFullscreen?: () => void;
  /**
   * Callback when exiting fullscreen
   */
  onExitFullscreen?: () => void;
  /**
   * Callback when the slideshow starts
   */
  onSlideshowStart?: () => void;
  /**
   * Callback when the slideshow stops
   */
  onSlideshowStop?: () => void;
  /**
   * Callback when an image is downloaded
   */
  onDownload?: (image: LightboxImage) => void;
}

export interface UseLightboxReturn {
  /**
   * Whether the lightbox is open
   */
  isOpen: boolean;
  /**
   * Open the lightbox
   */
  open: () => void;
  /**
   * Close the lightbox
   */
  close: () => void;
  /**
   * Toggle the lightbox
   */
  toggle: () => void;
  /**
   * Array of images
   */
  images: LightboxImage[];
  /**
   * Set the array of images
   */
  setImages: (images: LightboxImage[]) => void;
  /**
   * Add an image to the lightbox
   */
  addImage: (image: LightboxImage) => void;
  /**
   * Remove an image from the lightbox
   */
  removeImage: (index: number) => void;
  /**
   * Current image index
   */
  currentIndex: number;
  /**
   * Current image
   */
  currentImage: LightboxImage | null;
  /**
   * Go to a specific image
   */
  goToImage: (index: number) => void;
  /**
   * Go to the next image
   */
  nextImage: () => void;
  /**
   * Go to the previous image
   */
  prevImage: () => void;
  /**
   * Current zoom level
   */
  zoom: number;
  /**
   * Set the zoom level
   */
  setZoom: (zoom: number) => void;
  /**
   * Zoom in
   */
  zoomIn: () => void;
  /**
   * Zoom out
   */
  zoomOut: () => void;
  /**
   * Reset zoom to 100%
   */
  resetZoom: () => void;
  /**
   * Whether the lightbox is in fullscreen mode
   */
  isFullscreen: boolean;
  /**
   * Enter fullscreen mode
   */
  enterFullscreen: () => void;
  /**
   * Exit fullscreen mode
   */
  exitFullscreen: () => void;
  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen: () => void;
  /**
   * Whether the slideshow is active
   */
  isSlideshowActive: boolean;
  /**
   * Start the slideshow
   */
  startSlideshow: () => void;
  /**
   * Stop the slideshow
   */
  stopSlideshow: () => void;
  /**
   * Toggle the slideshow
   */
  toggleSlideshow: () => void;
  /**
   * Download the current image
   */
  downloadImage: () => void;
  /**
   * Reference to the container element
   */
  containerRef: React.RefObject<HTMLDivElement>;
  /**
   * Reference to the image element
   */
  imageRef: React.RefObject<HTMLImageElement>;
  /**
   * Get props for the container element
   */
  getContainerProps: () => {
    ref: React.RefObject<HTMLDivElement>;
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
  };
  /**
   * Get props for the backdrop element
   */
  getBackdropProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the content element
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the trigger element
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-haspopup': string;
    'aria-expanded': boolean;
  };
  /**
   * Get props for the close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the image element
   */
  getImageProps: () => {
    ref: React.RefObject<HTMLImageElement>;
    src: string;
    alt: string;
    style: {
      transform: string;
    };
  };
  /**
   * Get props for the next button
   */
  getNextButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    disabled: boolean;
  };
  /**
   * Get props for the previous button
   */
  getPrevButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    disabled: boolean;
  };
  /**
   * Get props for the zoom in button
   */
  getZoomInButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the zoom out button
   */
  getZoomOutButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the zoom reset button
   */
  getZoomResetButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the fullscreen button
   */
  getFullscreenButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
  /**
   * Get props for the slideshow button
   */
  getSlideshowButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
  /**
   * Get props for the download button
   */
  getDownloadButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the thumbnail element
   */
  getThumbnailProps: (index: number) => {
    src: string;
    alt: string;
    onClick: () => void;
    'aria-label': string;
    'aria-current': boolean;
  };
}

/**
 * Hook for creating a lightbox
 */
export function useLightbox(options: LightboxOptions = {}): UseLightboxReturn {
  // Destructure options with defaults
  const {
    images: initialImages = [],
    initialIndex = 0,
    infinite = true,
    showNavigation = true,
    showThumbnails = true,
    showCaptions = true,
    showCloseButton = true,
    showZoomControls = true,
    showFullscreenButton = true,
    showSlideshowButton = true,
    showDownloadButton = true,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    slideshowInterval = 3000,
    onImageChange,
    onZoomChange,
    onEnterFullscreen,
    onExitFullscreen,
    onSlideshowStart,
    onSlideshowStop,
    onDownload,
    ...modalOptions
  } = options;

  // Use modal hook for basic modal functionality
  const modalProps = useModal({
    ...modalOptions,
    closeOnOutsideClick,
    closeOnEscape,
  });

  // State for images
  const [images, setImages] = useState<LightboxImage[]>(initialImages);
  
  // State for current image index
  const [currentIndex, setCurrentIndex] = useState<number>(
    Math.min(initialIndex, initialImages.length - 1)
  );
  
  // State for zoom level
  const [zoom, setZoom] = useState<number>(1);
  
  // State for fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  // State for slideshow
  const [isSlideshowActive, setIsSlideshowActive] = useState<boolean>(false);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const slideshowTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Current image
  const currentImage = images.length > 0 && currentIndex >= 0 && currentIndex < images.length
    ? images[currentIndex]
    : null;

  // Handle zoom change
  const handleZoomChange = useCallback((newZoom: number) => {
    const clampedZoom = Math.max(0.1, Math.min(3, newZoom));
    setZoom(clampedZoom);
    onZoomChange?.(clampedZoom);
  }, [onZoomChange]);

  // Zoom in
  const zoomIn = useCallback(() => {
    handleZoomChange(zoom + 0.1);
  }, [zoom, handleZoomChange]);

  // Zoom out
  const zoomOut = useCallback(() => {
    handleZoomChange(zoom - 0.1);
  }, [zoom, handleZoomChange]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    handleZoomChange(1);
  }, [handleZoomChange]);

  // Add an image
  const addImage = useCallback((image: LightboxImage) => {
    setImages(prevImages => [...prevImages, image]);
  }, []);

  // Remove an image
  const removeImage = useCallback((index: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  // Go to a specific image
  const goToImage = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
      resetZoom();
      onImageChange?.(index, images[index]);
    }
  }, [images, onImageChange, resetZoom]);

  // Go to the next image
  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    
    if (currentIndex < images.length - 1) {
      goToImage(currentIndex + 1);
    } else if (infinite) {
      goToImage(0);
    }
  }, [currentIndex, images.length, infinite, goToImage]);

  // Go to the previous image
  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    
    if (currentIndex > 0) {
      goToImage(currentIndex - 1);
    } else if (infinite) {
      goToImage(images.length - 1);
    }
  }, [currentIndex, images.length, infinite, goToImage]);

  // Enter fullscreen
  const enterFullscreen = useCallback(() => {
    const element = containerRef.current;
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
      onEnterFullscreen?.();
    }
  }, [onEnterFullscreen]);

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
      onExitFullscreen?.();
    }
  }, [onExitFullscreen]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Start slideshow
  const startSlideshow = useCallback(() => {
    if (slideshowTimerRef.current) {
      clearInterval(slideshowTimerRef.current);
    }
    
    slideshowTimerRef.current = setInterval(() => {
      nextImage();
    }, slideshowInterval);
    
    setIsSlideshowActive(true);
    onSlideshowStart?.();
  }, [nextImage, slideshowInterval, onSlideshowStart]);

  // Stop slideshow
  const stopSlideshow = useCallback(() => {
    if (slideshowTimerRef.current) {
      clearInterval(slideshowTimerRef.current);
      slideshowTimerRef.current = null;
    }
    
    setIsSlideshowActive(false);
    onSlideshowStop?.();
  }, [onSlideshowStop]);

  // Toggle slideshow
  const toggleSlideshow = useCallback(() => {
    if (isSlideshowActive) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  }, [isSlideshowActive, startSlideshow, stopSlideshow]);

  // Download image
  const downloadImage = useCallback(() => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage.src;
      link.download = currentImage.src.split('/').pop() || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      onDownload?.(currentImage);
    }
  }, [currentImage, onDownload]);

  // Handle fullscreen change
  const handleFullscreenChange = useCallback(() => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );
    
    setIsFullscreen(isCurrentlyFullscreen);
    
    if (!isCurrentlyFullscreen) {
      onExitFullscreen?.();
    }
  }, [onExitFullscreen]);

  // Add fullscreen change event listener
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);

  // Clean up slideshow on unmount
  useEffect(() => {
    return () => {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
      }
    };
  }, []);

  // Reset slideshow when images change
  useEffect(() => {
    if (isSlideshowActive) {
      stopSlideshow();
      startSlideshow();
    }
  }, [images, isSlideshowActive, stopSlideshow, startSlideshow]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalProps.isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case '+':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'p':
          toggleSlideshow();
          break;
        case 'd':
          downloadImage();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    modalProps.isOpen,
    prevImage,
    nextImage,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleFullscreen,
    toggleSlideshow,
    downloadImage
  ]);

  // Get container props
  const getContainerProps = useCallback(() => {
    return {
      ref: containerRef,
      role: 'dialog',
      'aria-modal': true,
      tabIndex: -1,
    };
  }, []);

  // Get backdrop props
  const getBackdropProps = useCallback(() => {
    return {
      onClick: (e: React.MouseEvent) => {
        if (closeOnOutsideClick) {
          e.stopPropagation();
          modalProps.close();
        }
      },
    };
  }, [closeOnOutsideClick, modalProps.close]);

  // Get content props
  const getContentProps = useCallback(() => {
    return {
      onClick: (e: React.MouseEvent) => {
        // Prevent clicks on the content from closing the modal
        e.stopPropagation();
      },
    };
  }, []);

  // Get trigger props
  const getTriggerProps = useCallback(() => {
    return {
      onClick: modalProps.open,
      'aria-label': 'Open lightbox',
      'aria-haspopup': 'dialog',
      'aria-expanded': modalProps.isOpen,
    };
  }, [modalProps.open, modalProps.isOpen]);

  // Get close button props
  const getCloseButtonProps = useCallback(() => {
    return {
      onClick: modalProps.close,
      'aria-label': 'Close lightbox',
    };
  }, [modalProps.close]);

  // Get image props
  const getImageProps = useCallback(() => {
    return {
      ref: imageRef,
      src: currentImage?.src || '',
      alt: currentImage?.alt || '',
      style: {
        transform: `scale(${zoom})`,
      },
    };
  }, [currentImage, zoom]);

  // Get next button props
  const getNextButtonProps = useCallback(() => {
    const isDisabled = !infinite && currentIndex === images.length - 1;
    
    return {
      onClick: nextImage,
      'aria-label': 'Next image',
      disabled: isDisabled,
    };
  }, [infinite, currentIndex, images.length, nextImage]);

  // Get previous button props
  const getPrevButtonProps = useCallback(() => {
    const isDisabled = !infinite && currentIndex === 0;
    
    return {
      onClick: prevImage,
      'aria-label': 'Previous image',
      disabled: isDisabled,
    };
  }, [infinite, currentIndex, prevImage]);

  // Get zoom in button props
  const getZoomInButtonProps = useCallback(() => {
    return {
      onClick: zoomIn,
      'aria-label': 'Zoom in',
    };
  }, [zoomIn]);

  // Get zoom out button props
  const getZoomOutButtonProps = useCallback(() => {
    return {
      onClick: zoomOut,
      'aria-label': 'Zoom out',
    };
  }, [zoomOut]);

  // Get zoom reset button props
  const getZoomResetButtonProps = useCallback(() => {
    return {
      onClick: resetZoom,
      'aria-label': 'Reset zoom',
    };
  }, [resetZoom]);

  // Get fullscreen button props
  const getFullscreenButtonProps = useCallback(() => {
    return {
      onClick: toggleFullscreen,
      'aria-label': isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen',
      'aria-pressed': isFullscreen,
    };
  }, [toggleFullscreen, isFullscreen]);

  // Get slideshow button props
  const getSlideshowButtonProps = useCallback(() => {
    return {
      onClick: toggleSlideshow,
      'aria-label': isSlideshowActive ? 'Pause slideshow' : 'Start slideshow',
      'aria-pressed': isSlideshowActive,
    };
  }, [toggleSlideshow, isSlideshowActive]);

  // Get download button props
  const getDownloadButtonProps = useCallback(() => {
    return {
      onClick: downloadImage,
      'aria-label': 'Download image',
    };
  }, [downloadImage]);

  // Get thumbnail props
  const getThumbnailProps = useCallback((index: number) => {
    const image = images[index];
    
    return {
      src: image.thumbnail || image.src,
      alt: image.alt || '',
      onClick: () => goToImage(index),
      'aria-label': `View image ${index + 1}`,
      'aria-current': index === currentIndex,
    };
  }, [images, currentIndex, goToImage]);

  return {
    isOpen: modalProps.isOpen,
    open: modalProps.open,
    close: modalProps.close,
    toggle: modalProps.toggle,
    images,
    setImages,
    addImage,
    removeImage,
    currentIndex,
    currentImage,
    goToImage,
    nextImage,
    prevImage,
    zoom,
    setZoom: handleZoomChange,
    zoomIn,
    zoomOut,
    resetZoom,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isSlideshowActive,
    startSlideshow,
    stopSlideshow,
    toggleSlideshow,
    downloadImage,
    containerRef,
    imageRef,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
    getImageProps,
    getNextButtonProps,
    getPrevButtonProps,
    getZoomInButtonProps,
    getZoomOutButtonProps,
    getZoomResetButtonProps,
    getFullscreenButtonProps,
    getSlideshowButtonProps,
    getDownloadButtonProps,
    getThumbnailProps,
  };
}

export default useLightbox;
