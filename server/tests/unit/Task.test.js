const Task = require('../../src/models/Task');

describe('Task Model', () => {
  describe('Validation', () => {
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
      expect(savedTask.description).toBe(taskData.description);
      expect(savedTask.status).toBe(taskData.status);
      expect(savedTask.priority).toBe(taskData.priority);
      expect(savedTask._id).toBeDefined();
    });

    it('should require title', async () => {
      const taskData = {
        description: 'Test Description',
        status: 'pending',
        priority: 'medium'
      };

      const task = new Task(taskData);
      let error;

      try {
        await task.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.title).toBeDefined();
    });

    it('should validate title length', async () => {
      const longTitle = 'a'.repeat(101);
      const taskData = {
        title: longTitle,
        status: 'pending',
        priority: 'medium'
      };

      const task = new Task(taskData);
      let error;

      try {
        await task.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.title).toBeDefined();
    });

    it('should validate status enum', async () => {
      const taskData = {
        title: 'Test Task',
        status: 'invalid-status',
        priority: 'medium'
      };

      const task = new Task(taskData);
      let error;

      try {
        await task.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.status).toBeDefined();
    });

    it('should validate priority enum', async () => {
      const taskData = {
        title: 'Test Task',
        status: 'pending',
        priority: 'invalid-priority'
      };

      const task = new Task(taskData);
      let error;

      try {
        await task.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.priority).toBeDefined();
    });

    it('should validate due date is not in the past', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const taskData = {
        title: 'Test Task',
        status: 'pending',
        priority: 'medium',
        dueDate: pastDate
      };

      const task = new Task(taskData);
      let error;

      try {
        await task.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.dueDate).toBeDefined();
    });
  });

  describe('Instance Methods', () => {
    it('should mark task as completed', async () => {
      const task = new Task({
        title: 'Test Task',
        status: 'pending',
        priority: 'medium'
      });

      await task.save();
      await task.markAsCompleted();

      expect(task.status).toBe('completed');
      expect(task.completedAt).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      await Task.create([
        { title: 'Task 1', status: 'pending', priority: 'high' },
        { title: 'Task 2', status: 'completed', priority: 'medium' },
        { title: 'Task 3', status: 'pending', priority: 'low' }
      ]);
    });

    it('should find tasks by status', async () => {
      const pendingTasks = await Task.findByStatus('pending');
      const completedTasks = await Task.findByStatus('completed');

      expect(pendingTasks).toHaveLength(2);
      expect(completedTasks).toHaveLength(1);
    });

    it('should find overdue tasks', async () => {
      const overdueDate = new Date();
      overdueDate.setDate(overdueDate.getDate() - 1);

      await Task.create({
        title: 'Overdue Task',
        status: 'pending',
        priority: 'high',
        dueDate: overdueDate
      });

      const overdueTasks = await Task.findOverdue();

      expect(overdueTasks).toHaveLength(1);
      expect(overdueTasks[0].title).toBe('Overdue Task');
    });
  });

  describe('Pre-save Middleware', () => {
    it('should set completedAt when status changes to completed', async () => {
      const task = new Task({
        title: 'Test Task',
        status: 'pending',
        priority: 'medium'
      });

      await task.save();
      
      task.status = 'completed';
      await task.save();

      expect(task.completedAt).toBeDefined();
    });
  });
}); 