# Zizo Backend - Hono

Enterprise-grade backend API built with Hono and TypeScript following industry best practices.

## 🏗️ Project Structure

```
zizo-backend-hono/
├── src/
│   ├── config/              # Configuration files and environment setup
│   │   └── index.ts         # Application configuration
│   ├── constants/           # Application constants and enums
│   │   └── index.ts         # HTTP status codes, messages, etc.
│   ├── controllers/         # Request handlers
│   │   ├── health.controller.ts
│   │   ├── user.controller.ts
│   │   └── index.ts
│   ├── middlewares/         # Custom middleware functions
│   │   ├── error.middleware.ts
│   │   ├── logger.middleware.ts
│   │   └── index.ts
│   ├── models/              # Data models and type definitions
│   │   ├── user.model.ts
│   │   └── index.ts
│   ├── routes/              # Route definitions
│   │   ├── health.routes.ts
│   │   ├── user.routes.ts
│   │   └── index.ts
│   ├── services/            # Business logic layer
│   │   ├── user.service.ts
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── index.ts
│   ├── validators/          # Input validation schemas
│   │   ├── user.validator.ts
│   │   └── index.ts
│   └── index.ts             # Application entry point
├── tests/                   # Test files
│   ├── user.service.test.ts
│   └── user.validator.test.ts
├── scripts/                 # Build and deployment scripts
├── .env.example             # Example environment variables
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
├── eslint.config.mjs       # ESLint configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vitest.config.ts        # Vitest configuration

```

## ✨ Features

- ⚡ **Hono Framework** - Ultrafast web framework for the edge
- 🔷 **TypeScript** - Full type safety
- 📁 **Enterprise Architecture** - Clean, scalable folder structure
- 🛡️ **Input Validation** - Zod schema validation
- 🧪 **Testing** - Vitest for unit and integration tests
- 📝 **Logging** - Custom logger utility
- 🔧 **Code Quality** - ESLint and Prettier
- 🌍 **CORS Support** - Configurable CORS middleware
- 📊 **Health Checks** - Built-in health check endpoint

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd zizo-backend-hono
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Building

Build the project for production:

```bash
npm run build
```

### Production

Run the production build:

```bash
npm start
```

## 🧪 Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 🔍 Code Quality

### Linting

Check for linting errors:

```bash
npm run lint
```

Fix linting errors automatically:

```bash
npm run lint:fix
```

### Formatting

Check code formatting:

```bash
npm run format:check
```

Format code:

```bash
npm run format
```

### Type Checking

Run TypeScript type checking:

```bash
npm run type-check
```

## 📡 API Endpoints

### Health Check

- `GET /health` - Check API health status

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## 🏛️ Architecture Patterns

### Layered Architecture

1. **Routes** - Define API endpoints
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Contain business logic
4. **Models** - Define data structures
5. **Validators** - Validate input data
6. **Middlewares** - Cross-cutting concerns

### Best Practices Implemented

- ✅ Separation of concerns
- ✅ Dependency injection ready
- ✅ Error handling middleware
- ✅ Request/Response logging
- ✅ Type-safe validators
- ✅ Consistent API responses
- ✅ Environment-based configuration

## 🔧 Configuration

Environment variables can be configured in `.env`:

```env
NODE_ENV=development
PORT=3000
API_VERSION=v1
API_PREFIX=/api
LOG_LEVEL=info
```

## 📚 Technology Stack

- **Framework**: [Hono](https://hono.dev/)
- **Runtime**: Node.js
- **Language**: TypeScript
- **Validation**: Zod
- **Testing**: Vitest
- **Linting**: ESLint
- **Formatting**: Prettier

## 🤝 Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Run linting and formatting before committing
4. Follow conventional commit messages

## 📝 License

ISC
