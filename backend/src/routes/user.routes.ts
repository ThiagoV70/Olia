import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUserStats,
} from '../controllers/user.controller';
import { authenticate, requireUserType } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);
router.use(requireUserType('USER'));

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/stats', getUserStats);

export default router;

