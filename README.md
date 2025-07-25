# 🧪 MERN Task Manager - Testing and Debugging Project

A comprehensive MERN stack task management application with extensive testing coverage, demonstrating unit testing, integration testing, and end-to-end testing strategies.

## 🚀 Features

- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Task Management**: Set priorities, statuses, and due dates
- **Filtering & Sorting**: Filter by status and priority, sort by various criteria
- **Responsive Design**: Modern, mobile-friendly UI
- **Real-time Updates**: React Query for efficient data management
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Comprehensive Testing**: Unit, integration, and E2E tests with 70%+ coverage

## 🛠️ Tech Stack

### Backend

- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **Jest** & **Supertest** - Testing framework
- **Winston** - Logging
- **Express Validator** - Input validation
- **Helmet** & **CORS** - Security middleware

### Frontend

- **React** - UI framework
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Jest** & **React Testing Library** - Testing
- **Cypress** - End-to-end testing

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mern-task-manager
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment example files
   cp server/env.example server/.env
   cp client/.env.example client/.env

   # Edit the files with your configuration
   ```

4. **Set up the database**

   ```bash
   # For development (MongoDB Atlas)
   # Update MONGODB_URI in server/.env

   # For testing
   npm run setup-test-db
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The project maintains high test coverage across all layers:

- **Unit Tests**: 85%+ coverage

  - Model validation and methods
  - Utility functions
  - React components
  - Custom hooks

- **Integration Tests**: 90%+ coverage

  - API endpoints
  - Database operations
  - Authentication flows
  - Error handling

- **End-to-End Tests**: Critical user flows
  - Task creation and management
  - Navigation and routing
  - Error scenarios
  - Cross-browser compatibility

### Test Structure

```
├── server/
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── Task.test.js
│   │   │   └── utils.test.js
│   │   └── integration/
│   │       └── tasks.test.js
│   └── scripts/
│       └── setup-test-db.js
├── client/
│   ├── src/
│   │   └── tests/
│   │       └── unit/
│   │           ├── Button.test.jsx
│   │           └── TaskCard.test.jsx
│   └── cypress/
│       ├── e2e/
│       │   └── task-management.cy.js
│       └── support/
│           └── e2e.js
```

## 🔧 API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks (with filtering)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark task as completed
- `GET /api/tasks/status/:status` - Get tasks by status
- `GET /api/tasks/overdue` - Get overdue tasks

### Health Check

- `GET /health` - Server health status

## 🐛 Debugging Features

### Server-side Debugging

- **Winston Logger**: Structured logging with different levels
- **Error Handler**: Global error handling middleware
- **Request Logging**: Morgan for HTTP request logging
- **Validation Errors**: Detailed validation error messages
- **Rate Limiting**: Protection against abuse

### Client-side Debugging

- **Error Boundaries**: React error boundaries for component errors
- **React Query DevTools**: Built-in debugging tools
- **Console Logging**: API request/response logging
- **User Feedback**: Loading states and error messages

### Development Tools

- **Hot Reloading**: Automatic server and client restart
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Git Hooks**: Pre-commit linting and testing

## 📊 Performance Monitoring

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: React Query for efficient data caching
- **Rate Limiting**: API protection against abuse
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring

## 🚀 Deployment

### Prerequisites

- Node.js 16+
- MongoDB (Atlas recommended for production)
- Environment variables configured

### Production Setup

1. Set `NODE_ENV=production`
2. Configure MongoDB Atlas connection
3. Set up proper CORS origins
4. Configure rate limiting
5. Set up logging to external service
6. Build client: `npm run build`

### Environment Variables

**Server (.env)**

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Client (.env)**

```env
REACT_APP_API_URL=https://your-api-domain.com/api
```

## 📈 Testing Strategy

### Unit Testing

- **Models**: Validation, methods, and static functions
- **Utilities**: Helper functions and middleware
- **Components**: React components in isolation
- **Services**: API service functions

### Integration Testing

- **API Endpoints**: Full request/response cycles
- **Database Operations**: CRUD operations with test database
- **Authentication**: Login/logout flows
- **Error Handling**: Various error scenarios

### End-to-End Testing

- **User Flows**: Complete task management workflows
- **Navigation**: Routing and page transitions
- **Error Scenarios**: Network errors and edge cases
- **Cross-browser**: Multiple browser testing

### Test Coverage Goals

- **Statements**: 70%+
- **Branches**: 60%+
- **Functions**: 70%+
- **Lines**: 70%+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎯 Learning Objectives

This project demonstrates:

- **Comprehensive Testing**: Unit, integration, and E2E testing strategies
- **Error Handling**: Robust error management across the stack
- **Debugging Techniques**: Various debugging tools and practices
- **Performance Optimization**: Database indexing and caching
- **Security Best Practices**: Input validation and rate limiting
- **Modern Development**: React Query, hooks, and modern patterns
- **Code Quality**: ESLint, Prettier, and testing coverage
- **Documentation**: Comprehensive README and inline documentation

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Check your MongoDB URI in `.env`
   - Ensure MongoDB is running (local) or accessible (Atlas)

2. **Port Already in Use**

   - Change PORT in server `.env`
   - Kill existing processes on the port

3. **Test Failures**

   - Ensure test database is set up: `npm run setup-test-db`
   - Check that all dependencies are installed

4. **Cypress Tests Failing**
   - Ensure both client and server are running
   - Check that the API is accessible at `http://localhost:5000`

### Debugging Tips

- Use `console.log()` for quick debugging
- Check browser developer tools for client errors
- Review server logs for API issues
- Use React Query DevTools for data fetching issues
- Check Cypress dashboard for E2E test debugging
