import { useState, useEffect } from 'react';
import { feedbackService, Feedback } from '../services/feedbackService';

export const useFeedback = (mentorId: string) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await feedbackService.getMentorFeedback(mentorId);
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (mentorId) {
      fetchFeedbacks();
    }
  }, [mentorId]);

  return { feedbacks, loading };
};