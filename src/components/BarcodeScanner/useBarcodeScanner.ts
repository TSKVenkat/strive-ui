import { useState, useRef, useCallback, useEffect } from 'react';

export type BarcodeFormat = 
  | 'QR_CODE'
  | 'DATA_MATRIX'
  | 'UPC_A'
  | 'UPC_E'
  | 'EAN_8'
  | 'EAN_13'
  | 'CODE_39'
  | 'CODE_93'
  | 'CODE_128'
  | 'ITF'
  | 'CODABAR'
  | 'RSS_14'
  | 'RSS_EXPANDED'
  | 'PDF_417'
  | 'AZTEC';

export interface BarcodeResult {
  /**
   * The text content of the barcode
   */
  text: string;
  /**
   * The format of the barcode
   */
  format: BarcodeFormat;
  /**
   * The timestamp when the barcode was scanned
   */
  timestamp: number;
  /**
   * The image data URL of the frame where the barcode was found
   */
  imageData?: string;
  /**
   * The bounding box of the barcode in the image
   */
  boundingBox?: {
    topLeft: { x: number, y: number };
    topRight: { x: number, y: number };
    bottomLeft: { x: number, y: number };
    bottomRight: { x: number, y: number };
  };
}

export interface BarcodeScannerOptions {
  /**
   * Width of the scanner
   */
  width?: number;
  /**
   * Height of the scanner
   */
  height?: number;
  /**
   * Camera facing mode (front or back)
   */
  facingMode?: 'user' | 'environment';
  /**
   * Whether to highlight the barcode when found
   */
  highlightCode?: boolean;
  /**
   * Color of the highlight
   */
  highlightColor?: string;
  /**
   * Whether to play a sound when a barcode is detected
   */
  beepOnScan?: boolean;
  /**
   * Custom beep sound URL
   */
  beepSoundUrl?: string;
  /**
   * Scan frequency in milliseconds
   */
  scanFrequency?: number;
  /**
   * Whether to stop scanning after finding a barcode
   */
  stopOnScan?: boolean;
  /**
   * Whether to auto-start scanning
   */
  autoStart?: boolean;
  /**
   * Formats to scan for
   */
  formats?: BarcodeFormat[];
  /**
   * Callback when a barcode is detected
   */
  onScan?: (result: BarcodeResult) => void;
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
  /**
   * Callback when scanning starts
   */
  onStart?: () => void;
  /**
   * Callback when scanning stops
   */
  onStop?: () => void;
}

export interface UseBarcodeScannerReturn {
  /**
   * Whether the scanner is active
   */
  isScanning: boolean;
  /**
   * The last scanned result
   */
  lastResult: BarcodeResult | null;
  /**
   * All scanned results
   */
  results: BarcodeResult[];
  /**
   * Error if any
   */
  error: Error | null;
  /**
   * Start scanning
   */
  startScanning: () => void;
  /**
   * Stop scanning
   */
  stopScanning: () => void;
  /**
   * Clear results
   */
  clearResults: () => void;
  /**
   * Get props for the video element
   */
  getVideoProps: () => {
    ref: React.RefObject<HTMLVideoElement>;
    width: number;
    height: number;
    autoPlay: boolean;
    muted: boolean;
    playsInline: boolean;
    style: React.CSSProperties;
  };
  /**
   * Get props for the canvas element
   */
  getCanvasProps: () => {
    ref: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
    style: React.CSSProperties;
  };
  /**
   * Set the formats to scan for
   */
  setFormats: (formats: BarcodeFormat[]) => void;
  /**
   * The currently active formats
   */
  activeFormats: BarcodeFormat[];
  /**
   * Toggle a specific format
   */
  toggleFormat: (format: BarcodeFormat) => void;
}

/**
 * Hook for creating a barcode scanner
 */
export function useBarcodeScanner(options: BarcodeScannerOptions = {}): UseBarcodeScannerReturn {
  const {
    width = 300,
    height = 300,
    facingMode = 'environment',
    highlightCode = true,
    highlightColor = '#00FF00',
    beepOnScan = false,
    beepSoundUrl = '',
    scanFrequency = 500,
    stopOnScan = false,
    autoStart = false,
    formats: initialFormats = ['QR_CODE', 'EAN_13', 'CODE_128'],
    onScan,
    onError,
    onStart,
    onStop,
  } = options;

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<BarcodeResult | null>(null);
  const [results, setResults] = useState<BarcodeResult[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [activeFormats, setActiveFormats] = useState<BarcodeFormat[]>(initialFormats);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const beepAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize beep audio if enabled
  useEffect(() => {
    if (beepOnScan) {
      const audio = new Audio(beepSoundUrl || 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'); // Default beep sound
      beepAudioRef.current = audio;
    }
  }, [beepOnScan, beepSoundUrl]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  // Auto-start scanning if enabled
  useEffect(() => {
    if (autoStart) {
      startScanning();
    }
  }, [autoStart]);

  // Set formats
  const setFormats = useCallback((formats: BarcodeFormat[]) => {
    setActiveFormats(formats);
  }, []);

  // Toggle a specific format
  const toggleFormat = useCallback((format: BarcodeFormat) => {
    setActiveFormats(prev => {
      if (prev.includes(format)) {
        return prev.filter(f => f !== format);
      } else {
        return [...prev, format];
      }
    });
  }, []);

  // Start scanning
  const startScanning = useCallback(async () => {
    try {
      setError(null);
      
      // Request camera access
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: width },
          height: { ideal: height },
        },
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start scanning interval
      scanIntervalRef.current = setInterval(() => {
        scanBarcode();
      }, scanFrequency);
      
      setIsScanning(true);
      onStart?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    }
  }, [facingMode, width, height, scanFrequency, onStart, onError]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    // Clear scanning interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    
    setIsScanning(false);
    onStop?.();
  }, [onStop]);

  // Clear results
  const clearResults = useCallback(() => {
    setResults([]);
    setLastResult(null);
  }, []);

  // Scan barcode from video
  const scanBarcode = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || !isScanning || !video.readyState || video.paused || video.ended) {
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    try {
      // Use a placeholder for actual barcode detection
      // In a real implementation, you would use a library like zxing-js or quagga
      // This is a simplified version that simulates barcode detection
      const simulateBarcodeDetection = () => {
        // In a real implementation, this would be the result from the barcode library
        const format = activeFormats[Math.floor(Math.random() * activeFormats.length)];
        
        // Generate a mock barcode text based on the format
        let text = '';
        switch (format) {
          case 'EAN_13':
            text = '5901234123457'; // Example EAN-13
            break;
          case 'CODE_128':
            text = 'ABC-123-xyz'; // Example Code 128
            break;
          default:
            text = 'https://example.com';
        }
        
        // Create a mock bounding box
        const boundingBox = {
          topLeft: { x: canvas.width * 0.3, y: canvas.height * 0.3 },
          topRight: { x: canvas.width * 0.7, y: canvas.height * 0.3 },
          bottomLeft: { x: canvas.width * 0.3, y: canvas.height * 0.7 },
          bottomRight: { x: canvas.width * 0.7, y: canvas.height * 0.7 },
        };
        
        return {
          text,
          format,
          timestamp: Date.now(),
          imageData: canvas.toDataURL('image/jpeg', 0.5),
          boundingBox,
        };
      };
      
      // For demonstration purposes, we'll randomly detect a barcode
      // In a real implementation, you would use the barcode library's detection logic
      if (Math.random() < 0.01) { // Simulate occasional barcode detection
        const result = simulateBarcodeDetection();
        
        // Highlight the barcode if enabled
        if (highlightCode && result.boundingBox) {
          const { topLeft, topRight, bottomLeft, bottomRight } = result.boundingBox;
          
          ctx.strokeStyle = highlightColor;
          ctx.lineWidth = 5;
          
          ctx.beginPath();
          ctx.moveTo(topLeft.x, topLeft.y);
          ctx.lineTo(topRight.x, topRight.y);
          ctx.lineTo(bottomRight.x, bottomRight.y);
          ctx.lineTo(bottomLeft.x, bottomLeft.y);
          ctx.closePath();
          ctx.stroke();
        }
        
        // Play beep sound if enabled
        if (beepOnScan && beepAudioRef.current) {
          beepAudioRef.current.play().catch(err => console.warn('Could not play beep sound:', err));
        }
        
        // Update state
        setLastResult(result);
        setResults(prev => [...prev, result]);
        
        // Call onScan callback
        onScan?.(result);
        
        // Stop scanning if stopOnScan is enabled
        if (stopOnScan) {
          stopScanning();
        }
      }
    } catch (err) {
      console.warn('Barcode detection error:', err);
    }
  }, [isScanning, highlightCode, highlightColor, beepOnScan, stopOnScan, onScan, stopScanning, activeFormats]);

  // Get props for the video element
  const getVideoProps = useCallback(() => {
    return {
      ref: videoRef,
      width,
      height,
      autoPlay: true,
      muted: true,
      playsInline: true,
      style: {
        width: '100%',
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
        objectFit: 'cover' as const,
      },
    };
  }, [width, height]);

  // Get props for the canvas element
  const getCanvasProps = useCallback(() => {
    return {
      ref: canvasRef,
      width,
      height,
      style: {
        display: highlightCode ? 'block' : 'none',
        position: 'absolute' as const,
        top: 0,
        left: 0,
        width: '100%',
        maxWidth: `${width}px`,
        maxHeight: `${height}px`,
        objectFit: 'cover' as const,
        pointerEvents: 'none' as const,
      },
    };
  }, [width, height, highlightCode]);

  return {
    isScanning,
    lastResult,
    results,
    error,
    startScanning,
    stopScanning,
    clearResults,
    getVideoProps,
    getCanvasProps,
    setFormats,
    activeFormats,
    toggleFormat,
  };
}

export default useBarcodeScanner;
