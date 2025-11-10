import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Avatar
} from '@mui/material';
import { ArrowBack, Star, AttachMoney, Schedule } from '@mui/icons-material';
import { mentorService, Mentor } from '../../services/mentorService';
import { sessionService } from '../../services/sessionService';
import { authService } from '../../services/authService';
import { SessionScheduler } from './components/SessionScheduler';

export default function MentorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDialog, setBookingDialog] = useState(false);
  // ❌ ELIMINADO: const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    if (id) {
      loadMentor();
    }
  }, [id]);

  const loadMentor = async () => {
    try {
      setLoading(true);
      const data = await mentorService.getMentorById(id!);
      setMentor(data);
    } catch (err: unknown) {
      setError('Error al cargar el mentor');
      console.error('Error loading mentor:', err);
    } finally {
      setLoading(false);
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

  if (!mentor) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h6">Mentor no encontrado</Typography>
        </Box>
      </Container>
    );
  }

  const currentUser = authService.getCurrentUser();
  const isMentee = currentUser?.role === 'mentee';

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/mentors')}
          sx={{ mb: 2 }}
        >
          Volver a Mentores
        </Button>

        {/* Layout sin Grid */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Sidebar Info */}
          <Box sx={{ width: { xs: '100%', md: '35%' } }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    fontSize: '3rem',
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {mentor.userId.name.charAt(0).toUpperCase()}
                </Avatar>
                
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {mentor.userId.name}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {mentor.userId.email}
                </Typography>

                <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={2}>
                  <Star sx={{ color: 'gold', fontSize: 20 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {mentor.rating || 'Nuevo'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({mentor.reviewCount} reviews)
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={3}>
                  <AttachMoney sx={{ color: 'success.main', fontSize: 24 }} />
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {mentor.hourlyRate}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    /hora
                  </Typography>
                </Box>

                {isMentee ? (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<Schedule />}
                    onClick={() => setBookingDialog(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #8B5FBF 0%, #6D3F99 100%)',
                      py: 1.5
                    }}
                  >
                    Agendar Sesión
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Inicia sesión como mentorizado para agendar una sesión
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Main Content */}
          <Box sx={{ width: { xs: '100%', md: '65%' } }}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Sobre {mentor.userId.name}
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  {mentor.bio}
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mt: 3 }}>
                  Experiencia
                </Typography>
                <Typography variant="body1" paragraph>
                  {mentor.experience}
                </Typography>

                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Especialidades
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                  {mentor.expertise.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Disponibilidad
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {mentor.availability.map((day, index) => (
                    <Chip
                      key={index}
                      label={day}
                      color="secondary"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {bookingSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {bookingSuccess}
        </Alert>
      )}

      {/* Booking Dialog */}
      <Dialog 
        open={bookingDialog} 
        onClose={() => setBookingDialog(false)} 
        maxWidth="lg" 
        fullWidth
        sx={{ '& .MuiDialog-paper': { minHeight: '80vh' } }}
      >
        <DialogTitle>
          Agendar Sesión con {mentor.userId.name}
        </DialogTitle>
        <DialogContent>
          <SessionScheduler
            mentorId={mentor._id}
            hourlyRate={mentor.hourlyRate}
            onSessionSelect={async (sessionData) => {
              try {
                setError('');
                
                await sessionService.createSession({
                  mentorId: mentor._id,
                  ...sessionData
                });

                setBookingSuccess('¡Sesión agendada exitosamente!');
                setBookingDialog(false);
                
                setTimeout(() => {
                  navigate('/sessions');
                }, 2000);

              } catch (err: unknown) {
                setError('Error al agendar la sesión');
                console.error('Error booking session:', err);
              }
            }}
            onCancel={() => setBookingDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
}