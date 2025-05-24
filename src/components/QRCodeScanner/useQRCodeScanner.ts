import { useState, useRef, useCallback, useEffect } from 'react';

export interface QRCodeResult {
  /**
   * The text content of the QR code
   */
  text: string;
  /**
   * The raw format of the QR code
   */
  format: string;
  /**
   * The timestamp when the QR code was scanned
   */
  timestamp: number;
  /**
   * The image data URL of the frame where the QR code was found
   */
  imageData?: string;
}

export interface QRCodeScannerOptions {
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
   * Whether to highlight the QR code when found
   */
  highlightCode?: boolean;
  /**
   * Color of the highlight
   */
  highlightColor?: string;
  /**
   * Whether to play a sound when a QR code is detected
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
   * Whether to stop scanning after finding a QR code
   */
  stopOnScan?: boolean;
  /**
   * Whether to auto-start scanning
   */
  autoStart?: boolean;
  /**
   * Callback when a QR code is detected
   */
  onScan?: (result: QRCodeResult) => void;
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

export interface UseQRCodeScannerReturn {
  /**
   * Whether the scanner is active
   */
  isScanning: boolean;
  /**
   * The last scanned result
   */
  lastResult: QRCodeResult | null;
  /**
   * All scanned results
   */
  results: QRCodeResult[];
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
}

/**
 * Hook for creating a QR code scanner
 */
export function useQRCodeScanner(options: QRCodeScannerOptions = {}): UseQRCodeScannerReturn {
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
    onScan,
    onError,
    onStart,
    onStop,
  } = options;

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<QRCodeResult | null>(null);
  const [results, setResults] = useState<QRCodeResult[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
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
        scanQRCode();
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

  // Scan QR code from video
  const scanQRCode = useCallback(() => {
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
      // Use a placeholder for actual QR code detection
      // In a real implementation, you would use a library like jsQR or zxing
      // This is a simplified version that simulates QR code detection
      const simulateQRCodeDetection = () => {
        // In a real implementation, this would be the result from the QR code library
        return {
          text: 'https://example.com',
          format: 'QR_CODE',
          timestamp: Date.now(),
          imageData: canvas.toDataURL('image/jpeg', 0.5),
        };
      };
      
      // For demonstration purposes, we'll randomly detect a QR code
      // In a real implementation, you would use the QR code library's detection logic
      if (Math.random() < 0.01) { // Simulate occasional QR code detection
        const result = simulateQRCodeDetection();
        
        // Highlight the QR code if enabled
        if (highlightCode) {
          // In a real implementation, you would use the QR code's position data
          // For now, we'll just draw a rectangle in the center
          ctx.strokeStyle = highlightColor;
          ctx.lineWidth = 5;
          const size = Math.min(canvas.width, canvas.height) / 2;
          ctx.strokeRect(
            canvas.width / 2 - size / 2,
            canvas.height / 2 - size / 2,
            size,
            size
          );
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
      console.warn('QR code detection error:', err);
    }
  }, [isScanning, highlightCode, highlightColor, beepOnScan, stopOnScan, onScan, stopScanning]);

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
  };
}

export default useQRCodeScanner;
