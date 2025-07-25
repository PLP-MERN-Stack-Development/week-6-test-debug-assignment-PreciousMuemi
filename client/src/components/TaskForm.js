import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, updateTask, fetchTask } from '../services/taskService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const { data: task, isLoading: isLoadingTask } = useQuery(
    ['task', id],
    () => fetchTask(id),
    { enabled: isEditing }
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: ''
    }
  });

  // Set form values when editing
  React.useEffect(() => {
    if (task && isEditing) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [task, isEditing, reset]);

  const createMutation = useMutation(createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      navigate('/');
    },
  });

  const updateMutation = useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries(['task', id]);
      navigate(`/tasks/${id}`);
    },
  });

  const onSubmit = (data) => {
    if (isEditing) {
      updateMutation.mutate({ id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditing && isLoadingTask) {
    return <LoadingSpinner />;
  }

  if (isEditing && !task) {
    return <ErrorMessage message="Task not found" />;
  }

  return (
    <div className="task-form">
      <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            {...register('title', { 
              required: 'Title is required',
              maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
            })}
            className={errors.title ? 'form-control error' : 'form-control'}
          />
          {errors.title && <span className="error-message">{errors.title.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register('description', {
              maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
            })}
            className={errors.description ? 'form-control error' : 'form-control'}
            rows="4"
          />
          {errors.description && <span className="error-message">{errors.description.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              {...register('status')}
              className="form-control"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              {...register('priority')}
              className="form-control"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            className="form-control"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 