import request from 'supertest';
import express from 'express';
import { connectTestDB, disconnectTestDB, clearDB } from './setup.js';

// Import routes directly
import userRoutes from '../routes/userRoutes.js';
import projectRoutes from '../routes/projectRoutes.js';
import fileRoutes from '../routes/fileRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);

let testUserId = null;
let testProjectId = null;
let testFileId = null;

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await disconnectTestDB();
});

beforeEach(async () => {
  await clearDB();
});

describe('User API', () => {
  test('registers a user', async () => {
    const res = await request(app).post('/api/users/register').send({
      email: 'test@example.com',
      password: 'secret123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('email');
    testUserId = res.body.id;
  });

  test('logs in a user', async () => {
    await request(app).post('/api/users/register').send({
      email: 'test2@example.com',
      password: 'secret123',
    });

    const res = await request(app).post('/api/users/login').send({
      email: 'test2@example.com',
      password: 'secret123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email');
  });
});

describe('Project API', () => {
  beforeEach(async () => {
    const res = await request(app).post('/api/users/register').send({
      email: 'proj@example.com',
      password: 'secret123',
    });

    testUserId = res.body.id;
  });

  test('creates a project', async () => {
    const res = await request(app).post('/api/projects').send({
      userId: testUserId,
      name: 'My Test Project',
      description: 'Hello world',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name');
    testProjectId = res.body._id;
  });

  test('gets all user projects', async () => {
    await request(app).post('/api/projects').send({
      userId: testUserId,
      name: 'Test Project',
    });

    const res = await request(app).get(`/api/projects/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('deletes a project', async () => {
    const project = await request(app).post('/api/projects').send({
      userId: testUserId,
      name: 'Delete Me',
    });

    const res = await request(app).delete(`/api/projects/${project.body._id}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('File API', () => {
  beforeEach(async () => {
    const user = await request(app).post('/api/users/register').send({
      email: 'file@example.com',
      password: 'secret123',
    });

    testUserId = user.body.id;

    const proj = await request(app).post('/api/projects').send({
      userId: testUserId,
      name: 'File Project',
    });

    testProjectId = proj.body._id;
  });

  test('creates a file', async () => {
    const res = await request(app).post('/api/files').send({
      projectId: testProjectId,
      name: 'App.js',
      type: 'file',
      path: 'src/App.js',
      content: "console.log('Hello')",
    });

    expect(res.statusCode).toBe(201);
    testFileId = res.body._id;
  });

  test('updates a file', async () => {
    const file = await request(app).post('/api/files').send({
      projectId: testProjectId,
      name: 'Main.js',
      type: 'file',
      path: 'src/Main.js',
    });

    const res = await request(app).put(`/api/files/${file.body._id}`).send({
      content: 'console.log("updated")',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.content).toContain('updated');
  });

  test('deletes a file', async () => {
    const file = await request(app).post('/api/files').send({
      projectId: testProjectId,
      name: 'ToDelete.js',
      type: 'file',
      path: 'src/ToDelete.js',
    });

    const res = await request(app).delete(`/api/files/${file.body._id}`);
    expect(res.statusCode).toBe(200);
  });
});
