# Accessibility Guide

StriveUI is built with accessibility in mind, following WAI-ARIA guidelines to ensure that applications built with our components are usable by everyone, including people with disabilities.

## Our Accessibility Approach

All StriveUI components are designed to be accessible by default, with the following considerations:

1. **Semantic HTML**: We use proper HTML elements for their intended purpose.
2. **Keyboard Navigation**: All interactive elements are keyboard accessible.
3. **ARIA Attributes**: We use ARIA roles, states, and properties when necessary.
4. **Focus Management**: We ensure proper focus management for complex components.
5. **Color Contrast**: Our default theme meets WCAG 2.1 AA contrast requirements.
6. **Screen Reader Support**: Components are tested with popular screen readers.

## Accessibility Features by Component

### Button
- Uses native `<button>` element
- Includes appropriate ARIA attributes for loading and disabled states
- Maintains visible focus indicators

### Input
- Uses native `<input>` element
- Labels are properly associated with inputs
- Error states are communicated to assistive technologies
- Required fields are marked with visual indicators and ARIA attributes

### Select
- Uses native `<select>` element for maximum compatibility
- Labels are properly associated with select elements
- Error states are communicated to assistive technologies

### Modal
- Implements focus trapping within the modal
- Returns focus to the triggering element when closed
- Uses appropriate ARIA roles and attributes
- Supports closing with the ESC key

### Tabs
- Uses proper ARIA roles (tablist, tab, tabpanel)
- Supports keyboard navigation between tabs
- Automatically activates tabs when navigating with arrow keys

### Toast
- Uses ARIA live regions for screen reader announcements
- Includes appropriate ARIA roles and attributes
- Provides sufficient time to read notifications

## Best Practices

When using StriveUI components, follow these best practices to maintain accessibility:

1. **Always use labels with form controls**
   ```jsx
   // Good
   <Input label="Email" />
   
   // Avoid
   <Input placeholder="Email" />
   ```

2. **Provide text alternatives for non-text content**
   ```jsx
   // Good
   <Avatar src="user.jpg" alt="User Profile" />
   
   // Avoid
   <Avatar src="user.jpg" />
   ```

3. **Ensure sufficient color contrast**
   ```jsx
   // Good - using theme colors that meet contrast requirements
   <Button variant="primary">Submit</Button>
   
   // Avoid - custom colors without checking contrast
   <Button style={{ backgroundColor: '#ffd', color: '#ddd' }}>Submit</Button>
   ```

4. **Don't rely solely on color to convey information**
   ```jsx
   // Good - uses both color and an icon
   <Alert variant="error" icon={<ErrorIcon />}>An error occurred</Alert>
   
   // Avoid - relies only on color
   <div style={{ color: 'red' }}>An error occurred</div>
   ```

5. **Provide instructions for complex interactions**
   ```jsx
   // Good
   <Pagination 
     aria-label="Pagination" 
     helperText="Use arrow keys to navigate between pages"
   />
   ```

## Testing for Accessibility

We recommend testing your application for accessibility using:

1. **Automated tools**:
   - [axe DevTools](https://www.deque.com/axe/)
   - [Wave](https://wave.webaim.org/)
   - [Lighthouse](https://developers.google.com/web/tools/lighthouse)

2. **Manual testing**:
   - Keyboard navigation testing
   - Screen reader testing (NVDA, VoiceOver, JAWS)
   - High contrast mode testing
   - Zoom/magnification testing

## Resources

- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
