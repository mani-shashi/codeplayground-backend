import mongoose from 'mongoose';

import File from '../models/File.js';
import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  try {
    const { userId, name, description } = req.body;

    const project = await Project.create({
      userId,
      name,
      description,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const projects = await Project.find({ userId });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await File.deleteMany({ projectId: id });
    await project.deleteOne();

    res.json({ message: 'Project and files deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
