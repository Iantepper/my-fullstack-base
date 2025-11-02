import express from 'express';
import { 
  getAllMentors, 
  getMentorById, 
  createOrUpdateMentorProfile, 
  searchMentors 
} from '../controllers/mentorController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();

// Rutas públicas
router.get('/', getAllMentors);
router.get('/search', searchMentors);
router.get('/:id', getMentorById);

// Rutas protegidas
router.use(authenticateToken);
router.post('/profile', requireRole('mentor'), createOrUpdateMentorProfile);

export default router;