import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { deleteTask, completeTask, fetchTasks } from '../services/taskService';
import TaskCard from './TaskCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const TaskList = () => {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery('tasks', fetchTasks);

  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });

  const completeMutation = useMutation(completeTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleComplete = (id) => {
    completeMutation.mutate(id);
  };

  const filteredTasks = tasks?.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  }) || [];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>My Tasks</h2>
        <Link to="/tasks/new" className="btn btn-primary">
          Add New Task
        </Link>
      </div>

      <div className="filter-section">
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks found. Create your first task!</p>
          <Link to="/tasks/new" className="btn btn-primary">
            Create Task
          </Link>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 