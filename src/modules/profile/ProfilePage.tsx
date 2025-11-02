import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'mentor' | 'mentee';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    avatar: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await userService.getProfile();
      setProfile(userData);
      setFormData({
        name: userData.name,
        avatar: userData.avatar || ''
      });
    } catch (err: unknown) {
      setError('Error al cargar el perfil');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const updatedProfile = await userService.updateProfile(formData);
      setProfile(updatedProfile.user);
      setSuccess('Perfil actualizado exitosamente');
      setEditing(false);
      
      // Actualizar usuario en localStorage
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, name: formData.name };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err: unknown) {
      setError('Error al actualizar el perfil');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      avatar: profile?.avatar || ''
    });
    setEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography variant="h6">Error al cargar el perfil</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth={800} mx="auto" p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mi Perfil
        </Typography>
        
        {!editing ? (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setEditing(true)}
          >
            Editar Perfil
          </Button>
        ) : (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Box>
        )}
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

      {/* Profile Card */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Avatar and Basic Info */}
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: '2.5rem',
                bgcolor: 'primary.main',
                mr: 3
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box flex={1}>
              {editing ? (
                <TextField
                  fullWidth
                  label="Nombre"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  margin="normal"
                />
              ) : (
                <>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {profile.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {profile.email}
                  </Typography>
                </>
              )}
              
              <Chip
                label={profile.role === 'mentor' ? 'Mentor' : 'Mentorizado'}
                color={profile.role === 'mentor' ? 'primary' : 'secondary'}
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Additional Info */}
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ESTADO
              </Typography>
              <Chip
                label={profile.isActive ? 'Activo' : 'Inactivo'}
                color={profile.isActive ? 'success' : 'default'}
                variant="outlined"
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                FECHA DE REGISTRO
              </Typography>
              <Typography variant="body1">
                {new Date(profile.createdAt).toLocaleDateString('es-ES')}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ÚLTIMA ACTUALIZACIÓN
              </Typography>
              <Typography variant="body1">
                {new Date(profile.updatedAt).toLocaleDateString('es-ES')}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                ID DE USUARIO
              </Typography>
              <Typography variant="body2" fontFamily="monospace">
                {profile._id}
              </Typography>
            </Box>
          </Box>

          {/* Avatar URL Field (only when editing) */}
          {editing && (
            <>
              <Divider sx={{ my: 3 }} />
              <TextField
                fullWidth
                label="URL del Avatar (opcional)"
                placeholder="https://ejemplo.com/avatar.jpg"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                margin="normal"
                helperText="Pega la URL de tu imagen de perfil"
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}