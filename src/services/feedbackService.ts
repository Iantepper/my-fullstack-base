import api from './api';

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

export interface CreateFeedbackData {
  sessionId: string;
  rating: number;
  comment: string;
}

export const feedbackService = {
  async createFeedback(feedbackData: CreateFeedbackData): Promise<{ message: string; feedback: Feedback }> {
    const response = await api.post<{ message: string; feedback: Feedback }>('/feedback', feedbackData);
    return response.data;
  },

  async getMentorFeedback(mentorId: string): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>(`/feedback/mentor/${mentorId}`);
    return response.data;
  },

  async getUserFeedback(): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>('/feedback/my-feedback');
    return response.data;
  }
};