import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useVideoPlayerModal, 
  UseVideoPlayerModalReturn, 
  VideoPlayerModalOptions
} from './useVideoPlayerModal';
import { PolymorphicComponentPropsWithRef } from '../../../types/polymorphic';

// Context for the VideoPlayerModal component
interface VideoPlayerModalContextValue extends UseVideoPlayerModalReturn {}

const VideoPlayerModalContext = createContext<VideoPlayerModalContextValue | null>(null);

// Hook to use VideoPlayerModal context
export function useVideoPlayerModalContext() {
  const context = useContext(VideoPlayerModalContext);
  if (!context) {
    throw new Error('useVideoPlayerModalContext must be used within a VideoPlayerModalHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends VideoPlayerModalOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const videoPlayerModalProps = useVideoPlayerModal(options);
    
    return (
      <VideoPlayerModalContext.Provider value={videoPlayerModalProps}>
        <div ref={ref}>
          {children}
        </div>
      </VideoPlayerModalContext.Provider>
    );
  }
);

Root.displayName = 'VideoPlayerModalHeadless.Root';

// Trigger component props
export type TriggerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Trigger component
const TriggerComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'button';
  const { getTriggerProps } = useVideoPlayerModalContext();
  
  const triggerProps = getTriggerProps();
  
  return (
    <Component 
      {...triggerProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

TriggerComponent.displayName = 'VideoPlayerModalHeadless.Trigger';

const Trigger = TriggerComponent as <C extends React.ElementType = 'button'>(
  props: TriggerProps<C>
) => React.ReactElement | null;

// Portal component props
export type PortalProps = {
  /**
   * Children of the component
   */
  children: React.ReactNode;
  /**
   * ID of the element to render the portal into
   */
  portalId?: string;
  /**
   * Whether to use a portal
   */
  usePortal?: boolean;
};

// Portal component
const Portal: React.FC<PortalProps> = ({ 
  children, 
  portalId = 'video-player-modal-root',
  usePortal = true 
}) => {
  const { isOpen } = useVideoPlayerModalContext();
  
  // Create portal container if it doesn't exist
  React.useEffect(() => {
    if (!usePortal) return;
    
    let portalElement = document.getElementById(portalId);
    
    if (!portalElement) {
      portalElement = document.createElement('div');
      portalElement.id = portalId;
      document.body.appendChild(portalElement);
    }
    
    return () => {
      // Only remove the portal element if it's empty
      if (portalElement && portalElement.childNodes.length === 0) {
        portalElement.remove();
      }
    };
  }, [portalId, usePortal]);
  
  if (!isOpen) {
    return null;
  }
  
  if (!usePortal) {
    return <>{children}</>;
  }
  
  const portalElement = document.getElementById(portalId);
  
  if (!portalElement) {
    return null;
  }
  
  return createPortal(children, portalElement);
};

Portal.displayName = 'VideoPlayerModalHeadless.Portal';

// Backdrop component props
export type BackdropProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Backdrop component
const BackdropComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getBackdropProps, isOpen } = useVideoPlayerModalContext();
  
  if (!isOpen) {
    return null;
  }
  
  const backdropProps = getBackdropProps();
  
  return (
    <Component 
      {...backdropProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

BackdropComponent.displayName = 'VideoPlayerModalHeadless.Backdrop';

const Backdrop = BackdropComponent as <C extends React.ElementType = 'div'>(
  props: BackdropProps<C>
) => React.ReactElement | null;

// Container component props
export type ContainerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Container component
const ContainerComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  const { getContainerProps, isOpen } = useVideoPlayerModalContext();
  
  if (!isOpen) {
    return null;
  }
  
  const containerProps = getContainerProps();
  
  return (
    <Component 
      {...containerProps} 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

ContainerComponent.displayName = 'VideoPlayerModalHeadless.Container';

const Container = ContainerComponent as <C extends React.ElementType = 'div'>(
  props: ContainerProps<C>
) => React.ReactElement | null;

// Add proper ref types
type ElementRef<T> = T extends React.ElementType
  ? React.ComponentPropsWithRef<T>['ref']
  : never;

type MergeElementProps<T extends React.ElementType, P> = Omit<React.ComponentPropsWithRef<T>, keyof P> & P;

interface BaseProps<T extends React.ElementType> {
  as?: T;
}

// Update component props types
interface ContentProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode;
}

interface HeaderProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode;
}

interface BodyProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode;
}

interface FooterProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode;
}

interface CloseProps<T extends React.ElementType = 'button'> extends BaseProps<T> {
  children?: React.ReactNode;
}

// Content component
const ContentComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

ContentComponent.displayName = 'VideoPlayerModalHeadless.Content';

const Content = ContentComponent as <T extends React.ElementType = 'div'>(
  props: ContentProps<T> & Omit<React.ComponentPropsWithRef<T>, keyof ContentProps<T>>
) => React.ReactElement | null;

// Header component  
const HeaderComponent = React.forwardRef((props: any, ref: any) => {
  const { as, children, ...restProps } = props;
  const Component = as || 'div';
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

HeaderComponent.displayName = 'VideoPlayerModalHeadless.Header';

const Header = HeaderComponent as <T extends React.ElementType = 'div'>(
  props: HeaderProps<T> & Omit<React.ComponentPropsWithRef<T>, keyof HeaderProps<T>>
) => React.ReactElement | null;

// ... existing code ...

// Video component props
export type VideoProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Source of the video
     */
    src?: string;
    /**
     * Poster image for the video
     */
    poster?: string;
  }
>;

// Video component
const Video = forwardRef<
  HTMLVideoElement,
  VideoProps<React.ElementType>
>(({ as, src, poster, ...props }, ref) => {
    const Component = as || 'video';
    const { getVideoProps, setSrc, setPoster } = useVideoPlayerModalContext();
    
    // Set the source and poster if provided
    React.useEffect(() => {
      if (src) {
        setSrc(src);
      }
      if (poster) {
        setPoster(poster);
      }
    }, [src, poster, setSrc, setPoster]);
    
    const videoProps = getVideoProps();
    
    return (
      <Component 
        {...videoProps} 
        {...props} 
        ref={ref}
      />
    );
  }
);

Video.displayName = 'VideoPlayerModalHeadless.Video';

// PlayPauseButton component props
export type PlayPauseButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// PlayPauseButton component
const PlayPauseButton = forwardRef<
  HTMLButtonElement,
  PlayPauseButtonProps<React.ElementType>
>(({ as, children, ...props }, ref) => {
    const Component = as || 'button';
    const { getPlayPauseButtonProps, isPlaying } = useVideoPlayerModalContext();
    
    const playPauseButtonProps = getPlayPauseButtonProps();
    
    return (
      <Component 
        {...playPauseButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || (isPlaying ? 'Pause' : 'Play')}
      </Component>
    );
  }
);

PlayPauseButton.displayName = 'VideoPlayerModalHeadless.PlayPauseButton';

// MuteButton component props
export type MuteButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// MuteButton component
const MuteButton = forwardRef<
  HTMLButtonElement,
  MuteButtonProps<React.ElementType>
>(({ as, children, ...props }, ref) => {
    const Component = as || 'button';
    const { getMuteButtonProps, isMuted } = useVideoPlayerModalContext();
    
    const muteButtonProps = getMuteButtonProps();
    
    return (
      <Component 
        {...muteButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || (isMuted ? 'Unmute' : 'Mute')}
      </Component>
    );
  }
);

MuteButton.displayName = 'VideoPlayerModalHeadless.MuteButton';

// VolumeControl component props
export type VolumeControlProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the volume control
     */
    label?: string;
  }
>;

// VolumeControl component
const VolumeControl = forwardRef<
  HTMLInputElement,
  VolumeControlProps<React.ElementType>
>(({ as, label = 'Volume', ...props }, ref) => {
    const Component = as || 'input';
    const { getVolumeControlProps } = useVideoPlayerModalContext();
    
    const volumeControlProps = getVolumeControlProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...volumeControlProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

VolumeControl.displayName = 'VideoPlayerModalHeadless.VolumeControl';

// ProgressBar component props
export type ProgressBarProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
  T,
  {
    /**
     * Label for the progress bar
     */
    label?: string;
  }
>;

// ProgressBar component
const ProgressBarComponent = React.forwardRef((props: any, ref: any) => {
  const { as, label, ...restProps } = props;
  const Component = as || 'input';
  const { currentTime, duration, setCurrentTime } = useVideoPlayerModalContext();
  
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <Component
      type="range"
      min="0"
      max="100"
      value={progress}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = parseFloat(e.target.value);
        const newTime = (newProgress / 100) * duration;
        setCurrentTime(newTime);
      }}
      aria-label={label || 'Video progress'}
      {...restProps}
      ref={ref}
    />
  );
});

ProgressBarComponent.displayName = 'VideoPlayerModalHeadless.ProgressBar';

const ProgressBar = ProgressBarComponent as <T extends React.ElementType = 'input'>(
  props: ProgressBarProps<T> & Omit<React.ComponentPropsWithRef<T>, keyof ProgressBarProps<T>>
) => React.ReactElement | null;

// CurrentTime component props
export type CurrentTimeProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
  T,
  {
    /**
     * Format for the current time
     */
    format?: (time: number) => string;
  }
>;

// CurrentTime component
const CurrentTimeComponent = React.forwardRef((props: any, ref: any) => {
  const { as, format, ...restProps } = props;
  const Component = as || 'span';
  const { currentTime } = useVideoPlayerModalContext();
  
  const formatTime = format || ((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {formatTime(currentTime)}
    </Component>
  );
});

CurrentTimeComponent.displayName = 'VideoPlayerModalHeadless.CurrentTime';

const CurrentTime = CurrentTimeComponent as <T extends React.ElementType = 'span'>(
  props: CurrentTimeProps<T> & Omit<React.ComponentPropsWithRef<T>, keyof CurrentTimeProps<T>>
) => React.ReactElement | null;

// Duration component props
export type DurationProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
  T,
  {
    /**
     * Format for the duration
     */
    format?: (time: number) => string;
  }
>;

// Duration component
const DurationComponent = React.forwardRef((props: any, ref: any) => {
  const { as, format, ...restProps } = props;
  const Component = as || 'span';
  const { duration } = useVideoPlayerModalContext();
  
  const formatTime = format || ((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });
  
  return (
    <Component 
      {...restProps} 
      ref={ref}
    >
      {formatTime(duration)}
    </Component>
  );
});

DurationComponent.displayName = 'VideoPlayerModalHeadless.Duration';

const Duration = DurationComponent as <T extends React.ElementType = 'span'>(
  props: DurationProps<T> & Omit<React.ComponentPropsWithRef<T>, keyof DurationProps<T>>
) => React.ReactElement | null;

// FullscreenButton component props
export type FullscreenButtonProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
  T,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// FullscreenButton component
export const FullscreenButton = forwardRef<HTMLButtonElement, FullscreenButtonProps<'button'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'button') as 'button';
    const { getFullscreenButtonProps } = useVideoPlayerModalContext();
    const buttonProps = getFullscreenButtonProps();
    return <Component ref={ref} {...buttonProps} {...props}>{children}</Component>;
  }
);

// PipButton component props
export type PipButtonProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
  T,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// PipButton component
export const PipButton = forwardRef<HTMLButtonElement, PipButtonProps<'button'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'button') as 'button';
    const { getPipButtonProps } = useVideoPlayerModalContext();
    const buttonProps = getPipButtonProps();
    return <Component ref={ref} {...buttonProps} {...props}>{children}</Component>;
  }
);

// PlaybackRateControl component props
export type PlaybackRateControlProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
  T,
  {
    /**
     * Label for the playback rate control
     */
    label?: string;
    /**
     * Available playback rates
     */
    rates?: number[];
  }
>;

// PlaybackRateControl component
export const PlaybackRateControl = forwardRef<HTMLSelectElement, PlaybackRateControlProps<'select'>>(
  ({ as, label = 'Playback Rate', rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2], ...props }, ref) => {
    const Component = (as || 'select') as 'select';
    const { getPlaybackRateControlProps } = useVideoPlayerModalContext();
    const controlProps = getPlaybackRateControlProps(rates);
    return <Component ref={ref} {...controlProps} {...props} aria-label={label} />;
  }
);

// Controls component props
export type ControlsProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
  T,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Controls component
export const Controls = forwardRef<HTMLDivElement, ControlsProps<'div'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'div') as 'div';
    const { getControlsProps } = useVideoPlayerModalContext();
    const controlsProps = getControlsProps();
    return <Component ref={ref} {...controlsProps} {...props}>{children}</Component>;
  }
);

// Body component
export const Body = forwardRef<HTMLDivElement, { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return <div ref={ref} {...props}>{children}</div>;
  }
);

// Footer component
export const Footer = forwardRef<HTMLDivElement, { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => {
    return <div ref={ref} {...props}>{children}</div>;
  }
);

// Close component
export const Close = forwardRef<HTMLButtonElement, { children?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => {
    const { getCloseButtonProps } = useVideoPlayerModalContext();
    const closeProps = getCloseButtonProps();
    return <button ref={ref} {...closeProps} {...props}>{children}</button>;
  }
);

// Export all components
export const VideoPlayerModalHeadless = {
  Root,
  Trigger,
  Portal,
  Backdrop,
  Container,
  Content,
  Header,
  Body,
  Footer,
  Close,
  Video,
  PlayPauseButton,
  MuteButton,
  VolumeControl,
  ProgressBar,
  CurrentTime,
  Duration,
  FullscreenButton,
  PipButton,
  PlaybackRateControl,
  Controls,
  useVideoPlayerModalContext,
};

export default VideoPlayerModalHeadless;
