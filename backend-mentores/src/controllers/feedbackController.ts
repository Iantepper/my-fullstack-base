import { Response } from 'express';
import mongoose from 'mongoose';
import Feedback, { IFeedback } from '../models/Feedback';
import Session from '../models/Session';
import Mentor from '../models/Mentor';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';

const createFeedbackNotification = async (feedbackId: string) => {
  try {
    const feedback = await Feedback.findById(feedbackId)
      .populate('sessionId', 'topic')
      .populate('mentorId')
      .populate('menteeId');

    if (!feedback) return;

    const session = feedback.sessionId as unknown as { 
      _id: mongoose.Types.ObjectId; 
      topic: string; 
    };

    const mentor = await Mentor.findById((feedback.mentorId as mongoose.Types.ObjectId));
    if (mentor) {
      await Notification.create({
        userId: mentor.userId,
        type: 'feedback_received',
        title: 'Nueva reseña recibida',
        message: `Has recibido una calificación de ${feedback.rating} estrellas para tu sesión sobre "${session.topic}"`,
        relatedSession: session._id
      });
    }
  } catch (error) {
    console.error('Error creating feedback notification:', error);
  }
};

// Crear feedback para una sesión
export const createFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId, rating, comment } = req.body;

    // Verificar que la sesión existe y está completada
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }

    if (session.status !== 'completed') {
      return res.status(400).json({ message: 'Solo puedes calificar sesiones completadas' });
    }

    // Verificar que el usuario es el mentee de la sesión
    if (session.menteeId.toString() !== req.user?.userId) {
      return res.status(403).json({ message: 'Solo el mentorizado puede calificar la sesión' });
    }

    // Verificar que no existe feedback previo para esta sesión
    const existingFeedback = await Feedback.findOne({ sessionId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Ya has calificado esta sesión' });
    }

    // Crear el feedback
    const feedback = new Feedback({
      sessionId,
      menteeId: req.user?.userId,
      mentorId: session.mentorId,
      rating,
      comment
    })as IFeedback;

    await feedback.save();
    await createFeedbackNotification((feedback._id as mongoose.Types.ObjectId).toString());

    // Actualizar el rating promedio del mentor
    await updateMentorRating(session.mentorId);

    // Populate para enviar datos completos
    const populatedFeedback = await Feedback.findById(feedback._id)
      .populate('menteeId', 'name avatar')
      .populate('mentorId', 'userId')
      .populate({
        path: 'mentorId',
        populate: {
          path: 'userId',
          select: 'name avatar'
        }
      });

    res.status(201).json({
      message: 'Feedback enviado exitosamente',
      feedback: populatedFeedback
    });
  } catch (error) {
    console.error('Error creando feedback:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener feedback de un mentor
export const getMentorFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const { mentorId } = req.params;

    const feedbacks = await Feedback.find({ mentorId })
      .populate('menteeId', 'name avatar')
      .populate('sessionId', 'topic date')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error('Error obteniendo feedback:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener feedback del usuario actual
export const getUserFeedback = async (req: AuthRequest, res: Response) => {
  try {
    const feedbacks = await Feedback.find({ menteeId: req.user?.userId })
      .populate('mentorId', 'userId')
      .populate({
        path: 'mentorId',
        populate: {
          path: 'userId',
          select: 'name avatar'
        }
      })
      .populate('sessionId', 'topic date')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    console.error('Error obteniendo feedback del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener feedback por sessionId
export const getFeedbackBySessionId = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const feedback = await Feedback.findOne({ sessionId })
      .populate('menteeId', 'name avatar')
      .populate('mentorId', 'userId')
      .populate({
        path: 'mentorId',
        populate: {
          path: 'userId',
          select: 'name avatar'
        }
      });

    if (!feedback) {
      return res.status(404).json({ message: 'No se encontró feedback para esta sesión' });
    }

    res.json(feedback);
  } catch (error) {
    console.error('Error obteniendo feedback por session:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Función para actualizar el rating promedio del mentor
const updateMentorRating = async (mentorId: mongoose.Types.ObjectId) => {
  try {
    const feedbacks = await Feedback.find({ mentorId });
    
    if (feedbacks.length === 0) return;

    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    const averageRating = totalRating / feedbacks.length;

    await Mentor.findByIdAndUpdate(mentorId, {
      rating: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
      reviewCount: feedbacks.length
    });
  } catch (error) {
    console.error('Error actualizando rating del mentor:', error);
  }
};