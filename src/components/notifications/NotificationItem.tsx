// src/components/notifications/NotificationItem.tsx
import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import {
  CheckCircle as ConfirmedIcon,
  Cancel as CancelledIcon,
  Done as CompletedIcon,
  Star as FeedbackIcon,
  Schedule as CreatedIcon,
  MarkEmailRead as ReadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // ✅ AGREGAR
import { Notification } from '../../services/notificationService';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'session_confirmed': return <ConfirmedIcon color="success" />;
    case 'session_cancelled': return <CancelledIcon color="error" />;
    case 'session_completed': return <CompletedIcon color="primary" />;
    case 'feedback_received': return <FeedbackIcon color="warning" />;
    case 'session_created': return <CreatedIcon color="info" />;
    default: return <CreatedIcon />;
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead
}) => {
  const navigate = useNavigate(); // ✅ AGREGAR

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNotificationClick = () => {
    // ✅ Marcar como leída al hacer click
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
    // ✅ Navegar a agenda
    navigate('/sessions');
  };

  return (
    <ListItem
      sx={{
        backgroundColor: notification.read ? 'transparent' : 'action.hover',
        borderLeft: notification.read ? 'none' : '4px solid',
        borderLeftColor: `${getNotificationColor(notification.type)}.main`,
        mb: 1,
        cursor: 'pointer', // ✅ Cambiar cursor para indicar que es clickeable
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }}
      onClick={handleNotificationClick} // ✅ AGREGAR onClick
    >
      <ListItemIcon>
        {getNotificationIcon(notification.type)}
      </ListItemIcon>
      <ListItemText
        primary={
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="subtitle1" fontWeight={notification.read ? 'normal' : 'bold'}>
              {notification.title}
            </Typography>
            <Chip
              label={formatTime(notification.createdAt)}
              size="small"
              variant="outlined"
            />
          </Box>
        }
        secondary={
          <Typography variant="body2" color="text.secondary">
            {notification.message}
          </Typography>
        }
      />
      {!notification.read && (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // ✅ Evitar que el click del botón navegue
            onMarkAsRead(notification._id);
          }}
          title="Marcar como leída"
        >
          <ReadIcon />
        </IconButton>
      )}
    </ListItem>
  );
};

// ✅ AGREGAR función getNotificationColor que falta
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'session_confirmed': return 'success';
    case 'session_cancelled': return 'error';
    case 'session_completed': return 'primary';
    case 'feedback_received': return 'warning';
    case 'session_created': return 'info';
    default: return 'default';
  }
};