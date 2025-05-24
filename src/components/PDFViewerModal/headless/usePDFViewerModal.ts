import { useState, useCallback, useRef, useEffect } from 'react';
import { useModal, ModalOptions } from '../../Modal/headless/useModal';

export interface PDFViewerModalOptions extends ModalOptions {
  /**
   * Source of the PDF document
   */
  src?: string;
  /**
   * Initial page number
   */
  initialPage?: number;
  /**
   * Initial zoom level
   */
  initialZoom?: number;
  /**
   * Whether to show the toolbar
   */
  showToolbar?: boolean;
  /**
   * Whether to show the sidebar
   */
  showSidebar?: boolean;
  /**
   * Whether to show the navigation buttons
   */
  showNavigation?: boolean;
  /**
   * Whether to show the zoom controls
   */
  showZoomControls?: boolean;
  /**
   * Whether to show the page controls
   */
  showPageControls?: boolean;
  /**
   * Whether to show the download button
   */
  showDownloadButton?: boolean;
  /**
   * Whether to show the print button
   */
  showPrintButton?: boolean;
  /**
   * Whether to show the fullscreen button
   */
  showFullscreenButton?: boolean;
  /**
   * Whether to show the rotate buttons
   */
  showRotateButtons?: boolean;
  /**
   * Whether to show the search box
   */
  showSearchBox?: boolean;
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to close the modal when clicking outside
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to close the modal when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Callback when the page changes
   */
  onPageChange?: (page: number) => void;
  /**
   * Callback when the zoom changes
   */
  onZoomChange?: (zoom: number) => void;
  /**
   * Callback when the document is loaded
   */
  onDocumentLoad?: (numPages: number) => void;
  /**
   * Callback when the document fails to load
   */
  onDocumentLoadError?: (error: Error) => void;
  /**
   * Callback when the document is downloaded
   */
  onDownload?: () => void;
  /**
   * Callback when the document is printed
   */
  onPrint?: () => void;
  /**
   * Callback when the document enters fullscreen
   */
  onEnterFullscreen?: () => void;
  /**
   * Callback when the document exits fullscreen
   */
  onExitFullscreen?: () => void;
  /**
   * Callback when the document is rotated
   */
  onRotate?: (rotation: number) => void;
  /**
   * Callback when the document is searched
   */
  onSearch?: (query: string) => void;
}

export interface UsePDFViewerModalReturn {
  /**
   * Whether the PDF viewer modal is open
   */
  isOpen: boolean;
  /**
   * Open the PDF viewer modal
   */
  open: () => void;
  /**
   * Close the PDF viewer modal
   */
  close: () => void;
  /**
   * Toggle the PDF viewer modal
   */
  toggle: () => void;
  /**
   * Source of the PDF document
   */
  src: string;
  /**
   * Set the source of the PDF document
   */
  setSrc: (src: string) => void;
  /**
   * Current page number
   */
  currentPage: number;
  /**
   * Total number of pages
   */
  numPages: number;
  /**
   * Go to a specific page
   */
  goToPage: (page: number) => void;
  /**
   * Go to the next page
   */
  nextPage: () => void;
  /**
   * Go to the previous page
   */
  prevPage: () => void;
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
   * Current rotation in degrees
   */
  rotation: number;
  /**
   * Set the rotation
   */
  setRotation: (rotation: number) => void;
  /**
   * Rotate left by 90 degrees
   */
  rotateLeft: () => void;
  /**
   * Rotate right by 90 degrees
   */
  rotateRight: () => void;
  /**
   * Whether the sidebar is open
   */
  isSidebarOpen: boolean;
  /**
   * Open the sidebar
   */
  openSidebar: () => void;
  /**
   * Close the sidebar
   */
  closeSidebar: () => void;
  /**
   * Toggle the sidebar
   */
  toggleSidebar: () => void;
  /**
   * Current search query
   */
  searchQuery: string;
  /**
   * Set the search query
   */
  setSearchQuery: (query: string) => void;
  /**
   * Search the document
   */
  search: () => void;
  /**
   * Whether the document is in fullscreen mode
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
   * Download the document
   */
  download: () => void;
  /**
   * Print the document
   */
  print: () => void;
  /**
   * Whether the document is loading
   */
  isLoading: boolean;
  /**
   * Whether the document has loaded
   */
  isLoaded: boolean;
  /**
   * Whether the document has failed to load
   */
  hasError: boolean;
  /**
   * Error message if the document has failed to load
   */
  errorMessage: string;
  /**
   * Ref for the PDF viewer container
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the PDF document
   */
  documentRef: React.RefObject<HTMLDivElement>;
  /**
   * Get props for the PDF viewer container
   */
  getContainerProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: React.RefObject<HTMLElement>;
  };
  /**
   * Get props for the PDF viewer overlay/backdrop
   */
  getBackdropProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the PDF viewer content
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the PDF viewer trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the PDF viewer close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the PDF document
   */
  getDocumentProps: () => {
    ref: React.RefObject<HTMLDivElement>;
    style: React.CSSProperties;
  };
  /**
   * Get props for the next page button
   */
  getNextPageButtonProps: () => {
    onClick: () => void;
    disabled: boolean;
    'aria-label': string;
  };
  /**
   * Get props for the previous page button
   */
  getPrevPageButtonProps: () => {
    onClick: () => void;
    disabled: boolean;
    'aria-label': string;
  };
  /**
   * Get props for the page input
   */
  getPageInputProps: () => {
    type: string;
    min: number;
    max: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    'aria-label': string;
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
   * Get props for the rotate left button
   */
  getRotateLeftButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the rotate right button
   */
  getRotateRightButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the download button
   */
  getDownloadButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the print button
   */
  getPrintButtonProps: () => {
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
   * Get props for the sidebar toggle button
   */
  getSidebarToggleButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
  /**
   * Get props for the search input
   */
  getSearchInputProps: () => {
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    placeholder: string;
    'aria-label': string;
  };
  /**
   * Get props for the search button
   */
  getSearchButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
}

/**
 * Hook for creating a PDF viewer modal
 */
export function usePDFViewerModal(options: PDFViewerModalOptions = {}): UsePDFViewerModalReturn {
  const {
    src: initialSrc = '',
    initialPage = 1,
    initialZoom = 1,
    showToolbar = true,
    showSidebar = true,
    showNavigation = true,
    showZoomControls = true,
    showPageControls = true,
    showDownloadButton = true,
    showPrintButton = true,
    showFullscreenButton = true,
    showRotateButtons = true,
    showSearchBox = true,
    showCloseButton = true,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    onPageChange,
    onZoomChange,
    onDocumentLoad,
    onDocumentLoadError,
    onDownload,
    onPrint,
    onEnterFullscreen,
    onExitFullscreen,
    onRotate,
    onSearch,
    ...modalOptions
  } = options;

  // Use modal hook for basic functionality
  const modalProps = useModal({
    ...modalOptions,
    closeOnOutsideClick,
    closeOnEscape,
  });
  
  // State for PDF viewer
  const [src, setSrc] = useState<string>(initialSrc);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [numPages, setNumPages] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [rotation, setRotation] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Refs for elements
  const containerRef = useRef<HTMLElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  
  // Go to a specific page
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= numPages) {
      setCurrentPage(page);
      onPageChange?.(page);
    }
  }, [numPages, onPageChange]);
  
  // Go to the next page
  const nextPage = useCallback(() => {
    if (currentPage < numPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, numPages, goToPage]);
  
  // Go to the previous page
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);
  
  // Zoom in
  const zoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + 0.1, 3);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [zoom, onZoomChange]);
  
  // Zoom out
  const zoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - 0.1, 0.1);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [zoom, onZoomChange]);
  
  // Reset zoom
  const resetZoom = useCallback(() => {
    setZoom(1);
    onZoomChange?.(1);
  }, [onZoomChange]);
  
  // Handle zoom change
  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  }, [onZoomChange]);
  
  // Rotate left
  const rotateLeft = useCallback(() => {
    const newRotation = (rotation - 90) % 360;
    setRotation(newRotation);
    onRotate?.(newRotation);
  }, [rotation, onRotate]);
  
  // Rotate right
  const rotateRight = useCallback(() => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    onRotate?.(newRotation);
  }, [rotation, onRotate]);
  
  // Handle rotation change
  const handleRotationChange = useCallback((newRotation: number) => {
    setRotation(newRotation);
    onRotate?.(newRotation);
  }, [onRotate]);
  
  // Open sidebar
  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);
  
  // Close sidebar
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);
  
  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);
  
  // Search the document
  const search = useCallback(() => {
    if (searchQuery) {
      onSearch?.(searchQuery);
    }
  }, [searchQuery, onSearch]);
  
  // Enter fullscreen
  const enterFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
          onEnterFullscreen?.();
        }).catch((error) => {
          console.error('Error entering fullscreen:', error);
        });
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
        setIsFullscreen(true);
        onEnterFullscreen?.();
      } else if ((containerRef.current as any).mozRequestFullScreen) {
        (containerRef.current as any).mozRequestFullScreen();
        setIsFullscreen(true);
        onEnterFullscreen?.();
      } else if ((containerRef.current as any).msRequestFullscreen) {
        (containerRef.current as any).msRequestFullscreen();
        setIsFullscreen(true);
        onEnterFullscreen?.();
      }
    }
  }, [onEnterFullscreen]);
  
  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
          onExitFullscreen?.();
        }).catch((error) => {
          console.error('Error exiting fullscreen:', error);
        });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
        setIsFullscreen(false);
        onExitFullscreen?.();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
        setIsFullscreen(false);
        onExitFullscreen?.();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
        setIsFullscreen(false);
        onExitFullscreen?.();
      }
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
  
  // Download the document
  const download = useCallback(() => {
    if (src) {
      const link = document.createElement('a');
      link.href = src;
      link.download = src.split('/').pop() || 'document.pdf';
      link.click();
      onDownload?.();
    }
  }, [src, onDownload]);
  
  // Print the document
  const print = useCallback(() => {
    if (src) {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = src;
      
      iframe.onload = () => {
        if (iframe.contentWindow) {
          iframe.contentWindow.print();
          onPrint?.();
        }
        
        // Remove the iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
      
      document.body.appendChild(iframe);
    }
  }, [src, onPrint]);
  
  // Handle document load
  const handleDocumentLoad = useCallback((pages: number) => {
    setNumPages(pages);
    setIsLoading(false);
    setIsLoaded(true);
    setHasError(false);
    setErrorMessage('');
    onDocumentLoad?.(pages);
  }, [onDocumentLoad]);
  
  // Handle document load error
  const handleDocumentLoadError = useCallback((error: Error) => {
    setIsLoading(false);
    setIsLoaded(false);
    setHasError(true);
    setErrorMessage(error.message);
    onDocumentLoadError?.(error);
  }, [onDocumentLoadError]);
  
  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = !!(document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement);
      
      setIsFullscreen(isInFullscreen);
      
      if (!isInFullscreen) {
        onExitFullscreen?.();
      }
    };
    
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
  }, [onExitFullscreen]);
  
  // Reset state when src changes
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setIsLoaded(false);
      setHasError(false);
      setErrorMessage('');
      setCurrentPage(initialPage);
      setZoom(initialZoom);
      setRotation(0);
    }
  }, [src, initialPage, initialZoom]);
  
  // Get container props
  const getContainerProps = useCallback(() => {
    return {
      ...modalProps.getContainerProps(),
      ref: containerRef,
    };
  }, [modalProps]);
  
  // Get backdrop props
  const getBackdropProps = useCallback(() => {
    return modalProps.getOverlayProps();
  }, [modalProps]);
  
  // Get content props
  const getContentProps = useCallback(() => {
    return {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
      },
    };
  }, []);
  
  // Get trigger props
  const getTriggerProps = useCallback(() => {
    return modalProps.getTriggerProps();
  }, [modalProps]);
  
  // Get close button props
  const getCloseButtonProps = useCallback(() => {
    return modalProps.getCloseButtonProps();
  }, [modalProps]);
  
  // Get document props
  const getDocumentProps = useCallback(() => {
    return {
      ref: documentRef,
      style: {
        transform: `scale(${zoom}) rotate(${rotation}deg)`,
        transformOrigin: 'center',
      },
    };
  }, [zoom, rotation]);
  
  // Get next page button props
  const getNextPageButtonProps = useCallback(() => {
    return {
      onClick: nextPage,
      disabled: currentPage >= numPages,
      'aria-label': 'Next page',
    };
  }, [nextPage, currentPage, numPages]);
  
  // Get previous page button props
  const getPrevPageButtonProps = useCallback(() => {
    return {
      onClick: prevPage,
      disabled: currentPage <= 1,
      'aria-label': 'Previous page',
    };
  }, [prevPage, currentPage]);
  
  // Get page input props
  const getPageInputProps = useCallback(() => {
    return {
      type: 'number',
      min: 1,
      max: numPages,
      value: currentPage,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) {
          goToPage(page);
        }
      },
      'aria-label': 'Page',
    };
  }, [currentPage, numPages, goToPage]);
  
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
  
  // Get rotate left button props
  const getRotateLeftButtonProps = useCallback(() => {
    return {
      onClick: rotateLeft,
      'aria-label': 'Rotate left',
    };
  }, [rotateLeft]);
  
  // Get rotate right button props
  const getRotateRightButtonProps = useCallback(() => {
    return {
      onClick: rotateRight,
      'aria-label': 'Rotate right',
    };
  }, [rotateRight]);
  
  // Get download button props
  const getDownloadButtonProps = useCallback(() => {
    return {
      onClick: download,
      'aria-label': 'Download',
    };
  }, [download]);
  
  // Get print button props
  const getPrintButtonProps = useCallback(() => {
    return {
      onClick: print,
      'aria-label': 'Print',
    };
  }, [print]);
  
  // Get fullscreen button props
  const getFullscreenButtonProps = useCallback(() => {
    return {
      onClick: toggleFullscreen,
      'aria-label': isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen',
      'aria-pressed': isFullscreen,
    };
  }, [toggleFullscreen, isFullscreen]);
  
  // Get sidebar toggle button props
  const getSidebarToggleButtonProps = useCallback(() => {
    return {
      onClick: toggleSidebar,
      'aria-label': isSidebarOpen ? 'Close sidebar' : 'Open sidebar',
      'aria-pressed': isSidebarOpen,
    };
  }, [toggleSidebar, isSidebarOpen]);
  
  // Get search input props
  const getSearchInputProps = useCallback(() => {
    return {
      type: 'text',
      value: searchQuery,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
          search();
        }
      },
      placeholder: 'Search',
      'aria-label': 'Search',
    };
  }, [searchQuery, search]);
  
  // Get search button props
  const getSearchButtonProps = useCallback(() => {
    return {
      onClick: search,
      'aria-label': 'Search',
    };
  }, [search]);

  return {
    isOpen: modalProps.isOpen,
    open: modalProps.open,
    close: modalProps.close,
    toggle: modalProps.toggle,
    src,
    setSrc,
    currentPage,
    numPages,
    goToPage,
    nextPage,
    prevPage,
    zoom,
    setZoom: handleZoomChange,
    zoomIn,
    zoomOut,
    resetZoom,
    rotation,
    setRotation: handleRotationChange,
    rotateLeft,
    rotateRight,
    isSidebarOpen,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    search,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    download,
    print,
    isLoading,
    isLoaded,
    hasError,
    errorMessage,
    containerRef,
    documentRef,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
    getDocumentProps,
    getNextPageButtonProps,
    getPrevPageButtonProps,
    getPageInputProps,
    getZoomInButtonProps,
    getZoomOutButtonProps,
    getZoomResetButtonProps,
    getRotateLeftButtonProps,
    getRotateRightButtonProps,
    getDownloadButtonProps,
    getPrintButtonProps,
    getFullscreenButtonProps,
    getSidebarToggleButtonProps,
    getSearchInputProps,
    getSearchButtonProps,
  };
}

export default usePDFViewerModal;
