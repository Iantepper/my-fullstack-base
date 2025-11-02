import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { Search, AttachMoney, Star } from '@mui/icons-material';
import { mentorService, Mentor } from '../../services/mentorService';

export default function MentorPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);
      const data = await mentorService.getAllMentors();
      setMentors(data);
    } catch (err) {
      setError('Error al cargar los mentores');
      console.error('Error loading mentors:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.expertise.some(exp =>
      exp.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    mentor.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Nuestros Mentores
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Conecta con expertos dispuestos a compartir su conocimiento
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar por nombre, expertise o especialidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Mentors Grid usando Box en lugar de Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, 
        gap: 3 
      }}>
        {filteredMentors.length === 0 ? (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No se encontraron mentores con esos criterios' : 'No hay mentores disponibles'}
            </Typography>
          </Box>
        ) : (
          filteredMentors.map((mentor) => (
            <Card key={mentor._id} sx={{ 
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(139, 95, 191, 0.15)'
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                {/* Mentor Header */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      mr: 2
                    }}
                  >
                    {mentor.userId.name.charAt(0)}
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {mentor.userId.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {mentor.userId.email}
                    </Typography>
                  </Box>
                </Box>

                {/* Rating and Price */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Star sx={{ color: 'gold', mr: 0.5, fontSize: 18 }} />
                    <Typography variant="body2" fontWeight="bold">
                      {mentor.rating || 'Nuevo'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({mentor.reviewCount} reviews)
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <AttachMoney sx={{ fontSize: 18, color: 'success.main' }} />
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {mentor.hourlyRate}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                      /hora
                    </Typography>
                  </Box>
                </Box>

                {/* Bio */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {mentor.bio.length > 120 ? `${mentor.bio.substring(0, 120)}...` : mentor.bio}
                </Typography>

                {/* Expertise */}
                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    ESPECIALIDADES:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Chip
                        label={`+${mentor.expertise.length - 3}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>

                {/* Availability */}
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    DISPONIBILIDAD:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {mentor.availability.slice(0, 3).map((day, index) => (
                      <Chip
                        key={index}
                        label={day}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
}