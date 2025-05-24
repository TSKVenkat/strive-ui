import { useState, useCallback, useEffect } from 'react';

export interface ComingSoonPageOptions {
  /**
   * Title text for the coming soon page
   */
  title?: string;
  /**
   * Description text for the coming soon page
   */
  description?: string;
  /**
   * Icon to display in the coming soon page
   */
  icon?: React.ReactNode;
  /**
   * Launch date
   */
  launchDate?: string | Date;
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
   * Additional content to display in the coming soon page
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
}

export interface UseComingSoonPageReturn {
  /**
   * Title text for the coming soon page
   */
  title: string;
  /**
   * Description text for the coming soon page
   */
  description: string;
  /**
   * Icon to display in the coming soon page
   */
  icon: React.ReactNode;
  /**
   * Launch date
   */
  launchDate: string | Date | null;
  /**
   * Whether to show a countdown timer
   */
  showCountdown: boolean;
  /**
   * Time remaining until launch date
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
   * Additional content to display in the coming soon page
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
 * Hook for creating a coming soon page
 */
export function useComingSoonPage(options: ComingSoonPageOptions = {}): UseComingSoonPageReturn {
  // Destructure options with defaults
  const {
    title = 'Coming Soon',
    description = 'We are working hard to bring you something amazing. Stay tuned!',
    icon = null,
    launchDate = null,
    showCountdown = false,
    actionText = 'Notify Me',
    onAction = () => {},
    showAction = true,
    content = null,
    showNewsletter = false,
    onSubscribe = () => {},
    showSocial = false,
    socialLinks = [],
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

  // Calculate time remaining until launch date
  useEffect(() => {
    if (!launchDate || !showCountdown) {
      setTimeRemaining(null);
      return;
    }

    const targetDate = launchDate instanceof Date
      ? launchDate
      : new Date(launchDate);

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
  }, [launchDate, showCountdown]);

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
    launchDate,
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
    getContainerProps,
    getActionProps,
    getNewsletterFormProps,
    getEmailInputProps,
  };
}

export default useComingSoonPage;
