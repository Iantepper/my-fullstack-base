import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Obtener perfil del usuario actual
router.get('/profile', getProfile);

// Actualizar perfil
router.put('/profile', updateProfile);

export default router;