import React, { forwardRef, createContext, useContext } from 'react';
import { useAudioUpload, UseAudioUploadProps, UseAudioUploadReturn, AudioFile } from './useAudioUpload';
import { PolymorphicComponentPropsWithRef } from '../../types/polymorphic';

/**
 * Props for the AudioUploadHeadless component
 */
export type AudioUploadHeadlessProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  UseAudioUploadProps & {
    /** Label for the upload */
    label?: string;
    /** Children to render inside the component */
    children?: React.ReactNode;
    /** Custom class name for the container */
    className?: string;
    /** Custom styles for the container */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadDropZone component
 */
export type AudioUploadDropZoneProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the drop zone */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadInput component
 */
export type AudioUploadInputProps<C extends React.ElementType = 'input'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadLabel component
 */
export type AudioUploadLabelProps<C extends React.ElementType = 'label'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the label */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadPreview component
 */
export type AudioUploadPreviewProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the preview */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadPreviewItem component
 */
export type AudioUploadPreviewItemProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** File to preview */
    file: AudioFile;
    /** Children to render inside the preview item */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadRemoveButton component
 */
export type AudioUploadRemoveButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** File to remove */
    file: AudioFile;
    /** Children to render inside the button */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadPlayer component
 */
export type AudioUploadPlayerProps<C extends React.ElementType = 'audio'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** File to play */
    file: AudioFile;
    /** Children to render inside the player */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadWaveform component
 */
export type AudioUploadWaveformProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** File to display waveform for */
    file: AudioFile;
    /** Children to render inside the waveform */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadProgress component
 */
export type AudioUploadProgressProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** File to display progress for */
    file: AudioFile;
    /** Children to render inside the progress */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadError component
 */
export type AudioUploadErrorProps<C extends React.ElementType = 'div'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** File to display error for */
    file: AudioFile;
    /** Children to render inside the error */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

/**
 * Props for the AudioUploadButton component
 */
export type AudioUploadButtonProps<C extends React.ElementType = 'button'> = PolymorphicComponentPropsWithRef<
  C,
  {
    /** Children to render inside the button */
    children?: React.ReactNode;
    /** Custom class name */
    className?: string;
    /** Custom styles */
    style?: React.CSSProperties;
  }
>;

// Create a context to share the upload state
interface AudioUploadContextValue extends UseAudioUploadReturn {}

const AudioUploadContext = createContext<AudioUploadContextValue | null>(null);

// Custom hook to use the upload context
const useAudioUploadContext = () => {
  const context = useContext<AudioUploadContextValue | null>(AudioUploadContext);
  if (!context) {
    throw new Error('AudioUpload compound components must be used within an AudioUploadHeadless component');
  }
  return context;
};

// Create types for the forwardRef components
type AudioUploadHeadlessComponent = <C extends React.ElementType = 'div'>(
  props: AudioUploadHeadlessProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadDropZoneComponent = <C extends React.ElementType = 'div'>(
  props: AudioUploadDropZoneProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadInputComponent = <C extends React.ElementType = 'input'>(
  props: AudioUploadInputProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadLabelComponent = <C extends React.ElementType = 'label'>(
  props: AudioUploadLabelProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadPreviewComponent = <C extends React.ElementType = 'div'>(
  props: AudioUploadPreviewProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadPreviewItemComponent = <C extends React.ElementType = 'div'>(
  props: AudioUploadPreviewItemProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadRemoveButtonComponent = <C extends React.ElementType = 'button'>(
  props: AudioUploadRemoveButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadPlayerComponent = <C extends React.ElementType = 'audio'>(
  props: AudioUploadPlayerProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadWaveformComponent = <C extends React.ElementType = 'div'>(
  props: AudioUploadWaveformProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadProgressComponent = <C extends React.ElementType = 'div'>(
  props: AudioUploadProgressProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadErrorComponent = <C extends React.ElementType = 'div'>(
  props: AudioUploadErrorProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

type AudioUploadButtonComponent = <C extends React.ElementType = 'button'>(
  props: AudioUploadButtonProps<C> & { ref?: React.Ref<any> }
) => JSX.Element;

/**
 * A headless Audio Upload component that provides all the functionality without any styling.
 * This component can be used as a base for creating custom styled audio upload implementations.
 */
export const AudioUploadHeadless = forwardRef(function AudioUploadHeadless<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    label,
    ...props 
  }: Omit<AudioUploadHeadlessProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const uploadState = useAudioUpload(props);
  
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <AudioUploadContext.Provider value={uploadState}>
      <ElementType
        ref={ref}
        className={className}
        style={style}
        {...uploadState.getContainerProps()}
      >
        {children || (
          <>
            {label && <AudioUploadLabel>{label}</AudioUploadLabel>}
            <AudioUploadDropZone>
              <p>Drag and drop audio files here, or click to select files</p>
            </AudioUploadDropZone>
            <AudioUploadInput />
            {uploadState.files.length > 0 && (
              <AudioUploadPreview>
                {uploadState.files.map((file) => (
                  <AudioUploadPreviewItem key={file.name} file={file}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AudioUploadPlayer file={file} />
                      <div style={{ flex: 1 }}>
                        <div>{file.name}</div>
                        <AudioUploadWaveform file={file} />
                        {file.status === 'uploading' && (
                          <AudioUploadProgress file={file} />
                        )}
                        {file.status === 'error' && (
                          <AudioUploadError file={file} />
                        )}
                      </div>
                      <AudioUploadRemoveButton file={file}>
                        Remove
                      </AudioUploadRemoveButton>
                    </div>
                  </AudioUploadPreviewItem>
                ))}
              </AudioUploadPreview>
            )}
            {uploadState.files.length > 0 && props.uploadFn && (
              <AudioUploadButton>
                {uploadState.isUploading ? 'Uploading...' : 'Upload'}
              </AudioUploadButton>
            )}
          </>
        )}
      </ElementType>
    </AudioUploadContext.Provider>
  );
}) as unknown as AudioUploadHeadlessComponent;

/**
 * The drop zone element of the audio upload.
 */
export const AudioUploadDropZone = forwardRef(function AudioUploadDropZone<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<AudioUploadDropZoneProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getDropZoneProps } = useAudioUploadContext();
  
  // Get props for the drop zone
  const dropZoneProps = getDropZoneProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      {...dropZoneProps}
      ref={ref}
    >
      {children}
    </ElementType>
  );
}) as unknown as AudioUploadDropZoneComponent;

/**
 * The input element of the audio upload.
 */
export const AudioUploadInput = forwardRef(function AudioUploadInput<C extends React.ElementType = 'input'>(
  { 
    as, 
    className, 
    style, 
    ...props 
  }: Omit<AudioUploadInputProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { getInputProps } = useAudioUploadContext();
  
  // Get props for the input
  const inputProps = getInputProps({
    className,
    style,
    ...props,
  });

  // Use the 'as' prop or default to 'input'
  const ElementType: React.ElementType = as || 'input';

  return (
    <ElementType
      {...inputProps}
      ref={ref}
    />
  );
}) as unknown as AudioUploadInputComponent;

/**
 * The label element of the audio upload.
 */
export const AudioUploadLabel = forwardRef(function AudioUploadLabel<C extends React.ElementType = 'label'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<AudioUploadLabelProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { id } = useAudioUploadContext();
  
  // Use the 'as' prop or default to 'label'
  const ElementType: React.ElementType = as || 'label';

  return (
    <ElementType
      ref={ref}
      htmlFor={`${id}-input`}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as AudioUploadLabelComponent;

/**
 * The preview element of the audio upload.
 */
export const AudioUploadPreview = forwardRef(function AudioUploadPreview<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<AudioUploadPreviewProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="list"
      aria-label="Uploaded audio files"
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as AudioUploadPreviewComponent;

/**
 * The preview item element of the audio upload.
 */
export const AudioUploadPreviewItem = forwardRef(function AudioUploadPreviewItem<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    file,
    ...props 
  }: Omit<AudioUploadPreviewItemProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="listitem"
      data-status={file.status}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as AudioUploadPreviewItemComponent;

/**
 * The remove button element of the audio upload.
 */
export const AudioUploadRemoveButton = forwardRef(function AudioUploadRemoveButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    file,
    ...props 
  }: Omit<AudioUploadRemoveButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { removeFile, disabled, readOnly } = useAudioUploadContext();
  
  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      type="button"
      disabled={disabled || readOnly}
      aria-label={`Remove ${file.name}`}
      onClick={() => removeFile(file)}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as AudioUploadRemoveButtonComponent;

/**
 * The player element of the audio upload.
 */
export const AudioUploadPlayer = forwardRef(function AudioUploadPlayer<C extends React.ElementType = 'audio'>(
  { 
    as, 
    children, 
    className, 
    style, 
    file,
    ...props 
  }: Omit<AudioUploadPlayerProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'audio'
  const ElementType: React.ElementType = as || 'audio';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      src={file.preview}
      controls
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as AudioUploadPlayerComponent;

/**
 * The waveform element of the audio upload.
 */
export const AudioUploadWaveform = forwardRef(function AudioUploadWaveform<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    file,
    ...props 
  }: Omit<AudioUploadWaveformProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        height: '40px',
        gap: '2px',
        ...style,
      }}
      role="img"
      aria-label="Audio waveform"
      {...props}
    >
      {children || (
        file.waveform?.map((value, index) => (
          <div
            key={index}
            style={{
              width: '4px',
              height: `${value * 100}%`,
              backgroundColor: 'currentColor',
              borderRadius: '1px',
            }}
          />
        ))
      )}
    </ElementType>
  );
}) as unknown as AudioUploadWaveformComponent;

/**
 * The progress element of the audio upload.
 */
export const AudioUploadProgress = forwardRef(function AudioUploadProgress<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    file,
    ...props 
  }: Omit<AudioUploadProgressProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      role="progressbar"
      aria-valuenow={file.progress}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      {children || `${file.progress}%`}
    </ElementType>
  );
}) as unknown as AudioUploadProgressComponent;

/**
 * The error element of the audio upload.
 */
export const AudioUploadError = forwardRef(function AudioUploadError<C extends React.ElementType = 'div'>(
  { 
    as, 
    children, 
    className, 
    style, 
    file,
    ...props 
  }: Omit<AudioUploadErrorProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  // Use the 'as' prop or default to 'div'
  const ElementType: React.ElementType = as || 'div';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={{
        color: 'red',
        ...style,
      }}
      role="alert"
      {...props}
    >
      {children || file.error || 'An error occurred'}
    </ElementType>
  );
}) as unknown as AudioUploadErrorComponent;

/**
 * The upload button element of the audio upload.
 */
export const AudioUploadButton = forwardRef(function AudioUploadButton<C extends React.ElementType = 'button'>(
  { 
    as, 
    children, 
    className, 
    style, 
    ...props 
  }: Omit<AudioUploadButtonProps<C>, 'ref'>,
  ref: React.Ref<any>
) {
  const { uploadFiles, isUploading, disabled, readOnly } = useAudioUploadContext();
  
  // Use the 'as' prop or default to 'button'
  const ElementType: React.ElementType = as || 'button';

  return (
    <ElementType
      ref={ref}
      className={className}
      style={style}
      type="button"
      disabled={isUploading || disabled || readOnly}
      onClick={() => uploadFiles()}
      {...props}
    >
      {children}
    </ElementType>
  );
}) as unknown as AudioUploadButtonComponent;

// Add displayNames for better debugging
(AudioUploadHeadless as any).displayName = 'AudioUploadHeadless';
(AudioUploadDropZone as any).displayName = 'AudioUploadDropZone';
(AudioUploadInput as any).displayName = 'AudioUploadInput';
(AudioUploadLabel as any).displayName = 'AudioUploadLabel';
(AudioUploadPreview as any).displayName = 'AudioUploadPreview';
(AudioUploadPreviewItem as any).displayName = 'AudioUploadPreviewItem';
(AudioUploadRemoveButton as any).displayName = 'AudioUploadRemoveButton';
(AudioUploadPlayer as any).displayName = 'AudioUploadPlayer';
(AudioUploadWaveform as any).displayName = 'AudioUploadWaveform';
(AudioUploadProgress as any).displayName = 'AudioUploadProgress';
(AudioUploadError as any).displayName = 'AudioUploadError';
(AudioUploadButton as any).displayName = 'AudioUploadButton';

// Create a compound component
export const AudioUpload = Object.assign(AudioUploadHeadless, {
  DropZone: AudioUploadDropZone,
  Input: AudioUploadInput,
  Label: AudioUploadLabel,
  Preview: AudioUploadPreview,
  PreviewItem: AudioUploadPreviewItem,
  RemoveButton: AudioUploadRemoveButton,
  Player: AudioUploadPlayer,
  Waveform: AudioUploadWaveform,
  Progress: AudioUploadProgress,
  Error: AudioUploadError,
  Button: AudioUploadButton,
});

export default AudioUpload;
