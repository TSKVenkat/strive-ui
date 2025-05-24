import { useState, useCallback, useEffect } from 'react';

export interface MaintenancePageOptions {
  /**
   * Title text for the maintenance page
   */
  title?: string;
  /**
   * Description text for the maintenance page
   */
  description?: string;
  /**
   * Icon to display in the maintenance page
   */
  icon?: React.ReactNode;
  /**
   * Estimated completion time
   */
  estimatedCompletion?: string | Date;
  /**
   * Whether to show a countdown timer
   */
  showCountdown?: boolean;
  /**
   * Action button text
   */
  actionText?: string;
  /**
   * Action button callback
   */
  onAction?: () => void;
  /**
   * Whether to show the action button
   */
  showAction?: boolean;
  /**
   * Additional content to display in the maintenance page
   */
  content?: React.ReactNode;
  /**
   * Whether to show a newsletter subscription form
   */
  showNewsletter?: boolean;
  /**
   * Newsletter subscription callback
   */
  onSubscribe?: (email: string) => void;
  /**
   * Whether to show social media links
   */
  showSocial?: boolean;
  /**
   * Social media links to display
   */
  socialLinks?: Array<{ name: string; url: string; icon?: React.ReactNode }>;
  /**
   * Whether to auto-refresh the page
   */
  autoRefresh?: boolean;
  /**
   * Auto-refresh interval in seconds
   */
  refreshInterval?: number;
}

export interface UseMaintenancePageReturn {
  /**
   * Title text for the maintenance page
   */
  title: string;
  /**
   * Description text for the maintenance page
   */
  description: string;
  /**
   * Icon to display in the maintenance page
   */
  icon: React.ReactNode;
  /**
   * Estimated completion time
   */
  estimatedCompletion: string | Date | null;
  /**
   * Whether to show a countdown timer
   */
  showCountdown: boolean;
  /**
   * Time remaining until estimated completion
   */
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null;
  /**
   * Action button text
   */
  actionText: string;
  /**
   * Action button callback
   */
  onAction: () => void;
  /**
   * Whether to show the action button
   */
  showAction: boolean;
  /**
   * Additional content to display in the maintenance page
   */
  content: React.ReactNode;
  /**
   * Whether to show a newsletter subscription form
   */
  showNewsletter: boolean;
  /**
   * Newsletter subscription callback
   */
  onSubscribe: (email: string) => void;
  /**
   * Email input value
   */
  email: string;
  /**
   * Set email input value
   */
  setEmail: (email: string) => void;
  /**
   * Handle email input change
   */
  handleEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Handle newsletter form submission
   */
  handleSubscribe: (e: React.FormEvent) => void;
  /**
   * Whether to show social media links
   */
  showSocial: boolean;
  /**
   * Social media links to display
   */
  socialLinks: Array<{ name: string; url: string; icon?: React.ReactNode }>;
  /**
   * Whether to auto-refresh the page
   */
  autoRefresh: boolean;
  /**
   * Auto-refresh interval in seconds
   */
  refreshInterval: number;
  /**
   * Time until next refresh
   */
  refreshCountdown: number;
  /**
   * Get props for the container
   */
  getContainerProps: () => {
    role: string;
  };
  /**
   * Get props for the action button
   */
  getActionProps: () => {
    onClick: () => void;
    role: string;
    'aria-label': string;
  };
  /**
   * Get props for the newsletter form
   */
  getNewsletterFormProps: () => {
    onSubmit: (e: React.FormEvent) => void;
    role: string;
  };
  /**
   * Get props for the email input
   */
  getEmailInputProps: () => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    type: string;
    required: boolean;
    'aria-label': string;
  };
}

/**
 * Hook for creating a maintenance page
 */
export function useMaintenancePage(options: MaintenancePageOptions = {}): UseMaintenancePageReturn {
  // Destructure options with defaults
  const {
    title = 'Site Under Maintenance',
    description = 'We are currently performing scheduled maintenance. Please check back soon.',
    icon = null,
    estimatedCompletion = null,
    showCountdown = false,
    actionText = 'Refresh Page',
    onAction = () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
    showAction = true,
    content = null,
    showNewsletter = false,
    onSubscribe = () => {},
    showSocial = false,
    socialLinks = [],
    autoRefresh = false,
    refreshInterval = 60,
  } = options;

  // State for email input
  const [email, setEmail] = useState<string>('');
  // State for countdown timer
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  // State for refresh countdown
  const [refreshCountdown, setRefreshCountdown] = useState<number>(refreshInterval);

  // Handle email input change
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  // Handle newsletter form submission
  const handleSubscribe = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubscribe(email);
    setEmail('');
  }, [email, onSubscribe]);

  // Calculate time remaining until estimated completion
  useEffect(() => {
    if (!estimatedCompletion || !showCountdown) {
      setTimeRemaining(null);
      return;
    }

    const targetDate = estimatedCompletion instanceof Date
      ? estimatedCompletion
      : new Date(estimatedCompletion);

    const calculateTimeRemaining = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [estimatedCompletion, showCountdown]);

  // Auto-refresh countdown
  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    setRefreshCountdown(refreshInterval);

    const countdown = setInterval(() => {
      setRefreshCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(countdown);
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [autoRefresh, refreshInterval]);

  // Get props for the container
  const getContainerProps = useCallback(() => {
    return {
      role: 'main',
    };
  }, []);

  // Get props for the action button
  const getActionProps = useCallback(() => {
    return {
      onClick: onAction,
      role: 'button',
      'aria-label': actionText,
    };
  }, [onAction, actionText]);

  // Get props for the newsletter form
  const getNewsletterFormProps = useCallback(() => {
    return {
      onSubmit: handleSubscribe,
      role: 'form',
    };
  }, [handleSubscribe]);

  // Get props for the email input
  const getEmailInputProps = useCallback(() => {
    return {
      value: email,
      onChange: handleEmailChange,
      placeholder: 'Enter your email',
      type: 'email',
      required: true,
      'aria-label': 'Email address',
    };
  }, [email, handleEmailChange]);

  return {
    title,
    description,
    icon,
    estimatedCompletion,
    showCountdown,
    timeRemaining,
    actionText,
    onAction,
    showAction,
    content,
    showNewsletter,
    onSubscribe,
    email,
    setEmail,
    handleEmailChange,
    handleSubscribe,
    showSocial,
    socialLinks,
    autoRefresh,
    refreshInterval,
    refreshCountdown,
    getContainerProps,
    getActionProps,
    getNewsletterFormProps,
    getEmailInputProps,
  };
}

export default useMaintenancePage;
