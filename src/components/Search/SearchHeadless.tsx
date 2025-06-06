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
    throw new globalThis.Error('useSearchContext must be used within a SearchHeadless.Root component');
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

// Input component - Using type assertion approach to work around forwardRef limitations
const InputComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'input', placeholder = 'Search...', children, ...restProps } = props;
  const { getInputProps } = useSearchContext();
  
  const inputProps = getInputProps();
  
  return (
    <Component 
      {...inputProps} 
      placeholder={placeholder}
      {...restProps} 
      ref={ref}
    >
      {children}
    </Component>
  );
});

InputComponent.displayName = 'SearchHeadless.Input';

const Input = InputComponent as <C extends React.ElementType = 'input'>(
  props: InputProps<C>
) => React.ReactElement | null;

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
const ResultsComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { results, isLoading, totalResults, getResultsContainerProps } = useSearchContext();
  
  return (
    <Component {...getResultsContainerProps()} {...restProps} ref={ref}>
      {typeof children === 'function' 
        ? children({ results, isLoading, totalResults }) 
        : children}
    </Component>
  );
});

ResultsComponent.displayName = 'SearchHeadless.Results';

const Results = ResultsComponent as <T = any, C extends React.ElementType = 'div'>(
  props: ResultsProps<C, T>
) => React.ReactElement | null;

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
const ResultComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', result, children, ...restProps } = props;
  const { getResultItemProps, selectedResult } = useSearchContext();
  const isSelected = selectedResult?.id === result.id;
  
  return (
    <Component {...getResultItemProps(result)} {...restProps} ref={ref}>
      {typeof children === 'function' 
        ? children({ result, isSelected }) 
        : children}
    </Component>
  );
});

ResultComponent.displayName = 'SearchHeadless.Result';

const Result = ResultComponent as <T = any, C extends React.ElementType = 'div'>(
  props: ResultProps<C, T>
) => React.ReactElement | null;

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
const FiltersComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { filters, addFilter, removeFilter, clearFilters } = useSearchContext();
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' 
        ? children({ filters, addFilter, removeFilter, clearFilters }) 
        : children}
    </Component>
  );
});

FiltersComponent.displayName = 'SearchHeadless.Filters';

const Filters = FiltersComponent as <C extends React.ElementType = 'div'>(
  props: FiltersProps<C>
) => React.ReactElement | null;

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
const FacetsComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { facets, addFilter } = useSearchContext();
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' 
        ? children({ facets, addFilter }) 
        : children}
    </Component>
  );
});

FacetsComponent.displayName = 'SearchHeadless.Facets';

const Facets = FacetsComponent as <C extends React.ElementType = 'div'>(
  props: FacetsProps<C>
) => React.ReactElement | null;

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
const SortComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { sortField, sortDirection, setSort } = useSearchContext();
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' 
        ? children({ sortField, sortDirection, setSort }) 
        : children}
    </Component>
  );
});

SortComponent.displayName = 'SearchHeadless.Sort';

const Sort = SortComponent as <C extends React.ElementType = 'div'>(
  props: SortProps<C>
) => React.ReactElement | null;

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
const EmptyComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { results, query, isLoading } = useSearchContext();
  
  if (results.length > 0 || isLoading || !query) {
    return null;
  }
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' 
        ? children({ query }) 
        : children}
    </Component>
  );
});

EmptyComponent.displayName = 'SearchHeadless.Empty';

const Empty = EmptyComponent as <C extends React.ElementType = 'div'>(
  props: EmptyProps<C>
) => React.ReactElement | null;

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
const LoadingComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { isLoading } = useSearchContext();
  
  if (!isLoading) {
    return null;
  }
  
  return (
    <Component {...restProps} ref={ref}>
      {children}
    </Component>
  );
});

LoadingComponent.displayName = 'SearchHeadless.Loading';

const Loading = LoadingComponent as <C extends React.ElementType = 'div'>(
  props: LoadingProps<C>
) => React.ReactElement | null;

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
const ErrorComponent = React.forwardRef((props: any, ref: any) => {
  const { as: Component = 'div', children, ...restProps } = props;
  const { error } = useSearchContext();
  
  if (!error) {
    return null;
  }
  
  return (
    <Component {...restProps} ref={ref}>
      {typeof children === 'function' 
        ? children({ error }) 
        : children}
    </Component>
  );
});

ErrorComponent.displayName = 'SearchHeadless.Error';

const SearchError = ErrorComponent as <C extends React.ElementType = 'div'>(
  props: ErrorProps<C>
) => React.ReactElement | null;

// Export all components
export const SearchHeadless = {
  Root,
  Input,
  Results,
  Result,
  Highlight,
  Filters,
  Facets,
  Sort,
  Empty,
  Loading,
  Error: SearchError,
  useSearchContext,
};

export default SearchHeadless;
