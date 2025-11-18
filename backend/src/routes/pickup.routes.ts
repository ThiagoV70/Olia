import express from 'express';
import {
  getPickupLocations,
  requestPickup,
  getUserPickups,
  getAllPickups,
} from '../controllers/pickup.controller';
import { authenticate, requireUserType } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

// Rotas públicas (autenticadas)
router.get('/locations', getPickupLocations);

// Rotas para usuários
router.post('/request', requireUserType('USER'), requestPickup);
router.get('/user', requireUserType('USER'), getUserPickups);

// Rotas para governo
router.get('/all', requireUserType('GOVERNMENT'), getAllPickups);

export default router;

