import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('❌ MONGO_URI is missing in .env');

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Auto-import all model files
const loadModels = async () => {
  const modelsPath = path.join(__dirname, 'models');
  const files = fs.readdirSync(modelsPath);

  for (const file of files) {
    if (file.endsWith('.js')) {
      const modelPath = path.join(modelsPath, file);
      await import(modelPath); // Dynamically import model
    }
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await loadModels();
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;