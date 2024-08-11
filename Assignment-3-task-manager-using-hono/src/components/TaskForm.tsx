import React, { useState } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddTask, useUpdateTask } from '../hooks/taskHooks';

interface Task {
  id?: string;
  name: string;
  description: string;
  completed: boolean;
}

const TaskForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks } = useTaskStore();
  const taskToEdit = tasks.find((task) => task.id === id);

  const [task, setTask] = useState<Task>(taskToEdit || { name: '', description: '', completed: false });

  const addTaskMutation = useAddTask();
  const updateTaskMutation = useUpdateTask();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setTask({
        ...task,
        [name]: checked,
      });
    } else {
      setTask({
        ...task,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (task.id) {
      updateTaskMutation.mutate(task);
    } else {
      addTaskMutation.mutate(task);
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6">{task.id ? 'Edit Task' : 'Add New Task'}</h2>
        <div className="mb-4">
          <label className="block mb-2">Task Name</label>
          <input
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter task name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter task description"
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="completed"
            checked={task.completed}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Completed</label>
        </div>
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {task.id ? 'Update Task' : 'Add Task'}
          </button>
          <button type="button" onClick={() => navigate('/')} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
