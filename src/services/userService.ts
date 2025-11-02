import api from './api';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'mentor' | 'mentee';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  name: string;
  avatar?: string;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const response = await api.get<UserProfile>('/users/profile');
    return response.data;
  },

  async updateProfile(profileData: UpdateProfileData): Promise<{ message: string; user: UserProfile }> {
    const response = await api.put<{ message: string; user: UserProfile }>('/users/profile', profileData);
    return response.data;
  }
};