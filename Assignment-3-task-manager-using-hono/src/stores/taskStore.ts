import { create } from 'zustand';

interface Task {
  id?: string;
  name: string;
  description: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
}));
