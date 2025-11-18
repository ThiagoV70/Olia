import express from 'express';
import {
  getGlobalStats,
  getTopSchools,
  getAllSchools,
} from '../controllers/government.controller';
import { authenticate, requireUserType } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);
router.use(requireUserType('GOVERNMENT'));

router.get('/stats', getGlobalStats);
router.get('/schools/top', getTopSchools);
router.get('/schools', getAllSchools);

export default router;

