import React, { createContext, useContext, forwardRef } from 'react';
import { useMediaCapture, UseMediaCaptureReturn, MediaCaptureOptions, MediaType } from './useMediaCapture';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the MediaCapture component
interface MediaCaptureContextValue extends UseMediaCaptureReturn {}

const MediaCaptureContext = createContext<MediaCaptureContextValue | null>(null);

// Hook to use MediaCapture context
export function useMediaCaptureContext() {
  const context = useContext(MediaCaptureContext);
  if (!context) {
    throw new Error('useMediaCaptureContext must be used within a MediaCaptureHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends MediaCaptureOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const mediaCaptureProps = useMediaCapture(options);
    
    return (
      <MediaCaptureContext.Provider value={mediaCaptureProps}>
        <div ref={ref}>
          {children}
        </div>
      </MediaCaptureContext.Provider>
    );
  }
);

Root.displayName = 'MediaCaptureHeadless.Root';

// Video component props
export type VideoProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Video component
const Video = forwardRef(
  <C extends React.ElementType = 'video'>(
    { as, children, ...props }: VideoProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'video';
    const { getVideoProps, mediaType } = useMediaCaptureContext();
    
    // Only render for camera or screen capture
    if (mediaType !== 'camera' && mediaType !== 'screen' && mediaType !== 'screenWithAudio') {
      return null;
    }
    
    const videoProps = getVideoProps();
    
    return (
      <Component 
        {...videoProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Video.displayName = 'MediaCaptureHeadless.Video';

// Audio component props
export type AudioProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Audio component
const Audio = forwardRef(
  <C extends React.ElementType = 'audio'>(
    { as, children, ...props }: AudioProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'audio';
    const { getAudioProps, mediaType } = useMediaCaptureContext();
    
    // Only render for audio capture
    if (mediaType !== 'audio') {
      return null;
    }
    
    const audioProps = getAudioProps();
    
    return (
      <Component 
        {...audioProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Audio.displayName = 'MediaCaptureHeadless.Audio';

// Canvas component props
export type CanvasProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Canvas component
const Canvas = forwardRef(
  <C extends React.ElementType = 'canvas'>(
    { as, children, ...props }: CanvasProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'canvas';
    const { getCanvasProps } = useMediaCaptureContext();
    
    const canvasProps = getCanvasProps();
    
    return (
      <Component 
        {...canvasProps} 
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Canvas.displayName = 'MediaCaptureHeadless.Canvas';

// Controls component props
export type ControlsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      startStream: () => Promise<void>;
      stopStream: () => void;
      startRecording: () => void;
      stopRecording: () => void;
      pauseRecording: () => void;
      resumeRecording: () => void;
      captureFrame: () => void;
      toggleCameraFacing: () => void;
      toggleFlash: () => void;
      recordingState: string;
      recordingTime: number;
      isProcessing: boolean;
    }) => React.ReactNode);
  }
>;

// Controls component
const Controls = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ControlsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { 
      startStream,
      stopStream,
      startRecording,
      stopRecording,
      pauseRecording,
      resumeRecording,
      captureFrame,
      toggleCameraFacing,
      toggleFlash,
      recordingState,
      recordingTime,
      isProcessing
    } = useMediaCaptureContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ 
              startStream,
              stopStream,
              startRecording,
              stopRecording,
              pauseRecording,
              resumeRecording,
              captureFrame,
              toggleCameraFacing,
              toggleFlash,
              recordingState,
              recordingTime,
              isProcessing
            }) 
          : children}
      </Component>
    );
  }
);

Controls.displayName = 'MediaCaptureHeadless.Controls';

// Timer component props
export type TimerProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: {
      recordingTime: number;
      formattedTime: string;
    }) => React.ReactNode);
  }
>;

// Timer component
const Timer = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: TimerProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { recordingTime, recordingState } = useMediaCaptureContext();
    
    // Only render when recording
    if (recordingState === 'inactive') {
      return null;
    }
    
    // Format time as MM:SS
    const minutes = Math.floor(recordingTime / 60);
    const seconds = recordingTime % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ recordingTime, formattedTime }) 
          : children || formattedTime}
      </Component>
    );
  }
);

Timer.displayName = 'MediaCaptureHeadless.Timer';

// Error component props
export type ErrorProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      error: Error;
    }) => React.ReactNode);
  }
>;

// Error component
const Error = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ErrorProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { error } = useMediaCaptureContext();
    
    if (!error) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ error }) 
          : children || error.message}
      </Component>
    );
  }
);

Error.displayName = 'MediaCaptureHeadless.Error';

// Loading component props
export type LoadingProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Loading component
const Loading = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: LoadingProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isProcessing } = useMediaCaptureContext();
    
    if (!isProcessing) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

Loading.displayName = 'MediaCaptureHeadless.Loading';

// Export all components
export const MediaCaptureHeadless = {
  Root,
  Video,
  Audio,
  Canvas,
  Controls,
  Timer,
  Error,
  Loading,
  useMediaCaptureContext,
};

export default MediaCaptureHeadless;
