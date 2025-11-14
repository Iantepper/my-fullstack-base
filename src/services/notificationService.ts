import api from './api';

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  relatedSession?: string;
  createdAt: string;
}

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<Notification[]>('/notifications');
    return response.data;
  },

  async markAsRead(id: string): Promise<{ message: string; notification: Notification }> {
    const response = await api.patch<{ message: string; notification: Notification }>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead(): Promise<{ message: string }> {
    const response = await api.patch<{ message: string }>('/notifications/read-all');
    return response.data;
  },

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  }
};