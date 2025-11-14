import api from './api';

export interface Session {
  _id: string;
  mentorId: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  menteeId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  date: string;
  duration: number;
  topic: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionData {
  mentorId: string;
  date: string;
  duration: number;
  topic: string;
  description?: string;
}

export const sessionService = {
  async createSession(sessionData: CreateSessionData): Promise<Session> {
    const response = await api.post<Session>('/sessions', sessionData);
    return response.data;
  },

  async getUserSessions(): Promise<Session[]> {
    const response = await api.get<Session[]>('/sessions/my-sessions');
    return response.data;
  },

  async getMentorSessions(): Promise<Session[]> {
    const response = await api.get<Session[]>('/sessions/mentor-sessions');
    return response.data;
  },

  async updateSessionStatus(sessionId: string, status: Session['status']): Promise<Session> {
    const response = await api.patch<Session>(`/sessions/${sessionId}/status`, { status });
    return response.data;
  },

  async cancelSession(sessionId: string): Promise<Session> {
    const response = await api.patch<Session>(`/sessions/${sessionId}/cancel`);
    return response.data;
  }
};