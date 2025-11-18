import express from 'express';
import {
  registerUser,
  registerSchool,
  login,
  getMe,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register/user', registerUser);
router.post('/register/school', registerSchool);
router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;

