import express from 'express';
import { 
  getAllMentors, 
  getMentorById, 
  createOrUpdateMentorProfile, 
  searchMentors,
  getMyMentorProfile
} from '../controllers/mentorController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// ✅ RUTAS ESPECÍFICAS PRIMERO
router.get('/my-profile', requireRole('mentor'), getMyMentorProfile);
router.get('/search', searchMentors);

// ✅ RUTAS CON PARÁMETROS DESPUÉS
router.get('/:id', getMentorById);

// Obtener todos los mentores
router.get('/', getAllMentors);

// Crear o actualizar perfil de mentor
router.post('/profile', requireRole('mentor'), createOrUpdateMentorProfile);

export default router;