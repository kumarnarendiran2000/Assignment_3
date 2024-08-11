import { useEffect } from 'react';
import { useTaskStore } from '../stores/taskStore';
import { Link } from 'react-router-dom';
import { useFetchTasks, useDeleteTask } from '../hooks/taskHooks';

const TaskList = () => {
  const { setTasks } = useTaskStore();
  const { data, error, isLoading } = useFetchTasks();
  const deleteTaskMutation = useDeleteTask();

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data, setTasks]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">Task List</h1>
        <ul>
          {data?.map((task) => (
            <li key={task.id} className="p-4 border rounded mb-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{task.name}</h2>
                  <p>{task.description}</p>
                  <span className={task.completed ? 'text-green-700' : 'text-yellow-600'}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Link to={`/edit/${task.id}`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTaskMutation.mutate(task.id!)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link
          to="/add"
          className="block mt-6 text-center text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Add New Task
        </Link>
      </div>
    </div>
  );
};

export default TaskList;
