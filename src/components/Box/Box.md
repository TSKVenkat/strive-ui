# Box Component

The Box component is a versatile layout primitive that serves as the foundation for building more complex UI components and layouts.

## Import

```jsx
import { Box } from 'strive-ui';
```

## Features

- Flexible layout container with extensive styling options
- Support for all CSS properties via props
- Responsive design capabilities
- Built-in spacing and layout helpers
- Accessibility features
- Polymorphic component (can render as any HTML element)

## Usage

```jsx
import { Box } from 'strive-ui';

// Basic usage
<Box padding="4" margin="2" background="gray.100">
  Content goes here
</Box>

// As a flex container
<Box display="flex" alignItems="center" justifyContent="space-between">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</Box>

// With responsive styles
<Box 
  width={{ base: '100%', md: '50%', lg: '33%' }}
  padding={{ base: '2', md: '4' }}
  background="primary.500"
  color="white"
>
  Responsive Box
</Box>

// As a different HTML element
<Box as="section" role="region" aria-label="Important information">
  Section content
</Box>

// With event handlers
<Box 
  padding="3"
  background="secondary.100"
  _hover={{ background: 'secondary.200' }}
  onClick={() => console.log('Box clicked')}
>
  Click me
</Box>
```

## Props

The Box component accepts all standard HTML attributes plus the following style props:

### Layout Props

| Prop | Type | Description |
|------|------|-------------|
| `display` | string | CSS display property |
| `width` | string \| number \| object | Width of the box |
| `height` | string \| number \| object | Height of the box |
| `maxWidth` | string \| number \| object | Maximum width |
| `maxHeight` | string \| number \| object | Maximum height |
| `minWidth` | string \| number \| object | Minimum width |
| `minHeight` | string \| number \| object | Minimum height |
| `size` | string \| number \| object | Sets both width and height |
| `overflow` | string | CSS overflow property |
| `overflowX` | string | CSS overflow-x property |
| `overflowY` | string | CSS overflow-y property |
| `position` | string | CSS position property |
| `top` | string \| number \| object | CSS top property |
| `right` | string \| number \| object | CSS right property |
| `bottom` | string \| number \| object | CSS bottom property |
| `left` | string \| number \| object | CSS left property |
| `zIndex` | string \| number | CSS z-index property |

### Flexbox Props

| Prop | Type | Description |
|------|------|-------------|
| `alignItems` | string | CSS align-items property |
| `alignContent` | string | CSS align-content property |
| `justifyItems` | string | CSS justify-items property |
| `justifyContent` | string | CSS justify-content property |
| `flexWrap` | string | CSS flex-wrap property |
| `flexDirection` | string | CSS flex-direction property |
| `flex` | string \| number | CSS flex property |
| `flexGrow` | string \| number | CSS flex-grow property |
| `flexShrink` | string \| number | CSS flex-shrink property |
| `flexBasis` | string \| number | CSS flex-basis property |
| `justifySelf` | string | CSS justify-self property |
| `alignSelf` | string | CSS align-self property |
| `order` | string \| number | CSS order property |

### Grid Props

| Prop | Type | Description |
|------|------|-------------|
| `gridGap` | string \| number \| object | CSS grid-gap property |
| `gridColumnGap` | string \| number \| object | CSS grid-column-gap property |
| `gridRowGap` | string \| number \| object | CSS grid-row-gap property |
| `gridColumn` | string \| number | CSS grid-column property |
| `gridRow` | string \| number | CSS grid-row property |
| `gridAutoFlow` | string | CSS grid-auto-flow property |
| `gridAutoColumns` | string | CSS grid-auto-columns property |
| `gridAutoRows` | string | CSS grid-auto-rows property |
| `gridTemplateColumns` | string | CSS grid-template-columns property |
| `gridTemplateRows` | string | CSS grid-template-rows property |
| `gridTemplateAreas` | string | CSS grid-template-areas property |
| `gridArea` | string | CSS grid-area property |

### Space Props

| Prop | Type | Description |
|------|------|-------------|
| `margin` \| `m` | string \| number \| object | CSS margin property |
| `marginTop` \| `mt` | string \| number \| object | CSS margin-top property |
| `marginRight` \| `mr` | string \| number \| object | CSS margin-right property |
| `marginBottom` \| `mb` | string \| number \| object | CSS margin-bottom property |
| `marginLeft` \| `ml` | string \| number \| object | CSS margin-left property |
| `marginX` \| `mx` | string \| number \| object | CSS margin-left and margin-right properties |
| `marginY` \| `my` | string \| number \| object | CSS margin-top and margin-bottom properties |
| `padding` \| `p` | string \| number \| object | CSS padding property |
| `paddingTop` \| `pt` | string \| number \| object | CSS padding-top property |
| `paddingRight` \| `pr` | string \| number \| object | CSS padding-right property |
| `paddingBottom` \| `pb` | string \| number \| object | CSS padding-bottom property |
| `paddingLeft` \| `pl` | string \| number \| object | CSS padding-left property |
| `paddingX` \| `px` | string \| number \| object | CSS padding-left and padding-right properties |
| `paddingY` \| `py` | string \| number \| object | CSS padding-top and padding-bottom properties |

### Color and Background Props

| Prop | Type | Description |
|------|------|-------------|
| `color` | string | Text color |
| `background` \| `bg` | string | Background color |
| `backgroundColor` \| `bgColor` | string | Background color |
| `opacity` | string \| number | CSS opacity property |

### Typography Props

| Prop | Type | Description |
|------|------|-------------|
| `fontFamily` | string | CSS font-family property |
| `fontSize` | string \| number \| object | CSS font-size property |
| `fontWeight` | string \| number | CSS font-weight property |
| `lineHeight` | string \| number \| object | CSS line-height property |
| `letterSpacing` | string \| number \| object | CSS letter-spacing property |
| `textAlign` | string \| object | CSS text-align property |
| `fontStyle` | string | CSS font-style property |
| `textTransform` | string | CSS text-transform property |

### Border Props

| Prop | Type | Description |
|------|------|-------------|
| `border` | string | CSS border property |
| `borderWidth` | string \| number \| object | CSS border-width property |
| `borderStyle` | string | CSS border-style property |
| `borderColor` | string | CSS border-color property |
| `borderRadius` | string \| number \| object | CSS border-radius property |
| `borderTop` | string | CSS border-top property |
| `borderRight` | string | CSS border-right property |
| `borderBottom` | string | CSS border-bottom property |
| `borderLeft` | string | CSS border-left property |

### Other Props

| Prop | Type | Description |
|------|------|-------------|
| `as` | string \| React.ComponentType | The HTML tag or component to render as |
| `_hover` | object | Styles for the hover state |
| `_active` | object | Styles for the active state |
| `_focus` | object | Styles for the focus state |
| `_disabled` | object | Styles for the disabled state |

## Accessibility

The Box component supports accessibility features:
- Accepts all ARIA attributes as props
- Can be rendered as any semantic HTML element using the `as` prop
- Supports focus management through the `_focus` style prop
