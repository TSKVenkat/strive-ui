import React, { useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { Form, FormProps } from './Form';
import { FormControl } from './FormControl';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';

export default {
  title: 'Components/Form',
  component: Form,
  parameters: {
    docs: {
      description: {
        component: 'Form component provides context for form elements and handles layout.'
      }
    }
  }
} as Meta;

const Template: Story<FormProps> = (args) => <Form {...args} />;

export const Basic = () => {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSubmitted(true);
    
    // Validate form
    const newErrors: Record<string, string> = {};
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (Object.keys(newErrors).length === 0) {
        alert(JSON.stringify(formState, null, 2));
      }
    }, 1000);
  };

  return (
    <Form 
      onSubmit={handleSubmit} 
      isSubmitting={isSubmitting}
      isSubmitted={isSubmitted}
      errors={errors}
      spacing="md"
    >
      <FormControl 
        label="Email" 
        helperText="We'll never share your email"
        isRequired
        name="email"
      >
        <Input
          name="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
      </FormControl>
      
      <FormControl 
        label="Password" 
        isRequired
        name="password"
      >
        <Input
          name="password"
          type="password"
          value={formState.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </FormControl>
      
      <FormControl name="rememberMe">
        <Checkbox
          name="rememberMe"
          checked={formState.rememberMe}
          onChange={handleChange}
          label="Remember me"
        />
      </FormControl>
      
      <Button type="submit" isLoading={isSubmitting}>
        Submit
      </Button>
    </Form>
  );
};

export const WithDifferentSpacing = () => (
  <>
    <h3>Small Spacing</h3>
    <Form spacing="sm">
      <FormControl label="First Name">
        <Input placeholder="Enter first name" />
      </FormControl>
      <FormControl label="Last Name">
        <Input placeholder="Enter last name" />
      </FormControl>
      <Button>Submit</Button>
    </Form>
    
    <h3 style={{ marginTop: '2rem' }}>Medium Spacing (Default)</h3>
    <Form spacing="md">
      <FormControl label="First Name">
        <Input placeholder="Enter first name" />
      </FormControl>
      <FormControl label="Last Name">
        <Input placeholder="Enter last name" />
      </FormControl>
      <Button>Submit</Button>
    </Form>
    
    <h3 style={{ marginTop: '2rem' }}>Large Spacing</h3>
    <Form spacing="lg">
      <FormControl label="First Name">
        <Input placeholder="Enter first name" />
      </FormControl>
      <FormControl label="Last Name">
        <Input placeholder="Enter last name" />
      </FormControl>
      <Button>Submit</Button>
    </Form>
  </>
);

export const WithErrors = () => (
  <Form errors={{ email: 'Email is invalid', password: 'Password is too short' }}>
    <FormControl 
      label="Email" 
      name="email"
      isRequired
    >
      <Input
        name="email"
        type="email"
        value="invalid-email"
      />
    </FormControl>
    
    <FormControl 
      label="Password" 
      name="password"
      isRequired
    >
      <Input
        name="password"
        type="password"
        value="123"
      />
    </FormControl>
    
    <FormControl 
      label="Custom Error" 
      errorMessage="This is a custom error message"
    >
      <Input />
    </FormControl>
    
    <Button>Submit</Button>
  </Form>
);
