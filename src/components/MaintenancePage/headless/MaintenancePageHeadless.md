# MaintenancePageHeadless

A headless component for creating customizable maintenance pages with extensive flexibility for developers. Maintenance pages provide a user-friendly experience when a website is temporarily unavailable due to scheduled maintenance or updates.

## Usage

```jsx
import { MaintenancePageHeadless } from 'strive-ui';

function MyMaintenancePage() {
  return (
    <MaintenancePageHeadless.Root
      title="Site Under Maintenance"
      description="We are currently performing scheduled maintenance to improve your experience. Please check back soon."
      estimatedCompletion="2025-06-01T12:00:00"
      showCountdown={true}
      actionText="Refresh Page"
      onAction={() => window.location.reload()}
    >
      <MaintenancePageHeadless.Default />
    </MaintenancePageHeadless.Root>
  );
}
```

## Custom Maintenance Page

```jsx
import { MaintenancePageHeadless } from 'strive-ui';
import styled from 'styled-components';

// Styled components
const StyledContainer = styled(MaintenancePageHeadless.Container)`
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
`;

const StyledIcon = styled(MaintenancePageHeadless.Icon)`
  font-size: 100px;
  color: #6c757d;
`;

const StyledTitle = styled(MaintenancePageHeadless.Title)`
  font-size: 42px;
  color: #343a40;
  margin-bottom: 24px;
`;

const StyledDescription = styled(MaintenancePageHeadless.Description)`
  font-size: 18px;
  color: #6c757d;
  max-width: 600px;
  line-height: 1.6;
`;

const StyledAction = styled(MaintenancePageHeadless.Action)`
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

function CustomMaintenancePage() {
  return (
    <MaintenancePageHeadless.Root
      title="We're Upgrading Our Systems"
      description="Our team is working hard to bring you an improved experience. We'll be back online shortly."
      actionText="Check Status"
      onAction={() => window.open('https://status.example.com', '_blank')}
      icon="⚙️"
      estimatedCompletion="2025-06-01T12:00:00"
      showCountdown={true}
    >
      <StyledContainer>
        <StyledIcon />
        <StyledTitle />
        <StyledDescription />
        <MaintenancePageHeadless.Countdown />
        <StyledAction />
      </StyledContainer>
    </MaintenancePageHeadless.Root>
  );
}
```

## Maintenance Page with Newsletter and Social Media

```jsx
import { MaintenancePageHeadless } from 'strive-ui';
import { useState } from 'react';

function MaintenancePageWithNewsletter() {
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (email) => {
    console.log(`Subscribed with email: ${email}`);
    setSubscribed(true);
    
    // In a real application, you would send this to your API
    // api.subscribeToNewsletter(email).then(() => setSubscribed(true));
  };
  
  return (
    <MaintenancePageHeadless.Root
      title="We're Making Things Better"
      description="Our website is currently undergoing scheduled maintenance. We're working to improve your experience and will be back online soon."
      estimatedCompletion="2025-06-01T12:00:00"
      showCountdown={true}
      showNewsletter={true}
      onSubscribe={handleSubscribe}
      showSocial={true}
      socialLinks={[
        { name: 'Twitter', url: 'https://twitter.com/example', icon: '🐦' },
        { name: 'Facebook', url: 'https://facebook.com/example', icon: '📘' },
        { name: 'Instagram', url: 'https://instagram.com/example', icon: '📷' },
      ]}
    >
      <MaintenancePageHeadless.Container
        style={{
          backgroundColor: '#f8f9fa',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <MaintenancePageHeadless.Icon
          style={{
            fontSize: '80px',
          }}
        >
          🛠️
        </MaintenancePageHeadless.Icon>
        
        <MaintenancePageHeadless.Title
          style={{
            color: '#343a40',
          }}
        />
        
        <MaintenancePageHeadless.Description
          style={{
            color: '#6c757d',
          }}
        />
        
        <MaintenancePageHeadless.Countdown
          style={{
            backgroundColor: '#e9ecef',
            padding: '24px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '600px',
          }}
        />
        
        {subscribed ? (
          <div
            style={{
              marginTop: '32px',
              padding: '16px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '500px',
            }}
          >
            Thank you for subscribing! We'll notify you when we're back online.
          </div>
        ) : (
          <MaintenancePageHeadless.Newsletter
            style={{
              backgroundColor: '#e9ecef',
              padding: '24px',
              borderRadius: '8px',
            }}
          />
        )}
        
        <MaintenancePageHeadless.Social
          style={{
            marginTop: '32px',
          }}
        />
        
        <MaintenancePageHeadless.Content>
          <div
            style={{
              marginTop: '48px',
              padding: '16px',
              borderTop: '1px solid #dee2e6',
              fontSize: '14px',
              color: '#6c757d',
              width: '100%',
              maxWidth: '600px',
            }}
          >
            <p>If you need immediate assistance, please contact our support team:</p>
            <p>Email: support@example.com | Phone: (123) 456-7890</p>
          </div>
        </MaintenancePageHeadless.Content>
      </MaintenancePageHeadless.Container>
    </MaintenancePageHeadless.Root>
  );
}
```

## Auto-Refreshing Maintenance Page

```jsx
import { MaintenancePageHeadless } from 'strive-ui';

function AutoRefreshMaintenancePage() {
  return (
    <MaintenancePageHeadless.Root
      title="Maintenance in Progress"
      description="We're performing some quick updates to improve performance. This won't take long."
      autoRefresh={true}
      refreshInterval={30}
      actionText="Refresh Now"
      onAction={() => window.location.reload()}
    >
      <MaintenancePageHeadless.Container
        style={{
          backgroundColor: '#f0f4f8',
          fontFamily: 'Arial, sans-serif',
          color: '#2d3748',
        }}
      >
        <MaintenancePageHeadless.Icon>⏱️</MaintenancePageHeadless.Icon>
        <MaintenancePageHeadless.Title />
        <MaintenancePageHeadless.Description />
        
        <MaintenancePageHeadless.Action
          style={{
            backgroundColor: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        />
        
        <MaintenancePageHeadless.RefreshInfo
          style={{
            marginTop: '24px',
            padding: '8px 16px',
            backgroundColor: '#ebf8ff',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#2b6cb0',
          }}
        />
        
        <MaintenancePageHeadless.Content>
          <div
            style={{
              marginTop: '32px',
              fontSize: '14px',
              color: '#718096',
            }}
          >
            We appreciate your patience while we make these improvements.
          </div>
        </MaintenancePageHeadless.Content>
      </MaintenancePageHeadless.Container>
    </MaintenancePageHeadless.Root>
  );
}
```

## Responsive Maintenance Page

```jsx
import { MaintenancePageHeadless } from 'strive-ui';
import { useEffect, useState } from 'react';

function ResponsiveMaintenancePage() {
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
    <MaintenancePageHeadless.Root
      title="Site Maintenance"
      description="We're upgrading our systems to serve you better. We'll be back shortly."
      estimatedCompletion="2025-06-01T12:00:00"
      showCountdown={true}
    >
      <MaintenancePageHeadless.Container
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
          <MaintenancePageHeadless.Title
            style={{
              fontSize: isMobile ? '28px' : '42px',
              textAlign: isMobile ? 'center' : 'left',
            }}
          />
          
          <MaintenancePageHeadless.Description
            style={{
              fontSize: isMobile ? '16px' : '18px',
              textAlign: isMobile ? 'center' : 'left',
            }}
          />
          
          <MaintenancePageHeadless.Countdown
            style={{
              textAlign: isMobile ? 'center' : 'left',
            }}
          />
          
          <MaintenancePageHeadless.Action
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: isMobile ? '10px 20px' : '12px 24px',
              fontSize: isMobile ? '14px' : '16px',
            }}
          >
            Get Status Updates
          </MaintenancePageHeadless.Action>
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
            src="https://via.placeholder.com/500x400?text=Maintenance+Illustration"
            alt="Maintenance Illustration"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: isMobile ? '200px' : '400px',
            }}
          />
        </div>
      </MaintenancePageHeadless.Container>
    </MaintenancePageHeadless.Root>
  );
}
```

## API

### MaintenancePageHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Site Under Maintenance'` | Title text for the maintenance page |
| `description` | `string` | `'We are currently performing scheduled maintenance. Please check back soon.'` | Description text for the maintenance page |
| `icon` | `React.ReactNode` | `null` | Icon to display in the maintenance page |
| `estimatedCompletion` | `string \| Date` | `null` | Estimated completion time |
| `showCountdown` | `boolean` | `false` | Whether to show a countdown timer |
| `actionText` | `string` | `'Refresh Page'` | Action button text |
| `onAction` | `() => void` | `() => { window.location.reload() }` | Action button callback |
| `showAction` | `boolean` | `true` | Whether to show the action button |
| `content` | `React.ReactNode` | `null` | Additional content to display in the maintenance page |
| `showNewsletter` | `boolean` | `false` | Whether to show a newsletter subscription form |
| `onSubscribe` | `(email: string) => void` | `() => {}` | Newsletter subscription callback |
| `showSocial` | `boolean` | `false` | Whether to show social media links |
| `socialLinks` | `Array<{ name: string; url: string; icon?: React.ReactNode }>` | `[]` | Social media links to display |
| `autoRefresh` | `boolean` | `false` | Whether to auto-refresh the page |
| `refreshInterval` | `number` | `60` | Auto-refresh interval in seconds |

### Other Components

- `MaintenancePageHeadless.Container`: Container for the maintenance page
- `MaintenancePageHeadless.Icon`: Icon component for the maintenance page
- `MaintenancePageHeadless.Title`: Title component for the maintenance page
- `MaintenancePageHeadless.Description`: Description component for the maintenance page
- `MaintenancePageHeadless.Countdown`: Countdown timer component for the maintenance page
- `MaintenancePageHeadless.Action`: Action button component for the maintenance page
- `MaintenancePageHeadless.Content`: Additional content component for the maintenance page
- `MaintenancePageHeadless.Newsletter`: Newsletter subscription form component for the maintenance page
- `MaintenancePageHeadless.Social`: Social media links component for the maintenance page
- `MaintenancePageHeadless.RefreshInfo`: Auto-refresh information component for the maintenance page
- `MaintenancePageHeadless.Default`: Pre-configured default maintenance page component

### useMaintenancePage Hook

For even more control, you can use the `useMaintenancePage` hook directly:

```jsx
import { useMaintenancePage } from 'strive-ui';

function MyCustomMaintenancePage() {
  const {
    title,
    description,
    icon,
    estimatedCompletion,
    showCountdown,
    timeRemaining,
    actionText,
    onAction,
    showAction,
    content,
    showNewsletter,
    onSubscribe,
    email,
    setEmail,
    handleEmailChange,
    handleSubscribe,
    showSocial,
    socialLinks,
    autoRefresh,
    refreshInterval,
    refreshCountdown,
    getContainerProps,
    getActionProps,
    getNewsletterFormProps,
    getEmailInputProps,
  } = useMaintenancePage({
    title: 'Site Under Maintenance',
    description: 'We are currently performing scheduled maintenance. Please check back soon.',
    estimatedCompletion: '2025-06-01T12:00:00',
    showCountdown: true,
    actionText: 'Refresh Page',
    onAction: () => window.location.reload(),
    showNewsletter: true,
    onSubscribe: (email) => console.log(`Subscribed: ${email}`),
    showSocial: true,
    socialLinks: [
      { name: 'Twitter', url: 'https://twitter.com/example' },
    ],
    autoRefresh: true,
    refreshInterval: 30,
  });
  
  // Custom implementation
}
```

## Accessibility

The Maintenance Page component follows accessibility best practices:

- The maintenance page container has `role="main"` to define it as the main content area
- The newsletter form has `role="form"` to indicate it's a form
- The email input has appropriate ARIA attributes for better screen reader support
- The action button has appropriate ARIA attributes for better screen reader support
