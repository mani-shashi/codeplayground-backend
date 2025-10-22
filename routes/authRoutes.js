import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register new user
 * @access Public
 */
router.post('/register', registerUser);

/**
 * @route POST /api/users/login
 * @desc Login user and return JWT token
 * @access Public
 */
router.post('/login', loginUser);

export default router;
