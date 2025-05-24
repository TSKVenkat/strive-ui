import { useState, useRef, useCallback, useEffect } from 'react';

export interface VoiceSearchOptions {
  /**
   * Language for speech recognition
   */
  language?: string;
  /**
   * Whether to continuously listen for speech
   */
  continuous?: boolean;
  /**
   * Whether to return interim results
   */
  interimResults?: boolean;
  /**
   * Maximum number of alternatives to return
   */
  maxAlternatives?: number;
  /**
   * Whether to auto-start listening
   */
  autoStart?: boolean;
  /**
   * Timeout in milliseconds after which to stop listening if no speech is detected
   */
  silenceTimeout?: number;
  /**
   * Callback when speech is recognized
   */
  onResult?: (result: SpeechRecognitionResult, isFinal: boolean) => void;
  /**
   * Callback when speech recognition starts
   */
  onStart?: () => void;
  /**
   * Callback when speech recognition ends
   */
  onEnd?: () => void;
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
  /**
   * Callback when no speech is detected within the silence timeout
   */
  onSilence?: () => void;
  /**
   * Callback when speech recognition is not supported
   */
  onNotSupported?: () => void;
}

export interface SpeechRecognitionResult {
  /**
   * Transcript of the recognized speech
   */
  transcript: string;
  /**
   * Confidence score (0-1)
   */
  confidence: number;
  /**
   * Alternative transcripts
   */
  alternatives?: Array<{
    transcript: string;
    confidence: number;
  }>;
  /**
   * Whether this is a final result
   */
  isFinal: boolean;
}

export interface UseVoiceSearchReturn {
  /**
   * Whether speech recognition is supported
   */
  isSupported: boolean;
  /**
   * Whether speech recognition is listening
   */
  isListening: boolean;
  /**
   * Current transcript
   */
  transcript: string;
  /**
   * Final transcript (only includes final results)
   */
  finalTranscript: string;
  /**
   * Interim transcript (only includes interim results)
   */
  interimTranscript: string;
  /**
   * Current recognition result
   */
  result: SpeechRecognitionResult | null;
  /**
   * All recognition results
   */
  results: SpeechRecognitionResult[];
  /**
   * Error if any
   */
  error: Error | null;
  /**
   * Start listening
   */
  startListening: () => void;
  /**
   * Stop listening
   */
  stopListening: () => void;
  /**
   * Reset all results
   */
  resetResults: () => void;
  /**
   * Abort current recognition
   */
  abortListening: () => void;
  /**
   * Get props for the microphone button
   */
  getMicrophoneProps: () => {
    onClick: () => void;
    disabled: boolean;
    'aria-pressed': boolean;
  };
}

/**
 * Hook for creating a voice search interface
 */
export function useVoiceSearch(options: VoiceSearchOptions = {}): UseVoiceSearchReturn {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    maxAlternatives = 1,
    autoStart = false,
    silenceTimeout = 5000,
    onResult,
    onStart,
    onEnd,
    onError,
    onSilence,
    onNotSupported,
  } = options;

  // Check if SpeechRecognition is supported
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [result, setResult] = useState<SpeechRecognitionResult | null>(null);
  const [results, setResults] = useState<SpeechRecognitionResult[]>([]);
  const [error, setError] = useState<Error | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) {
      setError(new Error('Speech recognition is not supported in this browser.'));
      onNotSupported?.();
      return;
    }

    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = language;
      recognitionRef.current.continuous = continuous;
      recognitionRef.current.interimResults = interimResults;
      recognitionRef.current.maxAlternatives = maxAlternatives;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    }

    return () => {
      if (recognitionRef.current) {
        stopListening();
      }
    };
  }, [isSupported, language, continuous, interimResults, maxAlternatives, onNotSupported, onError]);

  // Auto-start listening if enabled
  useEffect(() => {
    if (autoStart && isSupported && !isListening) {
      startListening();
    }
  }, [autoStart, isSupported]);

  // Reset silence timeout when listening status changes
  useEffect(() => {
    if (isListening) {
      resetSilenceTimeout();
    } else {
      clearSilenceTimeout();
    }
  }, [isListening]);

  // Clear silence timeout
  const clearSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  // Reset silence timeout
  const resetSilenceTimeout = useCallback(() => {
    clearSilenceTimeout();
    
    if (silenceTimeout > 0) {
      silenceTimeoutRef.current = setTimeout(() => {
        onSilence?.();
        stopListening();
      }, silenceTimeout);
    }
  }, [silenceTimeout, onSilence, clearSilenceTimeout]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      return;
    }

    try {
      setError(null);
      
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = language;
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;
        recognitionRef.current.maxAlternatives = maxAlternatives;
      }
      
      // Set up event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        onStart?.();
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        clearSilenceTimeout();
        onEnd?.();
        
        // Restart if continuous is true and we didn't manually stop
        if (continuous && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        const errorMessage = event.error || 'Unknown speech recognition error';
        const error = new Error(errorMessage);
        setError(error);
        onError?.(error);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        resetSilenceTimeout();
        
        let interimText = '';
        let finalText = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const isFinal = result.isFinal;
          const transcript = result[0].transcript.trim();
          const confidence = result[0].confidence;
          
          // Build alternatives
          const alternatives = [];
          if (maxAlternatives > 1) {
            for (let j = 1; j < result.length; j++) {
              alternatives.push({
                transcript: result[j].transcript.trim(),
                confidence: result[j].confidence,
              });
            }
          }
          
          // Create result object
          const recognitionResult: SpeechRecognitionResult = {
            transcript,
            confidence,
            alternatives: alternatives.length > 0 ? alternatives : undefined,
            isFinal,
          };
          
          // Update state
          if (isFinal) {
            finalText += transcript + ' ';
            setResults(prev => [...prev, recognitionResult]);
          } else {
            interimText += transcript + ' ';
          }
          
          setResult(recognitionResult);
          onResult?.(recognitionResult, isFinal);
        }
        
        // Update transcripts
        if (finalText) {
          setFinalTranscript(prev => prev + finalText);
        }
        setInterimTranscript(interimText);
        setTranscript(finalTranscript + finalText + interimText);
      };
      
      // Start recognition
      recognitionRef.current.start();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsListening(false);
      onError?.(error);
    }
  }, [
    isSupported,
    language,
    continuous,
    interimResults,
    maxAlternatives,
    onStart,
    onEnd,
    onError,
    onResult,
    resetSilenceTimeout,
    clearSilenceTimeout,
    finalTranscript
  ]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
    }
    
    clearSilenceTimeout();
    setIsListening(false);
  }, [clearSilenceTimeout]);

  // Abort listening
  const abortListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (err) {
        console.warn('Error aborting speech recognition:', err);
      }
    }
    
    clearSilenceTimeout();
    setIsListening(false);
  }, [clearSilenceTimeout]);

  // Reset results
  const resetResults = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
    setInterimTranscript('');
    setResult(null);
    setResults([]);
  }, []);

  // Get props for the microphone button
  const getMicrophoneProps = useCallback(() => {
    return {
      onClick: isListening ? stopListening : startListening,
      disabled: !isSupported,
      'aria-pressed': isListening,
    };
  }, [isSupported, isListening, startListening, stopListening]);

  return {
    isSupported,
    isListening,
    transcript,
    finalTranscript,
    interimTranscript,
    result,
    results,
    error,
    startListening,
    stopListening,
    resetResults,
    abortListening,
    getMicrophoneProps,
  };
}

export default useVoiceSearch;
