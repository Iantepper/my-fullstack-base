// src/components/notifications/NotificationList.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  Divider,
  Paper
} from '@mui/material';
import { NotificationItem } from './NotificationItem';
import { Notification } from '../../services/notificationService';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Paper sx={{ width: 360, maxHeight: 400, overflow: 'auto' }}>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Notificaciones
            {unreadCount > 0 && (
              <Typography component="span" color="primary" fontWeight="bold" ml={1}>
                ({unreadCount})
              </Typography>
            )}
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={onMarkAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </Box>
        <Divider />
      </Box>

      <List sx={{ p: 0 }}>
        {notifications.length === 0 ? (
          <Box p={3} textAlign="center">
            <Typography color="text.secondary">
              No hay notificaciones
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </List>
    </Paper>
  );
};