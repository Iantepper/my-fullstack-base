import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Schedule } from '@mui/icons-material';
import { Session } from '../../../services/sessionService';
import { SessionCard } from './SessionCard';
import { User, SessionFeedback } from '../types/session.types'; // ✅ Importar SessionFeedback

interface SessionListProps {
  sessions: Session[];
  currentUser: User | null;
  sessionFeedbacks: { [sessionId: string]: SessionFeedback }; // ✅ Corregido: SessionFeedback en lugar de any
  onStatusUpdate: (sessionId: string, status: Session['status']) => void;
  onCancelSession: (sessionId: string) => void;
  onOpenFeedback: (session: Session) => void;
  compact?: boolean;
  getStatusText: (status: Session['status']) => string;
  getStatusColor: (status: Session['status']) => "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

export const SessionList: React.FC<SessionListProps> = ({
  sessions,
  currentUser,
  sessionFeedbacks,
  onStatusUpdate,
  onCancelSession,
  onOpenFeedback,
  compact = false,
  getStatusText,
  getStatusColor
}) => {
  if (sessions.length === 0) {
    return (
      <Card variant={compact ? "outlined" : "elevation"}>
        <CardContent sx={{ textAlign: 'center', py: compact ? 4 : 6 }}>
          <Schedule sx={{ fontSize: compact ? 48 : 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes sesiones programadas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.role === 'mentor' 
              ? 'Cuando los mentorizados agenden sesiones, aparecerán aquí.'
              : 'Agenda tu primera sesión con un mentor para comenzar.'
            }
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={compact ? 2 : 3}>
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          currentUser={currentUser}
          sessionFeedbacks={sessionFeedbacks}
          onStatusUpdate={onStatusUpdate}
          onCancelSession={onCancelSession}
          onOpenFeedback={onOpenFeedback}
          compact={compact}
          getStatusText={getStatusText}
          getStatusColor={getStatusColor}
        />
      ))}
    </Box>
  );
};