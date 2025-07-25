import type { Task, NewTaskData } from '../hooks/useTasks';

const API_URL = '/api/tasks'; // Using a relative URL for proxying

const handleUnauthorized = () => {
  localStorage.removeItem('token');
  // Redirect to login with a message. The page will be forced to reload, clearing all state.
  window.location.href = '/login?sessionExpired=true';
};

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_URL, { headers: getAuthHeaders() });
  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
    }
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

const createTask = async (task: NewTaskData): Promise<Task> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
    }
    throw new Error('Failed to create task');
  }
  return response.json();
};

const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
    }
    throw new Error('Failed to update task');
  }
  return response.json();
};

const deleteTask = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized();
    }
    throw new Error('Failed to delete task');
  }
};

export const taskService = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
