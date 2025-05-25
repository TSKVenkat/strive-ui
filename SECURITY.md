# Security Policy

## Overview

Strive UI is committed to maintaining the security of our component library. This document outlines our security practices and how to report vulnerabilities.

## Supported Versions

| Version | Security Updates |
| ------- | ---------------- |
| 1.0.x   | ✅               |
| < 1.0   | ❌               |

## Reporting Vulnerabilities

If you discover a security vulnerability, please:

1. **DO NOT** disclose it publicly
2. Email directly to **tskv.0411@gmail.com** with:
   - Clear description of the issue
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 7 days
- **Regular updates**: Throughout the resolution process
- **Public disclosure**: After a fix is available

## Security Considerations for UI Components

### For Library Users

1. **Sanitize user input**: Never pass unsanitized user input to component props
2. **Avoid `dangerouslySetInnerHTML`**: If necessary, use a sanitization library
3. **Keep dependencies updated**: Run regular security audits
4. **Implement CSP**: Protect against XSS attacks

### For Contributors

1. **No secrets in components**: Never embed API keys or credentials
2. **Validate props**: Implement prop validation and type checking
3. **Safe event handling**: Be careful with event handlers that modify DOM
4. **Accessibility**: Security and accessibility often overlap

## Commitment

We take all security reports seriously and will prioritize fixes for confirmed vulnerabilities.

Thank you for helping keep Strive UI secure.
