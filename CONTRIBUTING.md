# Contributing to Kinetic

We're excited to have you contribute to Kinetic! This document outlines the process for contributing to our project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Push your changes to your fork
6. Submit a pull request to the main repository

## Development Setup

### Backend Server
```bash
cd server
npm install
npm run dev
```

### Frontend Dashboard
```bash
npm install
npm run dev
```

### Python SDK
```bash
cd sdk-python
pip install -e .
python -m pytest
```

### Node.js SDK
```bash
cd sdk-js
npm install
npm run build
```

### Go SDK
```bash
cd sdk-go
go test ./...
```

## Code Guidelines

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Format with Prettier
- Write tests for new features

### Python
- Follow PEP 8 style guidelines
- Add type hints
- Write docstrings for all functions
- Include unit tests

### Go
- Follow Go conventions
- Use `go fmt` for formatting
- Include proper error handling
- Write tests

## Testing

Before submitting a PR:
```bash
# Backend
cd server && npm test

# Frontend
npm test

# Python SDK
cd sdk-python && pytest

# Node.js SDK
cd sdk-js && npm test

# Go SDK
cd sdk-go && go test ./...
```

## Commit Messages

Use clear, descriptive commit messages:
- `feat: Add new entropy algorithm`
- `fix: Handle missing API key gracefully`
- `docs: Update installation guide`
- `test: Add tests for entropy calculation`
- `perf: Optimize database queries`

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md with notes on your changes
3. Ensure all tests pass
4. Request review from maintainers
5. Once approved, your PR will be merged

## Reporting Issues

Before creating an issue:
- Check if the issue already exists
- Provide a clear description
- Include steps to reproduce (if it's a bug)
- Include your environment details

## Feature Requests

We love feature ideas! Please:
- Describe the use case
- Explain why it's important
- Suggest implementation approaches if possible

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Questions?

Feel free to open a discussion or ask in our Discord community.

Thank you for contributing to Kinetic!
