import express from 'express';
import {
  requestCollection,
  getSchoolCollections,
  getAllCollections,
  scheduleCollection,
  completeCollection,
} from '../controllers/collection.controller';
import { authenticate, requireUserType } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

// Rotas para escolas
router.post('/', requireUserType('SCHOOL'), requestCollection);
router.get('/school', requireUserType('SCHOOL'), getSchoolCollections);

// Rotas para governo
router.get('/all', requireUserType('GOVERNMENT'), getAllCollections);
router.patch('/:id/schedule', requireUserType('GOVERNMENT'), scheduleCollection);
router.patch('/:id/complete', requireUserType('GOVERNMENT'), completeCollection);

export default router;

