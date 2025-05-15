# NestJS Turborepo Monorepo

<p align="center">
  <a href="https://turborepo.com/" target="blank"><img src="https://user-images.githubusercontent.com/4060187/106504110-82f58d00-6494-11eb-87b7-a16d4f68bc5a.png" width="350" alt="Turborepo Logo" /></a>
</p>

<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="88" alt="Nest logo" /></a>
  <a href="https://typeorm.io/" target="blank"><img src="https://avatars.githubusercontent.com/u/20165699" width="88" alt="TypeORM logo" /></a>
  <a href="https://www.postgresql.org/" target="blank"><img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="88" alt="PostgreSQL logo" /></a>
  <a href="https://jestjs.io/" target="blank"><img src="https://raw.githubusercontent.com/jestjs/jest/refs/heads/main/website/static/img/jest.png" width="88" alt="Jest logo" /></a>
  <a href="https://prettier.io/" target="blank"><img src="https://raw.githubusercontent.com/prettier/prettier/refs/heads/main/website/static/icon.png" width="88" alt="Prettier logo" /></a>
  <a href="https://eslint.org/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/ESLint_logo.svg" width="88" alt="ESLint logo" /></a>
</p>

---

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/vndevteam/nestjs-turbo)
[![CI](https://github.com/vndevteam/nestjs-turbo/actions/workflows/ci.yml/badge.svg)](https://github.com/vndevteam/nestjs-turbo/actions/workflows/ci.yml)

## Introduction

This is a monorepo built with [Turborepo](https://turbo.build/repo) and [NestJS](https://nestjs.com/). The project includes multiple applications and shared libraries, all managed in a single repository.

## Project Structure

### Applications (Apps)

- `apps/realworld-api`: API backend for RealWorld application
- `apps/realworldx-api`: Extended API backend for RealWorld application
- `apps/web`: Web frontend application
- `apps/docs`: Project documentation

### Packages

- `packages/api`: Common library for APIs
- `packages/postgresql-typeorm`: TypeORM configuration and utilities for PostgreSQL
- `packages/mysql-typeorm`: MySQL configuration with TypeORM
- `packages/nest-common`: Common modules and services for NestJS
- `packages/ui`: UI components library
- `packages/eslint-config`: ESLint configuration
- `packages/typescript-config`: TypeScript configuration

## System Requirements

- Node.js >= 18.x
- pnpm >= 8.x
- Docker (optional, for development environment)

## Installation

```bash
# Clone repository
git clone https://github.com/vndevteam/nestjs-turbo.git

# Install dependencies
pnpm install

# Create environment files
cp apps/realworld-api/.env.example apps/realworld-api/.env
cp apps/realworldx-api/.env.example apps/realworldx-api/.env
```

## Development

```bash
# Run all applications in development mode
pnpm dev

# Run a specific application
pnpm dev --filter=realworld-api
pnpm dev --filter=web
```

## Build

```bash
# Build all applications and packages
pnpm build

# Build a specific application
pnpm build --filter=realworld-api
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific application
pnpm test --filter=realworld-api
```

## Deployment

Each application can be deployed independently. See the README of each application for detailed deployment instructions.

## Development Process

1. Create a new branch from `develop`
2. Make changes
3. Create pull request
4. Wait for review and merge

## Support

If you encounter any issues or have questions, please create an issue on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).
