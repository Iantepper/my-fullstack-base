import React from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';
import { DayColumn } from './DayColumn';
import { BulkActions } from './BulkActions';
import { daysOfWeek } from '../hooks/useAvailability';
import { Availability } from '../../../services/availabilityService';

interface AvailabilityGridProps {
  availability: Availability | null;
  loading: boolean;
  onTimeSlotToggle: (dayId: string, timeSlot: string, available: boolean) => void;
  onDayToggle: (dayId: string, available: boolean) => void;
  onToggleAll: (available: boolean) => void;
  onToggleWeekdays: (available: boolean) => void;
  onToggleWeekend: (available: boolean) => void;
  onToggleTimeSlotAllDays: (timeSlot: string, available: boolean) => void;
}

export const AvailabilityGrid: React.FC<AvailabilityGridProps> = ({
  availability,
  loading,
  onTimeSlotToggle,
  onDayToggle,
  onToggleAll,
  onToggleWeekdays,
  onToggleWeekend,
  onToggleTimeSlotAllDays
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (!availability) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography variant="h6" color="text.secondary">
          No se pudo cargar la disponibilidad
        </Typography>
      </Box>
    );
  }

  // ✅ Asegurarnos que daysOfWeek existe antes de usarlo
  if (!daysOfWeek || daysOfWeek.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Typography variant="h6" color="text.secondary">
          Error al cargar los días de la semana
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Acciones Masivas */}
      <BulkActions
        onToggleAll={onToggleAll}
        onToggleWeekdays={onToggleWeekdays}
        onToggleWeekend={onToggleWeekend}
        onToggleTimeSlotAllDays={onToggleTimeSlotAllDays}
      />

      {/* Cuadrícula de disponibilidad */}
      <Paper 
  sx={{ 
    p: 3, 
    mt: 3,
    backgroundColor: '#1A1A2E', // ✅ FORZAR FONDO OSCURO
    backgroundImage: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', // ✅ TU GRADIENTE
    border: '1px solid rgba(139, 95, 191, 0.1)', // ✅ BORDE SUTIL
  }}
>
  <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
    Disponibilidad Semanal
  </Typography>
  <Box display="flex" alignItems="center" gap={2} mb={2}>
  <Typography variant="body2" color="text.secondary">
    Haz click en los horarios para marcarlos como:
  </Typography>
  <Box display="flex" alignItems="center" gap={1}>
    <Box 
      width={12} 
      height={12} 
      bgcolor="primary.main" 
      borderRadius={1} 
    />
    <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
      Disponible
    </Typography>
  </Box>
  <Box display="flex" alignItems="center" gap={1}>
    <Box 
      width={12} 
      height={12} 
      bgcolor="rgba(30, 30, 50, 0.6)"
      borderRadius={1} 
      border="1px solid" 
      borderColor="rgba(139, 95, 191, 0.3)" 
    />
    <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
      No disponible
    </Typography>
  </Box>
</Box>

        {/* Grid de días */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(7, 1fr)'
            },
            gap: 2,
            mt: 3
          }}
        >
          {daysOfWeek.map((day) => (
            <DayColumn
              key={day.id}
              day={day}
              // ✅ CORREGIDO: Validación robusta para evitar undefined
              availability={availability?.weeklySlots?.[day.id] || {}}
              onTimeSlotToggle={onTimeSlotToggle}
              onDayToggle={onDayToggle}
            />
          ))}
        </Box>

        {/* Leyenda */}
<Box display="flex" justifyContent="center" gap={3} mt={3} pt={2} borderTop="1px solid" borderColor="divider">
  <Box display="flex" alignItems="center" gap={1}>
    <Box 
      width={16} 
      height={16} 
      bgcolor="primary.main" // ✅ PÚRPURA PARA DISPONIBLE
      borderRadius={1} 
    />
    <Typography variant="body2" color="text.secondary">
      Disponible
    </Typography>
  </Box>
  <Box display="flex" alignItems="center" gap={1}>
    <Box 
      width={16} 
      height={16} 
      bgcolor="rgba(30, 30, 50, 0.6)" // ✅ OSCURO PARA NO DISPONIBLE
      borderRadius={1} 
      border="1px solid" 
      borderColor="rgba(139, 95, 191, 0.3)" 
    />
    <Typography variant="body2" color="text.secondary">
      No disponible
    </Typography>
  </Box>
</Box>
      </Paper>
    </Box>
  );
};