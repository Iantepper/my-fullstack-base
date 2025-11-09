import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { useSessions } from './hooks/useSessions';
import { useSessionFeedback } from './hooks/useSessionFeedback';
import { SessionList } from './components/SessionList';
import { SessionCalendar } from './components/SessionCalendar';
import { SessionFeedback } from './components/SessionFeedback';
import { SelectedDateSessions, CalendarSession, User } from './types/session.types';
import { Dayjs } from 'dayjs';
import { Session } from '../../services/sessionService';

export default function SessionsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDateSessions, setSelectedDateSessions] = useState<SelectedDateSessions | null>(null);
  
  const navigate = useNavigate();
  
  const {
    sessions,
    loading,
    error,
    success,
    setError,
    setSuccess,
    handleStatusUpdate,
    handleCancelSession,
    currentUser
  } = useSessions();

  const {
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
  } = useSessionFeedback();

  // Cargar feedbacks para sesiones completadas
  useEffect(() => {
    const loadFeedbacks = async () => {
      const feedbackPromises = sessions
        .filter(session => session.status === 'completed' && !sessionFeedbacks[session._id])
        .map(session => loadSessionFeedback(session._id));

      await Promise.all(feedbackPromises);
    };

    if (sessions.length > 0) {
      loadFeedbacks();
    }
  }, [sessions]);

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: Session['status']) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const handleDateClick = (date: Dayjs, sessions: CalendarSession[]) => {
    if (sessions.length > 0) {
      setSelectedDateSessions({ date, sessions });
    }
  };

  const handleCloseDateModal = () => {
    setSelectedDateSessions(null);
  };

  const handleFeedbackSubmit = async () => {
    const success = await handleSubmitFeedback();
    if (success) {
      setSuccess('¡Feedback enviado exitosamente!');
    } else {
      setError('Error al enviar el feedback');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Mis Sesiones
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Gestiona tus mentorías programadas
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/mentors')}
          >
            Nueva Sesión
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Vista Única: Lista Compacta + Calendario */}
      <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
        {/* Lista Compacta - TODAS las sesiones incluyendo canceladas */}
        <Box flex={{ md: 0.6 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            📅 Tus Sesiones
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} sx={{ maxHeight: '600px', overflow: 'auto', pr: 1 }}>
            <SessionList
              sessions={sessions}
              currentUser={currentUser as User | null}
              sessionFeedbacks={sessionFeedbacks}
              onStatusUpdate={handleStatusUpdate}
              onCancelSession={handleCancelSession}
              onOpenFeedback={openFeedbackDialog}
              compact={true}
              getStatusText={getStatusText}
              getStatusColor={getStatusColor}
            />
          </Box>
        </Box>

        {/* Calendario - SIN sesiones canceladas */}
        <SessionCalendar
          sessions={sessions}
          onDateClick={handleDateClick}
        />
      </Box>

      {/* Diálogos */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agendar Nueva Sesión</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Esta funcionalidad estará disponible pronto. Por ahora, contacta directamente con los mentores.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <SessionFeedback
        open={feedbackDialog}
        session={selectedSessionForFeedback}
        rating={feedbackRating}
        comment={feedbackComment}
        loading={feedbackLoading}
        onRatingChange={setFeedbackRating}
        onCommentChange={setFeedbackComment}
        onSubmit={handleFeedbackSubmit}
        onClose={closeFeedbackDialog}
      />

      {/* Modal de sesiones por fecha */}
      <Dialog 
        open={!!selectedDateSessions} 
        onClose={handleCloseDateModal} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Sesiones del {selectedDateSessions?.date.format('DD/MM/YYYY')}
        </DialogTitle>
        <DialogContent>
          {selectedDateSessions?.sessions.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No hay sesiones para esta fecha
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {selectedDateSessions?.sessions.map((session) => (
                <Card key={session._id} variant="outlined">
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {session.topic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estado: {getStatusText(session.status)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Hora: {new Date(session.date).toLocaleTimeString('es-ES')}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDateModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}