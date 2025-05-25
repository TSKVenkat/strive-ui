# Publishing Guide for Strive UI

This guide provides comprehensive instructions for publishing the Strive UI library to npm, ensuring a smooth and consistent release process.

## Package Structure

Strive UI follows a modern package structure:

```
@strive-ui/core         # Main package with core components
@strive-ui/hooks        # Reusable hooks for headless components
@strive-ui/utils        # Utility functions
@strive-ui/theme        # Theming system
```

## Prerequisites

Before publishing, ensure that:

1. All tests pass: `npm test`
2. Linting passes: `npm run lint`
3. TypeScript type checking passes: `npm run type-check`
4. The build process works correctly: `npm run build`
5. The version number in `package.json` is correct according to semantic versioning
6. The `CHANGELOG.md` is updated with the latest changes
7. All documentation is up-to-date

## Release Workflow

### 1. Prepare the Release

```bash
# Ensure you're on the main branch with the latest changes
git checkout main
git pull origin main

# Install dependencies
npm ci

# Run tests and checks
npm run validate  # This runs tests, linting, and type checking
```

### 2. Update Version

Update the version in `package.json` following semantic versioning:

- **Major version (1.0.0)**: Breaking changes
- **Minor version (0.1.0)**: New features without breaking changes
- **Patch version (0.0.1)**: Bug fixes and minor changes

```bash
# Using npm version command (automatically creates a git tag)
npm version [major|minor|patch] -m "chore(release): %s"
```

### 3. Update CHANGELOG.md

Ensure the CHANGELOG.md is updated with all notable changes. Follow the [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [1.0.0] - YYYY-MM-DD

### Added
- New feature A
- New component B

### Changed
- Updated component C
- Improved performance of D

### Fixed
- Bug in component E
- Issue with accessibility in F

### Breaking Changes
- Changed API for component G
- Removed deprecated component H
```

### 4. Build the Package

```bash
# Clean the previous build
npm run clean

# Build the package
npm run build
```

Verify that the `dist` directory contains:
- JavaScript files in CommonJS (CJS) format
- JavaScript files in ECMAScript Modules (ESM) format
- TypeScript declaration files (.d.ts)
- Source maps for debugging

### 5. Test the Package Locally

Test the package locally before publishing:

```bash
# Create a tarball
npm pack

# The output will be something like @strive-ui/core-1.0.0.tgz

# In a test project, install the tarball
npm install /path/to/@strive-ui/core-1.0.0.tgz
```

Verify that:
- The package can be imported correctly
- Components render as expected
- No runtime errors occur

## Publishing to npm

### 1. Authenticate with npm

```bash
# Login to npm (you'll need an npm account with access to the @strive-ui organization)
npm login
```

### 2. Publish the Package

```bash
# Perform a dry run to see what will be published
npm publish --dry-run

# If everything looks good, publish the package
npm publish --access public
```

For monorepo setups with multiple packages:

```bash
# Using lerna or nx
npx lerna publish from-git

# Or for manual publishing of individual packages
cd packages/core
npm publish --access public
```

### 3. Verify the Publication

After publishing, verify that:

1. The package is available on npm: `npm view @strive-ui/core`
2. The package can be installed: `npm install @strive-ui/core`
3. The package works correctly in a test project
4. The documentation site is updated with the latest version

## Publishing Pre-release Versions

### Alpha Releases

For early development versions with potentially breaking changes:

```bash
# Update version with alpha tag
npm version 1.0.0-alpha.1 -m "chore(release): %s"

# Publish with alpha tag
npm publish --tag alpha --access public
```

### Beta Releases

For feature-complete versions undergoing testing:

```bash
# Update version with beta tag
npm version 1.0.0-beta.1 -m "chore(release): %s"

# Publish with beta tag
npm publish --tag beta --access public
```

### Release Candidates

For versions ready for final testing before official release:

```bash
# Update version with rc tag
npm version 1.0.0-rc.1 -m "chore(release): %s"

# Publish with rc tag
npm publish --tag rc --access public
```

Users can install pre-release versions with:

```bash
# Alpha version
npm install @strive-ui/core@alpha

# Beta version
npm install @strive-ui/core@beta

# Release candidate
npm install @strive-ui/core@rc
```

## Post-Publication Tasks

After publishing:

1. Push the changes and tags to GitHub:
   ```bash
   git push origin main --tags
   ```

2. Create a GitHub release:
   - Go to GitHub > Releases > Draft a new release
   - Use the tag created during versioning
   - Copy the CHANGELOG entry for this version
   - Attach any additional assets if needed

3. Update documentation site with the latest version information

4. Announce the release in appropriate channels:
   - GitHub Discussions
   - Twitter/X
   - Discord community
   - Blog post for significant releases

## Handling Deprecations and Migrations

### Deprecating Versions or Features

If you need to deprecate a version:

```bash
npm deprecate @strive-ui/core@"<1.0.0" "This version is no longer supported, please upgrade to v1.x"
```

For deprecating features within the code, use JSDoc annotations and console warnings:

```jsx
/**
 * @deprecated Since v1.2.0. Use NewComponent instead.
 */
export function OldComponent(props) {
  console.warn(
    'Warning: OldComponent is deprecated and will be removed in a future version. ' +
    'Use NewComponent instead.'
  );
  // Component implementation
}
```

### Migration Guides

For major versions with breaking changes, provide migration guides in the documentation:

- Clear explanations of what changed and why
- Code examples showing before and after
- Codemods or scripts to help with automated migrations when possible

## Troubleshooting

### Common Issues

1. **Authentication failures**: Make sure you're logged in with `npm login` and have the correct permissions for the @strive-ui organization

2. **Version conflicts**: Ensure the version hasn't been published before. Check with `npm view @strive-ui/core versions`

3. **Missing files**: Check your `.npmignore` and `files` field in package.json to ensure all necessary files are included

4. **Dependency issues**: Verify all dependencies are correctly specified in package.json, with appropriate version ranges

5. **Peer dependency warnings**: Ensure peer dependencies are correctly specified and documented

### Support

If you encounter issues with the publishing process, contact the project maintainer at tskv.0411@gmail.com or open an issue on GitHub with the "publishing" label.
