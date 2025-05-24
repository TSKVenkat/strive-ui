import { useState, useCallback, useRef, useEffect } from 'react';

export interface ConfettiParticle {
  /**
   * X position of the particle
   */
  x: number;
  /**
   * Y position of the particle
   */
  y: number;
  /**
   * X velocity of the particle
   */
  vx: number;
  /**
   * Y velocity of the particle
   */
  vy: number;
  /**
   * Rotation of the particle
   */
  rotation: number;
  /**
   * Rotation velocity of the particle
   */
  rotationVelocity: number;
  /**
   * Width of the particle
   */
  width: number;
  /**
   * Height of the particle
   */
  height: number;
  /**
   * Color of the particle
   */
  color: string;
  /**
   * Shape of the particle
   */
  shape: 'square' | 'circle' | 'rectangle' | 'triangle';
  /**
   * Opacity of the particle
   */
  opacity: number;
}

export interface ConfettiOptions {
  /**
   * Whether the confetti is active
   */
  active?: boolean;
  /**
   * Duration of the confetti animation in milliseconds
   */
  duration?: number;
  /**
   * Number of particles to show
   */
  particleCount?: number;
  /**
   * Gravity factor (affects falling speed)
   */
  gravity?: number;
  /**
   * Wind factor (affects horizontal movement)
   */
  wind?: number;
  /**
   * Colors to use for the particles
   */
  colors?: string[];
  /**
   * Shapes to use for the particles
   */
  shapes?: Array<'square' | 'circle' | 'rectangle' | 'triangle'>;
  /**
   * Whether to recycle particles when they go off screen
   */
  recycle?: boolean;
  /**
   * Whether to stop creating new particles after the initial burst
   */
  stopAfterInitial?: boolean;
  /**
   * Whether to use a canvas for rendering (better performance)
   */
  useCanvas?: boolean;
  /**
   * Whether to start the animation automatically
   */
  autoStart?: boolean;
  /**
   * Callback when the animation completes
   */
  onComplete?: () => void;
}

export interface UseConfettiReturn {
  /**
   * Whether the confetti is active
   */
  active: boolean;
  /**
   * Set whether the confetti is active
   */
  setActive: (active: boolean) => void;
  /**
   * Start the confetti animation
   */
  start: () => void;
  /**
   * Stop the confetti animation
   */
  stop: () => void;
  /**
   * Reset the confetti animation
   */
  reset: () => void;
  /**
   * Particles for the confetti animation
   */
  particles: ConfettiParticle[];
  /**
   * Get props for the confetti container
   */
  getContainerProps: () => {
    role: string;
    'aria-hidden': boolean;
  };
  /**
   * Get props for the canvas element
   */
  getCanvasProps: () => {
    ref: React.RefObject<HTMLCanvasElement>;
    style: {
      position: 'fixed';
      pointerEvents: 'none';
      zIndex: number;
      top: number;
      left: number;
      width: string;
      height: string;
    };
  };
  /**
   * Canvas ref for the confetti animation
   */
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

/**
 * Hook for creating a confetti animation
 */
export function useConfetti(options: ConfettiOptions = {}): UseConfettiReturn {
  // Destructure options with defaults
  const {
    active: initialActive = false,
    duration = 5000,
    particleCount = 100,
    gravity = 0.9,
    wind = 0.1,
    colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'],
    shapes = ['square', 'circle', 'rectangle', 'triangle'],
    recycle = true,
    stopAfterInitial = false,
    useCanvas = true,
    autoStart = false,
    onComplete,
  } = options;

  // State for activity
  const [active, setActive] = useState<boolean>(initialActive || autoStart);
  
  // State for particles
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  
  // Refs for animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate a random particle
  const generateParticle = useCallback((): ConfettiParticle => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : window.innerWidth;
    const height = canvas ? canvas.height : window.innerHeight;
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    return {
      x: Math.random() * width,
      y: Math.random() * height * -0.5,
      vx: Math.random() * 10 - 5,
      vy: Math.random() * 5 + 3,
      rotation: Math.random() * 360,
      rotationVelocity: Math.random() * 10 - 5,
      width: Math.random() * 10 + 5,
      height: Math.random() * 10 + 5,
      color: randomColor,
      shape: randomShape,
      opacity: 1,
    };
  }, [colors, shapes]);
  
  // Generate particles
  const generateParticles = useCallback(() => {
    const newParticles: ConfettiParticle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push(generateParticle());
    }
    
    setParticles(newParticles);
  }, [particleCount, generateParticle]);
  
  // Update particles
  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const width = canvas ? canvas.width : window.innerWidth;
    const height = canvas ? canvas.height : window.innerHeight;
    
    setParticles(prevParticles => {
      return prevParticles.map(particle => {
        // Apply physics
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += gravity;
        particle.vx += wind;
        particle.rotation += particle.rotationVelocity;
        
        // Fade out particles
        particle.opacity -= 0.005;
        
        // Recycle particles if they go off screen
        if (recycle && (particle.y > height || particle.x < -100 || particle.x > width + 100)) {
          if (stopAfterInitial) {
            // If stopAfterInitial, just remove the particle
            particle.opacity = 0;
          } else {
            // Reset the particle
            particle.y = Math.random() * height * -0.5;
            particle.x = Math.random() * width;
            particle.vx = Math.random() * 10 - 5;
            particle.vy = Math.random() * 5 + 3;
            particle.opacity = 1;
          }
        }
        
        return particle;
      }).filter(particle => particle.opacity > 0);
    });
  }, [gravity, wind, recycle, stopAfterInitial]);
  
  // Draw particles on canvas
  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each particle
    particles.forEach(particle => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      
      // Draw shape
      switch (particle.shape) {
        case 'square':
          ctx.fillRect(-particle.width / 2, -particle.width / 2, particle.width, particle.width);
          break;
        case 'rectangle':
          ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, particle.width / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -particle.height / 2);
          ctx.lineTo(particle.width / 2, particle.height / 2);
          ctx.lineTo(-particle.width / 2, particle.height / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      ctx.restore();
    });
  }, [particles]);
  
  // Animation loop
  const animate = useCallback(() => {
    if (!active) return;
    
    updateParticles();
    
    if (useCanvas) {
      drawParticles();
    }
    
    if (particles.length > 0) {
      animationFrameId.current = requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  }, [active, updateParticles, useCanvas, drawParticles, particles, onComplete]);
  
  // Start animation
  const start = useCallback(() => {
    setActive(true);
    generateParticles();
    
    // Set timer to stop animation after duration
    if (duration > 0 && !recycle) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        stop();
      }, duration);
    }
  }, [duration, recycle, generateParticles]);
  
  // Stop animation
  const stop = useCallback(() => {
    setActive(false);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  // Reset animation
  const reset = useCallback(() => {
    stop();
    setParticles([]);
  }, [stop]);
  
  // Handle canvas resize
  const handleResize = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, []);
  
  // Initialize canvas
  useEffect(() => {
    if (useCanvas) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [useCanvas, handleResize]);
  
  // Start animation on mount if autoStart is true
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoStart, start]);
  
  // Run animation loop when active changes
  useEffect(() => {
    if (active) {
      animate();
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, [active, animate]);
  
  // Get props for the confetti container
  const getContainerProps = useCallback(() => {
    return {
      role: 'presentation',
      'aria-hidden': true,
    };
  }, []);
  
  // Get props for the canvas element
  const getCanvasProps = useCallback(() => {
    return {
      ref: canvasRef,
      style: {
        position: 'fixed' as const,
        pointerEvents: 'none' as const,
        zIndex: 9999,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      },
    };
  }, []);
  
  return {
    active,
    setActive,
    start,
    stop,
    reset,
    particles,
    getContainerProps,
    getCanvasProps,
    canvasRef,
  };
}

export default useConfetti;
