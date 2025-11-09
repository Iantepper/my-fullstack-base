import mongoose, { Schema, Document } from 'mongoose';

export interface ITimeSlot {
  start: string; // "08:00"
  end: string;   // "09:00" 
  available: boolean;
}

export interface IAvailability extends Document {
  mentorId: mongoose.Types.ObjectId;
  timeZone: string;
  weeklySlots: {
    [dayOfWeek: string]: {
      [timeSlot: string]: ITimeSlot;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const availabilitySchema = new Schema<IAvailability>({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
    unique: true
  },
  timeZone: {
    type: String,
    default: 'America/Argentina/Buenos_Aires'
  },
  weeklySlots: {
    type: Schema.Types.Mixed, // Usar Mixed para objetos complejos
    default: {}
  }
}, {
  timestamps: true
});

export default mongoose.model<IAvailability>('Availability', availabilitySchema);