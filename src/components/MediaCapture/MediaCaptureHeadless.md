# MediaCaptureHeadless

A headless component for creating customizable media capture experiences including camera, audio, and screen recording.

## Usage

```jsx
import { MediaCaptureHeadless } from 'pulseui';

function MyCameraApp() {
  const handleCapture = (data, type) => {
    if (type === 'camera') {
      // Handle captured image
      const img = document.createElement('img');
      img.src = data;
      document.body.appendChild(img);
    } else {
      // Handle recorded video
      const url = URL.createObjectURL(data);
      const video = document.createElement('video');
      video.src = url;
      video.controls = true;
      document.body.appendChild(video);
    }
  };

  return (
    <MediaCaptureHeadless.Root 
      mediaType="camera"
      cameraFacing="user"
      cameraResolution="hd"
      enableAudio={true}
      onCapture={handleCapture}
    >
      <MediaCaptureHeadless.Video style={{ width: '100%', maxWidth: '500px' }} />
      <MediaCaptureHeadless.Canvas />
      
      <MediaCaptureHeadless.Controls>
        {({ 
          startStream, 
          stopStream, 
          startRecording, 
          stopRecording, 
          captureFrame,
          recordingState, 
          isProcessing 
        }) => (
          <div>
            {!recordingState || recordingState === 'inactive' ? (
              <>
                <button onClick={startStream} disabled={isProcessing}>Start Camera</button>
                <button onClick={startRecording} disabled={isProcessing}>Record Video</button>
                <button onClick={captureFrame} disabled={isProcessing}>Take Photo</button>
              </>
            ) : (
              <button onClick={stopRecording} disabled={isProcessing}>Stop Recording</button>
            )}
            <button onClick={stopStream}>Stop Camera</button>
          </div>
        )}
      </MediaCaptureHeadless.Controls>
      
      <MediaCaptureHeadless.Timer />
      
      <MediaCaptureHeadless.Loading>
        <div>Processing...</div>
      </MediaCaptureHeadless.Loading>
      
      <MediaCaptureHeadless.Error>
        {({ error }) => <div>Error: {error.message}</div>}
      </MediaCaptureHeadless.Error>
    </MediaCaptureHeadless.Root>
  );
}
```

## API

### MediaCaptureHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mediaType` | `'camera' \| 'audio' \| 'screen' \| 'screenWithAudio'` | `'camera'` | Type of media to capture |
| `cameraFacing` | `'user' \| 'environment'` | `'user'` | Camera facing mode (front or back) |
| `cameraResolution` | `'qvga' \| 'vga' \| 'hd' \| 'fullHd' \| '4k' \| 'custom'` | `'hd'` | Camera resolution preset |
| `customWidth` | `number` | - | Custom width for camera |
| `customHeight` | `number` | - | Custom height for camera |
| `audioQuality` | `'low' \| 'medium' \| 'high'` | `'medium'` | Audio quality preset |
| `enableAudio` | `boolean` | `true` | Whether to enable audio when capturing video |
| `format` | `'webm' \| 'mp4' \| 'png' \| 'jpeg' \| 'gif' \| 'wav' \| 'mp3'` | `'webm'` | Format for captured media |
| `maxRecordingTime` | `number` | `0` | Maximum recording time in seconds (0 for unlimited) |
| `mirrorCamera` | `boolean` | `true` | Whether to mirror the camera feed (for front-facing camera) |
| `enableFlash` | `boolean` | `false` | Whether to enable flash (if available) |
| `autoStart` | `boolean` | `false` | Whether to auto-start capture when component mounts |
| `onStreamReady` | `(stream: MediaStream) => void` | - | Callback when media stream is ready |
| `onCaptureStart` | `() => void` | - | Callback when media capture starts |
| `onCaptureStop` | `() => void` | - | Callback when media capture stops |
| `onCapture` | `(data: Blob \| string, type: MediaType) => void` | - | Callback when media is captured |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |
| `onTimeUpdate` | `(currentTime: number) => void` | - | Callback when recording time updates |

### Other Components

- `MediaCaptureHeadless.Video`: Renders the video preview for camera or screen capture
- `MediaCaptureHeadless.Audio`: Renders the audio element for audio capture
- `MediaCaptureHeadless.Canvas`: Hidden canvas element used for image capture
- `MediaCaptureHeadless.Controls`: Provides access to control functions
- `MediaCaptureHeadless.Timer`: Displays recording time
- `MediaCaptureHeadless.Error`: Displays error messages
- `MediaCaptureHeadless.Loading`: Displays during processing operations

### useMediaCapture Hook

For even more control, you can use the `useMediaCapture` hook directly:

```jsx
import { useMediaCapture } from 'pulseui';

function MyCustomMediaCapture() {
  const {
    stream,
    recordingState,
    startStream,
    stopStream,
    startRecording,
    stopRecording,
    captureFrame,
    // ...other properties and methods
  } = useMediaCapture({
    mediaType: 'camera',
    cameraResolution: 'hd',
  });
  
  // Custom implementation
}
```
