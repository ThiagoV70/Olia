import express from 'express';
import {
  createDonation,
  getUserDonations,
  confirmDonation,
  getSchoolDonations,
} from '../controllers/donation.controller';
import { authenticate, requireUserType } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

// Rotas para usuários
router.post('/', requireUserType('USER'), createDonation);
router.get('/user', requireUserType('USER'), getUserDonations);

// Rotas para escolas
router.get('/school', requireUserType('SCHOOL'), getSchoolDonations);
router.patch('/:id/confirm', requireUserType('SCHOOL'), confirmDonation);

export default router;

