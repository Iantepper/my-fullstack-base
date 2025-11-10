import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Alert,
  Button,
} from '@mui/material';
import { Save, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAvailability } from './hooks/useAvailability';
import { AvailabilityGrid } from './components/AvailabilityGrid';

export default function AvailabilityPage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  
  const {
    availability,
    loading,
    saving,
    error,
    success,
    setError,
    setSuccess,
    saveAvailability,
    toggleTimeSlot,
    toggleDay,
    toggleTimeSlotAllDays,
    initializeDefaultAvailability
  } = useAvailability();

  // Verificar que el usuario es mentor
  useEffect(() => {
    if (currentUser?.role !== 'mentor') {
      navigate('/profile');
    }
  }, [currentUser, navigate]);

  const handleSave = async () => {
    if (availability) {
      await saveAvailability(availability.weeklySlots);
    }
  };

  const handleToggleAll = (available: boolean) => {
    if (!availability) return;
    
    const updatedSlots = { ...availability.weeklySlots };
    
    Object.keys(updatedSlots).forEach(dayId => {
      Object.keys(updatedSlots[dayId]).forEach(timeSlot => {
        updatedSlots[dayId][timeSlot].available = available;
      });
    });

    saveAvailability(updatedSlots);
  };

  const handleToggleWeekdays = (available: boolean) => {
    if (!availability) return;
    
    const updatedSlots = { ...availability.weeklySlots };
    
    [1, 2, 3, 4, 5].forEach(dayId => {
      const dayIdStr = dayId.toString();
      if (updatedSlots[dayIdStr]) {
        Object.keys(updatedSlots[dayIdStr]).forEach(timeSlot => {
          updatedSlots[dayIdStr][timeSlot].available = available;
        });
      }
    });

    saveAvailability(updatedSlots);
  };

  const handleToggleWeekend = (available: boolean) => {
    if (!availability) return;
    
    const updatedSlots = { ...availability.weeklySlots };
    
    [0, 6].forEach(dayId => {
      const dayIdStr = dayId.toString();
      if (updatedSlots[dayIdStr]) {
        Object.keys(updatedSlots[dayIdStr]).forEach(timeSlot => {
          updatedSlots[dayIdStr][timeSlot].available = available;
        });
      }
    });

    saveAvailability(updatedSlots);
  };

  if (currentUser?.role !== 'mentor') {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h6">
            Esta página es solo para mentores
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Mi Disponibilidad
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Configura los horarios en los que estás disponible para sesiones
          </Typography>
        </Box>
        
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={initializeDefaultAvailability}
            disabled={loading || saving}
          >
            Reiniciar
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading || saving || !availability}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
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

      {/* Cuadrícula de disponibilidad */}
      <AvailabilityGrid
        availability={availability}
        loading={loading}
        onTimeSlotToggle={toggleTimeSlot}
        onDayToggle={toggleDay}
        onToggleAll={handleToggleAll}
        onToggleWeekdays={handleToggleWeekdays}
        onToggleWeekend={handleToggleWeekend}
        onToggleTimeSlotAllDays={toggleTimeSlotAllDays}
      />

      {/* Información adicional */}
      <Box mt={4} p={3} bgcolor="info.light" borderRadius={2}>
        <Typography variant="h6" gutterBottom color="info.dark">
          💡 Consejos
        </Typography>
        <Typography variant="body2" color="info.dark">
          • Los mentees podrán ver tu disponibilidad al agendar sesiones<br/>
          • Mantén tu disponibilidad actualizada para recibir más solicitudes<br/>
          • Puedes usar las acciones rápidas para configurar períodos comunes
        </Typography>
      </Box>
    </Container>
  );
}