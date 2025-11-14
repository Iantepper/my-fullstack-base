// backend-mentores/src/routes/notifications.ts
import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getUserNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.patch('/:id/read', authenticateToken, markAsRead);
router.patch('/read-all', authenticateToken, markAllAsRead);

export default router;