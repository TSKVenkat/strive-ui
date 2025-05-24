import React, { createContext, useContext, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  useVideoPlayerModal, 
  UseVideoPlayerModalReturn, 
  VideoPlayerModalOptions
} from './useVideoPlayerModal';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../../types/polymorphic';

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
const Trigger = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: TriggerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getTriggerProps } = useVideoPlayerModalContext();
    
    const triggerProps = getTriggerProps();
    
    return (
      <Component 
        {...triggerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Trigger.displayName = 'VideoPlayerModalHeadless.Trigger';

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
const Backdrop = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: BackdropProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getBackdropProps, isOpen } = useVideoPlayerModalContext();
    
    if (!isOpen) {
      return null;
    }
    
    const backdropProps = getBackdropProps();
    
    return (
      <Component 
        {...backdropProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Backdrop.displayName = 'VideoPlayerModalHeadless.Backdrop';

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
const Container = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContainerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContainerProps, isOpen } = useVideoPlayerModalContext();
    
    if (!isOpen) {
      return null;
    }
    
    const containerProps = getContainerProps();
    
    return (
      <Component 
        {...containerProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'VideoPlayerModalHeadless.Container';

// Content component props
export type ContentProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Content component
const Content = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ContentProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { getContentProps } = useVideoPlayerModalContext();
    
    const contentProps = getContentProps();
    
    return (
      <Component 
        {...contentProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'VideoPlayerModalHeadless.Content';

// Header component props
export type HeaderProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Header component
const Header = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: HeaderProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Header.displayName = 'VideoPlayerModalHeadless.Header';

// Body component props
export type BodyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Body component
const Body = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: BodyProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Body.displayName = 'VideoPlayerModalHeadless.Body';

// Footer component props
export type FooterProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Footer component
const Footer = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: FooterProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Footer.displayName = 'VideoPlayerModalHeadless.Footer';

// Close component props
export type CloseProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Close component
const Close = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: CloseProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getCloseButtonProps } = useVideoPlayerModalContext();
    
    const closeProps = getCloseButtonProps();
    
    return (
      <Component 
        {...closeProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Close.displayName = 'VideoPlayerModalHeadless.Close';

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
const Video = forwardRef(
  <C extends React.ElementType = 'video'>(
    { as, src, poster, ...props }: VideoProps<C>,
    ref: PolymorphicRef<C>
  ) => {
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
const PlayPauseButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: PlayPauseButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
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
const MuteButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: MuteButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
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
const VolumeControl = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Volume', ...props }: VolumeControlProps<C>,
    ref: PolymorphicRef<C>
  ) => {
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
export type ProgressBarProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Label for the progress bar
     */
    label?: string;
  }
>;

// ProgressBar component
const ProgressBar = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, label = 'Progress', ...props }: ProgressBarProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getProgressBarProps } = useVideoPlayerModalContext();
    
    const progressBarProps = getProgressBarProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...progressBarProps} 
          {...props} 
          ref={ref}
        />
      </div>
    );
  }
);

ProgressBar.displayName = 'VideoPlayerModalHeadless.ProgressBar';

// CurrentTime component props
export type CurrentTimeProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Format for the current time
     */
    format?: (time: number) => string;
  }
>;

// CurrentTime component
const CurrentTime = forwardRef(
  <C extends React.ElementType = 'span'>(
    { as, format = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, ...props }: CurrentTimeProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'span';
    const { currentTime } = useVideoPlayerModalContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {format(currentTime)}
      </Component>
    );
  }
);

CurrentTime.displayName = 'VideoPlayerModalHeadless.CurrentTime';

// Duration component props
export type DurationProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Format for the duration
     */
    format?: (time: number) => string;
  }
>;

// Duration component
const Duration = forwardRef(
  <C extends React.ElementType = 'span'>(
    { as, format = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, ...props }: DurationProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'span';
    const { duration } = useVideoPlayerModalContext();
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {format(duration)}
      </Component>
    );
  }
);

Duration.displayName = 'VideoPlayerModalHeadless.Duration';

// FullscreenButton component props
export type FullscreenButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// FullscreenButton component
const FullscreenButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: FullscreenButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getFullscreenButtonProps, isFullscreen } = useVideoPlayerModalContext();
    
    const fullscreenButtonProps = getFullscreenButtonProps();
    
    return (
      <Component 
        {...fullscreenButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || (isFullscreen ? 'Exit Fullscreen' : 'Fullscreen')}
      </Component>
    );
  }
);

FullscreenButton.displayName = 'VideoPlayerModalHeadless.FullscreenButton';

// PipButton component props
export type PipButtonProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// PipButton component
const PipButton = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: PipButtonProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { getPipButtonProps, isPip } = useVideoPlayerModalContext();
    
    const pipButtonProps = getPipButtonProps();
    
    return (
      <Component 
        {...pipButtonProps} 
        {...props} 
        ref={ref}
      >
        {children || (isPip ? 'Exit PiP' : 'PiP')}
      </Component>
    );
  }
);

PipButton.displayName = 'VideoPlayerModalHeadless.PipButton';

// PlaybackRateControl component props
export type PlaybackRateControlProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
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
const PlaybackRateControl = forwardRef(
  <C extends React.ElementType = 'select'>(
    { 
      as, 
      label = 'Speed', 
      rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      ...props 
    }: PlaybackRateControlProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'select';
    const { getPlaybackRateControlProps } = useVideoPlayerModalContext();
    
    const playbackRateControlProps = getPlaybackRateControlProps();
    
    return (
      <div>
        {label && <label>{label}</label>}
        <Component 
          {...playbackRateControlProps} 
          {...props} 
          ref={ref}
        >
          {rates.map((rate) => (
            <option key={rate} value={rate}>
              {rate}x
            </option>
          ))}
        </Component>
      </div>
    );
  }
);

PlaybackRateControl.displayName = 'VideoPlayerModalHeadless.PlaybackRateControl';

// Controls component props
export type ControlsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Controls component
const Controls = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ControlsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    
    return (
      <Component 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Controls.displayName = 'VideoPlayerModalHeadless.Controls';

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
