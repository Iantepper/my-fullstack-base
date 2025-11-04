import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Paso 1: Datos básicos
    name: '',
    email: '',
    password: '',
    role: 'mentee' as 'mentor' | 'mentee',
    // Paso 2: Datos de mentor (solo si role = 'mentor')
    expertise: [] as string[],
    bio: '',
    experience: '',
    hourlyRate: 0,
    availability: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: unknown } }) => {
    const target = e.target as { name: string; value: unknown };
    setFormData({
      ...formData,
      [target.name]: target.value
    });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      navigate('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || 'Error al registrar usuario');
      } else {
        setError('Error al registrar usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Datos básicos', 'Perfil de mentor'];

  // Campos de expertise predefinidos
  const expertiseOptions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript',
    'Frontend', 'Backend', 'Fullstack', 'DevOps', 'UI/UX', 'Mobile',
    'Base de datos', 'Cloud', 'Machine Learning', 'Cybersecurity'
  ];

  const daysOptions = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  return (
    <Box maxWidth={600} mx="auto" mt={4} p={3}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Registrarse
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* PASO 1: Datos básicos */}
        {activeStep === 0 && (
          <Box>
            <TextField
              name="name"
              label="Nombre completo"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <TextField
              name="password"
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Rol</InputLabel>
              <Select
                name="role"
                value={formData.role}
                label="Rol"
                onChange={handleChange}
                required
              >
                <MenuItem value="mentee">Mentorizado</MenuItem>
                <MenuItem value="mentor">Mentor</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
  <Button
    onClick={formData.role === 'mentor' ? handleNext : handleSubmit}
    variant="contained"
    disabled={!formData.name || !formData.email || !formData.password}
    type={formData.role === 'mentor' ? 'button' : 'submit'}
  >
    {formData.role === 'mentor' ? 'Siguiente' : 'Registrarse'}
  </Button>
</Box>
          </Box>
        )}

        {/* PASO 2: Perfil de mentor (solo si eligió mentor) */}
        {activeStep === 1 && formData.role === 'mentor' && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Completa tu perfil de mentor
            </Typography>

            <FormControl fullWidth margin="normal">
              <InputLabel>Áreas de expertise</InputLabel>
              <Select
                name="expertise"
                multiple
                value={formData.expertise}
                onChange={handleChange}
                renderValue={(selected) => (selected as string[]).join(', ')}
              >
                {expertiseOptions.map((exp) => (
                  <MenuItem key={exp} value={exp}>
                    {exp}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="bio"
              label="Biografía"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos sobre tu experiencia y qué te apasiona enseñar..."
            />

            <TextField
              name="experience"
              label="Experiencia profesional"
              fullWidth
              margin="normal"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Ej: Senior Developer at TechCompany, 5 años de experiencia..."
            />

            <TextField
              name="hourlyRate"
              label="Tarifa por hora (USD)"
              type="number"
              fullWidth
              margin="normal"
              value={formData.hourlyRate}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Disponibilidad</InputLabel>
              <Select
                name="availability"
                multiple
                value={formData.availability}
                onChange={handleChange}
                renderValue={(selected) => (selected as string[]).join(', ')}
              >
                {daysOptions.map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Atrás
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formData.expertise.length || !formData.bio || !formData.experience || formData.hourlyRate <= 0}
              >
                {loading ? 'Registrando...' : 'Completar Registro'}
              </Button>
            </Box>
          </Box>
        )}
      </form>

      {activeStep === 0 && (
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Inicia sesión aquí
            </Link>
          </Typography>
        </Box>
      )}
    </Box>
  );
}