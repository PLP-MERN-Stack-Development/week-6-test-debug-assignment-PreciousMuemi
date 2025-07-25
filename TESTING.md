# 🧪 Testing Documentation

This document provides comprehensive information about the testing strategy, implementation, and best practices used in the MERN Task Manager project.

## 📋 Testing Overview

The project implements a comprehensive testing strategy with three main types of tests:

1. **Unit Tests** - Testing individual functions and components in isolation
2. **Integration Tests** - Testing API endpoints and database operations
3. **End-to-End Tests** - Testing complete user workflows

## 🎯 Testing Goals

- **70%+ Code Coverage** across all test types
- **Reliable Test Suite** with minimal flaky tests
- **Fast Test Execution** for efficient development workflow
- **Comprehensive Error Testing** for robust error handling
- **Cross-browser Compatibility** testing

## 🛠️ Testing Tools

### Backend Testing
- **Jest** - Test runner and assertion library
- **Supertest** - HTTP assertion library for API testing
- **MongoDB Memory Server** - In-memory MongoDB for testing
- **Winston** - Logging for debugging tests

### Frontend Testing
- **Jest** - Test runner
- **React Testing Library** - Component testing utilities
- **Cypress** - End-to-end testing framework
- **@testing-library/user-event** - User interaction simulation

## 📁 Test Structure

```
project/
├── server/
│   ├── tests/
│   │   ├── setup.js              # Test database setup
│   │   ├── unit/
│   │   │   ├── Task.test.js      # Model unit tests
│   │   │   └── utils.test.js     # Utility function tests
│   │   └── integration/
│   │       └── tasks.test.js     # API integration tests
│   └── scripts/
│       └── setup-test-db.js      # Test database setup script
├── client/
│   ├── src/
│   │   └── tests/
│   │       ├── setup.js          # Client test setup
│   │       └── unit/
│   │           ├── Button.test.jsx
│   │           └── TaskCard.test.jsx
│   └── cypress/
│       ├── e2e/
│       │   └── task-management.cy.js
│       └── support/
│           └── e2e.js
└── jest.config.js                # Root Jest configuration
```

## 🧪 Unit Testing

### Backend Unit Tests

#### Task Model Tests (`server/tests/unit/Task.test.js`)

**Test Categories:**
- **Validation Tests**: Schema validation, required fields, field length limits
- **Instance Method Tests**: `markAsCompleted()` method
- **Static Method Tests**: `findByStatus()`, `findOverdue()`
- **Middleware Tests**: Pre-save hooks

**Example Test:**
```javascript
it('should create a task with valid data', async () => {
  const taskData = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    priority: 'medium'
  };

  const task = new Task(taskData);
  const savedTask = await task.save();

  expect(savedTask.title).toBe(taskData.title);
  expect(savedTask.status).toBe(taskData.status);
});
```

#### Utility Function Tests (`server/tests/unit/utils.test.js`)

**Test Categories:**
- **Async Handler**: Error handling for async functions
- **Logger**: Logging functionality
- **Error Scenarios**: Various error conditions

### Frontend Unit Tests

#### Component Tests

**TaskCard Component (`client/src/tests/unit/TaskCard.test.jsx`)**

**Test Categories:**
- **Rendering**: Component renders correctly with props
- **User Interactions**: Button clicks, form submissions
- **Conditional Rendering**: Different states (completed, overdue)
- **Props Handling**: Various prop combinations
- **Event Handling**: Callback functions

**Example Test:**
```javascript
it('calls onComplete when complete button is clicked', () => {
  renderWithRouter(
    <TaskCard 
      task={mockTask} 
      onDelete={mockOnDelete} 
      onComplete={mockOnComplete} 
    />
  );

  const completeButton = screen.getByText('Complete');
  fireEvent.click(completeButton);

  expect(mockOnComplete).toHaveBeenCalledWith('1');
});
```

## 🔗 Integration Testing

### API Integration Tests (`server/tests/integration/tasks.test.js`)

**Test Categories:**
- **CRUD Operations**: Create, read, update, delete tasks
- **Filtering**: Status and priority filtering
- **Validation**: Input validation and error responses
- **Error Handling**: 404, 400, 500 error scenarios
- **Database Operations**: Real database interactions

**Example Test:**
```javascript
it('should create a new task with valid data', async () => {
  const taskData = {
    title: 'New Task',
    description: 'New Description',
    status: 'pending',
    priority: 'high'
  };

  const response = await request(app)
    .post('/api/tasks')
    .send(taskData)
    .expect(201);

  expect(response.body.success).toBe(true);
  expect(response.body.data.title).toBe(taskData.title);
});
```

### Test Database Setup

**In-Memory MongoDB**: Uses `mongodb-memory-server` for isolated testing
**Sample Data**: Pre-populated test data for consistent testing
**Cleanup**: Automatic cleanup between tests

## 🌐 End-to-End Testing

### Cypress Tests (`client/cypress/e2e/task-management.cy.js`)

**Test Categories:**
- **User Workflows**: Complete task management flows
- **Navigation**: Page routing and navigation
- **Form Interactions**: Form filling and submission
- **Error Scenarios**: Network errors, validation errors
- **Cross-browser**: Multiple browser testing

**Example Test:**
```javascript
it('should create a new task successfully', () => {
  cy.visit('/tasks/new');
  
  cy.get('input[name="title"]').type('New Task Title');
  cy.get('textarea[name="description"]').type('New Task Description');
  cy.get('select[name="status"]').select('in-progress');
  cy.get('select[name="priority"]').select('high');
  
  cy.contains('Create Task').click();
  
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  cy.contains('New Task Title').should('be.visible');
});
```

### Custom Cypress Commands

**Task Management Commands:**
- `cy.createTask()` - Create a task via API
- `cy.deleteAllTasks()` - Clean up all tasks
- `cy.waitForTaskList()` - Wait for task list to load
- `cy.getTaskCard()` - Get task card by title

## 📊 Test Coverage

### Coverage Goals
- **Statements**: 70%+
- **Branches**: 60%+
- **Functions**: 70%+
- **Lines**: 70%+

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

## 🚀 Running Tests

### Development Workflow
```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### CI/CD Integration
```bash
# Run tests for CI
npm run test:ci

# Run E2E tests in headless mode
npm run test:e2e:ci
```

## 🐛 Debugging Tests

### Common Issues and Solutions

#### 1. MongoDB Connection Issues
**Problem**: Tests fail due to database connection
**Solution**: Ensure test database is properly set up
```bash
npm run setup-test-db
```

#### 2. Async Test Failures
**Problem**: Tests fail due to timing issues
**Solution**: Use proper async/await and waitFor
```javascript
await waitFor(() => {
  expect(screen.getByText('Task')).toBeInTheDocument();
});
```

#### 3. Component Rendering Issues
**Problem**: Components not rendering in tests
**Solution**: Provide necessary context providers
```javascript
render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Component />
    </QueryClientProvider>
  </BrowserRouter>
);
```

#### 4. API Mocking Issues
**Problem**: API calls not mocked properly
**Solution**: Use proper mocking strategies
```javascript
jest.mock('../services/taskService', () => ({
  fetchTasks: jest.fn(),
  createTask: jest.fn(),
}));
```

### Debugging Tools

#### Jest Debugging
```bash
# Run specific test file
npm test -- Task.test.js

# Run tests with verbose output
npm test -- --verbose

# Debug specific test
npm test -- --testNamePattern="should create task"
```

#### Cypress Debugging
```bash
# Open Cypress in interactive mode
npm run test:e2e:open

# Run specific test file
npx cypress run --spec "cypress/e2e/task-management.cy.js"

# Debug with console logs
cy.log('Debug message');
```

## 📈 Performance Testing

### Test Performance Metrics
- **Unit Tests**: < 5 seconds
- **Integration Tests**: < 30 seconds
- **E2E Tests**: < 2 minutes
- **Full Test Suite**: < 5 minutes

### Performance Optimization
- **Parallel Execution**: Tests run in parallel where possible
- **Test Isolation**: Each test is independent
- **Efficient Setup**: Minimal setup/teardown overhead
- **Mocking**: External dependencies mocked

## 🔒 Security Testing

### Input Validation Tests
- **SQL Injection**: Test malicious input
- **XSS Prevention**: Test script injection
- **Input Sanitization**: Test special characters
- **Rate Limiting**: Test API abuse prevention

### Authentication Tests
- **Token Validation**: Test JWT tokens
- **Session Management**: Test user sessions
- **Authorization**: Test access control

## 📝 Best Practices

### Test Writing Guidelines

1. **Arrange-Act-Assert Pattern**
```javascript
// Arrange
const mockTask = { title: 'Test', status: 'pending' };

// Act
const result = await createTask(mockTask);

// Assert
expect(result.title).toBe('Test');
```

2. **Descriptive Test Names**
```javascript
it('should return 404 when task does not exist', async () => {
  // test implementation
});
```

3. **Test Isolation**
```javascript
beforeEach(async () => {
  await Task.deleteMany({});
});
```

4. **Mock External Dependencies**
```javascript
jest.mock('axios');
jest.mock('../utils/logger');
```

### Code Coverage Guidelines

1. **Critical Paths**: 100% coverage for business logic
2. **Error Handling**: Test all error scenarios
3. **Edge Cases**: Test boundary conditions
4. **User Interactions**: Test all user actions

## 🎯 Future Improvements

### Planned Enhancements
- **Visual Regression Testing**: Screenshot comparison
- **Performance Testing**: Load testing for API
- **Accessibility Testing**: Screen reader compatibility
- **Mobile Testing**: Mobile device testing
- **Cross-browser Testing**: Multiple browser support

### Test Automation
- **GitHub Actions**: Automated test runs
- **Test Reports**: Automated reporting
- **Coverage Badges**: Coverage status badges
- **Test Notifications**: Slack/email notifications

## 📚 Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

### Testing Patterns
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Async Testing](https://testing-library.com/docs/dom-testing-library/api-async)
- [Mocking Strategies](https://jestjs.io/docs/mock-functions)

This testing documentation provides a comprehensive guide for maintaining and extending the test suite. Regular updates ensure the testing strategy evolves with the application requirements. 