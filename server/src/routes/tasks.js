const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateTask = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
];

// Get all tasks
router.get('/', asyncHandler(async (req, res) => {
  const { status, priority, sort = 'createdAt', order = 'desc' } = req.query;
  
  let query = {};
  
  if (status) {
    query.status = status;
  }
  
  if (priority) {
    query.priority = priority;
  }
  
  const sortOptions = {};
  sortOptions[sort] = order === 'desc' ? -1 : 1;
  
  const tasks = await Task.find(query).sort(sortOptions);
  
  logger.info(`Retrieved ${tasks.length} tasks`);
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
}));

// Get single task
router.get('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  res.json({
    success: true,
    data: task
  });
}));

// Create new task
router.post('/', validateTask, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const task = await Task.create(req.body);
  
  logger.info(`Created new task: ${task.title}`);
  res.status(201).json({
    success: true,
    data: task
  });
}));

// Update task
router.put('/:id', validateTask, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  logger.info(`Updated task: ${task.title}`);
  res.json({
    success: true,
    data: task
  });
}));

// Delete task
router.delete('/:id', asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  logger.info(`Deleted task: ${task.title}`);
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
}));

// Mark task as completed
router.patch('/:id/complete', asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'Task not found'
    });
  }
  
  await task.markAsCompleted();
  
  logger.info(`Marked task as completed: ${task.title}`);
  res.json({
    success: true,
    data: task
  });
}));

// Get tasks by status
router.get('/status/:status', asyncHandler(async (req, res) => {
  const { status } = req.params;
  const tasks = await Task.findByStatus(status);
  
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
}));

// Get overdue tasks
router.get('/overdue', asyncHandler(async (req, res) => {
  const tasks = await Task.findOverdue();
  
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
}));

module.exports = router; 