import React, { createContext, useContext, forwardRef } from 'react';
import { useSearch, UseSearchReturn, SearchOptions, SearchResult, SearchFilter, SearchFacet } from './useSearch';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '../../types/polymorphic';

// Context for the Search component
interface SearchContextValue<T = any> extends UseSearchReturn<T> {}

const SearchContext = createContext<SearchContextValue | null>(null);

// Hook to use Search context
export function useSearchContext<T = any>() {
  const context = useContext(SearchContext) as SearchContextValue<T> | null;
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchHeadless.Root component');
  }
  return context;
}

// Root component props
export interface RootProps<T = any> extends SearchOptions<T> {
  /**
   * Children of the component
   */
  children: React.ReactNode;
}

// Root component
function Root<T = any>({ children, ...options }: RootProps<T>) {
  const searchProps = useSearch<T>(options);
  
  return (
    <SearchContext.Provider value={searchProps}>
      {children}
    </SearchContext.Provider>
  );
}

// Input component props
export type InputProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Placeholder text
     */
    placeholder?: string;
    /**
     * Children of the component
     */
    children?: React.ReactNode;
  }
>;

// Input component
const Input = forwardRef(
  <C extends React.ElementType = 'input'>(
    { as, placeholder = 'Search...', children, ...props }: InputProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'input';
    const { getInputProps } = useSearchContext();
    
    return (
      <Component 
        {...getInputProps()} 
        placeholder={placeholder}
        {...props} 
        ref={ref}
      >
        {children}
      </Component>
    );
  }
);

Input.displayName = 'SearchHeadless.Input';

// Results component props
export type ResultsProps<C extends React.ElementType, T = any> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      results: SearchResult<T>[];
      isLoading: boolean;
      totalResults: number;
    }) => React.ReactNode);
  }
>;

// Results component
function Results<T = any, C extends React.ElementType = 'div'>(
  { as, children, ...props }: ResultsProps<C, T>,
  ref: PolymorphicRef<C>
) {
  const Component = as || 'div';
  const { results, isLoading, totalResults, getResultsContainerProps } = useSearchContext<T>();
  
  return (
    <Component {...getResultsContainerProps()} {...props} ref={ref}>
      {typeof children === 'function' 
        ? children({ results, isLoading, totalResults }) 
        : children}
    </Component>
  );
}

const ForwardedResults = forwardRef(Results) as <T = any, C extends React.ElementType = 'div'>(
  props: ResultsProps<C, T> & { ref?: PolymorphicRef<C> }
) => React.ReactElement;

ForwardedResults.displayName = 'SearchHeadless.Results';

// Result component props
export type ResultProps<C extends React.ElementType, T = any> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Result item
     */
    result: SearchResult<T>;
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      result: SearchResult<T>;
      isSelected: boolean;
    }) => React.ReactNode);
  }
>;

// Result component
function Result<T = any, C extends React.ElementType = 'div'>(
  { as, result, children, ...props }: ResultProps<C, T>,
  ref: PolymorphicRef<C>
) {
  const Component = as || 'div';
  const { getResultItemProps, selectedResult } = useSearchContext<T>();
  const isSelected = selectedResult?.id === result.id;
  
  return (
    <Component {...getResultItemProps(result)} {...props} ref={ref}>
      {typeof children === 'function' 
        ? children({ result, isSelected }) 
        : children}
    </Component>
  );
}

const ForwardedResult = forwardRef(Result) as <T = any, C extends React.ElementType = 'div'>(
  props: ResultProps<C, T> & { ref?: PolymorphicRef<C> }
) => React.ReactElement;

ForwardedResult.displayName = 'SearchHeadless.Result';

// Highlight component props
export interface HighlightProps {
  /**
   * Text to highlight
   */
  text: string;
  /**
   * Highlight indices
   */
  indices: [number, number][];
  /**
   * Highlight component
   */
  highlightComponent?: React.ComponentType<{ children: React.ReactNode }>;
}

// Highlight component
const Highlight: React.FC<HighlightProps> = ({ 
  text, 
  indices, 
  highlightComponent: HighlightComponent = ({ children }) => <mark>{children}</mark>
}) => {
  if (!indices || indices.length === 0) {
    return <>{text}</>;
  }
  
  // Sort indices
  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);
  
  // Merge overlapping indices
  const mergedIndices: [number, number][] = [];
  let currentRange = sortedIndices[0];
  
  for (let i = 1; i < sortedIndices.length; i++) {
    if (sortedIndices[i][0] <= currentRange[1] + 1) {
      currentRange[1] = Math.max(currentRange[1], sortedIndices[i][1]);
    } else {
      mergedIndices.push(currentRange);
      currentRange = sortedIndices[i];
    }
  }
  
  mergedIndices.push(currentRange);
  
  // Build highlighted text
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  for (const [start, end] of mergedIndices) {
    if (start > lastIndex) {
      parts.push(text.substring(lastIndex, start));
    }
    
    parts.push(
      <HighlightComponent key={`${start}-${end}`}>
        {text.substring(start, end + 1)}
      </HighlightComponent>
    );
    
    lastIndex = end + 1;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return <>{parts}</>;
};

Highlight.displayName = 'SearchHeadless.Highlight';

// Filters component props
export type FiltersProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      filters: SearchFilter[];
      addFilter: (filter: SearchFilter) => void;
      removeFilter: (field: string) => void;
      clearFilters: () => void;
    }) => React.ReactNode);
  }
>;

// Filters component
const Filters = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: FiltersProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { filters, addFilter, removeFilter, clearFilters } = useSearchContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ filters, addFilter, removeFilter, clearFilters }) 
          : children}
      </Component>
    );
  }
);

Filters.displayName = 'SearchHeadless.Filters';

// Facets component props
export type FacetsProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      facets: SearchFacet[];
      addFilter: (filter: SearchFilter) => void;
    }) => React.ReactNode);
  }
>;

// Facets component
const Facets = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: FacetsProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { facets, addFilter } = useSearchContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ facets, addFilter }) 
          : children}
      </Component>
    );
  }
);

Facets.displayName = 'SearchHeadless.Facets';

// Sort component props
export type SortProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      sortField: string | null;
      sortDirection: 'asc' | 'desc';
      setSort: (field: string, direction?: 'asc' | 'desc') => void;
    }) => React.ReactNode);
  }
>;

// Sort component
const Sort = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: SortProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { sortField, sortDirection, setSort } = useSearchContext();
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ sortField, sortDirection, setSort }) 
          : children}
      </Component>
    );
  }
);

Sort.displayName = 'SearchHeadless.Sort';

// Empty component props
export type EmptyProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode | ((props: {
      query: string;
    }) => React.ReactNode);
  }
>;

// Empty component
const Empty = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: EmptyProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { results, query, isLoading } = useSearchContext();
    
    if (results.length > 0 || isLoading || !query) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ query }) 
          : children}
      </Component>
    );
  }
);

Empty.displayName = 'SearchHeadless.Empty';

// Loading component props
export type LoadingProps<C extends React.ElementType> = PolymorphicComponentPropsWithRef<
  C,
  {
    /**
     * Children of the component
     */
    children: React.ReactNode;
  }
>;

// Loading component
const Loading = forwardRef(
  <C extends React.ElementType = 'div'>(
    { as, children, ...props }: LoadingProps<C>,
    ref: PolymorphicRef<C>
  ) => {
    const Component = as || 'div';
    const { isLoading } = useSearchContext();
    
    if (!isLoading) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {children}
      </Component>
    );
  }
);

Loading.displayName = 'SearchHeadless.Loading';

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
    const { error } = useSearchContext();
    
    if (!error) {
      return null;
    }
    
    return (
      <Component {...props} ref={ref}>
        {typeof children === 'function' 
          ? children({ error }) 
          : children}
      </Component>
    );
  }
);

Error.displayName = 'SearchHeadless.Error';

// Export all components
export const SearchHeadless = {
  Root,
  Input,
  Results: ForwardedResults,
  Result: ForwardedResult,
  Highlight,
  Filters,
  Facets,
  Sort,
  Empty,
  Loading,
  Error,
  useSearchContext,
};

export default SearchHeadless;
