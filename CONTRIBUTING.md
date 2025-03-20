# Contributing to AutoMCP

Thank you for your interest in contributing to AutoMCP! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project.

## How to Contribute

There are several ways to contribute to AutoMCP:

### Reporting Bugs

If you find a bug, please open an issue with the following information:

- A clear, descriptive title
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Environment details (OS, Node.js version, etc.)

### Suggesting Features

If you have an idea for a new feature, please open an issue with:

- A clear, descriptive title
- Detailed description of the feature
- Any relevant use cases or examples
- If possible, a high-level implementation plan

### Pull Requests

We welcome pull requests for bug fixes, features, or improvements. To submit a pull request:

1. Fork the repository
2. Create a new branch for your changes (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Add tests if applicable
5. Update documentation if needed
6. Commit your changes with clear, descriptive commit messages
7. Push your changes to your fork
8. Submit a pull request to the main repository

## Development Setup

1. Clone the repository:

   ```
   git clone https://github.com/your-username/automcp.git
   cd automcp
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Build the project:

   ```
   npm run build
   ```

4. Test your changes:
   ```
   ./bin/test-service.sh greeter
   ./bin/test-service.sh calculator
   ```

## Project Structure

Please see the README.md for information about the project structure.

## Code Style

- Use 2 spaces for indentation
- Follow TypeScript best practices
- Include JSDoc comments for functions and classes
- Keep lines to a reasonable length (preferably under 100 characters)

## Template Development

When modifying or creating new templates:

1. Templates are located in the `templates/` directory
2. Use EJS for templating (`.ejs` files)
3. Ensure that templates generate valid, well-formatted code
4. Test the templates with different service configurations

## Testing

Before submitting a pull request, make sure your changes pass all existing tests and add new tests if applicable.

## Documentation

When making changes, please update the documentation accordingly:

- Update README.md if you've added or changed features
- Update code comments, especially for public APIs
- Add examples if applicable

## Versioning

This project follows [Semantic Versioning](https://semver.org/). When making changes, consider whether they're backwards compatible and what version increment is appropriate.

## License

By contributing to AutoMCP, you agree that your contributions will be licensed under the project's MIT License.

## Questions

If you have any questions or need help contributing, please open an issue or contact the maintainers.

Thank you for your contributions!
