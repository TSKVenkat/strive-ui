# ComingSoonPageHeadless

A headless component for creating customizable coming soon pages with extensive flexibility for developers. Coming soon pages provide a user-friendly experience when a website or feature is under development but not yet available.

## Usage

```jsx
import { ComingSoonPageHeadless } from 'pulseui';

function MyComingSoonPage() {
  return (
    <ComingSoonPageHeadless.Root
      title="Coming Soon"
      description="We're working on something exciting. Our new website will be launching soon!"
      launchDate="2025-08-01T12:00:00"
      showCountdown={true}
      actionText="Notify Me"
      onAction={() => console.log('Notify clicked')}
    >
      <ComingSoonPageHeadless.Default />
    </ComingSoonPageHeadless.Root>
  );
}
```

## Custom Coming Soon Page

```jsx
import { ComingSoonPageHeadless } from 'pulseui';
import styled from 'styled-components';

// Styled components
const StyledContainer = styled(ComingSoonPageHeadless.Container)`
  background-color: #f8f9fa;
  font-family: 'Arial', sans-serif;
`;

const StyledIcon = styled(ComingSoonPageHeadless.Icon)`
  font-size: 100px;
  color: #6c757d;
`;

const StyledTitle = styled(ComingSoonPageHeadless.Title)`
  font-size: 42px;
  color: #343a40;
  margin-bottom: 24px;
`;

const StyledDescription = styled(ComingSoonPageHeadless.Description)`
  font-size: 18px;
  color: #6c757d;
  max-width: 600px;
  line-height: 1.6;
`;

const StyledAction = styled(ComingSoonPageHeadless.Action)`
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

function CustomComingSoonPage() {
  return (
    <ComingSoonPageHeadless.Root
      title="Launching Soon"
      description="We're putting the finishing touches on our new platform. Get ready for an amazing experience!"
      actionText="Get Early Access"
      onAction={() => console.log('Early access requested')}
      icon="🚀"
      launchDate="2025-08-01T12:00:00"
      showCountdown={true}
    >
      <StyledContainer>
        <StyledIcon />
        <StyledTitle />
        <StyledDescription />
        <ComingSoonPageHeadless.Countdown />
        <StyledAction />
      </StyledContainer>
    </ComingSoonPageHeadless.Root>
  );
}
```

## Coming Soon Page with Newsletter and Social Media

```jsx
import { ComingSoonPageHeadless } from 'pulseui';
import { useState } from 'react';

function ComingSoonPageWithNewsletter() {
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (email) => {
    console.log(`Subscribed with email: ${email}`);
    setSubscribed(true);
    
    // In a real application, you would send this to your API
    // api.subscribeToNewsletter(email).then(() => setSubscribed(true));
  };
  
  return (
    <ComingSoonPageHeadless.Root
      title="Something Big is Coming"
      description="We're working on a new product that will revolutionize the way you work. Sign up to be the first to know when we launch."
      launchDate="2025-08-01T12:00:00"
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
      <ComingSoonPageHeadless.Container
        style={{
          backgroundColor: '#f8f9fa',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <ComingSoonPageHeadless.Icon
          style={{
            fontSize: '80px',
          }}
        >
          🚀
        </ComingSoonPageHeadless.Icon>
        
        <ComingSoonPageHeadless.Title
          style={{
            color: '#343a40',
          }}
        />
        
        <ComingSoonPageHeadless.Description
          style={{
            color: '#6c757d',
          }}
        />
        
        <ComingSoonPageHeadless.Countdown
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
            Thank you for subscribing! We'll notify you when we launch.
          </div>
        ) : (
          <ComingSoonPageHeadless.Newsletter
            style={{
              backgroundColor: '#e9ecef',
              padding: '24px',
              borderRadius: '8px',
            }}
          />
        )}
        
        <ComingSoonPageHeadless.Social
          style={{
            marginTop: '32px',
          }}
        />
        
        <ComingSoonPageHeadless.Content>
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
            <p>Want to learn more about our upcoming product?</p>
            <p>Email: info@example.com | Phone: (123) 456-7890</p>
          </div>
        </ComingSoonPageHeadless.Content>
      </ComingSoonPageHeadless.Container>
    </ComingSoonPageHeadless.Root>
  );
}
```

## Creative Coming Soon Page

```jsx
import { ComingSoonPageHeadless } from 'pulseui';
import { useState, useEffect } from 'react';

function CreativeComingSoonPage() {
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 15;
      const y = (e.clientY / window.innerHeight) * 15;
      setBackgroundPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <ComingSoonPageHeadless.Root
      title="A New Experience Awaits"
      description="We're crafting something extraordinary. Join us on this journey."
      launchDate="2025-08-01T12:00:00"
      showCountdown={true}
      showNewsletter={true}
      onSubscribe={(email) => console.log(`Subscribed: ${email}`)}
    >
      <ComingSoonPageHeadless.Container
        style={{
          background: `linear-gradient(135deg, #6e8efb, #a777e3)`,
          color: 'white',
          backgroundPosition: `${backgroundPosition.x}px ${backgroundPosition.y}px`,
          transition: 'background-position 0.2s ease-out',
        }}
      >
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '40px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ComingSoonPageHeadless.Icon
            style={{
              fontSize: '100px',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            ✨
          </ComingSoonPageHeadless.Icon>
          
          <ComingSoonPageHeadless.Title
            style={{
              fontSize: '48px',
              fontWeight: '800',
              color: 'white',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
          
          <ComingSoonPageHeadless.Description
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              lineHeight: '1.6',
            }}
          />
          
          <ComingSoonPageHeadless.Countdown
            style={{
              marginBottom: '40px',
            }}
          />
          
          <ComingSoonPageHeadless.Newsletter
            style={{
              width: '100%',
              maxWidth: '500px',
            }}
          />
          
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
              opacity: 0.1,
              backgroundImage: 'radial-gradient(circle at 25% 25%, white 1%, transparent 8%), radial-gradient(circle at 75% 75%, white 1%, transparent 8%)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>
      </ComingSoonPageHeadless.Container>
    </ComingSoonPageHeadless.Root>
  );
}
```

## Responsive Coming Soon Page

```jsx
import { ComingSoonPageHeadless } from 'pulseui';
import { useEffect, useState } from 'react';

function ResponsiveComingSoonPage() {
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
    <ComingSoonPageHeadless.Root
      title="Coming Soon"
      description="Our new website is under construction. We'll be launching soon with a brand new look and improved features."
      launchDate="2025-08-01T12:00:00"
      showCountdown={true}
      showNewsletter={true}
      onSubscribe={(email) => console.log(`Subscribed: ${email}`)}
    >
      <ComingSoonPageHeadless.Container
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
          <ComingSoonPageHeadless.Title
            style={{
              fontSize: isMobile ? '28px' : '42px',
              textAlign: isMobile ? 'center' : 'left',
            }}
          />
          
          <ComingSoonPageHeadless.Description
            style={{
              fontSize: isMobile ? '16px' : '18px',
              textAlign: isMobile ? 'center' : 'left',
            }}
          />
          
          <ComingSoonPageHeadless.Countdown
            style={{
              textAlign: isMobile ? 'center' : 'left',
            }}
          />
          
          <ComingSoonPageHeadless.Newsletter
            style={{
              margin: isMobile ? '0 auto' : '0',
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
            src="https://via.placeholder.com/500x400?text=Coming+Soon+Illustration"
            alt="Coming Soon Illustration"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: isMobile ? '200px' : '400px',
            }}
          />
        </div>
      </ComingSoonPageHeadless.Container>
    </ComingSoonPageHeadless.Root>
  );
}
```

## API

### ComingSoonPageHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Coming Soon'` | Title text for the coming soon page |
| `description` | `string` | `'We are working hard to bring you something amazing. Stay tuned!'` | Description text for the coming soon page |
| `icon` | `React.ReactNode` | `null` | Icon to display in the coming soon page |
| `launchDate` | `string \| Date` | `null` | Launch date |
| `showCountdown` | `boolean` | `false` | Whether to show a countdown timer |
| `actionText` | `string` | `'Notify Me'` | Action button text |
| `onAction` | `() => void` | `() => {}` | Action button callback |
| `showAction` | `boolean` | `true` | Whether to show the action button |
| `content` | `React.ReactNode` | `null` | Additional content to display in the coming soon page |
| `showNewsletter` | `boolean` | `false` | Whether to show a newsletter subscription form |
| `onSubscribe` | `(email: string) => void` | `() => {}` | Newsletter subscription callback |
| `showSocial` | `boolean` | `false` | Whether to show social media links |
| `socialLinks` | `Array<{ name: string; url: string; icon?: React.ReactNode }>` | `[]` | Social media links to display |

### Other Components

- `ComingSoonPageHeadless.Container`: Container for the coming soon page
- `ComingSoonPageHeadless.Icon`: Icon component for the coming soon page
- `ComingSoonPageHeadless.Title`: Title component for the coming soon page
- `ComingSoonPageHeadless.Description`: Description component for the coming soon page
- `ComingSoonPageHeadless.Countdown`: Countdown timer component for the coming soon page
- `ComingSoonPageHeadless.Action`: Action button component for the coming soon page
- `ComingSoonPageHeadless.Content`: Additional content component for the coming soon page
- `ComingSoonPageHeadless.Newsletter`: Newsletter subscription form component for the coming soon page
- `ComingSoonPageHeadless.Social`: Social media links component for the coming soon page
- `ComingSoonPageHeadless.Default`: Pre-configured default coming soon page component

### useComingSoonPage Hook

For even more control, you can use the `useComingSoonPage` hook directly:

```jsx
import { useComingSoonPage } from 'pulseui';

function MyCustomComingSoonPage() {
  const {
    title,
    description,
    icon,
    launchDate,
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
    getContainerProps,
    getActionProps,
    getNewsletterFormProps,
    getEmailInputProps,
  } = useComingSoonPage({
    title: 'Coming Soon',
    description: 'We are working hard to bring you something amazing. Stay tuned!',
    launchDate: '2025-08-01T12:00:00',
    showCountdown: true,
    actionText: 'Notify Me',
    onAction: () => console.log('Notify clicked'),
    showNewsletter: true,
    onSubscribe: (email) => console.log(`Subscribed: ${email}`),
    showSocial: true,
    socialLinks: [
      { name: 'Twitter', url: 'https://twitter.com/example' },
    ],
  });
  
  // Custom implementation
}
```

## Accessibility

The Coming Soon Page component follows accessibility best practices:

- The coming soon page container has `role="main"` to define it as the main content area
- The newsletter form has `role="form"` to indicate it's a form
- The email input has appropriate ARIA attributes for better screen reader support
- The action button has appropriate ARIA attributes for better screen reader support
