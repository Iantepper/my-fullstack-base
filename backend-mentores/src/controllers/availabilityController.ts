import { Response } from 'express';
import Availability from '../models/Availability';
import Mentor from '../models/Mentor';
import { AuthRequest } from '../middleware/auth';

// Obtener disponibilidad del mentor actual
export const getMyAvailability = async (req: AuthRequest, res: Response) => {
  try {
    // Buscar perfil de mentor del usuario
    const mentorProfile = await Mentor.findOne({ userId: req.user?.userId });
    if (!mentorProfile) {
      return res.status(404).json({ message: 'Perfil de mentor no encontrado' });
    }

    let availability = await Availability.findOne({ mentorId: mentorProfile._id });

    // Si no existe, crear una por defecto
    if (!availability) {
      availability = new Availability({
        mentorId: mentorProfile._id,
        weeklySlots: {}
      });
      await availability.save();
    }

    res.json(availability);
  } catch (error) {
    console.error('Error obteniendo disponibilidad:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar disponibilidad
export const updateAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { timeZone, weeklySlots } = req.body;

    // Buscar perfil de mentor del usuario
    const mentorProfile = await Mentor.findOne({ userId: req.user?.userId });
    if (!mentorProfile) {
      return res.status(404).json({ message: 'Perfil de mentor no encontrado' });
    }

    let availability = await Availability.findOne({ mentorId: mentorProfile._id });

    if (availability) {
      // Actualizar existente
      if (timeZone) availability.timeZone = timeZone;
      if (weeklySlots) availability.weeklySlots = weeklySlots;
      
      await availability.save();
    } else {
      // Crear nueva
      availability = new Availability({
        mentorId: mentorProfile._id,
        timeZone,
        weeklySlots: weeklySlots || {}
      });
      await availability.save();
    }

    const populatedAvailability = await Availability.findById(availability._id)
      .populate('mentorId', 'userId');

    res.json({
      message: 'Disponibilidad actualizada exitosamente',
      availability: populatedAvailability
    });
  } catch (error) {
    console.error('Error actualizando disponibilidad:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener disponibilidad de un mentor específico (para mentees)
export const getMentorAvailability = async (req: AuthRequest, res: Response) => {
  try {
    const { mentorId } = req.params;

    const availability = await Availability.findOne({ mentorId })
      .populate('mentorId', 'userId');

    if (!availability) {
      return res.status(404).json({ message: 'Disponibilidad no encontrada' });
    }

    res.json(availability);
  } catch (error) {
    console.error('Error obteniendo disponibilidad del mentor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};