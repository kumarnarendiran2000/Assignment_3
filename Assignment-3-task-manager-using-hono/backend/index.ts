import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { v4 as uuidv4 } from 'uuid'; // Import the UUID function

const app = new Hono();

// Enable CORS
app.use('*', cors());

let tasks = [
  { id: uuidv4(), name: 'Sample Task 1', description: 'This is a sample task', completed: false },
];

// Get all tasks
app.get('/tasks', (c) => c.json(tasks));

// Add a new task
app.post('/tasks', async (c) => {
  const newTask = await c.req.json();
  newTask.id = uuidv4(); // Assign a new UUID to the task
  tasks.push(newTask);
  return c.json(newTask, 201);
});

// Update an existing task
app.put('/tasks/:id', async (c) => {
  const id = c.req.param('id');
  const updatedTask = await c.req.json();
  tasks = tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task));
  return c.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', (c) => {
  const id = c.req.param('id');
  tasks = tasks.filter((task) => task.id !== id);
  return c.json({ message: 'Task deleted' }, 200);
});

// Start the server using Node.js serve function
serve(app);
