# Security Policy

## Supported Versions

We actively support and provide security updates for the following versions of Pulse UI:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| 0.x.x   | :x:                |

## Reporting a Vulnerability

The security of Pulse UI is taken seriously. If you discover a security vulnerability, please report it by sending an email to:

**tskv.0411@gmail.com**

### Please include the following information:

- A description of the vulnerability
- Steps to reproduce the issue
- Potential impact of the vulnerability
- Any proposed solutions (if available)

### What to expect:

- **Response Time**: You will receive an acknowledgment within 48 hours
- **Investigation**: We will investigate and assess the vulnerability
- **Resolution**: Critical vulnerabilities will be addressed within 7 days
- **Disclosure**: Security advisories will be published after fixes are available

## Security Considerations

### Client-Side Security

Pulse UI is a client-side library. When using our components:

- Always validate and sanitize user inputs
- Be cautious with dynamic content rendering
- Follow React security best practices
- Use HTTPS in production environments

### Dependencies

We regularly:

- Monitor dependencies for known vulnerabilities
- Update dependencies to secure versions
- Use automated security scanning tools
- Minimize the dependency footprint

### Accessibility & Security

Our accessibility features are designed with security in mind:

- ARIA attributes are properly escaped
- Focus management prevents focus trapping attacks
- Screen reader announcements are sanitized

## Best Practices for Users

When using Pulse UI in your applications:

1. **Keep Updated**: Always use the latest stable version
2. **Audit Dependencies**: Regularly audit your project dependencies
3. **Content Security Policy**: Implement appropriate CSP headers
4. **Input Validation**: Validate all user inputs before passing to components
5. **HTTPS**: Always serve your application over HTTPS

## Security Features

Pulse UI includes several security considerations:

- **XSS Prevention**: Components properly escape dynamic content
- **Safe Defaults**: Secure configurations are the default
- **No Eval**: No use of `eval()` or similar dangerous functions
- **Minimal Attack Surface**: Headless architecture reduces attack vectors

## Responsible Disclosure

We practice responsible disclosure and request that security researchers:

- Allow reasonable time for investigation and patching
- Do not publicly disclose vulnerabilities until patches are available
- Provide clear steps for reproduction
- Work with us to minimize user impact

## Recognition

We appreciate security researchers who help keep Pulse UI safe. With your permission, we will:

- Credit you in our security advisories

---

Thank you for helping keep Pulse UI and its users safe!
