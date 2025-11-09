import api from './api';

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

export interface WeeklySlots {
  [dayOfWeek: string]: { // Cambiar a string
    [timeSlot: string]: TimeSlot;
  };
}

export interface Availability {
  _id: string;
  mentorId: string;
  timeZone: string;
  weeklySlots: WeeklySlots;
  createdAt: string;
  updatedAt: string;
}

export const availabilityService = {
  async getMyAvailability(): Promise<Availability> {
    const response = await api.get<Availability>('/availability/my-availability');
    return response.data;
  },

  async updateAvailability(availabilityData: Partial<Availability>): Promise<{ message: string; availability: Availability }> {
    const response = await api.put<{ message: string; availability: Availability }>(
      '/availability/my-availability',
      availabilityData
    );
    return response.data;
  },

  async getMentorAvailability(mentorId: string): Promise<Availability> {
    const response = await api.get<Availability>(`/availability/mentor/${mentorId}`);
    return response.data;
  }
};