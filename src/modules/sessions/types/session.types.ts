import { Dayjs } from 'dayjs';

export interface SessionFeedback {
  _id: string;
  rating: number;
  comment: string;
  menteeId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface CalendarSession {
  _id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  topic: string;
}

export interface SelectedDateSessions {
  date: Dayjs;
  sessions: CalendarSession[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'mentor' | 'mentee';
  avatar?: string;
}