# VirtualScrollHeadless

A headless implementation of virtual scrolling that efficiently renders only the visible items in a long list. This component follows the headless UI pattern, allowing developers to have complete control over styling while maintaining proper functionality and accessibility.

## Features

- **Fully customizable**: Complete control over styling with zero default styles
- **Accessible**: Built with ARIA attributes for screen readers
- **Compound component API**: Intuitive API with nested components
- **Polymorphic**: Can render as any HTML element or React component
- **Virtualization**: Only renders items that are visible in the viewport
- **Dynamic item heights**: Supports both fixed and variable item heights
- **Horizontal or vertical scrolling**: Supports both directions
- **Smooth scrolling**: Optional smooth scrolling behavior
- **Scroll to item**: Programmatically scroll to specific items

## Basic Usage

```jsx
import { VirtualScroll } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(VirtualScroll)`
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
`;

const Item = styled(VirtualScroll.Item)`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f7fafc;
  }
`;

function MyVirtualScroll() {
  // Create an array of 10,000 items
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `Description for item ${i}`,
  }));
  
  return (
    <Container
      items={items}
      height={400}
      itemHeight={60}
      overscan={5}
      ariaLabel="Virtual list example"
    >
      <VirtualScroll.Content>
        {({ virtualItems }) => (
          <>
            {virtualItems.map(virtualItem => (
              <Item
                key={virtualItem.key}
                virtualItem={virtualItem}
              >
                <h3>{items[virtualItem.index].name}</h3>
                <p>{items[virtualItem.index].description}</p>
              </Item>
            ))}
          </>
        )}
      </VirtualScroll.Content>
    </Container>
  );
}
```

## Variable Height Items

```jsx
import { VirtualScroll } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(VirtualScroll)`
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
`;

const Item = styled(VirtualScroll.Item)`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  
  &:nth-child(odd) {
    background-color: #f7fafc;
  }
`;

function VariableHeightExample() {
  // Create items with different content lengths
  const items = Array.from({ length: 1000 }, (_, i) => {
    const paragraphs = Math.floor(Math.random() * 3) + 1; // 1-3 paragraphs
    
    return {
      id: i,
      title: `Item ${i}`,
      content: Array.from({ length: paragraphs }, (_, p) => (
        `This is paragraph ${p + 1} for item ${i}. ${
          Math.random() > 0.5 
            ? 'It has some additional text to make it longer.' 
            : ''
        }`
      )),
    };
  });
  
  // Calculate item height based on content
  const getItemHeight = (item, index) => {
    // Base height + height per paragraph
    return 60 + (item.content.length * 24);
  };
  
  return (
    <Container
      items={items}
      height={500}
      itemHeight={getItemHeight}
      overscan={3}
    >
      <VirtualScroll.Content>
        {({ virtualItems }) => (
          <>
            {virtualItems.map(virtualItem => {
              const item = items[virtualItem.index];
              
              return (
                <Item
                  key={virtualItem.key}
                  virtualItem={virtualItem}
                >
                  <h3>{item.title}</h3>
                  {item.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </Item>
              );
            })}
          </>
        )}
      </VirtualScroll.Content>
    </Container>
  );
}
```

## Horizontal Scrolling

```jsx
import { VirtualScroll } from 'pulseui';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled(VirtualScroll)`
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
`;

const Item = styled(VirtualScroll.Item)`
  height: 100%;
  padding: 1rem;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

function HorizontalScrollExample() {
  const items = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    color: `hsl(${(i * 10) % 360}, 70%, 80%)`,
  }));
  
  return (
    <Container
      items={items}
      height={200}
      width={800}
      itemHeight={150} // In horizontal mode, this is actually the width
      horizontal
      smoothScroll
    >
      <VirtualScroll.Content>
        {({ virtualItems }) => (
          <>
            {virtualItems.map(virtualItem => (
              <Item
                key={virtualItem.key}
                virtualItem={virtualItem}
                style={{ backgroundColor: items[virtualItem.index].color }}
              >
                <h3>{items[virtualItem.index].name}</h3>
                <div>Width: {virtualItem.size}px</div>
              </Item>
            ))}
          </>
        )}
      </VirtualScroll.Content>
    </Container>
  );
}
```

## Scroll To Item

```jsx
import { VirtualScroll } from 'pulseui';
import { useState, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  
  &:hover {
    background-color: #3182ce;
  }
  
  &:disabled {
    background-color: #a0aec0;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  width: 100px;
`;

const VirtualList = styled(VirtualScroll)`
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  height: 400px;
`;

const Item = styled(VirtualScroll.Item)`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  
  &:nth-child(even) {
    background-color: #f7fafc;
  }
  
  &.active {
    background-color: #ebf8ff;
    border-left: 4px solid #4299e1;
  }
`;

function ScrollToExample() {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [inputValue, setInputValue] = useState('0');
  const virtualScrollRef = useRef();
  
  const handleScrollToItem = (index, align = 'start') => {
    if (index >= 0 && index < items.length) {
      virtualScrollRef.current.scrollToItem(index, { align });
      setActiveIndex(index);
    }
  };
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleGoToItem = () => {
    const index = parseInt(inputValue, 10);
    if (!isNaN(index)) {
      handleScrollToItem(index);
    }
  };
  
  return (
    <Container>
      <Controls>
        <Button 
          onClick={() => handleScrollToItem(0)}
          disabled={activeIndex === 0}
        >
          First
        </Button>
        <Button 
          onClick={() => handleScrollToItem(activeIndex - 1)}
          disabled={activeIndex <= 0}
        >
          Previous
        </Button>
        <div>
          <Input 
            type="number" 
            min="0" 
            max={items.length - 1} 
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button onClick={handleGoToItem}>Go</Button>
        </div>
        <Button 
          onClick={() => handleScrollToItem(activeIndex + 1)}
          disabled={activeIndex >= items.length - 1}
        >
          Next
        </Button>
        <Button 
          onClick={() => handleScrollToItem(items.length - 1)}
          disabled={activeIndex === items.length - 1}
        >
          Last
        </Button>
        <div>
          <Button onClick={() => handleScrollToItem(activeIndex, 'start')}>Align Start</Button>
          <Button onClick={() => handleScrollToItem(activeIndex, 'center')}>Align Center</Button>
          <Button onClick={() => handleScrollToItem(activeIndex, 'end')}>Align End</Button>
        </div>
      </Controls>
      
      <VirtualList
        ref={virtualScrollRef}
        items={items}
        height={400}
        itemHeight={60}
        overscan={5}
      >
        <VirtualScroll.Content>
          {({ virtualItems }) => (
            <>
              {virtualItems.map(virtualItem => (
                <Item
                  key={virtualItem.key}
                  virtualItem={virtualItem}
                  className={virtualItem.index === activeIndex ? 'active' : ''}
                  onClick={() => setActiveIndex(virtualItem.index)}
                >
                  <h3>{items[virtualItem.index].name}</h3>
                  <p>Index: {virtualItem.index}</p>
                </Item>
              ))}
            </>
          )}
        </VirtualScroll.Content>
      </VirtualList>
    </Container>
  );
}
```

## Advanced Customization with Data Fetching

```jsx
import { VirtualScroll } from 'pulseui';
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 1rem;
  width: 100%;
`;

const VirtualList = styled(VirtualScroll)`
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  height: 600px;
`;

const UserCard = styled(VirtualScroll.Item)`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  &:hover {
    background-color: #f7fafc;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #718096;
`;

function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Simulating API call with a larger dataset
        const response = await axios.get('https://api.example.com/users?results=1000');
        setUsers(response.data.results);
        setFilteredUsers(response.data.results);
      } catch (err) {
        setError('Failed to load users. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user => 
      user.name.first.toLowerCase().includes(term) || 
      user.name.last.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);
  
  // Calculate dynamic item height based on content
  const getItemHeight = (user) => {
    // Base height for all items
    return 80;
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  if (isLoading) {
    return <LoadingState>Loading users...</LoadingState>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
  
  return (
    <Container>
      <SearchInput
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      
      <VirtualList
        items={filteredUsers}
        height={600}
        itemHeight={getItemHeight}
        overscan={5}
        itemKey={(user) => user.login.uuid}
      >
        <VirtualScroll.Content>
          {({ virtualItems }) => (
            <>
              {virtualItems.map(virtualItem => {
                const user = filteredUsers[virtualItem.index];
                return (
                  <UserCard
                    key={virtualItem.key}
                    virtualItem={virtualItem}
                  >
                    <Avatar src={user.picture.medium} alt={`${user.name.first} ${user.name.last}`} />
                    <UserInfo>
                      <h3>{`${user.name.first} ${user.name.last}`}</h3>
                      <p>{user.email}</p>
                      <p>{user.location.city}, {user.location.country}</p>
                    </UserInfo>
                  </UserCard>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  No users found matching "{searchTerm}"
                </div>
              )}
            </>
          )}
        </VirtualScroll.Content>
      </VirtualList>
    </Container>
  );
}
```

## Props

### VirtualScroll

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | T[] | - | Array of items to virtualize |
| itemHeight | number \| (item: T, index: number) => number | - | Height of each item in pixels or a function that returns the height for a specific item |
| height | number | - | Height of the viewport in pixels |
| width | number | - | Width of the viewport in pixels |
| overscan | number | 3 | Number of items to render above and below the visible area |
| initialScrollOffset | number | 0 | Initial scroll offset in pixels |
| onScroll | (scrollTop: number) => void | - | Callback when the scroll position changes |
| onItemsRendered | (params: { overscanStartIndex: number; overscanEndIndex: number; visibleStartIndex: number; visibleEndIndex: number; }) => void | - | Callback when the rendered items change |
| horizontal | boolean | false | Whether to enable horizontal scrolling |
| smoothScroll | boolean | false | Whether to enable smooth scrolling |
| itemKey | (item: T, index: number) => string \| number | (_, index) => index | Function to get a unique key for each item |
| ariaLabel | string | 'Virtualized list' | Aria label for the list |
| as | React.ElementType | 'div' | The element type to render as |

### VirtualScroll.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | React.ReactNode | - | Children to render inside the virtual scroll content |
| as | React.ElementType | 'div' | The element type to render as |

### VirtualScroll.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| virtualItem | VirtualItem<T> | - | Virtual item data from the virtualItems array |
| children | React.ReactNode | - | Children to render inside the virtual scroll item |
| as | React.ElementType | 'div' | The element type to render as |

## Accessibility

The VirtualScrollHeadless component includes several accessibility features:

- Proper ARIA roles and attributes
- `role="list"` for the container
- `role="listitem"` for each item
- `aria-rowindex` to indicate the position of each item in the list
- Keyboard navigation support
- Focusable container with `tabIndex={0}`
