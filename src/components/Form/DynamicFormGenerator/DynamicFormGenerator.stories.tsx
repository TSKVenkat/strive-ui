import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DynamicFormGenerator } from './DynamicFormGenerator';
import { DynamicFormGeneratorHeadless } from './DynamicFormGeneratorHeadless';
import { Box } from '../../Box';
import { Card } from '../../Card';
import { Text } from '../../Text';
import { Button } from '../../Button';
import { Flex } from '../../Flex';
import styled from 'styled-components';

const meta: Meta<typeof DynamicFormGenerator> = {
  title: 'Components/Form/DynamicFormGenerator',
  component: DynamicFormGenerator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    submitText: {
      control: 'text',
      description: 'Text for the submit button',
    },
    resetText: {
      control: 'text',
      description: 'Text for the reset button',
    },
    showReset: {
      control: 'boolean',
      description: 'Whether to show the reset button',
    },
    showErrorSummary: {
      control: 'boolean',
      description: 'Whether to show the error summary',
    },
    showDebug: {
      control: 'boolean',
      description: 'Whether to show the debug panel',
    },
    useAccordion: {
      control: 'boolean',
      description: 'Whether to use accordion for groups',
    },
    useCard: {
      control: 'boolean',
      description: 'Whether to use a card layout',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicFormGenerator>;

// Basic example
export const Basic: Story = {
  args: {
    fields: [
      { name: 'firstName', type: 'text', label: 'First Name', required: true, width: 6 },
      { name: 'lastName', type: 'text', label: 'Last Name', required: true, width: 6 },
      { name: 'email', type: 'email', label: 'Email', required: true, width: 12 },
      { name: 'message', type: 'textarea', label: 'Message', helperText: 'Enter your message here', width: 12 },
      { name: 'subscribe', type: 'checkbox', label: 'Subscribe to newsletter', defaultValue: false, width: 12 },
    ],
    submitText: 'Submit Form',
    showReset: true,
    showErrorSummary: true,
    showDebug: false,
    useCard: true,
  },
  render: (args) => (
    <Box style={{ width: '600px' }}>
      <DynamicFormGenerator
        {...args}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          alert('Form submitted: ' + JSON.stringify(data, null, 2));
        }}
      />
    </Box>
  ),
};

// With validation
export const WithValidation: Story = {
  render: () => (
    <Box style={{ width: '600px' }}>
      <DynamicFormGenerator
        fields={[
          { 
            name: 'username', 
            type: 'text', 
            label: 'Username', 
            required: true,
            validation: [
              { type: 'required', message: 'Username is required' },
              { type: 'minLength', value: 3, message: 'Username must be at least 3 characters' },
            ],
            width: 12 
          },
          { 
            name: 'email', 
            type: 'email', 
            label: 'Email', 
            required: true,
            validation: [
              { type: 'required', message: 'Email is required' },
              { type: 'email', message: 'Please enter a valid email address' },
            ],
            width: 12 
          },
          { 
            name: 'password', 
            type: 'password', 
            label: 'Password', 
            required: true,
            validation: [
              { type: 'required', message: 'Password is required' },
              { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
              { 
                type: 'pattern', 
                value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
              },
            ],
            width: 12 
          },
          { 
            name: 'age', 
            type: 'number', 
            label: 'Age', 
            required: true,
            validation: [
              { type: 'required', message: 'Age is required' },
              { type: 'min', value: 18, message: 'You must be at least 18 years old' },
              { type: 'max', value: 120, message: 'Age cannot be more than 120' },
            ],
            width: 6 
          },
          { 
            name: 'website', 
            type: 'url', 
            label: 'Website', 
            required: false,
            validation: [
              { type: 'url', message: 'Please enter a valid URL' },
            ],
            width: 6 
          },
        ]}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          alert('Form submitted: ' + JSON.stringify(data, null, 2));
        }}
        submitText="Register"
        showErrorSummary={true}
      />
    </Box>
  ),
};

// With field types
export const FieldTypes: Story = {
  render: () => (
    <Box style={{ width: '800px' }}>
      <DynamicFormGenerator
        fields={[
          { name: 'text', type: 'text', label: 'Text Input', placeholder: 'Enter text', width: 6 },
          { name: 'email', type: 'email', label: 'Email Input', placeholder: 'Enter email', width: 6 },
          { name: 'password', type: 'password', label: 'Password Input', placeholder: 'Enter password', width: 6 },
          { name: 'number', type: 'number', label: 'Number Input', placeholder: 'Enter number', width: 6 },
          { name: 'textarea', type: 'textarea', label: 'Textarea', placeholder: 'Enter long text', width: 12 },
          { 
            name: 'select', 
            type: 'select', 
            label: 'Select', 
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ],
            width: 6 
          },
          { 
            name: 'multiselect', 
            type: 'multiselect', 
            label: 'Multi-select', 
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ],
            width: 6 
          },
          { name: 'checkbox', type: 'checkbox', label: 'Checkbox', width: 6 },
          { 
            name: 'radio', 
            type: 'radio', 
            label: 'Radio', 
            options: [
              { value: 'option1', label: 'Option 1' },
              { value: 'option2', label: 'Option 2' },
              { value: 'option3', label: 'Option 3' },
            ],
            width: 6 
          },
          { name: 'switch', type: 'switch', label: 'Switch', width: 6 },
          { name: 'date', type: 'date', label: 'Date Picker', width: 6 },
          { name: 'time', type: 'time', label: 'Time Picker', width: 6 },
          { name: 'color', type: 'color', label: 'Color Picker', width: 6 },
          { name: 'range', type: 'range', label: 'Range Slider', width: 12 },
          { name: 'rating', type: 'rating', label: 'Rating', width: 6 },
          { name: 'file', type: 'file', label: 'File Upload', width: 6 },
        ]}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          alert('Form submitted: ' + JSON.stringify(data, null, 2));
        }}
        submitText="Submit"
        showDebug={true}
      />
    </Box>
  ),
};

// With groups
export const WithGroups: Story = {
  render: () => (
    <Box style={{ width: '700px' }}>
      <DynamicFormGenerator
        fields={[
          { name: 'firstName', type: 'text', label: 'First Name', required: true, group: 'personal', width: 6 },
          { name: 'lastName', type: 'text', label: 'Last Name', required: true, group: 'personal', width: 6 },
          { name: 'email', type: 'email', label: 'Email', required: true, group: 'personal', width: 12 },
          { name: 'phone', type: 'tel', label: 'Phone', group: 'personal', width: 12 },
          { name: 'street', type: 'text', label: 'Street Address', group: 'address', width: 12 },
          { name: 'city', type: 'text', label: 'City', group: 'address', width: 4 },
          { name: 'state', type: 'text', label: 'State', group: 'address', width: 4 },
          { name: 'zip', type: 'text', label: 'Zip Code', group: 'address', width: 4 },
          { name: 'cardNumber', type: 'text', label: 'Card Number', group: 'payment', width: 12 },
          { name: 'cardName', type: 'text', label: 'Name on Card', group: 'payment', width: 12 },
          { name: 'expiry', type: 'text', label: 'Expiry Date', group: 'payment', width: 6 },
          { name: 'cvv', type: 'text', label: 'CVV', group: 'payment', width: 6 },
        ]}
        groups={[
          { id: 'personal', label: 'Personal Information', description: 'Enter your personal details', order: 1 },
          { id: 'address', label: 'Address Information', description: 'Enter your address details', order: 2 },
          { id: 'payment', label: 'Payment Information', description: 'Enter your payment details', order: 3 },
        ]}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          alert('Form submitted: ' + JSON.stringify(data, null, 2));
        }}
        submitText="Complete Order"
        useAccordion={true}
      />
    </Box>
  ),
};

// With conditional fields
export const ConditionalFields: Story = {
  render: () => (
    <Box style={{ width: '600px' }}>
      <DynamicFormGenerator
        fields={[
          { 
            name: 'contactMethod', 
            type: 'select', 
            label: 'Preferred Contact Method', 
            options: [
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'mail', label: 'Mail' },
            ],
            defaultValue: 'email',
            required: true,
            width: 12 
          },
          { 
            name: 'email', 
            type: 'email', 
            label: 'Email Address', 
            required: true,
            conditions: [
              { field: 'contactMethod', operator: 'equals', value: 'email' }
            ],
            width: 12 
          },
          { 
            name: 'phone', 
            type: 'tel', 
            label: 'Phone Number', 
            required: true,
            conditions: [
              { field: 'contactMethod', operator: 'equals', value: 'phone' }
            ],
            width: 12 
          },
          { 
            name: 'address', 
            type: 'textarea', 
            label: 'Mailing Address', 
            required: true,
            conditions: [
              { field: 'contactMethod', operator: 'equals', value: 'mail' }
            ],
            width: 12 
          },
          { 
            name: 'subscribe', 
            type: 'checkbox', 
            label: 'Subscribe to newsletter', 
            defaultValue: false,
            width: 12 
          },
          { 
            name: 'frequency', 
            type: 'radio', 
            label: 'Newsletter Frequency', 
            options: [
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'monthly', label: 'Monthly' },
            ],
            defaultValue: 'weekly',
            conditions: [
              { field: 'subscribe', operator: 'equals', value: true }
            ],
            width: 12 
          },
        ]}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          alert('Form submitted: ' + JSON.stringify(data, null, 2));
        }}
        submitText="Submit"
        showDebug={true}
      />
    </Box>
  ),
};

// Headless usage example
const StyledField = styled.div`
  margin-bottom: 16px;
  
  label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #0066ff;
      box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2);
    }
  }
  
  .error {
    color: #d32f2f;
    font-size: 12px;
    margin-top: 4px;
  }
  
  .helper-text {
    color: #666;
    font-size: 12px;
    margin-top: 4px;
  }
`;

const StyledButton = styled.button`
  padding: 8px 16px;
  background-color: #0066ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #0055cc;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const HeadlessUsage: Story = {
  render: () => (
    <Box style={{ width: '600px' }}>
      <DynamicFormGeneratorHeadless.Root
        fields={[
          { name: 'name', type: 'text', label: 'Name', required: true },
          { name: 'email', type: 'email', label: 'Email', required: true },
          { name: 'message', type: 'textarea', label: 'Message', helperText: 'Enter your message here' },
        ]}
      >
        <Card padding="lg">
          <Text variant="h4" mb={4}>Contact Form</Text>
          
          <DynamicFormGeneratorHeadless.Form
            onSubmit={(data) => {
              console.log('Form submitted:', data);
              alert('Form submitted: ' + JSON.stringify(data, null, 2));
            }}
          >
            <DynamicFormGeneratorHeadless.ErrorSummary title="Please fix these errors:" />
            
            <DynamicFormGeneratorHeadless.FieldsContainer
              renderField={(field, index) => (
                <StyledField key={field.name}>
                  <DynamicFormGeneratorHeadless.Field
                    name={field.name}
                    render={(fieldConfig, formProps) => {
                      const { error, inputRef, ...restProps } = formProps;
                      
                      return (
                        <>
                          <label htmlFor={field.name}>{field.label}{field.required && ' *'}</label>
                          {field.type === 'textarea' ? (
                            <textarea
                              id={field.name}
                              ref={inputRef}
                              {...restProps}
                              rows={4}
                              placeholder={field.placeholder}
                            />
                          ) : (
                            <input
                              id={field.name}
                              type={field.type}
                              ref={inputRef}
                              {...restProps}
                              placeholder={field.placeholder}
                            />
                          )}
                          {error && <div className="error">{error}</div>}
                          {field.helperText && <div className="helper-text">{field.helperText}</div>}
                        </>
                      );
                    }}
                  />
                </StyledField>
              )}
            />
            
            <Flex justifyContent="flex-end" mt={4}>
              <DynamicFormGeneratorHeadless.ResetButton
                as={StyledButton}
                text="Reset"
                style={{ marginRight: '8px', backgroundColor: '#666' }}
              />
              <DynamicFormGeneratorHeadless.SubmitButton
                as={StyledButton}
                text="Send Message"
              />
            </Flex>
          </DynamicFormGeneratorHeadless.Form>
        </Card>
      </DynamicFormGeneratorHeadless.Root>
    </Box>
  ),
};
