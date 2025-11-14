// backend-mentores/src/controllers/notificationController.ts
import { Response } from 'express';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

export const getUserNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.user?.userId })
      .populate('relatedSession')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user?.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    res.json({ message: 'Notificación marcada como leída', notification });
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { userId: req.user?.userId, read: false },
      { read: true }
    );

    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error marcando notificaciones como leídas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user?.userId,
      read: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error obteniendo conteo de notificaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};