# SearchHeadless

A headless component for creating powerful, customizable search interfaces with support for advanced features like filtering, faceting, and highlighting.

## Usage

```jsx
import { SearchHeadless } from 'pulseui';

function MySearchInterface() {
  const data = [
    { id: 1, title: 'React Basics', category: 'frontend' },
    { id: 2, title: 'Node.js API', category: 'backend' },
    { id: 3, title: 'CSS Grid Layout', category: 'frontend' },
  ];

  return (
    <SearchHeadless.Root 
      data={data}
      searchableFields={['title', 'category']}
      facetFields={['category']}
      highlightMatches={true}
      fuzzySearch={true}
    >
      <SearchHeadless.Input placeholder="Search..." />
      
      <SearchHeadless.Facets>
        {({ facets, addFilter }) => (
          <div>
            {facets.map(facet => (
              <div key={facet.field}>
                <h4>{facet.field}</h4>
                <ul>
                  {facet.counts.map(({ value, count }) => (
                    <li key={value}>
                      <button onClick={() => addFilter({ field: facet.field, value })}>
                        {value} ({count})
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </SearchHeadless.Facets>
      
      <SearchHeadless.Results>
        {({ results, isLoading, totalResults }) => (
          <div>
            <p>Found {totalResults} results</p>
            <ul>
              {results.map(result => (
                <SearchHeadless.Result key={result.id} result={result}>
                  {({ result, isSelected }) => (
                    <li style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>
                      {result.item.title}
                      {result.matches && result.matches.map(match => (
                        <div key={match.key}>
                          <small>{match.key}:</small>
                          <SearchHeadless.Highlight 
                            text={match.value} 
                            indices={match.indices} 
                          />
                        </div>
                      ))}
                    </li>
                  )}
                </SearchHeadless.Result>
              ))}
            </ul>
          </div>
        )}
      </SearchHeadless.Results>
      
      <SearchHeadless.Empty>
        <p>No results found</p>
      </SearchHeadless.Empty>
      
      <SearchHeadless.Loading>
        <p>Loading...</p>
      </SearchHeadless.Loading>
      
      <SearchHeadless.Error>
        {({ error }) => <p>Error: {error.message}</p>}
      </SearchHeadless.Error>
    </SearchHeadless.Root>
  );
}
```

## API

### SearchHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | `[]` | Data to search through |
| `searchableFields` | `string[]` | `[]` | Fields to search in |
| `initialQuery` | `string` | `''` | Initial query |
| `debounceTime` | `number` | `300` | Debounce time in milliseconds |
| `minQueryLength` | `number` | `1` | Minimum query length to trigger search |
| `maxResults` | `number` | `10` | Maximum number of results to return |
| `highlightMatches` | `boolean` | `true` | Whether to highlight matches |
| `fuzzySearch` | `boolean` | `false` | Whether to use fuzzy matching |
| `fuzzyThreshold` | `number` | `0.6` | Fuzzy search threshold (0-1) |
| `searchFunction` | `Function` | - | Custom search function |
| `onResultsChange` | `Function` | - | Callback when search results change |
| `onQueryChange` | `Function` | - | Callback when query changes |
| `onResultSelect` | `Function` | - | Callback when a result is selected |
| `fetchRemoteData` | `Function` | - | Callback to fetch remote data |
| `initialFilters` | `SearchFilter[]` | `[]` | Initial filters |
| `initialSortField` | `string` | - | Initial sort field |
| `initialSortDirection` | `'asc' \| 'desc'` | `'asc'` | Initial sort direction |
| `facetFields` | `string[]` | `[]` | Fields to generate facets for |
| `liveSearch` | `boolean` | `true` | Whether to enable live search |

### Other Components

- `SearchHeadless.Input`: Input field for search queries
- `SearchHeadless.Results`: Container for search results
- `SearchHeadless.Result`: Individual search result item
- `SearchHeadless.Highlight`: Highlights matched text
- `SearchHeadless.Filters`: Interface for managing filters
- `SearchHeadless.Facets`: Interface for faceted search
- `SearchHeadless.Sort`: Interface for sorting results
- `SearchHeadless.Empty`: Content to show when no results are found
- `SearchHeadless.Loading`: Content to show during loading
- `SearchHeadless.Error`: Content to show when an error occurs

### useSearch Hook

For even more control, you can use the `useSearch` hook directly:

```jsx
import { useSearch } from 'pulseui';

function MyCustomSearch() {
  const {
    query,
    setQuery,
    results,
    isLoading,
    search,
    // ...other properties and methods
  } = useSearch({
    data: myData,
    searchableFields: ['title', 'description'],
  });
  
  // Custom implementation
}
```
