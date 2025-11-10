import React from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { TimeSlotCell } from './TimeSlotCell';
import { defaultTimeSlots } from '../hooks/useAvailability';

interface DayColumnProps {
  day: {
    id: string;
    name: string;
  };
  availability: {
    [timeSlot: string]: {
      start: string;
      end: string;
      available: boolean;
    };
  };
  onTimeSlotToggle: (dayId: string, timeSlot: string, available: boolean) => void;
  onDayToggle: (dayId: string, available: boolean) => void;
  compact?: boolean;
}

export const DayColumn: React.FC<DayColumnProps> = ({
  day,
  availability,
  onTimeSlotToggle,
  onDayToggle,
  compact = false
}) => {
  // ✅ CORREGIDO: Validación robusta para availability
  const safeAvailability = availability || {};

  // Verificar si todos los slots del día están disponibles
  const allSlotsAvailable = defaultTimeSlots.every(
    timeSlot => safeAvailability[timeSlot]?.available === true
  );

  const handleDayToggle = () => {
    onDayToggle(day.id, !allSlotsAvailable);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 1,
        p: compact ? 1 : 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
        minWidth: compact ? 120 : 140
      }}
    >
      {/* Header del día */}
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <Typography 
          variant={compact ? "subtitle2" : "h6"} 
          fontWeight="bold"
          sx={{ minWidth: compact ? 50 : 60, textAlign: 'center' }}
        >
          {day.name}
        </Typography>
        
        <Tooltip title={allSlotsAvailable ? "Desactivar todo el día" : "Activar todo el día"}>
          <Button
            size="small"
            variant={allSlotsAvailable ? "contained" : "outlined"}
            color={allSlotsAvailable ? "success" : "inherit"}
            onClick={handleDayToggle}
            sx={{
              minWidth: 'auto',
              width: 24,
              height: 24,
              p: 0,
              fontSize: '0.75rem',
              borderRadius: '50%'
            }}
          >
            ✓
          </Button>
        </Tooltip>
      </Box>

      {/* Slots de tiempo */}
      <Box display="flex" flexDirection="column" gap={1} width="100%">
        {defaultTimeSlots.map((timeSlot) => (
          <TimeSlotCell
            key={timeSlot}
            timeSlot={timeSlot}
            // ✅ CORREGIDO: Validación robusta
            available={safeAvailability[timeSlot]?.available || false}
            onToggle={(available) => onTimeSlotToggle(day.id, timeSlot, available)}
            compact={compact}
          />
        ))}
      </Box>
    </Box>
  );
};