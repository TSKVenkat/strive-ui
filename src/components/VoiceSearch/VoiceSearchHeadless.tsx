import React, { createContext, useContext, forwardRef } from 'react';
import { useVoiceSearch, UseVoiceSearchReturn, VoiceSearchOptions, SpeechRecognitionResult } from './useVoiceSearch';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the VoiceSearch component
interface VoiceSearchContextValue extends UseVoiceSearchReturn {}

const VoiceSearchContext = createContext<VoiceSearchContextValue | null>(null);

// Hook to use VoiceSearch context
export function useVoiceSearchContext() {
  const context = useContext(VoiceSearchContext);
  if (!context) {
    throw new Error('useVoiceSearchContext must be used within a VoiceSearchHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps extends VoiceSearchOptions {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
const Root = forwardRef<HTMLDivElement, RootProps>(
  ({ children, ...options }, ref) => {
    const voiceSearchProps = useVoiceSearch(options);
    
    return (
      <VoiceSearchContext.Provider value={voiceSearchProps}>
        <div ref={ref}>
          {children}
        </div>
      </VoiceSearchContext.Provider>
    );
  }
);

Root.displayName = 'VoiceSearchHeadless.Root';

// Microphone component props
export type MicrophoneProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: {
      isListening: boolean;
      isSupported: boolean;
      startListening: () => void;
      stopListening: () => void;
    }) => React.ReactNode);
  }
>;

// Microphone component
const Microphone = forwardRef(
  <C extends React.ElementType = 'button'>(
    { as, children, ...props }: MicrophoneProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'button';
    const { 
      isListening, 
      isSupported, 
      startListening, 
      stopListening,
      getMicrophoneProps
    } = useVoiceSearchContext();
    
    const microphoneProps = getMicrophoneProps();
    
    return (
      <Component 
        {...microphoneProps} 
        {...props} 
        ref={ref}
      >
        {typeof children === 'function' 
          ? children({ isListening, isSupported, startListening, stopListening }) 
          : children}
      </Component>
    );
  }
);

Microphone.displayName = 'VoiceSearchHeadless.Microphone';

// Transcript component props
export type TranscriptProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Whether to show interim results
     */
    showInterim?: boolean;
    /**
     * Children of the component
     */
    children?: React.ReactNode | ((props: {
      transcript: string;
      finalTranscript: string;
      interimTranscript: string;
    }) => React.ReactNode);
  }
>;

// Transcript component
const Transcript = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, showInterim = true, children, ...props }: TranscriptProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { transcript, finalTranscript, interimTranscript } = useVoiceSearchContext();
    
    const displayTranscript = showInterim ? transcript : finalTranscript;
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ transcript, finalTranscript, interimTranscript }) 
          : displayTranscript}
      </Component>
    );
  }
);

Transcript.displayName = 'VoiceSearchHeadless.Transcript';

// Results component props
export type ResultsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      results: SpeechRecognitionResult[];
      resetResults: () => void;
    }) => React.ReactNode);
  }
>;

// Results component
const Results = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ResultsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { results, resetResults } = useVoiceSearchContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ results, resetResults }) 
          : children}
      </Component>
    );
  }
);

Results.displayName = 'VoiceSearchHeadless.Results';

// Status component props
export type StatusProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      isListening: boolean;
      isSupported: boolean;
      error: Error | null;
    }) => React.ReactNode);
  }
>;

// Status component
const Status = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: StatusProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isListening, isSupported, error } = useVoiceSearchContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ isListening, isSupported, error }) 
          : children}
      </Component>
    );
  }
);

Status.displayName = 'VoiceSearchHeadless.Status';

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
    const { error } = useVoiceSearchContext();
    
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

Error.displayName = 'VoiceSearchHeadless.Error';

// NotSupported component props
export type NotSupportedProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// NotSupported component
const NotSupported = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: NotSupportedProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isSupported } = useVoiceSearchContext();
    
    if (isSupported) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

NotSupported.displayName = 'VoiceSearchHeadless.NotSupported';

// Listening component props
export type ListeningProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Listening component
const Listening = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: ListeningProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isListening } = useVoiceSearchContext();
    
    if (!isListening) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

Listening.displayName = 'VoiceSearchHeadless.Listening';

// NotListening component props
export type NotListeningProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// NotListening component
const NotListening = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: NotListeningProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isListening } = useVoiceSearchContext();
    
    if (isListening) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

NotListening.displayName = 'VoiceSearchHeadless.NotListening';

// Export all components
export const VoiceSearchHeadless = {
  Root,
  Microphone,
  Transcript,
  Results,
  Status,
  Error,
  NotSupported,
  Listening,
  NotListening,
  useVoiceSearchContext,
};

export default VoiceSearchHeadless;
