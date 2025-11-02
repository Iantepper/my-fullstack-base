import api from './api';

export interface Mentor {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  expertise: string[];
  bio: string;
  experience: string;
  hourlyRate: number;
  availability: string[];
  rating?: number;
  reviewCount: number;
  isAvailable: boolean;
}

export interface MentorProfileData {
  expertise: string[];
  bio: string;
  experience: string;
  hourlyRate: number;
  availability: string[];
}

export const mentorService = {
  async getAllMentors(): Promise<Mentor[]> {
    const response = await api.get<Mentor[]>('/mentors');
    return response.data;
  },

  async getMentorById(id: string): Promise<Mentor> {
    const response = await api.get<Mentor>(`/mentors/${id}`);
    return response.data;
  },

  async searchMentors(expertise?: string, minRate?: number, maxRate?: number): Promise<Mentor[]> {
    interface SearchParams {
      expertise?: string;
      minRate?: number;
      maxRate?: number;
    }

    const params: SearchParams = {};
    if (expertise) params.expertise = expertise;
    if (minRate) params.minRate = minRate;
    if (maxRate) params.maxRate = maxRate;

    const response = await api.get<Mentor[]>('/mentors/search', { params });
    return response.data;
  },

  async createOrUpdateMentorProfile(profileData: MentorProfileData): Promise<Mentor> {
    const response = await api.post<Mentor>('/mentors/profile', profileData);
    return response.data;
  }
};