import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function HomePage() {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  return (
    <Container maxWidth="lg">
      {/* Hero Section - Más minimalista y elegante */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: { xs: 6, md: 10 },
          mb: 8,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(139, 95, 191, 0.1) 0%, rgba(26, 26, 46, 0.8) 100%)',
            borderRadius: 2,
            zIndex: 1,
          }
        }}
      >
        <Box position="relative" zIndex={2}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #E2E8F0 0%, #9D76C9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Mentores Pro
          </Typography>
          
          <Typography 
            variant="h5" 
            component="p" 
            gutterBottom 
            sx={{ 
              mb: 4, 
              color: 'text.secondary',
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Conecta con expertos que acelerarán tu crecimiento profesional
          </Typography>
          
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/register"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Comenzar Ahora
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                component={Link} 
                to="/mentors"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Explorar Mentores
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary' }}>
                ¡Hola {currentUser?.name}! ¿Listo para tu próxima sesión?
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} 
                to="/mentors"
                sx={{ 
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Ver Mentores
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Features Section - Más útil y directa */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          ¿Cómo funciona?
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Card sx={{ 
            width: 280, 
            transition: 'all 0.3s ease', 
            '&:hover': { 
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 40px rgba(139, 95, 191, 0.2)'
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: 'rgba(139, 95, 191, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Typography variant="h4" color="primary">
                  👨‍💼
                </Typography>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Encuentra
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Descubre mentores verificados en tu área de expertise
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            width: 280, 
            transition: 'all 0.3s ease', 
            '&:hover': { 
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 40px rgba(139, 95, 191, 0.2)'
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: 'rgba(139, 95, 191, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Typography variant="h4" color="primary">
                  📅
                </Typography>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Agenda
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Reserva sesiones 1:1 según tu disponibilidad
              </Typography>
            </CardContent>
          </Card>
          
          <Card sx={{ 
            width: 280, 
            transition: 'all 0.3s ease', 
            '&:hover': { 
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 40px rgba(139, 95, 191, 0.2)'
            } 
          }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%', 
                bgcolor: 'rgba(139, 95, 191, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3
              }}>
                <Typography variant="h4" color="primary">
                  🚀
                </Typography>
              </Box>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Crece
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Aprende con mentoría personalizada y acelera tu carrera
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Stats Section - Más relevante */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        flexWrap: 'wrap', 
        gap: 4, 
        mb: 8,
        textAlign: 'center'
      }}>
        <Box>
          <Typography variant="h3" component="div" color="primary" fontWeight="bold">
            50+
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Mentores Expertos
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" component="div" color="primary" fontWeight="bold">
            500+
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sesiones Realizadas
          </Typography>
        </Box>
        <Box>
          <Typography variant="h3" component="div" color="primary" fontWeight="bold">
            4.9★
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Rating Promedio
          </Typography>
        </Box>
      </Box>

      {/* CTA Section - Solo para no autenticados */}
      {!isAuthenticated && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          border: '1px solid',
          borderColor: 'rgba(139, 95, 191, 0.2)',
          borderRadius: 2,
          background: 'rgba(139, 95, 191, 0.05)'
        }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Comienza tu journey hoy
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Únete a profesionales que están acelerando sus carreras
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/register"
            sx={{ 
              px: 5,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Crear Cuenta Gratis
          </Button>
        </Box>
      )}
    </Container>
  );
}