# VoiceSearchHeadless

A headless component for creating customizable voice search interfaces with extensive flexibility for developers.

## Usage

```jsx
import { VoiceSearchHeadless } from 'pulseui';

function MyVoiceSearch() {
  const handleResult = (result, isFinal) => {
    if (isFinal) {
      console.log('Final result:', result.transcript);
      // You could perform a search with the transcript
      // searchApi(result.transcript);
    }
  };

  return (
    <VoiceSearchHeadless.Root
      language="en-US"
      continuous={false}
      interimResults={true}
      autoStart={false}
      silenceTimeout={5000}
      onResult={handleResult}
    >
      <div className="voice-search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            readOnly
            value={
              <VoiceSearchHeadless.Transcript>
                {({ transcript }) => transcript}
              </VoiceSearchHeadless.Transcript>
            }
          />
          
          <VoiceSearchHeadless.Microphone>
            {({ isListening, isSupported }) => (
              <button 
                className={`mic-button ${isListening ? 'listening' : ''}`}
                disabled={!isSupported}
              >
                {isListening ? 'Stop' : 'Start'} Voice Search
              </button>
            )}
          </VoiceSearchHeadless.Microphone>
        </div>
        
        <VoiceSearchHeadless.Status>
          {({ isListening, isSupported }) => (
            <div className="status">
              {!isSupported && (
                <p className="error">Voice recognition is not supported in your browser.</p>
              )}
              {isSupported && isListening && (
                <p className="listening">Listening...</p>
              )}
            </div>
          )}
        </VoiceSearchHeadless.Status>
        
        <VoiceSearchHeadless.Listening>
          <div className="listening-indicator">
            <div className="pulse"></div>
            <p>Speak now...</p>
          </div>
        </VoiceSearchHeadless.Listening>
        
        <VoiceSearchHeadless.Error>
          {({ error }) => (
            <div className="error-message">
              Error: {error.message}
            </div>
          )}
        </VoiceSearchHeadless.Error>
        
        <VoiceSearchHeadless.Results>
          {({ results, resetResults }) => (
            <div className="results">
              {results.length > 0 && (
                <>
                  <h3>Search Results:</h3>
                  <ul>
                    {results.map((result, index) => (
                      <li key={index}>
                        <strong>{result.transcript}</strong>
                        <span className="confidence">
                          (Confidence: {Math.round(result.confidence * 100)}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={resetResults}>Clear Results</button>
                </>
              )}
            </div>
          )}
        </VoiceSearchHeadless.Results>
      </div>
    </VoiceSearchHeadless.Root>
  );
}
```

## API

### VoiceSearchHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `string` | `'en-US'` | Language for speech recognition |
| `continuous` | `boolean` | `false` | Whether to continuously listen for speech |
| `interimResults` | `boolean` | `true` | Whether to return interim results |
| `maxAlternatives` | `number` | `1` | Maximum number of alternatives to return |
| `autoStart` | `boolean` | `false` | Whether to auto-start listening |
| `silenceTimeout` | `number` | `5000` | Timeout in milliseconds after which to stop listening if no speech is detected |
| `onResult` | `(result: SpeechRecognitionResult, isFinal: boolean) => void` | - | Callback when speech is recognized |
| `onStart` | `() => void` | - | Callback when speech recognition starts |
| `onEnd` | `() => void` | - | Callback when speech recognition ends |
| `onError` | `(error: Error) => void` | - | Callback when an error occurs |
| `onSilence` | `() => void` | - | Callback when no speech is detected within the silence timeout |
| `onNotSupported` | `() => void` | - | Callback when speech recognition is not supported |

### SpeechRecognitionResult Interface

```typescript
interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  alternatives?: Array<{
    transcript: string;
    confidence: number;
  }>;
  isFinal: boolean;
}
```

### Other Components

- `VoiceSearchHeadless.Microphone`: Button to start/stop voice recognition
- `VoiceSearchHeadless.Transcript`: Displays the current transcript
- `VoiceSearchHeadless.Results`: Displays recognition results
- `VoiceSearchHeadless.Status`: Shows the current status of voice recognition
- `VoiceSearchHeadless.Error`: Displays error messages
- `VoiceSearchHeadless.NotSupported`: Renders content when voice recognition is not supported
- `VoiceSearchHeadless.Listening`: Renders content when actively listening
- `VoiceSearchHeadless.NotListening`: Renders content when not listening

### useVoiceSearch Hook

For even more control, you can use the `useVoiceSearch` hook directly:

```jsx
import { useVoiceSearch } from 'pulseui';

function MyCustomVoiceSearch() {
  const {
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    interimTranscript,
    result,
    results,
    startListening,
    stopListening,
    resetResults,
    // ...other properties and methods
  } = useVoiceSearch({
    language: 'en-US',
    continuous: false,
    interimResults: true,
  });
  
  // Custom implementation
}
```

## Browser Support

The Web Speech API is not supported in all browsers. It works in:

- Chrome (desktop and Android)
- Edge
- Safari (iOS and macOS)
- Firefox (with flags)

For production applications, consider implementing a fallback mechanism for browsers that don't support the Web Speech API.
