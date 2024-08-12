import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { v4 as uuidv4 } from 'uuid';
import sql from 'mssql';

const app = new Hono();

// Enable CORS
app.use('*', cors());

// SQL Server Configuration
const sqlConfig = {
    user: 'your-username',
    password: 'your-password',
    database: 'TaskManagerDB',
    server: 'localhost',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: true, // for Azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

// Helper function to connect and execute queries
async function executeQuery(query: string, params: any[] = []) {
    let pool = await sql.connect(sqlConfig);
    let request = pool.request();

    params.forEach((param, index) => {
        request.input(`param${index}`, param);
    });

    return request.query(query);
}

// Get all tasks
app.get('/tasks', async (c) => {
    const result = await executeQuery('SELECT * FROM Tasks');
    return c.json(result.recordset);
});

// Add a new task
app.post('/tasks', async (c) => {
    const newTask = await c.req.json();
    const taskId = uuidv4();

    await executeQuery(
        'INSERT INTO Tasks (id, name, description, completed) VALUES (@param0, @param1, @param2, @param3)',
        [taskId, newTask.name, newTask.description, newTask.completed]
    );

    return c.json({ ...newTask, id: taskId }, 201);
});

// Update an existing task
app.put('/tasks/:id', async (c) => {
    const id = c.req.param('id');
    const updatedTask = await c.req.json();

    await executeQuery(
        'UPDATE Tasks SET name = @param0, description = @param1, completed = @param2 WHERE id = @param3',
        [updatedTask.name, updatedTask.description, updatedTask.completed, id]
    );

    return c.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', async (c) => {
    const id = c.req.param('id');

    await executeQuery('DELETE FROM Tasks WHERE id = @param0', [id]);

    return c.json({ message: 'Task deleted' }, 200);
});

// Start the server using Node.js serve function
serve(app);
