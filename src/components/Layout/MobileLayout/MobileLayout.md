# Mobile Layout

The `MobileLayout` component provides a layout optimized for mobile devices with features like viewport control, orientation management, and mobile-specific UI elements like status bars and navigation tabs.

## Features

- **Viewport Control**: Optimize for mobile devices with proper meta tags
- **Orientation Management**: Support for portrait, landscape, or both orientations
- **Theme Options**: Light, dark, system-based, and custom color schemes
- **Mobile UI Elements**: Status bar, navigation bar, and tab bar components
- **Safe Area Support**: Respect device notches and home indicators
- **Device Frame**: Optional phone or tablet frame for previewing
- **Mobile Optimizations**: 100vh fix, overscroll prevention, and address bar hiding
- **Screen Management**: Support for multiple screens with transitions

## Installation

```bash
npm install @pulseui/layout
```

## Basic Usage

```tsx
import { MobileLayout, MobileScreen } from '@pulseui/layout';

function BasicMobileApp() {
  return (
    <MobileLayout 
      showStatusBar
      navPosition="bottom"
      showDeviceFrame
    >
      <MobileScreen>
        <div style={{ padding: '16px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Mobile App</h1>
          <p>This is a basic mobile app layout with a status bar and navigation bar.</p>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Features</h2>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Responsive layout</li>
              <li>Mobile-optimized UI</li>
              <li>Status bar</li>
              <li>Navigation bar</li>
            </ul>
          </div>
        </div>
      </MobileScreen>
    </MobileLayout>
  );
}
```

## Examples

### Multi-Screen Mobile App

```tsx
import { MobileLayout, MobileScreen, MobileTabBar } from '@pulseui/layout';
import { useState } from 'react';

function MultiScreenApp() {
  const [activeTab, setActiveTab] = useState('home');
  
  // Tab icons
  const homeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
  
  const searchIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
  
  const profileIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );
  
  const tabs = [
    { id: 'home', label: 'Home', icon: homeIcon },
    { id: 'search', label: 'Search', icon: searchIcon },
    { id: 'profile', label: 'Profile', icon: profileIcon },
  ];
  
  return (
    <MobileLayout 
      showStatusBar
      navPosition="none"
      theme="light"
      showDeviceFrame
    >
      <MobileScreen active={activeTab === 'home'}>
        <div style={{ padding: '16px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Home</h1>
          <p>Welcome to the home screen!</p>
          
          <div style={{ 
            marginTop: '24px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Latest Updates</h2>
            <p>New features have been added to the app.</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Popular Items</h2>
            <p>Check out our most popular items.</p>
          </div>
        </div>
      </MobileScreen>
      
      <MobileScreen active={activeTab === 'search'}>
        <div style={{ padding: '16px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Search</h1>
          
          <div style={{ 
            display: 'flex',
            marginBottom: '16px'
          }}>
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ 
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ 
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Categories</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button style={{ 
                padding: '8px 16px', 
                backgroundColor: '#e0e0e0', 
                border: 'none',
                borderRadius: '16px',
                fontSize: '14px'
              }}>
                Category 1
              </button>
              <button style={{ 
                padding: '8px 16px', 
                backgroundColor: '#e0e0e0', 
                border: 'none',
                borderRadius: '16px',
                fontSize: '14px'
              }}>
                Category 2
              </button>
              <button style={{ 
                padding: '8px 16px', 
                backgroundColor: '#e0e0e0', 
                border: 'none',
                borderRadius: '16px',
                fontSize: '14px'
              }}>
                Category 3
              </button>
            </div>
          </div>
          
          <p>Search results will appear here...</p>
        </div>
      </MobileScreen>
      
      <MobileScreen active={activeTab === 'profile'}>
        <div style={{ padding: '16px' }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ 
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>John Doe</h1>
            <p style={{ color: '#666', margin: 0 }}>john.doe@example.com</p>
          </div>
          
          <div style={{ 
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              padding: '16px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Account Settings</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
            <div style={{ 
              padding: '16px',
              borderBottom: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Notifications</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
            <div style={{ 
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Privacy</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          
          <button style={{ 
            width: '100%',
            padding: '12px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Sign Out
          </button>
        </div>
      </MobileScreen>
      
      <MobileTabBar 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        position="bottom"
        activeColor="#1976d2"
      />
    </MobileLayout>
  );
}
```

### Dark Theme Mobile App

```tsx
import { MobileLayout, MobileScreen } from '@pulseui/layout';

function DarkThemeMobileApp() {
  return (
    <MobileLayout 
      showStatusBar
      navPosition="bottom"
      theme="dark"
      showDeviceFrame
      deviceFrameType="phone"
      statusBarContent={
        <>
          <div>9:41 AM</div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L6 22"></path>
                <path d="M10 6L10 22"></path>
                <path d="M14 10L14 22"></path>
                <path d="M18 14L18 22"></path>
              </svg>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10L21 10"></path>
                <path d="M3 10L15 10"></path>
                <path d="M12 19C12 19 18 13 18 9.99998C18 6.99996 15.3137 4.99996 12 4.99996C8.68629 4.99996 6 6.99996 6 9.99998C6 13 12 19 12 19Z"></path>
              </svg>
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7H17"></path>
                <path d="M7 12H17"></path>
                <path d="M7 17H17"></path>
              </svg>
            </div>
          </div>
        </>
      }
      navContent={
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span style={{ fontSize: '12px', marginTop: '4px' }}>Home</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span style={{ fontSize: '12px', marginTop: '4px' }}>Search</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span style={{ fontSize: '12px', marginTop: '4px' }}>Profile</span>
          </div>
        </>
      }
    >
      <MobileScreen>
        <div style={{ padding: '16px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Dark Theme</h1>
          <p>This is a mobile app with a dark theme.</p>
          
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Card Title</h2>
            <p>This is a card with a dark theme.</p>
          </div>
          
          <button style={{ 
            width: '100%',
            padding: '12px',
            backgroundColor: '#90caf9',
            color: '#121212',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            marginBottom: '16px'
          }}>
            Primary Button
          </button>
          
          <button style={{ 
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#90caf9',
            border: '1px solid #90caf9',
            borderRadius: '8px',
            fontSize: '16px'
          }}>
            Secondary Button
          </button>
        </div>
      </MobileScreen>
    </MobileLayout>
  );
}
```

## API Reference

### MobileLayout Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the mobile layout |
| `viewport` | `'device-width' \| number` | `'device-width'` | The viewport width |
| `maxWidth` | `string \| number` | `'480px'` | The maximum width of the layout |
| `orientation` | `'portrait' \| 'landscape' \| 'both'` | `'both'` | The supported orientation |
| `lockOrientation` | `boolean` | `false` | Whether to lock the orientation |
| `theme` | `'light' \| 'dark' \| 'system' \| 'custom'` | `'light'` | The theme of the mobile layout |
| `customTheme` | `{ backgroundColor?: string; textColor?: string; primaryColor?: string; secondaryColor?: string; surfaceColor?: string; }` | - | Custom theme colors when theme is set to 'custom' |
| `showStatusBar` | `boolean` | `false` | Whether to show a status bar |
| `statusBarContent` | `React.ReactNode` | - | The content for the status bar |
| `navPosition` | `'top' \| 'bottom' \| 'none'` | `'bottom'` | The position of the navigation bar |
| `navContent` | `React.ReactNode` | - | The content for the navigation bar |
| `safeAreaInset` | `boolean` | `true` | Whether to show a safe area inset |
| `preventOverscroll` | `boolean` | `true` | Whether to prevent overscroll/bounce effect |
| `hideAddressBar` | `boolean` | `true` | Whether to hide the address bar on scroll |
| `use100vhFix` | `boolean` | `true` | Whether to use 100vh fix for mobile browsers |
| `showDeviceFrame` | `boolean` | `false` | Whether to show a device frame |
| `deviceFrameType` | `'phone' \| 'tablet'` | `'phone'` | The type of device frame to show |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

### MobileScreen Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The content to render in the mobile screen |
| `active` | `boolean` | `true` | Whether the screen is active |
| `backgroundColor` | `string` | - | The background color of the screen |
| `padding` | `string \| number` | `'16px'` | The padding of the screen |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

### MobileTabBar Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `{ id: string; label: string; icon?: React.ReactNode; }[]` | - | The tabs to render in the tab bar |
| `activeTab` | `string` | - | The active tab ID |
| `onTabChange` | `(tabId: string) => void` | - | Callback when a tab is selected |
| `position` | `'top' \| 'bottom'` | `'bottom'` | The position of the tab bar |
| `backgroundColor` | `string` | `'#ffffff'` | The background color of the tab bar |
| `textColor` | `string` | `'#757575'` | The text color of the tab bar |
| `activeColor` | `string` | `'#1976d2'` | The active text color of the tab bar |
| `showLabels` | `boolean` | `true` | Whether to show labels |
| `showDivider` | `boolean` | `true` | Whether to show a divider |
| `as` | `React.ElementType` | `'div'` | The component used for the root node |
| `className` | `string` | `''` | Custom class name |

## Implementation Details

The MobileLayout component works by:

1. Setting appropriate viewport meta tags for mobile devices
2. Fixing common mobile browser issues like 100vh calculation
3. Preventing overscroll/bounce effects for a more native-like experience
4. Supporting safe area insets for notches and home indicators
5. Providing a device frame for previewing on desktop
6. Managing orientation changes and locking
7. Detecting and applying system theme preferences

## Mobile Optimizations

The MobileLayout component includes several optimizations for mobile devices:

- **100vh Fix**: Correctly handles viewport height on mobile browsers
- **Overscroll Prevention**: Eliminates the bounce effect when scrolling
- **Address Bar Hiding**: Maximizes screen real estate by hiding the browser address bar
- **Safe Area Insets**: Respects device notches and home indicators
- **Orientation Management**: Supports different orientations and can lock to a specific one
- **System Theme Detection**: Automatically adapts to the user's system theme preference

## Browser Support

The MobileLayout component is compatible with all modern mobile browsers:

- Chrome for Android
- Safari for iOS
- Samsung Internet
- Firefox for Android
- Edge for Android

## License

MIT
