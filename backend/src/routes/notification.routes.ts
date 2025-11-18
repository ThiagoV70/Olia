import express from 'express';
import {
  getNotifications,
  markAsRead,
  createNotification,
} from '../controllers/notification.controller';
import { authenticate, requireUserType } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

// Rotas para usuários e escolas
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

// Rotas para governo
router.post('/', requireUserType('GOVERNMENT'), createNotification);

export default router;

