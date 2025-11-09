import { useState } from 'react';
import { Session } from '../../../services/sessionService';
import { feedbackService } from '../../../services/feedbackService';
import { SessionFeedback } from '../types/session.types';

export const useSessionFeedback = () => {
  const [sessionFeedbacks, setSessionFeedbacks] = useState<{[sessionId: string]: SessionFeedback}>({});
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState<Session | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const loadSessionFeedback = async (sessionId: string) => {
    try {
      const feedback = await feedbackService.getFeedbackBySession(sessionId);
      setSessionFeedbacks(prev => ({
        ...prev,
        [sessionId]: feedback
      }));
    } catch {
      console.log('No hay feedback para esta sesión:', sessionId);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedSessionForFeedback) return false;

    try {
      setFeedbackLoading(true);
      
      await feedbackService.createFeedback({
        sessionId: selectedSessionForFeedback._id,
        rating: feedbackRating,
        comment: feedbackComment
      });

      await loadSessionFeedback(selectedSessionForFeedback._id);
      
      setFeedbackDialog(false);
      setFeedbackRating(0);
      setFeedbackComment('');
      return true;
    } catch (err: unknown) {
      console.error('Error submitting feedback:', err);
      return false;
    } finally {
      setFeedbackLoading(false);
    }
  };

  const openFeedbackDialog = (session: Session) => {
    setSelectedSessionForFeedback(session);
    setFeedbackDialog(true);
  };

  const closeFeedbackDialog = () => {
    setFeedbackDialog(false);
    setFeedbackRating(0);
    setFeedbackComment('');
  };

  return {
    sessionFeedbacks,
    feedbackDialog,
    selectedSessionForFeedback,
    feedbackRating,
    feedbackComment,
    feedbackLoading,
    setFeedbackRating,
    setFeedbackComment,
    loadSessionFeedback,
    handleSubmitFeedback,
    openFeedbackDialog,
    closeFeedbackDialog
  };
};