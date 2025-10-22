import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true,
  },
  content: {
    type: String, // For files only
    default: '',
  },
  path: {
    type: String,
    required: true, // e.g., "src/App.js"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

File = mongoose.model('File', fileSchema);
export default File;
