import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import TaskCard from '../../components/TaskCard';

// Mock the date-fns format function
jest.mock('date-fns', () => ({
  format: jest.fn(() => 'Jan 01, 2024')
}));

const mockTask = {
  _id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 'high',
  dueDate: '2024-01-01T00:00:00.000Z',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('TaskCard Component', () => {
  const mockOnDelete = jest.fn();
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task information correctly', () => {
    renderWithRouter(
      <TaskCard 
        task={mockTask} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('Due: Jan 01, 2024')).toBeInTheDocument();
  });

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

  it('calls onDelete when delete button is clicked', () => {
    renderWithRouter(
      <TaskCard 
        task={mockTask} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('disables complete button when task is already completed', () => {
    const completedTask = { ...mockTask, status: 'completed' };
    
    renderWithRouter(
      <TaskCard 
        task={completedTask} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    const completeButton = screen.getByText('✓');
    expect(completeButton).toBeDisabled();
  });

  it('shows checkmark instead of "Complete" text for completed tasks', () => {
    const completedTask = { ...mockTask, status: 'completed' };
    
    renderWithRouter(
      <TaskCard 
        task={completedTask} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.queryByText('Complete')).not.toBeInTheDocument();
  });

  it('applies correct priority class', () => {
    renderWithRouter(
      <TaskCard 
        task={mockTask} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    const priorityBadge = screen.getByText('high');
    expect(priorityBadge).toHaveClass('priority-high');
  });

  it('applies correct status class', () => {
    renderWithRouter(
      <TaskCard 
        task={mockTask} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    const statusBadge = screen.getByText('pending');
    expect(statusBadge).toHaveClass('status-pending');
  });

  it('renders links for view and edit actions', () => {
    renderWithRouter(
      <TaskCard 
        task={mockTask} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('handles task without description', () => {
    const taskWithoutDescription = { ...mockTask, description: '' };
    
    renderWithRouter(
      <TaskCard 
        task={taskWithoutDescription} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('handles task without due date', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: null };
    
    renderWithRouter(
      <TaskCard 
        task={taskWithoutDueDate} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  it('shows overdue indicator for overdue tasks', () => {
    const overdueTask = { 
      ...mockTask, 
      dueDate: '2023-12-01T00:00:00.000Z' // Past date
    };
    
    renderWithRouter(
      <TaskCard 
        task={overdueTask} 
        onDelete={mockOnDelete} 
        onComplete={mockOnComplete} 
      />
    );

    expect(screen.getByText('Overdue!')).toBeInTheDocument();
  });
}); 