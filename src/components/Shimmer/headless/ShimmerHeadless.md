# ShimmerHeadless

A headless component for creating customizable shimmer effects with extensive flexibility for developers. Shimmer effects are animated loading placeholders that provide a more engaging user experience during content loading.

## Usage

```jsx
import { ShimmerHeadless } from 'pulseui';

function MyShimmerEffect() {
  return (
    <ShimmerHeadless.Root
      shape="rectangle"
      direction="left-to-right"
      duration={1.5}
      baseColor="#e0e0e0"
      highlightColor="#f5f5f5"
      fullWidth={true}
    >
      <ShimmerHeadless.Container
        style={{
          padding: '16px',
        }}
      >
        <ShimmerHeadless.Rectangle
          height="150px"
        />
      </ShimmerHeadless.Container>
    </ShimmerHeadless.Root>
  );
}
```

## Creating Different Shimmer Variants

```jsx
import { ShimmerHeadless } from 'pulseui';
import { useState } from 'react';

function ShimmerExample() {
  const [direction, setDirection] = useState('left-to-right');
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setDirection('left-to-right')}>Left to Right</button>
        <button onClick={() => setDirection('right-to-left')}>Right to Left</button>
        <button onClick={() => setDirection('top-to-bottom')}>Top to Bottom</button>
        <button onClick={() => setDirection('bottom-to-top')}>Bottom to Top</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
        <div>
          <h3>Text Shimmer</h3>
          <ShimmerHeadless.Root
            shape="text"
            direction={direction}
            duration={1.5}
            baseColor="#e0e0e0"
            highlightColor="#f5f5f5"
            fullWidth={true}
          >
            <ShimmerHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ShimmerHeadless.Text
                lines={3}
                gap="12px"
              />
            </ShimmerHeadless.Container>
          </ShimmerHeadless.Root>
        </div>
        
        <div>
          <h3>Circle Shimmer</h3>
          <ShimmerHeadless.Root
            shape="circle"
            direction={direction}
            duration={1.5}
            baseColor="#e0e0e0"
            highlightColor="#f5f5f5"
          >
            <ShimmerHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <ShimmerHeadless.Circle size="80px" />
            </ShimmerHeadless.Container>
          </ShimmerHeadless.Root>
        </div>
        
        <div>
          <h3>Rectangle Shimmer</h3>
          <ShimmerHeadless.Root
            shape="rectangle"
            direction={direction}
            duration={1.5}
            baseColor="#e0e0e0"
            highlightColor="#f5f5f5"
          >
            <ShimmerHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ShimmerHeadless.Rectangle
                width="100%"
                height="150px"
              />
            </ShimmerHeadless.Container>
          </ShimmerHeadless.Root>
        </div>
        
        <div>
          <h3>Rounded Shimmer</h3>
          <ShimmerHeadless.Root
            shape="rounded"
            direction={direction}
            duration={1.5}
            baseColor="#e0e0e0"
            highlightColor="#f5f5f5"
          >
            <ShimmerHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ShimmerHeadless.Rounded
                width="100%"
                height="60px"
                borderRadius="12px"
              />
            </ShimmerHeadless.Container>
          </ShimmerHeadless.Root>
        </div>
      </div>
    </div>
  );
}
```

## Creating a Card Shimmer

```jsx
import { ShimmerHeadless } from 'pulseui';

function CardShimmer() {
  return (
    <ShimmerHeadless.Root
      direction="left-to-right"
      duration={1.5}
      baseColor="#e0e0e0"
      highlightColor="#f5f5f5"
      fullWidth={true}
    >
      <ShimmerHeadless.Container
        style={{
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <ShimmerHeadless.Circle size="40px" />
          <div style={{ marginLeft: '12px', flex: 1 }}>
            <ShimmerHeadless.Item
              shape="text"
              width="60%"
              height="16px"
              style={{ marginBottom: '8px' }}
            />
            <ShimmerHeadless.Item
              shape="text"
              width="40%"
              height="12px"
            />
          </div>
        </div>
        
        {/* Card Image */}
        <ShimmerHeadless.Rectangle
          width="100%"
          height="200px"
          style={{ marginBottom: '16px' }}
        />
        
        {/* Card Content */}
        <ShimmerHeadless.Text
          lines={3}
          style={{ marginBottom: '16px' }}
        />
        
        {/* Card Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ShimmerHeadless.Rounded
            width="30%"
            height="36px"
          />
          <ShimmerHeadless.Rounded
            width="30%"
            height="36px"
          />
        </div>
      </ShimmerHeadless.Container>
    </ShimmerHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Card Shimmer Example</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
        <CardShimmer />
        <CardShimmer />
        <CardShimmer />
      </div>
    </div>
  );
}
```

## Creating a Profile Shimmer

```jsx
import { ShimmerHeadless } from 'pulseui';

function ProfileShimmer() {
  return (
    <ShimmerHeadless.Root
      direction="left-to-right"
      duration={1.5}
      baseColor="#e0e0e0"
      highlightColor="#f5f5f5"
      fullWidth={true}
    >
      <ShimmerHeadless.Container>
        {/* Profile Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <ShimmerHeadless.Circle
            size="120px"
            style={{ marginBottom: '16px' }}
          />
          <ShimmerHeadless.Item
            shape="text"
            width="200px"
            height="24px"
            style={{ marginBottom: '8px' }}
          />
          <ShimmerHeadless.Item
            shape="text"
            width="160px"
            height="16px"
          />
        </div>
        
        {/* Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '24px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <ShimmerHeadless.Item
                shape="text"
                width="40px"
                height="24px"
                style={{ marginBottom: '4px' }}
              />
              <ShimmerHeadless.Item
                shape="text"
                width="60px"
                height="14px"
              />
            </div>
          ))}
        </div>
        
        {/* Bio */}
        <div style={{ marginBottom: '24px' }}>
          <ShimmerHeadless.Item
            shape="text"
            width="80px"
            height="16px"
            style={{ marginBottom: '8px' }}
          />
          <ShimmerHeadless.Text lines={3} />
        </div>
        
        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          <ShimmerHeadless.Rounded
            width="100%"
            height="40px"
          />
          <ShimmerHeadless.Rounded
            width="100%"
            height="40px"
          />
        </div>
      </ShimmerHeadless.Container>
    </ShimmerHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Profile Shimmer Example</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginTop: '24px',
      }}>
        <ProfileShimmer />
      </div>
    </div>
  );
}
```

## Creating a List Shimmer

```jsx
import { ShimmerHeadless } from 'pulseui';

function ListItemShimmer() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
      <ShimmerHeadless.Circle size="40px" />
      <div style={{ marginLeft: '12px', flex: 1 }}>
        <ShimmerHeadless.Item
          shape="text"
          width="70%"
          height="16px"
          style={{ marginBottom: '8px' }}
        />
        <ShimmerHeadless.Item
          shape="text"
          width="40%"
          height="12px"
        />
      </div>
      <ShimmerHeadless.Rounded
        width="60px"
        height="32px"
      />
    </div>
  );
}

function ListShimmer({ items = 5 }) {
  return (
    <ShimmerHeadless.Root
      direction="left-to-right"
      duration={1.5}
      baseColor="#e0e0e0"
      highlightColor="#f5f5f5"
      fullWidth={true}
    >
      <ShimmerHeadless.Container>
        {/* Search Bar */}
        <ShimmerHeadless.Rounded
          width="100%"
          height="48px"
          style={{ marginBottom: '24px' }}
        />
        
        {/* List Items */}
        <div style={{ borderTop: '1px solid #eee' }}>
          {Array.from({ length: items }).map((_, index) => (
            <div key={index} style={{ borderBottom: '1px solid #eee' }}>
              <ListItemShimmer />
            </div>
          ))}
        </div>
      </ShimmerHeadless.Container>
    </ShimmerHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>List Shimmer Example</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginTop: '24px',
      }}>
        <ListShimmer items={5} />
      </div>
    </div>
  );
}
```

## Creating a Content Loader with Conditional Rendering

```jsx
import { ShimmerHeadless } from 'pulseui';
import { useState, useEffect } from 'react';

function ContentLoader({ children, isLoading, fallback }) {
  return isLoading ? fallback : children;
}

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate API call
  useEffect(() => {
    setLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setUser({
        id: userId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: 'https://via.placeholder.com/120',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        followers: 1234,
        following: 567,
        posts: 42,
      });
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [userId]);
  
  const ProfileShimmer = () => (
    <ShimmerHeadless.Root
      direction="left-to-right"
      duration={1.5}
      baseColor="#e0e0e0"
      highlightColor="#f5f5f5"
      fullWidth={true}
    >
      <ShimmerHeadless.Container>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ShimmerHeadless.Circle size="120px" style={{ marginBottom: '16px' }} />
          <ShimmerHeadless.Item shape="text" width="200px" height="24px" style={{ marginBottom: '8px' }} />
          <ShimmerHeadless.Item shape="text" width="160px" height="16px" style={{ marginBottom: '24px' }} />
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ textAlign: 'center' }}>
                <ShimmerHeadless.Item shape="text" width="40px" height="24px" style={{ marginBottom: '4px' }} />
                <ShimmerHeadless.Item shape="text" width="60px" height="14px" />
              </div>
            ))}
          </div>
          
          <ShimmerHeadless.Text lines={3} style={{ width: '100%', marginBottom: '24px' }} />
          
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <ShimmerHeadless.Rounded width="100%" height="40px" />
            <ShimmerHeadless.Rounded width="100%" height="40px" />
          </div>
        </div>
      </ShimmerHeadless.Container>
    </ShimmerHeadless.Root>
  );
  
  return (
    <ContentLoader isLoading={loading} fallback={<ProfileShimmer />}>
      {user && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={user.avatar} 
            alt={user.name} 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%',
              marginBottom: '16px',
            }} 
          />
          
          <h2 style={{ marginBottom: '8px' }}>{user.name}</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>{user.email}</p>
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{user.followers}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{user.following}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Following</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold' }}>{user.posts}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>Posts</div>
            </div>
          </div>
          
          <p style={{ marginBottom: '24px' }}>{user.bio}</p>
          
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button 
              style={{ 
                flex: 1, 
                padding: '10px', 
                backgroundColor: '#2196f3', 
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Follow
            </button>
            <button 
              style={{ 
                flex: 1, 
                padding: '10px', 
                backgroundColor: 'white', 
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Message
            </button>
          </div>
        </div>
      )}
    </ContentLoader>
  );
}

// Usage
function App() {
  const [userId, setUserId] = useState('123');
  const [reload, setReload] = useState(0);
  
  const handleReload = () => {
    setReload(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>User Profile with Shimmer</h1>
      
      <button 
        onClick={handleReload}
        style={{
          padding: '8px 16px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '24px',
        }}
      >
        Reload Profile
      </button>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <UserProfile key={reload} userId={userId} />
      </div>
    </div>
  );
}
```

## API

### ShimmerHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shape` | `'rectangle' \| 'circle' \| 'rounded' \| 'text'` | `'rectangle'` | Shape of the shimmer |
| `width` | `string \| number` | - | Width of the shimmer |
| `height` | `string \| number` | - | Height of the shimmer |
| `visible` | `boolean` | `true` | Whether the shimmer is visible |
| `borderRadius` | `string \| number` | - | Border radius of the shimmer |
| `duration` | `number` | `1.5` | Duration of the shimmer animation in seconds |
| `direction` | `'left-to-right' \| 'right-to-left' \| 'top-to-bottom' \| 'bottom-to-top'` | `'left-to-right'` | Direction of the shimmer animation |
| `baseColor` | `string` | `'#e0e0e0'` | Base color of the shimmer |
| `highlightColor` | `string` | `'#f5f5f5'` | Highlight color of the shimmer |
| `fullWidth` | `boolean` | `false` | Whether the shimmer should take up the full parent width |

### Other Components

- `ShimmerHeadless.Container`: Container for the shimmer
- `ShimmerHeadless.Item`: Generic shimmer item
- `ShimmerHeadless.Effect`: Shimmer effect element
- `ShimmerHeadless.Text`: Text shimmer with multiple lines
- `ShimmerHeadless.Circle`: Circular shimmer
- `ShimmerHeadless.Rectangle`: Rectangular shimmer
- `ShimmerHeadless.Rounded`: Rounded rectangle shimmer

### useShimmer Hook

For even more control, you can use the `useShimmer` hook directly:

```jsx
import { useShimmer } from 'pulseui';

function MyCustomShimmer() {
  const {
    shape,
    width,
    height,
    visible,
    setVisible,
    borderRadius,
    duration,
    direction,
    baseColor,
    highlightColor,
    fullWidth,
    show,
    hide,
    toggle,
    getContainerProps,
    getShimmerProps,
    getEffectProps,
  } = useShimmer({
    shape: 'rectangle',
    width: '100%',
    height: '100px',
    visible: true,
    borderRadius: '4px',
    duration: 1.5,
    direction: 'left-to-right',
    baseColor: '#e0e0e0',
    highlightColor: '#f5f5f5',
    fullWidth: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Shimmer component follows accessibility best practices:

- The shimmer container has `role="status"` to notify screen readers of status information
- The shimmer has `aria-busy="true"` when visible to indicate that content is loading
- The shimmer has `aria-hidden="true"` to hide it from screen readers when not visible
