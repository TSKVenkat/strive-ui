import { useState, useCallback } from 'react';

export interface NotFoundPageOptions {
  /**
   * Title text for the not found page
   */
  title?: string;
  /**
   * Description text for the not found page
   */
  description?: string;
  /**
   * Icon to display in the not found page
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
   * Additional content to display in the not found page
   */
  content?: React.ReactNode;
  /**
   * Whether to show a search box
   */
  showSearch?: boolean;
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  /**
   * Search callback
   */
  onSearch?: (query: string) => void;
  /**
   * Whether to show suggested links
   */
  showSuggestions?: boolean;
  /**
   * Suggested links to display
   */
  suggestions?: Array<{ label: string; href: string }>;
}

export interface UseNotFoundPageReturn {
  /**
   * Title text for the not found page
   */
  title: string;
  /**
   * Description text for the not found page
   */
  description: string;
  /**
   * Icon to display in the not found page
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
   * Additional content to display in the not found page
   */
  content: React.ReactNode;
  /**
   * Whether to show a search box
   */
  showSearch: boolean;
  /**
   * Search placeholder text
   */
  searchPlaceholder: string;
  /**
   * Search callback
   */
  onSearch: (query: string) => void;
  /**
   * Current search query
   */
  searchQuery: string;
  /**
   * Set the search query
   */
  setSearchQuery: (query: string) => void;
  /**
   * Handle search input change
   */
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Handle search form submission
   */
  handleSearchSubmit: (e: React.FormEvent) => void;
  /**
   * Whether to show suggested links
   */
  showSuggestions: boolean;
  /**
   * Suggested links to display
   */
  suggestions: Array<{ label: string; href: string }>;
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
   * Get props for the search form
   */
  getSearchFormProps: () => {
    onSubmit: (e: React.FormEvent) => void;
    role: string;
  };
  /**
   * Get props for the search input
   */
  getSearchInputProps: () => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    'aria-label': string;
  };
}

/**
 * Hook for creating a not found page
 */
export function useNotFoundPage(options: NotFoundPageOptions = {}): UseNotFoundPageReturn {
  // Destructure options with defaults
  const {
    title = '404 - Page Not Found',
    description = 'The page you are looking for does not exist or has been moved.',
    icon = null,
    actionText = 'Go Home',
    onAction = () => {
      // Default action is to navigate to the home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
    showAction = true,
    content = null,
    showSearch = false,
    searchPlaceholder = 'Search...',
    onSearch = () => {},
    showSuggestions = false,
    suggestions = [],
  } = options;

  // State for search
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // Handle search form submission
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  }, [searchQuery, onSearch]);

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

  // Get props for the search form
  const getSearchFormProps = useCallback(() => {
    return {
      onSubmit: handleSearchSubmit,
      role: 'search',
    };
  }, [handleSearchSubmit]);

  // Get props for the search input
  const getSearchInputProps = useCallback(() => {
    return {
      value: searchQuery,
      onChange: handleSearchChange,
      placeholder: searchPlaceholder,
      'aria-label': 'Search',
    };
  }, [searchQuery, handleSearchChange, searchPlaceholder]);

  return {
    title,
    description,
    icon,
    actionText,
    onAction,
    showAction,
    content,
    showSearch,
    searchPlaceholder,
    onSearch,
    searchQuery,
    setSearchQuery,
    handleSearchChange,
    handleSearchSubmit,
    showSuggestions,
    suggestions,
    getContainerProps,
    getActionProps,
    getSearchFormProps,
    getSearchInputProps,
  };
}

export default useNotFoundPage;
