import { Box, Typography, Button, Container, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function HomePage() {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 2,
          color: 'white',
          mb: 6
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Bienvenido a Mentores Pro
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
          Conecta con mentores expertos y acelera tu crecimiento profesional
        </Typography>
        
        {!isAuthenticated ? (
          <Box>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/register"
              sx={{ 
                mr: 2,
                bgcolor: 'white',
                color: '#667eea',
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
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
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Explorar Mentores
            </Button>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            ¡Hola {currentUser?.name}! ¿Listo para conectar con mentores?
          </Typography>
        )}
      </Box>

      {/* Features Section - usando Box en lugar de Grid */}
      <Box sx={{ display: 'flex', gap: 4, mb: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Card sx={{ width: 300, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              👨‍💼
            </Typography>
            <Typography variant="h5" gutterBottom>
              Encuentra Mentores
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Descubre profesionales experimentados en tu área de interés.
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ width: 300, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              📚
            </Typography>
            <Typography variant="h5" gutterBottom>
              Aprende y Crece
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Accede a conocimiento especializado y recibe guía personalizada.
            </Typography>
          </CardContent>
        </Card>
        
        <Card sx={{ width: 300, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h4" color="primary" gutterBottom>
              ⚡
            </Typography>
            <Typography variant="h5" gutterBottom>
              Acelera tu Carrera
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Evita errores comunes y toma decisiones más inteligentes.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h4" gutterBottom>
            ¿Listo para comenzar?
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
            Únete a nuestra comunidad de aprendizaje
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/register"
            sx={{ 
              bgcolor: '#667eea',
              '&:hover': {
                bgcolor: '#5a6fd8'
              }
            }}
          >
            Crear Cuenta Gratis
          </Button>
        </Box>
      )}
    </Container>
  );
}