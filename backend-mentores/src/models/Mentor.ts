import mongoose, { Schema, Document } from 'mongoose';

export interface IMentor extends Document {
  userId: mongoose.Types.ObjectId;
  expertise: string[];
  bio: string;
  experience: string;
  hourlyRate: number;
  rating?: number;
  reviewCount: number;
  isAvailable: boolean;
}

const mentorSchema = new Schema<IMentor>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  expertise: [{
    type: String,
    required: true
  }],
  bio: {
    type: String,
    required: [true, 'La biografía es requerida'],
    maxlength: 500
  },
  experience: {
    type: String,
    required: [true, 'La experiencia es requerida']
  },
  hourlyRate: {
    type: Number,
    required: [true, 'La tarifa horaria es requerida'],
    min: 0
  },

  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IMentor>('Mentor', mentorSchema);