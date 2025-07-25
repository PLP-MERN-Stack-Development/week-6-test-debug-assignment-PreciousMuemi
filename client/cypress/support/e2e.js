// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for task management
Cypress.Commands.add('createTask', (taskData = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    priority: 'medium',
    ...taskData
  };

  return cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/tasks',
    body: defaultTask,
    failOnStatusCode: false
  });
});

Cypress.Commands.add('deleteAllTasks', () => {
  return cy.request({
    method: 'GET',
    url: 'http://localhost:5000/api/tasks',
    failOnStatusCode: false
  }).then((response) => {
    if (response.body.data && response.body.data.length > 0) {
      const deletePromises = response.body.data.map(task => 
        cy.request({
          method: 'DELETE',
          url: `http://localhost:5000/api/tasks/${task._id}`,
          failOnStatusCode: false
        })
      );
      return Promise.all(deletePromises);
    }
  });
});

Cypress.Commands.add('waitForTaskList', () => {
  return cy.get('[data-testid="task-list"]', { timeout: 10000 });
});

Cypress.Commands.add('getTaskCard', (title) => {
  return cy.contains('.task-card', title);
}); 