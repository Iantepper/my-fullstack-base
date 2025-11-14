import React from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  Tooltip
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  PlaylistAddCheck,
} from '@mui/icons-material';


interface BulkActionsProps {
  onToggleAll: (available: boolean) => void;
  onToggleWeekdays: (available: boolean) => void;
  onToggleWeekend: (available: boolean) => void;
  onToggleTimeSlotAllDays: (timeSlot: string, available: boolean) => void;
  disabled?: boolean;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  onToggleAll,
  onToggleWeekdays,
  onToggleWeekend,
  onToggleTimeSlotAllDays,
  disabled = false
}) => {

  return (
    <Box sx={{ 
  p: 3, 
  bgcolor: '#1A1A2E', // ✅ FONDO OSCURO
  backgroundImage: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  borderRadius: 2, 
  border: '1px solid rgba(139, 95, 191, 0.1)', // ✅ BORDE SUTIL
}}>
  <Typography variant="h6" gutterBottom fontWeight="bold" color="text.primary">
    Acciones Rápidas
  </Typography>
      
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Acciones por período */}
        <Box display="flex" gap={1} flexWrap="wrap">
          <Tooltip title="Activar toda la semana">
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => onToggleAll(true)}
              disabled={disabled}
              size="small"
            >
              Activar Todo
            </Button>
          </Tooltip>
          
          <Tooltip title="Desactivar toda la semana">
            <Button
              variant="outlined"
              color="error"
              startIcon={<Cancel />}
              onClick={() => onToggleAll(false)}
              disabled={disabled}
              size="small"
            >
              Desactivar Todo
            </Button>
          </Tooltip>
          
          <Tooltip title="Activar solo días de semana (Lunes a Viernes)">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PlaylistAddCheck />}
              onClick={() => onToggleWeekdays(true)}
              disabled={disabled}
              size="small"
            >
              Activar Semana
            </Button>
          </Tooltip>
          
          <Tooltip title="Activar solo fin de semana">
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PlaylistAddCheck />}
              onClick={() => onToggleWeekend(true)}
              disabled={disabled}
              size="small"
            >
              Activar Fin de Semana
            </Button>
          </Tooltip>
        </Box>

        <Divider />

        {/* Acciones por horario específico */}
        <Box>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Horarios Populares:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {['9:00', '14:00', '18:00', '20:00'].map((timeSlot) => ( // ← Solo la hora
  <Tooltip key={timeSlot} title={`Activar ${timeSlot} en toda la semana`}>
    <Button
      variant="outlined"
      size="small"
      onClick={() => onToggleTimeSlotAllDays(`${timeSlot}:00-${parseInt(timeSlot)+1}:00`, true)}
      disabled={disabled}
      sx={{ fontSize: '0.75rem' }}
    >
      {timeSlot}
    </Button>
  </Tooltip>
))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};