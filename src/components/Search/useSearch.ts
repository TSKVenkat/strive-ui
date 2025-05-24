import { useState, useCallback, useEffect, useRef } from 'react';

export interface SearchResult<T = any> {
  /**
   * Unique identifier for the result
   */
  id: string | number;
  /**
   * The item data
   */
  item: T;
  /**
   * Relevance score (0-1)
   */
  score?: number;
  /**
   * Highlighted matches
   */
  matches?: {
    key: string;
    indices: [number, number][];
    value: string;
  }[];
}

export interface SearchFilter {
  /**
   * Field to filter on
   */
  field: string;
  /**
   * Filter value
   */
  value: any;
  /**
   * Filter operator
   */
  operator?: '=' | '!=' | '>' | '>=' | '<' | '<=' | 'contains' | 'startsWith' | 'endsWith';
}

export interface SearchFacet {
  /**
   * Field to facet on
   */
  field: string;
  /**
   * Count of items for each value
   */
  counts: { value: any; count: number }[];
}

export interface SearchOptions<T = any> {
  /**
   * Data to search through
   */
  data?: T[];
  /**
   * Fields to search in
   */
  searchableFields?: string[];
  /**
   * Initial query
   */
  initialQuery?: string;
  /**
   * Debounce time in milliseconds
   */
  debounceTime?: number;
  /**
   * Minimum query length to trigger search
   */
  minQueryLength?: number;
  /**
   * Maximum number of results to return
   */
  maxResults?: number;
  /**
   * Whether to highlight matches
   */
  highlightMatches?: boolean;
  /**
   * Whether to use fuzzy matching
   */
  fuzzySearch?: boolean;
  /**
   * Fuzzy search threshold (0-1)
   */
  fuzzyThreshold?: number;
  /**
   * Custom search function
   */
  searchFunction?: (query: string, data: T[], options: SearchOptions<T>) => SearchResult<T>[];
  /**
   * Callback when search results change
   */
  onResultsChange?: (results: SearchResult<T>[]) => void;
  /**
   * Callback when query changes
   */
  onQueryChange?: (query: string) => void;
  /**
   * Callback when a result is selected
   */
  onResultSelect?: (result: SearchResult<T>) => void;
  /**
   * Callback to fetch remote data
   */
  fetchRemoteData?: (query: string, filters?: SearchFilter[]) => Promise<T[]>;
  /**
   * Initial filters
   */
  initialFilters?: SearchFilter[];
  /**
   * Initial sort field
   */
  initialSortField?: string;
  /**
   * Initial sort direction
   */
  initialSortDirection?: 'asc' | 'desc';
  /**
   * Fields to generate facets for
   */
  facetFields?: string[];
  /**
   * Whether to enable live search
   */
  liveSearch?: boolean;
}

export interface UseSearchReturn<T = any> {
  /**
   * Current search query
   */
  query: string;
  /**
   * Set search query
   */
  setQuery: (query: string) => void;
  /**
   * Current search results
   */
  results: SearchResult<T>[];
  /**
   * Whether search is loading
   */
  isLoading: boolean;
  /**
   * Whether search has error
   */
  error: Error | null;
  /**
   * Total number of results
   */
  totalResults: number;
  /**
   * Current search filters
   */
  filters: SearchFilter[];
  /**
   * Add a filter
   */
  addFilter: (filter: SearchFilter) => void;
  /**
   * Remove a filter
   */
  removeFilter: (field: string) => void;
  /**
   * Clear all filters
   */
  clearFilters: () => void;
  /**
   * Current sort field
   */
  sortField: string | null;
  /**
   * Current sort direction
   */
  sortDirection: 'asc' | 'desc';
  /**
   * Set sort options
   */
  setSort: (field: string, direction?: 'asc' | 'desc') => void;
  /**
   * Current facets
   */
  facets: SearchFacet[];
  /**
   * Selected result
   */
  selectedResult: SearchResult<T> | null;
  /**
   * Select a result
   */
  selectResult: (result: SearchResult<T>) => void;
  /**
   * Clear selected result
   */
  clearSelectedResult: () => void;
  /**
   * Perform search
   */
  search: (query?: string) => void;
  /**
   * Reset search
   */
  reset: () => void;
  /**
   * Get props for the search input
   */
  getInputProps: () => {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    'aria-label': string;
    'aria-autocomplete': string;
    'aria-controls': string;
    'aria-expanded': boolean;
    role: string;
  };
  /**
   * Get props for the search results container
   */
  getResultsContainerProps: () => {
    role: string;
    'aria-label': string;
    id: string;
  };
  /**
   * Get props for a search result item
   */
  getResultItemProps: (result: SearchResult<T>) => {
    key: string | number;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    role: string;
    'aria-selected': boolean;
    tabIndex: number;
  };
}

/**
 * Hook for creating a search interface
 */
export function useSearch<T = any>(options: SearchOptions<T> = {}): UseSearchReturn<T> {
  const {
    data = [],
    searchableFields = [],
    initialQuery = '',
    debounceTime = 300,
    minQueryLength = 1,
    maxResults = 10,
    highlightMatches = true,
    fuzzySearch = false,
    fuzzyThreshold = 0.6,
    searchFunction,
    onResultsChange,
    onQueryChange,
    onResultSelect,
    fetchRemoteData,
    initialFilters = [],
    initialSortField,
    initialSortDirection = 'asc',
    facetFields = [],
    liveSearch = true,
  } = options;

  const [query, setQuery] = useState<string>(initialQuery);
  const [results, setResults] = useState<SearchResult<T>[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<SearchFilter[]>(initialFilters);
  const [sortField, setSortField] = useState<string | null>(initialSortField || null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);
  const [facets, setFacets] = useState<SearchFacet[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchResult<T> | null>(null);
  
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchIdRef = useRef<number>(0);

  // Default search function
  const defaultSearchFunction = useCallback((query: string, data: T[], options: SearchOptions<T>): SearchResult<T>[] => {
    const { searchableFields = [], maxResults = 10, fuzzySearch = false, fuzzyThreshold = 0.6 } = options;
    
    if (!query || query.length < (options.minQueryLength || 1)) {
      return [];
    }
    
    const lowerQuery = query.toLowerCase();
    const results: SearchResult<T>[] = [];
    
    for (const item of data) {
      let score = 0;
      const matches: { key: string; indices: [number, number][]; value: string }[] = [];
      
      for (const field of searchableFields) {
        const value = getNestedValue(item, field);
        
        if (value === undefined || value === null) {
          continue;
        }
        
        const stringValue = String(value).toLowerCase();
        
        if (fuzzySearch) {
          // Simple fuzzy matching
          const fuzzyScore = fuzzyMatch(lowerQuery, stringValue);
          if (fuzzyScore >= fuzzyThreshold) {
            score = Math.max(score, fuzzyScore);
            matches.push({
              key: field,
              indices: [[0, stringValue.length - 1]],
              value: String(value),
            });
          }
        } else {
          // Exact matching
          const index = stringValue.indexOf(lowerQuery);
          if (index !== -1) {
            score = Math.max(score, 1);
            matches.push({
              key: field,
              indices: [[index, index + lowerQuery.length - 1]],
              value: String(value),
            });
          }
        }
      }
      
      if (score > 0) {
        results.push({
          id: (item as any).id || results.length,
          item,
          score,
          matches: options.highlightMatches ? matches : undefined,
        });
      }
    }
    
    // Sort by score
    results.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    return results.slice(0, maxResults);
  }, []);

  // Fuzzy matching algorithm
  const fuzzyMatch = useCallback((pattern: string, str: string): number => {
    const patternLength = pattern.length;
    const strLength = str.length;
    
    if (patternLength > strLength) {
      return 0;
    }
    
    if (patternLength === strLength) {
      return pattern === str ? 1 : 0;
    }
    
    let score = 0;
    let patternIdx = 0;
    let prevMatchIdx = -1;
    let prevConsecutive = false;
    
    for (let i = 0; i < strLength && patternIdx < patternLength; i++) {
      if (pattern[patternIdx] === str[i]) {
        score += 1;
        
        // Bonus for consecutive matches
        if (prevMatchIdx === i - 1) {
          if (prevConsecutive) {
            score += 0.5;
          } else {
            score += 0.25;
            prevConsecutive = true;
          }
        } else {
          prevConsecutive = false;
        }
        
        // Bonus for matches after spaces or at start of words
        if (i === 0 || str[i - 1] === ' ') {
          score += 0.5;
        }
        
        prevMatchIdx = i;
        patternIdx++;
      }
    }
    
    // Did we match all pattern characters?
    if (patternIdx === patternLength) {
      // Normalize score based on pattern length and string length
      return score / (patternLength + (strLength - patternLength) * 0.5);
    }
    
    return 0;
  }, []);

  // Helper to get nested value from object
  const getNestedValue = useCallback((obj: any, path: string): any => {
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value === null || value === undefined || typeof value !== 'object') {
        return undefined;
      }
      value = value[key];
    }
    
    return value;
  }, []);

  // Apply filters to data
  const applyFilters = useCallback((data: T[], filters: SearchFilter[]): T[] => {
    if (!filters.length) return data;
    
    return data.filter(item => {
      for (const filter of filters) {
        const { field, value, operator = '=' } = filter;
        const itemValue = getNestedValue(item, field);
        
        if (itemValue === undefined) return false;
        
        switch (operator) {
          case '=':
            if (itemValue !== value) return false;
            break;
          case '!=':
            if (itemValue === value) return false;
            break;
          case '>':
            if (itemValue <= value) return false;
            break;
          case '>=':
            if (itemValue < value) return false;
            break;
          case '<':
            if (itemValue >= value) return false;
            break;
          case '<=':
            if (itemValue > value) return false;
            break;
          case 'contains':
            if (!String(itemValue).includes(String(value))) return false;
            break;
          case 'startsWith':
            if (!String(itemValue).startsWith(String(value))) return false;
            break;
          case 'endsWith':
            if (!String(itemValue).endsWith(String(value))) return false;
            break;
        }
      }
      
      return true;
    });
  }, [getNestedValue]);

  // Apply sorting to data
  const applySort = useCallback((data: T[], field: string | null, direction: 'asc' | 'desc'): T[] => {
    if (!field) return data;
    
    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, field);
      const bValue = getNestedValue(b, field);
      
      if (aValue === bValue) return 0;
      if (aValue === undefined) return direction === 'asc' ? -1 : 1;
      if (bValue === undefined) return direction === 'asc' ? 1 : -1;
      
      const result = aValue < bValue ? -1 : 1;
      return direction === 'asc' ? result : -result;
    });
  }, [getNestedValue]);

  // Generate facets from data
  const generateFacets = useCallback((data: T[], facetFields: string[]): SearchFacet[] => {
    return facetFields.map(field => {
      const counts: Record<string, number> = {};
      
      for (const item of data) {
        const value = getNestedValue(item, field);
        if (value !== undefined && value !== null) {
          const key = String(value);
          counts[key] = (counts[key] || 0) + 1;
        }
      }
      
      return {
        field,
        counts: Object.entries(counts).map(([value, count]) => ({ value, count })),
      };
    });
  }, [getNestedValue]);

  // Perform search
  const search = useCallback(async (searchQuery?: string) => {
    const currentQuery = searchQuery !== undefined ? searchQuery : query;
    const searchId = ++searchIdRef.current;
    
    if (currentQuery.length < minQueryLength) {
      setResults([]);
      onResultsChange?.([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let searchData = data;
      
      // Fetch remote data if provided
      if (fetchRemoteData) {
        try {
          searchData = await fetchRemoteData(currentQuery, filters);
        } catch (err) {
          if (searchId !== searchIdRef.current) return;
          setError(err instanceof Error ? err : new Error(String(err)));
          setResults([]);
          onResultsChange?.([]);
          return;
        }
      }
      
      // Apply filters
      const filteredData = applyFilters(searchData, filters);
      
      // Apply sorting
      const sortedData = sortField ? applySort(filteredData, sortField, sortDirection) : filteredData;
      
      // Generate facets
      if (facetFields.length) {
        const newFacets = generateFacets(filteredData, facetFields);
        setFacets(newFacets);
      }
      
      // Perform search
      const searchResults = searchFunction
        ? searchFunction(currentQuery, sortedData, {
            searchableFields,
            maxResults,
            highlightMatches,
            fuzzySearch,
            fuzzyThreshold,
            minQueryLength,
          })
        : defaultSearchFunction(currentQuery, sortedData, {
            searchableFields,
            maxResults,
            highlightMatches,
            fuzzySearch,
            fuzzyThreshold,
            minQueryLength,
          });
      
      if (searchId !== searchIdRef.current) return;
      
      setResults(searchResults);
      onResultsChange?.(searchResults);
    } catch (err) {
      if (searchId !== searchIdRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
      setResults([]);
      onResultsChange?.([]);
    } finally {
      if (searchId === searchIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [
    query,
    minQueryLength,
    data,
    fetchRemoteData,
    filters,
    sortField,
    sortDirection,
    facetFields,
    searchFunction,
    defaultSearchFunction,
    searchableFields,
    maxResults,
    highlightMatches,
    fuzzySearch,
    fuzzyThreshold,
    applyFilters,
    applySort,
    generateFacets,
    onResultsChange,
  ]);

  // Handle query change
  useEffect(() => {
    onQueryChange?.(query);
    
    if (!liveSearch || query.length < minQueryLength) {
      return;
    }
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      search();
    }, debounceTime);
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, liveSearch, minQueryLength, debounceTime, search, onQueryChange]);

  // Add filter
  const addFilter = useCallback((filter: SearchFilter) => {
    setFilters(prevFilters => {
      // Replace filter if field already exists
      const index = prevFilters.findIndex(f => f.field === filter.field);
      if (index !== -1) {
        const newFilters = [...prevFilters];
        newFilters[index] = filter;
        return newFilters;
      }
      return [...prevFilters, filter];
    });
  }, []);

  // Remove filter
  const removeFilter = useCallback((field: string) => {
    setFilters(prevFilters => prevFilters.filter(f => f.field !== field));
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  // Set sort options
  const setSort = useCallback((field: string, direction: 'asc' | 'desc' = 'asc') => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  // Select result
  const selectResult = useCallback((result: SearchResult<T>) => {
    setSelectedResult(result);
    onResultSelect?.(result);
  }, [onResultSelect]);

  // Clear selected result
  const clearSelectedResult = useCallback(() => {
    setSelectedResult(null);
  }, []);

  // Reset search
  const reset = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsLoading(false);
    setError(null);
    setFilters(initialFilters);
    setSortField(initialSortField || null);
    setSortDirection(initialSortDirection);
    setFacets([]);
    setSelectedResult(null);
    onResultsChange?.([]);
  }, [initialFilters, initialSortField, initialSortDirection, onResultsChange]);

  // Get props for the search input
  const getInputProps = useCallback(() => {
    return {
      value: query,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !liveSearch) {
          search();
        }
      },
      'aria-label': 'Search',
      'aria-autocomplete': 'list',
      'aria-controls': 'search-results',
      'aria-expanded': results.length > 0,
      role: 'combobox',
    };
  }, [query, liveSearch, results.length, search]);

  // Get props for the search results container
  const getResultsContainerProps = useCallback(() => {
    return {
      role: 'listbox',
      'aria-label': 'Search Results',
      id: 'search-results',
    };
  }, []);

  // Get props for a search result item
  const getResultItemProps = useCallback((result: SearchResult<T>) => {
    return {
      key: result.id,
      onClick: () => selectResult(result),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          selectResult(result);
        }
      },
      role: 'option',
      'aria-selected': selectedResult?.id === result.id,
      tabIndex: 0,
    };
  }, [selectResult, selectedResult]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    totalResults: results.length,
    filters,
    addFilter,
    removeFilter,
    clearFilters,
    sortField,
    sortDirection,
    setSort,
    facets,
    selectedResult,
    selectResult,
    clearSelectedResult,
    search,
    reset,
    getInputProps,
    getResultsContainerProps,
    getResultItemProps,
  };
}

export default useSearch;
