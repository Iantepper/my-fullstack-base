import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Container,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add, VideoCall, Cancel, CheckCircle, Schedule } from '@mui/icons-material';
import { sessionService, Session } from '../../services/sessionService';
import { authService } from '../../services/authService';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
  const loadData = async () => {
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

  loadData();
}, [currentUser?.role]);

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

  const handleStatusUpdate = async (sessionId: string, newStatus: Session['status']) => {
    try {
      await sessionService.updateSessionStatus(sessionId, newStatus);
      loadSessions(); // Recargar sesiones
    } catch (err: unknown) {
      setError('Error al actualizar la sesión');
      console.error('Error updating session:', err);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await sessionService.cancelSession(sessionId);
      loadSessions(); // Recargar sesiones
    } catch (err: unknown) {
      setError('Error al cancelar la sesión');
      console.error('Error cancelling session:', err);
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
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Nueva Sesión
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Sessions List */}
      <Box display="flex" flexDirection="column" gap={3}>
        {sessions.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Schedule sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
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
        ) : (
          sessions.map((session) => (
            <Card key={session._id}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {session.topic}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Typography variant="body2" color="text.secondary">
                        Con: {currentUser?.role === 'mentor' ? session.menteeId.name : session.mentorId.userId.name}
                      </Typography>
                      <Chip
                        label={getStatusText(session.status)}
                        color={getStatusColor(session.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      📅 {new Date(session.date).toLocaleString('es-ES')}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      ⏱️ {session.duration} minutos • 💰 ${session.price}
                    </Typography>

                    {session.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {session.description}
                      </Typography>
                    )}
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" flexDirection="column" gap={1}>
                    {session.meetingLink && session.status === 'confirmed' && (
                      <Button
                        variant="contained"
                        startIcon={<VideoCall />}
                        href={session.meetingLink}
                        target="_blank"
                        size="small"
                      >
                        Unirse
                      </Button>
                    )}
                    
                    {currentUser?.role === 'mentor' && session.status === 'pending' && (
                      <>
                        <Button
                          variant="outlined"
                          color="success"
                          startIcon={<CheckCircle />}
                          size="small"
                          onClick={() => handleStatusUpdate(session._id, 'confirmed')}
                        >
                          Confirmar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Cancel />}
                          size="small"
                          onClick={() => handleCancelSession(session._id)}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    
                    {currentUser?.role === 'mentee' && session.status === 'pending' && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        size="small"
                        onClick={() => handleCancelSession(session._id)}
                      >
                        Cancelar
                      </Button>
                    )}

                    {session.status === 'confirmed' && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        size="small"
                        onClick={() => handleCancelSession(session._id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Create Session Dialog */}
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

      {/* Session Details Dialog */}
      <Dialog open={!!selectedSession} onClose={() => setSelectedSession(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles de la Sesión</DialogTitle>
        <DialogContent>
          {selectedSession && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedSession.topic}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Con: {currentUser?.role === 'mentor' ? selectedSession.menteeId.name : selectedSession.mentorId.userId.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fecha: {new Date(selectedSession.date).toLocaleString('es-ES')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Duración: {selectedSession.duration} minutos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Precio: ${selectedSession.price}
              </Typography>
              {selectedSession.description && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {selectedSession.description}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedSession(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}