import { useState, useCallback } from 'react';

export type EmptyStateType = 'empty' | 'noData' | 'noResults' | 'offline' | 'error' | 'custom';

export interface EmptyStateOptions {
  /**
   * Type of empty state
   */
  type?: EmptyStateType;
  /**
   * Title text for the empty state
   */
  title?: string;
  /**
   * Description text for the empty state
   */
  description?: string;
  /**
   * Icon to display in the empty state
   */
  icon?: React.ReactNode;
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
   * Additional content to display in the empty state
   */
  content?: React.ReactNode;
  /**
   * Whether the empty state is visible
   */
  visible?: boolean;
}

export interface UseEmptyStateReturn {
  /**
   * Type of empty state
   */
  type: EmptyStateType;
  /**
   * Title text for the empty state
   */
  title: string;
  /**
   * Description text for the empty state
   */
  description: string;
  /**
   * Icon to display in the empty state
   */
  icon: React.ReactNode;
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
   * Additional content to display in the empty state
   */
  content: React.ReactNode;
  /**
   * Whether the empty state is visible
   */
  visible: boolean;
  /**
   * Set whether the empty state is visible
   */
  setVisible: (visible: boolean) => void;
  /**
   * Set the type of empty state
   */
  setType: (type: EmptyStateType) => void;
  /**
   * Set the title text for the empty state
   */
  setTitle: (title: string) => void;
  /**
   * Set the description text for the empty state
   */
  setDescription: (description: string) => void;
  /**
   * Set the icon for the empty state
   */
  setIcon: (icon: React.ReactNode) => void;
  /**
   * Set the action button text
   */
  setActionText: (actionText: string) => void;
  /**
   * Set the action button callback
   */
  setOnAction: (onAction: () => void) => void;
  /**
   * Set whether to show the action button
   */
  setShowAction: (showAction: boolean) => void;
  /**
   * Set additional content for the empty state
   */
  setContent: (content: React.ReactNode) => void;
  /**
   * Get default title based on type
   */
  getDefaultTitle: () => string;
  /**
   * Get default description based on type
   */
  getDefaultDescription: () => string;
  /**
   * Get default action text based on type
   */
  getDefaultActionText: () => string;
  /**
   * Get props for the container
   */
  getContainerProps: () => {
    role: string;
    'aria-live': string;
  };
  /**
   * Get props for the action button
   */
  getActionProps: () => {
    onClick: () => void;
    role: string;
    'aria-label': string;
  };
}

/**
 * Hook for creating an empty state
 */
export function useEmptyState(options: EmptyStateOptions = {}): UseEmptyStateReturn {
  // Destructure options with defaults
  const {
    type = 'empty',
    title: initialTitle,
    description: initialDescription,
    icon: initialIcon = null,
    actionText: initialActionText,
    onAction: initialOnAction = () => {},
    showAction = true,
    content: initialContent = null,
    visible: initialVisible = true,
  } = options;

  // Get default title based on type
  const getDefaultTitle = useCallback(() => {
    switch (type) {
      case 'empty':
        return 'No Content';
      case 'noData':
        return 'No Data Available';
      case 'noResults':
        return 'No Results Found';
      case 'offline':
        return 'You\'re Offline';
      case 'error':
        return 'Something Went Wrong';
      case 'custom':
        return '';
      default:
        return 'No Content';
    }
  }, [type]);

  // Get default description based on type
  const getDefaultDescription = useCallback(() => {
    switch (type) {
      case 'empty':
        return 'There is no content to display at this time.';
      case 'noData':
        return 'No data is available for this view.';
      case 'noResults':
        return 'Your search did not match any results.';
      case 'offline':
        return 'Check your internet connection and try again.';
      case 'error':
        return 'An error occurred while loading the content.';
      case 'custom':
        return '';
      default:
        return 'There is no content to display at this time.';
    }
  }, [type]);

  // Get default action text based on type
  const getDefaultActionText = useCallback(() => {
    switch (type) {
      case 'empty':
        return 'Create New';
      case 'noData':
        return 'Add Data';
      case 'noResults':
        return 'Clear Search';
      case 'offline':
        return 'Retry';
      case 'error':
        return 'Try Again';
      case 'custom':
        return 'Action';
      default:
        return 'Action';
    }
  }, [type]);

  // State for empty state properties
  const [emptyStateType, setEmptyStateType] = useState<EmptyStateType>(type);
  const [title, setTitle] = useState<string>(initialTitle || getDefaultTitle());
  const [description, setDescription] = useState<string>(initialDescription || getDefaultDescription());
  const [icon, setIcon] = useState<React.ReactNode>(initialIcon);
  const [actionText, setActionText] = useState<string>(initialActionText || getDefaultActionText());
  const [onAction, setOnAction] = useState<() => void>(initialOnAction);
  const [showActionButton, setShowActionButton] = useState<boolean>(showAction);
  const [content, setContent] = useState<React.ReactNode>(initialContent);
  const [visible, setVisible] = useState<boolean>(initialVisible);

  // Update title, description, and actionText when type changes
  const setType = useCallback((newType: EmptyStateType) => {
    setEmptyStateType(newType);
    setTitle(initialTitle || getDefaultTitle());
    setDescription(initialDescription || getDefaultDescription());
    setActionText(initialActionText || getDefaultActionText());
  }, [initialTitle, initialDescription, initialActionText, getDefaultTitle, getDefaultDescription, getDefaultActionText]);

  // Get props for the container
  const getContainerProps = useCallback(() => {
    return {
      role: 'region',
      'aria-live': 'polite',
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

  return {
    type: emptyStateType,
    title,
    description,
    icon,
    actionText,
    onAction,
    showAction: showActionButton,
    content,
    visible,
    setVisible,
    setType,
    setTitle,
    setDescription,
    setIcon,
    setActionText,
    setOnAction,
    setShowAction,
    setContent,
    getDefaultTitle,
    getDefaultDescription,
    getDefaultActionText,
    getContainerProps,
    getActionProps,
  };
}

export default useEmptyState;
