import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchTask, deleteTask, completeTask } from '../services/taskService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: task, isLoading, error } = useQuery(['task', id], () => fetchTask(id));

  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      navigate('/');
    },
  });

  const completeMutation = useMutation(completeTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(['task', id]);
      queryClient.invalidateQueries('tasks');
    },
  });

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleComplete = () => {
    completeMutation.mutate(id);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!task) return <ErrorMessage message="Task not found" />;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="task-detail">
      <div className="task-detail-header">
        <h2>{task.title}</h2>
        <div className="task-actions">
          <button
            onClick={handleComplete}
            disabled={task.status === 'completed'}
            className="btn btn-success"
          >
            {task.status === 'completed' ? 'Completed' : 'Mark Complete'}
          </button>
          <Link to={`/tasks/${id}/edit`} className="btn btn-primary">
            Edit
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      <div className="task-detail-content">
        {task.description && (
          <div className="task-section">
            <h3>Description</h3>
            <p>{task.description}</p>
          </div>
        )}

        <div className="task-section">
          <h3>Details</h3>
          <div className="task-info">
            <div className="info-item">
              <strong>Status:</strong>
              <span className={`status-badge status-${task.status}`}>
                {task.status}
              </span>
            </div>
            <div className="info-item">
              <strong>Priority:</strong>
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
            </div>
            {task.dueDate && (
              <div className="info-item">
                <strong>Due Date:</strong>
                <span className={isOverdue ? 'overdue' : ''}>
                  {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
                  {isOverdue && <span className="overdue-indicator"> (Overdue!)</span>}
                </span>
              </div>
            )}
            {task.completedAt && (
              <div className="info-item">
                <strong>Completed:</strong>
                <span>{format(new Date(task.completedAt), 'MMMM dd, yyyy')}</span>
              </div>
            )}
            <div className="info-item">
              <strong>Created:</strong>
              <span>{format(new Date(task.createdAt), 'MMMM dd, yyyy')}</span>
            </div>
            <div className="info-item">
              <strong>Last Updated:</strong>
              <span>{format(new Date(task.updatedAt), 'MMMM dd, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="task-detail-footer">
        <Link to="/" className="btn btn-secondary">
          Back to Tasks
        </Link>
      </div>
    </div>
  );
};

export default TaskDetail; 