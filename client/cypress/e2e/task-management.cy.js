describe('Task Management E2E Tests', () => {
  beforeEach(() => {
    // Clean up tasks before each test
    cy.deleteAllTasks();
    cy.visit('/');
  });

  describe('Task List Page', () => {
    it('should display empty state when no tasks exist', () => {
      cy.get('.empty-state').should('be.visible');
      cy.contains('No tasks found. Create your first task!').should('be.visible');
      cy.contains('Create Task').should('be.visible');
    });

    it('should display tasks when they exist', () => {
      cy.createTask({ title: 'Test Task 1' });
      cy.createTask({ title: 'Test Task 2' });
      
      cy.visit('/');
      cy.get('.task-card').should('have.length', 2);
      cy.contains('Test Task 1').should('be.visible');
      cy.contains('Test Task 2').should('be.visible');
    });

    it('should filter tasks by status', () => {
      cy.createTask({ title: 'Pending Task', status: 'pending' });
      cy.createTask({ title: 'Completed Task', status: 'completed' });
      
      cy.visit('/');
      cy.get('.filter-select').select('pending');
      cy.get('.task-card').should('have.length', 1);
      cy.contains('Pending Task').should('be.visible');
      cy.contains('Completed Task').should('not.exist');
    });

    it('should navigate to create task page', () => {
      cy.contains('Add New Task').click();
      cy.url().should('include', '/tasks/new');
      cy.contains('Create New Task').should('be.visible');
    });
  });

  describe('Create Task', () => {
    beforeEach(() => {
      cy.visit('/tasks/new');
    });

    it('should create a new task successfully', () => {
      cy.get('input[name="title"]').type('New Task Title');
      cy.get('textarea[name="description"]').type('New Task Description');
      cy.get('select[name="status"]').select('in-progress');
      cy.get('select[name="priority"]').select('high');
      cy.get('input[name="dueDate"]').type('2024-12-31');
      
      cy.contains('Create Task').click();
      
      // Should redirect to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Should show the new task
      cy.contains('New Task Title').should('be.visible');
      cy.contains('New Task Description').should('be.visible');
    });

    it('should show validation errors for invalid data', () => {
      // Try to submit without title
      cy.contains('Create Task').click();
      
      // Should show error message
      cy.contains('Title is required').should('be.visible');
      
      // Should not redirect
      cy.url().should('include', '/tasks/new');
    });

    it('should cancel and return to home page', () => {
      cy.contains('Cancel').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });

  describe('Task Details', () => {
    beforeEach(() => {
      cy.createTask({
        title: 'Test Task for Details',
        description: 'Test Description for Details',
        status: 'pending',
        priority: 'high'
      }).then((response) => {
        const taskId = response.body.data._id;
        cy.visit(`/tasks/${taskId}`);
      });
    });

    it('should display task details correctly', () => {
      cy.contains('Test Task for Details').should('be.visible');
      cy.contains('Test Description for Details').should('be.visible');
      cy.contains('pending').should('be.visible');
      cy.contains('high').should('be.visible');
    });

    it('should mark task as completed', () => {
      cy.contains('Mark Complete').click();
      cy.contains('Completed').should('be.visible');
      cy.get('button').contains('Mark Complete').should('be.disabled');
    });

    it('should navigate to edit page', () => {
      cy.contains('Edit').click();
      cy.url().should('include', '/edit');
      cy.contains('Edit Task').should('be.visible');
    });

    it('should delete task', () => {
      cy.contains('Delete').click();
      
      // Should show confirmation dialog
      cy.on('window:confirm', () => true);
      
      // Should redirect to home page
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Task should not be visible
      cy.contains('Test Task for Details').should('not.exist');
    });
  });

  describe('Edit Task', () => {
    beforeEach(() => {
      cy.createTask({
        title: 'Task to Edit',
        description: 'Original Description',
        status: 'pending',
        priority: 'medium'
      }).then((response) => {
        const taskId = response.body.data._id;
        cy.visit(`/tasks/${taskId}/edit`);
      });
    });

    it('should load existing task data', () => {
      cy.get('input[name="title"]').should('have.value', 'Task to Edit');
      cy.get('textarea[name="description"]').should('have.value', 'Original Description');
      cy.get('select[name="status"]').should('have.value', 'pending');
      cy.get('select[name="priority"]').should('have.value', 'medium');
    });

    it('should update task successfully', () => {
      cy.get('input[name="title"]').clear().type('Updated Task Title');
      cy.get('textarea[name="description"]').clear().type('Updated Description');
      cy.get('select[name="status"]').select('completed');
      cy.get('select[name="priority"]').select('high');
      
      cy.contains('Update Task').click();
      
      // Should redirect to task details
      cy.url().should('include', '/tasks/');
      cy.contains('Updated Task Title').should('be.visible');
      cy.contains('Updated Description').should('be.visible');
      cy.contains('completed').should('be.visible');
      cy.contains('high').should('be.visible');
    });
  });

  describe('Task Actions', () => {
    beforeEach(() => {
      cy.createTask({ title: 'Task for Actions' });
      cy.visit('/');
    });

    it('should complete task from list', () => {
      cy.get('.task-card').contains('Task for Actions').parent().parent().within(() => {
        cy.contains('Complete').click();
      });
      
      // Should show completed status
      cy.contains('✓').should('be.visible');
    });

    it('should delete task from list', () => {
      cy.get('.task-card').contains('Task for Actions').parent().parent().within(() => {
        cy.contains('Delete').click();
      });
      
      // Should show confirmation dialog
      cy.on('window:confirm', () => true);
      
      // Task should be removed
      cy.contains('Task for Actions').should('not.exist');
    });

    it('should view task details from list', () => {
      cy.get('.task-card').contains('Task for Actions').parent().parent().within(() => {
        cy.contains('View Details').click();
      });
      
      cy.url().should('include', '/tasks/');
      cy.contains('Task for Actions').should('be.visible');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      // Intercept API calls and force them to fail
      cy.intercept('GET', '/api/tasks', { forceNetworkError: true });
      
      cy.visit('/');
      cy.contains('Something went wrong').should('be.visible');
    });

    it('should handle 404 errors', () => {
      cy.visit('/tasks/nonexistent-id');
      cy.contains('Task not found').should('be.visible');
    });
  });

  describe('Navigation', () => {
    it('should navigate between pages using header links', () => {
      cy.contains('Tasks').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      cy.contains('New Task').click();
      cy.url().should('include', '/tasks/new');
      
      cy.contains('Task Manager').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });
}); 