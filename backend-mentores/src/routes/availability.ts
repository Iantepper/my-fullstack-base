import express from 'express';
import { 
  getMyAvailability, 
  updateAvailability, 
  getMentorAvailability 
} from '../controllers/availabilityController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Rutas protegidas
router.use(authenticateToken);

// Obtener y actualizar disponibilidad del mentor actual
router.get('/my-availability', requireRole('mentor'), getMyAvailability);
router.put('/my-availability', requireRole('mentor'), updateAvailability);

// Obtener disponibilidad de un mentor específico (pública para mentees)
router.get('/mentor/:mentorId', getMentorAvailability);

export default router;