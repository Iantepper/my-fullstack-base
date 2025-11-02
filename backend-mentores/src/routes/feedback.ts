import express from 'express';
import { 
  createFeedback, 
  getMentorFeedback, 
  getUserFeedback 
} from '../controllers/feedbackController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Crear feedback (solo mentees)
router.post('/', requireRole('mentee'), createFeedback);

// Obtener feedback de un mentor
router.get('/mentor/:mentorId', getMentorFeedback);

// Obtener feedback del usuario actual
router.get('/my-feedback', getUserFeedback);

export default router;