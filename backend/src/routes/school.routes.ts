import express from 'express';
import {
  getSchoolProfile,
  updateSchoolProfile,
  getSchoolStats,
  getSchoolRanking,
  getAllSchoolsPublic,
} from '../controllers/school.controller';
import { authenticate, requireUserType } from '../middleware/auth.middleware';

const router = express.Router();

// Rota pública para listar escolas (para o mapa)
router.get('/public', getAllSchoolsPublic);

// Rotas autenticadas
router.use(authenticate);
router.use(requireUserType('SCHOOL'));

router.get('/profile', getSchoolProfile);
router.put('/profile', updateSchoolProfile);
router.get('/stats', getSchoolStats);
router.get('/ranking', getSchoolRanking);

export default router;
