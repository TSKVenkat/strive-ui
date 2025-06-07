# BoxStyled

The BoxStyled component is a powerful, foundational component that leverages template literal types for CSS-in-JS. It provides a type-safe way to style components using the design system values, ensuring consistency across your application.

## Features

- Type-safe access to design system values
- Responsive styles with breakpoints
- Polymorphic (can render as any HTML element or React component)
- Support for all CSS properties mapped to design system values
- Automatic conversion of camelCase props to kebab-case CSS properties

## Installation

```jsx
import { BoxStyled } from 'pulseui';
```

## Usage

### Basic Usage

```jsx
import { BoxStyled } from 'pulseui';

function MyComponent() {
  return (
    <BoxStyled
      padding="4"
      backgroundColor="primary.500"
      color="white"
      borderRadius="md"
    >
      Hello, world!
    </BoxStyled>
  );
}
```

### Responsive Styles

```jsx
import { BoxStyled } from 'pulseui';

function MyComponent() {
  return (
    <BoxStyled
      width={{ base: '100%', md: '50%', lg: '33%' }}
      padding={{ base: '2', md: '4' }}
      fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
      backgroundColor={{ base: 'primary.100', md: 'primary.200' }}
    >
      Responsive Box
    </BoxStyled>
  );
}
```

### Layout Example

```jsx
import { BoxStyled } from 'pulseui';

function MyComponent() {
  return (
    <BoxStyled 
      display="flex" 
      flexDirection={{ base: 'column', md: 'row' }}
      gap="4"
    >
      <BoxStyled flex="1" padding="4" backgroundColor="primary.100">
        Sidebar
      </BoxStyled>
      <BoxStyled flex="3" padding="4" backgroundColor="neutral.100">
        Main Content
      </BoxStyled>
    </BoxStyled>
  );
}
```

### Polymorphic Usage

```jsx
import { BoxStyled } from 'pulseui';

function MyComponent() {
  return (
    <BoxStyled as="section" padding="4" backgroundColor="neutral.100">
      <BoxStyled as="h2" fontSize="2xl" fontWeight="bold" marginBottom="4">
        Section Title
      </BoxStyled>
      
      <BoxStyled as="p" fontSize="md" marginBottom="4">
        Section content goes here.
      </BoxStyled>
      
      <BoxStyled
        as="a"
        href="https://example.com"
        padding="2"
        backgroundColor="primary.500"
        color="white"
        borderRadius="md"
        display="inline-block"
        textDecoration="none"
      >
        Learn More
      </BoxStyled>
    </BoxStyled>
  );
}
```

## Props

BoxStyled accepts all system style props, which are mapped to CSS properties and design system values. Here are some of the key prop categories:

### Layout Props

| Prop | Type | Description |
|------|------|-------------|
| `width` | `ResponsiveValue<SystemSpacing>` | Width of the element |
| `height` | `ResponsiveValue<SystemSpacing>` | Height of the element |
| `minWidth` | `ResponsiveValue<SystemSpacing>` | Minimum width of the element |
| `maxWidth` | `ResponsiveValue<SystemSpacing>` | Maximum width of the element |
| `minHeight` | `ResponsiveValue<SystemSpacing>` | Minimum height of the element |
| `maxHeight` | `ResponsiveValue<SystemSpacing>` | Maximum height of the element |
| `display` | `ResponsiveValue<'block' \| 'inline-block' \| 'flex' \| ...>` | Display property |
| `overflow` | `ResponsiveValue<'visible' \| 'hidden' \| 'scroll' \| 'auto'>` | Overflow behavior |
| `position` | `ResponsiveValue<'static' \| 'relative' \| 'absolute' \| 'fixed' \| 'sticky'>` | Position property |
| `top`, `right`, `bottom`, `left` | `ResponsiveValue<SystemSpacing>` | Position offsets |
| `zIndex` | `ResponsiveValue<SystemZIndex>` | Z-index property |

### Spacing Props

| Prop | Type | Description |
|------|------|-------------|
| `margin`, `m` | `ResponsiveValue<SystemSpacing>` | Margin on all sides |
| `marginTop`, `mt` | `ResponsiveValue<SystemSpacing>` | Margin top |
| `marginRight`, `mr` | `ResponsiveValue<SystemSpacing>` | Margin right |
| `marginBottom`, `mb` | `ResponsiveValue<SystemSpacing>` | Margin bottom |
| `marginLeft`, `ml` | `ResponsiveValue<SystemSpacing>` | Margin left |
| `marginX`, `mx` | `ResponsiveValue<SystemSpacing>` | Margin left and right |
| `marginY`, `my` | `ResponsiveValue<SystemSpacing>` | Margin top and bottom |
| `padding`, `p` | `ResponsiveValue<SystemSpacing>` | Padding on all sides |
| `paddingTop`, `pt` | `ResponsiveValue<SystemSpacing>` | Padding top |
| `paddingRight`, `pr` | `ResponsiveValue<SystemSpacing>` | Padding right |
| `paddingBottom`, `pb` | `ResponsiveValue<SystemSpacing>` | Padding bottom |
| `paddingLeft`, `pl` | `ResponsiveValue<SystemSpacing>` | Padding left |
| `paddingX`, `px` | `ResponsiveValue<SystemSpacing>` | Padding left and right |
| `paddingY`, `py` | `ResponsiveValue<SystemSpacing>` | Padding top and bottom |

### Typography Props

| Prop | Type | Description |
|------|------|-------------|
| `fontSize` | `ResponsiveValue<SystemFontSize>` | Font size |
| `fontWeight` | `ResponsiveValue<SystemFontWeight>` | Font weight |
| `lineHeight` | `ResponsiveValue<SystemLineHeight>` | Line height |
| `letterSpacing` | `ResponsiveValue<...>` | Letter spacing |
| `textAlign` | `ResponsiveValue<'left' \| 'center' \| 'right' \| 'justify'>` | Text alignment |
| `fontStyle` | `ResponsiveValue<'normal' \| 'italic'>` | Font style |
| `textTransform` | `ResponsiveValue<'uppercase' \| 'lowercase' \| 'capitalize' \| 'none'>` | Text transformation |
| `textDecoration` | `ResponsiveValue<'underline' \| 'line-through' \| 'none'>` | Text decoration |

### Color Props

| Prop | Type | Description |
|------|------|-------------|
| `color` | `ResponsiveValue<SystemColor>` | Text color |
| `backgroundColor` | `ResponsiveValue<SystemColor>` | Background color |
| `borderColor` | `ResponsiveValue<SystemColor>` | Border color |
| `opacity` | `ResponsiveValue<SystemOpacity>` | Opacity |

### Border Props

| Prop | Type | Description |
|------|------|-------------|
| `borderRadius` | `ResponsiveValue<SystemBorderRadius>` | Border radius |
| `borderWidth` | `ResponsiveValue<SystemBorderWidth>` | Border width |
| `borderStyle` | `ResponsiveValue<'solid' \| 'dashed' \| 'dotted' \| ...>` | Border style |

### Flexbox Props

| Prop | Type | Description |
|------|------|-------------|
| `flexDirection` | `ResponsiveValue<'row' \| 'column' \| ...>` | Flex direction |
| `flexWrap` | `ResponsiveValue<'nowrap' \| 'wrap' \| 'wrap-reverse'>` | Flex wrap |
| `justifyContent` | `ResponsiveValue<'flex-start' \| 'center' \| ...>` | Justify content |
| `alignItems` | `ResponsiveValue<'flex-start' \| 'center' \| ...>` | Align items |
| `flex` | `ResponsiveValue<string>` | Flex shorthand |
| `flexGrow` | `ResponsiveValue<number>` | Flex grow |
| `flexShrink` | `ResponsiveValue<number>` | Flex shrink |
| `flexBasis` | `ResponsiveValue<SystemSpacing>` | Flex basis |

### Grid Props

| Prop | Type | Description |
|------|------|-------------|
| `gridTemplateColumns` | `ResponsiveValue<string>` | Grid template columns |
| `gridTemplateRows` | `ResponsiveValue<string>` | Grid template rows |
| `gridGap` | `ResponsiveValue<SystemSpacing>` | Grid gap |
| `gridColumn` | `ResponsiveValue<string>` | Grid column |
| `gridRow` | `ResponsiveValue<string>` | Grid row |

## Design System Values

BoxStyled provides type-safe access to design system values. Here are some examples of the available values:

### Spacing Scale

- `0` → 0px
- `px` → 1px
- `0.5` → 0.125rem (2px)
- `1` → 0.25rem (4px)
- `2` → 0.5rem (8px)
- `3` → 0.75rem (12px)
- `4` → 1rem (16px)
- `5` → 1.25rem (20px)
- `6` → 1.5rem (24px)
- ...and more

### Font Size Scale

- `xs` → 0.75rem (12px)
- `sm` → 0.875rem (14px)
- `base` → 1rem (16px)
- `lg` → 1.125rem (18px)
- `xl` → 1.25rem (20px)
- `2xl` → 1.5rem (24px)
- ...and more

### Font Weight Scale

- `thin` → 100
- `extralight` → 200
- `light` → 300
- `normal` → 400
- `medium` → 500
- `semibold` → 600
- `bold` → 700
- `extrabold` → 800
- `black` → 900

### Border Radius Scale

- `none` → 0px
- `sm` → 0.125rem (2px)
- `md` → 0.375rem (6px)
- `lg` → 0.5rem (8px)
- `xl` → 0.75rem (12px)
- `2xl` → 1rem (16px)
- `3xl` → 1.5rem (24px)
- `full` → 9999px

### Colors

Colors can be accessed using dot notation:

- `primary.500` → Primary color, 500 shade
- `neutral.100` → Neutral color, 100 shade
- `error.600` → Error color, 600 shade

You can also use standard CSS color formats:

- Hex: `#ff0000`
- RGB: `rgb(255, 0, 0)`
- RGBA: `rgba(255, 0, 0, 0.5)`
- HSL: `hsl(0, 100%, 50%)`

## Responsive Styles

BoxStyled supports responsive styles using breakpoints. The available breakpoints are:

- `base` → Default (mobile first)
- `sm` → 640px and up
- `md` → 768px and up
- `lg` → 1024px and up
- `xl` → 1280px and up
- `2xl` → 1536px and up

To use responsive styles, provide an object with breakpoint keys:

```jsx
<BoxStyled
  width={{ base: '100%', md: '50%', lg: '33%' }}
  fontSize={{ base: 'sm', md: 'md', lg: 'lg' }}
>
  Responsive Box
</BoxStyled>
```

## Examples

### Card Component

```jsx
import { BoxStyled } from 'pulseui';

function Card({ title, description, imageUrl }) {
  return (
    <BoxStyled
      width="100%"
      maxWidth="300px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="lg"
      backgroundColor="white"
    >
      <BoxStyled
        as="img"
        src={imageUrl}
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
          {title}
        </BoxStyled>
        <BoxStyled 
          as="p" 
          fontSize="sm" 
          color="neutral.600"
          marginBottom="4"
        >
          {description}
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
        >
          Learn More
        </BoxStyled>
      </BoxStyled>
    </BoxStyled>
  );
}
```

### Grid Layout

```jsx
import { BoxStyled } from 'pulseui';

function GridLayout() {
  return (
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
      {items.map((item) => (
        <BoxStyled
          key={item.id}
          padding="4"
          backgroundColor="white"
          borderRadius="md"
          boxShadow="md"
        >
          {item.content}
        </BoxStyled>
      ))}
    </BoxStyled>
  );
}
```

### Form Elements

```jsx
import { BoxStyled } from 'pulseui';

function FormExample() {
  return (
    <BoxStyled
      as="form"
      display="flex"
      flexDirection="column"
      gap="4"
      padding="6"
      backgroundColor="white"
      borderRadius="lg"
      boxShadow="md"
      width="100%"
      maxWidth="400px"
    >
      <BoxStyled as="h2" fontSize="2xl" fontWeight="bold" marginBottom="4">
        Contact Form
      </BoxStyled>
      
      <BoxStyled display="flex" flexDirection="column" gap="1">
        <BoxStyled as="label" fontSize="sm" fontWeight="medium">
          Name
        </BoxStyled>
        <BoxStyled
          as="input"
          type="text"
          padding="2"
          borderRadius="md"
          border="1px solid"
          borderColor="neutral.300"
        />
      </BoxStyled>
      
      <BoxStyled display="flex" flexDirection="column" gap="1">
        <BoxStyled as="label" fontSize="sm" fontWeight="medium">
          Email
        </BoxStyled>
        <BoxStyled
          as="input"
          type="email"
          padding="2"
          borderRadius="md"
          border="1px solid"
          borderColor="neutral.300"
        />
      </BoxStyled>
      
      <BoxStyled display="flex" flexDirection="column" gap="1">
        <BoxStyled as="label" fontSize="sm" fontWeight="medium">
          Message
        </BoxStyled>
        <BoxStyled
          as="textarea"
          rows={4}
          padding="2"
          borderRadius="md"
          border="1px solid"
          borderColor="neutral.300"
        />
      </BoxStyled>
      
      <BoxStyled
        as="button"
        type="submit"
        padding="3"
        backgroundColor="primary.500"
        color="white"
        borderRadius="md"
        border="none"
        cursor="pointer"
        fontWeight="medium"
        marginTop="2"
      >
        Submit
      </BoxStyled>
    </BoxStyled>
  );
}
```
