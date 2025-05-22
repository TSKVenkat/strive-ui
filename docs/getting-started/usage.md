# Basic Usage

This guide will help you get started with using StriveUI components in your React application.

## Importing Components

You can import components directly from the `strive-ui` package:

```jsx
import { Button, Input, Card } from 'strive-ui';
```

## Theme Provider

Always wrap your application with the `ThemeProvider` to ensure proper styling and theming:

```jsx
import { ThemeProvider } from 'strive-ui';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

## Basic Example

Here's a simple example showing how to use some of the core components:

```jsx
import React, { useState } from 'react';
import { ThemeProvider, Box, Card, Input, Button } from 'strive-ui';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
    console.log('Login attempt with:', username);
  };

  return (
    <ThemeProvider>
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        <Card 
          title="Login" 
          style={{ width: '400px' }}
        >
          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              fullWidth
              marginBottom="16px"
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              fullWidth
              marginBottom="24px"
            />
            
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth
            >
              Log In
            </Button>
          </form>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default LoginForm;
```

## Component Composition

StriveUI components are designed to work well together. Here's an example of composing multiple components:

```jsx
import { Card, Avatar, Badge, Box, Button } from 'strive-ui';

function UserProfile({ user }) {
  return (
    <Card>
      <Box display="flex" alignItems="center" marginBottom="16px">
        <Avatar 
          src={user.avatarUrl} 
          name={user.name} 
          size="lg" 
          badge={{ status: 'online', position: 'bottom-right' }}
        />
        <Box marginLeft="16px">
          <h2>{user.name}</h2>
          <p>{user.title}</p>
        </Box>
      </Box>
      
      <Box display="flex" flexWrap="wrap" gap="8px" marginBottom="16px">
        {user.skills.map(skill => (
          <Badge key={skill}>{skill}</Badge>
        ))}
      </Box>
      
      <Button variant="primary">View Profile</Button>
      <Button variant="tertiary" marginLeft="8px">Message</Button>
    </Card>
  );
}
```

## Next Steps

- Explore the [component documentation](/components) to learn about all available components
- Learn about [theming](/guides/theming) to customize the look and feel of your application
- Check out the [accessibility guide](/guides/accessibility) to ensure your application is accessible to all users
