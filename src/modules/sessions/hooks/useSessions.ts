import { useState, useEffect } from 'react';
import { sessionService, Session } from '../../../services/sessionService';
import { authService } from '../../../services/authService';

export const useSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const currentUser = authService.getCurrentUser();

  const loadSessions = async () => {
    try {
      setLoading(true);
      let data: Session[];
      
      if (currentUser?.role === 'mentor') {
        data = await sessionService.getMentorSessions();
      } else {
        data = await sessionService.getUserSessions();
      }
      
      setSessions(data);
    } catch (err: unknown) {
      setError('Error al cargar las sesiones');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sessionId: string, newStatus: Session['status']) => {
    try {
      await sessionService.updateSessionStatus(sessionId, newStatus);
      await loadSessions();
      setSuccess('Sesión actualizada correctamente');
    } catch (err: unknown) {
      setError('Error al actualizar la sesión');
      console.error('Error updating session:', err);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await sessionService.cancelSession(sessionId);
      await loadSessions();
      setSuccess('Sesión cancelada correctamente');
    } catch (err: unknown) {
      setError('Error al cancelar la sesión');
      console.error('Error cancelling session:', err);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [currentUser?.role]);

  return {
    sessions,
    loading,
    error,
    success,
    setError,
    setSuccess,
    loadSessions,
    handleStatusUpdate,
    handleCancelSession,
    currentUser
  };
};