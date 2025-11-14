// src/components/notifications/NotificationBell.tsx
import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  CircularProgress,
  Box
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { NotificationList } from './NotificationList';
import { useNotifications } from '../../hooks/useNotifications';

export const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {loading ? (
          <Box p={3} display="flex" justifyContent="center">
            <CircularProgress size={24} />
          </Box>
        ) : (
          <NotificationList
            notifications={notifications}
            onMarkAsRead={handleNotificationClick} // ✅ Pasar la nueva función
            onMarkAllAsRead={markAllAsRead}
          />
        )}
      </Popover>
    </>
  );
};