import React, { createContext, useContext, forwardRef } from 'react';
import { useToggle, UseToggleReturn } from './useToggle';

// Define the props for the Toggle component
export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Default toggle state (uncontrolled)
   */
  defaultToggled?: boolean;
  /**
   * Controlled toggle state
   */
  toggled?: boolean;
  /**
   * Callback when toggle state changes
   */
  onChange?: (toggled: boolean) => void;
  /**
   * Whether the toggle is disabled
   */
  disabled?: boolean;
  /**
   * Whether the toggle is read-only
   */
  readOnly?: boolean;
  /**
   * Whether the toggle is required
   */
  required?: boolean;
  /**
   * Name attribute for the toggle
   */
  name?: string;
  /**
   * Value attribute for the toggle
   */
  value?: string;
  /**
   * Children elements
   */
  children?: React.ReactNode;
}

// Create a context for the Toggle
export interface ToggleContextValue extends UseToggleReturn {}

const ToggleContext = createContext<ToggleContextValue | undefined>(undefined);

// Hook to use the Toggle context
export function useToggleContext() {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error('useToggleContext must be used within a ToggleProvider');
  }
  return context;
}

// Root component
export const ToggleRoot = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      defaultToggled,
      toggled,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      value,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      onFocus,
      onBlur,
      children,
      ...props
    },
    ref
  ) => {
    // Use the toggle hook
    const toggle = useToggle({
      defaultToggled,
      toggled,
      onChange,
      disabled,
      readOnly,
      required,
      id,
      name,
      value,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      onFocus,
      onBlur,
    });

    // Get toggle props
    const toggleProps = toggle.getToggleProps({ ...props, ref });

    return (
      <ToggleContext.Provider value={toggle}>
        <button {...toggleProps}>
          {children || (
            <>
              <ToggleTrack>
                <ToggleThumb />
              </ToggleTrack>
            </>
          )}
        </button>
      </ToggleContext.Provider>
    );
  }
);

ToggleRoot.displayName = 'Toggle';

// Label component
export interface ToggleLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

export const ToggleLabel = forwardRef<HTMLLabelElement, ToggleLabelProps>(
  ({ children, ...props }, ref) => {
    const { getLabelProps } = useToggleContext();
    const labelProps = getLabelProps({ ...props, ref });

    return <label {...labelProps}>{children}</label>;
  }
);

ToggleLabel.displayName = 'Toggle.Label';

// Track component
export interface ToggleTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ToggleTrack = forwardRef<HTMLDivElement, ToggleTrackProps>(
  ({ children, ...props }, ref) => {
    const { getTrackProps } = useToggleContext();
    const trackProps = getTrackProps({ ...props, ref });

    return <div {...trackProps}>{children}</div>;
  }
);

ToggleTrack.displayName = 'Toggle.Track';

// Thumb component
export interface ToggleThumbProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const ToggleThumb = forwardRef<HTMLDivElement, ToggleThumbProps>(
  ({ children, ...props }, ref) => {
    const { getThumbProps } = useToggleContext();
    const thumbProps = getThumbProps({ ...props, ref });

    return <div {...thumbProps}>{children}</div>;
  }
);

ToggleThumb.displayName = 'Toggle.Thumb';

// Create the Toggle component with all its subcomponents
export const ToggleHeadless = Object.assign(ToggleRoot, {
  Label: ToggleLabel,
  Track: ToggleTrack,
  Thumb: ToggleThumb,
});

export default ToggleHeadless;
