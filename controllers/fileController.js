import mongoose from 'mongoose';
import File from '../models/File.js';

// Create a file or folder
export const createFile = async (req, res) => {
  try {
    const { projectId, parentId, name, type, content, path } = req.body;

    const file = await File.create({
      projectId,
      parentId: parentId || null,
      name,
      type,
      content: type === 'file' ? content || '' : null,
      path,
    });

    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update file content or name
export const updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content, path } = req.body;

    const file = await File.findByIdAndUpdate(
      id,
      { name, content, path, updatedAt: new Date() },
      { new: true }
    );

    if (!file) return res.status(404).json({ message: 'File not found' });

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete file (and optionally, nested children)
export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Recursive delete if folder
    if (file.type === 'folder') {
      await deleteFolderAndChildren(id);
    } else {
      await file.deleteOne();
    }

    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recursive delete for folders
const deleteFolderAndChildren = async (parentId) => {
  const children = await File.find({ parentId });

  for (const child of children) {
    if (child.type === 'folder') {
      await deleteFolderAndChildren(child._id);
    } else {
      await child.deleteOne();
    }
  }

  await File.findByIdAndDelete(parentId);
};
