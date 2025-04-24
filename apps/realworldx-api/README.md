# RealWorldX API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Introduction

Backend API for the RealWorld application, built with NestJS. This is an alternative implementation using Prisma ORM instead of TypeORM, with plans for additional features and optimizations in the future.

## Tech Stack

### Backend

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework with Fastify HTTP engine
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **Database**: [PostgreSQL](https://www.postgresql.org/), [MySQL](https://www.mysql.com/) - Relational databases
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js & TypeScript
- **Caching**: [Redis](https://redis.io/) - In-memory data store
- **Authentication**:
  - [JWT](https://jwt.io/) - JSON Web Tokens
  - [OAuth2](https://oauth.net/2/) - Authorization framework
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

- **Logging**: [Pino](https://github.com/pinojs/pino) - Fast Node.js logger

## Features

- All features from RealWorld API
- OAuth2 authentication support
- Redis caching for performance optimization
- MySQL, PostgreSQL database integration
- Enhanced security features
- Rate limiting
- Request validation
- Advanced error handling
- Performance monitoring

## Project Structure

```
src/
├── auth/           # Authentication module (JWT + OAuth2)
├── articles/       # Articles module
├── comments/       # Comments module
├── profiles/       # User profiles module
├── tags/           # Tags module
├── users/          # Users module
├── common/         # Common components
├── config/         # Application configuration
├── cache/          # Redis caching
└── monitoring/     # Performance monitoring
```

## System Requirements

- Node.js >= 20.x
- PostgreSQL >= 16.x
- MySQL >= 8.x
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
DATABASE_URL=mysql://user:password@localhost:3306/realworld

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# OAuth2
OAUTH2_CLIENT_ID=your-client-id
OAUTH2_CLIENT_SECRET=your-client-secret
OAUTH2_CALLBACK_URL=http://localhost:3000/auth/callback

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Swagger
SWAGGER_TITLE=RealWorldX API
SWAGGER_DESCRIPTION=Extended API documentation for RealWorld application
SWAGGER_VERSION=1.0
```

## Development

```bash
# Run in development mode
pnpm --filter=realworldx-api start:dev

# Run with hot-reload
pnpm --filter=realworldx-api start:debug

# Database Migrations
# Run pending migrations
pnpm --filter=@repo/mysql-typeorm migration:up

# Revert last migration
pnpm --filter=@repo/mysql-typeorm migration:down

# Generate new migration
pnpm --filter=@repo/mysql-typeorm migration:generate src/migrations/<migration-name>

# Show migration status
pnpm --filter=@repo/mysql-typeorm migration:show
```

## Build

```bash
# Build application
pnpm --filter=realworldx-api build

# Run in production mode
pnpm --filter=realworldx-api start:prod
```

## Testing

```bash
# Run unit tests
pnpm --filter=realworldx-api test

# Run e2e tests
pnpm --filter=realworldx-api test:e2e

# Check test coverage
pnpm --filter=realworldx-api test:cov
```

## API Documentation

Access Swagger UI at: `http://localhost:8002/api-docs`

## Deployment

### With Docker

```bash
# Build image
docker build -t realworldx-api .

# Run container
docker run -p 3000:3000 realworldx-api
```

### With PM2

```bash
# Install PM2
npm install -g pm2

# Run application
pm2 start dist/main.js --name realworldx-api
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
