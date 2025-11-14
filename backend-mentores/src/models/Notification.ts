import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'session_confirmed' | 'session_cancelled' | 'session_completed' | 'feedback_received' | 'session_created';
  title: string;
  message: string;
  relatedSession?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedSession: { type: Schema.Types.ObjectId, ref: 'Session' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INotification>('Notification', notificationSchema);