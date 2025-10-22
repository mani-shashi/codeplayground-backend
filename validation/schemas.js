import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export const createFileSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['file', 'folder']),
  content: z.string().optional(),
  path: z.string().min(1),
});
