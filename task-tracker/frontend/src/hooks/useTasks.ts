import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/task.service.ts';

// Define the shape of a task
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
}

// For creating a new task, some fields are not needed
export type NewTaskData = Omit<Task, 'id' | 'status'>;

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (taskData: NewTaskData) => {
    try {
      await taskService.createTask(taskData);
      await fetchTasks(); // Refetch tasks to show the new one
    } catch (err: any) {
      setError(err.message);
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id: string, taskData: Partial<NewTaskData>) => {
    try {
      await taskService.updateTask(id, taskData);
      await fetchTasks(); // Refetch tasks to show the changes
    } catch (err: any) {
      setError(err.message);
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await fetchTasks(); // Refetch tasks to show the changes
    } catch (err: any) {
      setError(err.message);
    }
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks, createTask, updateTask, deleteTask };
};
