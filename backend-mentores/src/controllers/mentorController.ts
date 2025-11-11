import { Response } from 'express';
import Mentor from '../models/Mentor';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Obtener todos los mentores
export const getAllMentors = async (req: AuthRequest, res: Response) => {
  try {
    const mentors = await Mentor.find()
      .populate('userId', 'name email avatar')
      .select('-__v');

    // ✅ AGREGAR: Convertir a objetos planos y agregar availability vacío
    const mentorsWithCompatibility = mentors.map(mentor => ({
      ...mentor.toObject(),
      availability: [] // Array vacío para compatibilidad con frontend
    }));

    res.json(mentorsWithCompatibility);
  } catch (error) {
    console.error('Error obteniendo mentores:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener mentor por ID
export const getMentorById = async (req: AuthRequest, res: Response) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('userId', 'name email avatar')
      .select('-__v');

    if (!mentor) {
      return res.status(404).json({ message: 'Mentor no encontrado' });
    }

    // ✅ AGREGAR: Convertir a objeto plano y agregar availability vacío
    const mentorWithCompatibility = {
      ...mentor.toObject(),
      availability: [] // Array vacío para compatibilidad con frontend
    };

    res.json(mentorWithCompatibility);
  } catch (error) {
    console.error('Error obteniendo mentor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear o actualizar perfil de mentor
export const createOrUpdateMentorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { expertise, bio, experience, hourlyRate } = req.body;

    // Verificar que el usuario existe y es un mentor
    const user = await User.findById(req.user?.userId);
    if (!user || user.role !== 'mentor') {
      return res.status(403).json({ message: 'Solo los mentores pueden crear perfiles' });
    }

    // Buscar si ya existe un perfil de mentor
    let mentor = await Mentor.findOne({ userId: req.user?.userId });

    if (mentor) {
      // Actualizar perfil existente
      mentor = await Mentor.findByIdAndUpdate(
        mentor._id,
        { expertise, bio, experience, hourlyRate },
        { new: true, runValidators: true }
      ).populate('userId', 'name email avatar');
    } else {
      // Crear nuevo perfil
      mentor = new Mentor({
        userId: req.user?.userId,
        expertise,
        bio,
        experience,
        hourlyRate
      });
      await mentor.save();
      mentor = await mentor.populate('userId', 'name email avatar');
    }

    // ✅ VERIFICACIÓN EXPLÍCITA: Asegurar que mentor no es null
    if (!mentor) {
      return res.status(500).json({ message: 'Error al guardar el perfil de mentor' });
    }

    // ✅ AGREGAR: Convertir a objeto plano y agregar availability vacío
    const mentorWithCompatibility = {
      ...mentor.toObject(),
      availability: [] // Array vacío para compatibilidad
    };

    res.status(200).json({
      message: 'Perfil de mentor guardado exitosamente',
      mentor: mentorWithCompatibility
    });
  } catch (error) {
    console.error('Error creando/actualizando perfil de mentor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Buscar mentores por expertise
export const searchMentors = async (req: AuthRequest, res: Response) => {
  try {
    const { expertise, minRate, maxRate } = req.query;

    // Crear filtro base sin tipo explícito
    const filter: { 
      isAvailable: boolean; 
      expertise?: { $in: RegExp[] }; 
      hourlyRate?: { $gte?: number; $lte?: number } 
    } = { isAvailable: true };

    if (expertise) {
      filter.expertise = { $in: [new RegExp(expertise as string, 'i')] };
    }

    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = Number(minRate);
      if (maxRate) filter.hourlyRate.$lte = Number(maxRate);
    }

    const mentors = await Mentor.find(filter)
      .populate('userId', 'name email avatar')
      .select('-__v')
      .sort({ rating: -1 });

    // ✅ AGREGAR: Convertir a objetos planos y agregar availability vacío
    const mentorsWithCompatibility = mentors.map(mentor => ({
      ...mentor.toObject(),
      availability: [] // Array vacío para compatibilidad con frontend
    }));

    res.json(mentorsWithCompatibility);
  } catch (error) {
    console.error('Error buscando mentores:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};