import express from 'express';
import { 
  createSession, 
  getUserSessions, 
  getMentorSessions, 
  updateSessionStatus 
} from '../controllers/sessionController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Crear nueva sesión (solo mentees)
router.post('/', requireRole('mentee'), createSession);

// Obtener sesiones del usuario (mentee)
router.get('/my-sessions', requireRole('mentee'), getUserSessions);

// Obtener sesiones del mentor
router.get('/mentor-sessions', requireRole('mentor'), getMentorSessions);

// Actualizar estado de sesión (solo mentor)
router.patch('/:id/status', requireRole('mentor'), updateSessionStatus);

export default router;