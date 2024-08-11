// src/hooks/taskHooks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Task {
  id?: string;
  name: string;
  description: string;
  completed: boolean;
}

// Fetch Tasks Hook
export const useFetchTasks = () => {
  return useQuery<Task[], Error>({
    queryKey: ['tasks'],
    queryFn: async (): Promise<Task[]> => {
      const response = await axios.get<Task[]>('http://localhost:3000/tasks');
      return response.data;
    },
  });
};

// Add Task Hook
export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, Task>({
    mutationFn: async (newTask: Task) => {
      const response = await axios.post<Task>('http://localhost:3000/tasks', newTask);
      return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Update Task Hook
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, Task>({
    mutationFn: async (updatedTask: Task) => {
      const response = await axios.put<Task>(`http://localhost:3000/tasks/${updatedTask.id}`, updatedTask);
      return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Delete Task Hook
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
