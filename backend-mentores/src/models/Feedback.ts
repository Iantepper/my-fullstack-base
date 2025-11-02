import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  sessionId: mongoose.Types.ObjectId;
  menteeId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  menteeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'El comentario es requerido'],
    maxlength: 500
  }
}, {
  timestamps: true
});

export default mongoose.model<IFeedback>('Feedback', feedbackSchema);