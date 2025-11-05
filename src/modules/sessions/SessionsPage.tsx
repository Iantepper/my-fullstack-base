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
  DialogActions,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import RatingStars from '../../components/RatingStars';
import { feedbackService } from '../../services/feedbackService';
import { Add, VideoCall, Cancel, CheckCircle, Schedule, Star, ViewList, CalendarViewMonth } from '@mui/icons-material';
import { sessionService, Session } from '../../services/sessionService';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import Calendar from '../../components/Calendar/Calendar';

import { Dayjs } from 'dayjs';

// ✅ Interface FUERA del componente
interface SessionFeedback {
  _id: string;
  rating: number;
  comment: string;
  menteeId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

interface CalendarSession {
  _id: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  topic: string;
}


export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const currentUser = authService.getCurrentUser();
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [selectedSessionForFeedback, setSelectedSessionForFeedback] = useState<Session | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [sessionFeedbacks, setSessionFeedbacks] = useState<{[sessionId: string]: SessionFeedback}>({});
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'calendar'>('calendar');

  // ✅ SOLO UN useEffect
  useEffect(() => {
    loadSessions();
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

      // ✅ Cargar feedbacks SOLO para sesiones completadas que NO tenemos
      const feedbackPromises = data
        .filter(session => session.status === 'completed' && !sessionFeedbacks[session._id])
        .map(session => loadSessionFeedback(session._id));

      await Promise.all(feedbackPromises);

    } catch (err: unknown) {
      setError('Error al cargar las sesiones');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionFeedback = async (sessionId: string) => {
    try {
      const feedback = await feedbackService.getFeedbackBySession(sessionId);
      setSessionFeedbacks(prev => ({
        ...prev,
        [sessionId]: feedback
      }));
    } catch {
      // Si no hay feedback, no hacemos nada (es normal)
      console.log('No hay feedback para esta sesión:', sessionId);
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

  const [selectedDateSessions, setSelectedDateSessions] = useState<{
  date: Dayjs;
  sessions: CalendarSession[];
} | null>(null);

  const handleSubmitFeedback = async () => {
    if (!selectedSessionForFeedback) return;

    try {
      setFeedbackLoading(true);
      
      await feedbackService.createFeedback({
        sessionId: selectedSessionForFeedback._id,
        rating: feedbackRating,
        comment: feedbackComment
      });

      // ✅ Recargar SOLO el feedback de esta sesión
      await loadSessionFeedback(selectedSessionForFeedback._id);
      
      setFeedbackDialog(false);
      setFeedbackRating(0);
      setFeedbackComment('');
      setSuccess('¡Feedback enviado exitosamente!');
      
    } catch (err: unknown) {
      setError('Error al enviar el feedback');
      console.error('Error submitting feedback:', err);
    } finally {
      setFeedbackLoading(false);
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
      
      // ✅ Si se completa una sesión, cargar su feedback
      if (newStatus === 'completed') {
        await loadSessionFeedback(sessionId);
      }
      
      loadSessions();
    } catch (err: unknown) {
      setError('Error al actualizar la sesión');
      console.error('Error updating session:', err);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await sessionService.cancelSession(sessionId);
      loadSessions();
    } catch (err: unknown) {
      setError('Error al cancelar la sesión');
      console.error('Error cancelling session:', err);
    }
  };

const handleDateClick = (date: Dayjs, sessions: CalendarSession[]) => {
  if (sessions.length > 0) {
    setSelectedDateSessions({ date, sessions });
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
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, newView) => newView && setView(newView)}
            aria-label="Vista de sesiones"
          >
            <ToggleButton value="calendar" aria-label="vista calendario">
              <CalendarViewMonth />
            </ToggleButton>
            <ToggleButton value="list" aria-label="vista lista">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>

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
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

{/* Vista Dividida - Lista Compacta + Calendario */}
{view === 'calendar' && (
  <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
    {/* Lista COMPACTA MEJORADA - Ocupa 60% */}
    <Box flex={{ md: 0.6 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
        📅 Tus Sesiones
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} sx={{ maxHeight: '600px', overflow: 'auto', pr: 1 }}>
        {sessions.length === 0 ? (
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No tienes sesiones
              </Typography>
            </CardContent>
          </Card>
        ) : (
          sessions.map((session) => (
            <Card 
              key={session._id} 
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
                  {/* Información principal */}
                  <Box flex={1} sx={{ minWidth: 0 }}> {/* minWidth: 0 para evitar overflow */}
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

                  {/* Botones de acción */}
                  <Box display="flex" flexDirection="column" gap={1} sx={{ ml: 2, flexShrink: 0 }}>
                    {session.meetingLink && session.status === 'confirmed' && (
                      <Button 
                        size="small" 
                        variant="contained"
                        startIcon={<VideoCall />} 
                        href={session.meetingLink} 
                        target="_blank"
                        sx={{ minWidth: 'auto' }}
                      >
                        Unirse
                      </Button>
                    )}
                    
                    {session.status === 'confirmed' && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="primary"
                        startIcon={<CheckCircle />} 
                        onClick={() => handleStatusUpdate(session._id, 'completed')}
                        sx={{ minWidth: 'auto' }}
                      >
                        Completar
                      </Button>
                    )}
                    
                    {currentUser?.role === 'mentor' && session.status === 'pending' && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="success"
                        startIcon={<CheckCircle />} 
                        onClick={() => handleStatusUpdate(session._id, 'confirmed')}
                        sx={{ minWidth: 'auto' }}
                      >
                        Confirmar
                      </Button>
                    )}
                    
                    {(session.status === 'pending' || session.status === 'confirmed') && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />} 
                        onClick={() => handleCancelSession(session._id)}
                        sx={{ minWidth: 'auto' }}
                      >
                        {session.status === 'pending' ? 'Cancelar' : 'Rechazar'}
                      </Button>
                    )}

                    {session.status === 'completed' && currentUser?.role === 'mentee' && !sessionFeedbacks[session._id] && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        color="primary"
                        startIcon={<Star />} 
                        onClick={() => {
                          setSelectedSessionForFeedback(session);
                          setFeedbackDialog(true);
                        }}
                        sx={{ minWidth: 'auto' }}
                      >
                        Calificar
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>

    {/* Calendario - Ocupa 40% */}
    <Box flex={{ md: 0.4 }}>
      <Calendar 
        sessions={sessions.map(s => ({
          _id: s._id,
          date: s.date,
          status: s.status,
          topic: s.topic
        }))} 
        onDateClick={handleDateClick} 
      />
    </Box>
  </Box>
)}

      {/* Vista Lista */}
      {view === 'list' && (
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

                      {/* Feedback Section */}
                      {session.status === 'completed' && sessionFeedbacks[session._id] && (
                        <Box mt={2} p={2} sx={{ 
                          bgcolor: 'background.default', 
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                            📝 Reseña de la sesión
                          </Typography>
                          
                          <Box display="flex" alignItems="center" mb={1}>
                            <RatingStars 
                              rating={sessionFeedbacks[session._id].rating} 
                              readOnly 
                              size="small" 
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                              Calificación de {sessionFeedbacks[session._id].menteeId.name}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2">
                            {sessionFeedbacks[session._id].comment}
                          </Typography>
                        </Box>
                      )}

                      {session.status === 'completed' && !sessionFeedbacks[session._id] && currentUser?.role === 'mentor' && (
                        <Box mt={2} p={1} sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            ⏳ Esperando calificación de {session.menteeId.name}
                          </Typography>
                        </Box>
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

                      {session.status === 'confirmed' && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<CheckCircle />}
                          size="small"
                          onClick={() => handleStatusUpdate(session._id, 'completed')}
                        >
                          Completar Sesión
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

                      {session.status === 'completed' && currentUser?.role === 'mentee' && !sessionFeedbacks[session._id] && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<Star />}
                          size="small"
                          onClick={() => {
                            setSelectedSessionForFeedback(session);
                            setFeedbackDialog(true);
                          }}
                        >
                          Calificar
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}

      {/* Diálogos (se mantienen igual) */}
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

      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Calificar Sesión</DialogTitle>
        <DialogContent>
          {selectedSessionForFeedback && (
            <Box display="flex" flexDirection="column" gap={3} mt={2}>
              <Typography variant="h6" gutterBottom>
                ¿Cómo calificarías tu sesión con {selectedSessionForFeedback.mentorId.userId.name}?
              </Typography>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Calificación:
                </Typography>
                <RatingStars
                  rating={feedbackRating}
                  onRatingChange={setFeedbackRating}
                  size="large"
                />
              </Box>
              
              <TextField
                label="Comentario (opcional)"
                multiline
                rows={4}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Comparte tu experiencia, qué aprendiste, cómo fue la sesión..."
                fullWidth
              />
              
              <Typography variant="body2" color="text.secondary">
                Tema: {selectedSessionForFeedback.topic}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)} disabled={feedbackLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmitFeedback}
            variant="contained"
            disabled={feedbackLoading || feedbackRating === 0}
          >
            {feedbackLoading ? 'Enviando...' : 'Enviar Calificación'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal de sesiones por fecha */}
      <Dialog 
        open={!!selectedDateSessions} 
        onClose={() => setSelectedDateSessions(null)} 
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
          <Button onClick={() => setSelectedDateSessions(null)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}