# RealWorld API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Introduction

Backend API for the RealWorld application, built with NestJS. This is part of the NestJS Turborepo monorepo.

## Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework with Fastify HTTP engine
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **Database**: [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/) - Relational databases
- **ORM**: [TypeORM](https://typeorm.io/) - Object-Relational Mapping
- **Authentication**: [JWT](https://jwt.io/) - JSON Web Tokens
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/) - API documentation
- **Testing**:
  - [Jest](https://jestjs.io/) - Testing framework
  - [Supertest](https://github.com/visionmedia/supertest) - HTTP testing

### Development Tools

- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- **Build Tool**: [Turborepo](https://turbo.build/) - High-performance build system
- **Code Quality**:
  - [ESLint](https://eslint.org/) - Code linting
  - [Prettier](https://prettier.io/) - Code formatting
- **Version Control**: [Git](https://git-scm.com/) - Distributed version control
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) - Continuous Integration/Deployment
- **Containerization**: [Docker](https://www.docker.com/) - Container platform

### Monitoring & Performance

- **Logging**: [Pino](https://github.com/iamolegga/nestjs-pino) - Fast Node.js logger

## Features

- User authentication (registration, login)
- Article management (create, read, update, delete)
- Comment management
- User following
- Article favoriting

## Project Structure

```
src/
├── auth/           # Authentication module
├── articles/       # Articles module
├── comments/       # Comments module
├── profiles/       # User profiles module
├── tags/           # Tags module
├── users/          # Users module
├── common/         # Common components
└── config/         # Application configuration
```

## System Requirements

- Node.js >= 18.x
- PostgreSQL >= 14.x
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
# Application port
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/realworld

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Swagger
SWAGGER_TITLE=RealWorld API
SWAGGER_DESCRIPTION=API documentation for RealWorld application
SWAGGER_VERSION=1.0
```

## Development

```bash
# Run in development mode
pnpm --filter=realworld-api start:dev

# Run with hot-reload
pnpm --filter=realworld-api start:debug

# Database Migrations
# Run pending migrations
pnpm --filter=@repo/postgresql-typeorm migration:up

# Revert last migration
pnpm --filter=@repo/postgresql-typeorm migration:down

# Generate new migration
pnpm --filter=@repo/postgresql-typeorm migration:generate src/migrations/<migration-name>

# Show migration status
pnpm --filter=@repo/postgresql-typeorm migration:show
```

## Build

```bash
# Build application
pnpm --filter=realworld-api build

# Run in production mode
pnpm --filter=realworld-api start:prod
```

## Testing

```bash
# Run unit tests
pnpm --filter=realworld-api test

# Run e2e tests
pnpm --filter=realworld-api test:e2e

# Check test coverage
pnpm --filter=realworld-api test:cov
```

## API Documentation

Access Swagger UI at: `http://localhost:8001/api-docs`

## Deployment

### With Docker

```bash
# Build image
docker build -t realworld-api .

# Run container
docker run -p 3000:3000 realworld-api
```

### With PM2

```bash
# Install PM2
npm install -g pm2

# Run application
pm2 start dist/main.js --name realworld-api
```

## Development Process

1. Create a new branch from `develop`
2. Make changes
3. Write tests
4. Create pull request
5. Wait for review and merge

## Support

If you encounter any issues or have questions, please create an issue on GitHub.

## License

This project is licensed under the [MIT License](LICENSE).
