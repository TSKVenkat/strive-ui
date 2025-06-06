import React, { useState, useCallback, useRef, useEffect } from 'react';

// Add proper type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): BrowserSpeechRecognitionResult;
  [index: number]: BrowserSpeechRecognitionResult;
}

interface BrowserSpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

export interface VoiceSearchOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  onResult?: (results: SpeechRecognitionResult[]) => void;
  onInterimResult?: (results: SpeechRecognitionResult[]) => void;
}

export interface UseVoiceSearchReturn {
  isListening: boolean;
  isSupported: boolean;
  error: Error | null;
  results: SpeechRecognitionResult[];
  interimResults: SpeechRecognitionResult[];
  start: () => void;
  stop: () => void;
  resetResults: () => void;
}

export function useVoiceSearch({
  lang = 'en-US',
  continuous = false,
  interimResults = true,
  maxAlternatives = 1,
  onStart,
  onEnd,
  onError,
  onResult,
  onInterimResult,
}: VoiceSearchOptions = {}): UseVoiceSearchReturn {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<SpeechRecognitionResult[]>([]);
  const [interimResultsList, setInterimResultsList] = useState<SpeechRecognitionResult[]>([]);

  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  // Create speech recognition instance
  const recognition = useRef<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) {
      return;
    }

    recognition.current = new SpeechRecognition();
    recognition.current.lang = lang;
    recognition.current.continuous = continuous;
    recognition.current.interimResults = interimResults;
    recognition.current.maxAlternatives = maxAlternatives;

    recognition.current.onstart = () => {
      setIsListening(true);
      setError(null);
      onStart?.();
    };

    recognition.current.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognition.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      const error = new Error(event.message || event.error);
      setError(error);
      onError?.(error);
    };

    recognition.current.onresult = (event: SpeechRecognitionEvent) => {
      const finalResults: SpeechRecognitionResult[] = [];
      const interimResults: SpeechRecognitionResult[] = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const alternatives: SpeechRecognitionResult[] = [];

        for (let j = 0; j < result.length; j++) {
          alternatives.push({
            transcript: result[j].transcript.trim(),
            confidence: result[j].confidence,
          });
        }

        if (result.isFinal) {
          finalResults.push(...alternatives);
        } else {
          interimResults.push(...alternatives);
        }
      }

      if (finalResults.length > 0) {
        setResults(prev => [...prev, ...finalResults]);
        onResult?.(finalResults);
      }

      if (interimResults.length > 0) {
        setInterimResultsList(interimResults);
        onInterimResult?.(interimResults);
      }
    };

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, [
    isSupported,
    lang,
    continuous,
    interimResults,
    maxAlternatives,
    onStart,
    onEnd,
    onError,
    onResult,
    onInterimResult,
  ]);

  const start = useCallback(() => {
    if (!isSupported) {
      const error = new Error('Speech recognition is not supported in this browser');
      setError(error);
      onError?.(error);
      return;
    }

    if (!recognition.current) {
      return;
    }

    try {
      recognition.current.start();
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        onError?.(error);
      }
    }
  }, [isSupported, onError]);

  const stop = useCallback(() => {
    if (!recognition.current) {
      return;
    }

    try {
      recognition.current.stop();
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        onError?.(error);
      }
    }
  }, [onError]);

  const resetResults = useCallback(() => {
    setResults([]);
    setInterimResultsList([]);
  }, []);

  return {
    isListening,
    isSupported,
    error,
    results,
    interimResults: interimResultsList,
    start,
    stop,
    resetResults,
  };
}

export default useVoiceSearch;
