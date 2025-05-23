import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import FormStyled from './Form';
import { Button } from '../Button';
import { Box } from '../Box';

const meta: Meta<typeof FormStyled> = {
  title: 'Components/Form/FormStyled',
  component: FormStyled,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormStyled>;

export const BasicForm: Story = {
  render: () => {
    const handleSubmit = (values: Record<string, any>) => {
      console.log('Form submitted with values:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <Box css={{ width: '400px' }}>
        <FormStyled onSubmit={handleSubmit}>
          <FormStyled.Input
            name="name"
            label="Full Name"
            validation={{ required: true }}
            placeholder="John Doe"
          />
          <FormStyled.Input
            name="email"
            label="Email Address"
            validation={{
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            }}
            helperText="We'll never share your email with anyone else."
            placeholder="john@example.com"
          />
          <FormStyled.SubmitButton>Submit</FormStyled.SubmitButton>
        </FormStyled>
      </Box>
    );
  },
};

export const CompleteForm: Story = {
  render: () => {
    const handleSubmit = (values: Record<string, any>) => {
      console.log('Form submitted with values:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <Box css={{ width: '500px' }}>
        <FormStyled onSubmit={handleSubmit}>
          <FormStyled.Input
            name="name"
            label="Full Name"
            validation={{ required: true }}
            placeholder="John Doe"
          />
          <FormStyled.Input
            name="email"
            label="Email Address"
            validation={{
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            }}
            helperText="We'll never share your email with anyone else."
            placeholder="john@example.com"
          />
          <FormStyled.Select
            name="country"
            label="Country"
            validation={{ required: true }}
            options={[
              { value: '', label: 'Select a country' },
              { value: 'us', label: 'United States' },
              { value: 'ca', label: 'Canada' },
              { value: 'uk', label: 'United Kingdom' },
              { value: 'au', label: 'Australia' },
            ]}
          />
          <FormStyled.Textarea
            name="message"
            label="Message"
            validation={{ required: true, minLength: 10 }}
            placeholder="Type your message here..."
            helperText="Minimum 10 characters"
          />
          <FormStyled.Checkbox
            name="terms"
            label="I agree to the terms and conditions"
            validation={{ required: true }}
          />
          <Box css={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <FormStyled.SubmitButton>Submit</FormStyled.SubmitButton>
            <Button variant="secondary" type="reset">Reset</Button>
          </Box>
        </FormStyled>
      </Box>
    );
  },
};

export const FormWithValidation: Story = {
  render: () => {
    const handleSubmit = (values: Record<string, any>) => {
      console.log('Form submitted with values:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <Box css={{ width: '400px' }}>
        <FormStyled onSubmit={handleSubmit}>
          <FormStyled.Input
            name="username"
            label="Username"
            validation={{
              required: true,
              minLength: 3,
              maxLength: 20,
              pattern: /^[a-zA-Z0-9_]+$/,
              message: 'Username must be 3-20 characters and can only contain letters, numbers, and underscores',
            }}
            placeholder="username123"
          />
          <FormStyled.Input
            name="password"
            type="password"
            label="Password"
            validation={{
              required: true,
              minLength: 8,
              validate: (value) => {
                if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
                if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
                if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
                if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain at least one special character';
                return true;
              },
            }}
            helperText="Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
          />
          <FormStyled.Input
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            validation={{
              required: true,
              validate: (value, formValues) => {
                return value === formValues.password || 'Passwords do not match';
              },
            }}
          />
          <FormStyled.SubmitButton>Register</FormStyled.SubmitButton>
        </FormStyled>
      </Box>
    );
  },
};

export const FormWithDynamicFields: Story = {
  render: () => {
    const [showExtraField, setShowExtraField] = useState(false);
    
    const handleSubmit = (values: Record<string, any>) => {
      console.log('Form submitted with values:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <Box css={{ width: '400px' }}>
        <FormStyled onSubmit={handleSubmit}>
          <FormStyled.Input
            name="name"
            label="Full Name"
            validation={{ required: true }}
            placeholder="John Doe"
          />
          <FormStyled.Select
            name="accountType"
            label="Account Type"
            validation={{ required: true }}
            options={[
              { value: 'personal', label: 'Personal' },
              { value: 'business', label: 'Business' },
            ]}
            onChange={(e) => setShowExtraField(e.target.value === 'business')}
          />
          
          {showExtraField && (
            <FormStyled.Input
              name="companyName"
              label="Company Name"
              validation={{ required: true }}
              placeholder="Acme Inc."
            />
          )}
          
          <FormStyled.SubmitButton>Submit</FormStyled.SubmitButton>
        </FormStyled>
      </Box>
    );
  },
};

export const FormWithCustomStyling: Story = {
  render: () => {
    const handleSubmit = (values: Record<string, any>) => {
      console.log('Form submitted with values:', values);
      alert(JSON.stringify(values, null, 2));
    };

    return (
      <Box css={{ width: '400px', backgroundColor: '#f8f9fa', padding: '2rem', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#343a40', textAlign: 'center' }}>Contact Us</h2>
        <FormStyled onSubmit={handleSubmit} spacing="lg">
          <FormStyled.Input
            name="name"
            label="Full Name"
            validation={{ required: true }}
            placeholder="John Doe"
          />
          <FormStyled.Input
            name="email"
            label="Email Address"
            validation={{
              required: true,
              pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            }}
            placeholder="john@example.com"
          />
          <FormStyled.Textarea
            name="message"
            label="Your Message"
            validation={{ required: true }}
            placeholder="How can we help you?"
          />
          <Box css={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <FormStyled.SubmitButton>Send Message</FormStyled.SubmitButton>
          </Box>
        </FormStyled>
      </Box>
    );
  },
};
