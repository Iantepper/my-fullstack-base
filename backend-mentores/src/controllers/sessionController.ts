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

    // ✅ VALIDACIÓN: No agendar en fechas pasadas
    const sessionDate = new Date(date);
    if (sessionDate < new Date()) {
      return res.status(400).json({ message: 'No se pueden agendar sesiones en fechas pasadas' });
    }

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
      date: sessionDate,
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

// Obtener sesiones del usuario (mentee) - CON ORDENAMIENTO INTELIGENTE
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
      .populate('menteeId', 'name email avatar');

    // ✅ ORDENAMIENTO INTELIGENTE:
    // 1. Sesiones futuras (pending/confirmed) primero, ordenadas por fecha más cercana
    // 2. Sesiones pasadas (completed) después, ordenadas por fecha más reciente
    // 3. Sesiones canceladas al final
    const sortedSessions = sessions.sort((a, b) => {
      const now = new Date();
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      
      // Prioridad por estado
      const statusPriority = {
        'pending': 1,
        'confirmed': 2, 
        'completed': 3,
        'cancelled': 4
      };

      // Si tienen diferente estado, ordenar por prioridad de estado
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }

      // Si mismo estado, ordenar por fecha:
      // - Para sesiones futuras (pending/confirmed): más cercanas primero
      // - Para sesiones pasadas (completed/cancelled): más recientes primero
      if (aDate > now && bDate > now) {
        // Ambas futuras: más cercana primero (ascendente)
        return aDate.getTime() - bDate.getTime();
      } else {
        // Ambas pasadas: más reciente primero (descendente)
        return bDate.getTime() - aDate.getTime();
      }
    });

    res.json(sortedSessions);
  } catch (error) {
    console.error('Error obteniendo sesiones del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener sesiones del mentor - CON ORDENAMIENTO INTELIGENTE
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
      .populate('menteeId', 'name email avatar');

    // ✅ ORDENAMIENTO INTELIGENTE (misma lógica que getUserSessions)
    const sortedSessions = sessions.sort((a, b) => {
      const now = new Date();
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      
      const statusPriority = {
        'pending': 1,
        'confirmed': 2,
        'completed': 3,
        'cancelled': 4
      };

      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }

      if (aDate > now && bDate > now) {
        return aDate.getTime() - bDate.getTime();
      } else {
        return bDate.getTime() - aDate.getTime();
      }
    });

    res.json(sortedSessions);
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

    // ✅ VALIDACIÓN: No completar sesiones futuras
    if (status === 'completed' && new Date(session.date) > new Date()) {
      return res.status(400).json({ 
        message: 'No se pueden completar sesiones futuras. La sesión debe haber ocurrido primero.' 
      });
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

// Cancelar sesión
export const cancelSession = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }

    // ✅ VALIDACIÓN: No cancelar sesiones ya completadas
    if (session.status === 'completed') {
      return res.status(400).json({ 
        message: 'No se pueden cancelar sesiones ya completadas' 
      });
    }

    // Verificar permisos (mentor o mentee de la sesión)
    const mentorProfile = await Mentor.findOne({ userId: req.user?.userId });
    
    const isMentor = mentorProfile && session.mentorId.toString() === (mentorProfile._id as mongoose.Types.ObjectId).toString();
    const isMentee = session.menteeId.toString() === req.user?.userId;

    if (!isMentor && !isMentee) {
      return res.status(403).json({ message: 'No tienes permisos para cancelar esta sesión' });
    }

    session.status = 'cancelled';
    await session.save();

    res.json({
      message: 'Sesión cancelada exitosamente',
      session
    });
  } catch (error) {
    console.error('Error cancelando sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};