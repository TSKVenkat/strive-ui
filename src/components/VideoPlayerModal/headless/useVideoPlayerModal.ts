import { useState, useCallback, useRef, useEffect } from 'react';
import { useModal, ModalOptions } from '../../Modal/headless/useModal';

export interface VideoPlayerModalOptions extends ModalOptions {
  /**
   * Source of the video
   */
  src?: string;
  /**
   * Poster image for the video
   */
  poster?: string;
  /**
   * Whether to autoplay the video when the modal opens
   */
  autoPlay?: boolean;
  /**
   * Whether to loop the video
   */
  loop?: boolean;
  /**
   * Whether to mute the video
   */
  muted?: boolean;
  /**
   * Whether to show controls
   */
  controls?: boolean;
  /**
   * Whether to show play/pause button
   */
  showPlayPauseButton?: boolean;
  /**
   * Whether to show mute button
   */
  showMuteButton?: boolean;
  /**
   * Whether to show volume control
   */
  showVolumeControl?: boolean;
  /**
   * Whether to show progress bar
   */
  showProgressBar?: boolean;
  /**
   * Whether to show current time
   */
  showCurrentTime?: boolean;
  /**
   * Whether to show duration
   */
  showDuration?: boolean;
  /**
   * Whether to show fullscreen button
   */
  showFullscreenButton?: boolean;
  /**
   * Whether to show picture-in-picture button
   */
  showPipButton?: boolean;
  /**
   * Whether to show playback rate control
   */
  showPlaybackRateControl?: boolean;
  /**
   * Whether to show close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to close the modal when the video ends
   */
  closeOnEnd?: boolean;
  /**
   * Whether to close the modal when clicking outside
   */
  closeOnOutsideClick?: boolean;
  /**
   * Whether to close the modal when pressing Escape key
   */
  closeOnEscape?: boolean;
  /**
   * Callback when the video starts playing
   */
  onPlay?: () => void;
  /**
   * Callback when the video is paused
   */
  onPause?: () => void;
  /**
   * Callback when the video ends
   */
  onEnd?: () => void;
  /**
   * Callback when the video time updates
   */
  onTimeUpdate?: (currentTime: number) => void;
  /**
   * Callback when the video volume changes
   */
  onVolumeChange?: (volume: number, muted: boolean) => void;
  /**
   * Callback when the video enters fullscreen
   */
  onEnterFullscreen?: () => void;
  /**
   * Callback when the video exits fullscreen
   */
  onExitFullscreen?: () => void;
  /**
   * Callback when the video enters picture-in-picture mode
   */
  onEnterPip?: () => void;
  /**
   * Callback when the video exits picture-in-picture mode
   */
  onExitPip?: () => void;
  /**
   * Callback when the video playback rate changes
   */
  onPlaybackRateChange?: (rate: number) => void;
}

export interface UseVideoPlayerModalReturn {
  /**
   * Whether the video player modal is open
   */
  isOpen: boolean;
  /**
   * Open the video player modal
   */
  open: () => void;
  /**
   * Close the video player modal
   */
  close: () => void;
  /**
   * Toggle the video player modal
   */
  toggle: () => void;
  /**
   * Source of the video
   */
  src: string;
  /**
   * Set the source of the video
   */
  setSrc: (src: string) => void;
  /**
   * Poster image for the video
   */
  poster: string;
  /**
   * Set the poster image for the video
   */
  setPoster: (poster: string) => void;
  /**
   * Whether the video is playing
   */
  isPlaying: boolean;
  /**
   * Play the video
   */
  play: () => void;
  /**
   * Pause the video
   */
  pause: () => void;
  /**
   * Toggle play/pause
   */
  togglePlay: () => void;
  /**
   * Whether the video is muted
   */
  isMuted: boolean;
  /**
   * Mute the video
   */
  mute: () => void;
  /**
   * Unmute the video
   */
  unmute: () => void;
  /**
   * Toggle mute
   */
  toggleMute: () => void;
  /**
   * Current volume (0-1)
   */
  volume: number;
  /**
   * Set the volume
   */
  setVolume: (volume: number) => void;
  /**
   * Current time in seconds
   */
  currentTime: number;
  /**
   * Set the current time
   */
  setCurrentTime: (time: number) => void;
  /**
   * Duration in seconds
   */
  duration: number;
  /**
   * Current progress (0-1)
   */
  progress: number;
  /**
   * Whether the video is in fullscreen mode
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
   * Whether the video is in picture-in-picture mode
   */
  isPip: boolean;
  /**
   * Enter picture-in-picture mode
   */
  enterPip: () => void;
  /**
   * Exit picture-in-picture mode
   */
  exitPip: () => void;
  /**
   * Toggle picture-in-picture mode
   */
  togglePip: () => void;
  /**
   * Current playback rate
   */
  playbackRate: number;
  /**
   * Set the playback rate
   */
  setPlaybackRate: (rate: number) => void;
  /**
   * Ref for the video player container
   */
  containerRef: React.RefObject<HTMLElement>;
  /**
   * Ref for the video element
   */
  videoRef: React.RefObject<HTMLVideoElement>;
  /**
   * Get props for the video player container
   */
  getContainerProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    ref: React.RefObject<HTMLElement>;
  };
  /**
   * Get props for the video player overlay/backdrop
   */
  getBackdropProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the video player content
   */
  getContentProps: () => {
    onClick: (e: React.MouseEvent) => void;
  };
  /**
   * Get props for the video player trigger
   */
  getTriggerProps: () => {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-controls': string;
  };
  /**
   * Get props for the video player close button
   */
  getCloseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
  };
  /**
   * Get props for the video element
   */
  getVideoProps: () => {
    src: string;
    poster: string;
    autoPlay: boolean;
    loop: boolean;
    muted: boolean;
    controls: boolean;
    ref: React.RefObject<HTMLVideoElement>;
    onPlay: () => void;
    onPause: () => void;
    onEnded: () => void;
    onTimeUpdate: () => void;
    onVolumeChange: () => void;
    onLoadedMetadata: () => void;
  };
  /**
   * Get props for the play/pause button
   */
  getPlayPauseButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
  /**
   * Get props for the mute button
   */
  getMuteButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
  /**
   * Get props for the volume control
   */
  getVolumeControlProps: () => {
    type: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    'aria-label': string;
  };
  /**
   * Get props for the progress bar
   */
  getProgressBarProps: () => {
    type: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
   * Get props for the picture-in-picture button
   */
  getPipButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    'aria-pressed': boolean;
  };
  /**
   * Get props for the playback rate control
   */
  getPlaybackRateControlProps: (rates?: number[]) => {
    value: number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    'aria-label': string;
  };
  /**
   * Get props for the current time display
   */
  getCurrentTimeProps: (format?: (time: number) => string) => {
    children: string;
  };
  /**
   * Get props for the duration display
   */
  getDurationProps: (format?: (time: number) => string) => {
    children: string;
  };
  /**
   * Get props for the controls container
   */
  getControlsProps: () => {
    role: string;
  };
}

/**
 * Format time in seconds to MM:SS format
 */
const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * Hook for creating a video player modal
 */
export function useVideoPlayerModal(options: VideoPlayerModalOptions = {}): UseVideoPlayerModalReturn {
  const {
    src: initialSrc = '',
    poster: initialPoster = '',
    autoPlay = false,
    loop = false,
    muted: initialMuted = false,
    controls = true,
    showPlayPauseButton = true,
    showMuteButton = true,
    showVolumeControl = true,
    showProgressBar = true,
    showCurrentTime = true,
    showDuration = true,
    showFullscreenButton = true,
    showPipButton = true,
    showPlaybackRateControl = true,
    showCloseButton = true,
    closeOnEnd = false,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    onPlay,
    onPause,
    onEnd,
    onTimeUpdate,
    onVolumeChange,
    onEnterFullscreen,
    onExitFullscreen,
    onEnterPip,
    onExitPip,
    onPlaybackRateChange,
    ...modalOptions
  } = options;

  // Use modal hook for basic functionality
  const modalProps = useModal({
    ...modalOptions,
    closeOnOutsideClick,
    closeOnEscape,
  });
  
  // State for video player
  const [src, setSrc] = useState<string>(initialSrc);
  const [poster, setPoster] = useState<string>(initialPoster);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isMuted, setIsMuted] = useState<boolean>(initialMuted);
  const [volume, setVolume] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPip, setIsPip] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  
  // Refs for elements
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Calculate progress
  const progress = duration > 0 ? currentTime / duration : 0;
  
  // Play the video
  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        onPlay?.();
      }).catch((error) => {
        console.error('Error playing video:', error);
      });
    }
  }, [onPlay]);
  
  // Pause the video
  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  }, [onPause]);
  
  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);
  
  // Mute the video
  const mute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      setIsMuted(true);
      onVolumeChange?.(volume, true);
    }
  }, [volume, onVolumeChange]);
  
  // Unmute the video
  const unmute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      onVolumeChange?.(volume, false);
    }
  }, [volume, onVolumeChange]);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  }, [isMuted, mute, unmute]);
  
  // Set volume
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      
      // Unmute if volume is set to a non-zero value
      if (newVolume > 0 && isMuted) {
        unmute();
      }
      
      onVolumeChange?.(newVolume, isMuted);
    }
  }, [isMuted, unmute, onVolumeChange]);
  
  // Set current time
  const handleTimeChange = useCallback((newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      onTimeUpdate?.(newTime);
    }
  }, [onTimeUpdate]);
  
  // Enter fullscreen
  const enterFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
          onEnterFullscreen?.();
        }).catch((error) => {
          console.error('Error entering fullscreen:', error);
        });
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
        setIsFullscreen(true);
        onEnterFullscreen?.();
      } else if ((videoRef.current as any).mozRequestFullScreen) {
        (videoRef.current as any).mozRequestFullScreen();
        setIsFullscreen(true);
        onEnterFullscreen?.();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen();
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
  
  // Enter picture-in-picture
  const enterPip = useCallback(() => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      videoRef.current.requestPictureInPicture().then(() => {
        setIsPip(true);
        onEnterPip?.();
      }).catch((error) => {
        console.error('Error entering picture-in-picture:', error);
      });
    }
  }, [onEnterPip]);
  
  // Exit picture-in-picture
  const exitPip = useCallback(() => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().then(() => {
        setIsPip(false);
        onExitPip?.();
      }).catch((error) => {
        console.error('Error exiting picture-in-picture:', error);
      });
    }
  }, [onExitPip]);
  
  // Toggle picture-in-picture
  const togglePip = useCallback(() => {
    if (isPip) {
      exitPip();
    } else {
      enterPip();
    }
  }, [isPip, enterPip, exitPip]);
  
  // Set playback rate
  const handlePlaybackRateChange = useCallback((newRate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
      onPlaybackRateChange?.(newRate);
    }
  }, [onPlaybackRateChange]);
  
  // Handle video ended
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnd?.();
    
    if (closeOnEnd) {
      modalProps.close();
    }
  }, [onEnd, closeOnEnd, modalProps]);
  
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
  
  // Listen for picture-in-picture change
  useEffect(() => {
    const handlePipChange = (e: any) => {
      setIsPip(!!document.pictureInPictureElement);
      
      if (!document.pictureInPictureElement) {
        onExitPip?.();
      }
    };
    
    if ('pictureInPictureEnabled' in document) {
      document.addEventListener('enterpictureinpicture', handlePipChange);
      document.addEventListener('leavepictureinpicture', handlePipChange);
    }
    
    return () => {
      if ('pictureInPictureEnabled' in document) {
        document.removeEventListener('enterpictureinpicture', handlePipChange);
        document.removeEventListener('leavepictureinpicture', handlePipChange);
      }
    };
  }, [onExitPip]);
  
  // Pause video when modal closes
  useEffect(() => {
    if (!modalProps.isOpen && isPlaying) {
      pause();
    }
  }, [modalProps.isOpen, isPlaying, pause]);
  
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
  
  // Get video props
  const getVideoProps = useCallback(() => {
    return {
      src,
      poster,
      autoPlay,
      loop,
      muted: isMuted,
      controls,
      ref: videoRef,
      onPlay: () => {
        setIsPlaying(true);
        onPlay?.();
      },
      onPause: () => {
        setIsPlaying(false);
        onPause?.();
      },
      onEnded: handleEnded,
      onTimeUpdate: () => {
        if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
          onTimeUpdate?.(videoRef.current.currentTime);
        }
      },
      onVolumeChange: () => {
        if (videoRef.current) {
          setVolume(videoRef.current.volume);
          setIsMuted(videoRef.current.muted);
          onVolumeChange?.(videoRef.current.volume, videoRef.current.muted);
        }
      },
      onLoadedMetadata: () => {
        if (videoRef.current) {
          setDuration(videoRef.current.duration);
        }
      },
    };
  }, [
    src, 
    poster, 
    autoPlay, 
    loop, 
    isMuted, 
    controls, 
    onPlay, 
    onPause, 
    handleEnded, 
    onTimeUpdate, 
    onVolumeChange
  ]);
  
  // Get play/pause button props
  const getPlayPauseButtonProps = useCallback(() => {
    return {
      onClick: togglePlay,
      'aria-label': isPlaying ? 'Pause' : 'Play',
      'aria-pressed': isPlaying,
    };
  }, [togglePlay, isPlaying]);
  
  // Get mute button props
  const getMuteButtonProps = useCallback(() => {
    return {
      onClick: toggleMute,
      'aria-label': isMuted ? 'Unmute' : 'Mute',
      'aria-pressed': isMuted,
    };
  }, [toggleMute, isMuted]);
  
  // Get volume control props
  const getVolumeControlProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
      value: volume,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleVolumeChange(parseFloat(e.target.value));
      },
      'aria-label': 'Volume',
    };
  }, [volume, handleVolumeChange]);
  
  // Get progress bar props
  const getProgressBarProps = useCallback(() => {
    return {
      type: 'range',
      min: 0,
      max: duration,
      step: 0.01,
      value: currentTime,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        handleTimeChange(parseFloat(e.target.value));
      },
      'aria-label': 'Progress',
    };
  }, [duration, currentTime, handleTimeChange]);
  
  // Get fullscreen button props
  const getFullscreenButtonProps = useCallback(() => {
    return {
      onClick: toggleFullscreen,
      'aria-label': isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen',
      'aria-pressed': isFullscreen,
    };
  }, [toggleFullscreen, isFullscreen]);
  
  // Get picture-in-picture button props
  const getPipButtonProps = useCallback(() => {
    return {
      onClick: togglePip,
      'aria-label': isPip ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture',
      'aria-pressed': isPip,
    };
  }, [togglePip, isPip]);
  
  // Get playback rate control props
  const getPlaybackRateControlProps = useCallback((rates?: number[]) => {
    return {
      value: playbackRate,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        handlePlaybackRateChange(parseFloat(e.target.value));
      },
      'aria-label': 'Playback Rate',
    };
  }, [playbackRate, handlePlaybackRateChange]);

  // Get current time props
  const getCurrentTimeProps = useCallback((format?: (time: number) => string) => {
    const formatter = format || formatTime;
    return {
      children: formatter(currentTime),
    };
  }, [currentTime]);

  // Get duration props
  const getDurationProps = useCallback((format?: (time: number) => string) => {
    const formatter = format || formatTime;
    return {
      children: formatter(duration),
    };
  }, [duration]);

  // Get controls props
  const getControlsProps = useCallback(() => {
    return {
      role: 'group',
    };
  }, []);

  return {
    isOpen: modalProps.isOpen,
    open: modalProps.open,
    close: modalProps.close,
    toggle: modalProps.toggle,
    src,
    setSrc,
    poster,
    setPoster,
    isPlaying,
    play,
    pause,
    togglePlay,
    isMuted,
    mute,
    unmute,
    toggleMute,
    volume,
    setVolume: handleVolumeChange,
    currentTime,
    setCurrentTime: handleTimeChange,
    duration,
    progress,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    isPip,
    enterPip,
    exitPip,
    togglePip,
    playbackRate,
    setPlaybackRate: handlePlaybackRateChange,
    containerRef,
    videoRef,
    getContainerProps,
    getBackdropProps,
    getContentProps,
    getTriggerProps,
    getCloseButtonProps,
    getVideoProps,
    getPlayPauseButtonProps,
    getMuteButtonProps,
    getVolumeControlProps,
    getProgressBarProps,
    getFullscreenButtonProps,
    getPipButtonProps,
    getPlaybackRateControlProps,
    getCurrentTimeProps,
    getDurationProps,
    getControlsProps,
  };
}

export default useVideoPlayerModal;
