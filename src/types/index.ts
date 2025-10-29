export type Role = "mentor" | "mentee";

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
}

export interface Mentor {
  id: string;
  name: string;
  expertise: string;
  bio?: string;
}

export interface Session {
  id: string;
  mentorId: string;
  menteeId?: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
}
