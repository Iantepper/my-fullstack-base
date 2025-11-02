import { Response } from 'express';
import Session from '../models/Session';
import Mentor from '../models/Mentor';
import mongoose from 'mongoose';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Crear nueva sesión
export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const { mentorId, date, duration, topic, description } = req.body;

    // Verificar que el mentor existe
    const mentor = await Mentor.findById(mentorId).populate('userId');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor no encontrado' });
    }

    // Verificar que el usuario es un mentee
    const user = await User.findById(req.user?.userId);
    if (!user || user.role !== 'mentee') {
      return res.status(403).json({ message: 'Solo los mentorizados pueden agendar sesiones' });
    }

    // Calcular precio basado en tarifa horaria del mentor
    const price = mentor.hourlyRate * (duration / 60);

    const session = new Session({
      mentorId,
      menteeId: req.user?.userId,
      date: new Date(date),
      duration,
      topic,
      description,
      price,
      status: 'pending'
    });

    await session.save();

    // Populate para enviar datos completos
    const populatedSession = await Session.findById(session._id)
      .populate('mentorId', 'userId hourlyRate')
      .populate('menteeId', 'name email avatar');

    res.status(201).json({
      message: 'Sesión agendada exitosamente',
      session: populatedSession
    });
  } catch (error) {
    console.error('Error creando sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener sesiones del usuario (mentee)
export const getUserSessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await Session.find({ menteeId: req.user?.userId })
      .populate({
        path: 'mentorId',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      })
      .populate('menteeId', 'name email avatar')
      .sort({ date: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Error obteniendo sesiones del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener sesiones del mentor
export const getMentorSessions = async (req: AuthRequest, res: Response) => {
  try {
    // Encontrar el perfil de mentor del usuario
    const mentorProfile = await Mentor.findOne({ userId: req.user?.userId });
    if (!mentorProfile) {
      return res.status(404).json({ message: 'Perfil de mentor no encontrado' });
    }

    const sessions = await Session.find({ mentorId: mentorProfile._id })
      .populate({
        path: 'mentorId',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      })
      .populate('menteeId', 'name email avatar')
      .sort({ date: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Error obteniendo sesiones del mentor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar estado de sesión
export const updateSessionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }

    // Verificar permisos (solo el mentor puede confirmar/rechazar)
    const mentorProfile = await Mentor.findOne({ userId: req.user?.userId });
    if (!mentorProfile || session.mentorId.toString() !== (mentorProfile._id as mongoose.Types.ObjectId).toString()) {
      return res.status(403).json({ message: 'No tienes permisos para modificar esta sesión' });
    }

    session.status = status;
    
    // Si se confirma, generar link de meeting (simulado)
    if (status === 'confirmed') {
      session.meetingLink = `https://meet.jit.si/mentores-${session._id}`;
    }

    await session.save();

    const populatedSession = await Session.findById(session._id)
      .populate({
        path: 'mentorId',
        populate: {
          path: 'userId',
          select: 'name email avatar'
        }
      })
      .populate('menteeId', 'name email avatar');

    res.json({
      message: `Sesión ${status === 'confirmed' ? 'confirmada' : 'actualizada'} exitosamente`,
      session: populatedSession
    });
  } catch (error) {
    console.error('Error actualizando sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};