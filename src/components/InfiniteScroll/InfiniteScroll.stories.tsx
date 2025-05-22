import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { InfiniteScroll, InfiniteScrollProps } from './InfiniteScroll';
import styled from 'styled-components';
import { Card } from '../Card';
import { Spinner } from '../Spinner';

export default {
  title: 'Components/InfiniteScroll',
  component: InfiniteScroll,
  argTypes: {
    hasMore: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
    threshold: {
      control: { type: 'number', min: 50, max: 500 },
    },
    useWindowScroll: {
      control: 'boolean',
    },
    height: {
      control: 'text',
    },
  },
} as Meta;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const ItemCard = styled(Card)`
  margin-bottom: 16px;
  padding: 16px;
`;

const CustomLoadingComponent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const CustomEndComponent = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// Mock data generator
const generateItems = (startIndex: number, count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: startIndex + index,
    title: `Item ${startIndex + index}`,
    content: `This is the content for item ${startIndex + index}. It contains some sample text to demonstrate the infinite scroll component.`,
  }));
};

export const Default: Story = () => {
  const [items, setItems] = useState(generateItems(0, 10));
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newItems = generateItems(items.length, 5);
    setItems([...items, ...newItems]);
    
    // Stop loading after 50 items
    if (items.length + newItems.length >= 50) {
      setHasMore(false);
    }
    
    setIsLoading(false);
  };

  return (
    <Container>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        height="500px"
        loadingComponent={
          <CustomLoadingComponent>
            <Spinner size="md" />
          </CustomLoadingComponent>
        }
      >
        {items.map((item) => (
          <ItemCard key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </ItemCard>
        ))}
      </InfiniteScroll>
    </Container>
  );
};

export const WindowScroll: Story = () => {
  const [items, setItems] = useState(generateItems(0, 10));
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newItems = generateItems(items.length, 5);
    setItems([...items, ...newItems]);
    
    // Stop loading after 30 items
    if (items.length + newItems.length >= 30) {
      setHasMore(false);
    }
    
    setIsLoading(false);
  };

  return (
    <Container>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        useWindowScroll
        loadingComponent={
          <CustomLoadingComponent>
            <Spinner size="md" />
          </CustomLoadingComponent>
        }
        endComponent={
          <CustomEndComponent>
            You've reached the end!
          </CustomEndComponent>
        }
      >
        {items.map((item) => (
          <ItemCard key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </ItemCard>
        ))}
      </InfiniteScroll>
    </Container>
  );
};

export const WithError: Story = () => {
  const [items, setItems] = useState(generateItems(0, 10));
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldError, setShouldError] = useState(false);

  const loadMore = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simulate error on second load
    if (shouldError) {
      setIsLoading(false);
      throw new Error('Failed to load more items');
    }
    
    const newItems = generateItems(items.length, 5);
    setItems([...items, ...newItems]);
    setShouldError(true); // Next load will error
    
    setIsLoading(false);
  };

  return (
    <Container>
      <InfiniteScroll
        loadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        height="500px"
        errorComponent={
          <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
            Something went wrong! Please try refreshing the page.
          </div>
        }
      >
        {items.map((item) => (
          <ItemCard key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.content}</p>
          </ItemCard>
        ))}
      </InfiniteScroll>
    </Container>
  );
};
