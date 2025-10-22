import express from 'express';
import {
  createProject,
  getProjectsByUser,
  deleteProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createProject);
router.get('/:userId', protect, getProjectsByUser);
router.delete('/:id', protect, deleteProject);

export default router;
