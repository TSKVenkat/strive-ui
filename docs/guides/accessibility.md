# Accessibility Guide

## Introduction

Strive UI is built with accessibility as a core principle, following WAI-ARIA guidelines and WCAG 2.1 standards to ensure that applications built with our components are usable by everyone, including people with disabilities.

Our headless component architecture makes accessibility easier to implement while giving you complete control over styling and behavior.

## Accessibility Principles

All Strive UI components adhere to these key accessibility principles:

1. **Semantic HTML**: We use proper HTML elements for their intended purpose and support polymorphic components that can render as appropriate semantic elements.

2. **Keyboard Navigation**: All interactive components are fully keyboard accessible with support for standard and component-specific keyboard interactions.

3. **ARIA Implementation**: We implement ARIA roles, states, and properties following the latest WAI-ARIA authoring practices.

4. **Focus Management**: Complex components like modals, dialogs, and dropdowns implement proper focus management and focus trapping when needed.

5. **Screen Reader Announcements**: Dynamic content changes are announced appropriately to screen readers using ARIA live regions.

6. **Reduced Motion**: Components respect the user's reduced motion preferences for animations and transitions.

7. **Color Contrast**: Our default theme meets WCAG 2.1 AA contrast requirements, and we provide guidance for maintaining contrast when customizing.

## Headless Accessibility

Our headless component architecture provides accessibility benefits:

- **Separation of Concerns**: Logic hooks handle accessibility requirements while giving you complete styling freedom.
- **Composition**: Compound components maintain proper accessibility relationships between parent and child elements.
- **Customization**: Polymorphic components allow rendering as appropriate semantic elements.

Example of accessibility in our headless pattern:

```jsx
// The hook handles all accessibility logic
function CustomButton({ children, ...props }) {
  const { buttonProps, state } = useButton(props);
  
  // You control the styling while we handle the accessibility
  return (
    <button
      {...buttonProps}
      className={`custom-button ${state.isPressed ? 'pressed' : ''}`}
    >
      {children}
    </button>
  );
}
```

## Accessibility Features by Component Type

### Interactive Components

- **Buttons and Links**
  - Native button/link semantics or appropriate ARIA roles
  - Visible focus indicators
  - Proper activation via keyboard (Space/Enter)
  - Loading and disabled states announced to screen readers

- **Form Controls**
  - Proper label associations
  - Error and validation states announced to screen readers
  - Required fields properly indicated
  - Form validation feedback accessible to all users

### Complex Components

- **Modals and Dialogs**
  - Focus trapping within the modal
  - Focus restoration when closed
  - Proper ARIA roles and attributes
  - ESC key support for dismissal
  - Screen reader announcements for opening/closing

- **Dropdowns and Selects**
  - Keyboard navigation between options
  - Type-ahead functionality
  - ARIA roles for listbox/combobox patterns
  - Proper labeling of selected values

- **Tabs and Accordions**
  - ARIA roles for tablist/tab/tabpanel or accordion patterns
  - Keyboard navigation between tabs/panels
  - Proper focus management

## Accessibility Best Practices

When using Strive UI components, follow these best practices:

### 1. Always provide accessible labels

```jsx
// Good - explicit label
<Input
  label="Email Address"
  aria-describedby="email-hint"
/>
<div id="email-hint">We'll never share your email</div>

// Avoid - missing label, using only placeholder
<Input placeholder="Email" />
```

### 2. Provide text alternatives for visual content

```jsx
// Good - meaningful alt text
<Avatar 
  src="user.jpg" 
  alt="Profile picture for Jane Smith" 
/>

// Good - decorative image marked appropriately
<Icon name="star" aria-hidden="true" />
```

### 3. Maintain sufficient color contrast

```jsx
// Good - using theme tokens with proper contrast
<Button variant="primary">Submit</Button>

// Avoid - custom colors without checking contrast
<Button style={{ backgroundColor: '#e5e5ff', color: '#9999cc' }}>Submit</Button>
```

### 4. Convey information with multiple cues

```jsx
// Good - uses color, icon, and text
<Alert 
  variant="error" 
  icon={<ErrorIcon />}
  role="alert"
>
  <strong>Error:</strong> Form submission failed
</Alert>
```

### 5. Make interactive elements obvious

```jsx
// Good - clear visual indication of interactivity
<Button variant="primary" icon={<ArrowRight />}>Next Step</Button>

// Avoid - link that looks like regular text
<span onClick={handleClick} style={{ color: 'inherit' }}>Click here</span>
```

## Testing for Accessibility

We recommend a comprehensive testing approach:

### Automated Testing

- [axe DevTools](https://www.deque.com/axe/) - Browser extension and testing library
- [jest-axe](https://github.com/nickcolley/jest-axe) - For unit and integration tests
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - For overall page audits
- [Storybook a11y addon](https://storybook.js.org/addons/@storybook/addon-a11y) - For component-level testing

### Manual Testing

- **Keyboard Navigation**: Test all functionality without a mouse
- **Screen Readers**: Test with NVDA (Windows), VoiceOver (macOS/iOS), and JAWS (Windows)
- **Zoom Testing**: Test at 200% and 400% zoom levels
- **Reduced Motion**: Test with reduced motion settings enabled
- **High Contrast Mode**: Test with high contrast mode enabled
- **Mobile Accessibility**: Test on mobile screen readers and with touch interfaces

## Resources

- [Web Content Accessibility Guidelines (WCAG 2.1)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Inclusive Components](https://inclusive-components.design/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Feedback and Contributions

We're committed to continuously improving accessibility in Strive UI. If you encounter any accessibility issues or have suggestions for improvements, please [open an issue](https://github.com/TSKVenkat/strive-ui/issues/new?labels=accessibility) on our GitHub repository.
