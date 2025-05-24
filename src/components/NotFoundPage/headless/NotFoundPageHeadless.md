# NotFoundPageHeadless

A headless component for creating customizable 404 (Not Found) pages with extensive flexibility for developers. Not Found pages provide a user-friendly experience when users navigate to a page that doesn't exist.

## Usage

```jsx
import { NotFoundPageHeadless } from 'strive-ui';

function My404Page() {
  return (
    <NotFoundPageHeadless.Root
      title="404 - Page Not Found"
      description="Oops! The page you are looking for does not exist or has been moved."
      actionText="Back to Home"
      onAction={() => window.location.href = '/'}
    >
      <NotFoundPageHeadless.Default />
    </NotFoundPageHeadless.Root>
  );
}
```

## Custom 404 Page

```jsx
import { NotFoundPageHeadless } from 'strive-ui';
import styled from 'styled-components';

// Styled components
const StyledContainer = styled(NotFoundPageHeadless.Container)`
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
`;

const StyledIcon = styled(NotFoundPageHeadless.Icon)`
  font-size: 120px;
  color: #6c757d;
`;

const StyledTitle = styled(NotFoundPageHeadless.Title)`
  font-size: 48px;
  color: #343a40;
  margin-bottom: 24px;
`;

const StyledDescription = styled(NotFoundPageHeadless.Description)`
  font-size: 20px;
  color: #6c757d;
  max-width: 600px;
  line-height: 1.6;
`;

const StyledAction = styled(NotFoundPageHeadless.Action)`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 14px 32px;
  font-size: 18px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #0069d9;
  }
`;

function Custom404Page() {
  return (
    <NotFoundPageHeadless.Root
      title="Page Not Found"
      description="We couldn't find the page you were looking for. This is either because the page doesn't exist or has been moved to a new location."
      actionText="Return to Homepage"
      onAction={() => window.location.href = '/'}
      icon="🔍"
    >
      <StyledContainer>
        <StyledIcon />
        <StyledTitle />
        <StyledDescription />
        <StyledAction />
      </StyledContainer>
    </NotFoundPageHeadless.Root>
  );
}
```

## 404 Page with Search and Suggestions

```jsx
import { NotFoundPageHeadless } from 'strive-ui';
import { useState } from 'react';

function NotFoundPageWithSearch() {
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearch = (query) => {
    console.log(`Searching for: ${query}`);
    
    // Simulate search results
    setSearchResults([
      { title: 'Home Page', url: '/' },
      { title: 'About Us', url: '/about' },
      { title: 'Products', url: '/products' },
    ]);
  };
  
  return (
    <NotFoundPageHeadless.Root
      title="404 - Page Not Found"
      description="We couldn't find the page you were looking for. Try searching for what you need or check out some of our popular pages."
      actionText="Go to Homepage"
      onAction={() => window.location.href = '/'}
      showSearch={true}
      searchPlaceholder="Search for pages..."
      onSearch={handleSearch}
      showSuggestions={true}
      suggestions={[
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Products', href: '/products' },
        { label: 'Contact', href: '/contact' },
      ]}
    >
      <NotFoundPageHeadless.Container>
        <NotFoundPageHeadless.Icon>🔎</NotFoundPageHeadless.Icon>
        <NotFoundPageHeadless.Title />
        <NotFoundPageHeadless.Description />
        <NotFoundPageHeadless.Action />
        
        <NotFoundPageHeadless.Search />
        
        {searchResults.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ marginBottom: '16px' }}>Search Results</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {searchResults.map((result, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <a 
                    href={result.url}
                    style={{ 
                      color: '#0066cc', 
                      textDecoration: 'none',
                      fontSize: '16px',
                    }}
                  >
                    {result.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <NotFoundPageHeadless.Suggestions />
      </NotFoundPageHeadless.Container>
    </NotFoundPageHeadless.Root>
  );
}
```

## Creative 404 Page

```jsx
import { NotFoundPageHeadless } from 'strive-ui';
import { useState, useEffect } from 'react';

function Creative404Page() {
  const [count, setCount] = useState(10);
  
  useEffect(() => {
    if (count <= 0) {
      window.location.href = '/';
      return;
    }
    
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [count]);
  
  return (
    <NotFoundPageHeadless.Root
      title="404 - Lost in Space"
      description="Houston, we have a problem. The page you're looking for has drifted into deep space."
      actionText="Beam Me Up"
      onAction={() => window.location.href = '/'}
    >
      <NotFoundPageHeadless.Container
        style={{
          background: 'linear-gradient(135deg, #000428, #004e92)',
          color: 'white',
        }}
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              fontSize: '150px',
              fontWeight: 'bold',
              opacity: '0.1',
              position: 'absolute',
              top: '-100px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            404
          </div>
          
          <NotFoundPageHeadless.Icon>
            <span style={{ fontSize: '100px' }}>🚀</span>
          </NotFoundPageHeadless.Icon>
          
          <NotFoundPageHeadless.Title
            style={{ color: 'white' }}
          />
          
          <NotFoundPageHeadless.Description
            style={{ color: '#e1e1e1' }}
          />
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>
              Auto-navigating to home in:
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#61dafb',
              }}
            >
              {count}
            </div>
          </div>
          
          <NotFoundPageHeadless.Action
            style={{
              backgroundColor: '#61dafb',
              color: '#004e92',
              border: 'none',
              borderRadius: '30px',
              padding: '14px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          />
          
          <div
            style={{
              marginTop: '64px',
              fontSize: '14px',
              color: '#a1a1a1',
            }}
          >
            Error Code: 404 | Page Not Found
          </div>
        </div>
      </NotFoundPageHeadless.Container>
    </NotFoundPageHeadless.Root>
  );
}
```

## Responsive 404 Page

```jsx
import { NotFoundPageHeadless } from 'strive-ui';
import { useEffect, useState } from 'react';

function Responsive404Page() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = windowWidth < 768;
  
  return (
    <NotFoundPageHeadless.Root
      title="404 - Page Not Found"
      description="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
      actionText="Back to Home"
      onAction={() => window.location.href = '/'}
    >
      <NotFoundPageHeadless.Container
        style={{
          flexDirection: isMobile ? 'column' : 'row',
          padding: isMobile ? '32px 16px' : '64px',
          textAlign: isMobile ? 'center' : 'left',
          gap: '32px',
        }}
      >
        <div
          style={{
            flex: isMobile ? 'none' : '1',
            order: isMobile ? 2 : 1,
          }}
        >
          <NotFoundPageHeadless.Title
            style={{
              fontSize: isMobile ? '28px' : '42px',
            }}
          />
          
          <NotFoundPageHeadless.Description
            style={{
              fontSize: isMobile ? '16px' : '18px',
            }}
          />
          
          <NotFoundPageHeadless.Action
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: isMobile ? '10px 20px' : '12px 24px',
              fontSize: isMobile ? '14px' : '16px',
            }}
          />
        </div>
        
        <div
          style={{
            flex: isMobile ? 'none' : '1',
            order: isMobile ? 1 : 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
            src="https://via.placeholder.com/500x400?text=404+Illustration"
            alt="404 Illustration"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: isMobile ? '200px' : '400px',
            }}
          />
        </div>
      </NotFoundPageHeadless.Container>
    </NotFoundPageHeadless.Root>
  );
}
```

## API

### NotFoundPageHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'404 - Page Not Found'` | Title text for the not found page |
| `description` | `string` | `'The page you are looking for does not exist or has been moved.'` | Description text for the not found page |
| `icon` | `React.ReactNode` | `null` | Icon to display in the not found page |
| `actionText` | `string` | `'Go Home'` | Action button text |
| `onAction` | `() => void` | `() => { window.location.href = '/' }` | Action button callback |
| `showAction` | `boolean` | `true` | Whether to show the action button |
| `content` | `React.ReactNode` | `null` | Additional content to display in the not found page |
| `showSearch` | `boolean` | `false` | Whether to show a search box |
| `searchPlaceholder` | `string` | `'Search...'` | Search placeholder text |
| `onSearch` | `(query: string) => void` | `() => {}` | Search callback |
| `showSuggestions` | `boolean` | `false` | Whether to show suggested links |
| `suggestions` | `Array<{ label: string; href: string }>` | `[]` | Suggested links to display |

### Other Components

- `NotFoundPageHeadless.Container`: Container for the not found page
- `NotFoundPageHeadless.Icon`: Icon component for the not found page
- `NotFoundPageHeadless.Title`: Title component for the not found page
- `NotFoundPageHeadless.Description`: Description component for the not found page
- `NotFoundPageHeadless.Action`: Action button component for the not found page
- `NotFoundPageHeadless.Content`: Additional content component for the not found page
- `NotFoundPageHeadless.Search`: Search form component for the not found page
- `NotFoundPageHeadless.Suggestions`: Suggestions component for the not found page
- `NotFoundPageHeadless.Default`: Pre-configured default not found page component

### useNotFoundPage Hook

For even more control, you can use the `useNotFoundPage` hook directly:

```jsx
import { useNotFoundPage } from 'strive-ui';

function MyCustomNotFoundPage() {
  const {
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
  } = useNotFoundPage({
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist or has been moved.',
    actionText: 'Go Home',
    onAction: () => window.location.href = '/',
    showSearch: true,
    searchPlaceholder: 'Search...',
    onSearch: (query) => console.log(`Searching for: ${query}`),
    showSuggestions: true,
    suggestions: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
    ],
  });
  
  // Custom implementation
}
```

## Accessibility

The Not Found Page component follows accessibility best practices:

- The not found page container has `role="main"` to define it as the main content area
- The search form has `role="search"` to indicate it's a search form
- The search input has appropriate ARIA attributes for better screen reader support
- The action button has appropriate ARIA attributes for better screen reader support
