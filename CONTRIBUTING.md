# Contributing to Strive UI

## Overview

Thank you for considering contributing to Strive UI! This document provides guidelines for contributing to the project maintained by [Venkataraman T S K](https://github.com/TSKVenkat).

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating in this project.

## Development Setup

```bash
# Clone repository
git clone https://github.com/TSKVenkat/strive-ui.git
cd strive-ui

# Install dependencies
npm install

# Start Storybook for development
npm run storybook
```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- Feature branches - Created from `main` for new features or fixes

### Creating a Feature or Fix

```bash
# Create a branch from main
git checkout main
git pull origin main
git checkout -b feat/component-name
# or
git checkout -b fix/issue-number
```

### Development Process

1. **Implement your changes** following our component architecture
2. **Write tests** for all functionality
3. **Update documentation** as needed
4. **Verify your work**
   ```bash
   npm run lint     # Check code quality
   npm test         # Run tests
   npm run build    # Ensure build works
   ```

## Pull Request Guidelines

# Checklist Before Submitting a PR

- [ ] I have tested the component on multiple screen sizes
- [ ] I followed the component structure and headless pattern
- [ ] I wrote or updated relevant tests
- [ ] I ensured accessibility best practices are followed
- [ ] I updated documentation/examples if needed
- [ ] I ran `npm run lint` and `npm test`

## Commit Message Format

This project uses uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation.:

<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

## 🔁 Common Commit Types

- `feat`: A new feature  
- `feat!`: A breaking feature change (triggers a **major version bump**)  
- `fix`: A bug fix (triggers a **patch version bump**)  
- `docs`: Documentation only changes  
- `style`: Changes that do not affect code behavior (e.g., formatting, whitespace)  
- `refactor`: Code changes that neither fix a bug nor add a feature  
- `test`: Adding or correcting tests  
- `chore`: Changes to tooling, dependencies, or the build process  
- `ci`: Changes to CI configuration or scripts  

---

## 🆎 Examples

### ✅ Good Commits

- `feat: add new Modal component with accessibility support`
- `fix(button): resolve hover state color issue`
- `docs: add usage examples for Form components`
- `feat!: redesign theming API`  


### ❌ Bad Commits

- `update stuff`
- `fixed bug`
- `added feature`
- `WIP`
- `asdf`

---

## 🔍 Optional Scopes

Use component or area names as scopes:

- `button`
- `input`
- `modal`
- `theme`
- `docs`
- `build`

**Examples:**

- `feat(button): add loading state support`
- `fix(input): handle empty string validation`
- `refactor(theme): simplify dark mode switch logic`


## Component Architecture

### Headless Component Pattern

Strive UI uses a headless approach that separates logic from presentation:

1. **Logic Hook** - Contains state management and behavior
2. **Component** - Uses the hook and provides a base implementation

### Component Structure

```
ComponentName/
├── useComponentName.ts    # Logic hook
├── ComponentName.tsx      # Component implementation
├── ComponentName.test.tsx # Tests
├── ComponentName.stories.tsx # Storybook stories
└── index.ts               # Exports
```

### Implementation Requirements

- **Headless architecture** - Separate logic from presentation
- **Accessibility** - ARIA attributes and keyboard navigation
- **TypeScript** - Strong typing for all props and functions
- **Testing** - Comprehensive test coverage
- **Performance** - Memoization and optimized renders

## Documentation Standards

- **JSDoc comments** for all exported functions and components
- **Usage examples** showing different configurations
- **Accessibility notes** for interactive components
- **Props documentation** with types, defaults, and descriptions

Each component should follow the documentation template in `docs/templates/component-doc-template.md`.

## Testing Requirements

- Unit tests for all components and hooks
- Test different prop combinations
- Test accessibility compliance
- Test keyboard navigation for interactive components

## Release Process

The release process is managed by the project maintainer and follows these steps:

1. Collect and review all changes in the `main` branch
2. Run a full test suite to ensure everything works
3. Update the version according to semantic versioning
4. Generate or update the changelog
5. Create a release build
6. Publish to npm
7. Create a GitHub release with release notes

## Need Help?

Contact the project maintainer at tskv.0411@gmail.com or open an issue with the "question" label.

## License

By submitting a contribution, you agree that it will be licensed under the [MIT License](LICENSE).