import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch tasks');
  }
};

export const fetchTask = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch task');
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create task');
  }
};

export const updateTask = async ({ id, ...taskData }) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update task');
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to delete task');
  }
};

export const completeTask = async (id) => {
  try {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to complete task');
  }
};

export const fetchTasksByStatus = async (status) => {
  try {
    const response = await api.get(`/tasks/status/${status}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch tasks by status');
  }
};

export const fetchOverdueTasks = async () => {
  try {
    const response = await api.get('/tasks/overdue');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch overdue tasks');
  }
}; 