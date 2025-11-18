import express from 'express';
import {
  getRewards,
  requestReward,
  getSchoolRewardRequests,
  getAllRewardRequests,
  approveRewardRequest,
  denyRewardRequest,
} from '../controllers/reward.controller';
import { authenticate, requireUserType } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

// Rotas públicas (autenticadas)
router.get('/', getRewards);

// Rotas para escolas
router.post('/request', requireUserType('SCHOOL'), requestReward);
router.get('/school/requests', requireUserType('SCHOOL'), getSchoolRewardRequests);

// Rotas para governo
router.get('/requests', requireUserType('GOVERNMENT'), getAllRewardRequests);
router.patch('/requests/:id/approve', requireUserType('GOVERNMENT'), approveRewardRequest);
router.patch('/requests/:id/deny', requireUserType('GOVERNMENT'), denyRewardRequest);

export default router;

