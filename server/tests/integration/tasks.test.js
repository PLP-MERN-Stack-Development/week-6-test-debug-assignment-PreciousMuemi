const request = require('supertest');
const app = require('../../src/index');
const Task = require('../../src/models/Task');

describe('Tasks API', () => {
  beforeEach(async () => {
    await Task.deleteMany({});
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toEqual([]);
    });

    it('should return all tasks', async () => {
      const tasks = [
        { title: 'Task 1', status: 'pending', priority: 'high' },
        { title: 'Task 2', status: 'completed', priority: 'medium' }
      ];

      await Task.create(tasks);

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });

    it('should filter tasks by status', async () => {
      const tasks = [
        { title: 'Task 1', status: 'pending', priority: 'high' },
        { title: 'Task 2', status: 'completed', priority: 'medium' }
      ];

      await Task.create(tasks);

      const response = await request(app)
        .get('/api/tasks?status=pending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].status).toBe('pending');
    });

    it('should filter tasks by priority', async () => {
      const tasks = [
        { title: 'Task 1', status: 'pending', priority: 'high' },
        { title: 'Task 2', status: 'pending', priority: 'medium' }
      ];

      await Task.create(tasks);

      const response = await request(app)
        .get('/api/tasks?priority=high')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].priority).toBe('high');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a single task', async () => {
      const task = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium'
      });

      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Task');
      expect(response.body.data.description).toBe('Test Description');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Task not found');
    });

    it('should return 404 for invalid ObjectId', async () => {
      const response = await request(app)
        .get('/api/tasks/invalid-id')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/tasks', () => {
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
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.status).toBe(taskData.status);
      expect(response.body.data.priority).toBe(taskData.priority);
    });

    it('should return 400 for missing title', async () => {
      const taskData = {
        description: 'New Description',
        status: 'pending',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for invalid status', async () => {
      const taskData = {
        title: 'New Task',
        status: 'invalid-status',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for invalid priority', async () => {
      const taskData = {
        title: 'New Task',
        status: 'pending',
        priority: 'invalid-priority'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const task = await Task.create({
        title: 'Original Task',
        status: 'pending',
        priority: 'medium'
      });

      const updateData = {
        title: 'Updated Task',
        status: 'completed',
        priority: 'high'
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.priority).toBe(updateData.priority);
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = { title: 'Updated Task' };

      const response = await request(app)
        .put(`/api/tasks/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await Task.create({
        title: 'Task to Delete',
        status: 'pending',
        priority: 'medium'
      });

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/tasks/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should mark task as completed', async () => {
      const task = await Task.create({
        title: 'Task to Complete',
        status: 'pending',
        priority: 'medium'
      });

      const response = await request(app)
        .patch(`/api/tasks/${task._id}/complete`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('completed');
      expect(response.body.data.completedAt).toBeDefined();
    });

    it('should return 404 for non-existent task', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .patch(`/api/tasks/${fakeId}/complete`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('GET /api/tasks/status/:status', () => {
    it('should return tasks by status', async () => {
      const tasks = [
        { title: 'Task 1', status: 'pending', priority: 'high' },
        { title: 'Task 2', status: 'completed', priority: 'medium' },
        { title: 'Task 3', status: 'pending', priority: 'low' }
      ];

      await Task.create(tasks);

      const response = await request(app)
        .get('/api/tasks/status/pending')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every(task => task.status === 'pending')).toBe(true);
    });
  });

  describe('GET /api/tasks/overdue', () => {
    it('should return overdue tasks', async () => {
      const overdueDate = new Date();
      overdueDate.setDate(overdueDate.getDate() - 1);

      const tasks = [
        { title: 'Overdue Task', status: 'pending', priority: 'high', dueDate: overdueDate },
        { title: 'Current Task', status: 'pending', priority: 'medium' }
      ];

      await Task.create(tasks);

      const response = await request(app)
        .get('/api/tasks/overdue')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].title).toBe('Overdue Task');
    });
  });
}); 