# SkeletonHeadless

A headless component for creating customizable skeleton loaders with extensive flexibility for developers. Skeleton loaders provide a placeholder preview of content before the data gets loaded to reduce load-time frustration.

## Usage

```jsx
import { SkeletonHeadless } from 'pulseui';

function MySkeletonLoader() {
  return (
    <SkeletonHeadless.Root
      variant="text"
      animation="pulse"
      lines={3}
      fullWidth={true}
    >
      <SkeletonHeadless.Container
        style={{
          padding: '16px',
        }}
      >
        <SkeletonHeadless.Text />
      </SkeletonHeadless.Container>
    </SkeletonHeadless.Root>
  );
}
```

## Creating Different Skeleton Variants

```jsx
import { SkeletonHeadless } from 'pulseui';
import { useState } from 'react';

function SkeletonExample() {
  const [animation, setAnimation] = useState('pulse');
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setAnimation('pulse')}>Pulse</button>
        <button onClick={() => setAnimation('wave')}>Wave</button>
        <button onClick={() => setAnimation('shimmer')}>Shimmer</button>
        <button onClick={() => setAnimation('none')}>None</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
        <div>
          <h3>Text Skeleton</h3>
          <SkeletonHeadless.Root
            variant="text"
            animation={animation}
            lines={3}
            fullWidth={true}
          >
            <SkeletonHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <SkeletonHeadless.Text />
            </SkeletonHeadless.Container>
          </SkeletonHeadless.Root>
        </div>
        
        <div>
          <h3>Circle Skeleton</h3>
          <SkeletonHeadless.Root
            variant="circular"
            animation={animation}
          >
            <SkeletonHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <SkeletonHeadless.Circle size="80px" />
            </SkeletonHeadless.Container>
          </SkeletonHeadless.Root>
        </div>
        
        <div>
          <h3>Rectangle Skeleton</h3>
          <SkeletonHeadless.Root
            variant="rectangular"
            animation={animation}
          >
            <SkeletonHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <SkeletonHeadless.Rectangle
                width="100%"
                height="150px"
              />
            </SkeletonHeadless.Container>
          </SkeletonHeadless.Root>
        </div>
        
        <div>
          <h3>Rounded Skeleton</h3>
          <SkeletonHeadless.Root
            variant="rounded"
            animation={animation}
          >
            <SkeletonHeadless.Container
              style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
              }}
            >
              <SkeletonHeadless.Rounded
                width="100%"
                height="60px"
                borderRadius="12px"
              />
            </SkeletonHeadless.Container>
          </SkeletonHeadless.Root>
        </div>
      </div>
    </div>
  );
}
```

## Creating a Card Skeleton

```jsx
import { SkeletonHeadless } from 'pulseui';

function CardSkeleton() {
  return (
    <SkeletonHeadless.Root
      animation="pulse"
      fullWidth={true}
    >
      <SkeletonHeadless.Container
        style={{
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <SkeletonHeadless.Circle size="40px" />
          <div style={{ marginLeft: '12px', flex: 1 }}>
            <SkeletonHeadless.Item
              variant="text"
              width="60%"
              height="16px"
              style={{ marginBottom: '8px' }}
            />
            <SkeletonHeadless.Item
              variant="text"
              width="40%"
              height="12px"
            />
          </div>
        </div>
        
        {/* Card Image */}
        <SkeletonHeadless.Rectangle
          width="100%"
          height="200px"
          style={{ marginBottom: '16px' }}
        />
        
        {/* Card Content */}
        <SkeletonHeadless.Text
          lines={3}
          style={{ marginBottom: '16px' }}
        />
        
        {/* Card Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SkeletonHeadless.Rounded
            width="30%"
            height="36px"
          />
          <SkeletonHeadless.Rounded
            width="30%"
            height="36px"
          />
        </div>
      </SkeletonHeadless.Container>
    </SkeletonHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Card Skeleton Example</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginTop: '24px' }}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
```

## Creating a Profile Skeleton

```jsx
import { SkeletonHeadless } from 'pulseui';

function ProfileSkeleton() {
  return (
    <SkeletonHeadless.Root
      animation="shimmer"
      fullWidth={true}
    >
      <SkeletonHeadless.Container>
        {/* Profile Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <SkeletonHeadless.Circle
            size="120px"
            style={{ marginBottom: '16px' }}
          />
          <SkeletonHeadless.Item
            variant="text"
            width="200px"
            height="24px"
            style={{ marginBottom: '8px' }}
          />
          <SkeletonHeadless.Item
            variant="text"
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
              <SkeletonHeadless.Item
                variant="text"
                width="40px"
                height="24px"
                style={{ marginBottom: '4px' }}
              />
              <SkeletonHeadless.Item
                variant="text"
                width="60px"
                height="14px"
              />
            </div>
          ))}
        </div>
        
        {/* Bio */}
        <div style={{ marginBottom: '24px' }}>
          <SkeletonHeadless.Item
            variant="text"
            width="80px"
            height="16px"
            style={{ marginBottom: '8px' }}
          />
          <SkeletonHeadless.Text lines={3} />
        </div>
        
        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
          }}
        >
          <SkeletonHeadless.Rounded
            width="100%"
            height="40px"
          />
          <SkeletonHeadless.Rounded
            width="100%"
            height="40px"
          />
        </div>
      </SkeletonHeadless.Container>
    </SkeletonHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Profile Skeleton Example</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginTop: '24px',
      }}>
        <ProfileSkeleton />
      </div>
    </div>
  );
}
```

## Creating a Table Skeleton

```jsx
import { SkeletonHeadless } from 'pulseui';

function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <SkeletonHeadless.Root
      animation="pulse"
      fullWidth={true}
    >
      <SkeletonHeadless.Container>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={`header-${index}`} style={{ padding: '12px 16px' }}>
                    <SkeletonHeadless.Item
                      variant="text"
                      height="20px"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={`row-${rowIndex}`}>
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <td key={`cell-${rowIndex}-${colIndex}`} style={{ padding: '12px 16px' }}>
                      <SkeletonHeadless.Item
                        variant="text"
                        height="16px"
                        width={colIndex === 0 ? '60%' : '100%'}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SkeletonHeadless.Container>
    </SkeletonHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Table Skeleton Example</h1>
      
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginTop: '24px',
      }}>
        <TableSkeleton rows={5} columns={4} />
      </div>
    </div>
  );
}
```

## Creating a Content Loader with Conditional Rendering

```jsx
import { SkeletonHeadless } from 'pulseui';
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
  
  const ProfileSkeleton = () => (
    <SkeletonHeadless.Root animation="shimmer" fullWidth={true}>
      <SkeletonHeadless.Container>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SkeletonHeadless.Circle size="120px" style={{ marginBottom: '16px' }} />
          <SkeletonHeadless.Item variant="text" width="200px" height="24px" style={{ marginBottom: '8px' }} />
          <SkeletonHeadless.Item variant="text" width="160px" height="16px" style={{ marginBottom: '24px' }} />
          
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ textAlign: 'center' }}>
                <SkeletonHeadless.Item variant="text" width="40px" height="24px" style={{ marginBottom: '4px' }} />
                <SkeletonHeadless.Item variant="text" width="60px" height="14px" />
              </div>
            ))}
          </div>
          
          <SkeletonHeadless.Text lines={3} style={{ width: '100%', marginBottom: '24px' }} />
          
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <SkeletonHeadless.Rounded width="100%" height="40px" />
            <SkeletonHeadless.Rounded width="100%" height="40px" />
          </div>
        </div>
      </SkeletonHeadless.Container>
    </SkeletonHeadless.Root>
  );
  
  return (
    <ContentLoader isLoading={loading} fallback={<ProfileSkeleton />}>
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
      <h1>User Profile with Skeleton</h1>
      
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

### SkeletonHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'rectangular' \| 'circular' \| 'rounded'` | `'text'` | Variant of the skeleton |
| `animation` | `'pulse' \| 'wave' \| 'shimmer' \| 'none'` | `'pulse'` | Animation of the skeleton |
| `width` | `string \| number` | - | Width of the skeleton |
| `height` | `string \| number` | - | Height of the skeleton |
| `visible` | `boolean` | `true` | Whether the skeleton is visible |
| `borderRadius` | `string \| number` | - | Border radius of the skeleton |
| `lines` | `number` | `1` | Number of lines for text variant |
| `fullWidth` | `boolean` | `false` | Whether the skeleton should take up the full parent width |

### Other Components

- `SkeletonHeadless.Container`: Container for the skeleton
- `SkeletonHeadless.Item`: Generic skeleton item
- `SkeletonHeadless.Text`: Text skeleton with multiple lines
- `SkeletonHeadless.Circle`: Circular skeleton
- `SkeletonHeadless.Rectangle`: Rectangular skeleton
- `SkeletonHeadless.Rounded`: Rounded rectangle skeleton

### useSkeleton Hook

For even more control, you can use the `useSkeleton` hook directly:

```jsx
import { useSkeleton } from 'pulseui';

function MyCustomSkeleton() {
  const {
    variant,
    animation,
    width,
    height,
    visible,
    setVisible,
    borderRadius,
    lines,
    fullWidth,
    show,
    hide,
    toggle,
    getContainerProps,
    getSkeletonProps,
  } = useSkeleton({
    variant: 'text',
    animation: 'pulse',
    width: '100%',
    height: '16px',
    visible: true,
    borderRadius: '4px',
    lines: 3,
    fullWidth: true,
  });
  
  // Custom implementation
}
```

## Accessibility

The Skeleton component follows accessibility best practices:

- The skeleton container has `role="status"` to notify screen readers of status information
- The skeleton has `aria-busy="true"` when visible to indicate that content is loading
- The skeleton has `aria-hidden="true"` to hide it from screen readers when not visible
