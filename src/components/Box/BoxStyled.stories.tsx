import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import BoxStyled from './BoxStyled';

const meta: Meta<typeof BoxStyled> = {
  title: 'Components/Box/Styled',
  component: BoxStyled,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BoxStyled>;

// Basic example
export const Basic: Story = {
  args: {
    padding: '4',
    backgroundColor: 'primary.100',
    borderRadius: 'md',
    children: 'Basic Box with System Props',
  },
};

// Responsive styles
export const Responsive: Story = {
  args: {
    width: { base: '100%', sm: '300px', md: '400px', lg: '500px' },
    padding: { base: '2', md: '4', lg: '6' },
    backgroundColor: { base: 'primary.100', md: 'primary.200', lg: 'primary.300' },
    color: { base: 'neutral.800', md: 'primary.800' },
    borderRadius: { base: 'sm', md: 'md', lg: 'lg' },
    fontSize: { base: 'sm', md: 'md', lg: 'lg' },
    textAlign: { base: 'left', md: 'center' },
    children: 'Responsive Box - Resize the window to see changes',
  },
};

// Layout example
export const Layout: Story = {
  render: () => (
    <BoxStyled 
      display="flex" 
      flexDirection={{ base: 'column', md: 'row' }}
      gap="4"
      padding="4"
      backgroundColor="neutral.100"
      borderRadius="md"
      width="100%"
      maxWidth="800px"
    >
      <BoxStyled 
        flex="1" 
        padding="4" 
        backgroundColor="primary.500" 
        color="white"
        borderRadius="md"
      >
        Sidebar
      </BoxStyled>
      <BoxStyled 
        flex="3" 
        padding="4" 
        backgroundColor="white" 
        borderRadius="md"
        boxShadow="md"
      >
        Main Content Area
      </BoxStyled>
    </BoxStyled>
  ),
};

// Card example
export const Card: Story = {
  render: () => (
    <BoxStyled
      width="300px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      backgroundColor="white"
    >
      <BoxStyled
        as="img"
        src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        width="100%"
        height="150px"
        style={{ objectFit: 'cover' }}
      />
      <BoxStyled padding="4">
        <BoxStyled 
          as="h3" 
          fontSize="xl" 
          fontWeight="bold" 
          color="neutral.900"
          marginBottom="2"
        >
          Card Title
        </BoxStyled>
        <BoxStyled 
          as="p" 
          fontSize="sm" 
          color="neutral.600"
          marginBottom="4"
        >
          This card is built entirely with BoxStyled components using type-safe system props.
        </BoxStyled>
        <BoxStyled
          as="button"
          padding="2"
          width="100%"
          backgroundColor="primary.500"
          color="white"
          borderRadius="md"
          border="none"
          cursor="pointer"
          fontWeight="medium"
          _hover={{ backgroundColor: 'primary.600' }}
        >
          Learn More
        </BoxStyled>
      </BoxStyled>
    </BoxStyled>
  ),
};

// Grid layout
export const Grid: Story = {
  render: () => (
    <BoxStyled
      display="grid"
      gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
      gap="4"
      padding="4"
      backgroundColor="neutral.100"
      borderRadius="md"
      width="100%"
      maxWidth="800px"
    >
      {[...Array(6)].map((_, i) => (
        <BoxStyled
          key={i}
          padding="4"
          backgroundColor="white"
          borderRadius="md"
          boxShadow="md"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="150px"
          textAlign="center"
        >
          <BoxStyled 
            as="h3" 
            fontSize="lg" 
            fontWeight="bold" 
            color="primary.500"
            marginBottom="2"
          >
            Grid Item {i + 1}
          </BoxStyled>
          <BoxStyled as="p" fontSize="sm" color="neutral.600">
            Responsive grid layout
          </BoxStyled>
        </BoxStyled>
      ))}
    </BoxStyled>
  ),
};

// Typography showcase
export const Typography: Story = {
  render: () => (
    <BoxStyled
      width="100%"
      maxWidth="800px"
      padding="6"
      backgroundColor="white"
      borderRadius="lg"
      boxShadow="md"
    >
      <BoxStyled as="h1" fontSize="4xl" fontWeight="bold" marginBottom="4" color="primary.900">
        Typography with BoxStyled
      </BoxStyled>
      <BoxStyled as="h2" fontSize="2xl" fontWeight="semibold" marginBottom="3" color="primary.700">
        Type-safe font sizes and weights
      </BoxStyled>
      <BoxStyled as="p" fontSize="md" marginBottom="4" color="neutral.700" lineHeight="relaxed">
        This example demonstrates how BoxStyled can be used to create consistent typography using the design system values.
        All font sizes, weights, colors, and spacing values are type-checked against the design system.
      </BoxStyled>
      
      <BoxStyled as="h3" fontSize="xl" fontWeight="medium" marginBottom="2" color="primary.600">
        Text Styles
      </BoxStyled>
      
      <BoxStyled display="flex" flexDirection="column" gap="3" marginBottom="6">
        <BoxStyled fontSize="xs" color="neutral.600">Extra Small Text</BoxStyled>
        <BoxStyled fontSize="sm" color="neutral.700">Small Text</BoxStyled>
        <BoxStyled fontSize="md" color="neutral.800">Medium Text</BoxStyled>
        <BoxStyled fontSize="lg" color="neutral.900">Large Text</BoxStyled>
        <BoxStyled fontSize="xl" fontWeight="bold" color="primary.500">Extra Large Bold</BoxStyled>
      </BoxStyled>
      
      <BoxStyled as="h3" fontSize="xl" fontWeight="medium" marginBottom="2" color="primary.600">
        Font Weights
      </BoxStyled>
      
      <BoxStyled display="flex" flexDirection="column" gap="3">
        <BoxStyled fontSize="md" fontWeight="light" color="neutral.800">Light Weight</BoxStyled>
        <BoxStyled fontSize="md" fontWeight="normal" color="neutral.800">Normal Weight</BoxStyled>
        <BoxStyled fontSize="md" fontWeight="medium" color="neutral.800">Medium Weight</BoxStyled>
        <BoxStyled fontSize="md" fontWeight="semibold" color="neutral.800">Semibold Weight</BoxStyled>
        <BoxStyled fontSize="md" fontWeight="bold" color="neutral.800">Bold Weight</BoxStyled>
        <BoxStyled fontSize="md" fontWeight="extrabold" color="neutral.800">Extra Bold Weight</BoxStyled>
      </BoxStyled>
    </BoxStyled>
  ),
};

// Polymorphic usage
export const Polymorphic: Story = {
  render: () => (
    <BoxStyled
      as="section"
      padding="6"
      backgroundColor="neutral.100"
      borderRadius="lg"
      width="100%"
      maxWidth="800px"
    >
      <BoxStyled 
        as="h2" 
        fontSize="2xl" 
        fontWeight="bold" 
        marginBottom="4"
        color="primary.700"
      >
        Polymorphic BoxStyled
      </BoxStyled>
      
      <BoxStyled 
        as="p"
        fontSize="md"
        marginBottom="4"
        color="neutral.700"
      >
        BoxStyled can render as any HTML element or React component while maintaining its styling capabilities.
      </BoxStyled>
      
      <BoxStyled
        as="a"
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
        display="inline-block"
        padding="3"
        backgroundColor="primary.500"
        color="white"
        borderRadius="md"
        textDecoration="none"
        fontWeight="medium"
        marginRight="3"
      >
        Link Button
      </BoxStyled>
      
      <BoxStyled
        as="button"
        type="button"
        padding="3"
        backgroundColor="secondary.500"
        color="white"
        borderRadius="md"
        border="none"
        cursor="pointer"
        fontWeight="medium"
      >
        Regular Button
      </BoxStyled>
      
      <BoxStyled
        as="form"
        display="flex"
        flexDirection="column"
        gap="3"
        marginTop="6"
        padding="4"
        backgroundColor="white"
        borderRadius="md"
        boxShadow="sm"
      >
        <BoxStyled as="label" fontSize="sm" fontWeight="medium" color="neutral.700">
          Email Address
        </BoxStyled>
        <BoxStyled
          as="input"
          type="email"
          padding="2"
          borderRadius="md"
          border="1px solid"
          borderColor="neutral.300"
          _focus={{ borderColor: "primary.500", outline: "none" }}
        />
        <BoxStyled
          as="button"
          type="submit"
          marginTop="2"
          padding="2"
          backgroundColor="primary.500"
          color="white"
          borderRadius="md"
          border="none"
          cursor="pointer"
          fontWeight="medium"
        >
          Subscribe
        </BoxStyled>
      </BoxStyled>
    </BoxStyled>
  ),
};
