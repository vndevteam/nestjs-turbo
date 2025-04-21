# RealWorld Web App

## Introduction

Web frontend application for RealWorld, built with Next.js. This is part of the NestJS Turborepo monorepo.

## Features

- Modern and responsive user interface
- Integration with RealWorld API
- Multi-language support
- SEO optimization
- Progressive Web App (PWA)

## Project Structure

```
src/
├── app/            # Next.js app directory
├── components/     # React components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── styles/         # Global styles
└── types/          # TypeScript types
```

## System Requirements

- Node.js >= 18.x
- pnpm >= 8.x

## Installation

```bash
# Install dependencies
pnpm install

# Create environment file
cp .env.example .env

# Edit environment variables in .env
```

## Configuration

Important environment variables:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true
```

## Development

```bash
# Run in development mode
pnpm run dev

# Run with hot-reload
pnpm run dev -- --turbo
```

## Build

```bash
# Build application
pnpm run build

# Run in production mode
pnpm run start
```

## Testing

```bash
# Run unit tests
pnpm run test

# Run tests with coverage
pnpm run test:cov

# Run e2e tests
pnpm run test:e2e
```

## Linting and Formatting

```bash
# Check for errors
pnpm run lint

# Automatically fix errors
pnpm run lint:fix

# Format code
pnpm run format
```

## Deployment

### With Docker

```bash
# Build image
docker build -t realworld-web .

# Run container
docker run -p 3000:3000 realworld-web
```

### With Vercel

1. Connect repository to Vercel
2. Configure environment variables
3. Automatic deployment on main branch push

## Development Process

1. Create a new branch from `main`
2. Make changes
3. Write tests
4. Create pull request
5. Wait for review and merge

## Support

If you encounter any issues or have questions, please create an issue on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).
