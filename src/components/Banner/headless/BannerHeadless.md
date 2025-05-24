# BannerHeadless

A headless component for creating customizable banner notifications with extensive flexibility for developers. Banners are used to display important messages or announcements to users.

## Usage

```jsx
import { BannerHeadless } from 'strive-ui';

function MyBanner() {
  return (
    <BannerHeadless.Root
      defaultVisible={true}
      dismissible={true}
      variant="info"
      hasIcon={true}
      hasCloseButton={true}
      onDismiss={() => console.log('Banner dismissed')}
    >
      <BannerHeadless.Container
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: '#E3F2FD',
          borderRadius: '4px',
          border: '1px solid #90CAF9',
          marginBottom: '16px',
        }}
      >
        <BannerHeadless.Icon
          style={{
            marginRight: '12px',
            fontSize: '20px',
          }}
        />
        
        <BannerHeadless.Content
          style={{
            flex: 1,
          }}
        >
          <BannerHeadless.Title
            as="h3"
            style={{
              margin: '0 0 4px 0',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            Information
          </BannerHeadless.Title>
          
          <BannerHeadless.Description
            style={{
              margin: 0,
              fontSize: '14px',
            }}
          >
            This is an informational banner that provides important details to the user.
          </BannerHeadless.Description>
        </BannerHeadless.Content>
        
        <BannerHeadless.Actions
          style={{
            display: 'flex',
            gap: '8px',
            marginLeft: '16px',
            marginRight: '16px',
          }}
        >
          <button
            style={{
              padding: '6px 12px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Learn More
          </button>
        </BannerHeadless.Actions>
        
        <BannerHeadless.Close
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            color: '#757575',
          }}
        />
      </BannerHeadless.Container>
    </BannerHeadless.Root>
  );
}
```

## Creating Different Banner Variants

```jsx
import { BannerHeadless } from 'strive-ui';
import { useState } from 'react';

function BannerExample() {
  const [variant, setVariant] = useState('info');
  
  // Style mapping based on variant
  const variantStyles = {
    info: {
      backgroundColor: '#E3F2FD',
      borderColor: '#90CAF9',
      color: '#0D47A1',
    },
    success: {
      backgroundColor: '#E8F5E9',
      borderColor: '#A5D6A7',
      color: '#1B5E20',
    },
    warning: {
      backgroundColor: '#FFF8E1',
      borderColor: '#FFE082',
      color: '#F57F17',
    },
    error: {
      backgroundColor: '#FFEBEE',
      borderColor: '#EF9A9A',
      color: '#B71C1C',
    },
  };
  
  const currentStyle = variantStyles[variant] || variantStyles.info;
  
  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setVariant('info')}>Info</button>
        <button onClick={() => setVariant('success')}>Success</button>
        <button onClick={() => setVariant('warning')}>Warning</button>
        <button onClick={() => setVariant('error')}>Error</button>
      </div>
      
      <BannerHeadless.Root
        defaultVisible={true}
        dismissible={true}
        variant={variant}
        hasIcon={true}
        hasCloseButton={true}
      >
        <BannerHeadless.Container
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: currentStyle.backgroundColor,
            borderRadius: '4px',
            border: `1px solid ${currentStyle.borderColor}`,
            color: currentStyle.color,
          }}
        >
          <BannerHeadless.Icon
            style={{
              marginRight: '12px',
              fontSize: '20px',
            }}
          />
          
          <BannerHeadless.Content
            style={{
              flex: 1,
            }}
          >
            <BannerHeadless.Title
              as="h3"
              style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </BannerHeadless.Title>
            
            <BannerHeadless.Description
              style={{
                margin: 0,
                fontSize: '14px',
              }}
            >
              This is a {variant} banner that provides important details to the user.
            </BannerHeadless.Description>
          </BannerHeadless.Content>
          
          <BannerHeadless.Close
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px',
              color: currentStyle.color,
            }}
          />
        </BannerHeadless.Container>
      </BannerHeadless.Root>
    </div>
  );
}
```

## Creating a Reusable Banner Component

```jsx
import { BannerHeadless } from 'strive-ui';

function CustomBanner({ 
  title, 
  description, 
  variant = 'info', 
  visible = true,
  onDismiss,
  action,
  actionLabel
}) {
  // Style mapping based on variant
  const variantStyles = {
    info: {
      backgroundColor: '#E3F2FD',
      borderColor: '#90CAF9',
      color: '#0D47A1',
      actionColor: '#2196F3',
    },
    success: {
      backgroundColor: '#E8F5E9',
      borderColor: '#A5D6A7',
      color: '#1B5E20',
      actionColor: '#4CAF50',
    },
    warning: {
      backgroundColor: '#FFF8E1',
      borderColor: '#FFE082',
      color: '#F57F17',
      actionColor: '#FFC107',
    },
    error: {
      backgroundColor: '#FFEBEE',
      borderColor: '#EF9A9A',
      color: '#B71C1C',
      actionColor: '#F44336',
    },
  };
  
  const currentStyle = variantStyles[variant] || variantStyles.info;
  
  return (
    <BannerHeadless.Root
      defaultVisible={visible}
      dismissible={true}
      variant={variant}
      hasIcon={true}
      hasCloseButton={true}
      onDismiss={onDismiss}
    >
      <BannerHeadless.Container
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          backgroundColor: currentStyle.backgroundColor,
          borderRadius: '4px',
          border: `1px solid ${currentStyle.borderColor}`,
          color: currentStyle.color,
          marginBottom: '16px',
        }}
      >
        <BannerHeadless.Icon
          style={{
            marginRight: '12px',
            fontSize: '20px',
          }}
        />
        
        <BannerHeadless.Content
          style={{
            flex: 1,
          }}
        >
          {title && (
            <BannerHeadless.Title
              as="h3"
              style={{
                margin: '0 0 4px 0',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {title}
            </BannerHeadless.Title>
          )}
          
          {description && (
            <BannerHeadless.Description
              style={{
                margin: 0,
                fontSize: '14px',
              }}
            >
              {description}
            </BannerHeadless.Description>
          )}
        </BannerHeadless.Content>
        
        {action && actionLabel && (
          <BannerHeadless.Actions
            style={{
              display: 'flex',
              gap: '8px',
              marginLeft: '16px',
              marginRight: '16px',
            }}
          >
            <button
              onClick={action}
              style={{
                padding: '6px 12px',
                backgroundColor: currentStyle.actionColor,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {actionLabel}
            </button>
          </BannerHeadless.Actions>
        )}
        
        <BannerHeadless.Close
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
            color: currentStyle.color,
          }}
        />
      </BannerHeadless.Container>
    </BannerHeadless.Root>
  );
}

// Usage
function App() {
  return (
    <div>
      <CustomBanner
        title="Information"
        description="This is an informational banner with important details."
        variant="info"
        actionLabel="Learn More"
        action={() => console.log('Learn more clicked')}
        onDismiss={() => console.log('Banner dismissed')}
      />
      
      <CustomBanner
        title="Success"
        description="Your changes have been saved successfully."
        variant="success"
      />
      
      <CustomBanner
        title="Warning"
        description="Your session will expire in 5 minutes."
        variant="warning"
        actionLabel="Extend Session"
        action={() => console.log('Extend session clicked')}
      />
      
      <CustomBanner
        title="Error"
        description="There was a problem processing your request."
        variant="error"
        actionLabel="Try Again"
        action={() => console.log('Try again clicked')}
      />
    </div>
  );
}
```

## API

### BannerHeadless.Root

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultVisible` | `boolean` | `false` | Whether the banner is initially visible |
| `dismissible` | `boolean` | `true` | Whether the banner can be dismissed |
| `onDismiss` | `() => void` | - | Callback when the banner is dismissed |
| `onShow` | `() => void` | - | Callback when the banner is shown |
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Variant of the banner |
| `hasIcon` | `boolean` | `true` | Whether the banner has an icon |
| `hasCloseButton` | `boolean` | `true` | Whether the banner has a close button |
| `autoHideTimeout` | `number` | - | Auto-dismiss timeout in milliseconds |

### Other Components

- `BannerHeadless.Container`: Container for the banner
- `BannerHeadless.Icon`: Icon element for the banner
- `BannerHeadless.Content`: Content container for the banner
- `BannerHeadless.Title`: Title element for the banner
- `BannerHeadless.Description`: Description element for the banner
- `BannerHeadless.Actions`: Container for action buttons
- `BannerHeadless.Close`: Close button for the banner

### useBanner Hook

For even more control, you can use the `useBanner` hook directly:

```jsx
import { useBanner } from 'strive-ui';

function MyCustomBanner() {
  const {
    visible,
    show,
    hide,
    toggle,
    variant,
    setVariant,
    dismissible,
    hasIcon,
    hasCloseButton,
    getBannerProps,
    getCloseButtonProps,
  } = useBanner({
    defaultVisible: true,
    variant: 'info',
    onDismiss: () => console.log('Banner dismissed'),
  });
  
  // Custom implementation
}
```

## Accessibility

The Banner component follows accessibility best practices:

- The banner container has `role="alert"` to notify screen readers of important information
- The banner has `aria-live="polite"` to announce changes in a non-intrusive way
- The close button has an appropriate `aria-label` for screen readers
