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
  MenuItem 
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'mentee' as 'mentor' | 'mentee'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: unknown } }) => {
  const target = e.target as { name: string; value: unknown };
  setFormData({
    ...formData,
    [target.name]: target.value as string
  });
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

  return (
    <Box maxWidth={400} mx="auto" mt={4} p={3}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Registrarse
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
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
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <Box mt={2} textAlign="center">
        <Typography variant="body2">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ textDecoration: 'none' }}>
            Inicia sesión aquí
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}