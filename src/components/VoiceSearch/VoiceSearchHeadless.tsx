import React, { createContext, useContext, forwardRef } from 'react';
import { useVoiceSearch, UseVoiceSearchReturn, SpeechRecognitionResult } from './useVoiceSearch';

// Create context
const VoiceSearchContext = createContext<UseVoiceSearchReturn | null>(null);

// Custom hook to use voice search context
const useVoiceSearchContext = () => {
  const context = useContext(VoiceSearchContext);
  if (!context) {
    throw new Error('useVoiceSearchContext must be used within a VoiceSearchHeadless.Root component');
  }
  return context;
};

// Root component props
interface RootProps {
  children: React.ReactNode;
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

// Component props with polymorphic as prop
type ElementRef<T> = T extends React.ElementType
  ? React.ComponentPropsWithRef<T>['ref']
  : never;

type MergeElementProps<T extends React.ElementType, P> = Omit<React.ComponentPropsWithRef<T>, keyof P> & P;

interface BaseProps<T extends React.ElementType> {
  as?: T;
}

interface MicrophoneProps<T extends React.ElementType = 'button'> extends BaseProps<T> {
  children?: React.ReactNode;
}

interface TranscriptProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children?: React.ReactNode;
  showInterim?: boolean;
}

interface ResultsProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode | ((props: {
    results: SpeechRecognitionResult[];
    resetResults: () => void;
  }) => React.ReactNode);
}

interface StatusProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode | ((props: {
    isListening: boolean;
    isSupported: boolean;
    error: Error | null;
  }) => React.ReactNode);
}

interface ErrorProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode | ((props: {
    error: Error;
  }) => React.ReactNode);
}

interface NotSupportedProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode;
}

interface ListeningProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode;
}

interface NotListeningProps<T extends React.ElementType = 'div'> extends BaseProps<T> {
  children: React.ReactNode;
}

// Component implementations
const Root = ({ children, ...options }: RootProps) => {
  const voiceSearch = useVoiceSearch(options);
  return (
    <VoiceSearchContext.Provider value={voiceSearch}>
      {children}
    </VoiceSearchContext.Provider>
  );
};

const Microphone = forwardRef<HTMLButtonElement, MicrophoneProps<'button'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'button') as 'button';
    const { isListening, isSupported, start, stop } = useVoiceSearchContext();

    return (
      <Component
        ref={ref}
        onClick={() => (isListening ? stop() : start())}
        disabled={!isSupported}
        aria-pressed={isListening}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

const Transcript = forwardRef<HTMLDivElement, TranscriptProps<'div'>>(
  ({ as, showInterim = true, children, ...props }, ref) => {
    const Component = (as || 'div') as 'div';
    const { results, interimResults } = useVoiceSearchContext();

    const transcript = [
      ...results.map(r => r.transcript),
      ...(showInterim ? interimResults.map(r => r.transcript) : []),
    ].join(' ');

    return (
      <Component ref={ref} {...props}>
        {children || transcript}
      </Component>
    );
  }
);

const Results = forwardRef<HTMLDivElement, ResultsProps<'div'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'div') as 'div';
    const { results, resetResults } = useVoiceSearchContext();

    return (
      <Component ref={ref} {...props}>
        {typeof children === 'function'
          ? children({ results, resetResults })
          : children}
      </Component>
    );
  }
);

const Status = forwardRef<HTMLDivElement, StatusProps<'div'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'div') as 'div';
    const { isListening, isSupported, error } = useVoiceSearchContext();

    return (
      <Component ref={ref} {...props}>
        {typeof children === 'function'
          ? children({ isListening, isSupported, error })
          : children}
      </Component>
    );
  }
);

const ErrorComponent = forwardRef<HTMLDivElement, ErrorProps<'div'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'div') as 'div';
    const { error } = useVoiceSearchContext();

    if (!error) return null;

    return (
      <Component ref={ref} {...props}>
        {typeof children === 'function'
          ? children({ error })
          : children}
      </Component>
    );
  }
);

const NotSupported = forwardRef<HTMLDivElement, NotSupportedProps<'div'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'div') as 'div';
    const { isSupported } = useVoiceSearchContext();

    if (isSupported) return null;

    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

const Listening = forwardRef<HTMLDivElement, ListeningProps<'div'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'div') as 'div';
    const { isListening } = useVoiceSearchContext();

    if (!isListening) return null;

    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

const NotListening = forwardRef<HTMLDivElement, NotListeningProps<'div'>>(
  ({ as, children, ...props }, ref) => {
    const Component = (as || 'div') as 'div';
    const { isListening } = useVoiceSearchContext();

    if (isListening) return null;

    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  }
);

// Export compound component
export const VoiceSearchHeadless = {
  Root,
  Microphone,
  Transcript,
  Results,
  Status,
  Error: ErrorComponent,
  NotSupported,
  Listening,
  NotListening,
};

export default VoiceSearchHeadless;
