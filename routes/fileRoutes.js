// routes/fileRoutes.js
import express from 'express';
import {
  createFile,
  updateFile,
  deleteFile,
} from '../controllers/fileController.js';

const router = express.Router();

router.post('/', createFile);
router.put('/:id', updateFile);
router.delete('/:id', deleteFile);

export default router;
