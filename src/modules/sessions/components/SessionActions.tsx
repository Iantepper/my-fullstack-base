import React from 'react';
import { Button, Box } from '@mui/material';
import { VideoCall, CheckCircle, Cancel, Star } from '@mui/icons-material';
import { Session } from '../../../services/sessionService';
import { User, SessionFeedback } from '../types/session.types';

interface SessionActionsProps {
  session: Session;
  currentUser: User | null;
  sessionFeedbacks: { [sessionId: string]: SessionFeedback }; // ✅ Corregido: SessionFeedback en lugar de any
  onStatusUpdate: (sessionId: string, status: Session['status']) => void;
  onCancelSession: (sessionId: string) => void;
  onOpenFeedback: (session: Session) => void;
  compact?: boolean;
}

export const SessionActions: React.FC<SessionActionsProps> = ({
  session,
  currentUser,
  sessionFeedbacks,
  onStatusUpdate,
  onCancelSession,
  onOpenFeedback,
  compact = false
}) => {
  const buttonSize = compact ? 'small' : 'medium';
  
  // ✅ VALIDACIÓN: No completar sesiones futuras
  const isFutureSession = new Date(session.date) > new Date();

  return (
    <Box display="flex" flexDirection="column" gap={1} sx={{ ml: compact ? 2 : 0, flexShrink: 0 }}>
      {session.meetingLink && session.status === 'confirmed' && (
        <Button 
          size={buttonSize}
          variant="contained"
          startIcon={<VideoCall />} 
          href={session.meetingLink} 
          target="_blank"
          sx={{ minWidth: 'auto' }}
        >
          {compact ? 'Unirse' : 'Unirse a la Sesión'}
        </Button>
      )}
      
      {/* ✅ BOTÓN COMPLETAR: Solo habilitado para sesiones pasadas */}
      {session.status === 'confirmed' && (
        <Button 
          size={buttonSize}
          variant="outlined"
          color="primary"
          startIcon={<CheckCircle />} 
          onClick={() => onStatusUpdate(session._id, 'completed')}
          disabled={isFutureSession} // ✅ Deshabilitado para sesiones futuras
          sx={{ minWidth: 'auto' }}
        >
          {compact ? 'Completar' : 'Completar Sesión'}
        </Button>
      )}
      
      {currentUser?.role === 'mentor' && session.status === 'pending' && (
        <Button 
          size={buttonSize}
          variant="outlined"
          color="success"
          startIcon={<CheckCircle />} 
          onClick={() => onStatusUpdate(session._id, 'confirmed')}
          sx={{ minWidth: 'auto' }}
        >
          Confirmar
        </Button>
      )}
      
      {(session.status === 'pending' || session.status === 'confirmed') && (
        <Button 
          size={buttonSize}
          variant="outlined"
          color="error"
          startIcon={<Cancel />} 
          onClick={() => onCancelSession(session._id)}
          sx={{ minWidth: 'auto' }}
        >
          {session.status === 'pending' ? 'Cancelar' : 'Rechazar'}
        </Button>
      )}

      {session.status === 'completed' && currentUser?.role === 'mentee' && !sessionFeedbacks[session._id] && (
        <Button 
          size={buttonSize}
          variant="outlined"
          color="primary"
          startIcon={<Star />} 
          onClick={() => onOpenFeedback(session)}
          sx={{ minWidth: 'auto' }}
        >
          {compact ? 'Calificar' : 'Calificar Sesión'}
        </Button>
      )}
    </Box>
  );
};