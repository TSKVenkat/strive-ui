# Usage Guide

This guide demonstrates how to use Pulse UI components effectively in real-world applications.

## Basic Component Usage

### Buttons

```jsx
import { Button } from '@pulse-ui/core';

function ButtonExamples() {
  return (
    <div className="space-y-4">
      {/* Basic buttons */}
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary Action</Button>
      <Button variant="outline">Outline Button</Button>
      
      {/* Different sizes */}
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      
      {/* States */}
      <Button loading>Loading...</Button>
      <Button disabled>Disabled</Button>
      
      {/* Polymorphic usage */}
      <Button as="a" href="/link">Link Button</Button>
    </div>
  );
}
```

### Form Components

```jsx
import { Input, Select, Checkbox, Button } from '@pulse-ui/core';
import { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    newsletter: false,
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Input
        label="Full Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        required
      />
      
      <Input
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
      />
      
      <Select
        label="Category"
        value={formData.category}
        onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        placeholder="Select a category"
      >
        <Select.Option value="general">General Inquiry</Select.Option>
        <Select.Option value="support">Technical Support</Select.Option>
        <Select.Option value="sales">Sales</Select.Option>
      </Select>
      
      <Checkbox
        checked={formData.newsletter}
        onChange={(checked) => setFormData(prev => ({ ...prev, newsletter: checked }))}
      >
        Subscribe to newsletter
      </Checkbox>
      
      <Button type="submit" variant="primary" className="w-full">
        Send Message
      </Button>
    </form>
  );
}
```

## Layout Components

### Grid System

```jsx
import { Grid, Card } from '@pulse-ui/core';

function ProductGrid() {
  const products = [
    { id: 1, name: 'Product 1', price: '$99' },
    { id: 2, name: 'Product 2', price: '$149' },
    { id: 3, name: 'Product 3', price: '$199' },
  ];

  return (
    <Grid
      columns={{ base: 1, md: 2, lg: 3 }}
      gap={4}
      className="p-6"
    >
      {products.map(product => (
        <Card key={product.id} className="p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.price}</p>
          <Button variant="outline" size="sm" className="mt-2">
            Add to Cart
          </Button>
        </Card>
      ))}
    </Grid>
  );
}
```

### Navigation

```jsx
import { Navbar, Button } from '@pulse-ui/core';
import { useState } from 'react';

function AppNavigation() {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <Navbar
      activeItem={activeItem}
      onActiveChange={setActiveItem}
      collapsible
    >
      <Navbar.Brand>
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <span className="font-bold">My App</span>
      </Navbar.Brand>
      
      <Navbar.Toggle />
      
      <Navbar.Content>
        <Navbar.Item id="home">Home</Navbar.Item>
        <Navbar.Item id="products">Products</Navbar.Item>
        <Navbar.Item id="about">About</Navbar.Item>
        <Navbar.Item id="contact">Contact</Navbar.Item>
        
        <Navbar.Section>
          <Button variant="outline" size="sm">Sign In</Button>
          <Button variant="primary" size="sm">Sign Up</Button>
        </Navbar.Section>
      </Navbar.Content>
    </Navbar>
  );
}
```

## Modal and Overlay Components

### Modal Dialog

```jsx
import { Modal, Button, Input } from '@pulse-ui/core';
import { useState } from 'react';

function UserProfileModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com'
  });

  const handleSave = () => {
    // Save user data
    console.log('Saving:', userData);
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Edit Profile
      </Button>
      
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <Modal.Content className="max-w-md">
          <Modal.Header>
            <Modal.Title>Edit Profile</Modal.Title>
            <Modal.Description>
              Update your profile information below.
            </Modal.Description>
          </Modal.Header>
          
          <Modal.Body className="space-y-4">
            <Input
              label="Full Name"
              value={userData.name}
              onChange={(e) => setUserData(prev => ({ 
                ...prev, 
                name: e.target.value 
              }))}
            />
            <Input
              type="email"
              label="Email"
              value={userData.email}
              onChange={(e) => setUserData(prev => ({ 
                ...prev, 
                email: e.target.value 
              }))}
            />
          </Modal.Body>
          
          <Modal.Footer>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
```

### Toast Notifications

```jsx
import { Button, useToast } from '@pulse-ui/core';

function NotificationExample() {
  const toast = useToast();

  const showSuccess = () => {
    toast.success('Profile updated successfully!');
  };

  const showError = () => {
    toast.error('Failed to save changes. Please try again.');
  };

  const showInfo = () => {
    toast.info('New features are available in the settings.');
  };

  const showWarning = () => {
    toast.warning('Your session will expire in 5 minutes.');
  };

  return (
    <div className="space-x-2">
      <Button onClick={showSuccess} variant="primary">
        Success Toast
      </Button>
      <Button onClick={showError} variant="destructive">
        Error Toast
      </Button>
      <Button onClick={showInfo} variant="outline">
        Info Toast
      </Button>
      <Button onClick={showWarning} variant="secondary">
        Warning Toast
      </Button>
    </div>
  );
}
```

## Data Display Components

### Data Table

```jsx
import { DataTable, Badge, Button } from '@pulse-ui/core';
import { useState } from 'react';

function UserTable() {
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active', role: 'user' },
  ]);

  const columns = [
    {
      key: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.name}</div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="text-gray-600">{row.email}</div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge 
          variant={row.status === 'active' ? 'success' : 'secondary'}
        >
          {row.status}
        </Badge>
      )
    },
    {
      key: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="outline">{row.role}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="space-x-2">
          <Button size="sm" variant="outline">Edit</Button>
          <Button size="sm" variant="destructive">Delete</Button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      sortable
      filterable
      pagination
      pageSize={10}
    />
  );
}
```

## Advanced Patterns

### Compound Components

```jsx
import { Accordion } from '@pulse-ui/core';

function FAQSection() {
  return (
    <Accordion allowMultiple className="max-w-2xl">
      <Accordion.Item id="what-is-pulse">
        <Accordion.Header>What is Pulse UI?</Accordion.Header>
        <Accordion.Panel>
          <p>
            Pulse UI is a production-ready, headless React component library 
            that offers maximum styling flexibility with robust TypeScript support.
          </p>
        </Accordion.Panel>
      </Accordion.Item>
      
      <Accordion.Item id="installation">
        <Accordion.Header>How do I install Pulse UI?</Accordion.Header>
        <Accordion.Panel>
          <p>You can install Pulse UI using npm, yarn, or pnpm:</p>
          <pre className="bg-gray-100 p-2 rounded mt-2">
            npm install @pulse-ui/core
          </pre>
        </Accordion.Panel>
      </Accordion.Item>
      
      <Accordion.Item id="customization">
        <Accordion.Header>Can I customize the components?</Accordion.Header>
        <Accordion.Panel>
          <p>
            Yes! Pulse UI is built with a headless architecture that separates 
            logic from presentation, giving you complete control over styling.
          </p>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

### Polymorphic Components

```jsx
import { Button } from '@pulse-ui/core';
import { Link } from 'react-router-dom';

function NavigationButtons() {
  return (
    <div className="space-y-2">
      {/* Regular button */}
      <Button onClick={() => console.log('clicked')}>
        Regular Button
      </Button>
      
      {/* Render as anchor tag */}
      <Button as="a" href="https://example.com" target="_blank">
        External Link
      </Button>
      
      {/* Render as React Router Link */}
      <Button as={Link} to="/dashboard">
        Dashboard
      </Button>
      
      {/* Custom component */}
      <Button as={CustomLinkComponent} customProp="value">
        Custom Component
      </Button>
    </div>
  );
}
```

### Headless Usage

```jsx
import { useButton, useModal } from '@pulse-ui/core';

function CustomButton({ children, ...props }) {
  const { buttonProps } = useButton(props);
  
  return (
    <button 
      {...buttonProps}
      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
    >
      {children}
    </button>
  );
}

function CustomModal({ children, ...props }) {
  const { 
    isOpen, 
    onClose, 
    overlayProps, 
    contentProps 
  } = useModal(props);
  
  if (!isOpen) return null;
  
  return (
    <div 
      {...overlayProps}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div 
        {...contentProps}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
      >
        {children}
      </div>
    </div>
  );
}
```

## Best Practices

### Component Composition

```jsx
import { Card, Button, Badge, Avatar } from '@pulse-ui/core';

// ✅ Good - Compose components for reusability
function UserCard({ user, onEdit, onDelete }) {
  return (
    <Card className="p-6">
      <div className="flex items-start space-x-4">
        <Avatar src={user.avatar} alt={user.name} size="lg" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold">{user.name}</h3>
            <Badge variant={user.isActive ? 'success' : 'secondary'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">{user.role}</p>
        </div>
        <div className="space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(user)}>
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
```

### Error Handling

```jsx
import { Alert, Button } from '@pulse-ui/core';
import { useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/data');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={fetchData} loading={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </Button>
      
      {error && (
        <Alert variant="destructive">
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert>
      )}
      
      {data && (
        <Alert variant="success">
          <Alert.Title>Success</Alert.Title>
          <Alert.Description>Data loaded successfully!</Alert.Description>
        </Alert>
      )}
    </div>
  );
}
```

### Accessibility

```jsx
import { Button, Input, Modal } from '@pulse-ui/core';
import { useState } from 'react';

function AccessibleForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        aria-describedby="modal-description"
      >
        Open Form
      </Button>
      
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Contact Information</Modal.Title>
            <Modal.Description id="modal-description">
              Please provide your contact details below.
            </Modal.Description>
          </Modal.Header>
          
          <Modal.Body>
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  name: e.target.value 
                }))}
                required
                aria-describedby="name-help"
              />
              <div id="name-help" className="text-sm text-gray-600">
                Enter your first and last name
              </div>
              
              <Input
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  email: e.target.value 
                }))}
                required
                aria-describedby="email-help"
              />
              <div id="email-help" className="text-sm text-gray-600">
                We'll never share your email with anyone else
              </div>
            </div>
          </Modal.Body>
          
          <Modal.Footer>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
```

## Performance Optimization

### Lazy Loading

```jsx
import { lazy, Suspense } from 'react';
import { Spinner } from '@pulse-ui/core';

// Lazy load heavy components
const DataGrid = lazy(() => import('@pulse-ui/core').then(module => ({ 
  default: module.DataGrid 
})));

const Chart = lazy(() => import('./Chart'));

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      
      <Suspense fallback={<Spinner size="lg" />}>
        <DataGrid data={data} columns={columns} />
      </Suspense>
      
      <Suspense fallback={<Spinner size="lg" />}>
        <Chart data={chartData} />
      </Suspense>
    </div>
  );
}
```

### Memoization

```jsx
import { memo, useMemo, useCallback } from 'react';
import { Button, Card } from '@pulse-ui/core';

const UserCard = memo(({ user, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => {
    onEdit(user.id);
  }, [user.id, onEdit]);

  const handleDelete = useCallback(() => {
    onDelete(user.id);
  }, [user.id, onDelete]);

  const userStatus = useMemo(() => {
    return user.lastLogin > Date.now() - 86400000 ? 'active' : 'inactive';
  }, [user.lastLogin]);

  return (
    <Card className="p-4">
      <h3>{user.name}</h3>
      <p>Status: {userStatus}</p>
      <div className="space-x-2">
        <Button size="sm" onClick={handleEdit}>Edit</Button>
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Card>
  );
});
```

## Next Steps

- [Theming Guide](./theming.md) - Learn how to customize Pulse UI
- [Component API](../components/) - Explore all available components
- [Accessibility Guide](../guides/accessibility.md) - Ensure your app is accessible
- [Contributing](../../CONTRIBUTING.md) - Help improve Pulse UI
