import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import fileUpload from 'express-fileupload'; // for multipart uploads

import connectDB from './db.js';

import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL encoded bodies
app.use(fileUpload()); // enable file uploads (for multipart/form-data)
app.use(morgan('dev')); // logging

// Routes
app.use('/api/users', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('React Coding Playground Backend API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
