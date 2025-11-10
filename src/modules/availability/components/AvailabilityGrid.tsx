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
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Disponibilidad Semanal
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Haz click en los horarios para marcarlos como disponibles (verde) o no disponibles (gris)
        </Typography>

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
            <Box width={16} height={16} bgcolor="success.main" borderRadius={1} />
            <Typography variant="body2" color="text.secondary">
              Disponible
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Box width={16} height={16} bgcolor="grey.100" borderRadius={1} border="1px solid" borderColor="grey.300" />
            <Typography variant="body2" color="text.secondary">
              No disponible
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};