import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { Session } from '../../../services/sessionService';
import { SessionActions } from './SessionActions';
import RatingStars from '../../../components/RatingStars';
import { User, SessionFeedback } from '../types/session.types';

interface SessionCardProps {
  session: Session;
  currentUser: User | null;
  sessionFeedbacks: { [sessionId: string]: SessionFeedback };
  onStatusUpdate: (sessionId: string, status: Session['status']) => void;
  onCancelSession: (sessionId: string) => void;
  onOpenFeedback: (session: Session) => void;
  compact?: boolean;
  getStatusText: (status: Session['status']) => string;
  getStatusColor: (status: Session['status']) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  currentUser,
  sessionFeedbacks,
  onStatusUpdate,
  onCancelSession,
  onOpenFeedback,
  getStatusText,
  getStatusColor
}) => {
  const hasFeedback = session.status === 'completed' && sessionFeedbacks[session._id];
  const isWaitingFeedback = session.status === 'completed' && !sessionFeedbacks[session._id] && currentUser?.role === 'mentor';

  return (
    <Card 
      variant="outlined"
      sx={{ 
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 4px 12px rgba(139, 95, 191, 0.1)'
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1} sx={{ minWidth: 0 }}>
            <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                {session.topic}
              </Typography>
              <Chip
                label={getStatusText(session.status)}
                color={getStatusColor(session.status)}
                size="small"
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              👤 {currentUser?.role === 'mentor' ? session.menteeId.name : session.mentorId.userId.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              🕐 {new Date(session.date).toLocaleDateString('es-ES')} • {session.duration}min
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              💰 ${session.price}
            </Typography>

            {/* FEEDBACK RECIBIDO */}
            {hasFeedback && (
              <Box mt={1} p={1.5} sx={{ 
                bgcolor: 'background.default', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <RatingStars 
                    rating={sessionFeedbacks[session._id].rating} 
                    readOnly 
                    size="small" 
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontSize: '0.75rem' }}>
                    por {sessionFeedbacks[session._id].menteeId.name}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {sessionFeedbacks[session._id].comment}
                </Typography>
              </Box>
            )}

            {/* ESPERANDO FEEDBACK */}
            {isWaitingFeedback && (
              <Box mt={1} p={1} sx={{ 
                bgcolor: 'grey.100',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.300'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  ⏳ Esperando calificación de {session.menteeId.name}
                </Typography>
              </Box>
            )}

            {session.description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1, 
                  color: 'text.secondary',
                  fontStyle: 'italic',
                  fontSize: '0.875rem'
                }}
              >
                {session.description.length > 60 
                  ? `${session.description.substring(0, 60)}...` 
                  : session.description
                }
              </Typography>
            )}
          </Box>

          <SessionActions
            session={session}
            currentUser={currentUser}
            sessionFeedbacks={sessionFeedbacks}
            onStatusUpdate={onStatusUpdate}
            onCancelSession={onCancelSession}
            onOpenFeedback={onOpenFeedback}
            compact={true}
          />
        </Box>
      </CardContent>
    </Card>
  );
};