import { useState, useCallback, useRef, useEffect } from 'react';

export type MediaType = 'camera' | 'audio' | 'screen' | 'screenWithAudio';
export type CameraFacing = 'user' | 'environment';
export type CameraResolution = 'qvga' | 'vga' | 'hd' | 'fullHd' | '4k' | 'custom';
export type AudioQuality = 'low' | 'medium' | 'high';
export type MediaFormat = 'webm' | 'mp4' | 'png' | 'jpeg' | 'gif' | 'wav' | 'mp3';
export type RecordingState = 'inactive' | 'recording' | 'paused';

export interface MediaCaptureOptions {
  /**
   * Type of media to capture
   */
  mediaType?: MediaType;
  /**
   * Camera facing mode (front or back)
   */
  cameraFacing?: CameraFacing;
  /**
   * Camera resolution preset
   */
  cameraResolution?: CameraResolution;
  /**
   * Custom width for camera
   */
  customWidth?: number;
  /**
   * Custom height for camera
   */
  customHeight?: number;
  /**
   * Audio quality preset
   */
  audioQuality?: AudioQuality;
  /**
   * Whether to enable audio when capturing video
   */
  enableAudio?: boolean;
  /**
   * Format for captured media
   */
  format?: MediaFormat;
  /**
   * Maximum recording time in seconds (0 for unlimited)
   */
  maxRecordingTime?: number;
  /**
   * Whether to mirror the camera feed (for front-facing camera)
   */
  mirrorCamera?: boolean;
  /**
   * Whether to enable flash (if available)
   */
  enableFlash?: boolean;
  /**
   * Whether to auto-start capture when component mounts
   */
  autoStart?: boolean;
  /**
   * Callback when media stream is ready
   */
  onStreamReady?: (stream: MediaStream) => void;
  /**
   * Callback when media capture starts
   */
  onCaptureStart?: () => void;
  /**
   * Callback when media capture stops
   */
  onCaptureStop?: () => void;
  /**
   * Callback when media is captured
   */
  onCapture?: (data: Blob | string, type: MediaType) => void;
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
  /**
   * Callback when recording time updates
   */
  onTimeUpdate?: (currentTime: number) => void;
}

export interface UseMediaCaptureReturn {
  /**
   * Current media stream
   */
  stream: MediaStream | null;
  /**
   * Current recording state
   */
  recordingState: RecordingState;
  /**
   * Current recording time in seconds
   */
  recordingTime: number;
  /**
   * Whether media is being processed
   */
  isProcessing: boolean;
  /**
   * Error if any
   */
  error: Error | null;
  /**
   * Type of media being captured
   */
  mediaType: MediaType;
  /**
   * Start media stream
   */
  startStream: () => Promise<void>;
  /**
   * Stop media stream
   */
  stopStream: () => void;
  /**
   * Start recording
   */
  startRecording: () => void;
  /**
   * Stop recording
   */
  stopRecording: () => void;
  /**
   * Pause recording
   */
  pauseRecording: () => void;
  /**
   * Resume recording
   */
  resumeRecording: () => void;
  /**
   * Capture a single frame (for camera)
   */
  captureFrame: () => void;
  /**
   * Toggle camera facing mode (front/back)
   */
  toggleCameraFacing: () => void;
  /**
   * Toggle flash
   */
  toggleFlash: () => void;
  /**
   * Get props for the video element
   */
  getVideoProps: () => {
    ref: React.RefObject<HTMLVideoElement>;
    autoPlay: boolean;
    muted: boolean;
    playsInline: boolean;
    style?: React.CSSProperties;
  };
  /**
   * Get props for the audio element
   */
  getAudioProps: () => {
    ref: React.RefObject<HTMLAudioElement>;
    controls: boolean;
  };
  /**
   * Get props for the canvas element
   */
  getCanvasProps: () => {
    ref: React.RefObject<HTMLCanvasElement>;
    style: React.CSSProperties;
  };
}

/**
 * Hook for creating media capture functionality
 */
export function useMediaCapture(options: MediaCaptureOptions = {}): UseMediaCaptureReturn {
  const {
    mediaType = 'camera',
    cameraFacing = 'user',
    cameraResolution = 'hd',
    customWidth,
    customHeight,
    audioQuality = 'medium',
    enableAudio = true,
    format = 'webm',
    maxRecordingTime = 0,
    mirrorCamera = true,
    enableFlash = false,
    autoStart = false,
    onStreamReady,
    onCaptureStart,
    onCaptureStop,
    onCapture,
    onError,
    onTimeUpdate,
  } = options;

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>('inactive');
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentCameraFacing, setCurrentCameraFacing] = useState<CameraFacing>(cameraFacing);
  const [flashEnabled, setFlashEnabled] = useState<boolean>(enableFlash);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Get media constraints based on options
  const getMediaConstraints = useCallback(() => {
    let constraints: MediaStreamConstraints = {};
    
    // Video constraints
    if (mediaType === 'camera') {
      let width: number;
      let height: number;
      
      // Set resolution based on preset or custom values
      if (customWidth && customHeight) {
        width = customWidth;
        height = customHeight;
      } else {
        switch (cameraResolution) {
          case 'qvga':
            width = 320;
            height = 240;
            break;
          case 'vga':
            width = 640;
            height = 480;
            break;
          case 'hd':
            width = 1280;
            height = 720;
            break;
          case 'fullHd':
            width = 1920;
            height = 1080;
            break;
          case '4k':
            width = 3840;
            height = 2160;
            break;
          default:
            width = 1280;
            height = 720;
        }
      }
      
      constraints.video = {
        facingMode: currentCameraFacing,
        width: { ideal: width },
        height: { ideal: height },
      };
    } else if (mediaType === 'screen' || mediaType === 'screenWithAudio') {
      // Screen capture doesn't use MediaStreamConstraints in the same way
      constraints.video = true;
    }
    
    // Audio constraints
    if (mediaType === 'audio' || mediaType === 'screenWithAudio' || (mediaType === 'camera' && enableAudio)) {
      let sampleRate: number;
      let echoCancellation: boolean;
      let noiseSuppression: boolean;
      
      switch (audioQuality) {
        case 'low':
          sampleRate = 8000;
          echoCancellation = true;
          noiseSuppression = true;
          break;
        case 'medium':
          sampleRate = 44100;
          echoCancellation = true;
          noiseSuppression = true;
          break;
        case 'high':
          sampleRate = 48000;
          echoCancellation = false;
          noiseSuppression = false;
          break;
        default:
          sampleRate = 44100;
          echoCancellation = true;
          noiseSuppression = true;
      }
      
      constraints.audio = {
        sampleRate,
        echoCancellation,
        noiseSuppression,
      };
    }
    
    return constraints;
  }, [mediaType, currentCameraFacing, cameraResolution, customWidth, customHeight, audioQuality, enableAudio]);

  // Start media stream
  const startStream = useCallback(async () => {
    try {
      setError(null);
      setIsProcessing(true);
      
      let newStream: MediaStream;
      
      if (mediaType === 'screen' || mediaType === 'screenWithAudio') {
        // Screen capture
        const displayMediaOptions: DisplayMediaStreamOptions = {
          video: true,
          audio: mediaType === 'screenWithAudio',
        };
        
        newStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      } else {
        // Camera or audio capture
        const constraints = getMediaConstraints();
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      }
      
      // Try to enable flash if requested and available
      if (mediaType === 'camera' && flashEnabled) {
        try {
          const track = newStream.getVideoTracks()[0];
          if (track && 'getCapabilities' in track) {
            const capabilities = track.getCapabilities() as any;
            if (capabilities.torch) {
              await track.applyConstraints({ advanced: [{ torch: true } as any] });
            }
          }
        } catch (flashError) {
          console.warn('Flash not supported:', flashError);
        }
      }
      
      setStream(newStream);
      
      // Connect stream to video element if available
      if (videoRef.current && (mediaType === 'camera' || mediaType === 'screen' || mediaType === 'screenWithAudio')) {
        videoRef.current.srcObject = newStream;
        
        // Apply mirror effect for front-facing camera if requested
        if (mediaType === 'camera' && currentCameraFacing === 'user' && mirrorCamera) {
          videoRef.current.style.transform = 'scaleX(-1)';
        } else {
          videoRef.current.style.transform = 'none';
        }
      }
      
      // Connect stream to audio element if available
      if (audioRef.current && mediaType === 'audio') {
        audioRef.current.srcObject = newStream;
      }
      
      onStreamReady?.(newStream);
      setIsProcessing(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsProcessing(false);
      onError?.(error);
    }
  }, [
    mediaType,
    getMediaConstraints,
    flashEnabled,
    mirrorCamera,
    currentCameraFacing,
    onStreamReady,
    onError,
  ]);

  // Stop media stream
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      if (audioRef.current) {
        audioRef.current.srcObject = null;
      }
    }
    
    // Stop recording if active
    if (recordingState !== 'inactive') {
      stopRecording();
    }
  }, [stream, recordingState]);

  // Start recording
  const startRecording = useCallback(() => {
    if (!stream || recordingState !== 'inactive') {
      return;
    }
    
    try {
      setError(null);
      setIsProcessing(true);
      
      // Reset recording time and chunks
      setRecordingTime(0);
      chunksRef.current = [];
      startTimeRef.current = Date.now();
      
      // Create media recorder
      const mimeType = getMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        
        // Process the recorded media
        processRecordedMedia(blob);
        
        setRecordingState('inactive');
        setIsProcessing(false);
        onCaptureStop?.();
      };
      
      // Start the media recorder
      mediaRecorder.start(1000); // Collect data every second
      mediaRecorderRef.current = mediaRecorder;
      
      // Start the timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);
        onTimeUpdate?.(elapsed);
        
        // Stop recording if max time is reached
        if (maxRecordingTime > 0 && elapsed >= maxRecordingTime) {
          stopRecording();
        }
      }, 1000);
      
      setRecordingState('recording');
      setIsProcessing(false);
      onCaptureStart?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsProcessing(false);
      onError?.(error);
    }
  }, [stream, recordingState, maxRecordingTime, onCaptureStart, onCaptureStop, onTimeUpdate, onError]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [recordingState]);

  // Pause recording
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.pause();
      
      // Pause the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      setRecordingState('paused');
    }
  }, [recordingState]);

  // Resume recording
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'paused') {
      mediaRecorderRef.current.resume();
      
      // Update start time to account for pause duration
      startTimeRef.current = Date.now() - (recordingTime * 1000);
      
      // Restart the timer
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);
        onTimeUpdate?.(elapsed);
        
        // Stop recording if max time is reached
        if (maxRecordingTime > 0 && elapsed >= maxRecordingTime) {
          stopRecording();
        }
      }, 1000);
      
      setRecordingState('recording');
    }
  }, [recordingState, recordingTime, maxRecordingTime, stopRecording, onTimeUpdate]);

  // Capture a single frame from the video
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || mediaType !== 'camera') {
      return;
    }
    
    try {
      setError(null);
      setIsProcessing(true);
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Apply mirror effect if needed
      if (currentCameraFacing === 'user' && mirrorCamera) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to image data
      const imageFormat = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const quality = format === 'jpeg' ? 0.95 : undefined;
      const dataUrl = canvas.toDataURL(imageFormat, quality);
      
      onCapture?.(dataUrl, 'camera');
      setIsProcessing(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsProcessing(false);
      onError?.(error);
    }
  }, [mediaType, format, currentCameraFacing, mirrorCamera, onCapture, onError]);

  // Toggle camera facing mode
  const toggleCameraFacing = useCallback(() => {
    const newFacing = currentCameraFacing === 'user' ? 'environment' : 'user';
    setCurrentCameraFacing(newFacing);
    
    // Restart stream with new facing mode
    if (stream) {
      stopStream();
      setTimeout(() => {
        startStream();
      }, 100);
    }
  }, [currentCameraFacing, stream, stopStream, startStream]);

  // Toggle flash
  const toggleFlash = useCallback(() => {
    setFlashEnabled(prev => !prev);
    
    // Apply flash setting to current track if available
    if (stream && mediaType === 'camera') {
      const track = stream.getVideoTracks()[0];
      if (track && 'getCapabilities' in track) {
        const capabilities = track.getCapabilities() as any;
        if (capabilities.torch) {
          track.applyConstraints({
            advanced: [{ torch: !flashEnabled } as any],
          }).catch(err => {
            console.warn('Could not toggle flash:', err);
          });
        }
      }
    }
  }, [flashEnabled, stream, mediaType]);

  // Get appropriate MIME type based on format
  const getMimeType = useCallback(() => {
    switch (format) {
      case 'webm':
        return 'video/webm;codecs=vp9,opus';
      case 'mp4':
        return 'video/mp4';
      case 'wav':
        return 'audio/wav';
      case 'mp3':
        return 'audio/mpeg';
      default:
        return 'video/webm';
    }
  }, [format]);

  // Process recorded media
  const processRecordedMedia = useCallback((blob: Blob) => {
    if (onCapture) {
      onCapture(blob, mediaType);
    }
  }, [mediaType, onCapture]);

  // Get props for the video element
  const getVideoProps = useCallback(() => {
    return {
      ref: videoRef,
      autoPlay: true,
      muted: true,
      playsInline: true,
      style: currentCameraFacing === 'user' && mirrorCamera
        ? { transform: 'scaleX(-1)' }
        : undefined,
    };
  }, [currentCameraFacing, mirrorCamera]);

  // Get props for the audio element
  const getAudioProps = useCallback(() => {
    return {
      ref: audioRef,
      controls: true,
    };
  }, []);

  // Get props for the canvas element
  const getCanvasProps = useCallback(() => {
    return {
      ref: canvasRef,
      style: { display: 'none' },
    };
  }, []);

  // Auto-start stream if requested
  useEffect(() => {
    if (autoStart) {
      startStream();
    }
    
    return () => {
      // Clean up on unmount
      stopStream();
    };
  }, [autoStart, startStream, stopStream]);

  return {
    stream,
    recordingState,
    recordingTime,
    isProcessing,
    error,
    mediaType,
    startStream,
    stopStream,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    captureFrame,
    toggleCameraFacing,
    toggleFlash,
    getVideoProps,
    getAudioProps,
    getCanvasProps,
  };
}

export default useMediaCapture;
