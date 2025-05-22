# Publishing Guide

This guide provides instructions for publishing the Strive UI library to npm.

## Prerequisites

Before publishing, ensure that:

1. All tests pass: `npm test`
2. The build process works correctly: `npm run build`
3. The version number in `package.json` is correct
4. The CHANGELOG.md is updated with the latest changes

## Preparing for Publication

### 1. Update Version

Update the version in `package.json` following semantic versioning:
- **Major version (1.0.0)**: Breaking changes
- **Minor version (0.1.0)**: New features without breaking changes
- **Patch version (0.0.1)**: Bug fixes and minor changes

```bash
# Using npm version command
npm version [major|minor|patch]
```

### 2. Build the Package

Build the package to ensure all files are correctly generated:

```bash
npm run build
```

Verify that the `dist` directory contains:
- JavaScript files (CJS and ESM formats)
- TypeScript declaration files
- Source maps

### 3. Test the Package Locally

You can test the package locally before publishing:

```bash
# Create a tarball
npm pack

# Install the tarball in another project
npm install /path/to/strive-ui-1.0.0.tgz
```

## Publishing to npm

### 1. Login to npm

```bash
npm login
```

### 2. Publish the Package

```bash
# Dry run to see what will be published
npm publish --dry-run

# Actual publish
npm publish
```

For a scoped package:

```bash
npm publish --access public
```

### 3. Verify the Publication

After publishing, verify that:

1. The package is available on npm: `npm view strive-ui`
2. The package can be installed: `npm install strive-ui`
3. The package works correctly in a test project

## Publishing a New Version

When publishing a new version:

1. Update the code and documentation
2. Run tests: `npm test`
3. Update the version: `npm version [major|minor|patch]`
4. Update CHANGELOG.md
5. Build the package: `npm run build`
6. Publish: `npm publish`

## Publishing a Beta Version

For beta releases:

```bash
# Update version with beta tag
npm version 1.0.0-beta.1

# Publish with beta tag
npm publish --tag beta
```

Users can install the beta version with:

```bash
npm install strive-ui@beta
```

## Handling Deprecations

If you need to deprecate a version:

```bash
npm deprecate strive-ui@"<1.0.0" "This version is no longer supported"
```

## Post-Publication

After publishing:

1. Create a Git tag for the version
2. Push the tag to the repository
3. Create a GitHub release
4. Announce the new version to users

## Troubleshooting

### Common Issues

1. **Authentication failures**: Make sure you're logged in with `npm login`
2. **Version conflicts**: Ensure the version hasn't been published before
3. **Missing files**: Check your `.npmignore` and `files` in package.json
4. **Dependency issues**: Verify all dependencies are correctly specified

### Support

If you encounter issues, contact the package maintainers or open an issue on GitHub.
