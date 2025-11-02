import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Mentor from '../models/Mentor'; // ✅ Importar modelo Mentor

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, expertise, bio, experience, hourlyRate, availability } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    // ✅ CREAR PERFIL DE MENTOR AUTOMÁTICAMENTE si el rol es 'mentor'
    if (role === 'mentor') {
      const mentorProfile = new Mentor({
        userId: user._id,
        expertise: expertise || [],
        bio: bio || '',
        experience: experience || '',
        hourlyRate: hourlyRate || 0,
        availability: availability || [],
        rating: 0,
        reviewCount: 0,
        isAvailable: true
      });

      await mentorProfile.save();
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Login de usuario (se mantiene igual)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      return res.status(400).json({ message: 'Usuario desactivado' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;