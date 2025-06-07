# VideoPlayerModalHeadless

A headless component for creating customizable video player modals with extensive flexibility for developers. The video player modal allows users to play videos with various controls and features.

## Usage

```jsx
import { VideoPlayerModalHeadless } from 'pulseui';

function MyVideoPlayer() {
  return (
    <VideoPlayerModalHeadless.Root
      src="https://example.com/video.mp4"
      poster="https://example.com/poster.jpg"
      autoPlay={false}
      loop={false}
      muted={false}
      controls={false}
      onPlay={() => console.log('Video started playing')}
      onPause={() => console.log('Video paused')}
      onEnd={() => console.log('Video ended')}
    >
      <VideoPlayerModalHeadless.Trigger
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Play Video
      </VideoPlayerModalHeadless.Trigger>
      
      <VideoPlayerModalHeadless.Portal>
        <VideoPlayerModalHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000
          }}
        />
        
        <VideoPlayerModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '800px',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <VideoPlayerModalHeadless.Content>
            <VideoPlayerModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '8px'
              }}
            >
              <VideoPlayerModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </VideoPlayerModalHeadless.Close>
            </VideoPlayerModalHeadless.Header>
            
            <VideoPlayerModalHeadless.Body
              style={{
                position: 'relative'
              }}
            >
              <VideoPlayerModalHeadless.Video
                style={{
                  width: '100%',
                  display: 'block'
                }}
              />
              
              <VideoPlayerModalHeadless.Controls
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px',
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <VideoPlayerModalHeadless.CurrentTime
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      minWidth: '40px'
                    }}
                  />
                  
                  <VideoPlayerModalHeadless.ProgressBar
                    label=""
                    style={{
                      flex: 1,
                      height: '4px',
                      appearance: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  />
                  
                  <VideoPlayerModalHeadless.Duration
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      minWidth: '40px',
                      textAlign: 'right'
                    }}
                  />
                </div>
                
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <VideoPlayerModalHeadless.PlayPauseButton
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Play/Pause icon would go here */}
                    ▶/⏸
                  </VideoPlayerModalHeadless.PlayPauseButton>
                  
                  <VideoPlayerModalHeadless.MuteButton
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Mute/Unmute icon would go here */}
                    🔊/🔇
                  </VideoPlayerModalHeadless.MuteButton>
                  
                  <VideoPlayerModalHeadless.VolumeControl
                    label=""
                    style={{
                      width: '80px',
                      height: '4px',
                      appearance: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  />
                  
                  <div style={{ flex: 1 }} />
                  
                  <VideoPlayerModalHeadless.PlaybackRateControl
                    label=""
                    style={{
                      background: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      padding: '2px 4px',
                      borderRadius: '2px',
                      fontSize: '12px'
                    }}
                  />
                  
                  <VideoPlayerModalHeadless.PipButton
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}
                  >
                    PiP
                  </VideoPlayerModalHeadless.PipButton>
                  
                  <VideoPlayerModalHeadless.FullscreenButton
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Fullscreen icon would go here */}
                    ⛶
                  </VideoPlayerModalHeadless.FullscreenButton>
                </div>
              </VideoPlayerModalHeadless.Controls>
            </VideoPlayerModalHeadless.Body>
          </VideoPlayerModalHeadless.Content>
        </VideoPlayerModalHeadless.Container>
      </VideoPlayerModalHeadless.Portal>
    </VideoPlayerModalHeadless.Root>
  );
}
```

## Creating a Reusable Video Player Modal

```jsx
import { VideoPlayerModalHeadless } from 'pulseui';

function CustomVideoPlayer({ 
  isOpen, 
  onClose, 
  videoSrc, 
  posterSrc,
  title = 'Video Player'
}) {
  return (
    <VideoPlayerModalHeadless.Root
      open={isOpen}
      onClose={onClose}
      src={videoSrc}
      poster={posterSrc}
      closeOnEnd={true}
    >
      <VideoPlayerModalHeadless.Portal>
        <VideoPlayerModalHeadless.Backdrop
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000
          }}
        />
        
        <VideoPlayerModalHeadless.Container
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '800px',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <VideoPlayerModalHeadless.Content>
            <VideoPlayerModalHeadless.Header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }}
            >
              <h3 style={{ margin: 0, color: 'white' }}>{title}</h3>
              <VideoPlayerModalHeadless.Close
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </VideoPlayerModalHeadless.Close>
            </VideoPlayerModalHeadless.Header>
            
            <VideoPlayerModalHeadless.Body
              style={{
                position: 'relative'
              }}
            >
              <VideoPlayerModalHeadless.Video
                style={{
                  width: '100%',
                  display: 'block'
                }}
              />
              
              <VideoPlayerModalHeadless.Controls
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px',
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <VideoPlayerModalHeadless.CurrentTime
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      minWidth: '40px'
                    }}
                  />
                  
                  <VideoPlayerModalHeadless.ProgressBar
                    label=""
                    style={{
                      flex: 1,
                      height: '4px',
                      appearance: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  />
                  
                  <VideoPlayerModalHeadless.Duration
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      minWidth: '40px',
                      textAlign: 'right'
                    }}
                  />
                </div>
                
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <VideoPlayerModalHeadless.PlayPauseButton
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Play/Pause icon would go here */}
                    ▶/⏸
                  </VideoPlayerModalHeadless.PlayPauseButton>
                  
                  <VideoPlayerModalHeadless.MuteButton
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Mute/Unmute icon would go here */}
                    🔊/🔇
                  </VideoPlayerModalHeadless.MuteButton>
                  
                  <VideoPlayerModalHeadless.VolumeControl
                    label=""
                    style={{
                      width: '80px',
                      height: '4px',
                      appearance: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      borderRadius: '2px',
                      outline: 'none'
                    }}
                  />
                  
                  <div style={{ flex: 1 }} />
                  
                  <VideoPlayerModalHeadless.FullscreenButton
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {/* Fullscreen icon would go here */}
                    ⛶
                  </VideoPlayerModalHeadless.FullscreenButton>
                </div>
              </VideoPlayerModalHeadless.Controls>
            </VideoPlayerModalHeadless.Body>
          </VideoPlayerModalHeadless.Content>
        </VideoPlayerModalHeadless.Container>
      </VideoPlayerModalHeadless.Portal>
    </VideoPlayerModalHeadless.Root>
  );
}

// Usage
function App() {
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  
  return (
    <div>
      <button
        onClick={() => setIsVideoPlayerOpen(true)}
        style={{
          padding: '8px 16px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Watch Video
      </button>
      
      <CustomVideoPlayer
        isOpen={isVideoPlayerOpen}
        onClose={() => setIsVideoPlayerOpen(false)}
        videoSrc="https://example.com/video.mp4"
        posterSrc="https://example.com/poster.jpg"
        title="Product Demo"
      />
    </div>
  );
}
```

## API

### VideoPlayerModalHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `''` | Source of the video |
| `poster` | `string` | `''` | Poster image for the video |
| `autoPlay` | `boolean` | `false` | Whether to autoplay the video when the modal opens |
| `loop` | `boolean` | `false` | Whether to loop the video |
| `muted` | `boolean` | `false` | Whether to mute the video |
| `controls` | `boolean` | `true` | Whether to show controls |
| `showPlayPauseButton` | `boolean` | `true` | Whether to show play/pause button |
| `showMuteButton` | `boolean` | `true` | Whether to show mute button |
| `showVolumeControl` | `boolean` | `true` | Whether to show volume control |
| `showProgressBar` | `boolean` | `true` | Whether to show progress bar |
| `showCurrentTime` | `boolean` | `true` | Whether to show current time |
| `showDuration` | `boolean` | `true` | Whether to show duration |
| `showFullscreenButton` | `boolean` | `true` | Whether to show fullscreen button |
| `showPipButton` | `boolean` | `true` | Whether to show picture-in-picture button |
| `showPlaybackRateControl` | `boolean` | `true` | Whether to show playback rate control |
| `showCloseButton` | `boolean` | `true` | Whether to show close button |
| `closeOnEnd` | `boolean` | `false` | Whether to close the modal when the video ends |
| `closeOnOutsideClick` | `boolean` | `true` | Whether to close the modal when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Whether to close the modal when pressing Escape key |
| `onPlay` | `() => void` | - | Callback when the video starts playing |
| `onPause` | `() => void` | - | Callback when the video is paused |
| `onEnd` | `() => void` | - | Callback when the video ends |
| `onTimeUpdate` | `(currentTime: number) => void` | - | Callback when the video time updates |
| `onVolumeChange` | `(volume: number, muted: boolean) => void` | - | Callback when the video volume changes |
| `onEnterFullscreen` | `() => void` | - | Callback when the video enters fullscreen |
| `onExitFullscreen` | `() => void` | - | Callback when the video exits fullscreen |
| `onEnterPip` | `() => void` | - | Callback when the video enters picture-in-picture mode |
| `onExitPip` | `() => void` | - | Callback when the video exits picture-in-picture mode |
| `onPlaybackRateChange` | `(rate: number) => void` | - | Callback when the video playback rate changes |

### Other Components

- `VideoPlayerModalHeadless.Trigger`: Button that opens the video player modal
- `VideoPlayerModalHeadless.Portal`: Portal container for the video player modal
- `VideoPlayerModalHeadless.Backdrop`: Background overlay for the video player modal
- `VideoPlayerModalHeadless.Container`: Container for the video player modal
- `VideoPlayerModalHeadless.Content`: Content container for the video player modal
- `VideoPlayerModalHeadless.Header`: Header section of the video player modal
- `VideoPlayerModalHeadless.Body`: Body section of the video player modal
- `VideoPlayerModalHeadless.Footer`: Footer section of the video player modal
- `VideoPlayerModalHeadless.Close`: Button that closes the video player modal
- `VideoPlayerModalHeadless.Video`: Video element
- `VideoPlayerModalHeadless.PlayPauseButton`: Button that toggles play/pause
- `VideoPlayerModalHeadless.MuteButton`: Button that toggles mute
- `VideoPlayerModalHeadless.VolumeControl`: Control for adjusting volume
- `VideoPlayerModalHeadless.ProgressBar`: Control for seeking through the video
- `VideoPlayerModalHeadless.CurrentTime`: Display of the current time
- `VideoPlayerModalHeadless.Duration`: Display of the video duration
- `VideoPlayerModalHeadless.FullscreenButton`: Button that toggles fullscreen
- `VideoPlayerModalHeadless.PipButton`: Button that toggles picture-in-picture mode
- `VideoPlayerModalHeadless.PlaybackRateControl`: Control for adjusting playback rate
- `VideoPlayerModalHeadless.Controls`: Container for video controls

### useVideoPlayerModal Hook

For even more control, you can use the `useVideoPlayerModal` hook directly:

```jsx
import { useVideoPlayerModal } from 'pulseui';

function MyCustomVideoPlayer() {
  const {
    isOpen,
    open,
    close,
    toggle,
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
    setVolume,
    currentTime,
    setCurrentTime,
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
    setPlaybackRate,
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
  } = useVideoPlayerModal({
    src: 'https://example.com/video.mp4',
    poster: 'https://example.com/poster.jpg',
    onPlay: () => console.log('Video started playing'),
    onPause: () => console.log('Video paused'),
    onEnd: () => console.log('Video ended'),
  });
  
  // Custom implementation
}
```

## Accessibility

The Video Player Modal component follows WAI-ARIA best practices for dialogs and media players:

- The video player modal container has `role="dialog"` and `aria-modal="true"`
- Focus is trapped within the video player modal when open
- Focus is restored to the trigger element when the video player modal closes
- The escape key can be used to close the video player modal
- All buttons have appropriate ARIA labels for screen readers
- Video controls are keyboard accessible
