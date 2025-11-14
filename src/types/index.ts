export interface Notification {
  _id: string;
  type: 'session_confirmed' | 'session_cancelled' | 'session_completed' | 'feedback_received' | 'session_created';
  title: string;
  message: string;
  relatedSession?: string;
  read: boolean;
  createdAt: string;
}

export interface Feedback {
  _id: string;
  sessionId: {
    _id: string;
    topic: string;
    date: string;
  };
  menteeId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  mentorId: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      avatar?: string;
    };
  };
  rating: number;
  comment: string;
  createdAt: string;
}