import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  mentorId: mongoose.Types.ObjectId;
  menteeId: mongoose.Types.ObjectId;
  date: Date;
  duration: number; // en minutos
  topic: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  price: number;
}

const sessionSchema = new Schema<ISession>({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  menteeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'La fecha es requerida']
  },
  duration: {
    type: Number,
    required: [true, 'La duración es requerida'],
    min: 30,
    max: 240
  },
  topic: {
    type: String,
    required: [true, 'El tema es requerido']
  },
  description: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  meetingLink: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

export default mongoose.model<ISession>('Session', sessionSchema);