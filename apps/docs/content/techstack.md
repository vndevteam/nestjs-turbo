# Techstack

This document describes the technology stack used in different profiles of the project.

## RealWorld API

The RealWorld API is a standard implementation of the RealWorld specification.

### Backend Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework with Fastify HTTP engine
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Relational database
- **ORM**: [TypeORM](https://typeorm.io/) - Object-Relational Mapping
- **Authentication**: [JWT](https://jwt.io/) - JSON Web Tokens
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/) - API documentation
- **Testing**:
  - [Jest](https://jestjs.io/) - Testing framework
  - [Supertest](https://github.com/visionmedia/supertest) - HTTP testing

### Key Features

- RESTful API endpoints
- JWT-based authentication
- PostgreSQL database integration
- TypeORM for database operations
- Swagger documentation
- Request validation
- Error handling
- Logging with Winston

## RealWorldX API

The RealWorldX API is an extended version with additional features and optimizations.

### Backend Stack

- **Framework**: [NestJS](https://nestjs.com/) - A progressive Node.js framework with Fastify HTTP engine
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **Database**: [MySQL](https://www.mysql.com/) - Relational database
- **ORM**: [TypeORM](https://typeorm.io/) - Object-Relational Mapping
- **Caching**: [Redis](https://redis.io/) - In-memory data store
- **Authentication**:
  - [JWT](https://jwt.io/) - JSON Web Tokens
  - [OAuth2](https://oauth.net/2/) - Authorization framework
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/) - API documentation
- **Testing**:
  - [Jest](https://jestjs.io/) - Testing framework
  - [Supertest](https://github.com/visionmedia/supertest) - HTTP testing

### Key Features

- All features from RealWorld API
- OAuth2 authentication support
- Redis caching for performance optimization
- MySQL database integration
- Enhanced security features
- Rate limiting
- Request validation
- Advanced error handling
- Performance monitoring with New Relic
- Error tracking with Sentry

## Web Application

The web application is the frontend implementation.

### Frontend Stack

- **Framework**: [React](https://reactjs.org/) - JavaScript library for building user interfaces
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) - State management
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Testing**:
  - [Jest](https://jestjs.io/) - Testing framework
  - [React Testing Library](https://testing-library.com/) - React component testing
- **Build Tool**: [Vite](https://vitejs.dev/) - Next generation frontend tooling

### Key Features

- Modern React with hooks
- Responsive design
- Component-based architecture
- State management with Redux
- Unit and integration testing
- TypeScript for type safety
- Tailwind CSS for styling
- Vite for fast development

## Shared Packages

The project includes several shared packages used across different profiles:

### API Package (`@repo/api`)

- Common API utilities
- Shared DTOs
- API response types
- Error handling
- Validation decorators
- Common interfaces

### Database Packages

#### TypeORM Package (`@repo/postgresql-typeorm`)

- TypeORM configurations
- Database migrations
- Entity definitions
- Repository patterns
- Query builders

#### MySQL Package (`@repo/mysql-typeorm`)

- MySQL specific configurations
- MySQL migrations
- MySQL entity definitions
- MySQL query optimizations

### Nest Common Package (`@repo/nest-common`)

- Shared NestJS modules
- Common services
- Utility functions
- Custom decorators
- Guards and interceptors
- Exception filters

### UI Package (`@repo/ui`)

- Reusable React components
- Shared styles
- Design system
- Component documentation
- Storybook integration

## Development Tools

- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- **Build System**: [Turborepo](https://turbo.build/) - High-performance build system
- **Code Quality**:
  - [ESLint](https://eslint.org/) - Code linting
  - [Prettier](https://prettier.io/) - Code formatting
  - [Husky](https://typicode.github.io/husky/) - Git hooks
  - [lint-staged](https://github.com/okonet/lint-staged) - Run linters on staged files
- **Version Control**: [Git](https://git-scm.com/) - Distributed version control
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) - Continuous Integration/Deployment
- **Containerization**: [Docker](https://www.docker.com/) - Container platform
- **Documentation**:
  - [Next.js](https://nextjs.org/) - React framework for documentation
  - [MDX](https://mdxjs.com/) - Markdown with JSX
  - [Tailwind CSS](https://tailwindcss.com/) - Styling documentation
