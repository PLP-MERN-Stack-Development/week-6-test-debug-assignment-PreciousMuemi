import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import clsx from 'clsx';

const TaskCard = ({ task, onDelete, onComplete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-in-progress';
      case 'pending': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={clsx('task-card', getStatusColor(task.status))}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button
            onClick={() => onComplete(task._id)}
            disabled={task.status === 'completed'}
            className="btn btn-sm btn-success"
          >
            {task.status === 'completed' ? '✓' : 'Complete'}
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={clsx('priority-badge', getPriorityColor(task.priority))}>
          {task.priority}
        </span>
        <span className={clsx('status-badge', getStatusColor(task.status))}>
          {task.status}
        </span>
      </div>

      {task.dueDate && (
        <div className={clsx('due-date', { 'overdue': isOverdue })}>
          Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
          {isOverdue && <span className="overdue-indicator">Overdue!</span>}
        </div>
      )}

      <div className="task-footer">
        <Link to={`/tasks/${task._id}`} className="btn btn-sm btn-outline">
          View Details
        </Link>
        <Link to={`/tasks/${task._id}/edit`} className="btn btn-sm btn-outline">
          Edit
        </Link>
      </div>
    </div>
  );
};

export default TaskCard; 