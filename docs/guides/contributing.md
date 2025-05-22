# Contributing to StriveUI

We welcome contributions to StriveUI! This guide will help you understand our development process and how you can contribute to the library.

## Code of Conduct

Please read and follow our [Code of Conduct](../../CODE_OF_CONDUCT.md) to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Git

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/strive-ui.git
   cd strive-ui
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

4. Start Storybook to see the components in action:
   ```bash
   npm run storybook
   # or
   yarn storybook
   ```

## Development Workflow

### Branch Organization

- `main` - Contains the latest stable release
- `develop` - Development branch where features are integrated
- Feature branches - Created from `develop` for new features or bug fixes

### Creating a New Feature or Bug Fix

1. Create a new branch from `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes and ensure they follow our coding standards
3. Write or update tests as necessary
4. Run tests to make sure everything passes:
   ```bash
   npm test
   # or
   yarn test
   ```

5. Update documentation if needed
6. Commit your changes following our commit message conventions

### Commit Message Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that don't affect code functionality (formatting, etc.)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Example:
```
feat(button): add loading state to Button component

Add a new isLoading prop to the Button component that displays a spinner
and disables the button when true.

Closes #123
```

### Pull Request Process

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a pull request against the `develop` branch of the main repository
3. Fill out the pull request template with all required information
4. Request a review from one of the maintainers
5. Address any feedback from the code review
6. Once approved, a maintainer will merge your pull request

## Component Development Guidelines

### Component Structure

Each component should:
1. Be in its own directory under `src/components`
2. Include the component file, tests, stories, and index file
3. Follow this structure:
   ```
   src/components/ComponentName/
   ├── ComponentName.tsx
   ├── ComponentName.test.tsx
   ├── ComponentName.stories.tsx
   ├── README.md (optional)
   └── index.ts
   ```

### Component Implementation

- Use TypeScript for type safety
- Use styled-components for styling
- Follow accessibility best practices
- Support keyboard navigation where applicable
- Include appropriate ARIA attributes
- Make components responsive
- Support theme customization

### Testing Requirements

- Write unit tests for all components
- Include tests for different prop combinations
- Test accessibility compliance
- Test keyboard navigation for interactive components

## Documentation Guidelines

### Component Documentation

Each component should have:
1. A clear description of what it does
2. Examples of basic usage
3. A complete props table
4. Examples of different variants and states
5. Accessibility considerations
6. Design guidelines (if applicable)

### Code Comments

- Use JSDoc comments for components and functions
- Include examples in JSDoc comments where helpful
- Document complex logic with inline comments

## Release Process

Our release process is managed by the maintainers and follows these steps:

1. Collect and review all changes in the `develop` branch
2. Run a full test suite to ensure everything works
3. Update the version according to semantic versioning
4. Generate or update the changelog
5. Create a release build
6. Publish to npm
7. Create a GitHub release with release notes

## Getting Help

If you need help with your contribution, you can:
- Open an issue with the "question" label
- Reach out to the maintainers
- Join our community chat (if available)

Thank you for contributing to StriveUI! Your efforts help make the library better for everyone.
